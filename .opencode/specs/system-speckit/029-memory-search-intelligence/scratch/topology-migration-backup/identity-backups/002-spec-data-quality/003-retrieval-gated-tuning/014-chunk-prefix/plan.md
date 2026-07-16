---
title: "Implementation Plan: C1 deterministic header-path plus curated-signal chunk prefix [template:level_2/plan.md]"
description: "Re-inject the frontmatter triggers and title and header path as a deterministic embed-time chunk prefix behind a coverage guard and a dual-cache-key fix. The prefix is default-off and promotes only after the C2 prod-mode recall gate clears."
trigger_phrases:
  - "chunk prefix plan"
  - "header path prefix"
  - "embedding coverage guard"
  - "dual cache key"
  - "retrieval re-embed"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/002-spec-data-quality/003-retrieval-gated-tuning/014-chunk-prefix"
    last_updated_at: "2026-07-04T17:11:52.520Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored phase plan from spec seams"
    next_safe_action: "Build prefix builder and coverage guard once 015 gate lands"
    blockers:
      - "Gated on 015-prodmode-recall-gate prod-mode completeRecall@3 proof"
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/parsing/content-normalizer.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts"
      - ".opencode/skills/system-spec-kit/shared/embeddings.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-21-plan-014-chunk-prefix"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: C1 deterministic header-path plus curated-signal chunk prefix

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope. Remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript on Node |
| **Framework** | system-spec-kit MCP server |
| **Storage** | SQLite embedding cache plus an in-process LRU |
| **Testing** | Vitest plus the run-eval-v2.mjs dual-mode harness |

### Overview
This phase re-injects the curated retrieval signal that the embed path strips today. `normalizeContentForEmbedding` at `content-normalizer.ts:216-231` drops the frontmatter triggers and title and flattens the header path before a chunk is hashed, so the vector loses its strongest intent signal. The plan adds a deterministic prefix builder that re-composes the frontmatter `trigger_phrases` and `title` and the chunk header path into a stable string prepended before embedding, folds a strategy version into both cache keys so the change cannot no-op on a cache hit, and lands a net-new coverage guard so a mixed-regime corpus is detectable before any prod-mode read trusts the new vectors. Everything ships default-off and promotes only after the 015 prod-mode completeRecall@3 gate clears.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Embed-time transform plus a versioned cache key plus a coverage guard. The prefix never mutates the source file and never participates in retrieval ranking.

### Key Components
- **Prefix builder**: composes frontmatter `trigger_phrases` and `title` and the chunk header path into a byte-stable prefix prepended to chunk content before embedding, behind the strategy flag.
- **Dual cache key**: folds the prefix strategy version into the persistent primary key at `embedding-cache.ts:157` and the in-process LRU key at `shared/embeddings.ts:309-311`.
- **Coverage guard**: adds `embedding_context_version` plus a coverage readout so a mixed regime is queryable before any prod-mode read.

### Data Flow
A chunk reaches `normalizeContentForEmbedding`, the builder prepends the deterministic prefix when the flag is on, the strategy-versioned key decides cache hit or miss, the embedding call runs on the prefixed content, and the coverage guard records the context version so the prod read can refuse a mixed regime.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase touches the live embed and cache path plus persistence boundaries, so the surface inventory applies.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `content-normalizer.ts:216-231` | Strips frontmatter and anchors and flattens headings before embedding | update | grep the prefix builder call and a determinism test |
| `embedding-cache.ts:157` | Persistent cache primary key | update | re-embed miss test on a strategy bump |
| `shared/embeddings.ts:309-311` | In-process LRU key | update | warm-hit miss test on a strategy bump |
| `embedding-cache.ts` schema | Cached vector store | update | new `embedding_context_version` column plus coverage readout |

Required inventories:
- Same-class producers: `rg -n 'normalizeContentForEmbedding|normalizeHeadings' .opencode/skills/system-spec-kit/mcp_server/lib/parsing`.
- Consumers of changed symbols: `rg -n 'getCacheKey|embedding_context_version|embeddingCoverage' . --glob '*.ts' --glob '*.js'`.
- Matrix axes: flag on or off, frontmatter present or missing, header path present or empty, cold or warm cache.
- Algorithm invariant: the same chunk and frontmatter SHALL produce a byte-identical prefix on every run.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm the 015 prod-mode completeRecall@3 baseline is captured
- [ ] Add the strategy flag default-off and the strategy version constant
- [ ] Scaffold the coverage-guard column and readout

### Phase 2: Core Implementation
- [ ] Build the deterministic prefix builder in `content-normalizer.ts`
- [ ] Fold the strategy version into both cache keys
- [ ] Run the full re-embed behind the flag at the new strategy version

### Phase 3: Verification
- [ ] Determinism test confirms byte-identical prefixes
- [ ] Dual-key miss test confirms no silent no-op on cache hits
- [ ] Coverage guard reports full coverage and the prod read refuses a mixed regime
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Prefix builder determinism, degraded inputs, truncation | Vitest |
| Integration | Dual cache key miss on a strategy bump, coverage readout | Vitest |
| Manual | Full re-embed coverage check plus prod-mode completeRecall@3 read | run-eval-v2.mjs dual-mode |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 015-prodmode-recall-gate | Internal | Red | Promotion is hard-blocked until the prod-mode gate lands and the number moves |
| New coverage guard | Internal | Red | The re-embed cannot be trusted until the guard exists |
| run-eval-v2.mjs dual-mode harness | Internal | Green | Already ships, no new harness work in this phase |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the prod-mode completeRecall@3 number fails to rise against the 015 baseline, or a mixed regime is detected after promotion.
- **Procedure**: set the strategy flag off so cache keys and vectors revert to byte-identical legacy behavior, leave the old cached vectors in place, and re-run the prod read on the legacy regime.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Core) ──► Phase 3 (Verify)
015 gate (external) ──┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup, 015 gate for promotion | Verify |
| Verify | Core | Promotion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1-2 hours |
| Core Implementation | High | 4-8 hours |
| Verification | Med | 2-3 hours |
| **Total** | | **7-13 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] The 015 prod-mode baseline is captured before any re-embed
- [ ] The strategy flag is configured default-off
- [ ] The coverage readout is queryable

### Rollback Procedure
1. Set the strategy flag off so the embed path reverts to legacy behavior
2. Leave old cached vectors in place since the versioned key isolates them
3. Re-run the prod-mode completeRecall@3 read on the legacy regime to confirm the floor
4. Note the failed promotion in the phase docs

### Data Reversal
- **Has data migrations?** Yes, a one-time full re-embed under the new strategy version
- **Reversal procedure**: the versioned cache key isolates new vectors from old, so flag-off restores the legacy regime without a manual flush
<!-- /ANCHOR:enhanced-rollback -->
