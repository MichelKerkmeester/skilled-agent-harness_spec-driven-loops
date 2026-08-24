---
title: "Tasks: Delete Over-Engineered Rollback & Migration Machinery"
description: "Staged deletion: the rollback ceremony first (leaf modules), then the migration scaffolding in importer-before-importee order after severing the live loop, then gate re-simplification and doc hygiene, with typecheck, authority, and the runtime suite re-verified after each wave."
trigger_phrases:
  - "delete overengineering tasks"
importance_tier: "important"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/011-delete-overengineering"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/011-delete-overengineering"
    last_updated_at: "2026-08-24T03:36:58Z"
    last_updated_by: "claude"
    recent_action: "Reconciled tasks to the final state: five commits, 41 module dirs and 47 suites removed"
    next_safe_action: "010-full-enablement-finalize holds the finalized-gate PASS; U2 deferred"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The live loop survived: all 8 modes remain on ledger authority"
---
# Tasks: Delete Over-Engineered Rollback & Migration Machinery

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

|| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] **T-001** Audit the import graph and confirm the rollback gates and drills are leaf modules (test-only importers). [EVIDENCE: `../scratch/direction-switch-delete-overengineering.md`; rollback-gates imported only by their own tests]
- [x] **T-002** Delete the 8 `*-rollback-gate/` modules and `rollback-drills` with their test files. [EVIDENCE: commit `90df8cfa67`; −30,194 LOC; feature-catalog/playbook doc ripples cleaned]
- [x] **T-003** Remove the per-mode authority-flip cutover ceremony (preflight, cutover-coordinator, coordinator-factory, ledger-event, authority-flip-policy, manifest-order), keeping the selector, registry, and window-free finalize CAS. [EVIDENCE: commit `376aec67b3`; `per-mode-authority-flip` stays type-clean; `per-mode-authority-flip.vitest.ts` trimmed to selector/registry tests, 36/36]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

The migration scaffolding is removed in importer-before-importee order so no commit leaves a dangling import; live-loop imports are severed before the modules they point at are deleted.

- [x] **T-004** Sever `enable-modes.cjs` from the deleted observation/parity gate so the CLI flips each mode directly through the authority registry; trim the `enable-modes-cli` and `spawn-cjs` suites to the kept live path. [EVIDENCE: commit `20665c8d98`; the resume-guard test re-anchored on an unreadable-record stop; `enable-modes-cli` 19/19, `spawn-cjs` 4/4]
- [x] **T-005** Delete the 38 unit suites that only exercised the removed machinery, plus doc hygiene across runtime/lib/tests READMEs. [EVIDENCE: commit `20665c8d98`; 38 test files removed; `tests/unit/README.md` −28 rows, `lib/README.md` −4 rows, runtime `README.md` prose corrected]
- [x] **T-006** Delete the first module batch — `*-certificates`, `*-resume-adapter`, `*-shadow-parity` (partial), `cutover-certificate`, `deep-research-cutover-evidence`, `inflight-state-classification`. [EVIDENCE: commit `f3a42a2af3`; 100 files; `mixed-version-fixtures` deliberately withheld to the next commit]
- [x] **T-007** Delete the remaining modules — `shadow-parity`, `restart-observation`, the model/skill-benchmark emitters, `inflight-state-migration`, and `mixed-version-fixtures` last (after its only importers) — and the one-time pilot drill script. [EVIDENCE: commit `8371855fbb`; 59 files; `mixed-version-fixtures` removed after `inflight-state-classification` and `shadow-parity`, so no dangling import in the chain]
- [x] **T-008** Refresh the runtime, lib, and cross-referencing module READMEs so no doc names a deleted module or test; de-reference the one stale code comment. [EVIDENCE: commit `20665c8d98`; `certificate-binding-core`/`compatibility-shadow`/`legacy-projections`/`replay-fingerprint`/`sealed-reference-artifacts` READMEs corrected; `fanout-effect-dispatch.ts` comment de-referenced]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] **T-009** No dangling import remains. [EVIDENCE: `git grep` for any quoted path to a deleted module across `lib scripts tests` returns only string-literal union members (`migrationUse: 'shadow-parity'`) and concept terms, no imports; the full suite reported zero module-resolution failures]
- [x] **T-010** Typecheck only drops; no kept file regresses. [EVIDENCE: `tsc --noEmit` 61→57 errors; the 4 vanished errors are the deleted `deep-research-cutover-evidence` file; the 11 remaining erroring files are the baseline set (fleet-enablement driver, 9 legacy-projections, mode-append-gateway); `per-mode-authority-flip` stays type-clean]
- [x] **T-011** The live loop survived: all 8 modes on ledger authority. [EVIDENCE: `node scripts/verify-authority.cjs` → all 8 modes `new_authoritative_reversible`, epoch 2, selectedWriter `dark`, source `stored`, `allOnLedger:true`, exit 0]
- [x] **T-012** Live-path suites pass on the lean tree. [EVIDENCE: `vitest run` on `per-mode-authority-flip`, `mode-append-gateway`, `append-mode-event-cli`, `authority-finalize`, `flip-authority-cli`, `enable-modes-cli`, `spawn-cjs` — 7 files, 100 tests passed]
- [x] **T-013** Full runtime suite failing set does not grow by name against baseline. [EVIDENCE: full `vitest run` — 154 files / 2745 tests passed; 9 files / 13 tests failed, ALL pre-existing/environmental (`dependency-seams` node_modules-symlink ×2; `check-contract-drift`+`render-command-contract` stale compiled command contracts, zero `lib/` refs; `legacy-projections` unchanged census+source; `authorized-ledger` concurrency; stress `cli-devin`/`fanout`/`combo-matrix` external-executor). The set shrank from the captured baseline (16 files / 14 tests); none reference a deleted module]
- [x] **T-014** The whole-system gate is re-simplified: shadow-parity/rollback/inflight checks dropped; the kept checks remain. [EVIDENCE: `git grep` on `005-whole-system-gate/scratch/run-gate.mjs` for deleted-check references returns only a `rollbackRef: null` fixture field; the live check ids are `tree-clean`, `candidate-frozen`, `authority-state`, `runtime-suite`, `consumer-reachability`, `reader-contracts`, `fanout-real-run`. The end-to-end gate PASS on a finalized system is 010's scope (U2 deferred)]
- [x] **T-015** `validate.sh 011-delete-overengineering --strict` — Errors: 0. [EVIDENCE: `validate.sh --strict` on this folder — Errors: 0, after completing the Level-2 doc set and regenerating the metadata]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] **T-016** The named rollback and migration modules are gone from `lib/` and `tests/`, the live loop is intact, and no scaffolding remains that a future change must reason around. [EVIDENCE: 41 lib module dirs and 47 test suites removed across 5 commits (274 files, 174,631 deletions); live loop verified by T-010/T-011/T-012]
- [x] **T-017** `implementation-summary.md` records the waves, the deletion totals, the live-loop-survival proof, the suite delta, and the newly-orphaned modules flagged for a later wave. [EVIDENCE: `implementation-summary.md` §2, §5, §6]
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

|| Reference | Location |
|-----------|----------|
| Requirements | `spec.md` §4 |
| Plan | `plan.md` |
| Quality gates | `plan.md` §2 |
| Verification contract | `checklist.md` |
| Predecessor | `../009-mode-projection-contracts/` |
| Successor | `../010-full-enablement-finalize/` |
<!-- /ANCHOR:cross-refs -->
