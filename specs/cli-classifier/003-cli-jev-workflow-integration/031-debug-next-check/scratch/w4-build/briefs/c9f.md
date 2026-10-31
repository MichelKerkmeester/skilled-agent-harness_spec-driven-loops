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

TASK: keep the seam search from finding this census's own files. One change in S. Change nothing in T.
S = `.skilled/skills/system-spec-kit/runtime/scripts/debug-next-check/score-debug-next-check.mjs`. Read it first, especially `SEAM_PATTERN`, `SEAM_FIXTURES` and `seamSearch`.
WHY: `seamSearch` runs `git grep -l next_check` over tracked files outside `specs/`. This script, its test and its catalog entry all hold the literal `next_check`. Today they are untracked, so the run prints `seam: none`, but once they are committed every default run would list them as caller seams, and every doc that states `seam: none` would be false. They describe the census, they do not call it.
EDIT:
1. Right after the `SEAM_FIXTURES` constant, add a constant `SEAM_SELF` holding the two pathspecs `':(exclude,glob)**/*debug-next-check*'` and `':(exclude,glob)**/*debug-next-check*/**'`, as an array, with a one-line JSDoc: the census's own script, test and docs carry the pattern it searches for and are not callers, so every path whose name holds `debug-next-check` is left out.
2. In `seamSearch`, pass them after `SEAM_FIXTURES`: `['grep', '-l', SEAM_PATTERN, '--', ':!specs', SEAM_FIXTURES, ...SEAM_SELF]`.
3. In `seamSearch`'s JSDoc, add that paths named for this census are left out.
Change nothing else. No comment may name a spec path, a phase number or a requirement id.
VERIFY (repo root), paste each result line:
  node --check .skilled/skills/system-spec-kit/runtime/scripts/debug-next-check/score-debug-next-check.mjs
  node .skilled/skills/system-spec-kit/runtime/scripts/debug-next-check/score-debug-next-check.mjs
Accept when: only S changed, the check exits 0, and the default run prints `seam: none` first.

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
