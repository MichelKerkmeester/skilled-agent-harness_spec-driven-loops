---
title: "DAL-004 -- Two resolution paths produce one identical lane shape"
description: "Verify the interactive path (resolveLanesFromSelections) and the config-file path (resolveLanesFromConfig) funnel through the same validateLane/validateScope and produce an indistinguishable resolved lane tuple."
version: 1.0.0.0
---

# DAL-004 -- Two resolution paths produce one identical lane shape

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DAL-004`.

---

## 1. OVERVIEW

This scenario validates the dual-path lane-shape equivalence for `DAL-004`. The objective is to verify that an interactively-resolved lane and a `--lane-config` lane are indistinguishable once resolved, because both paths call the single `validateLane` -> `validateScope` choke point.

### WHY THIS MATTERS

Every downstream state (DISCOVER, ITERATE, CONVERGE, REPORT) consumes resolved lanes without knowing which path produced them. If the two producers could diverge in what a resolved lane looks like, a headless run and an interactive run could behave differently for the same intent. This is a critical-path scenario for the mode's contract.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify an interactively-resolved lane and a --lane-config lane are byte-identical once resolved.
- Real user request: If I answer the scoping question by hand versus passing a config file, do I get exactly the same audit?
- Prompt: `Validate that an interactively-resolved deep-alignment lane and a --lane-config lane are byte-identical once resolved, because both call the same validateLane/validateScope choke point.`
- Expected execution process: Read `scoping_protocol.md` §4's "one shape, two producers" statement, then require `scoping.cjs` and call `resolveLanesFromConfig` and `resolveLanesFromSelections` with equivalent input, then deep-compare the outputs.
- Desired user-facing outcome: The user is told that answering the question by hand and passing a config file produce the exact same lanes, so the two paths are interchangeable.
- Expected signals: Equivalent input through both entrypoints yields identical `{authority, artifactClass, scope}` tuples; both call `validateLane` -> `validateScope`; `scoping_protocol.md` §4 states "one shape, two producers".
- Pass/fail posture: PASS if the two outputs deep-equal for equivalent input. FAIL if they differ in any field, key order semantics aside.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so the documented invariant is checked before the runtime comparison.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
Validate that an interactively-resolved deep-alignment lane and a --lane-config lane are byte-identical once resolved, because both call the same validateLane/validateScope choke point.
### Commands
1. `bash: rg -n 'one shape, two producers|validateLane|validateScope|indistinguishable' .opencode/skills/system-deep-loop/deep-alignment/scripts/scoping.cjs .opencode/skills/system-deep-loop/deep-alignment/references/scoping_protocol.md`
2. `bash: node -e "const s=require('./.opencode/skills/system-deep-loop/deep-alignment/scripts/scoping.cjs'); const cfg=s.resolveLanesFromConfig([{authority:'sk-code',artifactClass:'code',scope:{type:'globs',values:['src/**/*.ts']}}]); const sel=s.resolveLanesFromSelections([{artifactClass:'code',authorities:['sk-code'],scope:{type:'globs',values:['src/**/*.ts']}}]); console.log(JSON.stringify(cfg)===JSON.stringify(sel)?'IDENTICAL':'DIFFERENT'); console.log(JSON.stringify(cfg));"`
### Expected
The two calls produce identical resolved-lane arrays (`IDENTICAL`), each a single `{authority:'sk-code', artifactClass:'code', scope:{type:'globs', values:['src/**/*.ts']}}` tuple. Both paths route through `validateLane` -> `validateScope`.
### Evidence
Capture the `IDENTICAL` result and the serialized lane tuple, plus the `scoping_protocol.md` §4 "one shape, two producers" line.
### Pass/Fail
PASS if the two outputs deep-equal for equivalent input. FAIL if they differ in any field.
### Failure Triage
If the outputs differ, diff the two serialized tuples field by field; a divergence means one path is bypassing the shared `validateLane`/`validateScope` choke point, which is the finding.
---

## 4. SOURCE FILES

### PLAYBOOK SOURCES

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page, integrated alignment protocol, and scenario summary |
| `lane-resolution-and-scoping/` | Lane-resolution category; `scoping.cjs` exports are exercised directly here |

### IMPLEMENTATION AND RUNTIME ANCHORS

| File | Role |
|---|---|
| `.opencode/skills/system-deep-loop/deep-alignment/scripts/scoping.cjs` | `resolveLanesFromConfig`, `resolveLanesFromSelections`, and the shared `validateLane`/`validateScope` |
| `.opencode/skills/system-deep-loop/deep-alignment/references/scoping_protocol.md` | §4 "one shape, two producers"; §3 lane resolution |

---

## 5. SOURCE METADATA

- Group: LANE RESOLUTION AND SCOPING
- Playbook ID: DAL-004
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `lane-resolution-and-scoping/dual-path-identical-lane-shape.md`
- Criticality: Critical-path scenario (see root §5 hard rule).
