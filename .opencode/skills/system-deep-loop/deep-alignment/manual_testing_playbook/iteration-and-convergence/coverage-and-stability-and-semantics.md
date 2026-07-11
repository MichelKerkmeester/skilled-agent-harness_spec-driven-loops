---
title: "DAL-020 -- Coverage AND dry-run stability convergence"
description: "Verify convergence requires BOTH artifact-coverage >= threshold AND dry-run stability (never OR): full coverage with unstable findings does not converge, and stable-but-uncovered does not converge."
version: 1.0.0.0
---

# DAL-020 -- Coverage AND dry-run stability convergence

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DAL-020`.

---

## 1. OVERVIEW

This scenario validates the convergence AND-semantics for `DAL-020`. The objective is to verify that `check-convergence.cjs` reports `CONVERGED` only when BOTH artifact-coverage >= threshold AND dry-run stability hold — never on either alone. Full coverage with a recent new-finding iteration returns `CONTINUE`; a stable run whose coverage is incomplete returns `CONTINUE`.

### WHY THIS MATTERS

An OR rule would let the loop stop while large parts of the corpus were never audited (a trivially "stable" zero-signal from untouched artifacts), or while findings were still actively churning. Requiring both — mirroring deep-review's philosophy of coverage and stability as separately-necessary signals — is what makes "done" mean actually done. This is a critical-path scenario.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify CONVERGED requires coverageMet AND stability.stable, never either alone.
- Real user request: When does the audit decide it is finished?
- Prompt: `Validate deep-alignment convergence AND-semantics: CONVERGED requires coverageMet AND stability.stable, never either alone.`
- Expected execution process: Build a fixture, drive it through a coverage-met-but-unstable state (expect CONTINUE), then to a coverage-met-and-stable state (expect CONVERGED), reading the `converged = coverageMet && stability.stable` line and `state_machine_wiring.md` §4.
- Desired user-facing outcome: The user is told the run stops only when every discovered artifact has been checked AND the last N iterations found nothing new — both, not either.
- Expected signals: `checkConvergence` computes `converged = coverageMet && stability.stable`; a run with 100% coverage but a recent new-finding iteration returns `CONTINUE`; a stable-but-incompletely-covered run returns `CONTINUE`; `state_machine_wiring.md` §4 states "AND, not OR" with the rationale.
- Pass/fail posture: PASS if CONVERGED requires both signals and CONTINUE results when only one holds. FAIL if either signal alone yields CONVERGED.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so the coverage-only-met state is checked before the both-met state.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
Validate deep-alignment convergence AND-semantics: CONVERGED requires coverageMet AND stability.stable, never either alone.
### Commands
1. `bash: rg -n 'coverageMet && stability.stable|AND, never OR|converged =|computeArtifactCoverage|computeDryRunStability' .opencode/skills/system-deep-loop/deep-alignment/scripts/check-convergence.cjs`
2. `bash: D=$(mktemp -d); mkdir -p "$D/alignment/deltas"; L="sk-doc::docs::docs/"; printf '{"alignmentTarget":"fx","lanes":[{"authority":"sk-doc","artifactClass":"docs","scope":{"type":"paths","values":["docs/"]}}]}' > "$D/alignment/deep-alignment-config.json"; printf '{"lanes":[{"laneId":"%s","authority":"sk-doc","artifactClass":"docs","scope":{"type":"paths","values":["docs/"]},"artifacts":[{"path":"docs/a.md"},{"path":"docs/b.md"}]}]}' "$L" > "$D/alignment/deep-alignment-corpus.json"; printf '{"type":"iteration","laneId":"%s","artifactsChecked":2,"newFindingsRatio":1}\n{"type":"iteration","laneId":"%s","artifactsChecked":2,"newFindingsRatio":1}\n' "$L" "$L" > "$D/alignment/deep-alignment-state.jsonl"; node .opencode/skills/system-deep-loop/deep-alignment/scripts/check-convergence.cjs --spec-folder "$D" --max-iterations 10 --stability-window 2 --json; echo "$D" > /tmp/dal020.dir`
3. `bash: D=$(cat /tmp/dal020.dir); L="sk-doc::docs::docs/"; printf '{"type":"iteration","laneId":"%s","artifactsChecked":2,"newFindingsRatio":0}\n{"type":"iteration","laneId":"%s","artifactsChecked":2,"newFindingsRatio":0}\n' "$L" "$L" >> "$D/alignment/deep-alignment-state.jsonl"; node .opencode/skills/system-deep-loop/deep-alignment/scripts/check-convergence.cjs --spec-folder "$D" --max-iterations 10 --stability-window 2 --json`
### Expected
Command 2: coverage is 100% (2/2) but the last two iterations both had new findings, so `decision` is `CONTINUE` with `coverage.met:true`, `stability.stable:false`. Command 3: after two zero-new-finding iterations, `decision` is `CONVERGED` with both `coverage.met:true` and `stability.stable:true`. The source shows the `&&` (AND) combination.
### Evidence
Capture the coverage-met-but-unstable CONTINUE, the both-met CONVERGED, and the `converged = coverageMet && stability.stable` source line.
### Pass/Fail
PASS if CONVERGED requires both signals and CONTINUE results when only one holds. FAIL if the coverage-only-met state converges (an OR bug).
### Failure Triage
If command 2 returns CONVERGED, convergence is using OR instead of AND — the exact failure the design forbids. Confirm `--stability-window 2` is honored by checking `stability.window` in the JSON.
---

## 4. SOURCE FILES

### PLAYBOOK SOURCES

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page, integrated alignment protocol, and scenario summary |
| `iteration-and-convergence/` | Convergence category; `check-convergence.cjs` is exercised directly on a fixture here |

### IMPLEMENTATION AND RUNTIME ANCHORS

| File | Role |
|---|---|
| `.opencode/skills/system-deep-loop/deep-alignment/scripts/check-convergence.cjs` | `checkConvergence`, `computeArtifactCoverage`, `computeDryRunStability`, the AND combination |
| `.opencode/skills/system-deep-loop/deep-alignment/references/state_machine_wiring.md` | §4 "AND, not OR" formula and rationale |
| `.opencode/skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs` | Supplies the registry the coverage computation reads |

---

## 5. SOURCE METADATA

- Group: ITERATION AND CONVERGENCE
- Playbook ID: DAL-020
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `iteration-and-convergence/coverage-and-stability-and-semantics.md`
- Criticality: Critical-path scenario (see root §5 hard rule).
