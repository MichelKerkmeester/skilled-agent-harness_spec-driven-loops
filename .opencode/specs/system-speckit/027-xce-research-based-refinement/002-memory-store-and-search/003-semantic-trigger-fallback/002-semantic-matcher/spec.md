---
title: "002 — Semantic Matcher"
description: "Pure cosine-similarity trigger matcher (semantic-trigger-matcher.ts) with threshold/margin/max gates and an in-memory trigger-embedding cache, reusing the existing cosine + BLOB-to-Float32 precedent. Runtime read-only; no embedding generation."
trigger_phrases:
  - "027 phase 004 semantic matcher"
  - "semantic-trigger-matcher.ts"
  - "cosine trigger matching"
  - "trigger embedding cache"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/003-semantic-trigger-fallback/002-semantic-matcher"
    last_updated_at: "2026-06-10T10:00:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Completed semantic matcher with default-off shadow wiring"
    next_safe_action: "Ready for follow-on shadow evaluation phase"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "implementation-summary.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-06-007-phase-split"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: 002 — Semantic Matcher

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Implemented |
| **Created** | 2026-06-06 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 4 |
| **Predecessor** | 001-schema-backfill |
| **Successor** | 003-hybrid-handler |
| **Handoff Criteria** | A deterministic, gated cosine matcher exists as a pure function with unit-tested math; ready for handler wiring. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the semantic trigger fallback decomposition (parent `004-semantic-trigger-fallback`).

**Scope Boundary**: The standalone semantic matcher module and its in-memory cache only. Handler integration / UNION / activation guards are owned by `003-hybrid-handler`.

**Dependencies**:
- `001-schema-backfill` (cached trigger embeddings must be available to read).

**Deliverables**:
- `semantic-trigger-matcher.ts` (pure cosine matcher with threshold + margin + max gates, deterministic ordering).
- In-memory trigger-embedding cache (loaded on first call; TTL / invalidation refresh).
- Unit tests for cosine math and gate behavior.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
With cached trigger embeddings available, the system still needs a similarity matcher to score a prompt embedding against trigger embeddings. There is no such matcher, and it must be deterministic and tightly gated to avoid false-positive triggers that would mis-prioritize cognitive tiers.

### Purpose
Provide a pure, deterministic cosine matcher with threshold/margin/max gates and a concurrent-safe in-memory cache, reusing the existing cosine + BLOB conversion precedent.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `mcp_server/lib/triggers/semantic-trigger-matcher.ts` (NEW): `matchSemanticTriggers(promptEmbed, triggerCache, {threshold, margin, max}) -> SemanticMatch[]`; deterministic ordering (score DESC, memory_id ASC tie-break); gates enforced.
- Reuse of `mcp_server/lib/search/memory-summaries.ts` cosine + BLOB-to-Float32 conversion pattern.
- In-memory cache of trigger embeddings (loaded on first call; refresh on TTL OR `memory_index_scan --force` invalidation).
- Unit tests `mcp_server/__tests__/triggers/semantic-matcher.vitest.ts` (NEW).

### Out of Scope
- Wiring the matcher into `memory_match_triggers` - owned by `003-hybrid-handler`.
- Embedding generation - owned by `001-schema-backfill` (runtime is cache-read-only).
- Goldens / threshold tuning / shadow eval - owned by `004`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/lib/triggers/semantic-trigger-matcher.ts` | Create | Pure cosine matcher with gates + in-memory cache |
| `mcp_server/lib/search/memory-summaries.ts` | Analyze | Reuse cosine + BLOB-to-Float32 precedent |
| `mcp_server/__tests__/triggers/semantic-matcher.vitest.ts` | Create | Cosine math + gate unit tests |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002a | Deterministic cosine matcher with threshold + margin + max-hit gates | Pure function; same input → same output; gates enforced (score ≥ threshold; top−second ≥ margin; cap at max) |
| REQ-002b | Cosine math reuses the existing precedent | Cosine + BLOB-to-Float32 identical to `memory-summaries.ts` precedent; verified against known vectors |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002c | In-memory trigger-embedding cache, concurrent-safe, invalidatable | Cache loads on first call; refreshes on TTL OR `memory_index_scan --force`; concurrent calls independent |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Cosine math verified against known vectors; gates (threshold/margin/max) enforced in unit tests.
- **SC-002**: Output is deterministic across runs for identical input.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Threshold values tuned for 1024d Voyage do not transfer to 768d Nomic | Med | Treat threshold/margin as injected params; tuning owned by `004` goldens |
| Risk | Non-deterministic ordering breaks reproducibility | Low | Explicit tie-break (score DESC, memory_id ASC) |
| Dependency | `001-schema-backfill` cached embeddings | High | Cold-start (no embedding) is a no-op skip, surfaced downstream in `004` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- What TTL is appropriate for the in-memory trigger-embedding cache vs explicit invalidation only?
- Should the matcher expose threshold-band scores (0.78/0.82/0.86) for the shadow telemetry consumed by `004`?
<!-- /ANCHOR:questions -->
