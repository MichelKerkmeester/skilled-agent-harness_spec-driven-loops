# Review Iteration 2

## Dispatcher

- Mode: review, single review iteration (fan-out lineage `deepseek-max-3`).
- Resolved route: `Resolved route: mode=review target_agent=deep-review`.
- Review target: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers` (spec-folder).
- Iteration 2 of 7, stop policy `max-iterations`.
- `steer.md` is still absent, so no lead ruling applied.
- Operator focus: finish `spec_code` and `checklist_evidence`, checking every REQ against the code or decision that implements it and every `Met` row against evidence that exists in the tree.

## Files Reviewed

- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:302` to `:357` (REQ-031 to REQ-039, success criteria, open questions)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:58` to `:135` (AC-001 to AC-047 evidence cells)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/implementation-summary.md:153` to `:182`, `:229` to `:261`
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:305` to `:315` (Verification Summary), `:176` to `:185` (eighth round)
- `.skilled/changelog/skilled/v4.2.0.0.md:478` to `:486`, `:759`
- `specs/system-skill-advisor/routing-and-scoring/013-deep-loop-offer-in-hint/implementation-summary.md:123`
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:330` to `:360`, `:509` to `:571`, `:841` to `:944`, `:1016` to `:1040`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:440` to `:470`
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5440` to `:5490`, `:5566`, `:3022` to `:3070`
- `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1470` to `:1600`
- `.skilled/skills/system-skill-advisor/runtime/tests/cli-degraded-command-contract.vitest.ts:152` to `:195`
- `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:68` to `:92`, `:247` to `:318`
- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:253` to `:291`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-routing-baseline.json` (`metrics`, `attachedMetrics`, `rows`)
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl` (near-miss and split counts)
- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:985` to `:1025`
- `.skilled/skills/system-deep-loop/hub-router.json:34`, `.skilled/skills/system-deep-loop/ROUTER.md:63`
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:412` to `:560` (ADR-005 to ADR-007)

## Operator Focus

This iteration closed the requirement sweep for the ninth round: REQ-031 to REQ-039 were read against the code and decision that implement them, and every `Met` acceptance cell from AC-001 to AC-047 was opened on the line it cites. That is where the two findings below come from: the requirements are implemented, but thirteen acceptance cells and one limitation block cite the row above their evidence after the eighth round inserted rows into `implementation-summary.md`, and AC-040's statement about `review/` no longer describes the tree.

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **Acceptance evidence cells point one row above the closure-pass and limitation rows they cite** -- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:58` -- thirteen `Met` rows cite `implementation-summary.md` line numbers that land on the neighbouring row rather than the observation. AC-001, AC-002, AC-003, AC-004, AC-005, AC-010, AC-013, AC-016 and AC-021 cite `:153`, which is the fourth-round corpora row; the closure-pass probe row is `:154`. AC-011 cites `:154`; the mirror and reference-gate result is on the closure-pass advisor-suite row at `:155`. AC-012 cites `:155`; its corpus counts are on `:156`. AC-017 cites `:156`; its alias replay is on `:157`. AC-028 cites `:177` to `:178`; its 69-probe result is on `:180` and its suite result on `:178`. AC-041 cites `:232` for the sixth-round paragraph (actual `:233`), `:230` for the reversed stuck-drop line (actual `:231`), `:258` and `:259` for limitations 6 and 7 (actual `:259` and `:260`), and `:260` for the served-brief gap (actual `:261`).
   Finding class: instance-only (stale line pointers in one file; the underlying evidence exists one row below every pointer).
   Scope proof: every pointer is in `acceptance-criteria.md`'s criteria table; the cited lines were opened in `implementation-summary.md` at the stated numbers.
   Affected surface hints: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md`; the row labels in `implementation-summary.md` are the durable anchors a repoint should use.
   Case: a reader opens `acceptance-criteria.md:58` for AC-001's probe evidence, follows `implementation-summary.md:153`, and finds the fourth-round corpus row, not the 69-probe result; the same happens for every row listed above.

2. **AC-040's evidence statement says `review/` still holds the pre-fix report, but the report was archived and `review/` holds only the current run's config and lineages** -- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:135` -- the row reads "so `review/` still holds the pre-fix report and `spec_code` and `checklist_evidence` are unfinished." `review/` has no `review-report.md`; the three prior reports are under `review-archive/20261124T090549Z/`, `20261124T095434Z/` and `20261124T111600Z/`, and `review/` now holds the fan-out config plus `lineages/`. The status `Unmet` is still correct, so only the sentence about where the report lives is stale.
   Finding class: instance-only (one half of one evidence cell; the unmet status does not change).
   Scope proof: `ls` of `review/` and `find` for `review-report*.md` under the packet returned the three archive paths and no file at `review/review-report.md`.
   Affected surface hints: `acceptance-criteria.md` AC-040; `review-archive/20261124T111600Z/review-report.md` is the report a reader should be sent to.
   Case: a reader follows AC-040's sentence to `review/` to read the pre-fix report and finds no report there; the nearest match is the archived generation-4 report.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | partial (REQ-023 to REQ-039 checked) | REQ-031 fifteen vocabulary pairs `deep-loop-offer-cases.vitest.ts:68`, refusal-lead pair `:83`, numeric pairs `:90`, ten per-entry lists `:247` to `:293`; REQ-032 `refinesSameLocation` `reduce-state.cjs:995`; REQ-033 is this run; REQ-034 closure rows `implementation-summary.md:182`, fixture header `deep-loop-offer-cases.json:2`, tasks summary `tasks.md:309` to `:311`; REQ-035 plural names `command-attach.ts:330`, `:450`, fixture `:253` to `:265`; REQ-036 `LOOP_QUESTION_AUXILIARIES` `command-attach.ts:1016`, fixture `:266` to `:271`; REQ-037 `LOOP_EFFORT_LEADS` `:863`, `LOOP_EFFORT_WORDS` `:922`, fixture `:273` to `:289`; REQ-038 `trackedCommandForOwner` `skill-advisor-cli.ts:1489`, call site `:1571`, test `cli-degraded-command-contract.vitest.ts:152`, `:178`; REQ-039 baseline `false_offer` 0 of 57 and `false_offer_attached` 1 of 57 in `command-routing-baseline.json`. |
| `checklist_evidence` | partial (AC-001 to AC-047 opened; two cells drift) | Every `Met` row was opened on its cited line. AC-030 to AC-047 resolve except AC-041's limitation pointers; AC-001 to AC-021 resolve except the closure-pass pointers named in finding 1; AC-028 under-covers its claim; AC-040's sentence about `review/` is stale (finding 2). Verification Summary counts P0 11/12, P1 13/13, P2 1/1 at `tasks.md:309` to `:311`, matching the unchecked CHK-020 and T084. |

## Integration Evidence

- `skill-advisor-cli.ts:1489` reads the tracked command table at the degraded boundary, and `:1571` is where a child-supplied string is checked against the row's own skill.
- `deep-loop-offer-cases.vitest.ts:303` and `:313` compare the TypeScript vocabulary with the Python tuples and the two numeric constants, which is the drift guard REQ-031 describes.
- `hub-router.json:34` and `ROUTER.md:63` carry the two aliases ADR-007 keeps.

## Edge Cases

- Three cells point at a line that exists but holds a different statement, and one points at a range that ends two rows early. Both are recorded as one finding because the fix is the same mechanical repoint; AC-040's stale `review/` sentence is kept separate because it is a different row and a different kind of claim.
- The baseline file is a captured artifact whose `capturedAtSha` is `a139ac3b248`, while the packet records the code change at `2520456bd3f`. That is not drift by itself: the capture is a generated baseline and its SHA names the capture commit, not the feature commit. Recorded, not raised.

## Confirmed-Clean Surfaces

- REQ-031's fifteen compared lists exist on both sides: `VOCABULARY_PAIRS` at `deep-loop-offer-cases.vitest.ts:68` to `:79`, the refusal-lead pair at `:83`, and the Python tuples at `skill_advisor.py:4480` to `:5213`.
- REQ-032's `refinesSameLocation` keeps a refinement at another file or dimension as its own entry and still folds a same-file refinement, at `reduce-state.cjs:995` to `:1006`.
- REQ-034's fixture header names each typed column's layer at `deep-loop-offer-cases.json:2`; limitations 6, 7 and 8 describe the built behaviour at `implementation-summary.md:259` to `:261`; the changelog names the refusal exception, the typed-on-stuck head and the refusal verbs at `:482` to `:484`.
- REQ-035's plural names are in `LOOP_WORDING` (`deep researches`, `deep reviews`, `deep-reviews`) and `LOOP_NAMES` (`deep loops`, `research loops`, `review loops`), and the fixture pins eight run rows and five no-run rows at `:253` to `:265`.
- REQ-036's question auxiliaries and the `how do`/`how can` pattern are pinned by `:266` to `:271`; REQ-037's effort leads and words by `:273` to `:289`.
- REQ-038's degraded path drops an unknown or other-skill-supplied command, policy, owner and typed marker at `skill-advisor-cli.ts:1571` to `:1600`, with the exact assertions at `cli-degraded-command-contract.vitest.ts:178` to `:195`.
- REQ-039's baseline carries `false_offer` 0 of 57 and `false_offer_attached` 1 of 57, and the fixture holds 285 cases; `rg -c '"row_type":"near-miss"'` prints 31, matching ADR-001's recorded corpus state.

## Ruled Out

- "REQ-035's plural forms are read from a separate list that the drift guard does not compare": ruled out; the plurals sit inside `LOOP_WORDING` and `LOOP_NAMES`, both compared at `deep-loop-offer-cases.vitest.ts:68` to `:79`.
- "REQ-036's `how do` exception is native-only": ruled out; `_LOOP_QUESTION_AUXILIARY_LIST` exists at `skill_advisor.py:4870` and is compared by the drift guard.
- "REQ-038 accepts a command tracked for the row's alias group without checking ownership": ruled out; `trackedCommandForOwner` compares both `ownerSkillId` and `mergedSkillForAlias(skill)` at `skill-advisor-cli.ts:1492` to `:1493`.
- "AC-043's aliases are absent from one of the two hub files": ruled out; both `hub-router.json:34` and `ROUTER.md:63` carry `iterative research` and `multi-round research`, and neither carries `autonomous research`.

## Next Focus

- Dimension: traceability (continuing the operator focus).
- Focus area: REQ-001 to REQ-022, AC-001 to AC-029 statuses, and ADR-001 to ADR-004. Re-read the rows whose pointers drifted to confirm the underlying evidence still holds before synthesis.
- Reason: the ninth-round requirements are implemented; the remaining unchecked part of the operator focus is the first five fix rounds and the superseded/waived rows.
- Rotation status: traceability stays active through iteration 3; correctness begins at iteration 4.
- Carry-forward: the evidence-pointer finding stays active until a fix round repoints the cells; it does not block, so the verdict remains PASS.
- Required evidence: each REQ-001 to REQ-022 producer, each AC-001 to AC-029 status, and each ADR-001 to ADR-004 decision.

Review verdict: PASS
