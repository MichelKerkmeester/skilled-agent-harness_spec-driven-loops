# Deep Review Report

**Target**: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers` (spec-folder)
**Loop**: `/deep:review`, fan-out lineage `deepseek-max-3` of 3, session `fanout-deepseek-max-3-1795550334883-gjbarh`, generation 8
**Iterations**: 7 of 7 (cap reached) | **Stop reason**: `maxIterationsReached`
**Verdict**: PASS, with advisories

---

## 1. Executive Summary

- **Overall verdict: PASS.** No active P0 and no active P1 across the run.
- **hasAdvisories: true** — four active P2 findings remain.
- **Counts the verdict used: P0 = 0, P1 = 0, P2 = 4.** These are the counts `review-verdict.cjs` derived from `deep-review-findings-registry.json` after the adversarial self-check, and they are the counts this report states.
- **Adversarial self-check: no adjudication was needed.** The self-check runs over active P0/P1 findings; this run has none, so the Referee confirmed, downgraded or dismissed nothing and the registry's counts are unchanged by it.
- **Operator review focus** (recorded verbatim): *Traceability: finish the spec_code and checklist_evidence protocols. Check every REQ in spec.md against the code that implements it or the decision that records it, and every ticked task in tasks.md and every Met row in acceptance-criteria.md against evidence that really exists in the tree, including the sixth fix round (REQ-023 to REQ-034, AC-030 to AC-042, ADR-005, ADR-006).*
- **How the focus was met.** Both core protocols finished. `spec_code` reaches `pass` across all 52 REQs, each resolved to the code that implements it, the decision that records it, or the artifact that measures it. `checklist_evidence` reaches `pass` with 119 of 119 acceptance anchors resolving, all 60 acceptance cells read, and 138 ticked task boxes checked against 33 repo-relative paths that all exist. The sixth fix round was read requirement by requirement (REQ-023..REQ-034) and row by row (AC-030..AC-042), and ADR-005 and ADR-006 were read against the code they govern.
- **Review scope summary.** 47 pre-bound scope files: the packet's six canonical docs, the advisor runtime (gate, fused row, handler, CLI, subprocess, Python fallback), the deep-loop command and presentation assets, and the associated suites and fixtures. `resource-map.md` is absent, so the resource-map coverage gate is skipped by the absent-map rule.
- **What the review is confident about.** The behaviour the packet built is real and guarded: the offer machinery is table-driven, prompt cost is bounded on both copies, the generated command contracts match their sources by hash (31 of 31), and the packet's own closure bookkeeping is honest about the one row it has not closed.
- **What it is not claiming.** This lineage may not run the repository's tooling, so every "both suites pass" clause is a claim about a recorded run verified by resolving its anchors, not a fresh measurement. The Executive Summary says so rather than implying a green test run.

---

## 2. Planning Trigger

`/speckit:plan` **is** required, for advisory remediation only: the four findings are documentation- and duplication-scale, none blocks the packet's closure, and none changes what the code answers for any prompt the fixture pins.

```json
{
  "triggered": true,
  "reviewDidNotRun": false,
  "verdict": "PASS",
  "hasAdvisories": true,
  "activeFindings": [
    {
      "id": "R1-P2-001",
      "severity": "P2",
      "title": "AC-038's evidence freezes a vocabulary-pair count and a last-pair name the tree has moved past",
      "dimension": "traceability",
      "file": "acceptance-criteria.md:95",
      "findingClass": "matrix/evidence",
      "disposition": "open"
    },
    {
      "id": "R1-P2-002",
      "severity": "P2",
      "title": "REQ-025's \"every other caller\" premise names a caller typedCommandIn no longer has",
      "dimension": "traceability",
      "file": "spec.md:250",
      "findingClass": "instance-only",
      "disposition": "open"
    },
    {
      "id": "R3-P2-001",
      "severity": "P2",
      "title": "The research alias ADR-007 records as rejected still sits in the mode packet's keyword list",
      "dimension": "traceability",
      "file": ".skilled/skills/system-deep-loop/deep-research/SKILL.md:34",
      "findingClass": "instance-only",
      "disposition": "open"
    },
    {
      "id": "R5-P2-001",
      "severity": "P2",
      "title": "The doctor command string is declared twice, in the two layers that must agree about it",
      "dimension": "maintainability",
      "file": ".skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1055",
      "findingClass": "instance-only",
      "disposition": "open"
    }
  ],
  "remediationWorkstreams": [
    "W1 — stop restating a moving count in the acceptance matrix (R1-P2-001 with its refinement R2-P2-001)",
    "W2 — scope the rejected-alias record (R3-P2-001)",
    "W3 — de-duplicate the doctor command constant (R5-P2-001)",
    "W4 — retire or re-justify the orphan typedCommandIn export (R1-P2-002)"
  ],
  "specSeed": [
    "REQ-031: keep the requirement count-free (it already is) and remove the count from AC-038's evidence cell instead",
    "REQ-011 or ADR-007: name whether the drop of `autonomous research` covers the mode packet's own keyword list",
    "REQ-025: drop the \"every other caller\" clause, or keep the export as a documented public API"
  ],
  "planSeed": [
    "T-A: rewrite acceptance-criteria.md AC-038's evidence cell to state the guard's clauses without a pair count, citing `deep-loop-offer-cases.vitest.ts:121` for the array and `:571` for the listed-with-reason rows",
    "T-B: add one sentence to ADR-007 or REQ-011 naming `deep-research/SKILL.md`'s keyword list as in or out of the alias drop",
    "T-C: import `DEEP_LOOP_DOCTOR_COMMAND` in `fusion.ts` from `command-attach.ts` instead of re-declaring it",
    "T-D: decide `typedCommandIn`'s status and align spec.md REQ-025 with that decision"
  ],
  "findingClasses": ["matrix/evidence", "instance-only"],
  "affectedSurfacesSeed": [
    "acceptance-criteria.md AC-038 evidence cell",
    "implementation-summary.md sixth-round paragraph",
    "deep-research/SKILL.md keyword triggers",
    "fusion.ts doctor constant",
    "command-attach.ts typedCommandIn export"
  ],
  "fixCompletenessRequired": false
}
```

`fixCompletenessRequired` is false because no finding is `class-of-bug` or `cross-consumer`: each names one site, and no two of them share a producer.

---

## 3. Active Finding Registry

### P0 — none

### P1 — none

### P2 — four active

| ID | Severity | Title | Dimension | File | Finding class | Disposition |
|---|---|---|---|---|---|---|
| `R1-P2-001` | P2 | AC-038's evidence freezes a vocabulary-pair count and a last-pair name the tree has moved past | traceability | `acceptance-criteria.md:95` | matrix/evidence | open |
| `R1-P2-002` | P2 | REQ-025's "every other caller" premise names a caller `typedCommandIn` no longer has | traceability | `spec.md:250` | instance-only | open |
| `R3-P2-001` | P2 | The research alias ADR-007 records as rejected still sits in the mode packet's keyword list | traceability | `.skilled/skills/system-deep-loop/deep-research/SKILL.md:34` | instance-only | open |
| `R5-P2-001` | P2 | The doctor command string is declared twice, in the two layers that must agree about it | maintainability | `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1055` | instance-only | open |

**R1-P2-001 — AC-038's evidence freezes a count the tree has moved past.** Evidence: AC-038 says `VOCABULARY_PAIRS` "compares 22 vocabulary pairs …, the last of them `RUN_ASK_REFUSAL_LEADS`"; the array at `deep-loop-offer-cases.vitest.ts:121`-`145` holds 24 rows and ends at `RUN_ASK_REFUSAL_VERBS`. Impact: a closure reviewer counting the guard's reach gets a number that cannot be reconciled with the tree. Fix: state the guard's clauses without a count — REQ-031 already refuses to fix one. Scope proof: `sed -n '121,146p'` prints all 24 rows. Affected surfaces: `acceptance-criteria.md` AC-038, `deep-loop-offer-cases.vitest.ts`, `spec.md` REQ-031.

**R1-P2-002 — an orphan export described as having callers.** Evidence: `typedCommandIn` is exported at `command-attach.ts:251` and keeps its longest-key rule, but nothing in the advisor source calls it; the prompt path moved to `typedCommandsIn` (`:274`) and `typedCommandForTop` (`:304`). Impact: a maintainer cannot tell from REQ-025 whether the export is supported API or a leftover. Fix: delete the export or re-justify it as the single-command reader. Scope proof: `grep -rn typedCommandIn` over the advisor package without tests returns the definition line alone.

**R3-P2-001 — a rejected alias on an unscoped surface.** Evidence: ADR-007 dropped `autonomous research` from the hub alias set on measured evidence; `deep-research/SKILL.md:34` still lists it among its keyword triggers, and neither REQ-011 nor ADR-007 names that list. Impact: a reader of ADR-007 finds the alias still offered and cannot tell whether the drop was meant to cover it. Fix: one sentence scoping the drop, or remove the keyword. Scope proof: `rg -n 'autonomous research'` returns nothing in `hub-router.json` and `ROUTER.md` (so AC-043 holds) and `:34` in the nested `SKILL.md`; `projection.ts:1449` shows the nested packet's list is not scored, which is why this is documentation and not a live route.

**R5-P2-001 — one string, two constants, two layers.** Evidence: `command-attach.ts:196` and `fusion.ts:1055` both declare `DEEP_LOOP_DOCTOR_COMMAND = '/doctor:deep-loop'`, and `fusion.ts` already imports a dozen symbols from `command-attach.ts`. Impact: renaming the command in one place leaves `fusion.ts:1083` testing for a string `typedCommandsIn` no longer returns, which silently withholds the doctor on a prompt that typed it. Fix: import the constant. Scope proof: `rg -n "const DEEP_LOOP_DOCTOR_COMMAND"` returns exactly those two declarations; the other occurrences of the literal are table or projection rows.

---

## 4. Remediation Workstreams

**P0 — none.**

**P1 — none.**

**P2 advisories, ordered by cost:**

- **W1 (cheapest, prose only):** rewrite AC-038's evidence cell so it states the guard's clauses — fails on a one-sided list edit, passes on the tree, lists its uncomparable patterns with reasons — without a pair count. Touches `acceptance-criteria.md:95` only.
- **W2 (prose only):** scope the alias drop. Either add one sentence to ADR-007 naming `deep-research/SKILL.md`'s keyword list as explicitly in or out, or remove the keyword line. Touches `decision-record.md:603` or `deep-research/SKILL.md:34`.
- **W3 (one line):** import `DEEP_LOOP_DOCTOR_COMMAND` in `fusion.ts` from `command-attach.ts`. Touches two files, one line each.
- **W4 (a decision):** retire the `typedCommandIn` export or keep it and soften REQ-025's last clause to match. Touches `command-attach.ts:251` or `spec.md:250`.

---

## 5. Spec Seed

- **REQ-031** stays as built. Its "the requirement names no list count" sentence is the right design and it is what makes AC-038's frozen count the only thing to fix.
- **REQ-011 / ADR-007** gain a surface clause: the alias drop is a statement about the hub's alias lists (`hub-router.json`, `ROUTER.md`), and the packet should say so where a reader meets the decision.
- **REQ-025** loses the "for every other caller" clause, or keeps it and records the export's purpose.
- **REQ-034**'s closure-doc clause could name the acceptance matrix itself as a surface the round checks, since three of this run's four findings are document-scale and all sit in the packet's own records.

---

## 6. Plan Seed

1. **T-A**: rewrite `acceptance-criteria.md` AC-038 evidence cell without a count; cite `deep-loop-offer-cases.vitest.ts:121` for the array and `:571` for the listed-with-reason rows.
2. **T-B**: add the surface clause to ADR-007 (or remove `autonomous research` from `deep-research/SKILL.md:34`).
3. **T-C**: replace `fusion.ts:1055`'s declaration with an import from `command-attach.ts`.
4. **T-D**: decide `typedCommandIn`'s status, then align `spec.md` REQ-025.
5. **T-E**: rerun `/deep:review` on this packet with traceability as its focus once the four advisories are closed, so AC-040 can be judged on a tree with no open P2s.

---

## 7. Traceability Status

**Core protocols**

| Protocol | Status | Evidence | Drift |
|---|---|---|---|
| `spec_code` | **pass** | All 52 REQs resolve. The 9 measured rows resolve to the artifact that records the measurement: the 69-row probe recording (`scratch/probes/results-after.json`), the 359-case fixture, `command-routing-baseline.json` with its `capturedAtSha` and `corpusSha256`, and the probe captures under `scratch/probes/`. REQ-007 resolves by hash: all 31 `sourceDigests` in the two generated contracts match their sources. | None open. R1-P2-002 concerns a REQ clause about a caller, not the code's behaviour. |
| `checklist_evidence` | **pass** | 119 of 119 acceptance anchors resolve (98 repo-relative, 21 packet-relative); the cited line's content was read for AC-030..AC-049 and AC-059 and the cell text for all 60. All 138 ticked task boxes were checked: 33 repo-relative paths cited, all present; 4 structural rows cite none and need none. The Verification Summary's `12 / 11-of-12`, `13 / 13`, `1 / 1` reproduces from the boxes behind it, with the single unverified P0 being the unticked `CHK-020`. | AC-038's count clause (R1-P2-001). Everything else resolves. |

**Overlay protocols**

| Protocol | Status | Evidence |
|---|---|---|
| `skill_agent` | **pass** | `system-deep-loop/SKILL.md:30`-`:31` mode table matches `mode-registry.json` for `research` and `review`; the hub states the resolve-through-registry discipline at `:103`-`:104` and names its projection drift guard. |
| `playbook_capability` | **pass** | The manual-testing playbook carries `mode-routing/review-routing.md` and an `advisor-integration/` group, both naming `/deep:review`. Scenario preconditions were not read line by line, and the pass says so. |
| `agent_cross_runtime` | **notApplicable** | No agent definition is among the 47 scope files. |
| `feature_catalog_code` | **notApplicable** | No feature-catalog document mentions the deep-loop offer. |

**AC_COVERAGE (advisory)**: Level 3 spec-folder target with `acceptance-criteria.md` and `implementation-summary.md` at in-progress-or-later, so the signal is surfaced. **59 of 60 rows resolved** — 55 `Met`, 3 `Waived` (ADR-001/002/003/009), 1 `Superseded` (ADR-001) — and 1 `Unmet`: AC-040, which is the row this run exists to score and which the cross-lineage merge decides. The validation rule behind this signal is INFO, so it is advisory and does not move the verdict.

---

## 8. Deferred Items

- **AC-040 / REQ-033 stays open by design.** The rerun, `T084` and `CHK-020` all say so, and the packet's closure statement says so at `acceptance-criteria.md:145`. This lineage's coverage pass is one input to that row; the merge is the other.
- **The measured rows were not re-measured.** Nine REQs assert probe or suite outcomes. This lineage may not run the repository's tooling, so each resolves by artifact presence and spot-checked content. A later run with execution authority would be the way to turn that from "artifact present" into "measured today".
- **The `deep-research.yaml` completion surface is split.** The completion message body (`:2254`-`:2262`) names no next step; the `--extend=N` and `/doctor:deep-loop` lines sit in the `next_steps` block at `:2265`-`:2270`. REQ-009's owner row reads the completion surface, so the requirement holds; recorded rather than filed because the packet's own row settles the reading.
- **No frontier nodes exist.** This run is `depth-mode: default`, so `frontier.nodes` is absent and there is no exhausted or blocked node to list as follow-up review work.

### Dimension Expansion Map

- Completed pivots: 0. Failed pivots: 0. Audited overrides: 0.
- Swept directions: none.
- Dimensions reviewed: `correctness` (iterations 1, 6), `security` (2), `traceability` (3, 4, 7), `maintainability` (5).
- Remaining frontier: none — the run is default depth, and the rotation closed at the iteration cap.
- This map records breadth only and cannot alter the verdict, the advisory flag, or the finding registry.

---

## 9. Search Ledger

The canonical iteration records carry `traceabilityChecks` rather than v2 search-depth state, so this section reports what was searched rather than reducer-owned coverage: **no search-depth state captured (legacy v1 record)**.

What the run searched, for the audit trail:

- Every REQ row of `spec.md` (52) and every AC row of `acceptance-criteria.md` (60).
- All 47 pre-bound scope files at least once; the advisor gate, the fused row, the handler, both degraded surfaces and the Python fallback in detail.
- 119 acceptance anchors, 33 task-cited repo paths, 31 generated-contract source digests, and 69 probe rows.
- Directions investigated and eliminated: 11, each recorded in its iteration's `## Ruled Out` and in the strategy's section 10.

`searchDebt` is empty and `candidateCoverage` is not tracked by this record generation, which is why the verdict counts no debt.

---

## 10. Audit Appendix

**Convergence summary.** Stop policy `max-iterations`, cap 7, reached exactly. Novelty ratio by iteration: 1.0, 0.5, 1.0, 0.0, 1.0, 0.0, 0.0 — the three zeros are clean passes (one completing `checklist_evidence`, one rotating `correctness`, one closing the rotation), and the 0.5 is the refinement that folded into its target. With the cap bound, convergence was telemetry only; the loop broadened angles instead of stopping early.

**Coverage summary.** Four of four dimensions covered; both core protocols complete at `pass`; three overlays pass and two are `notApplicable` with a stated reason.

**Finding lifecycle.** Five findings were filed across seven iterations; one (`R2-P2-001`) refined `R1-P2-001` at the same file and line and folded into it, which is REQ-032's first clause observed live. Four remain active, all P2, none resolved and none contested.

**Ruled-out claims.** 11 directions, recorded per iteration: doctor withholding and no-edit agreement; typed-doctor versus refusal leads; refusal gaps across conjunctions; prompt text reaching a rendered command; pasted-reply parity across all three call sites; shell injection through the Python child; ReDoS in the gate grammars; a REQ without an owning AC; whitespace variants defeating a loop name; the nested `SKILL.md` list reaching the advisor projection; and stale generated contracts.

**Sources reviewed.** The 47 pre-bound scope files, plus `decision-record.md` ADR-001..ADR-009, `mode-registry.json`, `.skilled/repo-rules/skill-hub-routing.md` §4, `projection.ts`, `derived/extract.ts`, the compiled command contracts, and the packet's `scratch/` evidence captures.

**Cross-reference appendix — core protocols.** `spec_code`: pass, 52 of 52 REQs resolved. `checklist_evidence`: pass, 119 of 119 anchors and 138 of 138 task boxes checked.

**Cross-reference appendix — overlay protocols.** `skill_agent`: pass. `playbook_capability`: pass. `agent_cross_runtime`: notApplicable. `feature_catalog_code`: notApplicable.

**Process note.** This lineage wrote one invalid iteration record and repaired it on the record: the iteration 5 append carried a `resolved_route` one token short of the canonical form, the gateway accepted it, and the repair was a re-append of the same iteration through the gateway with the canonical value plus a single-field correction to the delta's first line. Iteration 6's `## Edge Cases` and the lineage's `deep-review-strategy.md` carry the disclosure.

---

## Quality Gates

The terminal gates are recorded in the state log as one `deep_review.terminal_gates_recorded` event (`iterationId: iteration-007`, `stopReason: maxIterationsReached`, `failedRequiredGateIds: []`):

| Gate | Status | What it checks here |
|---|---|---|
| `evidence` | pass | Every active finding cites `file:line`, and no active P0 or P1 rests on inference. All four findings resolve to the exact line named. |
| `scope` | pass | Every finding sits on a surface a requirement in the target names: AC-038's own cell and REQ-025 in the packet, REQ-011's named `deep-research/SKILL.md`, and the doctor command table `command-attach.ts` / `fusion.ts` both read. No finding reaches beyond the packet's declared subject, and the reads that went outside the 47 pre-bound files did so as context evidence for a requirement that names those files. |
| `coverage` | pass | Four of four configured dimensions have at least one full iteration (`correctness` and `traceability` have two each), both core protocols are `pass`, three overlay protocols are `pass` and two are recorded `notApplicable` with a reason. |

The iteration cap is the stop, not convergence: `stopPolicy` is `max-iterations` with `maxIterations: 7`, and the loop reached 7/7. `releaseReadinessState` is `in-progress` rather than `converged`, because a `maxIterationsReached` stop is not a convergence stop — and because AC-040's question is answered by the cross-lineage merge, not by this lineage alone.
