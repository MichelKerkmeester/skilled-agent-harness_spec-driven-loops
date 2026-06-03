---
title: "SP-026 -- @prompt-improver output block"
description: "This scenario validates the `@prompt-improver` structured output contract for `SP-026`. It focuses on FRAMEWORK, CLEAR_SCORE, RATIONALE, ENHANCED_PROMPT, and ESCALATION_NOTES."
---

# SP-026 -- @prompt-improver output block

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `SP-026`.

---

## 1. OVERVIEW

This scenario validates that `@prompt-improver` returns the documented five-field output block. The operator asks for a data-extraction prompt and verifies exact labels suitable for CLI handoff.

### Why This Matters

The structured output block is consumed by orchestrators. Missing labels force downstream agents to parse prose and guess which content is dispatch-ready.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SP-026` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `@prompt-improver` returns FRAMEWORK, CLEAR_SCORE, RATIONALE, ENHANCED_PROMPT, and ESCALATION_NOTES.
- Real user request: `Run @prompt-improver on my data extraction prompt and return the structured output block exactly as documented.`
- Prompt: `As a CLI orchestrator, dispatch @prompt-improver on a data-extraction prompt. Verify the response contains FRAMEWORK, CLEAR_SCORE, RATIONALE, ENHANCED_PROMPT, and ESCALATION_NOTES. Return the structured block verdict.`
- Expected execution process: `@prompt-improver` enhances the prompt, scores it, and returns the five labelled fields in order or with unambiguous labels.
- Expected signals: All five labels present; `ENHANCED_PROMPT` is multi-line; `CLEAR_SCORE` includes C/L/E/A/R.
- Desired user-visible outcome: Ready-to-dispatch structured block.
- Pass/fail: PASS if all five fields are present and populated; FAIL if any label is missing or old agent naming appears.

---

## 3. TEST EXECUTION

### Prompt

```
As a CLI orchestrator, dispatch @prompt-improver on a data-extraction prompt. Verify the response contains FRAMEWORK, CLEAR_SCORE, RATIONALE, ENHANCED_PROMPT, and ESCALATION_NOTES. Return the structured block verdict.
```

### Commands

1. `sk-prompt: Run @prompt-improver on my data extraction prompt and return the structured output block exactly as documented.`
2. `agent: @prompt-improver raw_task="Improve a data extraction prompt for reliable CLI handoff." task_type=generation target_cli=codex complexity_hint=7 constraints="Return the documented five-field structured output block."`
3. `bash: rg 'Structured Output Block|FRAMEWORK|CLEAR_SCORE|RATIONALE|ENHANCED_PROMPT|ESCALATION_NOTES' .opencode/skills/sk-prompt/SKILL.md`

### Expected

The response contains all five documented labels, no legacy agent name, and a multi-line `ENHANCED_PROMPT`.

### Evidence

Capture the full structured output block and confirm each label is populated.

### Pass / Fail

- **Pass**: Five fields are present and populated; `CLEAR_SCORE` includes total and dimensions.
- **Fail**: Any field is missing, empty without reason, malformed, or references the legacy agent name.

### Failure Triage

1. Inspect SKILL.md §7 Structured Output Block.
2. Confirm the agent invoked is `@prompt-improver`, not the legacy name.
3. Re-run with `constraints="return labels verbatim and do not add alternate headings"`.

### Optional Supplemental Checks

Verify `ESCALATION_NOTES` says `none` or equivalent when no ambiguity remains, rather than omitting the field.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | sk-prompt skill source: §7 structured output block |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../../sk-prompt-small-model/assets/cli_prompt_quality_card.md` | Expected compact structured return mirrored by fast-path escalation |
| `../../references/patterns_evaluation.md` | CLEAR score dimensions used in the output block |

---

## 5. SOURCE METADATA

- Group: Escalation Tiers
- Playbook ID: SP-026
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `06--escalation-tiers/026-prompt-improver-output-block.md`
