---
title: "Resource Map — Phase 008 Shared Learning Feedback Reducers"
description: "File inventory for Phase 008: per-child scope. Largest of 5 (~28 files). Spans causal-edges + consolidation + retention-sweep + 3 new TS reducers + edge-tier-basement helper + Python coco feedback_reducer + SQLite reweight table + 8+ test files + ENV/schema docs."
trigger_phrases:
  - "027 phase 008 resource map"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/008-learning-feedback-reducers"
    last_updated_at: "2026-05-09T11:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored per-child resource map"
    next_safe_action: "Update on file changes"
    blockers: []
    key_files: ["resource-map.md"]
    completion_pct: 100
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

<!-- ANCHOR:when-to-use -->
## WHEN TO USE THIS TEMPLATE

Per-child resource map for Phase 008 — the largest scaffolding scope in 027 pt-03 series. Pt-03 aggregate map at `../research/027-xce-research-pt-03/resource-map.md`.
<!-- /ANCHOR:when-to-use -->

---

<!-- ANCHOR:summary -->
## Summary

- **Total references**: 28
- **By category**: READMEs=3, Documents=4, Specs=8, Scripts=20, Tests=10, Config=3
- **Missing on disk**: 0
- **Scope**: Per-child — files Phase 008 reads, modifies, creates, or cites across 5 sub-phases.
- **Generated**: 2026-05-09T11:00:00Z
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:readmes -->
## 1. READMEs

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/system-spec-kit/SKILL.md` | Cited | OK | Memory MCP routing context |
| `.opencode/skills/mcp-coco-index/SKILL.md` | Cited | OK | Coco-side context for Consumer A |
| `.opencode/skills/system-spec-kit/mcp_server/README.md` | Cited | OK | Server context for handler integration |
<!-- /ANCHOR:readmes -->

---

<!-- ANCHOR:documents -->
## 2. Documents

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-pt-03/research.md` | Cited | OK | Pt-03 §§RQ-A3, RQ-B3, RQ-B4 |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-pt-03/iterations/iteration-003.md` | Cited | OK | RQ-A3 ccc_feedback findings |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-pt-03/iterations/iteration-008.md` | Cited | OK | RQ-B3 session-trace findings (incl. P0-1, P0-2 evidence) |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-pt-03/iterations/iteration-009.md` | Cited | OK | RQ-B4 retention findings (incl. P0-3 evidence) |
<!-- /ANCHOR:documents -->

---

<!-- ANCHOR:specs -->
## 6. Specs

| Path | Action | Status | Note |
|------|--------|--------|------|
| `009-feedback-reducers/spec.md` | Created | OK | This packet |
| `009-feedback-reducers/plan.md` | Created | OK | This packet |
| `009-feedback-reducers/tasks.md` | Created | OK | This packet (35 tasks) |
| `009-feedback-reducers/checklist.md` | Created | OK | This packet (35 CHK items) |
| `009-feedback-reducers/decision-record.md` | Created | OK | This packet (7 ADRs) |
| `009-feedback-reducers/implementation-summary.md` | Created | OK | Placeholder; filled post-impl |
| `009-feedback-reducers/description.json` | Created | OK | Spec-folder metadata |
| `009-feedback-reducers/graph-metadata.json` | Created | OK | Graph metadata |
<!-- /ANCHOR:specs -->

---

<!-- ANCHOR:scripts -->
## 7. Scripts

> Sub-Phase 1 (P0 fixes) modifies 3 existing files. Sub-Phases 2-5 create 5+ new modules across TS + Python.

### Sub-Phase 1 — P0 Fixes (modified)
| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts` | Updated | OK | P0-1 (lines 269-288 isAutoEdgeCreator) + P0-2 (lines 313-338 manual-edge guard) |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/consolidation.ts` | Updated | OK | P0-1 (lines 352-359 Hebbian gating) |
| `.opencode/skills/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts` | Updated | OK | P0-3 (lines 17-28 RetentionExpiredRow + lines 52-68 selectExpiredRows + sweep integration in lines 152-195) |

### Sub-Phase 2 — Shared Aggregation (created)
| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/feedback/feedback-aggregation.ts` | Created | PLANNED | Pure function reducer; weighted-positive formula |

### Sub-Phase 3 — Consumer A (Python; created + modified)
| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/feedback_reducer.py` | Created | PLANNED | JSONL reducer; aggregates by (intent_tag, path_class) |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/feedback_rerank_table.py` | Created | PLANNED | SQLite schema + cached lookup helper |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py` | Updated | OK | `_ranked_result()` applies clamped ±0.10 delta (lines 177-223) |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/indexer.py` | Cited | OK | `classify_path()` reuse (lines 53-91) |

### Sub-Phase 4 — Consumer B (TS; created + modified)
| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/feedback/session-trace-causal-reducer.ts` | Created | PLANNED | Reducer + DEFERRED-only invocation contract |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/consolidation.ts` | Updated | OK | Add end-of-cycle hook for Consumer B reducer (also touched in P0-1) |

### Sub-Phase 5 — Consumer C (TS; created + modified)
| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/feedback/feedback-retention-reducer.ts` | Created | PLANNED | Decision reducer per spec rules |
| `.opencode/skills/system-spec-kit/mcp_server/lib/feedback/edge-tier-basement.ts` | Created | PLANNED | Floor helper with narrow scope |
| `.opencode/skills/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts` | Updated | OK | Sweep integration consuming reducer decisions (also touched in P0-3) |

### Cited (read-only context)
| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts` | Cited | OK | Event schema + queries (lines 35-338) |
| `.opencode/skills/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts` | Cited | OK | Promotion-gate weekly-cycle pattern (lines 1-15, 421-494) |
| `.opencode/skills/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts` | Cited | OK | MAX_BOOST_DELTA=0.10 precedent (lines 34-48) |
| `.opencode/skills/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts` | Cited | OK | result_cited event source (lines 201-224) |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts` | Cited | OK | search_shown / result_cited logging (lines 1529-1598) |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/ccc-feedback.ts` | Cited | OK | Coco JSONL writer (lines 11-60) |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/feature_catalog/07--ccc-integration/02-ccc-feedback.md` | Cited | OK | "does not alter ranking immediately" contract (lines 22-32) |
| `.opencode/skills/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts` | Cited | OK | Constitutional/critical = null half-life (lines 185-303) |
| `.opencode/skills/system-spec-kit/mcp_server/lib/cognitive/importance-tiers.ts` | Cited | OK | Tier `decay: false` policy (lines 32-119) |
| `.opencode/skills/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts` | Cited | OK | Constitutional/critical = Infinity stability (lines 286-304) |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/causal-boost.ts` | Cited | OK | Causal boost downstream (lines 417-673) |
<!-- /ANCHOR:scripts -->

---

<!-- ANCHOR:tests -->
## 8. Tests

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/system-spec-kit/mcp_server/__tests__/storage/causal-edges-auto-provenance.vitest.ts` | Created | PLANNED | P0-1 verification |
| `.opencode/skills/system-spec-kit/mcp_server/__tests__/storage/insert-edge-manual-guard.vitest.ts` | Created | PLANNED | P0-2 verification |
| `.opencode/skills/system-spec-kit/mcp_server/__tests__/governance/retention-sweep-tier.vitest.ts` | Created | PLANNED | P0-3 verification + Sub-Phase 5 integration |
| `.opencode/skills/system-spec-kit/mcp_server/__tests__/feedback/aggregation.vitest.ts` | Created | PLANNED | Sub-Phase 2 — formula edge cases + idempotency |
| `.opencode/skills/system-spec-kit/mcp_server/__tests__/feedback/session-trace-causal.vitest.ts` | Created | PLANNED | Sub-Phase 4 — Consumer B reducer |
| `.opencode/skills/system-spec-kit/mcp_server/__tests__/feedback/retention-reducer.vitest.ts` | Created | PLANNED | Sub-Phase 5 — Consumer C reducer |
| `.opencode/skills/system-spec-kit/mcp_server/__tests__/feedback/edge-floor-narrow.vitest.ts` | Created | PLANNED | Sub-Phase 5 — floor scope (3 cases) |
| `.opencode/skills/mcp-coco-index/tests/test_feedback_reducer.py` | Created | PLANNED | Sub-Phase 3 — Consumer A reducer |
<!-- /ANCHOR:tests -->

---

<!-- ANCHOR:config -->
## 9. Config

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Updated | OK | 3 new flag families: `SPECKIT_COCOINDEX_FEEDBACK_RERANK`, `SPECKIT_SESSION_TRACE_CAUSAL_INFERENCE`, `SPECKIT_FEEDBACK_RETENTION_LEARNING` (+ `_MODE` sub-flag) |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/vector-index-schema.ts` | Updated | OK | Header documents `feedback_rerank_weights` table (Consumer A SQLite addition); also notes RetentionExpiredRow extension (P0-3) |
| `.opencode/skills/mcp-coco-index/feedback/search-feedback.jsonl` | Cited | OK | Read-only audit input for Consumer A reducer |
<!-- /ANCHOR:config -->

---

<!-- ANCHOR:author-notes -->
## Author Notes

- **Largest scope of 5 phases** — 28 files; 5 sub-phases; 3 P0 precondition fixes; 3 independent consumers.
- **Sub-Phase 1 ordering** — P0 fixes MUST land before Sub-Phases 4+5 (per ADR-002). Test discipline enforces ordering via the dedicated P0 fix test files.
- **Cross-language coordination** — Consumer A is Python-side (independent process); Consumers B+C are TS-side; Sub-Phase 2 aggregation is the shared seam for B+C only (Consumer A reads JSONL directly but uses shared formula).
- **Categories omitted (zero entries)**: Commands, Agents, Skills, Meta. New MCP tool `runSessionTraceReducer` is implementation detail of Consumer B; not a standalone command surface.
- **PLANNED entries** become OK during implementation; status updates per sub-phase.
- **No new feature catalog files needed** — existing `02-ccc-feedback.md` catalog entry is updated post-implementation to reflect that ranking IS now altered when flag enabled.
<!-- /ANCHOR:author-notes -->
