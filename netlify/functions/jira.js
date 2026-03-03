// netlify/functions/jira.js
// Jira API proxy — CORS sorununu çözer, çağrılar sunucudan gider

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

  // Build Jira URL with remaining query params
  const url = new URL(`${base}/${path}`);
  Object.entries(rest).forEach(([k, v]) => url.searchParams.set(k, v));

  try {
    const response = await fetch(url.toString(), {
      method: event.httpMethod === 'GET' ? 'GET' : event.httpMethod,
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: event.body || undefined,
    });

    const data = await response.text();
    return {
      statusCode: response.status,
      headers,
      body: data,
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
