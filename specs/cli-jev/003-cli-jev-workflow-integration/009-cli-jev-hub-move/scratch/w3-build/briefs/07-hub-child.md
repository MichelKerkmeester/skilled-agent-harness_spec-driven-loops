GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/cli-jev/003-cli-jev-workflow-integration/009-cli-jev-hub-move

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

TASK: the same one-line literal edit in two byte-identical JavaScript files (runtime copy and its
authored twin):
  .skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs
  specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/014-runtime-engine/lib/compiled-route.cjs

Context: the compiled-routing hub map must name the cli-classifier hub and its renamed rollout
folder in place of the retired cli-jev hub. The fleet stays at seven hubs.

EDIT, line 35 of each file. Old line (exact):
  'cli-jev': '009-parent-hub-rollout/008-cli-jev',
New line (exact):
  'cli-classifier': '009-parent-hub-rollout/008-cli-classifier',
Keep the two-space indent and trailing comma. Change nothing else in either file.

Run each check and report its result line and exit code:
  node --check .skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs   (expect exit 0)
  node --check specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/014-runtime-engine/lib/compiled-route.cjs   (expect exit 0)
  cmp .skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/014-runtime-engine/lib/compiled-route.cjs   (expect no output, exit 0)
  grep -c "cli-jev" .skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs   (expect 0)

Accept when: 2 files changed, each with exactly 1 line replaced, and the two files stay byte-identical.
No other file differs.

RUN CONTEXT
- Repo root, a git worktree. Run every command from here:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration
- Spec folder (pre-approved, Gate 3 answered): specs/cli-jev/003-cli-jev-workflow-integration/009-cli-jev-hub-move
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
