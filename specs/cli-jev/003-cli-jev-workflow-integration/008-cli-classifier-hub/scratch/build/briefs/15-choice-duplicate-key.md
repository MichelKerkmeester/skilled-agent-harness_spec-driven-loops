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

TASK: make `cli-deem choice` refuse a repeated option KEY before any request is sent, and pin it with one test. Two EXISTING files; read both first:
  A = .skilled/skills/cli-classifier/cli-deem/scripts/cli-deem.mjs
  B = .skilled/skills/cli-classifier/cli-deem/scripts/tests/cli-deem.test.mjs
Why: `choice -q Pick -s x -o a=Alpha -o a=Beta` today maps both descriptions to key `a`, so the printed key cannot tell the caller which option won, and the command still exits 0.

FILE A: in `buildQuestion`, inside the `choice` loop over the `-o` values (the loop that already throws `duplicate option description: ${description}`), track the keys seen so far in a Set. When a key repeats, throw `new CliError(`duplicate option key: ${key}`, 2)`. Place the check directly after the existing duplicate-description check. Change nothing else in A. `run` needs no change: it passes no key map, because a request in Deem's shape lists options without keys.

FILE B, add one test after the existing duplicate-description test (reuse startFake and runCli; { timeout: 20000 }; the fake answers any POST with a valid 'deem-0.8-v1' choice answer naming 'Alpha'):
  x2. ['choice','-q','Pick','-s','x','-o','a=Alpha','-o','a=Beta'] -> exit 2, stderr contains 'duplicate option key', 0 requests logged.

Accept when: exactly these 2 files changed, nothing else; both pass `node --check`; `grep -cE 'Authorization|Bearer|API_KEY|deem-ctl' A` prints 0; `grep -c 'duplicate option key' A` prints 1. Do NOT run `node --test`: the orchestrator runs it.
VERIFY (paste each with its result line and exit code): `node --check A`, `node --check B`, `grep -cE 'Authorization|Bearer|API_KEY|deem-ctl' A`, `grep -c 'duplicate option key' A`, `git status --porcelain`.

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
