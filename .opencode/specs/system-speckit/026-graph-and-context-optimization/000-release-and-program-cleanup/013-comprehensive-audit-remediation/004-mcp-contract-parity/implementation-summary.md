---
title: "Implementation Summary [template:level_1/implementation-summary.md]"
description: "Realigned the four contract-parity MCP tools, threaded governed-ingest metadata through the scan and async paths, corrected the stale-graph guidance, and added a parity guard test so the public schema can never silently drift from runtime validation again."
trigger_phrases:
  - "mcp contract parity summary"
  - "tool schema drift fixed"
  - "governance ingest threaded"
  - "embedding reconcile coverage parity"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/013-comprehensive-audit-remediation/004-mcp-contract-parity"
    last_updated_at: "2026-06-04T20:45:43Z"
    last_updated_by: "implementation-engineer"
    recent_action: "Completed D1-D7 implementation + tests + docs"
    next_safe_action: "Central typecheck and vitest run"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-ingest.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/ops/job-queue.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tools/types.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/context-server.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/tool-contract-parity.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-004-mcp-contract-parity"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-mcp-contract-parity |
| **Completed** | 2026-06-04 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The four contract-parity MCP tools no longer lie about what they accept, the embedding-reconcile dry run now predicts exactly what apply will mutate, governed-ingest metadata survives every ingest path instead of being validated and dropped, and the bootstrap guidance tells the truth about a stale code graph. A new parity test locks the public schema to the Zod schema so this whole class of drift cannot return unnoticed.

### Reconcile coverage parity (D1)
The dry-run coverage count now uses the same rowid-OR-dim-row predicate as the apply repair UPDATE, so `coverage.successMissingActiveVector` truthfully predicts how many rows an apply with `repairSuccessCoverage:true` will reset. Previously a success row that had the rowid marker but was missing its active-dim vector was repaired by apply yet invisible to the dry run. The unused `_dimTable` parameter is now read and renamed `dimTable`.

### Honest contracts (D2/D4/D5/D7)
`activeOnly` is documented as a reserved no-op in both the interface and the public schema (the active shard is always runtime-resolved), and the stale `[Phase 007]` token is gone from the schema text - with no new runtime branching that would weaken the fail-closed model. The public schemas for `memory_index_scan` and `memory_ingest_start` now declare the nine governance fields the runtime already accepts, and `memory_causal_stats` now declares its nested `backfill` object with the dry-run default and the write-on-`{dryRun:false}` boundary made explicit. A new `tool-contract-parity.vitest.ts` compares public property keys against the Zod shape keys for all four tools and fails on any divergence.

### Governance threading (D3)
A governed scan or async ingest now carries the validated provenance/retention/scope decision all the way to the save layer. `indexMemoryFile` accepts a `governance` decision, seeds the row scope from it, and applies the same post-insert metadata the direct `memory_save` path applies. `memory_index_scan` passes its decision through `indexSingleFile`; `memory_ingest_start` persists the decision on the ingest job (new nullable `governance_json` column, backward-compatible PRAGMA-guarded ALTER), and the worker rehydrates it and forwards it per file.

### Truthful stale-graph guidance (D6)
The bootstrap guidance no longer claims `code_graph_query` "still works" on a stale graph. It now states the query blocks with `code_graph_not_ready` until a `session_bootstrap` refresh, and the routing rule emits the direct structural-query rule only for a fresh graph. The code-graph handler's fail-closed block was left unchanged because it is correct.

### Cross-cluster enablement (for cluster B)
Optional `tenantId/userId/agentId` were added to the `memory_drift_why` and `memory_causal_link` public schemas, Zod schemas, and allow-list so cluster B's causal post-filter is reachable by real MCP traffic.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| lib/embedders/embedding-reconcile.ts | Modified | Dual-surface coverage predicate; reserved-no-op comment (D1/D2) |
| tool-schemas.ts | Modified | activeOnly/token text; governance + backfill public props; causal fields (D2/D4/D5 + cross-cluster) |
| schemas/tool-input-schemas.ts | Modified | Zod + allow-list causal tenant/user/agent fields (cross-cluster) |
| handlers/memory-save.ts | Modified | Thread governance through indexMemoryFile (D3) |
| handlers/memory-index.ts | Modified | Pass governance into indexSingleFile (D3) |
| handlers/memory-ingest.ts | Modified | Persist governance on the ingest job (D3) |
| lib/ops/job-queue.ts | Modified | ingest_jobs governance column + rehydration + worker forwarding (D3) |
| tools/types.ts | Modified | ScanArgs governance fields (D3) |
| context-server.ts | Modified | Stale-graph guidance + ingest worker governance forwarding (D3/D6) |
| tests/tool-contract-parity.vitest.ts | Created | Public-vs-Zod parity guard (D7) |
| tests/vector-coverage-hygiene.vitest.ts | Modified | Count 2 to 3 + apply-parity assertion (D1) |
| tests/handler-memory-ingest.vitest.ts | Modified | Governance-threading assertion (D3) |
| tests/context-server.vitest.ts | Modified | Stale-graph guidance assertions (D6) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

All ten source edits are surgical and additive. Schema changes copy the shape already used by `memory_save` and the Zod definitions; the governance threading reuses the existing `validateGovernedIngest` / `buildGovernancePostInsertFields` / `applyPostInsertMetadata` helpers rather than inventing new persistence. The ingest_jobs migration is a nullable column guarded by a PRAGMA check so older tables and in-flight jobs keep working with a null governance. Per the cluster verification policy, the mcp_server typecheck and vitest run are deferred to the central pass because peers are editing the same package concurrently.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Documented activeOnly as a no-op instead of wiring it | Adding `activeOnly:false` branching would let callers skip active-shard verification and weaken the fail-closed safety model |
| Applied governance as a post-insert step in indexMemoryFile | Mirrors the proven direct-save path exactly and reuses the same helpers, so the bulk paths converge on identical row metadata |
| Persisted the whole governance decision as one nullable JSON column | Keeps the ingest_jobs migration additive and backward-compatible; the worker rehydrates a real GovernanceDecision without re-validating |
| Left system-code-graph query.ts untouched for D6 | The handler's false-safe block is correct; only the guidance string was wrong |
| Scoped the parity test to the four cluster tools | Matches the finding; a full 37-tool sweep is out of scope this pass |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `_dimTable` removed / `dimTable` read in coverage query | PASS (grep: no `_dimTable` remaining) |
| `[Phase 007]` token removed from tool-schemas.ts | PASS (grep: 0 hits) |
| `Phase 027` heading + "still works" removed from context-server.ts | PASS (grep: 0 hits) |
| D7 parity test authored (public-vs-Zod keys, 4 tools) | PASS (file created) |
| D1/D3/D6 test assertions authored | PASS (3 test files updated) |
| mcp_server typecheck + vitest | DEFERRED to central (concurrent peer edits) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **ingest_jobs migration must be validated centrally.** The new nullable `governance_json` column and its PRAGMA-guarded ALTER are additive, but a central run should confirm no schema-migration test asserts the old column set.
2. **D3 verification is at the handler boundary.** The added test asserts the governance decision reaches `createIngestJob`; a full end-to-end DB assertion (rows carrying provenance/retention columns) is left for the central integration run, paralleling memory-save-integration.vitest.ts.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
