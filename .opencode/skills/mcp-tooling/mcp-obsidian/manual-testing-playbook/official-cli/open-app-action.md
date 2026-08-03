---
title: "OBS-010 -- Open an app-backed target"
description: "This scenario validates a local-help-confirmed official obsidian CLI app action and records URI syntax as VERIFY."
stage: routing
version: 1.0.0.0
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
- Scenario Objective: Use the local `obsidian --help` output to open `TEST_TARGET` and capture visible app state.
- Exact Prompt: `Open TEST_TARGET in the live Obsidian app using the official CLI, and report what became visible.`
- Exact Command Sequence: `1. obsidian --help -> 2. obsidian "TEST_TARGET" (VERIFY target syntax against step 1) -> 3. capture the visible app state`
- Expected Signals: Step 1 prints the installed syntax; step 2 launches/focuses Obsidian or the operator records a syntax mismatch; step 3 identifies the visible target.
- Evidence: Help output, exact command used, exit code, app window/vault/note state, and any URI-action syntax discovered.
- Pass/Fail Criteria: PASS if the local-help-confirmed form opens the target in the app; SKIP if the documented high-level form differs and no safe syntax is confirmed; FAIL if a confirmed command does not produce the expected app action.
- Failure Triage: 1. Read `obsidian --help` again. 2. Confirm the target is a valid vault-relative path or supported URI. 3. If app/plugin URI behavior is required, record it as `VERIFY` rather than substituting headless CLI work.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

Use a non-destructive target. The current package confirms app-backed open behavior but not the exact subcommand or URI bridge.

### Prompt

`Open TEST_TARGET in the live Obsidian app using the official CLI, and report what became visible.`

### Commands

1. `obsidian --help`
2. `obsidian "TEST_TARGET"` — verify the exact target form against step 1.
3. Capture the visible app state.

### Expected

The app launches or focuses and shows the requested target when the local command form supports it. If the command differs, record `SKIP` with the exact help output.

### Evidence

Capture help, command, exit code, visible app state, and any URI-action details.

### Pass / Fail

- **Pass:** a help-confirmed command opens/focuses the expected target.
- **Skip:** exact syntax is not confirmed on the installed app.
- **Fail:** confirmed syntax runs but opens the wrong target or does not focus the app.

### Failure Triage

1. Re-read the local help and record the installed version.
2. Confirm `TEST_TARGET` is valid and operator-owned.
3. Keep URI/plugin actions marked `VERIFY` until the local CLI confirms them.

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| OBS-010 | Open an app-backed target | Open a local-help-confirmed note or vault target | `Open TEST_TARGET in the live Obsidian app using the official CLI, and report what became visible.` | 1. `obsidian --help` -> 2. `obsidian "TEST_TARGET"` (VERIFY) -> 3. capture app state | Help confirms syntax; app launches/focuses; target visible or syntax blocker recorded | Help, command, exit code, app state | PASS on confirmed open; SKIP on unconfirmed syntax; FAIL on wrong app behavior | Re-read help, validate target, keep URI behavior VERIFY |

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
