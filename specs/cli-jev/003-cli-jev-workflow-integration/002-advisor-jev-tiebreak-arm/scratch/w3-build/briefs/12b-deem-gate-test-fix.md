GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/cli-jev/003-cli-jev-workflow-integration/002-advisor-jev-tiebreak-arm

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

TASK: update one existing test whose expectation predates the Deem arm. Only the vitest file changes.
File: .skilled/skills/system-skill-advisor/runtime/tests/parity/score-jev-tiebreak.vitest.ts. Read it first. The script is not edited.

Why: after a passing Deem health check the script now runs the Deem choice arm, so the test "prints the health line when the pinned torch backend answers" (around lines 396-412) sees more lines than the health line. The fix makes its stub refuse every judgment with exit 2, which stops the arm at once.

Edit that one it() block only:
1. Replace its makeStub body, currently
   `echo '{"ok":true,"backend":"torch","model":"deem-0.8-v1","model_commit":"m1","source_commit":"s1"}'`
   with
   `if [ "$1" = health ]; then echo '{"ok":true,"backend":"torch","model":"deem-0.8-v1","model_commit":"m1","source_commit":"s1"}'; exit 0; fi; exit 2`
2. Replace its expectation on the lines after the prefix (the toEqual with the single health line) with these checks on that same filtered array, called after:
   - after.length is 4
   - after[0] is 'deem: health backend=torch model=deem-0.8-v1 model_commit=m1 source_commit=s1'
   - after[1] starts with 'deem: nothing leaves the machine planned_calls='
   - after[2] is 'deem arm stopped: usage error'
   - after[3] is 'deem: partial_rows=0'
3. Replace its cli-deem.log expectation (toEqual(['health'])) with: the log's non-empty lines number 2, the first is 'health' and the second starts with 'choice -q '.
Keep the test name, the 120_000 timeout, the try and finally, and every other test unchanged.

VERIFY (repo root): grep -c "deem arm stopped: usage error" .skilled/skills/system-skill-advisor/runtime/tests/parity/score-jev-tiebreak.vitest.ts
Accept when: 1 file changed and nothing else; the grep prints 1 or more.

RUN CONTEXT
- Repo root, a git worktree. Run every command from here:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration
- Spec folder (pre-approved, Gate 3 answered): specs/cli-jev/003-cli-jev-workflow-integration/002-advisor-jev-tiebreak-arm
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
