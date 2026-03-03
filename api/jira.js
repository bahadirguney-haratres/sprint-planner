// api/jira.js — Vercel Serverless Function
// Tarayıcıdan gelen istekleri Jira API'ye proxy'ler (CORS sorunu olmaz)

export default async function handler(req, res) {
  // CORS headers — sadece kendi domainden erişime izin ver
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { path } = req.query;
  if (!path) return res.status(400).json({ error: 'path parameter required' });

  // Auth header'ı ilet
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'Authorization header required' });

  // Jira base URL — Authorization header'dan domain çıkar ya da query'den al
  const jiraBase = req.query.base;
  if (!jiraBase) return res.status(400).json({ error: 'base parameter required' });

  const jiraUrl = `${jiraBase}/${path}${req.url.includes('?') ? '&' : '?'}`;
  
  // Query params'ı temizleyip ilet
  const url = new URL(`${jiraBase}/${path}`);
  const params = new URLSearchParams(req.url.split('?')[1] || '');
  params.delete('path');
  params.delete('base');
  params.forEach((v, k) => url.searchParams.set(k, v));

  try {
    const jiraRes = await fetch(url.toString(), {
      method: req.method,
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined,
    });

    const data = await jiraRes.json();
    return res.status(jiraRes.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
