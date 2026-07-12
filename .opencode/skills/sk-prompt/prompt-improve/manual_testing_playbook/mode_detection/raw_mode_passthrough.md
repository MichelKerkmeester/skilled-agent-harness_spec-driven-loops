---
title: "SP-002 -- $raw mode skips DEPTH entirely"
description: "This scenario validates `$raw` passthrough for `SP-002`. It focuses on confirming DEPTH runs 0 rounds, CLEAR scoring is skipped, and no transparency report is emitted."
version: 2.3.0.4
---

# SP-002 -- $raw mode skips DEPTH entirely

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `SP-002`.

---

## 1. OVERVIEW

This scenario validates `$raw` passthrough for `SP-002`. It focuses on confirming the prefix bypasses DEPTH (0 rounds), skips CLEAR, and does not invoke `@prompt-improver` for deep enhancement; the input passes through with minimal structural cleanup only.

### Why This Matters

Operators sometimes already have a polished prompt and just want minimal cleanup. Without a clean passthrough, sk-prompt would over-process and risk altering tested prompts that should remain stable.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SP-002` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `$raw` skips DEPTH and CLEAR entirely
- Real user request: `$raw I already wrote this prompt — just clean up whitespace, do not rewrite it.`
- Prompt: `$raw clean up my prompt's whitespace only; verify DEPTH and CLEAR stay skipped and no transparency report is emitted.`
- Expected execution process: sk-prompt detects `$raw` prefix, bypasses INTENT_MODEL scoring, executes 0 DEPTH rounds, skips CLEAR scoring, returns the input with whitespace and line-wrap cleanup only.
- Expected signals: Mode = `$raw`, DEPTH rounds = 0, no CLEAR breakdown, no transparency report
- Desired user-visible outcome: Output that is structurally identical to input plus a one-line "Mode: $raw (DEPTH skipped)" notice.
- Pass/fail: PASS if zero DEPTH rounds and no CLEAR breakdown; FAIL if any DEPTH phase runs, CLEAR is computed, or output diverges from input beyond whitespace cleanup.

---

## 3. TEST EXECUTION

### Prompt

```
$raw clean up my prompt's whitespace only; verify DEPTH and CLEAR stay skipped and no transparency report is emitted.
```

### Commands

1. `sk-prompt: $raw I already wrote this prompt — just clean up whitespace, do not rewrite it. <draft body>`
2. `bash: rg '\$raw' .opencode/skills/sk-prompt/SKILL.md` (confirm $raw alias documented)

### Expected

Output preserves input semantics; one-line notice "Mode: $raw (DEPTH skipped)"; no per-phase log; no CLEAR breakdown.

### Evidence

Capture full response. Diff input against output (excluding whitespace) and confirm zero semantic edits.

### Pass / Fail

- **Pass**: Zero DEPTH rounds executed, no CLEAR score reported, output diff vs input shows whitespace-only changes.
- **Fail**: Any DEPTH phase executes, CLEAR is computed, or output text differs from input beyond whitespace.

### Failure Triage

1. Confirm `$raw` is the literal first token in the input (no leading whitespace before the `$`).
2. Inspect SKILL.md §3 operating-modes row for `$raw`: should show `DEPTH Rounds: 0, Scoring: None`.
3. Re-dispatch with the prefix lowercased to confirm case-sensitivity behavior.

### Optional Supplemental Checks

Use this subsection only when the feature needs a tightly scoped follow-up variant, compatibility check, or artifact note.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | sk-prompt skill source: §3 operating-modes table for `$raw` |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | §1 Keyword Triggers (`$raw` listed) and §3 operating-modes table |
| `../../references/depth_framework.md` | DEPTH bypass contract |

---

## 5. SOURCE METADATA

- Group: Mode Detection
- Playbook ID: SP-002
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `mode_detection/raw_mode_passthrough.md`
