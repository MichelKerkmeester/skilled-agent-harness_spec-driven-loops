---
title: "Implementation Plan: Deprecate deep-alignment and Cascade to the Conformance-Benchmark Capability"
description: "The phased removal plan: audit the true footprint, delete the mode packet + dedicated runtime + commands + agents, surgically strip alignment from ~25 shared runtime files, cascade to /deep:command-benchmark and the conformance-benchmark family, regenerate every projection/bridge/manifest, and prove no surviving mode or benchmark family regressed."
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/025-deprecate-deep-alignment"
    last_updated_at: "2026-08-27T11:40:00.000Z"
    last_updated_by: "claude"
    recent_action: "Authored the removal plan; delete-then-regenerate order proven"
    next_safe_action: "Confirm whole-suite vitest; commit; push v4 + main"
---
# Implementation Plan: Deprecate deep-alignment and Cascade to the Conformance-Benchmark Capability

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

deep-alignment is not a leaf mode; it is a capability spine. Its 126-file packet holds the shared conformance ENGINE (`scoping.cjs`, `check-convergence.cjs`, the peer adapters, the command-behavior matrix scheduler) that `/deep:command-benchmark` runs on — that command has no packet of its own — and that `/create:benchmark`'s conformance axis plus the `sk-create-benchmark` conformance-benchmark family author inputs for. Removing deep-alignment therefore orphans those surfaces, so the operator approved cascading the removal to the whole conformance-benchmark capability.

### Overview

Remove deep-alignment and its dependent conformance-benchmark capability in the order **audit → delete self-contained units → surgically edit shared units → regenerate derived metadata → verify against a captured baseline**. Deletions come before surgery so the compiler/test failures surface the exact shared references still needing edits. Derived metadata (advisor projection, command bridges, leaf-manifests, compiled command contracts) is regenerated from its hand-edited sources last, so the CI drift-guards validate the final state.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- The full footprint is inventoried and each hit classified (self-contained / shared / derived / historical).
- The cascade dependency is confirmed and operator-approved.
- The whole-suite baseline is captured so "no new failures" is measured, not asserted.

### Definition of Done

- 0 active references to the removed mode/command/family across `commands/` + `skills/`.
- The family-registry test + both advisor drift-guards + contract-drift all PASS.
- Both whole-suite gates show no NEW failures vs baseline.
- `validate.sh <spec-folder> --strict` → Errors: 0.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Delete-then-regenerate. Self-contained units are removed whole; shared units are surgically edited to drop only the alignment mode/family; derived metadata is regenerated from its now-edited sources so no hand-edited projection drifts from its source of truth.

### Key Components

- **Source of truth**: `mode-registry.json` — the advisor routing-projection, leaf-manifest, and compiled contracts all derive from it.
- **Shared runtime gateway**: `append-mode-event.ts` — the mode-dispatch fork where alignment branches are removed.
- **Cascade boundary**: `create-benchmark-*.yaml` + `sk-create-benchmark` — where the conformance family is stripped while `mcp_promotion` and the other families stay.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup — Audit the footprint & capture baseline

- Grep the whole tree for `deep-alignment`, `/deep:alignment`, `command-benchmark`, `conformance_benchmark`, `command-deep-alignment`.
- Classify each hit: self-contained (delete) vs shared (edit) vs derived (regenerate) vs historical (leave).
- Capture the whole-suite baseline (node:test 767/17; the 5 pre-existing runtime vitest failures).

### Phase 2: Implementation — Delete, edit, cascade, regenerate

- `git rm` the mode packet, dedicated runtime, both commands + assets, 6 agents, the conformance family.
- Surgically strip alignment from ~25 shared runtime files (gateway, enums/unions, census, manifests, stopping-clocks, path-coverage, registry-compiler + canary).
- Cascade: strip `conformance_benchmark` from the create-benchmark YAML + `sk-create-benchmark` SKILL/README/references + the family test (keep `mcp_promotion`).
- Edit registration sources (`mode-registry.json`, `hub-router.json`, `command-metadata.json`, advisor projection/bridges, `skill-graph.json`).
- Regenerate derived metadata (routing-projection, leaf-manifest, compiled contracts, packet `description.json` / `graph-metadata.json`).
- Sweep ~50 docs for references.

### Phase 3: Verification — Prove no surviving mode/family regressed

- Grep sweep → 0 active refs; family-registry test PASS; advisor drift-guards PASS; contract-drift PASS.
- Whole-suite node:test + vitest → delta vs baseline shows no NEW failures.
- `validate.sh --strict` → Errors: 0.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Dual whole-suite gate (node:test + runtime vitest), baseline-compared, is the safety net for the untyped shared-runtime surgery. Five targeted gates prove derived metadata is consistent with its regenerated sources: `test_create_benchmark_family_registry.py`, `routing-registry-drift-guard`, `command-bridge-resolution-guard`, `check-contract-drift`, and a grep-zero sweep for active references.

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Predecessor packets 022/023/024 (Phase-0 gate retirement + executor-kind routing) are shipped; this packet removes the mode they left in place.
- No external dependency changes. No data migration — the removal deletes files with no persisted-state reversal.

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

`git revert <commit>` (or reset the branch tip) restores every deleted file — the change is a clean removal with no data migration, so revert is complete and safe.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends on | Why |
|-------|-----------|-----|
| Phase 1 (Audit) | — | Must inventory before touching anything |
| Phase 2 (Remove) | Phase 1 | Classification drives what is deleted vs edited vs regenerated |
| Phase 3 (Verify) | Phase 2 | Gates run against the final removed state |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Work | Rough size |
|------|-----------|
| Deletions | 174 tracked files removed |
| Surgical edits | 110 tracked files modified |
| Regeneration | 5 derived-metadata generators re-run |
| Verification | 2 whole-suite gates + 5 targeted gates |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- Staging is surgical (`git add -u` + the 025 folder) — no sibling-packet run artifacts, `*.sqlite`, or `*.jsonl` staged.
- Both whole-suite gates baseline-compared before the completion claim.

### Rollback Procedure

- Single commit → `git revert <sha>` on the branch, then re-push v4 + main.

### Data Reversal

- None required — the removal touches no database, ledger, or persisted state; reverting the commit fully restores the prior tree.

<!-- /ANCHOR:enhanced-rollback -->
