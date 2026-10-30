---
title: "SP-002 -- $raw passes through with no checklist"
description: "This scenario validates `$raw` passthrough for `SP-002`. It focuses on confirming the prefix skips the checklist and the CLEAR screen, and returns the input with only the cleanup the operator asked for."
trigger_phrases:
  - "raw mode passthrough"
  - "no checklist mode"
  - "prompt cleanup only"
  - "skip clear screen"
importance_tier: important
contextType: implementation
version: 3.0.0.0
---

# SP-002 -- $raw passes through with no checklist

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `SP-002`.

---

## 1. OVERVIEW

This scenario validates `$raw` passthrough for `SP-002`. It focuses on confirming the prefix bypasses the checklist and the CLEAR screen, and that the prompt comes back carrying only the change the operator requested.

`$raw` exists for the caller that already owns its prompt handling. It asks for no pass over the ten rows, no score, and no commentary about the work. The text goes in, the requested cleanup comes out.

### Why This Matters

An operator who asks for whitespace cleanup and receives a rewritten prompt learns that sk-prompt cannot be trusted with a prompt that already works. Once output text is no longer predictable, tested prompts stop being stable, and every later comparison has to account for edits nobody asked for. The passthrough is the mode that keeps a working prompt working.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SP-002` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `$raw` skips the checklist and the CLEAR screen and returns the input with only the asked-for cleanup.
- Real user request: `$raw clean up my prompt's whitespace only`
- Prompt: `$raw clean up my prompt's whitespace only; confirm the checklist and the CLEAR screen stay skipped and that no change report is emitted.`
- Expected execution process: sk-prompt detects the `$raw` prefix, runs no checklist pass, computes no CLEAR score, and returns the input with whitespace and line-wrap cleanup applied.
- Expected signals: a one-line notice reading `Mode: $raw (no checklist)`, no CLEAR breakdown, no open items, no change report.
- Desired user-visible outcome: Output that matches the input apart from whitespace, followed by the single mode notice.
- Pass/fail: PASS if the output differs from the input only in whitespace and no screen or report appears; FAIL if any checklist row, CLEAR score or rewrite appears.

---

## 3. TEST EXECUTION

### Prompt

```
$raw clean up my prompt's whitespace only; confirm the checklist and the CLEAR screen stay skipped and that no change report is emitted.
```

### Commands

1. `sk-prompt: $raw clean up my prompt's whitespace only`
2. `agent: @prompt-improver $raw clean up my prompt's whitespace only; return the draft with whitespace and line-wrap fixes only, no checklist rows, no CLEAR score, no open items and no change report. <draft body>`
3. `bash: rg -n 'NO_LOAD_INTENTS' .skilled/skills/sk-prompt/ROUTER.md` (confirm `$raw` sits in the no-load intent set)

### Expected

The output preserves the input text apart from whitespace. One line reads `Mode: $raw (no checklist)`. No checklist rows are listed, no CLEAR score appears, and no Added, Changed, Removed or Skipped section closes the answer.

### Evidence

Capture the full response and the input side by side. Diff the two after collapsing whitespace and confirm the remaining lines are identical. Quote the mode notice line as it appears.

### Pass / Fail

- **Pass**: The output differs from the input only in whitespace, the mode notice appears once, and no checklist, CLEAR score, open item or change report is present.
- **Fail**: Any checklist row is listed, a CLEAR score or dimension is reported, a rewrite appears, or an Added/Changed/Removed/Skipped report is emitted.

### Failure Triage

1. Confirm `$raw` is the literal first token of the input, with no leading whitespace before the `$`.
2. Inspect the mode table in `../../SKILL.md`: the `$raw` entry should show no checklist pass and no scoring.
3. Inspect `NO_LOAD_INTENTS` in `../../ROUTER.md`: `RAW` must be listed, otherwise a reference file loads and pulls the pass back in.
4. Re-run with the prefix lowercased to learn whether the prefix is case-sensitive.

### Optional Supplemental Checks

Use this subsection only when the feature needs a tightly scoped follow-up variant, compatibility check, or artifact note.

A useful variant sends a body containing a deliberate contradiction as well as double blank lines. The contradiction must pass through untouched while the blank lines collapse, which separates "no checklist" from "no editing at all".

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | sk-prompt skill source: mode table entry naming `$raw` as the no-pass mode |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../ROUTER.md` | Routing rules; `NO_LOAD_INTENTS = ("RAW",)` is what keeps reference files from loading for `$raw` |
| `../../SKILL.md` | Mode table and keyword triggers that define what `$raw` turns off |
| `../../references/improvement-checklist.md` | The ten rows and effort levels, including `$raw` as the level that runs no pass |
| `../../references/patterns-evaluation.md` | The CLEAR screen definition that `$raw` skips |

---

## 5. SOURCE METADATA

- Group: Mode Detection
- Playbook ID: SP-002
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `mode-detection/raw-mode-passthrough.md`
