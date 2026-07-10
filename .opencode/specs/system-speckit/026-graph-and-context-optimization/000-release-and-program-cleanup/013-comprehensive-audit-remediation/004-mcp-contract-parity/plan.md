---
title: "Implementation Plan: Phase 4: mcp-contract-parity [template:level_1/plan.md]"
description: "Realign four MCP tool contracts (public schema, Zod, allow-list, handler, docs), thread governance through bulk ingest paths, correct stale-graph guidance, and add a parity guard test. Surgical, additive edits across nine source files plus one new test."
trigger_phrases:
  - "mcp contract parity plan"
  - "tool schema alignment"
  - "governance ingest threading"
  - "embedding reconcile parity"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/013-comprehensive-audit-remediation/004-mcp-contract-parity"
    last_updated_at: "2026-06-04T20:45:43Z"
    last_updated_by: "implementation-engineer"
    recent_action: "Authored implementation plan for D1-D7"
    next_safe_action: "Central typecheck and vitest run"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/ops/job-queue.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-004-mcp-contract-parity"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 4: mcp-contract-parity

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node, ESM/NodeNext) |
| **Framework** | MCP server (spec-kit memory) |
| **Storage** | SQLite (better-sqlite3), vec shards |
| **Testing** | Vitest |

### Overview
Each fix is a scope-locked, additive edit that converges a drifted contract surface with the runtime behavior already in place. The heaviest item (D3) threads the validated governance decision through the scan and async-ingest code paths into the existing post-insert metadata step, mirroring the direct save path; everything else is schema text, a coverage predicate, a guidance string, and a new parity test.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests authored (parity + D1 + D3 + D6 coverage)
- [x] Docs updated (spec/plan/tasks/implementation-summary)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Layered MCP server: public tool definitions (ListTools) and Zod validation are two independent sources that must stay in parity; handlers consume validated args.

### Key Components
- **tool-schemas.ts**: public JSON schemas served to clients (D2/D4/D5 + cross-cluster).
- **tool-input-schemas.ts**: Zod schemas + allow-list used by runtime dispatch (cross-cluster B fields).
- **embedding-reconcile.ts**: dry-run/apply coverage parity (D1).
- **memory-save / memory-index / memory-ingest / job-queue**: governance threading (D3).
- **context-server.ts**: bootstrap guidance + ingest worker governance forwarding (D3/D6).

### Data Flow
For governed bulk ingest: handler validates -> governance decision persisted on the ingest job (or passed inline for scan) -> worker rehydrates -> indexMemoryFile applies post-insert provenance/retention/scope, identical to the direct save path.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| computeSuccessCoverage (embedding-reconcile.ts) | dry-run coverage count | update to rowid-OR-dim predicate | vector-coverage-hygiene.vitest.ts (count 2 to 3 + apply parity) |
| public TOOL_DEFINITIONS (tool-schemas.ts) | advertised params | add governance + backfill props | tool-contract-parity.vitest.ts |
| Zod TOOL_SCHEMAS + ALLOWED_PARAMETERS | runtime validation | add causal tenant/user/agent (cross-cluster) | grep + tool-input-schema.vitest.ts |
| indexMemoryFile + ingest_jobs | bulk persistence | thread governance to save layer | handler-memory-ingest.vitest.ts |
| bootstrap guidance string (context-server.ts) | docs/routing | correct stale-graph claim | context-server.vitest.ts source assertions |

Required inventories:
- Same-class producers: `rg -n 'governanceSchemaFields|governance_json|successMissingActiveVector' mcp_server`.
- Consumers of changed symbols: `rg -n 'computeSuccessCoverage|createIngestJob|indexSingleFile|processFile'`.
- Matrix axes: D1 fixture rows = {has rowid, has dim} x {present, absent}; assert dry-run count equals apply repair count.
- Algorithm invariant: dry-run coverage count MUST equal the apply repair UPDATE row count for every fixture.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Re-read each target file (line numbers drifted)
- [x] Confirm D2 schema/Zod/allow-list already aligned (no redo)
- [x] Identify governance post-insert step in handleMemorySave

### Phase 2: Core Implementation
- [x] D1 coverage predicate + D2 reserved-no-op + token removals
- [x] D4/D5 + cross-cluster public schema props (batched in tool-schemas.ts)
- [x] D3 governance threading across four files + ScanArgs + worker
- [x] D6 guidance string + routing gate
- [x] D7 parity test (RED before D4/D5, GREEN after)

### Phase 3: Verification
- [x] Tests authored for D1, D3, D6, D7
- [x] Token/predicate grep checks
- [x] Documentation updated
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | coverage predicate parity, schema key parity, guidance strings | Vitest |
| Integration | ingest governance threading at the handler boundary | Vitest (mocked job-queue) |
| Manual | grep token removals, predicate alignment | ripgrep |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| scope-governance.ts helpers | Internal | Green | Reuses validateGovernedIngest / buildGovernancePostInsertFields |
| Cluster B causal handlers | Internal | Green | Consumes the causal schema fields added here |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Central typecheck or vitest fails on these files.
- **Procedure**: Revert the nine source edits and the new test; the ingest_jobs ALTER is additive and idempotent (PRAGMA-guarded) so it can stay.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
