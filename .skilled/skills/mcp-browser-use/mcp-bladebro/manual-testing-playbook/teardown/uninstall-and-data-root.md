---
title: "BB-014 -- Uninstall and data root removal"
description: "This scenario validates the final uninstall for `BB-014`. It focuses on the package and its data root being gone after operator approval."
version: 1.0.0.0
---

# BB-014 -- Uninstall and data root removal

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `BB-014`.

---

## 1. OVERVIEW

Plan step 14, second half. It runs only after the operator approves removing the package and the data root the doctor reported.

### Why This Matters

The host must end clean unless the operator chooses to keep Bladebro.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `BB-014` and confirm the expected signals without contradictory evidence.

- Objective: Remove the global package and the data root.
- Real user request: `Uninstall Bladebro and remove its data folder.`
- Prompt: `Uninstall Bladebro and remove its data folder.`
- Expected execution process: run the commands in order from the repository root on macOS, read each output and exit status, then judge them against the pass/fail criteria.
- Expected signals: npm exits 0, the data root is gone and step 3 prints `absent`
- Desired user-visible outcome: The host is clean.
- Pass/fail: PASS if the package and the data root are gone. FAIL if either remains.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Uninstall Bladebro and remove its data folder.`

### Commands

1. `npm uninstall -g bladebro`
2. `rm -rf ~/.local/state/blade`
3. `command -v bladebro || echo absent`

### Expected

- `removed N packages`
- `absent`

### Evidence

All outputs.

### Pass / Fail

- **Pass**: the package and the data root are gone.
- **Fail**: either remains.

### Failure Triage

1. Without operator approval, do not run this scenario. Record `SKIP` with the missing approval as the blocker.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| `teardown/uninstall-and-data-root.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/mcp-browser-use/mcp-bladebro/references/install-and-verify.md` | Install, digest pin and doctor checks |

---

## 5. SOURCE METADATA

- Group: Teardown
- Playbook ID: BB-014
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `teardown/uninstall-and-data-root.md`
