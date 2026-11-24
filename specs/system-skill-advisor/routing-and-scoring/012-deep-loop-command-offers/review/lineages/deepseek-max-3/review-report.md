# Deep Review Report - 012-deep-loop-command-offers (lineage deepseek-max-3)

Lineage `deepseek-max-3` of a three-lineage fan-out. Seven iterations, stop policy `max-iterations`, stop reason `maxIterationsReached`. Target: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers` (spec folder, Level 2).

## 1. Executive Summary

- **Overall verdict:** CONDITIONAL
- **hasAdvisories:** false (the verdict is not PASS; four P2 findings are active)
- **Active findings:** P0=0, P1=1, P2=4 -- these are the counts the verdict used, read from `deep-review-findings-registry.json` after the final reducer pass
- **Self-check outcomes:** R1-P1-001 was re-read and re-executed at its cited lines on both gate copies in iteration 7 and confirmed at P1; no finding was downgraded or called a false positive. The four P2 findings were re-read and confirmed as they stand.
- **Review scope:** 77 files listed in `review-scope-files.txt`, covering the advisor gate in both languages and its tests, the deep command documents and assets, the hub routing files, the review reducer and its tests, the packet's own docs, packet 013's closure rows, and the feature catalog, playbook and module README. All four configured dimensions were covered: correctness (iteration 1), security (iteration 2), maintainability (iteration 3), traceability (iterations 4 to 7).
- **Operator review focus (verbatim):** "Lead with traceability: finish spec_code and checklist_evidence. Check every REQ in spec.md against its code or decision, and every ticked task in tasks.md and Met row in acceptance-criteria.md against real evidence, including the thirteenth round (T115 onward). Cover all four dimensions before the last iteration: correctness, security and maintainability one iteration each within iterations 1 to 4, the rest traceability. Write no gateClass on protocol results: the reducer assigns hard to the two core protocols and advisory to the overlays. File findings only on files in review-scope-files.txt, with full repo-relative paths, never bare file names. A defect in an unlisted file goes under Edge Cases. Do not write a terminal_gates row: the orchestrator computes it after the run."

### What this lineage found

The packet's gate, its two copies, its tests and its closure records were checked end to end. The two served copies agree on all 368 shared fixture prompts and on 72 hand-built prompts, run through both implementations. Five defects remain:

1. **R1-P1-001 (P1, correctness):** a plain question about the loop still serves `/deep:review` when its auxiliary or its "how long" shape is outside the question grammar, in both copies.
2. **R3-P2-001 (P2, maintainability):** the feature catalog and the module README omit the routed-mode substitution, describing a routed route as serving the route's mode.
3. **R4-P2-001 (P2, traceability):** REQ-047's "both copies serve no run row for an ask that names no mode" does not hold on a routed single-target route; the Python gate drops the row and the native gate keeps the routed mode's command.
4. **R5-P2-001 (P2, traceability):** AC-009, AC-030 and AC-037 state final-tree suite counts (841 tests, 359 cases) the tree no longer has (368 cases; 187 files, 3,557 passed on the thirteenth round).
5. **R6-P2-001 (P2, traceability):** the v4.2.0.0 changelog's suite row quotes the eleventh round's 186 files / 3,518 passed / 359 cases as the release total, and AC-029 reads `Met` on it.

## 2. Planning Trigger

`/speckit:plan` is **required**: the verdict is CONDITIONAL, one P1 remains active, and two core traceability protocols are recorded as `fail` (they ran to completion and found contradictions).

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": {"P0": 0, "P1": 1, "P2": 4},
  "remediationWorkstreams": [
    "W1 question grammar: extend the question reading and add fixture rows (R1-P1-001)",
    "W2 routed-branch parity: make the routed branch honour the no-mode rule or record the divergence as intended (R4-P2-001)",
    "W3 routed-mode docs: name routedLoopMode in the catalog and the module README (R3-P2-001)",
    "W4 closure counts: restate AC-009/AC-030/AC-037 and the changelog row against the last run (R5-P2-001, R6-P2-001)"
  ],
  "specSeed": [
    "REQ-016 states a general rule its examples do not cover; name the question shapes the gate reads, including how-long and the modal auxiliaries",
    "REQ-047 and REQ-042 need one sentence saying which copy's rule wins on a routed single-target route"
  ],
  "planSeed": [
    "Add the missing question shapes to LOOP_QUESTION_AUXILIARIES and LOOP_QUESTION (and the Python copies), with fixture rows in both suites",
    "Decide the routed-branch rule, then make both copies and the servedRun fixture column exercise it",
    "Update the catalog and README sentences for routedLoopMode",
    "Restate the three acceptance cells and the changelog row with the current run's counts, or scope them to their round"
  ],
  "findingClasses": {"class-of-bug": 2, "instance-only": 3},
  "affectedSurfacesSeed": [
    "command-attach.ts LOOP_QUESTION_AUXILIARIES / LOOP_QUESTION / routedLoopMode",
    "skill_advisor.py _LOOP_QUESTION_AUXILIARY_LIST / _LOOP_QUESTION_RE / _apply_deep_loop_offer_gate",
    "tests/fixtures/deep-loop-offer-cases.json and both suites",
    "feature-catalog/cli-surface/advisor-recommend.md and runtime/lib/README.md",
    "acceptance-criteria.md AC-009, AC-030, AC-037, AC-029 and changelog v4.2.0.0 row 759"
  ],
  "fixCompletenessRequired": true
}
```

## 3. Active Finding Registry

| ID | Severity | Title | Dimension | File:line | Finding class | Scope proof | Affected surfaces | Disposition |
|----|----------|-------|-----------|-----------|---------------|-------------|-------------------|-------------|
| R1-P1-001 | P1 | A plain question about the loop still serves `/deep:review` when its auxiliary or its "how long" shape is outside the question grammar | correctness | `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1236` | class-of-bug | Gate in target and scope; both copies executed on the prompts | `LOOP_QUESTION_AUXILIARIES`, `LOOP_QUESTION`, Python copies, fixture, README and catalog | active |
| R3-P2-001 | P2 | Both in-scope docs omit the routed-mode substitution | maintainability | `.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md:33` | instance-only | Both docs in scope; rule at `command-attach.ts:1747` | catalog paragraph and row 63; README row 146 | active |
| R4-P2-001 | P2 | REQ-047's both-copies clause does not hold on a routed single-target route | traceability | `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1747` | class-of-bug | Gate and fixture in scope; both copies executed | `routedLoopMode`, `_apply_deep_loop_offer_gate`, `servedRun` fixture column | active |
| R5-P2-001 | P2 | Three acceptance rows state final-tree suite counts the tree no longer has | traceability | `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:66` | instance-only | Acceptance file in scope; counts checked against the fixture and AC-028 | AC-009, AC-030, AC-037; T121 | active |
| R6-P2-001 | P2 | The changelog's suite row quotes the eleventh round's counts as the release total | traceability | `.skilled/changelog/skilled/v4.2.0.0.md:759` | instance-only | Changelog in scope; count checked against the thirteenth round | changelog row 759; AC-029 | active |

Evidence for each finding, including the claim-adjudication packet for R1-P1-001, is in `iterations/iteration-001.md` to `iteration-006.md`.

## 4. Remediation Workstreams

**W1 -- question grammar (P1, R1-P1-001).** Add the missing question shapes to the shared question reading in both copies: a `how long` alternative and the modal auxiliaries the list omits (`will`, `has`, `have`, `might`, `must`, `shall`, `was`, `were`). Add one fixture row per shape and one guard case, then re-run both suites. Fix completeness: the bug class is the closed question vocabulary; the producer is the one regex pair, so the same-class inventory is those two files plus their fixture rows.

**W2 -- routed-branch parity (P2, R4-P2-001).** Decide whether a routed route may serve a mode the ask never names. If it may, state that in REQ-047 and pin it with a fixture row on a routed route; if it may not, make `routedLoopMode` return undefined when the ask names no mode and extend the `served run` test to a routed route.

**W3 -- routed-mode docs (P2, R3-P2-001).** Add one sentence naming `routedLoopMode` to the catalog paragraph and the README row.

**W4 -- closure counts (P2, R5-P2-001 and R6-P2-001).** Restate AC-009, AC-030 and AC-037 and the changelog row against the last recorded run, or date each cell to its round as AC-042 does.

## 5. Spec Seed

- REQ-016: replace "a question about the loop" with the shapes the gate reads, and say what a question outside those shapes does.
- REQ-047/REQ-042: one sentence on the routed single-target route when the ask names no mode.
- REQ-022: say whether "the final suite count" means the last run on the tree or the run at the time of writing.

## 6. Plan Seed

- Task: extend `LOOP_QUESTION_AUXILIARIES` and `LOOP_QUESTION` in `command-attach.ts` and `_LOOP_QUESTION_AUXILIARY_LIST`/`_LOOP_QUESTION_RE` in `skill_advisor.py`; add shared fixture rows and a guards case.
- Task: settle the routed-branch rule and update `routedLoopMode`, the fixture's `servedRun` coverage and REQ-047.
- Task: update the catalog and README sentences for the routed rule.
- Task: restate the three acceptance cells and the changelog row.
- Verify: both suites green, the new fixture rows read their columns in both copies, and `validate.sh <packet> --strict` prints `RESULT: PASSED`.

## 7. Traceability Status

**Core protocols**

| Protocol | Status | Evidence | Drift |
|----------|--------|----------|-------|
| `spec_code` | fail | 59 REQs mapped; `command-attach.ts:1213`, `:1727`, `:1747`, `explicit.ts:454`, `fusion.ts:1064`, `command-attach.ts:313`, `reduce-state.cjs:1014`, `:2392`, the corpus rows and the four command assets | REQ-016 contradicted by R1-P1-001; REQ-047 partly by R4-P2-001; REQ-022 by R6-P2-001 |
| `checklist_evidence` | fail | 122 tasks and 67 AC rows checked; evidence tails resolve (`problems=0`); CHK counts match; fixture counts match AC-030/AC-031/AC-044/AC-046 | R5-P2-001: three `Met` rows rest on stale final-tree counts |

**Overlay protocols**

| Protocol | Status | Evidence |
|----------|--------|----------|
| `feature_catalog_code` | pass | catalog paragraph, doctor row and shared-file row match the code; the routed-mode omission is R3-P2-001 |
| `skill_agent` | pass | both mode `SKILL.md` files carry their changes and name no workflow the agent cannot run |
| `agent_cross_runtime` | notApplicable (`applicable: false`) | no agent definition or runtime mirror in the change set or the scope |
| `playbook_capability` | pass | NC-012 procedure, expected signals and failure triage match the gate |

**AC_COVERAGE:** exempt. The packet has `acceptance-criteria.md` but no `checklist.md`, so the validation signal does not apply; the acceptance table is the closure gate and is reviewed as `checklist_evidence`.

## 8. Deferred Items

- REQ-033 / AC-040 (the review rerun itself) and T084 are open by design; this lineage's own protocols are recorded above and the orchestrator computes the terminal gates.
- The three named mode-free prompts ("run a deep loop on the cache layer" and its two siblings) route deferred in the observed run, so R4-P2-001 is a latent difference until a routed single-target route reaches a mode-free ask.
- The advisor `dist` is gitignored and outside the review scope; its freshness is taken from the recorded probe runs, not re-checked here.
- REQ-007's mirror and reference checks are scripts outside the scope; their recorded output is the evidence.
- `dimensionCoverageGate` failed at the final convergence check with no dimension missing: `traceabilityCovered` is false because both core protocols are `fail`. At the cap the stop is forced with that gate recorded as synthesis evidence.

## Dimension Expansion Map

- Saturated directions: none. All four dimensions were covered once; traceability was revisited in iterations 4 to 7 by design, not because it saturated.
- Completed pivots: 0. Failed pivots: 0. Audited overrides: 0.
- Remaining frontier: none recorded (default depth mode, no frontier store).
- Breadth only: this section does not alter the verdict, the registry or the self-check.

## 9. Search Ledger

*No search-depth state captured (legacy v1 record).* The run used the v1 iteration-record contract; `searchCoverage`, `candidateCoverage`, `searchDebt` and `ruledOutCandidates` are empty, `hasSearchDebt` is false, and no bug-class row is deferred or blocked. Ruled-out directions are listed in the Audit Appendix.

## 10. Audit Appendix

**Convergence summary.** Seven iterations, each `complete`. Dimension coverage 4 of 4. Convergence score 0.25 at the final pass; the stop was forced by the iteration cap (`maxIterationsReached`), not by convergence, and the coverage gate was the one blocker recorded with it.

**Coverage summary.** 77 scope files; the gate, its tests, the docs, the hub routing files, the reducer and the packet's own records were read. The 368-case fixture was executed through both copies (0 divergences) and 72 further prompts were run through both (0 divergences). Probe, suite and corpus reruns were not re-executed: each writes outside the lineage's write surface, so their recorded output is the evidence.

**Ruled-out claims.**

- The bare loop name `deep loop` opens the gate -- no; it needs a use, continue or want verb (ADR-006).
- A statement naming the loop is a false offer -- no; the packet defines naming `deep research` or `deep review` as an ask.
- The `how many` question shape is broken -- no; both rows withhold in both copies.
- The docs still state the pre-T121 no-edit rule -- no; all three name the read-only exception.
- A prompt can inject a line into the brief -- no; the brief renders typed fields only.
- A child process can attach an arbitrary command -- no; both paths read one owner check.
- A child session can start an ask-policy run -- no; the policy word is parent-named for a child.
- The Verification Summary miscounts the CHK boxes -- no; 12/13/1 matches.
- A waiver names a missing ADR -- no; ADR-001, ADR-002, ADR-003 and ADR-009 exist.
- The changelog states the pre-build refusal rule -- no; rows 482 to 484 state it as built.
- Packet 013 has no degraded-path evidence -- no; its implementation summary row names both heads.
- A seventh-iteration finding was missed -- no; both active code findings re-executed and the counts re-read.

**Cross-reference appendix -- Core Protocols.** `spec_code`: 59 REQs mapped, two contradictions and one closure contradiction recorded. `checklist_evidence`: 122 tasks and 67 AC rows, three stale cells recorded.

**Cross-reference appendix -- Overlay Protocols.** `feature_catalog_code` pass; `skill_agent` pass; `agent_cross_runtime` not applicable; `playbook_capability` pass.

**Sources reviewed.** `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `decision-record.md`, `implementation-summary.md`, packet 013's spec/plan/tasks/implementation-summary; `command-attach.ts`, `skill_advisor.py`, `explicit.ts`, `fusion.ts`, `advisor-recommend.ts`, `subprocess.ts`, `skill-advisor-cli.ts`, `skill-advisor-brief.ts`, `render.ts`, `reduce-state.cjs`, `synthesis-closeout.cjs`; the fixture, both suites and the Python suite; the two deep command documents, both presentation files and both YAML assets; `hub-router.json`, `ROUTER.md`, `SKILL.md`, `graph-metadata.json`, `quick-reference.md`; the feature catalog, the playbook and the module README; `.skilled/changelog/skilled/v4.2.0.0.md`.
