---
title: "Phase 007 — Coco-Index Intent Steering + Bounded Query Expansion"
description: "ADAPT XCE's intent-steering pattern into mcp-coco-index via (a) rule-based intent classifier shim before query embedding, (b) bounded query expansion (≤3 embeddings, exact-intent suppression), and (c) Phase-005 advisor first-action hint. This now depends on Phase 001's complete CocoIndex MCP fork before modifying the local wrapper. Cross-language change (Python coco-index + TypeScript advisor renderer); feature-flagged default-off; Phase-006 eval gate before active rollout. ~250-350 LOC across intent classifier, query expander, advisor hint, telemetry."
trigger_phrases:
  - "027 phase 007"
  - "coco intent steering"
  - "mcp-coco-index intent classifier"
  - "coco query expansion"
  - "coco advisor first-action hint"
  - "mcp-coco-index intent steering query expansion"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/014-coco-intent-steering"
    last_updated_at: "2026-05-09T11:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Scaffolded 027/007 from pt-03 RQ-A1"
    next_safe_action: "Implement Sub-Phase 1 (intent classifier)"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md", "decision-record.md", "resource-map.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-4-7-2026-05-09-027-007-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Should the MVP intent taxonomy include only implementation/test/docs families, or also error_handling/security/configuration?"
      - "Should expansion telemetry write to ccc_feedback JSONL (Phase-009 dependency) or stay in rankingSignals only?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Coco-Index Intent Steering + Bounded Query Expansion

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

Pt-03 RQ-A1 (verdict ADAPT, see `../research/027-xce-research-pt-03/research.md` §RQ-A1 and `../research/027-xce-research-pt-03/iterations/iteration-001.md`) identifies two transferable XCE teachings for `mcp-coco-index`:

1. **Intent-steering** — XCE's "use first" steering directive (`../external/README.md:101-119`, `../external/steering/CLAUDE.md:5-10`) maps to a Phase-005 advisor first-action hint that surfaces `mcp-coco-index` for code-location and concept-search intents (queries like "find code that does X", "where is the logic for", "how is X implemented").
2. **Query expansion** — XCE's intent-driven multi-query routing maps to a local rule-based shim that turns one user query into a bounded sub-query set (e.g. `"show me error handlers"` → `["exception handling", "try-catch", "error recovery"]`) before embedding.

XCE's closed-source PRAT routing internals are NOT adoptable (per pt-01 RQ9 SKIP boundary). Implementation must be local, evidence-based, and bounded.

**Key Decisions:**
- **Rule-based, NOT LLM-based** intent classifier — preserves the local/offline behavior of `mcp-coco-index`.
- **3-embedding ceiling** — original query + at most 2 sub-queries; per-sub-query fetch capped at existing `fetch_k = unique_k * 4`.
- **Exact-intent suppression** — skip expansion when the query contains exact identifiers, file paths, quoted strings, or regex syntax.
- **Bounded ranking deltas** — path-class intent priors stay at the existing ±0.05 magnitude (semantic distance must remain dominant).
- **Default-off behind `SPECKIT_COCOINDEX_INTENT_EXPAND=0`**; Phase-006 evaluation required before active rollout.
- **Hard dep on Phase 001** — query-expansion work modifies `mcp-coco-index`, so it must land on the complete local `cocoindex-code` fork baseline instead of the old partial fork.
- **Soft dep on Phase 005** — advisor first-action hint integrates with the renderer when Phase 005 ships; standalone fallback works without it.

**Critical Constraints:**
- `query_codebase()` runs in Python; advisor hint integration is TypeScript — keep the two paths decoupled.
- Sub-query fanout MUST stay capped — runaway fanout would multiply embedding calls and degrade precision.
- Every expansion decision MUST surface in `rankingSignals` for transparency.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | **3** (cross-language Python+TypeScript change with feature flag, telemetry contract, hot retrieval path; see `decision-record.md` ADR-001) |
| **Priority** | P1 |
| **Status** | Spec-Scaffolded |
| **Parent Packet** | `027-xce-research-based-refinement` |
| **Source** | `../research/027-xce-research-pt-03/research.md` §RQ-A1; `../research/027-xce-research-pt-03/iterations/iteration-001.md` |
| **Depends on** | `027/001-cocoindex-complete-fork` (hard for Python `mcp-coco-index` changes); `027/005-skill-advisor-first-action-mandate` (soft — advisor wording integration) |
| **LOC budget** | ~250-350 production + ~120-180 tests |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

`mcp-coco-index` today fires when invoked but offers no intent-aware query expansion (`SKILL.md:16-31`, `references/search_patterns.md:28-35`). Users must manually rephrase queries when initial results are weak. The current `query_codebase()` path embeds exactly one query string (`mcp_server/cocoindex_code/query.py:267-323`), runs KNN retrieval, then deduplicates and ranks once via `_dedup_and_rank_rows()`. The MCP tool surface forwards only `query`, `languages`, `paths`, `limit`, `offset` (`mcp_server/cocoindex_code/server.py:141-150`); the IPC `SearchRequest` schema has no intent or expansion fields (`mcp_server/cocoindex_code/protocol.py:21-28`).

Two gaps result:
- **No first-action steering** — the skill advisor doesn't always recommend `mcp-coco-index` for code-location/concept queries that would benefit from semantic search before exact match. XCE's steering files unconditionally direct agents to call XCE first; we can't copy that unconditionally (advisor routing is dynamic) but we can adapt the wording at the renderer level (`mcp_server/skill_advisor/lib/render.ts:124-158`).
- **No paraphrase coverage** — a query like "show me retry logic" misses chunks that talk about "exception handling with backoff" because there's no query expansion. XCE's intent-routing solves this internally (closed-source); we can adapt with a local rule-based classifier + bounded sub-query expander.

**Purpose:** ship a bounded, transparent, default-off intent steering + query expansion layer that catches more relevant chunks for concept queries while preserving the existing precision path for exact-identifier queries.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- New `mcp-coco-index/mcp_server/cocoindex_code/intent_classifier.py` (~80-110 LOC):
  - Rule-based intent detection over query text; emits intent label (e.g. `implementation`, `test`, `docs`, `error_handling`, `general`) + confidence ∈ [0..1].
  - Reuses keyword precedent from `query.py:40-59` (`_has_implementation_intent`).
  - 30+ unit-test query fixtures.
- Query expansion integration in `mcp_server/cocoindex_code/query.py` (~100-140 LOC additions):
  - New shim BEFORE `embedder.embed(query, query_prompt_name)` at line 293-295.
  - Generates ≤2 sub-queries based on intent label; combined fetch cap respects existing `fetch_k`.
  - Merges sub-query rows through existing `_dedup_and_rank_rows()` (line 317-323) — no new dedup logic.
- Path-class intent priors (~70-100 LOC additions to `_ranked_result()`):
  - Implementation queries boost `implementation` path class.
  - Test queries boost `tests` path class; documentation queries boost `docs`.
  - Bounded ±0.05 magnitude (matches existing path-class rerank).
- Advisor first-action hint in `mcp_server/skill_advisor/lib/render.ts` (~30-50 LOC):
  - When `mcp-coco-index` ranks top with confidence ≥ threshold AND query intent is concept/code-location, emit hint: "semantic search FIRST for intent/code-location queries; grep after for exact verification."
  - Soft dep on Phase 005 — feature-flag standalone fallback if 004 hasn't shipped.
- Telemetry envelope additions in `mcp_server/lib/search/cocoindex-calibration.ts` (~20-40 LOC):
  - `sub_query_count`, `expansion_intent`, `expansion_suppressed_reason`, `path_class_intent_boost`.
- Feature flag `SPECKIT_COCOINDEX_INTENT_EXPAND=0` default off (`mcp_server/ENV_REFERENCE.md` documentation).
- Test harness:
  - `mcp-coco-index/tests/test_intent_classifier.py` — 30+ query fixtures for classifier.
  - `mcp-coco-index/tests/test_query_expansion.py` — end-to-end expansion path with cap enforcement, exact-intent suppression, telemetry shape.
  - `mcp_server/__tests__/skill_advisor/render-coco-hint.vitest.ts` — advisor hint rendering with feature-flag standalone fallback.

### Out of Scope
- LLM-based intent classifier (deferred to follow-on if rule-based ceilings).
- MCP API expansion controls — expansion stays internal, visible only through `rankingSignals`.
- Embedding-model swaps or domain adaptation.
- Active feedback loop for rerank weights (RQ-A3 territory; Phase 009).
- Few-shot exemplar surfacing (RQ-A4 territory; Phase 011).
- Coco+graph rerank fusion (RQ-A5; deferred until Phases 001/002/003 ship).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Rule-based intent classifier shim slot in `query.py` BEFORE `embedder.embed()` at `query.py:293-295` | `intent_classifier.classify(query)` returns `{intent, confidence}`; integration runs at the new shim point; 30+ fixtures pass |
| REQ-002 | Query expander emits original query + ≤2 sub-queries (3-embedding ceiling) | Hard cap enforced; assertion failure on >3 embedding calls per query |
| REQ-003 | Per-sub-query fetch capped at existing `fetch_k = unique_k * 4` (no fanout multiplier) | Fetch budget respected per sub-query; total candidate rows bounded |
| REQ-004 | Exact-intent suppression — skip expansion when query contains exact identifiers, file paths, quoted strings, or regex syntax | Suppression heuristics applied before classifier; suppressed queries hit existing single-embedding path; `expansion_suppressed_reason` telemetry populated |
| REQ-005 | `rankingSignals` transparency for every expansion decision | Result envelope includes `intent:NAME`, `expanded_to:N`, `sub_query_idx:N` for each result row that came from a sub-query |
| REQ-006 | Feature flag `SPECKIT_COCOINDEX_INTENT_EXPAND=0` default off | Flag unset OR `=0` → today's behavior unchanged; flag `=1` → expansion path active |

### P1
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Telemetry envelope additions surfaced through `cocoindex-calibration.ts` | `sub_query_count`, `expansion_intent`, `expansion_suppressed_reason`, `path_class_intent_boost` populated |
| REQ-008 | Path-class taxonomy reuse (`indexer.py:53-91` `classify_path()`) as intent priors for sub-query weighting | Implementation intent boosts `implementation` rows; test intent boosts `tests`; bounded ±0.05; existing path-class rerank unchanged on suppressed queries |
| REQ-009 | Advisor first-action hint via `mcp_server/skill_advisor/lib/render.ts:124-158` (soft dep on Phase 005) | When 004 shipped, hint integrates cleanly with mandate brief; when 004 NOT shipped, hint emits behind feature-flag with deterministic fallback |

### P2
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-010 | Latency budget within ~2× current single-query cost (since up to 3 embeddings) | Benchmark on 50-query fixture; latency overhead < 100ms p50 |
| REQ-011 | SKILL.md + references/search_patterns.md updated with expansion behavior + opt-out documentation | Docs reflect new flag, intent families, telemetry signals |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:edge-cases -->
## 5. EDGE CASES

| Case | Expected Behavior |
|------|-------------------|
| Empty query string | Return empty result set; no embedding call; no expansion attempted |
| Query with quoted string `"exact phrase"` | Suppress expansion (REQ-004); single-embedding path; telemetry `expansion_suppressed_reason: "quoted_string"` |
| Query with regex chars `^foo.*bar$` | Suppress expansion; telemetry `expansion_suppressed_reason: "regex_syntax"` |
| Query with explicit identifier `MyClass.method()` | Suppress expansion; telemetry `expansion_suppressed_reason: "exact_identifier"` |
| Query with file path `src/auth/middleware.ts` | Suppress expansion; telemetry `expansion_suppressed_reason: "file_path"` |
| Query that classifier returns intent=`general` low-confidence | Skip expansion; existing single-embedding path; telemetry `expansion_intent: "general_low_confidence"` |
| Sub-query produces zero candidates | Continue with original-query candidates only; telemetry `sub_query_count: 1` |
| Concurrent queries from multiple users (multi-tenant scope) | Each query gets independent classifier + expander state; no shared mutable state |
| Voyage rate-limit on sub-query embeddings | Fall back to original-query-only; telemetry `expansion_failed: "rate_limited"` |
| Phase 005 not yet shipped at advisor hint integration | Fallback path emits hint behind feature flag; deterministic; no advisor crash |
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:success -->
## 6. SUCCESS CRITERIA

- Phase 007 strict-validates (`bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh ../007-coco-intent-steering --strict` exits 0).
- Intent classifier passes 30+ fixture cases (precision ≥ 0.85 on labeled set).
- Query expansion path enforces 3-embedding ceiling (asserted in tests).
- All 11 REQ-NNN items have green checklist entries.
- Phase-006 eval harness (when shipped) measures expansion lift over current single-shot behavior on 12-20 task set.
- Advisor first-action hint integrates with Phase 005 (when 004 ships) OR works standalone behind feature flag.
<!-- /ANCHOR:success -->

---

<!-- ANCHOR:risks -->
## 7. RISKS

See `decision-record.md` ADR-002..ADR-005 for design rationale; consolidated risk register lives in `plan.md` §Risk Matrix.

| Risk | Severity | Mitigation |
|------|----------|------------|
| Precision loss from over-expansion | P1 | Exact-intent suppression (REQ-004) + 3-embedding cap (REQ-002) + Phase-006 evaluation before default-on |
| Embedding cost from sub-queries | P1 | 3-embedding ceiling caps fanout (REQ-002) |
| Advisor hint coupling to Phase 005 | P2 | Feature-flag standalone fallback (REQ-009) |
| Sub-query suppresses correct results from original query | P1 | `_dedup_and_rank_rows()` merges all sub-query candidates; existing semantic-distance dominance preserved |
| Telemetry envelope explosion | P2 | New fields scoped to expansion-active path; envelope overhead < 200 bytes per response |
<!-- /ANCHOR:risks -->

---

<!-- L3 STRUCTURAL APPENDIX: required template anchors + headers per system-spec-kit
     L3 contract. Substantive content for these topics lives in the numbered sections above
     where natural; the named-anchor stubs below satisfy the validator's anchor + header contract. -->

<!-- ANCHOR:success-criteria -->
## SUCCESS CRITERIA (alias)

Substantive success criteria are in section 6 above. This anchor exists for L3 template compliance.
<!-- /ANCHOR:success-criteria -->

## RISKS & DEPENDENCIES

See section 7 above ("Risks") for the per-phase risk register and `plan.md` for the full Risk Matrix with severity/likelihood/mitigation/verification columns.

<!-- ANCHOR:questions -->
## NON-FUNCTIONAL REQUIREMENTS

Latency budget, cost bounds, telemetry overhead, and rollback ergonomics are detailed in `plan.md` Risk Matrix + Success Metrics sections and the per-REQ acceptance criteria above.
<!-- /ANCHOR:questions -->


## EDGE CASES

See section 5 above ("Edge Cases") for the comprehensive case-by-case list.

## COMPLEXITY ASSESSMENT

L3 designation rationale is in `decision-record.md` ADR-001. Cross-component change with feature-flag governance, telemetry contract, and Phase-006 eval gate.

## RISK MATRIX

See section 7 above + `plan.md` Risk Matrix for the full register with severity, likelihood, mitigation, and verification columns.

## USER STORIES

- **US-001**: As an operator, I can enable the feature via the designated env flag (default off).
- **US-002**: As a developer, I can observe feature decisions via telemetry signals (rankingSignals or eval logger events).
- **US-003**: As a Phase-006 evaluator, I can compare baseline (flag-off) vs treatment (flag-on) on the labeled task set with paired comparison metrics.

## OPEN QUESTIONS

See `_memory.continuity.open_questions` block in this file's frontmatter.

## RELATED DOCUMENTS

- `../research/027-xce-research-pt-03/research.md` (pt-03 verdict matrix and adoption recommendations)
- `decision-record.md` (ADRs for this phase)
- `plan.md` (sub-phases, risk matrix, success metrics)
- `tasks.md` (T### task list)
- `checklist.md` (CHK-### verification items)
- `resource-map.md` (file inventory)
