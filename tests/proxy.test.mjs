import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { once } from 'node:events';
import { fileURLToPath } from 'node:url';
import { setTimeout as delay } from 'node:timers/promises';

const root = fileURLToPath(new URL('../', import.meta.url));
const fixture = fileURLToPath(new URL('./fixtures/mock-upstreams.mjs', import.meta.url));

for (const mode of ['production', 'development']) {
  test(`${mode} preserves translation proxy behavior`, { timeout: 30000 }, async (t) => {
    const listener = createServer();
    listener.listen(0, '127.0.0.1');
    await once(listener, 'listening');
    const port = listener.address().port;
    await new Promise((resolve) => listener.close(resolve));
    const args = mode === 'production'
      ? ['.output/server/index.mjs']
      : ['node_modules/nitro/dist/cli/index.mjs', 'dev', '--port', String(port), '--host', '127.0.0.1'];
    const child = spawn(process.execPath, ['--import', fixture, ...args], {
      cwd: root,
      env: { ...process.env, PORT: String(port), HOST: '127.0.0.1' },
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let logs = '';
    child.stdout.on('data', (chunk) => { logs += chunk; });
    child.stderr.on('data', (chunk) => { logs += chunk; });
    t.after(async () => {
      if (child.exitCode !== null) return;
      const stopped = once(child, 'exit');
      child.kill('SIGTERM');
      const force = setTimeout(() => child.kill('SIGKILL'), 3000);
      await stopped;
      clearTimeout(force);
    });
    const base = `http://127.0.0.1:${port}`;
    let ready = false;
    for (let attempt = 0; attempt < 100; attempt++) {
      if (child.exitCode !== null) assert.fail(`Server exited: ${logs}`);
      try {
        await fetch(`${base}/jsonrpc`, { signal: AbortSignal.timeout(500) });
        ready = true;
        break;
      } catch {
        await delay(100);
      }
    }
    assert.ok(ready, `Server did not start: ${logs}`);

    const body = JSON.stringify({ method: 'LMT_handle_jobs', params: { text: 'hello' } });
    const response = await fetch(`${base}/jsonrpc?client=web`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-test-token': 'proxy-test' },
      body,
    });
    assert.equal(response.status, 207);
    assert.equal(response.headers.get('x-upstream'), 'fixture');
    assert.deepEqual(await response.json(), {
      url: 'https://www2.deepl.com/jsonrpc?client=web',
      method: 'POST', token: 'proxy-test', body,
    });

    const google = await fetch(`${base}/google/translate_a/single?sl=en&tl=zh&q=hello`);
    assert.equal(google.status, 207);
    assert.equal((await google.json()).url,
      'https://translate.googleapis.com/translate_a/single?sl=en&tl=zh&q=hello');
    const fallback = await fetch(`${base}/other/nested/path?query=value`);
    assert.equal((await fallback.json()).url,
      'https://www2.deepl.com/other/nested/path?query=value');
  });
}
