// netlify/functions/jira.js — Jira API proxy (GET + POST destekli)
exports.handler = async function(event) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const params = event.queryStringParameters || {};
  const { path, base } = params;

  if (!path || !base) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'path and base required' }) };
  }

  const authHeader = event.headers['authorization'];
  if (!authHeader) {
    return { statusCode: 401, headers, body: JSON.stringify({ error: 'Authorization header required' }) };
  }

  const url = new URL(`${base}/${path}`);
  console.log('Jira proxy:', event.httpMethod, url.toString());

  // GET ise query params'ları ilet (path ve base hariç)
  if (event.httpMethod === 'GET') {
    Object.entries(params).forEach(([k, v]) => {
      if (k !== 'path' && k !== 'base' && k !== '_method') url.searchParams.set(k, v);
    });
  }

  try {
    const isPost = event.httpMethod === 'POST' || params._method === 'POST';
    const response = await fetch(url.toString(), {
      method: isPost ? 'POST' : 'GET',
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: isPost && event.body ? event.body : undefined,
    });

    const responseText = await response.text();
    console.log('Jira status:', response.status);
    if (!response.ok) console.log('Jira error:', responseText.substring(0, 300));

    return { statusCode: response.status, headers, body: responseText };
  } catch (err) {
    console.error('Proxy error:', err.message);
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
