---
title: "DAC-016 -- Hunter Skeptic Referee cross-critique"
description: "This scenario validates the adversarial cross-critique pattern for `DAC-016`. It focuses on HUNTER, SKEPTIC, REFEREE, and post-critique score adjustment."
---

# DAC-016 -- Hunter Skeptic Referee cross-critique

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DAC-016`.

---

## 1. OVERVIEW

This scenario validates the adversarial cross-critique pattern for `DAC-016`. It focuses on close-score council handling and score adjustment after critique.

### Why This Matters

Close scores and identical plans are where fake consensus hides. Hunter, Skeptic, and Referee roles force the council to test whether agreement is earned.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `DAC-016` and confirm the expected signals without contradictory evidence.

- Objective: Verify Hunter, Skeptic, and Referee roles are documented with the score adjustment rule and comparison-table treatment.
- Real user request: Apply the Hunter / Skeptic / Referee critique pattern to a hypothetical close-score council and show the score adjustment.
- Prompt: `Apply the Hunter / Skeptic / Referee critique pattern to a hypothetical close-score council and show the score adjustment.`
- Expected execution process: Inspect `scoring_rubric.md` §4, then grep for the role names and pre/post critique rows.
- Expected signals: HUNTER, SKEPTIC, REFEREE documented; Pre-Critique and Post-Critique table treatment present; adjustment rule says max +/-10.
- Desired user-visible outcome: The user sees how critique changes or preserves a close-score comparison.
- Pass/fail: PASS if all three roles are documented with score adjustment rule; FAIL if any role or adjustment rule is missing.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Read `scoring_rubric.md` §4.
2. Run role-name grep.
3. Run pre/post critique grep.
4. Confirm the score adjustment rule is documented.

### Prompt

`Apply the Hunter / Skeptic / Referee critique pattern to a hypothetical close-score council and show the score adjustment.`

### Commands

1. `bash: rg -n "HUNTER|SKEPTIC|REFEREE" .opencode/skills/deep-ai-council/references/scoring_rubric.md`
2. `bash: rg -n "Pre-Critique|Post-Critique" .opencode/skills/deep-ai-council/references/scoring_rubric.md`

### Expected

All three roles are documented with the score adjustment rule and pre/post critique comparison-table rows.

### Evidence

Capture grep output for role names and table stages.

### Pass / Fail

- **Pass**: All three roles documented with score adjustment rule.
- **Fail**: Any role, pre/post row, or adjustment rule is missing.

### Failure Triage

Restore `scoring_rubric.md` §4 from agent §6 adversarial cross-critique content.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DAC-016 | Hunter Skeptic Referee | Verify cross-critique roles and adjustment | `Apply the Hunter / Skeptic / Referee critique pattern to a hypothetical close-score council and show the score adjustment.` | `bash: rg -n "HUNTER\|SKEPTIC\|REFEREE" .opencode/skills/deep-ai-council/references/scoring_rubric.md` -> `bash: rg -n "Pre-Critique\|Post-Critique" .opencode/skills/deep-ai-council/references/scoring_rubric.md` | Role names and pre/post rows present | Grep output | PASS if all roles and adjustment rule exist | Restore critique section |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual_testing_playbook.md` | Root directory page and scenario summary |
| `feature_catalog/` | No feature catalog exists yet |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/deep-ai-council/references/scoring_rubric.md` | Cross-critique reference |
| `.opencode/agents/ai-council.md` | Authoritative synthesis protocol |

---

## 5. SOURCE METADATA

- Group: WRITER LIBRARY CONTRACT
- Playbook ID: DAC-016
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `07--writer-library-contract/003-hunter-skeptic-referee-cross-critique.md`
