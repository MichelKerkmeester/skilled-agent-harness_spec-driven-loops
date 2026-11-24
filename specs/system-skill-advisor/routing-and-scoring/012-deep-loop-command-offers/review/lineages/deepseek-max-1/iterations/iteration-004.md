# Review Iteration 004

## Dispatcher

LEAF deep-review iteration 4 of 5, lineage `deepseek-max-1`, session `fanout-deepseek-max-1-1795514074741-gl47kr`, generation 4, lineageMode `new`.
Mode review; dimension `traceability`; core protocols `spec_code` and `checklist_evidence`.
Operator review focus: every `Met` row in `acceptance-criteria.md` against evidence that really exists in the tree, including the sixth fix round (AC-030 to AC-042) and ADR-005/ADR-006.

This iteration read the closure band AC-030 to AC-043 line by line against its cited surfaces, then re-read the probe comparison and the Verification Summary as observed commands rather than recorded prose.

## Files Reviewed

- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:87-100` (AC-030 to AC-043)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:71` (AC-014, re-read)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:294-300` (Verification Summary)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/scratch/probes/results-after.json`, `results-fresh-review.json`, `results-final-958fa81-worktree.json`, `compare.mjs`
- `.skilled/commands/deep/assets/deep-research.yaml:60-72,655-670,2260-2272`
- `.skilled/commands/deep/assets/deep-review.yaml:700-745,2525-2545`
- `.skilled/commands/deep/assets/deep-research-presentation.txt:475-480`, `deep-review-presentation.txt:580-585`
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:196-314,480,569-660,683-710,846-905,1291-1424`
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:2900-2920,3013-3060,4628-4930,5343-5388`
- `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:60-100,230-298`
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:800-1010`
- `.skilled/skills/system-skill-advisor/runtime/tests/scorer/doctor-handoff-command.vitest.ts:190-245`
- `.skilled/skills/system-skill-advisor/runtime/tests/typed-on-stuck-serving.vitest.ts:100-160`
- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:120-166,196-254`
- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:980-1010`
- `specs/system-skill-advisor/routing-and-scoring/013-deep-loop-offer-in-hint/implementation-summary.md:118-126`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **AC-014 cites a config field where its completed-message clause is checked at a different line** -- `acceptance-criteria.md:71` -- The row claims the completed-packet message names `--extend=N` and `--restart`, and cites `.skilled/commands/deep/assets/deep-research.yaml:68` as its evidence. Line 68 is the `lineage_mode` field description; the completed-packet message the row describes sits at `deep-research.yaml:663`. A reader following the citation sees the two flags described but not the message, so the row's stated observation ("the completed-packet message names ...") is not what the cited line shows.
   Finding class: instance-only (evidence pointer one surface short).
   Scope proof: `sed -n '68p;663p' deep-research.yaml` prints the `lineage_mode` field at 68 and `message: "Completed deep-research packet detected. To add iterations to this run, rerun with --extend=N. To start over, rerun with --restart, ..."` at 663.
   Affected surface hints: `acceptance-criteria.md:71`, `.skilled/commands/deep/assets/deep-research.yaml:68`, `.skilled/commands/deep/assets/deep-research.yaml:663`.
   Case: a closure check reads the cited line for AC-014's message clause, finds a config field rather than a completed-packet message, and cannot tell whether the message still names the two flags without searching the file again.

## Traceability Checks

### spec_code

- Re-ran the recorded probe comparison as a command: `node scratch/probes/compare.mjs results-final-958fa81-worktree.json results-fresh-review.json` prints `changes=0 guarded_failures=0`, exit 0. That is AC-042's comparison clause, observed rather than restated.
- Both probe files hold 69 rows, every row `freshness: live` and `exit 0`, which is the "69 probes all `exit 0 live`" clause.
- The Verification Summary counts 12 P0 CHK items with one open (CHK-020), 13 P1 and 1 P2; the boxes behind it hold exactly that.

### checklist_evidence

- AC-030: the fixture fields the row names hold (`refusal-verb-` rows: 11; the six refusals `false`, five controls `true`); the `cases=203` and "809 tests" figures do not hold on the current fixture and fold into `iter1-P2-fixture-count`.
- AC-031: 26 fixture rows carry `doctorWithheld`; the two refusing prompts read `true`, the plain control `false`; `doctor-handoff-command.vitest.ts:196,239` exercise the fused row; the Python doctor branch is at `skill_advisor.py:5368-5375`.
- AC-032: four `typedRunsKept` rows pin both loops in both orders; `typedCommandIn` still answers its longest key at `command-attach.ts:251-266`.
- AC-033: the two deferred prompts are the two rows of the case at `command-attach-guards.vitest.ts:963`; `DEFECT_CHECK` reads the `-ing` forms at `command-attach.ts:480`.
- AC-034: `stage-one-loop-subject.vitest.ts:26` drops the lane on the pass report and `:20` keeps it on the pass ask; the Python copy is at `skill_advisor.py:5459`.
- AC-035: `command-brief-golden.vitest.ts:353` renders the typed deep command plainly; `:364` is the untyped-row control that keeps the offer, so it does not contradict the typed claim.
- AC-036: `typed-on-stuck-serving.vitest.ts:107` serves the typed command over the diagnosis and `:148` keeps the diagnosis on the untyped complaint; the schema keeps `typed` (`advisor-tool-schemas.ts:308`).
- AC-037: `command-attach-guards.vitest.ts:998` holds the long-prompt group; the 400-character window is at `command-attach.ts:629` and `skill_advisor.py:4921`; the 10,000-unit head is at `skill_advisor.py:888` and is passed at `:6201`; the Python test is at `:3017`.
- AC-038: the 12 vocabulary pairs start at `deep-loop-offer-cases.vitest.ts:65`, the refusal pair at `:77`, and the per-entry cases at `:241`, `:249`, `:256`, `:265`, `:273`; the guard reads the Python tuples out of the source.
- AC-039: `refinesSameLocation` at `reduce-state.cjs:995` and its call site at `:1069`.
- AC-040: `Unmet`, by design, for this rerun.
- AC-041: the fixture header at `deep-loop-offer-cases.json:2`; limitations 6, 7 and 8 at `implementation-summary.md:250-252`; the changelog at `v4.2.0.0.md:482-486`; packet 013 at `implementation-summary.md:123`; the Verification Summary at `tasks.md:298-300`.
- AC-042: the comparison clause passed as a command; the suite and fixture counts are the open count defects.
- AC-043: `hub-router.json:34` and `ROUTER.md:63` carry both aliases; `autonomous research` is absent; ADR-007 records the drop.

## Integration Evidence

- `scratch/probes/compare.mjs` is the comparison surface AC-042 names; running it is the proof behind the row's `changes=0 guarded_failures=0` claim, and it writes nothing.
- The `Met` rows' evidence cells are the closure surface: 39 `Met` rows, each with a `path:line` cell, of which one (AC-014) points a surface short and three (AC-030, AC-037, AC-042) carry stale counts.

## Edge Cases

- AC-037's "the 203 fixture cases keep their results" is a historical statement about the sixth-round fixture; the current tree holds 248, so the number is stale but the "no result changed" claim is separately supported by the shared fixture comparison in iteration 2.
- AC-035's `:364` control can be misread as a counterexample to its own row; it is the untyped-row control, not the typed path.
- `AC-040` `Unmet` keeps CHK-020 open, so the Verification Summary's 11/12 is consistent rather than a miscount.

## Confirmed-Clean Surfaces

- The probe comparison, the 69 live probe rows and the Verification Summary all reproduce as observed commands on the current tree.
- Every AC-030 to AC-043 row except the four noted has an evidence cell that resolves to a line holding its observation.
- The three ADRs that own the sixth- and seventh-round behaviour (ADR-005, ADR-006, ADR-007) are present, Accepted, and referenced by their owning rows.

## Ruled Out

- A contradiction between AC-035 and the `:364` test: ruled out by reading the test body; it exercises an untyped row the degraded producer no longer emits.
- A miscount in the Verification Summary: ruled out by counting CHK boxes by priority tag.
- A drift between ADR-007 and the hub files: ruled out by searching both aliases and the dropped one.

## Next Focus

- Dimension: maintainability
- Focus area: comment hygiene, naming and closure-doc consistency across the packet; plus a security pass over the gate's prompt handling.
- Reason: correctness and traceability are now reviewed to their limits; the last uncovered dimension is maintainability, with the security dimension's trust-boundary questions answered alongside it.
- Rotation status: traceability complete (three passes); maintainability and security open.
- Blocked/productive carry-forward: the observed-command pass (running `compare.mjs` and the census) is the strongest evidence of the run and carries forward.
- Required evidence: comment text in the changed gate files, the absence of secrets and unsafe prompt handling, and a final count reconciliation across the closure docs.

Review verdict: PASS
