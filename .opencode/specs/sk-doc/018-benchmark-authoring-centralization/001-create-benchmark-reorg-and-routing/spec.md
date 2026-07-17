---
title: "Feature Specification: Create-Benchmark Resource Reorganization and Routing"
description: "Group create-benchmark templates and guides by benchmark family while preserving the top-level assets and references conventions. Add durable family vocabulary so behavior, skill, model, and fixture authoring requests route to create-benchmark before the next registry regeneration."
trigger_phrases:
  - "create benchmark resource reorganization"
  - "create benchmark family routing"
  - "benchmark fixture routing"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-benchmark-authoring-centralization/001-create-benchmark-reorg-and-routing"
    last_updated_at: "2026-07-13T06:05:00Z"
    last_updated_by: "claude-code"
    recent_action: "Reorg + reference migration + link repair + family routing vocab complete"
    next_safe_action: "Recursive strict validation and commit"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/create-benchmark/SKILL.md"
      - ".opencode/skills/sk-doc/mode-registry.json"
      - ".opencode/skills/sk-doc/hub-router.json"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Create-Benchmark Resource Reorganization and Routing

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-07-13 |
| **Parent** | `sk-doc/017-benchmark-authoring-centralization` |
| **Parent Spec** | ../spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The create-benchmark packet keeps unrelated benchmark-family resources in flat `assets/` and `references/` directories. Its hub routing vocabulary also lacks explicit terms for the behavior, skill, model, and fixture families owned by later SKILL sections, so family-specific authoring prompts can miss the packet.

### Purpose
Make the resource layout family-oriented and make all authored benchmark families directly routable without changing lane-owned scoring or execution behavior.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Move 16 existing resources into `behavior_benchmark/`, `model_benchmark/`, `skill_benchmark/`, and `_shared/` subfolders with `git mv`.
- Update active consumers to the moved paths without changing their behavior.
- Add `behavior benchmark`, `skill-benchmark`, `model-benchmark`, and `benchmark fixture` to the create-benchmark source contract and both hub routing files.

### Out of Scope
- Full sk-doc registry regeneration, which belongs to the following workstream.
- Changes to other sk-doc subskills or deep-loop benchmark logic.
- Rewriting completed parent documents or historical spec evidence.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/create-benchmark/**` | Move/Modify | Group resources and update packet-local paths. |
| `.opencode/skills/sk-doc/{mode-registry.json,hub-router.json}` | Modify | Add family routing vocabulary only. |
| Active repository consumers of moved paths | Modify | Replace old paths with family subfolder paths. |
| This child packet and parent metadata | Create/Modify | Record and expose the phase work. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Preserve all 16 resources through `git mv`. | Git reports rename operations and both top-level resource directories remain present. |
| REQ-002 | Update every writable active consumer. | Repository search finds no stale active consumer within allowed write paths. |
| REQ-003 | Persist family vocabulary in `SKILL.md` and both routing files. | All four family terms appear in each required routing source. |
| REQ-004 | Keep create-benchmark package-valid. | `package_skill.py create-benchmark --check` reports PASS. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Preserve phase documentation integrity. | Recursive strict validation reports Errors: 0 and Warnings: 0. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every moved resource exists in its exact requested family subfolder.
- **SC-002**: Family-specific benchmark authoring prompts have durable vocabulary in the create-benchmark source contract and immediate vocabulary in both hub files.
- **SC-003**: Package validation and recursive strict spec validation pass.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Relative links change depth after moves | Packet docs or consumers can point at missing files | Search exact filenames and validate links after all moves. |
| Risk | The next workstream regenerates routing files | Manual registry vocabulary could disappear | Keep the same vocabulary in `create-benchmark/SKILL.md` as the durable source. |
| Constraint | Historical specs and system-spec-kit script source are banned write paths | Some frozen old-path text may remain | Do not edit prohibited paths; report exact residuals. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Maintainability
- **NFR-M01**: Resource paths expose their benchmark family without filename inspection.
- **NFR-M02**: Routing vocabulary remains declarative and regeneration-safe.

### Reliability
- **NFR-R01**: No resource content is deleted or recreated during the reorganization.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Path Boundaries
- Relative links inside moved references must account for their additional directory depth.
- Self-referential copy and validation commands inside moved assets must use the new full path.
- Frozen historical evidence is not an active consumer and remains unchanged when outside allowed paths.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 13/25 | Sixteen moves plus bounded path consumers and three routing sources. |
| Risk | 8/25 | Mechanical documentation/config changes with link-break risk. |
| Research | 4/20 | Exact consumer inventory and schema inspection only. |
| **Total** | **25/70** | **Level 2 verification is appropriate.** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

None. The operator supplied the exact move map, write boundaries, routing vocabulary, and verification commands.
<!-- /ANCHOR:questions -->
