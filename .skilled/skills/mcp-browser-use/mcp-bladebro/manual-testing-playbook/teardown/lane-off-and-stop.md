---
title: "BB-013 -- Lane off, clone wiped and daemon stopped"
description: "This scenario validates the real-browser rollback for `BB-013`. It focuses on the lane off, the clone wiped, the overrides reset and the daemon stopped."
version: 1.0.1.0
---

# BB-013 -- Lane off, clone wiped and daemon stopped

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `BB-013`.

---

## 1. OVERVIEW

Plan step 14, first half. It restores the isolated agent browser as the default.

### Why This Matters

A lane left on would let a later agent browse as the user.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `BB-013` and confirm the expected signals without contradictory evidence.

- Objective: Turn the lane off, wipe the clone, reset the overrides and stop the daemon.
- Real user request: `Turn the Bladebro real-browser lane off, wipe the clone, reset its settings and stop Bladebro.`
- Prompt: `Turn the Bladebro real-browser lane off, wipe the clone, reset its settings and stop Bladebro.`
- Expected execution process: run the commands in order from the repository root on macOS, read each output and exit status, then judge them against the pass/fail criteria.
- Expected signals: each command exits 0, the clone is wiped and the status reads `STANDBY` with no override
- Desired user-visible outcome: The agent lane is the default again.
- Pass/fail: PASS if every reset holds. FAIL if any command errors or an override remains.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Turn the Bladebro real-browser lane off, wipe the clone, reset its settings and stop Bladebro.`

### Commands

1. `bladebro rb off`
2. `bladebro rb forget`
3. `bladebro rb use --binary auto`
4. `bladebro rb profile auto`
5. `bladebro rb mode auto`
6. `bladebro stop`
7. `bladebro rb status`

### Expected

- `Real-browser lane: off`
- `clone ... wiped`
- `binary override cleared`
- `profile set to auto`
- `mechanism set to auto`
- `daemon stopped` or `daemon not running`

### Evidence

Every output. Leave out any line that names the host user profile.

### Pass / Fail

- **Pass**: every reset holds.
- **Fail**: any command errors or an override remains.

### Failure Triage

1. Rerun the failing reset command alone and record it.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| `teardown/lane-off-and-stop.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/mcp-browser-use/mcp-bladebro/references/browser-lanes.md` | Agent-browser and real-browser lanes |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/feature-catalog/install-and-health/teardown-and-rollback.md` | Feature catalog entry: Teardown and rollback |

---

## 5. SOURCE METADATA

- Group: Teardown
- Playbook ID: BB-013
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `teardown/lane-off-and-stop.md`
