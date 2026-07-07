---
title: "Implementation Plan: Skill embedding cache and cosine-similarity lane wiring"
description: "Schema migration, scan-time embedding generation, recommend-time prompt embedding, cosine lane, tests."
trigger_phrases:
  - "skill embedding cache plan"
  - "cosine lane wiring plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/002-skill-advisor-scoring-engine/003-embedding-cache-cosine-wiring"
    last_updated_at: "2026-05-13T19:30:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded child 001 spec stack"
    next_safe_action: "Dispatch cli-codex gpt-5.5 high"
    blockers: []
    key_files:
      - "plan.md"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Implementation Plan: Skill embedding cache and cosine-similarity lane wiring

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## SUMMARY

Add embedding storage to `skill-graph.sqlite`, populate it during `skill_graph_scan`, embed prompts in the advisor recommend handler, and produce cosine `LaneMatch` payloads in a new lane file. Keep the lane shadow-only so live behavior is byte-identical. Sibling phase 002 handles the eval-driven promotion to live.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## QUALITY GATES

### Definition of Ready
- [x] Embedding provider stable (factory.ts cascade resolved active llama-cpp).
- [x] Skill-graph schema location identified.
- [x] Scoring lane registry pattern understood (see `scorer/lane-registry.ts`).

### Definition of Done
- [x] Schema migration applied without breaking existing reads.
- [x] Skill embeddings populated on scan with content-hash skip logic.
- [x] Cosine lane file emits LaneMatch payloads.
- [x] Lane stays shadow-only (no behavior change).
- [x] Vitest suite under `skill_advisor/` extended; all pass.
- [x] Typecheck clean. Dist rebuilt.
- [x] Strict validation passes.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## ARCHITECTURE

### Technical Context
| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, better-sqlite3, web-tree-sitter (existing toolchain) |
| **Framework** | Spec Kit MCP server, Vitest |
| **Storage** | `skill-graph.sqlite` (new column or sibling table for vectors) |
| **Testing** | Vitest, strict spec validator |

### Approach
1. Schema change: add `embedding BLOB`, `embedding_model_id TEXT`, `embedding_content_hash TEXT` columns to the skill node row (or sibling table — codex picks).
2. Scan flow: during `skill_graph_scan`, for each skill compute SKILL.md content hash; if changed or missing, call `factory.ts:resolveProvider().embed(skillDescription)` and store the vector.
3. Recommend flow: in `advisor-recommend.ts` handler, embed the incoming prompt once per call, retrieve cached skill vectors, compute cosine, produce LaneMatch entries.
4. Lane registration: add new `scorer/lanes/semantic-cosine.ts` (or rename/replace `semantic-shadow.ts`); register it in `lane-registry.ts` with `live: false, weight: 0` (or `live: true, weight: 0` — codex picks based on simpler-to-flip-later choice).
5. Tests: Vitest cases for schema migration, scan-time embed/skip, recommend-time embed, cosine math, shadow weighting.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## IMPLEMENTATION PHASES

### Phase 1: Setup
- Inspect existing `skill-graph.sqlite` schema and migration pattern.
- Inspect `factory.ts:resolveProvider()` and confirm embed entry point.
- Inspect `lane-registry.ts` weight wiring.

### Phase 2: Implementation
- Apply schema change (idempotent ALTER or new table).
- Wire scan-time embedding generation with content-hash skip.
- Wire recommend-time prompt embedding.
- Add the cosine lane file.
- Register the lane shadow-only.

### Phase 3: Verification
- Vitest suite under `skill_advisor/` extended and passing.
- Typecheck clean.
- Dist rebuild.
- Strict validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## TESTING STRATEGY

| Layer | What | How |
|-------|------|-----|
| Schema | Migration is idempotent and non-destructive | Vitest with temp sqlite |
| Scan-time embed | Embedding stored on first scan, skipped on second when content hash matches | Vitest with mocked provider |
| Recommend-time | Prompt embedded once per recommend call | Vitest spy on provider |
| Cosine lane | Math correctness vs known vectors | Vitest with fixture vectors |
| Live behavior | Shadow-only lane does not change `recommendedSkill` or `confidence` for fixture prompts | Vitest snapshot |
| Strict | Spec packet structure | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## DEPENDENCIES

- `factory.ts:resolveProvider()` and its return type with `.embed()` method.
- `skill-graph.sqlite` schema migration path (existing pattern in `skill-graph-db.ts`).
- Existing `LaneMatch` and `AdvisorScoringResult` types under `scorer/types.ts`.
- Existing `lane-registry.ts` weight wiring.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## ROLLBACK PLAN

Single-commit revert removes the schema column (or drops the sibling table), removes the lane file, restores the previous `lane-registry.ts`. No data migration involved because the lane was shadow-only.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## PHASE DEPENDENCIES

| Phase | Depends On | Why |
|-------|-----------|-----|
| Phase 1: Setup | 014-local-embeddings-setup-a (017, 018) | Local Gemma provider must be live |
| Phase 2: Implementation | Phase 1 | Discovery completed before changes |
| Phase 3: Verification | Phase 2 | Code must exist before tests run |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## EFFORT ESTIMATE

| Component | Estimate |
|-----------|----------|
| Schema migration | ~30 LOC |
| Scan-time embed wiring | ~80 LOC |
| Recommend-time embed | ~40 LOC |
| Cosine lane file | ~60 LOC |
| Lane registry + fusion wiring | ~30 LOC |
| Vitest coverage | ~150 LOC |
| **Total** | **~390 LOC** |

Dispatch time on cli-codex gpt-5.5 high: 5-15 min.
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## ENHANCED ROLLBACK

### Triggers
- Recommend latency regresses by more than 50ms p50.
- Vitest skill_advisor suite fails after build.
- Provider exception storm during scan.

### Recovery
1. Revert the implementation commit (`git revert <hash>`).
2. Drop the new schema column via `ALTER TABLE skill_graph_nodes DROP COLUMN embedding;` or drop sibling table.
3. Restart MCP server to pick up reverted dist.

### Data Safety
The lane is shadow-only — no consumer reads the embedding column for live decisions. Removing the column does not affect routing correctness.
<!-- /ANCHOR:enhanced-rollback -->
