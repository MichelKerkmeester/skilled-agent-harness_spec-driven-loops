---
title: "SC-006 -- Offline Jev and Deem Tie-Break Eval"
description: "This scenario validates the offline Jev and Deem tie-break eval for `SC-006`. It focuses on the zero-call census, a gate skip that leaves the census unchanged and one local `--deem` run."
stage: routing
version: 0.13.0.0
---

# SC-006 -- Offline Jev and Deem Tie-Break Eval

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `SC-006`.

---

## 1. OVERVIEW

This scenario validates the offline Jev and Deem tie-break eval for `SC-006`. It focuses on the zero-call census, a gate skip that leaves the census unchanged and one local `--deem` run.

### Why This Matters

The eval decides whether a model may ever reorder the advisor's near-tie cluster, so its default run must cost nothing and its gates must fail closed. A census that drifts from the pinned 53/70 baseline, or a gate that lets a call through, would make every verdict it prints meaningless.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SC-006` and confirm the expected signals without contradictory evidence.

- Objective: confirm that the default run makes no model call, that a failed gate skips its arm without changing the census and that a `--deem` run prints a column, a verdict line with its commit pair and a calibration line.
- Real user request: `Would a local Deem pick order the advisor's near-ties better than the scorer does?`
- Prompt: `Run the offline tie-break eval, then a Deem run, and tell me the verdict.`
- Expected execution process: run the census, run `--jev` with a provider that has no key, run `--deem` against the local Deem server with `--out` outside the repository and compare the census lines of the three runs.
- Expected signals: `baseline: holdout_top1=53/70`, four `comparator:` lines and a `power:` line on every run, `jev arm skipped: no credential` on the keyless run, and `deem: health`, `column: backend=deem`, one `verdict:` line and one `calibration: backend=deem` line on the Deem run.
- Desired user-visible outcome: a `keep`, `kill`, `inconclusive` or `underpowered` verdict for the Deem column, named with the model and the commit pair it was measured on.
- Pass/fail: PASS if every expected signal appears, the census lines match across the runs and `git status --porcelain` is unchanged, FAIL if a run changes the census, calls a model without its switch or changes the tree.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Run the offline tie-break eval, then a Deem run, and tell me the verdict.`

### Commands

1. `git status --porcelain > /tmp/sc006-before.txt`
2. `node .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-jev-tiebreak.mjs > /tmp/sc006-default.txt`
3. `JEV_PROVIDER=openrouter node .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-jev-tiebreak.mjs --jev > /tmp/sc006-jev.txt`
4. `node .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-jev-tiebreak.mjs --deem --out /tmp/sc006-deem > /tmp/sc006-deem.txt`
5. `git status --porcelain > /tmp/sc006-after.txt`

### Expected

Step 2 prints the census, `baseline: holdout_top1=53/70`, the four comparators and the power line, and exits 0. Step 3 prints the same lines, then `jev: path=... provider=openrouter` and `jev arm skipped: no credential` when no OpenRouter key is stored. Step 4 prints the same lines, then `deem: health ...`, the cost line, five `column: backend=deem` lines, one `verdict:` line ending in `model=deem-0.8-v1 model_commit=... source_commit=...` and one `calibration: backend=deem` line. Steps 1 and 5 print the same status.

### Evidence

The three stdout files, `/tmp/sc006-deem/report.json`, the first lines of `/tmp/sc006-deem/calls.jsonl` and both status files.

### Pass / Fail

- **Pass**: every expected signal appears, the census block is byte-identical across the three runs and the two status files match.
- **Fail**: the census differs between runs, the baseline is not 53/70, a skipped arm made a call or a run changed the tree.

### Failure Triage

A `baseline mismatch: comparison void` line means the built scorer drifted, so rebuild the advisor `dist` and rerun the scorer-baseline ratchet. `deem arm skipped: not reachable` means the local Deem server is down, and the eval never starts it. A `jev arm skipped: version` line is followed by the version it found, which must be `jev 0.6.2`.

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
