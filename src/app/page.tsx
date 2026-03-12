'use client';
import { useEffect, useState } from 'react';

interface TimeBlock {
  startTime: string;
  endTime: string;
}

type Schedule = Record<string, TimeBlock[]>;

function formatDate(dateString: string): string {
  const date = new Date(dateString + 'T00:00:00');
  const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
  const monthName = date.toLocaleDateString('en-US', { month: 'short' });
  return `${dayName} ${monthName} ${date.getDate()}`;
}

function formatBlocks(blocks: TimeBlock[]): string {
  if (blocks.length === 0) {
    return 'Field is available all day';
  }
  return blocks
    .map(b => `${b.startTime.replace(/^0/, '')} - ${b.endTime.replace(/^0/, '')}`)
    .join('; ');
}

function LoadingSpinner() {
  return (
    <div className='flex items-center justify-center p-4'>
      <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500'></div>
      <span className='ml-2 text-sm text-gray-600 dark:text-gray-400'>
        Loading...
      </span>
    </div>
  );
}

export default function Home() {
  const [name, setName] = useState('');
  const [schedule, setSchedule] = useState<Schedule>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const name = urlParams.get('name');
    const parkfield = urlParams.get('parkfield');

    setName(name || '');

    if (parkfield) {
      setIsLoading(true);
      const apiUrl = `/api/availability?location=${encodeURIComponent(
        parkfield,
      )}`;

      fetch(apiUrl)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          setSchedule(data);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, []);

  return (
    <div className='p-8'>
      <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-4'>
        {name}
      </h1>
      <p className='text-gray-600 dark:text-gray-400'>
        {name
          ? 'Times the field is reserved'
          : 'Select a park to see availability'}
      </p>
      <div className='overflow-x-auto'>
        {name && !isLoading ? (
          <table className='min-w-full border border-gray-300 dark:border-gray-600 rounded-lg mt-8'>
            <thead className='bg-gray-50 dark:bg-gray-800'>
              <tr>
                <th className='px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-600'>
                  Date
                </th>
                <th className='px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-600'>
                  Time
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(schedule).map(([date, blocks]) => (
                <tr
                  key={date}
                  className='hover:bg-gray-50 dark:hover:bg-gray-700'
                >
                  <td className='px-4 py-2 text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600'>
                    {formatDate(date)}
                  </td>
                  <td className='px-4 py-2 text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600'>
                    {formatBlocks(blocks)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
      </div>

      {isLoading && <LoadingSpinner />}
    </div>
  );
}
