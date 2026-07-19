---
title: "DAL-009 -- Multi-authority single run"
description: "Verify one run resolves N named lanes (not a cross-product): the sk-code/sk-git/sk-design worked example resolves to exactly three lanes, with no hard-coded lane ceiling."
version: 1.0.0.0
---

# DAL-009 -- Multi-authority single run

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DAL-009`.

---

## 1. OVERVIEW

This scenario validates multi-authority resolution for `DAL-009`. The objective is to verify that one run resolves N lanes for exactly the named `(authority, artifactClass, scope)` combinations — not a full artifact-class x authority cross-product — using the documented "sk-code and sk-git and/or sk-design in one pass" precedent, and that the engine imposes no hard-coded lane ceiling.

### WHY THIS MATTERS

The mode's headline capability is auditing several authorities' standards in a single run. Operators must trust that they get exactly the lanes they named (no surprise cross-product blowup, no silently-capped lane count), so a single lane file can express a whole multi-authority sweep.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify the worked 3-lane example resolves to exactly 3 named lanes, not a cross-product.
- Real user request: I want to check sk-code on my source, sk-git on my recent commits, and sk-design on DESIGN.md, all in one run.
- Prompt: `Validate deep-alignment multi-authority resolution: the worked 3-lane example resolves to exactly 3 named lanes, not a full artifact-class x authority cross-product.`
- Expected execution process: Read `lane-config-schema.md` §7's worked example and `scoping-protocol.md` §3, then resolve the three-lane config and confirm exactly three lanes come back with the expected authorities/classes/scopes.
- Desired user-facing outcome: The user is told one lane file can name several authorities, and the run audits exactly those combinations — three lanes for the three named walks.
- Expected signals: The `lane-config-schema.md` §7 worked example (sk-code/code, sk-git/git-history, sk-design/designs) resolves to 3 lanes; `scoping-protocol.md` §3 states only named combinations become lanes and lane count is unbounded by the engine (SC-002).
- Pass/fail posture: PASS if the three-lane config resolves to exactly three correctly-typed lanes. FAIL if it produces a cross-product, drops a lane, or hits an artificial cap.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so the documented example is checked before the runtime resolution.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
Validate deep-alignment multi-authority resolution: the worked 3-lane example resolves to exactly 3 named lanes, not a full artifact-class x authority cross-product.
### Commands
1. `bash: rg -n 'Multi-Authority Single Run|resolves this to 3 lanes|not.*cross-product|unbounded|SC-002' .opencode/skills/system-deep-loop/deep-alignment/references/lane-config-schema.md .opencode/skills/system-deep-loop/deep-alignment/references/scoping-protocol.md`
2. `bash: printf '[{"authority":"sk-code","artifactClass":"code","scope":{"type":"globs","values":["src/**/*.ts"]}},{"authority":"sk-git","artifactClass":"git-history","scope":{"type":"branchRange","from":"main","to":"HEAD"}},{"authority":"sk-design","artifactClass":"designs","scope":{"type":"paths","values":["DESIGN.md"]}}]' > /tmp/dal009.json; node .opencode/skills/system-deep-loop/deep-alignment/scripts/scoping.cjs --lane-config /tmp/dal009.json --json`
### Expected
The CLI reports `status: ok` with exactly 3 lanes: `sk-code/code/globs`, `sk-git/git-history/branchRange`, `sk-design/designs/paths` — one lane per named walk, in order, not a 4x4 cross-product. The references confirm only named combinations become lanes and the lane count is unbounded by the engine.
### Evidence
Capture the 3-lane `--json` payload and the two reference passages (named-combinations-only, unbounded-count).
### Pass/Fail
PASS if the config resolves to exactly three correctly-typed lanes. FAIL if it produces more/fewer lanes, a cross-product, or hits an artificial cap.
### Failure Triage
If more than three lanes appear, the resolver is cross-producting rather than mapping named walks. If fewer, a lane is being dropped — cross-check against DAL-008's fail-closed contract.
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
| `.opencode/skills/system-deep-loop/deep-alignment/scripts/scoping.cjs` | `resolveLanesFromConfig` multi-lane resolution |
| `.opencode/skills/system-deep-loop/deep-alignment/references/lane-config-schema.md` | §7 worked multi-authority example |
| `.opencode/skills/system-deep-loop/deep-alignment/references/scoping-protocol.md` | §3 named-combinations-only, unbounded lane count (SC-002) |

---

## 5. SOURCE METADATA

- Group: LANE RESOLUTION AND SCOPING
- Playbook ID: DAL-009
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `lane-resolution-and-scoping/multi-authority-single-run.md`
