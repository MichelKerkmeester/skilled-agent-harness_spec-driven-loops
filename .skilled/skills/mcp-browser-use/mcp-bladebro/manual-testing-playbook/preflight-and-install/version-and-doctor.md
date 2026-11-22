---
title: "BB-004 -- Version and doctor health check"
description: "This scenario validates the Bladebro version and doctor output for `BB-004`. It focuses on v4.8.2, the data root and the browser being found."
version: 1.0.1.0
---

# BB-004 -- Version and doctor health check

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `BB-004`.

---

## 1. OVERVIEW

Plan step 5. This is the first time the binary runs, after BB-003 passed.

### Why This Matters

The version decides whether the packet flags still hold. The doctor names the data root that the uninstall later removes.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `BB-004` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `bladebro --version` reports 4.8.2 and `bladebro doctor` finds the data root and the browser.
- Real user request: `Show the Bladebro version and run its doctor health check.`
- Prompt: `Show the Bladebro version and run its doctor health check.`
- Expected execution process: run the commands in order from the repository root on macOS, read each output and exit status, then judge them against the pass/fail criteria.
- Expected signals: the version line reads `v4.8.2`, the doctor finds the data root and a Chrome or Chromium binary and calls Bladebro operational
- Desired user-visible outcome: A version and health report naming any advisory.
- Pass/fail: PASS if the version is 4.8.2 and the doctor reports no failed check. FAIL if the version differs, or a doctor check fails.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Show the Bladebro version and run its doctor health check.`

### Commands

1. `bladebro --version`
2. `bladebro doctor`

### Expected

- `bladebro v4.8.2` on `macOS (ARM64)`
- Doctor checks pass. Advisories are recorded, not hidden

### Evidence

Both full outputs.

### Pass / Fail

- **Pass**: the version is 4.8.2 and the doctor reports no failed check.
- **Fail**: the version differs, or a doctor check fails.

### Failure Triage

1. If the browser is not found, set `CHROME_PATH` and rerun the doctor.
2. A version other than 4.8.2 sends the quoted flags back for a re-check.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| `preflight-and-install/version-and-doctor.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/mcp-browser-use/mcp-bladebro/references/install-and-verify.md` | Install, digest pin and doctor checks |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/references/cli-reference.md` | Bladebro CLI commands and flags |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/feature-catalog/install-and-health/health-diagnostics.md` | Feature catalog entry: Health diagnostics |

---

## 5. SOURCE METADATA

- Group: Preflight And Install
- Playbook ID: BB-004
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `preflight-and-install/version-and-doctor.md`
