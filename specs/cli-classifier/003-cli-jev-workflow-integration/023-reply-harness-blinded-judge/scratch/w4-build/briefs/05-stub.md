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

TASK: add stub `cli-deem` and `jev` binaries to the test file, so later tests can put logging fakes first on PATH.
T = .skilled/skills/sk-communication/benchmark/reply-harness/judge-agreement.test.mjs (exists; the only file you edit)
D = specs/cli-jev/003-cli-jev-workflow-integration/023-reply-harness-blinded-judge/scratch/w4-build/drafts/stub-main.js (read only)
Read T and D in full first. Keep every existing line of T unchanged.

STEP 1. In T, after the `makeFixture` helper, paste D lines 1-36 verbatim: the one comment line and the whole `function stubMain() { ... }`. Do not reformat it, do not change a character. It uses `require` on purpose: T never calls it, it is written to disk as its own CommonJS program.

STEP 2. In T, directly below it, add one constant and three helpers:
- `const STUB_SOURCE = \`#!/usr/bin/env node\n(${stubMain.toString()})();\n\`;`
- `makeStubBin(root)`: creates `path.join(root, 'bin')`, writes STUB_SOURCE to `bin/cli-deem` and `bin/jev` with `{ mode: 0o755 }`, and returns the bin path.
- `stubEnv(root, extra = {})`: returns `{ ...process.env, PATH: \`${path.join(root, 'bin')}${path.delimiter}${process.env.PATH}\`, STUB_LOG: path.join(root, 'stub.log'), ...extra }`.
- `readStubLog(root)`: the non-empty lines of `path.join(root, 'stub.log')`, or `[]` when the file does not exist.
Import `spawnSync` from `node:child_process` for the tests below.

STEP 3. Add two tests after the existing ones, each on a fresh `fs.mkdtempSync(path.join(os.tmpdir(), 'judge-agreement-test-'))` root removed in a `finally`:
17. After `makeStubBin(root)`, `spawnSync('jev', ['--version'], { env: stubEnv(root), encoding: 'utf8' })` has status 0 and stdout `'jev 0.6.2\n'`, and `readStubLog(root)` is one line starting `'jev\t--version'`. With `extra` `{ STUB_HEALTH: 'stub' }`, `spawnSync('cli-deem', ['health'], ...)` has status 3.
18. Write `answers.json` in root as `{ [\`${sha256Hex('state')}|Q\`]: [2, 2, 0] }` and pass `{ STUB_ANSWERS: <that path> }`. Three runs of `spawnSync('jev', ['score', '--provider', 'official', '-q', 'Q', '-l', 'a', '-l', 'b', '-l', 'c'], { env, input: 'state', encoding: 'utf8' })` print JSON whose `answers.answer.score` is 2, then 2, then 0. Import `sha256Hex` from the script.

Accept when: 1 file changed (T), no other file changed, `node --check T` passes, and `grep -c "function stubMain" T` prints 1.
Checks you run: `node --check T`, `grep -c "function stubMain" T`. Do not run `node --test`: the orchestrator runs it.

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
