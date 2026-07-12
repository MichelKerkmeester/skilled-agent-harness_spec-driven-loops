---
title: "SP-027 -- Format mode delivery"
description: "This scenario validates format-mode output delivery for `SP-027`. It focuses on `$json`, `$yaml`, and markdown mode producing format-correct structures."
version: 2.3.0.5
---

# SP-027 -- Format mode delivery

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `SP-027`.

---

## 1. OVERVIEW

This scenario validates that format modes deliver the enhanced prompt in the requested structure. The operator asks for `$json` API request prompt improvement and verifies that `@prompt-improver` returns JSON structure rather than markdown prose.

### Why This Matters

Format modes are often used for machine handoff. Returning markdown when JSON or YAML was requested breaks downstream parsing.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SP-027` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `$json`, `$yaml`, and default markdown deliver format-specific structures.
- Real user request: `$json improve my API request prompt — return the enhanced prompt structured as JSON, not markdown.`
- Prompt: `$json improve my API request prompt; verify the enhanced prompt is valid JSON with format-specific keys, not markdown sections.`
- Expected execution process: sk-prompt detects `$json`, applies standard DEPTH/CLEAR, loads applicable format guidance when requested, and delivers JSON structure.
- Expected signals: Output parses as JSON; no markdown H2/H3 section wrappers around the enhanced prompt; CLEAR metadata is still present.
- Desired user-visible outcome: Valid JSON enhanced prompt plus transparency report.
- Pass/fail: PASS if the enhanced prompt is valid JSON and format-specific; FAIL if markdown is returned as the primary prompt body.

---

## 3. TEST EXECUTION

### Prompt

```
$json improve my API request prompt; verify the enhanced prompt is valid JSON with format-specific keys, not markdown sections.
```

### Commands

1. `sk-prompt: $json improve my API request prompt — return the enhanced prompt structured as JSON, not markdown.`
2. `agent: @prompt-improver raw_task="Improve an API request prompt for JSON delivery." task_type=generation target_cli=opencode complexity_hint=6 constraints="Deliver enhanced prompt as valid JSON, not markdown."`
3. `bash: rg 'JSON|YAML|Markdown|format_guide_json' .opencode/skills/sk-prompt/SKILL.md .opencode/skills/sk-prompt/prompt-improve/assets/format_guide_json.md`

### Expected

The primary enhanced prompt body is valid JSON with meaningful keys for role/context/action/format or equivalent structure.

### Evidence

Capture the JSON output, format-validation note, and CLEAR metadata.

### Pass / Fail

- **Pass**: Enhanced prompt is valid JSON and includes prompt-specific keys.
- **Fail**: Output is markdown, invalid JSON, or lacks format-specific structure.

### Failure Triage

1. Confirm the operator input begins with `$json`.
2. Inspect SKILL.md Operating Modes for JSON mode.
3. Re-run through `@prompt-improver` with `constraints="primary enhanced prompt must parse as JSON"`.

### Optional Supplemental Checks

Run the same prompt under `$yaml` and verify the primary body switches to YAML mapping syntax.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | sk-prompt skill source: §3 operating modes and §7 `@prompt-improver` contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../assets/format_guide_json.md` | JSON format delivery standards |
| `../../assets/format_guide_yaml.md` | YAML comparison target for supplemental checks |

---

## 5. SOURCE METADATA

- Group: Format Modes
- Playbook ID: SP-027
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `format_modes/format_mode_delivery.md`
