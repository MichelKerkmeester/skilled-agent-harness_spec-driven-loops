# Authoring delta, fourth update (fix-completeness note fix)

- Baseline: three Level 3 runs of the frozen brief on cli-devin deepseek-v4-1-flash-1017-max at the packet start commit, recorded in `scratch/amend3/baseline-deepseek/baseline.json`.
- Final: three runs of the same task on the same model after the fix-completeness note fix, in a disposable worktree that holds none of the packet files, scored with the anchor rule, recorded in `scratch/amend3/fresh2/baseline.json`.
- Each cell is the minimum, the maximum and the mean over three runs.
- Three runs cannot support a significance claim. The table reports a range, not an effect size.

| Metric | Baseline min | Baseline max | Baseline mean | Final min | Final max | Final mean | Delta of means |
|--------|--------------|--------------|---------------|-----------|-----------|------------|----------------|
| strict_passed | 1 | 1 | 1 | 1 | 1 | 1 | 0 |
| leftover_hints | 0 | 1 | 0.3 | 0 | 1 | 0.3 | 0 |
| missing_anchors | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| out_of_scope_writes | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| seconds | 217 | 298 | 252.3 | 164 | 228 | 193.7 | -58.7 |
