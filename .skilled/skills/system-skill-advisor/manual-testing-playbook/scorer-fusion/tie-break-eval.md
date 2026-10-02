---
title: "SC-006 -- Offline Jev Tie-Break Eval"
description: "This scenario validates the offline Jev tie-break eval for `SC-006`. It focuses on the zero-call census and a gate skip that leaves the census unchanged."
stage: routing
version: 0.13.0.0
---

# SC-006 -- Offline Jev Tie-Break Eval

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `SC-006`.

---

## 1. OVERVIEW

This scenario validates the offline Jev tie-break eval for `SC-006`. It focuses on the zero-call census and a gate skip that leaves the census unchanged.

### Why This Matters

The eval decides whether a model may ever reorder the advisor's near-tie cluster, so its default run must cost nothing and its gates must fail closed. A census that drifts from the pinned 53/70 baseline, or a gate that lets a call through, would make every verdict it prints meaningless.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SC-006` and confirm the expected signals without contradictory evidence.

- Objective: confirm that the default run makes no model call and that a failed gate skips its arm without changing the census.
- Real user request: `Would a Jev pick order the advisor's near-ties better than the scorer does?`
- Prompt: `Run the offline tie-break eval, then a Jev run, and tell me the verdict.`
- Expected execution process: run the census and run `--jev` with a provider that has no key, then compare the census lines of the two runs.
- Expected signals: `baseline: holdout_top1=53/70`, four `comparator:` lines and a `power:` line on every run, and `jev arm skipped: no credential` on the keyless run.
- Desired user-visible outcome: a census that matches the pinned baseline and a gate skip that leaves it unchanged.
- Pass/fail: PASS if every expected signal appears and the census lines match across the runs, FAIL if a run changes the census, calls a model without its switch or changes the tree.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Run the offline tie-break eval, then a Jev run, and tell me the verdict.`

### Commands

1. `git status --porcelain > /tmp/sc006-before.txt`
2. `node .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-jev-tiebreak.mjs > /tmp/sc006-default.txt`
3. `JEV_PROVIDER=openrouter node .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-jev-tiebreak.mjs --jev > /tmp/sc006-jev.txt`
4. `git status --porcelain > /tmp/sc006-after.txt`

### Expected

Step 2 prints the census, `baseline: holdout_top1=53/70`, the four comparators and the power line, and exits 0. Step 3 prints the same lines, then `jev: path=... provider=openrouter` and `jev arm skipped: no credential` when no OpenRouter key is stored. Steps 1 and 4 print the same status.

### Evidence

The two stdout files and both status files.

### Pass / Fail

- **Pass**: every expected signal appears, the census block is byte-identical across the three runs and the two status files match.
- **Fail**: the census differs between runs, the baseline is not 53/70, a skipped arm made a call or a run changed the tree.

### Failure Triage

A `baseline mismatch: comparison void` line means the built scorer drifted, so rebuild the advisor `dist` and rerun the scorer-baseline ratchet. A `jev arm skipped: version` line is followed by the version it found, which must be `jev 0.6.2`.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../feature-catalog/scorer-fusion/tie-break-eval.md` | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-jev-tiebreak.mjs` | Primary implementation anchor |
| `.skilled/skills/system-skill-advisor/runtime/tests/parity/score-jev-tiebreak.vitest.ts` | Regression anchor |

---

## 5. SOURCE METADATA

- Group: Scorer Fusion
- Playbook ID: SC-006
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `scorer-fusion/tie-break-eval.md`
