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

TASK: add two exported helpers the model arms will share, spawnCall (one bounded child process) and writeCall (one JSONL record), with their tests.
R = .skilled/skills/system-skill-advisor/runtime. Files: R/scripts/routing-accuracy/score-jev-tiebreak.mjs and R/tests/parity/score-jev-tiebreak.vitest.ts. Read both first.

In the script:
1. Change the child_process import to `import { spawn, spawnSync } from 'node:child_process';` and add appendFileSync and mkdirSync to the node:fs import.
2. After verdictLine add, with JSDoc blocks:
   a. `export function spawnCall(file, args, stdinText, env, timeoutMs)` returning a Promise of { code, stdout, stderr, wallMs, timedOut } that resolves exactly once:
      - start = Date.now(); child = spawn(file, args, { env, stdio: ['pipe', 'pipe', 'pipe'] }). Collect stdout and stderr as utf8 text.
      - Write stdinText to child.stdin and end it. Attach child.stdin.on('error', () => {}) so a child that exits early cannot crash the parent. Closing stdin matters: the Python jev reads stdin to EOF and exits 2 on an inherited terminal.
      - A timer of timeoutMs kills the child with SIGKILL and resolves at once with timedOut true and code null, without waiting for 'close' (a grandchild can hold the pipes open).
      - On 'close' resolve with code = the exit code (null becomes -1) and timedOut false. On a spawn 'error' resolve with code 127 and stderr = the error message. Clear the timer on resolve. wallMs = Date.now() - start.
   b. `export function writeCall(outDir, record)`: when outDir is a non-empty string, mkdirSync(outDir, { recursive: true }) and appendFileSync(join(outDir, 'calls.jsonl'), `${JSON.stringify(record)}\n`). Otherwise do nothing.

In the vitest file add spawnCall and writeCall to the import (and readFileSync to the node:fs import if missing), then describe('score-jev-tiebreak call helpers') with:
1. await spawnCall('/bin/sh', ['-c', 'cat; exit 3'], 'hello', process.env, 5000) has code 3, stdout 'hello', timedOut false and a wallMs >= 0.
2. const t0 = Date.now(); await spawnCall('/bin/sh', ['-c', 'exec sleep 5'], '', process.env, 200) has timedOut true and code null, and Date.now() - t0 is below 2000.
3. await spawnCall('/nonexistent/jev-tiebreak-missing', [], '', process.env, 1000) has code 127.
4. With dir = mkdtempSync(join(tmpdir(), 'jev-tiebreak-calls-')): writeCall(dir, { a: 1 }) twice, then the file join(dir, 'calls.jsonl') holds exactly two lines, each parsing to { a: 1 }. writeCall(undefined, { a: 1 }) does not throw. Remove dir in a finally block.

VERIFY (repo root): node --check .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-jev-tiebreak.mjs
  node -e "import('./.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-jev-tiebreak.mjs').then(async (m) => { const r = await m.spawnCall('/bin/sh', ['-c', 'cat; exit 3'], 'hi', process.env, 5000); console.log(r.code, r.stdout, r.timedOut); })"
Accept when: 2 files changed and nothing else; node --check exits 0; the node -e line prints `3 hi false`.

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
