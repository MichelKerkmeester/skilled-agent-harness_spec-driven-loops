---
title: "Phase 002.002 — code_graph_trace Library Implementation"
description: "Level 2 child packet for code-graph-trace.ts conforming to the trace contract and consuming Phase 001 HLD/LLD classification."
trigger_phrases:
  - "027 phase 003 lib"
  - "code-graph-trace implementation"
  - "trace library"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-code-graph-and-cocoindex/002-code-graph-trace/002-lib-impl"
    last_updated_at: "2026-05-12T00:00:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Scaffolded child packet for trace library implementation"
    next_safe_action: "Implement code-graph-trace.ts after local contract and upstream HLD/LLD implementation merge"
    blockers:
      - "system-spec-kit/028-code-graph-and-cocoindex/002-code-graph-trace/001-contract"
      - "system-spec-kit/028-code-graph-and-cocoindex/001-code-graph-hld-lld/002-lib-impl"
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-12-027-003-002-lib-impl-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: code_graph_trace Library Implementation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | spec-scaffolded |
| **Created** | 2026-05-12 |
| **Parent Packet** | `system-spec-kit/028-code-graph-and-cocoindex/002-code-graph-trace` |
| **Depends on** | `001-contract`; `system-spec-kit/028-code-graph-and-cocoindex/001-code-graph-hld-lld/002-lib-impl` |
| **Estimated LOC** | ~210 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
AI consumers currently have to piece together symbol, file, module, and architectural-role context manually. The resolver library should own that trace construction with the file rung sourced from `CodeNode.filePath`, not CONTAINS edges or dotted `fq_name` inference.

### Purpose
Implement `code-graph-trace.ts` against the trace contract, using Phase 001 classification for architectural-role output and an explicit file-path policy for module ownership.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `traceSymbol(symbolId, db, opts)` implementation.
- File rung resolution from `CodeNode.filePath`.
- Module ownership derived from a documented file-path policy.
- Optional class/method display using CONTAINS/fqName metadata where reliable.
- Depth-cap truncation metadata.
- Structured missing-symbol errors.

### Out of Scope
- MCP transport handling.
- Tool registration.
- Optional `trace_cache` or `code_packages` tables unless P0 correctness is already proven.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/code_graph/lib/code-graph-trace.ts` | Create | Trace resolver implementation. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Implement `traceSymbol` conforming to `TraceTool`. | Contract tests compile against the library. |
| REQ-002 | Source file rung from `CodeNode.filePath`. | Sparse symbols return valid `file` values without CONTAINS. |
| REQ-003 | Derive module from explicit file-path policy. | No P0 module ownership uses dotted `fq_name` splitting. |
| REQ-004 | Use Phase 001 `classifyFileRole` for `architectural_role`. | Trace role equals Phase 001 role for same file. |
| REQ-005 | Cap trace depth at default 5. | Over-depth traces return `truncated: true`. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Decorate class/method ancestry where reliable. | Nested-class matching compares against `class.fqName + "."`. |
| REQ-007 | Defer cache/package tables unless redesigned around file paths. | Implementation summary records deferral or evidence. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Normal and sparse symbols return `symbol`, `file`, `module`, and `architectural_role`.
- **SC-002**: No schema migration is needed for the MVP resolver.
- **SC-003**: Tests can assert role equality with Phase 001.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Local contract | Cannot implement stable interface | Wait for `001-contract`. |
| Dependency | Phase 001 lib implementation | Cannot call authoritative classifier | Wait for upstream `002-lib-impl`. |
| Risk | CONTAINS coverage is sparse | Trace may omit file/module | Treat CONTAINS as display-only and use filePath for ownership. |
| Risk | Nested-class false matches | Wrong class display | Use fully qualified prefix matching. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

- **NFR-P01**: Trace chains up to five levels should resolve in under 50ms p95 on a 10k-symbol graph.
- **NFR-M01**: Use code-graph DB helpers rather than direct SQL.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Top-level TypeScript function with no class container.
- Bash function and doc symbol without complete containment.
- Module node or anonymous/default export.
- Deep trace that exceeds the depth cap.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | One resolver library |
| Risk | 8/25 | Upstream classifier and sparse containment |
| Research | 2/20 | Parent packet already captured trace findings |
| **Total** | **22/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None at scaffold time.
<!-- /ANCHOR:questions -->
