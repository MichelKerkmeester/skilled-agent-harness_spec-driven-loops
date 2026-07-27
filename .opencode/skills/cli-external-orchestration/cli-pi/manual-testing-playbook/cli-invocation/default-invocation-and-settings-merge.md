---
title: "PI-001 -- Version/help + .pi/ directory creation + settings.json merge"
description: "This scenario validates the installed Pi version and help surface, confirms the project-local .pi settings package merge, and keeps nested global precedence as an explicitly bounded check for `PI-001`."
version: 1.0.0.0
---

# PI-001 -- Version/help + .pi/ directory creation + settings.json merge

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `PI-001`.

---

## 1. OVERVIEW

This scenario validates Pi's installed version/help contract and the non-destructive project settings state used by the current worktree.

### Why This Matters

Version drift changes flags and resource-loading behavior. The current settings file also proves whether package additions preserve existing project configuration instead of replacing it.

---

## 2. SCENARIO CONTRACT

Operators run the inspection commands and distinguish the observed project merge from a global collision test that would touch the operator's real home directory.

- Objective: Confirm Pi is `0.82.1`, help exposes the expected headless/resource options, `.pi/` exists, and `settings.json` retains both installed package entries.
- Real user request: `Check the Pi CLI version and help, then verify this project's Pi settings kept both installed packages without changing global Pi configuration.`
- Prompt: `Inspect the Pi CLI contract and this project's .pi settings. Report the version, the relevant help flags, and the package entries exactly as observed. Do not write to the real global Pi directory.`
- Expected execution process: Isolate any Pi config directory -> run `pi --version` and `pi --help` -> inspect `.pi/settings.json` -> report the package array and any missing nested-object proof.
- Expected signals: Version output is `0.82.1`; help includes `--print`, `--mode`, `--approve`, `--offline`, `--extension`, `--skill`, and `--prompt-template`; settings contains `npm:pi-mcp-extension` and `npm:pi-subagents`.
- Desired user-visible outcome: An auditable version/help and project-settings report with no write to `~/.pi/agent/`.
- Pass/fail: PASS if the version, help options, `.pi/` existence, and two package entries match. SKIP the nested project-vs-global collision sub-check because the safe boundary forbids writing the operator's real global config. FAIL if the observed project settings clobber an existing key or the required package entries are absent.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Run the version and help checks from an isolated Pi config directory.
2. Confirm `.pi/` exists without creating or deleting it.
3. Read `.pi/settings.json` and inspect only the existing package array.
4. Record the nested global merge as SKIP unless a disposable global fixture is used outside the operator's home.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| PI-001 | Version/help + settings merge | Confirm version, help, project `.pi/`, and package preservation | `Inspect the Pi CLI contract and this project's .pi settings. Report the version, the relevant help flags, and the package entries exactly as observed. Do not write to the real global Pi directory.` | `tmp=$(mktemp -d /private/tmp/cli-pi-help-probe.XXXXXX)` -> `PI_CODING_AGENT_DIR=$tmp/agent pi --help` -> `pi --version` -> `test -d .pi` -> `sed -n '1,200p' .pi/settings.json` | Version `0.82.1`; help lists the required modes/trust/resource flags; `.pi/settings.json` has both packages | Captured output: `pi --version` returned `0.82.1` with exit `0`. `settings.json` returned:<br><code>{</code><br><code>  "packages": [</code><br><code>    "npm:pi-mcp-extension",</code><br><code>    "npm:pi-subagents"</code><br><code>  ]</code><br><code>}</code><br>Isolated `pi --help` returned exit `0` and the documented option list. | PASS for the observed project state. SKIP only the real-global nested collision sub-check with blocker `writing ~/.pi/agent/` is outside the safe boundary. | If version drifts, re-read `cli-reference.md`; if packages differ, inspect the settings-writing command and restore only from a disposable fixture, never from the real global directory. |

### Optional Supplemental Checks

- Repeat the settings inspection after a disposable-project package install and diff the JSON before and after.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory, isolation policy, and release rules |
| `../../SKILL.md` | Pi routing, self-invocation guard, and provider preflight |
| `../../references/cli-reference.md` | Version, config-directory override, flags, and failure-handling contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.pi/settings.json` | Current project package settings |
| `.pi/` | Current project-local Pi resource directory |

---

## 5. SOURCE METADATA

- Group: CLI Invocation
- Playbook ID: PI-001
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `cli-invocation/default-invocation-and-settings-merge.md`
