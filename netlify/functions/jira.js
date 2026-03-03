// netlify/functions/jira.js
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
  const { path, base, ...rest } = params;

  if (!path || !base) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'path and base required' }) };
  }

  const authHeader = event.headers['authorization'];
  if (!authHeader) {
    return { statusCode: 401, headers, body: JSON.stringify({ error: 'Authorization header required' }) };
  }

  const url = new URL(`${base}/${path}`);
  Object.entries(rest).forEach(([k, v]) => {
    if (v !== undefined && v !== null) url.searchParams.set(k, v);
  });

  console.log('Jira request URL:', url.toString());

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    const responseText = await response.text();
    console.log('Jira status:', response.status);
    if (!response.ok) console.log('Jira error:', responseText.substring(0, 500));

    return { statusCode: response.status, headers, body: responseText };
  } catch (err) {
    console.error('Proxy error:', err.message);
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
