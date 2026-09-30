GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/cli-jev/003-cli-jev-workflow-integration/023-reply-harness-blinded-judge

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.
Your task is complete only when files exist on disk and the verification command has been run.

=== BEGIN AGENT PERSONA (resolved runtime path: .claude/agents/code.md; focused summary for a one-change brief) ===
You are @code, a leaf implementer dispatched by an orchestrator (Depth: 1). Never dispatch another agent.
Scope: edit only the files this brief names. Read each file before editing it and re-read the edited region after.
Standards: read .skilled/skills/sk-code/SKILL.md and follow the route it resolves for this file type.
Comment hygiene is a hard block: no spec paths, packet or phase numbers, or REQ/task ids in code comments. Keep the durable why.
Verification: run only the checks this brief lists. Fail closed: no retry loop, no workaround. Report exact commands, result lines and exit codes.
Output: end with the HANDBACK block, STATUS DONE or BLOCKED.
=== END AGENT PERSONA (resolved persona: code) ===

TASK: add the call plumbing both model arms share, and the score-answer parser, with tests.
S = .skilled/skills/sk-communication/benchmark/reply-harness/judge-agreement.mjs (exists)
T = .skilled/skills/sk-communication/benchmark/reply-harness/judge-agreement.test.mjs (exists)
M = .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs (read only, the model)
Read S and T in full, then M lines 979-990, 1169-1250 and 1762-1776. Keep every existing line unchanged. Same style as S.

STEP 1. In S, at the end of section 7 (after `deemGate`), copy from M with their JSDoc, changing nothing: `nearestRank` (M:979-990), `spawnCall` (M:1169-1225) and `createCallLog` (M:1227-1250).

STEP 2. In S, also at the end of section 7, add:
```
/**
 * Level position from one score answer. A backend may return a fractional
 * position, so it rounds to the nearest level, and a value outside 0 to 2
 * or a body that does not parse is an unmeasured call, not a crash.
 *
 * @param {string} stdout Raw stdout of one score call.
 * @returns {0 | 1 | 2 | null} Level position, or null when unmeasured.
 */
export function parseScoreAnswer(stdout) {
  let parsed;
  try {
    parsed = JSON.parse(stdout);
  } catch {
    return null;
  }
  const score = parsed?.answers?.answer?.score;
  if (typeof score !== 'number' || !Number.isFinite(score) || score < 0 || score > 2) return null;
  return Math.round(score);
}
```

STEP 3. In S, in section 9 above `main`, copy `readStoredReport` from M:1762-1776 with its JSDoc, changing nothing.

STEP 4. In T, add three tests:
30. `parseScoreAnswer` on `'{"answers":{"answer":{"score":1.4}}}'` is 1, on score 1.5 is 2, on score 0 is 0, on score 2.2 is null, on score -0.1 is null, on `'not json'` is null and on `'{}'` is null.
31. `createCallLog(undefined).append({ a: 1 })` creates no file. On a fresh temp dir `d`, `createCallLog(path.join(d, 'out'))` appended `{ a: 1 }` twice leaves `out/calls.jsonl` with exactly two lines, each `'{"a":1}'`. `readStoredReport(path.join(d, 'none'))` is null.
32. `await spawnCall(process.execPath, ['-e', 'process.stdin.pipe(process.stdout)'], 'hi', process.env, 5000)` resolves with code 0, stdout `'hi'` and timedOut false. `await spawnCall(process.execPath, ['-e', 'setTimeout(() => {}, 5000)'], '', process.env, 200)` resolves with timedOut true.

Accept when: 2 files changed (S and T), no other file changed, both pass `node --check`, and `grep -c "^export function" S` prints 28.
Checks you run: `node --check S`, `node --check T`, that grep. Do not run `node --test`: the orchestrator runs it.

RUN CONTEXT
- Repo root, a git worktree. Run every command from here:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration
- Spec folder (pre-approved, Gate 3 answered): specs/cli-jev/003-cli-jev-workflow-integration/023-reply-harness-blinded-judge
- Other workers edit other files in this tree at the same time. Touch only the files this brief names.
- The orchestrator runs the test suites, spec validation and every git commit after you return.
- Your sandbox may block test runners that open local sockets (tsx, vitest). Run only the checks listed here; the orchestrator runs the rest.

DON'T
- Edit, create or delete any file this brief does not name.
- Run a git command that writes (add, commit, stash, checkout, restore, reset, merge, rebase, push).
- Install anything (npm/pnpm/pip/brew install, npm ci) or touch node_modules.
- Open any .env file, print environment variables, or write a key or token into any file.
- Call jev, the local Deem server (127.0.0.1:8300) or any network service.
- Put spec paths, packet or phase numbers, or REQ/task ids in code comments.
- Reformat, reorder or "improve" anything outside the named edit.
- Ask a question. If a step cannot be done exactly as written, stop and report BLOCKED with the reason.

HANDBACK (print exactly this block, filled in, as your last output)
STATUS: DONE | BLOCKED
FILES CHANGED: one line per file: <path> (+<added>/-<removed>)
EDITS: one line per step: <file>:<line> <what changed>
CHECKS: one line per check: <command> -> <result line> (exit <n>)
BLOCKED REASON: <one line, or none>
