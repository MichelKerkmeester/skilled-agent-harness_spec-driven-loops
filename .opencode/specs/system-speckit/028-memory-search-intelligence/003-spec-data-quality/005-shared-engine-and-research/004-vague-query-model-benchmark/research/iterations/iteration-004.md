# Iteration 004, Q3: The citeCorrect metric is binary; 3-tier fix

**Focus:** The `citeCorrect` metric mislabels every `cite_with_caveat` cell (the 1.0 → 0.55 false drop).
**Executor:** orchestrator analytical pass (status: thought), the target is the benchmark's own script, not MCP code, so no gpt-5.5 dispatch was needed.
**newInfoRatio:** 0.5, confirms and designs the fix for an already-identified issue.

## Finding: confirmed binary, root cause exact

`extract-metrics.mjs` computes the expected policy with a two-state rule and then demands exact equality:

```
const citeExpected = rq === 'good' ? 'cite_results' : 'do_not_cite_results'   // :65
const citeCorrect  = cite == null ? null : cite === citeExpected               // :66
```

A `weak` verdict whose policy is the graduated `cite_with_caveat` resolves `citeExpected = 'do_not_cite_results'` (because `rq !== 'good'`), so `cite_with_caveat !== 'do_not_cite_results'` and `citeCorrect = false`. Every one of the 47–63 `cite_with_caveat` cells scores wrong, which is the entire false `citeCorrectRate` drop. [SOURCE: `scripts/extract-metrics.mjs:64-66`]

## Fix: make the metric three-tier-aware

Replace the binary expected with a valid-set membership check:

```
const VALID_CITE = { good: ['cite_results'], weak: ['cite_with_caveat', 'do_not_cite_results'], gap: ['do_not_cite_results'] }
const citeCorrect = cite == null ? null : (VALID_CITE[rq] || []).includes(cite)
```

A `weak` verdict is correct whether it hedges (`cite_with_caveat`, grounded top hit) or drops (`do_not_cite_results`, ungrounded), both are valid under the graduated policy. This restores the rate to ~1.0 for conforming cells.

## Consumers and blast radius
`citeCorrect` is read only at `extract-metrics.mjs:99` (the `citeCorrectRate` aggregation) and the per-model rollup. It is the benchmark metric script only, no production code, trivial blast radius. Re-running `extract-metrics.mjs` regenerates `metrics.json` with the corrected rate. (Minor adjacent quirk at `:99`: a `null` citeCorrect is counted as 1, leave or document.)

## Next focus
Q6 (the determinism dispatch, running) is the last open question, then synthesis.
