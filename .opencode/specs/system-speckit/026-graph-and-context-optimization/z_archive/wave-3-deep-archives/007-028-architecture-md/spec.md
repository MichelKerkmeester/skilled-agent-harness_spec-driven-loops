---
title: "Feature Specification: system-code-graph architecture.md"
description: "Create the missing architecture reference for the extracted system-code-graph skill, with HVR file:line evidence for current MCP, parser, storage, readiness, bridge, and integration boundaries."
trigger_phrases:
  - "system-code-graph architecture"
  - "mk-code-index architecture"
  - "014 architecture md"
importance_tier: "important"
contextType: "architecture"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/z_archive/wave-3-deep-archives/007-028-architecture-md"
    last_updated_at: "2026-05-14T17:44:37Z"
    last_updated_by: "codex"
    recent_action: "Created and validated system-code-graph architecture.md"
    next_safe_action: "Stage and commit documentation-only changes"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/architecture.md"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "014-architecture-md"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: system-code-graph architecture.md

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-14 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The extracted `system-code-graph` skill has runtime and README documentation, but it lacks a dedicated `architecture.md` that mirrors the sibling `system-spec-kit` architecture pattern. Operators need one cited source that explains the standalone `mk-code-index` MCP boundary, the observed ten-tool surface, structural parsing, SQLite storage, readiness guards, CocoIndex bridge tools, and spec-kit integration points.

### Purpose
Create `.opencode/skills/system-code-graph/architecture.md` as the HVR-compliant current-reality architecture document for the skill.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Create `.opencode/skills/system-code-graph/architecture.md`.
- Use sk-doc anchored markdown structure and mirror the sibling `system-spec-kit/architecture.md` style.
- Ground architectural claims with file:line citations from the live code and reference docs.
- Capture the Level 1 packet docs for this documentation-only change.

### Out of Scope
- Runtime code changes - user explicitly forbade source-code modification.
- Editing `system-spec-kit/architecture.md` - reference only.
- Updating parallel packet folders - user limited writes to this new child packet.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-code-graph/architecture.md` | Create | Architecture reference for the extracted code graph skill. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/028-architecture-md/` | Create | Level 1 packet docs and metadata. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Document the current system-code-graph architecture. | `architecture.md` covers MCP boundary, ten tools, AST parsing, storage, lifecycle, readiness, CocoIndex bridge, and integration points. |
| REQ-002 | Cite architectural claims with HVR file:line evidence. | The document includes file:line references in every section with technical claims. |
| REQ-003 | Keep the work documentation-only. | Git diff shows no source-code edits. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Capture 009 and 010 outcomes. | The document mentions the tsconfig restructure, why project references do not fit the current imports, and the `mk-code-index` rename. |
| REQ-005 | Validate the new packet. | `validate.sh --strict` exits 0 for this folder. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `.opencode/skills/system-code-graph/architecture.md` exists and follows anchored sections.
- **SC-002**: The document states the observed live tool count as ten with schema evidence.
- **SC-003**: Strict spec validation passes for the new packet.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Existing source anchors | Wrong anchors would make the doc misleading | Read source with line numbers before writing and cite exact ranges. |
| Risk | Stale skill description says 12 tools | Architecture could repeat stale count | Prefer live `CODE_GRAPH_TOOL_SCHEMAS` and note the mismatch as an open question. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should a later packet update `SKILL.md` to reconcile its 12-tool description with the observed ten-tool runtime surface?
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
