# Review Iteration 003

## Dispatcher

LEAF deep-review iteration 3 of 5, lineage `deepseek-max-1`, session `fanout-deepseek-max-1-1795514074741-gl47kr`, generation 4, lineageMode `new`.
Mode review; dimension `correctness`; core protocols `spec_code` and `checklist_evidence`.
Operator review focus: the sixth fix round (REQ-023 to REQ-034, AC-030 to AC-042, ADR-005, ADR-006) checked against the code and the decisions that record it.

This iteration reviewed the sixth round's code for behaviour: the refusal vocabulary, the stuck-run refusal, two typed commands, the deferred-route cue, the stage-one subject rule, the bounded prompt scans, the vocabulary drift guard and the reducer refinement. Every claim was read in both copies (TypeScript and Python) where the packet says the two agree.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:326-369,405-460,469-665,683-937,1229-1424`
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4628-4650,4900-4930,5227-5272,5274-5410,5459-5480,6165-6210`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1035-1135`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:445-500`
- `.skilled/skills/system-skill-advisor/runtime/lib/render.ts` (typed rendering path, read at `command-brief-golden` citations)
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:408-449`
- `.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:255-310`
- `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts` (degradedRecommendations attach path)
- `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:1-298`
- `.skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py:2855-2975,3013-3060`
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:800-1010`
- `.skilled/skills/system-skill-advisor/runtime/tests/typed-on-stuck-serving.vitest.ts:100-160`
- `.skilled/skills/system-skill-advisor/runtime/tests/scorer/stage-one-loop-subject.vitest.ts:1-60`
- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:120-166,196-254`
- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:980-1010,1050-1100`
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:412-520,520-660,660-760` (ADR-005, ADR-006, ADR-007)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None. This iteration is a clean pass on the sixth round's code. The two open count defects from iterations 1 and 2 are carried forward as active; AC-030's "11 files and 809 tests" figure predates the seventh-round guard widening as well, and is recorded as supporting evidence for `iter1-P2-fixture-count` rather than a new finding.

## Traceability Checks

### spec_code

- REQ-023: the six refusal prompts are fixture rows reading `asksForLoopRun: false`; `RUN_ASK_REFUSAL_LEADS` (`command-attach.ts:569-588`) and `_RUN_ASK_REFUSAL_LEAD_LIST` (`skill_advisor.py:4628-4647`) carry the same 18 leads, the `skip ... to` and `refuse ... to` grammar is in both, and the three keep controls read `true`. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:569]
- REQ-024: `attachCommand`'s stuck branch returns `undefined` when `isRunRefused` holds (`command-attach.ts:1304-1310`); `withholdDeepLoopDoctorWithoutRun` withholds the fused row on the same predicate (`fusion.ts:1084-1086`); the Python gate drops the doctor row at `skill_advisor.py:5368-5375`. The two refusing prompts read `doctorWithheld: true` and the plain control `false`.
- REQ-025: `typedCommandsIn` returns every typed command in order (`command-attach.ts:274-291`), `typedCommandForTop` returns the first command the leading skill owns (`:304-314`), and `attachCommand` reads `typedCommandsIn(...).includes(...)` rather than a single longest key (`:1357`). The Python copy reads `_typed_deep_commands_in_order` (`skill_advisor.py:5274-5292`). The four multi-typed rows carry `/deep:review` and the two both-loop rows carry both commands.
- REQ-026: `deferredLoopCommand` blanks a `NAMED_LOOP_MODE` match that `namesLoopSubject` reads as the subject and then counts `MODE_CUES` (`command-attach.ts:1369-1400`); `MODE_CUES.review` includes `DEFECT_CHECK`, whose `-ing` forms the regex spells (`:480`). The two deferred prompts are covered by `command-attach-guards.vitest.ts:963`.
- REQ-027: the stage-one rule requires `asksForLoopRun || isStuckRunComplaint` before a pass or iteration count gives the hub its lane (`explicit.ts:452-455`), so "several passes of the linter failed" gets no lane and "review the parser in several passes" does; the Python `_is_loop_workflow_request` copy sits at `skill_advisor.py:5459`.
- REQ-028: the degraded renderer prints a typed deep command as `/deep:review (ask)` (`command-brief-golden.vitest.ts:353`) and keeps the offer options on a degraded row not marked typed (`:364`); `subprocess-typed-fields.vitest.ts:88` keeps the command, policy, owner and typed marker through `parseRecommendations`.
- REQ-029: the schema carries `typed: z.literal(true).optional()` (`advisor-tool-schemas.ts:308`), so `attachTypedCommand`'s `typed: true` survives the Zod parse (`advisor-recommend.ts:436-448`); the fixture's typed-stuck row is `servedReviewKept: true`, and `typed-on-stuck-serving.vitest.ts:107` asserts the served head.
- REQ-030: `LEAD_WINDOW = 400` (`command-attach.ts:629`) and `_LEAD_WINDOW = 400` with `_ends_before` (`skill_advisor.py:4921-4926`); `_advisor_prompt_head` cuts at `ADVISOR_PROMPT_MAX_CHARS` (`:888-900`), which the schema sets to 10,000 (`advisor-tool-schemas.ts:257`), and `analyze_request` passes the head into the gate (`:6200-6201`).
- REQ-031: the five named lists are exported arrays that build their patterns (`COUNT_WORDS:405`, `LOOP_RUN_SYMPTOMS:506`, `LOOP_ARTIFACT_NOUNS:846`, `PAST_RUN_READ_VERBS:683`, `ITERATIVE_VERBS:346`), and the drift guard compares twelve pairs including `RUN_ASK_REFUSAL_LEADS` plus two numeric pairs (`deep-loop-offer-cases.vitest.ts:65-87`), with per-entry cases for all five lists (`:241-278`).
- REQ-032: `refinesSameLocation` returns false when the refinement names another file or a different declared dimension (`reduce-state.cjs:995-1004`), and the caller passes the target's declared dimension, not the refinement's (`:1069-1073`), so the refinement keeps its own entry with its `refines` link.
- REQ-033: this lineage is the rerun the requirement asks for; the terminal gates are recorded at synthesis.
- REQ-034: limitation 6 (`implementation-summary.md:250`) records the typed-on-stuck head, limitation 7 (`:251`) the one word-rule miss, limitation 8 (`:252`) the served-brief layer; the changelog names the refusal exception, the typed head and the refusal verbs (`v4.2.0.0.md:482-486`) and quotes 3,126 at `:759`; packet 013 carries its degraded-path evidence at `013-deep-loop-offer-in-hint/implementation-summary.md:123`; the Verification Summary matches its boxes.

### checklist_evidence

- AC-030 to AC-039 each hold their stated result on the current tree, except the count figures carried in finding `iter1-P2-fixture-count` / `iter2-P2-suite-counts`: the fixture rows they name hold the stated booleans, the cited test cases exist, and the cited code lines hold the predicates.
- AC-040 remains `Unmet` by design (this rerun). AC-041 and AC-043 hold their stated evidence. AC-042's counts are the stale ones already recorded.

## Integration Evidence

- The two gate copies are the integration surface: `command-attach.ts` and `skill_advisor.py` are compared by the drift guard on twelve vocabulary pairs and two numeric constants, so a word added to one side fails a test rather than a support case.
- ADR-005's split between the gate layer (`attachCommand` -> `/doctor:deep-loop` on the typed-stuck prompt) and the served head (`attachTypedCommand` -> typed `/deep:review`) is implemented exactly as recorded: `command-attach.ts:1304-1310` and `advisor-recommend.ts:428-449`.

## Edge Cases

- `LOOP_ARTIFACT_NOUNS` does not include `compiler`; "review our multi-pass compiler" is dropped by the `HYPHEN_COUNT` subject rule instead (`command-attach.ts:892-908`), so a reader adding a noun there would not change that row's result. The two rules overlap by design.
- `diagnose`/`debug` prompts that also contain a refused run are read by the stuck branch before the routed-mode branch; a refusal therefore wins over the diagnosis only where `isRunRefused` is true, which is REQ-024's intent.
- The Python head cut counts UTF-16 units to match JavaScript; a lowercase expansion before the cut can shift the boundary by one unit for a character outside the BMP. This is outside every fixture case and below the materiality of a finding.

## Confirmed-Clean Surfaces

- Refusal, question, subject, past-run and writing-about readings all flow through one predicate (`asksForLoopRun`), and both offer paths (routed mode and deferred route) read it, so the two paths cannot disagree.
- The typed-command layer cannot hide a shorter typed command: `typedCommandForTop` iterates the ordered set and returns the first command the leading skill owns.
- The reducer keeps a cross-file refinement as its own entry and folds a same-file one; the test file named by AC-039 exercises both directions.
- `withholdDeepLoopDoctorWithoutRun` and its Python counterpart agree on the refused, questioned and bare namings of `/doctor:deep-loop`.

## Ruled Out

- A dead-end worth a finding in the singular `typedCommandIn` export: ruled out. Its longest-key contract is pinned by `command-attach.vitest.ts:173-175`, and every production caller now reads `typedCommandsIn`, which satisfies rather than contradicts REQ-025.
- A false offer on "review our multi-pass compiler" through a missing artifact noun: ruled out by the hyphen-count subject rule.
- A divergence between `attachCommand` and the Python gate on the four typed rows: ruled out by the shared fixture columns and the line-by-line comparison above.
- A `typed: true` marker stripped by the Zod parse: ruled out by `advisor-tool-schemas.ts:308`.

## Next Focus

- Dimension: traceability
- Focus area: AC-030 to AC-043 and ADR-005/ADR-006 as closure records; check every `Met` row's evidence against the tree, including the sixth-round counts and the seventh-round additions.
- Reason: the code holds; the remaining risk is the closure record, which is where iterations 1 and 2 found defects.
- Rotation status: correctness complete; traceability returns for its third pass.
- Blocked/productive carry-forward: the two-copy read is productive and can be retired for this run; the closure-record sweep continues.
- Required evidence: every AC-030 to AC-043 evidence cell read against its cited line, plus the ADR-005/ADR-006/ADR-007 text.

Review verdict: PASS
