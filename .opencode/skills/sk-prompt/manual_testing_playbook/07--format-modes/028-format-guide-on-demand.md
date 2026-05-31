---
title: "SP-028 -- Format guide on-demand loading"
description: "This scenario validates format-guide loading for `SP-028`. It focuses on loading `format_guide_*.md` only when format mode and ON_DEMAND keyword signals require it."
---

# SP-028 -- Format guide on-demand loading

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `SP-028`.

---

## 1. OVERVIEW

This scenario validates that format guides are loaded on demand rather than for every prompt. The operator asks for `$yaml` CI/CD config prompt improvement and verifies that YAML-specific guidance loads when the request asks for format-guide behavior.

### Why This Matters

Format guides are useful but costly. Loading them only when format mode and on-demand signals align keeps routine prompt work lean while preserving format depth when needed.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SP-028` and confirm the expected signals without contradictory evidence.

- Objective: Confirm format guide loading requires format-mode need plus ON_DEMAND keyword match.
- Real user request: `$yaml improve my CI/CD config prompt — load the YAML format guide and apply YAML-specific structure.`
- Prompt: `$yaml improve my CI/CD config prompt; verify YAML guide loading appears in the trace and the output uses YAML structure.`
- Expected execution process: sk-prompt detects `$yaml`, sees the on-demand `format guide` language, loads YAML format guide, and returns YAML-structured output.
- Expected signals: Routing trace lists `assets/format_guide_yaml.md`; enhanced prompt uses YAML mapping/list structure.
- Desired user-visible outcome: YAML enhanced prompt plus routing trace proving YAML guide load.
- Pass/fail: PASS if YAML guide loads and output uses YAML-specific structure; FAIL if guide is missing from trace or wrong format guide loads.

---

## 3. TEST EXECUTION

### Prompt

```
$yaml improve my CI/CD config prompt; verify YAML guide loading appears in the trace and the output uses YAML structure.
```

### Commands

1. `sk-prompt: $yaml improve my CI/CD config prompt — load the YAML format guide and apply YAML-specific structure.`
2. `agent: @prompt-improver raw_task="Improve a CI/CD config prompt for YAML delivery and apply YAML format-guide rules." task_type=generation target_cli=codex complexity_hint=6 constraints="Load YAML guide; output YAML-specific structure."`
3. `bash: rg 'ON_DEMAND_KEYWORDS|format guide|format_guide_yaml' .opencode/skills/sk-prompt/SKILL.md .opencode/skills/sk-prompt/assets/format_guide_yaml.md`

### Expected

The routing trace includes `assets/format_guide_yaml.md`, and the enhanced prompt uses YAML keys, indentation, and list syntax.

### Evidence

Capture the routing trace, YAML guide reference, YAML enhanced prompt, and CLEAR metadata.

### Pass / Fail

- **Pass**: YAML guide is loaded on demand and the output is YAML-specific.
- **Fail**: No YAML guide appears, JSON/Markdown guide loads instead, or output is not YAML.

### Failure Triage

1. Confirm `$yaml` prefix and `format guide` wording are both present in the operator request.
2. Inspect SKILL.md ON_DEMAND_KEYWORDS and Resource Loading Levels.
3. Re-run through `@prompt-improver` with `constraints="include resource-loading trace with format_guide_yaml.md"`.

### Optional Supplemental Checks

Run a `$yaml` request without `format guide` wording and verify the trace does not load the deep-dive asset unless another on-demand keyword is present.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | sk-prompt skill source: §2 ON_DEMAND keywords and §7 `@prompt-improver` contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../assets/format_guide_yaml.md` | YAML format deep-dive and delivery standards |
| `../../assets/format_guide_json.md` | Adjacent format guide used to confirm no wrong guide loads |

---

## 5. SOURCE METADATA

- Group: Format Modes
- Playbook ID: SP-028
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `07--format-modes/028-format-guide-on-demand.md`
