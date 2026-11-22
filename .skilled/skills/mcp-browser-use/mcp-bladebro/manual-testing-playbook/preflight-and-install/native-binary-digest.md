---
title: "BB-003 -- Native binary digest against the release sidecar"
description: "This scenario validates the native binary pin for `BB-003`. It focuses on the SHA-256 of the installed binary matching the release sidecar before the binary first runs."
version: 1.0.1.0
---

# BB-003 -- Native binary digest against the release sidecar

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `BB-003`.

---

## 1. OVERVIEW

Plan step 4. The digest is checked before anything executes the binary, so a tampered or wrong build never runs.

### Why This Matters

This is the supply-chain gate for the mode. A mismatch stops the run and triggers the uninstall.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `BB-003` and confirm the expected signals without contradictory evidence.

- Objective: Match the installed native binary against the v4.8.2 release sidecar.
- Real user request: `Before Bladebro runs, check the installed native binary SHA-256 against the v4.8.2 release sidecar.`
- Prompt: `Before Bladebro runs, check the installed native binary SHA-256 against the v4.8.2 release sidecar.`
- Expected execution process: run the commands in order from the repository root on macOS, read each output and exit status, then judge them against the pass/fail criteria.
- Expected signals: both digests equal `7324e502b1710f8fb0a073b1f71d3647266d986a50e7351cb4257ec4eb5d8fa8` on arm64 (x64: `d839f5f8a8bed8f616e68029350b1c36f8bc12ee2a16deb32b6f7df93a5a36c3`)
- Desired user-visible outcome: A match verdict, or a stop with the uninstall.
- Pass/fail: PASS if the two digests match the expected value. FAIL if they differ. Run `npm uninstall -g bladebro` and report.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Before Bladebro runs, check the installed native binary SHA-256 against the v4.8.2 release sidecar.`

### Commands

1. `shasum -a 256 "$(npm root -g)/bladebro/node_modules/bladebro-darwin-arm64/bladebro"`
2. `cat <scratch>/sidecar/bladebro-darwin-arm64.sha256`

### Expected

- The installed digest equals the sidecar digest
- No Bladebro command has run before this check

### Evidence

Both digest lines.

### Pass / Fail

- **Pass**: the two digests match the expected value.
- **Fail**: they differ. Run `npm uninstall -g bladebro` and report.

### Failure Triage

1. Confirm the sidecar came from the v4.8.2 GitHub release, not a later one.
2. Confirm the resolved path is the native package, not the JavaScript shim.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| `preflight-and-install/native-binary-digest.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/mcp-browser-use/mcp-bladebro/references/install-and-verify.md` | Install, digest pin and doctor checks |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/feature-catalog/install-and-health/pinned-install-and-digest-check.md` | Feature catalog entry: Pinned install and digest check |

---

## 5. SOURCE METADATA

- Group: Preflight And Install
- Playbook ID: BB-003
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `preflight-and-install/native-binary-digest.md`
