---
title: "SC-007 -- Offline Suggested-Order Eval"
description: "This scenario validates the offline suggested-order eval for `SC-007`. It focuses on the zero-call run with its advisor-only timing and on a gate skip that leaves the zero-call lines unchanged."
stage: routing
version: 0.14.0.0
---

# SC-007 -- Offline Suggested-Order Eval

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `SC-007`.

---

## 1. OVERVIEW

This scenario validates the offline suggested-order eval for `SC-007`. It focuses on the zero-call run with its advisor-only timing and on a gate skip that leaves the zero-call lines unchanged.

### Why This Matters

The eval decides whether a model's order of the advisor's near-tie cluster is worth a later live phase, so its default run must cost nothing and must show how much of the 2,200 ms budget the advisor already spends. A default run that called a model, or a gate that let a call through, would make every verdict it prints meaningless.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SC-007` and confirm the expected signals without contradictory evidence.

- Objective: confirm that the default run makes no model call and prints the census, the advisor-only timing and either a headroom stop or the planned calls, then confirm that a failed gate skips its arm without changing the zero-call lines.
- Real user request: `Would a model's order of the advisor's near-ties help, and is there time for it inside the hook?`
- Prompt: `Run the offline suggested-order eval, then a Jev run against a stub, and tell me what it printed.`
- Expected execution process: run the default eval, run `--jev --out` with a stub `jev` first on PATH whose auth check fails, then compare the two outputs.
- Expected signals: `baseline: holdout_top1=53/70`, the `comparator:` lines, a `power:` line, one `advisor child:` line, `no headroom (...)` or `planned calls:`, `margin: 0.05` and a `keep rule:` line on both runs, plus `jev arm skipped: no credential` on the second run when the first printed `planned calls:`.
- Desired user-visible outcome: the advisor's own p50 and p95 against 2,200 ms, and whether the model arm may call.
- Pass/fail: PASS if every expected signal appears, the two outputs differ only in the skip line and the measured `advisor child:` numbers and `git status --porcelain` is unchanged. FAIL if a run calls a model without its switch or changes the tree.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Run the offline suggested-order eval, then a Jev run against a stub, and tell me what it printed.`

### Commands

1. `git status --porcelain > /tmp/sc007-before.txt`
2. `node .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-suggested-order.mjs > /tmp/sc007-default.txt`
3. `mkdir -p /tmp/sc007-stub && printf '#!/bin/sh\ncase "$1" in --version) echo "jev 0.6.2";; auth) exit 3;; esac\n' > /tmp/sc007-stub/jev && chmod 755 /tmp/sc007-stub/jev`
4. `PATH="/tmp/sc007-stub:$PATH" node .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-suggested-order.mjs --jev --out /tmp/sc007-jev > /tmp/sc007-jev.txt`
5. `git status --porcelain > /tmp/sc007-after.txt`

### Expected

Step 2 prints the census, `baseline: holdout_top1=53/70`, the comparators and the power line. It then prints `advisor child: p50=... p95=... max=... over_2200=... children=241 killed=...`, one of `no headroom (movable)`, `no headroom (latency)` or `planned calls: jev=...`, then `margin: 0.05` and the `keep rule:` line, and exits 0. Step 4 prints the same lines with newly measured `advisor child:` numbers. When step 2 printed `planned calls:`, step 4 adds the Jev identity line and one skip line, `jev arm skipped: no credential`. It exits 0 and writes `/tmp/sc007-jev/report.json` with no column. Steps 1 and 5 print the same status.

### Evidence

The two stdout files, `/tmp/sc007-jev/report.json` and both status files.

### Pass / Fail

- **Pass**: every expected signal appears and the outputs match apart from the skip line and the `advisor child:` numbers. The two status files match.
- **Fail**: the baseline is not 53/70, a run called a model, or a run changed the tree.

### Failure Triage

A `baseline mismatch: comparison void` line means the built scorer drifted, so rebuild the advisor `dist` and rerun the scorer-baseline ratchet. A `no headroom (latency)` line means the advisor alone spent more than 2,200 ms at p95 on this machine, and it stops the arm by design. `--jev` without `--out` exits 2 before any output.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../feature-catalog/scorer-fusion/suggested-order-eval.md` | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-suggested-order.mjs` | Primary implementation anchor |
| `.skilled/skills/system-skill-advisor/runtime/tests/parity/score-suggested-order.vitest.ts` | Regression anchor |

---

## 5. SOURCE METADATA

- Group: Scorer Fusion
- Playbook ID: SC-007
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `scorer-fusion/suggested-order-eval.md`
