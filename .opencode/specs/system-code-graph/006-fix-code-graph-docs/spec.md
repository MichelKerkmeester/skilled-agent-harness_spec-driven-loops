---
title: "Feature Specification: Fix Code Graph Docs"
description: "Align system-code-graph documentation with shipped code-graph implementation behavior found by the 011 audit."
trigger_phrases:
  - "code graph docs"
  - "doc alignment"
  - "system-code-graph"
  - "parser skip list"
  - "doc-symbol lane"
importance_tier: "important"
contextType: "general"
parent: "system-code-graph"
predecessor: "011-code-graph-doc-audit"
successor: "012-fix-stress-docs"
_memory:
  continuity:
    packet_pointer: "system-code-graph/006-fix-code-graph-docs"
    last_updated_at: "2026-07-05T00:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Correct system-code-graph documentation drift"
    next_safe_action: "No further action required"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/SKILL.md"
      - ".opencode/skills/system-code-graph/README.md"
      - ".opencode/skills/system-code-graph/references/runtime/tool_surface.md"
      - ".opencode/skills/system-code-graph/ARCHITECTURE.md"
      - ".opencode/skills/system-code-graph/INSTALL_GUIDE.md"
      - ".opencode/skills/system-code-graph/feature_catalog/feature_catalog.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fix-code-graph-docs"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Fix Code Graph Docs

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-07-05 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The read-only audit at `011-code-graph-doc-audit/review-report.md` confirmed six documentation-alignment defects in `.opencode/skills/system-code-graph/**`. The affected docs described stale behavior for the doc-symbol lane, parser skip-list quarantine, handler topology, package topology, skill version, and query-operation cataloging.

### Purpose
Correct the system-code-graph documentation so agents and operators see the behavior that is shipped in the implementation files, without changing runtime code or tests.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Correct the six confirmed documentation findings from the audit report.
- Verify each correction against the cited implementation files before documenting completion.
- Create Level 1 phase documentation under this approved spec folder.

### Out of Scope
- Runtime code changes.
- Test changes.
- Edits outside `.opencode/skills/system-code-graph/**` and this spec folder.
- Git commit or branch workflow.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-code-graph/SKILL.md` | Modify | Correct doc-lane glossary wording. |
| `.opencode/skills/system-code-graph/README.md` | Modify | Correct doc-lane and parser skip-list behavior. |
| `.opencode/skills/system-code-graph/references/runtime/tool_surface.md` | Modify | Replace phantom `lib/<tool>/` mappings with real handler paths. |
| `.opencode/skills/system-code-graph/ARCHITECTURE.md` | Modify | Remove phantom `parser/` package from topology and dependency rules. |
| `.opencode/skills/system-code-graph/INSTALL_GUIDE.md` | Modify | Update skill-version cross-reference and add parser retry env var. |
| `.opencode/skills/system-code-graph/feature_catalog/feature_catalog.md` | Modify | Fix query-operation cataloging wording. |
| `.opencode/specs/system-code-graph/006-fix-code-graph-docs/` | Create | Phase documentation for this fix. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Fix doc-symbol lane wording. | `SKILL.md` and `README.md` state that doc lane produces `key`/`heading` nodes and `CONTAINS` edges, matching `structural-indexer.ts` and `doc-symbol-extractor.ts`. |
| REQ-002 | Fix parser skip-list retry wording. | `README.md` documents transient retry/self-heal and `INSTALL_GUIDE.md` documents `SPECKIT_PARSER_SKIP_LIST_MAX_RETRIES`. |
| REQ-003 | Fix tool-surface handler map. | `references/runtime/tool_surface.md` maps tools to `tools/code-graph-tools.ts`, `handlers/*.ts`, and real `lib/*.ts` files. |
| REQ-004 | Fix architecture topology. | `ARCHITECTURE.md` removes the phantom `parser/` package and points parser logic to `lib/tree-sitter-parser.ts`. |
| REQ-005 | Fix stale skill-version line. | `INSTALL_GUIDE.md` says `1.3.0.0`, matching `SKILL.md` frontmatter. |
| REQ-006 | Fix feature-catalog query-operation wording. | `feature_catalog.md` says the six query operations are bundled under shared query features, not separately cataloged. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Keep scope locked. | No files outside the allowed skill path and this spec folder are edited. |
| REQ-008 | Validate phase docs. | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <spec-folder> --strict` exits 0. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All six audit findings have documented before/after line evidence.
- **SC-002**: Each doc correction cites the shipped implementation evidence opened during this pass.
- **SC-003**: Strict spec validation passes for this phase folder.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Over-editing adjacent docs | Could expand beyond the audit scope | Edit only the six requested target docs. |
| Risk | Documentation claims outrun implementation evidence | Could create new drift | Read cited implementation files before editing and cite them in the summary. |
| Dependency | Spec validation script | Completion claim depends on validator result | Run strict validation after phase docs are written. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None.
<!-- /ANCHOR:questions -->
