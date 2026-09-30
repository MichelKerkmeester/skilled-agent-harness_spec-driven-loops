GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/cli-jev/003-cli-jev-workflow-integration/029-p0-reread-order/scratch/w4-build

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

TASK: fix a scoping error in one test. One change in T. Change nothing in S.
S = `.skilled/skills/system-deep-loop/runtime/scripts/score-severity-replay.cjs` (read only).
T = `.skilled/skills/system-deep-loop/runtime/tests/unit/score-severity-replay.vitest.ts`. Read it first.
WHY: the test `the Jev gate skips on no credential, a missing binary and a wrong version` fails with `ReferenceError: stubs is not defined`. Its `cases` array gives each case `pathLine: (stubs) => ...`, but the wrong-version case's `tail` array reads `stubs` directly (`jev: found="0.2.3" path=${path.join(stubs, 'jev')}`), and `stubs` exists only inside the loop.
EDIT: make `tail` a function of the stub folder in that test, the same way `pathLine` is: change its type to `(stubs: string) => string[]`, write every case's `tail` as `(stubs) => [...]` (the cases that do not use `stubs` just ignore it), and in the loop call `entry.tail(stubs)` where it now spreads `entry.tail`. Keep everything else byte-identical.
VERIFY (from `.skilled/skills/system-deep-loop/runtime`), paste each result line:
  npx vitest run tests/unit/score-severity-replay.vitest.ts
Accept when: only T changed; the run prints `Tests  27 passed (27)`. If a test still fails, stop and report BLOCKED with the failing test names and the first error line of each.

RUN CONTEXT
- Repo root, a git worktree. Run every command from here:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration
- Spec folder (pre-approved, Gate 3 answered): specs/cli-jev/003-cli-jev-workflow-integration/029-p0-reread-order/scratch/w4-build
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
