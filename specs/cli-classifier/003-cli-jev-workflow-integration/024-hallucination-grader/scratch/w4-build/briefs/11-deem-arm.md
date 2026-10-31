GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/cli-jev/003-cli-jev-workflow-integration/024-hallucination-grader

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

TASK: add the Deem arm (one local `cli-deem noul` per labeled output) and wire it into main, with three tests. 2 files.
S = .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs
T = .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/d4-agreement.vitest.ts
Read first: S, T, section 10 of specs/cli-jev/003-cli-jev-workflow-integration/024-hallucination-grader/scratch/w4-build/design.md (the Deem parts only), and `runDeemArm` in .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:1302-1455 (read only; the model to port).

STEP 1. In S, at the end of `// 9. ARM HELPERS` (after buildReport), add `async function runDeemArm(plan, gate, ctx)` with JSDoc. plan `{ rows: Array<{ file, label, state }>, baselineCalls, labelsSha }`, gate = the passing deemGate result, ctx `{ out, env, timeoutMs, callLog, stored }`. Port runDeemArm with these differences: first print `deem: nothing leaves the machine; planned calls: <K>; estimated wall time: <(K * DEEM_P50_MS / 1000).toFixed(1)> s at 60.5 ms per call, the noul p50 from deem-local.md`; one call per row, args `[...gate.cmd.slice(1), 'noul', '-q', QUESTION]`, stdin `row.state`; a measured answer is exit 0 with stdout JSON whose `answers.answer.noul` is a finite number in [0, 1] (status `measured`); exit 0 without one is status `failed`; the exit table, the exit-4 health recheck and retry, the stop lines and `deem: partial rows=<n>` stay as ported; each calls.jsonl record is `{ backend: 'deem', output: row.file, rerun: 1, attempt, wallMs, exitCode, noul, status, modelId, modelCommit, sourceCommit }` with noul null unless measured; answers map `file -> [noul or null]`. After the loop: `summarizeColumn('deem', plan.rows, answers, plan.baselineCalls, plan.labelsSha, 'model=<m> model_commit=<mc> source_commit=<sc>')`, latency p50/p95 by nearestRank, print `column deem: K=<K> measured=<M> unmeasured=<K-M> latency_p50_ms=<n or none> latency_p95_ms=<n or none>`, then `flips: n/a (commit pair)`, then `requalify: model commit changed` when `ctx.stored?.columns?.deem` exists with a different modelCommit or sourceCommit, then the verdict line. Return `{ column: { ...column, latency, modelId, modelCommit, sourceCommit }, requalify }` or `{ stopped, partialRows }`. Export `runDeemArm`.

STEP 2. In `main`, right before `let jevResult;` add `const plan = gate === 'open' ? { rows: rows.map((row) => ({ file: row.file, label: row.label, state: buildState(row.fixture, fs.readFileSync(row.outputPath, 'utf8')) })), baselineCalls: baseline.calls, labelsSha } : null;`, and replace the comment line `      // The Deem arm runs here after a passing gate.` with `      deemResult = await runDeemArm(plan, deemCheck, { out, env, timeoutMs, callLog, stored });`.

STEP 3. In T add `//   Deem arm (runDeemArm)` to the MODULE header list and append `describe('score-d4-agreement deem arm', ...)`. Add a const `DEEM` holding exactly this shell text (the stub's health answer switches its commit to m2 after the first health call when a file named newpair sits beside it):
```
if [ "$1" = health ]; then n=$(cat "$D/n" 2>/dev/null || echo 0); n=$((n+1)); echo $n > "$D/n"; mc=m1; if [ -f "$D/newpair" ] && [ $n -gt 1 ]; then mc=m2; fi; echo "{\"ok\":true,\"backend\":\"torch\",\"model\":\"deem-0.8-v1\",\"model_commit\":\"$mc\",\"source_commit\":\"s1\"}"; exit 0; fi
p=$(cat); case "$p" in *EXIT4*) exit 4;; *EXIT3*) exit 3;; *BADJSON*) echo 'not json'; exit 0;; *HALLUCINATED*) v=0.9;; *) v=0.1;; esac
echo "{\"model\":\"deem-0.8-v1\",\"answers\":{\"answer\":{\"noul\":$v}}}"
```
Each run: `labeledSet(0, 10, 20)`, stubs `stubDir({ 'cli-deem': DEEM })`, env PATH stubs first, argv `['--outputs', outputs, '--fixtures', fixtures, '--labels', labels, '--deem', '--out', out]`, out = `tempDir('d4-out-')`, sha = sha256 hex of the labels file bytes. Three it():
1. 'asks one noul per labeled output and prints keep': code 0; lines contain the planned-calls line with `planned calls: 30; estimated wall time: 1.8 s`, 'flips: n/a (commit pair)' and `verdict deem: keep K=30 M=30 A=30 B=20 W=10 L=0 F=n/a p_win=0.0009766 p_loss=1.000 labels_sha256=${sha} model=deem-0.8-v1 model_commit=m1 source_commit=s1`; `cli-deem.log` has 31 lines, the first `health`; `calls.jsonl` has 30 lines, each with status 'measured', exitCode 0, a numeric wallMs, modelId 'deem-0.8-v1', modelCommit 'm1', sourceCommit 's1'; `report.json` has columns.deem.verdict 'keep'.
2. 'stops with partial rows and no verdict on a changed commit pair or a refused backend': write `EXIT4` into `fx-b.run1.md` and create an empty `newpair` file in the stub dir -> lines contain 'deem arm stopped: model commit changed mid-run' and 'deem: partial rows=0', no line starts with 'verdict deem:', report.json stopped.deem.partialRows is 0; a fresh set with `EXIT3` in `fx-b.run1.md` -> 'deem arm stopped: backend refused'.
3. 'marks an unparseable answer failed, stops on coverage and requalifies a changed pair': put `BADJSON` in the first four yes files (`fx-b.run1.md` to `fx-b.run4.md`, keeping `HALLUCINATED` too), and before the run write `{"columns":{"deem":{"modelCommit":"old","sourceCommit":"s1"}}}` to `<out>/report.json` -> calls.jsonl has 4 lines with status 'failed'; lines contain 'requalify: model commit changed' immediately before a line starting `verdict deem: stop (coverage) K=30 M=26 `.

VERIFY (repo root): node --check .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs
Accept when: 2 files changed (S and T) and nothing else; node --check exits 0.

RUN CONTEXT
- Repo root, a git worktree. Run every command from here:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration
- Spec folder (pre-approved, Gate 3 answered): specs/cli-jev/003-cli-jev-workflow-integration/024-hallucination-grader
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
