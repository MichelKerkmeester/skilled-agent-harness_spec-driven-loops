---
title: "Legacy projection"
description: "Projects the append-only ledger into the legacy state file that existing readers consume; the append-gateway projection refresh is wired for deep-research only."
trigger_phrases:
  - "legacy projection"
  - "legacy-projection"
  - "legacy projection runtime"
  - "state safety legacy projection"
version: 1.4.0.15
---

# Legacy projection

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

A projection turns the append-only ledger into the legacy state file that existing readers consume. `LEGACY_PROJECTION_MANIFEST` names each surface, its disposition, its refresh boundary, and its readers; `requireProjectableManifestEntry()` rejects a surface that is not projectable.

This feature belongs to the state safety group and is catalogued as F053 in the `runtime/` inventory.

---

## 2. HOW IT WORKS

`LegacyProjectionEngine.project()` writes the projected bytes; the fold step derives them from the replayed events and a replay fingerprint.

The projection refresh inside the append gateway is wired for deep-research only. `appendModeEvent` resolves a projection contract, and its default resolver returns a contract for research and null for every other mode. A null contract leaves `projectionRefreshed` false and sets `projectionError` to "No projection contract registered for mode <mode>", and the append still succeeds.

Measured through the shipped CLI, same command shape, fresh run directory each: research exits 0 with `projectionRefreshed` true and the legacy state file and watermark written; review exits 0 with `projectionRefreshed` false and no legacy state file; alignment exits 0 with `projectionRefreshed` false and no legacy state file. A caller must read `projectionRefreshed`, not the exit code, to know whether the legacy file was refreshed.

The implementation is source-backed and covered by runtime-owned tests under `.opencode/skills/system-deep-loop/runtime/tests/`. Treat this as shipped behavior, not a roadmap claim.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `lib/legacy-projections/legacy-projection-manifest.ts` | Runtime | Manifest of projectable surfaces, dispositions, refresh boundaries, and readers. |
| `lib/legacy-projections/legacy-projection-engine.ts` | Runtime | Writes the projected legacy bytes. |
| `lib/legacy-projections/legacy-projection-fold.ts` | Runtime | Folds replayed events into projected state. |
| `lib/legacy-projections/deep-research-contract.ts` | Runtime | The one registered projection contract. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `tests/unit/legacy-projections.test.ts` | Test | Primary regression coverage for Legacy projection. |
| `tests/unit/transactional-projections.vitest.ts` | Test | Transactional projection refresh coverage. |

---

## 4. SOURCE METADATA

- Group: State safety
- Canonical catalog source: `feature-catalog.md`
- Feature ID: F053
- Feature file path: `state-safety/legacy-projection.md`
- Primary sources: `lib/legacy-projections/legacy-projection-engine.ts`, `tests/unit/legacy-projections.test.ts`
Related references:
- [state safety](../../feature-catalog/state-safety) — State safety category
