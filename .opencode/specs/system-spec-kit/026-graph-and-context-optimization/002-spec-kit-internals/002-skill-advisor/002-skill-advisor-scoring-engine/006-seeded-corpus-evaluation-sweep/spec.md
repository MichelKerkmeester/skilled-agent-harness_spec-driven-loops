---
title: "Feature Specification: Seed cosine embeddings into the sweep test and produce a real weight recommendation"
description: "Fix the 015/003 test-env embedding gap so the lane-weight sweep can finally measure cosine-lane effects, then output a numbers-driven weight recommendation."
trigger_phrases:
  - "corpus seeded sweep"
  - "advisor weight recommendation"
  - "cosine embedding seed"
  - "intent prompt sweep real"
importance_tier: "important"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/006-seeded-corpus-evaluation-sweep"
    last_updated_at: "2026-05-14T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded packet"
    next_safe_action: "Dispatch codex"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000001504"
      session_id: "004-corpus-seeded-sweep"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Use the live local Gemma provider to generate fixture embeddings ONCE at test setup."
      - "Cache the seeded vectors in a temp sqlite or in-memory map so the sweep is reproducible."
      - "Recommendation lands as advisory only; lane-registry.ts stays at 0.05 unless a separate packet bumps it."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: Seed cosine embeddings into the sweep test and produce a real weight recommendation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Planned |
| **Created** | 2026-05-14 |
| **Branch** | `004-corpus-seeded-sweep` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 015/003 shipped the lane-weight sweep harness, the type extension, and a 24-prompt corpus, but the sweep run produced byte-identical numbers across all 7 candidate vectors (including V6-cosine-dominant at semantic=0.30). Root cause documented in 015/003 implementation-summary.md Known Limitation #2: the sweep test runs against `createFixtureProjection(...)` which does NOT seed the `embedding` column that the cosine lane reads via `loadSkillEmbeddings()`. So semantic_shadow contributed zero to every vector regardless of weight, and the sweep is currently a regression guard on the four non-semantic lanes only.

### Purpose
Fix the gap. Generate real Gemma embeddings for each skill in the fixture projection at test setup (one-time, cached), wire them so the cosine lane sees populated vectors when running through `runLaneWeightSweep`, then re-run the same 7-vector sweep and emit a numbers-driven recommendation. The output of this packet drives whether a future packet bumps `lane-registry.ts` away from 0.05.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add a test setup helper that, on first call, embeds each fixture skill's description through the live `createEmbeddingsProvider()` and persists the vectors into a temp `skill-graph.sqlite` (or memoized in-memory map keyed by skill id).
- Wire the helper into the sweep test so `loadSkillEmbeddings()` returns the seeded vectors during the run.
- Re-author or extend the corpus if the sweep reveals coverage gaps; default is to keep the existing 24 entries.
- Re-run the sweep against the same 7 candidate vectors from 015/003.
- Emit fresh markdown report at this packet's `research/sweep-results.md`.
- Land a real recommendation: stay at 0.05 OR raise to a specific value, justified by accuracy deltas.

### Out of Scope
- Modifying `lane-registry.ts`. Recommendation is research output; promotion (if any) is a separate packet.
- Modifying the cosine lane math from 015/001.
- Modifying the override merge from 015/003.
- Tuning thresholds (`confidenceThreshold` / `uncertaintyThreshold`).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance |
|----|-------------|------------|
| REQ-001 | Test setup helper embeds each fixture skill's description through the active provider. | Setup runs once per Vitest file; vectors persisted/cached so the sweep can read them. |
| REQ-002 | The cosine lane sees populated vectors during the sweep. | Sweep produces non-zero `semantic_shadow_rawScore` for at least one prompt, verified via debug logging in the test. |
| REQ-003 | Re-run sweep against the same 7 vectors from 015/003. | All 7 vectors produce per-vector summaries with accuracy + flippedFromBaseline counts. |
| REQ-004 | Result variance is non-trivial. | At least one vector differs from V0 baseline in `intentDescribedAccuracy` OR `flippedFromBaseline > 0`. If variance is still zero, the test fails with a diagnostic that the seeded embeddings are still not flowing through. |
| REQ-005 | Recommendation grounded in numbers. | implementation-summary.md cites specific accuracy deltas to justify the recommendation. |
| REQ-006 | Sweep test runs in under 60 seconds (allow more than 015/003 because of one-time embedding setup). | Vitest reports duration; if over 60s, log a warning. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Strict spec validation passes.
- **SC-002**: `npm run typecheck` passes from `mcp_server/`.
- **SC-003**: Sweep produces variance across the 7 vectors (REQ-004).
- **SC-004**: Recommendation in implementation-summary.md cites specific numbers.
- **SC-005**: `lane-registry.ts` stays unchanged.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Provider unavailable during test (no Gemma daemon, no network) | Test cannot embed and falls back to 015/003-equivalent zero result | If provider unavailable: skip the sweep test with `it.skipIf(!providerAvailable)` and document in the markdown report; do NOT fail the suite |
| Risk | Embedding latency makes Vitest run slow | Test exceeds 60s budget | Cache vectors after first generation in a sqlite file under `tests/scorer/fixtures/.embeddings-cache/`; subsequent runs skip the embed call |
| Risk | Recommendation flips a today-correct routing | Suggesting a weight that breaks production behavior | Recommendation is gated on `todayCorrectAccuracy >= baseline` for the chosen vector; if no vector meets that, recommend "stay at 0.05" |
| Dependency | Local Gemma provider working | Cannot embed otherwise | Already verified live in 014 setup-A line; test wraps in skipIf for safety |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None for the dispatcher. Codex resolves these inline:
- Whether to seed via temp sqlite vs in-memory map (both are valid; pick the simpler one)
- Cache invalidation: hash the corpus file + provider model id; bust cache when either changes
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## 8. NON-FUNCTIONAL REQUIREMENTS

| ID | Class | Requirement |
|----|-------|-------------|
| NFR-P01 | Performance | First sweep run with cold cache under 60s; warm cache under 5s. |
| NFR-S01 | Security | Embedding cache contains no secrets; cache file under `.gitignore` if it lives on disk. |
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 9. EDGE CASES

- Provider unavailable: skip sweep, document in markdown report, do not fail suite.
- Cache file corrupt or empty: detect and re-generate.
- Corpus changed but cache is stale: hash-based invalidation re-embeds the affected entries.
- A skill description is empty or trivially short: log a warning, skip embedding for that skill (its cosine score will be zero).
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 10. COMPLEXITY ASSESSMENT

| Aspect | Rating | Note |
|--------|--------|------|
| **LOC estimate** | 200-350 | Mostly the test-setup helper, cache-management, sweep re-run, markdown report |
| **Surface area** | Small | Touches only sweep test infra + new helper; no production code |
| **Risk** | Low | Test-only change; recommendation is advisory |
| **Reversibility** | High | Single-commit revert |
<!-- /ANCHOR:complexity -->
