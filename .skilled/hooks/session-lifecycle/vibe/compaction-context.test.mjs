// ───────────────────────────────────────────────────────────────────
// MODULE: Vibe Compaction Context Tests (node --test)
// ───────────────────────────────────────────────────────────────────
//
// The compaction fixture is a recorded forced compaction, so
// the detector matches the shape Vibe actually wrote. The state directory is a
// temp folder per case, and the goal slice is rendered from this packet, so no
// case depends on another or on the caller's shell.

import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import os from 'node:os';
import { dirname, join, resolve } from 'node:path';
import test, { after } from 'node:test';
import { fileURLToPath } from 'node:url';

import { buildCompactionPart, buildPostToolPart } from './compaction-context.mjs';

const HOOK_DIR = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(HOOK_DIR, '../../../..');
const BINDING = join(HOOK_DIR, 'compaction-post-tool.mjs');
const COMPACTION_FIXTURE = join(HOOK_DIR, 'fixtures', 'compaction-journal');
const NO_COMPACTION_FIXTURE = join(
  REPO_ROOT,
  '.skilled/hooks/shared/tests/session-readers/fixtures/vibe/scratch-cwd',
);
const PACKET = 'specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/018-vibe-compaction-context';

const SESSION_ID = '99e62469-699f-4aac-eb50-4c187ff1fdc5';
const COMPACTION_ID = 'd95bb2db-5e4c-5126-9a1d-002ba102d8c4';
const COMPACTION_SEQUENCE = 8;

// The compiled hook state keys its file by the working folder, so the cleanup
// resolves the path from the same checkout the detector writes under.
const originalCwd = process.cwd();
process.chdir(REPO_ROOT);

function tempStateDir(t) {
  const directory = mkdtempSync(join(os.tmpdir(), 'vibe-compaction-state-'));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  return directory;
}

function payloadFor(overrides = {}) {
  return {
    hook_event_name: 'pre_agent',
    session_id: SESSION_ID,
    parent_session_id: null,
    transcript_path: COMPACTION_FIXTURE,
    cwd: REPO_ROOT,
    agent_name: 'default',
    turn_id: 'turn-1',
    prompt: 'Continue.',
    ...overrides,
  };
}

function optionsFor(stateDir, overrides = {}) {
  return {
    env: { VIBE_SPEC_FOLDER: PACKET },
    workspace: REPO_ROOT,
    stateDir,
    resetReceipt: () => true,
    ...overrides,
  };
}

function watermarkFile(stateDir) {
  const names = readdirSync(stateDir).filter((name) => name.endsWith('.json'));
  return names.length === 1 ? join(stateDir, names[0]) : null;
}

function writeSession(root, records) {
  mkdirSync(join(root, 'journal'), { recursive: true });
  writeFileSync(join(root, 'meta.json'), JSON.stringify({ session_id: SESSION_ID }));
  writeFileSync(
    join(root, 'journal', '0000000000000001.jsonl'),
    `${records.map((record) => JSON.stringify(record)).join('\n')}\n`,
  );
}

function runBinding(payload) {
  return spawnSync(process.execPath, [BINDING], {
    input: JSON.stringify(payload),
    encoding: 'utf8',
  });
}

test('a new compaction returns the goal slice and the history lookup offer', (t) => {
  const stateDir = tempStateDir(t);
  const text = buildCompactionPart(payloadFor(), optionsFor(stateDir));

  assert.match(text, /\*\*Objective:\*\*/);
  assert.match(text, /## History Lookup/);
  assert.match(text, /hl1_[a-f0-9]{32}/);

  const file = watermarkFile(stateDir);
  assert.ok(file, 'the watermark file was written');
  const watermark = JSON.parse(readFileSync(file, 'utf8'));
  assert.equal(watermark.compactionId, COMPACTION_ID);
  assert.equal(watermark.sequence, COMPACTION_SEQUENCE);
});

test('the same journal again returns nothing', (t) => {
  const stateDir = tempStateDir(t);
  assert.notEqual(buildCompactionPart(payloadFor(), optionsFor(stateDir)), '');
  assert.equal(buildCompactionPart(payloadFor(), optionsFor(stateDir)), '');
});

// A snapshot generation re-reads an earlier compaction under its own, higher
// sequence, so the detector must remember the ids it already injected.
test('a compaction re-read under a later snapshot sequence returns nothing', (t) => {
  const stateDir = tempStateDir(t);
  const listAt = (entries) => () => entries;
  const first = { compactionId: COMPACTION_ID, sequence: COMPACTION_SEQUENCE };
  assert.notEqual(buildCompactionPart(payloadFor(), optionsFor(stateDir, { listCompactions: listAt([first]) })), '');
  const refolded = { ...first, sequence: 211 };
  assert.equal(buildCompactionPart(payloadFor(), optionsFor(stateDir, { listCompactions: listAt([refolded]) })), '');
  const next = { compactionId: 'e0000000-0000-0000-0000-000000000001', sequence: 240 };
  assert.notEqual(
    buildCompactionPart(payloadFor(), optionsFor(stateDir, { listCompactions: listAt([refolded, next]) })),
    '',
  );
});

// A sandboxed scratch session may not write into the checkout, so the default
// watermark folder follows the session's working folder.
test('the default watermark is written under the session folder', (t) => {
  const project = tempStateDir(t);
  const text = buildCompactionPart(payloadFor({ cwd: project }), {
    env: { VIBE_SPEC_FOLDER: PACKET },
    workspace: REPO_ROOT,
    resetReceipt: () => true,
  });
  assert.notEqual(text, '');
  const stateDir = join(project, '.skilled', 'skills', '.state', 'vibe-compaction');
  assert.ok(watermarkFile(stateDir), 'watermark under the session folder');
});

test('a journal with no compaction returns nothing and writes no watermark', (t) => {
  const stateDir = tempStateDir(t);
  const text = buildCompactionPart(
    payloadFor({ transcript_path: NO_COMPACTION_FIXTURE }),
    optionsFor(stateDir),
  );

  assert.equal(text, '');
  assert.deepEqual(readdirSync(stateDir), []);
});

test('a missing journal returns nothing and the binding exits 0', (t) => {
  const stateDir = tempStateDir(t);
  const missing = join(os.tmpdir(), 'vibe-compaction-missing-journal');
  const text = buildCompactionPart(
    payloadFor({ transcript_path: missing }),
    optionsFor(stateDir),
  );
  assert.equal(text, '');

  const result = runBinding(payloadFor({ hook_event_name: 'post_tool', transcript_path: missing }));
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout, '');
});

test('a malformed compaction entry returns nothing and the binding exits 0', (t) => {
  const stateDir = tempStateDir(t);
  const root = mkdtempSync(join(os.tmpdir(), 'vibe-compaction-malformed-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  writeSession(root, [
    {
      sequence: 1,
      type: 'projection_delta',
      payload: {
        delta: [{
          op: 'append_entry',
          entry: {
            id: 'user-1',
            type: 'message',
            role: 'user',
            turnId: 'turn-1',
            content: [{ type: 'text', text: 'Continue.' }],
          },
        }],
      },
    },
    {
      sequence: 2,
      type: 'projection_delta',
      payload: {
        delta: [{
          op: 'append_entry',
          entry: { id: 42, type: 'checkpoint', kind: 'compaction', details: {} },
        }],
      },
    },
  ]);

  const text = buildCompactionPart(
    payloadFor({ transcript_path: root }),
    optionsFor(stateDir),
  );
  assert.equal(text, '');

  const result = runBinding(payloadFor({ hook_event_name: 'post_tool', transcript_path: root }));
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout, '');
});

test('the binding skips an unchanged journal size without reading it', () => {
  const text = buildPostToolPart(payloadFor({ hook_event_name: 'post_tool' }), {
    journalSize: () => 100,
    readSize: () => 100,
    detect: () => { throw new Error('the detector must not read an unchanged journal'); },
    writeSize: () => true,
  });

  assert.equal(text, '');
});

test('the binding runs the detector when the journal grew', () => {
  const seen = [];
  const text = buildPostToolPart(payloadFor({ hook_event_name: 'post_tool' }), {
    journalSize: () => 200,
    readSize: () => 100,
    detect: (payload, options) => {
      seen.push(options.stateDir);
      return 'context restored';
    },
    writeSize: () => true,
  });

  assert.equal(text, 'context restored');
  assert.equal(seen.length, 1);
});

test('a new compaction clears the advisor directive receipt', (t) => {
  const stateDir = tempStateDir(t);
  const seen = [];
  buildCompactionPart(payloadFor(), optionsFor(stateDir, {
    resetReceipt: (sessionId) => { seen.push(sessionId); return true; },
  }));

  assert.deepEqual(seen, [SESSION_ID]);
});

test('a repeat leaves the advisor directive receipt alone', (t) => {
  const stateDir = tempStateDir(t);
  const seen = [];
  const resetReceipt = (sessionId) => { seen.push(sessionId); return true; };
  buildCompactionPart(payloadFor(), optionsFor(stateDir, { resetReceipt }));
  buildCompactionPart(payloadFor(), optionsFor(stateDir, { resetReceipt }));

  assert.deepEqual(seen, [SESSION_ID]);
});

// The locator the offer prints is written to the shared hook state, so the one
// case that renders a real offer removes it again.
after(async () => {
  const { getStatePath } = await import(
    '../../../skills/system-spec-kit/runtime/dist/hooks/claude/hook-state.js'
  );
  try { rmSync(getStatePath(SESSION_ID)); } catch { /* no locator was written */ }
  process.chdir(originalCwd);
});
