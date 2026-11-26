# Iteration 001 - Correctness

## Dispatcher
- Lineage: opus-medium-2 (fan-out), session fanout-opus-medium-2-1795495423434-9mvwzq, generation 1, lineageMode new.
- Dimension: correctness. Iteration 1 of 5. steer.md: not present.
- Review focus: the deep-loop offer gate in command-attach.ts and the Python fallback in skill_advisor.py, plus the typed-command hint from packet 013. This iteration covered the focus by executing the TypeScript gate (`attachCommand`, `asksForLoopRun`, `typedCommandForTop`) directly under Node type stripping and the Python gate (`asks_for_loop_run`, `_apply_deep_loop_offer_gate`) directly, on the spec's REQ-015/REQ-020 prompts plus adjacent variants, then tracing how the handler composes the routed command with the typed command.

## Files Reviewed
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:222-265`, `:416-441`, `:614-640`, `:827-892`, `:899-919`
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:405-448`, `:556-561`, `:628-633`
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4463-4870`
- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:2`, `:118-122`
- `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:40-57`
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:194-235`

## Findings by Severity

### P0 Findings
None.

### P1 Findings
1. **A typed /deep:review on a stuck-run complaint overrides the /doctor:deep-loop answer in the served output** -- .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:434 -- `attachCommand` answers a stuck-run complaint with `/doctor:deep-loop` (command-attach.ts:837-841), but both return paths of the handler then pass the result through `attachTypedCommand` (advisor-recommend.ts:556, :628), which replaces the top row's command with whatever `typedCommandForTop` returns (advisor-recommend.ts:434-446). `typedCommandForTop` checks only `commandOnlyMentioned` and ownership (command-attach.ts:257-265); it never consults `isStuckRunComplaint`. Executed: for "my deep review run is stuck, /deep:review again", `attachCommand` returns `/doctor:deep-loop` while `typedCommandForTop('system-deep-loop', ...)` returns `/deep:review`. The shared fixture row `typed-stuck` says `typedReviewKept: false` (deep-loop-offer-cases.json:121) and the Python gate drops the run row on that prompt, but the TypeScript test only asserts `attachCommand` (deep-loop-offer-cases.vitest.ts:57), so the end-to-end surface the reader sees carries `/deep:review` with `typed: true`, a new costly run for a reader who reported a stuck one, and the TS and Python surfaces disagree on the very case REQ-020 names.
   Finding class: correctness
   Scope proof: command-attach.ts and advisor-recommend.ts are in the review scope file; REQ-020 names this prompt.
   Affected surface hints: typedCommandForTop, attachTypedCommand, deep-loop-offer-cases.vitest.ts typed cases
   Case: prompt "my deep review run is stuck, /deep:review again" with system-deep-loop as the top recommendation.

```json
{"type":"correctness","claim":"The served TS recommendation for a stuck-run complaint that also types /deep:review carries /deep:review (typed) instead of /doctor:deep-loop, contradicting the fixture's typedReviewKept=false and the Python gate.","evidenceRefs":[".skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:434",".skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:628",".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:257",".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:837",".skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:121",".skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:57"],"counterevidenceSought":"Looked for a stuck or doctor check in typedCommandForTop and attachTypedCommand, and for an ADR saying a typed command outranks the stuck diagnosis; found neither. The fixture comment defines typedReviewKept as the TS attachCommand result, which is why the suite passes.","alternativeExplanation":"The scorer may put command-doctor-deep-loop on top for this prompt, in which case typedCommandForTop returns undefined (owner system-deep-loop != command row id) and no override happens. Not verified end to end because runtime dist is missing in this worktree.","finalSeverity":"P1","confidence":0.75,"downgradeTrigger":"An end-to-end advisor run showing the top row is the doctor command row (not system-deep-loop) for this prompt, or an ADR that ranks the typed command above the stuck diagnosis."}
```

### P2 Findings
1. **Common refusal verbs still open the loop gate in both copies** -- .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:440 -- `RUN_ASK_NEGATED` lists `do not|don't|never|no need to|need not|without|not asking for|not looking for` and a bare `no`, but not `skip`, `avoid`, `instead of`, `rather than` or "no need for", although `COMMAND_DECLINE_LEADS` (command-attach.ts:686) treats `skip` and `avoid` as refusals of a typed command. Executed: "skip the deep review, just explain", "avoid a deep review here" and "there is no need for a deep review" each return `/deep:review` from `attachCommand` and `True` from Python `asks_for_loop_run` with the run row kept. REQ-015's six enumerated phrasings pass; these neighbours do not. Policy stays `ask`, so the cost is one unwanted question.
   Finding class: correctness
   Scope proof: command-attach.ts:440 and skill_advisor.py:4661 are the two gate copies under review.
   Affected surface hints: RUN_ASK_NEGATED, _RUN_ASK_NEGATED_RE, deep-loop-offer-cases.json refusal rows
   Case: prompt "skip the deep review, just explain the parser bug" on a single review route.

## Traceability Checks
- spec_code (partial): REQ-015/REQ-016/REQ-017/REQ-018/REQ-019 example prompts reproduced through `attachCommand` give the stated results (e.g. "do a deep review of the parser" keeps `/deep:review`, "don't do a deep review..." withholds). REQ-020's typed-stuck prompt agrees at the `attachCommand` level only; the served output diverges (P1 above).

## Integration Evidence
- `advisor-recommend.ts` `enrichCompiledRoutes` -> `attachTypedCommand` ordering at :556 and :628.
- Live CLI `node .skilled/bin/skill-advisor.cjs advisor_recommend` could not run: `runtime/dist/runtime/skill-advisor-cli.js` is missing in this worktree (exit 69). Rebuilding would write outside the lineage, so it was not done.

## Edge Cases
- Ambiguity: end-to-end confirmation of the P1 depends on which row tops the prompt; recorded in the adjudication packet as the downgrade trigger.
- Python and TS agree on the refusal gap (both miss), so it is a shared-vocabulary gap rather than drift.

## Confirmed-Clean Surfaces
- Hyphen spelling ("deep-review"), curly apostrophe folding, "not stuck, run 5 more iterations", "how many iterations does deep research run" all behave as REQ-016 to REQ-018 state.
- Typed mode suffix `:auto`/`:confirm` keeps the typed command (`typedCommandIn` -> `/deep:review`).

## Ruled Out
- No-edit wording beside a typed `/deep:review` ("/deep:review the parser, no edits") keeps the typed command; ruled out as a defect because the reader typed the command and a deep review does not edit the reviewed code.

## Next Focus
- Dimension: security
- Focus area: policy and trust surfaces of the offer (NFR-S01 `ask` never `run`), regex catastrophic backtracking in the gate patterns, and the Python fallback's subprocess path.
- Reason: correctness covered the main gate; security is next in rotation.
- Rotation status: 1 of 4 dimensions done.
- Required evidence: policy derivation for deep rows; timing of gate regexes on long adversarial input.

Review verdict: CONDITIONAL
