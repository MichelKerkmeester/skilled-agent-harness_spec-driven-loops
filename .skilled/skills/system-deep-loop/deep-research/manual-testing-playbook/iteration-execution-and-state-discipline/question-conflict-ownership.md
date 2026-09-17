---
title: "DR-057 -- Question conflict ownership"
description: "Verify that inbox and registry question disagreements emit conflict events instead of overwriting strategy markdown."
version: 1.14.0.21
---

# DR-057 -- Question conflict ownership

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DR-057`.

---

## 1. OVERVIEW

This scenario validates question conflict ownership for `DR-057`. The objective is to verify that the registry owns promoted question state and inbox disagreements are recorded as explicit conflicts.

### WHY THIS MATTERS

If injected questions and reducer-rendered markdown can overwrite each other silently, a long-running research packet becomes non-deterministic and operator decisions disappear.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify that inbox and registry question disagreements emit conflict events instead of overwriting strategy markdown.
- Real user request: If an injected question disagrees with the existing question, show me what owns the truth.
- Prompt: `Validate the deep-research question conflict model across reducer, strategy docs, state registry docs, YAML, and tests.`
- Expected execution process: Inspect reducer conflict functions, strategy ownership wording, reducer registry docs, YAML event surfacing, and tests for `question_conflict`.
- Desired user-visible outcome: The user learns that inbox is immutable input, registry is canonical state, and the reducer renders key questions.
- Expected signals: `question_conflict` events include `inboxValue`, `registryValue`, and `operatorDecision`; unresolved conflicts default to `needs_decision`.
- Pass/fail posture: PASS if conflicts are stored and surfaced without silent markdown overwrites; FAIL if the inbox can directly replace registry-owned question text without an event.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
Validate the deep-research question conflict model across reducer, strategy docs, state registry docs, YAML, and tests.
### Commands
1. `bash: rg -n 'resolveQuestionConflicts|question_conflict|operatorDecision|inboxValue|registryValue' .opencode/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs`
2. `bash: rg -n 'question_conflict|operatorDecision|needs_decision|registry is the canonical owner|inbox.jsonl' .opencode/skills/system-deep-loop/deep-research/assets/deep-research-strategy.md .opencode/skills/system-deep-loop/deep-research/references/state/state-reducer-registry.md`
3. `bash: rg -n 'question_conflict|operatorDecision|inboxValue|registryValue' .opencode/commands/deep/assets/deep-research-auto.yaml .opencode/skills/system-deep-loop/runtime/tests/unit/deep-research-reduce-state.vitest.ts`
### Expected
The reducer records conflicts, the registry owns question text, and the workflow can surface `question_conflict` events with both competing values.
### Evidence
Capture the reducer function, ownership wording, YAML event field list, and test assertions for conflicts.
### Pass/Fail
PASS if disagreements become explicit conflict records and strategy markdown remains generated output; FAIL if writer order determines the final question text.
### Failure Triage
Privilege `state-reducer-registry.md` for ownership language and `reduce-state.cjs` for live conflict behavior.

---

## 4. SOURCE FILES

### PLAYBOOK SOURCES

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page, integrated review protocol, and scenario summary |
| `../../feature-catalog/state-management/question-conflict-ownership.md` | Matching feature catalog entry |

### IMPLEMENTATION AND RUNTIME ANCHORS

| File | Role |
|---|---|
| `.opencode/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs` | Conflict resolution and event payload construction |
| `.opencode/skills/system-deep-loop/deep-research/assets/deep-research-strategy.md` | Generated key-question projection and operator guidance |
| `.opencode/skills/system-deep-loop/deep-research/references/state/state-reducer-registry.md` | Canonical ownership contract |
| `.opencode/commands/deep/assets/deep-research-auto.yaml` | Workflow surfacing for reducer conflict events |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/deep-research-reduce-state.vitest.ts` | Unit coverage for conflict payloads and operator decisions |

---

## 5. SOURCE METADATA

- Group: ITERATION EXECUTION AND STATE DISCIPLINE
- Playbook ID: DR-057
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `iteration-execution-and-state-discipline/question-conflict-ownership.md`
- Feature catalog: `feature-catalog/state-management/question-conflict-ownership.md`
