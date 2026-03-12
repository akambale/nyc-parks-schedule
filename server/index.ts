import express from 'express';
import path from 'path';
import { refreshAllLocations, getAvailability } from './scraper';
import * as store from './store';

const app = express();
const PORT = process.env.PORT || 8080;

// Serve the Next.js static export
app.use(express.static(path.join(__dirname, '..', 'out')));

// API endpoint
app.get('/api/availability', async (req, res) => {
  const location = req.query.location as string;
  if (!location) {
    res.status(400).json({ error: 'location query param required' });
    return;
  }

  // Try the cache first
  const cached = store.get(location);
  if (cached) {
    res.json(cached);
    return;
  }

  // Cache miss — fetch live
  try {
    const data = await getAvailability(location);
    store.set(location, data);
    res.json(data);
  } catch (err) {
    console.error(`Error fetching ${location}:`, (err as Error).message);
    res.status(500).json({ error: 'Failed to fetch availability' });
  }
});

// SPA fallback — serve index.html for any non-API, non-file route
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'out', 'index.html'));
});

// Daily refresh at 6am ET
function scheduleDailyRefresh() {
  const now = new Date();
  const next6am = new Date();
  next6am.setHours(6, 0, 0, 0);
  if (now >= next6am) {
    next6am.setDate(next6am.getDate() + 1);
  }

  const msUntil = next6am.getTime() - now.getTime();
  console.log(`Next refresh in ${Math.round(msUntil / 1000 / 60)} minutes`);

  setTimeout(() => {
    refreshAllLocations();
    // Then repeat every 24h
    setInterval(refreshAllLocations, 24 * 60 * 60 * 1000);
  }, msUntil);
}

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);

  // Load any existing cached data
  store.load();

  // Fetch fresh data on startup
  await refreshAllLocations();

  // Schedule daily refresh
  scheduleDailyRefresh();
});
