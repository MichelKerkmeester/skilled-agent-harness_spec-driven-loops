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

TASK: add tests that pin the `--hook` budget and the health timeout of `cli-deem`. ONE EXISTING test file; read it first, and read the client for context only:
  B = .skilled/skills/cli-classifier/cli-deem/scripts/tests/cli-deem.test.mjs   (the only file you edit)
  A = .skilled/skills/cli-classifier/cli-deem/scripts/cli-deem.mjs              (read only, do not edit)
Why: `--hook` sets a 500 ms budget and a timeout exits 4, but no test covers either, so a regression that drops the hook budget would pass.

FILE B, add two tests at the end (reuse startFake and runCli; each { timeout: 20000 }):
- Both use a fake whose handler never answers. It pushes each `res` into a local `held` array and returns. In a `finally`, run `for (const res of held) res.socket?.destroy()` before `await fake.close()`, so close never waits on an open socket.
- Time each run with `performance.now()` from `node:perf_hooks`.
  y1. ['health','--hook'] against the silent fake -> exit 4, stderr contains 'timed out after 500 ms', elapsed under 1500 ms (well under the 2,000 ms health budget).
  y2. ['health'] against the silent fake -> exit 4, stderr contains 'timed out after 2000 ms', elapsed at least 1900 ms and under 6000 ms.
Add the `node:perf_hooks` import beside the other `node:` imports only if it is not already there. Change nothing else in B.

Accept when: exactly this 1 file changed, nothing else; `node --check B` passes; `grep -c -- '--hook' B` prints at least 1; `grep -c 'timed out after' B` prints at least 2. Do NOT run `node --test`: the orchestrator runs it.
VERIFY (paste each with its result line and exit code): `node --check B`, `grep -c -- '--hook' B`, `grep -c 'timed out after' B`, `git status --porcelain`.

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
