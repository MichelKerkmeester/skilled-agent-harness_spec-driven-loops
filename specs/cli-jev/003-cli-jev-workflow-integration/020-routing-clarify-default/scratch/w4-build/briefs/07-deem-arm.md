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

TASK: add the Deem arm to score-clarify-default.cjs: past a passing Deem gate, three rotated `choice` calls per labeled row, `calls.jsonl`, the verdict line and `report.json`. Plus five tests on the stub.

FILE 1 (edit): .skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs
a. New section `9. ARMS` between GATES and CLI. Renumber CLI to 10 and EXPORTS to 11. The `child_process` import becomes `const { spawn, spawnSync } = require('child_process');`.
b. CONSTANTS, append: `DEEM_P50_MS = 65.6` (comment: the measured median wall time of one local choice call on the served model), `DEEM_TIMEOUT_MS = 90000`.
c. ARMS, each with JSDoc:
- `spawnCall` and `writeCall`: port `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-jev-tiebreak.mjs` lines 777-835 to CommonJS unchanged.
- `rotations(keys)` returns `[keys, keys.slice(1).concat(keys.slice(0, 1)), keys.slice(2).concat(keys.slice(0, 2))]`.
- `optionArgs(keys, texts)` returns the flat list `['-o', key + '=' + texts.get(key), ...]` in `keys` order.
- `judgeChoice(result, keys)` returns `{ pick, pickProb, status }`: `result.timedOut` gives status `unmeasured_timeout`; exit 0 with stdout JSON whose `answers.answer.choice` is in `keys` gives that pick, `pickProb = answers.answer.probabilities[pick] ?? null`, status `measured`; anything else gives pick null, status `unmeasured`.
- `async runDeemArm(labeled, gate, ctx)`: `ctx` is `{ out, env, outDir, repoRoot, timeoutMs }`. Print `deem: nothing leaves the machine planned_calls=<3*K> est_wall_s=<(3*K*DEEM_P50_MS/1000).toFixed(1)>`. For each labeled row: `keys = [...row.alternatives, NONE_KEY]`, `texts = describeModes(repoRoot, row.hub, keys)`; for each rotation (order 0, 1, 2) spawn `gate.cmd[0]` with `[...gate.cmd.slice(1), 'choice', '-q', CHOICE_INSTRUCTION, ...optionArgs(rotated, texts)]`, stdin `row.prompt`. Every spawn is written to `calls.jsonl` via `writeCall` before any stop, as `{ kind: 'choice', backend: 'deem', row_id, order, wall_ms, exit_code, pick, pick_prob, status, model: gate.model, model_commit: gate.modelCommit, source_commit: gate.sourceCommit }`. Exit 4: `readDeemHealth(gate.cmd, env)`; not ok stops with `deem arm stopped: server gone`; a different `modelCommit` or `sourceCommit` stops with `deem arm stopped: model commit changed mid-run`; otherwise spawn once more and judge that result. Exit 2 stops with `deem arm stopped: usage error`, exit 3 with `deem arm stopped: backend refused`, exit 130 with `deem arm stopped: interrupted`. A stop prints its line, then `deem: partial_rows=<rows finished>`, and returns `{ stopped: <line> }` with no verdict. Each row's three picks go into a Map id -> picks. After the last row: `counts = scoreColumn(labeled, picks)`, `decision = decideVerdict(counts)`, print `verdictLine('deem', counts, decision, 'model=' + gate.model + ' model_commit=' + gate.modelCommit + ' source_commit=' + gate.sourceCommit)` and return `{ ...counts, outcome, reason, p, line }`.
d. CLI. `runScoreCommand` becomes async (`main` awaits it) and gets `timeoutMs = deps.timeoutMs || DEEM_TIMEOUT_MS` from `main`. A passing Deem gate runs `runDeemArm(labeled, gate, { out, env, outDir: args.out, repoRoot, timeoutMs })`; a failed one records `{ skipped: true }`. When `--jev` or `--deem` was given and the headroom check passed, write `<out>/report.json` as `JSON.stringify({ K, B, columns }, null, 2)` plus a newline, where `columns.deem` holds the arm's return or `{ skipped: true }`. Return 0.
e. EXPORTS gains `spawnCall, writeCall, rotations, optionArgs, judgeChoice, runDeemArm`.

FILE 2 (edit): the test file. Append five tests. Each runs `runWithStubs` with `--score <rows> --deem --out <fresh tmp dir>` unless stated, and asserts status 0:
20. `a deem stub that answers the label keeps`: 30 `'second'`. stdout includes `deem: nothing leaves the machine planned_calls=90 est_wall_s=5.9`, `verdict deem: keep K=30 M=30 A=30 B=0 W=30 L=0 F=0 p=9.313e-10 model=deem-0.8-v1 model_commit=mc1 source_commit=sc1`; `<out>/calls.jsonl` has 90 lines; `<out>/report.json` has `columns.deem.outcome === 'keep'`.
21. `a deem stub that answers the first alternative stops on margin`: 30 `'second'`, `STUB_PICK=first`. stdout includes `verdict deem: stop (margin) K=30 M=30 A=0 B=0 W=0 L=0 F=0`.
22. `a deem stub that loses to the baseline kills`: write the rows by hand: 20 rows with label `cli-claude-code` and prompt `row <i> pick=cli-codex first=cli-claude-code`, then 10 rows with label `cli-codex` and prompt `row <i> pick=cli-claude-code first=cli-claude-code`, alternatives `['cli-claude-code', 'cli-codex']`, hub `cli-external-orchestration`. stdout includes `verdict deem: kill K=30 M=30 A=0 B=20 W=0 L=20 F=0`.
23. `four failing deem calls in thirty rows stop on coverage`: 30 `'second'`, then append ` fail` to the prompts of r0 to r3. stdout includes `verdict deem: stop (coverage) K=30 M=26`.
24. `the label gate blocks the deem arm before any call`: 29 `'second'`. stdout includes `stop: fewer than 30 labeled rows (29 labeled)`, and the stub log is absent or empty.

Accept when: 2 files changed, `node --check` passes on both, and `grep -c "^test(" <test file>` prints 24.

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
