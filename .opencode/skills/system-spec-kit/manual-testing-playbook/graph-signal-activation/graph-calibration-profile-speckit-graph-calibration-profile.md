---
title: "158 -- Graph calibration profile (SPECKIT_GRAPH_CALIBRATION_PROFILE)"
description: "This scenario validates graph calibration profile (SPECKIT_GRAPH_CALIBRATION_PROFILE) for `158`. It focuses on enabling the flag and verifying graph weight cap at 0.05 and community scoring capped at 0.03."
audited_post_018: true
version: 3.6.0.14
id: graph-signal-activation-graph-calibration-profile-speckit-graph-calibration-profile
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 158 -- Graph calibration profile (SPECKIT_GRAPH_CALIBRATION_PROFILE)

## 1. OVERVIEW

This scenario validates graph calibration profile (SPECKIT_GRAPH_CALIBRATION_PROFILE) for `158`. It focuses on enabling the flag and verifying graph weight cap at 0.05 and community scoring capped at 0.03.

---

## 2. SCENARIO CONTRACT


- Objective: Verify graph weight cap enforcement and community score capping.
- Real user request: `Please validate Graph calibration profile (SPECKIT_GRAPH_CALIBRATION_PROFILE) against SPECKIT_GRAPH_CALIBRATION_PROFILE=true and tell me whether the expected signals are present: applyGraphWeightCap() clamps values to [0, 0.05]; applyCommunityScoring() caps boost at 0.03; shouldActivateLouvain() returns activate=false when density or size below thresholds; calibrateGraphWeight() enforces N2a/N2b caps.`
- Prompt: `Validate graph calibration profile and cite graph weight caps, community score caps, Louvain thresholds, and N2 cap enforcement.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: applyGraphWeightCap() clamps values to [0, 0.05]; applyCommunityScoring() caps boost at 0.03; shouldActivateLouvain() returns activate=false when density or size below thresholds; calibrateGraphWeight() enforces N2a/N2b caps
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if graph weight capped at 0.05, community score capped at 0.03, and Louvain thresholds enforced; FAIL if any score exceeds its cap or Louvain activates below threshold

---

## 3. TEST EXECUTION

### Prompt

```
Validate graph calibration profile and cite graph weight caps, community score caps, Louvain thresholds, and N2 cap enforcement.
```

### Commands

1. `SPECKIT_GRAPH_CALIBRATION_PROFILE=true`
2. `memory_search({ query: "test calibration", mode: "deep" })`
3. Inspect Stage 2 graph weight contribution
4. `npx vitest run tests/graph-calibration.vitest.ts`

### Expected

applyGraphWeightCap() clamps to [0, 0.05]; applyCommunityScoring() caps at 0.03; shouldActivateLouvain() respects thresholds; calibrateGraphWeight() enforces N2a/N2b caps

### Evidence

Test transcript with cap verification + scoring context before/after calibration

### Pass / Fail

- **Pass**: graph weight capped at 0.05, community score capped at 0.03, and Louvain thresholds enforced
- **Fail**: any score exceeds its cap or Louvain activates below threshold

### Failure Triage

Verify isGraphCalibrationEnabled() → Check loadCalibrationProfile() env overrides → Inspect GRAPH_WEIGHT_CAP constant (0.05) → Verify COMMUNITY_SCORE_CAP constant (0.03) → Check Louvain minDensity (0.3) and minSize (10)

## 4. SOURCE FILES
- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Feature catalog: [graph-signal-activation/graph-calibration-profiles.md](../../feature-catalog/graph-signal-activation/graph-calibration-profiles.md)
- Feature flag reference: [feature-flag-reference/1-search-pipeline-features-speckit.md](../../manual-testing-playbook/feature-flag-reference/1-search-pipeline-features-speckit.md)
- Source file: `mcp-server/lib/search/graph-calibration.ts`

---

## 5. SOURCE METADATA

- Group: Graph Signal Activation
- Playbook ID: 158
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `graph-signal-activation/graph-calibration-profile-speckit-graph-calibration-profile.md`
