---
title: "Implementation Plan: Phase 011 — Manual Testing Playbook Full Alignment"
description: "Completed Level 2 implementation plan for the sk-design hub and five mode-packet manual testing playbook alignment pass."
trigger_phrases:
  - "implementation plan"
  - "manual testing playbook alignment"
  - "procedure card selection proof"
  - "hub manager intake coverage"
importance_tier: "high"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/sk-design/009-sk-design-claude-parity/011-manual-testing-playbook-alignment/"
    last_updated_at: "2026-07-06T09:07:56Z"
    last_updated_by: "opencode-gpt-5-5"
    recent_action: "Implemented the manual testing playbook alignment pass."
    next_safe_action: "Review implementation-summary.md and validation output."
---
# Implementation Plan: Phase 011 — Manual Testing Playbook Full Alignment

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | Manual testing playbooks: sk-design hub plus all five mode packets |
| **Primary Area** | `.opencode/skills/sk-design/**/manual_testing_playbook/**` |
| **Spec Level** | 2 |
| **Status** | Complete |
| **Testing** | Scoped consistency review, metadata regeneration, `validate.sh --strict` |
| **Mutation Policy** | Edits stayed within the user-allowed Phase 011 docs and sk-design playbook paths. |

This pass implemented a two-tier scenario-authoring plan. Tier 1 added 8 hub-level scenarios: `PB-004..006`, `FR-001..002`, and `HM-001..003`. Tier 2 added 15 mode-level scenarios, one 3-scenario `procedure-card-contract` category per mode packet. Six root playbooks were updated so their counts and indexes match the new files.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Phase 011 scope was explicit and confined to allowed paths. Evidence: user-provided allowed write paths plus this plan's summary.
- [x] The scenario gap was grounded in direct reads. Evidence: hub root initially showed `PB-001..003`; mode roots had no procedure-card-contract categories.
- [x] Every mode's live `Procedure Card Selection` and `Context, Proof, And Direct Fallback` sections were read before scenario authoring. Evidence: direct reads of all five mode `SKILL.md` sections.
- [x] The hub's `Manager Intake Before Routing`, `Visible Plan Before Design or Build Work`, and `Proof Gates and Verifier Cadence` sections were read before `HM-001..003` authoring. Evidence: direct read of hub `SKILL.md` lines 43-109.

### Definition of Done

- [x] 23 new scenario files exist under allowed `manual_testing_playbook/**` paths.
- [x] Six root playbooks are updated with scenario/category counts and index rows.
- [x] Phase 011 `tasks.md`, `checklist.md`, and `implementation-summary.md` record real evidence.
- [x] `description.json` and `graph-metadata.json` are regenerated last after content edits.
- [x] `validate.sh --strict` is run after metadata regeneration and the result is recorded in `implementation-summary.md`.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The implementation preserves the existing split-document playbook package shape: each root `manual_testing_playbook.md` acts as a directory and release-readiness surface, while each scenario lives in one file under a numbered `NN--category-name/` folder.

| Component | Implemented Shape |
|-----------|-------------------|
| Hub parity extension | `PB-004..006` in existing `06--parity-behavior/` |
| Hub fallback category | `07--fallback-and-resilience/` with `FR-001..002` |
| Hub manager category | `08--hub-manager-intake/` with `HM-001..003` |
| Mode categories | `NN--procedure-card-contract/` in each mode playbook, 3 scenarios each |
| Root updates | Hub 32/8; interface 20/14; foundations 11; motion 13; audit 14; md-generator 18/16 |

The shared `polish_gate_orchestration.md` card is covered once at hub level through `PB-006`; it is not duplicated inside mode-level categories.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Gap Confirmation and Inventory

- [x] Read Phase 011 planning docs. Evidence: `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` read in full; no `decision-record.md` exists.
- [x] Read sk-doc manual testing playbook templates. Evidence: `manual_testing_playbook_template.md` and `manual_testing_playbook_snippet_template.md` read.
- [x] Read hub and mode root playbooks. Evidence: all six root `manual_testing_playbook.md` files read.
- [x] Read hub and mode `SKILL.md` source sections. Evidence: hub manager sections and five mode procedure/direct-fallback sections read.
- [x] Inventory procedure cards. Evidence: glob found interface 6, foundations 3, motion 1, audit 2, md-generator 1, shared 1.

### Phase 2: Hub-Level Scenario Implementation

- [x] Added `PB-004` motion procedure-selection proof.
- [x] Added `PB-005` audit procedure-selection proof.
- [x] Added `PB-006` shared polish-gate selection proof.
- [x] Added `FR-001..002` fallback-and-resilience scenarios.
- [x] Added `HM-001..003` hub-manager-intake scenarios.
- [x] Updated hub root playbook count and index to 32 scenarios across 8 categories.

### Phase 3: Mode-Level Scenario Implementation

- [x] Added interface `ID-018..020` and updated root to 20 scenarios across 14 categories.
- [x] Added foundations `FOUND-PROCCARD-001..003` and updated root release-readiness count to 11 scenarios.
- [x] Added motion `MOTION-PROCCARD-001..003` and updated root release-readiness count to 13 scenarios.
- [x] Added audit `AUDIT-PROCCARD-001..003` and updated root release-readiness count to 14 scenarios.
- [x] Added md-generator `PROCCARD-001..003` and updated root to 18 scenarios across 16 categories.

### Phase 4: Verification and Handoff

- [x] Performed scoped consistency checks with Glob/Grep for new IDs and root counts.
- [x] Updated Phase 011 tracking docs and created `implementation-summary.md`.
- [x] Regenerate metadata last.
- [x] Run strict validation and record exit code.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Evidence |
|-----------|-------|----------|
| Template conformance | Scenario file shape | sk-doc template read; new files use frontmatter and scenario/source metadata sections. |
| Count consistency | Root playbook counts and indexes | Glob/Grep confirmed hub 32/8, interface 20/14, foundations 11, motion 13, audit 14, md-generator 18/16. |
| Source-section citation | Scenario source anchors | New files cite exact `SKILL.md` procedure/fallback/hub manager sections and procedure card paths. |
| Scope control | Allowed write paths | Files changed are Phase 011 docs and sk-design manual-testing playbook paths. |
| Spec validation | Phase 011 docs | `validate.sh --strict` after metadata regeneration. |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Status | Notes |
|------------|--------|-------|
| Phase 001-006 parity foundation | Complete per user grounding facts | Used as the basis for procedure/fallback behavior. |
| Live procedure-card inventory | Confirmed by Glob | Current inventory is captured in scenario source files. |
| sk-doc playbook template | Read | Used for per-scenario structure. |
| Phase 012 benchmark work | Out of scope | No benchmark baseline or after-run folder changed. |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

If this phase needs reversal, remove only the Phase 011-added playbook scenario files, revert the six root playbook count/index updates, and restore the Phase 011 tracking docs from git. Do not touch sibling phases, parent packet docs, `external/**`, or `research/**`.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Gap Confirmation -> Hub Scenarios -> Mode Scenarios -> Root Indexes -> Tracking Docs -> Metadata -> Validation
```

<!-- /ANCHOR:l2-phase-deps -->
---

<!-- ANCHOR:l2-effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Actual Outcome |
|-------|------------|----------------|
| Gap Confirmation and Inventory | Low | Completed by direct reads/globs/greps. |
| Hub Scenario Authoring | Medium | 8 scenario files plus root index updates. |
| Mode Scenario Authoring | Medium | 15 scenario files plus five root updates. |
| Verification and Handoff | Low | Tracking docs, metadata regeneration, validation. |

<!-- /ANCHOR:l2-effort -->
---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

1. Inspect scoped diff before rollback.
2. Revert only Phase 011-added scenario files and root playbook entries.
3. Preserve unrelated dirty sibling phase state.
4. Regenerate metadata and rerun strict validation after any rollback edit.

<!-- /ANCHOR:l2-rollback -->
