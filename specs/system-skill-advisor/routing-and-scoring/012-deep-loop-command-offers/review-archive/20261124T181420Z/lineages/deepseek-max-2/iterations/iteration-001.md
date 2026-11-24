# Iteration 1 - Correctness of the deep-loop offer gate

## Dimension

Correctness over the gate that decides whether a `/deep:*` command is offered, plus the operator focus's first slice: the gate-layer REQ claims of `spec.md` (REQ-001..REQ-004, REQ-015..REQ-020, REQ-023..REQ-027, REQ-035..REQ-037) checked against the code that implements them.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:240-1519` (typed-command parsing, loop-ask grammar, refusal and question readings, `attachCommand`, `deferredLoopCommand`)
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:440-500` (stage-one loop rule)
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:380-460` (served-head enrich and `attachTypedCommand`)
- `.skilled/skills/system-skill-advisor/runtime/lib/render.ts:114-255` (offer rendering and the typed plain-`(ask)` branch)
- `.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:190-260` (degraded Python path pass-through and typed derivation)
- `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1489-1590` (degraded CLI path and `trackedCommandForOwner`)
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4480-5230` (Python copies of the fifteen compared lists)
- `.skilled/skills/system-skill-advisor/runtime/dist/runtime/lib/command-attach.js` (built copy used for the behaviour probes)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **A pronoun rerun after a symptom is read as a doctor ask** -- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:566` -- `isStuckRunComplaint` cancels the stuck reading only for a run ask that names the loop or a counted ask (`COUNTED_RUN_ASK`), because `hasUnrefusedRunAsk` matches `LOOP_RUN_REQUESTED`, which needs a deep-loop name or a research/review loop name after the use verb. A rerun phrased with a pronoun ("run it again", "rerun it") therefore leaves the stuck reading standing, and `attachCommand` answers `/doctor:deep-loop` although the reader asked for a rerun; the counted form ("run 2 more iterations") does cancel it.
Finding class: behaviour-edge
Scope proof: the two predicates are exported and were exercised on the built copy of the same source; both the asking and the cancelling paths sit in the reviewed file.
Affected surface hints: `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:560-572`, `:1414-1424`, `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts` (the doctor row is withheld only on a refusal), `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts` (no case for the pronoun rerun)
Case: "the deep review didn't finish, run it again" -> `isStuckRunComplaint` returns true, `asksForLoopRun` returns false, `isRunRefused` returns false, so the offer is `/doctor:deep-loop`, not `/deep:review`; "my deep review is hung, rerun it" behaves the same way.

```json
{"type":"claim-adjudication","claim":"A pronoun rerun phrased after a symptom is not read as a run ask, so the stale-run diagnosis replaces the rerun the reader asked for.","evidenceRefs":[".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:566",".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:866"],"counterevidenceSought":"Read isStuckRunComplaint, hasUnrefusedRunAsk, COUNTED_RUN_ASK, LOOP_RUN_REQUESTED and the doctor branch of attachCommand; the packet's REQ-018 and REQ-024 cover only the negated symptom and the refusal cases, and REQ-024 deliberately keeps the doctor on a plain stuck complaint.","alternativeExplanation":"Diagnosing before rerunning is a defensible product choice, and the packet never promises that a pronoun rerun wins; the doctor may be the better answer for a run that did not finish.","finalSeverity":"P2","confidence":"high","downgradeTrigger":"Withdraw if the packet records the doctor-before-rerun reading as intended, or if a guards case already pins the pronoun form."}
```

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | partial | Gate-layer REQ subset checked against the built predicate; the REQ corpus and the closure docs are still open |

- REQ-001/REQ-002/REQ-003/REQ-004 (gate layer): sampled prompts from the REQ paragraphs evaluated on the built copy: "run a deep loop" asks, "I want a review loop" asks, "we need a review loop for every PR" does not, "run a deep loop to review the research loop config" asks (REQ-026).
- REQ-015/REQ-023 (refusals): "skip the deep review and just answer" and "a deep review is not needed, just check the diff" are withheld, "don't forget to run a deep review on the parser" asks; the `skip`-`to` and `refuse`-`to` idioms live in `refusalLeadSource` (`command-attach.ts:633`).
- REQ-016/REQ-036/REQ-037 (questions and complaints): "how can a deep research loop stop early?" and "the deep review loop is too slow" are withheld; "how do I run a deep review? then run a deep review on the parser" asks.
- REQ-019 (subject readings): "research three-pass vs two-pass compilers", "review our multi-pass compiler" and "compare 10 iterations of the model and review the results" are withheld.
- REQ-035 (plural names): "run two deep-researches on vector indexes" asks; "summarize the research.md from the last deep research run" is withheld through the past-read reading.
- REQ-031 (list parity): all fifteen compared lists carry the same entries on both sides (LOOP_WORDING 9, LOOP_NAMES 6, LOOP_WANT_LEADS 10, COUNT_WORDS 23, ITERATIVE_VERBS 12, LOOP_RUN_SYMPTOMS 12, LOOP_ARTIFACT_NOUNS 36, LOOP_EFFORT_WORDS 7, LOOP_EFFORT_LEADS 5, PAST_RUN_READ_VERBS 13, MODE_SUFFIXES 7, LOOP_QUESTION_AUXILIARIES 17, RUN_ASK_REFUSAL_LEADS 18, COMMAND_DECLINE_LEAD_WORDS and COMMAND_ASK_LEAD_WORDS through their two-part spread); `LEAD_WINDOW` is 400 on both sides and the Python prompt cap is 10,000.
- REQ-029/REQ-038 (served head): `attachTypedCommand` (`advisor-recommend.ts:428`) overrides the route's command with the typed one, and the degraded CLI path validates a supplied string through `trackedCommandForOwner` (`skill-advisor-cli.ts:1489`).
- Evidence: `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:993]`, `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1387]`, `[SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:428]`, `[SOURCE: .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1489]`

## Integration Evidence

- `.skilled/commands/deep/review.md` and `.skilled/commands/deep/research.md` route the offer through the advisor brief; the brief's rendering path (`render.ts:227`) is the surface a command row reaches, and its typed branch at `:250` decides the plain `(ask)` form.
- The stage-one lane (`explicit.ts:454`) reads `asksForLoopRun` and `isStuckRunComplaint` from the same module, so the routed and deferred paths cannot disagree on what counts as an ask; that shared import is what REQ-008's "beside a research or review cue" relies on.

## Edge Cases

- Empty input: a prompt with no loop phrase never enters the gate; no command row is produced.
- Long input: a 96,000-character prompt costs 1-9 ms through `asksForLoopRun` on the built copy for plain text, repeated refusal text, repeated "deep review" phrases and repeated "in several iterations", so the bounded lead window holds for the native gate.
- Contradictory readings: a prompt that both names the loop and refuses it is withheld (`runAskNegatedAt`), and the one shape where a refusal follows the name ("a deep review is not needed") is read by `LOOP_ASK_REFUSED_AFTER`.
- Partial success: the build was used as behaviour evidence, so the source and built copy may differ in principle; the list parity check read the source on both sides, and the behaviour probes read the built copy.

## Confirmed-Clean Surfaces

- `typedCommandsIn` (`command-attach.ts:274`) keys every typed command by its start offset, so "/deep:review ... then /create:changelog" keeps both and `typedCommandForTop` hands the leading hub's first owned command to the head (REQ-025).
- `deferredLoopCommand` blanks a loop name that is the request's subject before it counts mode cues (`command-attach.ts:1477`), which is what makes "run a deep loop to review the research loop config" a review.
- `endsBefore` (`command-attach.ts:646`) bounds each lead scan to `LEAD_WINDOW` characters and keeps 16 characters of real context before the cut, so the text-start anchor cannot fire at the slice boundary.
- `commandLabel` (`render.ts:227`) resolves `mutating` through `COMMAND_ROWS` even when `needsMode` suppresses the generated row, so a typed row still renders its policy word.

## Ruled Out

- A parity drift between the two gate copies: all fifteen compared lists agree entry for entry, and the two numbers REQ-031 names agree.
- A quadratic cost in the lead scans: bounded windows keep 96,000-character prompts in single-digit milliseconds.
- `needsMode` surviving beside a typed command producing a contradictory brief: `commandLabel` reads the typed command first and only suppresses the generated row.
- A `dist` stale against the source: the built copy reproduced the source's readings on every sampled REQ prompt.

## Next Focus

- Dimension: traceability
- Focus area: `spec_code` over REQ-001..REQ-039 - every requirement against the code or decision that records it
- Reason: the operator focus asks for the two core protocols first, and iteration 1 only covered the gate layer
- Rotation status: correctness covered once; traceability is next in the risk order
- Blocked/productive carry-forward: nothing blocked; the gate-layer sampling is a PRODUCTIVE approach to reuse for the REQ corpus
- Required evidence: one file:line per REQ, naming the producer or the ADR that records the decision
- Recovery note: none

Review verdict: PASS
