# Review Iteration 4

## Dispatcher

- Mode: review, single review iteration (fan-out lineage `deepseek-max-3`).
- Resolved route: `Resolved route: mode=review target_agent=deep-review`.
- Review target: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers` (spec-folder).
- Iteration 4 of 7, stop policy `max-iterations`.
- `steer.md` is still absent.
- Operator focus: every iteration also covers the traceability focus, so this correctness pass reads the code the requirement cells pin.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:480` to `:520`, `:575` to `:700`, `:810` to `:1010`, `:1010` to `:1100`, `:1380` to `:1519`
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4990` to `:5060`, `:5435` to `:5500`, `:5555` to `:5585`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:440` to `:470`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1074` to `:1100`
- `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1480` to `:1600`
- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:273` to `:289`
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:525` to `:545`, `:955` to `:1024`

## Operator Focus

The operator focus is traceability, and this iteration used it as the input to correctness: each code path read here is one a REQ cell names. REQ-037's effort rule is the source of the one finding; the other four requirement families this iteration touched (refusal, question, plural, typed) held on the inputs their cells and fixtures name.

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **An effort word after the loop name withholds the command even when it is a manner on the request** -- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:931` -- `LOOP_EFFORT_AFTER` matches an effort word directly after a loop name with every preceding group optional, so "run a deep review longer than the last one on the parser" reads " longer" as a complaint and the phrase is skipped as a subject. The same shape exists in `_LOOP_EFFORT_AFTER_RE` at `skill_advisor.py:4781`. REQ-037's principle is that an effort word used as a manner on the request keeps the command; the fixture pins the complaint ("the deep review takes longer than the tests", `deep-loop-offer-cases.json:276`) and three manner controls before the loop name, but no manner that follows it.
   Finding class: class-of-bug (the producer pattern reads an effort word in a complaint shape without a subject or verb requirement, in both gate copies).
   Scope proof: the TypeScript pattern and its test site are at `command-attach.ts:931` to `:968`; the Python copy is at `skill_advisor.py:4781` to `:4789`, read at `:5097`. The fixture has no request-with-effort-after-name case.
   Affected surface hints: `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts`, `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py`, `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json`, `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts`.
   Case: "run a deep review longer than the last one on the parser" returns no command from `attachCommand` on a single review route, because `namesLoopSubject` tests `after = " longer than the last one on the parser"` against `LOOP_EFFORT_AFTER`, which matches `" longer"`.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | pass | REQ-023 to REQ-030 read again against `command-attach.ts` and `skill_advisor.py`; REQ-037's producer is the source of R4-P2-001. All thirty-nine REQs remain mapped from iteration 3. |
| `checklist_evidence` | partial | The two P2 evidence drifts remain (R2-P2-001, R2-P2-002); this iteration adds no checklist finding. |

## Integration Evidence

- `command-attach.ts:968` is where `namesLoopSubject` reads `LOOP_EFFORT_AFTER`; that is the single decision point that produces the false negative.
- `skill_advisor.py:5097` reads `_LOOP_EFFORT_AFTER_RE` at the matching Python decision point, so the two copies share the defect rather than diverging.

## Edge Cases

- The finding is a false negative, not a false offer: the prompt asks for a run and gets no command, which is the safer direction. That keeps the severity at P2 even though the trigger is a plausible request.
- A manner word placed before the loop name is already covered by the fixture's three controls, so the gap is specifically the post-name position.
- The same post-name position also catches "run a deep review slower", which is a request for a slower run in some phrasings. It is recorded as the same finding rather than a second one, because the producer is the same pattern.

## Confirmed-Clean Surfaces

- `endsBefore` (`command-attach.ts:650` to `:655`) starts every lead read at `end - LEAD_WINDOW` with 16 characters of context, so a lookbehind cannot fire at the cut and a lead longer than the window is lost rather than invented; the Python `_ends_before` at `skill_advisor.py:5011` to `:5013` has the same bounds.
- `RUN_ASK_NEGATED_SOURCE` (`:629`) excludes a conjunction in the two-word gap, so "skip it and deep review the parser" asks for the run, and the fixture's two conjunction controls pass.
- `typedCommandsIn` (`:274` to `:290`) keeps one key per start index, longest first, then dedupes the mapped retired commands; `typedCommandIn` (`:251`) still returns the longest key for its other callers.
- `deferredLoopCommand` (`:1465` to `:1497`) blanks a loop name the prompt treats as its subject before reading `MODE_CUES`, so "run a deep loop to review the research loop config" lands on review and the two controls return nothing.
- `isLoopQuestion` (`:1061` to `:1066`) leaves "how do I run a deep review? then run a deep review on the parser" a request and "how can a deep research loop stop early?" a question.
- `trackedCommandForOwner` (`skill-advisor-cli.ts:1489` to `:1494`) checks the tracked table by own key and compares the owner or its merged alias, so an unknown or other-skill command cannot print.

## Ruled Out

- "The bounded window loses a lead at the cut": ruled out; `endsBefore` keeps 16 characters of context and starts the search at the slice's window offset.
- "A conjunction inside the refusal gap still negates the next clause": ruled out; the gap's negative lookahead names `and`, `then`, `but` and `or`, and the two conjunction fixtures pass.
- "`typedCommandsIn` lets a longer command hide a shorter one": ruled out; it keys by start index and keeps the longer only where two commands start at the same place.
- "The deferred mode cue counts a subject loop name as a cue": ruled out; `namesLoopSubject` blanks it before `MODE_CUES` runs.

## Next Focus

- Dimension: security.
- Focus area: the prompt-to-command trust boundary, the child-supplied command path, the prompt-head cap, and any path where reviewed content or subprocess output becomes a command.
- Reason: correctness has one P2; security is the next dimension with no coverage and the packet touches a trust boundary.
- Rotation status: correctness moves to completed with one advisory; security and maintainability remain.
- Carry-forward: R2-P2-001, R2-P2-002 and R4-P2-001 stay active advisories.
- Required evidence: a concrete input and a file:line for each security finding; a clean surface gets the exact guard it relies on.

Review verdict: PASS
