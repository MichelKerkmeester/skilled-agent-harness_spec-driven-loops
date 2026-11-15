REPOSITORY ROOT: /Users/michelkerkmeester/worktrees/public/418-vibe-handover-hardening
Every read, write and command uses this root. Your environment block may name a different
"Workspace root folder": ignore it, it is another checkout of the same repository.

GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  /Users/michelkerkmeester/worktrees/public/418-vibe-handover-hardening/specs/hooks-plugins-extensions/session-handover/002-session-handover-loop/047-vibe-handover-hardening

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.
A failed edit match means a stale anchor: re-read the file and retry; halt only after three
failures on the same file.
Your task is complete only when files exist on disk and the verification command has been run.

PERSONA: You are a careful Node.js maintainer. You make the smallest edit that does the job, match the file's existing style, and never add comments that name tickets, phases, specs or findings.

RULES: Edit only the four files named below. No git commands. Do not run vibe or any other AI CLI. Never read, write or name a dotenv file. Another worker is editing other files in this checkout at the same time; do not touch `bin/session-handover.cjs`, `lib/relaunch-core.cjs` or `tests/session-handover-cli.test.cjs`.

TASK (one change): when the operator types a new prompt, withdraw an armed hand-over before the other turn-start parts run, not after them. Today the withdraw runs inside the last part, after parts that can take seconds, while the killer fires three seconds after the turn ended.

Root = /Users/michelkerkmeester/worktrees/public/418-vibe-handover-hardening
P = Root/.skilled/hooks/session-handover/vibe/handover-parts.mjs
T = Root/.skilled/hooks/session-lifecycle/vibe/turn-start.mjs

1. In P, directly above `async function buildHandoverContextPart(`, add:

```
// Sessions whose armed hand-over the early withdraw step already cancelled this turn, so the
// context part still answers with the withdrawn notice once the record is disarmed.
const earlyWithdrawn = new Set();

/**
 * Withdraw an armed hand-over at the start of an operator turn, before slower turn-start parts.
 *
 * @param {Object} payload - The parsed Vibe pre_agent payload.
 * @param {Object} [dependencies] - Seams for tests.
 * @param {NodeJS.ProcessEnv} [dependencies.env=process.env] - Runtime environment.
 * @returns {boolean} Whether a hand-over was withdrawn.
 */
function withdrawBeforeTurnStart(payload, dependencies = {}) {
  const env = dependencies.env || process.env;
  if (!isPayloadObject(payload) || payload.hook_event_name !== 'pre_agent') return false;
  if (!handoverEnabled(env, hookConfig())) return false;
  const sessionId = payload.session_id;
  if (!nudge.validSessionId(sessionId)) return false;
  if (isSubagent(payload)) return false;
  if (nudge.isSeedPrompt(payload.prompt)) return false;
  const withdrawn = withdrawOnOperatorPrompt(sessionId, env);
  if (withdrawn) earlyWithdrawn.add(sessionId);
  return withdrawn;
}

```

2. In P, inside `buildHandoverContextPart`, replace:

```
  const withdrawn = eventName === 'pre_agent' && withdrawOnOperatorPrompt(sessionId, env);
```

with:

```
  const withdrawn = eventName === 'pre_agent'
    && (earlyWithdrawn.delete(sessionId) || withdrawOnOperatorPrompt(sessionId, env));
```

3. In P, change the last line `export { buildHandoverContextPart, armHandoverTurnEnd };` to:

```
export { buildHandoverContextPart, armHandoverTurnEnd, withdrawBeforeTurnStart };
```

4. In T, directly after the `async function handoverPart(payload) { ... }` function, add:

```

// An armed hand-over is withdrawn before any other part runs, so a slow part cannot hold the
// withdraw past the moment the killer ends the session. It adds no text of its own.
export async function handoverWithdrawPart(payload) {
  const { withdrawBeforeTurnStart } = await import(HANDOVER_PART_URL);
  withdrawBeforeTurnStart(payload);
  return '';
}
```

5. In T, change `const PARTS = [` to `export const PARTS = [` and make `handoverWithdrawPart,` its first entry, above `(payload) => pendingCompletionAdvisoryPart(payload),`.

6. In Root/.skilled/hooks/session-lifecycle/vibe/turn-start.test.mjs, change the import line `import { buildSaveNudgePart, composeTurnStart } from './turn-start.mjs';` to `import { PARTS, buildSaveNudgePart, composeTurnStart, handoverWithdrawPart } from './turn-start.mjs';` and add at the end of the file:

```

test('the hand-over withdraw step runs before every other turn-start part', () => {
  assert.equal(PARTS[0], handoverWithdrawPart);
});
```

7. In Root/.skilled/hooks/session-handover/tests/vibe-adapters.test.cjs, directly after the test named `pre_agent withdraws an armed hand-over and answers with the notice alone`, add:

```

test('the early withdraw step disarms first and the context part still answers with the notice', async (t) => {
  const sandbox = createSandbox(t);
  const loopId = 'vibe-early-withdraw-loop-0001';
  sandbox.env.SKILLED_LOOP_ID = loopId;
  sandbox.env.SESSION_HANDOVER_THRESHOLD = '0.80';
  sandbox.env.SESSION_HANDOVER_WINDOW_TOKENS = String(WINDOW_TOKENS);
  const { recordPath, record } = createPendingRecord(sandbox, loopId, SESSION_ID, 'armed');
  record.armedAt = new Date().toISOString();
  record.armId = 'arm-early-withdraw';
  fs.writeFileSync(recordPath, JSON.stringify(record));

  const sessionRoot = createVibeSession(t, sandbox);
  writeVibeSegment(sessionRoot, '0000000000000001.jsonl', [vibeModelCall(950)]);
  const { buildHandoverContextPart, withdrawBeforeTurnStart } = await loadParts();
  const payload = payloadFor(sandbox, sessionRoot, 'pre_agent', { prompt: 'Continue the current task' });

  assert.equal(withdrawBeforeTurnStart(payload, { env: sandbox.env }), true);
  const early = JSON.parse(fs.readFileSync(recordPath, 'utf8'));
  assert.equal(early.status, 'disarmed');
  assert.equal(early.disarmReason, 'user-message');

  const text = await buildHandoverContextPart(payload, { env: sandbox.env });
  assert.equal(text, nudge.WITHDRAWN_NOTICE);
});
```

VERIFY: run both commands from Root and paste the last 12 lines of each output with its exit status:

  node --test .skilled/hooks/session-lifecycle/vibe/turn-start.test.mjs
  node --test --test-name-pattern="withdraw" .skilled/hooks/session-handover/tests/vibe-adapters.test.cjs

If one fails, read the failure, fix your edit, and run it again (at most three times).

HANDBACK: list the files you changed, both verify output tails with exit status, and anything you could not do. Do not claim success without the command output.
