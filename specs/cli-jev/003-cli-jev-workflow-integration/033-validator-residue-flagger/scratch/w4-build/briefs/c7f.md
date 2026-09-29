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

TASK: let the script's git calls return output larger than 1 MB. One change in S and one new test in T.
S = `.skilled/skills/system-deep-loop/deep-review/scripts/score-residue-flagger.cjs`. Read it first.
T = `.skilled/skills/system-deep-loop/deep-review/scripts/tests/score-residue-flagger.test.cjs`. Read it first.
WHY: the default run on this repository exits 1 with `Error: git ls-files -z exited null`. `git ls-files -z` prints about 15.7 MB here, and `spawnSync` stops at its default 1 MB `maxBuffer` with `ENOBUFS`, so `result.status` is null. The tests pass only because their temp repositories are small. The sibling `.skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs` line 81 passes `maxBuffer: 268435456` for the same reason.
EDIT 1 (S): in `git(repoRoot, args)` (near line 72), add `maxBuffer: 268435456` to the `spawnSync` options, with a one-line comment above the call saying a large repository's path list and file reads exceed the 1 MB default. Keep everything else byte-identical.
EDIT 2 (T): add one test `git output above 1 MB` after the test `commit resolution`. It makes a temp repository with the file's own helpers (`tempDir`, `writeFiles`, `runGit`), commits one tracked file of 2,000,000 ASCII characters (for example `'x'.repeat(2000000)`), then asserts `S.readAtCommit(root, <that commit>, <that path>).length` equals 2000000. Reuse how `makeFixture` commits (it already passes `-c core.hooksPath=/dev/null`); get the commit with `runGit(root, ['rev-parse', 'HEAD'])` or the way the file already does.
VERIFY (repo root), paste each result line:
  node --check .skilled/skills/system-deep-loop/deep-review/scripts/score-residue-flagger.cjs
  node --test .skilled/skills/system-deep-loop/deep-review/scripts/tests/score-residue-flagger.test.cjs
  node .skilled/skills/system-deep-loop/deep-review/scripts/score-residue-flagger.cjs > /dev/null; echo "exit=$?"
Accept when: only S and T changed; the test run prints `pass 34` and `fail 0`; the last command prints `exit=0`. If any check fails, stop and report BLOCKED with the failing test names and the first error line.

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
