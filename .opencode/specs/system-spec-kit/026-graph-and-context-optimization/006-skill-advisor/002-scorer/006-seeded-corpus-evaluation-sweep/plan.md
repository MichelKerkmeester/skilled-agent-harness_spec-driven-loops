---
title: "Implementation Plan: Seed cosine embeddings into the sweep test"
description: "Embed fixture skill descriptions on test setup, cache vectors, re-run sweep, emit numbers-driven recommendation."
trigger_phrases:
  - "corpus seeded sweep plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/006-seeded-corpus-evaluation-sweep"
    last_updated_at: "2026-05-14T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded packet"
    next_safe_action: "Dispatch codex"
    blockers: []
    key_files:
      - "plan.md"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Implementation Plan: Seed cosine embeddings into the sweep test

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## SUMMARY

Add a Vitest setup helper that embeds each fixture skill description through `createEmbeddingsProvider()` once per test file, caches vectors keyed by skill id + content hash + model id, and wires the seeded vectors so the cosine lane reads them during the sweep. Re-run the same 7-vector sweep from 015/003, emit a fresh markdown report with real variance, and land a numbers-driven recommendation in this packet's `implementation-summary.md`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## QUALITY GATES

### Definition of Ready
- [x] 015/003 shipped (harness + corpus exist).
- [x] Active embedding provider (`createEmbeddingsProvider()`) verified live in earlier packets.
- [x] `loadSkillEmbeddings()` and the cosine lane shape understood.

### Definition of Done
- [x] Setup helper embeds + caches fixture skills.
- [x] Sweep test reads seeded vectors (verified via debug log).
- [x] Sweep produces variance across vectors (REQ-004 satisfied) OR test skips with documented provider-unavailable reason.
- [x] implementation-summary.md cites real numbers.
- [x] Strict spec validation passes.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## ARCHITECTURE

### Technical Context
| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Vitest, better-sqlite3 (existing) |
| **Framework** | Spec Kit MCP server skill-advisor scoring |
| **Storage** | Cache under `tests/scorer/fixtures/.embeddings-cache/` (gitignored); OR in-memory Map for the test session |
| **Testing** | Vitest |

### Approach
1. Add `tests/scorer/fixtures/seed-skill-embeddings.ts` exporting an async `seedSkillEmbeddings(skillIds: string[]): Promise<Map<string, Float32Array>>`.
2. The helper:
   - Computes a cache key per skill: `sha256(skill.description) + ':' + provider.modelId`.
   - Checks an on-disk cache under `tests/scorer/fixtures/.embeddings-cache/seeded.sqlite` (or a JSON manifest); returns hit if present.
   - On miss: calls `createEmbeddingsProvider().embedDocument(skill.description)`; stores result.
   - Returns a `Map<skillId, Float32Array>`.
3. Modify the sweep test (`lane-weight-sweep.vitest.ts`):
   - In `beforeAll`, call `seedSkillEmbeddings(...)` for the fixture skill ids.
   - Override `loadSkillEmbeddings()` for the test (via dependency injection or `vi.spyOn`) to return the seeded map.
   - Run the existing 7-vector sweep.
4. Emit fresh markdown report at this packet's `research/sweep-results.md`. Include:
   - Per-vector accuracy + flippedFromBaseline
   - Per-case routing diffs vs baseline (now expected to be non-empty for at least some vectors)
   - The recommendation
5. Update implementation-summary.md `what-built` and `verification` anchors with the numbers + recommendation.

### Cache key + invalidation
- Cache key: `sha256(skill.description).slice(0,16) + ':' + providerModelId`.
- Cache file: `tests/scorer/fixtures/.embeddings-cache/seeded.sqlite` (or JSON). Add the directory to `.gitignore` (or a sibling `.gitignore` in `fixtures/`).
- On cache miss for any skill, regenerate just that skill.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## IMPLEMENTATION PHASES

### Phase 1: Setup
- Read 015/003 sweep test to find the `createFixtureProjection` and `loadSkillEmbeddings` call sites.
- Confirm `createEmbeddingsProvider()` + `embedDocument()` API shape.

### Phase 2: Implementation
- Author `seed-skill-embeddings.ts` helper.
- Wire into sweep test via `beforeAll` + spy/inject.
- Re-run sweep; emit markdown report.
- Update implementation-summary.md.

### Phase 3: Verification
- `npm run typecheck`.
- `npm exec -- vitest run skill_advisor`; confirm only the pre-existing plugin-bridge test still fails.
- `npx tsc --build` to refresh dist.
- Strict validate this packet + parent 015.
- Confirm sweep variance (REQ-004).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## TESTING STRATEGY

| Layer | What | How |
|-------|------|-----|
| Helper unit | Cache hit/miss + key derivation | Vitest unit test |
| Sweep wiring | loadSkillEmbeddings spy returns seeded map | Vitest assertion on a single sweep call |
| Sweep variance | At least one vector differs from baseline | Vitest assertion on sweep summary |
| Provider-unavailable path | Test skips cleanly | Vitest with mocked unavailable provider |
| Strict | Spec packet structure | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## DEPENDENCIES

- 015/001 (cosine lane code).
- 015/003 (sweep harness, corpus, override path).
- Live local Gemma provider.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## ROLLBACK PLAN

Single-commit revert removes the helper, restores the previous sweep test, drops the cache file. No production code touched.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## PHASE DEPENDENCIES

| Phase | Depends On | Why |
|-------|-----------|-----|
| Phase 1 | 015/003 shipped | Sweep test must already exist |
| Phase 2 | Phase 1 | Wire-in needs the existing test as substrate |
| Phase 3 | Phase 2 | Verification runs after the wire-in |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## EFFORT ESTIMATE

| Component | Estimate |
|-----------|----------|
| Seed helper + cache | ~120 LOC |
| Test wire-in + spy | ~40 LOC |
| Markdown report regenerate | ~30 LOC |
| Implementation-summary update | ~50 LOC of doc |
| **Total** | **~240 LOC** |

cli-codex gpt-5.5 high dispatch: 8-15 min.
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## ENHANCED ROLLBACK

### Triggers
- Sweep variance still zero after wire-in.
- Vitest run exceeds 60s budget materially.
- Provider call fails repeatedly.

### Recovery
1. Revert the implementation commit.
2. Drop the embeddings cache file.

### Data Safety
No production data touched. Cache lives under tests/.
<!-- /ANCHOR:enhanced-rollback -->
