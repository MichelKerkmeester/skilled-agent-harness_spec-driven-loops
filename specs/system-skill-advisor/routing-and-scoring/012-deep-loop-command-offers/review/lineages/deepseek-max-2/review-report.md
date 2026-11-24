# Review Report — Packet 012 `012-deep-loop-command-offers`

Lineage `deepseek-max-2` · session `fanout-deepseek-max-2-1795511183570-92w0ez` · generation 1 · mode `review` · 5 iterations · stop `maxIterationsReached`

## 1. Executive Summary

- **Overall verdict: FAIL.** The lineage's terminal gate set records `coverage` as `fail` (`traceability-incomplete`) while `evidence` and `scope` pass, and a required quality gate failing at the terminal stop makes the verdict FAIL.
- **hasAdvisories:** false (the verdict is not PASS).
- **Counts the verdict used:** P0 = 0, P1 = 1, P2 = 5. They are the counts `review-verdict.cjs` read from `deep-review-findings-registry.json` after the reducer's last pass, not a hand count.
- **Self-check outcomes:** the one P1 (`R3-P2-001`, re-stated as `R5-P1-001`) was confirmed at P1 by the Hunter/Skeptic/Referee pass; no finding was downgraded and none was called a false positive. The Referee's call is recorded through the append gateway as a `deep_review.claim_adjudication` row with `findingId: R3-P2-001, finalSeverity: P1`.
- **Review scope:** the packet folder `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers` and the 46 paths in `review-scope-files.txt`, covering the two gate copies (`command-attach.ts`, `skill_advisor.py`), the scorer lanes, the two command documents, the two presentation assets, the shared fixture and both gate suites, six packet docs, and the deep-loop reducer.
- **Operator review focus:** "Traceability: finish the spec_code and checklist_evidence protocols. Check every REQ in spec.md against the code that implements it or the decision that records it, and every ticked task in tasks.md and every Met row in acceptance-criteria.md against evidence that really exists in the tree, including the sixth fix round (REQ-023 to REQ-034, AC-030 to AC-042, ADR-005, ADR-006)."

What the run establishes: the deep-loop offer behaves as the packet says. All 34 REQ rows were checked; REQ-001 to REQ-010 and REQ-012 to REQ-034 resolve to code, a decision or a recorded measurement, and a 38-prompt live matrix reproduced every stated outcome for REQ-015 to REQ-027 with zero mismatches. What fails is the record: REQ-011 still requires a research alias the build dropped, and five documentation pointers and blocks no longer say what the tree says. Both core protocols therefore close `partial`, and the coverage gate reflects that.

## 2. Planning Trigger

`/speckit:plan` is required. The remediation is a documentation-only workstream: amend REQ-011 (or record an ADR and an acceptance row for the dropped alias) and correct five pointer/step-metadata defects, then rerun the traceability review so AC-040's coverage gate can read pass.

```json
{
  "triggered": true,
  "verdict": "FAIL",
  "hasAdvisories": false,
  "activeFindings": [
    {"id": "R3-P2-001", "severity": "P1", "title": "REQ-011 is an unamended requirement contradicted by the tree, and no acceptance row owns it", "file": "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:223", "findingClass": "class-of-bug"},
    {"id": "R3-P2-002", "severity": "P2", "title": "Eleven Met acceptance rows cite an implementation-summary.md line that does not hold their evidence", "file": "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:58", "findingClass": "instance-only"},
    {"id": "R3-P2-003", "severity": "P2", "title": "A ticked task's stated verification no longer holds", "file": "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:36", "findingClass": "instance-only"},
    {"id": "R3-P2-004", "severity": "P2", "title": "The changelog quotes a suite count the tree has since exceeded", "file": ".skilled/changelog/skilled/v4.2.0.0.md:759", "findingClass": "instance-only"},
    {"id": "R4-P2-001", "severity": "P2", "title": "AC-032 and T069 cite a blank line for typedCommandIn", "file": "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:89", "findingClass": "instance-only"},
    {"id": "R4-P2-002", "severity": "P2", "title": "Both closure docs carry continuity metadata that predates the sixth round", "file": "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/implementation-summary.md:13", "findingClass": "class-of-bug"}
  ],
  "remediationWorkstreams": [
    {"order": 1, "class": "class-of-bug", "title": "Amend REQ-011 to the aliases that shipped", "findings": ["R3-P2-001"], "surface": "spec.md REQ-011, acceptance-criteria.md AC-017/AC-018"},
    {"order": 2, "class": "class-of-bug", "title": "Refresh the closure continuity metadata", "findings": ["R4-P2-002"], "surface": "implementation-summary.md _memory.continuity, acceptance-criteria.md _memory.continuity"},
    {"order": 3, "class": "instance-only", "title": "Repoint eleven Met acceptance rows to the row that holds their evidence", "findings": ["R3-P2-002"], "surface": "acceptance-criteria.md AC-001 to AC-013, AC-016, AC-021"},
    {"order": 4, "class": "instance-only", "title": "Correct the three stale verification pointers and counts", "findings": ["R3-P2-003", "R4-P2-001", "R3-P2-004"], "surface": "tasks.md T001, AC-032/T069, changelog release table"}
  ],
  "specSeed": [
    "REQ-011 names two research aliases after D8 dropped the third; if the operator wants the third alias, add it to hub-router.json and ROUTER.md instead, and re-solve its out-of-domain replay.",
    "A requirement amended after an operator decision needs the amendment in the requirement row itself and an acceptance row that tests it, which is what the sixth round did for REQ-020.",
    "The closure docs carry continuity metadata as first-class state; a round that rewrites the docs refreshes recent_action, next_safe_action and completion_pct in the same pass."
  ],
  "planSeed": [
    "Edit spec.md:223 to two aliases (or append the third alias to the hub and router), and record the choice in decision-record.md.",
    "Add or extend an acceptance row so the alias set is tested, not merely described.",
    "Repoint AC-001 to AC-005, AC-013, AC-016 and AC-021 to implementation-summary.md:153; AC-010 to :154 or :157; AC-011 to :154; AC-012 to :155.",
    "Update tasks.md:36's stated count to 11 and record the observed note.",
    "Change command-attach.ts:250 to :251 in AC-032 and T069.",
    "Refresh both _memory.continuity blocks to the current state, with completion_pct reflecting the open T084.",
    "Update the changelog's 'Advisor runtime suite with the loop offers' row to the final count, or label it as the fifth-round snapshot.",
    "Rerun /deep:review with traceability as the focus and confirm the coverage gate reads pass."
  ],
  "findingClasses": {"class-of-bug": ["R3-P2-001", "R4-P2-002"], "instance-only": ["R3-P2-002", "R3-P2-003", "R3-P2-004", "R4-P2-001"], "matrix/evidence": []},
  "affectedSurfacesSeed": ["spec.md", "acceptance-criteria.md", "tasks.md", "implementation-summary.md", "decision-record.md", ".skilled/changelog/skilled/v4.2.0.0.md", ".skilled/skills/system-deep-loop/hub-router.json", ".skilled/skills/system-deep-loop/ROUTER.md"],
  "fixCompletenessRequired": true
}
```

## 3. Active Finding Registry

| ID | Sev | Title | Dimension | file:line | Evidence | Impact | Fix | Disposition | Finding class | Scope proof | Affected surfaces |
|----|-----|-------|-----------|-----------|----------|--------|-----|-------------|---------------|-------------|-------------------|
| R3-P2-001 (raised as R5-P1-001) | P1 | REQ-011 is an unamended requirement contradicted by the tree, and no acceptance row owns it | traceability | `spec.md:223` | `hub-router.json:34` and `ROUTER.md:63` carry two of the three named aliases; `tasks.md:69` records the drop; `decision-record.md:148` cites D8 | A reader checking REQ-011 against the tree finds a false clause; AC-040's coverage claim cannot read pass | Amend REQ-011 to two aliases, or add the third and an AC row | active | class-of-bug | requirement printed, both hub files grepped, decision record read | spec.md, acceptance-criteria.md, tasks.md, decision-record.md, hub-router.json, ROUTER.md |
| R3-P2-002 | P2 | Eleven Met acceptance rows cite an implementation-summary.md line that does not hold their evidence | traceability | `acceptance-criteria.md:58` | `implementation-summary.md:153` (probe), `:154` (suite/mirrors), `:155` (corpus), `:157` (final rerun) | Followed pointers land on the wrong paragraph | Repoint the eleven cells | active | instance-only | every cited line printed and compared | acceptance-criteria.md, implementation-summary.md |
| R3-P2-003 | P2 | A ticked task's stated verification no longer holds | traceability | `tasks.md:36` | `rg -c '^\| D[0-9]' scratch/decisions.md` prints 11; the row claims 9 | T001's tick rests on a check that now contradicts its file | Update the stated count and add the observed note | active | instance-only | command rerun | tasks.md, scratch/decisions.md |
| R3-P2-004 | P2 | The changelog quotes a suite count the tree has since exceeded | traceability | `.skilled/changelog/skilled/v4.2.0.0.md:759` | the row reads 2,696; `implementation-summary.md:164` and AC-042 state 3,029 | A release reader takes a stale figure | Update the row or label it as a round snapshot | active | instance-only | both figures printed | changelog, implementation-summary.md |
| R4-P2-001 | P2 | AC-032 and T069 cite a blank line for typedCommandIn | maintainability | `acceptance-criteria.md:89` | `command-attach.ts:250` is blank; the declaration is `:251` | Followed pointer finds nothing | Change `:250` to `:251` | active | instance-only | lines 249-252 printed | acceptance-criteria.md, tasks.md, command-attach.ts |
| R4-P2-002 | P2 | Both closure docs carry continuity metadata that predates the sixth round | maintainability | `implementation-summary.md:13` | `recent_action`/`next_safe_action` still point at planning the sixth round; `acceptance-criteria.md:11-21` is still the scaffold | A resume re-plans a round that is built | Refresh both blocks | active | class-of-bug | both blocks printed against `spec.md:23` and `tasks.md:166` | implementation-summary.md, acceptance-criteria.md |

## 4. Remediation Workstreams

1. **P1 — the requirement record (R3-P2-001).** Decide the third alias: restore it in `hub-router.json`/`ROUTER.md`, or amend REQ-011 to the two that shipped. Either way the choice belongs in `decision-record.md` and an acceptance row must test the alias set, because AC-017 and AC-018 do not.
2. **P2 — closure metadata (R4-P2-002).** Refresh both `_memory.continuity` blocks together with the docs edit, so the next resume reads the packet's real state.
3. **P2 — evidence pointers (R3-P2-002, R4-P2-001).** Repoint the eleven acceptance cells and the one code anchor. The correct targets are named per row above; no measurement changes.
4. **P2 — verification counts (R3-P2-003, R3-P2-004).** Correct T001's count and the changelog's suite row, each with the observed note the packet's own convention already uses elsewhere.
5. **Re-verify.** Rerun `/deep:review` with traceability as its focus. The coverage gate should read pass once both core protocols can close, which is AC-040.

## 5. Spec Seed

- REQ-011 states the alias set that shipped. Where an operator decision removes a planned item, the requirement row carries the amendment, not only the task note.
- The alias rule itself stays: a hub alias is a routing phrase, so every alias needs an out-of-domain replay before it lands (`.skilled/repo-rules/skill-hub-routing.md` §4) — that is why D8 dropped the third one.
- The evidence contract for a `Met` row is a pointer to a row a reader can open and read; a neighbouring line is not the evidence.

## 6. Plan Seed

- Amendment task → `spec.md:223`, with the decision recorded in `decision-record.md` and a new or extended AC row.
- Pointer task → the eleven cells in `acceptance-criteria.md` and `command-attach.ts:250` in AC-032/T069.
- Count task → `tasks.md:36`, `.skilled/changelog/skilled/v4.2.0.0.md:759`.
- Metadata task → both `_memory.continuity` blocks.
- Verification task → a traceability rerun whose `terminal_gates` row reads evidence, scope and coverage pass (AC-040, T084).

## 7. Traceability Status

**Core protocols**

| Protocol | Status | Evidence | Unresolved drift |
|----------|--------|----------|------------------|
| `spec_code` | partial | `spec.md:223`, `results-after.json` (69 rows) vs `results-spec-baseline.json` (69 rows), 38-prompt live matrix, assets, hub files | REQ-011's third alias (finding 1) |
| `checklist_evidence` | partial | `acceptance-criteria.md:58-97`, `tasks.md:36-166`, `implementation-summary.md:153-172`, `decision-record.md` ADRs, fixture header | findings 2 to 6 |

**Overlay protocols:** `skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability` are `notApplicable` — the target is a spec folder with no skill/agent pair, agent mirror, catalog claim or playbook in scope.

**AC_COVERAGE:** advisory-shortfall — 38 of 42 rows `Met`, 3 `Waived`/`Superseded` (AC-008 ADR-003, AC-017 ADR-002, AC-019 ADR-001), 1 `Unmet` (AC-040). The criterion is advisory while the validation rule is INFO/default-on, and this run does not change its severity.

## 8. Deferred Items

- **AC-040 and T084.** This rerun supplies the report but not a passing coverage gate, so AC-040 stays `Unmet` and T084 stays open. The packet's docs are read-only to this lineage; the owner applies the remediation above and reruns.
- **`dist/` as a build dependency.** `dist/` is gitignored, so REQ-006's "the probe run prints `live`" cannot be reproduced from this worktree without a build. Not a defect in the packet's source.
- **The changelog count (R3-P2-004)** is advisory: REQ-022 and REQ-034 do not require a recount after the sixth round, so a reader may treat the figure as the fifth-round snapshot. Recorded so the choice is explicit.
- No frontier object exists in this registry, so no `exhausted`/`blocked` review nodes are carried forward as follow-up work.

## 9. Dimension Expansion Map

- Completed pivots: 0. Failed pivots: 0. Audited overrides: 0.
- Saturated directions: none. Pivot lineage: none.
- Remaining frontier: none recorded — the run used the default depth mode, and the four canonical dimensions were covered in five iterations (correctness, security, traceability, maintainability, traceability second pass).

## 10. Search Ledger

- `searchCoverage.requiredBugClasses`: `logic_error`, `state_transition`, `boundary_condition` (iteration 1); `injection`, `unbounded_resource_consumption`, `secret_exposure` (iteration 2); `spec_code_mismatch`, `stale_evidence_pointer`, `stale_count` (iteration 3); `stale_metadata`, `summary_miscount` (iteration 4); the same set re-read at iteration 5. Covered in full; none blocked.
- `ruledOutCandidates`: depth-word false offers, TS/Python gate divergence on REQ-020, catastrophic backtracking, unprompted spend, secret material, live gate failure on REQ-015 to REQ-027, missing sixth-round acceptance anchor, Verification Summary miscount, unbacked waiver, further shifted pointers.
- `searchDebt`: 1 — the carried P2s were deferred as a signal (`SL-015`), which the verdict counts as debt. With the verdict already FAIL on the coverage gate, the debt changes no outcome; the next step for the debt is the remediation above, not another review.
- `cleanSearchProof`: the gate copies, the policy table, the metadata `ask_first` rows and the reducer refinement rule were each read at the cited line and, where executable, exercised.

## 11. Audit Appendix

**Convergence summary.** 5 iterations under `stopPolicy: max-iterations`, `maxIterations: 5`, `convergenceThreshold: 0.1`. `newFindingsRatio` by iteration: 0.0, 0.0, 1.0, 1.0, 0.333. Convergence was never allowed to stop the run early; the cap did. Terminal gate rows: evidence `pass` / `all-findings-cited`, scope `pass` / `all-findings-in-scope`, coverage `fail` / `traceability-incomplete`.

**Coverage summary.** Dimensions 4 of 4 (correctness, security, traceability, maintainability), traceability twice. 46 scope files addressed; the iterative passes read 30 distinct files directly and cited the rest through their anchors.

**Ruled-out claims.** All recorded in the iteration files and deltas, one row per direction, with the evidence that eliminated each.

**Sources reviewed.** `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts`, `lib/scorer/lanes/explicit.ts`, `lib/scorer/fusion.ts`, `lib/subprocess.ts`, `skill-advisor-cli.ts`, `scripts/skill_advisor.py`, `tests/fixtures/deep-loop-offer-cases.json`, both gate suites and the sixth-round suites, `.skilled/commands/deep/` documents and assets, `.skilled/skills/system-deep-loop/` hub files and reducer, `.skilled/changelog/skilled/v4.2.0.0.md`, and the packet's six docs plus its scratch evidence.

**Cross-reference appendix — Core Protocols:** `spec_code` (partial, findings 1), `checklist_evidence` (partial, findings 2-6).
**Cross-reference appendix — Overlay Protocols:** `skill_agent` (notApplicable), `agent_cross_runtime` (notApplicable), `feature_catalog_code` (notApplicable), `playbook_capability` (notApplicable).

Review verdict: FAIL
