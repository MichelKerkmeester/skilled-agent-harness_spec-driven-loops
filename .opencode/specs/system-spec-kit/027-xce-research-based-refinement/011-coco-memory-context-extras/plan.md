---
title: "Plan — Phase 011 Coco-Memory Context Extras"
description: "Technical plan: 5 sub-phases bundling RQ-A4 (coco exemplars) + RQ-B2 (memory curator) presentation features."
trigger_phrases:
  - "027 phase 011 plan"
importance_tier: "important"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/011-coco-memory-context-extras"
    last_updated_at: "2026-05-09T11:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored plan.md"
    next_safe_action: "Begin Sub-Phase 1 (coco example bank schema + capture)"
    blockers: []
    key_files: ["spec.md", "plan.md"]
    completion_pct: 0
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.0 -->
# Plan: Coco-Memory Context Extras (Presentation-Layer Features)

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## SUMMARY

Two presentation-layer features in one packet: coco few-shot exemplars (RQ-A4) + memory LLM-curated context packaging (RQ-B2). Both default-off + shadow-first + Phase-006 lift required for active mode. Neither alters ranking scores or canonical result ordering. ~500-800 production LOC + ~340-570 tests across 5 sub-phases.

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

**Coco side (RQ-A4):**
- `mcp-coco-index/mcp_server/cocoindex_code/query.py:267-323` — single-shot query path.
- `mcp-coco-index/mcp_server/cocoindex_code/schema.py:8-21` — `CodeChunk` shape.
- `mcp-coco-index/mcp_server/cocoindex_code/schema.py:24-36` — `QueryResult` shape (file, language, content, line range, score, raw_score, path_class, rankingSignals).
- `mcp-coco-index/mcp_server/cocoindex_code/indexer.py:308-326` — `code_chunks_vec` mount.
- `mcp_server/code_graph/handlers/ccc-feedback.ts:11-60` — JSONL writer.
- `mcp_server/schemas/tool-input-schemas.ts:611-616` — `cccFeedbackSchema` (REQ-008 schema extension target).

**Memory side (RQ-B2):**
- `mcp_server/handlers/memory-context.ts:953-1808` — `memory_context` strategy + intent routing.
- `mcp_server/handlers/memory-search.ts:900-1625` — V2 pipeline + caching + feedback logging.
- `mcp_server/handlers/memory-search.ts:900-950` — caller `limit` flow (REQ-012 budget split target).
- `mcp_server/lib/search/pipeline/README.md:33-40` — pipeline contract.
- `mcp_server/lib/search/pipeline/stage4-filter.ts:6-19, 128-317` — Stage 4 ordering immutability + final cap (REQ-010, REQ-015 binding).
- `mcp_server/lib/search/profile-formatters.ts:4-21, 73-119` — quick/research/resume/debug profiles.
- `mcp_server/lib/search/llm-cache.ts:4-127` — LLM cache TTL/LRU pattern (REQ-014 extension target).
- `mcp_server/lib/search/llm-reformulation.ts:321-371` — LLM call + cache + fail-open precedent.
- `mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1140-1224` — LLM precedent in pipeline.
- `mcp_server/lib/search/causal-boost.ts:9-784` — causal-chain context (feeds packaging plan).

### Adjacent precedents
- LLM reformulation (`llm-reformulation.ts`) is the canonical pattern for feature-flagged + cached + fail-open LLM use.
- LLM cache (`llm-cache.ts`) ships TTL + LRU; extending with `mode: 'context_curation'` is straightforward.
<!-- /ANCHOR:technical-context -->

---

<!-- ANCHOR:architecture -->
## ARCHITECTURE

```
                          ┌──────────────────────────┐
                          │  Coco query (Sub-Phase 1+2) │
                          │  query.py:267-323         │
                          └──────────────────────────┘
                                     │
                                     ▼
              ┌──────────────────────────────────────────┐
              │  exemplar_lookup(query_embedding)        │
              │  → KNN over coco_query_examples_vec      │
              │  → top-3 above similarity 0.80           │
              │  → reconcile (file/range/hash checks)    │
              └──────────────────────────────────────────┘
                                     │
                                     ▼
                          response = {
                            results: [...],            ← unchanged ranking
                            exemplars: [...]           ← NEW separate group
                          }


                          ┌──────────────────────────┐
                          │  Memory pipeline           │
                          │  Stages 1-4 (existing)    │
                          └──────────────────────────┘
                                     │
                                     ▼
                          retrievalCandidateLimit ← new
                          presentationLimit ← new
                          (budget split — Sub-Phase 3)
                                     │
                                     ▼
              ┌──────────────────────────────────────────┐
              │  context-curator.ts (Sub-Phase 3+4)      │
              │  if SPECKIT_CONTEXT_CURATOR=true:        │
              │    - check llm-cache (extended)          │
              │    - on miss: prompt LLM with candidates │
              │    - validate JSON schema                │
              │    - return packaging plan               │
              │  on timeout/error: deterministic only    │
              └──────────────────────────────────────────┘
                                     │
                                     ▼
                          response = {
                            data: {
                              results: [...],          ← Stage 4 ordering preserved
                              curatedContext: {...}   ← NEW packaging plan
                            }
                          }
```

What's NOT changed:
- Ranking scores
- Canonical result ordering
- Stage 4 immutability
- Existing profiles (quick/research/resume/debug)
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## IMPLEMENTATION PHASES

### Sub-Phase 1 — Coco Example Bank Schema + Capture (~150-220 LOC + tests)

**Files (created):**
- `mcp-coco-index/mcp_server/cocoindex_code/example_bank_schema.py` — Schema definition + migration.
- `mcp-coco-index/mcp_server/cocoindex_code/example_bank.py` — Capture + maintenance helpers.
- `mcp-coco-index/tests/test_example_bank.py` — Capture + reconciliation tests.

**Files (modified):**
- `mcp-coco-index/mcp_server/cocoindex_code/protocol.py` — Possibly extend `ccc_feedback` schema with optional fields (per ADR-002).
- `mcp_server/schemas/tool-input-schemas.ts:611-616` — Same schema extension on TS side.
- `mcp_server/code_graph/handlers/ccc-feedback.ts:11-60` — Capture trigger on `helpful`/`partial` ratings.

**Approach:**
- Schema:
  ```sql
  CREATE VIRTUAL TABLE coco_query_examples_vec USING vec0(
    query_embedding float[<dim>],
    query_hash TEXT,
    result_file TEXT,
    source_realpath TEXT,
    content_hash TEXT,
    path_class TEXT,
    start_line INTEGER,
    end_line INTEGER,
    validation_source TEXT,
    validated_at_ms INTEGER,
    expires_at_ms INTEGER
  );
  ```
- Capture: when `ccc_feedback({rating: 'helpful' | 'partial', resultFile: ..., ...})` fires, generate query embedding (cache via existing pipeline), insert example row with TTL.
- Privacy: NO comment text; aggregate identity-only metadata.
- ADR-002 decision: extend `ccc_feedback` schema OR add `ccc_example_positive` narrow writer.

### Sub-Phase 2 — Coco Exemplar Retrieval + Maintenance (~150-200 LOC + tests)

**Files (created):**
- `mcp-coco-index/mcp_server/cocoindex_code/exemplar_lookup.py` — KNN + reconciliation.
- `mcp-coco-index/tests/test_exemplar_reconciliation.py` — Stale-hit reconciliation.
- `mcp-coco-index/tests/test_examples_clear.py` — Maintenance op test.

**Files (modified):**
- `mcp-coco-index/mcp_server/cocoindex_code/query.py` — After `_dedup_and_rank_rows()` (line 317-323), if flag enabled, call `exemplar_lookup` and add to response under `exemplars` key.
- `mcp-coco-index/mcp_server/cocoindex_code/server.py:141-150` — Register `ccc_examples_clear` MCP tool.
- `mcp-coco-index/mcp_server/cocoindex_code/protocol.py` — Add `exemplars` field to query response shape.

**Approach:**
- KNN: `vec0` cosine search over `query_embedding`; top-3 ≥ 0.80 similarity.
- Reconciliation: at query time, verify `result_file` exists, line range valid, `content_hash` matches `code_chunks_vec`. Suppress mismatches.
- Periodic purge: maintenance op deletes stale rows AND TTL-expired rows.
- Cap enforcement: on insert, if at 2000 rows, evict oldest by `validated_at_ms`.

### Sub-Phase 3 — Memory Context-Curator Integration Seam (~100-180 LOC + tests)

**Files (created):**
- `mcp_server/lib/search/context-curator.ts` — Curator integration seam (NOT prompt logic — that's Sub-Phase 4).
- `mcp_server/__tests__/search/budget-split.vitest.ts` — Budget split tests.

**Files (modified):**
- `mcp_server/handlers/memory-search.ts` — Add `retrievalCandidateLimit` + `presentationLimit` + `curationTokenBudget` knobs (lines 900-950).
- `mcp_server/handlers/memory-context.ts` — Wire curator hook between retrieval and `formatSearchResults`.

**Approach:**
- Budget split:
  - `retrievalCandidateLimit` (default 100-300) — pipeline overfetch for curator.
  - `presentationLimit` (= existing `limit`) — final cap for `data.results`.
  - `curationTokenBudget` (computed from `retrievalCandidateLimit` × avg-row-size).
- Hook point: after `memory-search.ts:1107-1319` (deterministic pipeline result), before `formatSearchResults` (line 1255).
- Stage 4 immutability preserved: curator output goes into `data.curatedContext`, never `data.results`.
- Deterministic fallback: when curator unavailable / disabled / fails, return original pipeline result.

### Sub-Phase 4 — Curator Prompt + Schema + Parser (~120-200 LOC + tests)

**Files (created):**
- `mcp_server/lib/search/context-curator-prompt.ts` — LLM prompt template + schema.
- `mcp_server/__tests__/search/context-curator.vitest.ts` — Curator integration tests.
- `mcp_server/__tests__/search/curator-fallback.vitest.ts` — Fallback path tests.
- `mcp_server/__tests__/search/curator-schema-validation.vitest.ts` — Strict JSON validation.

**Files (modified):**
- `mcp_server/lib/search/llm-cache.ts:21-27` — Add `mode: 'context_curation'` to `LlmCacheKey` shape.

**Approach:**
- Prompt template:
  - Inputs: query intent + candidate set summary (IDs + tier + content snippets).
  - Output: `{causalChain, tierExemplars, directEvidence, supportingContext, omittedButAvailable}`.
- Strict JSON schema validation: AJV or similar; reject invented IDs.
- Cache extension: `mode: 'context_curation'`, key by `(candidateSetHash, intent, profile, version, packagePolicy)`. `candidateSetHash` = ordered IDs + score/provenance version.
- Hard timeout 1500-2500ms via `Promise.race(llmCall, timeout)`.
- Fallback validator: cache hits must still pass schema check.

### Sub-Phase 5 — Tests + Telemetry + Docs (~80-150 LOC)

**Files (modified):**
- `mcp_server/handlers/memory-context.ts` — Telemetry events for curator (cache hit/miss, timeout, parse failure, etc.).
- `mcp_server/lib/search/llm-cache.ts` — Cache hit telemetry.
- `mcp_server/ENV_REFERENCE.md` — Document `SPECKIT_COCOINDEX_EXEMPLARS_*` + `SPECKIT_CONTEXT_CURATOR_*` flag families.
- `.opencode/skills/mcp-coco-index/SKILL.md` — Document exemplar feature + opt-out.
- `.opencode/skills/system-spec-kit/SKILL.md` — Document curator feature + opt-out.

**Acceptance:**
- All flag families documented.
- Telemetry events surfaced in eval logger.
- Phase-006 eval gating documented.
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
- Coco example-bank work: Phase 001 complete CocoIndex MCP fork must land first, so schema/capture/retrieval changes target the owned v0.2.33 wrapper baseline.
- Memory curator work: none beyond the current memory retrieval pipeline.

### Soft preconditions
- **Phase 008** (memory semantic triggers) — better trigger candidates → better curator candidate set.
- **Phase 009 Consumer A** — `ccc_feedback` reducer signal quality affects exemplar capture quality.
- **Phase 006** (adoption eval harness) — for active-mode promotion gate (both features).

### Internal sub-phase order
- Sub-Phase 1 (schema + capture) → Sub-Phase 2 (retrieval + maintenance).
- Sub-Phase 3 (memory budget split + seam) → Sub-Phase 4 (prompt + schema + parser).
- Sub-Phase 5 (telemetry + docs) depends on 1-4 completion.

### Downstream consumers
- None — Phase 011 is a leaf phase in the 027 pt-03 series.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:risk-matrix -->
## RISK MATRIX

| ID | Risk | Severity | Likelihood | Mitigation | Verification |
|----|------|----------|------------|------------|--------------|
| R-010-01 | LLM curator mutates Stage 4 ordering | **P0** | Med | Immutability test (REQ-015) + ADR-004 binding | Snapshot test on `data.results` ordering |
| R-010-02 | Coco exemplar bank conflated with ranking | P1 | Med | Separate response group (REQ-001); snapshot tests | Snapshot test on `data.results` shape |
| R-010-03 | LLM nondeterminism affects retrieval trust | P1 | Med | Default-off + strict timeout + JSON validation + Phase-006 lift | Promotion gate test |
| R-010-04 | Stale exemplar references | P1 | High over time | TTL + reconciliation (REQ-004) + bounded growth (REQ-003) | Reconciliation test for each stale condition |
| R-010-05 | Curator latency overflow | P1 | Med | Hard timeout (REQ-013) + deterministic fallback | Mock-timeout test |
| R-010-06 | Cache key collision (curator) | P2 | Low | Candidate-set hash uses ordered IDs + score/provenance version | Cache key shape test |
| R-010-07 | Privacy: comment text leakage | P2 | Low | Aggregate identity-only schema (REQ-006) | Schema review + grep |
| R-010-08 | Coco vec0 schema migration breaks Coco DB | P1 | Low | Forward-only ADD; backward-compatible reads; migration test | Migration test on existing DB |
<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:success-metrics -->
## SUCCESS METRICS

| Metric | Target | Measurement |
|--------|--------|-------------|
| Coco `data.results` ordering parity | Bit-identical pre/post exemplar feature | Diff test |
| Memory `data.results` ordering parity | Bit-identical pre/post curator | Diff test |
| Stale exemplar reconciliation coverage | All 3 conditions (file/range/hash) | Reconciliation tests |
| Curator deterministic fallback coverage | All 4 failure modes (timeout/parse/invalid-id/no-LLM) | Fallback tests |
| Both feature flags default-off + flag-off identical to current | 100% | Flag-off diff tests |
| Schema validation rejects invented IDs | 100% | Schema validation test |
| Cache hit rate (curator, post-warmup) | ≥ 30% | Telemetry observation post-deployment |
| Phase-006 lift (when shipped, both features) | Task success ≥ baseline; cited-source correctness ≥ baseline | Phase-006 paired comparison |
<!-- /ANCHOR:success-metrics -->

---

<!-- ANCHOR:rollback -->
## ROLLBACK PLAN

**Coco exemplars:**
- Set `SPECKIT_COCOINDEX_EXEMPLARS=false` → no `exemplars` field in response; current behavior.
- Optional: `ccc_examples_clear` removes accumulated example data.
- Schema migration is forward-only; can stay in place even if feature disabled.

**Memory curator:**
- Set `SPECKIT_CONTEXT_CURATOR=false` → no `data.curatedContext` field; current behavior.
- Cache extension is additive; no rollback risk.
- Budget split knobs default to current behavior when curator off.

Both features fully reversible per-flag; no schema rollback needed.
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
