---
title: "Feature Specification: Phase 12 spec-kit relocation"
description: "Relocate the two spec-folder authoring docs out of sk-code into system-spec-kit references/workflows, and repoint every inbound reference."
trigger_phrases:
  - "spec-folder authoring docs relocation"
  - "spec_folder_write_recipe system-spec-kit"
  - "spec kit relocation"
importance_tier: "high"
contextType: "implementation"
parent: "sk-code/017-sk-code-parent"
_memory:
  continuity:
    packet_pointer: "sk-code/017-sk-code-parent/012-spec-kit-relocation"
    last_updated_at: "2026-07-05T00:00:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Backfilled Level 2 spec docs for the already-shipped spec-kit relocation phase"
    next_safe_action: "Run strict validation for this phase folder"
---
# Feature Specification: Phase 12 spec-kit relocation

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
| **Created** | 2026-07-04 |
| **Branch** | `remote-028` |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Two spec-folder authoring docs lived under sk-code, but spec-folder authoring is system-spec-kit's domain, not a code surface. Their inbound references were partly stale because they cited pre-hub paths.

### Purpose
Move the spec-folder authoring recipe and checklist into `system-spec-kit/references/workflows/`, keep the authoring guidance intact, and repoint every known inbound reference so spec-folder authors load the system-spec-kit source of truth.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Move `code-implement/assets/opencode/recipes/spec_folder_write.md` to `.opencode/skills/system-spec-kit/references/workflows/spec_folder_write_recipe.md` with content preserved.
- Move `code-quality/assets/opencode-checklists/spec_folder_authoring.md` to `.opencode/skills/system-spec-kit/references/workflows/spec_folder_authoring_checklist.md` with content preserved.
- Repoint internal cross-references in the moved docs to same-directory siblings.
- Repoint inbound references from `code-implement/SKILL.md`, `code-quality/SKILL.md`, `shared/references/smart_routing.md`, `sk-code/description.json`, both `speckit_complete_{auto,confirm}.yaml` files, and the system-spec-kit SKILL cross-load note.
- Index the two docs under the COMPLETE intent in the system-spec-kit RESOURCE_MAP.
- Bump sk-code from 4.0.0.0 to 4.0.1.0 and system-spec-kit from 3.7.0.0 to 3.7.1.0, with changelog entries.

### Out of Scope
- Moving the remaining `{skill,agent,command,mcp_server}` authoring checklists, which intentionally stayed in sk-code for phase 013.
- Editing router-sync fixtures; the dynamic guard passes when the moved filesystem and machine block agree.
- Additional code changes beyond the relocation, reference repoints, and version metadata listed above.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/references/workflows/spec_folder_write_recipe.md` | Move | New system-spec-kit home for the spec-folder write recipe |
| `.opencode/skills/system-spec-kit/references/workflows/spec_folder_authoring_checklist.md` | Move | New system-spec-kit home for the spec-folder authoring checklist |
| `.opencode/skills/sk-code/code-implement/SKILL.md` | Update | Repoint four load-contract rows |
| `.opencode/skills/sk-code/code-quality/SKILL.md` | Update | Repoint spec-folder authoring checklist reference |
| `.opencode/skills/sk-code/shared/references/smart_routing.md` | Update | Remove moved entries from the machine RESOURCE_MAP block and rewrite prose row to the cross-skill system-spec-kit form |
| `.opencode/skills/sk-code/description.json` | Update | Remove the moved spec-folder keywords |
| `.opencode/commands/speckit_complete_auto.yaml` | Update | Repoint `cross_skill_authoring_load` |
| `.opencode/commands/speckit_complete_confirm.yaml` | Update | Repoint `cross_skill_authoring_load` |
| `.opencode/skills/system-spec-kit/SKILL.md` | Update | Add the COMPLETE-intent cross-load note and RESOURCE_MAP entries |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Spec-folder authoring docs live under system-spec-kit | Both moved docs are present under `.opencode/skills/system-spec-kit/references/workflows/` |
| REQ-002 | Inbound references point to the new homes | Every inbound reference named in scope is repointed |
| REQ-003 | Router-sync remains green | `sk-code-router-sync` vitest passes 4/4 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Moved content keeps its guidance intact | Content is preserved and only internal cross-references are repointed to same-directory siblings |
| REQ-005 | Version metadata records the relocation | sk-code 4.0.1.0 and system-spec-kit 3.7.1.0 changelog entries exist |
| REQ-006 | Unrelated authoring checklists stay in sk-code | `{skill,agent,command,mcp_server}` authoring checklists remain in sk-code for phase 013 |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Shipped commit `85a0c2c9ac` contains the relocation and inbound reference repoints.
- **SC-002**: `sk-code-router-sync` vitest reports 4/4 passing.
- **SC-003**: Broken-link checking among touched files is clean.
- **SC-004**: Dead-reference sweep is clean.

### Acceptance Scenarios

- **Scenario 1**: Given a spec-folder authoring workflow loads the COMPLETE intent, when system-spec-kit resources are selected, then both relocated workflow docs are available from `references/workflows/`.
- **Scenario 2**: Given sk-code routing checks inspect the machine RESOURCE_MAP, when the moved filesystem and machine block agree, then `sk-code-router-sync` passes without fixture edits.
- **Scenario 3**: Given old sk-code references are swept, when dead-reference and link checks run on touched files, then no stale links remain.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | system-spec-kit COMPLETE intent routing | Authors may not find the moved docs | Index both docs under the COMPLETE intent |
| Risk | Stale pre-hub references | sk-code may keep pointing at moved paths | Repoint named inbound references and run dead-reference sweep |
| Risk | Moving unrelated authoring checklists too early | Phase 013 ownership boundary would blur | Leave `{skill,agent,command,mcp_server}` checklists in sk-code |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Routing checks remain deterministic and do not require fixture edits for this relocation.

### Security
- **NFR-S01**: Relocated markdown docs and references contain no secrets or credentials.

### Reliability
- **NFR-R01**: Link and dead-reference sweeps are clean for the touched files.
- **NFR-R02**: The old sk-code authoring-checklist boundary remains intact until phase 013.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- Only the two spec-folder authoring docs move in this phase.
- Remaining authoring checklists stay in sk-code and are not treated as stale references here.

### Error Scenarios
- A stale inbound reference would be caught by the dead-reference sweep.
- A RESOURCE_MAP mismatch would be caught by `sk-code-router-sync`.

### Concurrent Operations
- Phase 013 later moves the remaining authoring checklists; this phase avoids overlapping that scope.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | Two doc moves plus several inbound reference repoints |
| Risk | 10/25 | Cross-skill routing and stale reference risk |
| Research | 8/20 | Existing docs and router contracts were known |
| **Total** | **32/70** | **Level 2** |

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- None.

<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`

<!-- /ANCHOR:related-docs -->
