---
title: "5D-051 -- Unknown Grader Exit and Zero-Call D4 Census"
description: "This scenario validates Unknown Grader Exit and Zero-Call D4 Census for `5D-051`. It focuses on the startup refusal of an unknown grader kind and the zero-call census of the hallucination grader agreement script."
feature_id: "5D-051"
category: "5D Scorer"
version: 1.18.0.0
---

# 5D-051 -- Unknown Grader Exit and Zero-Call D4 Census

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `5D-051`.

---

## 1. OVERVIEW

This scenario validates Unknown Grader Exit and Zero-Call D4 Census for `5D-051`. It focuses on the startup refusal of an unknown grader kind and the zero-call census of the hallucination grader agreement script.

### Why This Matters

An unknown `--grader` value once scored with the mock stub and printed nothing, so a report could carry fake D4 numbers. The agreement script must also never reach a model unless a switch asks for one, and a backend that fails its own check must be skipped with a named reason.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `5D-051` and confirm the expected signals without contradictory evidence.

- Objective: Confirm that an unknown grader kind stops the runner at startup, that the D4 census makes no model call and that a stub backend is skipped by name.
- Real user request: `Check that a mistyped grader stops the benchmark and that the D4 census never calls a model by default.`
- Prompt: `Check that a mistyped grader stops the benchmark and that the D4 census never calls a model by default.`
- Expected execution process: Run the runner with `--grader jev` against a missing profile, then run the census on one output per fixture with stub `cli-deem` and `jev` binaries first on `PATH`, once plain and once with `--deem`.
- Expected signals: The runner exits 2 and names `'jev'` with the usage line. The plain census exits 0, prints `allowlist: 0 of 21` and `stop: fewer than 30 labeled outputs`, and leaves `/tmp/5d-051/calls.log` absent. The `--deem` run adds only `deem arm skipped: stub backend`.
- Desired user-visible outcome: A concise operator-facing PASS/FAIL verdict with the decisive lines from each run.
- Pass/fail: PASS if all three runs print their expected lines with the expected exit codes, FAIL if the runner accepts `jev`, the plain census calls a stub or the `--deem` run asks the stub a question.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Check that a mistyped grader stops the benchmark and that the D4 census never calls a model by default.`

### Commands

Run from the repository root.

1. `rm -rf /tmp/5d-051 && mkdir -p /tmp/5d-051/bin /tmp/5d-051/outputs`
2. `node .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs --profile /tmp/5d-051/no-such-profile.json --outputs-dir /tmp/5d-051/outputs --output /tmp/5d-051/report.json --scorer 5dim --grader jev; echo "exit=$?"`
3. `printf '#!/bin/sh\necho "cli-deem $*" >> /tmp/5d-051/calls.log\n[ "$1" = health ] && echo "{\\"backend\\":\\"stub\\"}"\nexit 0\n' > /tmp/5d-051/bin/cli-deem && printf '#!/bin/sh\necho "jev $*" >> /tmp/5d-051/calls.log\nexit 3\n' > /tmp/5d-051/bin/jev && chmod +x /tmp/5d-051/bin/*`
4. `for f in .skilled/skills/system-deep-loop/deep-improvement/assets/model-benchmark/benchmark-fixtures/*.json; do id=$(node -p "require('./$f').id || '$(basename "$f" .json)'"); printf '# Output\n' > "/tmp/5d-051/outputs/$id.md"; done`
5. `PATH=/tmp/5d-051/bin:$PATH node .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs --outputs /tmp/5d-051/outputs > /tmp/5d-051/census.txt; echo "exit=$?"; cat /tmp/5d-051/census.txt; ls /tmp/5d-051/calls.log`
6. `PATH=/tmp/5d-051/bin:$PATH node .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs --outputs /tmp/5d-051/outputs --deem --out /tmp/5d-051/deem > /tmp/5d-051/deem.txt; echo "exit=$?"; diff /tmp/5d-051/census.txt /tmp/5d-051/deem.txt; cat /tmp/5d-051/calls.log`

### Expected

Step 2 prints `run-benchmark: unknown --grader 'jev' (expected noop, mock or llm)` and the `Usage: node run-benchmark.cjs --profile` line, then `exit=2`, and writes no `/tmp/5d-051/report.json`. Step 5 prints `exit=0`, `allowlist: 0 of 21` and `stop: fewer than 30 labeled outputs`, and `ls` reports that `/tmp/5d-051/calls.log` does not exist. Step 6 prints `exit=0`, the diff shows one added line, `deem arm skipped: stub backend`, and `calls.log` holds exactly one line, `cli-deem health`.

### Evidence

The terminal transcript of steps 2, 5 and 6, `/tmp/5d-051/census.txt`, `/tmp/5d-051/deem.txt`, `/tmp/5d-051/calls.log` and `/tmp/5d-051/deem/report.json`.

### Pass / Fail

- **Pass**: every expected line appears with the stated exit code, and `calls.log` holds only the health check.
- **Fail**: step 2 exits 0 or writes a report, step 5 creates `calls.log` or step 6 logs a `noul` call.

### Failure Triage

If step 2 exits 0, check the `VALID_GRADERS` guard in `run-benchmark.cjs` and confirm it runs before the profile loads. If step 5 creates `calls.log`, find which code path spawns a backend without `--deem` or `--jev`. If step 6 shows a different skip reason, run `/tmp/5d-051/bin/cli-deem health` by hand and compare its output with the health checks in `score-d4-agreement.cjs`. If `allowlist` is not `0 of 21`, count the fixture files and their `allowlist` keys again, because the fixture set may have changed.

### Optional Supplemental Checks

Run step 6 again with `--jev --out /tmp/5d-051/jev` in place of `--deem --out /tmp/5d-051/deem`. The stub `jev` answers `--version` with nothing, so the diff shows the `jev: path=` identity line, then `jev arm skipped: version` and a `jev: found=""` line, and `calls.log` gains only `jev --version`.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../feature-catalog/scoring-system/hallucination-grader-agreement.md` | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../scripts/model-benchmark/run-benchmark.cjs` | Refuses an unknown `--grader` value before any profile loads |
| `../../scripts/model-benchmark/scorer/score-d4-agreement.cjs` | Runs the census, the label gate and the opt-in Deem and Jev arms |
| `../../scripts/model-benchmark/tests/d4-agreement.vitest.ts` | Automated census, gate and arm coverage against stub binaries |
| `../../scripts/model-benchmark/tests/run-benchmark-hardening.vitest.ts` | Automated coverage of the unknown-grader exit |

---

## 5. SOURCE METADATA

- Group: 5D Scorer
- Playbook ID: 5D-051
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `five-d-scorer/unknown-grader-and-d4-census.md`
