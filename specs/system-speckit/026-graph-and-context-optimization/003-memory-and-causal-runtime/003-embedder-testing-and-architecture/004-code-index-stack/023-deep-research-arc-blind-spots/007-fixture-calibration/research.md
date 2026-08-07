---
title: "Research: 023B Fixture Calibration"
description: "Research notes for expanded retrieval fixture design and calibration harness evidence."
trigger_phrases:
  - "023B research"
importance_tier: "high"
contextType: "research"
---
# Research: 023B Fixture Calibration

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: research | v2.2 -->

---

<!-- ANCHOR:summary -->
## Summary

023B uses `../023-deep-research-arc-blind-spots/002-retrieval-observability/implementation-summary.md` as the diagnostic-counter source and `../011-rerank-model-fit-investigation/research/phase2-bench/code-retrieval-fixture-corrected.json` as the regression fixture source.

The key research conclusion is narrow: the 18-probe corrected fixture should remain as a regression floor, while calibration decisions need a larger fixture and repeated runs.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:evidence -->
## Evidence

| Source | Finding |
|---|---|
| `../023-deep-research-arc-blind-spots/002-retrieval-observability/implementation-summary.md` | Search diagnostics expose candidate, dedup, rerank, boost-flip, and fallback counters. |
| `../011-rerank-model-fit-investigation/research/phase2-bench/code-retrieval-fixture-corrected.json` | Original 18 probes are preserved as the regression floor. |
| `evidence/runs/lane-sample-smoke-run-1.json` | A live five-probe smoke run produced `3/5` hits, enough to check harness execution but not enough for release verdicts. |
<!-- /ANCHOR:evidence -->

---

<!-- ANCHOR:conclusion -->
## Conclusion

The packet should not change defaults. It should close the findings by creating measurement capacity, taxonomy, and gates. Default changes need the full n>=3 sweep output.
<!-- /ANCHOR:conclusion -->
