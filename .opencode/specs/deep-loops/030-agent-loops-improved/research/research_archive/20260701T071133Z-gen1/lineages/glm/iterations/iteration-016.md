# Iteration 016: Safety/Observability Hardening Recommendations Beyond Known Leads

## Focus
- Scope: New hardening recommendations beyond the known leads — fan-out pool stall watchdog, observability envelope gaps, lineage merge safety
- Question: What additional safety/observability improvements are needed?

## Findings

### F-016: Four new safety/observability hardening recommendations

**Severity: Medium (proactive hardening, not live bugs)**

**R-1: Fan-out stall watchdog lacks operator-visible alerting**

The `fanout-pool.cjs` implements stall detection with `abort-requeue` action (line 30, 108, 367-395). However, the stall signal is logged but not surfaced to the operator's terminal dashboard. An operator watching a fan-out run sees no indication that a lineage was stalled and requeued.

[SOURCE: `fanout-pool.cjs:367-460`]

Recommendation: Emit an `observability_event` with `label: "fanout"` and `event: "stall_requeued"` when a lineage slot stalls, so it appears in the unified observability envelope and dashboard.

**R-2: Lineage merge step has no conflict detection for overlapping findings**

When multiple review lineages (codex + glm) produce findings against the same spec folder, the merge step (`step_fanout_merge`) combines registries. But there is no deduplication or conflict detection — if both lineages find the same issue with different IDs and severities, the merged registry contains duplicates. The GLM registry already shows `P1-011-001` ("Leaf-only GLM lineage skipped by registry-only fan-out merge"), suggesting the merge path has known gaps.

[SOURCE: `review/lineages/glm/deep-review-findings-registry.json` P1-011-001]

Recommendation: Add a `step_merge_dedup` that normalizes findings by file+line+title similarity and merges duplicates, preserving the higher severity and combining evidence.

**R-3: No per-lineage cost/token budget enforcement**

Each fan-out lineage runs independently with no aggregate cost cap. An operator running 3 lineages at 50 iterations each with a high-reasoning model has no guardrail against excessive token consumption. The `computeLineageTimeoutMs` caps wall-clock but not token/cost budget.

[SOURCE: `fanout-run.cjs:884-887` (only wall-clock cap exists)]

Recommendation: Add an optional `--max-tokens-per-lineage` flag and a `config.maxTokenBudget` that the executor checks per iteration. When exceeded, the lineage synthesizes with whatever it has.

**R-4: Observability events normalize lag-ceiling actions to "unknown" status**

GLM review finding P2-009-001 ("Lag-ceiling observability events normalize to unknown status") indicates that when `lagCeilingAction` triggers, the observability event records `status: "unknown"` instead of `status: "requeued"` or `status: "aborted"`. This makes it impossible to distinguish a stall-requeue from a genuine unknown failure in the event log.

[SOURCE: `review/lineages/glm/deep-review-findings-registry.json` P2-009-001]

Recommendation: Map `lagCeilingAction` outcomes to explicit statuses in the observability envelope normalizer.

## Novelty Justification
All four recommendations are new beyond the known leads. R-1 and R-3 are original analysis of the fan-out infrastructure. R-2 is derived from P1-011-001 but extends it with a concrete merge-dedup proposal. R-4 confirms P2-009-001 is still open and connects it to the observability envelope normalizer.

## What Was Tried and Failed
- Checked if `--max-tokens` existed as a flag (it does not)

## Ruled-Out Directions
- These are hardening recommendations, not live bugs (except R-4 which confirms a known P2)
