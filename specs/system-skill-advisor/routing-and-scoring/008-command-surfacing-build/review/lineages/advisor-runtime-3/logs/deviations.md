# Lineage Deviations and Boundary Records

Recorded by the executor for the `advisor-runtime-3` fan-out lineage.

- `steer.md` did not exist at init, before any iteration, or at the final read. No lead ruling was available; the dispatch prompt and the reviewed files governed.
- Phase save was not run. The dispatch forbids `generate-context.js`, and the lineage has no packet continuity target outside its own folder. Continuity for this lineage is its state log, strategy, report and registry.
- The coverage-graph seed step was skipped. `.skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs` writes under the spec folder, which is outside this lineage's write surface. The iteration records carry `graphEvents` (valid node kinds and edge relations) so the reducer still receives the graph.
- `resource_map.md` is absent and `resource_map.emit` is false in this lineage config, so the Resource Map Coverage Gate is skipped.
- `validate.sh` was not run: the dispatch forbids it, and the lineage's completion evidence is its artifacts plus the append-gateway receipts.
- `AC_COVERAGE` is reported as `disabled` in the synthesis report because the validation signal was not evaluated; no acceptance-coverage claim is made.
- The loop reached the config ceiling of 4 iterations. Iteration 4 covers traceability and maintainability together because those were the last two dimensions; the terminal record carries `stopReason: maxIterationsReached`.
- Root-level review files (`review/deep-review-findings-registry.json`, `review/orchestration-summary.json`, `review/fanout-attribution.md`, `review/observability-events.jsonl`, `review/review-report.md`) were not written by this lineage. Their timestamps predate this run or their producer is `fanout-run` in `observability-events.jsonl`; this lineage wrote only under `review/lineages/advisor-runtime-3/`.
- The sealed holdout file was checked only with `git diff --numstat`, which printed `0 1`. No row text was opened, printed or diffed.
