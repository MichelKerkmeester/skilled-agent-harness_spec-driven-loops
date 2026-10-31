GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/cli-jev/003-cli-jev-workflow-integration/023-reply-harness-blinded-judge

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

TASK: add the Deem arm, one `score` call per labeled reply and rubric dimension, plus `report.json`, with verdict tests on stub answers.
S = .skilled/skills/sk-communication/benchmark/reply-harness/judge-agreement.mjs (exists)
T = .skilled/skills/sk-communication/benchmark/reply-harness/judge-agreement.test.mjs (exists)
M = .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs (read only). Read S and T in full, then M lines 1252-1455 (the arm to model the loop, retry and stop on). Keep existing lines unless a step names them. Same style as S.

STEP 1. In S, end of section 7, add `export async function runDeemArm(plan, gate, ctx)` with JSDoc. plan is `{ labeled, baseline, dimensions, labelsSha }` (labeled maps reply SHA to `{ grades, text }`), gate a passing `deemGate` result, ctx `{ out, env, timeoutMs, callLog, stored }`. D is the dimension count, K `labeled.size`.
a. Print `` `deem: nothing leaves the machine; planned calls: ${D * K}; estimated wall time: ${(D * K * DEEM_P50_MS / 1000).toFixed(1)} s at ${DEEM_P50_MS} ms per call, the 3-level score p50 in deem-local.md` ``.
b. For each SHA of labeled in sorted order, each dimension d: `spawnCall(gate.cmd[0], [...gate.cmd.slice(1), 'score', '-q', d.judgeGuidance, '-l', LEVELS[0], '-l', LEVELS[1], '-l', LEVELS[2]], entry.text, ctx.env, ctx.timeoutMs)`; keep every wallMs. Exit 4 without a timeout: append an `'unmeasured'` attempt-1 record, then `readDeemHealth(gate.cmd, ctx.env)`: not ok stops with `deem arm stopped: server gone`; a changed modelCommit or sourceCommit stops with `deem arm stopped: model commit changed mid-run`; otherwise retry the call once as attempt 2. Then: timed out is `'unmeasured_timeout'`; exit 0 is `parseScoreAnswer(stdout)`, `'measured'` when not null else `'unmeasured'`; exit 2 stops with `deem arm stopped: usage error`, 3 with `deem arm stopped: backend refused`, 130 with `deem arm stopped: interrupted`; any other exit is `'unmeasured'`.
c. Every spawn appends `{ backend: 'deem', replySha: sha.slice(0, 12), dimension: d.id, rerun: 0, attempt, wallMs, exitCode, position, status, modelId: gate.model, modelCommit: gate.modelCommit, sourceCommit: gate.sourceCommit }`. Store `answers.get(sha)[d.id] = [position === null ? null : LEVELS[position]]`. A stop prints its line and `` `deem: partial replies=${finished}` `` (replies fully asked) and returns `{ stopped: line, partialReplies: finished }`.
d. After the loop: `summary = summarizeColumn({ backend: 'deem', labeled, baseline, answers, dimensionIds, reruns: 1 })`, latency `{ p50: nearestRank(wallTimes, 0.5), p95: nearestRank(wallTimes, 0.95) }`. Print in order: `` `column deem: replies=${K} measured=${M} unmeasured=${K - M} unstable=${unstable} latency_p50_ms=${p50 ?? 'none'} latency_p95_ms=${p95 ?? 'none'}` ``; `dimensionLines(summary, ids)`; `flips: n/a (commit pair)` (a Deem score has no reruns, its stability is the commit pair); `requalify: model commit changed` only when `ctx.stored?.columns?.deem` has another modelCommit or sourceCommit; then `line = verdictLine(summary, labelsSha, \`model=${gate.model} model_commit=${gate.modelCommit} source_commit=${gate.sourceCommit}\`)`. Return `{ column: { ...summary, line, latency, modelId: gate.model, modelCommit: gate.modelCommit, sourceCommit: gate.sourceCommit }, requalify }`.

STEP 2. In S section 9: add `export function buildReport({ census, questionsSha, labelsSha, K, agreement, jev, deem })` returning `{ census: { masked, distinct, matched, unmatched }, questionsSha256, labelsSha256, K, baselineAgreement: { agree, cells }, keepRule: KEEP_RULE_LINE, columns: {}, stopped: {}, skipped: {}, requalify: {} }` filled per `[backend, arm]` of `[['jev', jev], ['deem', deem]]`: undefined skips; `arm.skipped` goes to `skipped[backend]`; `arm.stopped` to `stopped[backend] = { line, partialReplies }`; `arm.column` to `columns[backend]` with `requalify[backend] = arm.requalify ?? null`. In `main`, when `--deem` or `--jev` is set: build `callLog = createCallLog(outDir)` and `stored = readStoredReport(outDir)` before the arms; replace the comment `// The Deem arm runs here after a passing gate.` with `deemResult = await runDeemArm({ labeled, baseline, dimensions, labelsSha }, check, { out, env, timeoutMs, callLog, stored })`, labelsSha being the labels SHA-256 or `'none'`; after the arms, `fs.mkdirSync(outDir, { recursive: true })` and write `outDir/report.json` as `JSON.stringify(report, null, 2) + '\n'`.

STEP 3. In T, add helper `scenario(fixture, pick)`: rubric `dims`; `census`; `scores = runBaseline(repliesDirs)`; for the first masked file of each matched SHA, `base = baselineLevels(...)` and grades equal to base on the first 3 ids and `LEVELS[(indexOf(base) + 1) % 3]` on the rest; write `labels.jsonl` (`{ masked, grades }` per line, `masked` the absolute file path) and `answers.json` mapping `` `${sha256Hex(entry.text)}|${d.judgeGuidance}` `` to `pick(gradeIndex, baseIndex)`, where `entry.text` is that masked file's full text from the census (the arm's stdin, and what the stub hashes), not the reply SHA; return both paths. `third(g, b)` is the index in [0, 1, 2] equal to neither. Four tests, args `--labels <labels> --deem --out <root>/out`, env `stubEnv(root, { STUB_ANSWERS: <answers> })`, code 0 each:
33. pick `(g) => g`: last line starts `verdict deem: keep K=21 M=21 A=147 B=63 W=21 L=0 F=n/a` and ends `model=deem-0.8-v1 model_commit=stubmodel source_commit=stubsource`; `out/calls.jsonl` has 147 lines, each with `wallMs`, `exitCode`, `modelId`, `modelCommit`, `sourceCommit`; `out/report.json` has `columns.deem.verdict` `'keep'`.
34. pick `(g, b) => b`: last line starts `verdict deem: stop (margin) K=21 M=21 A=63 B=63 W=0 L=0`.
35. pick `third`: last line starts `verdict deem: kill K=21 M=21 A=0 B=63 W=0 L=21`.
36. pick `(g) => g` with `STUB_SCORE_EXIT: '1'` added: last line starts `verdict deem: stop (coverage) K=21 M=0`.

Accept when: 2 files changed (S and T), no other file changed, both pass `node --check`, and `grep -c "^export function" S` prints 29.
Checks you run: `node --check S`, `node --check T`, that grep. Do not run `node --test`: the orchestrator runs it.

RUN CONTEXT
- Repo root, a git worktree. Run every command from here:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration
- Spec folder (pre-approved, Gate 3 answered): specs/cli-jev/003-cli-jev-workflow-integration/023-reply-harness-blinded-judge
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
