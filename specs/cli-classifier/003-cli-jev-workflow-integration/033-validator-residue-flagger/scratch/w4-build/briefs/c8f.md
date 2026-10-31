GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/cli-jev/003-cli-jev-workflow-integration/033-validator-residue-flagger/scratch/w4-build

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

TASK: list the review corpus from HEAD's tree, not the git index. One change in S. Change nothing in T.
S = `.skilled/skills/system-deep-loop/deep-review/scripts/score-residue-flagger.cjs`. Read it first, especially `trackedFiles`, `readAtCommit` and `buildCensus`.
WHY: `trackedFiles` runs `git ls-files`, which lists the index, but `buildCensus` then reads each review file with `git show HEAD:<path>`. A review file that is staged but not committed is in the index and not at HEAD, so `git show` exits 128 and the whole run aborts. A file staged for deletion is the reverse: HEAD holds it and the census leaves it out. The census measures HEAD, so its path list must come from HEAD too.
EDIT:
1. In `trackedFiles`, replace `['ls-files', '-z']` with `['ls-tree', '-r', '-z', '--name-only', 'HEAD']`. Keep the split and the filter.
2. Rewrite its JSDoc summary line to: list the paths in HEAD's tree in git's own order. Add one sentence: every read is at a commit, so a path only the index holds is left out, and a path staged for deletion stays in. Keep the `@param` and `@returns` tags (the `@returns` text becomes `Every path in HEAD's tree.`).
Change nothing else. No comment may name a spec path, a phase number or a requirement id.
VERIFY (repo root), paste each result line:
  node --check .skilled/skills/system-deep-loop/deep-review/scripts/score-residue-flagger.cjs
  node --test .skilled/skills/system-deep-loop/deep-review/scripts/tests/score-residue-flagger.test.cjs
Accept when: only S changed; `pass 35` and `fail 0`. If a test fails, stop and report BLOCKED with the failing test names and the first error line.

RUN CONTEXT
- Repo root, a git worktree. Run every command from here:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration
- Spec folder (pre-approved, Gate 3 answered): specs/cli-jev/003-cli-jev-workflow-integration/033-validator-residue-flagger/scratch/w4-build
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
