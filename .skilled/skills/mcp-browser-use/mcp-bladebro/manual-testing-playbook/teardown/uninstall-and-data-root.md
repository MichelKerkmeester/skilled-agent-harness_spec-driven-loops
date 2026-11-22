---
title: "BB-014 -- Uninstall and data root removal"
description: "This scenario validates the final uninstall for `BB-014`. It focuses on the package and its data root being gone after operator approval."
version: 1.0.2.0
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
- Expected signals: the doctor prints the data root, the operator confirms no needed named session remains in it, npm exits 0, step 5 prints `absent` and step 6 prints `root absent`
- Desired user-visible outcome: The host is clean, and no named session the operator still needed was deleted.
- Pass/fail: PASS if the package and the doctor-reported data root are gone after the operator's confirmation. FAIL if either remains, or if the root was removed without that confirmation.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Uninstall Bladebro and remove its data folder.`

### Commands

1. `bladebro doctor`, and record the data root it prints as `<root>`. Run it before the uninstall, because the binary is gone afterwards. The root is `~/.local/state/blade`, a previously used `~/.blade`, or whatever `BLADE_HOME` points to.
2. `ls -la "<root>"`, then ask the operator to confirm that no named session in it is still needed.
3. `npm uninstall -g bladebro`
4. `rm -rf "<root>"`, with the path from step 1, only after the confirmation in step 2.
5. `command -v bladebro || echo absent`
6. `test -e "<root>" && echo "root remains" || echo "root absent"`

### Expected

- Step 1 names the data root.
- The operator's confirmation from step 2 is recorded.
- `removed N packages`
- `absent`
- `root absent`

### Evidence

All outputs, the data root step 1 printed, and the operator's confirmation from step 2.

### Pass / Fail

- **Pass**: the package and the doctor-reported data root are gone, and the root was removed only after the operator's confirmation.
- **Fail**: either remains, or the root was removed without the confirmation.

### Failure Triage

1. Without operator approval, do not run this scenario. Record `SKIP` with the missing approval as the blocker.
2. If the operator still needs a named session, stop after step 3, keep the data root, and record `SKIP` for the root removal with that reason.
3. If step 6 prints `root remains`, compare the path against the one step 1 printed before running anything else.

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
| `.skilled/skills/mcp-browser-use/mcp-bladebro/feature-catalog/install-and-health/teardown-and-rollback.md` | Feature catalog entry: Teardown and rollback |

---

## 5. SOURCE METADATA

- Group: Teardown
- Playbook ID: BB-014
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `teardown/uninstall-and-data-root.md`
