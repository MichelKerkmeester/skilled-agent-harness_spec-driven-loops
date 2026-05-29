# Iteration 009 - Correctness Cross-Cutting Integration

## Dimension

correctness

Focus: end-to-end `model-benchmark` path and journal integration: `loop-host --mode=model-benchmark` -> materialize -> `run-benchmark` -> `promote-candidate`; plus the scorer route that could connect `loop-host`/`run-benchmark` to `score-model-variant`.

## Files Reviewed

- `.opencode/skills/deep-agent-improvement/scripts/loop-host.cjs:58`
- `.opencode/skills/deep-agent-improvement/scripts/loop-host.cjs:73`
- `.opencode/skills/deep-agent-improvement/scripts/run-benchmark.cjs:114`
- `.opencode/skills/deep-agent-improvement/scripts/run-benchmark.cjs:274`
- `.opencode/skills/deep-agent-improvement/scripts/run-benchmark.cjs:323`
- `.opencode/skills/deep-agent-improvement/scripts/dispatch-model.cjs:118`
- `.opencode/skills/deep-agent-improvement/scripts/dispatch-model.cjs:173`
- `.opencode/skills/deep-agent-improvement/scripts/promote-candidate.cjs:168`
- `.opencode/skills/deep-agent-improvement/scripts/promote-candidate.cjs:193`
- `.opencode/skills/deep-agent-improvement/scripts/score-candidate.cjs:430`
- `.opencode/skills/deep-agent-improvement/scripts/score-candidate.cjs:622`
- `.opencode/skills/deep-agent-improvement/scripts/reduce-state.cjs:608`
- `.opencode/skills/deep-agent-improvement/scripts/reduce-state.cjs:889`
- `.opencode/skills/deep-agent-improvement/scripts/reduce-state.cjs:1094`
- `.opencode/skills/deep-agent-improvement/scripts/tests/loop-host.vitest.ts:44`
- `.opencode/skills/deep-agent-improvement/scripts/tests/scorer.vitest.ts:50`
- `.opencode/specs/skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/002-implementation-deep-research/research/research.md:84`
- `.opencode/specs/skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/003-build-benchmark-mode/spec.md:95`
- `.opencode/specs/skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/003-build-benchmark-mode/spec.md:112`
- `.opencode/specs/skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/003-build-benchmark-mode/spec.md:126`
- `.opencode/specs/skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/003-build-benchmark-mode/spec.md:133`

## Findings by Severity

### P0

None.

### P1

#### DR-009-P1-001 [P1] Reducer/dashboard do not surface the new `mode` metadata required by the mode-field integration

- File: `.opencode/skills/deep-agent-improvement/scripts/reduce-state.cjs:608`
- Claim: The record writers add `mode`, but the reducer/dashboard integration still does not pass mode into reduced metadata or display it, despite the build spec making `reduce-state.cjs` mode metadata pass-through and dashboard display an in-scope requirement.
- Evidence: The spec lists "`mode` field on all state records; mode-aware `promote-candidate.cjs`; `reduce-state.cjs` metadata pass-through" in scope at `spec.md:95`, and the file-change table specifically requires "`mode` metadata pass-through + dashboard display" at `spec.md:112`. The active reducer branches on `benchmark_run` at `reduce-state.cjs:608`, stores records and counts, then renders the profile dashboard at `reduce-state.cjs:889` through `reduce-state.cjs:901` without showing `record.mode` or a per-mode field. The static dashboard text still says "All targets evaluated via dynamic mode" at `reduce-state.cjs:1094`, which is no longer true once `model-benchmark` records exist.
- Counterevidence sought: Searched the reducer for `record.mode`, `mode:`, `benchmark_run`, dashboard rendering, and metadata references. The only `mode` hits were the local failure-mode loop variable and stale dynamic-mode text; no dashboard or reduced-profile mode field was found. The raw record is preserved as `latestRecord`/`benchmarkRuns`, so this is not a loss of the original JSONL field, but it does miss the promised reduced metadata/dashboard integration.
- Alternative explanation: The implementation may treat preserving the raw record object as sufficient pass-through. That does not satisfy the explicit dashboard-display acceptance text and leaves mixed agent-improvement/model-benchmark journal output opaque to the main reducer surface.
- Final severity: P1.
- Confidence: 0.82.
- Downgrade trigger: Downgrade to P2 if the spec is amended to say mode only needs to remain on raw JSONL records and does not need reducer-level metadata or dashboard display.
- Finding class: cross-consumer.
- Scope proof: `rg -n "\brecord\.mode\b|\bmode\b|dashboard|benchmark_run" .opencode/skills/deep-agent-improvement/scripts/reduce-state.cjs` found no mode pass-through/display other than preserved raw records, benchmark type handling, a failure-mode loop variable, and stale dynamic-mode copy.
- Affected surface hints: ["state reducer", "dashboard", "mixed-mode journal", "release evidence"]
- Recommendation: Add mode-aware reduced metadata and dashboard rendering for both legacy missing-mode records and new `agent-improvement`/`model-benchmark` records; keep old-record behavior tolerant by displaying `unknown` or inferred mode rather than rejecting records.

### P2

None.

## Traceability Checks

- `spec_code`: fail. Prior P1s remain active for missing dispatcher invocation (`loop-host.cjs:73`), scorer seam bypass (`run-benchmark.cjs:114`), and promotion status mismatch (`promote-candidate.cjs:168`). This iteration adds reducer/dashboard mode metadata evidence (`reduce-state.cjs:608`, `reduce-state.cjs:889`, `reduce-state.cjs:1094`).
- `checklist_evidence`: fail. `loop-host.vitest.ts:44` still checks plan identity, not byte-identical state JSONL; `scorer.vitest.ts:50` exercises the ported scorer directly but not the active benchmark runner seam.
- `agent_cross_runtime`: partial. `dispatch-model.cjs:118` has executor branches, but `loop-host.cjs:73` still does not invoke the dispatcher in the model-benchmark route.
- `feature_catalog_code`: not re-reviewed this iteration; prior pass evidence remains.
- `playbook_capability`: not re-reviewed this iteration; prior pass evidence remains.
- `mode_field_writer_persistence`: pass for direct record writers. `score-candidate.cjs:430`/`:622` include `mode: 'agent-improvement'`; `run-benchmark.cjs:326`/`:355` include `mode: 'model-benchmark'`.
- `mode_metadata_reduction`: fail. Reducer and dashboard do not surface mode metadata despite spec lines `95` and `112`.

## SCOPE VIOLATIONS

None.

## Verdict

CONDITIONAL

The cross-cutting path still has active P1 blockers from earlier iterations: dispatcher bypass, active scorer seam mismatch, promotion mismatch, and cwd/scorer safety issues. This pass adds one new P1 for the reducer/dashboard mode metadata integration gap.

## Next Dimension

Iteration 010 should be the final MiniMax cross-cutting/adversarial pass. It should challenge DR-009-P1-001 specifically: decide whether raw-record preservation is enough to downgrade it, or whether the explicit dashboard-display contract keeps it P1.
