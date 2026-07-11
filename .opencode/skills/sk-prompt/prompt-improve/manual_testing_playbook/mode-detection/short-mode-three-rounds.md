---
title: "SP-003 -- $short mode runs 3-round DEPTH (D-P-H)"
description: "This scenario validates `$short` mode for `SP-003`. It focuses on confirming DEPTH runs only Discover, Prototype, and Harmonize for a 3-round total, omitting Engineer and Test."
version: 2.3.0.4
---

# SP-003 -- $short mode runs 3-round DEPTH (D-P-H)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `SP-003`.

---

## 1. OVERVIEW

This scenario validates `$short` mode for `SP-003`. It focuses on confirming the trimmed DEPTH cycle runs exactly Discover, Prototype, and Harmonize (3 rounds) when routed through sk-prompt or `@prompt-improver`, and explicitly skips Engineer and Test.

### Why This Matters

`$short` is the operator escape hatch for fast iterations on already-decent prompts. If it silently runs the full 10 rounds, operators stop using it and bypass prompt-engineering entirely.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SP-003` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `$short` runs 3 DEPTH rounds (D-P-H) only
- Real user request: `$short Tighten this prompt for a quick iteration — no need for a full rewrite, I just want it sharper.`
- Prompt: `$short tighten my prompt; verify only Discover, Prototype, and Harmonize run, Engineer/Test are skipped, and CLEAR still applies.`
- Expected execution process: sk-prompt detects `$short` prefix, runs Discover (perspectives), skips Engineer (no framework mechanics expansion), runs Prototype (build), skips Test (no full re-score loop), runs Harmonize (RICCE polish), applies CLEAR once, returns enhanced prompt + report.
- Expected signals: DEPTH rounds = 3, phases run = D, P, H; phases skipped = E, T; CLEAR applied
- Desired user-visible outcome: Enhanced prompt + transparency report stating "Mode: $short", "DEPTH rounds: 3", "Phases skipped: Engineer, Test".
- Pass/fail: PASS if exactly 3 phases run and Engineer/Test are explicitly named as skipped; FAIL if more or fewer than 3 phases run, or skip notice missing.

---

## 3. TEST EXECUTION

### Prompt

```
$short tighten my prompt; verify only Discover, Prototype, and Harmonize run, Engineer/Test are skipped, and CLEAR still applies.
```

### Commands

1. `sk-prompt: $short Tighten this prompt for a quick iteration — no need for a full rewrite, I just want it sharper. <draft body>`
2. `bash: rg '\$short' .opencode/skills/sk-prompt/SKILL.md` (confirm short-mode row)

### Expected

Per-phase log shows D, P, H entries only; transparency report calls out Engineer and Test as skipped; CLEAR breakdown is present.

### Evidence

Capture transparency report. Inspect per-phase log to confirm 3-row count.

### Pass / Fail

- **Pass**: Per-phase log has exactly 3 rows (D, P, H); skip-notice covers Engineer and Test; CLEAR scored.
- **Fail**: Phase count != 3, Engineer or Test runs, or skip notice missing.

### Failure Triage

1. Confirm `$short` is the literal first token of the input.
2. Inspect SKILL.md §3 operating-modes row: `$short` should show `DEPTH Rounds: 3, Scoring: CLEAR`.
3. Inspect `references/depth_framework.md` for the documented short-cycle phase set.
4. Re-dispatch the same input under default mode and confirm 10 rounds run, isolating the short-mode trim.

### Optional Supplemental Checks

Use this subsection only when the feature needs a tightly scoped follow-up variant, compatibility check, or artifact note.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | sk-prompt skill source: §3 operating-modes table for `$short` |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/depth_framework.md` | DEPTH phase definitions for D, P, H |
| `../../references/patterns_evaluation.md` | CLEAR scoring still applies under `$short` |

---

## 5. SOURCE METADATA

- Group: Mode Detection
- Playbook ID: SP-003
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `mode-detection/short-mode-three-rounds.md`
