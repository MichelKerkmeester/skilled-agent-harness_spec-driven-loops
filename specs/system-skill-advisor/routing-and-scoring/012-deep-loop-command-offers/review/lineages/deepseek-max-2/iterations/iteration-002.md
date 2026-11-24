# Iteration 2 - Traceability: spec_code across REQ-001..REQ-039

## Dimension

Traceability, `spec_code` protocol: every requirement in `spec.md` against the code that implements it or the decision record that owns it. The operator focus is the whole of this iteration, so the pass is the focus's first half.

## Files Reviewed

- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:1-357` (all 39 requirements, success criteria, scope table)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:33-603` (ADR-001..ADR-007)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:56-105` (the AC table and its evidence cells)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:240-1519`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:440-500`
- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:1-290`
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:532,808,963,998`
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4480-5230,5482,5566,6298`
- `.skilled/commands/deep/assets/deep-research-presentation.txt:1-70`, `deep-review-presentation.txt:1-70`
- `.skilled/commands/deep/research.md:86`, `.skilled/commands/deep/review.md:81`
- `.skilled/skills/system-deep-loop/hub-router.json`, `ROUTER.md`, `SKILL.md:20`, `deep-research/SKILL.md`, `deep-review/SKILL.md`
- `.skilled/changelog/skilled/v4.2.0.0.md:482-484,759`
- `specs/system-skill-advisor/routing-and-scoring/013-deep-loop-offer-in-hint/implementation-summary.md:123`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **AC-041's evidence cell cites three lines that do not hold its content** -- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:98` -- the cell says `implementation-summary.md:232` carries the sixth-round paragraph and that `:258` and `:259` state the typed-on-stuck exception and the word-rule miss, with `:260` recording the served-brief gap. On the tree, line 232 is blank, the sixth-round paragraph opens at 233, limitation 6 sits at 259, limitation 7 at 260 and limitation 8 at 261. The same drift is repeated in `tasks.md:164` (T082), which names `:258`, `:259` and `:260` for the three limitations. The row still reads `Met`, so the closure record asserts an observation this tree cannot reproduce by reading the cited lines.
Finding class: evidence-pointer
Scope proof: the three cells were opened line by line on this tree; the target lines were printed and their content compared with the wording of the cell.
Affected surface hints: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:98`, `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:164`, `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/implementation-summary.md:233-261`
Case: a reader following AC-041 to check REQ-034 lands on a blank line at `:232` and reads limitation 7's text where the cell promises limitation 6.

```json
{"type":"claim-adjudication","claim":"AC-041 and T082 cite line numbers that land one line beside the content they describe, and one that is blank.","evidenceRefs":["specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:98","specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/implementation-summary.md:232","specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/implementation-summary.md:259"],"counterevidenceSought":"Printed lines 230-236 and 252-262 of implementation-summary.md, searched the file for the sixth-round paragraph and for limitations 6-8, and checked whether a later edit could have been intended as the cited content; no other line holds the described text.","alternativeExplanation":"A blank line at :232 means an earlier edit removed a line above, so the citation was true when written and the drift is a side effect rather than a wrong observation.","finalSeverity":"P2","confidence":"high","downgradeTrigger":"Withdraw if the lines are corrected on this tree, or if the citation convention is declared to tolerate one-line drift."}
```

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | pass | Every REQ names a producer or a decision; one closure cell cites drifted lines (finding 1) |

- REQ-001..REQ-004 -> `asksForLoopRun` and `attachCommand` (`command-attach.ts:993`, `:1387`); the probe block they quote lives in `scratch/probes/results-after.json` (2,366 lines, 69 rows).
- REQ-005 -> `### Offer From an Advisor Brief` once per presentation file, option A with `:auto` and `--spec-folder=<the Gate 3 answer>` (`deep-research-presentation.txt:58`, `deep-review-presentation.txt:59`), and step 0 in both command documents (`research.md:86`, `review.md:81`).
- REQ-006 -> fixture holds 285 cases, 11 of them `refusal-verb-`, and the built copy reproduced the sampled readings; the depth-word group is `command-attach-guards.vitest.ts:532-541`.
- REQ-007 -> `compiled/` carries no `ASK with SINGLE prompt` (0 matches across the directory).
- REQ-008 -> stage-one loop rule (`explicit.ts:454`) with the subject and refusal gates.
- REQ-009 -> `--extend=N` 8 times in each presentation file and 6 in each deep YAML; `doctor:deep-loop --scope=` once in each presentation file.
- REQ-010 -> `communication-handoff.md` named twice per presentation file, `ASK with SINGLE prompt` 0 times, `Autonomous (Recommended)` and `Native (Recommended, default)` once each.
- REQ-011 -> both hub files carry the two research aliases and neither carries `autonomous research`; `comprehensive research`/`deep investigation` 0 in `deep-research/SKILL.md`, `audit spec folder`/`pre-release review` 0 in `deep-review/SKILL.md`, and `doctor:deep-loop` once in the hub `SKILL.md`.
- REQ-012 -> 31 `near-miss` rows in `command-prompts.jsonl` (ADR-001 supersedes the count in AC-019).
- REQ-013 -> the three deep-family holdout rows are the `-04` ids: `cmd-doctor-deep-loop-plain-holdout-04`, `cmd-deep-research-plain-holdout-04`, `cmd-deep-review-plain-holdout-04`.
- REQ-014 -> N9 is withheld through `isPastRunRead` (`command-attach.ts:717`), reproduced on the built copy.
- REQ-015..REQ-020 -> refusal, question, spelling, denied-symptom, subject and Python-parity readings (`command-attach.ts:581-1130`, `skill_advisor.py:5482`), sampled on the built copy.
- REQ-021 -> the packet records drift 0 on 227 prompts (`acceptance-criteria.md:85-86`, `:99`); this lineage independently confirmed the fifteen list pairs agree.
- REQ-022 -> changelog states the refusal exception (`:482`), the typed-on-stuck head (`:483`) and the refusal verbs (`:484`), and quotes 184 files, 3,188 passed at `:759`; AC-008 reads `Waived` with ADR-003.
- REQ-023..REQ-031 -> fixture counts and the cited test lines hold: 26 `doctorWithheld` rows, `typed-stuck` at `:123`, guards groups at `:808`, `:963`, `:998`, golden render at `:353`/`:364`, degraded CLI at `:81`, Python typed row at `:5482`, stage-one copy at `:5566`.
- REQ-032 -> `reduce-state.cjs:1017-1105` keeps a cross-file refinement as its own entry and `refinesSameLocation` guards the fold; the unit test `reduce-state-refinement-other-file.vitest.ts` holds 12 `refines` lines.
- REQ-033 -> this lineage is the rerun; the terminal gates are computed at synthesis, and the finding list above is what the rerun has so far.
- REQ-034 -> fixture header names the layer each typed column pins, changelog lines hold, 013 records the degraded-path evidence at `:123`; the AC-041 pointer drift is finding 1.
- REQ-035..REQ-039 -> plural, question, complaint, degraded-supplied-command and corpus requirements each map to a gate branch or a test, and the fixture keeps 285 cases with the eighth-round rows at `:253-290`.
- ADR ownership: ADR-001 supersedes AC-019, ADR-002 waives AC-017, ADR-003 waives AC-008, ADR-005 owns the typed-on-stuck exception, ADR-006 owns the bare-loop-name reading and ADR-007 amends REQ-011; each is present in `decision-record.md` at the headings listed above.

## Integration Evidence

- `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts` reads the shared fixture for the TypeScript gate and `.skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py` reads the same file, which is the parity surface REQ-006 and REQ-021 claim.
- `.skilled/commands/deep/assets/deep-research-presentation.txt` is the document the AI opens on the advisor's `ask` policy; the offer section it carries is what REQ-005 and REQ-010 point at.

## Edge Cases

- A historical row that quotes an older count ("Sixth round: ... `cases=203`") is round-scoped and was not counted as stale; only a row that asserts current evidence was judged (implementation-summary:166-167 and :233 are round records, not current claims).
- The near-miss ids are `nm-*`, not the probe ids N7/N9/D1/V7/H6/A3 that AC-019 names; ADR-001 supersedes that row, so the id mismatch is not a separate finding.
- The `Met` rows that cite a probe result rather than a file line (AC-001..AC-005, AC-013, AC-021) were read as packet evidence, because this lineage cannot rerun the 69-probe harness without writing outside its surface.

## Confirmed-Clean Surfaces

- Every `path:line` cell of AC-030..AC-039, AC-042..AC-047 resolves to the line that holds the described content: `command-attach.ts:1483`, `:492`; `skill_advisor.py:5009`, `:888`, `:6298`, `:5482`, `:5566`; fixture `:123`, `:138`; `typed-on-stuck-serving.vitest.ts:107`, `:148`; `advisor-recommend-typed-command.vitest.ts:91`; `command-brief-golden.vitest.ts:353`, `:364`; `subprocess-typed-fields.vitest.ts:88`; `cli-degraded-command-contract.vitest.ts:81`; `doctor-handoff-command.vitest.ts:206`, `:253`; `test_skill_advisor.py:2902`; `deep-loop-offer-cases.vitest.ts:211`; `stage-one-loop-subject.vitest.ts:20`, `:26`.
- The Verification Summary's box counts hold: 12 P0 items with one open (CHK-020), 13 P1, 1 P2.
- `spec.md` Scope's sixth-round file table matches the files that carry the changes.

## Ruled Out

- A stale suite count across the closure docs: the sixth, seventh and eighth rounds each quote their own totals, and the changelog quotes the eighth (`3,188`), which is the current tree's row.
- A missing ADR behind a waiver: the four returned rows (`Waived` AC-008, AC-017; `Superseded` AC-019; and the ADR-005 exception in AC-027) each name an ADR present in `decision-record.md`.
- A REQ whose producer does not exist: all 39 map to a branch, a test line, an ADR or a packet record.

## Next Focus

- Dimension: traceability
- Focus area: `checklist_evidence` - every ticked task in `tasks.md` and every `Met` row in `acceptance-criteria.md` against evidence that exists in the tree
- Reason: `spec_code` is finished; the second core protocol is the focus's remaining half
- Rotation status: correctness and `spec_code` covered; `checklist_evidence` next
- Blocked/productive carry-forward: line-by-line citation opening is PRODUCTIVE and continues
- Required evidence: a task id, its cited path, and the content found there
- Recovery note: none

Review verdict: PASS
