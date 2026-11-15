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

RULES: Edit only the two files named below. No git commands. Do not run vibe or any other AI CLI. Never read, write or name a dotenv file. Other workers are editing other files in this checkout at the same time; touch nothing else.

TASK (one change): after a Vibe compaction, reset the hand-over nudge level so a refilled context is nudged again, print no claim pointer while a hand-over is pending, and print the stale-note text after a withdraw. Claude's compaction hook already does all three.

Root = /Users/michelkerkmeester/worktrees/public/418-vibe-handover-hardening
C = Root/.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs
T = Root/.skilled/hooks/session-lifecycle/vibe/compaction-context.test.mjs

1. In C, replace the line

```
const { claimCommandFor, openNotePathFor, resolveRepoRoot } = require('../../session-handover/lib/nudge.cjs');
```

with

```
const {
  claimCommandFor,
  handoffPending,
  handoffWithdrawn,
  openNotePathFor,
  resolveRepoRoot,
  staleNoteText,
  writeState,
} = require('../../session-handover/lib/nudge.cjs');
```

2. In C, replace the whole `function handoffSection(sessionId, env) { ... }` with:

```
function handoffSection(sessionId, env, {
  pending = handoffPending,
  withdrawn = handoffWithdrawn,
  notePathFor = openNotePathFor,
} = {}) {
  try {
    // A prepared hop already owns the note; pointing this session at a claim would leave
    // the fresh session nothing to claim.
    if (pending({ sessionId, env })) return '';
    const notePath = notePathFor({ repoRoot: resolveRepoRoot(env), sessionId });
    if (!notePath) return '';
    // The operator withdrew the hand-over after this note was written, so the work since is
    // not in it, and claiming it would resume work that is already done.
    if (withdrawn({ sessionId, notePath, env })) return staleNoteText({ notePath });
    return [
      '## Handoff',
      `An open handoff note survives this compaction: ${notePath}`,
      `Claim it with: ${claimCommandFor(notePath, sessionId)}`,
    ].join('\n');
  } catch {
    return '';
  }
}

// A compaction frees the context, so the next fill climbs from the start and earns its nudges
// again. Best effort: a level that cannot be written only costs a nudge.
function resetNudgeLevel(sessionId, env) {
  try {
    writeState(sessionId, 0, env);
    return true;
  } catch {
    return false;
  }
}
```

3. In C, in the parameter list of `export function buildCompactionPart(payload, {`, add these two lines after `resetReceipt = resetDirectiveReceipt,`:

```
  resetNudge = resetNudgeLevel,
  handoff = {},
```

and add two matching lines to the JSDoc above it, after the `options.resetReceipt` line:

```
 * @param {Function} [options.resetNudge] - The nudge level reset, replaced in tests.
 * @param {Object} [options.handoff] - The hand-over state readers, replaced in tests.
```

4. In C, inside `buildCompactionPart`, directly after the try/catch that calls `resetReceipt(sessionId);`, add:

```

    resetNudge(sessionId, env);
```

and change `const handoff = handoffSection(sessionId, env);` to `const handoffText = handoffSection(sessionId, env, handoff);` and the next line to `if (handoffText) sections.push(handoffText);`.

5. In T, in `function optionsFor(stateDir, overrides = {})`, add `resetNudge: () => true,` after `resetReceipt: () => true,`, so the existing tests never write real nudge state.

6. In T, add at the end of the file:

```

test('a new compaction resets the nudge level once', (t) => {
  const stateDir = tempStateDir(t);
  const seen = [];
  const resetNudge = (sessionId) => { seen.push(sessionId); return true; };
  buildCompactionPart(payloadFor(), optionsFor(stateDir, { resetNudge }));
  buildCompactionPart(payloadFor(), optionsFor(stateDir, { resetNudge }));

  assert.deepEqual(seen, [SESSION_ID]);
});

test('a pending hop gets no claim pointer and a withdrawn one gets the stale-note text', (t) => {
  const notePathFor = () => '/tmp/handoff-note.md';
  const pendingText = buildCompactionPart(payloadFor(), optionsFor(tempStateDir(t), {
    handoff: { pending: () => true, withdrawn: () => false, notePathFor },
  }));
  assert.ok(!pendingText.includes('Claim it with'), pendingText);

  const withdrawnText = buildCompactionPart(payloadFor(), optionsFor(tempStateDir(t), {
    handoff: { pending: () => false, withdrawn: () => true, notePathFor },
  }));
  assert.ok(withdrawnText.includes('predates the work done since then'), withdrawnText);
  assert.ok(!withdrawnText.includes('Claim it with'), withdrawnText);

  const openText = buildCompactionPart(payloadFor(), optionsFor(tempStateDir(t), {
    handoff: { pending: () => false, withdrawn: () => false, notePathFor },
  }));
  assert.ok(openText.includes('Claim it with'), openText);
});
```

VERIFY: run this from Root and paste the last 12 lines of its output and its exit status:

  node --test .skilled/hooks/session-lifecycle/vibe/compaction-context.test.mjs

If it fails, read the failure, fix your edit, and run it again (at most three times).

HANDBACK: list the files you changed, the verify output tail with its exit status, and anything you could not do. Do not claim success without the command output.
