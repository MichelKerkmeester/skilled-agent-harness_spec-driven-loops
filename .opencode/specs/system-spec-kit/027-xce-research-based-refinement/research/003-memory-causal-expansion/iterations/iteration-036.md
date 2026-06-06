---
iteration: 036
rq: RQ-N7
phase_target: 008-learning-feedback-reducers
newInfoRatio: 0.72
verdict: ADAPT
---

# Iteration 036 — RQ-N7: 008-learning-feedback-reducers Sub-Phase Decomposition

## Research Question

What sub-phases should `008-learning-feedback-reducers` spawn? Specifically: (A) isolate P0 correctness fixes into the earliest sub-phase, (B) gate learning reducer consumers on P0 correctness + eval evidence, (C) reuse `relation-coverage.ts` and `stage4-filter.ts` infrastructure.

---

## Context Recovery

The pt-04 audit (`research/027-xce-research-pt-04/research.md:L28-L29`) gave a REVISE_SCOPE verdict for what was then numbered "Phase 009 — Learning Feedback Reducers" (now `008-learning-feedback-reducers`). The specific finding:

> "P0 fixes should not wait on eval. Recommendation: split P0 correctness fixes from learning reducers."
> — `research/027-xce-research-pt-04/research.md:L29`

The pt-04 audit also cited three live infrastructure pieces that are directly reusable:
- `ccc-feedback.ts:L29-L60` — append-only JSONL feedback log (the P0 correctness surface)
- `relation-coverage.ts:L36-L45` — causal graph health targets (reusable in session-trace reducer)
- `stage4-filter.ts:L64-L80` — state/tier limits in search pipeline (reusable in retention reducer)

However, an important discrepancy emerged during this research: the current `008-learning-feedback-reducers/spec.md` (`008-learning-feedback-reducers/spec.md:L37-L38`) already maps its hard dependency to `002-memory-write-safety`, NOT to a child sub-phase named "P0 correctness fixes." The spec's metadata reads:

> `Hard Dependency: system-spec-kit/027-xce-research-based-refinement/002-memory-write-safety`
> — `008-learning-feedback-reducers/spec.md:L37`

This means the P0 correctness split prescribed by pt-04 has already been resolved architecturally: the correctness fixes live in sibling packet `002-memory-write-safety`, not as a child of 008.

---

## Findings

### F-036-001 — Current child decomposition already implements the pt-04 split correctly

The current `008-learning-feedback-reducers/spec.md:L55-L63` phase map shows five children:

| Child | Title | Depends-on | LOC est |
|-------|-------|-----------|---------|
| `001-aggregator` | Shared feedback aggregation | `002-memory-write-safety` (hard) | ~70 |
| `002-coco-rerank-consumer` | CocoIndex feedback reducer (Python) | `001-aggregator` | ~370 |
| `003-causal-reducer` | session-trace causal reducer (TS) | `001-aggregator` | ~265 |
| `004-retention-reducer` | feedback retention reducer (TS) | `001-aggregator` | ~385 |
| `005-env-tests-integration` | ENV flags + integration tests | `001-003-004` | ~100 |

Source: `008-learning-feedback-reducers/spec.md:L57-L63`

The `001-aggregator` child reads `feedback_events` from the ledger (`008-learning-feedback-reducers/001-aggregator/spec.md:L50`) and depends directly on `002-memory-write-safety` being landed first. This satisfies pt-04's requirement that P0 correctness fixes not wait on eval — they are owned by a separate sibling packet that is a hard dependency for the aggregator.

**Verdict: ADAPT** — the five-child decomposition already correctly isolates P0 correctness (sibling `002`) from learning reducers (children `001-005`). No new sub-phase split is needed. However, the decomposition requires two amendments detailed below.

### F-036-002 — relation-coverage.ts is directly reusable in 003-causal-reducer

`relation-coverage.ts:L36-L45` defines `DEFAULT_RELATION_TARGETS` covering `caused`, `supports`, `contradicts`, `supersedes`, `produced`, and `cited_by` relations with minimum share/count thresholds. The session-trace causal reducer (`008-learning-feedback-reducers/003-causal-reducer`) will emit new causal edges from session trace data. Before writing, the reducer should check whether the target relation type is already above its minimum share to avoid redundant edges.

Source: `mcp_server/lib/causal/relation-coverage.ts:L36-L45`

The `003-causal-reducer` spec should add a task: validate candidate edges against `checkRelationCoverage()` before insertion, returning early when the relation is at or above its `minimumShare` floor. This adds ~20 LOC to the reducer.

### F-036-003 — stage4-filter.ts tier limits are reusable in 004-retention-reducer

`stage4-filter.ts:L64-L80` defines `STATE_LIMITS` — hard caps per memory state: HOT=50, WARM=30, COLD=20, DORMANT=10, ARCHIVED=5. The `UNKNOWN_STATE_PRIORITY = 6` comment (`stage4-filter.ts:L77-L79`) explicitly notes that the `memoryState` column does not yet exist and all memories are UNKNOWN. This is the P0 correctness surface the pt-04 referred to as "retention tier-basement correctness."

Source: `mcp_server/lib/search/pipeline/stage4-filter.ts:L64-L80`

The `004-retention-reducer` should import these constants rather than re-derive tier priorities, ensuring the retention reducer's decisions stay consistent with the pipeline's filtering behavior. This is an infrastructure reuse opportunity, not a new feature.

### F-036-004 — ccc-feedback.ts is no longer present in mcp_server at the expected path

The pt-04 research cited `ccc-feedback.ts:L29-L60` as the append-only JSONL handler for the `ccc_feedback` MCP tool. This file is absent from the current `mcp_server/` directory tree at any path. Cross-referencing the stress-test evidence confirms the `ccc_feedback` tool was listed as "missing" from the registered tool count (`008-spec-memory-mcp-stress-test/evidence/playbook-results.jsonl:L115`).

The current feedback infrastructure lives entirely in `mcp_server/lib/feedback/feedback-ledger.ts` (SQLite-backed, 349 LOC) and `batch-learning.ts` (530 LOC), not in an append-only JSONL handler. The `feedback_events` SQLite table (`feedback-ledger.ts:L115-L137`) replaces what `ccc-feedback.ts` provided.

**Implication:** The 008-learning-feedback-reducers decomposition should be anchored to `feedback-ledger.ts` (the current source of `feedback_events`) rather than to any JSONL file path. The `001-aggregator/spec.md:L50` already correctly references `feedback_events` as the source table, not a JSONL file.

### F-036-005 — eval gating is correctly handled by soft dependency on 006

The `008-learning-feedback-reducers/spec.md:L38` lists `028/004-code-graph-adoption-eval, 028/006-coco-intent-steering` as soft dependencies. The pt-04 audit noted that the soft dependency on 006 (eval) is reasonable, but P0 fixes must not wait on it. Since P0 fixes are now in sibling packet `002-memory-write-safety` (hard dep), and the learning reducers softly depend on eval, the gating structure is correct.

Source: `008-learning-feedback-reducers/spec.md:L38`

---

## Recommended Sub-Phase Decomposition (ADAPT)

The existing five-child layout is correct. Two amendments are recommended:

**Amendment A — 003-causal-reducer scope addition (~+20 LOC)**
Add: "Check candidate edges against `relation-coverage.ts` `DEFAULT_RELATION_TARGETS` before insertion; skip edges whose relation type is already at or above its `minimumShare` floor."
Cite: `mcp_server/lib/causal/relation-coverage.ts:L36-L45`

**Amendment B — 004-retention-reducer infrastructure reuse (~+5 LOC)**
Add: "Import `STATE_LIMITS` from `stage4-filter.ts` rather than redeclaring tier priority constants; the reducer's tier-basement decay decisions must stay consistent with pipeline filter caps."
Cite: `mcp_server/lib/search/pipeline/stage4-filter.ts:L64-L80`

**No new sub-phase is needed.** The pt-04 split is already implemented via the sibling `002-memory-write-safety` dependency. The five existing children are the correct decomposition.

| Sub-phase | Title | Depends-on | LOC estimate | P-priority |
|-----------|-------|-----------|-------------|-----------|
| `001-aggregator` | Shared feedback-aggregation.ts | `002-memory-write-safety` (hard) | ~70 | P0 |
| `002-coco-rerank-consumer` | CocoIndex `feedback_rerank_weights` (Python) | `001-aggregator` | ~370 | P1 |
| `003-causal-reducer` | session-trace causal reducer + relation-coverage guard | `001-aggregator` | ~285 (+20) | P1 |
| `004-retention-reducer` | feedback retention reducer + STATE_LIMITS reuse | `001-aggregator` | ~390 (+5) | P1 |
| `005-env-tests-integration` | ENV_REFERENCE flags + integration tests | `001`, `002`, `003`, `004` | ~100 | P2 |

Source evidence for table: `008-learning-feedback-reducers/spec.md:L55-L76`, `relation-coverage.ts:L36-L45`, `stage4-filter.ts:L64-L80`, `batch-learning.ts:L34-L51`

---

## Summary

The `008-learning-feedback-reducers` phase parent already implements the pt-04 REVISE_SCOPE recommendation correctly: P0 correctness fixes are in sibling packet `002-memory-write-safety` (hard dependency), and all five learning reducer children are gated on that landing. The `ccc-feedback.ts` JSONL handler referenced in pt-04 has been superseded by the SQLite-backed `feedback-ledger.ts`. Two targeted amendments to `003-causal-reducer` and `004-retention-reducer` specs are recommended to make `relation-coverage.ts` and `stage4-filter.ts` reuse explicit.
