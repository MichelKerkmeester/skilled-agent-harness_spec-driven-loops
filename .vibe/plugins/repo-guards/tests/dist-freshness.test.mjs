// ───────────────────────────────────────────────────────────────────
// MODULE: Vibe dist-freshness Hook Tests (node --test)
// ───────────────────────────────────────────────────────────────────
//
// Drives the post_tool hook's decision for the three calls it judges: an edit
// to a watched package source, a shell command that is about to trust the local
// build, and a command that is neither. The checker runner is stubbed, so the
// cases pin which call earns a check and which checker mode it names. The
// malformed-input case runs the real entry point, because a hook that cannot
// read its payload must still exit 0 and print nothing.

import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { runDistFreshness } from '../dist-freshness.mjs';

const HOOK = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist-freshness.mjs');
const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../../..');
const WATCHED_SOURCE = join(
  REPO_ROOT,
  '.skilled/skills/system-skill-advisor/runtime/lib/advisor-runtime-values.ts',
);
const WARNING = 'STALE DIST WARNING: @spec-kit/system-skill-advisor -- run: cd .skilled/skills/system-skill-advisor/runtime && npm run build';

function editPayload(overrides = {}) {
  return {
    hook_event_name: 'post_tool',
    session_id: 'session-dist',
    parent_session_id: null,
    cwd: REPO_ROOT,
    tool_name: 'file_system.write_file',
    tool_call_id: 'call-1',
    tool_input: { file_path: WATCHED_SOURCE, content: 'export const probe = 1;\n' },
    tool_status: 'success',
    tool_output_text: 'Wrote 1 file.',
    ...overrides,
  };
}

function shellPayload(command) {
  return editPayload({
    tool_name: 'file_system.bash',
    tool_input: { command },
    tool_output_text: 'ok',
  });
}

test('an edit to a watched package source returns the staleness warning', () => {
  const calls = [];
  const text = runDistFreshness(editPayload(), {
    run: (args, env) => {
      calls.push({ args, env });
      return WARNING;
    },
  });

  assert.match(text, /STALE DIST WARNING/);
  assert.deepEqual(calls[0].args, [WATCHED_SOURCE]);
});

test('a matched shell command returns the staleness warning', () => {
  const calls = [];
  const text = runDistFreshness(
    shellPayload('bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/x --strict'),
    {
      run: (args, env) => {
        calls.push({ args, env });
        return WARNING;
      },
    },
  );

  assert.match(text, /STALE DIST WARNING/);
  assert.deepEqual(calls[0].args, ['--all']);
  // A mid-session rebuild would race the run that asked for the check.
  assert.equal(calls[0].env.SPECKIT_DIST_AUTO_REBUILD, '0');
});

test('an unmatched command and malformed input stay silent', () => {
  const calls = [];
  const text = runDistFreshness(shellPayload('ls -la'), {
    run: (args) => {
      calls.push(args);
      return WARNING;
    },
  });
  assert.equal(text, '');
  assert.equal(calls.length, 0);

  const result = spawnSync(process.execPath, [HOOK], { input: 'not json', encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout, '');
});
