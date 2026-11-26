# Deep Review Report - 012 Deep-Loop Command Offers

Run: `fanout-deepseek-max-2-1795544069299-46zw3s` (lineage `deepseek-max-2`, generation 6) | 7 iterations | stop reason `maxIterationsReached`.

## 1. Executive Summary

**Overall verdict: FAIL**

- **hasAdvisories**: false (the verdict is FAIL, so advisories are not the reason it stops).
- **Active findings, as the verdict used them**: P0 = 0, P1 = 0, P2 = 12. These are the counts `review-verdict.cjs` read from `deep-review-findings-registry.json` after the last reducer pass, with the terminal-gates row in the state log.
- **Why FAIL with no P0 and no P1**: the coverage terminal gate fails. `terminal-gates.cjs` reads `evidence: pass`, `scope: pass`, `coverage: fail` with reasonCode `traceability-incomplete`, because both core traceability protocols ran to completion but did not settle: the packet's requirement text and acceptance evidence are still out of step with the tree. A required quality gate failing at the terminal stop is a FAIL in this workflow, not an advisory.
- **Self-check outcomes**: this run raised no P0 or P1 candidate, so the Hunter/Skeptic/Referee pass had nothing to adjudicate. The twelve P2 findings were classified directly from file evidence; none was downgraded or marked a false positive, and the final pass re-read the sixteen failing acceptance cells without changing a severity. One count correction is recorded: an earlier pass named fourteen failing cells, the final pass names sixteen.
- **Review scope summary**: 51 pre-bound files (10 advisor runtime sources, 17 advisor tests and fixtures, 6 deep-loop runtime sources and tests, 4 command documents, 2 repo docs, 6 packet-012 docs, 4 packet-013 docs), reviewed across four dimensions: `correctness` (iteration 1), `traceability` (iterations 2, 3, 6, 7), `security` (iteration 4) and `maintainability` (iteration 5).
- **Operator review focus** (verbatim): Traceability: finish the spec_code and checklist_evidence protocols. Check every REQ in spec.md against the code that implements it or the decision that records it, and every ticked task in tasks.md and every Met row in acceptance-criteria.md against evidence that really exists in the tree, including the sixth fix round (REQ-023 to REQ-034, AC-030 to AC-042, ADR-005, ADR-006).

What the run found, in one sentence: the gate, the two degraded paths, the render rule and the reducer all behave as the packet's requirements and decisions say they do, while the packet's own record of itself has drifted — two requirement statements no longer match the tree, sixteen acceptance cells cite counts or lines that do not hold, and the reducer writes duplicate section numbers into every strategy file.

## 2. Planning Trigger

`/speckit:plan` is required. The verdict is FAIL on the coverage gate, and the remediation is a documentation and evidence repair pass over `spec.md` and `acceptance-criteria.md`, plus one runtime fix in the deep-review reducer. None of the work changes the offer gate's behaviour.

```json
{
  "triggered": true,
  "verdict": "FAIL",
  "hasAdvisories": false,
  "activeFindings": 12,
  "remediationWorkstreams": [
    {
      "id": "R-1",
      "priority": "P2",
      "title": "Re-pin the acceptance evidence to the tree",
      "findingIds": ["R1-P2-002", "R1-P2-003", "R3-P2-005", "R3-P2-006", "R3-P2-007"],
      "scope": ["specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md"],
      "fixCompleteness": "one printed line per corrected citation"
    },
    {
      "id": "R-2",
      "priority": "P2",
      "title": "Restate the counts the packet quotes",
      "findingIds": ["R1-P2-001", "R3-P2-001", "R3-P2-002", "R3-P2-003", "R3-P2-004"],
      "scope": ["specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md", "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md"],
      "fixCompleteness": "each count recomputed from the file it describes and written into the cell"
    },
    {
      "id": "R-3",
      "priority": "P2",
      "title": "Amend REQ-012 to ADR-001's five-row check",
      "findingIds": ["R2-P2-001"],
      "scope": ["specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md"],
      "fixCompleteness": "the requirement states the live check and names ADR-001"
    },
    {
      "id": "R-4",
      "priority": "P2",
      "title": "Fix the reducer's strategy section numbering",
      "findingIds": ["R5-P2-001"],
      "scope": [".skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs", ".skilled/skills/system-deep-loop/deep-review/assets/deep-review-strategy.md"],
      "fixCompleteness": "one heading per section number in a freshly produced strategy, with a regression case"
    }
  ],
  "specSeed": [
    "REQ-012 restated as the five-row near-miss id check ADR-001 decided, with the ADR named in the requirement text as REQ-011 and REQ-035 already do",
    "REQ-031 restated from the drift guard's actual surface: twenty-two compared lists, twelve with a per-entry case, ten compared without one, each list named",
    "A requirement that the acceptance evidence cell prints the line it cites, so a count or an anchor cannot drift again unseen"
  ],
  "planSeed": [
    "Recompute and rewrite every count quoted in the acceptance table from the file it describes: the fixture's case count, the doctor-row count, the multi-typed row count, the suite counts and the changelog's own counts",
    "Reprint every `path:line` citation in AC-033, AC-034, AC-036, AC-037, AC-044, AC-045, AC-046 and AC-038 and correct the ones that do not hold their claim",
    "Amend REQ-012 in spec.md and cite ADR-001; keep AC-019 `Superseded`",
    "Change the reducer's four machine section headings to the template's numbers, or renumber the template to match, and pin the result with a heading regression case",
    "Rerun the advisor suite, the Python suite and the probe set after the documentation pass, then rerun `/deep:review` with traceability as its focus so this coverage gate can pass"
  ],
  "findingClasses": [
    "specification-accuracy",
    "evidence-traceability",
    "specification-decision-divergence",
    "stale-measurement",
    "overstated-evidence",
    "evidence-anchor-drift",
    "reducer-output-defect"
  ],
  "affectedSurfacesSeed": [
    "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md (REQ-012, REQ-031)",
    "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md (AC-009, AC-019, AC-028 to AC-034, AC-036 to AC-038, AC-042, AC-044 to AC-046)",
    ".skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs (section writers)",
    ".skilled/skills/system-deep-loop/deep-review/assets/deep-review-strategy.md (section numbers)"
  ],
  "fixCompletenessRequired": true
}
```

## 3. Active Finding Registry

| ID | Sev | Title | Dimension | file:line | findingClass | Disposition |
|----|-----|-------|-----------|-----------|--------------|-------------|
| R1-P2-001 | P2 | REQ-031 and AC-038 describe fifteen compared lists and ten per-entry lists; the drift guard compares twenty-two and pins twelve | correctness (operator focus) | `spec.md:243`, `acceptance-criteria.md:95` | specification-accuracy | active |
| R1-P2-002 | P2 | AC-036 cites evidence lines that do not hold the typed-on-stuck evidence it claims | correctness (operator focus) | `acceptance-criteria.md:93` | evidence-traceability | active |
| R1-P2-003 | P2 | AC-037 cites the wrong lines for the bounded window and the fixture-parity suite | correctness (operator focus) | `acceptance-criteria.md:94` | evidence-traceability | active |
| R2-P2-001 | P2 | REQ-012 still states the superseded six-row near-miss check, and its only acceptance row is Superseded | traceability | `spec.md:224` | specification-decision-divergence | active |
| R3-P2-001 | P2 | Five acceptance cells quote the Python fixture count as 285 while the tree holds 347 cases | traceability | `acceptance-criteria.md:66` | stale-measurement | active |
| R3-P2-002 | P2 | AC-029 and AC-028 quote suite counts the cited changelog row does not carry | traceability | `acceptance-criteria.md:86` | stale-measurement | active |
| R3-P2-003 | P2 | AC-031 counts 26 doctorWithheld fixture rows; the fixture carries 47 | traceability | `acceptance-criteria.md:88` | stale-measurement | active |
| R3-P2-004 | P2 | AC-032 says four multi-typed rows pin both loops in both orders; two of the four pin one loop against a non-loop command | traceability | `acceptance-criteria.md:89` | overstated-evidence | active |
| R3-P2-005 | P2 | AC-033's mode-cue anchor lands inside commandOnlyMentioned, not on the loop that skips a subject-read mode name | traceability | `acceptance-criteria.md:90` | evidence-anchor-drift | active |
| R3-P2-006 | P2 | AC-034's Python anchor is a blank line; the stage-one copy it names is 250 lines further down | traceability | `acceptance-criteria.md:91` | evidence-anchor-drift | active |
| R3-P2-007 | P2 | Three cells in the sixth-round range pin fixture rows eight to thirteen lines away from where they now sit | traceability | `acceptance-criteria.md:101` | evidence-anchor-drift | active |
| R5-P2-001 | P2 | The reducer renumbers four machine sections, so every template-derived strategy ends with two section 4, 5, 9 and 11 headings | maintainability | `reduce-state.cjs:2580` | reducer-output-defect | active |

Evidence, impact and fix for each finding:

- **R1-P2-001.** Evidence: `VOCABULARY_PAIRS` holds twenty-two pairs (`deep-loop-offer-cases.vitest.ts:81` to `:102`); the per-entry guard covers twelve lists (`:300`, `:308`, `:315`, `:324`, `:333`, `:338`, `:346`, `:355`, `:365`); AC-038 pins the pairs to `:68` (a blank line) and `:303` (a per-entry assertion). Impact: a maintainer cannot tell from REQ-031 which lists lack per-entry coverage. Fix: restate REQ-031 and AC-038 from the guard's actual surface. Scope proof: both cells and the test are inside the declared target, and both were read at the named ranges. Surfaces: `spec.md` REQ-031, `acceptance-criteria.md` AC-038, the drift guard.
- **R1-P2-002.** Evidence: `typed-on-stuck-serving.vitest.ts:107` is `} else {`; the assertion is at `:111` to `:114`. `skill_advisor.py:5482` is the command-ask lead construction, not the typed-run row. Impact: REQ-029's `Met` rests on evidence that is not where the cell says. Fix: re-pin both citations. Scope proof: the cell and both files are inside scope; both lines printed. Surfaces: AC-036, the serving test, the Python gate.
- **R1-P2-003.** Evidence: `command-attach.ts:641` is a comment inside `namesDeepRun` (`LEAD_WINDOW` is at `:748`); `skill_advisor.py:5009` is `"did"` (`_LEAD_WINDOW` is at `:5181`); `test_skill_advisor.py:3017` is an `except` clause (the parity test is at `:2854`). Impact: a reader changing the window finds neither copy's constant. Fix: re-pin all three. Scope proof: cell and all four files inside scope; each line printed. Surfaces: AC-037, the two window constants, the Python parity test.
- **R2-P2-001.** Evidence: `command-prompts.jsonl` holds 247 rows and 31 `near-miss` rows, none carrying N7, N9, D1, V7, H6 or A3; ADR-001 decided the replacement five-row id check, and all five ids plus the positive D1 row exist and match their probe prompts. Impact: a P1 requirement and its only acceptance row disagree about what is required. Fix: amend REQ-012 to the five-row check and name ADR-001. Scope proof: requirement, row, ADR and corpus inside scope; every id looked up. Surfaces: `spec.md` REQ-012, AC-019, ADR-001, the corpus.
- **R3-P2-001.** Evidence: the fixture holds 347 cases; the parity test reports `cases=len(cases)`; the changelog records "347 shared cases"; five cells say 285. Impact: the final Python count is wrong in five places. Fix: write 347, or the count the suite prints at the moment of the fix. Scope proof: cells and fixture inside scope; count produced from the fixture. Surfaces: AC-009, AC-028, AC-030, AC-037, AC-042.
- **R3-P2-002.** Evidence: `v4.2.0.0.md:759` reads "186 files, 3,415 passed, 4 skipped, none failed ... 347 shared cases"; AC-029 says the row quotes 184 files and 3,188 passed, and AC-028 repeats 184/3,188 while AC-048 records 186/3,415. Impact: two final figures for one tree. Fix: correct AC-028 and AC-029 to the row's own numbers. Scope proof: cells and the changelog line inside scope; line printed. Surfaces: AC-028, AC-029, AC-048, the changelog.
- **R3-P2-003.** Evidence: the fixture carries 47 `doctorWithheld` rows; AC-031 says 26. Impact: understates the pinned doctor behaviour by nearly half. Fix: recount and rewrite. Scope proof: cell and fixture inside scope; count produced from the fixture. Surfaces: AC-031, the fixture's doctor columns.
- **R3-P2-004.** Evidence: the four `typedRunsKept` rows are `typed-two-commands-changelog` (`["/deep:review"]`), `typed-two-commands-doctor` (`["/deep:review"]`), `typed-both-loops-research-first` and `typed-both-loops-review-first` (both loops). Impact: half the claimed cross-loop coverage is really loop-versus-non-loop coverage. Fix: say what the four rows pin. Scope proof: cell and rows inside scope; each row read. Surfaces: AC-032, the fixture's typed rows, the multi-typed test.
- **R3-P2-005.** Evidence: `command-attach.ts:1483` is `.replace(/[^\S\n]+/g, ' ')` inside `commandOnlyMentioned`; the mode-cue loop is `:1679` to `:1688`. Impact: one hop of re-derivation for every reader of REQ-026. Fix: re-pin. Scope proof: cell and both ranges inside scope; both printed. Surfaces: AC-033, `loopAskCues`, the deferred-cue guard group.
- **R3-P2-006.** Evidence: `skill_advisor.py:5566` is blank; `_is_loop_workflow_request` is at `:5820`, called at `:5856`. Impact: the Python half of REQ-027 looks missing. Fix: re-pin. Scope proof: cell, blank line and definition inside scope; both printed. Surfaces: AC-034, the Python stage-one copy, the stage-one test.
- **R3-P2-007.** Evidence: the plural rows now sit at `:262` to `:269` (cited `:253`/`:261`), the question rows at `:279`/`:284` (cited `:266`/`:271`), the effort rows at `:286` and the controls at `:299` (cited `:273`/`:286`). Impact: three `Met` cells point at other rows. Fix: re-pin all six. Scope proof: cells and every cited and actual line inside scope; each printed. Surfaces: AC-044, AC-045, AC-046, the fixture blocks.
- **R5-P2-001.** Evidence: the template numbers its machine sections 6, 7, 10 and 12 (`deep-review-strategy.md:61`, `:72`, `:96`, `:128`); the reducer writes 4, 5, 9 and 11 (`reduce-state.cjs:2580`, `:2581`, `:2585`, `:2614`); this lineage's strategy now holds two §4, two §5, two §9 and two §11 headings. Impact: a section number is ambiguous in every produced strategy. Fix: align the reducer's headings with the template, or renumber the template, and add a heading regression case. Scope proof: reducer, template and the produced file inside scope; the produced file is this run's own artifact. Surfaces: the reducer's section writers, the template, every deep-review strategy.

## 4. Remediation Workstreams

Ordered: no P0 and no P1 work exists, so the P2 advisories are grouped by the file that carries the fix.

1. **R-1 - Re-pin the acceptance evidence** (R1-P2-002, R1-P2-003, R3-P2-005, R3-P2-006, R3-P2-007). One pass over `acceptance-criteria.md`, printing each cited line and correcting the anchor where it does not hold the claim. All seven anchor failures are in the same file and need no code change.
2. **R-2 - Restate the counts** (R1-P2-001, R3-P2-001, R3-P2-002, R3-P2-003, R3-P2-004). Recompute each quoted count from the file it describes: the fixture's case count, its `doctorWithheld` count, its multi-typed row count, the changelog's suite row, and the drift guard's compared and per-entry list counts. Then write those numbers into the cells that quote them and into REQ-031.
3. **R-3 - Amend REQ-012** (R2-P2-001). One requirement rewrite that names ADR-001's five-row check; AC-019 stays `Superseded`.
4. **R-4 - Fix the reducer's numbering** (R5-P2-001). One runtime change plus a regression case. This is the only change that touches code, and it does not touch the offer gate.

After R-1 to R-4, rerun the advisor suite, the Python suite and the 69-probe set, then rerun `/deep:review` with traceability as its focus. That rerun is what can close AC-040 and REQ-033; this run cannot, because the acceptance row lives in a document this lineage may not edit.

## 5. Spec Seed

- REQ-012 becomes: "The five prompts D10 recorded as near misses whose outcome did not change sit in the corpus as `near-miss` rows under the ids ADR-001 names (N7 `nm-system-deep-loop-02`, N9 `-03`, V7 `-05`, H6 `nm-sk-code-02`, A3 `nm-sk-code-03`), and D1 sits as the positive `cmd-doctor-deep-loop-plain-tune-02` row. No builder reads a `holdout` row."
- REQ-031 becomes a statement of the guard's real surface: the drift guard compares twenty-two vocabulary pairs plus two numbers, and pins a per-entry case for twelve of the lists; the ten without one are named with the reason each cannot be pinned by a single row.
- A new requirement, or a clause on REQ-034: "Every acceptance evidence cell names the line that holds the evidence it claims, and every count it quotes is recomputed at the round that writes it."
- SC-006 should name the coverage-gate outcome explicitly (it currently names the rerun without its gate result), so a future round can tell an observed pass from an intended one.

## 6. Plan Seed

- T-1: print `deep-loop-offer-cases.vitest.ts:80` to `:112` and `:300` to `:370`, count the pairs and the per-entry blocks, and rewrite REQ-031 and AC-038 from the count.
- T-2: count `doctorWithheld`, `typedRunsKept`, `servedReviewKept` and the total case count in the fixture, and rewrite AC-031, AC-032, AC-009, AC-028, AC-030, AC-037 and AC-042.
- T-3: print `.skilled/changelog/skilled/v4.2.0.0.md:759` and rewrite AC-029's quoted counts.
- T-4: print each of `command-attach.ts:1483`, `command-attach.ts:641`, `skill_advisor.py:5009`, `skill_advisor.py:5566`, `typed-on-stuck-serving.vitest.ts:107`, `test_skill_advisor.py:3017` and the six fixture lines AC-044 to AC-046 cite, then correct the seven cells.
- T-5: rewrite REQ-012 and cite ADR-001.
- T-6: change the reducer's four headings and add a `deep-review-strategy-heading` case that asserts a freshly templated strategy holds each section number once.
- T-7: rerun the suites and the probe set, then rerun `/deep:review` and record AC-040 from that rerun.

## 7. Traceability Status

### Core Protocols

| Protocol | Status | Evidence | Unresolved drift |
|----------|--------|----------|------------------|
| `spec_code` | partial | REQ-001 to REQ-046 mapped. Probe rows at `scratch/probes/results-after.json` (69 rows, all `live`, exit 0); the compiled contracts' 31 source digests all match; ADR-001, ADR-005 and ADR-006 each describe what the tree does. | REQ-012 (`spec.md:224`) and REQ-031 (`spec.md:243`) state checks the tree no longer implements. |
| `checklist_evidence` | partial | All 54 acceptance rows opened; 38 hold their evidence; the `Verification Summary` matches its 26 boxes (12 P0 / 13 P1 / 1 P2, CHK-020 open) and T084 is the one open task, both disclosed. | 16 rows fail: seven cite an anchor that does not hold the claim (AC-033, AC-034, AC-036, AC-037, AC-044, AC-045, AC-046) and nine quote a count or coverage the tree contradicts (AC-009, AC-019, AC-028, AC-029, AC-030, AC-031, AC-032, AC-038, AC-042). |

### Overlay Protocols

| Protocol | Status | Evidence |
|----------|--------|----------|
| `skill_agent` | notApplicable | The packet claims no skill-owned agent definition. |
| `agent_cross_runtime` | notApplicable | No agent definition is claimed by any requirement. |
| `feature_catalog_code` | notApplicable | No feature-catalog entry is claimed. |
| `playbook_capability` | notApplicable | No playbook capability is claimed. |

### AC_COVERAGE

`advisory-shortfall`: 53 of 54 acceptance rows are `Met`, `Waived` or `Superseded`; AC-040 is `Unmet`, which is the row this run's own result is meant to close. Advisory only — it is not what fails the verdict; the coverage gate's `traceability-incomplete` is.

## 8. Deferred Items

- **AC-040 and REQ-033** are the two records this run cannot write. This lineage produced the rerun; the operator or the implementing agent records the outcome in the packet.
- **The two `Waived` and one `Superseded` rows** (AC-008 with ADR-003, AC-017 with ADR-002, AC-019 with ADR-001) are deliberately not re-litigated. ADR-001's replacement check was verified and holds; the waivers stand on their decisions.
- **The env passthrough in `runAdvisorSubprocess`** (`subprocess.ts:285`) and the unsanitized `skillId` on a degraded row (`skill-advisor-cli.ts:1541`) were recorded as hardening that is not in reach — first-party data only. They are listed here so a future round can decide whether to narrow them.

## Dimension Expansion Map

No pivot ran in this lineage: `divergence.completed`, `failed` and `overrides` are empty, no direction was swept, and the frontier mode was `default`, so no node store was created. Breadth came from the dimension rotation (correctness, traceability twice, security, maintainability) and from the operator focus being carried into every iteration. This section records breadth only and changes nothing above.

## 9. Search Ledger

*No search-depth state captured (legacy v1 record).*

This run used the v1 record shape. The searches it performed are enumerated in each iteration's narrative under Files Reviewed and in the confirmed-clean and ruled-out sections; there is no deferred or blocked bug class, so `hasSearchDebt` is false.

## 10. Audit Appendix

### Convergence Summary

- Stop reason `maxIterationsReached` at 7 of 7 iterations; `stopPolicy: max-iterations`, so the convergence vote was telemetry. The graph's last decision was `STOP_ALLOWED` with score 1.0 and signals `dimensionCoverage 1, findingStability 1, p0ResolutionRate 1, evidenceDensity 1.25, hotspotSaturation 1`.
- Ratios by iteration: 1.0, 0.25, 0.636, 0.0, 0.083, 0.0, 0.0. The run found twelve P2 in the first three iterations and nothing new after them.
- Stuck count 0: no two consecutive iterations produced zero new findings with a productive alternative untried.

### Coverage Summary

- Dimensions: `correctness` (iteration 1), `traceability` (iterations 2, 3, 6 and the final pass), `security` (iteration 4), `maintainability` (iteration 5). Four of four covered, with traceability covered three times.
- Files: the 51-file scope was read across the iterations; the packet's own `review/lineages/` artifacts are outside the reviewed set.
- Terminal gates: `evidence: pass` (`all-findings-cited`), `scope: pass` (`all-findings-in-scope`), `coverage: fail` (`traceability-incomplete`).

### Ruled-Out Claims

- Python/TypeScript predicate divergence: both copies agree on all 347 fixture cases.
- A refusal-verb gap in the gate: the nineteen refusal leads plus the `do not even think about` idiom cover the pins.
- A lost typed command when two commands are typed: the ordered-list read is the documented split.
- Prototype pollution through a compiled route, command injection through a degraded supplied string, ReDoS through the loop-ask grammar, secret exposure through argv: each exercised and each fails closed.
- Compiled contracts lagging the edited sources: 31 of 31 digests match.
- A closure statement or Verification Summary that overstates: both agree with their rows and boxes.
- A decision record the code does not implement: ADR-001, ADR-005 and ADR-006 each match the tree.
- A behaviour defect behind the documentation findings: every failing cell was cross-checked and the code holds.

### Sources Reviewed

51 pre-bound files, the packet's `scratch/probes/results-after.json`, `probes-spec-baseline.json` and `command-prompts.jsonl` corpus, the changelog, and the deep-loop reducer, closeout, convergence and terminal-gates scripts. Every citation used in this report resolves to a line that was printed during the run.
