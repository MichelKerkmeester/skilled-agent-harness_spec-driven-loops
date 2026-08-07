# Iteration 12: Round E Verify+Feasibility — Deep Loop Resilience/Observability Remainder

## Focus
Round E verify+feasibility for the iter-7/9 resilience+observability remainder. Read-only.

## Assessments (newInfoRatio 0.50)
| Candidate | Real | Feasibility | Note |
|---|---|---|---|
| DL-idempotent-self-resume | PARTIAL | **NO-GO** | runtime is a fire-and-exit BATCH orchestrator (fanout-run.cjs process.exit per run), NOT a long-lived self-prompting daemon; "self-prompt cleared after delivery" presumes a persistent self-prompt queue that does not exist — greenfield, wrong substrate |
| DL-graceful-self-stop | PARTIAL | **GO** | "empty-tick = valid" is REAL (fanout-run.cjs:370-373 + pool:155-159). But "mid-tick preserves in-flight" is REFUTED — SIGINT/SIGTERM exit 130/143 with no-op cleanup (:354) kills children with no drain/salvage; fix = flush a partial summary with a "stopped" marker so it isn't read as success |
| DL-failure-class-taxonomy | PARTIAL | **GO** | timeout-vs-exit IS computed upstream (fanout-run.cjs:472-491) but FLATTENED in settleItem (pool:100-117 keeps only {name,message}); class survives only as message substring; fix = stop discarding props + add a class rollup in buildPoolSummary (low effort) |
| DL-progress-heartbeat | PARTIAL | NEEDS-BENCHMARK | per-item started/completed/failed events exist (orchestration-status.log); no periodic heartbeat WITHIN a long single lineage; benchmark whether long-lineage stalls are real pain before a timer-emitter; the shutdown-summary half is GO |

## Key correction
The deep-loop is a **fire-and-exit batch orchestrator** (not a daemon) — so idempotent-self-resume is the wrong-substrate NO-GO. Two clean GOs: **graceful-self-stop** (flush a "stopped"-marked partial summary on signal — today children die silently) and **failure-class-taxonomy** (the timeout/exit class is computed then discarded before the summary — un-flatten it).

## Next Focus
Deep-loop resilience: graceful-self-stop + failure-class-taxonomy are clean low-effort GOs (both fix data that's computed-then-discarded); self-resume is wrong-substrate. Feeds synthesis.
