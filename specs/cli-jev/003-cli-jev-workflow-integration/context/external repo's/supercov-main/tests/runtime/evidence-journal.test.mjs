import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

const reporter = new URL('../../runtime/javascript/vitestReporter.mjs', import.meta.url).href;
const atomic = new URL('../../runtime/javascript/atomic.mjs', import.meta.url).href;

function records(directory) {
  return fs.readdirSync(directory).flatMap((file) => {
    assert.match(file, /\.mcdc\.jsonl$/);
    const text = fs.readFileSync(path.join(directory, file), 'utf8');
    assert.ok(text.endsWith('\n'), `${file} ends with a complete line`);
    return text.trimEnd().split('\n').map((line) => JSON.parse(line));
  });
}

for (const durable of [false, true]) {
  test(`test outcomes append to one journal per writer (durable=${durable})`, () => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'supercov-evidence-journal-'));
    try {
      const result = spawnSync(process.execPath, ['--input-type=module', '-e', `
        import fs from 'node:fs';
        import { syncBuiltinESMExports } from 'node:module';
        let syncs = 0;
        const original = fs.fsyncSync;
        fs.fsyncSync = (...args) => { syncs++; return original(...args); };
        syncBuiltinESMExports();
        const Reporter = (await import(${JSON.stringify(reporter)})).default;
        const reporter = new Reporter();
        for (const [id, state, retry, fails] of [['a', 'failed', 0, false], ['a', 'passed', 1, false], ['b', 'skipped', 0, false], ['c', 'passed', 0, true]]) {
          reporter.onTestCaseResult({ id, fullName: id, name: id, module: { moduleId: process.cwd() + '/a.test.js' },
            project: { name: 'fixture' }, options: { fails }, result: () => ({ state }), diagnostic: () => ({ retryCount: retry }) });
        }
        console.log(JSON.stringify({ syncs }));
      `], { encoding: 'utf8', env: { ...process.env, SUPERCOV_EVIDENCE_DIR: directory, SUPERCOV_DURABLE_EVIDENCE_EACH_TEST: durable ? '1' : '0' } });
      assert.equal(result.status, 0, result.stderr);
      assert.equal(fs.readdirSync(directory).length, 1, 'one journal, not a file per test');
      const rows = records(directory);
      assert.deepEqual(rows.filter((r) => r.testId === 'vitest:a').map((r) => [r.retry, r.status]), [[0, 'failed'], [1, 'passed']]);
      assert.equal(rows.find((r) => r.testId === 'vitest:b').status, 'skipped');
      // `it.fails` records the actual outcome with the expected one beside it.
      assert.equal(rows.find((r) => r.testId === 'vitest:c').expectedStatus, 'failed');
      const { syncs } = JSON.parse(result.stdout);
      assert.ok(durable ? syncs >= 4 : syncs === 0, `fsync calls: ${syncs}`);
    } finally {
      fs.rmSync(directory, { recursive: true, force: true });
    }
  });
}

test('a journal another writer appended to is left to it', () => {
  // VMs restored from one snapshot share every token the process drew, and
  // can share the evidence directory. A writer that finds its journal grown by
  // someone else starts a new one rather than interleaving with it.
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'supercov-evidence-foreign-'));
  try {
    const result = spawnSync(process.execPath, ['--input-type=module', '-e', `
      import fs from 'node:fs';
      import { appendEvidenceRecord } from ${JSON.stringify(atomic)};
      appendEvidenceRecord(${JSON.stringify(directory)}, 'vitest-worker', { testId: 'one' });
      const [journal] = fs.readdirSync(${JSON.stringify(directory)});
      fs.appendFileSync(${JSON.stringify(directory)} + '/' + journal, JSON.stringify({ testId: 'clone' }) + '\\n');
      appendEvidenceRecord(${JSON.stringify(directory)}, 'vitest-worker', { testId: 'two' });
    `], { encoding: 'utf8', env: { ...process.env, SUPERCOV_EVIDENCE_DIR: directory } });
    assert.equal(result.status, 0, result.stderr);
    const journals = fs.readdirSync(directory);
    assert.equal(journals.length, 2);
    assert.deepEqual(records(directory).map((r) => r.testId).sort(), ['clone', 'one', 'two']);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

test('completed journal records survive a killed writer', { skip: process.platform === 'win32' }, () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'supercov-evidence-killed-'));
  try {
    const result = spawnSync(process.execPath, ['--input-type=module', '-e', `
      import { appendEvidenceRecord } from ${JSON.stringify(atomic)};
      for (let i = 0; i < 100; i++) appendEvidenceRecord(${JSON.stringify(directory)}, 'vitest-worker', { testId: i });
      process.kill(process.pid, 'SIGKILL');
    `], { encoding: 'utf8' });
    assert.equal(result.signal, 'SIGKILL');
    assert.deepEqual(records(directory).map((r) => r.testId), Array.from({ length: 100 }, (_, i) => i));
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});
