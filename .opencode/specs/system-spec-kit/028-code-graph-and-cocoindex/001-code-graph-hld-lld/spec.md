---
title: "Phase Parent: 027/002 Code Graph HLD/LLD"
description: "Phase parent for the deterministic HLD/LLD narrative layer over code_graph data."
trigger_phrases:
  - "027 phase 002"
  - "code-graph hld-lld"
  - "code-graph narrative"
  - "code_graph_hld_lld"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-code-graph-hld-lld"
    last_updated_at: "2026-05-12T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Converted populated Level 2 packet into a lean phase parent with four child workstreams"
    next_safe_action: "Resume 001-contract"
    blockers: []
    key_files:
      - "spec.md"
      - "description.json"
      - "graph-metadata.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "codex-2026-05-12-027-002-phase-parent"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Feature Specification: 027/002 Code Graph HLD/LLD Phase Parent

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent.spec | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | phase-parent |
| **Created** | 2026-05-08 |
| **Branch** | `main` |
| **Parent Packet** | `system-spec-kit/027-xce-research-based-refinement` |
| **Source Proposal** | `../research/sub-packet-proposals.md` Proposal 1 |
| **Source Findings** | `../research/findings.md` items #1, #8 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`code_graph_context` returns raw structural data. Consumers still have to infer architectural meaning from file, symbol, and edge rows. The 027 research packet identified deterministic HLD/LLD narration as the missing layer: file role, architectural layer, summary, primary symbols, and per-symbol low-level dependencies derived from existing code_graph data.

### Purpose

This phase parent coordinates the contract-first delivery of a deterministic HLD/LLD narrative layer. The root outcome is a `code_graph_hld_lld` surface, plus compatible generator, handler, and test coverage, without LLM dependency, schema migration, or upstream parser changes.

> **Phase-parent note:** This parent keeps only the lean trio: `spec.md`, `description.json`, and `graph-metadata.json`. Detailed plans, tasks, checklists, and implementation summaries live in the child phase folders below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Deterministic file-level HLD payloads derived from existing `code_files`, `code_nodes`, and `code_edges` data.
- Deterministic symbol-level LLD payloads derived from existing graph rows.
- Public TypeScript contract for downstream phases and parallel child work.
- MCP handler and registration for `code_graph_hld_lld`.
- Unit and integration tests against the published contract.

### Out of Scope

- LLM-generated narrative.
- New SQLite schema or migrations.
- Changes to `structural-indexer.ts`, `tree-sitter-parser.ts`, or parser behavior.
- Cross-repository narrative generation.
- Replacing `code_graph_context`; this work is additive.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `mcp_server/code_graph/lib/code-graph-hld-lld.ts` | Create | `001-contract`, `002-lib-impl` | Contract exports, deterministic generator, classifier, and helpers |
| `mcp_server/code_graph/handlers/hld-lld.ts` | Create | `003-handler` | MCP handler, readiness checks, and JSON response |
| `mcp_server/code_graph/tools/code-graph-tools.ts` | Modify | `003-handler` | Tool registration |
| `mcp_server/code_graph/lib/code-graph-context.ts` | Modify if omni remains | `003-handler` | Optional `hld_lld` context payload |
| `mcp_server/tests/code-graph-hld-lld.vitest.ts` | Create | `004-test` | Contract, generator, handler, and serialization coverage |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## 4. PHASE DOCUMENTATION MAP

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-contract` | Publish `HldLldClassifier`, `FileRole`, and supporting TypeScript types. | spec-scaffolded |
| 002 | `002-lib-impl` | Implement `code-graph-hld-lld.ts` against the published contract. | spec-scaffolded |
| 003 | `003-handler` | Implement `handlers/hld-lld.ts`, tool registration, and optional omni wire contract. | spec-scaffolded |
| 004 | `004-test` | Author `code-graph-hld-lld.vitest.ts` against the contract interface. | spec-scaffolded |

### Phase Transition Rules

- `001-contract` ships first and is the only sequential bootstrap child.
- `002-lib-impl`, `003-handler`, and `004-test` may proceed in parallel after `001-contract` validates.
- Each child MUST pass strict validation independently before implementation begins.
- Parent resume should select a child explicitly or use `graph-metadata.json.derived.last_active_child_id` once it is set by future work.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|----|----------|--------------|
| `001-contract` | `002-lib-impl` | Contract exports define classifier, role labels, payload shapes, dependency records, and deterministic sort contract. | Child strict validation plus TypeScript export review |
| `001-contract` | `003-handler` | Request and response payload contracts are stable enough for handler validation and MCP envelope wiring. | Child strict validation plus contract import review |
| `001-contract` | `004-test` | Tests can target exported interfaces without depending on private implementation details. | Child strict validation plus fixture plan review |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:audit-narrative -->
## 5. AUDIT NARRATIVE

The current packet's audit constraints remain binding on the children:

- Stable ordering MUST happen before every capped collection using `kind priority -> start_line ascending -> name ascending -> symbol_id ascending`.
- Dangling graph edges MUST have one documented policy: filter unresolved endpoints or emit structured unresolved dependency records.
- Primary module selection MUST prefer the synthetic module whose `fq_name` equals `getModuleName(filePath)`, then lowest `start_line`, then `symbol_id`.
- File role classification MUST remain an open string contract while publishing required baseline labels: `module`, `api-handler`, `library`, `test`, and `config`, plus reserved edge label `empty`.
- `classifyFileRole(filePath, db)` MUST be exported and `generateHLD(filePath, db).file_role` MUST match it.
- If `queryMode: "omni"` remains in scope, QueryMode, ContextResult, handler input parsing, serialized JSON, and handler-level JSON parse tests MUST ship together. Otherwise omni must be removed from this phase scope.

These constraints preserve the existing cross-validation narrative while moving execution detail into the child packets.
<!-- /ANCHOR:audit-narrative -->

---

<!-- ANCHOR:success-criteria -->
## 6. SUCCESS CRITERIA

- **SC-001**: A caller can request `code_graph_hld_lld({path})` and receive JSON-serializable HLD and LLD payloads suitable for prompt injection.
- **SC-002**: The contract child gives downstream trace and impact-analysis phases a stable classifier surface.
- **SC-003**: The generator, handler, and tests can progress in parallel after the contract child ships.
- **SC-004**: Strict validation passes for the parent and all four child folders.
<!-- /ANCHOR:success-criteria -->

---

## RELATED DOCUMENTS

- **Contract child**: `001-contract/spec.md`
- **Library child**: `002-lib-impl/spec.md`
- **Handler child**: `003-handler/spec.md`
- **Test child**: `004-test/spec.md`
- **Graph Metadata**: `graph-metadata.json`
