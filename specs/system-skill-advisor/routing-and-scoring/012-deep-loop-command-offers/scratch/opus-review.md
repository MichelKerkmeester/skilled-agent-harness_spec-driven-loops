# Independent review of the deep-loop offers packet after generation 10

## Root cause

The packet treats an advisory offer as a correctness-critical English parser, and then closes on adversarial reviewers finding nothing wrong in that parser.

The offer is cheap to get wrong. Its policy is `ask`: the reader sees one question and can say no. A missed offer still leaves the hub route, and the reader can still type the command. Even so, the gate tries to read English with word patterns: refusals, questions, past runs, effort complaints, clause breaks, zero-width characters and digit counts in later clauses. It does this twice, once in TypeScript and once in the Python fallback, with a drift guard and a 368-case fixture holding the two copies together. Phrasing is an open space, and no finite rule set closes it.

The numbers show the result. `command-attach.ts` grew from 586 to 1,834 lines over this packet. `skill_advisor.py` grew from 5,604 to 7,160 lines, and the fixture went from 0 to 368 cases. The eight traceability reruns found 2, 1, 4, 4, 3, 0, 1 and 4 P1s, with no downward trend. Generation 10 found two of its four P1s in round thirteen's own new patterns. Each round's fix is the next round's review surface, so the loop has no fixed point.

A second cause compounds the first. The closure docs quoted suite and fixture counts as true of "the final tree", and every fix round made those counts wrong. The review contract makes `spec_code` and `checklist_evidence` hard protocols, and either one reads `partial` on any claim that does not resolve. So each round's stale count failed coverage, whatever the code did.

## Design calls

- **Offer gate: overengineered for its purpose.** Asking for the loop explicitly was the right call. Building an English grammar to settle every edge phrasing was not. The duplicate Python copy is the clearest excess. `skill_advisor.py` `main()` tries the native advisor first and runs its own gate only when the native probe fails, so about 1,550 lines of duplicated patterns, plus the drift guard, exist for a degraded path. There a simpler rule would do: offer a deep-loop command only when the reader typed it.
- **AC-040 as written: not achievable.** It needs a reviewer to find no P1 in an open-ended heuristic, and it needs closure docs that never go stale while every round changes the counts they quote.
- **Coverage requiring zero partial hard protocols: correct by its contract, so I left it alone.** `review-mode-contract.yaml` defines `partial` as a claim that is still unresolved or ambiguous, and makes both core protocols `hard`. `reviewUnfinishedCoreProtocols` treats `partial` as unfinished on purpose. Letting coverage pass on a partial would change the stop decision for every deep review in the repository. The defect lies in this packet's criterion and its stale docs, not in the gate.
- **The reducer trusting a lineage's `gateClass`: wrong, so I fixed it.** `traceabilityResult` read the record's class before the contract table. Its own comment says the table exists so that a field cannot reclassify a protocol, yet a supplied field did exactly that.

## What I changed and why

1. `fix(system-deep-loop)` `87f1cb952c7`. In `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs`, `traceabilityResult` now gives any protocol the contract names the contract's class, using an own-key lookup. Only a protocol the contract does not name keeps the class its record carries. A lineage that writes `hard` on an overlay can no longer make that overlay gate, and one that writes `advisory` on `spec_code` can no longer silence it. One new case in `tests/unit/traceability-rollup.vitest.ts` pins all three readings.
2. `fix(system-skill-advisor)` `46465394d97`. This closes R3-P1-001. `.skilled/skills/system-skill-advisor/runtime/lib/skill-advisor-brief.ts` now prints the tracked table's policy and owner for an owned subprocess command, as the CLI path already did. The kept-row case in `tests/brief-command-owner-check.vitest.ts` now feeds a child policy (`run`) and owner (`sk-code`) that differ from the table's. I restored the old brief source temporarily and confirmed that the case fails there (`1 failed | 8 passed`), so the test is no longer blind.
3. Docs commit, which closes the stale-closure P2s without adding new moving counts:
   - The acceptance rows that claimed counts of "the final tree" (AC-009, AC-028, AC-029, AC-030, AC-037 and AC-042) now pin each count to commit `46465394d97`, or else state the command and "0 failed".
   - The v4.2.0.0 changelog suite row is pinned to the same commit.
   - T053 now says AC-008 reads `Waived` with ADR-003.
   - The lib README's stuck-run rule now states the run-refusing and no-edit exception and the typed-doctor rule, as `attachCommand` implements them.
4. ADR-010, added as **Proposed**. It accepts phrasing gaps as the gate's known limit and adds no new phrasing rules. It proposes that AC-040 and REQ-033 close on three conditions: evidence and scope pass in every lineage, no P0 is open, and every open P1 is either of the phrasing class or dispositioned. It also makes "pinned or 0 failed" the rule for closure counts, and records the dispositions for generation 10's P1s. AC-040 stays `Unmet`. The spec and the closure statement name ADR-010.

## What I left alone on purpose

- **L1-P1-001 and R1-P1-001**, the two phrasing gaps. Fixing them means more patterns in two languages, which is the loop that produced this state. ADR-010 records them as accepted gaps.
- **R2-P1-001**, the reducer's null fields. No gate in `runtime/scripts/` reads `findingClass`, `scopeProof` or `affectedSurfaceHints`. The strict v2 dispatch validator (`runtime/lib/deep-loop/post-dispatch-validate.ts:1268`) already requires `scopeProof` and `affectedSurfaceHints` on an active finding. Null is the honest value for a field the producer did not write.
- **The coverage rule**, for the contract reasons above.
- **Removing the Python duplicate.** I checked how far it reaches before deciding. The Python `asks_for_loop_run` also feeds `_is_loop_workflow_request`, which is the fallback's workflow-owner scoring guard, not only the offer. Removing it also touches the doctor-row, typed-row and ordering helpers, the 806-line drift guard, the fixture's Python columns, about 166 deep-loop lines in `test_skill_advisor.py`, and roughly fifteen REQs that name "both copies". Done halfway, it would leave the two copies disagreeing with no guard. It is the top follow-up, scored in ADR-010's alternatives.
- **The remaining generation 10 P2s.** These cover the two reducer projection details, the routed-mode substitution wording in two docs and in REQ-047, and the continuity metadata. The continuity fields belong to the continuity writer, `generate-context.js` through `/speckit:save`, and I did not hand-edit them, so `implementation-summary.md` still names generation 8 in `recent_action`.

## Verification

Final-state numbers, from `.skilled/skills/system-skill-advisor/runtime` and `.skilled/skills/system-deep-loop/runtime`:

| Gate | Baseline | Final | Delta and cause |
|------|----------|-------|-----------------|
| Advisor `npm run build` | exit 0 | exit 0 | none |
| Advisor `npx vitest run` | 187 files, 3,557 passed, 4 skipped, 0 failed | 187 files, 3,557 passed, 4 skipped, 0 failed | 0. The brief case was rewritten, not added |
| `python3 tests/python/test_skill_advisor.py` | pass=138, fail=0 | pass=138, fail=0 | none |
| Deep-loop `npx vitest run tests/unit` | 192 files, 3,637 passed, 2 skipped | 192 files, 3,638 passed, 2 skipped | +1, the new contract-class case |
| `validate.sh --strict` on the packet | not run | `Errors: 0  Warnings: 1`, `RESULT: PASSED`, exit 0 | The first run failed on generated-metadata drift, which `repair-derived.cjs --apply` re-derived. The one warning is `SOURCE_TAGS`: three citations inside the review lineages' containment baselines point at `.opencode/agents/deep-review.md`, which has moved. Those are review artifacts and I did not edit them |

The advisor gates were rerun after the README and changelog edits, on the final tree.

## Recommendation for closing AC-040

Accept ADR-010, then read AC-040 against generation 10 as it already stands, without a new rerun:
- Evidence and scope passed in all three lineages.
- No P0 is open.
- R3-P1-001 is fixed.
- R2-P1-001 is dispositioned.
- L1-P1-001 and R1-P1-001 are of the accepted phrasing class.

On those facts the row can read `Met` citing ADR-010. If the operator rejects ADR-010, the honest alternative is to waive AC-040 rather than run an eleventh generation, because the criterion as written cannot converge.

Open a follow-up packet that makes the Python fallback offer deep-loop commands only when they are typed. That deletes the duplicate gate and its drift guard, and amends the both-copies REQs in one place.
