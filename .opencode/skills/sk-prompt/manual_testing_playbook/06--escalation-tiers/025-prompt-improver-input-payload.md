---
title: "SP-025 -- @prompt-improver input payload"
description: "This scenario validates the `@prompt-improver` input contract for `SP-025`. It focuses on required `raw_task` plus four optional fields."
---

# SP-025 -- @prompt-improver input payload

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `SP-025`.

---

## 1. OVERVIEW

This scenario validates that `@prompt-improver` accepts the documented payload shape: required `raw_task` plus optional `task_type`, `target_cli`, `complexity_hint`, and `constraints`. The operator supplies all fields and verifies constraints survive into the enhanced prompt.

### Why This Matters

The payload is the handoff contract between CLI orchestrators and the prompt-improvement agent. Drift here breaks escalation even when routing is correct.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SP-025` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `@prompt-improver` accepts `raw_task` and the four optional fields.
- Real user request: `Use @prompt-improver to enhance my prompt with task_type=review, target_cli=codex, complexity_hint=8, and constraints around safety.`
- Prompt: `As a CLI orchestrator, dispatch @prompt-improver with raw_task plus task_type=review, target_cli=codex, complexity_hint=8, and safety constraints. Verify the agent accepts the payload, preserves constraints, and returns the structured output block.`
- Expected execution process: The orchestrator builds the payload, `@prompt-improver` consumes it, applies DEPTH/CLEAR, and carries the constraints into `ENHANCED_PROMPT` or `ESCALATION_NOTES`.
- Expected signals: Payload fields echoed or reflected; structured output block present.
- Desired user-visible outcome: Enhanced prompt that visibly respects safety constraints.
- Pass/fail: PASS if all payload fields are accepted and constraints are preserved; FAIL if optional fields are ignored without explanation.

---

## 3. TEST EXECUTION

### Prompt

```
As a CLI orchestrator, dispatch @prompt-improver with raw_task plus task_type=review, target_cli=codex, complexity_hint=8, and safety constraints. Verify the agent accepts the payload, preserves constraints, and returns the structured output block.
```

### Commands

1. `sk-prompt: Use @prompt-improver to enhance my prompt with task_type=review, target_cli=codex, complexity_hint=8, and constraints around safety.`
2. `agent: @prompt-improver raw_task="Improve a safety-sensitive review prompt for CLI dispatch." task_type=review target_cli=codex complexity_hint=8 constraints="Preserve safety requirements; include verification and do-not-change boundaries."`
3. `bash: rg 'Expected Input Payload|raw_task|task_type|target_cli|complexity_hint|constraints' .opencode/skills/sk-prompt/SKILL.md`

### Expected

The response accepts all five fields, returns the structured output block, and carries the safety constraints into the enhanced prompt or notes.

### Evidence

Capture the payload, structured output block, and constraint-preservation evidence.

### Pass / Fail

- **Pass**: Required and optional fields are accepted, and constraints are visible in the output.
- **Fail**: Payload is rejected, optional fields disappear silently, or safety constraints are dropped.

### Failure Triage

1. Inspect SKILL.md §7 Expected Input Payload.
2. Confirm field names match the documented snake_case names.
3. Re-dispatch to `@prompt-improver` with a minimal payload, then add optional fields one at a time.

### Optional Supplemental Checks

Verify `target_cli=codex` influences output wording toward Codex-compatible verification expectations.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | sk-prompt skill source: §7 `@prompt-improver` input payload |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../../sk-prompt-small-model/assets/cli_prompt_quality_card.md` | Escalation surface that dispatches the payload |
| `../../references/depth_framework.md` | DEPTH processing applied after payload acceptance |

---

## 5. SOURCE METADATA

- Group: Escalation Tiers
- Playbook ID: SP-025
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `06--escalation-tiers/025-prompt-improver-input-payload.md`
