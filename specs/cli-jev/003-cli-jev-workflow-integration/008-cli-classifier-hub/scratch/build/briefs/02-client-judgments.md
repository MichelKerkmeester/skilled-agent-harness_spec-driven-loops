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

TASK: implement the `noul`, `choice` and `score` subcommands of the existing `cli-deem` client, with the tests that pin them. Two EXISTING files; read both first:
  A = .skilled/skills/cli-classifier/cli-deem/scripts/cli-deem.mjs
  B = .skilled/skills/cli-classifier/cli-deem/scripts/tests/cli-deem.test.mjs
Keep A's style (numbered sections, JSDoc, `node:` imports only, no em dash). Deem's server takes its own request shape and answers in its own field names. The client translates both ways so a reader written for `jev` output (fields `noul`, `choice` as the submitted key, `score` as a zero-based position) reads Deem output unchanged.

FILE A, replace the `not implemented` branch for noul, choice and score with:
1. `readState(flag)`: undefined or '-' -> stdin; when `process.stdin.isTTY` is true throw CliError('state is required as an argument, @file, or stdin', 2) instead of reading. '@path' -> `fs.readFileSync(path, 'utf8')`, failure -> CliError(`cannot read state file: ${message}`, 2). Anything else is the state text itself.
2. `buildQuestion(subcommand, values)` -> { question, keyByDescription }. Missing `-q` -> CliError('missing -q QUESTION', 2). noul: `{ type: 'noul', instructions }`, map null. choice: split each `-o` value at its FIRST '='. An empty key or empty description -> CliError(`expected KEY=DESCRIPTION, got: ${raw}`, 2). Question `{ type: 'choice', instructions, options: [descriptions in flag order] }`, keyByDescription = Map(description -> key). score: `{ type: 'score', instructions, levels: [the -l values in order] }`, map null.
3. `decide(payload, timeoutMs)`: `requestJson('POST', `${baseUrl()}/v1/systemone`, payload, timeoutMs)`. Status other than 200 -> CliError(`Deem HTTP ${status}: ${text}`, 1). json not a plain object, or `json.answers` not a plain object -> CliError('unexpected response: no answers object', 1). `json.model !== PINNED_MODEL` -> CliError(`refused model: ${json.model}, expected deem-0.8-v1`, 3). Return json.
4. `translateAnswer(answer, question, keyByDescription)`, every failure CliError('unexpected response: <what>', 1): answer not a plain object fails. noul: `value` must be a number; return the answer without `value` plus `noul: value`. choice: with a map, `choice` becomes its key (a description not in the map fails) and every `probabilities` key is rekeyed the same way; with no map both stay as sent. score: `score` = index of `level` in `question.levels` (absent fails); `probabilities` rekeyed from level text to `String(index)`; drop `level`; `expected`, `confidence`, `temperature` pass through. Any other `type` fails.
5. `judge(subcommand, values)`: build the question, read the state, then `decide({ state, questions: { answer: question } }, values.hook ? HOOK_TIMEOUT_MS : DECISION_TIMEOUT_MS)`. A missing `json.answers.answer` fails with exit 1. Output: with `--value`, print only the primary value of answers.answer (`noul`, `choice` or `score`); otherwise print `JSON.stringify({ ...json, answers: { answer: translated } })`.

FILE B, add these tests (reuse startFake, runCli and closedUrl; each { timeout: 20000 }):
  j. ['choice','-q','Which path?','-s','the state','-o','fast=Take the fast path','-o','safe=Take the safe path']; POST answers 200 `{ id:'deem-t', object:'systemone.completion', model:'deem-0.8-v1', answers:{ answer:{ type:'choice', choice:'Take the safe path', probabilities:{'Take the fast path':0.2,'Take the safe path':0.8}, confidence:0.6, temperature:1 } }, usage:{ questions:1 } }` -> exit 0; stdout answers.answer.choice 'safe' and probabilities deepEqual { fast:0.2, safe:0.8 }; the one logged request is POST '/v1/systemone' with body deepEqual `{ state:'the state', questions:{ answer:{ type:'choice', instructions:'Which path?', options:['Take the fast path','Take the safe path'] } } }` and no authorization header.
  k. ['score','-q','How severe?','-s','x','-l','low','-l','medium','-l','high']; answer `{ type:'score', level:'medium', probabilities:{ low:0.1, medium:0.7, high:0.2 }, expected:1.1, confidence:0.5, temperature:1 }` -> exit 0; score 1, probabilities { '0':0.1, '1':0.7, '2':0.2 }, expected 1.1, no `level` key; body levels ['low','medium','high'].
  l. ['noul','-q','Is it urgent?'] with input 'server down since 9am'; answer `{ type:'noul', value:0.73, confidence:0.46, temperature:1 }` -> exit 0; answers.answer.noul 0.73 and no `value` key; body.state 'server down since 9am' and body.questions.answer deepEqual { type:'noul', instructions:'Is it urgent?' }.
  m. test j's args plus '--value' -> exit 0 and stdout.trim() === 'safe'.
  n. POST answers 400 -> exit 1. o. POST answers 500 -> exit 4. p. POST answers 200 with model 'deem-1.5' -> exit 3.
  q. ['choice','-q','x','-s','y','-o','noequals'] -> exit 2 and 0 requests logged.

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
