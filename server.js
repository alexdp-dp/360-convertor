const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const PUBLIC = path.join(__dirname, 'public');

app.disable('x-powered-by');
const pages = {
  '/': 'index.html',
  '/unitati-de-masura': 'unitati-de-masura.html',
  '/randomizare': 'randomizare.html',
  '/zaruri': 'zaruri.html',
  '/convertor-valutar': 'convertor-valutar.html',
  '/calculator': 'calculatoare.html',
  '/data-si-timp': 'data-si-timp.html',
  '/liste': 'liste.html',
  '/text': 'text.html',
  '/culori': 'culori.html',
  '/generator': 'generatoare.html',
  '/dimensiuni': 'dimensiuni.html'
};

Object.entries(pages).forEach(([route, file]) => {
  app.get(route, (_req, res) => res.sendFile(path.join(PUBLIC, file)));
});
app.get('/calculatoare', (_req,res)=>res.redirect(301,'/calculator'));
app.get('/generatoare', (_req,res)=>res.redirect(301,'/generator'));
app.use(express.static(PUBLIC, { extensions: ['html'] }));

let rateCache = null;
let rateCacheAt = 0;
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
    const response = await fetch('https://curs.bnr.ro/nbrfxrates.xml', { signal: AbortSignal.timeout(7000) });
    if (!response.ok) throw new Error('BNR indisponibil');
    rateCache = { ...parseBnr(await response.text()), fetchedAt: new Date().toISOString() };
    rateCacheAt = Date.now();
    res.json(rateCache);
  } catch (_error) {
    if (rateCache) return res.json(rateCache);
    res.status(503).json({ error: 'Cursul BNR nu este disponibil momentan.' });
  }
});

app.use((_req, res) => res.status(404).sendFile(path.join(PUBLIC, '404.html')));

if (require.main === module) app.listen(PORT, () => console.log(`DOSAR rulează pe portul ${PORT}`));
module.exports = app;
