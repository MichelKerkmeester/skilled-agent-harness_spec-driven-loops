# Deep Review Report - 012-deep-loop-command-offers

Lineage: `deepseek-max-1` (fan-out lineage, generation 3, session `fanout-deepseek-max-1-1795511183570-92w0ez`)
Review target: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers` (spec-folder)
Iterations: 5 of 5 | Stop reason: `maxIterationsReached`

---

## 1. Executive Summary

**Overall verdict: FAIL**

- `hasAdvisories`: false. The verdict is FAIL because a required quality gate failed at the terminal stop, not because an advisory P2 exists on its own.
- P0/P1/P2 counts the verdict used: **P0=0, P1=0, P2=3**.
- Failed required gates at the terminal stop: **`coverage`** (`reasonCode: coverage-too-young`). Evidence and scope both pass (`all-findings-cited`).
- Self-check outcomes: no P0 or P1 finding existed to replay, so the adversarial self-check made no severity change. The three P2 findings below are the registry's active set unchanged.
- Review scope summary: 46 files in the pre-bound scope file, covering the advisor offer gate in TypeScript and Python, the handler and render layers, the shared 203-case fixture, the reducer that consumes review findings, and the packet's own docs. Five iterations covered correctness, security, traceability (`spec_code`), traceability (`checklist_evidence`) and maintainability.
- Operator review focus: Traceability: finish the spec_code and checklist_evidence protocols. Check every REQ in spec.md against the code that implements it or the decision that records it, and every ticked task in tasks.md and every Met row in acceptance-criteria.md against evidence that really exists in the tree, including the sixth fix round (REQ-023 to REQ-034, AC-030 to AC-042, ADR-005, ADR-006).

Why FAIL rather than PASS with advisories: the coverage terminal gate requires a stabilization pass after the last dimension changes coverage (`coverageAge >= 1`). Maintainability, the fourth dimension, could only be covered in iteration 5, the iteration cap. The gate therefore read `coverage-too-young` at the stop and no further iteration was available under `maxIterations=5`. The finding set itself is P2-only: the sixth-round behavior is implemented, and the three P2s are two documentation/guard gaps and one guard-coverage risk.

---

## 2. Planning Trigger

`/speckit:plan` is **required**: the verdict is FAIL and one required gate failed at the stop, so remediation must be planned rather than shipped as advisory.

```json
{
  "triggered": true,
  "verdict": "FAIL",
  "hasAdvisories": false,
  "activeFindings": [
    {"id": "R1-P2-001", "severity": "P2", "title": "The drift guard's per-entry fixture rule skips two of the five lists REQ-031 names", "file": ".skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:206", "dimension": "correctness", "findingClass": "missing-test-coverage"},
    {"id": "R4-P2-001", "severity": "P2", "title": "The release changelog still quotes the fifth-round advisor suite count", "file": ".skilled/changelog/skilled/v4.2.0.0.md:759", "dimension": "traceability", "findingClass": "doc-code-drift"},
    {"id": "R5-P2-001", "severity": "P2", "title": "The drift guard cannot see the sixth round's highest-churn vocabulary: the refusal-lead alternation is inline in both copies", "file": ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:580", "dimension": "traceability", "findingClass": "pattern-drift-risk"}
  ],
  "remediationWorkstreams": [
    {"id": "WS-1", "priority": 1, "gate": "coverage", "action": "Run one stabilization iteration after the last dimension changes coverage, or raise maxIterations above the dimension count, so the coverage terminal gate can pass."},
    {"id": "WS-2", "priority": 2, "finding": "R1-P2-001", "action": "Extend the per-entry fixture rule to every compared vocabulary list, starting with LOOP_ARTIFACT_NOUNS and PAST_RUN_READ_VERBS, or narrow REQ-031 and AC-038 to the lists actually guarded."},
    {"id": "WS-3", "priority": 2, "finding": "R4-P2-001", "action": "Refresh the v4.2.0.0 tests table's advisor suite row to the sixth-round count (184 files, 3,029 passed, 203 fixture cases), or state that the row snapshots the fifth round."},
    {"id": "WS-4", "priority": 2, "finding": "R5-P2-001", "action": "Export the refusal-lead words as a list in both copies and add the pair to the drift guard, as the command-decline and command-ask leads already are."}
  ],
  "specSeed": [
    "REQ-031 should scope its 'every list entry has a fixture case' clause to the lists the guard iterates, or the guard should iterate every compared list.",
    "REQ-022's 'quotes the final suite count' clause should name which round's count the release table carries.",
    "A new REQ should state the coverage-stabilization requirement so a max-iterations stop at the last dimension is expected rather than a gate failure."
  ],
  "planSeed": [
    "Add a drift-guard iteration over LOOP_ARTIFACT_NOUNS and PAST_RUN_READ_VERBS fixtures.",
    "Export RUN_ASK_NEGATED_SOURCE's word alternation and add its parity pair.",
    "Update the v4.2.0.0 tests table row and AC-029's cited count, or label the row as the fifth-round snapshot.",
    "Add one confirmation iteration or raise the cap when four dimensions are configured."
  ],
  "findingClasses": ["missing-test-coverage", "doc-code-drift", "pattern-drift-risk"],
  "affectedSurfacesSeed": [
    ".skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts",
    ".skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json",
    ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts",
    ".skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py",
    ".skilled/changelog/skilled/v4.2.0.0.md"
  ],
  "fixCompletenessRequired": true
}
```

---

## 3. Active Finding Registry

| ID | Severity | Title | Dimension | File:line | Evidence | Impact | Fix recommendation | Disposition | Finding class | Scope proof | Affected surface hints |
|---|---|---|---|---|---|---|---|---|---|---|---|
| R1-P2-001 | P2 | The drift guard's per-entry fixture rule skips two of the five lists REQ-031 names | correctness | .skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:206 | Iteration 001 read of the guard's six per-entry rules and eleven parity pairs | A list entry could be added to both copies with no fixture exercising it | Iterate every compared list, or narrow REQ-031 and AC-038 | active | missing-test-coverage | .skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:226 | command-attach.ts LOOP_ARTIFACT_NOUNS (:809) and PAST_RUN_READ_VERBS (:646); skill_advisor.py `_LOOP_ARTIFACT_NOUN_LIST`, `_PAST_RUN_READ_VERB_LIST` |
| R4-P2-001 | P2 | The release changelog still quotes the fifth-round advisor suite count | traceability | .skilled/changelog/skilled/v4.2.0.0.md:759 | Iteration 004 read of the release test table against the sixth-round verification rows | A reader sees 2,696 while the tree records 3,029 | Refresh the row or label it as the fifth-round snapshot | active | doc-code-drift | .skilled/changelog/skilled/v4.2.0.0.md:759 | acceptance-criteria.md AC-029 (:86), implementation-summary.md:166, AC-042 (:99) |
| R5-P2-001 | P2 | The drift guard cannot see the sixth round's highest-churn vocabulary: the refusal-lead alternation is inline in both copies | traceability (reducer-derived; raised under maintainability) | .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:580 | Iteration 005 read of the exported lists against the inline `RUN_ASK_NEGATED_SOURCE` | A one-sided refusal-verb edit passes both suites | Export the alternation as a list and add its parity pair | active | pattern-drift-risk | .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:580 | skill_advisor.py `_RUN_ASK_NEGATED_RE` (:4868); deep-loop-offer-cases.vitest.ts:61 |

---

## 4. Remediation Workstreams

### P0
None.

### P1
None.

### P2 advisories (ordered)
1. **WS-1 - coverage stabilization (gate, not a finding).** The terminal coverage gate failed at the stop because the fourth dimension was first covered in the cap iteration. Plan one extra iteration (or `--extend=1`) before closing the packet; no code change is required for the findings themselves.
2. **WS-2 - R1-P2-001.** Make the drift guard's per-entry rule iterate every list in `VOCABULARY_PAIRS`, or amend REQ-031 and AC-038 to name only the iterated lists.
3. **WS-3 - R4-P2-001.** Refresh the changelog's advisor suite row to the tree's final count, or state that the row snapshots the fifth round.
4. **WS-4 - R5-P2-001.** Export the refusal-lead word alternation in both copies and add the pair to the drift guard.

---

## 5. Spec Seed

- REQ-031: scope the "every list entry has a fixture case" clause to the lists the guard actually iterates, or extend the guard to all compared lists.
- REQ-022 / AC-029: say which round's suite count the v4.2.0.0 tests table records.
- REQ-033: name the coverage-stabilization pass the terminal gate requires, so a max-iterations stop on the last dimension is a planned state rather than a surprise FAIL.
- ADR-006: the decision is implemented and pinned; no change requested.

---

## 6. Plan Seed

1. Extend `deep-loop-offer-cases.vitest.ts` to iterate `LOOP_ARTIFACT_NOUNS` and `PAST_RUN_READ_VERBS` entries against fixture cases, adding cases for any entry that lacks one.
2. Export the refusal-lead alternation from `command-attach.ts` and mirror it as a named Python tuple; add the pair to `VOCABULARY_PAIRS`.
3. Update `.skilled/changelog/skilled/v4.2.0.0.md:759` to the sixth-round count and adjust AC-029's citation, or label the row as the fifth-round snapshot.
4. When closing this packet, run `/deep:review` with one extra iteration so the coverage gate records a stabilization pass.

---

## 7. Traceability Status

### State limitations recorded at synthesis
- **Convergence telemetry gap (passes 3 to 5).** Under `stopPolicy: max-iterations`, convergence is telemetry until the cap. The executor recorded a `graph_convergence_evaluated` row for the pass before iteration 1 and the pass before iteration 2, and for the terminal pass; passes 3 to 5 ran without one. The iteration records, deltas and reducer outputs are complete; only the per-pass graph telemetry is thin.
- **Coverage graph repair.** The first `step_graph_upsert` calls after each iteration passed empty canonical node/edge sets, so the graph held the seed nodes and the finding nodes but no DIMENSION-to-FILE COVERS edges; at the stop it read 0% dimension coverage (45 gaps) and `STOP_BLOCKED`. The graph was then rebuilt from each iteration record through `upsert.cjs`, and a read-only convergence pass read 100% coverage, `STOP_ALLOWED`, score 1. The terminal evidence/scope/coverage gates and the verdict are computed from the registry and state log, so they did not read the repaired graph and are unchanged: verdict FAIL, failed gate `coverage` (`coverage-too-young`).
- **Superseded graph row.** The terminal graph row first appended after synthesis carried the pre-repair signals; the repaired row with the same `iteration-6` scope was appended after it and is the one the reducer's graph summary reflects.
- **No continuity save.** The lineage may not run `generate-context.js`, so packet continuity was not written from this lineage; the fan-out root owns that step.

### Core protocols
| Protocol | Status | Evidence | Drift |
|---|---|---|---|
| `spec_code` | pass | .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:580, .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:428, .skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:2 | REQ-031's per-entry half is the only REQ-level drift (R1-P2-001); REQ-033 is satisfied by this run; all other REQ-023 to REQ-034 rows map to a line or a decision. |
| `checklist_evidence` | pass | specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:291, specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:87 | T084 and AC-040 remain honestly open/unmet; all other ticked sixth-round tasks and Met rows have a real tree surface; Verification Summary arithmetic (12 P0/11, 13 P1, 1 P2) matches. |

### Overlay protocols
| Protocol | Status | Note |
|---|---|---|
| `skill_agent` | notApplicable | The target is a spec packet plus runtime code; no skill contract changed in this round. |
| `agent_cross_runtime` | notApplicable | No agent definition changed. |
| `feature_catalog_code` | notApplicable | The round touched no feature catalog entry. |
| `playbook_capability` | notApplicable | The round touched no playbook. |

### AC_COVERAGE
- `AC_COVERAGE`: **not assessed as a signal in this lineage**. `acceptance-criteria.md` exists, but the lifecycle gate needs `implementation-summary.md` at in-progress or later and this runner did not execute the validator. The packet's own AC-040 is `Unmet` and T084 is unticked, which this run is the missing rerun for.

### Resource Map Coverage Gate
- `resource-map.md` is not present at init (`resource_map_present: false`), so the coverage gate is skipped, per the workflow's conditional section rule.

---

## 8. Deferred Items

- The published head scores in REQ-027 (sk-code 0.8754, sk-doc 0.82, hub 0.8763 on the keep case) were not re-measured; this lineage may not run the advisor. They remain the packet's measurement.
- The suite and Python run counts (184 files / 3,029 passed; `pass=136`) are the packet's recorded numbers, not re-executed here.
- R5-P2-001's reducer-derived dimension is `traceability` while the iteration raised it under maintainability; the difference is a reducer projection artifact, not a second finding.
- No frontier nodes exist (default depth mode), so there is no exhausted or blocked frontier work to list.

---

## Dimension Expansion Map

- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept directions: none; `convergenceMode` is default, not divergent.
- Remaining frontier: none recorded (depth mode default).

---

## 9. Search Ledger

- `searchCoverage`: required bug classes none, covered none, ruledOut none, deferred none, blocked none, `graphCoverageMode` null.
- `candidateCoverage`: empty.
- `searchDebt`: empty; `hasSearchDebt: false`.
- `ruledOutCandidates`: empty.
- `cleanSearchProof`: empty.

*No search-depth state captured (legacy v1 record).* The five iterations each record their ruled-out directions in their own narrative and in `deltas/iter-00N.jsonl`.

---

## 10. Audit Appendix

### Convergence summary
- Stop reason: `maxIterationsReached` (iteration count 5 = `maxIterations` 5), computed by `convergence.cjs`; `stopPolicy` was `max-iterations`, so convergence was telemetry until the cap.
- Terminal gates: evidence `pass` (`all-findings-cited`), scope `pass` (`all-findings-in-scope`), coverage `fail` (`coverage-too-young`). This failed gate is why the verdict is FAIL.
- Loop counters at the stop: stuck 0, consecutive failures 0.

### Coverage summary
- correctness, security, traceability, maintainability: all four covered.
- `spec_code` and `checklist_evidence`: both executed and passing as protocol rows, with the REQ-031 caveat carried as R1-P2-001.
- Files read across iterations: 46-file scope sampled on every iteration; the gate, handler, render, fixture, reducer and closure docs were read directly.

### Ruled-out claims
- Quadratic prefix scan on long prompts (REQ-030): bounded 400-character windows in both copies.
- ReDoS or command injection in the new refusal grammar: bounded quantifiers, argv arrays, prompt on stdin.
- Missing REQ-025 or REQ-026 Python parity: typed run rows and TS-only deferred cues are as documented.
- Verification Summary count mismatch: arithmetic matches the ticked boxes.
- Comment-hygiene violation in the sixth-round code: none found.

### Sources reviewed
- Iteration files `iterations/iteration-001.md` to `iteration-005.md` and their `deltas/iter-001.jsonl` to `iter-005.jsonl`.
- Registry `deep-review-findings-registry.json` (reducer-owned), dashboard `deep-review-dashboard.md`, strategy `deep-review-strategy.md`.
- The 46 paths in `review-scope-files.txt`, plus `decision-record.md` ADR-005 and ADR-006.

### Core protocols
- `spec_code`: see §7.
- `checklist_evidence`: see §7.

### Overlay protocols
- All four overlay protocols were not applicable to this target; each is named in §7 rather than left blank.

---

Review verdict: FAIL
