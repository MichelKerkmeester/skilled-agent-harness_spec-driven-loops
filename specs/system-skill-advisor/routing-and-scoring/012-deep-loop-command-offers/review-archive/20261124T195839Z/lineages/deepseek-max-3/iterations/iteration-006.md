# Review Iteration 006 — correctness (the sixth fix round, AC-030 to AC-042, behaviour by behaviour)

## Dispatcher

- Mode: `review`; target agent: `@deep-review` (LEAF, single iteration).
- Resolved route: `Resolved route: mode=review target_agent=deep-review`.
- Lineage: sessionId `fanout-deepseek-max-3-1795546920757-7pyjry`, generation 1, lineageMode `new`, executor cli-pi (deepseek-v4.1-flash-1017).
- Setup bindings (unchanged; emitted in full at iteration 1).
- Review focus for this iteration: the operator's sixth-round clause read as behaviour — "including the sixth fix round (REQ-023 to REQ-034, AC-030 to AC-042, ADR-005, ADR-006)". Iteration 5 proved each row's evidence exists; this iteration asks whether each row's stated behaviour is what the built gate does, and pushes adversarial inputs through both copies.
- `steer.md` is absent at this iteration.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:688` (`RUN_ASK_REFUSAL_LEADS`), `:748-773` (`LEAD_WINDOW`, `endsBefore`, `runAskNegatedAt`), `:1132` (`asksForLoopRun`), `:1537` (`attachCommand`), `:1648` (`routedLoopMode`)
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5167-5170` (`_RUN_ASK_NEGATED_RE` construction), `:5302` (`asks_for_loop_run`)
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:442` (`attachTypedCommand`)
- `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1489` (`trackedCommandForOwner`), `:1503` (`degradedRecommendations`)
- `.skilled/skills/system-skill-advisor/runtime/lib/render.ts:250` (typed rows print no offer)
- `.skilled/skills/system-skill-advisor/runtime/tests/{command-attach-guards,typed-on-stuck-serving,command-brief-golden,subprocess-typed-fields,cli-degraded-command-contract,deep-loop-offer-cases}.vitest.ts`
- `.skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py:3054` (`DEEP-LOOP-LONG`)
- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json` (347 rows, probed)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:87-99` (AC-030 to AC-042)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:412` (ADR-005), `:508` (ADR-006)
- `specs/system-skill-advisor/routing-and-scoring/013-deep-loop-offer-in-hint/implementation-summary.md:123` (the degraded-path row 012's REQ-034 borrows)

## Findings - New

### P0 Findings

None.

### P1 Findings

None new.

### P2 Findings

1. **A negated refusal reads as a refusal in both gate copies** -- .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:766 -- Both copies withhold the offer when the refusal lead is itself negated. "do not skip the deep review, run it properly" and "there is no need to skip the deep review" both read `asksForLoopRun: false` / `asks_for_loop_run: false` on the built artifacts, so a reader who asks the gate *not to skip* the loop gets the hub with no command. The cause is that `runAskNegatedAt` (`command-attach.ts:766`) matches any `RUN_ASK_REFUSAL_LEADS` entry (`:688`) behind a negation lead, without asking whether that entry (`skip`, `avoid`, `no need`) is itself the thing being negated; the Python copy (`skill_advisor.py:5167-5170`) transcribes the same grammar. The two copies agree, so this is a rule gap rather than drift, and the miss costs the reader a typed command rather than spending a run.
   Finding class: `class-of-bug`
   Scope proof: probed the built `dist` gate and the loaded Python module on the same two prompts; `runAskNegatedAt` and `_RUN_ASK_NEGATED_RE` are the only readers that can produce the result, and both were read at the cited lines. A control ("run a deep review on the parser") returns true in both copies, so the probe distinguishes a rule gap from a broken harness.
   Affected surface hints: `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts`, `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py`, `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json`
   Case: "do not skip the deep review, run it properly" — an explicit instruction to run the loop — gets no `/deep:*` command from either copy.

```json
{"type":"correctness","claim":"a negated refusal verb withholds the offer even when the sentence asks not to skip the run","evidenceRefs":[".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:766",".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:688",".skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5167"],"counterevidenceSought":"read the refusal-lead grammar and the negation window for any guard that distinguishes a negated refusal verb from a negated run ask (none); checked the fixture for a double-negation row (none); confirmed the control prompt still returns true","alternativeExplanation":"double negation is rare and a reader who says 'do not skip' will type the command anyway, so the miss may not be worth a guard","finalSeverity":"P2","confidence":"high","downgradeTrigger":"a recorded decision that double negations are out of scope, or a rule that reads a negated skip/avoid lead as an ask"}
```

## Traceability Checks

| Protocol | Status | Evidence |
|---|---|---|
| `spec_code` | fail | unchanged: REQ-031 drift (P2), REQ-033 unmet (P1) |
| `checklist_evidence` | pass | unchanged from iteration 5 |

### AC-030 to AC-042, behaviour by behaviour

| AC | Stated behaviour | Observed | Result |
|---|---|---|---|
| AC-030 | six refusals read false, three controls keep `/deep:review` | probed: six refusals `asks: false`, three controls `asks: true` and `/deep:review` | holds |
| AC-031 | two run-refusing stuck prompts lose the doctor; the plain complaint keeps it | probed: both lose it, the plain complaint returns `/doctor:deep-loop`; the fused row and both describes exist | holds |
| AC-032 | two double-typed prompts keep `/deep:review` at the gate and the served head | probed at the gate layer on a review route; `typedCommandsIn` order puts `/deep:review` first and `typedCommandForTop` returns it; the four `typedRunsKept` rows agree | holds |
| AC-033 | deferred route serves `/deep:review` for both prompts | probed both, plus the two controls from the guard file | holds |
| AC-034 | the pass-report prompt carries no loop boost and no sk-code penalty; the pass-ask carries both | read `explicit.ts:442-495` and the four cases at `stage-one-loop-subject.vitest.ts` | holds |
| AC-035 | both degraded paths print `/deep:review (ask)` with no `A ` text | `render.ts:250` suppresses the offer for a typed row; the three named tests exist at their cited lines | holds |
| AC-036 | the served head keeps `/deep:review` with `typed: true` | `attachTypedCommand` (`advisor-recommend.ts:442`) overrides the diagnosis; fixture `servedReviewKept`; probe agrees | holds |
| AC-037 | 96,000-character prompt under one second; repeated refusals stay withheld; every fixture case keeps its result | 347/347 fixture results reproduced by probe; timing not re-run (recorded 103 ms / 100 ms) | holds at the level a static pass can reach |
| AC-038 | the drift guard fails on a one-sided list edit and on an entry with no fixture case | 22 pairs, 12 per-entry lists, 10 grammar-only; `it.each` blocks exist; the `SMALL_EDIT_WORDING` gap is R1-P2-002 | holds for the 22 pairs; the 23rd export is the filed P2 |
| AC-039 | a refinement at another file keeps its own entry; the target keeps title and file | `refinesSameLocation` (`reduce-state.cjs:995`); both unit files exist | holds |
| AC-040 | the traceability rerun finishes both protocols and passes the terminal gates | not observed in the reviewed tree (this lineage is the rerun, and its verdict is CONDITIONAL) | **does not hold** — R1-P1-001 |
| AC-041 | every closure doc states the built behaviour | re-read the five surfaces in iteration 1 and the changelog rows at `:482-484`; all present | holds |
| AC-042 | both suites, the comparison, the 69 probes and the corpus recapture pass with `false_offer` 0 | recorded with commit stamps; the probe files exist with 69 rows each | holds as recorded |

### ADR-005 and ADR-006, re-checked as behaviour

- ADR-005: `attachCommand` answers `/doctor:deep-loop` on the typed-stuck probe, and `attachTypedCommand` replaces it with the typed `/deep:review (ask)`; the fixture's `servedReviewKept` column and `typed-on-stuck-serving.vitest.ts` both pin it. The decision's stated rollback (drop the typed override) is one function call in `advisor-recommend.ts`.
- ADR-006: `LOOP_NAMES` is read only behind a use/continue/want verb; the fixture row `bare-loop-name` reads false, and the D2 bullet cites the ADR (`spec.md:43`). Re-checked against the built gate: "deep loop: audit the payments flow" stays false.

## Integration Evidence

- Both gate copies were executed for the double-negation probe: the TypeScript `dist` build and the loaded `skill_advisor.py` module. Their agreement is the point — the finding is a shared rule gap, not a parity failure.
- Packet 013's row `implementation-summary.md:123` cites `subprocess-typed-fields.vitest.ts:88`, `command-brief-golden.vitest.ts:364`, and `cli-degraded-command-contract.vitest.ts:81` / `:69`; each line was read and holds the case it is cited for, so 012's REQ-034 borrow of that row is backed.

## Edge Cases

- The double-negation finding was checked against the packet's own history: the gate has no double-negation fixture row, and REQ-023's list of refusals does not include one. It is reported as a new class member rather than as a reopened finding.
- AC-042's suite claims cannot be re-executed inside a review lineage (a suite run writes outside the lineage's write surface), so they are re-read as recorded measurements with their commit stamps.
- AC-032's served head was not executed; the gate layer was.
- ADR-006's "bare loop name" behaviour is a deliberate narrowing; the probe confirms it, and the D2 bullet records why.

## Confirmed-Clean Surfaces

- Eleven of the thirteen AC-030 to AC-042 rows state behaviour the built gate produces; the two exceptions are already filed (the REQ-031 guard gap and AC-040).
- The fixture's eight audited columns still agree with the built gate on all 347 rows after four iterations of reading, which is the strongest single signal that the sixth round's behaviour is the shipped behaviour.
- ADR-005's typed-on-stuck override and ADR-006's bare-name narrowing are both pinned by a fixture row and a test, and both were re-probed.

## Ruled Out

- "AC-032's double-typed prompts are ambiguous because `/doctor:deep-loop` shares the hub owner": `typedCommandsIn` returns commands in prompt order and `typedCommandForTop` takes the first owned one, so `/deep:review` wins the review route and `/doctor:deep-loop` wins when it is the only typed command. The two rows pin both orders.
- "AC-037's timing claim is unverifiable": the Python case prints its own timings (`counted=103ms, refused=100ms`) and both scans are windowed; the claim is recorded, not asserted here.
- "Packet 013's degraded-path row borrows evidence that does not resolve": all four cited lines hold the cases the row names.
- "The double-negation gap is a parity failure between the copies": both copies return false, so the copies agree and the rule is the gap.

## Next Focus

- Dimension: traceability
- Focus area: the overlay protocols and the remaining cross-reference surfaces (skill/agent parity, agent cross-runtime, feature catalog and playbook), plus a final re-read of the active findings for stale severity.
- Reason: the two core protocols are executed, the four canonical dimensions are covered, and the overlay protocols are the coverage surface still untouched.
- Rotation status: every canonical dimension and both core protocols covered; overlays remain.
- Blocked / productive carry-forward: nothing blocked; the two-copy probe is the productive method to carry.
- Required evidence: `.skilled/agents/deep-review.md` and its mirrors, the skill `SKILL.md` files, the feature catalog entries for the advisor and deep loop, and the playbook rows that name the offer.

Review verdict: CONDITIONAL
