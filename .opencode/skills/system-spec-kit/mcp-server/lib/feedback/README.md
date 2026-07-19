---
title: "Feedback: Shadow Signal Processing"
description: "Implicit feedback logging, ranking metrics and shadow-evaluation helpers."
trigger_phrases:
  - "implicit feedback"
  - "feedback ledger"
---

# Feedback: Shadow Signal Processing

## 1. OVERVIEW

`lib/feedback/` owns shadow feedback capture and evaluation for memory search behavior. It records implicit events, tracks query flow, calculates rank metrics and runs side-effect-free replay checks before any ranking changes are promoted elsewhere.

Current state:

- Feedback writes are shadow-only and must not interrupt search or save operations.
- Ranking metrics are computed from logged activity and replayed result sets.
- Scheduled shadow evaluation builds a privacy-preserving synthetic corpus from non-reversible telemetry signals (intent, coarse result-count bucket, counted query hash) and compares live and proposed ranks. No raw query text is stored or reconstructable.

## 2. ARCHITECTURE

```text
search or save event
    │
    ▼
feedback-ledger.ts
    │
    +--> query-flow-tracker.ts
    +--> batch-learning.ts
    │
    ▼
rank-metrics.ts
    │
    ▼
shadow-scoring.ts
    │
    ▼
shadow-evaluation-runtime.ts
    │
    +--> shadow-replay-corpus.ts   # synthetic corpus from non-reversible signals
    +--> replay-seed-vocab.ts      # static intent seed vocabulary
```

## 3. DIRECTORY TREE

```text
feedback/
+-- batch-learning.ts              # Batch processing for feedback signals
+-- edge-tier-basement.ts          # Staged edge retention-floor policy (tests-only, not yet wired live)
+-- feedback-ledger.ts             # SQLite event table and write helpers
+-- feedback-retention-reducer.ts  # Conservative retention decisions from batch feedback summaries
+-- query-flow-tracker.ts          # Query reformulation and flow tracking
+-- rank-metrics.ts                # Ranking metric calculations
+-- replay-seed-vocab.ts           # Stable re-export of the static intent seed vocabulary
+-- session-trace-causal-reducer.ts # Deferred ledger traces into weak causal links (offline)
+-- shadow-evaluation-runtime.ts   # Scheduled shadow replay runtime
+-- shadow-replay-corpus.ts        # Privacy-preserving synthetic replay corpus builder
+-- shadow-scoring.ts              # Shadow scoring and cycle reports
+-- true-citation-emitter.ts       # Shadow used / shown-but-not-used citation-pair emitter (flag-gated)
`-- README.md                      # Folder orientation
```

## 4. KEY FILES

| File | Responsibility |
|---|---|
| `feedback-ledger.ts` | Initializes `feedback_events`, resolves confidence tiers and logs implicit events behind `SPECKIT_IMPLICIT_FEEDBACK_LOG`. |
| `query-flow-tracker.ts` | Tracks query changes that imply satisfaction or dissatisfaction signals. |
| `rank-metrics.ts` | Computes ranking measures over live and shadow result sets. |
| `batch-learning.ts` | Groups signal processing work for batch runs. |
| `shadow-scoring.ts` | Selects holdout queries and builds shadow evaluation reports. |
| `shadow-evaluation-runtime.ts` | Schedules weekly replay, builds a synthetic corpus via `shadow-replay-corpus.ts`, runs side-effect-free search configs and tunes adaptive thresholds after evaluation. |
| `shadow-replay-corpus.ts` | Builds a privacy-preserving synthetic replay corpus from non-reversible telemetry signals so the shadow-evaluation cycle no longer skips for lack of a replay pool. Includes a fail-closed privacy guard; no raw query text is stored or reconstructable. |
| `replay-seed-vocab.ts` | Stable re-export of the static intent seed vocabulary used by corpus generation. |
| `edge-tier-basement.ts` | Defines the edge retention-floor policy that keeps edge-derived floors aligned with retrieval tier caps. Staged: consumed by unit tests only, not yet wired into the retention sweep. |
| `feedback-retention-reducer.ts` | Computes conservative retention decisions (`delete`, `extend`, `protect`) from batch feedback summaries. |
| `session-trace-causal-reducer.ts` | Converts deferred feedback-ledger session traces into weak (strength 0.3) causal links. Not invoked by any live feedback-logging path. |
| `true-citation-emitter.ts` | Mines shown memory IDs that reappear in later assistant output (used) versus those that do not (shown-but-not-used) into a separate shadow ledger of citation pairs. Never touches ranking; flag `SPECKIT_TRUE_CITATION_EMITTER`, default off. |

## 5. BOUNDARIES AND FLOW

This folder may read and write feedback tables. It may run replay searches through the search pipeline when configured for shadow evaluation.

It should not directly change live ranking behavior, rewrite memory records or own user-facing search response formatting.

Main flow:

```text
implicit event
    -> logFeedbackEvent or logFeedbackEvents
    -> metrics and query-flow analysis
    -> holdout replay
    -> ShadowEvaluationReport
    -> adaptive proposal outside this folder
```

## 6. ENTRYPOINTS

| Export | File | Purpose |
|---|---|---|
| `logFeedbackEvent` | `feedback-ledger.ts` | Record one implicit feedback event. |
| `logFeedbackEvents` | `feedback-ledger.ts` | Record a batch of events for one interaction. |
| `initFeedbackLedger` | `feedback-ledger.ts` | Ensure feedback tables and indexes exist. |
| Shadow evaluation runtime exports | `shadow-evaluation-runtime.ts` | Start and execute scheduled shadow replay cycles. |
| Metric helpers | `rank-metrics.ts` | Score live and shadow ranked lists. |

## 7. VALIDATION

Run from the repository root:

```bash
python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/system-spec-kit/mcp-server/lib/feedback/README.md
```

## 8. RELATED

- `../search/README.md`
- `../../handlers/README.md`
