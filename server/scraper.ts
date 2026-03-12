import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import * as store from './store';
import type { Schedule } from './store';

puppeteer.use(StealthPlugin());

const LOCATIONS = [
  'M120A-BASEBALL-1',
  'B058-ZN04-BASEBALL-3',
];

interface TimeSlot {
  timestamp: string;
}

interface TimeBlock {
  startTime: string;
  endTime: string;
}

interface ParksAPIResponse {
  availability?: Record<string, unknown>;
}

export async function getAvailability(location: string): Promise<Schedule> {
  const dateString = todayEST();
  const url = `https://www.nycgovparks.org/api/athletic-fields?location=${location}&date=${dateString}`;

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();

    await page.goto('https://www.nycgovparks.org/permits/field-and-court', {
      waitUntil: 'networkidle0',
      timeout: 30000,
    });

    const data: ParksAPIResponse = await page.evaluate(async (apiUrl: string) => {
      const res = await fetch(apiUrl);
      return res.json();
    }, url);

    return formatAvailability(data, dateString);
  } finally {
    await browser.close();
  }
}

function formatAvailability(data: ParksAPIResponse, dateString: string): Schedule {
  if (!data.availability) {
    return buildEmptyWeek(dateString);
  }

  const timeSlotsByDay: Record<string, TimeSlot[]> = {};
  for (const [timestamp] of Object.entries(data.availability)) {
    const day = convertUnixToEST(parseInt(timestamp));
    if (!timeSlotsByDay[day]) {
      timeSlotsByDay[day] = [];
    }
    timeSlotsByDay[day].push({ timestamp });
  }

  const schedule: Schedule = {};
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(dateString);
    currentDate.setDate(currentDate.getDate() + i);
    const dayDateString = currentDate.toISOString().split('T')[0];

    const slots = timeSlotsByDay[dayDateString] || [];
    const blocks = groupTimeSlotsIntoBlocks(slots);

    schedule[dayDateString] = blocks;
  }

  return schedule;
}

function buildEmptyWeek(dateString: string): Schedule {
  const schedule: Schedule = {};
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(dateString);
    currentDate.setDate(currentDate.getDate() + i);
    schedule[currentDate.toISOString().split('T')[0]] = [];
  }
  return schedule;
}

function todayEST(): string {
  const now = new Date();
  return now.toLocaleDateString('en-CA', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

function convertUnixToEST(unixTimestamp: number): string {
  const date = new Date(unixTimestamp * 1000);
  return date.toLocaleDateString('en-CA', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

function formatTimeFromTimestamp(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString('en-US', {
    timeZone: 'America/New_York',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

function groupTimeSlotsIntoBlocks(timeSlots: TimeSlot[]): TimeBlock[] {
  if (timeSlots.length === 0) return [];

  const sorted = [...timeSlots].sort(
    (a, b) => parseInt(a.timestamp) - parseInt(b.timestamp),
  );

  const blocks: TimeBlock[] = [];
  let block: TimeBlock | null = null;

  for (let i = 0; i < sorted.length; i++) {
    const ts = parseInt(sorted[i].timestamp);

    if (!block) {
      block = {
        startTime: formatTimeFromTimestamp(ts),
        endTime: formatTimeFromTimestamp(ts + 30 * 60),
      };
    } else {
      const expected = parseInt(sorted[i - 1].timestamp) + 30 * 60;
      if (ts === expected) {
        block.endTime = formatTimeFromTimestamp(ts + 30 * 60);
      } else {
        blocks.push(block);
        block = {
          startTime: formatTimeFromTimestamp(ts),
          endTime: formatTimeFromTimestamp(ts + 30 * 60),
        };
      }
    }
  }

  if (block) blocks.push(block);
  return blocks;
}

export async function refreshAllLocations() {
  console.log(`Refreshing all locations at ${new Date().toISOString()}`);
  for (const location of LOCATIONS) {
    try {
      const data = await getAvailability(location);
      store.set(location, data);
      console.log(`Refreshed ${location}`);
    } catch (err) {
      console.error(`Failed to refresh ${location}:`, (err as Error).message);
    }
  }
}
