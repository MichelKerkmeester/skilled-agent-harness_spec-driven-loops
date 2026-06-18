# Spec 143 Deep Review - Summary (10 iterations, MiMo 2.5 Pro)

**Reviewer:** `xiaomi/mimo-v2.5-pro` (adversarial, lens-rotated; 11 dispatches — lens 5 re-run once after a no-verdict first pass). Findings triaged between batches; every accepted finding fixed, validated dispatch-free, and committed before the next batch.

| Iter | Lens | Findings | Outcome |
|---|---|---|---|
| 1 | loop.py correctness | 2 P1, 2 P2 | all 4 fixed (n=0 fabrication, stuck plateau, sample std n-1, dead resume cache) |
| 2 | concurrency/state | race traced in reasoning (no structured output) | lock rewritten to O_CREAT\|O_EXCL acquisition |
| 3 | gates/derive integrity | 2 P0, 1 P1 | all fixed (vanished-anchor empty-extraction pass, sha(None)==None pass, freeze-empty lock-in) |
| 4 | gauntlet coverage | 4 P1, 2 P2 | derive-rc check + visibleUnmeasurable taxonomy fixed; 2 accepted-as-designed (residual TOCTOU window is fail-safe; process-race test impractical), gauntlet gaps noted |
| 5 | run-benchmark (re-run) | 1 P1, 2 P2 | all fixed (phantom-gap NaN guard + sampled fallback, aggregate field leak, zero-divide) |
| 6 | loop-host/adapter | 4 traced (no structured output) | 1 fixed (bare model flags exit 2); 1 false positive (--samples env mapping IS the contract); 2 accepted (documented mode-fallback warn; --live chain verified correct) |
| 7 | shared helpers | 1 P1, 1 P2 | both fixed (fixture-lint prefix collision could corrupt the held-out gate; model-family null guard) |
| 8 | promote/regrade/calibrate | 5 P0, 3 P1 | all fixed (case-insensitive family kill-switch bypass, tolerant grader-JSON, calibrate rc/UNMEASURABLE/argv/parse, promote missing-candidate fail-closed, thresholdDelta ?? ) |
| 9 | docs vs code | 4 P1, 2 P2 | all fixed (operator guide env knobs + lock kill-switch + resume + gate semantics; detached-worktree wording) |
| 10 | deals port consistency | 1 P0, 1 P1, 1 P2 | all fixed (deals dims keys D/E/A/L — A/L floor enforcement was silently dead; grader default alignment; proposer-failure journaling) |

**Totals:** 8 P0, 12 P1, 8 P2 raised; 24 fixed, 3 accepted-by-design (documented), 1 false positive. Post-remediation: vitest battery 243/243, both packaging gauntlets 10/10, dry-runs green.

**Best catches:** iter-3 (the frozen-surface guard could be silently defeated by deleting its anchor), iter-10 (the second packaging's numeric floor enforcement for 2 of 4 dimensions never fired — a port bug no dispatch-free test caught), iter-8 (the family kill-switch was case-sensitive).
