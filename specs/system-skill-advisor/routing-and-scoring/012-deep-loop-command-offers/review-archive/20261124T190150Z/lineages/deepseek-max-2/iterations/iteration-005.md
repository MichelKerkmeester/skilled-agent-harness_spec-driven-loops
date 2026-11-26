# Review Iteration 005

## Dispatcher

- Lineage `deepseek-max-2`, iteration 5 of 7, mode `review`, `AUTONOMOUS`.
- Dimension: **maintainability**. Operator focus carried as the reducer and closeout slice of the sixth round: REQ-032, REQ-046 and REQ-034's closure-doc clause.
- Review target: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers` (`spec-folder`).

## Files Reviewed

- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:985` to `:1045` - `refinesSameLocation` and the dedupe that consumes it.
- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2355` to `:2400` - `MIN_BLOCKED_ATTEMPTS` and `buildExhaustedApproaches`.
- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2410` to `:2445` and `:2570` to `:2620` - `replaceAnchorSection`, its heading fallback, and the six sections the reducer writes.
- `.skilled/skills/system-deep-loop/runtime/scripts/synthesis-closeout.cjs:406` and around it - the closeout's refinement lookup.
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:363` to `:441` - `enrichCompiledRoutes` and its `alreadyOffered` guard.
- `.skilled/skills/system-deep-loop/deep-review/assets/deep-review-strategy.md:39` to `:135` - the shipping template's section numbering.
- `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-review-strategy-heading.vitest.ts:1` to `:60` - what the heading regression covers.
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/implementation-summary.md:234` to `:269` - the sixth-round paragraph and limitations 4 to 8.
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/review/lineages/deepseek-max-2/deep-review-strategy.md` - this lineage's own strategy, as the reducer's output.

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The reducer renumbers four machine sections, so every template-derived strategy ends with two §4, two §5, two §9 and two §11 headings** -- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2580` -- The shipping template numbers its sections `## 6. COMPLETED DIMENSIONS`, `## 7. RUNNING FINDINGS`, `## 10. EXHAUSTED APPROACHES (do not retry)` and `## 12. NEXT FOCUS` (`.skilled/skills/system-deep-loop/deep-review/assets/deep-review-strategy.md:61`, `:72`, `:96`, `:128`). `replaceAnchorSection` is called with the headings `4. COMPLETED DIMENSIONS`, `5. RUNNING FINDINGS`, `9. EXHAUSTED APPROACHES (do not retry)` and `11. NEXT FOCUS` (`reduce-state.cjs:2580`, `:2581`, `:2585`, `:2614`), and it writes the replacement as `## ${heading}`, so a strategy created from the template gains a second §4, §5, §9 and §11 beside the sections that already hold those numbers. This lineage's own strategy shows the result: `## 4. NON-GOALS` at `:25` and `## 4. COMPLETED DIMENSIONS` at `:41`, `## 5. STOP CONDITIONS` at `:33` and `## 5. RUNNING FINDINGS` at `:48`, `## 9. WHAT FAILED` at `:63` and `## 9. EXHAUSTED APPROACHES` at `:71`, `## 11. RULED OUT DIRECTIONS` at `:146` and `## 11. NEXT FOCUS` at `:155`. The heading regression (`deep-review-strategy-heading.vitest.ts`) exercises the `10A` insertion and both heading dialects, so nothing pins the numbering a fresh template gets.
Case: an operator or a later agent cites "strategy §5" in a handover; two sections carry that number, one holding the stop conditions and one holding the finding counts, so the reference is ambiguous in every run this reducer has written.
Finding class: reducer-output-defect
Scope proof: the reducer, the template and the produced strategy are all inside the pre-bound scope list; the produced file is this lineage's own artifact, so the defect is observed rather than inferred.
Affected surface hints: `reduce-state.cjs` section writers; `deep-review-strategy.md` template numbering; every deep-review strategy file the reducer touches.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | partial | REQ-032, REQ-034 and REQ-046 were mapped this iteration. REQ-032 and REQ-046 hold in code and in this lineage's own reducer output; REQ-034's closure-doc clause holds for the cells it names. The requirement-to-code map now covers REQ-001 to REQ-046, with REQ-012 and REQ-031 failing and REQ-023 to REQ-030, REQ-035 to REQ-046 holding. |
| `checklist_evidence` | partial | AC-039, AC-041 and AC-054 were re-read against the tree and all three hold. The cells that fail are those recorded in iterations 1 and 3. |

Observed measurements behind the rows (read-only, plus the reducer this lineage is required to run):

- **REQ-032 holds.** `refinesSameLocation` (`reduce-state.cjs:995`) returns false when both sides name a file and the paths differ, and false when the target declares a dimension and the refinement declares another; a same-file, same-dimension refinement still folds. `synthesis-closeout.cjs:406` reads the same `refines` key when it resolves a target, so the closeout does not lose the link.
- **REQ-046's first clause holds on a produced artifact.** `MIN_BLOCKED_ATTEMPTS = 2` (`reduce-state.cjs:2362`) writes a single-attempt direction as `### <direction> -- RULED OUT (iteration N, 1 attempt)` with a `- Reopen when:` line, and only two attempts produce `BLOCKED` with `- Do NOT retry:`. This lineage's strategy now carries six one-attempt directions, each written with its reopen line and none written as a permanent prohibition.
- **REQ-046's second clause holds.** The authored heading is stripped before replacement (`reduce-state.cjs:2420` to `:2430`), so a strategy that already carries `## 11. RULED OUT DIRECTIONS` above the anchor does not gain a second copy of that heading. That is the one section the reducer replaces by plain heading rather than by anchor, and its single-heading behaviour is what the finding above shows does *not* hold for the four anchor sections.
- **REQ-046's third clause holds.** `enrichCompiledRoutes` (`advisor-recommend.ts:363`) seeds `alreadyOffered` from every command the output already carries, adds to it whenever it keeps a command, and strips `command`, `policy`, `ownerSkillId` and `typed` from a withheld row (`:421` to `:425`), so a derived command reaches the reader once and a withheld row offers nothing.
- **REQ-034's closure-doc clause holds for the cells it names.** `implementation-summary.md:238` carries the sixth-round paragraph, `:236` says the stuck-run drop was reversed, `:266` states the typed-on-stuck exception, `:267` the one remaining word-rule miss and `:268` the served-brief gap. The changelog's three rules are at `v4.2.0.0.md:482` to `:484`, and packet 013's degraded-path evidence is at `013-deep-loop-offer-in-hint/implementation-summary.md:123`.
- **AC-039, AC-041 and AC-054 hold.** `reduce-state.cjs:995` implements the refinement rule, the Verification Summary counts agree with the boxes (iteration 3), and `reduce-state.cjs:2362` with `deep-review-strategy-heading.vitest.ts:37` implement and pin the ruled-out and heading behaviour AC-054 names.

## Integration Evidence

None recorded. `synthesis-closeout.cjs` was read only for its `refines` lookup, which is named above; no closeout run was performed.

## Edge Cases

- **Defect observed through this lineage's own artifact.** Finding 1 is not inference: the reducer is required work for this lineage, and its output is the strategy file named. The same defect would appear in any lineage started from the shipping template, so it is not specific to this packet — recorded here because the reducer is in the packet's scope and REQ-046 is a claim about how the reducer writes the strategy.
- **Duplicated ruled-out text, not reported.** `buildExhaustedApproaches` groups `deadEnds` and `ruledOut` by their full sentence, so a long ruling becomes a long heading. It is verbose, but it is the author's own text and the reducer cannot shorten it without dropping evidence. Recorded as a design cost, not a finding.
- **Not reproducible here.** The three unit files behind REQ-032 and REQ-046 were read as sources rather than run.

## Confirmed-Clean Surfaces

- `refinesSameLocation` and its callers: the other-file rule, the other-dimension rule and the same-file fold all behave as REQ-032 states.
- `buildExhaustedApproaches`: one attempt produces a reopenable ruling, two produce a blocked one, and distinct runs are deduplicated.
- `enrichCompiledRoutes`: commands are offered once, the top row keeps the command, and a withheld row leaves no command field behind.
- `synthesis-closeout.cjs`: reads the same `refines` key as the reducer.
- `implementation-summary.md:236` to `:238` and `:266` to `:268`: every line AC-041 cites holds the content the cell describes.

## Ruled Out

- **A refinement that loses its own entry in the reducer.** The same-file fold and the other-file split both behave as decided, and the closeout reads the same link.
- **A ruled-out direction written as a permanent prohibition.** One-attempt rulings carry a reopen line; only repeated evidence blocks.
- **A derived command offered twice.** The `alreadyOffered` set is seeded and extended in the same pass.
- **A closeout that drops a refinement link.** `synthesis-closeout.cjs:406` reads the key the reducer writes.

## Next Focus

- Dimension: traceability (`spec_code`), second half. Operator focus carried directly: REQ-032 to REQ-046, ADR-005 and ADR-006, re-read against the code and the decision text after the failures found in iteration 1.
- Focus area: the remaining requirement block and the two decision records, including whether each decision's stated rule is what the tree implements.
- Reason: `spec_code` needs its second half to be complete before the final pass, and the sixth-round decision records have not been checked as decisions yet.
- Rotation status: `correctness`, `security` and `maintainability` complete; `traceability` has two of three passes done.
- Blocked/productive carry-forward: productive - reading the decision record beside the code it decided, since a decision that disagrees with the code is a LOGIC-SYNC concern; blocked - none.
- Required evidence: one `file:line` per requirement and per decision rule.
- Recovery note: none.

Review verdict: PASS
