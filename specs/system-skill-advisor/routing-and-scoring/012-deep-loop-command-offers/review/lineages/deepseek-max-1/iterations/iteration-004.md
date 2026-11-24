# Review Iteration 004

## Dispatcher

- Mode: review; target agent `deep-review`; lineage `deepseek-max-1`; generation 7; session `fanout-deepseek-max-1-1795546920757-7pyjry`.
- Iteration 4 of 7 (stopPolicy `max-iterations`).
- Dimension: `correctness`. Focus: the gate's own logic - `LOOP_REQUEST`, the phrase vocabulary it is built from, and the whitespace handling between the user's text and the predicate.
- Operator review focus, carried: the traceability protocols are closed; this iteration checks whether the behaviour the requirements describe survives inputs the fixture does not carry, which is the sixth round's own concern applied to a shape it did not cover.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:330` (`LOOP_WORDING`), `:949` (`LOOP_REQUEST`, built by `escapePhrase` over the literal phrases), `:1537` (`attachCommand`), `:648` and `:839` (the apostrophe-only normalisation each predicate applies).
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4600` (`_LOOP_WORDING_LIST`), `:4816` (`_LOOP_REQUEST_RE`, the same literal join), `:5293`, `:5330`.
- `.skilled/skills/system-skill-advisor/runtime/lib/prompt-policy.ts:267` (`stripLeadingPastedReply`).
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:544` (`scoredPrompt`), `:410` (`attachCommand` call).
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/text.ts:22` (`normalizeText`, which the scorer uses and the gate does not).
- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:1` (all 347 prompts scanned for non-single-space whitespace).
- The built `.skilled/skills/system-skill-advisor/runtime/dist/runtime/lib/command-attach.js`, probed with eight whitespace variants and eleven adversarial shapes.

## Findings - New

### P0 Findings

None.

### P1 Findings

5. **A doubled space, a tab, a line break or a non-breaking space inside a loop phrase withholds the command, in both gate copies, and no fixture case can catch it** -- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:949` -- `LOOP_REQUEST` is one alternation built from `LOOP_WORDING.map(escapePhrase)` (`:330`), and `escapePhrase` escapes the phrase as written, so `deep review` matches one space and nothing else. The Python copy builds `_LOOP_REQUEST_RE` the same way from `_LOOP_WORDING_LIST` (`skill_advisor.py:4816`). The scorer normalises whitespace before scoring (`lib/scorer/text.ts:22`), and the gate does not: `attachCommand` receives `scoredPrompt`, which is `stripLeadingPastedReply(input.prompt)` (`handlers/advisor-recommend.ts:544`, `lib/prompt-policy.ts:267`) and keeps the reader's spacing. Probed on the built gate: "run a deep  review of the parser" (two spaces), "run a deep\treview of the parser", "run a deep\nreview of the parser", "run a deep\u00a0review of the parser", "do a deep  research on caching" and "run a review  loop on the parser" all return `undefined`, while the same prompt with ordinary spacing returns `/deep:review` or `/deep:research`. A doubled space elsewhere in the sentence ("run  a  deep review  of  the parser") still works, so the defect is confined to whitespace inside the phrase - which is exactly where a wrapped line, a pasted block or a double-typed space lands. The shared fixture carries no such case: 0 of its 347 prompts holds a doubled space, a tab, a newline or a non-breaking space, and both suites read that one file, so the two copies can drift on whitespace indefinitely without a test failing.
   Finding class: `class-of-bug` (every multi-word phrase in the gate vocabulary inherits it, in both copies).
   Scope proof: the finding is on a reviewed file inside the seeded scope, and every claim rests on a probe of the built gate or a direct read of the predicate the file exports.
   Affected surface hints: `LOOP_REQUEST`, `LOOP_WORDING`, `LOOP_NAMES`, `MODE_CUE_WORDS` and `ITERATIVE_ASK` in `command-attach.ts`; `_LOOP_REQUEST_RE` and the mode-cue patterns in `skill_advisor.py`; `attachCommand`'s callers at `handlers/advisor-recommend.ts:410` and the degraded CLI path.
   Case: a reader pastes a two-line request where the line break falls inside the phrase - "run a deep\nreview of the auth module" - and the advisor serves `system-deep-loop` with `cmd=-`, so the AI never asks the offer the packet exists to produce; the same happens after a double space typed between the two words. Nothing in the brief or the tests distinguishes this from a request that asks for no loop.

   ```json
   {"type":"claim_adjudication","id":"R4-P1-001","claim":"Any whitespace other than one space inside a multi-word loop phrase withholds the command in both gate copies, and the shared fixture has no case that could catch it.","evidenceRefs":[".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:949",".skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4816",".skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:544",".skilled/skills/system-skill-advisor/runtime/lib/prompt-policy.ts:267",".skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:1"],"counterevidenceSought":"Read both pattern builders for a whitespace-tolerant separator; checked whether the scorer's `normalizeText` is applied before `attachCommand`; checked `stripLeadingPastedReply` for a collapsing step; and scanned all 347 fixture prompts for a non-single-space case. Each came back negative.","alternativeExplanation":"The gate may be documented as reading one canonical, single-spaced prompt, with normalisation the caller's job. That explanation fails because the gap is inside one pipeline: the scorer normalises, then the same handler hands the raw prompt to the gate, so the two halves of one request read different text.","finalSeverity":"P1","confidence":0.82,"downgradeTrigger":"A handler or hook change that normalises whitespace before `enrichCompiledRoutes`, or a documented contract that the advisor input is already collapsed, reduces this to P2 hardening.","file":".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:949"}
   ```

### P2 Findings

None new. `R1-P1-001`, `R1-P2-001`, `R2-P2-001` and `R3-P2-001` remain active.

## Traceability Checks

- `spec_code` (carried `pass`) is unaffected: REQ-001's plain-ask clause is implemented and its fixture prompts pass; the finding is about inputs outside the requirement's examples, which is why it is filed under correctness rather than as a spec contradiction.
- `checklist_evidence` (carried `pass`) is unaffected: no acceptance row claims whitespace tolerance.
- No `traceabilityChecks` entry is recorded this iteration; the dimension is `correctness`, and repeating a `pass` from another dimension would overstate what was run.

## Integration Evidence

- Gate entry: `attachCommand` (`lib/command-attach.ts:1537`) on the scorer's single-route shape, probed through the built `dist/runtime/lib/command-attach.js`.
- Handler: `handlers/advisor-recommend.ts:544` binds `scoredPrompt` and `:410` passes it to the gate, which is the pipeline step that decides the finding's reach.
- Python fallback: `scripts/skill_advisor.py:4816` builds the same literal alternation, so the defect is not a native-only one.
- Test layer: `tests/fixtures/deep-loop-offer-cases.json` read as data; 0 of 347 prompts carry a whitespace variant, which is the blind spot the shared oracle has.

## Edge Cases

- Ambiguity: whether whitespace inside a phrase is "in reach". Recorded on both sides in the finding: the pipeline hands the raw prompt to the gate (in reach), while the requirements' examples are all single-spaced (out of the accepted surface). Kept at P1 with a named downgrade trigger rather than argued down silently.
- Adversarial shapes that came back clean: the empty prompt, whitespace-only text, a prompt of regular-expression metacharacters, an astral-plane emoji prompt, a 100,000-character single token, and five pathological repetitions sized for catastrophic backtracking (10,000 characters of repeated "do not ", "deep review ", "iterations ", "passes of the ", and a 10,000-character pad before a valid ask). The worst case took 13.5 ms and none threw.
- Missing dependency: the Python copy's whitespace behaviour was read from its pattern construction rather than executed, because importing the fallback from this lineage is not a safe read-only step.
- Partial success: one dimension probed; three requirement rows (REQ-021, REQ-039, REQ-042) stay on recorded output rather than observation, as iterations 2 and 3 recorded.

## Confirmed-Clean Surfaces

- Case folding: "RUN A DEEP REVIEW OF THE PARSER" and the title-cased form both return `/deep:review`, so the gate is case-insensitive where it should be.
- Guard rails on adversarial input: no exception and no slow path in eleven shapes, including five built to induce backtracking.
- The refusal and subject guards hold under punctuation noise: "deep review (((( ?! [a-z] * * + + ^$|\\" returns `/deep:review` rather than throwing, and the empty prompt returns `undefined`.

## Ruled Out

- "The gate throws or hangs on adversarial prompts": ruled out. Eleven shapes, none threw, and the slowest was 13.5 ms.
- "The gate is case-sensitive": ruled out. Upper and title case both serve the command.
- "A double space anywhere in the sentence breaks the gate": ruled out. Only whitespace inside the phrase does; "run  a  deep review  of  the parser" still serves `/deep:review`.
- "The scorer's normalisation covers the gate": ruled out. `normalizeText` is the scorer's own step (`lib/scorer/text.ts:22`); `attachCommand` reads `scoredPrompt`, which keeps the reader's spacing.

## Next Focus

- Dimension: `security`.
- Focus area: trust boundaries in the changed surfaces - the typed-command path, the degraded brief, the Python subprocess hand-off and the prompt-size cap - looking for an input that widens what the advisor serves or costs more than the cap allows.
- Reason: `correctness` produced the whitespace class bug and a clean adversarial sweep; `security` is the next uncovered dimension and the packet's own NFR-S01/NFR-S02 rows make claims worth testing.
- Rotation status: `correctness` closes; `security` opens; `maintainability` follows in iteration 6.
- Blocked/productive carry-forward: productive - probing the built module with adversarial shapes (timing plus outcome) found the one real defect and cleared the rest; carry it into the security pass.
- Required evidence: a security finding with file:line and a reproduction, or a named attack surface checked and cleared with the check that cleared it.
- Recovery note: none.

Review verdict: CONDITIONAL
