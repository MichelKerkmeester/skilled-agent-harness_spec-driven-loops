# 017 Scenario Validation Report

Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/005-cross-cutting-quality/001-playbook-quality-audit/003-scenario-expansion/`

Validation date: 2026-05-17

Active embedder source of truth: `vec_metadata`, not the database filename. `vec_metadata` reported `active_embedder_name=nomic-embed-text-v1.5` and `active_embedder_dim=768`.

## Summary

| Total | PASS | FAIL | SKIP |
|---:|---:|---:|---:|
| 18 | 10 | 8 | 0 |

## Full Results

| Scenario | Result | Root Cause | Observation |
|---|---|---|---|
| 03/015 | PASS | NONE | `session_bootstrap` returned reader-ready context plus degraded graph guidance and next actions. |
| 03/016 | PASS | NONE | Resume-mode context for the 016 phase parent surfaced active child continuity docs. |
| 03/017 | PASS | NONE | `session_health` returned shared health/readiness payload and actionable code-graph guidance. |
| 04/279 | PASS | NONE | Retention dry-run swept 0 rows; before/after memory counts stayed at 7735. |
| 16/281 | PASS | NONE | `embedder_list` showed 8 embedders and active `nomic-embed-text-v1.5` at 768 dimensions. |
| 16/282 | FAIL | IMPLEMENTATION_GAP | `embedder_set` has no `dryRun` flag, so a safe valid-provider switch preview cannot be invoked. |
| 16/283 | FAIL | IMPLEMENTATION_GAP | `embedder_status` reports idle/not_found job state only, not active embedder metadata. |
| 17/274 | PASS | NONE | Council graph upsert/status/hot-node query returned the validation nodes and edge. |
| 17/275 | PASS | NONE | Empty council graph convergence returned `STOP_BLOCKED` with an empty-graph blocker. |
| 17/276 | PASS | NONE | Deep-loop graph upsert/status/hot-node query returned the validation nodes and edge. |
| 17/277 | PASS | NONE | Empty deep-loop convergence returned insufficient-data guidance without throwing. |
| 17/278 | FAIL | SCENARIO_BUG | `/tmp` ingest fixture path is rejected by the configured memory-roots policy. |
| 07/028 | FAIL | SCENARIO_BUG | `eval_run_ablation` exposes no dataset or dry-run selector for an empty-dataset scenario. |
| 07/029 | PASS | NONE | Evaluation dashboard returned explicit empty-state counts with zero eval runs and snapshots. |
| 06/027 | FAIL | SCENARIO_BUG | `memory_causal_stats` exposes no `scope`; it returned global non-empty causal stats. |
| 24/402 | FAIL | FIXTURE_DRIFT | Synonymous memory/code pairs missed overlap and canonical-target thresholds. |
| 24/408 | FAIL | FIXTURE_DRIFT | Compound CocoIndex query found factory/cascade artifacts but missed required constituents in top 5. |
| 24/409 | FAIL | FIXTURE_DRIFT | LLM-made memory recall reached 5/10 top-3, below the 8/10 pass threshold. |

## Root-Cause Distribution

| Root Cause | Count |
|---|---:|
| NONE | 10 |
| SCENARIO_BUG | 3 |
| IMPLEMENTATION_GAP | 2 |
| FIXTURE_DRIFT | 3 |
| THRESHOLD_TOO_TIGHT | 0 |

## Failure Details

| Scenario | Recommendation |
|---|---|
| 16/282 | Handler follow-on: add a true `dryRun` path to `embedder_set` that validates provider availability and reports projected actions without queuing reindex work. |
| 16/283 | Handler follow-on: extend `embedder_status` with active pointer metadata from `vec_metadata`, while keeping job status fields. |
| 17/278 | Scenario fix: place the ingest fixture under an allowed memory root or explicitly document the expected policy rejection. |
| 07/028 | Scenario fix: remove the nonexistent dataset selector expectation, or add a handler-supported empty fixture path if the behavior is still desired. |
| 06/027 | Scenario fix: update the contract to global causal stats, or add a scoped stats handler before testing empty-scope behavior. |
| 24/402 | Fixture/retrieval follow-on: recalibrate synonym pairs against the current mirrored skill-tree corpus and canonical path normalization. |
| 24/408 | Fixture/retrieval follow-on: recalibrate expected constituents or improve CocoIndex dedup/path canonicalization so mirrored factory hits do not crowd out required paths. |
| 24/409 | Fixture/retrieval follow-on: refresh the 10-query recall fixture against the current Nomic active index; all target IDs exist and have `embedding_status=success`, but only 5/10 reached top 3. |

## Cat-24 Repaired Scenarios

The three repaired cat-24 scenarios did not all pass at their new thresholds:

| Scenario | Threshold Check | Result |
|---|---|---|
| 24/402 | 4 synonymy pairs at calibrated overlap/canonical-target thresholds | FAIL |
| 24/408 | Compound query requires at least 2/4 constituents top 3 and 3/4 top 5 | FAIL |
| 24/409 | Memory recall requires at least 8/10 expected IDs in top 3 | FAIL |

## Implementation Gaps for Follow-On Packet

`16/282` and `16/283` are real implementation gaps:

- `embedder_set` needs a dry-run validation mode that is safe for valid provider names.
- `embedder_status` needs to expose the active embedder pointer from `vec_metadata`, not just async job state.

The active pointer itself is healthy: `nomic-embed-text-v1.5`, dimension `768`.
