---
title: "Feature Specification: Fix advisor-script filesystem-scope resolution bugs"
description: "Level 2 packet for two surgical advisor-script path fixes in skill_graph_compiler.py and skill_advisor.py."
trigger_phrases:
  - "013/009/009"
  - "fix script fs scope"
  - "skill_graph_compiler SKILLS_DIR"
  - "skill_advisor SKILL_GRAPH_SQLITE_PATH"
importance_tier: "critical"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/006-system-skill-advisor-extraction/009-fix-script-fs-scope"
    last_updated_at: "2026-05-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Production fixes verified"
    next_safe_action: "013/009 line ready for close-out"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    completion_pct: 100
---
# Feature Specification: Fix advisor-script filesystem-scope resolution bugs

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete pending validator evidence |
| **Created** | 2026-05-14 |
| **Branch** | `main` |
| **Spec Folder** | `009-fix-script-fs-scope` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Two production advisor scripts resolve filesystem paths one directory too high. `skill_graph_compiler.py` names its root `SKILLS_DIR` but currently lands at `.opencode/`, causing graph compilation to scan non-skill trees. `skill_advisor.py` currently resolves the SQLite database under the skill root instead of `mcp_server/database/`, so the Python parity shim can probe the wrong database path.

### Purpose

Apply two one-line path fixes with no scoring, tool-id, fixture, or surrounding refactor changes. The fix keeps advisor runtime behavior aligned with the package-local database policy and restricts skill graph compilation to `.opencode/skills/`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Create this Level 2 packet at `013/009/009`.
- Change one line in `skill_graph_compiler.py` so `SKILLS_DIR` resolves to `.opencode/skills/`.
- Change one path segment in `skill_advisor.py` so `SKILL_GRAPH_SQLITE_PATH` resolves to `mcp_server/database/skill-graph.sqlite`.
- Run path-resolution smoke tests, package Vitest, and strict validation at packet, parent, and grandparent levels.

### Out of Scope

- Renaming `SKILLS_DIR`.
- Refactoring script helpers.
- Changing advisor scoring math, tool ids, MCP schemas, runtime configs, or fixture behavior unless directly unblocked by this bug.
- Touching sibling packets 001-008 or parent 013/009 docs.
- Adding a `decision-record.md`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_graph_compiler.py` | Modify | Remove one `..` from `SKILLS_DIR` resolution. |
| `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py` | Modify | Remove one `..` from `SKILL_GRAPH_SQLITE_PATH` resolution. |
| `.opencode/specs/.../009-fix-script-fs-scope/spec.md` | Create | Level 2 specification. |
| `.opencode/specs/.../009-fix-script-fs-scope/plan.md` | Create | Three-phase implementation and rollback plan. |
| `.opencode/specs/.../009-fix-script-fs-scope/tasks.md` | Create | Setup, implementation, and verification task ledger. |
| `.opencode/specs/.../009-fix-script-fs-scope/checklist.md` | Create | Level 2 verification checklist. |
| `.opencode/specs/.../009-fix-script-fs-scope/implementation-summary.md` | Create | Evidence summary and continuity block. |
| `.opencode/specs/.../009-fix-script-fs-scope/description.json` | Create | Retrieval metadata. |
| `.opencode/specs/.../009-fix-script-fs-scope/graph-metadata.json` | Create | Packet graph metadata. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `skill_graph_compiler.py` `SKILLS_DIR` resolves to `.opencode/skills/`. | Python smoke prints a path ending in `/.opencode/skills`. |
| REQ-002 | `skill_advisor.py` `SKILL_GRAPH_SQLITE_PATH` resolves to `.opencode/skills/system-skill-advisor/mcp_server/database/skill-graph.sqlite`. | Python smoke prints and asserts the package-local DB path. |
| REQ-003 | No regression in Vitest pass count. | Package test result stays at or above Tier 1 baseline `279/287`. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Strict validation is green at packet 009, parent 013/009, and grandparent 013. | `validate.sh --strict` exits 0 for all three targets. |
| REQ-005 | Any Vitest test previously blocked by these production bugs now passes. | Re-run output is compared against baseline; failures are not worse. |

### P2 - Optional

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | No collateral edits to scripts. | Diff shows one-line surgery per production script and no helper/refactor changes. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Both Python smoke tests assert the corrected paths.
- **SC-002**: Vitest pass count is `>=279/287`.
- **SC-003**: Strict validation passes for packet 009, parent 013/009, and grandparent 013.
- **SC-004**: No files outside the whitelist are changed by this dispatch.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Compiler scans too broadly | Non-skill metadata can contaminate skill graph compilation. | Correct `SKILLS_DIR` to `.opencode/skills/` and smoke test the resolved path. |
| Risk | Python shim uses wrong DB | Runtime parity probes may miss the package-local SQLite database. | Correct DB path to `mcp_server/database/skill-graph.sqlite`. |
| Dependency | Existing Vitest failures | Suite remains red for unrelated reasons. | Compare pass count to baseline and document remaining failures. |
| Dependency | Parent metadata state | Parent/grandparent strict validation may depend on pre-existing docs. | Run validation and record actual result. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Maintainability

- **NFR-M01**: The fix must be readable as a path-depth correction, not a broader abstraction.
- **NFR-M02**: The existing variable names and surrounding script structure remain unchanged.

### Reliability

- **NFR-R01**: Both scripts resolve paths deterministically from their own file locations.
- **NFR-R02**: Test count does not regress from the `279/287` baseline.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Path Boundaries

- Running the smoke from `mcp_server/scripts/` must not depend on the caller's shell `PWD` beyond module import.
- The SQLite path must stay under `system-skill-advisor/mcp_server/database/`, not the skill root.
- The skills directory path must stop at `.opencode/skills/`, not `.opencode/`.

### Test Boundaries

- Existing unrelated failures can remain if pass count does not regress.
- Optional fixture edits are only allowed if a failure is proven blocked on these two production bugs.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Two production lines plus packet docs. |
| Risk | 14/25 | Scripts have build-time and runtime reach. |
| Research | 8/20 | Required sibling, handover, template, and script reads. |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

None. Gate 3 was pre-answered as Option B for this packet.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`.
- **Task Breakdown**: See `tasks.md`.
- **Verification Checklist**: See `checklist.md`.
- **Implementation Summary**: See `implementation-summary.md`.

<!-- /ANCHOR:related-docs -->
