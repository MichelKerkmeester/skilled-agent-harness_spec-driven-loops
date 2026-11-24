# Review Report - deepseek-max-1

**Target**: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers` (spec-folder, Level 2)
**Lineage**: `fanout-deepseek-max-1-1795514074741-gl47kr`, generation 4, lineageMode `new`, parent `2026-11-24T09:54:34.000Z`
**Iterations**: 5 of 5 | **Stop reason**: `maxIterationsReached`
**Verdict**: **FAIL** | hasAdvisories: false | Active findings: P0=0 P1=0 P2=6
**Terminal gates**: evidence `pass`, scope `pass`, coverage `fail` (`traceability-incomplete`)

---

## 1. Executive Summary

**Overall verdict: FAIL.** The failure is a required quality gate, not a behaviour defect: no P0 or P1 finding is active, and six P2 findings remain. The coverage gate fails because the `checklist_evidence` core protocol could not be closed to `pass`: four `Met` acceptance rows carry evidence that does not exist as recorded, and two closure-doc state blocks are stale. The verdict is the one `review-verdict.cjs` derives from the registry and the terminal-gates row (`activeP0=0`, `activeP1=0`, `activeP2=6`, failed gate `coverage`), and it overrides the per-iteration self-reports, which read PASS because each iteration raised only P2 findings.

**P0/P1/P2 counts**: 0 / 0 / 6, the counts the verdict used.

**Self-check outcomes**: no P0 or P1 finding was raised, so the adversarial self-check and the claim-adjudication record are empty by construction. Every P2 was read against its cited line; the two count findings and the pointer finding were reconfirmed by reading the target files, not by restating an earlier iteration.

**Review scope**: 46 files from `review-scope-files.txt`, covering the advisor gate (`command-attach.ts`, `skill_advisor.py`), the scorer lanes (`explicit.ts`, `fusion.ts`), the render and handler layers, the two command documents and presentation assets, the shared fixture and the gate tests, the deep-loop reducer and closure scripts, and the packet's six canonical docs plus packet 013's summary.

**Operator review focus**: Traceability: finish the spec_code and checklist_evidence protocols. Check every REQ in spec.md against the code that implements it or the decision that records it, and every ticked task in tasks.md and every Met row in acceptance-criteria.md against evidence that really exists in the tree, including the sixth fix round (REQ-023 to REQ-034, AC-030 to AC-042, ADR-005, ADR-006).

**Dimension coverage**: correctness, security, traceability and maintainability each have a full iteration: traceability in iterations 1, 2 and 4; correctness in 3; maintainability and security in 5.

---

## 2. Planning Trigger

`/speckit:plan` is **required**: the run stopped FAIL on the coverage gate with six active P2 findings.

```json
{
  "triggered": true,
  "verdict": "FAIL",
  "hasAdvisories": false,
  "activeFindings": [
    "iter1-P2-fixture-count",
    "iter1-P2-req006-test-file",
    "iter1-P2-ac012-req-link",
    "iter2-P2-suite-counts",
    "iter4-P2-ac014-evidence-pointer",
    "iter5-P2-continuity-metadata"
  ],
  "remediationWorkstreams": [
    "W1 Closing-doc counts",
    "W2 Acceptance-row links and pointers",
    "W3 Closure-doc continuity metadata",
    "W4 Rerun the traceability review after the fixes"
  ],
  "specSeed": [
    "REQ-006: name the test file that holds the loop-ask and depth-word cases, or record the relocation in the requirement",
    "No new requirement; the other fixes are acceptance-row and continuity corrections"
  ],
  "planSeed": [
    "Correct the suite/fixture counts in AC-030, AC-037 and AC-042 to the seventh-round run, and name which run is final",
    "Repoint AC-014 to the completed-packet message line and correct AC-012's requirement link",
    "Populate decision-record.md's continuity block and refresh implementation-summary.md's block after the seventh round",
    "Rerun this review with the same focus so AC-040 and CHK-020 can close"
  ],
  "findingClasses": {
    "instance-only": [
      "iter1-P2-req006-test-file",
      "iter1-P2-ac012-req-link",
      "iter4-P2-ac014-evidence-pointer",
      "iter5-P2-continuity-metadata"
    ],
    "matrix/evidence": [
      "iter1-P2-fixture-count",
      "iter2-P2-suite-counts"
    ]
  },
  "affectedSurfacesSeed": [
    "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md",
    "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md",
    "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md",
    "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md",
    "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/implementation-summary.md",
    ".skilled/changelog/skilled/v4.2.0.0.md",
    ".skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json"
  ],
  "fixCompletenessRequired": true
}
```

---

## 3. Active Finding Registry

<!-- MACHINE-OWNED: START -->
| ID | Severity | Title | Dimension | File:line | Disposition |
|----|----------|-------|-----------|-----------|-------------|
| `iter1-P2-fixture-count` | P2 | AC-030, AC-037 and AC-042 quote `cases=203` while the shared fixture holds 248 cases | traceability | `acceptance-criteria.md:87` | active |
| `iter1-P2-req006-test-file` | P2 | REQ-006 names a test file that does not hold the loop-ask and depth-word cases it describes | traceability | `spec.md:213` | active |
| `iter1-P2-ac012-req-link` | P2 | AC-012 is linked to REQ-007 while its criterion tests the corpus recapture | traceability | `acceptance-criteria.md:69` | active |
| `iter2-P2-suite-counts` | P2 | The closure docs disagree on the final advisor suite counts | traceability | `tasks.md:163` | active |
| `iter4-P2-ac014-evidence-pointer` | P2 | AC-014 cites a config field where its completed-message clause is checked at a different line | traceability | `acceptance-criteria.md:71` | active |
| `iter5-P2-continuity-metadata` | P2 | The decision record continuity block is still template scaffold and the implementation summary continuity is one round behind | maintainability | `decision-record.md:11` | active |
<!-- MACHINE-OWNED: END -->

Per-finding detail:

1. **`iter1-P2-fixture-count`** (`acceptance-criteria.md:87`): the Python parity test prints `cases={len(cases)}` over `tests/fixtures/deep-loop-offer-cases.json`, which holds 248 cases; the three Met rows say 203, the count before the seventh-round commit `7b0660c9b6e` added 45 rows. Fix: state 248 or the seventh-round number, and name the run. findingClass `matrix/evidence`; scopeProof: fixture census plus the two git revisions; affected surfaces the three rows and the fixture.
2. **`iter1-P2-req006-test-file`** (`spec.md:213`): REQ-006 says `command-attach.vitest.ts` holds the loop-ask and depth-word cases; that file holds three unrelated describe blocks, and the cases live in `command-attach-guards.vitest.ts:530-540` and its loop-ask groups. AC-009 already records the relocation and still reads `Met`. findingClass `instance-only`.
3. **`iter1-P2-ac012-req-link`** (`acceptance-criteria.md:69`): the row is linked to REQ-007 but its Given/When/Then tests the corpus recapture. AC-011 already closes REQ-007's three clauses. findingClass `instance-only`.
4. **`iter2-P2-suite-counts`** (`tasks.md:163`, refines `iter1-P2-fixture-count`): T081 and AC-042 record 3,029 passed with `cases=203`; T087 and the changelog record 3,126 passed. Both call their run final. findingClass `matrix/evidence`.
5. **`iter4-P2-ac014-evidence-pointer`** (`acceptance-criteria.md:71`): the row's completed-message clause is at `deep-research.yaml:663`, but its Evidence cell cites `:68`, the `lineage_mode` field. findingClass `instance-only`.
6. **`iter5-P2-continuity-metadata`** (`decision-record.md:11`): the decision record still holds `template-author` / `Initialized decision record template` / an all-zero fingerprint / `completion_pct: 0`; the implementation summary's block records the pre-fix FAIL review as its last action. findingClass `instance-only`.

---

## 4. Remediation Workstreams

**W1 - Closing-doc counts (P2: `iter1-P2-fixture-count`, `iter2-P2-suite-counts`).**
Reconcile AC-030, AC-037, AC-042 and T081 with the seventh-round run: 184 files, 3,126 passed, 4 skipped, 0 failed; `PY pass=136, fail=0`; 248 fixture cases. State which run is the final one, and update the changelog only if it is not the seventh-round run. Do not rewrite the historical sixth-round rows (AC-028, T059-T061): they are accurate for their round.

**W2 - Acceptance-row links and pointers (P2: `iter1-P2-req006-test-file`, `iter1-P2-ac012-req-link`, `iter4-P2-ac014-evidence-pointer`).**
Name `command-attach-guards.vitest.ts` in REQ-006 or record the relocation as an ADR; relink AC-012 to its real requirement (REQ-012 or REQ-021) or rewrite its criterion to REQ-007's compiled-contract clause; repoint AC-014's Evidence cell to `deep-research.yaml:663`.

**W3 - Closure-doc continuity (P2: `iter5-P2-continuity-metadata`).**
Populate `decision-record.md`'s `_memory.continuity` block from the packet's real state, and refresh `implementation-summary.md`'s block after the seventh round. Use `/speckit:save` or `generate-context.js`; hand-editing the fingerprint is not the repair.

**W4 - Rerun (AC-040 / CHK-020).**
After W1 to W3, rerun `/deep:review` on this packet with traceability as its focus. AC-040 and CHK-020 can close only when that rerun's terminal gates read evidence, scope and coverage pass.

---

## 5. Spec Seed

- **REQ-006**: replace "`command-attach.vitest.ts` holds a passing case for each loop-ask clause and a passing `undefined` case for each depth word" with the file that actually holds them, or state that the cases moved and name AC-009.
- **REQ-012 / AC-019**: no change; ADR-001 already records the supersession of the near-miss count and the ID framing.
- **REQ-011**: no change; ADR-007 records the alias amendment and AC-043 owns it.
- **No new requirement.** The remaining five findings are corrections to existing rows and state blocks, not missing behaviour.

---

## 6. Plan Seed

- T-New-1: correct the three count cells and T081; verify with `node -e` over the fixture and a read of T087 and `v4.2.0.0.md:759`.
- T-New-2: fix the three acceptance-row links/pointers; verify each cell resolves to a line holding its observation.
- T-New-3: refresh both closure docs' continuity blocks through the continuity writer; verify the frontmatter carries a non-zero fingerprint and a current `last_updated_at`.
- T-New-4: rerun the deep review with the same focus; verify terminal gates `evidence`, `scope`, `coverage` all pass and AC-040 reads `Met`.

---

## 7. Traceability Status

### Core Protocols

| Protocol | Level | Status | Evidence | Unresolved drift |
|----------|-------|--------|----------|------------------|
| `spec_code` | core | **pass** | All 34 REQ rows checked: REQ-001 to REQ-012 (iteration 1), REQ-013 to REQ-022 (iteration 2), REQ-023 to REQ-034 (iteration 3), closure band re-read (iteration 4). The 69-probe file, the shared fixture and both gate copies were read. | None. The remaining defects are in the closure records that describe the implementation, not in the implementation. |
| `checklist_evidence` | core | **partial** (gating failure) | All 43 acceptance rows read: 39 `Met`, 2 `Waived`, 1 `Superseded`, 1 `Unmet`. The tasks.md Verification Summary matches its boxes (12 P0 with CHK-020 open, 13 P1, 1 P2); 87 T-tasks with 86 ticked. | Four `Met` rows carry evidence that does not hold as recorded: AC-030/AC-037/AC-042 counts, AC-014's pointer. AC-012's requirement link is wrong. |

### Overlay Protocols

| Protocol | Level | Status | Notes |
|----------|-------|--------|-------|
| `skill_agent` | overlay | notApplicable | the target is a spec folder; no skill/agent pair is under review |
| `agent_cross_runtime` | overlay | notApplicable | no agent mirror in scope |
| `feature_catalog_code` | overlay | notApplicable | no catalog claim in scope |
| `playbook_capability` | overlay | notApplicable | no playbook in scope |

**AC_COVERAGE**: `exempt` - the packet holds no `checklist.md`, so the validation signal does not apply.

---

## 8. Deferred Items

- `AC-040` (`Unmet`) and `CHK-020` (open) are deferred to W4, the rerun after the doc fixes. They are the only open boxes in the packet and they are open on purpose.
- The two behavioural boundaries that are documented and accepted were not treated as findings: a refusal more than 400 characters before a loop phrase is outside the bounded window (REQ-030's stated design), and an untyped loop ask reaches the degraded fallback brief as the hub with no command (limitation 8, a pre-existing gap).
- No exhausted or blocked frontier nodes exist: this is a default-depth run, so the registry carries no `frontier` object.

### Dimension Expansion Map

- Completed pivots: 0. Failed pivots: 0. Audited overrides: 0.
- Saturated directions: none. Remaining frontier: none (default depth).
- Divergence state is empty; this run reviewed breadth by rotating the four canonical dimensions, not by pivoting.

---

## 9. Search Ledger

- `searchCoverage`: requiredBugClasses `[]`, covered `[]`, ruledOut `[]`, deferred `[]`, blocked `[]`, graphCoverageMode `null`.
- `candidateCoverage`: covered `[]`, ruledOut `[]`, deferred `[]`, blocked `[]`.
- `searchDebt`: `[]`, so hasSearchDebt is false.
- `ruledOutCandidates`: `[]`. `cleanSearchProof`: `[]`.

*No search-depth state captured (legacy v1 record).* The run's ruled-out directions are recorded per iteration in the strategy and in the audit appendix below.

---

## 10. Audit Appendix

### Convergence summary

- Iterations: 5. Stop reason: `maxIterationsReached` (the configured cap; convergence before the cap is telemetry only on `--stop-policy=max-iterations`).
- Per-iteration new-finding ratios: 1.00 (3 new P2), 0.14 (1 refinement), 0.00 (clean), 0.20 (1 new P2), 0.17 (1 new P2). Convergence score after the last reduce: 0.83.
- Active findings over time: 3, 4, 4, 5, 6. No finding was resolved; none was downgraded or called a false positive.
- Verdict derivation: `review-verdict.cjs --registry-path ... --state-log ...` reads active P0=0, active P1=0, active P2=6 and the terminal-gates row (`failedRequiredGateIds: ["coverage"]`), and returns `FAIL`, `hasAdvisories=false`.

### Coverage summary

- Dimensions: 4/4 covered (correctness, security, traceability, maintainability).
- Files: 46 scope files; every packet doc and every gate file was read at least once; the probe file and the fixture were read programmatically in full.
- Requirements: 34/34 checked. Acceptance rows: 43/43 read.

### Ruled-out claims

- A false command on any gain, keep or negative probe row: all 69 probe rows read `freshness: live`, `exit 0`.
- A remaining `autonomous research` alias or a council-word boost: `rg` over the hub files and the gate prints nothing.
- A broken `path:line` citation in the packet docs: 116 references resolve, 0 missing, 0 past end of file.
- A TypeScript/Python divergence on the typed rows, the stuck-refusal rows or the doctor rows: the shared fixture columns and both gate copies agree.
- A builder that tunes on a holdout row: the three split readers skip or label holdout rows.
- A prompt-injection or ReDoS opening in the changed gate: bounded head (10,000), bounded lead window (400), no dynamic execution, no file writes on the recommendation path.
- A comment-hygiene violation in the changed code: the added-line scan over the packet's commits prints nothing.
- A Verification Summary miscount: 12 P0 / 13 P1 / 1 P2 with 11/13/1 verified matches the CHK boxes.

### Sources reviewed

- Gate: `command-attach.ts`, `skill_advisor.py`, `fusion.ts`, `explicit.ts`, `render.ts`, `handlers/advisor-recommend.ts`, `schemas/advisor-tool-schemas.ts`, `skill-advisor-cli.ts`.
- Tests and evidence: `deep-loop-offer-cases.vitest.ts`, `command-attach.vitest.ts`, `command-attach-guards.vitest.ts`, `typed-on-stuck-serving.vitest.ts`, `doctor-handoff-command.vitest.ts`, `stage-one-loop-subject.vitest.ts`, `command-brief-golden.vitest.ts`, `subprocess-typed-fields.vitest.ts`, `cli-degraded-command-contract.vitest.ts`, `tests/python/test_skill_advisor.py`, the shared fixture, `command-prompts.jsonl`, the three probe result files and `compare.mjs`.
- Docs and decisions: `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `implementation-summary.md`, `decision-record.md` (ADR-001 to ADR-007), the two command documents, both presentation files, both YAML workflows, `hub-router.json`, `ROUTER.md`, the deep-loop hub `SKILL.md`, the changelog, and packet 013's summary.
- Runtime: `reduce-state.cjs`, `synthesis-closeout.cjs`, `terminal-gates.cjs`, `review-verdict.cjs`, `convergence.cjs`, and the reducer refinement tests.

### Cross-Reference Appendix

**Core Protocols**: `spec_code` pass; `checklist_evidence` partial (gating failure, four row-level defects).

**Overlay Protocols**: all four `notApplicable` (spec-folder target, no agent mirror, no catalog claim, no playbook).

### Provenance caveat

The ledger receipts are authoritative for ordering. The `timestamp` fields on the iteration records for iterations 3 to 5 were taken from an estimate rather than the clock at write time and run ahead of the gateway's `committed_at` values; the iteration files, deltas and this report do not depend on those values. Any later reader should order the iterations by `iteration` and the ledger `sequence`, not by the self-reported timestamps.

---

*Generated by deep-review lineage `deepseek-max-1` at 2026-11-24T10:04Z. This report is the lineage's own artifact; the merged root report is the authoritative rollup.*
