---
title: "Feature Specification: Phase 8: deep-loop-and-skill-surface"
description: "Clear code-graph references from the remaining skills — deep-loop, cli-external-orchestration, sk-doc, sk-code, mcp-code-mode — including the route-guard code in mcp-code-mode and the skills index table."
trigger_phrases:
  - "deep loop code graph references"
  - "mcp code mode route guard code graph"
  - "skills index code graph row"
  - "sk-doc code graph examples"
  - "036 deep loop and skill surface"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/036-code-graph-decommission/008-deep-loop-and-skill-surface"
    last_updated_at: "2026-07-28T04:51:16Z"
    last_updated_by: "claude-code"
    recent_action: "Executed the phase and verified it"
    next_safe_action: "Closeout verification in phase 015"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-036-008-deep-loop-and-skill-surface"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 8: deep-loop-and-skill-surface

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-27 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 15 |
| **Predecessor** | 007-skill-advisor-decoupling |
| **Successor** | 009-command-surface |
| **Handoff Criteria** | No surviving skill references the removed subsystem in code, routing data, or documentation |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the code graph decommission specification.

**Scope Boundary**: The skills other than `system-spec-kit` and `system-skill-advisor`, which have their own phases.

**Dependencies**:
- Phase 002 replacement routing, so doc edits point somewhere real.

**Deliverables**:
- Deep-loop docs and agent tool lists cleared of graph tool ids.
- `mcp-code-mode` route-guard code and its tests updated.
- `sk-doc` template examples and `sk-code` checklists cleared.
- `cli-external-orchestration` skill listings updated.
- The skills index table row removed.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The subsystem appears across the rest of the skill tree in three different ways, and they need different handling. Some are pure prose that can be rewritten. Some are routing data — the skills index table, CLI skill listings — that becomes wrong the moment the folder is gone. And `mcp-code-mode` carries actual route-guard code with tests. Treating all three as a documentation sweep would leave live code pointing at a deleted route.

### Purpose
Bring every remaining skill into a state where it neither routes to, documents, nor guards a subsystem that no longer exists.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `system-deep-loop` documentation and tool grants naming graph tools.
- `mcp-code-mode` route-guard source and tests.
- `sk-doc` template examples that use the skill as a worked example.
- `sk-code` checklists and playbook steps that call graph tools.
- `cli-external-orchestration` skill roster listings.
- The skills index table.

### Out of Scope
- `system-spec-kit` and `system-skill-advisor` — phases 005 to 007.
- Command and agent surfaces — phases 009 and 010.
- Benchmark reports and changelogs, which are archival.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/**` | Modify | Remove graph tool ids from docs and grants |
| `.opencode/skills/mcp-code-mode/**` | Modify | Update route-guard code and tests |
| `.opencode/skills/sk-doc/**` | Modify | Replace worked examples that use the skill |
| `.opencode/skills/sk-code/**` | Modify | Remove graph steps from checklists and playbooks |
| `.opencode/skills/cli-external-orchestration/**` | Modify | Update skill roster listings |
| `.opencode/skills/README.md` | Modify | Remove the index table row |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No skill routes to the removed subsystem | Routing data and index tables omit it |
| REQ-002 | Route-guard code and tests agree | The `mcp-code-mode` suite passes after the update |
| REQ-003 | Replaced examples remain instructive | Each rewritten example still teaches its original point |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Search guidance points at surviving tools | Docs recommending structural search name the phase 002 replacement |
| REQ-005 | Skill rosters are internally consistent | Listed skill counts and names match the tree |
| REQ-006 | Archival surfaces are untouched | No benchmark report or changelog is edited |
| REQ-007 | Cross-references resolve | No skill doc links to a removed path |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A live-surface sweep of the skills tree returns no reference outside the removed folder itself.
- **SC-002**: Skill suites that were green before this phase are still green.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A doc example is deleted rather than replaced | The doc loses its teaching value | REQ-003 requires an equivalent replacement |
| Risk | Editing benchmark reports as if they were live docs | Historical results falsified | Archival exclusion is explicit in scope |
| Risk | Route-guard change breaks unrelated routes | Regression in `mcp-code-mode` | Run its suite before and after |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Do the `sk-doc` examples need a replacement subject, or should those sections be shortened?
<!-- /ANCHOR:questions -->

---

<!-- SCAFFOLD_VALIDATION_COUNTS:
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
