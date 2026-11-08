// ───────────────────────────────────────────────────────────────────
// MODULE: Runtime-by-State Matrix
// ───────────────────────────────────────────────────────────────────
// Seven runtimes by four states gives the required 28 rows. A present id must
// resolve, an absent id must be not-found, a disagreeing identity must be a
// mismatch and a broken store must be unreadable. Cursor is gated in every
// state, so its four rows assert the gate rather than a read.

import assert from 'node:assert/strict';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';

import { readSession } from '../../session-readers/index.mjs';
import {
  claudeSession,
  codexSession,
  DECOY,
  devinSession,
  dshSession,
  opencodeSession,
  piSession,
  SESSION,
  T0,
} from './fixtures.mjs';
import { trackFileOpens, withTempAsync, writeJsonl } from './helpers.mjs';

function projectAt(root, name = 'project') {
  const directory = join(root, name);
  mkdirSync(directory, { recursive: true });
  return directory;
}

function sameKeyProject(root) {
  const projectDir = projectAt(root, join('a', 'b'));
  const otherDir = projectAt(root, 'a-b');
  return { projectDir, otherDir };
}

const ROWS = [
  // Claude
  { runtime: 'claude', state: 'present', expect: 'ok', run: async (base) => {
    const fixture = claudeSession({ root: base });
    return readSession({ runtime: 'claude', sessionId: SESSION, ...fixture.options });
  } },
  { runtime: 'claude', state: 'absent', expect: 'session_not_found', run: async (base) => {
    const fixture = claudeSession({ root: base });
    return readSession({
      runtime: 'claude',
      sessionId: SESSION,
      claudeRoot: fixture.root,
      transcriptPath: join(fixture.root, SESSION, 'absent.jsonl'),
    });
  } },
  { runtime: 'claude', state: 'mismatched', expect: 'session_mismatch', run: async (base) => {
    const fixture = claudeSession({ root: base, headerId: DECOY });
    return readSession({ runtime: 'claude', sessionId: SESSION, ...fixture.options });
  } },
  { runtime: 'claude', state: 'store_unreadable', expect: 'store_unreadable', run: async (base) => {
    const root = join(base, 'missing-claude');
    return readSession({
      runtime: 'claude',
      sessionId: SESSION,
      claudeRoot: root,
      transcriptPath: join(root, `${SESSION}.jsonl`),
    });
  } },

  // Codex
  { runtime: 'codex', state: 'present', expect: 'ok', run: async (base) => {
    const fixture = codexSession({ root: base });
    return readSession({ runtime: 'codex', sessionId: SESSION, ...fixture.options });
  } },
  { runtime: 'codex', state: 'absent', expect: 'session_not_found', run: async (base) => {
    const fixture = codexSession({ root: base });
    return readSession({
      runtime: 'codex',
      sessionId: SESSION,
      codexRoot: fixture.root,
      transcriptPath: join(fixture.root, '2026', '11', '08', 'absent.jsonl'),
    });
  } },
  { runtime: 'codex', state: 'mismatched', expect: 'session_mismatch', run: async (base) => {
    const fixture = codexSession({ root: base, headerId: DECOY });
    return readSession({ runtime: 'codex', sessionId: SESSION, ...fixture.options });
  } },
  { runtime: 'codex', state: 'store_unreadable', expect: 'store_unreadable', run: async (base) => {
    const root = join(base, 'missing-codex');
    return readSession({
      runtime: 'codex',
      sessionId: SESSION,
      codexRoot: root,
      transcriptPath: join(root, 'rollout.jsonl'),
    });
  } },

  // Pi
  { runtime: 'pi', state: 'present', expect: 'ok', run: async (base) => {
    const projectDir = projectAt(base);
    const fixture = piSession({ root: base, projectDir });
    return readSession({ runtime: 'pi', sessionId: SESSION, ...fixture.options });
  } },
  { runtime: 'pi', state: 'absent', expect: 'session_not_found', run: async (base) => {
    const projectDir = projectAt(base);
    const fixture = piSession({ root: base, projectDir, sessionId: DECOY });
    return readSession({ runtime: 'pi', sessionId: SESSION, piRoot: fixture.root, projectDir });
  } },
  { runtime: 'pi', state: 'mismatched', expect: 'session_mismatch', run: async (base) => {
    const { projectDir, otherDir } = sameKeyProject(base);
    const fixture = piSession({ root: base, projectDir, headerCwd: otherDir });
    return readSession({ runtime: 'pi', sessionId: SESSION, ...fixture.options });
  } },
  { runtime: 'pi', state: 'store_unreadable', expect: 'store_unreadable', run: async (base) => {
    const projectDir = projectAt(base);
    return readSession({
      runtime: 'pi',
      sessionId: SESSION,
      piRoot: join(base, 'missing-pi'),
      projectDir,
    });
  } },

  // OpenCode
  { runtime: 'opencode', state: 'present', expect: 'ok', run: async (base) => {
    const fixture = opencodeSession({ root: base });
    return readSession({ runtime: 'opencode', sessionId: SESSION, ...fixture.options });
  } },
  { runtime: 'opencode', state: 'absent', expect: 'session_not_found', run: async (base) => {
    const fixture = opencodeSession({ root: base, sessionId: DECOY });
    return readSession({ runtime: 'opencode', sessionId: SESSION, ...fixture.options });
  } },
  { runtime: 'opencode', state: 'mismatched', expect: 'session_mismatch', run: async (base) => {
    const fixture = opencodeSession({ root: base });
    const otherRoot = `${fixture.root}-other`;
    mkdirSync(otherRoot, { recursive: true });
    return readSession({
      runtime: 'opencode',
      sessionId: SESSION,
      opencodeRoot: otherRoot,
      dbPath: fixture.dbPath,
    });
  } },
  { runtime: 'opencode', state: 'store_unreadable', expect: 'store_unreadable', run: async (base) => {
    const fixture = opencodeSession({ root: base });
    return readSession({
      runtime: 'opencode',
      sessionId: SESSION,
      opencodeRoot: fixture.root,
      dbPath: `${fixture.dbPath}.absent`,
    });
  } },

  // Devin
  { runtime: 'devin', state: 'present', expect: 'ok', run: async (base) => {
    const projectDir = projectAt(base);
    const fixture = devinSession({ root: base, projectDir });
    return readSession({ runtime: 'devin', sessionId: SESSION, ...fixture.options });
  } },
  { runtime: 'devin', state: 'absent', expect: 'session_not_found', run: async (base) => {
    const projectDir = projectAt(base);
    const fixture = devinSession({ root: base, projectDir, sessionId: DECOY });
    return readSession({ runtime: 'devin', sessionId: SESSION, devinDataHome: fixture.root, projectDir });
  } },
  { runtime: 'devin', state: 'mismatched', expect: 'session_mismatch', run: async (base) => {
    const projectDir = projectAt(base);
    const otherDir = projectAt(base, 'other');
    const fixture = devinSession({ root: base, projectDir, workingDirectory: otherDir });
    return readSession({ runtime: 'devin', sessionId: SESSION, ...fixture.options });
  } },
  { runtime: 'devin', state: 'store_unreadable', expect: 'store_unreadable', run: async (base) => {
    const projectDir = projectAt(base);
    return readSession({
      runtime: 'devin',
      sessionId: SESSION,
      devinDataHome: join(base, 'missing-devin'),
      projectDir,
    });
  } },

  // DSH
  { runtime: 'dsh', state: 'present', expect: 'ok', run: async (base) => {
    const projectDir = projectAt(base);
    const fixture = dshSession({ root: base, projectDir });
    return readSession({ runtime: 'dsh', sessionId: SESSION, ...fixture.options });
  } },
  { runtime: 'dsh', state: 'absent', expect: 'session_not_found', run: async (base) => {
    const projectDir = projectAt(base);
    const fixture = dshSession({ root: base, projectDir, sessionId: DECOY });
    return readSession({ runtime: 'dsh', sessionId: SESSION, dshRoot: fixture.root, projectDir });
  } },
  { runtime: 'dsh', state: 'mismatched', expect: 'session_mismatch', run: async (base) => {
    const { projectDir, otherDir } = sameKeyProject(base);
    const fixture = dshSession({ root: base, projectDir, headerCwd: otherDir });
    return readSession({ runtime: 'dsh', sessionId: SESSION, ...fixture.options });
  } },
  { runtime: 'dsh', state: 'store_unreadable', expect: 'store_unreadable', run: async (base) => {
    const projectDir = projectAt(base);
    return readSession({
      runtime: 'dsh',
      sessionId: SESSION,
      dshRoot: join(base, 'missing-dsh'),
      projectDir,
    });
  } },

  // Cursor: gated in every state.
  { runtime: 'cursor', state: 'present', expect: 'capability_gated', run: async () => readSession({ runtime: 'cursor', sessionId: SESSION, env: {}, config: {} }) },
  { runtime: 'cursor', state: 'absent', expect: 'capability_gated', run: async () => readSession({ runtime: 'cursor', sessionId: SESSION, env: {}, config: {} }) },
  { runtime: 'cursor', state: 'mismatched', expect: 'capability_gated', run: async () => readSession({ runtime: 'cursor', sessionId: SESSION, env: {}, config: {} }) },
  { runtime: 'cursor', state: 'store_unreadable', expect: 'capability_gated', run: async () => readSession({ runtime: 'cursor', sessionId: SESSION, env: {}, config: {} }) },
];

test('the runtime-by-state matrix holds 28 rows', async () => {
  await withTempAsync('matrix', async (root) => {
    for (const row of ROWS) {
      const base = join(root, `${row.runtime}-${row.state}`);
      mkdirSync(base, { recursive: true });
      const result = await row.run(base);
      if (row.expect === 'ok') {
        assert.equal(result.ok, true, `${row.runtime}/${row.state} should resolve`);
      } else {
        assert.equal(result.ok, false, `${row.runtime}/${row.state} should fail`);
        assert.equal(result.code, row.expect, `${row.runtime}/${row.state}`);
      }
    }
    console.log(`matrix rows: ${ROWS.length}`);
    assert.equal(ROWS.length, 28);
  });
});

test('no newest-in-project fallback opens a decoy session', async () => {
  await withTempAsync('matrix-decoy', async (root) => {
    const claudeRoot = claudeSession({ root, sessionId: DECOY }).root;
    codexSession({ root, sessionId: DECOY });
    const piDir = projectAt(root);
    const pi = piSession({ root, projectDir: piDir, sessionId: DECOY });
    const devinDir = projectAt(root, 'devin-project');
    const devin = devinSession({ root, projectDir: devinDir, sessionId: DECOY });
    const dshDir = projectAt(root, 'dsh-project');
    const dsh = dshSession({ root, projectDir: dshDir, sessionId: DECOY });

    const tracker = trackFileOpens();
    try {
      const results = await Promise.all([
        readSession({
          runtime: 'claude',
          sessionId: SESSION,
          claudeRoot,
          transcriptPath: join(claudeRoot, SESSION, 'absent.jsonl'),
        }),
        readSession({
          runtime: 'codex',
          sessionId: SESSION,
          codexRoot: join(root, 'codex', 'sessions'),
          transcriptPath: join(root, 'codex', 'sessions', 'absent.jsonl'),
        }),
        readSession({ runtime: 'pi', sessionId: SESSION, piRoot: pi.root, projectDir: piDir }),
        readSession({ runtime: 'devin', sessionId: SESSION, devinDataHome: devin.root, projectDir: devinDir }),
        readSession({ runtime: 'dsh', sessionId: SESSION, dshRoot: dsh.root, projectDir: dshDir }),
      ]);

      for (const result of results) {
        assert.equal(result.ok, false);
        assert.equal(result.code, 'session_not_found');
      }

      const decoyOpens = tracker.opened.filter((path) => path.includes(DECOY)).length;
      console.log(`decoy opens: ${decoyOpens}`);
      assert.equal(decoyOpens, 0);
    } finally {
      tracker.restore();
    }
  });
});

test('a 10,000-entry session resolves in one pass under 2000 ms', async () => {
  await withTempAsync('matrix-large', async (root) => {
    const claudeRoot = join(root, 'claude', 'projects');
    const filePath = join(claudeRoot, SESSION, `${SESSION}.jsonl`);
    const lines = [];
    for (let index = 0; index < 10000; index += 1) {
      lines.push({
        type: 'assistant',
        uuid: `large-${index}`,
        sessionId: SESSION,
        timestamp: new Date(T0 + index).toISOString(),
        message: { role: 'assistant', content: [{ type: 'text', text: `Line ${index}` }] },
      });
    }
    writeJsonl(filePath, lines);

    const started = process.hrtime.bigint();
    const result = await readSession({
      runtime: 'claude',
      sessionId: SESSION,
      claudeRoot,
      transcriptPath: filePath,
    });
    const elapsedMs = Number(process.hrtime.bigint() - started) / 1e6;

    assert.equal(result.ok, true);
    assert.equal(result.items.length, 10000);
    assert.ok(elapsedMs < 2000, `resolved in ${elapsedMs.toFixed(1)} ms`);
  });
});
