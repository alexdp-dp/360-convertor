const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const PUBLIC = path.join(__dirname, 'public');

app.disable('x-powered-by');
app.use(express.static(PUBLIC, { extensions: ['html'] }));

const pages = {
  '/': 'index.html',
  '/unitati-de-masura': 'unitati-de-masura.html',
  '/randomizare': 'randomizare.html',
  '/zaruri': 'zaruri.html',
  '/convertor-valutar': 'convertor-valutar.html'
};

Object.entries(pages).forEach(([route, file]) => {
  app.get(route, (_req, res) => res.sendFile(path.join(PUBLIC, file)));
});

let rateCache = null;
let rateCacheAt = 0;
const FALLBACK = {
  date: 'fallback', source: 'Curs demonstrativ — actualizarea BNR nu este disponibilă',
  rates: { RON: 1, EUR: 5.05, USD: 4.66, GBP: 5.89, CHF: 5.28, HUF: 0.0127, BGN: 2.58, PLN: 1.18, CZK: 0.202 }
};

function parseBnr(xml) {
  const date = xml.match(/Cube date="([^"]+)"/)?.[1] || '';
  const rates = { RON: 1 };
  const rx = /<Rate currency="([A-Z]+)"(?: multiplier="(\d+)")?>([\d.]+)<\/Rate>/g;
  for (const match of xml.matchAll(rx)) {
    rates[match[1]] = Number(match[3]) / Number(match[2] || 1);
  }
  if (!rates.EUR) throw new Error('Răspuns BNR invalid');
  return { date, source: 'Banca Națională a României', rates };
}

app.get('/api/rates', async (_req, res) => {
  try {
    if (rateCache && Date.now() - rateCacheAt < 4 * 60 * 60 * 1000) return res.json(rateCache);
    const response = await fetch('https://www.bnr.ro/nbrfxrates.xml', { signal: AbortSignal.timeout(7000) });
    if (!response.ok) throw new Error('BNR indisponibil');
    rateCache = parseBnr(await response.text());
    rateCacheAt = Date.now();
    res.json(rateCache);
  } catch (_error) {
    res.json(rateCache || FALLBACK);
  }
});

app.use((_req, res) => res.status(404).sendFile(path.join(PUBLIC, '404.html')));

if (require.main === module) app.listen(PORT, () => console.log(`DOSAR rulează pe portul ${PORT}`));
module.exports = app;
