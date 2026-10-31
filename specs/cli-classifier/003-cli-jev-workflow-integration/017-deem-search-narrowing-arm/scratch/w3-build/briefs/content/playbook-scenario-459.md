---
title: "459 -- Track narrowing measurement"
description: "This scenario validates the track narrowing measurement for `459`. It focuses on the zero-call default run and a Deem arm that skips a stub backend."
version: 4.2.0.0
---

# 459 -- Track narrowing measurement

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `459`.

---

## 1. OVERVIEW

This scenario validates the track narrowing measurement for `459`. It focuses on the zero-call default run and a Deem arm that skips a stub backend.

### Why This Matters

The default run is the one an operator can make at any time, so it has to print both baselines and the headroom line without calling a model or writing a file. A model arm pointed at a backend that is not the real model would measure nothing, so a stub backend has to skip the arm rather than answer.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `459` and confirm the expected signals without contradictory evidence.

- Objective: confirm that the default run prints the test set, both baselines, the keep rule and a headroom line with no model call and no written file, and that the suite's stub-backend case skips the Deem arm
- Real user request: `Would a model that picks the spec track beat ripgrep here, and can I find out without calling one?`
- Prompt: `Run the track narrowing measurement with no switch, confirm it printed both baselines and a headroom line and changed no file, then run its test suite.`
- Expected execution process: the working-tree status is captured, the script runs with no switch, the status is captured again and compared, and the vitest suite runs.
- Expected signals: stdout starts with `index manifestHash:`, holds lines starting `baseline lookup:`, `baseline ripgrep:`, `baseline method:` and `keep rule:`, then a `headroom:` or a `no headroom:` line, and ends with a line starting `paraphrase probes:`. No line starts with `deem` or `jev`. The two status captures match. The suite passes, including `skips a stub backend with the rest of the output byte-identical`.
- Desired user-visible outcome: both baseline rates, the headroom verdict and a statement that nothing was called or written, with the evidence.
- Pass/fail: PASS if the lines are present, the status is unchanged and the suite passes. FAIL if a line is missing, a file changed or a test fails.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Run the track narrowing measurement with no switch, confirm it printed both baselines and a headroom line and changed no file, then run its test suite.`

### Commands

1. `git status --porcelain > /tmp/stn-before.txt`
2. `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs`
3. `git status --porcelain | diff /tmp/stn-before.txt -`
4. `cd .skilled/skills/system-spec-kit/runtime/cli && npx vitest run --config ../../vitest.config.ts --project cli tests/score-track-narrowing.vitest.ts`

### Expected

Step 2 exits 0 and prints the lines the scenario contract names, then `wall time:` on stderr. It runs one ripgrep search per distinct question word, so on the full tree it can take about 40 minutes. Step 3 prints nothing. Step 4 passes every case, including `default run prints the zero-call report, spawns no model binary and writes no file` and `skips a stub backend with the rest of the output byte-identical`.

### Evidence

Capture step 2's full stdout and its exit status, the wall time line, step 3's empty diff and the suite's summary line with its exit status.

### Pass / Fail

- **Pass**: every named line is present, step 3 prints nothing and the suite passes.
- **Fail**: a named line is missing, a line starts with `deem` or `jev`, step 3 shows a change or a test fails.

### Failure Triage

1. A `no headroom:` line is a pass, not a failure: the better baseline already names the track on more than nine rows in ten, so a model arm would skip.
2. When step 3 shows a change, name the path, because the script writes nothing without `--out`.
3. When the lookup baseline looks wrong, run `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs --check` and rebuild the index from committed content if it is stale.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../feature-catalog/retrieval/track-narrowing-measurement.md` | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs` | Builds the test set, scores both baselines and prints the report |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/score-track-narrowing.vitest.ts` | The zero-call run, the Deem and Jev gates and both model arms on stub binaries |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/semantic-probes.json` | The paraphrase probes the last line reports |

Provenance: runtime/cli/tests/score-track-narrowing.vitest.ts

---

## 5. SOURCE METADATA

- Group: Retrieval
- Playbook ID: 459
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `retrieval/track-narrowing-measurement.md`
