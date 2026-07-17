---
title: "Feature Specification: Skill gate (032 phase 012)"
description: "The sibling phases need one blocking rollup gate that proves their evidence is complete and that no in-scope snake_case filesystem name or stale path remains in sk-design."
trigger_phrases:
  - "skill-gate naming phase"
  - "sk-design skill gate phase"
  - "032 skill-gate"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/002-sk-design"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/002-sk-design/012-skill-gate"
    last_updated_at: "2026-07-14T16:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored skill gate spec"
    next_safe_action: "Execute phase on pinned worktree"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/SKILL.md"
      - ".opencode/skills/sk-design/mode-registry.json"
      - ".opencode/skills/sk-design/"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

# Feature Specification: Skill gate (032 phase 012)

> Phase 012 of the sk-design component migration under `sk-doc/020-hyphen-naming-convention/008-component-migration/002-sk-design`. This document defines the future execution scope; this authoring pass performs no migration.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/020-hyphen-naming-convention/008-component-migration/002-sk-design/012-skill-gate |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-design |
| **Origin** | Phase 12 of the sk-design subtree in the 032 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The sibling phases need one blocking rollup gate that proves their evidence is complete and that no in-scope snake_case filesystem name or stale path remains in sk-design.

**Purpose:** Aggregate sibling evidence and verify the complete sk-design surface is kebab-clean outside the declared exemptions, without introducing new migration work.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Load every sibling checklist and evidence report and confirm each phase's blocking items passed.
- Run the complete sk-design filesystem inventory, apply the program exemption set, and prove no in-scope snake_case path remains.
- Sweep path-valued references in Markdown, JSON, YAML, TOML, and shell consumers for stale old names or broken new targets.
- Verify no code identifiers, data keys, frontmatter fields, tool-mandated names, Python scripts, or package directories were altered.

### Live candidate boundary
- Sibling evidence from `001-hub-root-and-shared/` through `011-changelog-verify/` is the input contract
- The final inventory covers hub/shared, six mode packets, seven feature-catalog trees, seven manual-testing-playbook trees, benchmark artifacts, and all path-valued references
- Exemptions include `SKILL.md`, `mode-registry.json`, package manifests, Python `.py` scripts, Python package directories, and other tool-mandated names

### Out of Scope
- New rename work, repairs to sibling phases, changelog edits, code behavior changes, or exemption-policy redesign.
- Treating an incomplete sibling checklist as a pass or accepting an unknown/unclassified candidate.
- Repository-wide surfaces outside `.opencode/skills/sk-design/`.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|-------|-------|-------|
| REQ-001 | Every sibling phase is complete by its own contract. | The gate report cites phases 001–011 and shows all P0 items and required P1 items passed. |
| REQ-002 | The whole sk-design filesystem is kebab-clean. | The inventory has zero in-scope underscore-bearing names outside the exemption set and no unknown bucket. |
| REQ-003 | References resolve across the whole surface. | Markdown, JSON/YAML/TOML path values, and shell source/link consumers contain no stale or broken path. |
| REQ-004 | The exemption boundary is proven. | Tool-mandated names, Python scripts/package dirs, identifiers, keys, and frontmatter fields are unchanged. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All sibling evidence is present, internally consistent, and pinned to the same candidate/base context.
- **SC-002**: The complete sk-design name inventory has zero unexplained in-scope snake_case paths.
- **SC-003**: The rollup report records the final clean-reference and exemption results and introduces no changes.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|-------|-------|-------|-------|
| Risk | The gate repairs a sibling defect instead of reporting it. | High | Make the gate read-only and fail with the exact sibling checklist/evidence gap. |
| Risk | A surface outside the component phases is missed. | High | Generate the inventory from the complete sk-design root and compare it with the phase ownership map. |

Dependencies: the canonical convention and exemption boundary in `001-convention-policy-and-scope/`; the pinned BASE and rename-map evidence from the program's earlier baseline/tooling phases; and the sibling handoffs named in this phase's plan.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- No blocking questions; the gate consumes sibling evidence and the program-level exemption rules.
<!-- /ANCHOR:questions -->
