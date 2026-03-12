import fs from 'fs';
import path from 'path';

interface TimeBlock {
  startTime: string;
  endTime: string;
}

export type Schedule = Record<string, TimeBlock[]>;

const STORE_PATH = path.join(__dirname, '..', 'data', 'cache.json');

let cache: Record<string, Schedule> = {};

export function load() {
  try {
    if (fs.existsSync(STORE_PATH)) {
      cache = JSON.parse(fs.readFileSync(STORE_PATH, 'utf8'));
      console.log(`Loaded cache with ${Object.keys(cache).length} locations`);
    }
  } catch (err) {
    console.error('Failed to load cache:', (err as Error).message);
    cache = {};
  }
}

function save() {
  try {
    fs.mkdirSync(path.dirname(STORE_PATH), { recursive: true });
    fs.writeFileSync(STORE_PATH, JSON.stringify(cache, null, 2));
  } catch (err) {
    console.error('Failed to save cache:', (err as Error).message);
  }
}

export function get(location: string): Schedule | null {
  return cache[location] || null;
}

export function set(location: string, data: Schedule) {
  cache[location] = data;
  save();
}
