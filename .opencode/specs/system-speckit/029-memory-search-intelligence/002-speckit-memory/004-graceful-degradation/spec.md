---
title: "Feature Specification: Memory MCP C9: Graceful Embedder-Degrade to Lexical"
description: "Memory recall throws when the embedder returns a null embedding instead of degrading to lexical (BM25/FTS) and reporting embedder_available:false. C9 routes the null-embedding case into the existing keep-lexical channel substrate so an embedder outage downgrades recall rather than failing it."
trigger_phrases:
  - "C9 graceful embedder degrade"
  - "memory recall throws null embedding"
  - "embedder_available false lexical fallback"
  - "stage1 candidate gen degrade"
  - "memory search embedder unavailable"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/002-speckit-memory/004-graceful-degradation"
    last_updated_at: "2026-07-04T17:50:57.895Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Author C9 impl sub-phase spec (DONE-record for 030 484b77b589)"
    next_safe_action: "None. C9 shipped and record tracks done-state in 028 impl tree"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-001-004-graceful-degradation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Feature Specification: Memory MCP C9: Graceful Embedder-Degrade to Lexical

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-19 |
| **Branch** | `system-speckit/028-xce-research-based-refinement` |
| **Parent Packet** | system-speckit/029-memory-search-intelligence/002-speckit-memory |
| **Candidates** | C9 |
| **Shipped In** | 030 commit `484b77b589` (Wave-0 record) |
| **Parent Spec** | ../spec.md |
| **Predecessor** | ../003-retrieval-class-routing/spec.md |
| **Successor** | ../005-recall-render-escaper/spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
When the embedder is unavailable and `generateQueryEmbedding` returns a null/empty embedding, Memory recall **throws** instead of degrading to lexical. Both Stage-1 entry branches compute `effectiveEmbedding = queryEmbedding ?? await generateQueryEmbedding(query)` and then, if null, throw, the hybrid path at `stage1-candidate-gen.ts:700-707` and the vector path at `stage1-candidate-gen.ts:1014-1020` [CONFIRMED: iter-003 finding f-iter003-007]. There is no `useVector=false` keep-lexical fallback on this recall path and no `embedder_available:false` flag, even though the channel-gating substrate to drop the vector channel while keeping FTS5/BM25/graph already exists at `hybrid-search.ts:931-947` [CONFIRMED]. The result is a brittle inversion of the mined aionforge model, where dense falls back to the plain current-set path, lexical always runs and the bundle reports `embedder_available:false` [CONFIRMED: external/aionforge-memory-development/docs/retrieval.md:170, 299-300].

### Purpose
Detect embedder-unavailable on recall and route the null-embedding case into the existing keep-lexical channels (BM25/FTS), reporting `embedder_available:false` / `vector_search_skipped:true`, so an embedder outage downgrades recall quality instead of failing the request, with the embedder-success (happy) path behaviorally byte-identical.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- C9: route the null/empty-embedding case at the Stage-1 candidate-generation entry into the existing `useVector=false` keep-lexical substrate instead of throwing.
- Surface `embedder_available:false` / `vector_search_skipped:true` on the Stage-1 output so the handler and callers can observe the degrade.
- A regression test asserting degrade-to-lexical behavior and an assertion that the happy path is unchanged.

### Out of Scope
- The other Memory candidates in this subsystem (query-class routing, bi-temporal edges, idempotent consolidation, rank-time decay, serialization order), covered by sibling 028/001 impl sub-phases.
- Storage-side embedder management (027's embedder subsystem is storage-side only. C9 is the recall-side complement) [CONFIRMED: roadmap.md:293].
- Code-Graph / Skill-Advisor / Deep-Loop graceful-degradation work, C9 generalizes to them but each is tracked under its own 028 subsystem [CONFIRMED: iter-006 F6-07].

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/lib/search/pipeline/stage1-candidate-gen.ts` | Modify | Route null-embedding → lexical (`useVector=false`) instead of throwing. Set degrade flags |
| `mcp_server/lib/search/pipeline/types.ts` | Modify | Add `embedder_available` / `vector_search_skipped` to Stage-1 output metadata |
| `mcp_server/handlers/memory-search.ts` | Modify | Plumb the degrade flags through to the response + handler-level concept guard |
| `mcp_server/tests/stage1-embedder-degrade.vitest.ts` | Create | Degrade-to-lexical regression test (5 cases) |
| `mcp_server/tests/.../regression-embedding-semantic-search.vitest.ts` | Create | Gate-D envelope assertion that the happy path is unchanged |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A null/empty query embedding degrades recall to lexical instead of throwing | When `generateQueryEmbedding` returns null, recall runs BM25/FTS via the `useVector=false` substrate (`hybrid-search.ts:931-947`) and returns candidates rather than an error |
| REQ-002 | The degrade is observable | Stage-1 output reports `embedder_available:false` / `vector_search_skipped:true`, plumbed through `memory-search.ts` to the response |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The embedder-success (happy) path is unchanged | Happy-path output is byte-identical to baseline (verified via `git diff -w` trace + envelope assertion). Existing search/pipeline suite stays green |
| REQ-004 | Pre-existing input-validation failures fail honestly | The documented scope addition: `>5 concepts` / empty query/concept / unknown searchType throws become a typed `Stage1InputError` that propagates to the caller rather than being swallowed to empty, consistent with the orchestrator's "Stage-1 failure is mandatory" contract |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: An embedder outage on recall yields lexical candidates plus `embedder_available:false`, not a thrown error (REQ-001/REQ-002 met).
- **SC-002**: The happy path is byte-identical and the full search/pipeline suite passes (REQ-003 met).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Callers may rely on the throw to detect an embedder outage | Med, the change inverts an existing contract | "What speaks the old contract": any caller catching the embedder-unavailable exception must switch to reading `embedder_available:false`. The change is reversible [CONFIRMED: iteration-007.md:61] |
| Risk | The `useVector=false` substrate only covers the hybrid entry path | Med, vector / multi-concept branches had no in-branch lexical fallback | Validation-first impl sketch routed those branches explicitly. Happy path traced to BM25 and proven byte-identical [CONFIRMED: iter-034 C9-sketch] |
| Dependency | Existing `getAllowedChannels` / `useVector=false` channel-gating substrate | Required for the degrade route | Substrate confirmed present at `hybrid-search.ts:931-947`. C9 only wires the null-embedding case into it [CONFIRMED] |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. C9 shipped in 030 (`484b77b589`). This folder records the done-state in the 028 impl tree. The pass-1 "vector-branch-caveated" note (roadmap.md:237) was resolved during impl: the vector/multi-concept branches were given an explicit lexical route and the degrade was traced to BM25 [CONFIRMED: 030 spec §14 row 2].
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Research evidence**: `../research/research.md`, `../research/iterations/iteration-003.md` (Q9), `../research/deltas/iter-003.jsonl` (f-iter003-007, p-iter003-C9A), `../research/deltas/iter-034.jsonl` (C9-sketch)
- **Roadmap**: `../../research/roadmap.md` (C9 rows, Wave-0 spearhead)
- **Synthesis**: `../../research/synthesis/01-go-candidates.md` (C9 row)
- **Wave-0 shipped record**: Wave-0 record (commit `484b77b589`)
<!-- /ANCHOR:related-docs -->
