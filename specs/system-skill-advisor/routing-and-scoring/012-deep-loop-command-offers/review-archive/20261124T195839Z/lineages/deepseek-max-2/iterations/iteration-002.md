# Review Iteration 002

## Dispatcher

- Mode: review, target agent `deep-review`, single review iteration, lineage `deepseek-max-2`.
- Dimension: traceability, protocol `spec_code`.
- Operator focus: every requirement in `spec.md` against the code or decision that implements it, with the sixth fix round (REQ-023 to REQ-034, ADR-005, ADR-006) read first.

## Files Reviewed

- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:220` (REQ-001 to REQ-004)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:232` (REQ-008 to REQ-011)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:239` (REQ-015 to REQ-022)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:247` (REQ-023 to REQ-034)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:259` (REQ-035 to REQ-048)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:58` (AC-001 to AC-056)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:33` (ADR-001)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:412` (ADR-005)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:508` (ADR-006)
- `.skilled/commands/deep/assets/deep-review-presentation.txt:13` (offer section)
- `.skilled/commands/deep/assets/deep-research-presentation.txt:13` (offer section)
- `.skilled/commands/deep/research.md:86` and `.skilled/commands/deep/review.md:81` (step 0)
- `.skilled/commands/deep/assets/deep-research.yaml:663` and `.skilled/commands/deep/assets/deep-research.yaml:2265` (completed-packet message and next steps)
- `.skilled/commands/deep/assets/deep-review.yaml:2530` (next steps)
- `.skilled/skills/system-deep-loop/hub-router.json:34` and `.skilled/skills/system-deep-loop/ROUTER.md:1` (research aliases)
- `.skilled/skills/system-deep-loop/SKILL.md:20` (`/doctor:deep-loop`)
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl:225` (near-miss rows, D1 row)
- `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:80` (`VOCABULARY_PAIRS`)
- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:123` (typed-stuck)
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:1` (Python gate copy)
- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:995` (`refinesSameLocation`)
- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2362` (`MIN_BLOCKED_ATTEMPTS`)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **AC-040's evidence cell points at a review report this restart archived** -- acceptance-criteria.md:97 -- AC-040 carries `Evidence: review/review-report.md:71`, described in the row as "the live `review/review-report.md` (generation 6)". The packet's `review/` folder holds no markdown report now: the current generation 7 run opened with `lineage_mode: restart`, and the prior review tree is at `review-archive/20261124T190150Z/review-report.md`. The cited path and line cannot be opened, so the row's own evidence no longer exists where it says it does. The row's gate is already open (`Unmet`), so no verdict moves; the record is what drifted.
   - Finding class: instance-only evidence drift
   - Scope proof: the reference is inside the declared target; `ls review/*.md` returns nothing and `review-archive/20261124T190150Z/review-report.md` exists
   - Affected surface hints: any later closure pass that re-reads AC-040 through its tail; the tail checker the tenth round added would flag this row
   - Case: a reader or script opens AC-040's `Evidence:` tail at `review/review-report.md:71` after the generation 7 restart; the file is gone, so the "live report" claim cannot be checked and the row's status rests only on its prose.

## Traceability Checks

- `spec_code` (core, partial this pass). Every requirement was read against the surface it names:
  - REQ-001 to REQ-004: the recorded probe run and the gate that produces it, as recorded in iteration 1.
  - REQ-005/REQ-009/REQ-010: the offer section in both presentation files (`### Offer From an Advisor Brief`, option A with `--spec-folder=<the Gate 3 answer>`, option B `:confirm`, option C no loop, the executor table row that keeps the run native unless an executor or model is named, the fan-out row that needs two named executors or independent takes), step 0 in both command documents, the completed-packet message at `deep-research.yaml:663`, and both `next_steps` lists [SOURCE: .skilled/commands/deep/assets/deep-review-presentation.txt:13].
  - REQ-006/REQ-007: the 347-case shared fixture and its two readers; the compiled contracts hold no `ASK with SINGLE prompt`.
  - REQ-008/REQ-011: the stage-one lane and the hub surfaces. `iterative research` and `multi-round research` each match one line of `hub-router.json` and `ROUTER.md`, `autonomous research` matches neither, and the hub `SKILL.md` names `/doctor:deep-loop` [SOURCE: .skilled/skills/system-deep-loop/SKILL.md:20].
  - REQ-012/REQ-013: the near-miss check ADR-001 replaced the count with holds — N7 is `nm-system-deep-loop-02` at line 225, N9 `-03`, V7 `-05`, H6 `nm-sk-code-02`, A3 `nm-sk-code-03`, and D1 is the positive `cmd-doctor-deep-loop-plain-tune-02` at line 227; the three deep-family holdouts are the `-04` rows for research, review and the doctor.
  - REQ-014 to REQ-024: every prompt named in the requirement is a row of the shared fixture with the column the row states, checked prompt by prompt; the only prompt not in the fixture is the 96,000-character REQ-030 case, which lives in the test files instead.
  - REQ-025 to REQ-032: `typedCommandsIn`, `routedLoopMode`, `askNamesMode`, `RUN_REFUSAL_LEADS` and the stage-one exceptions exist where the requirements name them, and `VOCABULARY_PAIRS` holds the 22 pairs AC-038 counts, ending in `RUN_ASK_REFUSAL_LEADS`, with `PATTERN_PAIRS` comparing `NAMED_LOOP_MODE` and `NUMERIC_PAIRS` holding `_LEAD_WINDOW` and `ADVISOR_PROMPT_MAX_CHARS` [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:80].
  - REQ-033 to REQ-048: `refinesSameLocation` at line 995, `MIN_BLOCKED_ATTEMPTS` at line 2362, `authoredHeading` inside `replaceAnchorSection`, `enrichCompiledRoutes` in the handler, `trackedCommandForOwner` at line 1489, the plural loop rows, and the mode-free `servedRun: "none"` rows all exist [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2362].
- `checklist_evidence` was not run this pass; the ticked-task audit is the next iteration.

## Integration Evidence

The requirement set is exercised through `attachCommand` and `skill_advisor.py`; the fixture is read by `deep-loop-offer-cases.vitest.ts` and `test_skill_advisor.py`; the corpus rows sit in `command-prompts.jsonl`; the command documents sit in `.skilled/commands/deep/`. Each named surface was opened, not inferred from a neighbour.

## Edge Cases

- AC-019 is `Superseded`; its own count check is stale by design, so the pass reads the five-row replacement ADR-001 defines rather than the count the row still quotes.
- REQ-012 and AC-019 disagree on D1's place; ADR-001 resolves it to a positive doctor row, and that row exists.
- The `false_offer_attached` count is 1 of 57, not 0; the one is the new V7 near-miss row, which T047 records, so the pre-packet rows still read 0.

## Confirmed-Clean Surfaces

- ADR-005: the ranked behaviour it records is what `attachCommand` implements, and the fixture's `typed-stuck` row carries both typed columns.
- ADR-006: the bare-loop-name row reads `asksForLoopRun: false`, and the loop-name vocabulary requires a use, continue or want lead.
- All 56 acceptance evidence tails except AC-040 resolve at the cited line with the cited anchor inside a two-line window.
- 87 of the 88 requirement prompts checked are fixture rows with their stated column.

## Ruled Out

- "The presentation files still carry `ASK with SINGLE prompt`": ruled out; neither file matches.
- "The hub still carries `autonomous research`": ruled out; neither hub file matches.
- "A requirement in the sixth round has no recorded decision": ruled out; ADR-005 and ADR-006 cover the typed-on-stuck and bare-loop-name cases the round rests on.
- "The drift guard compares fewer than 22 pairs": ruled out; the block holds 22 entries.

## Next Focus

- Dimension: traceability, protocol `checklist_evidence`.
- Focus area: every ticked task in `tasks.md` against the file, symbol or command its Verify line names.
- Reason: the requirement audit holds apart from one archived evidence path; the task claims are the next evidence surface.
- Required evidence: a named file or test title per ticked task, or a recorded observation that the tree still matches.

Review verdict: PASS
