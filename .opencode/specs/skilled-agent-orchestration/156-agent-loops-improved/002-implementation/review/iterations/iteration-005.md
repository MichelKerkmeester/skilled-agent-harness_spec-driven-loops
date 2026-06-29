# Dimension

Correctness — concurrency: worker-pool cap, salvage/merge races, signal propagation.

# Files Reviewed

- `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs:1` through `:797`
- `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:1` through `:767`
- `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1` through `:1172`
- `.opencode/skills/deep-loop-runtime/scripts/fanout-salvage.cjs:1` through `:150`
- `.opencode/skills/deep-loop-runtime/scripts/status.cjs:1` through `:211`
- `.opencode/skills/deep-loop-runtime/scripts/upsert.cjs:1` through `:317`
- Direct contract checks: `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts:278`, `.opencode/skills/deep-loop-runtime/lib/deep-loop/jsonl-repair.ts:202`, `.opencode/skills/deep-loop-runtime/scripts/lib/cli-guards.cjs:102`, `.opencode/skills/deep-loop-runtime/scripts/fanout-merge.cjs:701`, `.opencode/skills/deep-loop-runtime/tests/unit/fanout-pool.vitest.ts:285`, `.opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts:770`, `.opencode/skills/deep-loop-runtime/tests/unit/fanout-salvage.vitest.ts:105`

# Findings by Severity

## P0

None.

## P1

### R5-P1-001 — `fanout-run` timeout/shutdown can hang or leave lineage children running

File: `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:737`

Why: `runLineageProcess` marks a timeout and sends `SIGTERM` at `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:737`, but the promise resolves only from the child `close` event at `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:760`. There is no grace timer, `SIGKILL` escalation, process-group kill, or fallback resolution if the CLI ignores `SIGTERM`. The external stop path has the same weakness in a different form: `installFanoutSignalHandlers` calls `process.exit()` immediately after `writeStoppedSummary` at `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:141`, while `writeStoppedSummary` only calls `child.kill(signal)` through `stopActiveLineageProcesses` at `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:355` and `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:961`. A stuck CLI can therefore keep the timeout promise pending forever, or continue writing lineage artifacts after the parent has written a stopped partial summary.

Suggested fix direction: Run lineage subprocesses in a killable process group where supported, add a timeout grace period that escalates `SIGTERM` to `SIGKILL`, and make the signal-stop path wait for child close or record explicit forced-kill/orphan state before exiting.

Claim: Fan-out lineages are not reliably terminated on timeout or parent signal, so normal timeout/interrupt handling can hang the runner or leave orphan writers racing later merge/resume steps.

EvidenceRefs: `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:737`, `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:760`, `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:141`, `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:355`, `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:961`, `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-audit.ts:757`

CounterevidenceSought: Checked `fanout-run.cjs` for a second kill timer, `SIGKILL`, process-group kill, or a close-wait in the signal handler; none is present. The sibling `executor-audit.ts` path does implement detached process groups plus SIGTERM-to-SIGKILL escalation, which confirms this pattern exists elsewhere but is not used here.

AlternativeExplanation: The team may assume all supported CLI executors exit promptly on `SIGTERM`; that assumption is not enforced, and subprocesses can spawn children or delay signal handling during shutdown.

FinalSeverity: P1

Confidence: high

DowngradeTrigger: Downgrade if `fanout-run` is only invoked under an outer supervisor that kills the entire process tree and never relies on `runLineageProcess` timeout completion or stopped summaries.

## P2

### R5-P2-001 — Pool `abort-requeue` lag action is unreachable through the production runner

File: `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:996`

Why: `fanout-pool.cjs` accepts `lagCeilingAction:"abort-requeue"` at `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:391` and aborts stalled attempts at `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:598`, but `fanout-run.cjs` passes only `lagCeilingMs` into `runCappedPool` at `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:996`. The parsed fan-out config schema exposes `lagCeilingMs` but no `lagCeilingAction` at `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts:278`. The abort/requeue branch is therefore unit-testable but not activatable through the CLI fan-out contract.

Suggested fix direction: Add `lagCeilingAction` to `fanoutConfigSchema` and pass it through from `fanout-run`, or explicitly de-scope the abort/requeue branch as a direct-module-only API and adjust tests/docs.

### R5-P2-002 — Salvage reuses one recovered stdout blob for every missing iteration file

File: `.opencode/skills/deep-loop-runtime/scripts/fanout-salvage.cjs:109`

Why: `runSalvageSweep` computes `recoveredText` once at `.opencode/skills/deep-loop-runtime/scripts/fanout-salvage.cjs:109`, then loops over every iteration recorded in the state log and writes that same text to each missing `iteration-N.md` at `.opencode/skills/deep-loop-runtime/scripts/fanout-salvage.cjs:111` and `.opencode/skills/deep-loop-runtime/scripts/fanout-salvage.cjs:125`. Tests cover a single missing file and mixed present/missing cases at `.opencode/skills/deep-loop-runtime/tests/unit/fanout-salvage.vitest.ts:105` and `.opencode/skills/deep-loop-runtime/tests/unit/fanout-salvage.vitest.ts:141`, but not multiple missing iteration files. If two or more iteration files are absent, salvage can create distinct filenames with identical, non-iteration-specific content.

Suggested fix direction: Parse stdout into iteration-specific sections before writing multiple files, or write an explicit failed-marker for multi-missing cases when content cannot be attributed to one iteration.

# Verdict

CONDITIONAL

# Notes

The core worker-pool cap holds in the in-process pool tests, including retry after cooperative abort. The correctness risk is at the process boundary: `fanout-run` does not use the stronger signal handling already present in `executor-audit.ts`, and the production runner cannot currently activate the pool's abort/requeue path.
