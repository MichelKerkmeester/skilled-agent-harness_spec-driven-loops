---
title: "Checklist: Delete Over-Engineered Rollback & Migration Machinery"
description: "Blocking verification contract: every deletion proven safe by the import graph, live-loop imports severed first, typecheck only dropping, all 8 modes still on ledger authority, the runtime suite's failing set not growing by name, and no safety evidence fabricated as satisfied."
trigger_phrases:
  - "delete overengineering checklist"
importance_tier: "critical"
contextType: "verification"
parent: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/011-delete-overengineering"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/011-delete-overengineering"
    last_updated_at: "2026-08-24T05:45:00Z"
    last_updated_by: "claude"
    recent_action: "Added Wave 3 checks: three orphaned modules deleted, failing set unchanged by name"
    next_safe_action: "mode-contracts is newly orphaned by the closures removal — next follow-up deletion candidate"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "No authority record changed; all 8 modes remain reversible"
      - "The three modules orphaned by the scaffolding removal are deleted; the failing set is unchanged by name"
---
# Checklist: Delete Over-Engineered Rollback & Migration Machinery

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

A deletion counts only when the import graph proves nothing live still imports the removed module, the
typecheck error set only shrinks, and the runtime suite's failing set does not grow by name. Live-loop
imports are severed and re-greened before the module they point at is removed. No safety window is
fabricated as closed: the ceremony is deleted, not faked as satisfied. No item here is advisory.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] The import graph was audited and the rollback gates/drills confirmed leaf (test-only importers) before removal (REQ-001) [EVIDENCE: `../scratch/direction-switch-delete-overengineering.md`; rollback-gates imported only by their own tests, deleted first in `90df8cfa67`]
- [x] CHK-002 [P0] The one live-loop reference into the scaffolding (`inflight-state-classification`, via `per-mode-authority-flip` and the `enable-modes.cjs` observation gate) was identified before deletion (REQ-004) [EVIDENCE: sever landed in `376aec67b3` (ceremony) and `20665c8d98` (enable-modes gate) before `inflight-state-classification` was removed in `f3a42a2af3`]
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-003 [P0] No dangling import remains: no kept file imports a deleted module (REQ-001, SC-002) [EVIDENCE: `git grep` for any quoted path to a deleted module across `lib scripts tests` returns only string-literal union members (`migrationUse: 'shadow-parity'`) and concept terms, no imports; the full suite reported zero `MODULE_NOT_FOUND` failures]
- [x] CHK-004 [P1] Comments carry the durable why; no spec paths, packet numbers, or task ids in code comments (REQ-006) [EVIDENCE: the one stale reference (`fanout-effect-dispatch.ts` "Mirrors the rollback-drill effect writer") was de-referenced to the durable why; comment-hygiene pre-commit gate enforces the same invariant]
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-005 [P0] Typecheck only drops; no kept file gains a new error after any wave (REQ-002, SC-003) [EVIDENCE: `tsc --noEmit` 61→57; the 4 vanished errors are the deleted `deep-research-cutover-evidence` file; the 11 remaining erroring files are the baseline set; `per-mode-authority-flip` stays type-clean]
- [x] CHK-006 [P0] All 8 modes remain on ledger authority — the live loop survived (REQ-003, SC-005) [EVIDENCE: `node scripts/verify-authority.cjs` → all 8 modes `new_authoritative_reversible`, epoch 2, selectedWriter `dark`, source `stored`, `allOnLedger:true`, exit 0]
- [x] CHK-007 [P0] Live-path suites pass on the lean tree (REQ-003) [EVIDENCE: `vitest run` on `per-mode-authority-flip`, `mode-append-gateway`, `append-mode-event-cli`, `authority-finalize`, `flip-authority-cli`, `enable-modes-cli`, `spawn-cjs` — 7 files, 100 tests passed]
- [x] CHK-008 [P0] The full runtime suite's failing set does not grow by name against the captured baseline (REQ-002, SC-004) [EVIDENCE: full `vitest run` — 154 files / 2745 tests passed; 9 files / 13 tests failed, ALL pre-existing/environmental (`dependency-seams` ×2 node_modules-symlink; `check-contract-drift`+`render-command-contract` stale compiled command contracts with zero `lib/` refs; `legacy-projections` unchanged census+source; `authorized-ledger` concurrency; stress `cli-devin`/`fanout`/`combo-matrix` external-executor). Set shrank from baseline 16 files / 14 tests; none reference a deleted module]
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-009 [P0] The named rollback and migration modules are gone from `lib/` and `tests/` (SC-001) [EVIDENCE: 41 lib module dirs and 47 test suites removed across 5 commits (274 files, 174,631 deletions); `90df8cfa67`, `376aec67b3`, `20665c8d98`, `f3a42a2af3`, `8371855fbb`]
- [x] CHK-010 [P0] `inflight-state-classification` was deleted only after its live-loop importers were severed and the build stayed green (REQ-004) [EVIDENCE: severs in `376aec67b3`/`20665c8d98`; `inflight-state-classification` removed in `f3a42a2af3` with typecheck green]
- [x] CHK-011 [P0] No safety window or removed-machinery evidence was fabricated as satisfied (REQ-006) [EVIDENCE: the ceremony is deleted, not faked; `spec.md` §2 Non-Goals; all 8 modes remain `new_authoritative_reversible` (reversible), no record rewritten to claim a closed window]
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-012 [P0] No authority record changed during this phase (REQ-006, SC-005) [EVIDENCE: `verify-authority.cjs` reports all 8 modes on their pre-phase `new_authoritative_reversible` state; the deletion touched `lib/`, `tests/`, `scripts/`, and docs only, never an authority record]
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-013 [P1] No doc names a deleted module or test; the newly-orphaned modules are flagged (REQ-005) [EVIDENCE: runtime/lib/tests READMEs corrected; `certificate-binding-core`, `compatibility-shadow`, and `cross-mode-closures` now have zero importers and are marked "no live importer" as next-wave candidates in §6 of `implementation-summary.md`]
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-014 [P2] The scoped diff removes only scaffolding modules, their suites, the pilot script, the observation gate, and doc ripples; the live loop and authority store are untouched (REQ-003) [EVIDENCE: the 3 in-session commits split 197 deletions + kept-file severs; the authority store is byte-identical; the whole-system-gate scratch is a separate concern held out of the deletion commits]
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:wave-3 -->
## Wave 3: Orphan Cleanup

- [x] CHK-018 [P0] The three orphaned modules were proven dead by the import graph before removal (REQ-001) [EVIDENCE: worktree-wide `import|require|from` scan → 0 import sites for `certificate-binding-core`, `compatibility-shadow`, `cross-mode-closures`; they do not import one another; the kept `legacy-projections` surface holds 0 references to `compatibility-shadow`]
- [x] CHK-019 [P0] No dangling import remains and no kept runtime file names a deleted module (REQ-001, SC-002) [EVIDENCE: post-delete dangling-import scan 0; CHK-013 re-scan of `lib tests scripts` finds only a pre-existing `shipped-census.ts` spec-contract path (folder already absent), not an import of the deleted module]
- [x] CHK-020 [P0] Typecheck and authority are unchanged after removal (REQ-002, REQ-003, SC-003, SC-005) [EVIDENCE: `tsc` 57 errors / 11 files before and after, identical (transient `--ignoreDeprecations 6.0` for pre-existing config drift; the three modules were in neither set); `verify-authority.cjs` all 8 modes `new_authoritative_reversible`, exit 0]
- [x] CHK-021 [P0] The full runtime suite's failing set does not grow by name (REQ-002, SC-004) [EVIDENCE: live-path suites 7 files / 100 tests; full suite 161 files (152 pass, 9 fail) / 2717 tests (2697 pass, 13 fail, 7 skip), exit 1 — same 9 files / 13 tests by name; delta fully accounted (−2 test files, −48 passing tests: 47 from the deleted suites + 1 dead seam-test)]
- [x] CHK-022 [P1] Doc hygiene complete and the cascade flagged (REQ-005) [EVIDENCE: stale references cleared from nine kept module READMEs + `tests/unit/README.md`; the dead `dependency-seams` seam-test removed; `mode-contracts` (newly orphaned) flagged as a follow-up candidate, not cascaded]
<!-- /ANCHOR:wave-3 -->

<!-- ANCHOR:summary -->
## Verification Summary

- [x] CHK-015 [P0] The whole-system gate is re-simplified: the shadow-parity/rollback/inflight checks are dropped and the kept checks remain (REQ-005, SC-006) [EVIDENCE: `git grep` on `run-gate.mjs` for deleted-check references returns only a `rollbackRef: null` fixture field; live check ids are `tree-clean`, `candidate-frozen`, `authority-state`, `runtime-suite`, `consumer-reachability`, `reader-contracts`, `fanout-real-run`. Its two heavy checks are satisfied piecewise (authority-state via `verify-authority.cjs`; runtime-suite via the full-suite delta above); the end-to-end orchestrated PASS on a finalized system is 010's scope, deferred with U2]
- [x] CHK-016 [P0] `validate.sh` on this folder with `--strict` reports Errors: 0 [EVIDENCE: `validate.sh --strict` on this folder — Errors: 0, after completing the Level-2 doc set and regenerating the metadata]
- [x] CHK-017 [P0] Every item above is `[x]` with evidence, or the phase is not complete [EVIDENCE: all 17 items are `[x]`. The scaffolding is deleted, the live loop is proven intact (typecheck, authority, live-path suites, suite delta), and no removed-safety evidence is fabricated]
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

|| Role | Condition |
|------|-----------|
| Builder | 41 module dirs and 47 suites deleted across 5 commits, import-graph-ordered so no commit leaves a dangling import |
| Verifier | Re-ran the dangling-import scan, typecheck, `verify-authority.cjs`, the live-path suites, and the full runtime suite independently; the failing set shrank and none reference a deleted module |
<!-- /ANCHOR:sign-off -->
