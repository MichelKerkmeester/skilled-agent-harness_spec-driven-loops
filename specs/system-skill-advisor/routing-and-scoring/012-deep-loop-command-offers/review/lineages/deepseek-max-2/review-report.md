# Deep Review Report - 012 Deep-Loop Command Offers

Lineage: `fanout-deepseek-max-2-1795518961022-7ms9ak` (generation 1, lineage mode `new`)
Target: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers`
Report compiled 2026-11-24 from 7 iterations.

## 1. Executive Summary

- **Overall verdict: PASS**
- **hasAdvisories: true** (5 active P2 findings, no P0 and no P1)
- **Counts the verdict used: P0 = 0, P1 = 0, P2 = 5** (read from `deep-review-findings-registry.json` by `review-verdict.cjs`)
- **Stop reason: `maxIterationsReached`** (`stopPolicy: max-iterations`, `maxIterations: 7`)
- **Terminal gates: evidence pass, scope pass, coverage pass** (`terminal-gates.cjs`, exit 0, no failed required gate)
- **Self-check outcomes:** the adversarial self-check had no active P0 or P1 to adjudicate, so it changed no severity. Each of the five P2 findings carries its typed claim-adjudication packet from the iteration that raised it, and iteration 7 re-read every cited line at the cap.
- **Review scope:** 46 files (`review-scope-files.txt`): the 012 and 013 packet documents, the advisor gate and its Python copy, the served-head handler, the renderer, the two degraded paths, the fixture and eleven test files, and the deep-loop reducer.
- **Operator review focus (verbatim):** Traceability: finish the spec_code and checklist_evidence protocols. Check every REQ in spec.md against the code that implements it or the decision that records it, and every ticked task in tasks.md and every Met row in acceptance-criteria.md against evidence that really exists in the tree, including the sixth fix round (REQ-023 to REQ-034, AC-030 to AC-042, ADR-005, ADR-006).
- **How the focus was covered:** iteration 2 finished `spec_code` across all 39 REQ ids against producers and ADRs; iteration 4 finished `checklist_evidence` across 123 task boxes and 47 criteria rows; iterations 1, 5, 6 and 7 carried the same question into the gate, the reducer and the served head.

## 2. Planning Trigger

`/speckit:plan` is **not required** for this verdict. The run is a PASS with advisories: five P2 findings, no blocker and no missing quality gate. `/create:changelog` is the packet's next step; the advisories below can be scheduled at the operator's discretion.

```json Planning Packet
{
  "triggered": false,
  "verdict": "PASS",
  "hasAdvisories": true,
  "activeFindings": [
    { "id": "R1-P2-001", "severity": "P2", "dimension": "correctness", "title": "A pronoun rerun after a symptom is read as a doctor ask", "file": ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:566" },
    { "id": "R2-P2-001", "severity": "P2", "dimension": "traceability", "title": "AC-041's evidence cell cites three lines that do not hold its content", "file": "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:98" },
    { "id": "R5-P2-001", "severity": "P2", "dimension": "maintainability", "title": "The strategy updater duplicates a machine-owned heading it was meant to normalize", "file": ".skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2394" },
    { "id": "R5-P2-002", "severity": "P2", "dimension": "maintainability", "title": "A direction ruled out once is rendered as a blocked approach that must not be retried", "file": ".skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2363" },
    { "id": "R6-P2-001", "severity": "P2", "dimension": "correctness", "title": "The duplicate-command guard cannot withhold a command", "file": ".skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:412" }
  ],
  "remediationWorkstreams": [
    { "order": 1, "kind": "advisory", "workstream": "Closure-doc pointer correction", "findings": ["R2-P2-001"], "action": "Re-point AC-041's cell and T082 at implementation-summary.md:233, :259, :260 and :261." },
    { "order": 2, "kind": "advisory", "workstream": "Reducer state-format", "findings": ["R5-P2-001", "R5-P2-002"], "action": "Make the anchor replacement drop a heading directly above the marker, and render ruled-out directions apart from exhausted approaches." },
    { "order": 3, "kind": "advisory", "workstream": "Gate edge and dead guard", "findings": ["R1-P2-001", "R6-P2-001"], "action": "Decide whether a pronoun rerun should cancel the doctor reading, and either wire the duplicate-command guard or delete it with its comment." }
  ],
  "specSeed": [
    "Record the pronoun-rerun reading (doctor versus rerun) as a decision row rather than leaving it implicit in the gate.",
    "Give the reducer's strategy contract a stated heading shape so the anchor and heading ownership is written down once."
  ],
  "planSeed": [
    "One lane corrects the AC-041 and T082 citations and re-reads the three limitation lines.",
    "One lane makes reduce-state.cjs's anchor replacement idempotent for a heading-first strategy and separates ruled-out directions from exhausted approaches, with a unit case for each.",
    "One lane either wires the duplicate-command guard in enrichCompiledRoutes or deletes it and its comment."
  ],
  "findingClasses": ["behaviour-edge", "evidence-pointer", "state-format", "state-semantics", "dead-guard"],
  "affectedSurfacesSeed": [
    ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts",
    ".skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts",
    ".skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs",
    "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md",
    "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md"
  ],
  "fixCompletenessRequired": false
}
```

## 3. Active Finding Registry

| ID | Sev | Dimension | Title | File:line | Finding class | Scope proof | Affected surface hints |
|----|-----|-----------|-------|-----------|---------------|-------------|------------------------|
| R1-P2-001 | P2 | correctness | A pronoun rerun after a symptom is read as a doctor ask | `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:566` | behaviour-edge | Both exported predicates exercised on the built copy of the reviewed source | `command-attach.ts:560-572`, `:1414-1424`, `fusion.ts`, `command-attach-guards.vitest.ts` |
| R2-P2-001 | P2 | traceability | AC-041's evidence cell cites three lines that do not hold its content | `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:98` | evidence-pointer | Each cited line printed and compared with the cell's wording | `acceptance-criteria.md:98`, `tasks.md:164`, `implementation-summary.md:233-261` |
| R5-P2-001 | P2 | maintainability | The strategy updater duplicates a machine-owned heading it was meant to normalize | `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2394` (registry row records `:2396`, corrected in iteration 7) | state-format | Reducer re-run left the duplicate in place; the reducer is the only writer of that block | `reduce-state.cjs:2390-2416`, `deep-review-strategy.md` template |
| R5-P2-002 | P2 | maintainability | A direction ruled out once is rendered as a blocked approach that must not be retried | `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2363` | state-semantics | The renderer is the only producer of that section; its three fixed lines appear for four one-pass directions | `reduce-state.cjs:2359-2387`, the iteration prompt's swept-direction guard |
| R6-P2-001 | P2 | correctness | The duplicate-command guard cannot withhold a command | `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:412` | dead-guard | Single writer before the map, none inside it; the false branch keeps prior fields by construction | `advisor-recommend.ts:383-390`, `:409-424`, `render.ts:227` |

Evidence and impact per finding:

- **R1-P2-001** - Impact: a reader who reports a run that did not finish and asks to rerun it with "run it again" gets `/doctor:deep-loop`, while "run 2 more iterations" gets the run. Recommendation: add the pronoun rerun to the run-ask reading or record the doctor-first choice in the decision record. Evidence: observed on the built copy (`isStuckRunComplaint` true, `asksForLoopRun` false, `isRunRefused` false).
- **R2-P2-001** - Impact: AC-041 reads `Met` while its cited lines land one line early and one is blank, so a reader cannot reproduce the observation from the cell. Recommendation: re-point the cell and T082 at `implementation-summary.md:233`, `:259`, `:260`, `:261`. Evidence: the three lines printed and compared.
- **R5-P2-001** - Impact: every strategy rendered heading-first from the shipped template carries each machine heading twice after one reducer pass, and a second pass keeps both. Recommendation: drop a heading immediately above the anchor, or move the heading inside the markers in the template. Evidence: heading count stayed at 2 for the review-dimensions section across two passes (6 headings across three sections).
- **R5-P2-002** - Impact: a direction settled by one pass of evidence is written into the section the iteration prompt says must not be re-entered, with "Repeated iteration evidence" wording that is not true of a single pass. Recommendation: render ruled-out directions in their own block, or state "settled in one pass" and drop "Do NOT retry". Evidence: `deadEnds.concat(ruledOut)` at `:2363` and the three fixed lines at `:2380-2383`.
- **R6-P2-001** - Impact: the guard's comment promises the hub will not offer a command another row already offers, but the set is never extended inside the map and the withholding branch spreads the row first, so the command survives. Recommendation: add to the set as commands are attached, or delete the guard and its comment. Evidence: `alreadyOffered` writers/readers and both branches read line by line.

Every finding above carries `findingClass`, `scopeProof` and `affectedSurfaceHints`, and its typed claim-adjudication packet lives in the iteration that raised it (iterations 1, 2, 5, 5 and 6 respectively).

## 4. Remediation Workstreams

P0: none.

P1: none.

P2 advisories, ordered by user-visible value:

1. **Closure-doc pointer correction (R2-P2-001).** One edit in `acceptance-criteria.md:98` and the matching sentence in `tasks.md:164`. Cheapest fix in the set and the one that unblocks a reader of the closure record.
2. **Reducer state-format (R5-P2-001, R5-P2-002).** Two focused changes in `reduce-state.cjs` with a unit case each: an idempotent anchor replacement, and a rendered separation between a ruled-out direction and an exhausted approach.
3. **Gate edge and dead guard (R1-P2-001, R6-P2-001).** Two decisions rather than two mechanics: whether a pronoun rerun cancels the doctor reading, and whether the duplicate-command guard should be wired or deleted.

## 5. Spec Seed

- Add a decision row for the pronoun rerun reading, so the gate's intent is recorded where its other readings are.
- State the strategy file's heading contract (heading inside the anchor, or heading above it) in the deep-review state documentation, so the reducer and the template agree.
- If the duplicate-command guard is kept, state in the served-head contract that a command is offered at most once across the rendered rows.

## 6. Plan Seed

- Correct AC-041's and T082's line citations, then re-read the three limitation lines to confirm the anchors.
- Make `replaceAnchorSection` idempotent for a heading-first strategy and add a reducer case that asserts one heading per machine section after two passes.
- Separate `ruledOut` from `deadEnds` in `buildExhaustedApproaches`, or relabel the block and drop the "Do NOT retry" wording for a single-pass direction.
- Decide the pronoun-rerun reading and pin it with a guards case either way.
- Decide the duplicate-command guard: wire `alreadyOffered` inside the map, or delete the set and its comment.

## 7. Traceability Status

Core protocols:

| Protocol | Status | Evidence | Unresolved drift |
|----------|--------|----------|------------------|
| `spec_code` | pass | All 39 REQ ids mapped to a producer branch, a test or fixture line, an ADR, or a packet record (iterations 2 and 7) | none |
| `checklist_evidence` | pass | 120 ticked boxes each carry a resolved citation or an explicit N/A rationale; 47 criteria rows read 43 Met, 2 Waived, 1 Superseded, 1 Unmet; all nine cited scratch artifacts exist (iterations 4 and 7) | none |

Overlay protocols: `skill_agent`, `agent_cross_runtime`, `feature_catalog_code` and `playbook_capability` were **not run** in this lineage; each iteration reviewed a canonical dimension, and the overlay set is left out rather than recorded as pending. The one overlay-adjacent surface that was checked is the runtime mirror: mirrors are downstream packaging surfaces and none was read as a source of truth.

AC_COVERAGE: **exempt**. The target is Level 2, but the packet carries no `checklist.md`, which is the gate's precondition.

## 8. Deferred Items

- The overlay traceability protocols (`skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability`) were not exercised. A follow-up run could take them if the packet's next round touches agent, catalog or playbook surfaces.
- The 69-probe harness and the two suites were not re-run: this lineage's write surface could not host the harness, and the packet's own round records are the evidence for those numbers. Iterations 1, 2 and 4 corroborated the parts that can be checked offline (gate behaviour on the built copy, list parity, citation resolution).
- `implementation-summary.md:233` still says "one 203-case fixture" inside the sixth-round paragraph. It is a round-scoped record rather than a current claim, so it is not a finding; a later docs pass may prefer "the 203-case fixture of that round".

## Dimension Expansion Map

- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated directions: none
- Selected review directions: correctness (iteration 1), traceability `spec_code` (2), security (3), traceability `checklist_evidence` (4), maintainability (5), correctness second pass (6), traceability closeout (7)
- Remaining frontier: none recorded (default depth mode; no frontier store)

## 9. Search Ledger

- `searchCoverage.requiredBugClasses` across the run: `state_transition`, `boundary_condition`, `producer_consumer_mismatch`, `spec_to_code_gap`, `stale_evidence_pointer`, `unbacked_waiver`, `injection`, `input_validation`, `unbounded_work`, `prompt_echo`, `state_format_drift`, `stale_comment`, `dead_export`, `unguarded_duplication`, `dead_branch`, `field_loss`, `shadowed_typed_command`, `stale_policy`, `unresolved_citation`, `stale_task_claim`, `missing_evidence_artifact`, `stale_finding_evidence`, `out_of_scope_finding`, `uncovered_dimension`.
- `candidateCoverage.covered`: 20 of those classes were actively searched and cleared; 5 produced findings (`state_transition`, `stale_evidence_pointer`, `state_format_drift`, `dead_branch`, `stale_finding_evidence`).
- `searchDebt`: [] - no deferred or blocked bug class remains.
- `ruledOutCandidates` and `cleanSearchProof`: 19 ledger rows were ruled out with a stated reason (list parity, spawn boundary, label sanitizer, regex cost, prompt echo, ADR backing, citation resolution, scope and coverage), each recorded in its iteration's delta.
- `hasSearchDebt: false`.

## 10. Audit Appendix

### Convergence summary

| Iteration | Dimension | Focus | New findings (P0/P1/P2) | newFindingsRatio |
|-----------|-----------|-------|--------------------------|------------------|
| 1 | correctness | The gate's loop-ask grammar and gate-layer REQs | 0/0/1 | 1.0 |
| 2 | traceability | `spec_code` over REQ-001..REQ-039 | 0/0/1 | 1.0 |
| 3 | security | Trust boundaries, spawn, label, policy | 0/0/0 | 0.0 |
| 4 | traceability | `checklist_evidence` over tasks and criteria | 0/0/0 | 0.0 |
| 5 | maintainability | Reducer strategy contract and comment truth | 0/0/2 | 1.0 |
| 6 | correctness (second pass) | Served head end to end | 0/0/1 | 1.0 |
| 7 | traceability (closeout) | Re-read every filed finding, correct one anchor | 0/0/0 | 0.1 |

Coverage: 4 of 4 configured dimensions; the registry's `convergenceScore` reads 0.9 (the latest iteration's ratio). Stop reason `maxIterationsReached`, with all three terminal gates passing.

### Coverage summary

- 46 scope files; every configured dimension carried a completed pass, and correctness, traceability and the reducer each carried a second pass.
- The iteration cap, not convergence, ended the run: `stopPolicy: max-iterations` makes the ratio signals telemetry only.

### Ruled-out claims

- No list parity drift between the TypeScript gate and the Python fallback: fifteen lists and two numbers agree entry for entry.
- No quadratic gate cost: 96,000- to 100,000-character prompts answer in 0.8-14.4 ms.
- No shell, label or prompt-echo injection path: argv-only spawn, control-byte stripping and a sanitizer that rejects newlines.
- No REQ without a producer, no waiver without an ADR, no ticked task without evidence, no `Met` artifact missing except the AC-041 anchors.
- No dead export and no comment that contradicts its pattern in the changed gate code.

### Sources reviewed

- Packet: `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `decision-record.md`, `implementation-summary.md` (012) and four documents of 013.
- Advisor runtime: `lib/command-attach.ts`, `lib/scorer/lanes/explicit.ts`, `lib/scorer/fusion.ts`, `lib/render.ts`, `lib/subprocess.ts`, `handlers/advisor-recommend.ts`, `skill-advisor-cli.ts`, `schemas/advisor-tool-schemas.ts`, `hooks/lib/skill-advisor-cli-fallback.ts`, `scripts/skill_advisor.py`.
- Tests and fixtures: `tests/fixtures/deep-loop-offer-cases.json`, eleven TypeScript suites, the Python suite.
- Commands and hooks: `.skilled/commands/deep/{review,research}.md`, both presentation assets, `.skilled/hooks/injection-contract.md`.
- Deep-loop runtime: `scripts/reduce-state.cjs`, `scripts/synthesis-closeout.cjs` and their two unit suites.
- Changelog: `.skilled/changelog/skilled/v4.2.0.0.md`.

### Cross-reference appendix

Core Protocols:
- `spec_code` - pass, iterations 2 and 7.
- `checklist_evidence` - pass, iterations 4 and 7.

Overlay Protocols:
- `skill_agent` - not run this lineage.
- `agent_cross_runtime` - not run this lineage.
- `feature_catalog_code` - not run this lineage.
- `playbook_capability` - not run this lineage.

### Execution notes

- This lineage ran its iterations inline as the dispatched executor, as its dispatch required; no nested CLI or sub-agent was spawned.
- Every state record reached the ledger through `append-mode-event.cjs` (9 ledger rows: run-initialized, seven iteration records, terminal gates); the state log was never written directly, and `reduce-state.cjs` refreshed the registry, dashboard and strategy after every iteration.
- The packet lock was acquired only for the synthesis phase; the iterations relied on the gateway's own fencing and a single writer.
- No file outside `review/lineages/deepseek-max-2/` was created or modified by this lineage.
