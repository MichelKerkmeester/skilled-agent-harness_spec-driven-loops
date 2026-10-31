GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/cli-jev/003-cli-jev-workflow-integration/006-goal-criteria-lint

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

TASK: rewrite three comment spots that carry the em dash character (U+2014) in two files. Change nothing else.
G = .skilled/skills/sk-doc/sk-create-goal/scripts. Read each line before editing it.

EDIT 1, G/lint-goal-criteria.cjs:2 (the box title line). Replace the whole line with exactly this (the box keeps its width):
// ║ lint-goal-criteria: advisory lint for goal criteria rules 4 and 5       ║

EDIT 2, G/lint-goal-criteria.cjs:573-574, the first two lines of main's JSDoc (they start ` * Run one lint pass and print it` and ` * then every read error to stderr.`). Replace those two lines with exactly:
 * Run one lint pass and print it, as JSON with --json or as text lines
 * otherwise, then every read error to stderr. The lint is advisory, so this always

EDIT 3, G/tests/lint-goal-criteria.test.cjs:2 (the box title line). Replace the whole line with exactly:
// ║ lint-goal-criteria tests: lexical rule and parser controls              ║

VERIFY (repo root):
  node --check .skilled/skills/sk-doc/sk-create-goal/scripts/lint-goal-criteria.cjs
  node -e "for (const f of process.argv.slice(1)) console.log(f, (require('fs').readFileSync(f, 'utf8').match(/\u2014/g) || []).length)" .skilled/skills/sk-doc/sk-create-goal/scripts/lint-goal-criteria.cjs .skilled/skills/sk-doc/sk-create-goal/scripts/tests/lint-goal-criteria.test.cjs
Accept when: 2 files changed and nothing else; the lint file differs only at lines 2, 573 and 574 and the test file only at line 2; node --check exits 0; the node -e line prints 0 for both files.

RUN CONTEXT
- Repo root, a git worktree. Run every command from here:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration
- Spec folder (pre-approved, Gate 3 answered): specs/cli-jev/003-cli-jev-workflow-integration/006-goal-criteria-lint
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
