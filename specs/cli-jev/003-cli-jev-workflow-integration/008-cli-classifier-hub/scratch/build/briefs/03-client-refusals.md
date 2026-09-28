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

TASK: make `cli-deem` refuse bad `noul`, `choice` and `score` flags BEFORE any request is sent, and pin each refusal with a test. Two EXISTING files; read both first:
  A = .skilled/skills/cli-classifier/cli-deem/scripts/cli-deem.mjs
  B = .skilled/skills/cli-classifier/cli-deem/scripts/tests/cli-deem.test.mjs
Why: Deem's torch backend reads at most 26 options and answers more with HTTP 400, and a duplicate description would make the chosen option map back to two keys. Refusing in the client costs no request and names the cap.

FILE A: in `buildQuestion` (it already runs before `readState` and before any socket opens), add these checks in this order, each a CliError with exit 2:
1. `-o` given to a subcommand other than choice -> '-o is only valid with choice'. `-l` given to a subcommand other than score -> '-l is only valid with score'.
2. choice with no `-o` -> 'choice needs at least one -o KEY=DESCRIPTION'. score with no `-l` -> 'score needs at least one -l DESCRIPTION'.
3. choice: two options with the same description (after the split at the first '=') -> `duplicate option description: ${description}`.
4. choice: more than MAX_OPTIONS options -> `choice exceeds the 26-option cap (got ${count})`. Exactly 26 is allowed and sent.
Change nothing else in A.

FILE B, add these tests (reuse startFake and runCli; each { timeout: 20000 }; the fake answers every POST with a valid 'deem-0.8-v1' choice answer naming 'option 1'):
  r. choice with 26 options (keys o1..o26, descriptions 'option 1'..'option 26') -> exit 0, exactly 1 request, body.questions.answer.options has length 26.
  s. choice with 27 options (o1..o27) -> exit 2, stderr contains '26-option cap', 0 requests.
  t. ['choice','-q','x','-s','y','-o','a=Same','-o','b=Same'] -> exit 2, stderr contains 'duplicate option description', 0 requests.
  u. ['noul','-q','x','-s','y','-o','a=b'] -> exit 2, 0 requests.
  v. ['score','-q','x','-s','y'] -> exit 2, 0 requests.
  w. ['choice','-q','x','-s','y'] -> exit 2, 0 requests.

Accept when: exactly these 2 files changed, nothing else; both pass `node --check`; `grep -cE 'Authorization|Bearer|API_KEY|deem-ctl' A` prints 0. Do NOT run `node --test`: the orchestrator runs it.
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
