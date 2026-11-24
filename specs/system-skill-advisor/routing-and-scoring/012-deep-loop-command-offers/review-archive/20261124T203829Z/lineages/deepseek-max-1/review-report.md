# Deep Review Report — 012-deep-loop-command-offers (lineage deepseek-max-1)

- Lineage: `review/lineages/deepseek-max-1` · session `fanout-deepseek-max-1-1795550334883-gjbarh` · generation 8 · lineageMode `new`
- Iterations: 7 of 7 · stop reason: `maxIterationsReached` · policy: `max-iterations`
- Dimensions covered: correctness, security, traceability, maintainability (4 of 4)

## 1. Executive Summary

- **Overall verdict: FAIL.** The verdict is derived from the findings registry and the terminal gates, not from the iterations' self-reports.
- **hasAdvisories: false.** One active P2 finding exists, and the FAIL is not produced by it.
- **P0 / P1 / P2: 0 / 0 / 1**, the counts the verdict used.
- **Why FAIL:** a required quality gate is still failing at the terminal stop. `coverage` reads `fail` with reason code `traceability-incomplete`, because the core protocol `checklist_evidence` could not be finished in this run. The requirement whose gate this is, REQ-033, and the acceptance row that owns it, AC-040, both ask for exactly that pass. The review reports the gate truthfully rather than marking the protocol `pass` to satisfy it.
- **What is finished:** `spec_code` reaches `pass`. Every one of the 51 requirements in `spec.md` was traced to the code that implements it or the decision that records it, with `file:line` evidence and, where the claim is a served row, the fixture row and column that pins it.
- **What is not finished:** `checklist_evidence` stays `partial` for two named reasons, not for a general one — AC-038 states a drift-guard count the tree no longer has (DR1-P2-001), and AC-040 waits on a run whose gates pass.
- **Self-check outcome:** the adversarial self-check re-read the one active finding against the tree and confirmed it at the same severity (24 vocabulary-pair rows against the 22 AC-038 states, last row `RUN_ASK_REFUSAL_VERBS` against the `RUN_ASK_REFUSAL_LEADS` AC-038 names). No finding was downgraded or called a false positive, so no adjudication rows were written.
- **Review scope:** the 72 paths in `review-scope-files.txt`, taken in file order: the 012 packet docs, the 013 sibling packet docs, the advisor runtime (`handlers`, `lib`, `schemas`, `scorer`, `scripts`, `tests`), the deep-loop command surfaces (`research.md`, `review.md`, both YAMLs, both presentations, the compiled contracts, the hub `ROUTER.md` and `SKILL.md`), and the deep-loop reducer and closeout scripts with their unit tests.
- **Operator review focus:** Traceability: finish the spec_code and checklist_evidence protocols. Check every REQ in spec.md against the code that implements it or the decision that records it, and every ticked task in tasks.md and every Met row in acceptance-criteria.md against evidence that really exists in the tree, including the sixth fix round (REQ-023 to REQ-034, AC-030 to AC-042, ADR-005, ADR-006).

## 2. Planning Trigger

`/speckit:plan` is required. The verdict is FAIL on the coverage gate and one active P2 finding needs a docs-only change, so a planning pass should scope both the closure-doc fix and the decision about what the checklist gate is allowed to require.

```json
{
  "triggered": true,
  "verdict": "FAIL",
  "hasAdvisories": false,
  "activeFindings": [
    {
      "id": "DR1-P2-001",
      "severity": "P2",
      "title": "AC-038 observed drift-guard counts no longer match the guard it cites",
      "dimension": "traceability",
      "file": "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:95"
    }
  ],
  "remediationWorkstreams": [
    {
      "id": "WS-1",
      "priority": 1,
      "scope": "docs",
      "summary": "Refresh AC-038 to the guard the tree carries: 24 vocabulary pairs, `RUN_ASK_REFUSAL_VERBS` as the last row, and the current per-entry coverage split."
    },
    {
      "id": "WS-2",
      "priority": 2,
      "scope": "docs",
      "summary": "Decide and record whether AC-040 is exempt from the checklist gate it depends on, since a run cannot both close that row and pass the gate it measures without stating the exemption."
    }
  ],
  "specSeed": [
    "REQ-033 and AC-040 should say which run may close the row and whether that row is exempt from the gate it measures."
  ],
  "planSeed": [
    "Edit AC-038's observed cell to the 24-row guard and name the last row correctly.",
    "Add one sentence to AC-040 or REQ-033 stating the exemption or the bootstrap rule.",
    "Re-run `/deep:review` with the traceability focus once both edits land, so the coverage gate can read `pass`."
  ],
  "findingClasses": ["docs-traceability"],
  "affectedSurfacesSeed": [
    "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:95",
    "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:97"
  ],
  "fixCompletenessRequired": false
}
```

## 3. Active Finding Registry

### DR1-P2-001 — AC-038 observed drift-guard counts no longer match the guard it cites

- **Severity:** P2 · **Dimension:** traceability · **Finding class:** docs-traceability
- **Location:** `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:95`
- **Evidence:** AC-038 states "`VOCABULARY_PAIRS` compares 22 vocabulary pairs ... the last of them `RUN_ASK_REFUSAL_LEADS` ... Twelve of the 22 lists carry a per-entry case ... The other ten". The guard at `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:121` holds 24 rows and its last row is `['RUN_ASK_REFUSAL_VERBS', '_RUN_ASK_REFUSAL_VERB_LIST', RUN_ASK_REFUSAL_VERBS]`.
- **Impact:** an acceptance cell that reads `Met` no longer describes the artifact it cites. A reader cannot tell whether the guard grew legitimately or the row drifted, and the cell's own evidence pointer still resolves, so the drift hides behind a passing citation.
- **Fix recommendation:** replace the count, the last-row name and the per-entry split with the values the tree holds. REQ-031 needs no change; it says explicitly that adding a list changes the guard, not the requirement.
- **Disposition:** active (confirmed by the adversarial self-check at the same severity).
- **Scope proof:** both files are entries in `review-scope-files.txt` (entry 23 for `acceptance-criteria.md`, entry 19 for the vitest file).
- **Affected surface hints:** `acceptance-criteria.md` AC-038 observed cell; no code or test change is implied.

## 4. Remediation Workstreams

**P0 — none.**

**P1 — none.**

**P2 advisories (non-blocking):**

1. WS-1 (docs, one row): refresh AC-038's observed cell to the 24-row guard, with `RUN_ASK_REFUSAL_VERBS` as the last row. This is the finding above.
2. WS-2 (docs, one row or one sentence): state whether AC-040 is exempt from the checklist gate that measures it. This is the deferred observation in section 8, not an active finding; it explains why the coverage gate keeps failing across generations.

## 5. Spec Seed

- REQ-033 asks the rerun's terminal gates to read `evidence`, `scope` and `coverage` pass, and AC-040 is the row that records it. Neither says whether AC-040 itself must be `Met` for the gate to pass. One sentence should settle it, because a reviewer holding the checklist to its own words cannot close the row the gate is waiting on.
- REQ-031 already anticipates widening: it says the requirement names no list count so adding a list changes the guard, not the text. AC-038 should carry the same tolerance or name the count it is checked against at review time.

## 6. Plan Seed

- Edit `acceptance-criteria.md:95` — AC-038's observed cell: 24 pairs, last row `RUN_ASK_REFUSAL_VERBS`, and the current per-entry split. Keep the `sixty` scratch-edit story, which the tree still supports.
- Edit `acceptance-criteria.md:97` or `spec.md:257` — one sentence on the AC-040 bootstrap rule.
- Re-run `/deep:review` on this packet with the traceability focus; the expected outcome is `coverage-complete` and `Review verdict: PASS` with `hasAdvisories: true` for the P2 that remains.

## 7. Traceability Status

**Core protocols**

| Protocol | Status | Evidence | Drift |
| --- | --- | --- | --- |
| `spec_code` | **pass** | 51 of 51 requirements traced. REQ-001 to REQ-022 by recorded probe rows (`results-final-958fa81-worktree.json`, ids `V6`, `H1a`, `E3`, `R7`, `N9`, `H3b`) and by document presence in both named files; REQ-023 to REQ-034 by named symbols and by ADR-005 and ADR-006; REQ-035 to REQ-051 by fixture rows and columns plus the rules that read them. | None open. |
| `checklist_evidence` | **partial** | 54 `Met` rows re-derived rather than trusted: 60 of 60 quoted line references resolve to the line holding their quote; seven counted claims match the tree; all 138 ticked tasks cite paths that exist; the sixth-round typed columns exist with the coverage the cells state. | AC-038 stale (DR1-P2-001); AC-040 open pending this run's gates. |

**Overlay protocols**

| Protocol | Status | Reason |
| --- | --- | --- |
| `skill_agent` | notApplicable | No skill contract pairing is inside the review scope. |
| `agent_cross_runtime` | notApplicable | No agent definition is inside the review scope. |
| `feature_catalog_code` | notApplicable | No feature catalog entry is inside the review scope. |
| `playbook_capability` | notApplicable | No playbook is inside the review scope. |

**AC_COVERAGE:** `advisory-shortfall`. The target is a Level 3 spec folder with `acceptance-criteria.md` present and `implementation-summary.md` in a completed state, so the signal is live rather than exempt. Of 59 rows, 54 read `Met`, 3 `Waived` with an ADR, 1 `Superseded` with an ADR and 1 `Unmet` (AC-040). No floor is configured, so the signal is reported and does not change the verdict enum.

**Resource Map Coverage Gate:** skipped. `resource-map.md` is absent from the target (`resource_map_present: false`), so the gate does not run.

## 8. Deferred Items

- **AC-040's bootstrap position (observation, not an active finding).** AC-040 reads `Unmet` and asks a future traceability rerun to make the terminal gates read `evidence`, `scope` and `coverage` pass. The `coverage` gate reads the review's own traceability state, so a rerun that keeps `checklist_evidence` honest while AC-040 is open fails that gate, which leaves AC-040 open. Forestalled counterevidence: earlier generations did reach `coverage-complete` with AC-040 still `Unmet` (AC-040 records generation 7 at two lineages of three), so the loop is escapable by judgment rather than impossible. Because it is escapable, this is recorded as a deferred closure-record question for `/speckit:plan` and not as an active finding; raising it as a finding would claim a contradiction the tree's own history disproves.
- **Bare-filename citations in `tasks.md`.** 19 of 138 ticked tasks name their artifact by bare filename rather than by path. Every name resolves today, so nothing is missing; the cost is that a file moving between directories would silently invalidate the citation. Advisory only.
- **Two copies of one rule.** `refinesSameLocation` (`reduce-state.cjs:1011`) and `refinedTarget` (`synthesis-closeout.cjs:406`) implement the same file-and-dimension test. They agree today and both state their reason in a comment; a future change must touch both.
- **A fresh served-head probe.** REQ-001 to REQ-004, REQ-008, REQ-014, REQ-019 and REQ-035 to REQ-051 rest partly on a recorded probe run and the fixture. A future run that can start the advisor may re-serve the 69-prompt set and compare against `scratch/probes/results-final-958fa81-worktree.json`.
- **Frontier:** none. This lineage ran in default depth mode, so no frontier node exists to list.

## Dimension Expansion Map

No divergent pivot ran in this lineage and no direction was swept. `divergence` holds no completed or failed pivot, no audited override and no saturated direction, so the only breadth this report records is the dimension set itself, all four of which were covered in full.

## 9. Search Ledger

- **searchCoverage:** required bug classes across the run were `claim_evidence_drift`, `served_head_ordering`, `command_injection`, `prompt_disclosure`, `unbounded_input`, `supplied_command_confusion`, `requirement_unimplemented`, `document_claim_absent`, `probe_evidence_missing`, `decision_not_implemented`, `requirement_symbol_missing`, `closure_doc_stale`, `ticked_task_missing_artifact`, `acceptance_row_unevidenced`, `status_outside_enum`, `comment_hygiene`, `generated_artifact_drift`, `dead_code`, `duplicated_rule`, `requirement_without_row`, `column_value_mismatch` and `unaccounted_pattern`. All were covered by direct reads or exact searches; none was deferred or blocked. `graphCoverageMode: graph`.
- **candidateCoverage:** no required bug class was left uncovered, so the candidate-coverage gate has nothing to veto.
- **searchDebt:** none (0).
- **ruledOutCandidates:** citation drift across `acceptance-criteria.md`; near-miss count drift in AC-019; `PATTERNS_NOT_COMPARED` count drift in AC-059; command injection on any spawn site; prompt disclosure through argv; unbounded work on a long prompt; a supplied command from another skill on a degraded row; missing offer wiring between the command docs and the presentations; a stale compiled contract; council wording left on either lane; probe records that do not hold the ids they are cited for; ADR-005 or ADR-006 recorded but not implemented; a leftover "stuck run drops the run row" sentence; a ticked task pointing at a removed file; a `Met` row with no evidence; packet ids in code comments; a compiled contract lagging its source; dead reducer symbols; two disagreeing refinement implementations; a requirement with no fixture row; a column value the fixture does not carry; an unaccounted gate pattern.
- **cleanSearchProof:** the trailing four iterations each report `newFindingsRatio: 0.0` with the search actions that justify it, and the two findings-free dimensions (security, maintainability) each name the surfaces searched rather than claiming a clean sweep.

## 10. Audit Appendix

### Convergence summary

- Seven iterations, no convergence stop: the policy is `max-iterations` with a cap of 7, so the loop ran to the cap and the cap decided the stop.
- `newFindingsRatio` by iteration: 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0. One finding was produced in iteration 1; nothing was added after it, and nothing was withdrawn.

### Coverage summary

- Dimensions: 4 of 4 covered, each with one full pass (`correctness` 1, `security` 2, `traceability` 3, 4, 5, 7, `maintainability` 6).
- Core protocols: `spec_code` pass, `checklist_evidence` partial.
- Terminal gates: `evidence` pass (`all-findings-cited`), `scope` pass (`all-findings-in-scope`), `coverage` fail (`traceability-incomplete`). Failed required gate ids: `coverage`.

### Ruled-out claims

Every entry in section 9's `ruledOutCandidates` was investigated inside the iteration that names it, with the surface and the reason recorded in that iteration's narrative. No ruled-out claim rests on the absence of a search.

### Sources reviewed

72 scope paths, of which the run opened: all six packet docs, four 013 docs, the seven advisor runtime sources named by requirements, eight of the advisor test files, both command docs, both presentations, both YAMLs, the compiled contracts and their README, the hub `ROUTER.md`, `SKILL.md`, `hub-router.json`, `graph-metadata.json`, the deep-loop reducer and closeout with four unit tests, the routing-accuracy corpus and baseline, and the packet's probe and citation scratch files.

### Cross-reference appendix — Core Protocols

- `spec_code`: 51 of 51 requirements traced. The three trace mechanisms were a recorded probe row, a named symbol with a reading, and a named decision. No requirement was left on prose alone.
- `checklist_evidence`: 54 `Met` rows re-derived, 3 `Waived` read against their ADRs (ADR-003, ADR-002, ADR-009), 1 `Superseded` (ADR-001), 1 `Unmet` (AC-040). Every ticked task's cited path resolved.

### Cross-reference appendix — Overlay Protocols

- `skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability`: each `notApplicable` with `applicable: false` and the reason that no such surface is inside the declared scope. None is recorded as `pending` or `deferred`.
