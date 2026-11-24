# Review Iteration 003

## Dispatcher
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; dimension=maintainability.
Artifact directory: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/review/lineages/deepseek-max-2`. Read-only review; no `steer.md` exists in this lineage.

## Files Reviewed
- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2380` (`buildExhaustedApproaches`)
- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:374` (ruled-out section selection)
- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:407` (`ruledOut` extraction)
- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:217` (`extractSection`)
- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2421` (`replaceAnchorSection`)
- `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:503` (`PATTERN_PAIRS`)
- `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:571` (`PATTERNS_NOT_COMPARED`)
- `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:121` (`VOCABULARY_PAIRS`)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/review/lineages/deepseek-max-2/deep-review-strategy.md:44` (this lineage's own exhausted-approaches projection)

## Findings by Severity

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
1. **The reducer writes a ruled-out direction as a heading and drops the reason that closed it** -- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2404` -- `buildExhaustedApproaches` keys on the whole list item from the iteration's `## Ruled Out` section ([SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:407]) and writes it twice: once as `### ${entry} -- RULED OUT` and again as `- What was tried: ${entry}`, while the reason becomes one fixed sentence (`- Why ruled out: One pass of evidence did not support this direction.`, [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2406]). The reviewer's actual evidence for closing the direction never reaches the strategy, which is the document the next iteration reads to avoid re-entering it.
Finding class: class-of-bug (the projection discards the field it exists to carry).
Scope proof: the key is the full normalized item at `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:407`; the two print sites are `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2404` and `:2405`; the same loss occurs on the blocked branch at `:2411` and `:2413`.
Affected surface hints: `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs`, `.skilled/skills/system-deep-loop/runtime/tests/unit`.
Case: an iteration writes the direction and its evidence as the leaf template asks, "Bounded window loses a distant refusal -- the pattern span is smaller than the window", and the strategy's `## 10. EXHAUSTED APPROACHES` then reads `### Bounded window loses a distant refusal -- the pattern span is smaller than the window -- RULED OUT (iteration 1, 1 attempt)` with `- Why ruled out: One pass of evidence did not support this direction.` This lineage's own strategy shows the shape at [SOURCE: specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/review/lineages/deepseek-max-2/deep-review-strategy.md:52], where eight headings are whole sentences and every `Why` line is the generic one, so a later agent reading the strategy learns which directions are closed but not why, and the reopen test ("a later iteration carries evidence that contradicts that pass") has nothing to test against.
Claim adjudication:
```json
{"type":"data_loss","claim":"The exhausted-approaches projection keeps the direction text but replaces the reviewer's closing reason with a fixed sentence, so the strategy cannot carry the evidence that closed a direction.","evidenceRefs":[".skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:407",".skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2404",".skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2406","specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/review/lineages/deepseek-max-2/deep-review-strategy.md:44"],"counterevidenceSought":"read buildExhaustedApproaches in full for a reason split (there is none: the item is a single string), checked whether the iteration file is still pointed at from the strategy (it is not), and read extractListItems to see whether a separator convention exists (it strips only the bullet).","alternativeExplanation":"the template intends the strategy to hold a one-line direction and the iteration file to hold the reason, so nothing is lost for a reader who opens both.","finalSeverity":"P2","confidence":"high","downgradeTrigger":"a documented contract that the strategy carries directions only, with the iteration file named as the reason's home, would make the loss intentional and this advisory only."}
```
2. **A confirmed-clean surface is read as an exhausted direction when the iteration carries no `Ruled Out` heading** -- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:374` -- The section reader falls back from `Ruled Out` to `Confirmed-Clean Surfaces` and then to `Confirmed-Clean`, and every item it finds becomes a `ruledOut` direction that `buildExhaustedApproaches` writes as `RULED OUT` or `BLOCKED`. A clean surface is a pass, not a direction the run refuses to enter again.
Finding class: instance-only (one fallback chain conflates two opposite outcomes).
Scope proof: the fallback chain is at `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:374` and feeds `ruledOut` at `:407`; the projection that mislabels it is at `:2402`.
Affected surface hints: `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs`, `.skilled/skills/system-deep-loop/runtime/tests/unit`.
Case: an iteration file written in the older dialect, which holds `## Confirmed-Clean` but no `## Ruled Out` section, is reduced; 129 such files exist under `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/review-archive/*/lineages/*/iterations/`, so a resumed or extended run over an archived packet writes each clean surface into the strategy as a direction it may not re-enter, and the "Do NOT retry" wording arrives after a second pass.
Claim adjudication:
```json
{"type":"misclassification","claim":"When an iteration file has no Ruled Out section, the reducer treats its Confirmed-Clean items as ruled-out directions and projects them as exhausted approaches.","evidenceRefs":[".skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:374",".skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:407",".skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2402"],"counterevidenceSought":"searched the reducer for a second consumer of the fallback (none), checked the archived iteration files for the heading the fallback matches (129 files carry `## Confirmed-Clean`), and looked for a guard that skips the fallback when the section is a pass section (none).","alternativeExplanation":"the fallback exists for legacy files whose only closing section was named Confirmed-Clean and whose items were directions after all.","finalSeverity":"P2","confidence":"medium","downgradeTrigger":"a unit test showing a legacy file's Confirmed-Clean items are directions would make the fallback correct for its original inputs and leave only the naming risk."}
```

## Traceability Checks
No protocol was run this iteration: the maintainability pass read the reducer and the drift guard, and no REQ row changed status. `spec_code` stays `partial` from iterations 1 and 2 and is completed in the traceability iterations.

## Integration Evidence
- Drift-guard surface named: `PATTERN_PAIRS` (12), `ANCHORED_PATTERN_PAIRS` (8), `FRAGMENT_PAIRS` (16) and `QUANTIFIER_PAIRS` (4) compare 40 pairs, and `PATTERNS_NOT_COMPARED` lists 38 names, each with its reason ([SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:571]).
- Reducer projection surface named: `buildExhaustedApproaches` is the only writer of the strategy's `## 10` section, and this lineage's strategy is the artifact it writes.

## Edge Cases
- **Legacy section dialect.** `extractSection` matches a heading exactly, without a numeric prefix ([SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:217]), which is why the caller passes `'3. REVIEW DIMENSIONS (remaining)'` with its number at [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:417]. A strategy numbered differently from the template would lose that section read; the reducer's write path tolerates both forms through `headingCore`, so only the read is strict. Recorded as an edge case, not a finding: the template this packet uses numbers the section as the caller expects.
- **Two headings, one number.** `replaceAnchorSection` keeps the ordinal the file already gives a section ([SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2430]) and absorbs an authored heading above the anchor ([SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2453]), so a strategy built from the template keeps `## 3`, `## 6`, `## 7` and `## 12` once each, which is what this lineage's file shows.

## Confirmed-Clean Surfaces
- **The drift guard's coverage story is complete.** Every compiled gate pattern is compared, pasted into a compared fragment, or listed with a reason, and the lists total 40 compared pairs plus 38 reasoned exclusions ([SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:503], [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:571]).
- **The vocabulary guard reads lists, not literals.** `VOCABULARY_PAIRS` carries one row per exported list with its Python tuple name ([SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:121]), so a one-sided edit fails rather than drifting.
- **No dead caller for the typed single-command reading.** `typedCommandIn` stays exported as the boundary-test reading and the production paths use `typedCommandsIn` ([SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:252], [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:275]), matching REQ-025's text.

## Ruled Out
1. **The strategy's numbered reads are inconsistent** — `extractSection(strategyContent, '3. REVIEW DIMENSIONS (remaining)')` passes the number, so a numbered template reads correctly; the strictness is a documented edge case rather than a live defect for this packet's template.
2. **The reducer can duplicate a machine-owned heading** — the ordinal is taken from the file and the authored heading is absorbed, so this lineage's strategy holds one `## 3`, `## 6`, `## 7` and `## 12`.
3. **The fixture is a second source of truth for behaviour** — the fixture holds only input/expected columns and both suites read it ([SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:121]); no behaviour is encoded in the fixture that the gate does not implement, because each column is asserted against the gate's own return.

## Next Focus
- Dimension: traceability
- Focus area: `spec_code` — every REQ-001 to REQ-053 against the code or the ADR that records it, beginning with the closure records the twelfth round touched (REQ-025, REQ-053, REQ-031) and the REQ rows whose evidence is a probe or a fixture column.
- Reason: the lead focus; the last four iterations are traceability.
- Rotation status: 3 of 4 dimensions recorded; traceability remains.
- Required evidence: `file:line` for each REQ's implementing symbol or ADR section, full repo-relative paths only.
- Blocked/productive carry-forward: the two reducer P2s are code findings and must not be re-reported as doc findings.
- Recovery note: not applicable.

Review verdict: PASS
