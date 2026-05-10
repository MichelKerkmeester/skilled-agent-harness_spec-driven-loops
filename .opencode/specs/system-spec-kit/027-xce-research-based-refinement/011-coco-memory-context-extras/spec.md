---
title: "Phase 011 — Coco-Index Few-Shot Exemplars + Memory LLM-Curated Context (Presentation-Layer Extras)"
description: "ADAPT pt-03 RQ-A4 (coco few-shot example bank) + RQ-B2 (memory LLM-curated context packaging). Two presentation-layer features in one packet — neither alters scoring authority. The Coco exemplar path depends on Phase 001's complete CocoIndex MCP fork; the memory curator path remains independently scoped. Coco exemplars in separate response group; memory data.curatedContext as post-retrieval packaging plan with strict JSON schema validation. Both default-off + shadow-first + Phase-006 lift required for active mode. ~500-800 prod LOC + ~340-570 tests."
trigger_phrases:
  - "027 phase 011"
  - "coco few-shot exemplars"
  - "coco example bank"
  - "memory LLM-curated context"
  - "memory_context curator"
  - "ccc_examples_clear"
  - "data.curatedContext"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/011-coco-memory-context-extras"
    last_updated_at: "2026-05-09T11:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Scaffolded 027/011 from pt-03 RQ-A4 + RQ-B2"
    next_safe_action: "Implement Sub-Phase 1 (coco example bank)"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md", "decision-record.md", "resource-map.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-4-7-2026-05-09-027-011-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Should coco example bank capture extend ccc_feedback schema OR add narrow ccc_example_positive writer?"
      - "Should curator package be new profile:'curated' OR separate curation option composable with existing profiles?"
      - "Should active curation EVER reorder data.results, or only ADD data.curatedContext?"
      - "Which model/provider is acceptable for the small-LLM curator path under offline/CI?"
      - "What held-out task set defines memory-context quality (resume / planning / debugging / mixed)?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Coco Few-Shot Exemplars + Memory LLM-Curated Context

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

Pt-03 RQ-A4 (coco few-shot exemplars; verdict ADAPT design / DEFER default-on, see `../research/027-xce-research-pt-03/research.md` §RQ-A4 and `iteration-004.md`) and RQ-B2 (memory LLM-curated context; verdict ADAPT shadow / DEFER active, see §RQ-B2 and `iteration-007.md`) bundle here as Phase 011 because both:
- Are presentation-layer additions (NOT ranking authorities).
- Default-off + shadow-first + Phase-006 lift required for active mode.
- Add latency + non-determinism that justifies governed rollout.
- Touch hot retrieval paths.

**RQ-A4 — Coco Few-Shot Exemplar Bank:**
- New SQLite/vec0 table `coco_query_examples_vec` keyed by query embedding + result identity.
- Captured from explicit `helpful`/`partial` ratings via `ccc_feedback`.
- Surfaced at query time in SEPARATE response group `exemplars: [...]` — NEVER mixed into `QueryResult` ranking.
- Capped storage (~1000-2000 rows/project), TTL ~90 days, top-3 output, similarity threshold ≥0.80, stale reconciliation via `content_hash` + line-range checks.
- New maintenance op `ccc_examples_clear`.
- Default-off behind `SPECKIT_COCOINDEX_EXEMPLARS=false`.

**RQ-B2 — Memory LLM-Curated Context:**
- Optional curator runs AFTER deterministic retrieval (post-`memory-search.ts:1107-1319`).
- Returns packaging plan as `data.curatedContext` beside deterministic `data.results` — does NOT mutate Stage 4 ordering or scores (`pipeline/README.md:33-40`, `stage4-filter.ts:6-19` immutability binding).
- Schema: `{causalChain: id[], tierExemplars: id[], directEvidence: id[], supportingContext: id[], omittedButAvailable: {id, reason}[]}`.
- Strict JSON validation: selected IDs MUST exist in candidate set; no invented file paths.
- Budget split: new `retrievalCandidateLimit` (start 100-300, NOT 2K initially) + `presentationLimit` + `curationTokenBudget`.
- Hard timeout 1500-2500ms with deterministic fallback (return `data.results` only).
- Cache extension: `mode: 'context_curation'` keyed by `(candidateSetHash, intent, profile, version, packagePolicy)`.
- Default-off behind `SPECKIT_CONTEXT_CURATOR=false` + `_MODE=shadow|active`.

**Critical Constraints:**
- Both features MUST NOT mutate ranking scores or canonical result ordering.
- Coco exemplars in separate response group (NEVER blended).
- Memory curator output is plan-only, not authority.
- Active mode requires Phase-006 eval lift evidence over deterministic baseline.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | **3** (two independent presentation features in one packet; both nondeterministic in active mode; both require Phase-006 promotion gate; new local SQLite + vec0 table with TTL/reconciliation; introduces governed presentation surface; see `decision-record.md` ADR-001) |
| **Priority** | P2 (both features ship default-off; presentation-layer additions, no scoring authority) |
| **Status** | Spec-Scaffolded |
| **Parent Packet** | `027-xce-research-based-refinement` |
| **Source** | `../research/027-xce-research-pt-03/research.md` §§RQ-A4, RQ-B2; `iteration-004.md`, `iteration-007.md` |
| **Depends on** | `027/001-cocoindex-complete-fork` for Coco example-bank work; soft on Phase 008 (better trigger candidates → better curator input), Phase 009 (Consumer A signal quality for example-bank capture), Phase 006 (eval lift gate for both features) |
| **LOC budget** | ~500-800 production + ~340-570 tests |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

**Coco today (RQ-A4 gap):**
- Single-shot query path (`mcp_server/cocoindex_code/query.py:267-323`).
- No prior-query awareness; users can't see "what helped before for similar questions".
- `ccc_feedback` (`mcp_server/code_graph/handlers/ccc-feedback.ts:11-60`) captures `query`, `rating`, `resultFile` but lacks rank/range/content_hash for precise exemplars.
- Vec0 schema (`schema.py:8-21`, `indexer.py:308-326`) is code-chunk-shaped; can't host examples without overload.

**Memory context today (RQ-B2 gap):**
- 4-stage hybrid pipeline returns ranked list (`memory-search.ts:1107-1319`).
- `memory_context` (`memory-context.ts:953-1808`) auto-routes intent to deterministic profiles (quick/research/resume/debug per `profile-formatters.ts:4-21`).
- Profiles are rule-based templates — no dynamic chain/tier-aware packaging.
- Existing LLM precedent: Stage 1 reformulation (`stage1-candidate-gen.ts:1140-1224`) is feature-flagged + cache + fail-open.
- Caller `limit` (`memory-search.ts:900-950`) flows directly to Stage 4 cap (`stage4-filter.ts:305-309`); no budget split for curator overfetch.

**Why bundle as one packet:**
- Both presentation-layer additions; same governance pattern.
- Same Phase-006 gate; same default-off + shadow-first; same nondeterminism risk profile.
- Test discipline + ADR list overlap heavily — single L3 packet is leaner than two.

**Purpose:** ship two presentation-layer features that ENRICH retrieval output (without altering scoring authority) — coco exemplars surface "what worked before"; memory `data.curatedContext` surfaces "the package that fits this intent". Both observable, both reversible, both gated on eval lift.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope (5 sub-phases)

**Sub-Phase 1 — Coco Example Bank Schema + Capture (~150-220 LOC + tests)**
- Requires Phase 001 to be complete before modifying the local `mcp-coco-index` package.
- New local SQLite/vec0 table `coco_query_examples_vec(query_embedding float[<dim>], query_hash, result_file, source_realpath, content_hash, path_class, start_line, end_line, validation_source, validated_at_ms, expires_at_ms)`.
- SEPARATE from `code_chunks_vec` so reindexing code chunks cannot corrupt example history.
- Capture trigger: explicit `helpful`/`partial` rating in `ccc_feedback`.
- Open question: extend `ccc_feedback` schema with optional `resultRange`/`pathClass`/`contentHash`/`rawScore`/`rank`/`queryHash` OR add narrow `ccc_example_positive` writer (ADR-002 documents resolution).
- Privacy: NEVER store free-form comments in exemplar rows (raw comments stay in `ccc_feedback` JSONL audit).

**Sub-Phase 2 — Coco Exemplar Retrieval + Maintenance (~150-200 LOC + tests)**
- KNN over example embeddings at query time.
- Top-3 exemplar output; similarity threshold ≥0.80.
- Stale reconciliation: suppress or purge when `result_file` missing, line range no longer exists, or `content_hash` no longer matches current chunk/index row.
- Capped storage ~1000-2000 rows/project; TTL ~90 days unless revalidated.
- New maintenance op `ccc_examples_clear` (CLI + MCP tool).
- Cold start = empty bank → no `exemplars` key in response (no-op fallback).
- Surfaced as SEPARATE response group `exemplars: [...]`; NEVER mixed into `QueryResult` ranking.
- Default-off behind `SPECKIT_COCOINDEX_EXEMPLARS=false`.

**Sub-Phase 3 — Memory Context-Curator Integration Seam (~100-180 LOC + tests)**
- Pipeline budget split: new `retrievalCandidateLimit` (start 100-300, NOT 2K initially) + `presentationLimit` (preserves current `limit`) + `curationTokenBudget` in `memory-search.ts:900-950`.
- Curator hook between deterministic retrieval (post-`memory-search.ts:1107-1319`) and `formatSearchResults` (line 1255-1266).
- Deterministic fallback path (returns `data.results` only when curator unavailable / fails / times out).
- Stage 4 retrieval-ordering immutability preserved (`stage4-filter.ts:6-19`).

**Sub-Phase 4 — Curator Prompt + Schema + Parser (~120-200 LOC + tests)**
- LLM prompt template (model/provider TBD per open question).
- Strict JSON schema validation:
  - Selected IDs MUST exist in candidate set.
  - NO invented file paths or facts.
  - Schema: `{causalChain: id[], tierExemplars: id[], directEvidence: id[], supportingContext: id[], omittedButAvailable: {id, reason}[]}`.
- Cache extension: extend `llm-cache.ts:21-27` with `mode: 'context_curation'` + `(candidateSetHash, intent, profile, version, packagePolicy)` keying.
- Cache hits must still pass deterministic fallback validator.
- Hard timeout 1500-2500ms with deterministic fallback.

**Sub-Phase 5 — Tests + Telemetry + Docs (~80-150 LOC)**
- vitest covering both features (cold start, deterministic fallback, cache hits, schema validation, reconciliation, eval outcomes).
- Telemetry envelope: cache hit/miss, timeout, parse failure, selected IDs, omitted high-rank IDs, token/cost estimate, eval outcome.
- SKILL.md + memory README updates.
- ENV_REFERENCE.md updates (`SPECKIT_COCOINDEX_EXEMPLARS_*` + `SPECKIT_CONTEXT_CURATOR_*` flag families).
- Phase-006 eval gating documented.

### Out of Scope
- Coco exemplars altering ranking (ADR-003 binding — separate response group only).
- Memory curator mutating Stage 4 ordering / scores (ADR-004 binding).
- Cross-feature fusion (coco exemplars in memory context) — defer to follow-on.
- New LLM provider integration for curator (use existing provider stack from `llm-reformulation.ts:321-371`).
- Active mode rollout (gated on Phase-006 lift).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### RQ-A4 — Coco Few-Shot Exemplars

#### P0
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Coco exemplars in SEPARATE response group (`exemplars: [...]`); NEVER mixed into `QueryResult` ranking | Snapshot test: `data.results` ordering unchanged; `exemplars` is distinct field |
| REQ-002 | New local SQLite/vec0 table `coco_query_examples_vec` SEPARATE from `code_chunks_vec` | Schema migration creates new table; reindexing code chunks does NOT touch examples |
| REQ-003 | Capped storage ~1000-2000 rows/project; TTL ~90 days; top-3 output; similarity threshold ≥0.80 | Cap enforcement test; TTL test; output size test |
| REQ-004 | Stale reconciliation — suppress or purge when `result_file` missing, line range no longer exists, or `content_hash` no longer matches | Reconciliation test for each stale condition |
| REQ-005 | New maintenance op `ccc_examples_clear` (CLI + MCP tool) for opt-out / clear-history | CLI invocation works; MCP tool registered |
| REQ-006 | Privacy — NEVER store free-form comments in exemplar rows; aggregate identity-only metadata | Schema review + grep absence of comment field |
| REQ-007 | Cold start — empty bank → no `exemplars` key in response (no-op fallback to current behavior) | Cold start test |
| REQ-008 | Capture path — extend `ccc_feedback` schema with optional `resultRange`/`pathClass`/`contentHash`/`rawScore`/`rank`/`queryHash` OR add narrow `ccc_example_positive` writer (decision in ADR-002) | Capture trigger fires only on explicit user-validated `helpful`/`partial` ratings |
| REQ-009 | Feature flag `SPECKIT_COCOINDEX_EXEMPLARS=false` default off | Flag-off behavior identical to today |

### RQ-B2 — Memory LLM-Curated Context

#### P0
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-010 | LLM curator runs AFTER deterministic retrieval (post-`memory-search.ts:1107-1319`); returns packaging plan attached as `data.curatedContext` beside `data.results` — does NOT mutate Stage 4 ordering or scores | Snapshot test: `data.results` ordering bit-identical pre/post curator |
| REQ-011 | Packaging plan schema: `{causalChain: id[], tierExemplars: id[], directEvidence: id[], supportingContext: id[], omittedButAvailable: {id, reason}[]}`; selected IDs MUST exist in candidate set; NO invented file paths or facts | Strict JSON schema validation test; rejects invented IDs |
| REQ-012 | Budget split — new `retrievalCandidateLimit` (start 100-300, NOT 2K initially) + `presentationLimit` (preserves current `limit` behavior) + `curationTokenBudget` (computed before LLM call) | Budget enforcement test |
| REQ-013 | Hard timeout 1500-2500ms with deterministic fallback (return `data.results` only, omit `data.curatedContext` field) | Mock-timeout test; fallback path tested |
| REQ-014 | Cache extension — extend `llm-cache.ts:21-27` with `mode: 'context_curation'` keying by `(candidateSetHash, intent, profile, version, packagePolicy)` | Cache key shape test; candidate-set hashing uses ordered IDs not raw content |
| REQ-015 | Stage 4 retrieval-ordering immutability preserved (`stage4-filter.ts:6-19`) — curator MUST NOT mutate `score`/`rrfScore`/`intentAdjustedScore`/canonical result ordering | Immutability test on Stage 4 output |

#### P1
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-016 | Telemetry — cache hit/miss, timeout, parse failure, selected IDs, omitted high-rank IDs, token/cost estimate, eval outcome | Telemetry events surfaced in eval logger |
| REQ-017 | Feature flag `SPECKIT_CONTEXT_CURATOR=false` + sub-flag `SPECKIT_CONTEXT_CURATOR_MODE=shadow|active` (shadow first) | Flag matrix tests |
| REQ-018 | Active mode requires Phase-006 eval lift over deterministic profiles (`profile-formatters.ts:4-21`); lift criteria: task success ≥ deterministic baseline; cited-source correctness ≥ baseline; missed-critical-context rate ≤ baseline; latency budget; nondeterministic-variance bound | Promotion gate test |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:edge-cases -->
## 5. EDGE CASES

| Case | Expected Behavior |
|------|-------------------|
| **Coco exemplars** Empty bank | No `exemplars` key in response; current behavior unchanged |
| Stale exemplar (file deleted) | Suppressed in retrieval; purged on next maintenance pass |
| Stale exemplar (content_hash changed) | Suppressed in retrieval; purged on next maintenance pass |
| Bank at storage cap (2000 rows) | Oldest expired-or-validated exemplar evicted on insert |
| Concurrent insert + retrieve | Independent transactions; no race; row-locking via SQLite |
| User clears history (`ccc_examples_clear`) | All exemplars deleted; cold-start behavior on next query |
| Voyage embed fail at capture time | Capture skipped silently; logged `exemplar_capture_failed` |
| **Memory curator** Curator timeout | `data.curatedContext` omitted; `data.results` returned per deterministic path; telemetry `curator_timeout` |
| Curator returns invalid JSON | Same fallback; telemetry `curator_parse_failure` |
| Curator returns ID not in candidate set | REQ-011 rejection; fallback; telemetry `curator_invented_id_rejected` |
| Curator returns valid plan with selected IDs not in `data.results` | OK — `data.results` ordering preserved (REQ-015); `data.curatedContext` IDs are pointers into the candidate set, may include omitted ones |
| Cache hit on identical `(candidateSetHash, intent, ...)` | Skip LLM call; reuse cached plan; telemetry `curator_cache_hit` |
| Empty candidate set | Curator skipped; deterministic fallback only |
| LLM provider not configured | Curator disabled; deterministic only; warning logged |
| Concurrent curator + Stage 4 finalization | Curator runs after Stage 4; no race |
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:success -->
## 6. SUCCESS CRITERIA

- Phase 011 strict-validates.
- Coco `data.results` ordering bit-identical pre/post exemplar feature (REQ-001).
- Memory `data.results` ordering bit-identical pre/post curator (REQ-010, REQ-015).
- Both features default-off; flag-off output bit-identical to today.
- All 18 REQ-NNN have green checklist entries.
- Stale exemplar reconciliation tested for all 3 conditions (file/range/hash).
- Curator deterministic fallback tested for all failure modes (timeout/parse/invalid-id/no-LLM).
- Phase-006 eval (when shipped) measures lift over deterministic baseline for both features.
<!-- /ANCHOR:success -->

---

<!-- ANCHOR:risks -->
## 7. RISKS

See `decision-record.md` ADR-002..ADR-007 + `plan.md` Risk Matrix.

| Risk | Severity | Mitigation |
|------|----------|------------|
| LLM curator nondeterminism affects retrieval trust | P1 | Default-off + strict timeout + deterministic fallback + JSON schema validation + Phase-006 lift requirement |
| Stale exemplar references | P1 | TTL + reconciliation via content_hash + line-range checks + bounded growth |
| Coco exemplar bank conflated with ranking | P1 | Separate response group enforced (REQ-001); snapshot tests |
| Memory curator mutates Stage 4 ordering | P0 | Immutability test (REQ-015) + ADR-004 binding |
| Cross-system telemetry retention beyond local/default-off | P2 | Privacy req (REQ-006) keeps comments in audit JSONL only |
| Curator latency overflow | P1 | Hard timeout 1500-2500ms; deterministic fallback (REQ-013) |
| Cache key collision (curator) | P2 | Candidate-set hashing uses ordered IDs + score/provenance version (REQ-014) |
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
