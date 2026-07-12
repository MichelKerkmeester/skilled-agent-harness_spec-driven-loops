---
title: "Implementation Summary: Stage-aware Lane C skill-benchmark scorer"
description: "Records the wiring of the benchmark scenario stage axis (fitted/holdout split, generalization gap, stage-driven negatives) under a score-preserving invariant, verified by a before/after Mode-A re-baseline that surfaced real generalization gaps on 7 corpora."
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/061-stage-aware-scorer"
    last_updated_at: "2026-07-11T23:57:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Stage-split wired + re-baselined; 28 holdout-free 0-delta, 7 holdout-bearing surface gaps"
    next_safe_action: "Complete"
    blockers: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl/061-stage-aware-scorer"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Stage-aware Lane C skill-benchmark scorer

<!-- SPECKIT_LEVEL: 2 -->

<!-- ANCHOR:metadata -->
## Metadata
| Field | Value |
|-------|-------|
| **Spec Folder** | 061-stage-aware-scorer |
| **Status** | Complete |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built
Wired the consume side of the Lane C benchmark `stage` axis across five files. `load-playbook-scenarios.cjs` now
derives `negativeActivation` from `stage === 'negative'` on the sk-doc path (was hardcoded `false`) and emits a
`stage` field on the sk-code path. `score-skill-benchmark.cjs` attaches `row.stage` in `scoreScenario` and, in
`aggregate()`, partitions rows into a fitted set (routing + negative) and a holdout set: the headline
`aggregateScore` is now the mean over the fitted set (holdout excluded), with a separate `holdoutScore`, a
`generalizationGap`, `coverage.holdout`/`coverage.negative` counts, and an additive `generalization` report block.
`build-report.cjs` renders a `Stage` column plus a `## Generalization (fitted vs holdout)` section.
`playbook-generator.cjs` threads a per-spec `stage` through `renderScenarioMarkdown`. Five stage-aware vitest tests
were added, including an adversarial staged-fixture proof and a score-preserving assertion.
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
Ground-truth read of loader/scorer/report/generator + the vitest harness first, then a pristine Mode-A
router-replay baseline captured across all 35 corpora BEFORE any edit (`rebaseline/baseline.jsonl`). The edits are
minimal and additive. A correction surfaced mid-flight: an early grep wrongly concluded no corpus declared a stage;
in fact 14 `stage: holdout` + 5 `stage: negative` fixtures already ship across 7 corpora. The spec/plan/decision
docs were corrected to that reality (Logic-Sync) rather than left claiming the machinery was dormant.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions
The headline aggregate excludes holdout (fitted = routing + negative); holdout is scored separately and the gap
reported. Negatives keep using the existing advisor-inversion lane (`scoreD1Inter({ negative })` + the D1-intra/D2/D3
inversion); the aggregate only counts them for coverage. All new report fields are additive — no field renamed, no
dimension weight / D5 gate / verdict threshold changed. Recorded in `decision-record.md` ADR-001.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification
Unit: the `skill-benchmark.vitest.ts` suite runs 45 passed / 7 failed — the 7 failures are pre-existing (proven by a
`git stash` baseline that shows the identical 7 with my code removed; they are cli-opencode/cli-claude-code
relocation + router-content + D5/commandRecipe fixture issues, unrelated to stages). The full deep-improvement suite
went from 421 passed / 22 failed (pristine) to 426 passed / 22 failed (mine) — a clean +5 with the same 22
pre-existing failures, i.e. zero regressions. Re-baseline: all 28 holdout-free corpora reproduce their baseline
`aggregateScore` byte-for-byte (0 deltas); the 7 holdout-bearing corpora change by two intended effects —
excluding holdout from the fitted aggregate, and re-scoring the 5 stage-declared negatives through the
advisor-inversion lane (84 → 100 via the `negativeActivation` flip, which is why a corpus whose holdout rows
already score 100, e.g. mcp-figma, still moves) — and the harness now surfaces real generalization gaps the old
averaged headline masked — notably cli-opencode (fitted 100 / holdout 31 / gap 69) and mcp-click-up
(fitted 100 / holdout 31 / gap 69), while mcp-figma and mcp-tooling show gap 0 (perfect generalization).
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations
The large cli-opencode / mcp-click-up gaps (69) are a MEASUREMENT the harness now reports, not a diagnosis: whether
the router is genuinely overfit to its routing fixtures or the holdout fixtures are hard/mis-decontaminated is a
follow-on investigation, out of this packet's scope (which is the scorer wiring). Seven pre-existing
`skill-benchmark.vitest.ts` failures (cli-opencode relocated under `cli-external/`, cli-claude-code router content,
D5/commandRecipe fixtures) are unrelated to this change and left untouched — proven pre-existing by the stash
baseline. The re-baseline is Mode-A router-replay (the deterministic CI default); live Mode-B was out of scope.
<!-- /ANCHOR:limitations -->
