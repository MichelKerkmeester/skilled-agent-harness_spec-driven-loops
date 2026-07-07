---
title: "Implementation Summary: Skill embedding cache and cosine-similarity lane wiring"
description: "Pending implementation; filled after cli-codex dispatch returns and main agent verifies."
trigger_phrases:
  - "skill embedding cache summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/002-skill-advisor-scoring-engine/003-embedding-cache-cosine-wiring"
    last_updated_at: "2026-05-13T19:30:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded implementation-summary template"
    next_safe_action: "Dispatch cli-codex gpt-5.5 high"
    blockers: []
    key_files:
      - "implementation-summary.md"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Implementation Summary: Skill embedding cache and cosine-similarity lane wiring

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Implemented — verification complete with one pre-existing full-suite caveat |
| **Created** | 2026-05-13 |
| **Branch** | `001-embed-cache-and-cosine-wiring` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Implemented a shadow-only cosine lane in the existing `semantic-shadow.ts` export. `skill-graph-db.ts` now adds idempotent `embedding`, `embedding_model_id`, and `embedding_content_hash` columns, refreshes description embeddings through the current `createEmbeddingsProvider()` API, skips rows when hash and model match, and exposes cached vectors through `loadSkillEmbeddings()`.

`skill_graph_scan` now refreshes embeddings after metadata indexing. `advisor-recommend.ts` embeds each non-cached recommend prompt through `withSemanticShadowPromptEmbedding()` before scoring. The lane reads cached skill vectors, computes cosine similarity, emits `semantic_shadow` matches with `cosine:<value>` evidence above the documented threshold, and remains shadow-only because `lane-registry.ts` was not changed.

Added Vitest coverage at `mcp_server/skill_advisor/lib/scorer/lanes/__tests__/semantic-shadow-cosine.vitest.ts` for schema idempotence, scan-time embed/skip, cosine fixtures, and the live-field shadow invariant.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Delivered in the existing TypeScript surfaces without changing scorer weights or the public recommendation shape. The active embedding factory API in this checkout is `createEmbeddingsProvider()` plus `embedDocument()` / `embedQuery()`, so the implementation uses that current provider contract rather than the stale prompt wording that described `resolveProvider()` as returning an embed-capable provider.

`npx tsc --build` rebuilt `dist`; `dist/skill_advisor/lib/scorer/lanes/semantic-shadow.js` contains `cosineSimilarity`, `loadSkillEmbeddings`, and `cosine:` evidence generation.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## KEY DECISIONS

| Decision | Why |
|----------|-----|
| Keep the lane shadow-only this phase | Decouple plumbing risk from behavior-change risk. Sibling phase 002 promotes after ablation sweep. |
| Cache vectors in `skill-graph.sqlite` | Skill-graph is already the canonical store for skill data; avoids cross-DB joins. |
| Use `factory.ts:resolveProvider()` cascade | Reuse the live embedding provider chain (llama-cpp default, hf-local fallback) rather than introducing a second pipeline. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Gate | Status |
|------|--------|
| Strict spec validation | Pass |
| Typecheck (`npm run typecheck`) | Pass |
| Vitest new cosine lane test | Pass — 4 tests |
| Vitest skill advisor suite (`vitest run mcp_server/skill_advisor`) | Fails one existing compat test: forced-local Python bridge now returns `ok` instead of expected `fail_open` |
| Dist rebuild (`npx tsc --build`) | Pass |
| Shadow-only behavior check | Pass — `recommendedSkill` and `confidence` unchanged against disabled semantic lane |
| Generated dist check | Pass — cosine logic present in `dist/skill_advisor/lib/scorer/lanes/semantic-shadow.js` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Cold-start latency**: the first scan after migration must re-embed every skill. ~6ms each at ~20 skills = ~120ms one-time.
2. **Shadow-only**: this phase does not change recommendation output. The full optimization is the two-phase pair (001 + 002).
3. **Provider dependency**: requires the local Gemma provider (017 default flip + 018 auto-migration) to be functional. Already verified live on this machine.
<!-- /ANCHOR:limitations -->
