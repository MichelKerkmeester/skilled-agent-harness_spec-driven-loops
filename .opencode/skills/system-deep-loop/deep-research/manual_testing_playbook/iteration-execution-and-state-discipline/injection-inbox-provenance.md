---
title: "DR-056 -- Injection inbox provenance"
description: "Verify that late-question injections use `research/inbox.jsonl` and preserve question provenance."
version: 1.14.0.21
---

# DR-056 -- Injection inbox provenance

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DR-056`.

---

## 1. OVERVIEW

This scenario validates injection inbox provenance for `DR-056`. The objective is to verify that late questions are added through `research/inbox.jsonl`, carry origin metadata, and appear in reducer-owned question surfaces.

### WHY THIS MATTERS

Late questions are common during long research runs. They need provenance and deterministic ownership, otherwise the dashboard cannot explain whether a question came from an operator, an angle bank, an analyst strategy, or a legacy edit.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify that late-question injections use `research/inbox.jsonl` and preserve question provenance.
- Real user request: Show me how to add a question mid-run without editing reducer-owned strategy text.
- Prompt: `Validate the deep-research inbox provenance path from strategy docs through reducer output and tests.`
- Expected execution process: Inspect the strategy template's inbox contract, then reducer inbox parsing, then tests that assert provenance reaches registry, strategy, and dashboard output.
- Desired user-visible outcome: The user gets the supported late-question injection path and understands how provenance is preserved.
- Expected signals: `inbox.jsonl` schema lists id, text, source, origin, injectedAtIteration, and promotedQuestionId; reducer reads the inbox; direct edits are treated as `legacy-import`.
- Pass/fail posture: PASS if the inbox contract and reducer tests agree on provenance propagation; FAIL if late questions require direct edits to reducer-owned markdown.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
Validate the deep-research inbox provenance path from strategy docs through reducer output and tests.
### Commands
1. `bash: sed -n '30,70p' .opencode/skills/system-deep-loop/deep-research/assets/deep_research_strategy.md`
2. `bash: rg -n 'INBOX_FILE_NAME|readInboxQuestions|legacy-import|origin|injectedAtIteration' .opencode/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs`
3. `bash: rg -n 'promotes inbox questions|legacy-import|inbox.jsonl|origin' .opencode/skills/system-deep-loop/runtime/tests/unit/deep-research-reduce-state.vitest.ts`
### Expected
Inbox records are documented, reducer-read, and carried into generated question state with provenance; direct markdown edits remain a legacy-import compatibility path.
### Evidence
Capture the schema bullets, reducer function names, and test assertions for registry, strategy, and dashboard output.
### Pass/Fail
PASS if supported late-question injection is `inbox.jsonl` and provenance survives the reduce step; FAIL if provenance is dropped or direct markdown edits are the only path.
### Failure Triage
Privilege `reduce-state.cjs` for live behavior and `deep_research_strategy.md` for operator-facing instructions.

---

## 4. SOURCE FILES

### PLAYBOOK SOURCES

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page, integrated review protocol, and scenario summary |
| `../../feature_catalog/state-management/injection-inbox-provenance.md` | Matching feature catalog entry |

### IMPLEMENTATION AND RUNTIME ANCHORS

| File | Role |
|---|---|
| `.opencode/skills/system-deep-loop/deep-research/assets/deep_research_strategy.md` | Operator-facing inbox schema and legacy-import guidance |
| `.opencode/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs` | Inbox parser and provenance projection |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/deep-research-reduce-state.vitest.ts` | Unit coverage for inbox provenance output |

---

## 5. SOURCE METADATA

- Group: ITERATION EXECUTION AND STATE DISCIPLINE
- Playbook ID: DR-056
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `iteration-execution-and-state-discipline/injection-inbox-provenance.md`
- Feature catalog: `feature_catalog/state-management/injection-inbox-provenance.md`
