import { parks } from './parks';
import ParkIframe from './park-iframe';

export function generateStaticParams() {
  return Object.keys(parks).map(park => ({ park }));
}

export default async function ParkPage({
  params,
}: {
  params: Promise<{ park: string }>;
}) {
  const { park } = await params;
  const config = parks[park.toLowerCase()];

  if (!config) {
    return (
      <div className='p-8'>
        <p className='text-gray-600 dark:text-gray-400'>Park not found</p>
      </div>
    );
  }

  return <ParkIframe park={park} config={config} />;
}
