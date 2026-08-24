# Direction Switch — Delete the Over-Engineered Rollback / Migration / Back-Compat Machinery

**Date:** 2026-08-23
**Decided by:** operator (direct, in-session)
**Worktree:** `.worktrees/022-012-runtime-enablement-build` (not pushed)

## 1. The switch

The 012 epic reached a working state — all 8 modes read ledger authority (reversible), legacy writers
retired-by-mechanism, projection contracts built — and was mid-way through a finalize + literal-PASS push.
The operator stopped that push. The direction is now:

> The improved ledger loop is the system. Drop legacy. Delete the over-engineered rollback, migration, and
> backwards-compatibility machinery that was never actually needed for system-deep-loop and is what dragged
> this epic out. Deletion first, before any further gate work.

This is an honest **simplification**, not a fabrication. Nothing pretends a safety window closed; the machinery
that enforced those windows is being removed because the owner judged it unneeded for this system's risk
profile. The finalize built earlier is window-free and records that truthfully.

## 2. Why (operator's rationale)

A quarter of the runtime is one-time-use migration scaffolding and reversibility ceremony built for a
legacy→ledger cutover that is effectively done. Keeping it costs comprehension, test time (~2h suite), and
every future change has to reason around it. The rollback windows (14 calendar days + 5 executions + drills
per mode) gate an irreversible finalize the operator does not want gated.

## 3. Inventory (measured 2026-08-23)

Runtime scale: **565 files / ~256k LOC** in `lib/`.

| Category | Modules | LOC | Deletable? |
|----------|---------|-----|-----------|
| **A. Rollback ceremony** | 8 `*-rollback-gate/` (~13.4k) + `rollback-drills/` (4.2k) + tests (16.7k) | **~34k** | Yes — rollback-gates have **zero external importers** (leaf) |
| **B. Migration scaffolding** | `*-shadow-parity/` ×3 + `shadow-parity/` (~14.4k), `inflight-state-classification/` (2.6k), `cutover-certificate/`, `mixed-version-fixtures/`, `restart-observation/`, `deep-research-cutover-evidence/`, 8 `*-certificates/` dirs | **~20k+** | Mostly — after import-severing (see §4) |
| **C. Legacy back-compat** | `legacy-projections/` (5.3k, 17 files) + ledger-schema upcaster suites (10.3k) | **~15k** | **Deferred** — powers the reader-contract check and keeps legacy files readable for consumers; full removal = a consumer-migration project, not a deletion |

**Immediate deletion target: A + B ≈ 45–50k LOC.** C is a separate, explicit future decision.

## 4. Dependency audit (deletion order — verified by import graph, not assumed)

- **rollback-gates**: no external importers → **delete first** (with their tests).
- **rollback-drills, shadow-parity**: imported only by the rollback-gates + `mixed-version-fixtures` → delete
  after the gates.
- **cutover-certificate, mixed-version-fixtures, restart-observation, deep-research-cutover-evidence**:
  migration-only → delete in the same wave.
- **inflight-state-classification**: MORE entangled — imported by `per-mode-authority-flip/types.ts` and
  `preflight.ts` (both **live-loop, kept**). Those imports must be **severed first** (confirm they only pull a
  type/enum, then inline or drop it) before this module can go.
- **KEEP (load-bearing live loop):** `per-mode-authority-flip` authority-selector + authority-registry + the
  finalize CAS; `mode-append-gateway`; the event ledger + event-envelope; `legacy-projections` (C, consumer
  surface).
- **The whole-system gate** (`005/scratch/run-gate.mjs`) references shadow-parity / rollback / inflight — its
  related checks are removed when those modules go; the gate is re-simplified afterward (§5, step 5).

## 5. Remaining work — roadmap

1. **Open a deletion phase** (Gate-3: new child under 012, e.g. `011-delete-overengineering`, or a sibling
   packet — resolve at start). Author its lean spec.
2. **Sever the live-loop → migration imports** (`per-mode-authority-flip/types.ts`, `preflight.ts` →
   `inflight-state-classification`). Verify typecheck/build stays green.
3. **Delete Wave 1 — rollback ceremony (A):** 8 rollback-gate modules + `rollback-drills` + their 9 test
   files (~34k LOC). Verify build + suite after.
4. **Delete Wave 2 — migration scaffolding (B):** shadow-parity ×3 + `shadow-parity`, `cutover-certificate`,
   `mixed-version-fixtures`, `restart-observation`, `deep-research-cutover-evidence`, the `*-certificates`
   dirs, then `inflight-state-classification`. Verify build + suite after each sub-step.
5. **Re-simplify the whole-system gate:** drop the shadow-parity / rollback / inflight checks; keep
   authority-state, reader-contracts (real, already built), runtime-suite, tree-clean, fanout-real-run.
   Re-baseline the suite on the lean tree.
6. **Resolve the finalize + gate decision on the lean system:** the U3+U4 gate work (authority-state accepts
   `final` + real reader-contracts) is built and verified but **uncommitted**; U2 (execute finalize, all 8 →
   `final`) is validated but **not run** (records backed up). Decide whether to finalize + land a lean PASS,
   or defer.
7. **Category C decision (later):** keep `legacy-projections` as the consumer surface, or migrate every
   consumer to read the ledger directly and remove legacy entirely.
8. **Reconcile 012 metadata + closeout:** 003/004 spec.md status (stale "Blocked" → their impl-summaries say
   Complete), 005/006/009/010, and the new deletion phase; `validate.sh --strict` at Errors:0.
9. **Do not push.**

## 6. State snapshot at the switch

- Committed: `f2d4d01d08` (012 projection contracts + fleet flip), `5511e4eac2` (U1 window-free finalize CAS +
  phase 010 scaffold).
- Uncommitted, verified: U3+U4 in `005/scratch/run-gate.mjs` (authority-state accepts final; real
  negative-controlled reader-contracts).
- Not executed: U2 finalize (8 records still `new_authoritative_reversible`; backed up under
  `scratchpad/authority-state-backup-pre-finalize/`).
- Authority: all 8 modes `new_authoritative_reversible`, `allOnLedger: true` (verified live).
