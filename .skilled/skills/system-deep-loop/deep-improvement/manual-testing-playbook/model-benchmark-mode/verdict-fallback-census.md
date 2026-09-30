---
title: "MB-052 -- Zero-Call Fixture Census and Stub-Backend Skip"
description: "This scenario validates Zero-Call Fixture Census and Stub-Backend Skip for `MB-052`. It focuses on the zero-call census of the fixture cases and the named skip of a stub Deem backend."
feature_id: "MB-052"
category: "Model_Benchmark Mode"
version: 1.19.0.0
---

# MB-052 -- Zero-Call Fixture Census and Stub-Backend Skip

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `MB-052`.

---

## 1. OVERVIEW

This scenario validates Zero-Call Fixture Census and Stub-Backend Skip for `MB-052`. It focuses on the zero-call census of the fixture cases and the named skip of a stub Deem backend.

### Why This Matters

Every shipped fixture case already yields a verdict from the deterministic pattern, so the fallback runs on none of the known cases. The census must still make no model call unless a switch asks for one, and a backend that fails its own check must be skipped with a named reason, so no run can score against a stub.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `MB-052` and confirm the expected signals without contradictory evidence.

- Objective: Confirm that the fixture census makes no model call and that a stub Deem backend is skipped by name.
- Real user request: `Check that the verdict fallback census runs without calling a model and that a stub Deem backend is skipped.`
- Prompt: `Check that the verdict fallback census runs without calling a model and that a stub Deem backend is skipped.`
- Expected execution process: Run the census on the shipped fixtures with stub `cli-deem` and `jev` binaries first on `PATH`, once plain and once with `--deem`.
- Expected signals: The plain census exits 0, prints `fixture cases: 8 hits: 8 misses: 0` and `stop: fewer than 12 labeled regex-miss outputs`, and leaves `/tmp/mb-052/calls.log` absent. The `--deem` run adds only `deem arm skipped: stub backend`.
- Desired user-visible outcome: A concise operator-facing PASS/FAIL verdict with the decisive lines from each run.
- Pass/fail: PASS if both runs print their expected lines with the expected exit codes, FAIL if the plain census calls a stub or the `--deem` run asks the stub a question.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Check that the verdict fallback census runs without calling a model and that a stub Deem backend is skipped.`

### Commands

Run from the repository root.

1. `rm -rf /tmp/mb-052 && mkdir -p /tmp/mb-052/bin`
2. `printf '#!/bin/sh\necho "cli-deem $*" >> /tmp/mb-052/calls.log\n[ "$1" = health ] && echo "{\\"backend\\":\\"stub\\"}"\nexit 0\n' > /tmp/mb-052/bin/cli-deem && printf '#!/bin/sh\necho "jev $*" >> /tmp/mb-052/calls.log\n[ "$1" = "--version" ] && echo "jev 0.6.2"\n[ "$1" = "auth" ] && exit 3\nexit 0\n' > /tmp/mb-052/bin/jev && chmod +x /tmp/mb-052/bin/*`
3. `PATH=/tmp/mb-052/bin:$PATH node .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs > /tmp/mb-052/census.txt; echo "exit=$?"; cat /tmp/mb-052/census.txt; ls /tmp/mb-052/calls.log`
4. `PATH=/tmp/mb-052/bin:$PATH node .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs --deem --out /tmp/mb-052/deem > /tmp/mb-052/deem.txt; echo "exit=$?"; diff /tmp/mb-052/census.txt /tmp/mb-052/deem.txt; cat /tmp/mb-052/calls.log`

### Expected

Step 3 prints `exit=0` and this block, and `ls` reports that `/tmp/mb-052/calls.log` does not exist:

```
fixture cases: 8 hits: 8 misses: 0
labeled: 0 (pass 0, fail 0, block 0)
baseline majority: pass right 0 of 0
baseline loose: right 0 of 0
baseline method: loose right 0 of 0
baseline unknown: right 0 of 0
question: Which verdict does this reviewer output give?
options: 3 sha256=6c5e221169decec88acef0f7f10d22b413b98cdaae775807e8587341b6b1f771
orders: 3, name order then rotated left by 1 and by 2
margin: 0.10
keep rule: coverage 10*M >= 9*K, kill p_loss < 0.05, margin 10*(A-B) >= M, sign test p_win < 0.05, flips 10*F <= 3*M
power: a keep needs at least 5 wins with no loss, since 0.5^5 is 0.031
stop: fewer than 12 labeled regex-miss outputs
```

Step 4 prints `exit=0`. The diff shows one added line, `deem arm skipped: stub backend`, and `calls.log` holds exactly one line, `cli-deem health`.

### Evidence

The terminal transcript of steps 3 and 4, `/tmp/mb-052/census.txt`, `/tmp/mb-052/deem.txt`, `/tmp/mb-052/calls.log` and `/tmp/mb-052/deem/report.json`.

### Pass / Fail

- **Pass**: every expected line appears with the stated exit code, and `calls.log` holds only the health check.
- **Fail**: step 3 exits 2 or creates `calls.log`, or step 4 logs a `choice` call.

### Failure Triage

If step 3 exits 2, read the message on stderr and check the `parseArgs` options in `score-verdict-fallback.cjs`. If step 3 creates `calls.log`, find which code path spawns a backend without `--deem` or `--jev`. If step 4 shows a different skip reason, run `/tmp/mb-052/bin/cli-deem health` by hand and compare its output with the health checks in `score-verdict-fallback.cjs`. If `fixture cases:` is not `8 hits: 8 misses: 0`, count the fixture cases and their recorded outputs again, because the fixture set may have changed.

### Optional Supplemental Checks

Run step 4 again with `--jev --out /tmp/mb-052/jev` in place of `--deem --out /tmp/mb-052/deem`. The stub `jev` answers `--version` with `jev 0.6.2` and `auth status` with exit 3, so the diff shows two added lines, `jev: path=/tmp/mb-052/bin/jev provider=official` and `jev arm skipped: no credential`, and `calls.log` gains only `jev --version` and `jev auth status --provider official`.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../feature-catalog/model-benchmark-mode/reviewer-verdict-fallback.md` | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../scripts/model-benchmark/lib/score-verdict-fallback.cjs` | Runs the fixture census, the label gate and the opt-in Deem and Jev arms |
| `../../scripts/model-benchmark/tests/verdict-fallback.vitest.ts` | Automated census, gate and arm coverage against stub binaries |

---

## 5. SOURCE METADATA

- Group: Model-Benchmark Mode
- Playbook ID: MB-052
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `model-benchmark-mode/verdict-fallback-census.md`
