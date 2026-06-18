# Iteration 6 — Wave 3 (generate) — seat gpt-3 (openai/gpt-5.5-fast, variant high)

- Lens: benchmark-eval-harness
- Status: complete | exit=0 | duration=175s | findings=3 | newInfoRatio=0.62
- Focus: Could sk-code adopt an objective over-engineering/simplicity benchmark (ponytail PromptFoo vs deep-improvement sweep)?
- Dispatch: cli-opencode opencode run, openai/gpt-5.5-fast --variant high (read-only); ponytail benchmark embedded.

## Seat output

**Answer**
A standalone ponytail clone is not worth it. Fold one `code_loc` / simplicity metric into the existing deep-improvement Lane B sweep, and keep correctness as the gate.

1. **Measure**
Use same-model, same-task arms: `no-skill` vs `sk-code-loaded`, repeated samples, median deltas. Measure:
- `correctness_pass_rate` as eligibility gate, not a score, using hidden/visible oracle tests already in `code-task-scorer.cjs` (`deep-improvement:scripts/model-benchmark/lib/code-task-scorer.cjs:300-360`).
- `code_loc` from extracted/fenced code blocks, ponytail-style, but only among correctness-eligible outputs.
- Existing `output_words` / `output_chars` as secondary verbosity metrics (`code-task-scorer.cjs:305-310`, `353-360`).
- Over-engineering markers: extra helper count, classes for trivial functions, dependencies/imports, timers/global state where unnecessary, prose outside code, comments ratio, multiple abstractions.
- Cost/latency/tokens only if dispatch exposes them; sweep currently records `latency_ms` but leaves token/cost fields null (`sweep-benchmark.cjs:453-470`).

Ponytail contributes the arm shape and deterministic LOC idea: prompt arms, repeated runs, LOC from fenced blocks, median. Do **not** copy its missing correctness gate.

2. **Already Exists**
Yes, most harness infrastructure already exists:
- `sk-code` has benchmark artifacts and reports under `.opencode/skills/sk-code/benchmark/`; the benchmark README says Lane C scores D1 routing, D2 discovery, D3 efficiency, D4 usefulness, D5 connectivity (`sk-code/benchmark/README.md:18-33`).
- Router and live invocations already exist (`sk-code/benchmark/README.md:49-69`).
- Latest reports exist: router `FAIL 44/100`, live `CONDITIONAL 71/100` (`sk-code/benchmark/router-final/skill-benchmark-report.md:3-23`, `sk-code/benchmark/live-final/skill-benchmark-report.md:3-23`).
- D4 ablation exists but is approximate and advisory (`sk-code/benchmark/live-final/d4-ablation.json:1-29`).
- Lane B sweep already has the correctness-gated shape ponytail lacks: “Correctness is a GATE, not a score” (`deep-improvement:scripts/model-benchmark/SWEEP.md:13-16`, `82-90`) and `correctness-gate.cjs` explicitly ranks only eligible groups (`deep-improvement:scripts/model-benchmark/lib/correctness-gate.cjs:7-20`, `124-171`).

What’s missing: a produced-code simplicity dimension. Existing Lane C D3 is routing over-efficiency, not generated-code LOC. Existing Lane B has `output_words/chars`, not deterministic `code_loc` or over-engineering markers.

3. **Where**
Best path:
`deep-improvement:scripts/model-benchmark/lib/code-task-scorer.cjs`

Add `code_loc` and `overengineering_markers` to the row vector, then let:
`deep-improvement:scripts/model-benchmark/sweep-benchmark.cjs`

carry those fields into `results.json`, and:
`deep-improvement:scripts/model-benchmark/lib/sweep-reporter.cjs`

summarize them only after correctness eligibility.

Profile/output path:
`.opencode/skills/deep-improvement/assets/model_benchmark/benchmark-profiles/sk-code-simplicity.json`
and reports under:
`.opencode/skills/sk-code/benchmark/simplicity-sweep/`

4. **ROI**
Medium-low as a new harness. Medium as one extra metric in the existing sweep. Heavy benchmark runs are expensive and noisy; ponytail’s correctness omission is dangerous. The lean version is: add `code_loc` plus 3-5 static over-engineering markers to Lane B, compare `no-skill` vs `sk-code-loaded`, and rank only correctness-gated survivors.

```json
{
  "seat": "gpt-3",
  "lens": "benchmark-eval-harness",
  "findings": [
    {
      "id": "F1",
      "title": "Existing sweep already supplies the correctness-gated harness ponytail lacks",
      "ponytail_source": "external/ponytail-main/benchmarks/promptfooconfig.yaml",
      "target": "deep-improvement:scripts/model-benchmark/sweep-benchmark.cjs",
      "mechanism": "Reuse Lane B sweep rows and correctness-gate eligibility, then add simplicity metrics to eligible outputs only.",
      "recommendation": "Do not build a standalone PromptFoo clone; extend the existing sweep.",
      "value": "high",
      "effort": "M",
      "integration_risk": "Low if added as nullable row fields and optional profile.",
      "redundant_with": "Partly redundant with Lane B sweep, not with Lane C sk-code routing benchmark.",
      "confidence": "high"
    },
    {
      "id": "F2",
      "title": "sk-code already has benchmark reports, but they measure routing/usefulness rather than generated-code simplicity",
      "ponytail_source": "external/ponytail-main/benchmarks/README.md",
      "target": "sk-code:.opencode/skills/sk-code/benchmark/README.md",
      "mechanism": "Lane C reports D1-D5 routing, discovery, efficiency, usefulness, connectivity; D3 is over-routing efficiency, not LOC.",
      "recommendation": "Treat LOC/over-engineering as an additive Lane B produced-output metric, not a replacement for Lane C.",
      "value": "medium",
      "effort": "S",
      "integration_risk": "Low; avoids disturbing existing sk-code benchmark verdicts.",
      "redundant_with": "Existing sk-code benchmark artifacts and D4 ablation.",
      "confidence": "high"
    },
    {
      "id": "F3",
      "title": "Ponytail's deterministic LOC metric is useful only behind a correctness gate",
      "ponytail_source": "external/ponytail-main/benchmarks/loc.js",
      "target": "deep-improvement:scripts/model-benchmark/lib/code-task-scorer.cjs",
      "mechanism": "Add code_loc from extracted/fenced code, plus helper/import/class/comment markers; report medians after correctness eligibility.",
      "recommendation": "Fold `code_loc` into code-task-scorer and sweep-reporter; do not copy ponytail's correctness-free claim style.",
      "value": "medium",
      "effort": "M",
      "integration_risk": "Medium; LOC can incentivize under-solving unless correctness remains a hard gate.",
      "redundant_with": "Existing output_words/output_chars fields.",
      "confidence": "high"
    }
  ],
  "newInfoRatio": 0.62,
  "negative_knowledge": [
    "sk-code/README.md itself does not cite a benchmark; benchmark artifacts live under sk-code/benchmark/.",
    "Ponytail's harness measures size/cost/latency but does not gate correctness, so copying its verdict model would be unsafe.",
    "A new standalone harness would duplicate deep-improvement Lane B/Lane C infrastructure; the better ROI is one optional simplicity metric in the existing sweep."
  ]
}
```