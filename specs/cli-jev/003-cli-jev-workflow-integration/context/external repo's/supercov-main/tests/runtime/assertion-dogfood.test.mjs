import assert from 'node:assert/strict';
import { mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { inferTestProvenance } from '../../runtime/javascript/provenance.mjs';

test('async connection ownership, shared HTTP requests and teardown keep exact attempts', t => {
  const directory = mkdtempSync(resolve(tmpdir(), 'supercov-dogfood-runtime-'));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const module = name => JSON.stringify(pathToFileURL(resolve(import.meta.dirname, '../../runtime/javascript', name)).href);
  const source = `
    import test, { before, after } from ${module('nodeTest.mjs')};
    import assert from ${module('nodeAssertStrict.mjs')};
    import * as runtime from ${module('runtime.mjs')};
    import { createServer } from 'node:http';
    import { EventEmitter, once } from 'node:events';
    const emitters = [];
    let server, port;
    before(async () => {
      runtime.coverageHit('shared-setup');
      server = createServer((req, res) => {
        runtime.coverageHit('request-' + req.url.slice(1));
        res.end(req.url);
      });
      server.listen(0, '127.0.0.1');
      await once(server, 'listening');
      port = server.address().port;
    });
    after(() => new Promise(resolve => server.close(resolve)));
    for (const id of ['one', 'two']) test(id, { concurrency: true }, async t => {
      t.after(async () => {
        await Promise.resolve();
        runtime.coverageHit('teardown-' + id);
        assert.equal(id.length, 3);
      });
      const peer = new EventEmitter();
      // This is the same boundary the Rust connection-listener rewrite emits.
      const connection = runtime.withRequestPhase(socket => {
        const listener = () => runtime.coverageHit('message-' + id);
        socket.on('message', listener);
        assert.equal(socket.listeners('message')[0], listener);
        socket.on('unused', listener);
        socket.off('unused', listener);
        assert.equal(socket.listenerCount('unused'), 0);
      }, 'connection');
      // An untagged upgrade must preserve a dedicated server's registration owner.
      runtime.withCoverageCarrier({ version: 1 }, () => connection(peer, { headers: { upgrade: 'websocket' } }));
      emitters.push(peer);
      const body = await (await fetch('http://127.0.0.1:' + port + '/' + id)).text();
      assert.equal(body, '/' + id);
      runtime.withCoverageCarrier({ version: 1 }, () => peer.emit('message'));
    });
    test.skip('skipped declaration', () => assert.fail('must not run'));
    test('todo declaration', { todo: true }, () => assert.equal(1, 1));
  `;
  const env = { ...process.env, SUPERCOV_RUN_ID: 'dogfood', SUPERCOV_EVIDENCE_DIR: directory,
    SUPERCOV_SERVER_EVIDENCE_DIR: resolve(directory, 'server') };
  delete env.NODE_TEST_CONTEXT;
  const result = spawnSync(process.execPath, ['--input-type=module', '--eval', source], { env, encoding: 'utf8', timeout: 15000 });
  assert.equal(result.status, 0, result.stdout + result.stderr);
  const records = readdirSync(directory).filter(n => n.startsWith('node_test-') && n.endsWith('.mcdc.jsonl')).flatMap(n =>
    readFileSync(resolve(directory, n), 'utf8').trimEnd().split('\n').map(line => JSON.parse(line)));
  for (const id of ['one', 'two']) {
    const row = records.find(r => r.test === id);
    assert.equal(row.status, 'passed');
    assert.equal(row.phases.length, 4, 'includes t.after assertion');
    const hits = row.server.filter(r => r.type === 'hit').map(r => r.id).sort();
    assert.deepEqual(hits, ['message-' + id, 'request-' + id, 'teardown-' + id]);
    assert.ok(row.phases.every(p => p.id.startsWith(row.scope.attemptId + ':')));
  }
  const setup = records.find(r => r.test.startsWith('[before]'));
  assert.equal(setup.role, 'setup');
  assert.deepEqual(setup.server.filter(r => r.type === 'hit').map(r => r.id), ['shared-setup']);
  assert.equal(records.find(r => r.test === 'skipped declaration').status, 'skipped');
  assert.equal(records.find(r => r.test === 'todo declaration').status, 'skipped');
});

test('camel-case test paths have explicit provenance while ambiguous paths keep runner defaults', () => {
  assert.deepEqual(inferTestProvenance({ runner: 'node:test', file: 'tests/gatewayE2e.test.ts' }),
    { runner: 'node:test', kind: 'e2e', source: 'path' });
  assert.equal(inferTestProvenance({ runner: 'node:test', file: 'tests/sseIntegration.test.ts' }).kind, 'integration');
  assert.equal(inferTestProvenance({ runner: 'node:test', file: 'tests/cli.test.ts' }).source, 'runner-default');
  assert.equal(inferTestProvenance({ runner: 'node:test', file: 'tests/gatewayE2e.test.ts', explicitKind: 'component' }).source, 'explicit');
});

// The generated collector and application runtime have different instance IDs.
// A process-wide "already patched" flag must not suppress the latter's context.
test('isolated runtime copies retain their own WebSocket connection context', t => {
  const directory = mkdtempSync(resolve(tmpdir(), 'supercov-dogfood-isolated-'));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const original = readFileSync(resolve(import.meta.dirname, '../../runtime/javascript/runtime.mjs'), 'utf8');
  for (const id of ['collector', 'app']) writeFileSync(resolve(directory, id + '.mjs'),
    original.replace('var runtimeInstanceToken = "__SUPERCOV_RUNTIME_INSTANCE__";', 'var runtimeInstanceToken = "' + id + '";'));
  const source = `
    import assert from 'node:assert/strict';
    import { EventEmitter } from 'node:events';
    await import(${JSON.stringify(pathToFileURL(resolve(directory, 'collector.mjs')).href)});
    const app = await import(${JSON.stringify(pathToFileURL(resolve(directory, 'app.mjs')).href)});
    const scope = { runId: 'run', testId: 'test', attemptId: 'attempt' };
    const peer = new EventEmitter();
    app.withCoverageCarrier({ version: 1, scope }, () => {
      app.withRequestPhase(socket => socket.on('message', () => {
        assert.deepEqual(app.coverageCarrier().scope, scope);
      }), 'connection')(peer);
    });
    assert.equal(app.coverageCarrier().scope, undefined);
    peer.emit('message');
    peer.emit('close');
  `;
  const result = spawnSync(process.execPath, ['--input-type=module', '--eval', source], { encoding: 'utf8', timeout: 10000 });
  assert.equal(result.status, 0, result.stdout + result.stderr);
});
