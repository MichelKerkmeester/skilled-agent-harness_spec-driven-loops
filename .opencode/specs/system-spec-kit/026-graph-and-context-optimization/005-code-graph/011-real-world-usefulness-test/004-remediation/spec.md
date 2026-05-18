---
title: "Feature Specification: Code-Graph Bug Remediation"
description: "Implementation packet for the P0 zero-node scan and parser-error overwrite fixes plus top P1 code graph persistence, manifest, diagnostics, and regression coverage."
trigger_phrases:
  - "026/007/012/004"
  - "code graph remediation"
  - "zero_node_scan_rejected"
  - "parse diagnostics"
  - "stale but valid graph"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/005-code-graph/011-real-world-usefulness-test/004-remediation"
    last_updated_at: "2026-05-06T06:02:52Z"
    last_updated_by: "codex-gpt-5.5"
    recent_action: "Implemented remediation packet for code graph P0 and P1 fixes"
    next_safe_action: "Review verification output and commit when ready"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/scan.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/status.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0260070120040260070120040260070120040260070120040260070120040000"
      session_id: "026-007-012-004-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Gate 3 pre-approved by user for this exact spec folder."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Code-Graph Bug Remediation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-05-06 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Research Source** | `../003-deep-research-issues/research/research.md` |
| **Resource Map** | `../003-deep-research-issues/research/resource-map.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The real-world usefulness research found two end-user-facing P0 code graph bugs. A full scan that returns zero nodes can prune and promote over a populated graph, and parser runtime errors can overwrite a file's last successful structural graph with empty error state.

### Purpose
Make code graph persistence fail safe: unusable full scans must not wipe live graph state, parse errors must preserve stale-but-valid per-file graph content, and callers must receive durable diagnostics that explain what happened.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Fix F-002 by blocking zero-node full-scan promotion when an existing graph has nodes, unless `forceZeroNodeReset: true` is passed.
- Fix F-003 by preserving prior per-file graph rows on parser runtime errors and recording diagnostics separately.
- Fix F-008 by promoting git/scope/provenance metadata only for usable scans.
- Fix F-009 by preventing orphan edge insertion and cleaning existing orphan edges after replacement.
- Fix F-010 by recording candidate manifests when per-file parse errors are below the fatal ratio threshold.
- Fix F-011 by adding durable parse diagnostics and exposing summaries in scan and status responses.
- Cover F-006 with broad-scan/read-path manifest regression coverage and the requested five targeted tests.

### Out of Scope
- Changing skill advisor, hook, memory, CLI dispatch, or unrelated system-spec-kit subsystems.
- Adding backwards-compatible aliases for `forceZeroNodeReset`; callers must opt in using the new argument.
- Reworking parser internals beyond preserving prior graph rows and recording diagnostics for error results.
- Enabling automatic read-path full scans.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/scan.ts` | Modify | Add zero-node promotion guard, metadata promotion gate, relaxed manifest recording, diagnostics summary response. |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts` | Modify | Preserve prior per-file graph rows for `parseHealth: "error"` and record diagnostics. |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts` | Modify | Add diagnostics schema/API, stale valid count, failed-scan records, orphan-edge filter and cleanup. |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/status.ts` | Modify | Surface parse diagnostics and stale-but-valid file count. |
| `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` | Modify | Expose `forceZeroNodeReset` on `code_graph_scan`. |
| `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts` | Modify | Validate and allow `forceZeroNodeReset`. |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts` | Modify | Add regression tests for scan guard, manifest, diagnostics, status, and broad scan/read-path behavior. |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-atomic-persistence.vitest.ts` | Modify | Add regression for per-file parse-error preservation. |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts` | Modify | Add regression for orphan-edge filtering in `replaceEdges()`. |
| `specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/011-real-world-usefulness-test/004-remediation/*` | Create | Level 2 planning, decision, checklist, metadata, and implementation summary artifacts. |
| `specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/011-real-world-usefulness-test/graph-metadata.json` | Modify | Add `004-remediation` to `children_ids`. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | F-002: Guard populated graphs from zero-node full-scan wipes. | A full scan with 0 indexed nodes and prior stats with >0 nodes returns `status: "blocked"` and `reason: "zero_node_scan_rejected"` without pruning files or promoting metadata. |
| REQ-002 | F-003: Preserve last successful per-file graph on parser runtime errors. | `parseHealth === "error"` stores a durable diagnostic and leaves existing `code_files`, `code_nodes`, and `code_edges` for that file queryable. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | F-006: Add broad-scan/read-path manifest regression. | A test proves a successful broad scan records a candidate manifest that the read-path manifest comparison accepts. |
| REQ-004 | F-008: Do not promote scan metadata after unusable or severely errored scans. | Zero-node blocked scans and scans over the fatal parse-error ratio do not update git head, scope, provenance, or live detector summary. |
| REQ-005 | F-009: Prevent orphan edges. | `replaceEdges()` inserts only edges whose source node exists after node replacement and runs one-shot orphan cleanup. |
| REQ-006 | F-010: Decouple nonfatal per-file parse errors from candidate-manifest recording. | Full scans record the manifest when `parseErrorCount / totalFiles <= 0.5`; structural DB errors still suppress promotion. |
| REQ-007 | F-011: Add durable parse diagnostics. | `parse_diagnostics` stores `file_path`, `error_message`, `error_count`, `last_seen_at`; scan and status responses include `{ affectedFiles, recentErrors }`. |

### Scan Safety Contract

| Condition | Expected Result |
|-----------|-----------------|
| Full scan, new indexed nodes = 0, prior nodes > 0, no override | Block promotion and return `zero_node_scan_rejected`. |
| Full scan, new indexed nodes = 0, prior nodes > 0, `forceZeroNodeReset: true` | Allow destructive reset and normal promotion. |
| Full scan, parse-error ratio > 0.5 | Persist failed-scan record, suppress live metadata promotion, keep diagnostics. |
| Per-file parse runtime error | Preserve prior graph rows for that file and record/update diagnostics. |
| Nonfatal parse errors | Preserve affected files, persist diagnostics, record candidate manifest. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: F-002 and F-003 are fixed with regression tests that fail against the prior behavior.
- **SC-002**: F-006, F-008, F-009, F-010, and F-011 are fixed or explicitly reported as partial with evidence.
- **SC-003**: `forceZeroNodeReset` is exposed in public and internal `code_graph_scan` validation schemas.
- **SC-004**: Scan and status responses surface parse diagnostics summaries.
- **SC-005**: Code graph vitest suite passes.
- **SC-006**: TypeScript build completes or any failure is documented with exact evidence.
- **SC-007**: Child and parent spec validation pass under `--strict`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Existing dirty worktree includes unrelated system-spec-kit changes. | Broad refactors could overwrite user work. | Keep edits scoped to code graph files, schemas, tests, and packet docs only. |
| Risk | Parser errors currently flow through normal persistence. | A naive fix could hide true syntax recovery or leave stale mtimes misleading. | Apply the preservation rule only to `parseHealth === "error"` and record diagnostics. |
| Risk | Metadata gating could suppress useful state after normal partial scans. | Status may appear stale longer than necessary. | Use a clear fatal ratio threshold and allow nonfatal per-file diagnostics. |
| Dependency | Existing `code_graph` tests and DB helper patterns. | Regressions could appear in status/query/readiness contracts. | Add targeted tests and run the whole `code_graph/tests/` suite. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The user pre-approved the spec folder and requested direct implementation.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: Failed scans must preserve the last known good graph whenever a prior graph exists.
- **NFR-R02**: Parser runtime errors must be diagnosable after the scan response is gone.

### Maintainability
- **NFR-M01**: Safety predicates must be named and tested near the scan and persistence code paths they protect.
- **NFR-M02**: New response fields must be backwards additive and schema-validated.

### Operator Safety
- **NFR-S01**: Destructive zero-node reset requires explicit `forceZeroNodeReset: true`.
- **NFR-S02**: Failed-scan metadata must be kept separate from live scan metadata.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Scan Promotion
- Empty repository or first scan with no prior graph: no wipe risk; status may remain empty.
- Populated graph followed by scope-mismatched zero-node result: blocked unless forced.
- Forced zero-node reset: caller takes responsibility for destructive reset.

### Parser Diagnostics
- Repeated parse error for the same file increments `error_count` and updates `last_seen_at`.
- Recovered parse with nodes still persists normal graph rows; only runtime `error` preserves prior graph rows.
- Diagnostics summaries are bounded to the top 5 recent errors in scan/status responses.

### Edge Persistence
- Edges with missing source nodes are filtered before insert.
- One-shot orphan cleanup removes stale source or target references after replacement.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 20/25 | Multiple code graph persistence, handler, schema, and test files. |
| Risk | 22/25 | Graph wipe prevention and DB schema migration touch user-facing reliability. |
| Research | 12/20 | Findings are already localized by deep research; code still needs verification. |
| **Total** | **54/70** | **Level 2 with an added decision record** |
<!-- /ANCHOR:complexity -->
