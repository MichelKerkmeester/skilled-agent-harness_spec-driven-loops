---
title: "DAL-005 -- Authority x artifact-class registry enforcement"
description: "Verify AUTHORITY_ARTIFACT_CLASSES is the single registry, that an unknown authority fails naming the registered set, and that a real authority paired with an unsupported artifact-class fails naming both values."
version: 1.0.0.0
---

# DAL-005 -- Authority x artifact-class registry enforcement

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DAL-005`.

---

## 1. OVERVIEW

This scenario validates registry enforcement for `DAL-005`. The objective is to verify that `AUTHORITY_ARTIFACT_CLASSES` is the single authority->artifact-class registry, that an unknown authority fails fast naming the registered set, and that a valid authority paired with an unsupported artifact-class (e.g. `sk-git` + `docs`) fails naming both values and the authority's actual supported class(es).

### WHY THIS MATTERS

The registry is the one place a new authority registers (add one entry, no loop change). A silently-accepted bad pairing would send an adapter a scope it cannot service; a vague error would make headless lane files hard to debug. The error must name the offending values so a config author can fix the file.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify unknown-authority and unsupported-pairing lanes both fail fast with named values.
- Real user request: What happens if my lane file names an authority that does not exist, or pairs sk-git with docs?
- Prompt: `Validate deep-alignment authority/artifact-class registry enforcement: unknown authority and unsupported pairing both fail fast with named values.`
- Expected execution process: Read `AUTHORITY_ARTIFACT_CLASSES` and `validateLane`, then call `resolveLanesFromConfig` with an unknown authority and with a valid-authority/invalid-class pairing, confirming each throws an input-validation error naming the offending values.
- Desired user-facing outcome: The user is told the four v1 authorities and their classes, and that a bad lane fails immediately with a message naming what was wrong.
- Expected signals: `AUTHORITY_ARTIFACT_CLASSES` maps `sk-doc->docs`, `sk-git->git-history`, `sk-design->designs`, `sk-code->code`; `validateLane` rejects an unknown authority listing the registered set, and rejects a valid-authority/invalid-class pairing naming both values and the authority's supported class(es).
- Pass/fail posture: PASS if both malformed lanes throw with named values and the registry is the single source. FAIL if either is silently accepted or the error omits the offending values.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so the registry constant is read before the runtime rejections.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
Validate deep-alignment authority/artifact-class registry enforcement: unknown authority and unsupported pairing both fail fast with named values.
### Commands
1. `bash: rg -n 'AUTHORITY_ARTIFACT_CLASSES|is not a registered authority|does not support artifactClass' .opencode/skills/system-deep-loop/deep-alignment/scripts/scoping.cjs`
2. `bash: node -e "const s=require('./.opencode/skills/system-deep-loop/deep-alignment/scripts/scoping.cjs'); try{s.resolveLanesFromConfig([{authority:'sk-frobnicate',artifactClass:'docs',scope:{type:'paths',values:['docs/']}}]);}catch(e){console.log('UNKNOWN_AUTHORITY:',e.message);}"`
3. `bash: node -e "const s=require('./.opencode/skills/system-deep-loop/deep-alignment/scripts/scoping.cjs'); try{s.resolveLanesFromConfig([{authority:'sk-git',artifactClass:'docs',scope:{type:'paths',values:['docs/']}}]);}catch(e){console.log('BAD_PAIR:',e.message);}"`
### Expected
`AUTHORITY_ARTIFACT_CLASSES` maps the four authorities to their classes. The unknown-authority call throws naming `sk-frobnicate` and the registered set (`sk-doc, sk-git, sk-design, sk-code`). The `sk-git`+`docs` call throws naming both `sk-git` and `docs` and the supported class (`git-history`).
### Evidence
Capture the registry constant and both thrown messages verbatim.
### Pass/Fail
PASS if both malformed lanes throw with named values and the registry is the single source. FAIL if either is silently accepted or the error omits the offending values.
### Failure Triage
If either call resolves a lane instead of throwing, that is the finding. If a message is present but omits the offending value or the registered/supported set, report the message-quality gap.
---

## 4. SOURCE FILES

### PLAYBOOK SOURCES

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page, integrated alignment protocol, and scenario summary |
| `lane-resolution-and-scoping/` | Lane-resolution category; `scoping.cjs` exports are exercised directly here |

### IMPLEMENTATION AND RUNTIME ANCHORS

| File | Role |
|---|---|
| `.opencode/skills/system-deep-loop/deep-alignment/scripts/scoping.cjs` | `AUTHORITY_ARTIFACT_CLASSES`, `validateLane` error messages |
| `.opencode/skills/system-deep-loop/deep-alignment/references/lane-config-schema.md` | §4 authority->artifact-class validity table; §8 error contract |
| `.opencode/skills/system-deep-loop/deep-alignment/references/scoping-protocol.md` | §2.2 AUTHORITY axis and extensibility |

---

## 5. SOURCE METADATA

- Group: LANE RESOLUTION AND SCOPING
- Playbook ID: DAL-005
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `lane-resolution-and-scoping/authority-artifact-class-registry.md`
