---
title: "BB-001 -- Host preflight before install"
description: "This scenario validates the macOS host before a Bladebro install for `BB-001`. It focuses on Bladebro being absent and Node and a Chromium-family browser being present."
version: 1.0.1.0
---

# BB-001 -- Host preflight before install

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `BB-001`.

---

## 1. OVERVIEW

Plan steps 1 and 2. Before the install the host must not carry Bladebro yet, and it must have Node and a Chromium-family browser for Bladebro to drive.

### Why This Matters

A leftover Bladebro install would make the digest check in BB-003 test the wrong binary. A missing browser would fail every probe later for a reason that has nothing to do with Bladebro.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `BB-001` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `bladebro` is absent, Node is 14 or later and a Chrome or Chromium binary exists.
- Real user request: `Check this Mac is ready for a Bladebro install: Bladebro absent, Node present, a Chromium browser present.`
- Prompt: `Check this Mac is ready for a Bladebro install: Bladebro absent, Node present, a Chromium browser present.`
- Expected execution process: run the commands in order from the repository root on macOS, read each output and exit status, then judge them against the pass/fail criteria.
- Expected signals: step 1 prints `absent`, step 2 prints a Node version of 14 or later, step 3 lists the browser binary
- Desired user-visible outcome: A short readiness report with a verdict.
- Pass/fail: PASS if all three signals hold. FAIL if Bladebro is already installed, Node is older than 14 or no Chromium-family browser is found.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Check this Mac is ready for a Bladebro install: Bladebro absent, Node present, a Chromium browser present.`

### Commands

1. `command -v bladebro || echo absent`
2. `node --version`
3. `ls "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"`

### Expected

- Step 1: `absent`
- Step 2: `v14` or later
- Step 3: the binary path, exit 0

### Evidence

All three outputs with their exit status.

### Pass / Fail

- **Pass**: all three signals hold.
- **Fail**: Bladebro is already installed, Node is older than 14 or no Chromium-family browser is found.

### Failure Triage

1. If Bladebro is present, record its version and stop. The digest check must test a fresh install.
2. If no browser is found, set `CHROME_PATH` or install a Chromium-family browser before continuing.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| `preflight-and-install/host-preflight.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/mcp-browser-use/mcp-bladebro/references/install-and-verify.md` | Install, digest pin and doctor checks |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/SKILL.md` | Mode packet entry point |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/feature-catalog/install-and-health/pinned-install-and-digest-check.md` | Feature catalog entry: Pinned install and digest check |

---

## 5. SOURCE METADATA

- Group: Preflight And Install
- Playbook ID: BB-001
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `preflight-and-install/host-preflight.md`
