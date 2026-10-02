---
title: "Offline Jev Tie-Break Eval"
description: "An offline script that measures whether a Jev pick inside the advisor's near-tie cluster beats the scorer's own order, with a zero-call census by default."
trigger_phrases:
  - "offline jev tie-break eval"
  - "tie-break eval"
  - "score-jev-tiebreak"
  - "near-tie cluster eval"
version: 0.13.0.0
---

# Offline Jev Tie-Break Eval (score-jev-tiebreak.mjs)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

An offline script that measures whether a Jev pick inside the advisor's near-tie cluster beats the scorer's own order, with a zero-call census by default.

It measures and never routes. Nothing in the advisor calls it, and a run without `--jev` spawns no binary. It exists because the prompt hook's time budget leaves no room for a live model call, so the only way to learn whether a model orders the cluster better is to score one offline against the labeled corpus.

---

## 2. HOW IT WORKS

The script sets the scorer-baseline capture's environment before it imports the built scorer, then scores the 177 skill-firing rows of `labeled-prompts.jsonl` and the 64 of `holdout-prompts.jsonl`. A row's cluster is its top recommendation plus that recommendation's `ambiguousWith` list from the top-2 ambiguity window. For each file and each 50/50 split the census prints eligible, movable, gold-first, gold-outside and gold-in-top-3 counts. It prints holdout top-1, and any value other than 53/70 voids the run. Four comparators follow, each with MRR, right@1 and right@3: the scorer's order, confidence order inside the cluster, always-second and an outcome-weighted rerank scored on the held-out half only. A power line gives the wins an exact one-sided sign test at 0.05 needs and the true win rate that gives 80% power.

`--jev` runs only when `jev` is on PATH, reports `jev 0.6.2` and `jev auth status --provider P` exits 0. A failed check prints one `skipped` line, leaves the census unchanged and exits 0. The arm asks each eligible row three times and prints one column with wins, losses, ties, abstentions, unmeasured rows, the exact p, the flip rate, latency and one `verdict:` line under a keep rule fixed before any run. Once the gate passes and it will call, the run needs `--out <dir>`, where it writes `calls.jsonl` and `report.json`. Without it the script exits 2 before any call. The script holds no credential: `jev` resolves its own key.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-jev-tiebreak.mjs` | Script | Census, comparators, power line, both model arms, calibration and the report |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/ambiguity.ts` | Library | The near-tie cluster the eval reorders |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/system-skill-advisor/runtime/tests/parity/score-jev-tiebreak.vitest.ts` | Automated test | A stub `jev` binary |
| `Playbook scenario [SC-006](../../manual-testing-playbook/scorer-fusion/tie-break-eval.md).` | Manual playbook | Default run and a gate skip |

---

## 4. SOURCE METADATA

- Group: Scorer fusion
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `scorer-fusion/tie-break-eval.md`

Related references:

- [ambiguity.md](./ambiguity.md) - the top-2 ambiguity window whose cluster this eval measures.
