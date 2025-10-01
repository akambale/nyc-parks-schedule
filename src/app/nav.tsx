'use client';

import { useState, useEffect } from 'react';

interface NavItem {
  id: string;
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  {
    id: 'home',
    label: 'Houston & 6th',
    href: '/?location=M120A-BASEBALL-1&name=Houston%20%26%206th',
  },
  // { id: 'parks', label: 'Parks', href: '/parks' },
  // { id: 'schedule', label: 'Schedule', href: '/schedule' },
  // { id: 'events', label: 'Events', href: '/events' },
  // { id: 'about', label: 'About', href: '/about' },
];

export default function Nav() {
  const [activeItem] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 700);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const copyToClipboard = async (href: string) => {
    const fullUrl = `${window.location.origin}${href}`;
    try {
      await navigator.clipboard.writeText(fullUrl);
      // You could add a toast notification here
      alert(`URL copied to clipboard: ${fullUrl}`);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className='fixed top-4 right-4 z-50 p-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg'
          aria-label='Toggle mobile menu'
        >
          <svg
            className='w-6 h-6 text-gray-700 dark:text-gray-300'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
          >
            {isMobileMenuOpen ? (
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
              />
            ) : (
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M4 6h16M4 12h16M4 18h16'
              />
            )}
          </svg>
        </button>
      )}

      {/* Mobile Overlay */}
      {isMobile && isMobileMenuOpen && (
        <div
          className='fixed inset-0 bg-black bg-opacity-50 z-40'
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Navigation */}
      <nav
        className={`w-64 bg-gray-100 dark:bg-gray-800 h-screen p-6 border-r border-gray-200 dark:border-gray-700 z-50 transform transition-transform duration-300 ease-in-out ${
          isMobile
            ? `fixed ${
                isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
              }`
            : 'static translate-x-0'
        }`}
      >
        <div className='mb-8'>
          <h2 className='text-xl font-bold text-gray-900 dark:text-white'>
            NYC Parks Availability
          </h2>
          <p className='text-sm text-gray-600 dark:text-gray-400'>
            Not affiliated with the parks department
          </p>
        </div>

        <ul className='space-y-2'>
          {navItems.map(item => (
            <li key={item.id} className='flex items-center gap-2'>
              <a
                href={item.href}
                className={`flex-1 text-left px-4 py-3 rounded-l-lg transition-colors duration-200 ${
                  activeItem === item.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {item.label}
              </a>
              <button
                onClick={() => copyToClipboard(item.href)}
                className={`px-4 py-3 rounded-r-lg transition-colors duration-200 ${
                  activeItem === item.id
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
                title='Copy URL to clipboard'
              >
                <svg
                  className='w-4 h-4'
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
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
