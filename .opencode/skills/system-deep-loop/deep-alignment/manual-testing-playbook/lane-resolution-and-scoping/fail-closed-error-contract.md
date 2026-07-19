---
title: "DAL-008 -- Fail-closed error contract"
description: "Verify any lane-config validation failure fails the whole file (never a partial lane set), exits 3, and that unreadable / invalid-JSON files fail the same way."
version: 1.0.0.0
---

# DAL-008 -- Fail-closed error contract

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DAL-008`.

---

## 1. OVERVIEW

This scenario validates the fail-closed error contract for `DAL-008`. The objective is to verify that any lane-config validation failure fails the whole file rather than returning a partial or best-effort lane set, that the process exits `3` (input-validation), and that a missing file, an unreadable file, and non-JSON content all fail identically.

### WHY THIS MATTERS

A partial lane set would silently narrow an audit's scope — an operator could believe they checked three authorities when one lane was quietly dropped. Fail-closed with a specific message (which lane, which field, or the underlying I/O/parse error) keeps headless runs honest and debuggable.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify one bad lane fails the whole file with exit 3, and missing/invalid-JSON files fail identically.
- Real user request: If one lane in my config file is malformed, does it skip that lane or reject the whole file?
- Prompt: `Validate the deep-alignment lane-config fail-closed error contract: one bad lane fails the whole file with exit 3, and missing/invalid-JSON files fail identically.`
- Expected execution process: Read `parseLaneConfigFile`, `resolveLanesFromConfig`, and the exit-code classifier, then run the CLI against a fixture with one good and one bad lane, a missing path, and a non-JSON file, confirming each exits `3` and returns no partial set.
- Desired user-facing outcome: The user is told a single malformed lane rejects the entire file (nothing is silently dropped), and that file/parse errors fail the same way with a clear message.
- Expected signals: `parseLaneConfigFile` raises `INPUT_VALIDATION` (exit `3`) on a missing file, unreadable file, non-JSON content, or any failing lane; `lane-config-schema.md` §8's error table names the offending value/lane; no partial lane set is ever returned.
- Pass/fail posture: PASS if every failure mode exits `3` with a specific message and never a partial set. FAIL if a bad lane is dropped while good lanes resolve, or any failure exits 0.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so the documented contract is checked before the runtime failures.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
Validate the deep-alignment lane-config fail-closed error contract: one bad lane fails the whole file with exit 3, and missing/invalid-JSON files fail identically.
### Commands
1. `bash: rg -n 'parseLaneConfigFile|classifyExitCode|INPUT_VALIDATION|not valid JSON|could not be read' .opencode/skills/system-deep-loop/deep-alignment/scripts/scoping.cjs`
2. `bash: printf '[{"authority":"sk-doc","artifactClass":"docs","scope":{"type":"paths","values":["docs/"]}},{"authority":"sk-git","artifactClass":"docs","scope":{"type":"paths","values":["docs/"]}}]' > /tmp/dal008-mixed.json; node .opencode/skills/system-deep-loop/deep-alignment/scripts/scoping.cjs --lane-config /tmp/dal008-mixed.json --json; echo "exit=$?"`
3. `bash: node .opencode/skills/system-deep-loop/deep-alignment/scripts/scoping.cjs --lane-config /tmp/dal008-missing.json; echo "missing-exit=$?"; printf 'not json' > /tmp/dal008-bad.json; node .opencode/skills/system-deep-loop/deep-alignment/scripts/scoping.cjs --lane-config /tmp/dal008-bad.json; echo "badjson-exit=$?"`
### Expected
The mixed file (one valid `sk-doc`/`docs` lane, one invalid `sk-git`/`docs` lane) exits `3` and resolves NO lanes (not just the good one). The missing file exits `3` naming the resolved path; the non-JSON file exits `3` naming the parse error. No invocation returns a partial lane set.
### Evidence
Capture the three non-zero exit codes and the three specific stderr messages; confirm the mixed file produced no `status: ok` lane output.
### Pass/Fail
PASS if every failure mode exits `3` with a specific message and never a partial set. FAIL if the good lane resolves while the bad one is dropped, or any failure exits 0.
### Failure Triage
If the mixed file emits a one-lane `status: ok` payload, the fail-closed whole-file contract is broken (this is the finding). If exit codes are 1 instead of 3, inspect the `classifyExitCode` mapping.
---

## 4. SOURCE FILES

### PLAYBOOK SOURCES

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page, integrated alignment protocol, and scenario summary |
| `lane-resolution-and-scoping/` | Lane-resolution category; the scoping CLI is exercised directly here |

### IMPLEMENTATION AND RUNTIME ANCHORS

| File | Role |
|---|---|
| `.opencode/skills/system-deep-loop/deep-alignment/scripts/scoping.cjs` | `parseLaneConfigFile`, `resolveLanesFromConfig`, `classifyExitCode` exit-3 behavior |
| `.opencode/skills/system-deep-loop/deep-alignment/references/lane-config-schema.md` | §8 error contract table (which value/lane is named) |

---

## 5. SOURCE METADATA

- Group: LANE RESOLUTION AND SCOPING
- Playbook ID: DAL-008
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `lane-resolution-and-scoping/fail-closed-error-contract.md`
