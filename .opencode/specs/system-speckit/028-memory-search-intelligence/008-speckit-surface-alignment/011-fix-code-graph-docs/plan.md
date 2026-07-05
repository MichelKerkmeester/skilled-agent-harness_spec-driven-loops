---
title: "Implementation Plan: Fix Code Graph Docs"
description: "Documentation-only plan for aligning system-code-graph docs with shipped code behavior."
trigger_phrases:
  - "implementation plan"
  - "code graph docs"
  - "doc alignment"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/008-speckit-surface-alignment/011-fix-code-graph-docs"
    last_updated_at: "2026-07-05T00:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Plan documentation-only code-graph doc alignment"
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
# Implementation Plan: Fix Code Graph Docs

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documentation over TypeScript implementation evidence |
| **Framework** | system-code-graph skill docs and mk-code-index MCP server source |
| **Storage** | No runtime storage changes |
| **Testing** | Strict spec validation plus direct implementation/doc line reads |

### Overview
This plan applies a documentation-only correction pass for six audit-confirmed drifts in system-code-graph. The implementation code remains unchanged; the docs are updated to reflect the shipped doc-symbol extractor, parser skip-list retry policy, real handler topology, real parser location, current skill version, and feature-catalog granularity.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] User pre-approved the spec folder and scope lock.
- [x] Audit report was read.
- [x] Cited implementation files were opened before edits.

### Definition of Done
- [x] All six documentation findings corrected.
- [x] Phase docs created with per-finding before/after evidence.
- [x] Strict spec validation passes after docs are complete.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation alignment only. No executable architecture changes.

### Key Components
- **Top-level skill docs**: `SKILL.md`, `README.md`, `ARCHITECTURE.md`, `INSTALL_GUIDE.md`.
- **Reference docs**: `references/runtime/tool_surface.md`.
- **Catalog docs**: `feature_catalog/feature_catalog.md`.
- **Implementation evidence**: `mcp_server/lib/*.ts`, `mcp_server/tools/code-graph-tools.ts`, `mcp_server/handlers/*.ts`, and targeted Vitest files.

### Data Flow
Audit finding -> read cited implementation file -> patch documentation wording -> read changed line range -> record before/after evidence in phase docs -> run strict validation.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Evidence Read
- [x] Read `011-code-graph-doc-audit/review-report.md`.
- [x] Opened doc-symbol implementation evidence in `structural-indexer.ts`, `doc-symbol-extractor.ts`, `indexer-types.ts`, and `doc-symbol-extractor.vitest.ts`.
- [x] Opened parser skip-list implementation evidence in `parser-skip-list.ts` and `parser-skip-list.vitest.ts`.
- [x] Opened handler topology evidence in `handlers/README.md`, `handlers/index.ts`, and `tools/code-graph-tools.ts`.
- [x] Opened parser location evidence in `tree-sitter-parser.ts`.

### Phase 2: Documentation Patch
- [x] Corrected F1 doc-symbol lane wording in `SKILL.md` and `README.md`.
- [x] Corrected F2 parser retry/self-heal wording and env-var docs in `README.md` and `INSTALL_GUIDE.md`.
- [x] Corrected F3 handler map in `references/runtime/tool_surface.md`.
- [x] Corrected F4 parser topology in `ARCHITECTURE.md`.
- [x] Corrected F5 version cross-reference in `INSTALL_GUIDE.md`.
- [x] Corrected F6 catalog granularity wording in `feature_catalog/feature_catalog.md`.

### Phase 3: Verification
- [x] Re-read changed documentation line ranges.
- [x] Grepped for removed stale phrases.
- [x] Run strict spec validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Direct source verification | Compare each doc claim to shipped implementation files | Read/Grep |
| Stale phrase sweep | Ensure known false phrases are removed or only appear as explicit nonexistence notes | Grep |
| Spec validation | Validate this phase folder | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Audit report | Input | Green | Provides six scoped findings. |
| Implementation files | Evidence | Green | Confirms shipped behavior. |
| Spec validator | Tooling | Green | Strict validation passed for the final phase folder state. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A corrected doc claim is found to contradict shipped code.
- **Procedure**: Revert only the affected documentation hunks and re-run the source-evidence read plus strict spec validation.
<!-- /ANCHOR:rollback -->
