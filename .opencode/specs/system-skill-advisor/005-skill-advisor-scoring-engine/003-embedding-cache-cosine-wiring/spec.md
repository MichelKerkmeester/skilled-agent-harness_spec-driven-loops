---
title: "Feature Specification: Skill embedding cache and cosine-similarity lane wiring"
description: "Add a per-skill embedding cache to skill-graph.sqlite, embed prompts at recommend-time, and surface a cosine score as a shadow-only lane (no behavior change)."
trigger_phrases:
  - "skill embedding cache"
  - "cosine lane wiring"
  - "advisor shadow cosine"
  - "skill-graph embedding column"
importance_tier: "important"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/005-skill-advisor-scoring-engine/003-embedding-cache-cosine-wiring"
    last_updated_at: "2026-05-13T19:30:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded child 001 spec stack"
    next_safe_action: "Dispatch cli-codex gpt-5.5 high to implement"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000001501"
      session_id: "001-embed-cache-and-cosine-wiring"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Use existing factory.ts provider cascade, not a new embedding pipeline."
      - "Cache vectors in skill-graph.sqlite, not context-index.sqlite."
      - "Keep lane shadow-only this phase; promotion to live happens in 002."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: Skill embedding cache and cosine-similarity lane wiring

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Implemented — verification complete with one pre-existing full-suite caveat |
| **Created** | 2026-05-13 |
| **Branch** | `001-embed-cache-and-cosine-wiring` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The skill advisor's `semantic_shadow` lane at `scorer/lanes/semantic-shadow.ts` is not an embedding lane. It is token-overlap scoring with a 0.8 multiplier, declared `live: false` with `weight: 0.00`. Prompts that describe intent without naming the skill's keywords get no semantic recall signal today. The 014 setup-A line shipped local EmbeddingGemma at ~6ms per embed, which is fast enough to compute cosine similarity on every recommend call.

### Purpose
Wire the embedding plumbing without changing live recommendation behavior. Embed each SKILL.md description once on `skill_graph_scan`, cache the vector in `skill-graph.sqlite`, embed incoming prompts on each advisor recommend call, expose the cosine score as a new lane match payload. Keep the lane at shadow-only weight in this phase. The actual behavior change (weight rebalance + promote to live) is gated to phase 002 after an ablation sweep.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `embedding BLOB` and `embedding_model_id TEXT` columns (or equivalent table) to `skill-graph.sqlite` schema.
- Populate vectors during `skill_graph_scan` using the existing `factory.ts:resolveProvider()` cascade.
- Embed incoming prompts in the advisor recommend handler.
- Add a cosine-similarity lane that produces real `LaneMatch` scores.
- Keep the lane shadow-only (`live: false` OR `weight: 0` in the live weights map).
- Cache invalidation: re-embed a skill when its SKILL.md content hash changes.
- Vitest coverage for the new column, the embed-on-scan flow, and the cosine lane scoring.

### Out of Scope
- Promoting the lane to `live: true` (handled by sibling phase 002).
- Rebalancing the other four lane weights (handled by 002).
- Changing the existing five lane scoring math.
- Migrating any existing data outside `skill-graph.sqlite`.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance |
|----|-------------|------------|
| REQ-001 | Skill embeddings are persisted in `skill-graph.sqlite`. | Schema migration adds storage; a successful `skill_graph_scan` populates non-null vectors for at least one skill. |
| REQ-002 | Embedding generation uses `factory.ts:resolveProvider()`. | No new provider plumbing introduced; vectors carry the active model id. |
| REQ-003 | Embeddings refresh when SKILL.md content hash changes. | Two consecutive scans produce identical vectors when content is unchanged; modifying SKILL.md flips the cached hash and re-embeds. |
| REQ-004 | Advisor recommend handler embeds the incoming prompt. | Recommend call invokes the provider once per call and records the latency. |
| REQ-005 | A cosine-similarity lane produces `LaneMatch` payloads. | New lane file under `scorer/lanes/` computes cosine and returns matches above a small threshold. |
| REQ-006 | The lane remains shadow-only. | `live: false` OR `weight: 0` so today's recommendations stay byte-identical. |
| REQ-007 | Existing 5-lane scoring math is unchanged. | All current Vitest tests under `skill_advisor/` and the gold-verification battery still pass. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Strict spec validation passes for this packet.
- **SC-002**: `npm run typecheck` passes from `mcp_server/`.
- **SC-003**: `npm exec -- vitest run skill_advisor` passes including new tests.
- **SC-004**: Fresh cli-opencode probe shows recommend response includes the cosine lane match payload with a numeric score for at least one skill.
- **SC-005**: Existing recommend responses for a smoke prompt are unchanged in their `recommendedSkill` and `confidence` fields (lane is shadow-only).
- **SC-006**: A scan-then-scan cycle without SKILL.md changes shows zero re-embed calls.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Provider unavailable when scan runs | Vectors stay null, lane produces empty match | Wrap embed call in try/catch; mark vector as deferred; advisor falls back to existing 4 lanes |
| Risk | Schema migration on an existing skill-graph.sqlite | Production DB has rows without the new column | Use `ALTER TABLE` with `IF NOT EXISTS` semantics or schema-version check; do not break existing reads |
| Risk | Embed latency creeps into recommend hot path | Advisor recommend slows down | Cache prompt embeddings within a single advisor call; measure and log embed_ms |
| Dependency | Local Gemma provider working (017 + 018) | Cannot generate vectors otherwise | Already shipped and verified live |
| Dependency | `factory.ts:resolveProvider()` is the chosen embedding entry | Stable API contract | Verified active in the 026 inventory packet |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None for the dispatcher. Codex resolves these inline:
- Exact column layout (single BLOB vs separate table)
- Cosine threshold value for "match" cutoff
- Whether to surface lane score in `recommend()` response shape behind a debug flag
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## 8. NON-FUNCTIONAL REQUIREMENTS

| ID | Class | Requirement |
|----|-------|-------------|
| NFR-P01 | Performance | Recommend embed latency under 50ms on a warm Gemma provider. |
| NFR-P02 | Performance | Scan re-embed only fires on content-hash mismatch; steady-state cost is zero. |
| NFR-S01 | Security | Embedding provider call inherits existing factory.ts security context; no new credentials. |
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 9. EDGE CASES

- Provider unavailable on scan: vector stays null, lane produces empty match list; advisor falls back to existing four lanes.
- SKILL.md file empty or missing description: skip embedding, mark as deferred in skill-graph row.
- Embedding model dimension changes between scans: detect via `embedding_model_id` mismatch, re-embed everything for that skill.
- Prompt over context window: truncate to model max, log warning.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 10. COMPLEXITY ASSESSMENT

| Aspect | Rating | Note |
|--------|--------|------|
| **LOC estimate** | 250-400 | Schema migration + scan-time embed + recommend-time embed + lane file + tests |
| **Surface area** | Medium | Crosses skill-graph-db, scan handler, recommend handler, scorer lane registry |
| **Risk** | Low | Shadow-only invariant means no behavior change |
| **Reversibility** | High | Single-commit revert is clean; no data migration |
<!-- /ANCHOR:complexity -->
