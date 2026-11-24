---
title: "BB-002 -- Pinned npm install"
description: "This scenario validates the pinned Bladebro npm install for `BB-002`. It focuses on the global package and its native darwin package arriving without a postinstall script."
version: 1.0.2.0
---

# BB-002 -- Pinned npm install

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `BB-002`.

---

## 1. OVERVIEW

Plan step 3. The install runs only after the operator yes. The install runs with `--ignore-scripts`, so no package code runs before the digest check in BB-003, even if a later release adds a lifecycle script.

### Why This Matters

The pin keeps the run on the version whose flags the packet documents. The rollback is `npm uninstall -g bladebro`.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `BB-002` and confirm the expected signals without contradictory evidence.

- Objective: Install `bladebro@4.8.2` globally with optional dependencies enabled.
- Real user request: `Install Bladebro 4.8.2 globally from npm, pinned, without running it yet.`
- Prompt: `Install Bladebro 4.8.2 globally from npm, pinned, without running it yet.`
- Expected execution process: run the commands in order from the repository root on macOS, read each output and exit status, then judge them against the pass/fail criteria.
- Expected signals: npm reports the packages added and exits 0
- Desired user-visible outcome: Bladebro is installed and has not executed yet.
- Pass/fail: PASS if npm exits 0 and the native package is present. FAIL if npm errors or the native package is missing.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Install Bladebro 4.8.2 globally from npm, pinned, without running it yet.`

### Commands

1. `npm install -g --ignore-scripts bladebro@4.8.2`

### Expected

- npm prints `added N packages`, exit 0
- The native `bladebro-darwin-arm64` or `bladebro-darwin-x64` package lands under `$(npm root -g)/bladebro/node_modules/`

### Evidence

The npm output and exit status.

### Pass / Fail

- **Pass**: npm exits 0 and the native package is present.
- **Fail**: npm errors or the native package is missing.

### Failure Triage

1. On an npm error, record it and stop. Nothing has run yet, so the rollback is only `npm uninstall -g bladebro`.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| `preflight-and-install/npm-install.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/mcp-browser-use/mcp-bladebro/references/install-and-verify.md` | Install, digest pin and doctor checks |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/feature-catalog/install-and-health/pinned-install-and-digest-check.md` | Feature catalog entry: Pinned install and digest check |

---

## 5. SOURCE METADATA

- Group: Preflight And Install
- Playbook ID: BB-002
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `preflight-and-install/npm-install.md`
