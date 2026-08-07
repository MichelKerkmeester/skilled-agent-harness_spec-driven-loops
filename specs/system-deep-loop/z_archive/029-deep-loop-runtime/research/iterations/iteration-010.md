# Iteration 10: Round C Feasibility — Deep Loop Determinism + Recovery + STOP

## Focus
Round C feasibility for DL-order-independent-merge-tiebreak, DL-orphan-lineage-reset, D3-stop-additive, DL-pool-backlog-gauges + the two blocking questions (stable ordering key? durable in-flight marker?). Read-only.

## Feasibility verdicts (newInfoRatio 0.80)
| Candidate | Verdict | Note |
|---|---|---|
| DL-pool-backlog-gauges | **GO** (lowest-blast; do first) | read-derived from the existing `orchestration-status.log` event stream; proves the ledger read-path |
| DL-order-independent-merge-tiebreak | **GO** (sort by `id` + `labelDirs.sort()`) | the merge reads `fs.readdirSync` in RAW FS order with no `.sort()` (:335); add 2 sorts; pure output-ordering, revert-by-deletion |
| DL-orphan-lineage-reset | **GO detect / CAUTION auto-redispatch** | durable marker exists (started-minus-terminal in orchestration-status.log) + salvage path; but NO lease/heartbeat/TTL → crashed vs slow-but-live indistinguishable; add a lease/heartbeat before auto-reset; dedup-by-id absorbs a double-dispatch |
| D3-stop-additive | **GO structurally / NEEDS-BENCHMARK threshold** | add a `distinctReliableSourceCount` blocking_guard trace entry + blocker mirroring sourceDiversity (:207-209); STOP aggregator needs no change; risk = double-blocking overlap with sourceDiversity |

## Blocking questions — answered
- **Q1 (ordering key):** identity key `finding.id` (fallback title) is always present (used for dedup) → sufficient minimal tiebreak with ZERO new data; richer first-discovered order needs `node.iteration` threaded up from coverage-graph (larger).
- **Q2 (durable in-flight marker):** YES — `orchestration-status.log` appends `started`/`completed`/`failed` per lineage (label+index); a `started` with no terminal = orphan, detectable lock-free. CAVEAT: derived, not an explicit `status:in_flight`; no lease/heartbeat → add one to safely auto-re-dispatch.

## Sequencing
(1) pool-backlog-gauges [proves ledger read-path] + order-independent-merge [parallel, GO] → (2) orphan-lineage-reset [detect-only first; lease/heartbeat before auto-redispatch] → (3) D3-stop-additive [benchmark the threshold + reliability classifier vs sourceDiversity].

## Next Focus
order-independent-merge is a near-free determinism GO (2 sorts) — part of the cross-system determinism spine. Open: lease/heartbeat-TTL vs detect-and-report-only for orphan reset; D3 AND-vs-replace sourceDiversity.
