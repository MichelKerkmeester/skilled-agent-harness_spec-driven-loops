---
title: "DAL-015 -- Authority-agnostic three-method adapter contract"
description: "Verify every adapter implements the same three methods with a single-parameter discover(scope), that discover emits FILE seed nodes shaped for upsert.cjs, and that the loop never branches on authority."
version: 1.0.0.0
---

# DAL-015 -- Authority-agnostic three-method adapter contract

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DAL-015`.

---

## 1. OVERVIEW

This scenario validates the authority-agnostic adapter contract for `DAL-015`. The objective is to verify that all five adapters export the same three ADR-003 methods (`discover`, `standardSource`, `check`), that `discover(scope)` is single-parameter (no authority argument), that each `discover` returns `{artifacts, nodes}` with `kind:'FILE'` seed nodes shaped for `runtime/scripts/upsert.cjs`, and that `discover_contract.md` §6 guarantees a fifth authority needs no change to the contract, `scoping.cjs`, or the loop.

### WHY THIS MATTERS

The whole point of ADR-003's three-method contract is that the loop never branches on which authority it is running — a new authority registers by implementing the trio plus one `AUTHORITY_ARTIFACT_CLASSES` entry. If an adapter widened `discover`'s signature or the loop special-cased an authority, that extensibility guarantee would be silently broken.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify all five adapters export discover/standardSource/check, discover(scope) takes one parameter, and discover emits FILE seed nodes.
- Real user request: How hard is it to add a sixth authority to this mode?
- Prompt: `Validate the deep-alignment authority-agnostic adapter contract: all five adapters export discover/standardSource/check, discover(scope) takes one parameter, and discover emits FILE seed nodes.`
- Expected execution process: Require each of the five adapter modules and assert the three exports are functions; inspect each `discover`'s arity and node shape; read `discover_contract.md` §2 (single-parameter signature) and §6 (extensibility guarantee).
- Desired user-facing outcome: The user is told all five authorities share one method trio, discovery takes only a scope, discovery seeds `FILE` nodes for the coverage graph, and a new authority slots in without touching the loop.
- Expected signals: all five adapter modules export `discover`, `standardSource`, `check`; `discover(scope)` is single-parameter (no authority arg); each `discover` returns `{artifacts, nodes}` with `kind:'FILE'` nodes carrying `authority`/`artifactClass` metadata; `discover_contract.md` §6 states a fifth authority needs no change to the contract, `scoping.cjs`, or the loop.
- Pass/fail posture: PASS if all five export the trio, discover is single-parameter and emits FILE nodes, and the contract guarantees loop-free extensibility. FAIL if any adapter is missing a method, widens discover's signature, or emits a non-FILE seed node.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so the export check precedes the node-shape and contract checks.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
Validate the deep-alignment authority-agnostic adapter contract: all five adapters export discover/standardSource/check, discover(scope) takes one parameter, and discover emits FILE seed nodes.
### Commands
1. `bash: node -e "for(const n of ['sk-doc','sk-git','sk-design','sk-code','sk-design-live-render']){const m=require('./.opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/'+n+'.cjs'); console.log(n, ['discover','standardSource','check'].map(k=>typeof m[k]).join('/'), 'discover.arity='+m.discover.length);}"`
2. `bash: node -e "const m=require('./.opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc.cjs'); const {nodes}=m.discover({type:'paths',values:['.opencode/skills/system-deep-loop/deep-alignment/references/discover_contract.md']}); console.log(JSON.stringify(nodes[0]));"`
3. `bash: rg -n 'One parameter|discover\(scope\) -> artifacts|kind: .FILE.|Authority-agnostic|no engine-side caller may special-case|needs no change' .opencode/skills/system-deep-loop/deep-alignment/references/discover_contract.md`
### Expected
Command 1 prints `function/function/function` for all five adapters with `discover.arity=1`. Command 2 prints a single node with `kind:'FILE'`, an `id`, a `name`, and `metadata` carrying `authority`/`artifactClass`. The contract doc confirms the single-parameter signature and the "a fifth authority needs no change to this document, to scoping.cjs, or to the loop" guarantee.
### Evidence
Capture the five-adapter export/arity line, the sample FILE node, and the §2/§6 contract passages.
### Pass/Fail
PASS if all five export the trio, discover is single-parameter and emits FILE nodes, and the contract guarantees loop-free extensibility. FAIL if any adapter is missing a method, widens discover's signature, or emits a non-FILE seed node.
### Failure Triage
If any adapter reports `discover.arity` > 1, it has widened the signature (an ADR-003 violation). If a seed node's `kind` is not `FILE`, cross-check against `discover_contract.md` §4.2's NodeKind requirement.
---

## 4. SOURCE FILES

### PLAYBOOK SOURCES

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page, integrated alignment protocol, and scenario summary |
| `discovery-and-adapters/` | Adapter category; all five adapter modules are exercised directly here |

### IMPLEMENTATION AND RUNTIME ANCHORS

| File | Role |
|---|---|
| `.opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/*.cjs` | The five adapters whose export trio and discover arity are checked |
| `.opencode/skills/system-deep-loop/deep-alignment/references/discover_contract.md` | §2 single-parameter signature; §4 FILE seed-node shape; §6 extensibility guarantee |
| `.opencode/skills/system-deep-loop/runtime/scripts/upsert.cjs` | The coverage-graph seed entrypoint the `nodes` output is shaped for |

---

## 5. SOURCE METADATA

- Group: DISCOVERY AND ADAPTERS
- Playbook ID: DAL-015
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `discovery-and-adapters/authority-agnostic-adapter-contract.md`
