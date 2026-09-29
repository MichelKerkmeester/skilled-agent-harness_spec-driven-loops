---
title: "461 -- Alignment suggestion measurement"
description: "This scenario validates the alignment suggestion measurement for `461`. It focuses on a default run that prints the census lines and both replay lines with no model call, and on the suite that proves 42 stub-backed cases."
version: 4.4.0.0
---

# 461 -- Alignment suggestion measurement

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `461`.

---

## 1. OVERVIEW

This scenario validates the alignment suggestion measurement for `461`. It focuses on a default run that prints the census lines and both replay lines with no model call, and on the suite that proves 42 stub-backed cases.

### Why This Matters

The measurement reads tracked repository files and calls no model on its default run, so the report shape and the label gate have to be provable without any credential. The default run shows the census and replay shape, the label gate stops a rows file with empty labels before any arm runs, and the suite checks that every backend is a stub.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `461` and confirm the expected signals without contradictory evidence.

- Objective: confirm that a default run prints the census lines and both replay lines and exits 0 with no `jev` or `cli-deem` started, that the label gate on a rows file with empty labels prints one stop line and exits 0 and leaves the output folder uncreated, and that the suite reports 42 passed
- Real user request: `When a save scores below 50, would a classifier picking one of the listed folders beat the plain baseline, and can we find out without calling a model?`
- Prompt: `Run the alignment suggestion measurement on tracked files, run its label gate on a rows file with empty labels with the deem arm and an output folder outside the repository, then run its test suite.`
- Expected execution process: every command runs from `.skilled/skills/system-spec-kit/runtime/cli`, the scorer runs with no switch, then with `--score` on a rows file with empty labels and `--deem` and `--out` on a folder outside the repository, then the vitest suite runs.
- Expected signals: step 1 prints `census source: tracked files via git grep, source code skipped`, `committed: files=<n> events=<n> skipped_source=<n>`, `committed path cli: ... below50=<n> ...`, `committed path data: ...`, `replay cli: validateContentAlignment root=specs ...` and `replay data: validateFolderAlignment root=synthetic ...`, and exits 0 without starting `jev` or `cli-deem`. Step 2 prints `stop: fewer than 30 labeled rows (0 labeled)` and exits 0, and the output folder is not created. Step 3 reports 42 passed and exits 0.
- Desired user-visible outcome: the census and replay counts, the label-gate stop line and the suite summary, with the evidence.
- Pass/fail: PASS if every signal holds. FAIL if a line is missing, `jev` or `cli-deem` starts, the stop line shows a count other than 0, the output folder exists after step 2 or a test fails.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Run the alignment suggestion measurement on tracked files, run its label gate on a rows file with empty labels with the deem arm and an output folder outside the repository, then run its test suite.`

### Commands

1. `cd .skilled/skills/system-spec-kit/runtime/cli && npx tsx evals/score-alignment-suggestion.ts`
2. `cd .skilled/skills/system-spec-kit/runtime/cli && npx tsx evals/score-alignment-suggestion.ts --score <rows file with empty labels> --deem --out <dir outside the repo>`
3. `cd .skilled/skills/system-spec-kit/runtime/cli && npx vitest run --config ../../vitest.config.ts --project cli tests/score-alignment-suggestion.vitest.ts`

### Expected

Step 1 prints the census lines and both replay lines and exits 0, with no `jev` or `cli-deem` started. Step 2 prints `stop: fewer than 30 labeled rows (0 labeled)` and exits 0, and `<dir>` is not created. Step 3 reports 42 passed and exits 0.

### Evidence

Capture step 1's stdout and exit status, step 2's stop line and exit status with a check that `<dir>` does not exist, and the suite's summary line with its exit status.

### Pass / Fail

- **Pass**: every named line is present, no `jev` or `cli-deem` starts, step 2 prints one stop line with `0 labeled`, `<dir>` stays uncreated and the suite passes.
- **Fail**: a named line is missing, `jev` or `cli-deem` starts, step 2 prints anything else or exits other than 0, `<dir>` exists after step 2 or a test fails.

### Failure Triage

1. When step 2 exits 2, the run refused one of its output paths: a `--report`, `--rows-out` or `--out` path inside the repository prints `refused: --<flag> path is inside the repository`, so name a folder outside the repository.
2. When the stop line in step 2 shows a count above 0, the rows file carries labels: only the operator writes labels, and a rows file with empty labels reads as `0 labeled`.
3. When only an arm case fails in step 3, read the skip line the case asserts: a failed gate prints exactly one line, `jev arm skipped: jev not on PATH`, `version`, `no credential` or `payload not accepted`, or `deem arm skipped: <reason>`, and a skip changes nothing else.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../feature-catalog/tooling-and-scripts/alignment-suggestion-measurement.md` | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/system-spec-kit/runtime/cli/evals/score-alignment-suggestion.ts` | Counts the alignment saves in tracked repository files, replays both paths and prints the census lines, the replay lines, the label gate and the verdict lines |
| `runtime/cli/spec-folder/alignment-validator.ts` | Read only: the script replays `validateContentAlignment`, `validateFolderAlignment` and `isArchiveFolder` from here |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/score-alignment-suggestion.vitest.ts` | 42 cases, run from `runtime/cli` as `npx vitest run --config ../../vitest.config.ts --project cli tests/score-alignment-suggestion.vitest.ts`, with every backend in the file a stub |

Provenance: runtime/cli/tests/score-alignment-suggestion.vitest.ts

---

## 5. SOURCE METADATA

- Group: Tooling And Scripts
- Playbook ID: 461
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `tooling-and-scripts/alignment-suggestion-measurement.md`
