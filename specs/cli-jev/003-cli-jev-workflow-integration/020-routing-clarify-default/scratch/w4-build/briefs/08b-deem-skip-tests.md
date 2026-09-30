GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/cli-jev/003-cli-jev-workflow-integration/020-routing-clarify-default

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

TASK: test-only change. Pin the two Deem skip lines no test covers yet: `model` and `bad health response`. Do not edit the script.

FILE (edit): .skilled/skills/sk-doc/sk-create-skill/scripts/tests/score-clarify-default.test.cjs
a. In the `makeStubs` helper, the `cli-deem` stub's `health` case switches on `${STUB_HEALTH:-ok}` with the modes `ok`, `stub` and `down`. Add two modes there and change nothing else in the stub:
   - `model`: echo `{"ok":true,"backend":"torch","model":"deem-9b-v1","model_commit":"mc1","source_commit":"sc1"}` and exit 0.
   - `bad`: echo `not json` and exit 0.
b. Append one test after the last one:
28. `a deem stub with another model or an unreadable health answer skips with a details line`: 30 `'second'` rows (the `writeRowsFile` helper), `base` = `runWithStubs(stubs, ['--score', rows])`. Run `runWithStubs(stubs, ['--score', rows, '--deem', '--out', <fresh tmp dir>], { STUB_HEALTH: 'model' })`: status 0, stdout includes `deem arm skipped: model` and `deem: found="deem-9b-v1"`, and `withoutLines(stdout, ['deem arm skipped: model', 'deem: found="deem-9b-v1"'])` equals `base.stdout`. Run it again with `STUB_HEALTH: 'bad'`: stdout includes `deem arm skipped: bad health response` and `deem: found="not json"`, and without those two lines it equals `base.stdout`.

Accept when: 1 file changed (the test file), `node --check` passes on it, and `grep -c "^test(" <test file>` prints 28.

RUN CONTEXT
- Repo root, a git worktree. Run every command from here:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration
- Spec folder (pre-approved, Gate 3 answered): specs/cli-jev/003-cli-jev-workflow-integration/020-routing-clarify-default
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

Checks to run: `node --check .skilled/skills/sk-doc/sk-create-skill/scripts/tests/score-clarify-default.test.cjs` and `grep -c "^test(" .skilled/skills/sk-doc/sk-create-skill/scripts/tests/score-clarify-default.test.cjs`.

HANDBACK (print exactly this block, filled in, as your last output)
STATUS: DONE | BLOCKED
FILES CHANGED: one line per file: <path> (+<added>/-<removed>)
EDITS: one line per step: <file>:<line> <what changed>
CHECKS: one line per check: <command> -> <result line> (exit <n>)
BLOCKED REASON: <one line, or none>
