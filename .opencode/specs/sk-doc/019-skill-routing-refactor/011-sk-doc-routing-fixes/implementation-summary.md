---
title: "Implementation Summary: sk-doc Router Path-Contract Fixes"
description: "In-progress implementation of the sk-doc typed-pair routing contract: Layer A (contract library, hub topology artifacts, parent-check enforcement, fixture typed-gold migration, replay/dispatch canonicalization, packet-map corrections, create-skill pathContract) is built; scorer taxonomy and the verification gate remain."
trigger_phrases:
  - "sk-doc routing fixes status"
  - "leaf resource contract library status"
  - "sk-doc typed-pair implementation progress"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/012-sk-doc-routing-fixes"
    last_updated_at: "2026-07-24T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Layer A built (T001-T006, T008-T009); deliverables verified present"
    next_safe_action: "Run T007 scorer taxonomy, then the T010-T012 verification gate"
    blockers:
      - "Packet-level verification gate (T010-T012) not yet run"
    key_files:
      - "spec.md"
      - "tasks.md"
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

# Implementation Summary: sk-doc Router Path-Contract Fixes

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | In Progress |
| **Level** | 3 |
| **Packet** | sk-doc/019-skill-routing-refactor/012-sk-doc-routing-fixes |
| **Completed** | Layer A (8 of the task set) |
| **Remaining** | T007 scorer taxonomy + T010-T012 verification gate |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Layer A — the runtime-critical minimum — is implemented (tasks.md T001-T006, T008-T009):

- **T001** Leaf-resource contract library + manifest generator (`create-skill/scripts/lib/leaf-resource-contract.cjs`, `generate-leaf-manifest.cjs`).
- **T002** Hub topology artifacts (`sk-doc/{mode-registry.json, leaf-aliases.json, leaf-manifest.json}`) carrying `resourceContractVersion`.
- **T003** Extended `parent-skill-check.cjs` with manifest / byte-drift / collision / reachability guards.
- **T004** Migrated the 19 sk-doc scenario fixtures to typed gold + the `validate-playbook-topology.cjs` pre-dispatch gate.
- **T005** Canonical typed-pair emission in `router-replay.cjs` + `executor-dispatch.cjs` (dual-read legacy).
- **T006** Corrected the nine affected `create-*` packet maps.
- **T008** Declared `pathContract` across the create-skill authoring stack.
- **T009** Removed the stale "~34 uncovered aliases" canon sentence.

The Layer-A deliverables were verified present on disk (contract library, manifests, topology validator).
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Dependency-ordered per `plan.md`: the contract library and topology artifacts first, then the
enforcement checker, fixture migration, and canonicalized replay/dispatch, then the packet-map
corrections and authoring-doctrine declarations. Legacy behaviour is preserved via dual-read so
the route-gold benchmark stays green during migration.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- Typed pairs are `(workflowMode, leafResourceId)` cross-checked against the committed manifest; a
  leaf path becomes a typed pair only when the hub ships a manifest.
- Dual-read legacy during migration to keep route-gold deterministic and green.
- The shared discovery-fixture set is owned here; sibling packet 013 consumes it read-only.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

**Not yet run for the full packet.** Per-task verification commands are recorded in `tasks.md`.
The packet-level static/unit gate (T010), the routing-contract + aggregate regression (T011), and
the Mode-B live benchmark against all 19 fixtures (T012) remain outstanding. The packet is **not**
Complete and makes no completion claim.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **In Progress, not Complete.** Layer A is built; T007 (scorer/report taxonomy) and the
   T010-T012 verification gate are outstanding.
2. The `checklist.md` QA items are not yet reconciled against the completed Layer-A tasks.
3. No Mode-B benchmark has run since Layer A landed, so the 20/100 → target-score improvement is
   unverified.
<!-- /ANCHOR:limitations -->
