GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/cli-jev/003-cli-jev-workflow-integration/020-routing-clarify-default

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

TASK: add the Jev arm to score-clarify-default.cjs: past a passing Jev gate, the payload and cost line, one `auth test`, three rotated `choice` calls per labeled row and the verdict line. Jev runs before Deem. Plus three tests on the stub. Never run the real `jev`: the tests use the stub only.

FILE 1 (edit): .skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs
a. CONSTANTS, append: `BACKOFF_MS = 2000`, `JEV_PAYLOAD = 'committed canary, playbook and routing-corpus prompts and mode descriptions'`.
b. In section 9. ARMS, after `runDeemArm`, add `async runJevArm(labeled, gate, ctx)` with JSDoc. Model it on `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-jev-tiebreak.mjs` lines 853-958 (payload line, `call` with the exit-4 backoff, `record`, `stop`, the `auth test`) and 1034-1107 (the choice loop), with these differences. `ctx` is `{ out, env, outDir, repoRoot, timeoutMs, backoffMs }`; `provider = gate.provider`; `model` starts as `'unknown'`.
- Before any call print `jev: payload=<JEV_PAYLOAD> planned_calls=<3*K+1> est_input_tokens=<Math.ceil(chars / 4)>`, where `chars` is 3 times the sum over labeled rows of `row.prompt.length + CHOICE_INSTRUCTION.length` plus, for each key of `[...row.alternatives, NONE_KEY]`, `key.length + text.length + 1` with `text` from `describeModes`.
- `auth test`: spawn `gate.path` with `['auth', 'test', '--provider', provider]` and empty stdin; on exit 0 read `model` from the stdout JSON's `model` when present. Record `{ kind: 'auth_test', backend: 'jev', row_id: null, order: null, wall_ms, exit_code, pick: null, pick_prob: null, status: exit 0 ? 'measured' : 'unmeasured', jev_version: '0.6.2', provider, model }`. Exit 3 stops with `jev arm stopped: key rejected`, 130 with `jev arm stopped: interrupted`, any other non-zero with `jev arm stopped: auth test failed`. Then print `jev: auth_test provider=<provider> model=<model>`.
- Each choice spawn: `gate.path` with `['choice', '--provider', provider, '-q', CHOICE_INSTRUCTION, ...optionArgs(rotated, texts)]`, stdin `row.prompt`, per rotation from `rotations([...row.alternatives, NONE_KEY])`. Exit 4 records that spawn as `unmeasured`, waits `backoffMs`, spawns once more and judges the second result. Judge with `judgeChoice`; a measured result whose stdout JSON has a string `model` updates `model`. Exit 2 stops with `jev arm stopped: usage error`, 3 with `jev arm stopped: key rejected`, 130 with `jev arm stopped: interrupted`. Record every spawn as `{ kind: 'choice', backend: 'jev', row_id, order, wall_ms, exit_code, pick, pick_prob, status, jev_version: '0.6.2', provider, model }` before any stop. A stop prints its line, then `jev: partial_rows=<rows finished>`, and returns `{ stopped: <line> }` with no verdict.
- After the last row print `verdictLine('jev', counts, decision, 'jev_version=0.6.2 provider=' + provider + ' model=' + model)` and return `{ ...counts, outcome, reason, p, line }`.
c. CLI. `main` passes `backoffMs = deps.backoffMs || BACKOFF_MS` and `timeoutMs = deps.timeoutMs || JEV_TIMEOUT_MS` to the Jev arm (the Deem arm keeps its own timeout). In `runScoreCommand` a passing Jev gate runs `runJevArm` right after `jevGate` and before the Deem gate; a failed one records `columns.jev = { skipped: true }`. `columns.jev` holds the arm's return. Nothing else changes.
d. EXPORTS gains `runJevArm`.

FILE 2 (edit): the test file. Append three tests, each with 30 `'second'` rows and a fresh out dir, asserting status 0:
25. `a jev stub that answers the label keeps`: `--score <rows> --jev --out <out>`. stdout includes `planned_calls=91`, `jev: auth_test provider=official model=stub-jev-model` and `verdict jev: keep K=30 M=30 A=30 B=0 W=30 L=0 F=0 p=9.313e-10 jev_version=0.6.2 provider=official model=stub-jev-model`; `calls.jsonl` has 91 lines.
26. `with both switches the jev verdict prints before the deem verdict`: `--jev --deem --out <out>`. Both verdict lines appear and `stdout.indexOf('verdict jev:') < stdout.indexOf('verdict deem:')`.
27. `a rejected key stops the jev arm with no verdict`: `--jev --out <out>`, `STUB_CHOICE_EXIT=3`. stdout includes `jev arm stopped: key rejected` and `jev: partial_rows=0`, and does not include `verdict jev:`.

Accept when: 2 files changed, `node --check` passes on both, and `grep -c "^test(" <test file>` prints 27.

RUN CONTEXT
- Repo root, a git worktree. Run every command from here:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration
- Spec folder (pre-approved, Gate 3 answered): specs/cli-jev/003-cli-jev-workflow-integration/020-routing-clarify-default
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

Checks to run: `node --check` on both files, and `grep -c "^test(" .skilled/skills/sk-doc/sk-create-skill/scripts/tests/score-clarify-default.test.cjs`.

HANDBACK (print exactly this block, filled in, as your last output)
STATUS: DONE | BLOCKED
FILES CHANGED: one line per file: <path> (+<added>/-<removed>)
EDITS: one line per step: <file>:<line> <what changed>
CHECKS: one line per check: <command> -> <result line> (exit <n>)
BLOCKED REASON: <one line, or none>
