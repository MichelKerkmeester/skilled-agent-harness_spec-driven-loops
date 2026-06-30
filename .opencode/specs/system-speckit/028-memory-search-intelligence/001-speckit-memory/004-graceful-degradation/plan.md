---
title: "Implementation Plan: Memory MCP C9: Graceful Embedder-Degrade to Lexical"
description: "Wire the null-embedding recall case into the existing useVector=false keep-lexical substrate, surface embedder_available:false through the handler and keep the embedder-success path byte-identical. Single-file-seam, S-effort, reversible."
trigger_phrases:
  - "C9 plan embedder degrade"
  - "stage1 candidate gen lexical fallback plan"
  - "memory recall degrade sequencing"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/001-speckit-memory/004-graceful-degradation"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Author C9 impl plan (DONE-record for 030 484b77b589)"
    next_safe_action: "None. C9 shipped"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-001-004-graceful-degradation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Implementation Plan: Memory MCP C9: Graceful Embedder-Degrade to Lexical

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node, MCP server) |
| **Framework** | Spec-Kit Memory MCP search pipeline (`stage1-candidate-gen → stage2-fusion → stage3-rerank → stage4-filter`) |
| **Storage** | SQLite (vector + FTS5/BM25 channels) |
| **Testing** | vitest |

### Overview
C9 routes the null/empty-embedding recall case into the channel-gating substrate that already supports dropping the vector channel while keeping FTS5/BM25/graph (`useVector=false` at `hybrid-search.ts:931-947`), instead of throwing at the Stage-1 entry (`stage1-candidate-gen.ts:700-707` hybrid path, `:1014-1020` vector path). The degrade is surfaced as `embedder_available:false` / `vector_search_skipped:true` on the Stage-1 output and plumbed through `memory-search.ts`. This is the Wave-0 spearhead's sharpest single graceful-degradation gap: independent, reversible, S-effort, PROMOTE-the-existing-substrate [CONFIRMED: roadmap.md:89,143,151, iter-037 Wave-0].
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (C9 only)
- [x] Success criteria measurable (degrade-not-throw + byte-identical happy path)
- [x] Dependencies identified (`useVector=false` substrate present)

### Definition of Done
- [x] All acceptance criteria met (REQ-001..004)
- [x] Tests passing (440 search/pipeline tests, new degrade vitest 5 cases)
- [x] Docs updated (spec/plan/tasks/implementation-summary)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Pipeline stage with channel-gated degrade, the recall path mirrors the existing graph-channel degrade at `handlers/memory-context.ts:1513` ("code graph unavailable, hybrid degrades to semantic-only"), applied to the dense channel instead.

### Key Components
- **`stage1-candidate-gen.ts`**: detects the null embedding and routes to lexical instead of throwing. Sets the degrade flags.
- **`types.ts`**: carries `embedder_available` / `vector_search_skipped` on the Stage-1 output metadata.
- **`memory-search.ts`**: plumbs the flags through to the response and guards concept input.
- **`hybrid-search.ts` `getAllowedChannels`** (unchanged): the `useVector=false` substrate the degrade routes into.

### Data Flow
Query → Stage-1 candidate gen → (embedding null?) → set `useVector=false` + `embedder_available:false` → run BM25/FTS/graph channels → fused candidates with the degrade flag visible downstream. On the happy path the embedding is non-null and the flow is byte-identical to baseline.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This is a degrade/error-path fix touching public responses and a stage invariant, so the affected-surface inventory applies.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `stage1-candidate-gen.ts` (hybrid + vector + multi-concept entry) | Throws on null embedding (the three throw sites) | Update, route null → lexical. The hybrid path drops via the live `useVector=false` substrate, the vector/multi-concept branches get an explicit lexical route | `stage1-embedder-degrade.vitest.ts` degrade traced to BM25 [CONFIRMED: 030 §14] |
| `types.ts` Stage-1 output metadata | Carries Stage-1 result metadata | Update, add `embedder_available` / `vector_search_skipped` | New fields plumbed through cache + envelope |
| `memory-search.ts` handler | Builds the recall response | Update, surface degrade flags + handler concept guard | Gate-D envelope assertion |
| `orchestrator.ts:7,49,62` "Stage-1 failure is mandatory" contract | No code keys on `PIPELINE_STAGE1_FAILED`, but throw-catchers must read the new flag | Unchanged contract, the typed `Stage1InputError` for genuine input errors stays mandatory. Only embedder-unavailable degrades | [CONFIRMED: iter-034 I34-O01] |

Required invariant: the embedder-success path stays byte-identical. Only a genuinely null/empty embedding takes the degrade branch, and genuine input-validation errors (`>5 concepts`, empty query/concept, unknown searchType) still fail (as a typed `Stage1InputError`), they do not silently degrade.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm the `useVector=false` substrate and the three null-embedding throw sites (`stage1-candidate-gen.ts:700-707, 1014-1020` and root null at `vector-index-queries.ts`)
- [x] Capture baseline: existing search/pipeline suite green (2 pre-existing unrelated failures recorded)

### Phase 2: Core Implementation
- [x] Route the null-embedding case to `useVector=false` lexical channels instead of throwing (hybrid path + explicit vector/multi-concept route)
- [x] Add `embedder_available` / `vector_search_skipped` to Stage-1 output (`types.ts`) and plumb through `memory-search.ts`
- [x] Add the typed `Stage1InputError` so genuine input failures propagate honestly (documented scope addition) + handler-level concept guard

### Phase 3: Verification
- [x] New `stage1-embedder-degrade.vitest.ts` (5 cases) + gate-D envelope assertion
- [x] Happy path byte-identical (verified via `git diff -w` trace, degrade traced to BM25)
- [x] Independent opus adversarial review: SHIP
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Null-embedding → lexical degrade + flags (5 cases) | vitest |
| Regression | Happy-path envelope byte-identical | vitest (gate-D assertion) |
| Suite | Full search/pipeline suite (440 tests) | vitest |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `getAllowedChannels` / `useVector=false` substrate (`hybrid-search.ts:931-947`) | Internal | Green | Without it the degrade route would need building. It already exists, so C9 is a wire-up |
| 027 embedder subsystem (storage-side) | Internal | Green | Independent, C9 is the recall-side complement, no shared-infra dep |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A caller relied on the embedder-unavailable throw to detect an outage and now mis-reads the degraded result, or the happy path regresses.
- **Procedure**: Revert commit `484b77b589` (branch-only, never pushed to main or deployed without explicit go). The change is a self-contained, reversible single-file-seam edit.
<!-- /ANCHOR:rollback -->
