---
title: "DR-058 -- Rejected-pattern cache"
description: "Verify that rejected ideas and patterns are suppressed from future focus candidates until removed or reset."
version: 1.14.0.21
---

# DR-058 -- Rejected-pattern cache

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DR-058`.

---

## 1. OVERVIEW

This scenario validates the rejected-pattern cache for `DR-058`. The objective is to verify that rejected ideas and patterns are durably suppressed from next-focus, recovery, and ideas-backed candidates.

### WHY THIS MATTERS

A loop that keeps reintroducing rejected directions wastes iterations and muddies convergence signals. Rejections need a reversible, bounded memory.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify that rejected ideas and patterns are suppressed from future focus candidates until removed or reset.
- Real user request: Make sure rejected research directions do not come back next iteration unless I explicitly clear them.
- Prompt: `Validate rejected-pattern suppression across JSONL events, loop protocol, reducer filtering, YAML candidate checks, and tests.`
- Expected execution process: Inspect JSONL event definitions, loop protocol suppression order, reducer filtering functions, YAML candidate step, and unit tests.
- Desired user-visible outcome: The user is told how a rejected pattern is remembered, matched, removed, or reset.
- Expected signals: Rejected cache is bounded to 100 entries, exact and category-compatible fuzzy matching are supported, and removal or reset re-admits candidates.
- Pass/fail posture: PASS if rejected candidates are absent from future candidate lists until removal or reset; FAIL if a rejected candidate can be dispatched again without an explicit clear.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
Validate rejected-pattern suppression across JSONL events, loop protocol, reducer filtering, YAML candidate checks, and tests.
### Commands
1. `bash: rg -n 'idea_rejected|idea_rejected_removed|idea_rejected_reset|rejected-pattern' .opencode/skills/system-deep-loop/deep-research/references/state/state_jsonl.md .opencode/skills/system-deep-loop/deep-research/references/protocol/loop_protocol.md`
2. `bash: rg -n 'deriveRejectedPatternIndex|findRejectedPatternMatch|filterRejectedIdeaCandidates|suppressedCandidates|MAX_REJECTED_PATTERNS' .opencode/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs`
3. `bash: rg -n 'step_rejected_pattern_cache|rejectedPatternIndex|suppressedCandidates|All next-focus' .opencode/commands/deep/assets/deep_research_auto.yaml`
4. `bash: rg -n 'suppresses an exact rejected|re-admits a pattern|bounded rejected-pattern|fuzzy matching' .opencode/skills/system-deep-loop/runtime/tests/unit/deep-research-reduce-state.vitest.ts`
### Expected
Rejected patterns are stored, bounded, exact/fuzzy matched, surfaced in suppressed-candidate diagnostics, and reversible through removal or reset events.
### Evidence
Capture event definitions, reducer match functions, YAML candidate-gate wording, and test case names.
### Pass/Fail
PASS if rejected candidates are filtered before dispatch and can be re-admitted only through removal or reset; FAIL if rejection is advisory text only.
### Failure Triage
Privilege reducer behavior for active suppression and `state_jsonl.md` for event names.

---

## 4. SOURCE FILES

### PLAYBOOK SOURCES

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page, integrated review protocol, and scenario summary |
| `../../feature_catalog/state-management/rejected-pattern-cache.md` | Matching feature catalog entry |

### IMPLEMENTATION AND RUNTIME ANCHORS

| File | Role |
|---|---|
| `.opencode/skills/system-deep-loop/deep-research/references/state/state_jsonl.md` | Rejected-pattern event schema |
| `.opencode/skills/system-deep-loop/deep-research/references/protocol/loop_protocol.md` | Candidate suppression order and overflow policy |
| `.opencode/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs` | Rejected-pattern index derivation and candidate filtering |
| `.opencode/commands/deep/assets/deep_research_auto.yaml` | Runtime candidate check before dispatch |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/deep-research-reduce-state.vitest.ts` | Unit coverage for exact, fuzzy, removal, and reset behavior |

---

## 5. SOURCE METADATA

- Group: ITERATION EXECUTION AND STATE DISCIPLINE
- Playbook ID: DR-058
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `iteration-execution-and-state-discipline/rejected-pattern-cache.md`
- Feature catalog: `feature_catalog/state-management/rejected-pattern-cache.md`
