---
title: "CHT-004 -- A chart that draws nothing"
description: "This scenario validates the render pass for `CHT-004`. It confirms a chart producing no marks is caught, that the run says which mode it was and that an intermittent browser failure is told apart from a real one."
stage: validation
version: 1.0.0.0
---

# CHT-004 -- A chart that draws nothing

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CHT-004`.

---

## 1. OVERVIEW

This scenario validates the render pass for `CHT-004`. It confirms a chart producing no marks is caught, that the run says which mode it was and that an intermittent browser failure is told apart from a real one.

### Why This Matters

A file whose script produces no marks passes every structural check. The markup is complete, the palette block matches its source, the data block is in the right place, the card has its four parts and the script parses. Every check agrees the file is correct, and the file opens as an empty box.

Only `--render` opens it. The check launches a headless browser, waits for the script, then counts elements inside the figure region and fails a file holding fewer than four. That is the one check in this packet that looks at an outcome rather than at a shape.

Render is off by default, deliberately, so a machine with no browser cannot produce a silent skip that looks like a pass. The cost of that choice is that the mode line is load-bearing: a report quoting `RESULT: PASSED` without saying which mode produced it has not said what it proved.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CHT-004` and confirm the expected signals without contradictory evidence.

- Objective: confirm the render pass runs, catches a chart drawing nothing and reports the mode it ran in
- Real user request: `Check the chart corpus properly, not just whether the files are shaped right.`
- Prompt: `Run the chart corpus check with rendering on, and tell me what it opened and what it found.`
- Expected execution process: the check runs once without `--render` and once with it. Each run's output and exit status are read from a file rather than through a pipe, and the mode line and the per-check assertion counts are read alongside the `RESULT:` line.
- Expected signals: the structural run prints `render checks: not run (pass --render)` and no `render` row. The render run prints `render checks: requested` and a `render` row whose assertion count equals the number of files scanned. Both print `RESULT: PASSED`.
- Desired user-visible outcome: the user is told which mode ran, how many files were opened and any red result is classified before it is reported.
- Pass/fail: PASS when both runs report `RESULT: PASSED`, the render row's assertion count matches the scanned file count and the negative control below fails as intended. FAIL when a run is reported without its mode, when the render row is absent from a run claimed to have rendered or when the negative control passes.

### Preconditions

This scenario needs a Chrome or Chromium binary on one of the usual paths or named by `CHROME_PATH`. Without one, the render run records a `SKIP` naming the missing browser as the environment blocker. The check itself reports the same thing rather than passing quietly, which is the behavior this scenario also confirms.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Run the chart corpus check with rendering on, and tell me what it opened and what it found.`

### Commands

1. `bash: node .opencode/skills/sk-design/sk-create-chart/scripts/check-corpus.cjs > structural.txt 2>&1`
2. `bash: echo $?`
3. `bash: node .opencode/skills/sk-design/sk-create-chart/scripts/check-corpus.cjs --render > rendered.txt 2>&1`
4. `bash: echo $?`
5. `agent: Read both files and report the mode line, the scanned file count, every check row with its assertion count and the RESULT line`
6. `bash: git status --porcelain .opencode/skills/sk-design/sk-create-chart`

### Expected

Step 1 writes the structural run to a file, and step 2 reads its exit status separately, because a status read through a pipe is the pipe's status. Step 3 and step 4 do the same for the render run. Step 5 shows the structural run with no `render` row and the render run with one whose assertion count equals the scanned file count. Both end in `RESULT: PASSED` at exit 0. Step 6 returns empty output.

The render row is the assertion that the mode actually ran. A render run whose row is absent, or whose count is one, did not open the corpus.

### Evidence

Capture the prompt as typed, both output files in full, both exit statuses read separately from the output, the mode line from each run, the scanned file count, the `render` row with its assertion count and both `RESULT:` lines. Record `git status --porcelain` for the packet path. Record the negative-control result described below, because a render pass with no demonstrated failure is a check that has only ever agreed with itself.

### Pass / Fail

- **Pass**: both runs report `RESULT: PASSED` at exit 0, the render run carries a `render` row whose count matches the scanned files and the negative control produces `RESULT: FAILED` naming the file it broke.
- **Fail**: a run is reported without its mode line, the render row is missing or its count does not match the scanned files or the negative control passes.

### Failure Triage

1. Read the discriminator before touching a chart. A render failure naming a different file each run, that does not reproduce when the named file is opened by hand, is the browser refusing to start under sustained back-to-back launches. Pause and re-run. A failure naming the same file every run, that does reproduce by hand, is a chart drawing nothing.
2. When no browser was found, the check says so and fails rather than skipping. Set `CHROME_PATH` or drop `--render` and say plainly that rendering was not checked.
3. When the render row exists with an assertion count of one, the run recorded the missing-browser failure rather than opening the corpus.
4. When a file fails and reproduces, open it and read the figure region. An empty figure with a parsing script usually means the drawing code never reached the element it renders into, which the `unique-ids` and `script-parses` checks cannot see.

### Optional Supplemental Checks

The negative control belongs in every run of this scenario. Copy one form to a scratch path outside the packet under the same corpus tree, remove the call that draws its marks and run the check twice. The structural run reports `RESULT: PASSED`, because nothing structural changed. The render run reports `RESULT: FAILED` naming the file and the element count it found. Restore the tree and confirm `git status --porcelain` on the packet path is empty before the next scenario starts.

That pair is the whole argument for the render mode existing, and it takes one minute.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`manual-testing-playbook.md`](../manual-testing-playbook.md) | Root directory page, the scenario summary and the render flake discriminator |
| No feature-catalog entry | This packet ships no `feature-catalog/`, so no cross-reference exists for this scenario |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`scripts/check-corpus.cjs`](../../scripts/check-corpus.cjs) | Primary anchor, the render pass and its element-count threshold |
| [`scripts/README.md`](../../scripts/README.md) | How to read a run, and why the `RESULT:` line is required rather than the absence of a failure |
| [`references/template-contract.md`](../../references/template-contract.md) | Section 9, which states what the check does not observe |

---

## 5. SOURCE METADATA

- Group: CORPUS INTEGRITY
- Playbook ID: CHT-004
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `corpus-integrity/a-chart-that-draws-nothing.md`
