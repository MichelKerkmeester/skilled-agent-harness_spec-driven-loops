# Deep Review Report — 012 deep-loop command offers (lineage deepseek-max-3)

- Run: `fanout-deepseek-max-3-1795546920757-7pyjry`, generation 1, lineageMode `new`
- Target: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers` (spec-folder)
- Iterations: 7 of 7 | Stop reason: `maxIterationsReached`
- Executor: cli-pi, model `deepseek-v4.1-flash-1017`, reasoning effort max
- Operator review focus, verbatim: "Traceability: finish the spec_code and checklist_evidence protocols. Check every REQ in spec.md against the code that implements it or the decision that records it, and every ticked task in tasks.md and every Met row in acceptance-criteria.md against evidence that really exists in the tree, including the sixth fix round (REQ-023 to REQ-034, AC-030 to AC-042, ADR-005, ADR-006)."

## 1. Executive Summary

- **Overall verdict: CONDITIONAL**
- `hasAdvisories: false` (advisories are reported only when the verdict is PASS)
- **Active findings: P0 = 0, P1 = 1, P2 = 4** — these are the counts the verdict used (`review-verdict.cjs`, `active_p0:0`, `active_p1:1`, `active_p2:4`, `search_debt:0`, `failed_required_gate_ids:[]`)
- **Self-check outcomes:** the pre-synthesis adversarial re-read (iteration 7) re-checked every active finding at its evidence; all five stand at the same severity. No finding was downgraded, upgraded, resolved or called a false positive, and no P0 existed at any point in the run.
- **Review scope:** 54 files recorded in `deep-review-config.json` `reviewScopeFiles` — the packet's six canonical docs plus `timeline.md`, the advisor gate and its Python fallback, the CLI degraded path, the hook fallback, 20 advisor test files, the shared fixture, the deep-loop reducer and closeout, four deep-loop unit tests, and packet 013's four docs.
- **What the run establishes:** every one of the 48 requirements is mapped to the code, fixture, probe or decision that implements it (iteration 3); both core traceability protocols are executed (spec_code `fail`, checklist_evidence `pass`); the shared fixture's 347 rows agree with the built `dist` gate on all eight audited columns; 126 of 126 ticked-task path citations resolve; 13 of 13 named test titles exist; 56 of 56 acceptance statuses are legal and all three waivers name a real ADR. Eleven of the thirteen sixth-round acceptance rows (AC-030 to AC-042) state behaviour the built gate produces.
- **What keeps the verdict from PASS:** one required P1 requirement (`REQ-033`) is unmet on four records and carries no waiver, and four P2 closure/guard drifts remain. None is a code defect on the served path as of this tree.

## 2. Planning Trigger

`/speckit:plan` **is required**: the verdict is CONDITIONAL and one active P1 remains.

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": [
    {"id": "R1-P1-001", "severity": "P1", "title": "REQ-033's coverage rerun is a required P1 that is neither met nor deferred", "file": "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:257", "dimension": "traceability", "findingClass": "closure-record"},
    {"id": "R1-P2-001", "severity": "P2", "title": "AC-040's evidence cell cites a review report the packet's restart archived", "file": "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:97", "dimension": "traceability", "findingClass": "closure-record"},
    {"id": "R1-P2-002", "severity": "P2", "title": "REQ-031's 'every word list' promise is wider than the drift guard it names", "file": "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:255", "dimension": "maintainability", "findingClass": "instance-only"},
    {"id": "R4-P2-001", "severity": "P2", "title": "The tenth round's citation claim names a checker that does not exist", "file": "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/implementation-summary.md:261", "dimension": "maintainability", "findingClass": "closure-record"},
    {"id": "R6-P2-001", "severity": "P2", "title": "A negated refusal reads as a refusal in both gate copies", "file": ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:766", "dimension": "correctness", "findingClass": "class-of-bug"}
  ],
  "remediationWorkstreams": ["WS-1", "WS-2", "WS-3"],
  "specSeed": ["Name the rerun obligation's owner and its closing condition", "Narrow REQ-031 to the lists the guard owns, or extend the guard", "State which acceptance evidence form is canonical"],
  "planSeed": ["Close or waive REQ-033 with a recorded decision", "Repoint AC-040's evidence tail", "Add a double-negation fixture row and the guard it needs"],
  "findingClasses": ["closure-record", "instance-only", "class-of-bug"],
  "affectedSurfacesSeed": [
    "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md",
    "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md",
    "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/implementation-summary.md",
    "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md",
    ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts",
    ".skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py",
    ".skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json",
    ".skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts"
  ],
  "fixCompletenessRequired": false
}
```

## 3. Active Finding Registry

| ID | Sev | Title | Dimension | File:line | Evidence | Impact | Fix recommendation | Disposition | Class | Scope proof | Affected surfaces |
|---|---|---|---|---|---|---|---|---|---|---|---|
| R1-P1-001 | P1 | REQ-033's coverage rerun is a required P1 that is neither met nor deferred | traceability | `spec.md:257` | `spec.md:228` heads the P1 table "complete OR user-approved deferral"; AC-040 `Unmet`; T084 `[ ]`; CHK-020 `[P0]` `[ ]`; Verification Summary 11/12; `rg REQ-033 decision-record.md` prints nothing | a required P1 has no evidence and no recorded approval, so the packet cannot be closed as complete | close it with a passing rerun, or record an ADR that waives REQ-033 with the operator's approval; either way name the owner | active | closure-record | the P1 table spans `spec.md:228-273` and REQ-033 sits inside it; four records separately mark it open | `spec.md`, `acceptance-criteria.md`, `tasks.md`, `decision-record.md` |
| R1-P2-001 | P2 | AC-040's evidence cell cites a review report the packet's restart archived | traceability | `acceptance-criteria.md:97` | the cell's tail is `review/review-report.md:71`; the live `review/` tree holds no report; the archived copy holds the token at that line | a reader following the citation finds nothing | repoint the tail to `review-archive/20261124T190150Z/review-report.md:71` or to the rerun's own report once it lands | active | closure-record | `review/` was listed and the archive copy read at line 71 | `acceptance-criteria.md`, `review-archive/20261124T190150Z/review-report.md` |
| R1-P2-002 | P2 | REQ-031's "every word list" promise is wider than the drift guard it names | maintainability | `spec.md:255` | 23 exported `readonly string[]` lists in `command-attach.ts`, 22 `VOCABULARY_PAIRS` rows, `SMALL_EDIT_WORDING` (`:462`) unpaired; no Python tuple for it | a one-sided edit of that list fails no test, which contradicts REQ-031 and AC-038 | add the pair with a Python copy, or narrow REQ-031 to the lists the deep-loop gate reads | active | instance-only | every exported list name diffed against every pair name; the two other unpaired exports are derived aggregates | `spec.md`, `acceptance-criteria.md`, `tests/deep-loop-offer-cases.vitest.ts`, `lib/command-attach.ts`, `scripts/skill_advisor.py` |
| R4-P2-001 | P2 | The tenth round's citation claim names a checker that does not exist | maintainability | `implementation-summary.md:261` | the paragraph says a script checks every `Evidence:` tail against the tree; no such checker is in `.skilled/commands`, `.skilled/skills` or the packet `scratch/`; 56 cells still cite `path:line`, and AC-040's does not resolve | a maintainer trusts a check that never runs | drop the claim, or add the checker the paragraph promises | active | closure-record | the paragraph read; 56 tails counted; three roots searched | `implementation-summary.md`, `acceptance-criteria.md`, `tasks.md`, `scratch/` |
| R6-P2-001 | P2 | A negated refusal reads as a refusal in both gate copies | correctness | `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:766` | "do not skip the deep review, run it properly" and "there is no need to skip the deep review" return `asksForLoopRun: false` / `asks_for_loop_run: false`; the control returns true | a reader asking not to skip the loop gets no offer | treat a negation of a skip/avoid/refuse lead as an ask, or record that double negation is out of scope | active | class-of-bug | both copies executed on the same prompts, with a control; `runAskNegatedAt` and `_RUN_ASK_NEGATED_RE` are the only readers | `lib/command-attach.ts`, `scripts/skill_advisor.py`, shared fixture |

No P0 finding exists. No finding is contested or resolved.

## 4. Remediation Workstreams

**WS-1 (P1) — Close or waive the rerun obligation.**
1. Run the traceability rerun the requirement names until its terminal evidence, scope and coverage gates read pass, then set AC-040 `Met` with the rerun report as its evidence and tick T084, the all-tasks box and CHK-020 together.
2. If the operator instead decides the requirement is out of scope, record an ADR that waives REQ-033 and point AC-040 at it, so the P1 rule ("complete OR user-approved deferral") is satisfied either way.

**WS-2 (P2) — Repair the closure records.**
1. Repoint AC-040's `Evidence:` tail at the archived report or at the rerun's report (R1-P2-001).
2. Remove or implement the "a script checks every `Evidence:` tail" claim in the tenth-round paragraph (R4-P2-001); if the checker is added, wire it into the same gate that validates the packet.
3. Decide REQ-031's scope: either add `SMALL_EDIT_WORDING` and its Python twin to `VOCABULARY_PAIRS`, or narrow the requirement to the lists the deep-loop gate reads (R1-P2-002).

**WS-3 (P2, advisory) — Harden the refusal grammar.**
1. Add fixture rows for "do not skip the deep review, run it properly" and "there is no need to skip the deep review" and the guard that makes them asks (R6-P2-001), or record why double negation is out of scope.
2. Keep both copies in step: every change needs the TypeScript list, the Python tuple and the drift-guard row.

## 5. Spec Seed

- REQ-033 should name its owner and its closing condition (a rerun report whose terminal gates read pass), so the requirement cannot sit open without a recorded decision.
- REQ-031 should either enumerate the lists the guard owns or state that only the deep-loop gate's lists are in scope; "every word list" is wider than the tree.
- REQ-034's closure-doc clause should say which evidence form is canonical — a `path:line` tail or a symbol/row-id — because the tenth round claims the second while the tree carries the first.
- The sixth round's refusal rules should state whether a negation of a refusal verb is in scope; REQ-023 lists the refusals but not their negations.

## 6. Plan Seed

- `/speckit:plan` task 1: rerun the traceability review, capture the report, and close AC-040 / T084 / CHK-020 in one edit with the report as evidence.
- `/speckit:plan` task 2: repoint AC-040's evidence tail and re-run the packet validator.
- `/speckit:plan` task 3: decide the `SMALL_EDIT_WORDING` guard question; if extending, edit both gate copies, the fixture and `VOCABULARY_PAIRS`.
- `/speckit:plan` task 4: record the double-negation decision; if fixing, add the two fixture rows, the guard in both copies, and a drift-guard entry.
- `/speckit:plan` task 5: correct the tenth-round paragraph or add the evidence-tail checker it promises.

## 7. Traceability Status

### Core Protocols

| Protocol | Status | Evidence | Unresolved drift |
|---|---|---|---|
| `spec_code` | **fail** | all 48 REQs mapped in `iterations/iteration-003.md`; 44 confirmed against code, fixture, probe or decision, 2 recorded measurements, REQ-031 drift and REQ-033 unmet | R1-P1-001 (REQ-033), R1-P2-002 (REQ-031) |
| `checklist_evidence` | **pass** | `iterations/iteration-005.md`: 126/126 task path citations resolve, 13/13 named test titles exist, 56/56 acceptance statuses legal, 3/3 waivers name a real ADR; the one stale evidence path is on the one `Unmet` row | none beyond R1-P2-001, which the Unmet row carries |

### Overlay Protocols

| Protocol | Status | Evidence |
|---|---|---|
| `skill_agent` | pass | `.skilled/skills/system-deep-loop/SKILL.md:71` and `:104-106` require the advisor projection maps to be drift-guarded, and the packet's fixture plus `deep-loop-offer-cases.vitest.ts:80`/`:497` provide that guard; `deep-review/SKILL.md:145-151` states the three-tier scale this review applies |
| `agent_cross_runtime` | notApplicable | no agent definition is in the 54-file scope and no requirement names one; `.opencode/agents/deep-review.md` is byte-identical to `.skilled/agents/deep-review.md`, and the `.claude` mirror differs only in frontmatter dialect and two runtime path renames |
| `feature_catalog_code` | notApplicable | no feature catalog claims the offer; `rg -l 'Offer From an Advisor Brief'` returns only the two presentation files and the two command documents |
| `playbook_capability` | notApplicable | no manual-testing playbook describes the offer or the deep-loop command gate |

**AC_COVERAGE: disabled.** The signal applies to a Level 2+ spec folder once `checklist.md` exists; this packet carries no `checklist.md` (its verification checklist lives inside `tasks.md`), so the advisory is not computed rather than passed. For reference, the packet's own closure rows read 52 `Met`, 2 `Waived`, 1 `Superseded`, 1 `Unmet` of 56.

## 8. Deferred Items

- The suite totals (`186 files, 3,418 passed`; Python `cases=347, pass=136`; and the earlier rounds' counts) are recorded measurements with commit stamps and were not re-executed: a suite run writes outside this lineage's write surface. A follow-up run with a normal workspace budget should re-run `npx vitest run` and `python3 tests/python/test_skill_advisor.py` and confirm the totals.
- The served-head behaviour for the typed-on-stuck prompt (AC-036) was confirmed by code and fixture, not by a live head run.
- The registry carries no `frontier` object (default depth mode), so there is no exhausted or blocked frontier node to list as follow-up review work.
- **Residual observation, not a filed finding** (the run had already reached its iteration cap when it surfaced): the review reducer's Next Focus writer copies the iteration file's final `Review verdict:` line into the strategy's `## 12. NEXT FOCUS` anchor, because its section extractor reads from the heading to end of file. It is cosmetic — the strategy is still machine-consistent — and the one-line fix is in `reduce-state.cjs`'s section extractor, not in this packet.

## Dimension Expansion Map

- Swept directions: none (default depth mode; no pivots were taken). Completed pivots: 0. Failed pivots: 0. Audited overrides: 0.
- Council artifacts: none.
- Selected review directions across the run: correctness of the sixth-round gate (iteration 1), the brief's trust boundaries (iteration 2), the full requirement sweep (iteration 3), the closure-record layer (iteration 4), the checklist protocol (iteration 5), the sixth round as behaviour (iteration 6), the overlays and the pre-synthesis re-read (iteration 7).
- Remaining frontier: none recorded. This section records breadth only and does not alter the verdict, the registry or the counts above.

## 9. Search Ledger

- **searchCoverage:** required bug classes across the run — `word_rule_gap` (covered, R6-P2-001), `closure_record_drift` (covered, R1-P1-001 / R1-P2-001 / R4-P2-001), `guard_coverage_gap` (covered, R1-P2-002), `command_injection` / `instruction_injection` / `unbounded_input` (ruled out in iteration 2), `parity_gap` and `degraded_render_gap` (ruled out in iteration 6), `skill_claim_drift` / `catalog_claim_drift` / `playbook_claim_drift` (ruled out in iteration 7), `stale_severity` (ruled out in iteration 7). Graph coverage mode: `graphless_fallback`.
- **candidateCoverage:** 347 shared-fixture rows probed against the built gate across eight columns; 49 acceptance evidence cells resolved; 126 task path citations resolved; 13 named test titles verified; 56 acceptance statuses and 3 waivers checked; 69 probe rows read in three files; 247 corpus rows with 31 near-miss.
- **searchDebt:** none. Every ledger row in every delta carries a disposition; nothing is deferred or blocked.
- **ruledOutCandidates:** 18 directions, listed per iteration (three in iteration 1, three in iteration 2, four in iteration 3, three in iteration 4, four in iteration 5, four in iteration 6, three in iteration 7).
- **cleanSearchProof:** the two-copy probe (TypeScript `dist` and the loaded Python module) returning the same answer on the same prompt is the proof used wherever a behaviour claim needed an executable check; 347/347 fixture agreement is the widest such proof in the run.
- `hasSearchDebt: false`.

## 10. Audit Appendix

### Convergence summary

| Iteration | Dimension | New findings | Ratio | Verdict |
|---|---|---|---|---|
| 1 | correctness | 3 (1 P1, 2 P2) | 1.000 | CONDITIONAL |
| 2 | security | 0 | 0.000 | CONDITIONAL |
| 3 | traceability (`spec_code`) | 0 | 0.000 | CONDITIONAL |
| 4 | maintainability | 1 (P2) | 0.111 | CONDITIONAL |
| 5 | traceability (`checklist_evidence`) | 0 | 0.000 | CONDITIONAL |
| 6 | correctness (sixth round) | 1 (P2) | 0.091 | CONDITIONAL |
| 7 | traceability (overlays + re-read) | 0 | 0.000 | CONDITIONAL |

Stop reason: `maxIterationsReached` (7 of 7). Convergence threshold 0.1 with `stopPolicy: max-iterations`; convergence was telemetry only. No iteration failed, so no consecutive-failure stop applied.

### Coverage summary

- Dimensions: correctness, security, traceability and maintainability each covered at least once; traceability covered three times (spec_code, checklist_evidence, overlays).
- Files: 54 scope files; the run read 30 of them directly and probed the shared fixture and the built gate for the rest.
- Requirements: 48 of 48 mapped; acceptance rows: 56 of 56 classified; tasks: 135 boxes classified; ADRs: 8 of 8 relevant ones read (ADR-001 to ADR-008).

### Ruled-out claims

- The gate offers a run for a mode-free plural ask; the no-edit guard wrongly withholds the doctor; AC-030's refusal count drifts; a pasted earlier reply's command is marked typed on the native head; REQ-028 names the wrong parser; the 10,000-unit cut smuggles a second instruction; REQ-020's served-head exception is undocumented; REQ-011's aliases are missing; REQ-012's near-miss rows are not real; REQ-034's Verification Summary disagrees with its boxes; the sixth round's "eleven pairs" is stale; the reducer flattening Next Focus is a defect; five suite totals are contradictory; the feature catalog omits a documented feature; the `.claude` agent mirror drifts; REQ-033 can be closed by this lineage's rerun; a `Met` row rests on a stale pointer; AC-038's twelve-and-ten split is wrong.

### Sources reviewed

`spec.md`, `acceptance-criteria.md`, `tasks.md`, `decision-record.md`, `implementation-summary.md`, `timeline.md`, `review-scope-files.txt`; `.skilled/skills/system-skill-advisor/runtime/{lib/command-attach.ts, lib/subprocess.ts, lib/render.ts, lib/prompt-policy.ts, lib/scorer/lanes/explicit.ts, handlers/advisor-recommend.ts, skill-advisor-cli.ts, schemas/advisor-tool-schemas.ts, scripts/skill_advisor.py}` and its `dist` build; `.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts`; twenty advisor test files and the shared fixture; `.skilled/skills/system-deep-loop/runtime/scripts/{reduce-state.cjs}` and its tests; `.skilled/skills/system-deep-loop/SKILL.md`, `deep-review/SKILL.md`, `hub-router.json`, `ROUTER.md`, the feature catalog; both deep command documents, both presentation files, both YAMLs; `.skilled/changelog/skilled/v4.2.0.0.md`; packet 013's docs; `scratch/probes/*` and `scratch/behaviour/*`.

### Cross-reference appendix — Core Protocols

| Protocol | Result | Notes |
|---|---|---|
| Spec vs Code | fail | 48 REQs mapped; two drifts reported (R1-P1-001, R1-P2-002) |
| Checklist vs Evidence | pass | 126 path citations, 13 test titles, 56 statuses, 3 waivers all resolve |

### Cross-reference appendix — Overlay Protocols

| Protocol | Result | Notes |
|---|---|---|
| SKILL.md vs Agent | pass | the hub's advisor-identity and projection-map rules are satisfied by the packet's drift guard; the severity scale matches |
| Agent Cross-Runtime | notApplicable | no agent definition is in scope; the mirrors differ only by runtime path translation |
| Feature Catalog vs Code | notApplicable | no catalog claims the offer |
| Playbook vs Support | notApplicable | no playbook describes the offer or the gate |
