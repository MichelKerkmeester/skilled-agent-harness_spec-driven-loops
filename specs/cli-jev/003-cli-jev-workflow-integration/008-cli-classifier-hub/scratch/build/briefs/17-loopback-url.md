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

TASK: make `cli-deem` accept only a loopback Deem URL, and pin it with two tests. Two EXISTING files; read both first:
  A = .skilled/skills/cli-classifier/cli-deem/scripts/cli-deem.mjs
  B = .skilled/skills/cli-classifier/cli-deem/scripts/tests/cli-deem.test.mjs
Why: callers promise that nothing leaves the machine. Today `baseUrl()` accepts any `http://` host, and a malformed `CLI_DEEM_URL` such as `http://[bad` exits 1 as "unexpected" instead of a usage error.

FILE A: add a constant beside DEFAULT_URL: `const LOOPBACK_HOSTS = ['127.0.0.1', 'localhost', '[::1]'];` (WHATWG `URL` keeps the brackets on an IPv6 hostname). Rewrite `baseUrl()` so it:
1. Parses `process.env.CLI_DEEM_URL || DEFAULT_URL` with `new URL(...)` inside try/catch.
2. Throws `new CliError(`CLI_DEEM_URL must be http:// on 127.0.0.1, localhost or [::1], got: ${configured}`, 2)` when parsing throws, when `protocol !== 'http:'` or when `hostname` is not in LOOPBACK_HOSTS.
3. Otherwise returns the configured string without trailing slashes, as today.
Update its JSDoc @throws line to match. Change nothing else in A.

FILE B:
- In `runCli`, compute the port check only when `new URL(options.url)` parses. Wrap it in try/catch, because a malformed URL is now a case under test.
- Add two tests (each { timeout: 20000 }):
  z1. ['health'] with url 'http://192.0.2.1:9' -> exit 2, stderr contains 'CLI_DEEM_URL must be http://', stdout empty.
  z2. ['health'] with url 'http://[bad' -> exit 2, stderr contains 'CLI_DEEM_URL must be http://', stdout empty.
- Both refuse before any socket opens, so neither needs a fake server.

Accept when: exactly these 2 files changed, nothing else; both pass `node --check`; `grep -cE 'Authorization|Bearer|API_KEY|deem-ctl' A` prints 0; `grep -c 'LOOPBACK_HOSTS' A` prints at least 2. Do NOT run `node --test`: the orchestrator runs it.
VERIFY (paste each with its result line and exit code): `node --check A`, `node --check B`, `grep -cE 'Authorization|Bearer|API_KEY|deem-ctl' A`, `grep -c 'LOOPBACK_HOSTS' A`, `git status --porcelain`.

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
