---
title: "DR-060 -- Dashboard sparkline trend"
description: "Verify that the dashboard renders new-information and score history as sparklines with flatline advisory evidence."
version: 1.14.0.21
---

# DR-060 -- Dashboard sparkline trend

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DR-060`.

---

## 1. OVERVIEW

This scenario validates the dashboard sparkline trend for `DR-060`. The objective is to verify that reducer output includes a `## 5. TREND` section with sparklines for new-information ratio and score history.

### WHY THIS MATTERS

Operators need to see whether novelty is decaying, recovering, or flatlining without manually comparing every iteration row.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify that the dashboard renders new-information and score history as sparklines with flatline advisory evidence.
- Real user request: Show me whether the dashboard gives a quick visual trend for novelty and score.
- Prompt: `Validate the deep-research dashboard sparkline trend across reducer output, dashboard assets, and tests.`
- Expected execution process: Inspect `renderSparkline()`, dashboard section rendering, flatline event emission, dashboard asset headings, and sparkline tests.
- Desired user-visible outcome: The user is told where to inspect novelty and score trends and how flatline advisories are surfaced.
- Expected signals: `renderSparkline()` exists, dashboard output includes `## 5. TREND`, newInfoRatio and score sparklines are rendered, and `trend_flatline` is advisory.
- Pass/fail posture: PASS if the reducer and tests cover growth, decay, and flat trend rendering; FAIL if dashboard trend output is absent or only raw numeric rows exist.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
Validate the deep-research dashboard sparkline trend across reducer output, dashboard assets, and tests.
### Commands
1. `bash: rg -n 'renderSparkline|TREND|trend_flatline|ratioSparkline|scoreSparkline' .opencode/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs`
2. `bash: rg -n '## 5\\. TREND|CONVERGENCE TREND' .opencode/skills/system-deep-loop/deep-research/assets/deep_research_dashboard.md`
3. `bash: sed -n '1,90p' .opencode/skills/system-deep-loop/deep-research/scripts/reduce-state-sparkline.test.cjs`
### Expected
The reducer renders trend sparklines for newInfoRatio and score histories, and flatline detection emits advisory evidence without becoming a stop decision.
### Evidence
Capture the render function, dashboard section construction, flatline event, and test cases for growth, decay, and flat histories.
### Pass/Fail
PASS if the dashboard trend appears in reducer output and the tests prove non-empty sparkline rendering; FAIL if trend visibility depends on manual comparison.
### Failure Triage
Privilege `reduce-state.cjs` for live dashboard output and `reduce-state-sparkline.test.cjs` for rendering expectations.

---

## 4. SOURCE FILES

### PLAYBOOK SOURCES

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page, integrated review protocol, and scenario summary |
| `../../feature_catalog/state-management/dashboard-sparkline-trend.md` | Matching feature catalog entry |

### IMPLEMENTATION AND RUNTIME ANCHORS

| File | Role |
|---|---|
| `.opencode/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs` | Sparkline rendering, dashboard trend section, and flatline advisory event |
| `.opencode/skills/system-deep-loop/deep-research/assets/deep_research_dashboard.md` | Dashboard template and trend section headings |
| `.opencode/skills/system-deep-loop/deep-research/scripts/reduce-state-sparkline.test.cjs` | Rendering tests for sparkline output |

---

## 5. SOURCE METADATA

- Group: ITERATION EXECUTION AND STATE DISCIPLINE
- Playbook ID: DR-060
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `iteration-execution-and-state-discipline/dashboard-sparkline-trend.md`
- Feature catalog: `feature_catalog/state-management/dashboard-sparkline-trend.md`
