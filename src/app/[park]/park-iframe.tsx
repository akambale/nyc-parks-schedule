'use client';

import type { ParkConfig } from './parks';

function buildParkUrl(config: ParkConfig): string {
  const now = new Date();
  const dateTime =
    now.toLocaleDateString('en-CA', {
      timeZone: 'America/New_York',
    }) + 'T22:00:00-04:00';

  return `https://www.nycgovparks.org/permits/field-and-court/map?dateTime=${encodeURIComponent(dateTime)}&sport=ALL&fieldID=${config.fieldID}&parkID=${config.parkID}&parkName=${config.parkName}&lat=${config.lat}&lng=${config.lng}&zoom=${config.zoom}`;
}

export default function ParkIframe({
  park,
  config,
}: {
  park: string;
  config: ParkConfig;
}) {
  const iframeUrl = buildParkUrl(config);

  return (
    <div className='h-full'>
      <div className='w-full h-full overflow-auto'>
        <iframe
          src={iframeUrl}
          className='border-0'
          style={{ minWidth: '800px', width: '100%', height: '100%' }}
          title={`${park} field availability`}
        />
      </div>
    </div>
  );
}
