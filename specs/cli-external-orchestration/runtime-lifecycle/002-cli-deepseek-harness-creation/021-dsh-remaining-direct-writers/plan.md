---
title: "Implementation Plan: Phase 21: dsh-remaining-direct-writers"
description: "Route the verification_degraded row and both write-containment rows through the append gateway on a ledger-backed state log with phase 020's helper. Let the executor check read the opening row and reword one prompt pack sentence. Review carries the rows whole under its existing record stem and research gets three new reducer-read stems."
trigger_phrases:
  - "dsh remaining direct writers plan"
  - "verification degraded gateway plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 21: dsh-remaining-direct-writers

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript under `tsx`, one CommonJS gateway script, YAML workflow assets |
| **Framework** | The deep-loop runtime: append gateway, typed ledgers and legacy state-log projections |
| **Storage** | Append-only ledger frames under `deep-review-ledger/` and `deep-research-ledger/`, projected into the JSONL state log |
| **Testing** | Vitest, `npm run typecheck`, `check-ledger-stem-producers.cjs`, `check-projection-coverage.cjs`, `check-protocol-append-sites.cjs`, `check-contract-drift.cjs` |

### Overview
Three diagnostic writers append straight into a state log the append gateway rebuilds from its ledger, so their rows vanish at the next refresh. This plan hands each row to phase 020's `appendFailureRow`, which goes through the gateway when ledger frames sit beside the log and writes directly otherwise. The proof is one test per writer and mode that opens a real run, writes the row, triggers a refresh and reads the row back, plus a test that the executor check accepts the opening row.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 020 is the base. Check: `git show HEAD:.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts | rg -c 'function appendFailureRow'` prints 1
- [x] The loss is measured. The probe in `spec.md` section 2 prints `after refresh=0` for all three rows in both modes and `executor_missing` for a run whose opening row names the executor
- [x] The baselines are recorded in `tasks.md` T002 and T003

### Definition of Done
- [x] `cd $DL && npx vitest run tests/unit/executor-audit-ledger-projection.vitest.ts` prints `Tests  18 passed (18)`, and `7 failed | 11 passed (18)` with the source edits taken out
- [x] `cd $DL && npm run typecheck` exits 0
- [x] `node $DL/scripts/check-ledger-stem-producers.cjs` prints `"ok":true` with `"registered":91` and `"reserved":68`
- [x] `node $DL/scripts/check-contract-drift.cjs` prints `[CONTRACT DRIFT] OK commands=3`
- [x] The full deep-loop suite fails no test in a changed file or one that loads a changed module, and any other failure passes alone
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Ledger-first append. On a state log with a ledger beside it, every writer hands its row to the append gateway. Elsewhere it writes the row itself.

### Key Components
- **`$DL/lib/deep-loop/executor-audit.ts`**: exports `ledgerModeFor` and `appendFailureRow` so the two other writers reuse them instead of copying them.
- **`$DL/lib/deep-loop/post-dispatch-validate.ts`**: the `verification_degraded` row goes through `appendFailureRow`, and the `executor_missing` check also reads the iteration's `iteration_start` row on a ledger-backed log.
- **`$DL/lib/deep-loop/write-containment.ts`**: `appendContainmentEvent` sends both rows through `appendFailureRow` on a ledger-backed log and keeps its `appendFileSync` write elsewhere.
- **`$DL/scripts/append-mode-event.cjs`**: the review gateway also accepts the three rows under `deep_review.iteration_recorded`.
- **The research schema set**: three new stems wired through the types, the schema, the upcaster, the projection and the reducer, the way phase 020 added its two.

### Data Flow
A writer builds its row as today. `appendFailureRow` checks for ledger frames beside the state log. With frames and a session id it hands the row plus `sessionId` to the gateway, which records it under a ledger stem and rebuilds the state log, row included. With frames and no session id, or when the gateway refuses, it writes the row directly and prints one stderr line. Without frames the post-dispatch validator writes through `appendJsonlRecord` and the containment guard through `appendFileSync`, both exactly as today.

### Design per item

**`verification_degraded`.** The row is `{type: 'event', event: 'verification_degraded', status, confidence, threshold, language, reason, detail, timestamp}`. Today's direct write already used `appendJsonlRecord`, the same function `appendFailureRow` falls back to, so the no-ledger bytes do not change. The validator gets an optional `sessionId` input. Each `post_dispatch_validate` step names the validator declaratively, so each step gains a `sessionId` key beside its `dispatchReceipt`.

**`containment_violation` and `containment_contested`.** The guard swallows every logging error so a log write never blocks a containment decision. The ledger branch sits inside that same `try`, and `appendFailureRow` never throws on the gateway path. `EnforceInput` gets an optional `sessionId`, and each of the twelve `enforceWriteContainment` calls in the four workflows passes the same session id its `runAuditedExecutorCommand` call already passes. The fan-out runner passes no state log, so it is unchanged. That runner and its tests load `write-containment.ts` under plain Node, where `executor-audit.ts` cannot resolve its own `.js` imports. So the guard loads the helper through a guarded top-level `import()`, which yields null there and keeps the direct write. A static import failed eight tests in `write-containment.vitest.ts` and `fanout-run.vitest.ts` on the first full run.

**Research stems.** Review needs no new stem because `deep_review.iteration_recorded` carries any record whole. Research has no stem for these rows, so the gateway answers `unknown-legacy-record`. The three new stems are reducer-read rows carried field for field, with the projection's field lists in each writer's own key order. Field rules: `confidence` and `threshold` are finite numbers, the arrays and the data loss object are JSON, the note and the detail are prose and the iteration is optional on both containment rows because the guard writes it only when the caller names it.

**`executor_missing`.** After phase 019 the pre-dispatch audit writes the executor on the iteration's `iteration_start` row through the gateway, and the ledger cannot carry a later edit to the iteration record. The check now passes on a ledger-backed log when an `iteration_start` row of the same iteration names an executor. A state log with no ledger still requires the executor on the iteration record, as today.

**Prompt pack.** The one sentence that says the workflow patches the first iteration record now says the workflow records the executor on the iteration's opening `iteration_start` row.

### Restraint check
- No new helper. `appendFailureRow` already does what all three writers need, so it is exported.
- Review needs no new stem. Research needs the three, because no existing research stem keeps the confidence, the paths or the note.
- Owner of the shared contract: the research ledger schema. The contract that must not break: a state log with no ledger beside it gets the same rows and verdicts as today, which the unchanged `post-dispatch-validate.vitest.ts` and `write-containment.vitest.ts` pin.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup measures the loss with the probe and records the suite and file baselines. Implementation applies the writer, gateway, schema, workflow and prompt pack edits named in `spec.md` section 3. Verification runs each new test against the old sources and the new, then the typecheck, the four check scripts and the full suite. `tasks.md` holds the ordered work.

`$DL` is `.skilled/skills/system-deep-loop/runtime` and `$A` is `.skilled/commands/deep/assets`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Each new case in `executor-audit-ledger-projection.vitest.ts` opens a real run through the gateway. The verification case calls `validateIterationOutputs` on code that scores below the threshold. The containment case builds a git repository whose run directory sits in the lane's artifact directory, with an operator draft that changes during the dispatch and a stray lane write. Both then append another iteration record through the gateway, which rebuilds the state log, and read the rows back. A fail-first run puts the nine source files back to `HEAD` and runs the same file.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Phase 020's `appendFailureRow` and `ledgerModeFor`, committed as `6bf2594282`. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a ledger-backed run refuses or loses one of the three rows. Revert the phase commit. Before that, check that no ledger in use holds one of the new research stems: `rg -l 'deep_research\.(verification_degraded|containment_violation|containment_contested)' <run folders>` prints nothing. A ledger that holds one does not replay on the old runtime.
<!-- /ANCHOR:rollback -->

---
