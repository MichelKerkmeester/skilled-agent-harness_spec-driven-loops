---
title: "Implementation Plan: Phase 23: dsh-lineage-executor-check"
description: "Replace the fan-out lineage exemption in verify-iteration.cjs with a check against the invocation-metadata.json the fan-out runner writes, and let validateIterationOutputs take the iteration_start row on a log with no ledger. Unit cases that fail on the old code and a real lineage copy prove it."
trigger_phrases:
  - "dsh lineage executor check plan"
  - "lineage invocation metadata plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 23: dsh-lineage-executor-check

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | One CommonJS script under plain Node, one TypeScript module, YAML workflow assets |
| **Framework** | The deep-loop runtime: the post-dispatch gate, the documented validator and the fan-out runner |
| **Storage** | The run config, the JSONL state log and the lineage's `invocation-metadata.json` |
| **Testing** | Vitest, `npm run typecheck`, `check-contract-drift.cjs` |

### Overview
The lineage branch of `checkExecutorProvenance` in `verify-iteration.cjs` stops returning early and compares the configured kind with `effectiveConfig.kind` in the lineage's `invocation-metadata.json`. The opening-row check in `validateIterationOutputs` drops its ledger condition. New unit cases each fail on the old code, and a real DeepSeek Harness lineage copy passes with its metadata and fails without it.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The gap is measured. The block in `spec.md` section 2 shows a lineage with no metadata file passing
- [x] The suite baseline is recorded in `tasks.md` T002

### Definition of Done
- [x] Every new case fails with the source at `HEAD` and passes with the change
- [x] `cd $DL && npm run typecheck` exits 0 and `node $DL/scripts/check-contract-drift.cjs` prints `[CONTRACT DRIFT] OK`
- [x] The full deep-loop suite shows no failure the baseline lacks
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One gate branch.

### Key Components
- **`$DL/scripts/verify-iteration.cjs`**: adds `lineageInvocationKind` and uses it in the lineage branch of `checkExecutorProvenance`.
- **`$DL/lib/deep-loop/post-dispatch-validate.ts`**: `validateIterationOutputs` calls `openingRowNamesExecutor` on every log, and the unused `ledgerModeFor` import goes.

### Data Flow
`fanout-run.cjs` builds each lineage's command, then writes `{ effectiveConfig, invocationFingerprint }` to `<lineage dir>/invocation-metadata.json`, then spawns the lineage. It does this inside the pool worker, so every attempt rewrites the file before its spawn. `effectiveConfig.kind` is the executor kind the runner launched. The lineage's workflow writes its config into the same directory and runs this gate with that directory as `--artifact-dir`, so the gate reads both files side by side.

### Design per item

**Fan-out lineages.** The existing three signals still decide what a lineage is: `SPECKIT_FANOUT_LINEAGE_ID`, a lineage key in the config or a directory directly under `lineages`. A lineage with a non-native configured kind now passes only when `invocation-metadata.json` names that kind. It fails with `executor_missing` when the file is absent or unreadable, names no kind or names another kind. The detail says which. The state-log rows are not read for a lineage, since a lineage skips the pre-dispatch audit that writes them.

**Exempt paths.** A native lineage and a lineage whose config has no executor block return before the lineage branch, as they do today, because nothing names a non-native executor there. Salvage needs no exemption: it runs after the lineage exits, in the directory that already holds the file, and it never runs the gate. The runner has no dry-run mode. A lineage folder that predates the file is not exempt, because the gate runs only on a new iteration of a live run and the current runner writes the file before every spawn.

**The documented validator.** `validateIterationOutputs` accepted an executor on the iteration's `iteration_start` row only when `ledgerModeFor` found a ledger. On a log with no ledger the pre-dispatch audit writes that row too, so the condition goes and the row counts on any log, as it does in `verify-iteration.cjs`. The row shape it accepts does not change.

### Restraint check
- No new file and no new reason. A mismatch reuses `executor_missing` with its own detail, so the workflows' reason lists stay as they are.
- No change to the fan-out runner. It already writes the file before every spawn.
- Owner of the shared contract: the post-dispatch gate. The contract that must not break: every fan-out test and every existing gate case, which the full suite checks.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup measures the gap on real lineage copies and records the suite baseline. Implementation changes the gate, the validator, their tests and the workflow sentence, then regenerates the contracts. Verification runs the new cases against the old code and the new, the real copies, the typecheck, the drift check and the full suite. `tasks.md` holds the ordered work.

`$DL` is `.skilled/skills/system-deep-loop/runtime` and `$A` is `.skilled/commands/deep/assets`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Each lineage case builds a complete review iteration under a temporary `lineages` folder with a config naming `cli-deepseek-harness`. A passing case is paired with a control that fails, so each case fails on the old script, which passes every lineage. The validator case writes an `iteration_start` row with an executor to a plain log with no ledger. The fail-first run stashes the two source files and runs the same test files.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Phase 022's executor check and the fan-out runner's metadata write. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a live lineage fails with `executor_missing`. Revert the phase commit. The check writes nothing, so no state needs repair.
<!-- /ANCHOR:rollback -->

---
