---
title: "SP-001 -- Default mode routing through 10-round DEPTH"
description: "This scenario validates default-mode (no `$` prefix) routing for `SP-001`. It focuses on confirming the unmarked path runs full DEPTH (10 rounds) plus CLEAR scoring."
version: 2.3.0.4
---

# SP-001 -- Default mode routing through 10-round DEPTH

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `SP-001`.

---

## 1. OVERVIEW

This scenario validates default-mode routing for `SP-001`. It focuses on confirming that an operator request with no `$` prefix runs the full 10-round DEPTH cycle and applies CLEAR scoring with the 40+/50 threshold through the canonical `@prompt-improver` escalation surface.

### Why This Matters

Default mode is the most common entry path for operators who do not yet know the prefix system. A regression here silently halves the rigor of every untagged enhancement, so the routing contract has to stay deterministic.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SP-001` and confirm the expected signals without contradictory evidence.

- Objective: Confirm default mode runs 10-round DEPTH + CLEAR
- Real user request: `I'm writing a prompt to extract action items from meeting notes — score it and tighten it.`
- Prompt: `Run sk-prompt on my meeting-notes action-item prompt in default mode; verify 10 DEPTH rounds, CLEAR scoring, and threshold enforcement.`
- Expected execution process: sk-prompt detects no `$` prefix, defaults to TEXT_ENHANCE intent, loads `references/depth_framework.md` + `references/patterns_evaluation.md`, runs all five DEPTH phases for 10 total rounds, applies CLEAR, and emits the transparency report.
- Expected signals: Mode = default (10 rounds), CLEAR score >= 40/50 in transparency report
- Desired user-visible outcome: Enhanced prompt + transparency report stating "Mode: default", "DEPTH rounds: 10", and a CLEAR score >= 40/50.
- Pass/fail: PASS if transparency report names default mode and 10 DEPTH rounds and CLEAR >= 40; FAIL if mode != default, DEPTH-round count != 10, CLEAR < 40 with no iteration attempt, or transparency report missing.

---

## 3. TEST EXECUTION

### Prompt

```
Run sk-prompt on my meeting-notes action-item prompt in default mode; verify 10 DEPTH rounds, CLEAR scoring, and threshold enforcement.
```

### Commands

1. `sk-prompt: I'm writing a prompt to extract action items from meeting notes — score it and tighten it.`
2. `bash: grep -E '^\| Improve' .opencode/skills/sk-prompt/SKILL.md` (confirm default-mode row in operating-modes table)

### Expected

Mode detected as default; DEPTH runs 10 rounds across D-E-P-T-H; CLEAR score reported with all 5 dimensions; threshold check applied (re-iterate if < 40).

### Evidence

Capture the full transparency report including mode, DEPTH-round count, framework picked, CLEAR breakdown, and the enhanced prompt body.

### Pass / Fail

- **Pass**: Transparency report shows default mode, 10 DEPTH rounds, CLEAR >= 40/50.
- **Fail**: Mode != default, round count != 10, CLEAR < 40 with no iteration, or transparency report missing.

### Failure Triage

1. Confirm operator input contains no `$` prefix and no override directive.
2. Inspect SKILL.md §3 operating-modes table to confirm default = 10 rounds.
3. Run `bash: rg '\$improve' .opencode/skills/sk-prompt/SKILL.md` to confirm the alias still points to default mode.
4. Re-dispatch with explicit `$improve` prefix and compare round counts.

### Optional Supplemental Checks

Use this subsection only when the feature needs a tightly scoped follow-up variant, compatibility check, or artifact note.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | sk-prompt skill source: §3 operating-modes table, §1 keyword triggers |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/depth_framework.md` | DEPTH methodology for the 10-round contract |
| `../../references/patterns_evaluation.md` | CLEAR scoring (40+/50 threshold) |

---

## 5. SOURCE METADATA

- Group: Mode Detection
- Playbook ID: SP-001
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `mode_detection/default_mode_routing.md`
