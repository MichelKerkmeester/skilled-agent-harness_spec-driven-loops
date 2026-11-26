# Review Report — 012-deep-loop-command-offers (lineage deepseek-max-3)

> Verdict recomputed from the findings registry and the terminal-gates row: **FAIL**. The two core traceability protocols are `partial`, so the coverage gate failed at the terminal stop.

## 1. Executive Summary

- **Overall verdict:** FAIL
- **hasAdvisories:** false (the FAIL rests on the failed coverage gate, not on advisories)
- **Active findings the verdict used:** P0 = 0, P1 = 1, P2 = 4
- **Stop reason:** `maxIterationsReached` (cap 5 under `stopPolicy: max-iterations`)
- **Self-check outcomes:** no P0 candidate was raised. The one P1 (`R1-P1-001`) was rechecked at synthesis against the served Python gate and stays active. No finding was downgraded or called a false positive.
- **Review scope:** 46 files — the advisor gate and its Python copy, the stage-one lane, the fused doctor row, the degraded brief paths, both deep command assets, the hub files, the deep-loop reducer, the shared fixture and its suites, and the packet's own docs.
- **Operator review focus:** Traceability: finish the spec_code and checklist_evidence protocols. Check every REQ in spec.md against the code that implements it or the decision that records it, and every ticked task in tasks.md and every Met row in acceptance-criteria.md against evidence that really exists in the tree, including the sixth fix round (REQ-023 to REQ-034, AC-030 to AC-042, ADR-005, ADR-006).

Both core protocols were run to completion and both report `partial`:

- `spec_code`: 34 of 34 requirements mapped; REQ-011 is partial because its third hub alias is absent from the tree and only the scratch decision log records the drop.
- `checklist_evidence`: 42 of 42 acceptance rows resolved (38 `Met`, 2 `Waived`, 1 `Superseded`, 1 `Unmet`), 85 task boxes checked (84 ticked, T084 open), 26 checklist boxes checked (25 ticked, CHK-020 open for AC-040); thirteen `Met` rows carry an evidence pointer that no longer resolves.

## 2. Planning Trigger

`/speckit:plan` is required: the verdict is FAIL on a required quality gate, one P1 and four P2 findings are active, and two of them are closure-document defects the packet cannot close over.

```json
{
  "triggered": true,
  "verdict": "FAIL",
  "hasAdvisories": false,
  "activeFindings": ["R1-P1-001", "R1-P2-002", "R3-P2-003", "R4-P2-004", "R5-P2-005"],
  "remediationWorkstreams": [
    "W1: correct implementation-summary limitation 8 so it states the fallback the gate serves",
    "W2: amend REQ-011 or the hub router for the third research alias, and record the amendment as an ADR",
    "W3: repoint the thirteen Met-row evidence citations",
    "W4: extend the cross-runtime guard to the refusal vocabulary and the two shared constants"
  ],
  "specSeed": [
    "spec.md REQ-011: name the two aliases the hub carries, or restore 'autonomous research' with its out-of-domain replay recorded",
    "tasks.md T022: replace the unpassable 'prints 3' verify line with the observed count",
    "decision-record.md: add an ADR for the D8 alias amendment so the requirement and the decision agree"
  ],
  "planSeed": [
    "Rewrite implementation-summary limitation 8 from the gate's run_asked branch, not from an earlier round's behaviour",
    "Repoint AC-001 to AC-005, AC-010 to AC-013, AC-016, AC-017, AC-021 and AC-028 to the observation rows they name",
    "Add a vocabulary pair or a direct assertion for RUN_ASK_NEGATED_SOURCE and RUN_REFUSED between the two copies",
    "Assert LEAD_WINDOW and ADVISOR_PROMPT_MAX_CHARS agree across the two copies"
  ],
  "findingClasses": ["incorrect-documentation", "spec-code-mismatch", "evidence-pointer-drift", "missing-test-coverage", "duplicated-constant"],
  "affectedSurfacesSeed": [
    "implementation-summary.md limitations block",
    "spec.md REQ-011 and tasks.md T022",
    "acceptance-criteria.md verification cells",
    "command-attach.ts and skill_advisor.py shared vocabulary and constants",
    "tests/deep-loop-offer-cases.vitest.ts vocabulary guard"
  ],
  "fixCompletenessRequired": true
}
```

## 3. Active Finding Registry

| ID | Severity | Title | Dimension | File:line | Fix recommendation | Disposition |
|----|----------|-------|-----------|-----------|--------------------|-------------|
| R1-P1-001 | P1 | implementation-summary limitation 8 states the opposite of the built Python fallback | correctness | `implementation-summary.md:247` | Rewrite the limitation from `_apply_deep_loop_offer_gate`'s `run_asked` branch and drop the Python-fallback examples it names | Open, fix before closure |
| R1-P2-002 | P2 | refusal-vocabulary parity guard does not cover `RUN_ASK_NEGATED_SOURCE` | correctness | `tests/deep-loop-offer-cases.vitest.ts:62` | Add a pair or a direct assertion for the two refusal patterns | Open, advisory |
| R3-P2-003 | P2 | REQ-011 names a third hub alias the built tree does not carry, and no ADR amends the requirement text | traceability | `spec.md:223` | Amend REQ-011 to the two aliases, or restore the third and record an ADR; fix T022's verify line | Open, advisory |
| R4-P2-004 | P2 | thirteen `Met` rows cite an `implementation-summary.md` line that holds a different observation | traceability | `acceptance-criteria.md:58` | Repoint each Evidence cell to the observation row it names | Open, advisory |
| R5-P2-005 | P2 | the two cross-runtime constants are duplicated literals with no parity assertion | maintainability | `command-attach.ts:592` | Assert `LEAD_WINDOW` and `ADVISOR_PROMPT_MAX_CHARS` agree across the copies | Open, advisory |

Every active P0/P1 carries a typed claim-adjudication packet in its iteration file (`iterations/iteration-001.md`, `iteration-003.md`, `iteration-004.md`, `iteration-005.md`). This run raised no P0, so no Hunter/Skeptic/Referee replay was required.

## 4. Remediation Workstreams

**P1 first**

1. **W1 — the closure record's false limitation.** Rewrite `implementation-summary.md:247` so limitation 8 states what `_apply_deep_loop_offer_gate` does: an untyped run ask keeps its row when `asks_for_loop_run` is true, and only a stuck complaint without a typed command drops it. Either drop the "Python fallback drops the rest" sentence or record the CLI `degradedRecommendations` path as the layer it describes.

**Then the P2 advisories**

2. **W2 — the REQ-011 alias.** Amend REQ-011 and T022 to the two aliases the hub carries, and add an ADR for D8 so the decision record, not only `scratch/decisions.md`, explains the drop. If the alias is restored instead, replay it against the out-of-domain prompt first.
3. **W3 — evidence pointers.** Repoint the thirteen acceptance rows to the observation lines (`implementation-summary.md:153`, `:154`, `:155`, `:156`, `:159`) or cite the row label instead of a line number, which survives insertion above.
4. **W4 — the unguarded cross-runtime surface.** Add `RUN_ASK_NEGATED_SOURCE`/`_RUN_ASK_NEGATED_RE` and `RUN_REFUSED`/`_RUN_REFUSED_RE` to the parity guard, and assert the 400-character window and the 10,000-unit head agree across copies.

## 5. Spec Seed

- **REQ-011** must name the aliases the hub actually carries. The functional clause (K2 tops the hub on the research route) holds; the vocabulary clause does not.
- **REQ-033/AC-040** describe this rerun. This run finished both protocols and its terminal gates read `evidence: pass`, `scope: pass`, `coverage: fail`; AC-040 therefore stays `Unmet` with a concrete reason (partial protocols), not with "not run".
- **REQ-034's closure list** should name the limitation block as a whole, not limitations 6 and 7, so a newly added limitation cannot escape the same check.
- The acceptance criteria's status definition ("names evidence that was actually observed") should say that the evidence pointer must resolve, which is the property thirteen rows fail.

## 6. Plan Seed

- Rewrite limitation 8 from the gate branch at `skill_advisor.py:5348` and re-read the test at `tests/python/test_skill_advisor.py:2988` that pins the opposite.
- Repoint the thirteen acceptance Evidence cells; prefer a row label or an anchor over a line number.
- Add the refusal-pattern and constant pairs to `tests/deep-loop-offer-cases.vitest.ts`'s guard, and a case that fails when one copy's window or head changes alone.
- Amend REQ-011/T022 and add the ADR-007 entry for D8.
- After the docs land, rerun one `/deep:review` with traceability as its focus so `spec_code` and `checklist_evidence` can read `pass` and REQ-033's coverage clause can be satisfied.

## 7. Traceability Status

**Core protocols**

| Protocol | Status | Evidence | Unresolved drift |
|----------|--------|----------|------------------|
| `spec_code` | partial | `spec.md:204-247`; `results-after.json` (69 rows); `hub-router.json:34`; `command-attach.ts:274`; `reduce-state.cjs:995` | REQ-011's third alias is absent and only the scratch decision log records the drop |
| `checklist_evidence` | partial | `acceptance-criteria.md:105`; `tasks.md:291`; `implementation-summary.md:153-159` | Thirteen `Met` rows cite a line that no longer holds their observation |

**Overlay protocols**

| Protocol | Status | Evidence |
|----------|--------|----------|
| `skill_agent` | notApplicable | the packet claims no skill or agent definition |
| `agent_cross_runtime` | notApplicable | no agent mirror is named |
| `feature_catalog_code` | notApplicable | no feature-catalog entry is claimed |
| `playbook_capability` | notApplicable | no playbook entry is claimed |

**AC_COVERAGE:** advisory-shortfall. AC-040 is `Unmet` by record and this rerun's coverage gate fails; the packet's closure statement already reads `Closeable: No` for that row.

## 8. Deferred Items

- **Registry dimension attribution.** The reducer recorded every finding under `correctness` because the delta finding rows carried no `dimension` field; this report uses the iteration dimension instead. Registry-owned, not modified here.
- **`review-verdict.cjs` count race.** A verdict read during the reducer's write reported three P2 findings against the four the completed registry holds. Observed once; the final read and the closeout both see four. Recorded for the tooling owner, not raised as a finding (the script is not in this packet's review scope).
- **`dist` build.** Gitignored and absent from this checkout, so every build-freshness claim rests on the recorded probe `freshness: live` rows.
- **Frontier follow-up.** No frontier nodes exist in this run (`depthMode: default`).

## Dimension Expansion Map

- Swept or saturated directions: none.
- Completed pivots: 0. Failed pivots: 0. Audited overrides: 0.
- Pivot lineage: none; this lineage reviewed correctness, security, traceability and maintainability in fixed order.
- Remaining frontier: none recorded.

## 9. Search Ledger

- **searchCoverage:** required bug classes `gate_predicate_correctness`, `doc_code_parity`, `test_coverage`, `prompt_injection`, `shell_injection`, `policy_downgrade`, `secret_exposure`, `spec_code_drift`, `probe_regression`, `corpus_regression`, `alias_drift`, `evidence_pointer_drift`, `waiver_backing`, `checklist_count`, `test_row_claim`, `duplicated_constant`, `stale_comment`, `dead_branch`, `unreadable_complexity`; covered: all; ruled out: `probe_regression`, `corpus_regression`, `waiver_backing`, `checklist_count`, `test_row_claim`, `prompt_injection`, `shell_injection`, `policy_downgrade`, `secret_exposure`, `dead_branch`, `stale_comment`; deferred: none; blocked: none.
- **graphCoverageMode:** `graph` (seeded 47 FILE/SLICE nodes and 46 COVERS edges at init).
- **searchDebt:** none.
- **ruledOutCandidates:** probe/corpus regression; unbacked waiver; unbacked `Met` on the sixth-round rows; prompt-to-brief injection; shell injection; run-policy downgrade; dead branch; stale code comment.
- **cleanSearchProof:** `hasSearchDebt: false`.

## 10. Audit Appendix

**Convergence summary**

- Iterations: 5 of 5. Stop reason `maxIterationsReached` (`stopPolicy: max-iterations`; convergence was telemetry only).
- New-findings ratio per iteration: 1.00, 0.00, 0.17, 0.14, 0.125.
- Dimension coverage: 4 of 4 (correctness iteration 1, security 2, traceability 3 and 4, maintainability 5).
- Terminal gates at the stop: `evidence: pass` (all findings cited), `scope: pass` (all findings inside the 46-file scope), `coverage: fail` (`traceability-incomplete`).

**Coverage summary**

- 46 scope files; all four configured dimensions reviewed at least once; both core traceability protocols run.
- Findings: 1 P1 and 4 P2, all active, none resolved.

**Ruled-out claims**

- A probe, keep, negative, stage-one or corpus regression (0 command differences across the keep and negative groups, gain 5 of 5, `false_offer` 0 of 57).
- Prompt-to-brief injection, shell injection and a `run` policy on a `/deep:*` command.
- An unbacked waiver or a miscounted checklist.
- A second typed command hiding the first; the refusal lead swallowing the idiom controls.

**Sources reviewed**

`spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `implementation-summary.md`, `decision-record.md`, `scratch/decisions.md`, the probe and corpus result files, `command-attach.ts`, `explicit.ts`, `fusion.ts`, `subprocess.ts`, `skill-advisor-cli.ts`, `advisor-recommend.ts`, `render.ts`, `advisor-tool-schemas.ts`, `skill_advisor.py`, `reduce-state.cjs`, the shared fixture, the vitest and Python suites named above, both deep presentations, both deep YAMLs, both command documents, the compiled contract, `hub-router.json`, `ROUTER.md`, and the hub `SKILL.md`.

**Cross-reference appendix — core**

`spec_code`: partial. `checklist_evidence`: partial.

**Cross-reference appendix — overlay**

`skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability`: notApplicable.

Review verdict: FAIL
