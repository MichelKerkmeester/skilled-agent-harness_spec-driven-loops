# Deep Review Report - 012-deep-loop-command-offers

Lineage `deepseek-max-1` of the generation-7 traceability rerun. Seven iterations, one dimension per pass, stop reason `maxIterationsReached`.

## 1. Executive Summary

- **Overall verdict: CONDITIONAL**
- **hasAdvisories: false** (the verdict is CONDITIONAL, so the advisory flag does not apply)
- **Active findings: P0 = 0, P1 = 2, P2 = 5** - the counts the verdict used, read from `deep-review-findings-registry.json` after the adversarial self-check refreshed it.
- **Self-check outcomes:** two active P1 rows were re-verified and confirmed at their severity: `R1-P1-001` (scope definition) and `R4-P1-001` (whitespace inside a loop phrase). No finding was downgraded and none was called a false positive.
- **Review scope:** 54 pre-bound files, read against the packet documents; both core traceability protocols (`spec_code`, `checklist_evidence`) executed and passing, four overlay protocols with two passing and two `notApplicable`.
- **Operator review focus:** Traceability: finish the spec_code and checklist_evidence protocols. Check every REQ in spec.md against the code that implements it or the decision that records it, and every ticked task in tasks.md and every Met row in acceptance-criteria.md against evidence that really exists in the tree, including the sixth fix round (REQ-023 to REQ-034, AC-030 to AC-042, ADR-005, ADR-006).
- **Terminal gates:** evidence `pass`, scope `pass`, coverage `pass`. The packet's AC-040 asks exactly for those three rows plus both core protocols complete; this lineage satisfies that, while its two P1 findings keep the verdict CONDITIONAL.

## 2. Planning Trigger

`/speckit:plan` is required: the verdict is CONDITIONAL and two P1 findings carry remediation work.

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": [
    {"id": "R1-P1-001", "severity": "P1", "dimension": "traceability", "title": "The seeded review scope omits the files four requirements change, so spec_code cannot close on them without failing the terminal scope gate", "findingClass": "class-of-bug"},
    {"id": "R4-P1-001", "severity": "P1", "dimension": "correctness", "title": "A doubled space, a tab, a line break or a non-breaking space inside a loop phrase withholds the command, in both gate copies, and no fixture case can catch it", "findingClass": "class-of-bug"},
    {"id": "R1-P2-001", "severity": "P2", "dimension": "traceability", "title": "AC-040 evidence pointer names the live report path that this rerun restart has already archived", "findingClass": "instance-only"},
    {"id": "R2-P2-001", "severity": "P2", "dimension": "traceability", "title": "AC-020 reads Met while its own verification says the evidence it needs is not in the packet", "findingClass": "matrix/evidence"},
    {"id": "R3-P2-001", "severity": "P2", "dimension": "traceability", "title": "AC-044 and T088 still count thirteen plural loop-name rows where the fixture holds twenty-one", "findingClass": "instance-only"},
    {"id": "R6-P2-001", "severity": "P2", "dimension": "maintainability", "title": "The reducer Next Focus projection captures the iteration verdict and flattens the focus block", "findingClass": "class-of-bug"},
    {"id": "R6-P2-002", "severity": "P2", "dimension": "maintainability", "title": "The drift guard compares one regex pattern while the fallback hand-mirrors eighteen", "findingClass": "matrix/evidence"}
  ],
  "remediationWorkstreams": [
    "WS-1 (P1, code): normalise whitespace before the loop-phrase match in both gate copies, and add shared fixture cases for a doubled space, a tab and a line break inside a phrase",
    "WS-2 (P1, scope): extend the packet's review scope so the files REQ-009, REQ-011, REQ-012 and REQ-013 change are inside it, or record an ADR that evidence may be read outside reviewScopeFiles",
    "WS-3 (P2, closure docs): point AC-040 at an archived report path, re-state AC-020's blind-writer clause, and correct the plural row count in AC-044 and T088",
    "WS-4 (P2, loop tooling): stop the Next Focus projection at the block it describes, and widen PATTERN_PAIRS to the grammar templates the fallback mirrors"
  ],
  "specSeed": [
    "REQ-001 gains a clause that a loop phrase matches across any run of whitespace, with fixture rows for a doubled space, a tab and a line break inside the phrase",
    "REQ-013 and AC-020 state how the blind-writer clause is evidenced when the lane report is not kept, or the clause moves to a waiver"
  ],
  "planSeed": [
    "Normalise whitespace once at the top of `attachCommand` and in `_apply_deep_loop_offer_gate`, then re-derive both pattern builders from the normalised text",
    "Add three shared fixture rows per gate copy: doubled space, tab, line break inside `deep review`, `deep research` and `review loop`",
    "Add the twelve omitted change-set paths to the packet's review scope, or adopt the ADR that widens where evidence may be read",
    "Point AC-040 at `review-archive/<timestamp>/review-report.md` and correct the plural row count in AC-044 and T088",
    "Bound the reducer's Next Focus extraction at the block, and add the eight most load-bearing Python grammar templates to PATTERN_PAIRS"
  ],
  "findingClasses": ["class-of-bug", "instance-only", "matrix/evidence"],
  "affectedSurfacesSeed": [
    ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts",
    ".skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py",
    ".skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts",
    ".skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json",
    ".skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts",
    ".skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs",
    "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md",
    "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md",
    "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/review/lineages/deepseek-max-1/review-scope-files.txt"
  ],
  "fixCompletenessRequired": true
}
```

## 3. Active Finding Registry

| ID | Sev | Dimension | Title | File:line | Evidence | Impact | Fix | Disposition | Class | Scope proof | Affected surfaces |
|---|---|---|---|---|---|---|---|---|---|---|---|
| R1-P1-001 | P1 | traceability | The seeded review scope omits the files four requirements change | `spec.md:161` | 54-entry scope against the `### Files to Change` table and `terminal-gates.cjs:168` | A finding on any of twelve declared surfaces reports `findings-out-of-scope` | Widen the scope or record an ADR widening where evidence may be read | open | class-of-bug | anchored on `spec.md` inside the target | deep YAMLs, hub files, corpus files, `dist/`, `compiled/` |
| R4-P1-001 | P1 | correctness | Whitespace inside a loop phrase withholds the command | `command-attach.ts:949` | built-dist probes: six variants return `undefined`; 0 of 347 fixture prompts carry one | A pasted or wrapped request loses the offer | Normalise whitespace before matching, add fixture rows | open | class-of-bug | file inside the seeded scope, claim by probe | `LOOP_REQUEST`, `_LOOP_REQUEST_RE`, mode cues, `ITERATIVE_ASK` |
| R1-P2-001 | P2 | traceability | AC-040's evidence pointer names an archived report path | `acceptance-criteria.md:97` | `review/review-report.md` absent; the cited line lives at `review-archive/20261124T190150Z/review-report.md:71` | The row's evidence breaks at the restart it asks for | Cite the archived path | open | instance-only | both files in the packet | AC-040, T084 |
| R2-P2-001 | P2 | traceability | AC-020 is Met on a clause the tree cannot show | `acceptance-criteria.md:77` | the row's own cell says the lane reports are not kept | A `Met` row rests on judgement | Evidence the blind-writer clause or waive it | open | matrix/evidence | both files in the packet | REQ-013, T047, T092 |
| R3-P2-001 | P2 | traceability | AC-044 and T088 count thirteen plural rows where the fixture holds twenty-one | `acceptance-criteria.md:101` | 21 `plural-*` rows, 16 true, against the stated 13 and 8 | A reader cannot reconcile the row with the tree | Restate the count | open | instance-only | both files in the packet | AC-044, T088 |
| R6-P2-001 | P2 | maintainability | The reducer writes the verdict into Next Focus and flattens it | `deep-review-strategy.md:171` | strategy and dashboard sections after four reducer passes | The focus field misleads its reader | Bound the extraction at the block | open | class-of-bug | reducer in scope, artefacts in the lineage | `reduce-state.cjs` `extractSection`, strategy 12, dashboard 11 |
| R6-P2-002 | P2 | maintainability | The drift guard compares one pattern of eighteen | `deep-loop-offer-cases.vitest.ts:434` | `PATTERN_PAIRS` one entry; 18 `_..._RE` templates in the fallback | A one-sided grammar edit survives both suites | Add the load-bearing templates to the guard | open | matrix/evidence | test file in the seeded scope | `PATTERN_PAIRS`, `_LOOP_REQUEST_RE` and its siblings |

## 4. Remediation Workstreams

**WS-1 - P1, code: whitespace in the loop phrase (`R4-P1-001`).**
1. Collapse whitespace once at the top of `attachCommand` and in `_apply_deep_loop_offer_gate`, before any predicate sees the prompt.
2. Add three shared fixture rows per gate copy for a doubled space, a tab and a line break inside `deep review`, `deep research` and `review loop`.
3. Re-run both suites; the fixture's `asksForLoopRun` column is what the two copies must agree on.

**WS-2 - P1, scope definition (`R1-P1-001`).**
1. Extend the packet's review scope with the twelve declared change-set paths, or
2. Record an ADR that `spec_code` and `checklist_evidence` evidence may be read outside `reviewScopeFiles`, and say so in the packet.
3. Whichever is chosen, the terminal scope gate must be able to pass on a run that reports a defect in `deep-research.yaml`.

**WS-3 - P2, closure documents (`R1-P2-001`, `R2-P2-001`, `R3-P2-001`).**
1. AC-040 cites the archived report path rather than the live one the restart removes.
2. AC-020 evidences the blind-writer clause or moves it to a waiver with an ADR.
3. AC-044 and T088 state 21 rows and 16 true, or name the eight gate rows plus the eight served rows separately.

**WS-4 - P2, loop tooling (`R6-P2-001`, `R6-P2-002`).**
1. Stop the reducer's Next Focus extraction at the block it describes, so the verdict line cannot enter the field.
2. Add the eight most load-bearing Python grammar templates to `PATTERN_PAIRS`.

## 5. Spec Seed

- REQ-001 should say that a loop phrase matches across any run of whitespace, with the three fixture shapes named.
- REQ-013 and AC-020 should state how the blind-writer clause is evidenced, or move it to a waiver backed by an ADR.
- REQ-033's acceptance row (AC-040) should cite an archived report path, because every rerun archives the live one.
- REQ-044's row set should state the plural rows the fixture holds today, not the set it held when the row was written.

## 6. Plan Seed

1. Normalise whitespace in both gate copies and add the fixture rows (`WS-1`).
2. Extend the review scope or adopt the widening ADR (`WS-2`).
3. Correct the three closure cells (`WS-3`).
4. Bound the reducer's Next Focus extraction and widen `PATTERN_PAIRS` (`WS-4`).
5. Re-run the deep review with the same traceability focus and confirm both core protocols still pass and the gates still read pass.

## 7. Traceability Status

**Core protocols**

| Protocol | Status | Evidence | Drift |
|---|---|---|---|
| `spec_code` | pass | All 48 REQ rows resolved across iterations 1 to 3 against the two gate copies, the command assets, the hub files, the fixture and ADR-001 to ADR-008; 24 built-dist probes agreed with the requirement text | None found. REQ-021, REQ-039 and REQ-042 rest on recorded suite output this leaf cannot re-execute, recorded as a limitation rather than a pass |
| `checklist_evidence` | pass | 104 ticked tasks, 52 `Met` rows, 26 CHK boxes resolved by name; 27 fixture row ids, 35 advisor file paths and 14 test titles all exist; six closure counts re-derived, one stale (`R3-P2-001`) | One stale row count, filed |

**Overlay protocols**

| Protocol | Status | Evidence | Drift |
|---|---|---|---|
| `skill_agent` | pass | `mode-registry.json`, `hub-router.json` `routerSignals` and both mode `SKILL.md` files agree on `research` and `review` | None |
| `agent_cross_runtime` | pass | Canonical `.skilled/agents/deep-review.md` with mirrors in five runtime trees, codex in its `.toml` dialect | None |
| `feature_catalog_code` | notApplicable | No catalog entry names the advisor gate or the deep command assets; the packet's change set touches no catalogued component | - |
| `playbook_capability` | notApplicable | No playbook claims the deep-loop offer capability | - |

**AC_COVERAGE:** exempt - the packet carries no `checklist.md`, and the AC coverage signal applies only once that file exists.

## 8. Deferred Items

- The run-level clauses of REQ-021, REQ-039 and REQ-042 (suite count, probe compare, corpus recapture) rest on recorded output; a leaf inside its write containment cannot re-execute them.
- `R6-P2-002` is recorded as a coverage gap rather than an observed divergence: the two copies agree today on 20 vocabulary lists, 2 numbers and the whitespace probe.
- The seven module-only exports in `command-attach.ts` were examined and deliberately not filed: none is unreachable, and counting references would have produced a phantom finding.
- No frontier object exists on this run, so the Deferred Items section carries no follow-up review nodes.

## Dimension Expansion Map

- Saturated directions: none - this run used `convergenceMode: default` and reached its iteration cap instead of diverging.
- Completed pivots: 0. Failed pivots: 0. Audited overrides: 0.
- Selected review directions: traceability (iterations 1, 2, 3, 7), correctness (4), security (5), maintainability (6).
- Remaining frontier: none recorded; `depthMode` is `default`, so no frontier node was seeded.

## 9. Search Ledger

- **searchCoverage:** required bug classes across the run - `requirement_without_code`, `evidence_pointer_stale`, `scope_definition_gap`, `stale_generated_artifact`, `cross_copy_vocabulary_drift`, `whitespace_normalisation`, `adversarial_input_crash`, `catastrophic_backtracking`, `case_folding`, `guard_under_noise`, `policy_escalation`, `command_injection`, `unvetted_degraded_command`, `input_boundary`, `credential_read`, `projection_contamination`, `guard_coverage_gap`, `dead_code`, `duplicate_heading`, `documentation_drift`, `overlay_protocol_gap`, `mirror_drift`, `artefact_inconsistency`, `citation_regression`. Every one is covered or ruled out; `graphCoverageMode: graph`.
- **candidateCoverage:** covered - the same set; no required bug class is missing.
- **searchDebt:** `[]` - no deferred or blocked search obligation, `hasSearchDebt: false`.
- **ruledOutCandidates:** 26 ruled-out directions across the seven iterations, each with the check that cleared it (see the Audit Appendix).
- **cleanSearchProof:** the two core protocols pass, the three terminal gates read pass, and every dimension has at least one full iteration.

## 10. Audit Appendix

**Convergence summary**

| Iteration | Dimension | Findings | newFindingsRatio | Status |
|---|---|---|---|---|
| 1 | traceability | 1 P1, 1 P2 | 1.00 | complete |
| 2 | traceability | 1 P2 | 0.14 | complete |
| 3 | traceability | 1 P2 | 0.14 | complete |
| 4 | correctness | 1 P1 | 0.38 | complete |
| 5 | security | 0 | 0.00 | complete |
| 6 | maintainability | 2 P2 | 0.14 | complete |
| 7 | traceability | 0 | 0.00 | complete |

Stop reason `maxIterationsReached` at iteration 7; convergence was telemetry only under `stopPolicy: max-iterations`.

**Coverage summary**

| Dimension | Covered | Iteration(s) |
|---|---|---|
| correctness | true | 4 |
| security | true | 5 |
| traceability | true | 1, 2, 3, 7 |
| maintainability | true | 6 |

**Ruled-out claims (consolidated)**

- The compiled command contracts are stale - ruled out by digest comparison (31 sources, 0 stale).
- `attachTypedCommand` does not exist - ruled out; exported from `handlers/advisor-recommend.ts:442`.
- The council words returned to the gate - ruled out; `explicit.ts:151` keeps them for the `/speckit:ai-council` cue only.
- The TypeScript and Python word lists drift - ruled out; 20 lists compare entry for entry.
- The routing baseline is stale - ruled out; `capturedAt` is the pinned scoring date, not the capture time.
- The Python head cuts at a different length - ruled out; it counts JavaScript code units.
- A single ruling is written as permanently blocked - ruled out; `MIN_BLOCKED_ATTEMPTS` is 2.
- A task cites a test title that does not exist - ruled out; the title exists at `command-attach-guards.vitest.ts:803`.
- A task cites a fixture row that no longer exists - ruled out; all 27 resolve.
- A `Waived` row is unbacked - ruled out; ADR-002 and ADR-003 exist.
- The Verification Summary drifts from the boxes - ruled out; 12 P0 / 13 P1 / 1 P2 with one P0 open.
- Code comments carry ephemeral artifact labels - ruled out; zero hits across 35 in-scope code files.
- The gate throws or hangs on adversarial input - ruled out; 11 shapes, none threw, slowest 13.5 ms, and five backtracking shapes stayed linear.
- The gate is case-sensitive - ruled out; upper and title case both serve the command.
- A double space anywhere breaks the gate - ruled out; only whitespace inside the phrase does.
- The scorer's normalisation covers the gate - ruled out; the gate reads the un-normalised prompt.
- A shell metacharacter can inject into the served command - ruled out; 1,780 calls produced zero off-table commands.
- A deep command can be served with policy `run` - ruled out; all four `/deep` rows read `ask`.
- The degraded brief serves an unvetted command - ruled out; `trackedCommandForOwner` gates it.
- A prompt over the cap breaks the hook - ruled out; the hook truncates at the schema boundary.
- A changed surface reads a credential or user data - ruled out; only repository files are read.
- The strategy gains a second heading with one number - ruled out; section 12 appears once.
- Seven module-only exports are dead code - ruled out on reachability.
- The two gate copies have already drifted - ruled out.
- The codex runtime is missing its agent mirror - ruled out; `.codex/agents/deep-review.toml`.
- The overlay protocols are unfinished so coverage cannot close - ruled out; two ran, two `notApplicable` with reasons.
- The lineage lost an iteration or a delta - ruled out; one narrative and one delta per iteration.

**Cross-reference appendix - core protocols**

- `spec_code`: 48 requirement rows, each resolved to a symbol, a test title, a fixture row or a decision record; evidence carried in `iteration-001.md` and `iteration-002.md`.
- `checklist_evidence`: 104 tasks, 52 `Met` rows, 26 CHK boxes; evidence carried in `iteration-003.md` and re-resolved in `iteration-007.md`.

**Cross-reference appendix - overlay protocols**

- `skill_agent`: `mode-registry.json`, `hub-router.json`, both mode packets.
- `agent_cross_runtime`: five runtime agent trees plus the crosswalk.
- `feature_catalog_code`: `notApplicable`, with the reason recorded.
- `playbook_capability`: `notApplicable`, with the reason recorded.

**Repair recorded at closeout:** six delta files (`deltas/iter-002.jsonl` to `iter-007.jsonl`) were written without their canonical iteration record as the first line. At synthesis each file was rewritten with that record prepended and every existing row preserved in place and order, so every delta now opens with its own iteration record. No finding, classification or ruled-out row was altered or dropped, and the reducer re-run after the repair kept the registry at the same seven open findings.

**Sources reviewed:** the 54 files in `review-scope-files.txt`, the five packet documents, ADR-001 to ADR-008, packet 013's closure documents, the shared fixture, the routing corpus and baseline, both compiled command contracts, and the built advisor `dist` used for the behavioural probes.

**Review verdict: CONDITIONAL**
