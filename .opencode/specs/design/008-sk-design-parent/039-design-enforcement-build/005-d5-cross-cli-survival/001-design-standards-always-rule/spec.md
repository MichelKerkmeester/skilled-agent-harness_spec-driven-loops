---
title: "Feature Specification: D5-R1 — Design Standards Loading ALWAYS rule (twin of code-standards)"
description: "Design dispatch across the cli-* family has no deterministic standards-loading net, so a design task phrased outside the router keyword set reaches the child with no judgment loaded."
trigger_phrases:
  - "d5-r1 design standards always rule"
  - "design standards loading design build"
importance_tier: "normal"
contextType: "general"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/005-d5-cross-cli-survival/001-design-standards-always-rule"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Upgrade spec to Level 2 contract; mark phase complete"
    next_safe_action: "Regenerate description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/cli-codex/SKILL.md"
      - ".opencode/skills/cli-claude-code/SKILL.md"
      - ".opencode/skills/cli-opencode/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "d5-r1-impl"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: D5-R1 — Design Standards Loading ALWAYS rule (twin of code-standards)

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
| **Created** | 2026-06-28 |
| **Branch** | `001-design-standards-always-rule` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Router intent matching is phrasing-dependent and can miss. The code-standards rule already survives dispatch deterministically for code, but design had no equivalent net. A design dispatch phrased outside the keyword set reaches the child with no design judgment loaded.

### Purpose
A `Design Standards Loading` ALWAYS rule ships beside the code-standards rule in all three cli-* SKILLs, so a dispatched child loads `sk-design` and runs the hub-to-mode design loop whenever the task feeds a design decision, firing independent of router keyword hits.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Author the `Design Standards Loading (surface-aware contract)` ALWAYS entry as the exact twin of the code-standards rule.
- Insert it beside the code-standards rule in all three cli-* ALWAYS blocks, with parallel wording.
- Keep it surface-aware and phrasing-independent, mirroring the code-standards fallback when the surface is uncertain.

### Out of Scope
- Editing the wording or number of any existing ALWAYS rule - only a single trailing renumber is permitted.
- Reflowing, reformatting, or touching any other section of the SKILLs - the change is append-only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/cli-codex/SKILL.md` | Modify | Insert twin as ALWAYS rule 12; renumber 12→13, 13→14 |
| `.opencode/skills/cli-claude-code/SKILL.md` | Modify | Insert twin as ALWAYS rule 10; renumber 10→11, 11→12 |
| `.opencode/skills/cli-opencode/SKILL.md` | Modify | Insert twin as ALWAYS rule 13; renumber 13→14, 14→15, 15→16 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A `Design Standards Loading` ALWAYS rule present in all three cli-* SKILLs with parallel wording | `grep -c "Design Standards Loading (surface-aware contract)"` == 1 per file |
| REQ-002 | `sk-design` now appears in each cli-* dispatch contract | `grep -c "sk-design"` >= 1 per file (baseline was 0) |
| REQ-003 | Each file byte-unchanged except the inserted rule and minimal renumber | `git diff` shows one added block + the declared renumber, nothing else |
| REQ-004 | The GLM-5.2 workstream's WIP in cli-opencode is not clobbered | snapshot diff confirms `glm-5.2` / `zai` markers intact; design hunk separate |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Inserted rule is evergreen | no spec path / packet / phase / ADR / REQ / task / finding ID in the block |
| REQ-006 | Code-standards rule number preserved | `cli-opencode` rule 8 `(see ALWAYS rule 12)` still resolves to code-standards |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A static token lint finds the twin rule in all three cli-* SKILLs; a sibling missing it fails the parity check.
- **SC-002**: `sk-design` is present in every cli-* dispatch contract where it was absent before.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | cli-opencode is dirty with a concurrent GLM-5.2 workstream's WIP | Bulk-staging would co-commit the GLM WIP | The design hunk is isolated; orchestrator stages only it via `git apply --cached` of the single rule hunk |
| Risk | The code-standards anchor may have shifted under GLM edits | Line-based insertion could land in the wrong place | Locate the anchor by content, never by line number; HALT on anchor drift |
| Dependency | sk-design hub contract (`mode-registry.json` mode names) | Rule wording depends on hub→mode routing staying current | Update the parallel text in all three SKILLs if mode names change |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Maintainability
- **NFR-M01**: The twin rule stays parallel to the code-standards rule across all three siblings so a single parity lint covers them.
- **NFR-M02**: The rule is evergreen - no ephemeral artifact IDs - so it survives doc reorganization.

### Safety
- **NFR-S01**: The change is append-only with a minimal trailing renumber; no existing rule text is altered.
- **NFR-S02**: Concurrent-workstream edits in cli-opencode are preserved; staging is isolated to the design hunk.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Anchor Boundaries
- Anchor missing / duplicated / reworded: HALT and report; do not force the insertion.
- Line numbers no longer match the plan AND content anchor also fails: HALT (file changed structurally).

### Concurrency Scenarios
- cli-opencode still carries unstaged GLM hunks at staging time: leave the design hunk unstaged or stage via verified isolation; never `git add .` or a directory.
- A `git diff` shows a hunk this task did not author: STOP; another workstream is mid-edit.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | 3 markdown files, one inserted rule each + renumber |
| Risk | 12/25 | No code/DB; risk is concurrency (GLM WIP in cli-opencode) |
| Research | 4/20 | Twin pattern already established by code-standards |
| **Total** | **24/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None outstanding. The cli-opencode hunk-isolation handling (GLM-5.2 WIP co-resident in the working tree, design hunk staged via `git apply --cached`) is a documented concurrency-handling note, not an open defect.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
