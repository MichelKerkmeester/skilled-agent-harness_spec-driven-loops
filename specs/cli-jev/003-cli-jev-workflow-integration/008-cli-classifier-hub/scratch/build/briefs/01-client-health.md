GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/cli-jev/003-cli-jev-workflow-integration/008-cli-classifier-hub

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

TASK: create a dependency-free Node CLI, `cli-deem`, with its `health` subcommand, plus its test file. Two NEW files (neither exists yet):
  A = .skilled/skills/cli-classifier/cli-deem/scripts/cli-deem.mjs
  B = .skilled/skills/cli-classifier/cli-deem/scripts/tests/cli-deem.test.mjs
Style: follow .skilled/skills/sk-code/sk-code-opencode/references/javascript/quick-reference.md (box header, numbered ALL-CAPS section dividers, camelCase, UPPER_SNAKE constants, JSDoc on each function). ES module, first line `#!/usr/bin/env node`. Imports only `node:` built-ins (http, fs, os, path, child_process, util). Never write an em dash character in either file. No Authorization header, no key, no `--provider` anywhere.

FILE A behavior (the other subcommands come in later briefs, so keep the dispatch easy to extend):
1. Constants: PINNED_MODEL 'deem-0.8-v1'. DEFAULT_URL 'http://127.0.0.1:8300'. HEALTH_TIMEOUT_MS 2000. HOOK_TIMEOUT_MS 500. DECISION_TIMEOUT_MS 60000. MAX_OPTIONS 26. MAX_QUESTIONS 64. SUBCOMMANDS ['health','noul','choice','score','run']. GIT_ENV_REDIRECTORS = GIT_DIR, GIT_WORK_TREE, GIT_COMMON_DIR, GIT_INDEX_FILE, GIT_OBJECT_DIRECTORY, GIT_ALTERNATE_OBJECT_DIRECTORIES, GIT_CONFIG, GIT_CONFIG_GLOBAL, GIT_CONFIG_SYSTEM, GIT_CONFIG_COUNT, GIT_NAMESPACE, GIT_CEILING_DIRECTORIES.
2. `class CliError extends Error { constructor(message, exitCode) }`. Exit codes: 0 ok, 1 unexpected response, 2 usage or config, 3 refused backend or model, 4 unreachable, timeout or 5xx, 130 interrupted.
3. `baseUrl()`: `process.env.CLI_DEEM_URL` or DEFAULT_URL, with trailing slashes removed. Not starting with `http://` -> CliError('CLI_DEEM_URL must be an http:// URL', 2). `deemHome()`: `process.env.CLI_DEEM_HOME` or `path.join(os.homedir(), '.local', 'share', 'deem')`.
4. `requestJson(method, url, body, timeoutMs)` -> Promise<{status, json, text}>, via `http.request`. With a body: send `JSON.stringify(body)` with Content-Type application/json and Content-Length. Socket error -> CliError(`Deem unreachable: ${code or message}`, 4). `req.setTimeout(timeoutMs)` fires -> destroy and reject CliError(`Deem timed out after ${timeoutMs} ms`, 4). Status >= 500 -> CliError(`Deem HTTP ${status}: ${text}`, 4). Body that is not JSON -> json = null (the caller decides). Reject each failure once.
5. `parseCli(argv)` with `util.parseArgs({ args, allowPositionals: true, strict: true, options: question (-q, string), state (-s, string), option (-o, string, multiple), level (-l, string, multiple), value (boolean), hook (boolean) })`. A parseArgs error -> CliError(its message, 2). No subcommand, or one outside SUBCOMMANDS -> CliError('usage: cli-deem <health|noul|choice|score|run> [flags]', 2). Return { subcommand, positionals: rest, values }.
6. `health(values)`: any of question, state, option, level or value set -> CliError('health takes only --hook', 2). GET `${baseUrl()}/health` within HOOK_TIMEOUT_MS when `--hook`, else HEALTH_TIMEOUT_MS. Status other than 200 -> CliError(`Deem health HTTP ${status}`, 1). json not a plain object, or `json.status !== 'ok'` -> CliError('unexpected health response', 1). Backend passes only when it is 'torch', or a string that starts with 'ensemble:' and contains no 'stub'; else CliError(`refused backend: ${backend}`, 3). `json.model !== PINNED_MODEL` -> CliError(`refused model: ${model}, expected deem-0.8-v1`, 3). Then the commit pair: model commit = `path.basename(fs.readlinkSync(<home>/models/current))`, failure -> CliError(`missing checkpoint link: <that path>`, 2). Source commit = `execFileSync('git', ['-C', <home>/src, 'rev-parse', 'HEAD'])` trimmed, with an env copy that drops every GIT_ENV_REDIRECTORS key (a caller inside a git hook has GIT_DIR set, which would point rev-parse at the wrong repository), stdio ['ignore','pipe','ignore'], failure -> CliError(`missing source tree: <that path>`, 2). Print one line to stdout: `JSON.stringify({ ok: true, backend, model, model_commit, source_commit })`. Never start, stop or update the server.
7. `main()`: `process.on('SIGINT')` prints `{"ok":false,"error":"interrupted"}` to stderr and exits 130. Dispatch the subcommand (noul, choice, score and run throw CliError(`not implemented: ${subcommand}`, 2) for now). A CliError prints `JSON.stringify({ ok: false, error: message })` to stderr and sets `process.exitCode` to its exitCode. Any other error prints the same shape with `unexpected: ${message}` and exit 1. Call `main()` at the bottom.

FILE B (node:test, node:assert/strict; async `spawn` only, because the fake server lives in the test process and a sync spawn would deadlock it):
- `startFake(handler)`: `http.createServer` on port 0, host 127.0.0.1; records every request as { method, url, headers, body (parsed JSON or null) } in `requests`; returns { url, requests, close }. `closedUrl()`: listen on port 0, read the port, close, return its URL.
- `runCli(args, { url, home, input })`: spawn `process.execPath` with A, env = process.env minus GIT_ENV_REDIRECTORS plus CLI_DEEM_URL=url and CLI_DEEM_HOME=home; write `input ?? ''` then end stdin; resolve { code, stdout, stderr }. Assert the URL port is never 8300.
- `makeHome()`: mkdtemp; create `models/<40 hex chars>/`; symlink `models/current` to it; `git init -q src`; commit with `git -C src -c core.hooksPath=/dev/null -c commit.gpgsign=false -c user.name=t -c user.email=t@t commit --allow-empty -q -m x`; return { home, modelCommit, sourceCommit }.
- Tests, each { timeout: 20000 }, input -> expected:
  a. /health 200 {status:'ok',backend:'torch',model:'deem-0.8-v1'} + makeHome -> exit 0, stdout JSON backend 'torch', model 'deem-0.8-v1', model_commit and source_commit equal makeHome's pair.
  b. backend 'stub' -> exit 3. c. backend 'ensemble:torch+stub' -> exit 3. d. model 'deem-1.5' -> exit 3.
  e. closedUrl() -> exit 4. f. /health answers 500 -> exit 4. g. healthy server, home without models/current -> exit 2, stderr contains 'missing checkpoint link'.
  h. args ['bogus'] -> exit 2 and the fake logs 0 requests. i. ['health', '-q', 'x'] -> exit 2.

Accept when: 2 files created (A and B), nothing else changed; both pass `node --check`; `grep -cE 'Authorization|Bearer|API_KEY|deem-ctl' A` prints 0. Do NOT run `node --test`: the orchestrator runs it.
VERIFY (paste each with its result line and exit code): `node --check A`, `node --check B`, `grep -cE 'Authorization|Bearer|API_KEY|deem-ctl' A`, `git status --porcelain`.

RUN CONTEXT
- Repo root, a git worktree. Run every command from here:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration
- Spec folder (pre-approved, Gate 3 answered): specs/cli-jev/003-cli-jev-workflow-integration/008-cli-classifier-hub
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
