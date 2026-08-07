---
title: "Implementation Summary: Phase 11 hub canon"
description: "Backfilled Level-2 implementation summary for the shipped parent-hub canon phase."
trigger_phrases:
  - "hub canon implementation summary"
  - "parent hub canon shipped"
  - "two-axis parent hub summary"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/017-sk-code-parent/011-hub-canon"
    last_updated_at: "2026-07-05T10:12:31.030Z"
    last_updated_by: "openai-gpt-5.5"
    recent_action: "Backfilled the complete Level 2 doc set for the already-shipped hub canon phase."
    next_safe_action: "Reference this phase for parent-hub canon."
    blockers: []
    key_files:
      - ".opencode/specs/sk-code/017-sk-code-parent/011-hub-canon/spec.md"
      - ".opencode/specs/sk-code/017-sk-code-parent/011-hub-canon/plan.md"
      - ".opencode/specs/sk-code/017-sk-code-parent/011-hub-canon/tasks.md"
      - ".opencode/specs/sk-code/017-sk-code-parent/011-hub-canon/checklist.md"
      - ".opencode/specs/sk-code/017-sk-code-parent/011-hub-canon/design-contract.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "backfill-011-hub-canon-2026-07-05"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Canon is the sk-design/sk-code 2-tier shape generalized."
      - "Deep-loop 3-tier machinery is represented as named extensions."
      - "Every packet is a modes[] entry with packetKind workflow or surface."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 011-hub-canon |
| **Completed** | 2026-07-05 |
| **Level** | 2 |
| **Actual Effort** | Already shipped; documentation backfill completed in current session |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

This phase made one parent-hub method canonical for the repo. The canon is the sk-design/sk-code 2-tier shape generalized across hubs, while deep-loop's 3-tier machinery is expressed as named `extensions` instead of a separate physical structure.

### Canon Definition

The phase defines a two-axis model where every packet is represented in `modes[]` and carries `packetKind: "workflow" | "surface"`. Surface entries use `backendKind: "evidence-base"`, read-only `toolSurface`, and metadata routing. `hub-router.json` and `description.json` are required for all hubs.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-doc/assets/skill/parent_skill_hub_template.md` | Rewritten | v2.0 parent hub template, de-deep-looped with sk-code as canonical example |
| `.opencode/skills/sk-doc/assets/skill/parent_skill_registry_template.json` | Rewritten | Two-axis registry template |
| `.opencode/skills/sk-doc/assets/skill/parent_skill_graph_metadata_template.json` | Rewritten | Parent graph metadata template |
| `.opencode/skills/sk-doc/references/skill_creation/parent_hub_router_schema.md` | Created | First `hub-router.json` schema documentation |
| `.opencode/skills/sk-doc/assets/skill/parent_skill_hub_router_template.json` | Created | Parent hub router template |
| `.opencode/skills/sk-doc/assets/skill/parent_skill_description_template.json` | Created | Required hub description template |
| `.opencode/skills/sk-doc/references/skill_creation/parent_skills_nested_packets.md` | Rewritten | Three-hub extension matrix |
| `.opencode/skills/sk-doc/references/skill_creation.md` | Updated | Parent hub authoring index |
| `.opencode/skills/sk-doc/SKILL.md` | Updated | Routable PARENT_HUB intent |
| `.opencode/commands/doctor/scripts/parent-skill-check.cjs` | Updated | Full checks 1-9 for all hubs, migration-gated strict behavior |
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/parent-hub-vocab-sync.cjs` | Updated | Fail-loud missing router/registry behavior |
| `/create:sk-skill-parent` command files | Updated | Two-axis parent hub scaffolding and gate integration |
| `.opencode/commands/doctor/doctor_parent-skill.yaml` | Updated | Two-axis invariant for doctor parent-skill checks |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The core phase shipped in remote commit `b6fe2f31b1` and local commit `deab5a3853`; the tail shipped in remote commit `d1b545e4b6`. The tail hardened vocab sync missing-metadata behavior, upgraded the parent-hub scaffolder to emit the canonical two-axis file set, and added the doctor two-axis invariant.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Generalize the sk-design/sk-code 2-tier shape | It provides the simplest shared parent-hub method already present in the repo |
| Model deep-loop machinery as `extensions` | It preserves deep-loop behavior without creating a separate canonical structure |
| Keep surfaces in `modes[]` | Existing vocab sync and router replay consumers derive aliases and packet roots from `modes[]` |
| Require `hub-router.json` and `description.json` | Hubs need explicit routing policy and discoverable metadata to be validated consistently |
| Gate migration strictly only under `PARENT_HUB_CHECK_STRICT` | Existing hubs had known strict gaps that needed inventory before promotion |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Coverage | Notes |
|-----------|--------|----------|-------|
| vocab-sync vitests | Pass | 5/5 | Includes missing router/registry fail-loud fixtures from `d1b545e4b6` |
| drift guard | Pass | 7/7 | Advisor projection compatibility stayed green |
| deep-improvement vitests | Partial pass | 414 pass | 2 failures were pre-existing and unrelated per phase facts |
| strict-gap inventory | Complete | sk-code 6, deep-loop 27, sk-design 10 | Migration-gated inventory for later promotion |
| scratch scaffold parent-skill-check | Pass | default and strict | Scratch scaffold hub exits 0 in both modes |
| spec validation | Zero errors | Level-2 phase docs | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/sk-code/017-sk-code-parent/011-hub-canon --strict` reports `Summary: Errors: 0  Warnings: 1` for the accepted missing graph metadata warning |

### Test Coverage Summary

| File | Statements | Branches | Functions |
|------|------------|----------|-----------|
| Parent hub canon docs/templates | Covered by strict docs and shipped gate evidence | Covered by parent-skill-check inventory | Covered by parent-skill-check and vocab sync gates |
| Phase Level-2 docs | Covered by strict spec validation | N/A | N/A |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:nfr-verify -->
## NFR Verification

| NFR ID | Target | Actual | Status |
|--------|--------|--------|--------|
| NFR-P01 | Local parent hub checks remain usable | Scratch scaffold parent-skill-check exits 0 in default and strict mode | Pass |
| NFR-S01 | Surface packets are read-only | Canon requires surface `toolSurface.mutatesWorkspace:false` and forbids mutation tools | Pass |
| NFR-R01 | Missing metadata fails loudly | Vocab sync fail-loud behavior shipped with vitest fixtures | Pass |
| NFR-R02 | Migration strictness is controllable | Warnings by default, fail under `PARENT_HUB_CHECK_STRICT` | Pass |

<!-- /ANCHOR:nfr-verify -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. Strict-gap promotion was intentionally left for a later phase; this phase records the inventory and keeps default behavior warning-based.
2. Phase 013 performs the live sk-code two-axis restructure; this phase defines the canon that phase 013 applies.

<!-- /ANCHOR:limitations -->
---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| Complete canon definition and enforcement | Completed and shipped | Matches phase scope |
| Promote all new parent-skill-check gaps immediately | Left migration-gated | Existing hubs needed inventory before strict promotion |
| Complete Level-2 docs during original code work | Backfilled after shipment | User requested documentation-only backfill for an already-shipped phase |

<!-- /ANCHOR:deviations -->
