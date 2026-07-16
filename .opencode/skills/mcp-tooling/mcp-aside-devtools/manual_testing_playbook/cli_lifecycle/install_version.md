---
title: "ASD-001 -- Install + version check"
description: "This scenario validates aside CLI presence for `ASD-001`. It focuses on confirming `command -v aside` resolves and `aside --version` returns a non-empty version string."
version: 1.0.0.0
---

# ASD-001 -- Install + version check

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `ASD-001`.

---

## 1. OVERVIEW

This scenario validates that the `aside` binary is installed and reports a version. It is the entry gate for every other scenario in the playbook.

### Why This Matters

The whole packet is version-pinned: the command surface, flag spellings, and MCP tool inventory all key off the installed version. Without a confirmed binary and a captured version string, no other scenario's evidence is interpretable.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `ASD-001` and confirm the expected signals without contradictory evidence.

- Objective: Verify `command -v aside` returns a path and `aside --version 2>&1` returns a non-empty version string.
- Real user request: `"Is Aside set up on this machine? What version?"`
- Prompt: `Confirm the aside CLI is installed and report its version.`
- Expected execution process: presence check, version capture, no installs.
- Expected signals: non-empty binary path; non-empty version string.
- Desired user-visible outcome: A short report quoting the binary path and version with a PASS verdict.
- Pass/fail: PASS if both signals hold; FAIL if the binary is absent or --version errors.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Confirm the aside CLI is installed and report its version.`

### Commands

1. `bash: command -v aside`
2. `bash: aside --version 2>&1`

### Expected

- Step 1: prints a path (default shim: `~/.local/bin/aside`)
- Step 2: prints a version string (e.g. `1.26.626.1517` at research time)

### Evidence

Capture both command outputs verbatim; save the version string as the fixture key for every other scenario in this run.

### Pass / Fail

- **Pass**: path returned AND non-empty version string.
- **Fail**: binary absent (report CLI_MISSING with the official installer as guidance — do NOT install) or `--version` errors.

### Failure Triage

1. If absent but `~/.local/bin/aside` exists: PATH issue — report, do not modify shell profiles inside the scenario.
2. If truly absent: cross-reference ASD-014 (missing binary) for the diagnosis contract; installation is operator-invoked only.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/scripts/doctor.sh` | Automated equivalent of this check |

---

## 5. SOURCE METADATA

- Group: CLI LIFECYCLE
- Playbook ID: ASD-001
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `cli_lifecycle/install_version.md`
