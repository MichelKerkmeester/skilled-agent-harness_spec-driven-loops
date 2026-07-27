---
title: "PI-014 -- Extension auto-discovery"
description: "This scenario validates project-local `.pi/extensions/*.ts` auto-discovery without a settings entry and records the isolated live startup evidence for `PI-014`."
version: 1.0.0.0
---

# PI-014 -- Extension auto-discovery

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `PI-014`.

---

## 1. OVERVIEW

This scenario checks that six project-local extension factories load from `.pi/extensions/` without an extension path in `.pi/settings.json`.

### Why This Matters

The extension directory is executable project state. Auto-discovery must be visible through successful startup or a precise extension error; a settings omission must not be mistaken for disabled loading.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm project-local extension auto-discovery and distinguish extension loading from provider-backed model execution.
- Real user request: `Start Pi with this project and confirm it loads the local extensions without adding extension paths to settings.`
- Prompt: `List your available tools. Do not modify files. Return the exact provider blocker if a model turn cannot start.`
- Expected execution process: Count and inspect `.pi/extensions/*.ts` -> inspect `.pi/settings.json` for extension entries -> run Pi in an isolated config directory -> inspect for factory/parse errors.
- Expected signals: Six extension files exist; settings contains packages but no extension path; live startup reaches `No API key found for the selected model` without an extension factory error.
- Desired user-visible outcome: Evidence that project-local extension auto-discovery is active and does not require a settings entry.
- Pass/fail: PASS for the auto-discovery/loadability check. SKIP a provider-backed response with blocker `provider credentials are absent on this machine`. FAIL on any invalid factory or extension-load error.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Count the extension files and inspect their default exports.
2. Verify `.pi/settings.json` contains no extension path key.
3. Copy only the extensions into a disposable project and run the exact Pi dispatch with a temporary config directory.
4. Inspect output for extension errors before interpreting provider output.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| PI-014 | Extension auto-discovery | Load six project extensions without settings registration | `List your available tools. Do not modify files. Return the exact provider blocker if a model turn cannot start.` | `find .pi/extensions -maxdepth 1 -type f -name '*.ts' -print | sort` -> `jq '{packages,extensions}' .pi/settings.json` -> copy `.pi/extensions/*.ts` into an isolated fixture -> `PI_CODING_AGENT_DIR=<tmp> pi --offline --approve -p "list your available tools" </dev/null` | Six files; settings has packages and no extension path; no extension factory error | Captured file list contains `dispatch-audit.ts`, `dispatch-preflight-lint.ts`, `mcp-route-guard.ts`, `post-edit-quality.ts`, `spec-gate-classify.ts`, and `spec-gate-enforce.ts`. Captured settings output has packages and `"extensions": null`. Isolated live output is the exact provider message `No API key found for the selected model.` with `probe_rc=1`; no extension error appears. | PASS for auto-discovery and factory loading. SKIP only the provider-backed model response with blocker `provider credentials are absent on this machine`. FAIL on extension parse/factory failure. | Inspect the named extension export, rerun in an isolated project, and do not add a settings entry merely to make discovery appear to work. |

### Optional Supplemental Checks

- Add one deliberately invalid extension to a disposable fixture and confirm Pi fails the whole session with its documented factory error, then remove the fixture.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Extension isolation and evidence rules |
| `../../SKILL.md` | Native extension routing and provider preflight |
| `../../references/native-skills-and-extensions.md` | Extension discovery and failure behavior |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.pi/extensions/*.ts` | Six project-local extension factories |
| `.pi/settings.json` | Confirms no extension path entry is required |

---

## 5. SOURCE METADATA

- Group: Hook Extension Layer
- Playbook ID: PI-014
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `hook-extension-layer/extension-auto-discovery.md`
