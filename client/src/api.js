const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:9000').replace(/\/$/, '');

// HTTP errors and unreachable servers need different feedback.
export async function postForm(endpoint, values) {
  let response;
  try {
    response = await fetch(`${API_URL}/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
      signal: AbortSignal.timeout(15000),
    });
  } catch {
    throw new Error('Could not connect to the server. Please try again shortly.');
  }
  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error('The server returned an unexpected response. Please try again.');
  }
  if (!response.ok) throw new Error(data.message || 'Something went wrong. Please try again.');
  return data;
}
