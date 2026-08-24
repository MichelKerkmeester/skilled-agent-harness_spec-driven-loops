---
title: "Implementation Plan: Delete Over-Engineered Rollback & Migration Machinery"
description: "Delete the rollback ceremony and one-time migration scaffolding wave by wave, proving each removal safe by the import graph, severing live-loop imports first, and re-verifying typecheck, authority, and the runtime suite after each wave, leaving the live ledger loop and consumer projections intact."
trigger_phrases:
  - "delete overengineering plan"
  - "remove rollback machinery plan"
importance_tier: "important"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/011-delete-overengineering"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/011-delete-overengineering"
    last_updated_at: "2026-08-24T05:45:00Z"
    last_updated_by: "claude"
    recent_action: "Deleted three orphaned modules in a follow-up wave"
    next_safe_action: "mode-contracts is newly orphaned by the closures removal — next follow-up deletion candidate"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/scripts/enable-modes.cjs"
      - ".opencode/skills/system-deep-loop/runtime/lib/per-mode-authority-flip/"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The rollback/migration ceremony is deleted, not fabricated as satisfied"
      - "Every deletion is proven safe by the import graph before removal"
      - "The three modules orphaned by the scaffolding removal are deleted; the failing set is unchanged by name"
---

# Implementation Plan: Delete Over-Engineered Rollback & Migration Machinery

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

|| Aspect | Value |
|--------|-------|
| **Surface** | `runtime/lib/` scaffolding modules, their `tests/unit/` suites, the `enable-modes.cjs` CLI, and the whole-system gate |
| **Change class** | Deletion of one-time migration/rollback scaffolding; no behaviour added |
| **Authority** | Untouched; every mode stays on `new_authoritative_reversible`, no record rewritten |
| **Blast radius** | Contained: the live ledger loop (authority selector/registry/finalize CAS, append-gateway, event ledger/envelope, legacy-projections) is preserved and re-verified after each wave |

About a quarter of the runtime was one-time-use migration scaffolding and reversibility ceremony —
rollback gates with 14-day windows, rollback drills, cutover certificates, shadow-parity harnesses, and
inflight-state classification — built to gate a legacy→ledger cutover that has already happened. This plan
deletes it wave by wave. Every removal is proven safe by the import graph first; live-loop imports are
severed before the modules they point at are deleted; typecheck, authority state, and the runtime suite are
re-verified after each wave so a regression surfaces at the wave that caused it.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

|| Gate | Command | Pass condition |
|------|---------|----------------|
| No dangling import | `git grep` for any quoted path to a deleted module across `lib scripts tests` | No import of a deleted module remains |
| Typecheck | `tsc --noEmit -p tsconfig.json` | Error count only drops; no kept file gains a new error |
| Authority survived | `node scripts/verify-authority.cjs` | All 8 modes on ledger authority, exit 0 |
| Suite delta | full runtime suite vs captured baseline | Failing set does not grow by name; no module-resolution failure |
| Packet | `validate.sh 011-delete-overengineering --strict` | `Errors: 0` |
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The deletion is ordered by the import graph, not by convenience. Before each wave the graph is re-audited so
no wave leaves a file that imports a file it just removed. Two rules hold across the whole phase:

- **Sever live-loop imports first.** The only live-loop reference into the scaffolding was
  `inflight-state-classification`, reached through `per-mode-authority-flip` and `enable-modes.cjs`'s
  observation gate. Those references are severed and the build re-greened *before* the module is deleted, so
  the live loop never imports an absent module.
- **Delete importer before importee.** Among the deleted modules the import graph is nearly flat: the only
  inter-module edge is `mixed-version-fixtures`, imported by `inflight-state-classification` and
  `shadow-parity`. `mixed-version-fixtures` is therefore removed last, after both importers, so no commit in
  the chain leaves a dangling import — greenness by construction, proven from the graph rather than assumed.

The registry-direct authority flip is what makes the observation/parity gate removable: `enable-modes.cjs`
flips each mode straight through the authority registry's compare-and-swap, so the shadow-parity and
inflight-classification observation machinery it used to call is dead weight, not a load-bearing check.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Rollback ceremony (leaf-first)

- Delete the 8 `*-rollback-gate/` modules and the `rollback-drills` harness with their test files. These are
  leaf modules — imported only by their own tests — so they are the safest first removal.
- Remove the per-mode authority-flip cutover ceremony (preflight, cutover-coordinator, coordinator-factory,
  ledger-event, authority-flip-policy, manifest-order), keeping the selector, registry, and finalize CAS.

### Phase 2: Migration scaffolding (importer-ordered)

- Sever `enable-modes.cjs` from the deleted observation/parity gate so the CLI flips each mode directly
  through the authority registry; trim the `enable-modes-cli` and `spawn-cjs` suites to the kept live path.
- Delete the `*-shadow-parity` ×8 + `shadow-parity` harness, the `*-certificates` and `*-resume-adapter`
  families, `cutover-certificate`, `restart-observation`, `deep-research-cutover-evidence`,
  `inflight-state-migration`, and `inflight-state-classification`, then `mixed-version-fixtures` last.
- Delete every unit suite that only exercised the removed machinery, and the one-time pilot drill script.

### Phase 3: Gate re-simplification & doc hygiene

- Re-simplify the whole-system gate: drop the shadow-parity/rollback/inflight checks, keep authority-state,
  reader-contracts, runtime-suite, tree-clean, candidate-frozen, consumer-reachability, and fanout-real-run.
- Refresh the runtime, lib, and cross-referencing module READMEs so no doc names a deleted module or test.

### Phase 4: Orphan cleanup (Wave 3)

- Re-audit the import graph worktree-wide and confirm `certificate-binding-core`, `compatibility-shadow`, and
  `cross-mode-closures` have zero importers (the scaffolding removal was their only consumer).
- Delete the three modules and their two unit suites; clear the stale references from the nine kept module
  READMEs and `tests/unit/README.md`; drop the one `dependency-seams` seam-test that guarded the deleted barrel.
- Re-verify: dangling-import scan 0, typecheck unchanged, authority unchanged, live-path suites green, and the
  full runtime suite's failing set unchanged by name. Flag `mode-contracts` (newly orphaned) for a later wave
  rather than cascading.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

|| Test Type | Scope | Tools |
|-----------|-------|-------|
| Dangling-import scan | Whole tree | `git grep` for any quoted path to a deleted module across `lib scripts tests` |
| Typecheck | Whole runtime | `tsc --noEmit -p tsconfig.json`; compare erroring-file set to baseline |
| Live-path suites | Kept modules | `vitest run` on authority-flip, append-gateway, finalize, flip-cli, enable-modes-cli, spawn-cjs |
| Authority survival | Live loop | `node scripts/verify-authority.cjs` — all 8 modes on ledger |
| Suite delta | Full runtime suite | Full `vitest run` vs captured baseline; failing set compared by name |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

|| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `009-mode-projection-contracts` | Predecessor | Complete | Consumer projections must be covered before scaffolding around them is removed |
| `010-full-enablement-finalize` | Successor | Planned (U2 deferred) | The end-to-end gate PASS on a finalized system lands there; this phase leaves all 8 modes reversible |
| Import-graph audit | Input | Complete | `../scratch/direction-switch-delete-overengineering.md` |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **A "leaf" module with a hidden importer** is caught by the dangling-import scan and by typecheck after each
  wave; a broken import shows as a `MODULE_NOT_FOUND` load failure or a new `tsc` error at the wave that
  caused it.
- **Severing inflight-classification dropping a needed type** is caught by typecheck: `per-mode-authority-flip`
  stays type-clean and the erroring-file set only shrinks.
- **A silent authority change** is caught by `verify-authority.cjs` after every wave; all 8 modes stay on
  `new_authoritative_reversible`. Every commit is git-reversible in the not-pushed worktree.
<!-- /ANCHOR:rollback -->

<!-- ANCHOR:cross-refs -->
## Cross-References

|| Reference | Location |
|-----------|----------|
| Requirements | `spec.md` §4 |
| Task list | `tasks.md` |
| Verification contract | `checklist.md` |
| Direction switch | `../scratch/direction-switch-delete-overengineering.md` |
| Predecessor | `../009-mode-projection-contracts/` |
| Successor | `../010-full-enablement-finalize/` |
<!-- /ANCHOR:cross-refs -->
