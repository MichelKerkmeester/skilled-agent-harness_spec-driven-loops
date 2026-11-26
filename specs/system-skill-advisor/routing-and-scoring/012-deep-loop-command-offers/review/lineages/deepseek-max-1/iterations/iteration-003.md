# Iteration 3 - maintainability

## Dispatcher

- Lineage: `deepseek-max-1`, generation 10, run `fanout-deepseek-max-1-1795556727682-axtzf8`
- Dimension: maintainability
- Review target: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers`
- Operator focus addressed: the maintainability pass reads the thirteenth round's test and projection surfaces (the drift guard, the brief ownership test, the reducer unit cases) and the closure rows that describe them, then checks whether each guard can fail for the class it claims.

## Files Reviewed

- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2392` (`splitRuledOutEntry`)
- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2409` (`buildExhaustedApproaches`)
- `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-review-state-reducer.vitest.ts:1610` (the ruled-out cases)
- `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-review-strategy-numbering.vitest.ts:64` (the template-numbering cases)
- `.skilled/skills/system-deep-loop/runtime/tests/unit/next-focus-iteration-verdict.vitest.ts:27` (the Next Focus fixture)
- `.skilled/skills/system-skill-advisor/runtime/tests/brief-command-owner-check.vitest.ts:89` (the two ownership cases)
- `.skilled/skills/system-skill-advisor/runtime/lib/skill-advisor-brief.ts:184` (`ownedCommandRecommendation`)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:313` (`trackedCommandForOwner`)
- `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:490` (`PATTERN_PAIRS`)
- `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:574` (`PATTERNS_NOT_COMPARED`)
- `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:678` (the reason assertion)
- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:2` (the fixture header)
- `.skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py:2905` (the served-column reader)
- `.skilled/skills/system-skill-advisor/runtime/lib/README.md:146` (the command-attach paragraph)
- `.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md:33` (the offer section)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:222` (T115 to T121)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/implementation-summary.md:202` (the thirteenth-round rows)

## Findings - New

### P0 Findings

None.

### P1 Findings

None new. Carried forward: `L1-P1-001` (a refused run ask after a loop question is read as an ask) is still active.

### P2 Findings

1. **A ruled-out reason that quotes a spaced `--` inside a code span is cut in two** -- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2396` -- `splitRuledOutEntry` finds the first `\s+--\s+` or em dash anywhere in the entry, including one inside Markdown backticks. The T120 fix added the split so a reason survives, but the separator scan does not respect a code span, so an entry such as "only `\s+--\s+` and `\s+—\s+` split an entry" is cut at the operator quoted inside the span. This iteration's own strategy projection shows the result: the direction becomes "only `\s+" and the reason becomes "\s+` or a bare `—` split an entry." The two halves are no longer the direction and reason the review wrote.
   - Finding class: `class-of-bug`
   - Scope proof: `reduce-state.cjs` is on `review-scope-files.txt`; the separator, both callers and the projection output were read at this revision, and the cut is visible in `deep-review-strategy.md` section 10 of this lineage after the iteration 1 reducer pass.
   - Affected surface hints: `splitRuledOutEntry`, `buildExhaustedApproaches`, the `Exhausted Approaches` strategy section, the T120 unit cases
   - Case: an iteration rules out the direction "separator scans" and writes "only `\s+--\s+` and `\s+—\s+` split an entry" as the reason; the projection splits it at the `--` inside the backticks and writes a direction that ends mid-code-span.
   - Fix direction: mask Markdown code spans before the separator scan (or scan for a separator outside a backtick pair), the way a reader sees the text.
   - Claim adjudication:
     - `type`: `markdown_awareness_gap`
     - `claim`: the ruled-out separator scan is not code-span aware, so a spaced `--` or an em dash quoted inside backticks is treated as the direction/reason boundary.
     - `evidenceRefs`: `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2396`, `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2400`, `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/review/lineages/deepseek-max-1/deep-review-strategy.md:83`
     - `counterevidenceSought`: checked whether `normalizeText` strips backticks before the split (it does not run before the separator scan), whether the T120 unit cases include a code span with a spaced `--` (none do), and whether a later pass re-merges the halves (it does not; the split text is the key).
     - `alternativeExplanation`: the split may be intentional because the strategy text is plain prose and backticks are only decoration; but the same decoration is common in a review note, and the result is a direction that no longer names the direction.
     - `finalSeverity`: P2
     - `confidence`: 0.95
     - `downgradeTrigger`: if the reducer documents that a ruled-out entry must not quote a spaced separator inside a code span, the finding becomes a wording note on the iteration template instead.

2. **The brief ownership test cannot tell the child's policy and owner from the tracked table's** -- `.skilled/skills/system-skill-advisor/runtime/tests/brief-command-owner-check.vitest.ts:113` -- The second case feeds `{skill: "sk-doc", command: "/create:readme", policy: "start", ownerSkillId: "sk-doc"}`. Those are exactly the tracked table's values for `/create:readme`, so the assertion that the rendered row carries `start` and `sk-doc` passes whether the brief keeps the child's fields or overrides them with the table's. The first case covers only a command the table does not track. No case gives the child a policy or owner that differs from the table, so the security finding's passthrough has no test that can fail for it.
   - Finding class: `test-isolation` (a test that cannot fail for the class it claims to pin)
   - Scope proof: the test, the helper and both consumers are on `review-scope-files.txt`; the test's two rows and the table's `/create:readme` and `/deep:review` entries were read at this revision, and the assertion values were compared with `COMMAND_ROWS`.
   - Affected surface hints: `buildSkillAdvisorBrief command ownership`, `ownedCommandRecommendation`, `trackedCommandForOwner`, the CLAUDE/advisor brief test set
   - Case: a regression makes `ownedCommandRecommendation` return the tracked table's policy and owner (the change the security finding recommends); the existing second case still passes because both sides are `start`/`sk-doc`, so the test reports green while the behavior changed.
   - Fix direction: add a case whose child row says `policy: "run"` (or `ownerSkillId: "sk-code"`) for a tracked command and assert the table's value is what renders, or assert the mismatched field is dropped.
   - Claim adjudication:
     - `type`: `test_cannot_fail`
     - `claim`: the ownership test's accepted row uses the same policy and owner the tracked table holds, so it cannot distinguish the child's values from the table's and does not cover the field-level passthrough.
     - `evidenceRefs`: `.skilled/skills/system-skill-advisor/runtime/tests/brief-command-owner-check.vitest.ts:113`, `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:76`, `.skilled/skills/system-skill-advisor/runtime/lib/skill-advisor-brief.ts:191`
     - `counterevidenceSought`: checked whether another test file feeds a mismatched policy on the brief path (`rg "policy: 'run'" tests` finds CLI and renderer cases, not this brief path), whether the first case's stripped row could catch it (it has no tracked command, so it tests the strip), and whether the table's `/create:readme` values differ from the fixture (they do not).
     - `alternativeExplanation`: the case may be written to pin the positive path only, with the field-level contract left to the renderer's own tests; but the renderer's tests do not cover a subprocess row, so the gap is on this path alone.
     - `finalSeverity`: P2
     - `confidence`: 0.9
     - `downgradeTrigger`: if the packet treats the accepted row's fields as always table-derived by construction, the second case is a smoke test and the gap is only a coverage note.

## Traceability Checks

- `spec_code` — partial. The reducer slice was mapped: REQ-059 at `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2392`, REQ-052 at `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:227`, REQ-048 at `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2450`, REQ-032 at `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1011`; REQ-058 at `.skilled/skills/system-skill-advisor/runtime/lib/skill-advisor-brief.ts:184`. REQ-001 to REQ-031 and REQ-033 to REQ-051 remain unmapped in this lineage, so the protocol stays `partial`.
- `checklist_evidence` — partial. T115 to T121 were read against their named symbols and the evidence-tail checker reports `problems=0` on this tree (`python3 specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/scratch/citations/evidence-tails.py`). The ownership test's coverage gap is not named by any AC row; the checklist is therefore `partial`.

## Integration Evidence

- Reducer surface: `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` is the reducer this lineage runs after every iteration; the two functions the findings name are the ones that wrote this lineage's `Exhausted Approaches` section.
- Hook test surface: `.skilled/skills/system-skill-advisor/runtime/tests/brief-command-owner-check.vitest.ts` pins the hook brief that `.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-fallback.ts` renders.
- Fixture surface: `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json` is read by both `tests/deep-loop-offer-cases.vitest.ts` and `tests/python/test_skill_advisor.py`; the header names the column contract and the two readers implement it at line 208 and line 2905 respectively.
- Command docs: `.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md:33` and `.skilled/skills/system-skill-advisor/runtime/lib/README.md:146` describe the gate and the ownership check; both were read and neither claims the brief uses the table's policy.

## Edge Cases

- The `PATTERNS_NOT_COMPARED` reason test asserts only `reason.length > 0`, so a one-character reason would satisfy it. This is recorded as a boundary of the guard rather than a finding: the table is a human-readable excuse list and every current entry carries a substantive reason.
- The `QUANTIFIER_PAIRS` test checks that both sources contain the count string, not that it sits in the same grammar position. Recorded as a known limit of a source-text comparison, not a defect.
- The fixture's `servedRun` column is optional; the header says "where present", and the readers check only a present value. A new row can omit it, which is a documented choice rather than drift.
- The reducer's `buildExhaustedApproaches` also groups by full entry text (iteration 1's P2). The code-span finding is a second, independent failure of the same splitter; both are in the projection and neither is covered by the T120 unit cases.

## Confirmed-Clean Surfaces

- `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-review-strategy-numbering.vitest.ts:64` -- the test seeds the shipped template, asserts `strategyWarning` is null, and checks that the four machine sections keep the template's numbers and survive a second pass unchanged.
- `.skilled/skills/system-deep-loop/runtime/tests/unit/next-focus-iteration-verdict.vitest.ts:27` -- the fixture carries the focus lines above a `Review verdict:` line and the test reads the projection back as separate non-empty lines with the verdict absent.
- `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:686` -- the compiled-name accounting and its reverse direction are both present and read the gate slice, not the whole file.
- `.skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py:2905` -- the Python suite reads `servedRun` when present and rejects a value outside `review|research|none`, matching the TypeScript reader at `tests/deep-loop-offer-cases.vitest.ts:335`.
- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:2` -- the header states the layer each column pins, including the typed-on-stuck exception and the explicit `none` value.

## Ruled Out

- "The strategy-numbering test passes over a skipped rewrite": ruled out. It asserts `strategyWarning` is null and would fail if a machine section were left untouched.
- "The Next Focus test masks a flattened projection": ruled out. It reads the projected section as separate lines and asserts the verdict is absent.
- "The fixture's served column can be `null`": ruled out. Both readers accept only `review`, `research` or `none`; a null is not a value either reader accepts.
- "The reason test accepts a stale name": ruled out after T118. The reverse test checks each excused name is still assigned in the gate slice; only the *quality* of the reason is unchecked.
- "The ownership test's first case covers the field passthrough": ruled out. The first case's command is untracked, so it exercises only the strip path.

## Next Focus

- Dimension: traceability
- Focus area: `spec_code`: map every REQ-001 to REQ-052 to its code, test or decision, starting with the earliest requirements, and run the overlay protocols where they apply.
- Reason: maintainability found two P2s in the test/projection surfaces; the focus's main promise, a complete REQ-to-code map, is still only one sixth done.
- Rotation status: correctness, security and maintainability done; traceability remains, four iterations available.
- Blocked/productive carry-forward: productive -- the reducer projection and the test tables are readable directly; no blocked direction.
- Required evidence: one file:line per requirement, with the decision record cited where a requirement is a decision rather than code.
- Recovery note: none.

Review verdict: CONDITIONAL
