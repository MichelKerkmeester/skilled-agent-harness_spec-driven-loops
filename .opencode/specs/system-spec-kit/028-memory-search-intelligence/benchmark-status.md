# 028 Benchmark Status (DoD criterion 4) + remaining cleanup (criterion 6)

Actionable record of the two open 028 completion items. Everything else (37 phases, all 42 sub-phases
built-or-gated, schema cluster, NO-GO, narrative docs, full changelog polish, 8/9 release-cleanup) is
committed and pushed.

## Criterion 4 — eval-harness benchmark pass: RUN (resolved)

RESOLVED. The golden set was regenerated as a live-DB-aligned known-item benchmark (60 queries, 137
labels, 0 missing; the old curated set is backed up to `ground-truth.curated.bak.json`). The harness ran
on it via the `lib/eval` ablation framework and produced channel Recall@20 deltas (baseline ~0.46, some
channels contributing +0.09 to +0.26) plus per-flag deltas. No default-off flag earned a flip: the flags
exercised by the Recall@20 hybrid path are flat; the rest live in paths this harness does not exercise
(memory_context, temporal-edge, write-time, maintenance, off-turn, confidence/display) so stay
conservatively default-off pending path-specific evals. Reusable helpers landed in `scripts/evals/`
(generate-known-item-ground-truth, run-retrieval-flag-eval, assert-ground-truth-alignment). Remaining
deployment note: the running daemon caches the golden set at init, so the MCP `eval_run_ablation` entry
point serves the old set until the daemon is reloaded (the lib path is authoritative and is aligned).

Original diagnosis (now fixed), for the record:

The eval-harness and its gate-zero guard work as designed. `eval_run_ablation` correctly refused to
score and named the remediation. Root cause, confirmed by direct inspection:

- The golden set is STATIC and hand-curated: `mcp_server/lib/eval/data/ground-truth.json` mirrors
  `GROUND_TRUTH_QUERIES` + `GROUND_TRUTH_RELEVANCES` in `lib/eval/ground-truth-data.ts`.
  `generateGroundTruth()` just returns that static data; it does NOT derive labels from the live DB.
- Its relevance `memoryId`s reference parent IDs that have turned over: they resolve against
  `memory_history` (99/50 sampled) but only 1/50 against the active `memory_index` (20,050 rows).
- Net: 0 of 110 queries align with the current index. `scripts/map-ground-truth-ids.js --write` runs
  but rewrites nothing (no current targets to map to). There is no aligned subset to benchmark.

Remediation (deliberate data + judgment work, NOT implementation):
1. Re-curate `GROUND_TRUTH_RELEVANCES` against the live DB (assign each query its now-relevant
   `memory_index` IDs), or fix `map-ground-truth-ids.ts` to remap old->current by content/embedding.
2. Re-run `eval_run_ablation` (requires `SPECKIT_ABLATION=true`, already honored by the daemon).
3. Review the channel + C9 deltas, then flip ONLY the default-off flags whose own metric improves.
   Flipping memory-retrieval behavior defaults on a benchmark of unknown validity is high-blast and
   was deliberately NOT done; default-off is the correct conservative interim state.

Default-off flags awaiting per-flag benchmark evidence (registered in `tests/flag-ceiling.vitest.ts`):
SPECKIT_BITEMPORAL_RECALL, SPECKIT_AGENTIC_RECALL, SPECKIT_EDGE_PRESENCE_CURRENTNESS, plus the
derived-id / retention / semantic-edge / procedural / sleeptime / calibration flags from phases
009/011/017/012/018/020, and the advisor SPECKIT_ADVISOR_* shadow flags.

## Criterion 6 — release-cleanup: 8/9, two items blocked on a concurrent session

Done: 001, 002, 003 (skills subset), 004, 005, 007, 008, 009. Open:
- 006-commands: a concurrent session has the command docs (and deep-research, rrf-fusion.ts, .gitignore)
  dirty/uncommitted. Run after that session commits.
- 003's deep-research subset: the same concurrent session owns those SKILL.md/references/assets; the
  agent's overstep edits there were left uncommitted for reconciliation, not swept in.

These are external/coordination blockers, not implementation gaps.
