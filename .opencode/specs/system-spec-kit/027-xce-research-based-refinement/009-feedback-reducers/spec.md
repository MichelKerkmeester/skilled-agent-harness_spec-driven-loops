---
title: "Phase 009 — Learning Feedback Reducers (3 Consumers, P0 Fixes split into 012)"
description: "ADAPT pt-03 RQ-A3 + RQ-B3 + RQ-B4 as a learning-reducers L3 packet: shared feedback aggregation reducer feeding three independent decision consumers (coco rerank weights, session-trace causal-edge inference, learned retention/decay). pt-04 split (2026-05-11): the 3 P0 precondition fixes (auto-provenance cap broadening, manual-edge overwrite guard, retention-sweep tier basement) have moved to new sibling phase `012-feedback-p0-correctness` which ships FIRST. Phase 009 now depends on 012 and is scoped to ~350-570 prod LOC + ~420-710 tests (was ~400-650 prod + ~480-810 tests)."
trigger_phrases:
  - "027 phase 009"
  - "feedback reducers"
  - "ccc_feedback active rerank loop"
  - "session-trace causal edge inference"
  - "feedback-ledger learned retention"
  - "auto-provenance cap broadening"
  - "manual-edge overwrite guard"
  - "constitutional retention basement"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/009-feedback-reducers"
    last_updated_at: "2026-05-11T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "pt-04 split: P0 fixes moved to sibling 012, 009 scoped to learning reducers"
    next_safe_action: "Implement 012 P0 fixes first, then 009 Sub-Phase 2 aggregation"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md", "decision-record.md", "resource-map.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-4-7-2026-05-09-027-009-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Should ccc_feedback collect rank/score/path_class/queryHash at write time, or have the reducer derive only what it can?"
      - "Should the reducer live as ccc-CLI subcommand, MCP maintenance tool, or daemon startup task?"
      - "Should exact-file feedback ever demote a specific resultFile, or is path-class-only safer for v1 live loop?"
      - "Should retention 'protect' clear delete_after, set far-future, or preserve original with governance marker?"
      - "Should query_reformulated count as negative feedback for shown records, or only for records cited before reformulation?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Learning Feedback Reducers (3 Consumers; P0 fixes split into 012)

<!-- SPECKIT_LEVEL: 3 -->

> **pt-04 split note (2026-05-11)**: The 3 P0 correctness fixes that were Sub-Phase 1 of this packet have been carved out into a new sibling phase: [`../012-feedback-p0-correctness/`](../012-feedback-p0-correctness/spec.md). Reason (per pt-04 user decision): correctness fixes should not wait on learning-reducer design. The 012 packet ships before all code_graph phases. 009 (this packet) is now scoped to Sub-Phases 2-5 only (aggregation + 3 consumers) and **hard-depends on 012** for the precondition fixes. See `../research/027-xce-research-pt-04/research.md` §2 Phase 009.

---

## EXECUTIVE SUMMARY

Pt-03 RQ-A3, RQ-B3, RQ-B4 (verdicts ADAPT, see `../research/027-xce-research-pt-03/research.md` §§RQ-A3, RQ-B3, RQ-B4 and iterations 003, 008, 009) all consume the same `feedback_events` ledger but produce three independent decisions:
- **RQ-A3** — coco-index rerank weights via clamped ±0.10 deltas.
- **RQ-B3** — session-trace causal-edge inference: `search_shown(A) → result_cited(B)` → weak `ENABLED(A→B)` at strength 0.3.
- **RQ-B4** — learned retention/decay: weighted-positive TTL extensions; constitutional/critical basement; narrow edge-floor.

Phase 009 implements the three reducers as a single L3 packet with one shared aggregation layer feeding three independent decision consumers. **The 3 P0 precondition fixes that were Sub-Phase 1 have moved to sibling phase [`../012-feedback-p0-correctness/`](../012-feedback-p0-correctness/spec.md)** which ships BEFORE 009. 009 hard-depends on 012; 012 is a self-contained correctness packet.

**The 3 P0 Fixes (NOW in sibling 012-feedback-p0-correctness):**
1. **P0-1: Auto-provenance cap broadening** — `causal-edges.ts:269-288` only checks `createdBy === 'auto'`; RQ-B3's `created_by='auto-session'` would BYPASS the 0.5 strength cap. Fix: `isAutoEdgeCreator(createdBy) => createdBy === 'auto' || createdBy.startsWith('auto-')`. Same fix in `consolidation.ts:352-359`.
2. **P0-2: Manual-edge overwrite guard** — `causal-edges.ts:313-338` `insertEdge` upsert overwrites `created_by` on conflict. Reducer must query existing edge first and skip if `created_by` is non-auto.
3. **P0-3: Retention-sweep tier basement gap** — `memory-retention-sweep.ts:52-68` selects expired rows by `delete_after` ONLY, ignoring tier. Constitutional/critical records can be deleted on TTL expiry despite scoring treating them as never-decay (`tier-classifier.ts:185-213`, `importance-tiers.ts:32-55`, `fsrs-scheduler.ts:286-304`). Fix: extend `RetentionExpiredRow` schema with tier fields; add tier-aware decision before deletion.

**Universal pattern (per pt-03):** all 3 reducers default-off, shadow-first, fail-closed; live mutation requires Phase-006 eval lift over rule-based baseline.

**Critical Constraints:**
- Phase 012 (P0 correctness fixes) MUST land before this packet starts. Consumer A (coco rerank) could in principle ship without P0-1/P0-2, but ordering after 012 is simpler and safer.
- Live per-event reducers would turn shadow-only feedback logging into immediate ranking mutation via causal-boost — DEFERRED reducers only (session-close / consolidation cycle / explicit maintenance).
- Weighted positives MUST replace raw `summary.total` — exposure ≠ usefulness.
- Constitutional/critical retention basement is narrow: applies to MANUAL/authored edges with BOTH endpoints high-tier; not to auto-derived RQ-B3 edges.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | **3** (three downstream consumers; cross-language Python+TS; 3 P0 precondition fixes; governance mutation surface; shadow-first promotion gate; largest LOC budget of the 5; see `decision-record.md` ADR-001) |
| **Priority** | P0 (3 P0 bug fixes inside; downstream blockers for B3+B4 production safety) |
| **Status** | Spec-Scaffolded |
| **Parent Packet** | `027-xce-research-based-refinement` |
| **Source** | `../research/027-xce-research-pt-03/research.md` §§RQ-A3, RQ-B3, RQ-B4; iterations 003, 008, 009; deltas 003, 008, 009 |
| **Depends on** | **`012-feedback-p0-correctness` (HARD, pt-04 split)**; soft on `006-code-graph-adoption-eval` (Phase-006 eval gate for live mutation) |
| **LOC budget** | ~350-570 production + ~420-710 tests (was ~400-650 + ~480-810 before 012 split) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Three independent gaps share a single signal source (`feedback_events`):

**RQ-A3 — `ccc_feedback` is write-only.** `handleCccFeedback()` (`mcp_server/code_graph/handlers/ccc-feedback.ts:11-60`) appends JSONL only; no production reader exists. The feature catalog explicitly says "does not alter ranking immediately" (`mcp_server/code_graph/feature_catalog/07--ccc-integration/02-ccc-feedback.md:22-32`).

**RQ-B3 — Causal edges are manual + spec-doc-auto only.** `causal-edges.ts:853-896` `createSpecDocumentChain` auto-creates spec→plan→tasks chain edges. Session traces showing "user queried A → cited B" are NEVER converted to causal edges. Yet `feedback-ledger.ts:35-68` already records the signal: `search_shown`, `result_cited`, `query_reformulated`, `same_topic_requery`, `follow_on_tool_use` with memory_id + query_id + session_id + confidence + timestamp.

**RQ-B4 — Retention is rule-based.** `memory-retention-sweep.ts:52-68` selects expired rows by `delete_after` only. The wider system already treats constitutional/critical as no-decay in scoring (`tier-classifier.ts:185-213`, `importance-tiers.ts:32-55`, `fsrs-scheduler.ts:286-304`) — but the sweep ignores tier and can DELETE them on TTL expiry. Edge decay is rule-based (`consolidation.ts:330-379` Hebbian decay); no tier-aware floor exists.

**Purpose:** add a shared bounded `feedback-aggregation` reducer feeding three independent decision-makers, plus 3 P0 fixes that make safe shipping possible. All decisions default-off; shadow logs measure would-be impact before live mutation.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope (5 sub-phases)

**Sub-Phase 1 — 3 P0 Precondition Fixes (~50-80 LOC + 60-100 tests)**
- P0-1: Broaden `isAutoEdgeCreator` predicate in `causal-edges.ts:269-288`; same in `consolidation.ts:352-359`.
- P0-2: Add manual-edge overwrite guard in `insertEdge` (`causal-edges.ts:313-338`).
- P0-3: Extend `RetentionExpiredRow` + `selectExpiredRows` in `memory-retention-sweep.ts:17-28, 52-68` to include `importance_tier`, `decay_half_life_days`, `is_pinned`, `access_count`, `last_accessed`.
- Dedicated tests for each fix.

**Sub-Phase 2 — Shared Aggregation (~40-70 LOC + 35-60 tests)**
- New `mcp_server/lib/feedback/feedback-aggregation.ts` reducer.
- Reads `feedback_events` by `{ since, until }` window; aggregates by `memory_id`.
- Tracks `strong/medium/weak` counts + sessions + queries + firstSeen/lastSeen + weighted positives.
- Weighted positive: `weightedHitCount = strong + 0.25 * same_topic_requery - 0.5 * query_reformulated`, clamped at zero.
- Strong = `result_cited + follow_on_tool_use`.
- Idempotent for identical inputs.

**Sub-Phase 3 — Consumer A: Coco Rerank Weights (RQ-A3, ~250-370 LOC + 90-150 tests)**
- New Python reducer `cocoindex_code/feedback_reducer.py` reading recent JSONL events from `.opencode/skills/mcp-coco-index/feedback/search-feedback.jsonl`.
- New SQLite reweight table `feedback_rerank_weights(intent_tag, path_class, ..., delta, ...)`.
- Reducer formula: weighted signal = helpful `+1.0` / partial `+0.25` / not_helpful `-1.0`; min support 5 events OR 3 distinct queries; `delta = clamp(weighted_signal / sample_count * 0.10, -0.10, +0.10)`.
- Apply clamped delta in `_ranked_result()` (`query.py:177-223`); signal `feedback_rerank_delta:+0.04:path_class=implementation:intent=implementation`.
- Cold start = no-op; aggregate counts only; no comment text in learned table.
- Feature flag `SPECKIT_COCOINDEX_FEEDBACK_RERANK=0`.

**Sub-Phase 4 — Consumer B: Session-Trace Causal Edges (RQ-B3, ~170-265 LOC + 165-275 tests)**
- New `mcp_server/lib/feedback/session-trace-causal-reducer.ts`.
- Reads `feedback_events` ordered by `(session_id, timestamp)`.
- For each `result_cited(B)`, select 3-5 earlier `search_shown(A)` IDs where `A !== B`.
- Emit `ENABLED(A → B)` at `strength=0.3`, `created_by='auto-session'` (depends on P0-1 fix), evidence string with session+query IDs.
- Manual-edge guard (depends on P0-2 fix).
- Idempotency per `(session_id, A, B)` pair; subsequent runs no-op or bump strength by ≤0.05 clamped to 0.5.
- Caps: ≤5 inferred sources per cited target per session; ≤20 edges per node (existing); ≤100 per relation per window (existing).
- DEFERRED — fires at session-close / consolidation / explicit maintenance, NEVER per-event live.
- Feature flag `SPECKIT_SESSION_TRACE_CAUSAL_INFERENCE=false`.

**Sub-Phase 5 — Consumer C: Learned Retention/Decay (RQ-B4, ~215-385 LOC + 225-385 tests)**
- New `mcp_server/lib/feedback/feedback-retention-reducer.ts` consuming Sub-Phase 2 aggregation + extended `RetentionExpiredRow` (P0-3).
- Per-candidate `RetentionDecision: 'delete' | 'extend' | 'protect'`:
  - constitutional/critical → `protect` (basement; never delete on TTL)
  - pinned → `protect` or extend
  - important + positive weighted hits → `extend` by `baseTtl × min(2, 1 + log10(weightedHitCount))`
  - normal/temporary → no positive boost in v1; delete if expired per existing governance
  - medium negative (`query_reformulated` dominates positives) → reduce or block extension
- Edge floor narrow: `getEdgeTierBasement(edge)` joins source+target → `floor=0.7` ONLY for manual/authored edges where BOTH endpoints constitutional/critical, OR explicit constitutional-chain evidence marker.
- `dryRun` path returns decisions without writes (shadow eval).
- Live mutation gate via `shadow-scoring.ts:1-15` weekly-cycle promotion-gate pattern.
- Sweep integration: `extend` updates `delete_after` + audit; `protect` clears or sets distant `delete_after` + audit; only final `delete` calls `vectorIndex.deleteMemory`.
- Feature flag `SPECKIT_FEEDBACK_RETENTION_LEARNING=false` + `SPECKIT_FEEDBACK_RETENTION_MODE=shadow|active`.

### Out of Scope
- Live per-event reducer firing (DEFERRED reducer only — ADR-004 binding).
- Re-embedding triggered by feedback (preserves Phase 008's no-re-embed contract).
- Active TTL mutation without shadow eval window (ADR-006 binding).
- Cross-system shared cache for feedback events (Phase 010 territory).
- Coco exemplar surfacing from positive feedback (Phase 011 RQ-A4 territory).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### Sub-Phase 1 — P0 Precondition Fixes

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 (P0-1) | Broaden `isAutoEdgeCreator` predicate to `createdBy === 'auto' \|\| createdBy.startsWith('auto-')` in `causal-edges.ts:269-288` and `consolidation.ts:352-359` | Test: `created_by='auto-session'` edges capped at 0.5 strength; predicate test pass |
| REQ-002 (P0-2) | `insertEdge` upsert manual-edge overwrite guard | Test: existing manual edge NOT overwritten when reducer attempts upsert; auto edges allowed to upsert |
| REQ-003 (P0-3) | Extend `RetentionExpiredRow` + `selectExpiredRows` in `memory-retention-sweep.ts:17-28, 52-68` with tier fields | Schema includes `importance_tier`, `decay_half_life_days`, `is_pinned`, `access_count`, `last_accessed`; selectExpiredRows returns extended row type |

### Sub-Phase 2 — Shared Aggregation

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | New `lib/feedback/feedback-aggregation.ts` reducer reading `feedback_events` by `{ since, until }` window | Aggregation API stable; idempotent for identical inputs |
| REQ-005 | Weighted positive formula: `weightedHitCount = strong + 0.25 * same_topic_requery - 0.5 * query_reformulated`, clamped at zero | Unit test on formula edge cases (all-positive, all-negative, mixed, zero events) |
| REQ-006 | Aggregation reducer is deterministic and idempotent | Run-twice test: identical output for identical inputs |

### Sub-Phase 3 — Consumer A (Coco Rerank Weights)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | New Python reducer `cocoindex_code/feedback_reducer.py` reading JSONL events | Reducer reads `.opencode/skills/mcp-coco-index/feedback/search-feedback.jsonl`; parses + aggregates |
| REQ-008 | Reducer derives `path_class` from `resultFile` via `classify_path()` reuse | Path class derivation matches indexer behavior |
| REQ-009 | New SQLite reweight table `feedback_rerank_weights(intent_tag, path_class, window_start_ms, window_end_ms, helpful_count, partial_count, not_helpful_count, sample_count, delta, updated_at_ms, PRIMARY KEY (intent_tag, path_class))` | Schema migration + lookup helper |
| REQ-010 | Reducer formula: weighted signal = helpful `+1.0` / partial `+0.25` / not_helpful `-1.0`; min support 5 events OR 3 distinct queries; `delta = clamp(weighted_signal / sample_count * 0.10, -0.10, +0.10)` | Unit test on formula edge cases; clamping verified |
| REQ-011 | `_ranked_result()` in `query.py:177-223` adds clamped delta after existing path-class rerank with signal `feedback_rerank_delta:+0.04:path_class=implementation:intent=implementation` | Snapshot test on rerank signal |
| REQ-012 | Cold start + missing table + below-min-support → `delta=0` (no behavior change) | No-op tests for each condition |
| REQ-013 | Privacy — aggregate counts/deltas only; raw comments stay in JSONL audit; never copied into learned table | Schema review + grep absence of comment fields |
| REQ-014 | Feature flag `SPECKIT_COCOINDEX_FEEDBACK_RERANK=0` default off | Flag-off behavior identical to today |

### Sub-Phase 4 — Consumer B (Session-Trace Causal Edges)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-015 | New `lib/feedback/session-trace-causal-reducer.ts` reading `feedback_events` ordered by `(session_id, timestamp)` | Reducer respects timestamp ordering; per-session grouping |
| REQ-016 | For each `result_cited(B)`, select 3-5 earlier `search_shown(A)` IDs where `A !== B`; prefer same-`query_id` first | Selection algorithm deterministic; cap enforced |
| REQ-017 | Emit `ENABLED(A → B)` at `strength=0.3` via `insertEdge(...)` with `created_by='auto-session'` (depends on P0-1) | Edge created at exactly 0.3; provenance correct |
| REQ-018 | DEFERRED reducer — fires at session-close / consolidation cycle / explicit maintenance command. NEVER per-event live | Code review: no live invocation paths; only deferred call sites |
| REQ-019 | Manual-edge guard (depends on P0-2) — query existing edge first; skip if `created_by` is non-auto | Test: pre-existing manual `ENABLED(A,B)` not overwritten |
| REQ-020 | Idempotency per `(session_id, A, B)` pair; subsequent runs no-op or bump strength by ≤0.05 clamped to 0.5 | Run-twice test: idempotent |
| REQ-021 | Caps enforced: ≤5 inferred sources per cited target per session; existing `MAX_EDGES_PER_NODE=20`; existing `CAP_PER_WINDOW=100` | Cap tests for each |
| REQ-022 | Feature flag `SPECKIT_SESSION_TRACE_CAUSAL_INFERENCE=false` default off | Flag-off behavior unchanged |

### Sub-Phase 5 — Consumer C (Learned Retention/Decay)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-023 | New `lib/feedback/feedback-retention-reducer.ts` consuming Sub-Phase 2 aggregation + extended `RetentionExpiredRow` (P0-3) | Reducer composes shared aggregation; consumes extended row type |
| REQ-024 | Per-candidate `RetentionDecision: 'delete' \| 'extend' \| 'protect'` with rules per spec table | All 5 decision rules tested (constitutional/critical/pinned/important+positive/normal-temporary) |
| REQ-025 | Edge floor narrow: `getEdgeTierBasement(edge)` joins source+target → `floor=0.7` ONLY for manual/authored edges where BOTH endpoints constitutional/critical | Floor test: auto-derived edges NOT floored; manual constitutional-only-one-end NOT floored; manual both-constitutional floored |
| REQ-026 | `dryRun` path returns decisions without writes (shadow eval) | `dryRun=true` test: no DB writes; decisions returned |
| REQ-027 | Live mutation gate — copy `shadow-scoring.ts:1-15` weekly-cycle promotion-gate pattern | Promotion gate test: requires shadow eval window with metrics |
| REQ-028 | Sweep integration — `extend` updates `delete_after` + audit `retention_sweep:extend`; `protect` clears or sets distant `delete_after` + audit `retention_sweep:protect`; only final `delete` calls `vectorIndex.deleteMemory` | Integration test for each action |
| REQ-029 | Feature flags `SPECKIT_FEEDBACK_RETENTION_LEARNING=false` + `SPECKIT_FEEDBACK_RETENTION_MODE=shadow\|active` | Flag matrix tests |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:edge-cases -->
## 5. EDGE CASES

| Case | Expected Behavior |
|------|-------------------|
| Zero feedback events for a memory | All 3 reducers no-op for that memory; `delta=0`, no causal edge inferred, no retention extension |
| Single `result_cited` with no preceding `search_shown` in same session | Consumer B: no edge inferred (no source candidates) |
| `result_cited(B)` where B was shown in a DIFFERENT session | Consumer B: not eligible source; only same-session shown IDs are candidates |
| Existing manual `ENABLED(A,B)` edge AND reducer wants to upsert | Consumer B: skipped per REQ-019 (P0-2 guard); telemetry logged |
| Reducer attempts to insert beyond `MAX_EDGES_PER_NODE=20` | Existing `causal-edges.ts` cap rejects; reducer logs `cap_exceeded` |
| Constitutional record with expired `delete_after` | Consumer C: `protect` decision; `delete_after` cleared or set far-future; audit recorded |
| Important record with feedback_events but `query_reformulated` dominates positives | Consumer C: extension reduced or blocked |
| Aggregation window with millions of events | Sub-Phase 2: paginated read; idempotent; bounded memory |
| Concurrent reducer runs (e.g. cron + manual maintenance) | All 3 reducers idempotent per REQ-006/REQ-020/REQ-026 — safe to overlap |
| Coco JSONL file rotated/truncated mid-aggregation | Consumer A: handles partial read gracefully; logs `audit_truncated_warning` |
| Voyage rate-limit during retention reducer | Consumer C: aggregation has no embed dependency; unaffected |
| `embedding_status='failed'` rows | Consumer C: tier-aware retention still works; embedding status independent |
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:success -->
## 6. SUCCESS CRITERIA

- Phase 009 strict-validates.
- All 3 P0 fixes pass dedicated tests (Sub-Phase 1).
- Shared aggregation reducer idempotent on identical inputs (Sub-Phase 2).
- Consumer A: cold start + flag-off + above-min-support cases all green; rerank deltas clamped (Sub-Phase 3).
- Consumer B: idempotent per-session; manual-edge guard prevents overwrites; caps enforced; deferred-only invocation (Sub-Phase 4).
- Consumer C: tier basement protects constitutional records; edge floor narrow scope; shadow-mode dryRun returns decisions without writes (Sub-Phase 5).
- All 29 REQ-NNN have green checklist entries.
- Phase 006 eval (when shipped) measures retention quality (prevented-then-cited deletes; extended-then-unused records).
<!-- /ANCHOR:success -->

---

<!-- ANCHOR:risks -->
## 7. RISKS

See `decision-record.md` ADR-002..ADR-007 + `plan.md` Risk Matrix.

| Risk | Severity | Mitigation |
|------|----------|------------|
| Auto-provenance bypass (RQ-B3 ships without P0-1) | **P0** | Sub-Phase 1 mandatory before Sub-Phase 4 |
| Manual edge overwrite (RQ-B3 ships without P0-2) | **P0** | Sub-Phase 1 mandatory before Sub-Phase 4 |
| Constitutional record deletion (RQ-B4 ships without P0-3) | **P0** | Sub-Phase 1 mandatory before Sub-Phase 5 |
| Feedback-driven retention rewards exposure | P1 | Weighted-positives formula (REQ-005, REQ-024) |
| Edge floor protects noisy auto-derived edges | P1 | Narrow floor scope (REQ-025, ADR-007) |
| Live reducer firing turns shadow telemetry into ranking mutation | P1 | Deferred reducer only (REQ-018, ADR-004) |
| Cross-system coordination (Python + TS reducers) | P2 | Independent decision-maker architecture (Consumer A is Python-side; B, C are TS-side; only Sub-Phase 2 aggregation is shared) |
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
