---
title: "Feature Specification: Phase 011 — Manual Testing Playbook Full Alignment"
description: "Completed Level 2 specification for aligning the sk-design hub-level manual testing playbook and all five mode-packet manual testing playbooks with hub manager behavior, procedure-card selection proof, no-card fallback, and direct-fallback contracts."
trigger_phrases:
  - "manual testing playbook alignment"
  - "procedure card selection proof"
  - "hub manager intake coverage"
  - "context proof direct fallback scenarios"
  - "sk-design playbook gap analysis"
importance_tier: "high"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/011-manual-testing-playbook-alignment"
    last_updated_at: "2026-07-06T09:07:56Z"
    last_updated_by: "opencode-gpt-5-5"
    recent_action: "phase-011-complete"
    next_safe_action: "validate-phase-011"
---
# Feature Specification: Phase 011 — Manual Testing Playbook Full Alignment

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-06 |
| **Completed** | 2026-07-06 |
| **Phase Folder** | `.opencode/specs/sk-design/009-sk-design-claude-parity/011-manual-testing-playbook-alignment/` |
| **Parent Packet** | `.opencode/specs/sk-design/009-sk-design-claude-parity/` |
| **Writable Scope Used** | Phase 011 folder plus `.opencode/skills/sk-design/**/manual_testing_playbook/**` |
| **Depends On** | Phases 001-006 complete per user-provided grounding facts; live Phase 011 reads confirmed hub/mode procedure and fallback sections before edits. |

<!-- /ANCHOR:metadata -->
---

## Phase Navigation

| Link | Target |
|------|--------|
| **Parent Spec** | ../spec.md |
| **Predecessor Phase** | ../010-feature-catalog-completeness/spec.md |
| **Successor Phase** | ../012-routing-benchmark-rigor/spec.md |

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The sk-design hub and mode-packet manual testing playbooks did not fully exercise behavior added by earlier parity-refactor work:

1. The hub playbook covered mode routing, advisor integration, transform-verb framing, md-generator behavior, shared-reference usage, and three parity-behavior scenarios, but did not independently test hub manager intake, visible-plan-before-work, or proof-gate pause behavior.
2. Procedure-card selection proof existed for only interface, foundations, and md-generator at the hub level; motion, audit, and the shared polish gate were not covered.
3. The five mode-packet playbooks had no procedure-card-contract category covering each mode's selection table, exact no-card fallback line, and context/proof/direct-fallback behavior.

### Purpose

This phase implemented the full alignment pass: 8 new hub scenarios, 15 new mode-level procedure-card-contract scenarios, and root playbook count/index updates across the hub and five mode packets.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Added hub `PB-004..006` inside `06--parity-behavior/` for motion procedure selection, audit procedure selection, and shared polish-gate selection.
- Added hub `07--fallback-and-resilience/` with `FR-001..002` for no-card fallback and direct fallback without subagents.
- Added hub `08--hub-manager-intake/` with `HM-001..003` for context-first intake, visible plan, and verifier-cadence pause.
- Added one procedure-card-contract category per mode packet, each with 3 scenarios.
- Updated the hub and all five mode root `manual_testing_playbook.md` files for category rows, scenario counts, and cross-reference indexes.
- Updated Phase 011 tracking docs and created `implementation-summary.md`.

### Out of Scope

- Editing `SKILL.md`, `mode-registry.json`, `hub-router.json`, `shared/**`, `procedures/**`, `references/**`, `assets/**`, `.opencode/commands/design/**`, `external/**`, or `research/**`.
- Running benchmark harnesses or modifying frozen benchmark baseline folders.
- Running banned operations from the user instruction, including commits, staging, destructive git commands, installs, or arbitrary node/python scripts outside the explicitly allowed metadata/validation scripts.

### Files Changed

| Area | Change |
|------|--------|
| Hub playbook | 8 new scenario files; root count updated to 32 scenarios across 8 categories. |
| Interface playbook | 3 new scenario files; root count updated to 20 scenarios across 14 categories. |
| Foundations playbook | 3 new scenario files; root release-readiness count updated to 11 scenarios. |
| Motion playbook | 3 new scenario files; root release-readiness count updated to 13 scenarios. |
| Audit playbook | 3 new scenario files; root release-readiness count updated to 14 scenarios. |
| md-generator playbook | 3 new scenario files; root count updated to 18 scenarios across 16 categories. |
| Phase 011 docs | `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` updated for completion evidence. |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (Completed)

| ID | Requirement | Completion Evidence |
|----|-------------|---------------------|
| REQ-001 | Confirm the gap before implementation | Direct reads confirmed hub `PB-001..003` only, no mode-level procedure-contract categories, and live `SKILL.md` procedure/fallback sections. |
| REQ-002 | Stable IDs match existing conventions | Hub `PB-004..006`, `FR-001..002`, `HM-001..003`; modes `ID-018..020`, `FOUND-PROCCARD-001..003`, `MOTION-PROCCARD-001..003`, `AUDIT-PROCCARD-001..003`, `PROCCARD-001..003`. |
| REQ-003 | Cover every mode's procedure-card table | New mode card-selection scenarios name all mode-owned card rows: interface 6, foundations 3, motion 1, audit 2, md-generator 1. |
| REQ-004 | Cover shared card exactly once | `PB-006` covers `shared/procedures/polish_gate_orchestration.md`; no mode-level category duplicates it. |
| REQ-005 | Preserve md-generator fallback distinction | `PROCCARD-003` and `FR-002` state md-generator keeps its backend boundary instead of the read-only fallback used by advisory modes. |
| REQ-006 | Implement scenarios in this pass | 23 new scenario files were created under allowed `manual_testing_playbook/**` paths. |
| REQ-007 | Keep hub manager behavior independent | `HM-001..003` test hub intake/plan/proof gates separately from procedure-card scenarios. |

### P1 - Required (Completed)

| ID | Requirement | Completion Evidence |
|----|-------------|---------------------|
| REQ-008 | Category folders use `NN--kebab-case` | New folders: `07--fallback-and-resilience`, `08--hub-manager-intake`, and per-mode `NN--procedure-card-contract`. |
| REQ-009 | Root playbooks updated | Six root playbooks updated with category/count/index entries. |
| REQ-010 | Critical-path recommendation recorded | Hub root records PB/FR/HM additions as candidate critical-path items, not silently promoted. |
| REQ-011 | Verification commands stated | `implementation-summary.md` records validation command and result; checklist records consistency evidence. |
| REQ-012 | Hand off cleanly to Phase 012 | Benchmark/routing harness work remains out of scope for Phase 011. |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

| Criterion | Result |
|-----------|--------|
| **SC-001** Phase 011 docs exist and validate as Level 2 child packet | Met: `validate.sh --strict` returned exit code 0 with `Errors: 0  Warnings: 0`. |
| **SC-002** Scenario gap grounded in evidence | Met via live reads and updated root counts/indexes. |
| **SC-003** Every new scenario has stable ID, category, and source contract | Met across 23 new scenario files. |
| **SC-004** Playbook files updated only within allowed scope | Met: changes are limited to Phase 011 docs and sk-design manual-testing playbooks. |
| **SC-005** Done state is unambiguous | Met: tasks/checklist/implementation-summary record completed evidence. |

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 001-006 closure | Procedure-card behavior assumes parity-refactor contracts remain stable | User-provided grounding facts and live reads were used before authoring. |
| Risk | Future procedure-card additions | New cards would need new scenario coverage | Card-selection scenarios name the current owned-card inventory and source sections. |
| Risk | Critical-path expansion changes readiness math | Silent promotion could make future runs unexpectedly stricter | Hub root marks new PB/FR/HM scenarios as candidates pending operator confirmation. |
| Risk | md-generator fallback flattened | Would misrepresent the only mutating mode | `FR-002` and `PROCCARD-003` explicitly preserve backend boundary. |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- **NFR-T01**: New scenarios cite exact source sections such as `Procedure Card Selection`, `Context, Proof, And Direct Fallback`, `Manager Intake Before Routing`, `Visible Plan Before Design or Build Work`, and `Proof Gates and Verifier Cadence`.
- **NFR-T02**: Mode-level card-selection scenarios cite exact procedure-card file paths.
- **NFR-M01**: New categories follow the existing split-document playbook shape.
- **NFR-S01**: Writes were limited to allowed Phase 011 and sk-design manual-testing playbook paths.
- **NFR-V01**: Strict validation is run after metadata regeneration and recorded in `implementation-summary.md`.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- If a mode gains a procedure card later, add a new row to that mode's card-selection scenario or create a follow-up scenario.
- If critical-path policy changes, update the hub root's candidate list only through an explicit operator-confirmed readiness decision.
- If metadata is regenerated and content changes afterward, regenerate metadata again before validation.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

No open questions block Phase 011 completion.

<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: `plan.md`
- **Task Breakdown**: `tasks.md`
- **Verification Checklist**: `checklist.md`
- **Implementation Summary**: `implementation-summary.md`
- **Parent Packet**: `../spec.md`
- **Predecessor Phase**: `../010-feature-catalog-completeness/spec.md`
- **Successor Phase**: `../012-routing-benchmark-rigor/spec.md`

<!-- /ANCHOR:related-docs -->
