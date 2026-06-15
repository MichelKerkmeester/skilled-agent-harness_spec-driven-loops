---
title: "DRV-032 -- Review graph convergence signals participate in legal-stop gates"
description: "Verify that graph-backed dimension coverage can block premature STOP in deep review."
---

# DRV-032 -- Review graph convergence signals participate in legal-stop gates

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DRV-032`.

---

## 1. OVERVIEW

This scenario validates graph-backed legal-stop behavior for `DRV-032`. The objective is to verify that when review stability signals nominate STOP but graph-backed dimension coverage remains below threshold, the legal-stop gates block premature STOP.

### WHY THIS MATTERS

Stable finding counts are not enough if the review graph still shows dimension gaps. Graph-backed dimension coverage protects against falsely concluding that a review is complete before all required review dimensions have meaningful coverage.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Title: Review graph convergence signals participate in legal-stop gates.
- Given: A review session with dimension coverage below threshold in the graph.
- When: Finding stability signals STOP.
- Then: Graph convergence gates block premature STOP.
- Real user request: If the review looks stable but the graph still shows missing dimension coverage, what keeps the loop from stopping too soon?
- Prompt: `Validate the graph-backed legal-stop gate and report whether blocked-stop state persists when coverage fails.`
- Expected execution process: Inspect the deep-review convergence reference for legal-stop gate behavior first, then the coverage-graph convergence handler for review `dimensionCoverage` thresholds, then fixture evidence for persisted `blocked_stop`.
- Desired user-facing outcome: The user gets a clear explanation that graph-backed dimension coverage still has veto power after stability signals look ready to stop.
- Expected signals: review convergence docs describe `blockedStop` when legal-stop gates fail. Graph convergence handler enforces review `dimensionCoverage`. Fixture evidence shows `blocked_stop` with `blockedBy: ["dimensionCoverage", ...]`.
- Pass/fail posture: PASS if graph-backed review convergence, legal-stop failure, and blocked-stop persistence line up across the review convergence reference, graph convergence handler, and fixture evidence. FAIL if stable findings can terminate the loop despite dimension-coverage failure.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level fixtures.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
Validate the graph-backed legal-stop gate and report whether blocked-stop state persists when coverage fails.
### Commands
1. `bash: rg -n 'blockedStop|dimensionCoverage|buildReviewLegalStop|graphEvents|graph-aware review convergence' .opencode/skills/deep-loop-workflows/review/references/convergence/convergence.md`
2. `bash: rg -n 'dimensionCoverage|threshold|STOP_BLOCKED|blocking' .opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts`
3. `bash: rg -n 'blocked_stop|blockedStop|dimensionCoverage' .opencode/skills/system-spec-kit/scripts/tests/fixtures/deep-loop-optimizer/sample-040-corpus.jsonl`
### Expected
Legal-stop docs map failed gate evaluation to `blockedStop`. The graph convergence handler evaluates review `dimensionCoverage`. Fixture evidence shows persisted `blocked_stop` blocked by `dimensionCoverage`.
### Evidence
Capture the review convergence legal-stop wording, the handler threshold/check for review `dimensionCoverage`, and the sample blocked-stop JSONL record naming `dimensionCoverage` in `blockedBy`.
### Pass/Fail
PASS if the review docs, graph convergence handler, and blocked-stop fixture all agree that dimension-coverage failure prevents STOP even when other signals are favorable. FAIL if dimension-coverage failure is only advisory or not persisted.
### Failure Triage
Privilege `references/convergence/convergence.md` for the review stop contract and the fixture for concrete JSONL persistence. If the handler threshold and packet-level wording differ, flag threshold drift for follow-up.
---

## 4. SOURCE FILES

### PLAYBOOK SOURCES

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page, integrated review protocol, and scenario summary |

### IMPLEMENTATION AND RUNTIME ANCHORS

| File | Role |
|---|---|
| `.opencode/skills/deep-loop-workflows/review/references/convergence/convergence.md` | Canonical review legal-stop and graph-aware convergence contract |
| `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts` | Graph convergence handler, review `dimensionCoverage` threshold and blocking behavior |
| `.opencode/skills/system-spec-kit/scripts/tests/fixtures/deep-loop-optimizer/sample-040-corpus.jsonl` | Concrete blocked-stop fixture showing `dimensionCoverage` in `blockedBy` |

---

## 5. SOURCE METADATA

- Group: CONVERGENCE AND RECOVERY
- Playbook ID: DRV-032
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `04--convergence-and-recovery/graph-convergence-review.md`
- Feature catalog status: No `feature_catalog/` package exists under `.opencode/skills/deep-loop-workflows/review/` as of 2026-04-10.
