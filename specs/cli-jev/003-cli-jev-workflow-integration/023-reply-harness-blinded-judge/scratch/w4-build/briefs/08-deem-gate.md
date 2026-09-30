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

TASK: add the Deem gate behind `--deem`, so a requested Deem arm checks the local server before any call, with tests.
S = .skilled/skills/sk-communication/benchmark/reply-harness/judge-agreement.mjs (exists)
T = .skilled/skills/sk-communication/benchmark/reply-harness/judge-agreement.test.mjs (exists)
M = .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs (read only, the model)
Read S and T in full, then M lines 1016-1188. Keep every existing line unchanged except where STEP 2 adds lines. Same style as S.

STEP 1. In S, insert section `7. DEEM ARM` between section 6 and section 9, starting with a comment: the gate runs only behind `--deem`, reads the local model's health once, passes no key and never starts the server.
a. Exported constants: `DEEM_MODEL = 'deem-0.8-v1'`; `DEEM_P50_MS = 60.2` with JSDoc "Deem 3-level score p50 in milliseconds, from deem-local.md, used for the wall-time estimate."; `HEALTH_TIMEOUT_MS = 10000` with JSDoc "Bounds the health spawn; cli-deem bounds its own HTTP health request at 2,000 ms."
b. Not exported: `REPO_CLI_DEEM = path.join(REPO_ROOT, '.skilled', 'skills', 'cli-classifier', 'cli-deem', 'scripts', 'cli-deem.mjs')`, the repo copy run under node when no `cli-deem` is on PATH.
c. Copy these four functions from M with their JSDoc, changing nothing but what the names above require: `which` (M:1045-1068, not exported), `deemCommand` (M:1070-1080), `readDeemHealth` (M:1082-1146), `deemGate` (M:1148-1167).

STEP 2. In `main` in S, after the loop that prints the summary lines and before `return 0`, add:
```
let deemResult;
if (values.deem === true) {
  const check = deemGate({ out, env });
  if (!check.passed) {
    deemResult = { skipped: check.reason };
  } else if (summary.gate !== 'planned') {
    const line = `deem arm skipped: ${summary.gate === 'stop' ? 'label gate' : 'no headroom'}`;
    out(line);
    deemResult = { skipped: line };
  } else {
    // The Deem arm runs here after a passing gate.
  }
}
```
Use the variable names `main` already has for the parsed values and the summary result; if they differ, keep main's names and change only this block to match. A comment above the block says a skipped or refused gate leaves every earlier line as it was.

STEP 3. In T, add two tests on `makeFixture()` with `makeStubBin(root)`, both comparing against a default run (no `--deem`) of the same fixture and env:
28. `--deem --out <root>/out`: code 0, and the lines equal the default run's lines followed by exactly `deem: health backend=torch model=deem-0.8-v1 model_commit=stubmodel source_commit=stubsource` and `deem arm skipped: label gate`. `readStubLog(root)` is one line starting `'cli-deem\thealth'`.
29. The same with `stubEnv(root, { STUB_HEALTH: 'stub' })`: code 0, and the lines equal the default run's lines followed by exactly `deem arm skipped: stub backend`.

Accept when: 2 files changed (S and T), no other file changed, both pass `node --check`, and `grep -c "^export function" S` prints 23.
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
