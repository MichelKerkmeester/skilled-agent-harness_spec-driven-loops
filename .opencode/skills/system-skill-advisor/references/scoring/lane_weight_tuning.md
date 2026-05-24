---
title: "Lane Weight Tuning Guide"
description: "Process, measurement methodology, decision framework, approval gates plus rollback criteria for changing scorer lane weights in mk_skill_advisor."
trigger_phrases:
  - "lane weight tuning"
  - "scorer weight change"
  - "advisor weight calibration"
  - "lane weight sweep"
importance_tier: "important"
---

# Lane Weight Tuning Guide

Process, measurement methodology, decision framework, approval gates plus rollback criteria for changing scorer lane weights in mk_skill_advisor.

---

<!-- ANCHOR:1-overview -->
## 1. OVERVIEW

### Purpose

Defines the evidence, measurement and rollback workflow for changing live advisor scorer lane weights.

### When to Use

- Proposing a scorer weight change.
- Comparing corpus, holdout, parity, safety or latency slices before promotion.
- Rolling back a weight change that regresses routing quality.

### Core Principle

Lane weights change only with measured evidence and synchronized documentation updates.

### Key Sources

- [`advisor_scorer.md`](./advisor_scorer.md)
- [`validation_baselines.md`](./validation_baselines.md)
- `mcp_server/lib/scorer/lane-registry.ts`


---

<!-- ANCHOR:2-when-to-tune -->
## 2. WHEN TO TUNE

Tune lane weights only when at least one of these triggers fires:

- A baseline `advisor_validate` run shows top-1 accuracy below 80.5% on the full corpus or below 77.5% on the holdout set.
- The UNKNOWN count exceeds 10 on a fresh validate run.
- A new lane is added or an existing lane is decommissioned.
- A measured ablation shows that the current weights misallocate confidence in a high-traffic intent class.
- An ADR mandates a change as part of a scorer redesign.

Do not tune weights for these reasons:

- "It feels low for lane X." Without measured evidence, intuition mispredicts the cross-skill impact.
- "We just added this skill." Single-skill tuning belongs in the explicit_author lane's curated boosts (`mcp_server/lib/scorer/lanes/explicit.ts`), not in global lane weights.
- "The semantic lane scored higher than expected." The semantic_shadow lane carries `shadowOnly=true` so it does not affect live ranking. Adjust the shadow_weight if you want to tune shadow mode, not the live weight.

<!-- /ANCHOR:2-when-to-tune -->

---

<!-- ANCHOR:3-measurement-methodology -->
## 3. MEASUREMENT METHODOLOGY

Every weight change requires a baseline plus a comparison run. The measurement chain has 4 steps:

**Step 1: Capture baseline.**

```bash
npm --prefix .opencode/skills/system-skill-advisor/mcp_server run build
# Then via MCP:
mcp__mk_skill_advisor__advisor_validate({ "confirmHeavyRun": true })
```

Save the response. Key fields to retain: `overallAccuracy`, `slices.corpus.topOne`, `slices.holdout.topOne`, `slices.parity`, `telemetry.lanesDominantCount`, `perSkill[]`.

**Step 2: Run the lane-weight sweep.**

```bash
npx vitest run --config .opencode/skills/system-skill-advisor/mcp_server/vitest.config.ts \
  .opencode/skills/system-skill-advisor/mcp_server/tests/scorer/lane-weight-sweep.vitest.ts
```

This harness exercises each lane weight individually across a small grid plus reports which weight permutations move accuracy. It is the canonical input for any weight change proposal.

**Step 3: Make the change.**

Edit `mcp_server/lib/scorer/lane-registry.ts:7-19` (live weights) or `lane-registry.ts:32-38` (shadow weights). Keep both sums close to 1.0 to preserve the calibration assumptions in `scoring-constants.ts`.

**Step 4: Capture the comparison.**

Re-run Step 1 plus Step 2. The diff between baseline plus comparison is the measured evidence required for approval.

<!-- /ANCHOR:3-measurement-methodology -->

---

<!-- ANCHOR:4-decision-framework -->
## 4. DECISION FRAMEWORK

Use this rubric to decide whether to ship a weight change:

| Signal | Ship | Defer |
|---|---|---|
| Full-corpus top-1 accuracy | Improves by ≥ 2 percentage points | Drops below baseline OR improves by < 2pp |
| Holdout top-1 accuracy | Improves OR stays within ±0.5pp | Drops by ≥ 1pp |
| UNKNOWN count | Decreases | Increases |
| Parity slice | All checks pass | Any parity check fails |
| Per-skill regression count | 0 skills lose top-1 ranking | Any skill regresses |
| Lane-dominance distribution | Stays within 2x of baseline | Single lane dominates > 80% of routes |

Any "Defer" condition blocks the change. If improvements on some axes come with regressions on others, document the tradeoff in `advisor_scorer.md` plus get explicit sign-off before shipping.

<!-- /ANCHOR:4-decision-framework -->

---

<!-- ANCHOR:5-approval-process -->
## 5. APPROVAL PROCESS

Lane weight changes are governed work. The checklist:

1. Open a spec packet under `.opencode/specs/` documenting the trigger condition, baseline measurement, proposed weights, plus expected impact.
2. Run the measurement chain in §3. Attach baseline + comparison JSON to the packet.
3. Apply the §4 decision rubric. If any "Defer" condition fires, halt or document the tradeoff.
4. Update synchronized docs in one commit:
   - `mcp_server/lib/scorer/lane-registry.ts`
   - [`advisor_scorer.md`](./advisor_scorer.md) lane table
   - [`feature_catalog/04--scorer-fusion/06-weights-config.md`](../../feature_catalog/04--scorer-fusion/06-weights-config.md)
   - [README.md](../../README.md) §3.3 lane weights table
   - [ARCHITECTURE.md](../../ARCHITECTURE.md) lane weights section
5. Run `advisor_validate` post-change to confirm the comparison numbers reproduce in the deployed config.

<!-- /ANCHOR:5-approval-process -->

---

<!-- ANCHOR:6-rollback-criteria -->
## 6. ROLLBACK CRITERIA

Roll back a weight change when ANY of these fires within 24 hours of deploy:

- Production routing accuracy drops below the pre-change baseline by ≥ 2pp.
- UNKNOWN count exceeds 15.
- A new lane-dominance pattern emerges where one lane wins > 80% of routes.
- An operator reports a regression on a previously-correctly-routed prompt.

Rollback procedure:

```bash
git revert <commit-sha>
npm --prefix .opencode/skills/system-skill-advisor/mcp_server run build
mcp__mk_skill_advisor__advisor_rebuild({ "force": true })
mcp__mk_skill_advisor__advisor_validate({ "confirmHeavyRun": true })
```

Confirm the baseline numbers return. Document the rollback rationale in the original packet's `implementation-summary.md`.

<!-- /ANCHOR:6-rollback-criteria -->

---

<!-- ANCHOR:7-related -->
## 7. RELATED

- [`advisor_scorer.md`](./advisor_scorer.md), lane attribution model + fusion + 16 confidence calibration constants.
- [`feature_catalog/04--scorer-fusion/06-weights-config.md`](../../feature_catalog/04--scorer-fusion/06-weights-config.md), canonical current weights.
- [`manual_testing_playbook/08--scorer-fusion/005-ablation.md`](../../manual_testing_playbook/08--scorer-fusion/005-ablation.md), ablation scenario for measuring lane contributions.
- `mcp_server/tests/scorer/lane-weight-sweep.vitest.ts`, sweep harness.
- `mcp_server/lib/scorer/lane-registry.ts:7-19,32-38`, live + shadow weight source-of-truth.
- `mcp_server/lib/scorer/scoring-constants.ts:141-170`, confidence calibration constants.

<!-- /ANCHOR:7-related -->
