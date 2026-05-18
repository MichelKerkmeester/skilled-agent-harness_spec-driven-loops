---
title: "Implementation Summary: Seed cosine embeddings into the sweep test"
description: "Pending; filled by codex with seeded sweep results and recommendation."
trigger_phrases:
  - "corpus seeded sweep summary"
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
      - "implementation-summary.md"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Implementation Summary: Seed cosine embeddings into the sweep test

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Implemented; seeded sweep skipped under default provider |
| **Created** | 2026-05-14 |
| **Branch** | `004-corpus-seeded-sweep` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Added `tests/scorer/fixtures/seed-skill-embeddings.ts`, a cache-aware fixture helper that embeds projection skill descriptions through `createEmbeddingsProvider().embedDocument(...)` and stores vectors under `tests/scorer/fixtures/.embeddings-cache/` using the key `sha256(description).slice(0, 16) + ':' + providerModelId`.

Updated `lane-weight-sweep.vitest.ts` so the 015/004 sweep setup:
- builds a corpus-scoped fixture projection from the live advisor projection,
- seeds skill description vectors,
- skips the sweep when the configured provider cannot produce vectors,
- spies `loadSkillEmbeddings(...)` so the cosine lane sees seeded vectors,
- seeds prompt query embeddings before calling the unchanged `runLaneWeightSweep(...)`, and
- writes `research/sweep-results.md` when the process can write to the packet path.

Default-provider result:

| vectorLabel | accuracyTotal | todayCorrect | intentDescribed | flippedFromBaseline |
|---|---:|---:|---:|---:|
| n/a | n/a | n/a | n/a | n/a |

The default provider failed during embedding with `Failed to create context`, so the official seeded sweep skipped instead of failing. An explicit `EMBEDDINGS_PROVIDER=hf-local` exploratory run seeded vectors successfully but produced zero top-route variance; the test failed the variance assertion as designed.

Exploratory `hf-local` numbers:

| vectorLabel | accuracyTotal | todayCorrect | intentDescribed | flippedFromBaseline |
|---|---:|---:|---:|---:|
| V0-baseline-015-002 | 0.6667 | 1.0000 | 0.3333 | 0 |
| V1-pre-015-002 | 0.6667 | 1.0000 | 0.3333 | 0 |
| V2-slightly-higher | 0.6667 | 1.0000 | 0.3333 | 0 |
| V3-medium | 0.6667 | 1.0000 | 0.3333 | 0 |
| V4-aggressive | 0.6667 | 1.0000 | 0.3333 | 0 |
| V5-explicit-heavy | 0.6667 | 1.0000 | 0.3333 | 0 |
| V6-cosine-dominant | 0.6667 | 1.0000 | 0.3333 | 0 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Implemented directly in the scoped packet without modifying production scorer weights, cosine math, corpus fixtures, `runLaneWeightSweep(...)`, or `DEFAULT_SCORER_WEIGHTS`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## KEY DECISIONS

| Decision | Why |
|----------|-----|
| Use real provider via `createEmbeddingsProvider()` | Reuses live cosine math; gives the sweep authentic signal |
| Cache vectors on disk | Warm-cache sweep stays under 5s; matches CI rerun expectations |
| Recommendation is advisory | Promotion to lane-registry is a separate packet |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Gate | Status | Evidence |
|------|--------|----------|
| Targeted seeded sweep test | Pass with skip | `npm exec -- vitest run skill_advisor/tests/scorer/lane-weight-sweep.vitest.ts`: 1 passed, 1 skipped |
| Provider unavailable skip | Pass | Default `llama-cpp` provider failed with `Failed to create context`; seeded sweep skipped |
| Typecheck | Pass | `npm run typecheck` from `mcp_server/` |
| Sweep variance achieved | Not run under default provider | Official sweep skipped; explicit `hf-local` exploratory run found zero variance and failed the guard |
| Report artifact | Present | `research/sweep-results.md` documents skip plus exploratory numbers |
| Dist rebuild | Pass | `npx tsc --build` from `system-spec-kit/`; semantic-shadow.js mtime confirms latest build |
| Strict spec validation | Pass | Packet 015/004 + parent 015 both `validate.sh --strict` PASSED |
| Recommendation cited with numbers | Pass | Recommendation below cites the zero-delta exploratory table |
<!-- /ANCHOR:verification -->

### Recommended Next Weight

Recommended next weight: stay at `0.05`.

Why: the official default-provider sweep did not run because the configured provider failed to create an embedding context. The explicit `hf-local` exploratory run produced no `intentDescribedAccuracy` delta versus V0: every vector stayed at `0.3333`, with `todayCorrectAccuracy` fixed at `1.0000` and `flippedFromBaseline` fixed at `0`. There is no numeric evidence here for raising the semantic lane above the current `0.05`.

What changes if promoted: none observed in the exploratory run. V1 through V6 all had `flippedFromBaseline = 0`, so no candidate vector produced a routing-diff case to promote.

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Corpus size**: 24 entries. Real-world prompt distribution may differ.
2. **Provider variance**: cosine vectors depend on the active embedding model. Switching providers invalidates the cache.
3. **Recommendation horizon**: tuning is point-in-time; revisit if SKILL.md descriptions change materially.
<!-- /ANCHOR:limitations -->
