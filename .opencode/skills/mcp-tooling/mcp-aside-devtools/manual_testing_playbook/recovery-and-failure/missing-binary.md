---
title: "ASD-014 -- Missing binary"
description: "This scenario validates the CLI_MISSING diagnosis for `ASD-014`. It simulates an absent aside binary via a restricted PATH and verifies the workflow reports install guidance without installing anything."
version: 1.0.0.0
---

# ASD-014 -- Missing binary

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `ASD-014`.

---

## 1. OVERVIEW

This scenario simulates a machine without the `aside` binary using PATH restriction and verifies the doctor's diagnosis: name the missing binary, point to the official installer as operator-invoked guidance, and change nothing.

### Why This Matters

The packet's install posture is diagnose-never-silently-install. A missing binary is the first failure new environments hit; the correct behavior is a precise CLI_MISSING report with the official curl command as guidance — not an automatic installation, and not a misleading generic error.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `ASD-014` and confirm the expected signals without contradictory evidence.

- Objective: With a PATH that excludes `aside`, verify `scripts/doctor.sh` reports the binary as missing, prints the official install command as guidance, exits without error, and installs nothing.
- Real user request: `"Set this up on a fresh machine — what's missing?"`
- Prompt: `Diagnose Aside availability with the aside binary unavailable and report what an operator should do.`
- Expected execution process: restricted-PATH doctor run, output inspection, no-mutation check.
- Expected signals: "aside not on PATH" (or equivalent); installer guidance printed; no filesystem changes.
- Desired user-visible outcome: The CLI_MISSING diagnosis with the exact install command, and confirmation nothing was installed.
- Pass/fail: PASS if diagnosis + guidance appear and nothing changed; FAIL if the script errors uninterpretably or attempts an install.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Diagnose Aside availability with the aside binary unavailable and report what an operator should do.`

### Commands

1. `bash: PATH=/usr/bin:/bin HOME=/tmp/asd014-home bash .opencode/skills/mcp-tooling/mcp-aside-devtools/scripts/doctor.sh 2>&1` — the scratch HOME prevents the `~/.local/bin` hint from matching a real install
2. `bash: command -v aside` — in the normal shell, confirm the real environment was untouched

### Expected

- Step 1: warns "aside not on PATH" and prints `curl -fsSL https://releases.aside.com/install.sh | bash` as operator guidance; exits 0
- Step 2: real environment unchanged

### Evidence

The full doctor transcript under the restricted PATH and the unchanged-environment confirmation.

### Pass / Fail

- **Pass**: diagnosis + guidance + zero mutation.
- **Fail**: script crash, missing guidance, or any install/update attempt.

### Failure Triage

1. If the doctor still finds `aside`: the restricted PATH leaked a shim — inspect which path resolved and tighten the restriction; do not delete anything.
2. If guidance is absent: the doctor's CLI_MISSING branch regressed — fix the script, not the scenario.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/scripts/doctor.sh` | CLI_MISSING diagnosis under test |

---

## 5. SOURCE METADATA

- Group: RECOVERY AND FAILURE
- Playbook ID: ASD-014
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `recovery-and-failure/missing-binary.md`
