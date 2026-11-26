# Review Iteration 006 — Maintainability

## Dispatcher

- Lineage `review/lineages/deepseek-max-1`, iteration 6 of 7, session `fanout-deepseek-max-1-1795550334883-gjbarh`
- Dimension: D4 maintainability. Lens: comment hygiene, generated-artifact parity, dead code, and whether the two halves of the refinement rule were kept in step.

## Files Reviewed

- Every code file in `review-scope-files.txt` with a `.ts`, `.py`, `.cjs` or `.mjs` suffix (28 files), searched for packet identifiers and spec paths in comments and for `TODO` / `FIXME` / `XXX:` markers
- `.skilled/commands/deep/assets/compiled/deep-review.contract.markdown:1`, `deep-research.contract.markdown:1`, `compiled/README.markdown:1`
- `.skilled/commands/deep/assets/deep-review.yaml:664`, `deep-research.yaml:663` (the `next_steps` lists the compiled contracts mirror)
- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1011`, `:2378`, `:2449` and eight neighbouring symbols
- `.skilled/skills/system-deep-loop/runtime/scripts/synthesis-closeout.cjs:380` to `:440` (`refinedTarget`)
- `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:571` (`PATTERNS_NOT_COMPARED`)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None.

## Traceability Checks

| Protocol | Level | Status this iteration | Evidence |
| --- | --- | --- | --- |
| `spec_code` | core | partial | No requirement opened for code this iteration. REQ-035 to REQ-051 remain and are reserved for iteration 7. Two requirements about maintainability were read as support rather than as new coverage: REQ-032 and REQ-046, whose behaviour is the reducer's and the closeout's. |
| `checklist_evidence` | core | partial | Unchanged from iteration 5 apart from the AC-038 drift already carried. |

## Integration Evidence

- The refinement rule REQ-032 states is kept in step across the two programs that implement it: `refinesSameLocation` (`reduce-state.cjs:1011`) returns false on a different normalized file or a conflicting dimension, and `refinedTarget` (`synthesis-closeout.cjs:406` to `:432`) applies the same two tests before it will fold a refinement into its target, with a comment that states the rule. A reader can change one and see the other, which is the property maintainability asks for.
- Generated-artifact parity holds: both compiled contracts carry the six `--extend=N` lines their source YAMLs carry (`deep-review.yaml:664`, `deep-research.yaml:663`), and `compiled/README.markdown` describes the contracts as generated, so a reader is told not to hand-edit them.

## Edge Cases

- The comment-hygiene rule the runtime framework applies to new code (no decision, requirement, checklist or task ids, and no spec paths, in a code comment) is not stated in the packet. All 28 scope code files pass it today, so the rule and the tree agree; recorded so a later change that cites an id in a comment is caught against the framework rule rather than against packet prose that does not mention it.
- The packet's own docs cite ids and paths heavily, which is correct for docs and is not what the comment rule covers. The two were kept apart deliberately in this iteration.

## Confirmed-Clean Surfaces

- No `.ts`, `.py`, `.cjs` or `.mjs` file in scope carries a `REQ-` / `ADR-` / `AC-` / `CHK-` id or a `specs/system-skill-advisor/...` path inside a comment.
- No `TODO`, `FIXME` or `XXX:` marker appears in any scope code file.
- No symbol named by a requirement is dead: `refinesSameLocation`, `MIN_BLOCKED_ATTEMPTS`, `replaceAnchorSection`, `collapseFindingsByDedupKey`, `dedupeDimensions`, `buildExhaustedApproaches`, `upsertHeadingSectionBefore` and `renderFrontierSection` each have a definition and at least one call site in `reduce-state.cjs`.
- The 38 rows of `PATTERNS_NOT_COMPARED` each carry a written reason, so the guard's exceptions are auditable rather than a silent skip list.

## Ruled Out

- Packet identifiers leaking into code comments in any scope file: eliminated, the search over all 28 code files found none.
- A compiled contract that lags its source YAML: eliminated, both contracts carry the lines the YAMLs carry.
- Dead code among the reducer symbols the requirements name: eliminated, every one has a call site.
- Two disagreeing implementations of the refinement rule: eliminated, the reducer and the closeout apply the same file-and-dimension test.

## Review Focus

The operator focus is traceability, and this iteration served it indirectly: the two requirements that live in the reducer and the closeout (REQ-032, REQ-046) are implemented once, in step, and with a reason written where the rule is. D4 is now covered, which is the last dimension the review needs before it can report coverage.

## Next Focus

- Dimension: cross-reference closing pass — finish `spec_code` over REQ-035 to REQ-051, re-derive the overlay protocols, and settle the status of both core protocols
- Focus area: the plural loop name (REQ-035), the how-do question (REQ-036), the speed and cost complaint (REQ-037), the degraded tracked-table guard (REQ-038), the corpus (REQ-039), the no-edit clause (REQ-040), the refused mode cue (REQ-041), the routed mode guard (REQ-042), the pronoun rerun (REQ-043), the effort manner and typed doctor (REQ-044), the mode vocabulary guard (REQ-045), the reducer direction (REQ-046), the mode-free ask (REQ-047), the numbering (REQ-048), the whitespace fold (REQ-049), the negated refusal (REQ-050) and the pattern guard (REQ-051)
- Reason: this is the last block of requirements, and it is the only thing keeping `spec_code` at `partial`
- Rotation status: all four dimensions covered; this is the closing cross-reference pass
- Blocked/productive carry-forward: AC-040 cannot close before synthesis; AC-038 is the one open docs row
- Required evidence: for each requirement, the fixture row and the column value the requirement states, plus `file:line` of the rule that reads it

Review verdict: PASS
