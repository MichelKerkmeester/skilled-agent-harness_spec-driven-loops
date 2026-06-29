---
title: "DR-059 -- Ideas backlog lifecycle"
description: "Verify that leaf agents only observe ideas and the reducer owns promotion, ranking, and rejection suppression."
version: 1.14.0.21
---

# DR-059 -- Ideas backlog lifecycle

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DR-059`.

---

## 1. OVERVIEW

This scenario validates the ideas backlog lifecycle for `DR-059`. The objective is to verify that ideas move from observed to reducer-promoted to rejected or suppressed through explicit state events.

### WHY THIS MATTERS

Useful tangents should not vanish after one iteration, but a leaf agent should not be able to promote its own ideas into future focus without reducer review.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify that leaf agents only observe ideas and the reducer owns promotion, ranking, and rejection suppression.
- Real user request: Check that promising tangents are remembered only after enough observations, not promoted by the leaf agent directly.
- Prompt: `Validate the ideas backlog lifecycle across agent rules, JSONL docs, reducer promotion, YAML checks, and tests.`
- Expected execution process: Inspect agent write permissions, JSONL event definitions, loop protocol semantics, reducer promotion logic, YAML lifecycle step, and unit tests.
- Desired user-visible outcome: The user understands that ideas are observed first, promoted only after the threshold, and suppressed when rejected.
- Expected signals: Leaf agents may emit `idea_observed` only, `minIdeaObservations` defaults to 2, reducer emits idempotent `idea_promoted`, and `idea_rejected` suppresses promoted ideas.
- Pass/fail posture: PASS if promotion is reducer-owned and threshold-gated; FAIL if a leaf agent can write `idea_promoted` directly.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
Validate the ideas backlog lifecycle across agent rules, JSONL docs, reducer promotion, YAML checks, and tests.
### Commands
1. `bash: rg -n 'idea_observed|idea_promoted|idea_rejected|minIdeaObservations' .opencode/agents/deep-research.md .opencode/skills/deep-loop-workflows/deep-research/references/state/state_jsonl.md .opencode/skills/deep-loop-workflows/deep-research/references/protocol/loop_protocol.md`
2. `bash: rg -n 'resolveMinIdeaObservations|derivePromotedIdeas|appendIdeaPromotionEvents|idea_promoted|suppressedIdeas' .opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs`
3. `bash: rg -n 'step_ideas_backlog_lifecycle|minIdeaObservations|idea_promoted|idea_rejected' .opencode/commands/deep/assets/deep_research_auto.yaml`
4. `bash: rg -n 'promotes observed ideas|idea_promoted|suppressedIdeas|minIdeaObservations' .opencode/skills/deep-loop-runtime/tests/unit/deep-research-reduce-state.vitest.ts`
### Expected
Leaf agents emit observed-only idea events, reducer promotes after the configured threshold, and rejected ideas are suppressed from promoted ideas and candidates.
### Evidence
Capture the agent prohibition, event definitions, reducer promotion function, YAML lifecycle step, and threshold test assertions.
### Pass/Fail
PASS if observed/promoted/rejected ownership is consistent across docs, runtime, and tests; FAIL if promotion can bypass the reducer.
### Failure Triage
Privilege `.opencode/agents/deep-research.md` for leaf permissions and `reduce-state.cjs` for promotion behavior.

---

## 4. SOURCE FILES

### PLAYBOOK SOURCES

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page, integrated review protocol, and scenario summary |
| `../../feature_catalog/02--state-management/ideas-backlog-lifecycle.md` | Matching feature catalog entry |

### IMPLEMENTATION AND RUNTIME ANCHORS

| File | Role |
|---|---|
| `.opencode/agents/deep-research.md` | Leaf agent idea-event permissions |
| `.opencode/skills/deep-loop-workflows/deep-research/references/state/state_jsonl.md` | Idea event schemas |
| `.opencode/skills/deep-loop-workflows/deep-research/references/protocol/loop_protocol.md` | Ideas lifecycle and candidate rules |
| `.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs` | Promotion, ranking, and suppression implementation |
| `.opencode/commands/deep/assets/deep_research_auto.yaml` | Workflow lifecycle step and threshold reads |
| `.opencode/skills/deep-loop-runtime/tests/unit/deep-research-reduce-state.vitest.ts` | Unit coverage for promotion and rejection behavior |

---

## 5. SOURCE METADATA

- Group: ITERATION EXECUTION AND STATE DISCIPLINE
- Playbook ID: DR-059
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `03--iteration-execution-and-state-discipline/ideas-backlog-lifecycle.md`
- Feature catalog: `feature_catalog/02--state-management/ideas-backlog-lifecycle.md`
