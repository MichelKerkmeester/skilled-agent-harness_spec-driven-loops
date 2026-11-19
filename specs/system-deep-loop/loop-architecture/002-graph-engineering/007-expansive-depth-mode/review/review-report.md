# Deep Review Report: expansive-depth program logic (21c4b325b5a..f30fcdb42f6)

## 1. Executive Summary

- **Verdict: FAIL.** There is no P0 and no P1. The FAIL comes from the terminal coverage gate: `terminal-gates.cjs` records `coverage` as failed with reasonCode `coverage-too-young`. Maintainability, the third configured dimension, was first covered in iteration 3, the last iteration under the cap, so no later pass could age its coverage. Two search-debt items are open as well.
- **hasAdvisories:** false (the verdict is not PASS).
- **Active counts the verdict used:** P0 0, P1 0, P2 3, search debt 2, failed required gates `coverage`.
- **Self-check outcomes:** the adversarial self-check re-read the one P1.
  - R1-P1-001 was **downgraded to P2**. The Hunter re-read `reduce-state.cjs:1224` (`buildDimensionUniverse` starts from the four canonical dimensions) and `reduce-state.cjs:2025-2037`, and the defect is real. The Skeptic found the downgrade trigger the finding itself named: the governing command document says a node needs "one iteration per dimension in its universe, the four canonical dimensions plus any custom name" (`.skilled/commands/deep/review.md:100`), and `frontier-admit.cjs:378-381` states the same intent. The remaining issue is the contradiction with the traceability-only-when-configured stop rule (`convergence.cjs:1502-1507`), so the Referee settled on P2.
  - One `deep_review.claim_adjudication` row (`R1-P1-001 P2`) was appended through the gateway, and the registry was refreshed before the verdict.
- **Scope:** 68 files. These are the code, command YAML assets and tests under `.skilled/skills/system-deep-loop/` and `.skilled/commands/deep/` that the range added or changed. Docs, playbooks and specs were excluded.
- **Coverage honesty:** the three iterations read 17 of the 68 files, the production scripts first. About 38 test files and part of the lib tree were only sampled, so treat the test surface as unreviewed, not clean (search debt SL-007).
- **Run shape:** generation 2 of the review lineage (restart; generation 1 is archived under `review-archive/20261119T153733Z/`). 3 iterations, stop reason `maxIterationsReached`, native executor (`deep-review` agent, opus, effort high). Dimensions: correctness (1), security (2), maintainability with the overengineering and sk-code-alignment rubrics (3).
- **Operator review focus:** Review only the LOGIC the range 21c4b325b5a..f30fcdb42f6 added or changed; inspect each file with git diff 21c4b325b5a..f30fcdb42f6 -- <file>. Production scripts, lib and the two command YAML assets first, tests second. When the dimension is maintainability, also apply the overengineering rubric (abstractions, options, layers, files or fallbacks no current requirement earns, per .skilled/repo-rules/prevent-overengineering.md; name what to delete or collapse) and the sk-code-alignment rubric (the sk-code review floor, the JS/CJS/TS/test surface rules, test-what-changed, and comment hygiene: no spec paths, phase numbers or REQ/ADR/finding ids in code comments). Only cite files listed in reviewScopeFiles.

**Fix first: R3-P2-001.** Its copies have already drifted in behavior, and every later frontier change must otherwise be made three times.

## 2. Planning Trigger

`/speckit:plan` is required. The verdict is FAIL. No finding blocks on its own; the FAIL is the coverage gate plus open search debt, so the plan should pair the three P2 fixes with a follow-up review pass over the deferred surfaces.

```json
{
  "label": "Planning Packet",
  "triggered": true,
  "verdict": "FAIL",
  "hasAdvisories": false,
  "activeFindings": [
    {"id": "R1-P1-001", "severity": "P2", "dimension": "correctness", "file": ".skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1224", "findingClass": "cross-consumer contract mismatch"},
    {"id": "R2-P2-001", "severity": "P2", "dimension": "security", "file": ".skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3712", "findingClass": "input normalization gap at a trust boundary"},
    {"id": "R3-P2-001", "severity": "P2", "dimension": "maintainability", "file": ".skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1974", "findingClass": "repeated logic that behaves differently; parallel implementations of one owned contract"}
  ],
  "remediationWorkstreams": ["WS1 one frontier module for node statuses, the store reader and the depth-band budget (R3-P2-001)", "WS2 decide whether an expansive node's dimension universe honors a configured subset (R1-P1-001)", "WS3 collapse line breaks in the research topic the way focus and target already are (R2-P2-001)", "WS4 follow-up review of the deferred surfaces (SL-005, SL-007)"],
  "specSeed": ["Remediation packet as a child of 007-expansive-depth-mode covering WS1-WS3, with WS4 as a scoped /deep:review"],
  "planSeed": ["Extract the frontier node vocabulary, store reader and band budget into runtime/lib/deep-loop/ and import it from both reducers and fanout-merge", "Normalize the research topic in fanout-run.cjs with the focus and target rule", "Amend review.md or buildDimensionUniverse so the node universe and the stop rule agree on a configured subset"],
  "findingClasses": ["cross-consumer contract mismatch", "input normalization gap at a trust boundary", "repeated logic that behaves differently; parallel implementations of one owned contract"],
  "affectedSurfacesSeed": [".skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs", ".skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs", ".skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs", ".skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs", ".skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs", ".skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs", ".skilled/commands/deep/assets/deep-review.yaml", ".skilled/commands/deep/assets/deep-research.yaml"],
  "fixCompletenessRequired": false
}
```

## 3. Active Finding Registry

### P2

| ID | Title | Dimension | file:line | Evidence | Impact | Fix | Disposition | findingClass | scopeProof | affectedSurfaceHints |
|---|---|---|---|---|---|---|---|---|---|---|
| R1-P1-001 | Expansive review frontier requires and dispatches dimensions the configured reviewDimensions excluded | correctness | `runtime/scripts/reduce-state.cjs:1224` | `buildDimensionUniverse` seeds the four canonical names; a node is answered only when all are covered (`:2025`) and `nextDimension` picks an uncovered one (`:2037`); `deep-review.yaml:1169` dispatches it; `frontier-admit.cjs:381` sizes the budget from it. `convergence.cjs:1502-1507` says an omitted traceability is never reviewed | An expansive run configured without traceability still spends a traceability iteration per node, and `frontier_drained` cannot form before it | Amend `review.md:100` to say a configured subset narrows the universe and make `buildDimensionUniverse` honor it, or state the rule in the stop logic | Downgraded P1 to P2 by the self-check (documented intent) | cross-consumer contract mismatch | All cited lines are added in the range | reduce-state.cjs, frontier-admit.cjs, deep-review.yaml, convergence.cjs |
| R2-P2-001 | Research topic read from `--research-topic-file` keeps its line breaks and can forge lineage binding lines | security | `runtime/scripts/fanout-run.cjs:3712` | Focus and target are collapsed (`:238`, `:266`); the topic is only trimmed and lands at `:1812` above the `config.*` binding lines | Operator text with a line break adds a forged binding line to every lineage prompt. No privilege boundary is crossed, since the operator owns the text | Apply the focus and target normalization to the topic | Active | input normalization gap at a trust boundary | `readTextFileFlags` and the file flag were added in the range | fanout-run.cjs, deep-research.yaml |
| R3-P2-001 | Frontier node vocabulary and depth-band budget are re-implemented in each consumer and have already drifted | maintainability | `runtime/scripts/reduce-state.cjs:1974` | `frontier-admit.cjs` exports `NODE_STATUSES` (`:77`) and `readNodeStore` (`:265`), yet status lists sit in `runtime/scripts/reduce-state.cjs:29`, `deep-research/scripts/reduce-state.cjs:2451`, `fanout-merge.cjs:753`, store readers at `:1917` and `:2439`, and band budgets at `:1974` and `:2531`; only the research copy sets `closedAtIteration` (`:2560`) | Every frontier change must be made in each copy, and the copies already disagree | Move them into one module under `runtime/lib/deep-loop/`; `frontier-admit.cjs` cannot own them because it requires `reduce-state.cjs` (`:381`) | Active | repeated logic that behaves differently | All copies are added in the range | both reducers, fanout-merge.cjs, frontier-admit.cjs |

## 4. Remediation Workstreams

1. **P0:** none.
2. **P1:** none.
3. **P2 advisories:** WS1 R3-P2-001 (shared frontier module), WS2 R1-P1-001 (dimension universe vs stop rule), WS3 R2-P2-001 (topic normalization).
4. **Coverage:** WS4, a scoped follow-up review over the deferred files and the test surface.

## 5. Spec Seed

- A remediation child under `007-expansive-depth-mode` for WS1-WS3.
- A decision on whether `reviewDimensions` narrows an expansive node's universe, recorded in the parent decision record.

## 6. Plan Seed

- Extract the frontier node statuses, the store reader and the depth-band budget into one `runtime/lib/deep-loop/` module, with a test that both reducers close a budget band the same way.
- Normalize the research topic in `fanout-run.cjs` with the same rule as focus and target, with a test that a line break cannot add a binding line.
- Settle R1-P1-001 one way, then align `review.md:100`, `buildDimensionUniverse` and `reviewDimensionCount`.
- Run `/deep:review` over the deferred surfaces with a budget that leaves at least one pass after the last new dimension.

## 7. Traceability Status

- Traceability was not a configured dimension for this run, so `convergence.cjs` owes no core protocol at stop, and none was run.
- **Core Protocols:** `spec_code` and `checklist_evidence` not run (not configured).
- **Overlay Protocols:** not run.
- `AC_COVERAGE`: exempt, because the target type is `files`, not a spec folder.

## 8. Deferred Items

- SL-005, unreviewed scope: iteration 1 deferred `fanout-run.cjs`, `upsert.cjs`, `dispatch-iteration.cjs` and `verify-iteration.cjs` for budget. Iteration 2 read them under security only, so correctness on them stays open.
- SL-007, test coverage: about 38 test files (about 10k added lines) were sampled, not reviewed. Test-what-changed was not judged.

## Dimension Expansion Map

- Completed pivots: 0. Failed pivots: 0. Audited overrides: 0.
- Saturated directions: none. Remaining frontier: none recorded (depth mode default).

## 9. Search Ledger

- `searchCoverage.graphCoverageMode`: `graphless_fallback`.
- `candidateCoverage.covered`: `contract_mismatch`, `duplicated_logic`, `input_validation`.
- `ruledOutCandidates`: 15, among them shell injection through the frontier node id, path traversal through proposal scope, control characters in proposals, regex injection in the research reducer, and the duplicated inline `--extend` scripts.
- `cleanSearchProof`: 15 rows.
- `searchDebt`: SL-005 and SL-007, so hasSearchDebt: true. Debt is not the only reason for the verdict, since the coverage gate also failed.

## 10. Audit Appendix

- **Convergence:** iteration 1 CONTINUE (noStopCandidate), iteration 2 CONTINUE (noStopCandidate), after iteration 3 STOP `maxIterationsReached` with `blockedBy` `dimensionCoverageGate`, `candidateCoverageGate` and `graphlessFallbackGate` recorded as evidence. newFindingsRatio: 1.0, 0.17, 0.14.
- **Coverage:** correctness, security and maintainability each covered once; the terminal coverage gate failed as too young.
- **Floor:** `antiConvergence.minIterations` 3, read by `convergence.cjs` as `minIterations: 3`.
- **Sources reviewed:** 17 of 68 scope files, listed in the iteration records' `filesReviewed`.
- **Route proof:** every iteration record carries `target_agent: "deep-review"`, the resolved route, `agent_definition_loaded: true` and `mode: "review"`, and `verify-iteration.cjs` passed all three.

### Core Protocols

Not run: traceability was not configured.

### Overlay Protocols

Not run.

### Workflow deviations recorded by the conductor

- The dimension pair the operator asked for (overengineering plus sk-code-alignment) ran as rubrics inside the maintainability pass, through the review focus. The loop dispatches one dimension per iteration, so this was the operator's stated fallback.
- `phase_save` (`generate-context.js`) was not run, because the operator asked for a commit of the review artifacts only, and the save writes outside `review/`.
- The iteration prompt was handed to each leaf as the path to the rendered prompt pack, not inlined.
