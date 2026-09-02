---
title: "OBS-010 -- Open an app-backed target"
description: "This scenario validates a local-help-confirmed official obsidian CLI app action and records URI syntax as VERIFY."
stage: routing
version: 0.1.0.0
---

# OBS-010 -- Open an app-backed target

## 1. OVERVIEW

This scenario validates the official CLI's live-app boundary by opening or focusing an operator-approved note or vault target.

### Why This Matters

The official CLI is a remote control for the running desktop app, not a headless filesystem tool. The exact command surface is version-dependent and must be confirmed locally.

---

## 2. SCENARIO CONTRACT

- Feature ID: `OBS-010`
- Feature Name: Open an app-backed target
- Scenario Objective: With Obsidian running, open `TEST_TARGET` with `obsidian open file=` and capture visible app state.
- Exact Prompt: `Open TEST_TARGET in the live Obsidian app using the official CLI, and report what became visible.`
- Exact Command Sequence: `1. obsidian version (must exit 0) -> 2. obsidian open file="TEST_TARGET" -> 3. capture the visible app state`
- Expected Signals: Step 1 exits 0, proving the app is running; step 2 prints no leading `Error:` on stdout; step 3 identifies the visible target in the live UI.
- Evidence: Help output, exact command used, exit code, app window/vault/note state, and any URI-action syntax discovered.
- Pass/Fail Criteria: PASS if the local-help-confirmed form opens the target in the app; SKIP if the documented high-level form differs and no safe syntax is confirmed; FAIL if a confirmed command does not produce the expected app action.
- Failure Triage: 1. Re-run `obsidian version`; exit 1 means the app is not running and the CLI will not start it. 2. Confirm the target resolves with `obsidian file file="TEST_TARGET"`. 3. Remember the CLI exits 0 on failure, so read stdout for a leading `Error:` rather than trusting the status.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

Use a non-destructive target. The current package confirms app-backed open behavior but not the exact subcommand or URI bridge.

### Prompt

`Open TEST_TARGET in the live Obsidian app using the official CLI, and report what became visible.`

### Commands

1. `obsidian version` — must exit 0 before step 2; exit 1 means Obsidian is not running.
2. `obsidian open file="TEST_TARGET"` — `file=` resolves by name like a wikilink; use `path=` for an exact vault-relative path.
3. Capture the visible app state.

### Expected

The running app focuses and shows the requested target. The CLI does not launch Obsidian, so a closed app is a prerequisite failure rather than a scenario failure.

### Evidence

Capture the `obsidian version` output and status, the open command, its stdout, and the visible app state.

### Pass / Fail

- **Pass:** `obsidian open file=` focuses the expected target and prints no leading `Error:`.
- **Skip:** Obsidian desktop is not installed, or it cannot be started in this environment, so `obsidian version` never exits 0.
- **Fail:** the command runs but opens the wrong target, does not focus the app, or prints `Error:` on stdout.

### Failure Triage

1. Re-read the local help and record the installed version.
2. Confirm `TEST_TARGET` is valid and operator-owned.
3. Keep URI/plugin actions marked `VERIFY` until the local CLI confirms them.

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| OBS-010 | Open an app-backed target | Open a note in the live app with the confirmed command form | `Open TEST_TARGET in the live Obsidian app using the official CLI, and report what became visible.` | 1. `obsidian version` (exit 0) -> 2. `obsidian open file="TEST_TARGET"` -> 3. capture app state | Preflight exits 0; no leading `Error:` on stdout; target visible | Version output, command, stdout, app state | PASS on confirmed open; SKIP if the app cannot run here; FAIL on wrong app behavior | Re-run preflight, resolve the target with `obsidian file`, read stdout not `$?` |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`../manual-testing-playbook.md`](../manual-testing-playbook.md) | Root policy and app-backed scenario index |
| [`../../feature-catalog/cli/open-note-or-vault.md`](../../feature-catalog/cli/open-note-or-vault.md) | Catalog entry for live-app opening |
| [`../../feature-catalog/cli/uri-actions.md`](../../feature-catalog/cli/uri-actions.md) | Catalog entry for the URI boundary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`../../references/obsidian-cli-commands.md`](../../references/obsidian-cli-commands.md) | Official CLI high-level behavior and `VERIFY` syntax |
| [`../../references/troubleshooting.md`](../../references/troubleshooting.md) | App-backed and PATH recovery |

---

## 5. SOURCE METADATA

- Group: Official app-backed CLI
- Playbook ID: `OBS-010`
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `official-cli/open-app-action.md`
