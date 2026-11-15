---
title: "Implementation Plan: Phase 22: dsh-verify-iteration-executor"
description: "Add an executor provenance check to verify-iteration.cjs, the gate every review and research iteration runs. It reads the executor kind from the run config, fails a non-native iteration that names no executor on its record or its iteration_start row, and skips native runs, unconfigured runs and fan-out lineages."
trigger_phrases:
  - "dsh verify iteration executor plan"
  - "verify-iteration executor check plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 22: dsh-verify-iteration-executor

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | One CommonJS script under plain Node, YAML workflow assets |
| **Framework** | The deep-loop runtime: the post-dispatch gate and the pre-dispatch executor audit |
| **Storage** | The JSONL state log and the run config in the artifact directory |
| **Testing** | Vitest, `npm run typecheck`, `check-contract-drift.cjs` |

### Overview
`verify-iteration.cjs` gains one check after the route proof. It reads the run's executor kind from the config beside the state log and, when that kind is non-native and the run is not a fan-out lineage, requires an executor on the iteration record or on an `iteration_start` or `iteration` row of the same iteration. The proof is eight unit cases that each fail on the old script, plus runs against copies of two real review folders.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The gap is measured. The block in `spec.md` section 2 shows the old script passing a non-native iteration that names no executor
- [x] The baselines are recorded in `tasks.md` T002 and T003

### Definition of Done
- [x] `cd $DL && npx vitest run tests/unit/verify-iteration.vitest.ts` prints `Tests  39 passed (39)`, and `8 failed | 31 passed (39)` with the script at `HEAD`
- [x] `cd $DL && npm run typecheck` exits 0
- [x] `node $DL/scripts/check-contract-drift.cjs` prints `[CONTRACT DRIFT] OK commands=3`
- [x] The full deep-loop suite fails no test in a changed file or one that loads a changed module, and any other failure passes alone
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One added gate check.

### Key Components
- **`$DL/scripts/verify-iteration.cjs`**: adds the `executor_missing` reason, `configuredExecutorKind`, `isFanoutLineage` and `checkExecutorProvenance`, and calls the check after the route proof.

### Data Flow
The workflow runs the pre-dispatch audit, then the leaf, then this gate, then the post-dispatch executor patch. On a ledger-backed log the audit hands an `iteration_start` row with the executor to the append gateway. On a log with no ledger it merges the executor onto an existing row of the iteration or appends a new `iteration_start` row. So at gate time a non-native iteration names its executor on that row or on its own record, and the gate reads both.

### Design per path

**Executor kind.** The gate reads `deep-review-config.json` or `deep-research-config.json` from the artifact directory and takes `executor.kind`, then `executor.type`, then `native`, the order `getExecutorKind` in the executor audit uses. No YAML argument is added, since every workflow writes its config there before the first dispatch.

**Native and unconfigured runs.** A native kind skips the check, since the audit returns early for native and writes no row. A missing config, an unreadable one or one with no executor block also skips it, since nothing names a non-native executor.

**Fan-out lineages.** A CLI lineage runs every iteration inline and is told the per-iteration dispatch steps are already satisfied, so the pre-dispatch audit does not run and no executor row is written. Its config still names a non-native kind, as a survey of 40 lineage configs in `specs/` showed. The check stands down when any of three signals holds. The first is `SPECKIT_FANOUT_LINEAGE_ID` in the environment, which the fan-out runner exports to each lineage process. The second is a config that carries `fanout_lineage_artifact_dir`, a `fanout` object or a `fanoutLineage` object. The third is an artifact directory directly under a `lineages` folder, which is where the runner places every lineage. A native lineage is already skipped by its kind.

**AI Council.** It does not run this script, so nothing changes there.

**Why no import.** The documented validator's opening-row check is a private function in a TypeScript module that imports `.js` siblings, and this script loads under plain Node with CommonJS only. The added predicate is a few lines and reads the same row shape.

### Restraint check
- No new file and no new workflow argument. The config is already beside the state log.
- No refactor of the existing checks. The new check is one call placed after the route proof.
- Owner of the shared contract: the post-dispatch gate. The contract that must not break: every existing `verify-iteration.vitest.ts` case and every other suite caller passes unchanged, since none writes a non-native config.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup measures the gap on the real review copies and records the suite and file baselines. Implementation adds the check to `verify-iteration.cjs`, the eight cases and the reason in the four workflows, then regenerates the contracts. Verification runs the cases against the old script and the new, the real copies, the typecheck, the drift check and the full suite. `tasks.md` holds the ordered work.

`$DL` is `.skilled/skills/system-deep-loop/runtime` and `$A` is `.skilled/commands/deep/assets`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Each new case builds a complete iteration in a temporary folder and writes a config naming `cli-deepseek-harness`. Every case that asserts a pass also asserts the matching shape without an executor fails, so each fails on the old script, which passes everything. A fail-first run puts `verify-iteration.cjs` back to `HEAD` and runs the same file. The real-folder runs use scratch copies outside the repository, so the packet folders stay untouched.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The pre-dispatch executor audit from phases 019 to 021. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a legitimate iteration fails with `executor_missing`. Revert the phase commit. The check writes nothing, so no state needs repair.
<!-- /ANCHOR:rollback -->

---
