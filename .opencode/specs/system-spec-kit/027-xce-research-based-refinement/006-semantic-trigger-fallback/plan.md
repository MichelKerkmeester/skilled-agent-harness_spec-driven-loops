---
title: "Plan — Phase 007 Memory Semantic Triggers"
description: "Technical plan: 4 sub-phases covering schema + backfill, semantic matcher, hybrid handler integration, tests + goldens + shadow eval."
trigger_phrases:
  - "027 phase 007 plan"
  - "memory semantic triggers plan"
importance_tier: "important"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/006-semantic-trigger-fallback"
    last_updated_at: "2026-05-09T11:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored plan.md from spec REQ list + pt-03 iteration-006 findings"
    next_safe_action: "Begin Sub-Phase 1 (schema migration + backfill)"
    blockers: []
    key_files: ["spec.md", "plan.md"]
    completion_pct: 0
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.0 -->
# Plan: Semantic Trigger Fallback (Hybrid)

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## SUMMARY

Add an OPTIONAL semantic trigger stage to `memory_match_triggers` as a feature-flagged UNION fallback. Lexical remains primary precision path; semantic adds paraphrase recall using existing Voyage-4 cache. Cognitive activation guards prevent semantic-only hits from masquerading as exact triggers. Four sub-phases: schema+backfill → semantic matcher → hybrid handler → tests+goldens+shadow eval. ~280-430 production LOC + ~180-280 tests.

---

<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## QUALITY GATES

- Strict spec validation passes (`bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet> --strict` exits 0).
- All P0 checklist items green.
- All ADR commitments upheld with file:line evidence in `implementation-summary.md`.
- 028/004-code-graph-adoption-eval eval gate documented (when applicable for active-mode promotion).
<!-- /ANCHOR:quality-gates -->

---


<!-- ANCHOR:technical-context -->
## TECHNICAL CONTEXT

### Current state (verified file:line)
- `mcp_server/lib/parsing/trigger-matcher.ts:201-545, 772-880` — Lexical matching: token/ngram candidate index + boundary regex.
- `mcp_server/lib/parsing/trigger-matcher.ts:132-160` — Latency budget: <30ms PASS / <50ms WARN / 100ms WARN_EXCEEDED.
- `mcp_server/handlers/memory-triggers.ts:155-380` — Handler: scope filtering, eval logging, cognitive activation in working memory + co-activation.
- `mcp_server/lib/cache/embedding-cache.ts:45-215` — Persistent cache keyed by `(content_hash, model_id, dimensions)`; LRU + age eviction, 10000-row cap.
- `mcp_server/lib/embeddings/embedding-pipeline.ts:114-169` — Save-time lookup-or-generate-and-store pattern.
- `mcp_server/lib/embeddings/factory.ts:88-364` — Provider auto-resolution: Voyage with `VOYAGE_API_KEY`, model `voyage-4`, 1024-dim default.
- `mcp_server/lib/search/embedding-expansion.ts:13-218` — Existing semantic broadening precedent (feature-flagged, fail-closed to identity).
- `mcp_server/lib/storage/memory-summaries.ts:25-190` — Local cosine helper + BLOB-to-Float32 conversion pattern.
- `mcp_server/lib/cognitive/{tier-classifier,working-memory,attention-decay,co-activation}.ts` — Activation pipeline that consumes trigger results.

### Adjacent precedents
- Embedding-expansion.ts demonstrates feature-flagged semantic stage with simple-query suppression and fail-closed identity fallback — same pattern reused here.
- Save-time pipeline already does lookup-or-generate; semantic trigger backfill plugs into this pattern.

### XCE source corpus
- `external/README.md:188-199` — Public claim: semantic search vs text matching.
- Pt-01 RQ9 SKIP boundary applies — closed-source PRAT internals not adoptable.
<!-- /ANCHOR:technical-context -->

---

<!-- ANCHOR:architecture -->
## ARCHITECTURE

```
memory_match_triggers(prompt)
  │
  ▼
┌──────────────────────────────────────────────────────────────┐
│ Stage 1: LEXICAL (existing path, unchanged when flag off)     │
│   trigger-matcher.ts:201-545, 749-880                         │
│   → matched: TriggerMatch[]                                   │
│   → strong_command_match: bool                                │
└──────────────────────────────────────────────────────────────┘
  │
  ▼
┌──────────────────────────────────────────────────────────────┐
│ Short-circuit gate:                                           │
│   if SPECKIT_SEMANTIC_TRIGGERS=false → return Stage 1 only    │
│   if strong_command_match (REQ-003) → return Stage 1 only     │
│   if matched.length >= top_k → return Stage 1 only            │
└──────────────────────────────────────────────────────────────┘
  │
  ▼
┌──────────────────────────────────────────────────────────────┐
│ Stage 2: SEMANTIC (gated, feature-flagged)                    │
│   semantic-trigger-matcher.ts (NEW)                           │
│                                                                │
│   1. promptEmbed = embedding_cache.lookup(prompt_hash, ...)   │
│      └─ if miss: embed_now (telemetry: cache_miss_embed)      │
│                                                                │
│   2. for trigger in trigger_embedding_cache:                  │
│      ├─ if embedding_status != 'ready': skip (REQ-011)        │
│      └─ score = cosine(promptEmbed, trigger.embed)            │
│                                                                │
│   3. filter: score >= THRESHOLD (0.84)                        │
│   4. filter: top_score - second_score >= MARGIN (0.04)        │
│   5. cap: top _MAX (3)                                        │
│   6. dedup against Stage 1 results (preserve lexical hits)    │
│                                                                │
│   if MODE=shadow: log only, do NOT activate                   │
│   if MODE=union: merge with Stage 1                           │
└──────────────────────────────────────────────────────────────┘
  │
  ▼
┌──────────────────────────────────────────────────────────────┐
│ Cognitive activation guards (REQ-008)                         │
│   memory-triggers.ts:360-380                                  │
│   for each match:                                             │
│     if matchSource == 'lexical': attention = 1.0              │
│     if matchSource == 'semantic': attention = min(0.85, score)│
└──────────────────────────────────────────────────────────────┘
                           │
                           ▼
                      activation pipeline (working memory + co-activation)
```

Backfill runs OUT OF BAND:
- `memory_index_scan` triggers per-memory backfill of `memory_trigger_embeddings`.
- `memory_save` saves embeddings inline (best-effort).
- Trigger call hot path NEVER embeds.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## IMPLEMENTATION PHASES

### Sub-Phase 1 — Schema + Backfill (~120-160 LOC + tests)

**Files (modified):**
- `mcp_server/lib/storage/vector-index-schema.ts` — Add `memory_trigger_embeddings` table.
- `mcp_server/handlers/memory-index-scan.ts` — Add per-memory trigger embedding backfill.
- `mcp_server/lib/embeddings/embedding-pipeline.ts` — Hook for save-time trigger embedding generation.

**Approach:**
- Schema migration: `CREATE TABLE IF NOT EXISTS memory_trigger_embeddings (memory_id INTEGER NOT NULL, phrase TEXT NOT NULL, phrase_hash TEXT NOT NULL, model_id TEXT NOT NULL, dimensions INTEGER NOT NULL, embedding_status TEXT NOT NULL, updated_at TEXT NOT NULL, PRIMARY KEY (memory_id, phrase_hash))`. Forward-only.
- Embeddings stored in EXISTING `embedding_cache` BLOB store (no new BLOB table).
- Backfill loop: for each memory in scan, for each trigger phrase, compute `phrase_hash`, check cache, generate if missing, mark `embedding_status='ready'`.
- Save-time path: same as backfill but per-memory at save time; non-blocking on Voyage failure (mark `embedding_status='failed'`, retry on next scan).

**Acceptance:**
- Migration test passes (table created cleanly on existing DB).
- Index scan generates embeddings for new triggers.
- Save-time path generates embeddings without blocking save flow.

### Sub-Phase 2 — Semantic Matcher (~140-200 LOC + tests)

**Files (created):**
- `mcp_server/lib/triggers/semantic-trigger-matcher.ts` — Cosine similarity matcher with threshold + margin + max gates.
- `mcp_server/__tests__/triggers/semantic-matcher.vitest.ts` — Unit tests.

**Approach:**
- Reuse `memory-summaries.ts:25-190` cosine + BLOB-to-Float32 conversion pattern.
- In-memory cache of trigger embeddings (loaded on first call; refresh on TTL OR cache invalidation event).
- Pure function: `matchSemanticTriggers(promptEmbed, triggerCache, {threshold, margin, max}) -> SemanticMatch[]`.
- Deterministic ordering (score DESC, then memory_id ASC for ties).

**Acceptance:**
- Cosine math verified against known vectors.
- Threshold + margin + max gates enforced.
- Deterministic output across runs.

### Sub-Phase 3 — Hybrid Handler Integration (~70-110 LOC + tests)

**Files (modified):**
- `mcp_server/handlers/memory-triggers.ts` — Add Stage 2 gate + UNION + activation guards.

**Files (created):**
- `mcp_server/__tests__/triggers/hybrid-handler.vitest.ts` — Integration tests.

**Approach:**
- Add Stage 2 gate after lexical stage (lines ~210-250).
- Strong-command short-circuit: detect `passes_threshold` lexical hit on command-style trigger phrase.
- UNION semantics: lexical hits first, then semantic hits not already in lexical set.
- Activation guards in lines 360-380: `attention = matchSource === 'semantic' ? min(0.85, score) : 1.0`.
- Source-tag every match: `matchSource: 'lexical' | 'semantic'`, `semanticScore?: number`.

**Acceptance:**
- Lexical-only path bit-identical to today's behavior when flag off.
- Lexical-strong → semantic stage skipped (no embed call).
- Lexical-empty + paraphrase → semantic hit returned with reduced activation.
- All scope filtering preserved.

### Sub-Phase 4 — Tests + Goldens + Shadow Eval (~90-160 LOC)

**Files (created):**
- `mcp_server/__tests__/fixtures/trigger-goldens.json` — ~40 phrases × {exact, paraphrase, distractor}.
- `mcp_server/__tests__/triggers/cold-start.vitest.ts` — phrases without embeddings skipped silently.
- `mcp_server/__tests__/triggers/latency-budget.vitest.ts` — 30-50ms PASS / 100ms WARN preserved.
- `mcp_server/__tests__/triggers/threshold-tuning.vitest.ts` — threshold-band distribution verified.

**Files (modified):**
- `mcp_server/ENV_REFERENCE.md` — Document 5 new flags.
- `mcp_server/lib/storage/vector-index-schema.ts` — Document new table in schema header comment.

**Acceptance:**
- Trigger goldens: exact match precision = 1.0; paraphrase recall ≥ 0.7 at threshold 0.84; distractor FP rate ≤ 0.05.
- Latency benchmark passes WARN budget.
- Shadow telemetry events appear in eval logger.
- All 5 flags documented.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## TESTING STRATEGY

- Unit tests per sub-phase (vitest TypeScript / pytest Python).
- Integration tests for cross-component code paths.
- Diff tests for backward-compat (flag-off output bit-identical to current).
- 028/004-code-graph-adoption-eval paired comparison harness for active-mode promotion gating.
- Per-checklist verification commands for repeatable green-field checks.
<!-- /ANCHOR:testing -->

---


---

<!-- ANCHOR:dependencies -->
## DEPENDENCIES

### Hard preconditions
None.

### Soft preconditions
- **028/004-code-graph-adoption-eval** (adoption eval harness) — for threshold tuning runs and recall-lift measurement; not required for spec scaffold or initial implementation.

### Internal sub-phase order
- Sub-Phase 1 (schema + backfill) → Sub-Phase 2 (semantic matcher) → Sub-Phase 3 (hybrid handler) → Sub-Phase 4 (tests + goldens + shadow eval).
- Some Sub-Phase 4 work (goldens fixture, threshold-tuning test scaffolding) can run in parallel with Sub-Phase 1.

### Downstream consumers
- **028/008-coco-memory-context-extras** (coco-memory context extras) — better trigger candidate set improves curator input quality (RQ-B2 soft dep).
- **Phase 008** (feedback reducers) — could consume `matchSource` signals to differentiate lexical vs semantic feedback in the future (not v1).
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:risk-matrix -->
## RISK MATRIX

| ID | Risk | Severity | Likelihood | Mitigation | Verification |
|----|------|----------|------------|------------|--------------|
| R-007-01 | False semantic triggers mis-prioritize cognitive tiers | **P0** | Med | Lexical short-circuit + reduced-activation + source-tagged telemetry + shadow-first | Trigger goldens fixture FP rate ≤ 0.05 |
| R-007-02 | Embedding cost from per-prompt embed | P1 | High when active | Lexical short-circuit on strong matches + threshold gating + cache reuse | Embed call counter in shadow telemetry |
| R-007-03 | Schema migration breaks existing memory DB | P1 | Low | Forward-only ADD; backward-compatible reads; migration test on existing DB fixture | Migration test |
| R-007-04 | Backfill scheduling complexity / inconsistency | P2 | Med | Deferred via index scan; cold-start no-op | Cold-start test |
| R-007-05 | Voyage rate-limit cascade to trigger latency | P1 | Low (out-of-band embed only) | Cache lookup only in hot path; embed at backfill | Trace assertion: no `embed` calls in trigger handler |
| R-007-06 | Threshold tuning drift from production query distribution | P2 | Med | Shadow telemetry collects threshold-band distribution; tune from real data | Threshold-tuning test consumes shadow logs |
| R-007-07 | Lexical regression from handler refactor | **P0** | Low | Diff test: flag-off output bit-identical; existing test suite unchanged | Diff test in CI |
<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:success-metrics -->
## SUCCESS METRICS

| Metric | Target | Measurement |
|--------|--------|-------------|
| Lexical exact-match precision | 1.0 | Trigger goldens fixture |
| Semantic paraphrase recall at threshold 0.84 | ≥ 0.7 | Trigger goldens fixture |
| Semantic distractor false-positive rate | ≤ 0.05 | Trigger goldens fixture |
| Latency p95 with shadow stage active | ≤ 100ms WARN | `latency-budget.vitest.ts` |
| Embed calls per trigger request | 0 (cache lookup only) | Trace assertion |
| Diff test (flag-off vs current) | identical | Snapshot diff in CI |
| 028/004-code-graph-adoption-eval paraphrase task recall lift | ≥ 0.15 over baseline | 028/004-code-graph-adoption-eval paired comparison |
<!-- /ANCHOR:success-metrics -->

---

<!-- ANCHOR:rollback -->
## ROLLBACK PLAN

If active union mode shows unacceptable false-positive rate in production:
1. Set `SPECKIT_SEMANTIC_TRIGGERS=false` system-wide → reverts to lexical-only behavior immediately.
2. Capture failing prompt patterns → tune trigger goldens or threshold.
3. Re-enable in `_MODE=shadow` → measure → re-promote to `union` only after FP rate within tolerance.

Schema migration is forward-only and idempotent; no schema rollback needed (table can stay in place even if feature disabled).
<!-- /ANCHOR:rollback -->

---

<!-- L3 STRUCTURAL APPENDIX -->



<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

See "DEPENDENCIES" section above (hard preconditions, soft preconditions, internal sub-phase order, downstream consumers).
<!-- /ANCHOR:phase-deps -->

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

LOC budget in `spec.md` Section 1 Metadata. Per-sub-phase LOC estimates in "SUB-PHASES" section above. Wall-time estimates in `tasks.md` "TOTAL EFFORT" section.
<!-- /ANCHOR:effort -->

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

See "ROLLBACK PLAN" section above. All flags reversible per-phase; no schema rollback needed for forward-only migrations. Each consumer / sub-phase has its own flag for fine-grained rollback.
<!-- /ANCHOR:enhanced-rollback -->

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

See sub-phase task dependency diagrams in `tasks.md` "TASK DEPENDENCIES" section.
<!-- /ANCHOR:dependency-graph -->

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

See sub-phase ordering in `tasks.md` task dependency diagrams. Hard-blocking dependencies (e.g. Sub-Phase 1 → Sub-Phase 4 in Phase 008) are explicit in the dep diagram.
<!-- /ANCHOR:critical-path -->

<!-- ANCHOR:milestones -->
## L3: MILESTONES

- **M1**: Sub-Phase 1 complete (foundational schema/precondition/extraction).
- **M2..MN**: Each subsequent sub-phase complete per `tasks.md` group.
- **MFinal**: All checklist items green; implementation-summary filled; 028/004-code-graph-adoption-eval eval gate ready (when applicable).
<!-- /ANCHOR:milestones -->
