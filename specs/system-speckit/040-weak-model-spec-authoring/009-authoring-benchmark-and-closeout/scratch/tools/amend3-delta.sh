#!/bin/bash
# usage: amend3-delta.sh   (run from the worktree root)
# Writes amend3/delta.json and amend3/delta.md from the DeepSeek baseline and the amend3 final runs, then prints the verdict.
P9=specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout
A=$P9/scratch/amend3
B="$A/baseline-deepseek/baseline.json"
F="$A/baseline.json"
jq -n --slurpfile b "$B" --slurpfile f "$F" '
  def stat($runs; $k):
    {min: ($runs | map(.[$k]) | min),
     max: ($runs | map(.[$k]) | max),
     mean: (($runs | map(.[$k]) | add) / ($runs | length))};
  ["strict_passed","leftover_hints","missing_anchors","out_of_scope_writes","seconds"] as $keys
  | {metrics: ($keys | map(. as $k | {metric: $k, baseline: stat($b[0].runs; $k), final: stat($f[0].runs; $k)}))}
  | .metrics |= map(. + {delta_mean: (.final.mean - .baseline.mean)})
' > "$A/delta.json"
jq -r '
  def one: (.*10 | round) / 10;
  "# Authoring delta, third amendment\n",
  "- Baseline: three Level 3 runs of the frozen brief on cli-devin deepseek-v4-1-flash-1017-max at the packet start commit, recorded in `scratch/amend3/baseline-deepseek/baseline.json`.",
  "- Final: three runs of the same task on the same model after the L3+ label fix, recorded in `scratch/amend3/baseline.json`.",
  "- Each cell is the minimum, the maximum and the mean over three runs.",
  "- Three runs cannot support a significance claim. The table reports a range, not an effect size.\n",
  "| Metric | Baseline min | Baseline max | Baseline mean | Final min | Final max | Final mean | Delta of means |",
  "|--------|--------------|--------------|---------------|-----------|-----------|------------|----------------|",
  (.metrics[] | "| \(.metric) | \(.baseline.min) | \(.baseline.max) | \(.baseline.mean | one) | \(.final.min) | \(.final.max) | \(.final.mean | one) | \(.delta_mean | one) |")
' "$A/delta.json" > "$A/delta.md"
jq -e 'def m($k): [.metrics[] | select(.metric==$k)][0]; . as $d | ($d | m("strict_passed").final.min == 1) and (["leftover_hints","missing_anchors","out_of_scope_writes"] | all(. as $k | $d | m($k) | .final.max <= .baseline.max))' "$A/delta.json"
