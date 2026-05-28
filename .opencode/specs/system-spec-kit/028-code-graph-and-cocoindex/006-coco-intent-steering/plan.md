---
title: "Plan — Phase 007 Coco-Index Intent Steering + Bounded Query Expansion"
description: "Technical plan: 4 sub-phases covering intent classifier (Python), query expander integration, advisor first-action hint (TypeScript), telemetry + tests + docs. Risk matrix + dependency graph + success metrics."
trigger_phrases:
  - "027 phase 007 plan"
  - "coco intent steering plan"
importance_tier: "important"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/014-coco-intent-steering"
    last_updated_at: "2026-05-09T11:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored plan.md"
    next_safe_action: "Begin Sub-Phase 1 (intent classifier)"
    blockers: []
    key_files: ["spec.md", "plan.md"]
    completion_pct: 0
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.0 -->
# Plan: Coco-Index Intent Steering + Bounded Query Expansion

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## SUMMARY

Implement bounded, transparent, default-off intent classification + query expansion in `mcp-coco-index`, plus an advisor first-action hint for code-location/concept-search intents. Cross-language change (Python + TypeScript). Four sub-phases: classifier → expander → advisor hint → tests/telemetry/docs. ~250-350 production LOC total.

---

<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## QUALITY GATES

- Strict spec validation passes (`bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet> --strict` exits 0).
- All P0 checklist items green.
- All ADR commitments upheld with file:line evidence in `implementation-summary.md`.
- Phase-006 eval gate documented (when applicable for active-mode promotion).
<!-- /ANCHOR:quality-gates -->

---


<!-- ANCHOR:technical-context -->
## TECHNICAL CONTEXT

### Current state (verified file:line)
- `mcp_server/cocoindex_code/query.py:267-323` — single-query embed + KNN + dedup path.
- `mcp_server/cocoindex_code/query.py:40-59` — `_has_implementation_intent()` keyword precedent (narrow: implementation, function, handler, class, callers, definition of).
- `mcp_server/cocoindex_code/query.py:177-223` — `_ranked_result()` rerank insertion point (path-class boosts ±0.05, canonical-resource +0.10).
- `mcp_server/cocoindex_code/indexer.py:53-91` — `classify_path()` taxonomy (vendor, generated, spec_research, tests, docs, implementation).
- `mcp_server/cocoindex_code/server.py:141-150` — MCP `search` tool entry forwarding (no intent/expansion fields).
- `mcp_server/cocoindex_code/protocol.py:21-28` — IPC `SearchRequest` schema.
- `mcp_server/skill_advisor/lib/render.ts:124-158` — advisor brief renderer + threshold gates.
- `mcp_server/skill_advisor/lib/scorer/lanes/{lexical,explicit}.ts` — coco-relevant scorer signals (already exist).

### Adjacent precedents
- Phase-009 (RQ-A3) plans an active feedback rerank loop using `ccc_feedback` JSONL — this phase's `intent` field will become the cache key for Phase-009's reweight table (soft dep).
- Phase 005 plans a "MUST invoke FIRST" advisor mandate — REQ-009 hint integrates with that renderer surface.
- Phase 006 plans an eval harness — provides the gate for default-on promotion.
<!-- /ANCHOR:technical-context -->

---

<!-- ANCHOR:architecture -->
## ARCHITECTURE

```
User query
  │
  ▼
┌─────────────────────────────────────────────────────────┐
│ Sub-Phase 2: query_codebase() in query.py:267           │
│                                                          │
│   1. exact_intent_suppression(query)                    │
│      ├─ quoted strings / regex / file paths / IDs       │
│      └─ if suppressed → single-embedding path           │
│                                                          │
│   2. intent = intent_classifier.classify(query)         │
│      └─ returns {intent: str, confidence: float}        │
│                                                          │
│   3. sub_queries = expand(query, intent, max=2)         │
│                                                          │
│   4. for q in [original, *sub_queries]:                 │
│      ├─ embed(q)                  ← REQ-002 cap of 3    │
│      ├─ knn(fetch_k=unique_k*4)   ← REQ-003 budget      │
│      └─ collect rows                                    │
│                                                          │
│   5. _dedup_and_rank_rows(all_rows)                     │
│      └─ existing path; intent priors apply (REQ-008)    │
│                                                          │
│   6. emit rankingSignals (REQ-005, REQ-007)             │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
                    QueryResult[]
```

Sub-Phase 3 is decoupled — runs in TypeScript advisor renderer. Connects via Phase-005 mandate brief OR feature-flag standalone fallback.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## IMPLEMENTATION PHASES

### Sub-Phase 1 — Intent Classifier (~80-110 LOC + 30 fixtures)

**Files (created):**
- `mcp-coco-index/mcp_server/cocoindex_code/intent_classifier.py` — Rule-based classifier emitting `(intent, confidence)`.
- `mcp-coco-index/tests/test_intent_classifier.py` — 30+ query fixtures.

**Approach:**
- Reuse precedent from `query.py:40-59` `_has_implementation_intent()`.
- Intent families (v1): `implementation`, `test`, `docs`, `error_handling`, `general`.
- Confidence: weighted keyword overlap; threshold 0.5 for "high confidence" intent.
- Pure function — no I/O, no state.

**Acceptance:**
- 30+ fixtures span all intent families + edge cases (empty, mixed-intent, ambiguous).
- Fixture precision ≥ 0.85 on labeled set.

### Sub-Phase 2 — Query Expander Integration (~100-140 LOC + tests)

**Files (modified):**
- `mcp-coco-index/mcp_server/cocoindex_code/query.py` — Add expansion shim before line 293; cap enforcement; exact-intent suppression heuristics.
- `mcp-coco-index/mcp_server/cocoindex_code/schema.py` — Add `rankingSignals` fields if missing (verify against existing).

**Files (created):**
- `mcp-coco-index/tests/test_query_expansion.py` — End-to-end expansion path: cap enforcement, exact-intent suppression, telemetry shape, dedup correctness.

**Approach:**
- Suppression heuristics: regex `["'`]`, `^[\^]`, `\.\*`, file path indicators (`/`, `.ts`, `.py`, etc.), exact identifier (CamelCase or `obj.method`).
- Sub-query generation: per-intent template family. e.g.:
  - `error_handling` → original + `["exception handling", "try-catch fallback"]`.
  - `test` → original + `["test fixture", "unit test for"]`.
  - `docs` → original + `["documentation for"]`.
- Per-sub-query fetch budget = existing `fetch_k = unique_k * 4`.
- Combined results pass through existing `_dedup_and_rank_rows()` unchanged.

**Acceptance:**
- 3-embedding ceiling enforced (assertion failure on >3 embed calls).
- Suppression heuristics match expected reasons in fixtures.
- Telemetry envelope populated.

### Sub-Phase 3 — Advisor First-Action Hint (~30-50 LOC + tests)

**Files (modified):**
- `mcp_server/skill_advisor/lib/render.ts` — Add hint emission when `mcp-coco-index` ranks top + intent is concept/code-location.

**Files (created):**
- `mcp_server/__tests__/skill_advisor/render-coco-hint.vitest.ts` — Hint rendering tests; standalone-fallback test.

**Approach:**
- When `topLabel === 'mcp-coco-index'` AND `passes_threshold === true` AND query intent (from classifier) is in `{implementation, error_handling}`:
  - Emit hint string: "semantic search FIRST for intent/code-location queries; grep after for exact verification."
- Soft dep on Phase 005:
  - If 004 shipped → integrate hint with mandate brief.
  - If 004 NOT shipped → emit behind feature flag `SPECKIT_COCOINDEX_FIRST_ACTION_HINT=1` (default off) so the hint can ship independently.

**Acceptance:**
- Hint renders correctly for top-ranked coco + concept intent.
- Standalone fallback works without Phase 005 integration.
- Advisor brief still passes existing render tests.

### Sub-Phase 4 — Telemetry + Tests + Docs (~60-100 LOC)

**Files (modified):**
- `mcp_server/lib/search/cocoindex-calibration.ts` — Telemetry envelope additions.
- `mcp_server/ENV_REFERENCE.md` — Document `SPECKIT_COCOINDEX_INTENT_EXPAND` + `SPECKIT_COCOINDEX_FIRST_ACTION_HINT`.
- `mcp-coco-index/SKILL.md` — Document expansion behavior + opt-out.
- `mcp-coco-index/references/search_patterns.md` — Update with expansion-active behavior.

**Acceptance:**
- Telemetry signals appear in calibration envelope.
- Docs cover both flags.
- Latency benchmark < 2× single-query baseline.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## TESTING STRATEGY

- Unit tests per sub-phase (vitest TypeScript / pytest Python).
- Integration tests for cross-component code paths.
- Diff tests for backward-compat (flag-off output bit-identical to current).
- Phase-006 paired comparison harness for active-mode promotion gating.
- Per-checklist verification commands for repeatable green-field checks.
<!-- /ANCHOR:testing -->

---


---

<!-- ANCHOR:dependencies -->
## DEPENDENCIES

### Hard preconditions
- **Phase 001 (complete CocoIndex MCP fork)** — Python `mcp-coco-index` changes must target the owned v0.2.33 wrapper baseline, not the previous partial 0.2.3 soft fork.

### Soft preconditions
- **Phase 005 (skill-advisor first-action mandate)** — REQ-009 advisor hint integrates with Phase 005's mandate brief. Standalone fallback works without Phase 005.

### Internal sub-phase order
- Sub-Phase 1 (classifier) → Sub-Phase 2 (expander) — expander imports classifier.
- Sub-Phase 3 (advisor hint) is independent of 1+2 and can run in parallel.
- Sub-Phase 4 (tests+docs+telemetry) depends on 1+2+3 completion.

### Downstream consumers
- **Phase 009** (feedback reducers) — reweight table will key on `(intent_tag, path_class)`; intent_tag comes from this phase's classifier.
- **Phase 011** (coco-memory context extras) — example bank may query intent for similar-prior-query lookup.
- **A2/A5 active fusion** (deferred) — fusion stage may consume intent for role/layer matching when Phase 002 ships.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:risk-matrix -->
## RISK MATRIX

| ID | Risk | Severity | Likelihood | Mitigation | Verification |
|----|------|----------|------------|------------|--------------|
| R-006-01 | Precision loss from over-expansion | P1 | Med | REQ-004 exact-intent suppression + REQ-002 3-embedding cap + Phase-006 eval before default-on | Phase-006 paired comparison vs. baseline |
| R-006-02 | Embedding cost increase | P1 | High (when active) | 3-embedding ceiling caps fanout to ≤3× baseline | Latency benchmark + cost telemetry |
| R-006-03 | Advisor hint coupling to Phase 005 | P2 | Med | Standalone fallback flag (REQ-009) | Test: render-coco-hint.vitest.ts standalone path |
| R-006-04 | Sub-query suppresses correct original-query results | P1 | Low | All sub-query rows merged via existing `_dedup_and_rank_rows()`; semantic-distance dominance preserved | Unit test: original-query rows always present in output when score ≥ threshold |
| R-006-05 | Telemetry envelope explosion | P2 | Low | New fields scoped to expansion-active path; <200B per response | Snapshot test on envelope size |
| R-006-06 | Classifier rule maintenance burden | P2 | Med | Pure-function design; 30+ fixtures pin behavior; LLM-classifier follow-on if rules ceiling | Fixture precision tracking |
<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:success-metrics -->
## SUCCESS METRICS

| Metric | Target | Measurement |
|--------|--------|-------------|
| Classifier precision on fixture set | ≥ 0.85 | `pytest test_intent_classifier.py` |
| 3-embedding ceiling enforcement | 100% | Assertion failures on >3 calls |
| Suppression heuristic coverage | All 5 cases (quoted/regex/path/ID/empty) | Fixture matrix in `test_query_expansion.py` |
| Latency overhead p50 | < 100ms | Benchmark on 50-query fixture |
| Telemetry envelope additions present | All 4 fields populated | Snapshot test on calibration envelope |
| Advisor hint renders correctly (Phase-005 + standalone) | Both paths green | `render-coco-hint.vitest.ts` |
| Phase-006 eval lift (post-implementation) | Recall improvement on labeled task set | Phase-006 harness paired comparison |
<!-- /ANCHOR:success-metrics -->

---

<!-- ANCHOR:rollback -->
## ROLLBACK PLAN

If active expansion produces precision regressions in Phase-006 eval:
1. Set `SPECKIT_COCOINDEX_INTENT_EXPAND=0` system-wide → reverts to today's behavior.
2. Capture failing query patterns → tune classifier rules OR exact-intent suppression heuristics.
3. Re-run Phase-006 eval → re-promote to default-on only after lift confirmed.

Rollback is per-flag and reversible — no schema migrations, no embedding regeneration, no data loss.
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

See sub-phase ordering in `tasks.md` task dependency diagrams. Hard-blocking dependencies (e.g. Sub-Phase 1 → Sub-Phase 4 in Phase 009) are explicit in the dep diagram.
<!-- /ANCHOR:critical-path -->

<!-- ANCHOR:milestones -->
## L3: MILESTONES

- **M1**: Sub-Phase 1 complete (foundational schema/precondition/extraction).
- **M2..MN**: Each subsequent sub-phase complete per `tasks.md` group.
- **MFinal**: All checklist items green; implementation-summary filled; Phase-006 eval gate ready (when applicable).
<!-- /ANCHOR:milestones -->
