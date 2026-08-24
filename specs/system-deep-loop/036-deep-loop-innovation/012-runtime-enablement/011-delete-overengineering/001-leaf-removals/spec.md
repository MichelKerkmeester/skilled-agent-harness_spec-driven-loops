---
title: "Phase 001: Leaf Removals — Shadow Adapters, Recovery Manifest, Dead Constants"
description: "Wave 1 of the over-engineering removal program: delete the three lowest-risk, zero-caller leaves (F5 hierarchical-budgets shadow-adapters, F6 receipts legacy-recovery manifest, F8 dead AUTHORITY_FLIP_COMMON constants) and their tests, severing barrel exports first. No live-loop adjacency."
trigger_phrases:
  - "leaf removals wave"
  - "shadow adapters delete"
  - "dead authority constants delete"
importance_tier: "important"
contextType: "implementation"
status: complete
parent: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/011-delete-overengineering"
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

# Phase 001: Leaf Removals

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | .../011-delete-overengineering/001-leaf-removals |
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Risk** | Lowest — leaves, no live-loop adjacency |
| **Findings** | F5, F6, F8 (see parent `research/research.md`) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Three independent leaf artifacts have zero callers anywhere in the repo (proven by the audit's repo-wide
re-proof). They are safe to remove first and de-risk the barrel-editing pattern the later waves reuse.

- **F5** — `hierarchical-budgets/shadow-adapters.ts` (~164 LOC): shadow-parity comparison wrappers
  (`DarkAdmissionComparison`, `FanOutShadowInput`) used only by unit tests.
- **F6** — `receipts-and-effect-recovery/legacy-compatibility.ts` (~93 LOC): a frozen recovery-surface
  manifest (`LEGACY_RECOVERY_SURFACES`, `assessLegacyDispatchReceipt`) referenced only by one test block.
- **F8** — `per-mode-authority-flip/types.ts` dead constants (~15 LOC): `AUTHORITY_FLIP_COMMON_MODE`,
  `AUTHORITY_FLIP_COMMON_VARIANTS` with zero consumers outside their own barrel.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

| Surface | Change |
|---------|--------|
| `runtime/lib/hierarchical-budgets/shadow-adapters.ts` | Deleted (F5) |
| `runtime/lib/hierarchical-budgets/index.ts` | Shadow-adapters re-exports removed |
| `runtime/lib/receipts-and-effect-recovery/legacy-compatibility.ts` | Deleted (F6) |
| `runtime/lib/receipts-and-effect-recovery/index.ts` | Legacy-compat re-exports removed |
| `runtime/lib/per-mode-authority-flip/types.ts` | `AUTHORITY_FLIP_COMMON_*` constants removed (F8) |
| `runtime/lib/per-mode-authority-flip/index.ts` | Barrel export of those constants removed |
| `runtime/tests/hierarchical-budgets/hierarchical-budgets.vitest.ts` | Shadow test sections removed |
| `runtime/tests/unit/receipts-and-effect-recovery.vitest.ts` | Legacy-compat test block removed |

### Out of Scope

The `hierarchical-budgets` core, the `receipts-and-effect-recovery` core, and the `per-mode-authority-flip`
read path — all load-bearing, all retained.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001**: Barrel exports are severed before the target files are deleted (no dangling re-export).
- **REQ-002**: After the wave, tsc shows no new `TS2307` (module-not-found) against the 57-error baseline.
- **REQ-003**: `verify-authority.cjs` still reports all 8 modes on ledger authority.
- **REQ-004**: The runtime suite's failing set does not grow by name against the captured baseline.
- **REQ-005**: `git grep` finds no remaining reference to any deleted symbol or path.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The three targets and their test blocks are gone; barrels updated.
- **SC-002**: `rg` for `shadow-adapters|DarkAdmissionComparison|FanOutShadowInput|LEGACY_RECOVERY_SURFACES|assessLegacyDispatchReceipt|AUTHORITY_FLIP_COMMON_MODE|AUTHORITY_FLIP_COMMON_VARIANTS` returns zero non-deleted references.
- **SC-003**: tsc no new errors; authority 8/8 final; runtime suite failing-set unchanged by name.
- **SC-004**: One commit, well under the 100-file mass-deletion ceiling.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Lowest risk in the program — three independent leaves, no live-loop adjacency (see METADATA) | Minimal — targets are already zero-caller | T1's zero-caller re-scan runs before any edit |
| Dependency | tsc / vitest / `verify-authority.cjs` toolchain | Cannot run the verification gates | Already available in-repo; no new dependency introduced |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None — scope, sequencing, and verification gates are fully resolved for this wave.
<!-- /ANCHOR:questions -->
