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

TASK: implement the `run` subcommand of `cli-deem` (a batched request written in Deem's own shape), with the tests that pin it. Two EXISTING files; read both first:
  A = .skilled/skills/cli-classifier/cli-deem/scripts/cli-deem.mjs
  B = .skilled/skills/cli-classifier/cli-deem/scripts/tests/cli-deem.test.mjs
Why the caps: Deem's server refuses more than 64 questions per request and more than 26 options per choice with HTTP 400. The client counts first, so an oversized batch costs no request.

FILE A: replace the `not implemented` branch for `run` with `runBatch(positionals, values)`, reusing `decide` and `translateAnswer`:
1. Any of question, state, option, level or value set -> CliError('run takes a request file or - and --hook only', 2). (`--value` is refused here because a batch has no single primary value.) No positional -> CliError('run needs a request file or -', 2).
2. Read the request: '-' -> stdin (when `process.stdin.isTTY` throw CliError('request is required as a file or stdin', 2)); a path -> `fs.readFileSync(path, 'utf8')`, failure -> CliError(`cannot read request file: ${message}`, 2). `JSON.parse` failure -> CliError(`invalid request JSON: ${message}`, 2). Not a plain object holding both `state` and `questions` -> CliError('request must be an object containing state and questions', 2).
3. Question specs by id: a plain-object `questions` -> its entries. An array -> each item's `id` (or `qid`) paired with the item. Anything else -> CliError('questions must be an object or a list', 2). More than MAX_QUESTIONS specs -> CliError(`run exceeds the 64-question cap (got ${count})`, 2); exactly 64 is sent. A spec of type 'choice' whose `options` array is longer than MAX_OPTIONS -> CliError(`question ${id} exceeds the 26-option cap (got ${count})`, 2).
4. Send the request object unchanged with `decide(request, values.hook ? HOOK_TIMEOUT_MS : DECISION_TIMEOUT_MS)`. Translate every entry of `json.answers` with `translateAnswer(answer, specById[key], null)`; a key with no spec -> CliError(`unexpected response: unknown question ${key}`, 1). With no key map a choice answer keeps Deem's option text, since a Deem-shaped request lists options without keys. Print `JSON.stringify({ ...json, answers: translated })`.

FILE B, add these tests (reuse startFake, runCli, closedUrl; each { timeout: 20000 }; write request files into an mkdtemp dir):
  x. request file with 64 noul questions (keys q1..q64); the fake answers every key with `{ type:'noul', value:0.5, confidence:0, temperature:1 }` under model 'deem-0.8-v1' -> exit 0, exactly 1 request, the body's questions has 64 keys, stdout answers.q1.noul === 0.5.
  y. the same with 65 questions -> exit 2, stderr contains '64-question cap', 0 requests.
  z. ['run','-'] with input `{"state":"s","questions":{"u":{"type":"noul","instructions":"urgent?"},"s":{"type":"score","instructions":"severity?","levels":["lo","hi"]}}}`; the fake answers u `{ type:'noul', value:0.9 }` and s `{ type:'score', level:'hi', probabilities:{ lo:0.3, hi:0.7 }, expected:0.7 }` -> exit 0; stdout answers.u.noul 0.9, answers.s.score 1, answers.s.probabilities { '0':0.3, '1':0.7 }.
  aa. ['run','-','--value'] with the same input -> exit 2, 0 requests.
  bb. no server (closedUrl) -> each of these exits 4: ['health']; ['noul','-q','x','-s','y']; ['choice','-q','x','-s','y','-o','a=A','-o','b=B']; ['score','-q','x','-s','y','-l','lo','-l','hi']; ['run','-'] with test z's input.

Accept when: exactly these 2 files changed, nothing else; both pass `node --check`; `grep -cE 'Authorization|Bearer|API_KEY|deem-ctl' A` prints 0; `grep -c 'not implemented' A` prints 0. Do NOT run `node --test`: the orchestrator runs it.
VERIFY (paste each with its result line and exit code): `node --check A`, `node --check B`, `grep -cE 'Authorization|Bearer|API_KEY|deem-ctl' A`, `grep -c 'not implemented' A`, `git status --porcelain`.

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
