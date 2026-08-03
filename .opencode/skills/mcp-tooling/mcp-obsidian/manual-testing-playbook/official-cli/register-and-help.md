---
title: "OBS-009 -- Register and inspect the official CLI"
description: "This scenario validates official obsidian CLI registration and help output in an app-backed environment."
stage: routing
version: 1.0.0.0
---

# OBS-009 -- Register and inspect the official CLI

## 1. OVERVIEW

This scenario validates that the official `obsidian` binary is enabled from the Obsidian desktop settings and resolves from the shell.

### Why This Matters

The official CLI ships with the desktop app and is not installed through npm or Homebrew. Registration is the prerequisite for all app-backed CLI actions.

---

## 2. SCENARIO CONTRACT

- Feature ID: `OBS-009`
- Feature Name: Register and inspect the official CLI
- Scenario Objective: Enable Register CLI in Obsidian desktop v1.12.4+ and confirm `obsidian --help` resolves.
- Exact Prompt: `Register the official Obsidian CLI, then show its local help so we know the app-backed command surface.`
- Exact Command Sequence: `1. Obsidian Settings → General → Command line interface → toggle on → Register CLI -> 2. obsidian --help`
- Expected Signals: Step 1 completes in the desktop app; step 2 resolves the binary and prints usage with exit 0.
- Evidence: Obsidian version, registration setting, shell path, help output, and exit code.
- Pass/Fail Criteria: PASS if the registered binary resolves and help exits 0; FAIL if registration is unavailable, the binary is absent, or the app version is below the documented minimum.
- Failure Triage: 1. Confirm Obsidian desktop v1.12.4+. 2. Re-register from Settings. 3. Compare the GUI-launched PATH with the shell PATH and open a new shell.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

This scenario needs the desktop app. It does not validate headless file operations.

### Prompt

`Register the official Obsidian CLI, then show its local help so we know the app-backed command surface.`

### Commands

1. `Obsidian Settings → General → Command line interface → toggle on → Register CLI`
2. `obsidian --help`

### Expected

The app confirms registration and the shell prints official CLI help with exit 0.

### Evidence

Capture the app version, registration setting, `command -v obsidian`, help output, and exit code.

### Pass / Fail

- **Pass:** the official binary resolves and help exits 0 after registration.
- **Fail:** the binary is missing, registration cannot be completed, or the version prerequisite is not met.

### Failure Triage

1. Confirm desktop version and the exact settings path.
2. Re-register, open a new shell, and run `command -v obsidian`.
3. Diagnose GUI-versus-shell PATH differences using the troubleshooting reference.

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| OBS-009 | Register and inspect the official CLI | Register and inspect official help | `Register the official Obsidian CLI, then show its local help so we know the app-backed command surface.` | 1. Register from desktop settings -> 2. `obsidian --help` | Registration succeeds; help prints; exit 0 | App version/setting, PATH, help, exit code | PASS if binary resolves and help succeeds; FAIL otherwise | Recheck version, registration, and PATH |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`../manual-testing-playbook.md`](../manual-testing-playbook.md) | Root policy and app-backed prerequisites |
| [`../../feature-catalog/cli/register-cli.md`](../../feature-catalog/cli/register-cli.md) | Catalog entry for registration |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`../../references/obsidian-cli-commands.md`](../../references/obsidian-cli-commands.md) | Version and registration path |
| [`../../references/troubleshooting.md`](../../references/troubleshooting.md) | Registration and PATH diagnosis |

---

## 5. SOURCE METADATA

- Group: Official app-backed CLI
- Playbook ID: `OBS-009`
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `official-cli/register-and-help.md`
