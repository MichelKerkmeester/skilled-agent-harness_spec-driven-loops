---
title: "Implementation Plan: 002 — Semantic Matcher"
description: "Pure cosine matcher with threshold/margin/max gates reusing the memory-summaries cosine + BLOB precedent, plus a concurrent-safe in-memory trigger-embedding cache. Runtime read-only."
trigger_phrases:
  - "027 phase 004 semantic matcher plan"
  - "cosine trigger matcher plan"
importance_tier: "important"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-semantic-trigger-fallback/002-semantic-matcher"
    last_updated_at: "2026-06-10T10:00:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Completed semantic matcher with default-off shadow wiring"
    next_safe_action: "Ready for follow-on shadow evaluation phase"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-06-007-phase-split"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: 002 — Semantic Matcher

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node) |
| **Framework** | Spec Kit Memory MCP server |
| **Storage** | Reads `embedding_cache` / `memory_trigger_embeddings` (from `001`) |
| **Testing** | Vitest |

### Overview
Add a pure cosine-similarity matcher with threshold/margin/max gates and a concurrent-safe in-memory trigger-embedding cache. The matcher only reads cached embeddings; it never embeds.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] `memory-summaries.ts:25-190` cosine + BLOB-to-Float32 precedent confirmed.
- [x] `001-schema-backfill` cached trigger embeddings available to read.

### Definition of Done
- [x] Cosine math verified against known vectors.
- [x] Threshold + margin + max gates unit-tested.
- [x] Deterministic output proven across runs.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Pure function + cached read; deterministic.

### Key Components
- **`semantic-trigger-matcher.ts`**: `matchSemanticTriggers(promptEmbed, triggerCache, {threshold, margin, max})`.
- **In-memory cache**: trigger embeddings loaded on first call; refresh on TTL OR `--force` invalidation.

### Data Flow
prompt embedding (from cache) → cosine vs each ready trigger embedding → threshold filter → margin filter → max cap → ordered `SemanticMatch[]`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm cosine + BLOB conversion precedent in `memory-summaries.ts`.
- [x] Define `SemanticMatch` shape and gate parameters.

### Phase 2: Core Implementation
- [x] Implement `matchSemanticTriggers` pure function with gates + deterministic ordering.
- [x] Implement in-memory trigger-embedding cache with TTL / invalidation.

### Phase 3: Verification
- [x] Cosine math unit tests against known vectors.
- [x] Gate + determinism tests.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Cosine math, gates, ordering | Vitest |
| Unit | Cache load + invalidation | Vitest |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `001-schema-backfill` cached embeddings | Internal | Pending | No trigger embeddings to score; cold-start skip |
| `memory-summaries.ts` cosine precedent | Internal | Green | Reused for math parity |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Matcher produces non-deterministic or mis-gated output.
- **Procedure**: Module is unused until `003` wires it behind the parent feature flag; remove/disable with no runtime impact.
<!-- /ANCHOR:rollback -->
