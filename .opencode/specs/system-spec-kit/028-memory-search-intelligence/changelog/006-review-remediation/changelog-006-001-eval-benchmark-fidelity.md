---
title: "Changelog: Eval Benchmark Fidelity Remediation [006-review-remediation/001-eval-benchmark-fidelity]"
description: "Chronological changelog for the eval benchmark fidelity remediation phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-20

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/006-review-remediation/001-eval-benchmark-fidelity` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/006-review-remediation`

### Summary

This phase fixed two measurement-fidelity defects in the per-flag retrieval benchmark driver and re-ran criterion-4 so the flip decision rests on the right data. The per-flag pass no longer forces every channel active and the channel sweep no longer reports an unablatable trigger row. The corrected re-run supersedes the prior measurement and earns no default-off flip. Default-off remains correct.

### Added
- A deterministic driver test at `tests/retrieval-flag-eval-driver.vitest.ts` that fails against the pre-fix shapes.
- Pure exported option builders plus a CLI-only main guard on the driver.

### Changed
- The per-flag `search()` path now routes through the production default path so per-flag deltas reflect what production serves. The off-baseline shifted from the forced all-channels 0.4583 to the routed 0.4861.
- The channel sweep dropped the inert `triggerPhrases: []` lever and filtered `'trigger'` out of the swept channels.
- `benchmark-status.md` at the 028 root recorded the corrected deltas, a supersession note and the reproducible command.

### Fixed
- P1-1 forceAllChannels measured every flag on a non-representative all-channels path so the criterion-4 flip decision rested on the wrong data. The per-flag pass now uses production routing.
- P1-3 trigger-ablation no-op reported a row that was identical-by-construction noise because the trigger lane runs unconditionally and ignores `triggerPhrases`. The misleading row was removed.

### Verification
- Driver fix - DONE for P1-1 default routing and P1-3 trigger row removal.
- Deterministic test - PASS, 8/8, fails against pre-fix shapes.
- Typecheck - PASS, `npm run typecheck` exit 0.
- Vitest affected subsystem - PASS, 48 files / 994 passed plus 3 skipped, 0 failures.
- Criterion-4 re-run - DONE, `/tmp/speckit-retrieval-flag-eval.CORRECTED.json`, no flag flip.
- Strict validation - PASS, RESULT PASSED for this child folder.

### Files Changed
- `mcp_server/scripts/evals/run-retrieval-flag-eval.mjs`: P1-1 default routing for the per-flag pass, P1-3 trigger row plus inert lever removal, pure option builders and a CLI-only main guard.
- `mcp_server/tests/retrieval-flag-eval-driver.vitest.ts`: new deterministic test that fails against the pre-fix driver.
- `benchmark-status.md` (028 root): corrected per-flag and channel deltas, supersession note and reproducible command.
- `tasks.md` / `checklist.md`: marked DONE with evidence.

### Follow-Ups
- P1-3 left a production seam not a closed gate. The trigger lane still cannot be ablated through public options because the production guard was out of scope.
- Any future benchmark re-run must re-confirm vector-lane health against a live embedder and DB before trusting the deltas.
