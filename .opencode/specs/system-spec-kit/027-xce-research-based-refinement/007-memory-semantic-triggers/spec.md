---
title: "007 — Memory Backend Semantic Trigger Matching (Hybrid Lexical+Semantic)"
description: "ADAPT XCE-style semantic similarity into memory_match_triggers as a hybrid lexical+semantic stage using the existing Voyage-4 1024-dim embedding cache. Lexical remains primary precision path; semantic adds paraphrase recall as feature-flagged UNION. Cognitive activation guards (semantic-only hits at reduced attention) prevent control-surface masquerading. ~280-430 LOC + 180-280 tests."
trigger_phrases:
  - "027 phase 007"
  - "memory semantic triggers"
  - "hybrid trigger matching"
  - "semantic trigger fallback"
  - "memory backend semantic trigger matching"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/007-memory-semantic-triggers"
    last_updated_at: "2026-05-09T11:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Scaffolded 027/008 from pt-03 RQ-B1"
    next_safe_action: "Implement Sub-Phase 1 (schema + backfill)"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md", "decision-record.md", "resource-map.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-4-7-2026-05-09-027-008-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "What trigger golden set defines acceptable false-activation rate for semantic-only matches?"
      - "Should semantic-only trigger hits activate working memory at reduced score, or only retrieve content without activation until proven?"
      - "Should trigger embeddings use raw phrases only, or weighted text like `title + trigger phrase + spec folder slug`?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: 007 — Memory Backend Semantic Trigger Matching (Hybrid Lexical+Semantic)

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

> **pt-04 audit note (2026-05-11)**: Path discipline confirmed — spec uses correct `mcp_server/lib/triggers/`, `mcp_server/lib/parsing/trigger-matcher.ts`, `mcp_server/handlers/memory-index-scan.ts`, `mcp_server/lib/embeddings/embedding-pipeline.ts` paths. Audit flagged `mcp_server/lib/memory/` as nonexistent — that path may appear in plan.md / tasks.md / decision-record.md (TODO: sweep these). Live tool dispatch is `tools/memory-tools.ts:63-75` and schemas `tool-input-schemas.ts:820-825`. **Dependency reframing**: the soft dependency on `028/004-code-graph-adoption-eval` is now stated as "requires **shadow eval evidence**" — 028/004-code-graph-adoption-eval's harness produces the evidence, but the dependency is on the evidence, not on a specific harness implementation. See `../research/027-xce-research-pt-04/research.md` §2 Phase 007.

Pt-03 RQ-B1 (verdict ADAPT, see `../research/027-xce-research-pt-03/research.md` §RQ-B1 and `../research/027-xce-research-pt-03/iterations/iteration-006.md`) addresses the memory backend's lexical-only trigger matching. Today's `memory_match_triggers` (`mcp_server/lib/parsing/trigger-matcher.ts:201-545`) matches by exact phrase + word boundaries (CJK substring + Latin word-boundary regex). It catches `/memory:save` and `save context` precisely but misses paraphrases like "save the current state".

XCE's transferable teaching is semantic retrieval ("find by meaning, not text matching" per `external/README.md:192-199`). Direct adoption would replace lexical with semantic — but trigger matches activate working memory + co-activation spreading (`memory-triggers.ts:360-380`); semantic false positives would mis-prioritize cognitive tiers.

**Decision:** ADAPT as a HYBRID. Lexical remains primary precision path; semantic adds paraphrase recall as a feature-flagged UNION fallback. Strong lexical command matches short-circuit semantic. Semantic-only hits activate at reduced attention (`min(0.85, semanticScore)`) so they cannot masquerade as exact triggers.

**Key Decisions:**
- **Hybrid not replacement** — exact triggers are a control surface (commands, continuity phrases); preserve precision.
- **Lexical first; semantic on miss** — embed prompt only when lexical empty/weak.
- **Reuse existing Voyage-4 1024-dim cache** (`embedding-cache.ts:45-55`) — no new embedding pipeline.
- **Derived storage table** `memory_trigger_embeddings` — `trigger_phrases` JSON in `memory_index` stays source-of-truth.
- **Backfill via `memory_index_scan` + save-time pipeline** (`embedding-pipeline.ts:143-169`) — never synchronous embed in trigger calls (latency budget 30-50ms PASS / 100ms WARN per `trigger-matcher.ts:132-160`).
- **Reduced activation for semantic-only** — `min(0.85, semanticScore)` keeps tier classifier honest.
- **Default-off behind `SPECKIT_SEMANTIC_TRIGGERS=false`** + sub-flag `SPECKIT_SEMANTIC_TRIGGERS_MODE=shadow|union` (shadow first).
- **Conservative starting threshold** `0.84` cosine + `0.04` margin + `_MAX=3`.

**Critical Constraints:**
- Trigger matches feed cognitive activation (`memory-triggers.ts:360-380`) — false positives are EXPENSIVE.
- Latency budget is tight — must NOT block on embedding generation in the hot path.
- Lexical command surface must remain BIT-FOR-BIT identical when flag off.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | **3** (cognitive activation hot path; new derived table + backfill workflow; shadow-first promotion gate; retrieval trust impact; see `decision-record.md` ADR-001) |
| **Priority** | P0 (highest-leverage memory improvement per pt-03 headline recommendation) |
| **Status** | Spec-Scaffolded |
| **Parent Packet** | `027-xce-research-based-refinement` |
| **Source** | `../research/027-xce-research-pt-03/research.md` §RQ-B1; `../research/027-xce-research-pt-03/iterations/iteration-006.md` |
| **Depends on** | none (hard); requires **shadow eval evidence** from `028/004-code-graph-adoption-eval` (or equivalent harness) for threshold tuning before live-mode promotion. **pt-04 reframing** — was "shared infra from 006", now "requires evidence, not infra coupling". |
| **LOC budget** | ~280-430 production + ~180-280 tests |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

`memory_match_triggers` today is lexical-only:
- `trigger-matcher.ts:201-210` loads canonical spec docs + `_memory.continuity` rows from `memory_index`.
- `trigger-matcher.ts:407-545` builds Unicode-aware token/ngram candidate index.
- `trigger-matcher.ts:772-880` runs boundary regex matching per candidate.

This catches explicit phrases (`/memory:save`, `save context`, `resume iteration`) but misses paraphrases — "save the current state" doesn't match the stored "save context" phrase. Memory recall suffers; users have to rephrase to hit triggers.

XCE's public claim is semantic retrieval (`external/README.md:188-199`). Adopting fully would replace lexical — risky because:
- Trigger matches activate working memory + co-activation (`memory-triggers.ts:360-380`); semantic false positives mis-prioritize cognitive tiers.
- Explicit commands (`/memory:save`) are a control surface, not a fuzzy search query.
- Latency budget is tight (`trigger-matcher.ts:132-160`).

**Purpose:** add an OPTIONAL semantic stage as a UNION fallback — runs only when lexical empty/weak; uses existing Voyage-4 cache; semantic-only hits source-tagged + reduced-activation so they can't pretend to be exact triggers.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- New table `memory_trigger_embeddings(memory_id INTEGER, phrase TEXT, phrase_hash TEXT, model_id TEXT, dimensions INTEGER, embedding_status TEXT, updated_at TEXT, PRIMARY KEY (memory_id, phrase_hash))` in `mcp_server/lib/storage/vector-index-schema.ts`.
- BLOB embedding storage reuses existing `embedding_cache(content_hash, model_id, dimensions, embedding)` from `embedding-cache.ts:45-55` — keyed by `phrase_hash + model_id + dimensions`.
- New `mcp_server/lib/triggers/semantic-trigger-matcher.ts` (~140-200 LOC):
  - Loads in-memory cache of trigger embeddings beside existing `triggerCache`.
  - Cosine similarity over Voyage-4 cache; threshold + margin + max-hit gates.
  - Deterministic ordering for reproducibility.
- Backfill integration:
  - `memory_index_scan` (`mcp_server/handlers/memory-index-scan.ts`): on each indexed memory, generate trigger embeddings for any phrase with `embedding_status='pending'`.
  - Save-time pipeline (`mcp_server/lib/embeddings/embedding-pipeline.ts:143-169`): on `memory_save`, generate trigger embeddings inline (best-effort; non-blocking on failure).
  - **NEVER** synchronous embed inside trigger call — use cached embeddings only at runtime.
- `memory-triggers.ts` 2-stage handler (~70-110 LOC additions):
  - Stage 1: existing lexical match (unchanged path).
  - Stage 2 (gated by flag): if lexical empty OR weak (no `passes_threshold`), embed prompt → cosine search → merge with lexical, lexical precedence preserved.
  - Strong lexical command matches short-circuit Stage 2 (no embed).
- Activation guards in `memory-triggers.ts:360-380`:
  - Semantic-only hits: `attention = min(0.85, semanticScore)`, `matchSource: "semantic"`.
  - Lexical hits: `attention = 1.0`, `matchSource: "lexical"`.
- Flag family in `mcp_server/ENV_REFERENCE.md`:
  - `SPECKIT_SEMANTIC_TRIGGERS=false` (master switch, default off).
  - `SPECKIT_SEMANTIC_TRIGGERS_MODE=shadow|union` (default shadow when master on).
  - `SPECKIT_SEMANTIC_TRIGGER_THRESHOLD=0.84` (cosine cutoff).
  - `SPECKIT_SEMANTIC_TRIGGER_MARGIN=0.04` (top-hit separation requirement).
  - `SPECKIT_SEMANTIC_TRIGGER_MAX=3` (cap on semantic hit count).
- Shadow telemetry in `memory-triggers.ts`:
  - Log would-have-fired hits without activation when mode is `shadow`.
  - Record threshold-band distribution (0.78 / 0.82 / 0.86) for tuning.
- Trigger goldens fixture set at `mcp_server/__tests__/fixtures/trigger-goldens.json`:
  - ~40 phrases × {exact, paraphrase, distractor} variants.
  - Expected match-source per fixture.
- Test harness:
  - `mcp_server/__tests__/triggers/semantic-matcher.vitest.ts` — semantic stage unit tests.
  - `mcp_server/__tests__/triggers/hybrid-handler.vitest.ts` — 2-stage handler integration.
  - `mcp_server/__tests__/triggers/cold-start.vitest.ts` — phrases without embeddings skipped silently.
  - `mcp_server/__tests__/triggers/latency-budget.vitest.ts` — 30-50ms PASS / 100ms WARN preserved.

### Out of Scope
- Replacing lexical matching entirely (ADR-002 binding).
- Synchronous embed generation in trigger call (REQ-006 binding).
- Cross-language semantic similarity (CJK paraphrase coverage stays at lexical level for v1).
- Learned trigger confidence weighting (would require Phase 008's feedback reducer).
- Trigger phrase auto-discovery from prompts (out of scope; manual authorship preserved).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Lexical matching remains PRIMARY precision path; zero behavior change for explicit triggers | Diff test: flag-off output bit-identical to current behavior on `/memory:save`, `save context`, `resume iteration`, all CJK fixtures |
| REQ-002 | Semantic fallback fires ONLY when lexical empty OR weak; UNION (not replacement) with lexical results | Unit test: lexical-strong + semantic-active → only lexical hits returned; lexical-empty + semantic-active → semantic hits returned with `matchSource: "semantic"` |
| REQ-003 | Strong lexical command matches short-circuit semantic stage (no embed call) | Trace assertion: when explicit command matched, `embedder.embed` NOT called |
| REQ-004 | Trigger embeddings stored in NEW derived table `memory_trigger_embeddings`; reuse `embedding_cache` BLOB storage | Schema migration applied; `(memory_id, phrase_hash)` primary key; embedding BLOB lookup via `phrase_hash + model_id + dimensions` |
| REQ-005 | `trigger_phrases` JSON in `memory_index` remains source-of-truth — derived table is regeneratable | `memory_index_scan --force` rebuilds derived table from JSON without loss |
| REQ-006 | Backfill via `memory_index_scan` + save-time pipeline; NEVER synchronous embed inside `memory_match_triggers` | Code review assertion: no `embedder.embed` call in `memory-triggers.ts` Stage 2 hot path; only `embedding_cache.lookup` |
| REQ-007 | Semantic-only hits source-tagged: `matchSource: "semantic"` + `semanticScore` + matched trigger phrase in result envelope | Snapshot test on result envelope |
| REQ-008 | Cognitive activation guards: semantic-only hits at `attention = min(0.85, semanticScore)`; lexical hits at `attention = 1.0` | Unit test on `memory-triggers.ts:360-380` activation block |

### P1
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-009 | Flag family: 5 env vars per spec (`SPECKIT_SEMANTIC_TRIGGERS_*`) | All 5 documented in `ENV_REFERENCE.md`; defaults preserved |
| REQ-010 | Shadow telemetry — log would-have-fired semantic hits without activation when `_MODE=shadow`; record threshold-band distribution | Telemetry events in eval logger; threshold-band buckets populated |
| REQ-011 | Cold-start handling — phrases without embeddings skipped silently in semantic stage; logged as `semantic_trigger_skipped_uncached`; backfill runs on next `memory_index_scan` | Unit test: missing embedding → no semantic hit; telemetry populated |
| REQ-012 | Trigger goldens fixture set established (~40 phrases × 3 variants) for threshold tuning | `trigger-goldens.json` exists; tests load and verify all variants |

### P2
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-013 | Latency budget preserved — 30-50ms PASS / 100ms WARN per `trigger-matcher.ts:132-160` even with semantic stage in shadow mode | Latency benchmark CI gate |
| REQ-014 | CJK + Latin trigger phrases both supported in semantic stage (Voyage-4 supports both) | Fixture coverage of CJK paraphrases |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:edge-cases -->
## 5. EDGE CASES

| Case | Expected Behavior |
|------|-------------------|
| Empty prompt | No lexical match; no semantic embed; empty result |
| Prompt matches lexical exactly (`/memory:save`) | Lexical hit returned at `attention=1.0`; semantic stage SKIPPED entirely (no embed) |
| Prompt is paraphrase of stored trigger ("save the current state" vs "save context") | Lexical empty; semantic stage embeds prompt; cosine ≥ 0.84 → semantic hit at `attention=min(0.85, score)`; `matchSource: "semantic"` |
| Phrase has no cached embedding (cold start) | Skipped silently in semantic stage; logged `semantic_trigger_skipped_uncached`; backfill on next index scan |
| Voyage embedding cache miss (network fail) | Stage 2 skipped; lexical-only result returned; logged `semantic_trigger_skipped_cache_miss` |
| Multiple triggers fire (lexical + semantic) | UNION; lexical precedence in ordering; both included in cognitive activation with respective attention scores |
| Threshold band 0.78-0.82 (just below cutoff) | Logged in shadow telemetry; not activated unless threshold lowered |
| `SPECKIT_SEMANTIC_TRIGGERS_MODE=shadow` with strong semantic match | Logged but NOT activated; lexical-only behavior surfaced |
| Trigger phrase added but `memory_index_scan` not yet run | Phrase has `embedding_status='pending'`; lexical works; semantic stage skips this phrase until backfill |
| Concurrent `memory_match_triggers` calls (multi-tenant) | Each call independent; in-memory cache concurrent-safe; no cross-tenant trigger leakage (existing scope filtering preserved) |
| Voyage rate limit | Embed fails; Stage 2 skipped; lexical-only result; telemetry `semantic_trigger_rate_limited` |
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:success -->
## 6. SUCCESS CRITERIA

- Phase 007 strict-validates.
- Trigger goldens fixture set: lexical exact-match precision = 1.0; semantic paraphrase recall ≥ 0.7 at threshold 0.84; semantic distractor false-positive rate ≤ 0.05.
- Diff test: flag-off output bit-identical to current behavior (REQ-001).
- Latency benchmark p95 within 100ms WARN budget even with shadow stage active.
- All 14 REQ-NNN have green checklist entries.
- 028/004-code-graph-adoption-eval eval (when shipped) measures recall lift on paraphrase-heavy task set.
<!-- /ANCHOR:success -->

---

<!-- ANCHOR:risks -->
## 7. RISKS

See `decision-record.md` ADR-002..ADR-006 + `plan.md` Risk Matrix.

| Risk | Severity | Mitigation |
|------|----------|------------|
| False semantic triggers mis-prioritize cognitive tiers | P0 | Lexical short-circuit + reduced-activation guard + source-tagged telemetry + shadow-first rollout + trigger goldens eval before active mode |
| Embedding cost from per-prompt embed under semantic-active mode | P1 | Lexical short-circuit on strong matches + threshold gating + Voyage cache reuse |
| Backfill scheduling complexity | P2 | Deferred backfill via index scan + cold-start no-op behavior |
| Schema migration risk on production memory DB | P1 | Forward-only ADD COLUMN / CREATE TABLE; backward-compatible reads |
| Voyage rate-limit cascade to trigger latency | P1 | Cache lookup only at runtime; embed only at backfill (out-of-band) |
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

L3 designation rationale is in `decision-record.md` ADR-001. Cross-component change with feature-flag governance, telemetry contract, and 028/004-code-graph-adoption-eval eval gate.

## RISK MATRIX

See section 7 above + `plan.md` Risk Matrix for the full register with severity, likelihood, mitigation, and verification columns.

## USER STORIES

- **US-001**: As an operator, I can enable the feature via the designated env flag (default off).
- **US-002**: As a developer, I can observe feature decisions via telemetry signals (rankingSignals or eval logger events).
- **US-003**: As a 028/004-code-graph-adoption-eval evaluator, I can compare baseline (flag-off) vs treatment (flag-on) on the labeled task set with paired comparison metrics.

## OPEN QUESTIONS

See `_memory.continuity.open_questions` block in this file's frontmatter.

## RELATED DOCUMENTS

- `../research/027-xce-research-pt-03/research.md` (pt-03 verdict matrix and adoption recommendations)
- `decision-record.md` (ADRs for this phase)
- `plan.md` (sub-phases, risk matrix, success metrics)
- `tasks.md` (T### task list)
- `checklist.md` (CHK-### verification items)
- `resource-map.md` (file inventory)
