---
title: "Feature Specification: Design-motion (032 phase 004)"
description: "The design-motion mode uses underscore-bearing asset, procedure, and reference names that are cited by its routing contract and operational guidance."
trigger_phrases:
  - "design-motion naming phase"
  - "sk-design design-motion phase"
  - "032 design-motion"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/002-sk-design"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/002-sk-design/004-design-motion"
    last_updated_at: "2026-07-14T16:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored design-motion spec"
    next_safe_action: "Execute phase on pinned worktree"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-motion/SKILL.md"
      - ".opencode/skills/sk-design/design-motion/assets/"
      - ".opencode/skills/sk-design/design-motion/references/"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

# Feature Specification: Design-motion (032 phase 004)

> Phase 004 of the sk-design component migration under `sk-doc/020-hyphen-naming-convention/008-component-migration/002-sk-design`. This document defines the future execution scope; this authoring pass performs no migration.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/020-hyphen-naming-convention/008-component-migration/002-sk-design/004-design-motion |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-design |
| **Origin** | Phase 4 of the sk-design subtree in the 032 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The design-motion mode uses underscore-bearing asset, procedure, and reference names that are cited by its routing contract and operational guidance.

**Purpose:** Rename the motion mode's non-exempt filesystem names to kebab-case and update its resource references without changing motion guidance.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rename the motion assets, procedure, and reference paths listed above.
- Update SKILL.md, README.md, internal resource tables, and cross-references to the target paths.
- Keep motion terms, timing values, reduced-motion rules, frontmatter fields, and scenario identifiers unchanged.
- Hand catalog/playbook path work to phases 008/009.

### Live candidate boundary
- `assets/animate_presence_checklist.md`, `motion_pattern_cards.md`, and `motion_performance_failure_card.md` become hyphenated
- `procedures/interaction_states_pass.md` becomes `interaction-states-pass.md`
- `references/advanced_craft.md`, `animate_presence_patterns.md`, `animation_decision_framework.md`, `corpus_map.md`, `micro_interactions.md`, `motion_strategy.md`, and `performance_reduced_motion.md` become hyphenated

### Out of Scope
- Feature-catalog, manual-testing-playbook, shared, benchmark, changelog, and Python surfaces.
- SKILL.md, mode-registry.json, package manifests, code identifiers, and content semantics.
- Any motion behavior change; this phase only describes filesystem and path-reference changes.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|-------|-------|-------|
| REQ-001 | Every non-exempt underscore path in the motion component is mapped. | The asset, procedure, and reference inventory has one disposition per candidate. |
| REQ-002 | Motion resource paths are rewritten consistently. | All local links and resource tables resolve to the hyphenated targets. |
| REQ-003 | Motion contract semantics are unchanged. | Routing, reduced-motion, performance, and handoff content differ only where a filesystem path requires it. |
| REQ-004 | Sibling phase boundaries are explicit. | Catalog/playbook paths remain in their own phase ledgers. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The motion component outside catalog/playbook contains no in-scope underscore path.
- **SC-002**: Resource resolution is clean and the motion mode's contract remains semantically identical.
- **SC-003**: The evidence report lists unchanged tool-mandated and exempt surfaces.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|-------|-------|-------|-------|
| Risk | The same motion concept appears in multiple resource tables. | Medium | Drive edits from the map and run a stale-path sweep across all mode documentation. |
| Risk | A prose identifier is changed with a path. | Low | Limit replacements to filesystem path tokens and Markdown link destinations. |

Dependencies: the canonical convention and exemption boundary in `001-convention-policy-and-scope/`; the pinned BASE and rename-map evidence from the program's earlier baseline/tooling phases; and the sibling handoffs named in this phase's plan.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- No blocking questions; the component inventory and exemption boundary are sufficient.
<!-- /ANCHOR:questions -->
