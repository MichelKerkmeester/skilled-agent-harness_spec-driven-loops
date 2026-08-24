---
title: "Feature Specification: Delete Over-Engineered Rollback & Migration Machinery"
description: "Remove the rollback ceremony (14-day windows, drills, certificates) and one-time migration scaffolding (shadow-parity, inflight-state-classification, cutover evidence) that was never needed for system-deep-loop and dragged the epic out, keeping the live ledger loop and the consumer-facing projections intact."
trigger_phrases:
  - "delete overengineering"
  - "remove rollback machinery"
  - "delete migration scaffolding"
importance_tier: "critical"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement"
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
      - ".opencode/skills/system-deep-loop/runtime/lib/per-mode-authority-flip/index.ts"
    completion_pct: 100
    open_questions:
      - "Category C (legacy-projections) — keep as consumer surface or migrate consumers off? Deferred."
      - "mode-contracts is newly orphaned (sole importer was the removed cross-mode-closures) — next follow-up deletion candidate"
    answered_questions:
      - "The rollback-window/drill/certificate ceremony is not required for this system and is deleted, not fabricated as satisfied"
      - "rollback-gates are leaf modules (imported only by their own tests) — safe first deletion"
      - "The three modules orphaned by the scaffolding removal are deleted; compatibility-shadow is distinct from the retained legacy-projections surface"
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

# Feature Specification: Delete Over-Engineered Rollback & Migration Machinery

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/011-delete-overengineering |
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-08-23 |
| **Owner skill** | system-deep-loop |
| **Authority posture** | No authority moves; removes machinery, keeps the live loop and projections |

> Created by the operator's deletion-first direction switch (see
> `../scratch/direction-switch-delete-overengineering.md`). The reversible→ledger migration is effectively
> done; the rollback/migration ceremony built to reach it is now dead weight.
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

About a quarter of the runtime (~256k LOC) is one-time-use migration scaffolding and reversibility ceremony:
rollback gates with 14-day windows, rollback drills, cutover certificates, shadow-parity harnesses, and
inflight-state classification. It gated a legacy→ledger cutover that has already happened. It costs
comprehension and ~2h of suite time, and every future change has to reason around it.

### Purpose

Delete the rollback ceremony and the migration scaffolding — proven safe by the import graph, wave by wave,
with the build and suite re-verified after each wave — leaving the live ledger loop and the consumer-facing
projections intact.

### Calibration

> **Severity calibration (carry verbatim).** Actor is the operator in a not-pushed worktree; risk is
> build-breakage and lost coverage, not breach. Every deletion is git-reversible in the worktree.

### Non-Goals

- Deleting `legacy-projections` (Category C — the consumer-facing projection surface) — that is a
  consumer-migration project, decided separately. `compatibility-shadow`'s dual-read / versioned-upcaster
  adapters are *not* that surface: they are the dead shadow-parity comparison harness (the retained
  `legacy-projections` holds zero references to them) and were removed in Wave 3.
- Deleting the live loop: authority selector/registry/finalize CAS, append-gateway, event ledger/envelope.
- Fabricating that any safety window closed. The ceremony is removed, not faked as satisfied.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- **Wave 1:** the 8 `*-rollback-gate/` modules + their 8 test files (leaf — test-only importers).
- **Wave 2:** `rollback-drills`, `*-shadow-parity` ×3 + `shadow-parity`, `cutover-certificate`,
  `mixed-version-fixtures`, `restart-observation`, `deep-research-cutover-evidence`, the `*-certificates`
  dirs, and finally `inflight-state-classification` — after severing its live-loop importers
  (`per-mode-authority-flip/types.ts`, `preflight.ts`).
- Re-simplifying the whole-system gate to drop the shadow-parity/rollback/inflight checks.
- **Wave 3:** the three modules the scaffolding removal orphaned — `certificate-binding-core`,
  `compatibility-shadow`, `cross-mode-closures` — and their two unit suites, after a worktree-wide import scan
  proved zero importers; plus the doc-hygiene ripple (nine kept module READMEs, `tests/unit/README.md`, and the
  one dead `dependency-seams` seam-test).

### Out of Scope

- Category C (legacy-projections), consumer migration, pushing the branch.

### Affected Surfaces

| Surface | Change |
|---------|--------|
| `lib/*-rollback-gate/`, `lib/rollback-drills/` | Deleted |
| `lib/*-shadow-parity/`, `lib/shadow-parity/`, `lib/inflight-state-classification/` | Deleted |
| `lib/cutover-certificate/`, `lib/mixed-version-fixtures/`, `lib/restart-observation/`, `lib/deep-research-cutover-evidence/`, `lib/*-certificates/` | Deleted |
| `lib/per-mode-authority-flip/{types,preflight}.ts` | Import of inflight-classification severed |
| `005-whole-system-gate/scratch/run-gate.mjs` | Shadow-parity/rollback/inflight checks removed |
| `tests/unit/` | Deleted suites for every removed module |
| `lib/certificate-binding-core/`, `lib/compatibility-shadow/`, `lib/cross-mode-closures/` | Deleted (Wave 3 — orphaned by the scaffolding removal) |
| Nine kept module READMEs + `tests/unit/README.md` | Stale references to the Wave 3 modules cleared |
| `tests/unit/dependency-seams.vitest.ts` | Dead seam-test for the deleted barrel removed |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001**: Every deletion is proven safe by the import graph before removal; no wave leaves a dangling import.
- **REQ-002**: After each wave, typecheck/build is green and the runtime suite's failing set does not grow (by name) against baseline.
- **REQ-003**: The live loop is untouched: authority selector/registry/finalize CAS, append-gateway, event ledger/envelope, and the projection contracts still function.
- **REQ-004**: `inflight-state-classification` is deleted only after its live-loop importers are severed and the build stays green.
- **REQ-005**: The re-simplified gate keeps authority-state, reader-contracts, runtime-suite, tree-clean, and fanout-real-run, and drops only the checks whose modules were deleted.
- **REQ-006**: No authority record changes; no fabrication of removed safety evidence.
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The named rollback + migration modules are gone from `lib/` and `tests/`.
- **SC-002**: `git grep` finds no remaining import of any deleted module.
- **SC-003**: Typecheck/build is green on the lean tree.
- **SC-004**: The runtime suite's failing set does not grow by name against the captured baseline.
- **SC-005**: `verify-authority.cjs` still reports all 8 modes on ledger authority (the live loop survived).
- **SC-006**: The re-simplified gate runs and its kept checks pass on the lean tree.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Consequence | Mitigation |
|------|-------------|------------|
| A "leaf" module has a hidden importer | Build breaks after deletion | Re-audit the import graph immediately before each wave; typecheck after |
| Severing inflight-classification from the live loop drops a needed type | Live-loop type error | Confirm it is only a type/enum; inline or replace before deleting the module |
| Deleting a module removes a gate check that was load-bearing | Gate silently weaker | Re-simplify the gate deliberately; keep the real reader-contract + authority checks |

**Dependencies**: the import-graph audit in `../scratch/direction-switch-delete-overengineering.md`.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

Category C (`legacy-projections`): keep as the consumer surface, or migrate every consumer to read the ledger
directly and remove legacy entirely? Deferred to an explicit operator decision.

`mode-contracts` is newly orphaned by the Wave 3 removal of its sole importer (`cross-mode-closures`). Should it
— and any speculative subtree only that importer reached — be removed in a further wave? Deferred; left in place
rather than cascaded.
<!-- /ANCHOR:questions -->
