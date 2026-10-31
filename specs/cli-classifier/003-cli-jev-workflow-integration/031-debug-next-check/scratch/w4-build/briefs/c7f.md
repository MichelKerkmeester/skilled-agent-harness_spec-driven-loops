GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/cli-jev/003-cli-jev-workflow-integration/031-debug-next-check/scratch/w4-build

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

TASK: give the `verdict kill` test a pick schedule that is wrong on every row. One change in T. Change nothing in S.
T = `.skilled/skills/system-spec-kit/runtime/tests/debug-next-check.vitest.ts`. Read it first. S = `.skilled/skills/system-spec-kit/runtime/scripts/debug-next-check/score-debug-next-check.mjs` (read only).
WHY: the test runs with `STUB_PICKS: 'instrument'` and expects `A=5 B=12 W=0 L=12`. Those counts cannot occur together, since A - B must equal W - L. With every pick `instrument`, the model is right on the 5 instrument rows the `read_code` baseline misses, so W is 5, the loss tail is 0.0717, and S correctly prints `verdict deem: stop (margin) ... A=5 B=12 W=5 L=12`. The orchestrator ran S with a schedule wrong on every row and it printed exactly the kill line below.
EDIT 1: right after the `keepSchedule` function, add exactly this function:
/** Picks wrong on every row: run_test on the read_code rows and read_code on the rest. */
function killSchedule(): string {
  return verdictLabels().map((label) => (label === 'read_code' ? 'run_test' : 'read_code')).join(',');
}
EDIT 2: in `it('verdict kill', ...)`, replace `{ STUB_PICKS: 'instrument' },` with `{ STUB_PICKS: killSchedule() },` and replace the expected string's first part
      'verdict deem: kill K=30 M=30 A=5 B=12 W=0 L=12 F=0 p=0.0002441'
with
      'verdict deem: kill K=30 M=30 A=0 B=12 W=0 L=12 F=0 p=0.0002441'
Change nothing else.
VERIFY (repo root), paste each result line:
  grep -c "function killSchedule" .skilled/skills/system-spec-kit/runtime/tests/debug-next-check.vitest.ts
  grep -c "STUB_PICKS: 'instrument'" .skilled/skills/system-spec-kit/runtime/tests/debug-next-check.vitest.ts
Accept when: only T changed; the first grep prints 1 and the second prints 0. The orchestrator runs vitest.

RUN CONTEXT
- Repo root, a git worktree. Run every command from here:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration
- Spec folder (pre-approved, Gate 3 answered): specs/cli-jev/003-cli-jev-workflow-integration/031-debug-next-check/scratch/w4-build
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
