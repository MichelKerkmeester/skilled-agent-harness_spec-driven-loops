---
title: "478 -- Placeholder gate unchanged for a v2.2 doc"
description: "This scenario validates that a packet stamped v2.2 keeps the placeholder error it always had, even while its status is Draft."
version: 1.0.0.0
id: template-authoring-placeholder-gate-legacy-stamp-unchanged
---

# 478 -- Placeholder gate unchanged for a v2.2 doc

## 1. OVERVIEW

This scenario validates the compatibility half of the versioned placeholder gate. A packet with a v2.2 stamp, or with no stamp, must keep the old verdict. The scenario scaffolds a Level 2 packet, rewrites its stamp to v2.2, leaves its status at Draft and keeps its tokens. The gate must report an error.

### Why This Matters

External packets are written under the old contract. A new gate that changed their verdict would break `/doctor:update` for every repository that already holds a packet. This scenario proves the stamp is the switch, and that an unstamped or older packet is never treated as Draft.

---

## 2. SCENARIO CONTRACT

Operators rewrite the stamp on a scaffold, keep the Draft status, and confirm that the gate still fails.

- Objective: Prove that a Draft packet stamped v2.2 reports `PLACEHOLDER_FILLED` as `error` and `passed: false`, with no Draft warning.
- Playbook ID: 478.
- Real user request: `This packet uses the older template stamp. Confirm that the placeholder rule still gives it the same error it always had.`
- Prompt: `This packet uses the older template stamp. Confirm that the placeholder rule still gives it the same error it always had.`
- Preconditions: A checkout with Node, bash, perl and jq on PATH, and a built `.skilled/skills/system-spec-kit` so `validate.sh` runs. The scenario needs no network.
- Expected execution process: Scaffold one Level 2 packet, rewrite every v2.3 stamp to v2.2, confirm the Draft status and the stamp, run strict validation with JSON output, then read the gate entry.
- Expected signals: Each document stamp ends with `v2.2 -->`. The status line reads Draft. The gate entry prints `error`. The `passed` field prints `false`.
- Desired user-visible outcome: The operator sees the older packet keep its error, so no existing repository changes verdict.
- Pass/fail: PASS if the gate entry is `error` and `passed` is `false`. FAIL if the entry is `warning`, or if `passed` is `true`.

---

## 3. TEST EXECUTION

### Prompt
