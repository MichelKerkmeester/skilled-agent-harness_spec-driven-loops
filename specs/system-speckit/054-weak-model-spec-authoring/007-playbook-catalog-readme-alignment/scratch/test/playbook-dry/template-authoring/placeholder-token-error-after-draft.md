---
title: "477 -- Placeholder token error after Draft"
description: "This scenario validates that the same v2.3 packet fails strict validation once its status leaves Draft with a value token still unfilled."
version: 1.0.0.0
id: template-authoring-placeholder-token-error-after-draft
---

# 477 -- Placeholder token error after Draft

## 1. OVERVIEW

This scenario validates the other half of the versioned placeholder gate. A packet that carries a value token must fail once its status leaves Draft. The scenario scaffolds a Level 2 packet, keeps its tokens, changes the Status row to Complete, and reads the gate entry.

### Why This Matters

The Draft warning exists so planning commits can land. It must not survive into a finished packet. This scenario proves the status word is the switch, so a weak model cannot leave a token in place and still claim completion.

---

## 2. SCENARIO CONTRACT

Operators scaffold a packet, set its status to Complete, and confirm that the gate now fails.

- Objective: Prove that a v2.3 packet with an unfilled value token reports `PLACEHOLDER_FILLED` as `error` and `passed: false` once its Status row reads Complete.
- Playbook ID: 477.
- Real user request: `Mark this scaffold Complete and tell me whether strict validation now fails on the value tokens I left behind.`
- Prompt: `Mark this scaffold Complete and tell me whether strict validation now fails on the value tokens I left behind.`
- Preconditions: A checkout with Node, bash, perl and jq on PATH, and a built `.skilled/skills/system-spec-kit` so `validate.sh` runs. The scenario needs no network.
- Expected execution process: Scaffold one Level 2 packet, change the Status row from Draft to Complete, run strict validation with JSON output, then read the gate entry and the `passed` field.
- Expected signals: The status line reads Complete. The gate entry prints `error`. The `passed` field prints `false`.
- Desired user-visible outcome: The operator sees the gate refuse a finished packet that still holds a token, with the token lines named in the details.
- Pass/fail: PASS if the gate entry is `error` and `passed` is `false`. FAIL if the entry is `warning` or `pass`, or if `passed` is `true`.

---

## 3. TEST EXECUTION

### Prompt
