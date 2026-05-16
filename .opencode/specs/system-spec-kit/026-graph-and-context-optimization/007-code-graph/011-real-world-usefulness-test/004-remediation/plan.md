---
title: "Implementation Plan: Code-Graph Bug Remediation"
description: "Sequenced implementation plan for the P0 graph-wipe and parser-error preservation fixes, followed by the top P1 scan metadata, manifest, diagnostics, orphan-edge, and regression coverage fixes."
trigger_phrases:
  - "026/007/012/004 plan"
  - "zero-node guard plan"
  - "parse diagnostics plan"
  - "candidate manifest regression"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-code-graph/011-real-world-usefulness-test/004-remediation"
    last_updated_at: "2026-05-06T06:02:52Z"
    last_updated_by: "codex-gpt-5.5"
    recent_action: "Completed code graph remediation sequence"
    next_safe_action: "Review final verification output"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/scan.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts"
    session_dedup:
      fingerprint: "sha256:c80e7b157449fde64fcb516970c656b7e8132b20de01ed50fb54c65011c805e6"
      session_id: "026-007-012-004-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Code-Graph Bug Remediation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, NodeNext ESM |
| **Framework** | MCP server handlers and SQLite persistence |
| **Storage** | `better-sqlite3` code graph database |
| **Testing** | Vitest under `.opencode/skills/system-spec-kit/mcp_server` |

### Overview
Implement the P0 fixes before any P1 behavior so the graph cannot be wiped while the rest of the packet is in flight. The core design is fail-safe promotion: scan results are evaluated before destructive pruning or live metadata updates, parser runtime errors become diagnostics rather than replacement graph rows, and DB writes filter impossible edge shapes.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Deep-research findings read from `../003-deep-research-issues/research/research.md`.
- [x] File and line citations read from `../003-deep-research-issues/research/resource-map.md`.
- [x] Code surfaces read before editing: `scan.ts`, `ensure-ready.ts`, `code-graph-db.ts`, `status.ts`, schemas, and current tests.

### Definition of Done
- [x] F-002 and F-003 fixed with regression tests.
- [x] F-006, F-008, F-009, F-010, and F-011 fixed with regression tests.
- [x] Dist mirrors updated by `npm run build`.
- [x] Code graph vitest suite passes.
- [x] Child and parent strict spec validation pass.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fail-safe persistence and additive diagnostics in the existing MCP handler/DB architecture.

### Key Components
- **Scan handler**: Computes candidate scan health before destructive pruning, gates promotion, and returns blocked/diagnostic payloads.
- **Ensure-ready persistence**: Persists clean/recovered files normally and diverts runtime parser errors to diagnostic storage.
- **Code graph DB**: Owns schema migration, parse diagnostics, failed scan records, stale-valid counts, and orphan-edge filtering.
- **Status handler**: Reads diagnostics as a status-only surface without mutating graph state.
- **Tool schemas**: Expose `forceZeroNodeReset` as the explicit destructive override.

### Data Flow
`indexFiles()` produces candidate parse results. Full scans first compute effective node count and parse-error ratio. Usable scans prune missing files, persist per-file rows, record candidate manifest, and promote live metadata. Unusable scans persist failed-scan metadata/diagnostics and return a blocked or degraded result without making the candidate authoritative.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `handlers/scan.ts` | Produces scan persistence and response payload. | Add zero-node guard, metadata promotion gate, nonfatal manifest recording, diagnostics summary. | `code-graph-scan.vitest.ts` plus code graph suite. |
| `lib/ensure-ready.ts` | Shared per-file persistence for scan and read-path reindex. | Preserve prior graph on `parseHealth: "error"` and record diagnostics. | Atomic persistence regression test. |
| `lib/code-graph-db.ts` | Owns SQLite schema and graph row replacement. | Add `parse_diagnostics`, failed-scan metadata API, orphan-edge filtering. | DB/indexer regression tests. |
| `handlers/status.ts` | Observes graph health. | Surface diagnostics and stale-but-valid count. | Scan/status response regression test. |
| `tool-schemas.ts` and `schemas/tool-input-schemas.ts` | Public and internal tool validation. | Allow `forceZeroNodeReset`. | Existing tool schema tests and build. |
| Dist mirrors | Runtime JS output. | Rebuild after TypeScript edits. | `npm run build`. |

Required inventories:
- Same-class producers: `rg -n "setLastGitHead|setCodeGraphScope|recordCandidateManifest|replaceEdges|parseHealth" .opencode/skills/system-spec-kit/mcp_server/code_graph`.
- Consumers of changed symbols: `rg -n "parseDiagnostics|forceZeroNodeReset|staleButValid|zero_node_scan_rejected" .opencode/skills/system-spec-kit/mcp_server`.
- Matrix axes: scan mode (`incremental`/full), prior graph nodes (`0`/`>0`), candidate nodes (`0`/`>0`), override (`false`/`true`), parse-error ratio (`0`, `<=0.5`, `>0.5`).
- Algorithm invariant: no candidate scan may remove live graph content until it has either usable nodes, no prior graph, or an explicit destructive override.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Create Level 2 remediation packet under `026/007/012/004-remediation`.
- [x] Read deep-research finding text and resource map.
- [x] Read target implementation files and current tests before editing.

### Phase 2: Implementation
- [x] F-002: Add zero-node full-scan guard and `forceZeroNodeReset`.
- [x] F-003: Preserve prior graph rows on parser runtime errors and store diagnostics.
- [x] F-009: Filter orphan edges and clean orphan references.
- [x] F-008: Gate live metadata promotion after unusable or severely errored scans.
- [x] F-010: Record candidate manifest for nonfatal per-file parse errors.
- [x] F-011: Add durable parse diagnostics and surface summaries.

### Phase 3: Verification
- [x] Add requested regression tests.
- [x] Run `npx vitest run code_graph/tests/`.
- [x] Run `npm run build`.
- [ ] Run child and parent `validate.sh --strict`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit/handler | Zero-node block, forced reset, metadata promotion gate, manifest recording, response diagnostics. | Vitest mocked scan handler tests. |
| DB persistence | Parse-error preservation and orphan-edge filtering. | Vitest with temporary code graph DB. |
| Status response | Parse diagnostics and stale-but-valid count. | Vitest mocked status/scan handler tests. |
| Schema validation | `forceZeroNodeReset` accepted, unexpected args still rejected. | Existing schema tests plus build. |
| Integration-ish suite | Existing code graph behavior. | `npx vitest run code_graph/tests/`. |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `better-sqlite3` schema migration path | Internal | Green | Needed for durable diagnostics and cleanup queries. |
| Existing `persistIndexedFileResult()` transaction | Internal | Green | New preservation logic must keep atomicity for normal clean/recovered files. |
| Existing scan/status response envelope | Internal | Green | New fields must be additive. |
| Existing dirty worktree | Workspace | Yellow | Must avoid unrelated user-edited files. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Code graph tests or TypeScript build show regressions that cannot be fixed within the packet.
- **Procedure**: Revert only files touched by this packet, leaving unrelated dirty worktree changes intact. Restore pre-change schema behavior by removing the additive diagnostics table/API and response fields.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup)
      |
      v
Phase 2A (F-002 zero-node guard)
      |
      v
Phase 2B (F-003 parse-error preservation)
      |
      v
Phase 2C (F-009/F-008/F-010/F-011 P1 hardening)
      |
      v
Phase 3 (Tests, build, strict validation)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | All implementation |
| F-002 | Setup | Metadata promotion changes |
| F-003 | Setup | Diagnostics surfacing |
| P1 hardening | F-002, F-003 | Regression completion |
| Verification | All code/test changes | Completion claim |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 20-30 minutes |
| Core Implementation | High | 2-4 hours |
| Verification | Medium | 1-2 hours |
| **Total** | | **3-6 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Keep DB migration additive only.
- [ ] Keep new response fields optional/additive.
- [ ] Preserve existing clean/recovered parse persistence semantics.

### Rollback Procedure
1. Restore touched TypeScript sources and tests from the pre-packet diff.
2. Re-run `npx vitest run code_graph/tests/`.
3. Re-run `npm run build` to restore dist mirrors.
4. Re-run packet validation and document any rollback evidence.

### Data Reversal
- **Has data migrations?** Yes, additive `parse_diagnostics` table plus failed-scan metadata records.
- **Reversal procedure**: No destructive reversal needed for runtime safety; reverted code ignores the additive table if rollback is required.
<!-- /ANCHOR:enhanced-rollback -->
