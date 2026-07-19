---
title: "DAL-010 -- sk-doc adapter: discover / standardSource / check"
description: "Verify the reference adapter wraps validate_document.py + extract_structure.py: a markdown-walk discover(), a validator-pointing standardSource(), and a check() mapping blocking->P0 / warnings->P1 / DQI-below-75->P2 plus a verify-first reality-alignment sub-check."
version: 1.0.0.0
---

# DAL-010 -- sk-doc adapter: discover / standardSource / check

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DAL-010`.

---

## 1. OVERVIEW

This scenario validates the sk-doc reference adapter for `DAL-010`. The objective is to verify its three ADR-003 methods against real behavior: `discover(scope)` walks markdown files (excluding build dirs, honoring globs, returning empty for a `branchRange` scope); `standardSource('sk-doc')` points at the already-shipping `validate_document.py` / `extract_structure.py` validators and create-skill templates; and `check(artifact, rules)` maps validator blocking errors -> P0, warnings -> P1, DQI below the 75 floor -> P2, plus a verify-first reality-alignment sub-check that emits nothing without caller-supplied contradicted claims.

### WHY THIS MATTERS

sk-doc is the REFERENCE adapter every other authority copies in shape. It must audit docs against sk-doc's OWN creation standards by wrapping (not reimplementing) the real validators, and it must never assert a reality-drift finding from prose pattern-matching alone.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify sk-doc's markdown discover(), validator-wrapping standardSource(), and P0/P1/P2 + DQI-floor + verify-first check().
- Real user request: Check whether these skill docs follow sk-doc's own creation standards.
- Prompt: `Validate the sk-doc alignment adapter: markdown discover(), validator-wrapping standardSource(), and the P0/P1/P2 + DQI-floor + verify-first check() shape.`
- Expected execution process: Run the adapter's `discover`, `standard-source`, and `check` CLI subcommands against a real docs path, then read `check()`/`checkRealityAlignment` to confirm the severity mapping and the verify-first requirement.
- Desired user-facing outcome: The user is told the adapter finds the markdown artifacts in scope, runs the real sk-doc validators against them, reports structure/DQI findings with P0/P1/P2 severities, and only records a reality-drift finding when a claim was actually re-probed and contradicted.
- Expected signals: `discover({type:'paths'|'globs'})` walks `.md` files excluding `node_modules`/`dist`/etc. and a `branchRange` scope returns empty; `standardSource('sk-doc')` returns the two Python validators + create-skill templates + `core-standards.md` + `knownDeviations`; `check()` emits blocking->P0 / warnings->P1 / `dqi-below-threshold`->P2 and only records a reality-drift finding when a caller-supplied claim is already contradicted with cited reprobe evidence.
- Pass/fail posture: PASS if discover walks markdown, standardSource points at the real validators, and check applies the documented severity mapping with a verify-first reality layer. FAIL if the adapter reimplements validation, guesses a reality finding, or mis-maps severities.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so discover/standardSource are exercised before the check severity mapping.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
Validate the sk-doc alignment adapter: markdown discover(), validator-wrapping standardSource(), and the P0/P1/P2 + DQI-floor + verify-first check() shape.
### Commands
1. `bash: node .opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc.cjs discover .opencode/skills/system-deep-loop/deep-alignment/references | head -40`
2. `bash: node .opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc.cjs standard-source`
3. `bash: node .opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc.cjs check .opencode/skills/system-deep-loop/deep-alignment/references/discover-contract.md`
4. `bash: rg -n 'blocking_errors|warnings|dqi-below-threshold|DQI_FLOOR|checkRealityAlignment|only contradicted claims|reprobeEvidence' .opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc.cjs`
### Expected
`discover` returns `{artifacts, nodes}` of repo-relative `.md` paths with `kind:'FILE'` nodes carrying `authority:'sk-doc'`/`artifactClass:'docs'` metadata; `standard-source` returns `validate_document.py`/`extract_structure.py` paths, create-skill template dirs, `core-standards.md`, and a `knownDeviations` array; `check` emits findings tagged `layer:'deterministic'` with blocking->P0 / warnings->P1 / DQI<75->P2; `checkRealityAlignment` only produces a finding for a caller-supplied claim with `matchesLiveReality:false` and non-empty `reprobeEvidence`.
### Evidence
Capture the discover artifact/node sample, the standard-source JSON, one real check() finding array, and the source lines proving the severity mapping and verify-first gate.
### Pass/Fail
PASS if discover walks markdown, standardSource points at the real validators, and check applies the documented severity mapping with a verify-first reality layer. FAIL if the adapter reimplements validation, guesses a reality finding, or mis-maps severities.
### Failure Triage
If `check` produces a `reality-drift` finding with no caller-supplied verifiedClaims, the verify-first invariant is broken (cross-reference DAL-016). If severities are mis-mapped, compare `checkTemplateConformance` against the validator's `blocking_errors`/`warnings` output.
---

## 4. SOURCE FILES

### PLAYBOOK SOURCES

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page, integrated alignment protocol, and scenario summary |
| `discovery-and-adapters/` | Adapter category; the sk-doc adapter CLI is exercised directly here |

### IMPLEMENTATION AND RUNTIME ANCHORS

| File | Role |
|---|---|
| `.opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc.cjs` | discover/standardSource/check, severity mapping, `checkRealityAlignment` verify-first gate |
| `.opencode/skills/system-deep-loop/deep-alignment/references/adapters/sk-doc-adapter.md` | Full adapter specification (classifier provenance, two-layer check) |
| `.opencode/skills/sk-doc/scripts/validate_document.py` | The real validator the adapter wraps (exit-code contract) |
| `.opencode/skills/sk-doc/scripts/extract_structure.py` | The real DQI scorer the adapter wraps |

---

## 5. SOURCE METADATA

- Group: DISCOVERY AND ADAPTERS
- Playbook ID: DAL-010
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `discovery-and-adapters/sk-doc-adapter.md`
- Note: `check()` requires `python3` on PATH; a `python3`-unavailable environment yields an `adapter-error` finding (P1), which is itself a valid, documented outcome to capture rather than a scenario blocker.
