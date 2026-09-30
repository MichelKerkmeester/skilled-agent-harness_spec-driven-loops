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

TASK: add the Jev gate behind --jev: one identity line, then three checks; each failure prints a skip line, leaves the census output untouched and still exits 0.
R = .skilled/skills/system-skill-advisor/runtime. Files: R/scripts/routing-accuracy/score-jev-tiebreak.mjs and R/tests/parity/score-jev-tiebreak.vitest.ts. Read both first.

In the script:
1. Add accessSync, constants and statSync to the node:fs import, `import { spawnSync } from 'node:child_process';` and delimiter to the node:path import. Add const JEV_VERSION = 'jev 0.6.2'; beside the other constants.
2. Helper function which(name, env), with JSDoc: for each non-empty dir in (env.PATH ?? '').split(delimiter), candidate = join(dir, name); return candidate when statSync(candidate).isFile() and accessSync(candidate, constants.X_OK) both succeed (catch and continue). Return null when none does.
3. `export function jevGate(ctx)` with JSDoc, ctx = { out, env, timeoutMs }, returning { passed, path, provider }:
   a. provider = ctx.env.JEV_PROVIDER || 'official'; path = which('jev', ctx.env); ctx.out(`jev: path=${path ?? 'none'} provider=${provider}`).
   b. No path: out 'jev arm skipped: jev not on PATH' and return passed false.
   c. opts = { env: ctx.env, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: ctx.timeoutMs }. Run spawnSync(path, ['--version'], opts). found = the first line of (stdout ?? '').trim(), '' when empty. When found !== JEV_VERSION: out 'jev arm skipped: version', then out `jev: found=${JSON.stringify(found)} path=${path}`, return passed false.
   d. Run spawnSync(path, ['auth', 'status', '--provider', provider], opts). When status is not 0: out 'jev arm skipped: no credential' and return passed false.
   e. Return { passed: true, path, provider }.
4. In main keep the parsed flags (const { values } = parseArgs(...)), set const env = deps.env ?? process.env and const timeoutMs = deps.timeoutMs ?? 90000. After the census lines and the voided return, when values.jev is true call jevGate({ out, env, timeoutMs }). main still returns 0.

In the vitest file:
- Module-level helpers: runScript(args: string[], env: NodeJS.ProcessEnv) returns spawnSync(process.execPath, [SCRIPT, ...args], { encoding: 'utf8', timeout: 110_000, env }); makeStub(name: string, body: string) makes a mkdtemp dir, writes join(dir, name) with mode 0o755 and content `#!/bin/sh\nD=$(dirname "$0")\necho "$*" >> "$D/${name}.log"\n${body}\n`, and returns the dir; and a cached defaultStdout() that returns runScript([], process.env).stdout, run once.
- describe('score-jev-tiebreak jev gate'), each it() with a 120_000 timeout, env = { ...process.env, PATH: `${stub}${delimiter}${process.env.PATH}` } unless stated, and JEV_PROVIDER deleted unless stated. For each: status 0, stdout starts with defaultStdout(), and the lines after that prefix are exactly the list given:
  1. body `case "$1" in --version) echo 'jev 0.6.2';; auth) exit 3;; esac`, JEV_PROVIDER 'openrouter', args ['--jev']: [`jev: path=${stub}/jev provider=openrouter`, 'jev arm skipped: no credential']; jev.log lines are exactly ['--version', 'auth status --provider openrouter'].
  2. body `case "$1" in --version) echo '0.2.3';; esac`, args ['--jev']: [`jev: path=${stub}/jev provider=official`, 'jev arm skipped: version', `jev: found="0.2.3" path=${stub}/jev`]; jev.log lines are exactly ['--version'].
  3. no stub, env PATH '/usr/bin:/bin', args ['--jev']: ['jev: path=none provider=official', 'jev arm skipped: jev not on PATH'].
  Remove each stub dir in a finally block.

VERIFY (repo root): node --check .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-jev-tiebreak.mjs
  grep -cE 'API_KEY|TYPESAFE' .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-jev-tiebreak.mjs
Accept when: 2 files changed and nothing else; node --check exits 0; the grep prints 0.

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
