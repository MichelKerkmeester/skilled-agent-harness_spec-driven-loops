# Iteration 005 - Correctness (cross-reference pass)

## Dispatcher
- Lineage opus-medium-2, iteration 5 of 5. All four dimensions were covered in iterations 1-4, so this is a cross-reference pass on correctness over paths not yet exercised. steer.md: not present.
- Review focus coverage: the deferred-route branch of the offer gate (`deferredLoopCommand`, `NAMED_LOOP_MODE`, `MODE_CUES` in command-attach.ts) was executed on mixed-cue prompts, and the stage-one loop rule in explicit.ts that feeds the hub was read against the gate it borrows patterns from. The Python fallback has no deferred-mode branch (it gates rows, not modes), so the findings below are TypeScript-only.

## Files Reviewed
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:342-350`, `:571-578`, `:588`, `:899-924`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:444-485`
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:39-49`, `:290`
- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:30-48`

## Findings by Severity

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
1. **The named-mode shortcut reads a loop name that the gate already treated as the subject, so a review request gets /deep:research** -- .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:908 -- `deferredLoopCommand` settles the mode from `NAMED_LOOP_MODE` (command-attach.ts:924) before it looks at the looser cues, but `NAMED_LOOP_MODE` matches every `research loop` / `review loop` / `deep research` in the text, including one that `namesLoopSubject` skipped as the request's subject because a code noun follows it (command-attach.ts:588, :607-612). Executed: "run a deep loop to review the research loop config" returns `/deep:research` on a deferred route; the prompt asks for a review whose target is the research loop's config. Policy is `ask`, so the reader sees the wrong command in the offer rather than a started run.
   Finding class: correctness
   Scope proof: command-attach.ts deferred branch is the offer gate under review.
   Affected surface hints: deferredLoopCommand, NAMED_LOOP_MODE, namesLoopSubject
   Case: prompt "run a deep loop to review the research loop config" with the hub router deferring.

2. **A bare loop name does not count as an ask, which narrows D2 without a recorded decision** -- .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:574 -- spec.md:43 lists "It names a deep loop, deep research, deep review, a research loop or a review loop" as an explicit loop ask. The code counts `deep research` and `deep review` bare (LOOP_WORDING, command-attach.ts:277-283) but `deep loop`, `research loop` and `review loop` only behind a use, continue or want verb (command-attach.ts:342-350, :574-576). Executed: "deep loop: audit the payments flow" gets no command, while "deep review: audit the payments flow" does. The code comment states the reason (a loop name is as often a question as a request), but neither the spec nor decision-record.md records the narrowing; ADR-004 covers only names of the loop's own code or results.
   Finding class: traceability
   Scope proof: spec.md D2 list and command-attach.ts LOOP_REQUEST are both in scope.
   Affected surface hints: spec.md decision D2 list, decision-record.md, LOOP_NAMES
   Case: prompt "deep loop: audit the payments flow" on a deferred hub route.

## Traceability Checks
- spec_code (partial): spec.md:290's both-cue edge case holds ("run a deep loop to research and review the cache" carries no command); D2's loop-name clause is narrower in code than in the spec (P2 above).

## Integration Evidence
- explicit.ts:449-480 reads `MULTI_PASS`, `LOOP_COUNT` and `ITERATIVE_ASK` raw, without the gate's subject and refusal exclusions. This only lifts the hub's score; the command still passes through `attachCommand`, so a hub that tops on "research three-pass vs two-pass compilers" carries no command. Recorded as by design (scorer and offer are split), not a finding.

## Edge Cases
- Stage-one rule checks the research cue before the review cue (explicit.ts:473-474), so "review the research notes in 3 passes" scores the hub as research wording; it scores the hub only, so the mode choice is still the router's and the gate's.

## Confirmed-Clean Surfaces
- Single-cue deferred prompts resolve to the cued mode: "run 8 more review iterations" -> `/deep:review`, "start a deep loop to find out why the build is slow" -> `/deep:research`, "run a deep loop to check the parser for bugs" -> `/deep:review`.
- A loop ask with no mode cue ("start a deep loop on the auth module", "run 6 iterations to explain the parser") carries no command.

## Ruled Out
- Stage-one rule leaking a command: the rule scores only; the command path re-applies the full gate.

## Next Focus
- Dimension: none (max iterations reached); synthesis.
- Focus area: carry R1-P1-001 / R3-P1-001 to the merge with their downgrade trigger (end-to-end run with a built dist).
- Reason: stopPolicy max-iterations.
- Rotation status: 4 of 4 dimensions done, plus one cross-reference pass.
- Required evidence: n/a.

Review verdict: CONDITIONAL
