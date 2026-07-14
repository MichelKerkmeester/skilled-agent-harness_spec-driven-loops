---
title: "Feature Specification: create-* generators and templates (017 phase 003)"
description: "The create-feature-catalog / create-manual-testing-playbook skills, the `/create:*` generators, `package_skill.py`, and their templates currently emit underscore names (the 027 change). They must emit hyphenated folder/file names so newly-created content is born compliant."
trigger_phrases:
  - "create-* generators and templates"
  - "hyphen naming phase 003"
  - "kebab-case create generators"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/003-create-generators-and-templates"
    last_updated_at: "2026-07-13T13:10:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase spec authored from the 16-phase decomposition"
    next_safe_action: "Execute this phase on the pinned worktree when picked up"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: create-* generators and templates

> Phase adjacency under the 017 parent (grouping order, not a runtime dependency): predecessor `002-root-name-consumer-migration`; successor `004-no-new-snake-guard`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/017-hyphen-naming-convention/003-create-generators-and-templates |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-13 |
| **Owner skill** | sk-doc |
| **Origin** | Phase 003 of the 017 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The create-feature-catalog / create-manual-testing-playbook skills, the `/create:*` generators, `package_skill.py`, and their templates currently emit underscore names (the 027 change). They must emit hyphenated folder/file names so newly-created content is born compliant.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- create-feature-catalog + create-manual-testing-playbook SKILL.md + templates.
- The `/create:*` generators (reverse the 027 `category_name`/`feature_name.md` emission back to `category-name`/`feature-name.md`).
- `create-skill/scripts/package_skill.py` and its regression tests.
- Any other create-* mode that emits filesystem names.

### Out of Scope
- Retroactive rename of existing content (007+).
- The classifier logic (002).
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The create-* generators emit hyphenated folder and file names | A dry-run generation produces `category-name/` and `feature-name.md` |
| REQ-002 | Templates and SKILL docs document the hyphenated canonical form | No template or SKILL example shows an underscore filesystem name |
| REQ-003 | The 027 generator changes are reversed | The generators no longer emit `category_name`/`feature_name.md` |
| REQ-004 | `package_skill.py` emits and checks hyphenated names and its tests pass | The package_skill regression tests are green against the hyphenated policy |
| REQ-005 | Every generator produces only canonical names when run into a temp dir | A generate-into-temp comparison finds no underscore filesystem name |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: New catalog/playbook content is born hyphenated.
- **SC-002**: Generators + templates are the reference for the convention.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

Inherits the program-level risks in the 017 parent spec (import breakage, validator downgrade, non-reproducible builds,
over-broad sweep, exemption leakage, concurrent sessions). Phase-specific risks are enumerated in this phase's plan.md.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking; resolved during this phase's execution against the pinned baseline.
<!-- /ANCHOR:questions -->

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-create-skill-and-packaging/ | [Phase 1 scope] | Pending |
| 2 | 002-catalog-and-playbook-generators/ | [Phase 2 scope] | Pending |
| 3 | 003-readme-agent-command-changelog-flowchart-diff-benchmark/ | [Phase 3 scope] | Pending |
| 4 | 004-command-asset-emitters/ | [Phase 4 scope] | Pending |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-create-skill-and-packaging | 002-catalog-and-playbook-generators | [Criteria TBD] | [Verification TBD] |
| 002-catalog-and-playbook-generators | 003-readme-agent-command-changelog-flowchart-diff-benchmark | [Criteria TBD] | [Verification TBD] |
| 003-readme-agent-command-changelog-flowchart-diff-benchmark | 004-command-asset-emitters | [Criteria TBD] | [Verification TBD] |
<!-- /ANCHOR:phase-map -->
