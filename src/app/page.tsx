'use client';
import { useEffect, useState } from 'react';

// Loading Component
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
  const [schedule, setSchedule] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const name = urlParams.get('name');
    const location = urlParams.get('location');

    setName(name || '');

    // Make request if location parameter exists
    if (location) {
      setIsLoading(true);
      const apiUrl = `https://picklebot-761922005699.europe-west1.run.app?location=${encodeURIComponent(
        location,
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
        {name ? 'Times the park is booked' : 'Pick a park to see availability'}
      </p>
      <div className='overflow-x-auto'>
        {name && !isLoading ? (
          <table className='min-w-full border border-gray-300 dark:border-gray-600 rounded-lg'>
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
              {Object.entries(schedule).map(([date, times]) => (
                <tr
                  key={date}
                  className='hover:bg-gray-50 dark:hover:bg-gray-700'
                >
                  <td className='px-4 py-2 text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600'>
                    {date}
                  </td>
                  <td className='px-4 py-2 text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600'>
                    {times}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
      </div>

      {/* Loading Component */}
      {isLoading && <LoadingSpinner />}
    </div>
  );
}
