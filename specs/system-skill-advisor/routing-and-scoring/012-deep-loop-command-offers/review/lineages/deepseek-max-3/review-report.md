# Deep Review Report -- 012-deep-loop-command-offers

- Mode: review
- Target: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers` (spec-folder, Level 2)
- Run: lineage `deepseek-max-3`, generation 1, 7 iterations (cap), stop reason `maxIterationsReached`
- Executor: cli-pi, deepseek-v4.1-flash-1017
- Verdict: **FAIL** (four active P1 findings and the required coverage gate failing at the stop)

## 1. Executive Summary

The review walked every requirement in `spec.md` to its producer, its shared-fixture row, its test or its ADR, then walked every ticked task and every `Met` acceptance row to the line it cites. The code-side behaviour the packet claims is largely present: the explicit loop gate, the stage-one lane, the refusal and stuck-run exceptions, the typed-on-stuck head, the degraded-path hardening, the long-prompt bound and the refinement split all exist and are pinned by tests. What does not hold is the record around the code.

- **Overall verdict:** FAIL
- **hasAdvisories:** false
- **Active findings the verdict used:** P0 = 0, P1 = 4, P2 = 8
- **Self-check outcomes:** the adversarial pass re-read all four active P1 findings against the tree and confirmed each; no severity change and no false positive was called, so the counts the verdict used are the counts the registry carries.
- **Required gates at the stop:** evidence `pass`, scope `pass`, coverage `fail` (`traceability-incomplete`). `spec_code` and `checklist_evidence` both end `partial`, because the contradicted text and the contradicting code are both still in the tree.
- **Review scope:** 51 files from `review-scope-files.txt` plus the packet's own docs; 7 iterations across traceability (1-3, 7), correctness (4), security (5) and maintainability (6).
- **Operator review focus:** Traceability: finish the spec_code and checklist_evidence protocols. Check every REQ in spec.md against the code that implements it or the decision that records it, and every ticked task in tasks.md and every Met row in acceptance-criteria.md against evidence that really exists in the tree, including the sixth fix round (REQ-023 to REQ-034, AC-030 to AC-042, ADR-005, ADR-006).

Why FAIL and not CONDITIONAL: the verdict rule turns any required quality gate still failing at the terminal stop into FAIL. The coverage gate fails because the two core traceability protocols cannot pass while the findings below stand. This reproduces the same gate failure the third rerun recorded (AC-040), now with a different finding set.

## 2. Planning Trigger

`/speckit:plan` is required. The findings are documentation, contract and test-oracle fixes; none requires a code change to the gate's shipped behaviour except the mode-free fallback decision in R3-P1-001.

```json
{
  "triggered": true,
  "verdict": "FAIL",
  "hasAdvisories": false,
  "activeFindings": [
    {"id": "R1-P1-001", "severity": "P1", "findingClass": "spec-drift", "file": "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:243"},
    {"id": "R1-P1-002", "severity": "P1", "findingClass": "stale-evidence", "file": "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:84"},
    {"id": "R1-P1-003", "severity": "P1", "findingClass": "stale-evidence", "file": "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:93"},
    {"id": "R3-P1-001", "severity": "P1", "findingClass": "spec-drift", "file": "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:732"},
    {"id": "R2-P1-001", "severity": "P2", "findingClass": "stale-evidence", "file": "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:141"},
    {"id": "R1-P2-001", "severity": "P2", "findingClass": "stale-evidence", "file": "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:88"},
    {"id": "R1-P2-002", "severity": "P2", "findingClass": "stale-evidence", "file": "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:87"},
    {"id": "R2-P2-001", "severity": "P2", "findingClass": "stale-evidence", "file": "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:86"},
    {"id": "R3-P2-001", "severity": "P2", "findingClass": "spec-drift", "file": "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:181"},
    {"id": "R4-P2-001", "severity": "P2", "findingClass": "test-oracle", "file": ".skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py:2902"},
    {"id": "R6-P2-001", "severity": "P2", "findingClass": "maintainability-gap", "file": "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:243"},
    {"id": "R6-P2-002", "severity": "P2", "findingClass": "maintainability-gap", "file": "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:184"}
  ],
  "remediationWorkstreams": [
    {"order": 1, "id": "WS-1", "findingIds": ["R1-P1-001", "R6-P2-001"], "action": "Restate REQ-031 and AC-038 against the built guard (22 compared pairs, 12 per-entry lists, 16 refusal leads) and add a check that reads the counts, so the next round cannot drift silently."},
    {"order": 2, "id": "WS-2", "findingIds": ["R1-P1-002", "R1-P2-001", "R1-P2-002", "R2-P2-001"], "action": "Refresh every closure count that claims the final tree: fixture cases 347, suite 186 files/3,415 passed, refusal-verb rows 12, doctorWithheld rows 47, changelog suite row 186/3,415."},
    {"order": 3, "id": "WS-3", "findingIds": ["R1-P1-003", "R2-P1-001", "R6-P2-002"], "action": "Re-point every stale evidence cell to the symbol's current line (or cite the symbol name beside the line) across AC-033 to AC-038 and T066/T067/T074/T076/T081/T087/T092/T101."},
    {"order": 4, "id": "WS-4", "findingIds": ["R3-P1-001", "R4-P2-001"], "action": "Decide the mode-free plural ask on the fallback: either drop both run rows or amend REQ-035/ADR-008 to state that the fallback keeps both ask-policy rows, then give `servedRun` an encoding that can tell none from both."},
    {"order": 5, "id": "WS-5", "findingIds": ["R3-P2-001"], "action": "Extend the Files to Change table to the eighth and ninth rounds, naming the enrichment handler and the three new test files."}
  ],
  "specSeed": [
    "Restate REQ-031's counts from the built guard and add the per-entry list table as data, not prose.",
    "Amend REQ-035 or ADR-008 so the mode-free plural ask names the result on each served head.",
    "Extend the Files to Change table through the ninth round."
  ],
  "planSeed": [
    "Fix the closure counts first; they are the rows AC-028, AC-030, AC-037, AC-041 and AC-042 depend on.",
    "Re-point the citation cells and add a token-at-line check to the closure validation.",
    "Resolve the fallback decision, then rerun `/deep:review` on this packet to close AC-040."
  ],
  "findingClasses": ["spec-drift", "stale-evidence", "test-oracle", "maintainability-gap"],
  "affectedSurfacesSeed": [
    "spec.md REQ-031, REQ-035, §3 Files to Change",
    "decision-record.md ADR-008",
    "acceptance-criteria.md AC-028 to AC-042",
    "tasks.md T066 to T101 and the Verification Summary",
    "implementation-summary.md per-round rows",
    ".skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py",
    ".skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json"
  ],
  "fixCompletenessRequired": true
}
```

## 3. Active Finding Registry

| ID | Severity | Title | Dimension | File:line | Finding class | Disposition |
|----|----------|-------|-----------|-----------|---------------|-------------|
| R1-P1-001 | P1 | REQ-031 states a guard scope the tree does not hold, and AC-038 repeats it | traceability | `spec.md:243` | spec-drift | active |
| R1-P1-002 | P1 | Closure records promise a fixture of 285 cases while the shared fixture holds 347 | traceability | `acceptance-criteria.md:84` | stale-evidence | active |
| R1-P1-003 | P1 | Several Met evidence cells cite a line that holds unrelated code | traceability | `acceptance-criteria.md:93` | stale-evidence | active |
| R3-P1-001 | P1 | ADR-008 records the mode-free plural ask as no command, but the Python fallback keeps both run commands | traceability | `decision-record.md:732` | spec-drift | active |
| R2-P1-001 | P2 | A sixth-round task evidence cell points at a line the later rounds shifted (folded refinement of R1-P1-003; the reducer replaced the target wording with this refinement's) | traceability | `tasks.md:141` | stale-evidence | active |
| R1-P2-001 | P2 | AC-031's doctorWithheld row count is stale (26 stated, 47 in the fixture) | traceability | `acceptance-criteria.md:88` | stale-evidence | active |
| R1-P2-002 | P2 | AC-030's refusal-row count is stale (11 stated, 12 in the fixture) | traceability | `acceptance-criteria.md:87` | stale-evidence | active |
| R2-P2-001 | P2 | AC-029 records a suite count the changelog no longer carries (184/3,188 vs 186/3,415) | traceability | `acceptance-criteria.md:86` | stale-evidence | active |
| R3-P2-001 | P2 | The declared change set in spec.md stops at the sixth round | traceability | `spec.md:181` | spec-drift | active |
| R4-P2-001 | P2 | `servedRun: null` cannot tell no-mode from both-modes, so the Python suite cannot catch a drop-to-zero regression | correctness | `tests/python/test_skill_advisor.py:2902` | test-oracle | active |
| R6-P2-001 | P2 | Nothing fails when REQ-031's documented counts drift from the guard | maintainability | `spec.md:243` | maintainability-gap | active |
| R6-P2-002 | P2 | Closure evidence is cited by line number, so every insertion above a cited symbol invalidates a cell | maintainability | `tasks.md:184` | maintainability-gap | active |

Supporting detail, fix guidance and the typed claim-adjudication packets for the four P1 findings are in `iterations/iteration-001.md`, `iterations/iteration-002.md` and `iterations/iteration-003.md`. The registry entry for R2-P1-001 carries the refinement's wording because a same-file refinement replaces its target's wording by design (`reduce-state.cjs:1069-1087`); the original P1 text and the refined cell are both recorded in iteration 2.

## 4. Remediation Workstreams

### P0

None.

### P1

1. **WS-1 -- REQ-031's guard scope.** Restate the counts from `VOCABULARY_PAIRS` (22), the per-entry blocks (12) and `RUN_ASK_REFUSAL_LEADS` (16), and either generate the sentences or add an assertion so the requirement cannot drift again. Touches `spec.md:243`, `acceptance-criteria.md:95`.
2. **WS-2 -- Closure counts.** Replace 285 with 347 for the fixture, 184/3,188 with 186/3,415 for the suite, 11 with 12 refusal rows, 26 with 47 `doctorWithheld` rows, and align AC-029 with the changelog row at `.skilled/changelog/skilled/v4.2.0.0.md:759`. Touches `acceptance-criteria.md:84-88`, `tasks.md:140` and `:184`, `implementation-summary.md:177-181`.
3. **WS-3 -- Evidence cells.** Re-point AC-033 `:1483` -> `command-attach.ts:1682`/`:1102`, AC-034 `:5566` -> `skill_advisor.py:5820`, AC-036 `:5482` -> `:5745` and `typed-on-stuck-serving.vitest.ts:112`, AC-037 `:641` -> `:748` and `:5009` -> `:5181` and `:6298` -> `:6561`, AC-038 `:68`/`:83`/`:90`/`:303`/`:313` -> `:80`/`:83`/`:109`/`:448`/`:313`, and the same offsets in T066/T067/T074/T076/T081/T087/T092/T101.
4. **WS-4 -- Mode-free fallback.** Choose one of: drop both run rows in `_apply_deep_loop_offer_gate` when `asked_mode is None`, or amend REQ-035/ADR-008 to say the fallback keeps both ask-policy rows. Then split `servedRun` into a value that distinguishes "none" from "both" so the guard can test it.

### P2 advisories

- R1-P2-001, R1-P2-002, R2-P2-001: stale supporting counts, fixed by WS-2.
- R2-P1-001 (folded): the citation cell is fixed by WS-3.
- R3-P2-001: extend the change-set table.
- R4-P2-001: the oracle encoding, fixed with WS-4.
- R6-P2-001, R6-P2-002: the two maintenance mechanisms; the assertions named in WS-1 and WS-3 close them.

## 5. Spec Seed

- REQ-031 should read: "The guard compares 22 vocabulary pairs and two numeric constants; 12 lists carry a per-entry case, and 10 do not, for the reasons named." Drop the hard-coded count prose in favour of either a generated sentence or a stated invariant.
- REQ-035 should name the served result on both heads for the mode-free plural ask, or state that only the native head offers no command.
- §3 should gain "Added by the eighth and ninth rounds (REQ-035 to REQ-046)" with `handlers/advisor-recommend.ts`, `tests/scorer/deep-loop-plural-noun.vitest.ts`, `tests/handlers/advisor-recommend-duplicate-command.vitest.ts` and `runtime/tests/unit/deep-review-strategy-heading.vitest.ts`.
- The closure statement should stop saying "nothing else in the packet blocks closure" while a `Met` row rests on stale evidence; either fix the rows or mark the dependent criteria `Unmet`.

## 6. Plan Seed

1. Correct the four categories of closure evidence in one pass (counts, cells, change set, AC-029), because they share the same review round.
2. Add two checks: a doc-count assertion for REQ-031 and a token-at-line check for every `acceptance-criteria.md` and `tasks.md` cell.
3. Resolve WS-4 on the fallback and pin both served heads with a row that distinguishes none from both.
4. Rerun `/deep:review` with traceability as the focus so AC-040 and T084 can close.

## 7. Traceability Status

### Core Protocols

| Protocol | Status | Evidence | Unresolved drift |
|----------|--------|----------|------------------|
| `spec_code` | partial | `spec.md:243`, `spec.md:247`, `decision-record.md:732` | REQ-031's counts; REQ-035's mode-free served answer |
| `checklist_evidence` | partial | `acceptance-criteria.md:84`, `:93`, `tasks.md:184` | Nine stale cells; four stale counts |

Every other REQ (REQ-001 to REQ-030 and REQ-036 to REQ-046) resolves to a producer line, a fixture row, a test or an ADR, and those resolutions are recorded in the iteration narratives.

### Overlay Protocols

| Protocol | Status | Note |
|----------|--------|------|
| `skill_agent` | notApplicable | The packet edits skill docs but the reviewed claims are code and closure records, not a SKILL.md-to-agent contract. |
| `agent_cross_runtime` | notApplicable | No runtime mirror carried a changed claim in this run's evidence. |
| `feature_catalog_code` | notApplicable | No catalog entry names the deep-loop offer. |
| `playbook_capability` | notApplicable | No playbook precondition is in scope. |

**AC_COVERAGE:** `advisory-shortfall` -- 53 of 54 criteria are `Met`, `Waived` or `Superseded`; AC-040 is `Unmet`, which is this run's own gate. The signal is advisory while the validation rule stays INFO.

## 8. Deferred Items

- The registry carries no `frontier` object (default depth), so no frontier follow-up nodes are listed.
- The accepted waivers (AC-008/ADR-003, AC-017/ADR-002, AC-019/ADR-001) are traced, not re-opened; they do not block this verdict.
- The `deferred` search-debt list is empty; no bug class was deferred or blocked in this run.

### Dimension Expansion Map

- Completed pivots: 0. Failed pivots: 0. Audited overrides: 0.
- Saturated directions: none recorded. Divergence mode is `default`; the frontier store is empty.
- Remaining frontier: none.

## 9. Search Ledger

- `searchCoverage`: required bug classes `spec_drift`, `stale_evidence`, `mode_parity`; all three covered. `graphCoverageMode`: `graphless_fallback`.
- `candidateCoverage`: 11 bug classes covered across the run (`spec_drift`, `stale_evidence`, `missing_implementation`, `mode_parity`, `branch_order`, `test_oracle`, `command_injection`, `untrusted_render`, `policy_escalation`, `doc_code_drift`, `unguarded_duplication`); six ruled out with a cited reason; none deferred or blocked.
- `searchDebt`: empty. `hasSearchDebt`: false.
- `ruledOutCandidates`: 10 rows (SL-004, SL-005, SL-008, SL-012, SL-014, SL-015, SL-016, SL-017, SL-020), each with a `proof` string.
- `cleanSearchProof`: the same 10 rows, each naming the read that eliminated the candidate.

## 10. Audit Appendix

### Convergence

| Iteration | Dimension | newFindingsRatio | New findings | Active totals after |
|-----------|-----------|------------------|--------------|---------------------|
| 1 | traceability | 1.00 | 3 P1, 2 P2 | 0 / 3 / 2 |
| 2 | traceability | 0.15 | 1 P1, 1 P2 | 0 / 4 / 3 |
| 3 | traceability | 0.22 | 1 P1, 2 P2 | 0 / 4 / 5 |
| 4 | correctness | 0.03 | 1 P2 | 0 / 4 / 6 |
| 5 | security | 0.00 | none | 0 / 4 / 6 |
| 6 | maintainability | 0.06 | 2 P2 | 0 / 4 / 8 |
| 7 | traceability | 0.00 | none (re-read) | 0 / 4 / 8 |

Stop reason: `maxIterationsReached` (cap 7, stop policy `max-iterations`). Terminal gates: evidence pass, scope pass, coverage fail.

### Coverage

- Dimensions: correctness, security, traceability, maintainability -- 4 of 4 covered.
- Files: 51 scope files plus the packet docs; every finding names a scope file or a packet doc.
- Iteration artifacts: `iterations/iteration-001.md` to `iteration-007.md`; deltas `deltas/iter-001.jsonl` to `iter-007.jsonl`.

### Ruled-out claims

See Search Ledger; the six implementation candidates (refusal vocabulary, typed-on-stuck decision, probe artifacts, ADR-006 verb rule, branch order, vocabulary duplication) and the three security candidates (command injection, untrusted render, policy escalation) were eliminated by direct reads, not by absence of evidence.

### Sources reviewed

- Packet docs: `spec.md`, `acceptance-criteria.md`, `tasks.md`, `decision-record.md`, `implementation-summary.md`, `plan.md`, `timeline.md`.
- Scope code: `command-attach.ts`, `skill_advisor.py`, `explicit.ts`, `fusion.ts`, `subprocess.ts`, `skill-advisor-cli.ts`, `render.ts`, `prompt-policy.ts`, `advisor-recommend.ts`, `reduce-state.cjs`, the shared fixture and the named tests.
- Companion packet 013's implementation summary for the degraded-path evidence.

### Scope note

One iteration-5 narrative records a `sed -i` use on its own file under `## SCOPE VIOLATIONS`. It touched only the lineage's iteration file; no reviewed target or reducer output was modified.

### Cross-reference appendix

- Core: `spec_code` partial, `checklist_evidence` partial (above).
- Overlay: `skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability` all `notApplicable` for this target.

---

*Compiled by the `deepseek-max-3` lineage at the iteration cap. The verdict a release decision reads is recomputed by the cross-lineage merge from the findings registry; this report states the counts that verdict used.*
