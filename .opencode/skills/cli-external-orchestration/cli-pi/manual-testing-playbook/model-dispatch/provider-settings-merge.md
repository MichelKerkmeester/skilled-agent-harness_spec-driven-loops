---
title: "PI-018 -- Provider and settings merge"
description: "This documentation-grounded scenario checks the provider configuration surface against Pi settings merge semantics and leaves the credentialed interaction explicitly SKIP for `PI-018`."
version: 1.0.0.0
---

# PI-018 -- Provider and settings merge

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `PI-018`.

---

## 1. OVERVIEW

This scenario connects provider selection and authentication configuration to the project settings merge without putting a key in a prompt or testing a real global collision.

### Why This Matters

Provider selection, credentials, and project settings are separate surfaces. A settings merge can preserve package configuration while a provider-backed dispatch remains unavailable, so one must not be used as proof of the other.

---

## 2. SCENARIO CONTRACT

- Objective: Document the provider configuration surface and identify the live settings/provider interaction that still needs credentials.
- Real user request: `Check how Pi selects a provider and how that configuration coexists with this project's merged settings, without exposing or entering any key.`
- Prompt: `Read the Pi provider and settings guidance. Report the provider-selection inputs, the current project settings keys, and the exact blocker if a live provider interaction cannot be run.`
- Expected execution process: Read `cli-reference.md` and the provider reference -> inspect `.pi/settings.json` -> do not print secret values -> classify the live provider merge check.
- Expected signals: Provider/model/API-key inputs are documented; current settings shows packages and no credential; no secret appears in output.
- Desired user-visible outcome: A safe boundary statement separating provider configuration from package/settings merge.
- Pass/fail: PASS for source and secret-safety inspection. SKIP the live provider/auth interaction with blocker `provider credentials are absent on this machine`. FAIL if a secret is copied into a prompt or settings report.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Read the provider option and environment-variable documentation.
2. Inspect only key names and non-secret settings values.
3. Record the current project package array.
4. Mark the provider-backed merge interaction SKIP until credentials exist.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| PI-018 | Provider and settings merge | Separate provider config from project settings merge | `Read the Pi provider and settings guidance. Report the provider-selection inputs, the current project settings keys, and the exact blocker if a live provider interaction cannot be run.` | `sed -n '1,180p' ../../references/cli-reference.md` -> inspect the provider reference named there -> `jq 'keys' .pi/settings.json` -> `jq -r '.packages[]' .pi/settings.json` -> do not print credential values | Provider/model/API-key inputs are documented; settings keys are `packages`; package names are visible; no secrets are emitted | Captured settings output contains only `packages`, with values `npm:pi-mcp-extension` and `npm:pi-subagents`. The CLI reference documents provider/model/API-key inputs and says provider failures are output-first. | PASS for docs and secret safety. SKIP live interaction with blocker `provider credentials are absent on this machine`. FAIL if secret material appears or settings merge is described as provider success. | Inspect only variable names, remove any accidental secret from captured output, and rerun with a disposable config directory. |

### Optional Supplemental Checks

- With operator-supplied credentials, compare before/after settings in a disposable project and capture the provider response separately from package merge output.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Credential and output-safety policy |
| `../../SKILL.md` | Provider preflight and no-secret rule |
| `../../references/cli-reference.md` | Provider option and failure surface |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.pi/settings.json` | Current project settings merge result |
| `../../references/model-dispatch-gpt-5.6.md` | Model/provider reference with unconfirmed Pi effort syntax clearly labeled |

---

## 5. SOURCE METADATA

- Group: Model Dispatch
- Playbook ID: PI-018
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `model-dispatch/provider-settings-merge.md`
