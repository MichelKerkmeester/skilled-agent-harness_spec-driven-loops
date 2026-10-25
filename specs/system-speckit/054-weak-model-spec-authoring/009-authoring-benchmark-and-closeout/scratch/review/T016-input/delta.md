# Authoring delta

- Baseline: three Level 3 runs of the frozen brief on cli-devin swe-2-max, recorded in `../001-template-drift-census-and-baseline/scratch/baseline-swe-l3/baseline.json`.
- Final: three runs of the same task, recorded in `scratch/baseline/baseline.json`.
- Each cell is the minimum, the maximum and the mean over three runs.
- Three runs cannot support a significance claim. The table reports a range, not an effect size.

| Metric | Baseline min | Baseline max | Baseline mean | Final min | Final max | Final mean | Delta of means |
|--------|--------------|--------------|---------------|-----------|-----------|------------|----------------|
| strict_passed | 1 | 1 | 1 | 1 | 1 | 1 | 0 |
| leftover_hints | 0 | 1 | 0.7 | 0 | 0 | 0 | -0.7 |
| missing_anchors | 0 | 0 | 0 | 0 | 6 | 2 | 2 |
| out_of_scope_writes | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| seconds | 317 | 384 | 342.3 | 429 | 1822 | 896 | 553.7 |
