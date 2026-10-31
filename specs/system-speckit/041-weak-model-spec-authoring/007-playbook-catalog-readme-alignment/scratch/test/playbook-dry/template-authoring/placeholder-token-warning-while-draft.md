---
title: "476 -- Placeholder token warning while Draft"
description: "This scenario validates that a v2.3 scaffold keeps an unfilled value token as a warning and still passes strict validation while its status is Draft."
version: 1.0.0.0
id: template-authoring-placeholder-token-warning-while-draft
---

# 476 -- Placeholder token warning while Draft

## 1. OVERVIEW

This scenario validates the Draft half of the versioned placeholder gate. A packet scaffolded from a v2.3 template carries `[YOUR_VALUE_HERE: ...]` tokens and a Status row that reads Draft. The gate must report an unfilled token as a warning and must not fail the strict run, because a planning commit is expected to hold tokens.

### Why This Matters

A gate that fails a fresh scaffold blocks every new packet before its first word is written. A gate that passes a finished packet lets a weak model ship a document that still says `[YOUR_VALUE_HERE: feature name]`. This scenario proves the first half. Draft warns and passes.

---

## 2. SCENARIO CONTRACT

Operators scaffold a Level 2 packet, read the gate entry from a strict JSON run, and confirm the warning.

- Objective: Prove that a v2.3 Level 2 scaffold with its Status row at Draft reports `PLACEHOLDER_FILLED` as `warning`, and that the strict run still reports `passed: true`.
- Playbook ID: 476.
- Real user request: `Scaffold a Level 2 packet, leave the value tokens unfilled, and tell me whether strict validation still passes while the packet is a Draft.`
- Prompt: `Scaffold a Level 2 packet, leave the value tokens unfilled, and tell me whether strict validation still passes while the packet is a Draft.`
- Preconditions: A checkout with Node, bash and jq on PATH, and a built `.skilled/skills/system-spec-kit` so `validate.sh` runs. The scenario needs no network.
- Expected execution process: Scaffold one Level 2 packet, confirm the v2.3 stamp and the Draft status, run strict validation with JSON output, then read the `PLACEHOLDER_FILLED` entry and the `passed` field.
- Expected signals: The scaffold prints the packet path. The stamp line ends with `v2.3 -->`. The status line reads Draft. The gate entry prints `warning`. The `passed` field prints `true`.
- Desired user-visible outcome: The operator sees a clean strict pass and one warning that names the unfilled tokens, with the packet left ready to fill.
- Pass/fail: PASS if the gate entry is `warning` and `passed` is `true`. FAIL if the entry is `error` or `pass`, or if `passed` is `false`.

---

## 3. TEST EXECUTION

### Prompt
