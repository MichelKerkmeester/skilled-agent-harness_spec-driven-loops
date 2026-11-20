---
title: "Lane-by-Lane Ablation Protocol"
description: "Ablation harness that disables each lane in isolation and measures accuracy impact without mutating live routing weights."
trigger_phrases:
  - "ablation protocol"
  - "lane ablation"
  - "scorer ablation"
  - "ablation accuracy"
version: 0.8.2.0
---

# Lane-by-Lane Ablation Protocol

## 1. OVERVIEW

Quantify each lane's contribution to accuracy so lane weights can be reasoned about empirically. Ablation must never mutate live weights.

---

## 2. HOW IT WORKS

`lib/scorer/ablation.ts` scores a baseline, then runs the corpus once per registered lane with that lane disabled and emits per-lane accuracy deltas. `runLaneAblation` ignores lane weights and includes lanes whose weight is already 0. The harness does not change live `laneWeights` (exposed via `advisor_status`). `advisor_validate` returns no ablation slice. The test and stress-test entry points call the harness.

The opt-in real-embedding check seeds skill and command vectors the same way production does and compares the semantic lane at weight `0.05` with the lane disabled. On the 196-row corpus, two identical runs scored 156 correct with the lane and 161 without it, with 7 flips and no new fire for a gold `none` row. The live default stays at `0`. The opt-in test asserts that the registry default follows this pass bar.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/ablation.ts` | Library | Source reference |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/system-skill-advisor/runtime/tests/scorer/semantic-shadow-ablation.vitest.ts` | Automated test | Opt-in semantic-shadow ablation accuracy |
| `Playbook scenario [SC-005](../../manual-testing-playbook/scorer-fusion/ablation.md).` | Manual playbook | Source reference |

---

## 4. SOURCE METADATA

- Group: Scorer fusion
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `scorer-fusion/ablation.md`

Related references:

- [01-five-lane-fusion.md](../../feature-catalog/scorer-fusion/five-lane-fusion.md).
- [`cli-surface/advisor-validate.md`](../../feature-catalog/cli-surface/advisor-validate.md).
