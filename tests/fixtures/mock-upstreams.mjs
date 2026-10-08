const upstreams = new Set(['www2.deepl.com', 'translate.googleapis.com']);
const originalFetch = globalThis.fetch;
globalThis.fetch = async (input, init) => {
  const request = new Request(input, init);
  if (!upstreams.has(new URL(request.url).hostname)) {
    return originalFetch(input, init);
  }
  return new Response(JSON.stringify({
    url: request.url,
    method: request.method,
    token: request.headers.get('x-test-token'),
    body: await request.text(),
  }), {
    status: 207,
    headers: { 'content-type': 'application/json', 'x-upstream': 'fixture' },
  });
};
