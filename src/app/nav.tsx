'use client';

import { useState, useEffect } from 'react';

interface NavItem {
  id: string;
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  {
    id: 'Houston',
    label: 'Houston & 6th',
    href: '/houston',
  },
  {
    id: 'McCarren',
    label: 'McCarren',
    href: '/mccarren',
  },
  {
    id: 'Ericsson',
    label: 'Ericsson',
    href: '/ericsson',
  },
];

export default function Nav() {
  const [activeItem, setActiveItem] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const path = window.location.pathname.replace(/^\//, '').replace(/\/$/, '');
    const match = navItems.find(item => item.id.toLowerCase() === path);
    if (match) {
      setActiveItem(match.id);
    }
  }, []);

  const copyToClipboard = async (href: string) => {
    const fullUrl = `${window.location.origin}${href}`;
    await navigator.clipboard.writeText(fullUrl);
    setToastMessage('URL copied to clipboard!');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <>
      <nav className='sticky top-0 z-50 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-6'>
        <div className='flex flex-col gap-3'>
          <div>
            <h1 className='text-lg font-bold text-gray-900 dark:text-white whitespace-nowrap'>
              NYC Parks Field Availability
            </h1>
            <p className='text-sm text-gray-600 dark:text-gray-400'>
              Not affiliated with the parks department. Have another park you
              want to add? DM Amogh on Pickleball slack
            </p>
          </div>
          <div className='flex items-center gap-4 flex-wrap'>
            {navItems.map(item => (
              <div key={item.id} className='flex items-stretch gap-1'>
                <a
                  href={item.href}
                  className={`px-4 py-3 text-base rounded-l-lg transition-colors duration-200 ${
                    activeItem === item.id
                      ? 'bg-blue-500 hover:bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {item.label}
                </a>
                <button
                  onClick={() => copyToClipboard(item.href)}
                  className={`px-3 flex items-center border-l border-black/10 rounded-r-lg transition-colors duration-200 ${
                    activeItem === item.id
                      ? 'bg-blue-500 hover:bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                  title='Copy URL to clipboard'
                >
                  <svg
                    className='w-5 h-5'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z'
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </nav>

      {showToast && (
        <div className='fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg shadow-lg transition-opacity duration-300'>
          {toastMessage}
        </div>
      )}
    </>
  );
}
