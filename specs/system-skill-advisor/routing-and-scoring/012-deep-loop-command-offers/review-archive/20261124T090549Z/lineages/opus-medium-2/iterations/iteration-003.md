# Iteration 003 - Traceability

## Dispatcher
- Lineage opus-medium-2, iteration 3 of 5, dimension traceability. steer.md: not present.
- Review focus coverage: the acceptance criteria for the offer gate (AC-022 to AC-029) were checked against the gate code and the tests that back them, and packet 013's typed-command hint (REQ-006) was traced from `attachTypedCommand` through both brief paths into `render.ts` `commandLabel`.

## Files Reviewed
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:72-79` (AC-022..AC-029), `:12-21`
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:223`, `:444`, `:951`
- `specs/system-skill-advisor/routing-and-scoring/013-deep-loop-offer-in-hint/spec.md:94-106`
- `.skilled/skills/system-skill-advisor/runtime/lib/render.ts:227-253`
- `.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:39-60`, `:180-211`, `:344`
- `.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:390-395`
- `.skilled/changelog/skilled/v4.2.0.0.md:32`, `:213`, `:483`, `:727`

## Findings by Severity

### P0 Findings
None.

### P1 Findings
1. **AC-027 is marked Met on evidence that covers attachCommand only, while the served typed-stuck output keeps /deep:review** -- specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:77 -- AC-027 says "Both gates withhold the run command on all four" typed prompts and is `Met`. The evidence is the shared fixture's `typedReviewKept` column, which the TypeScript test checks with `attachCommand` alone (deep-loop-offer-cases.vitest.ts:57). For the `typed-stuck` row the handler's later `attachTypedCommand` step puts `/deep:review` back on the top row (advisor-recommend.ts:434-446, see R1-P1-001), so the claim "both gates withhold" is true of the function and false of what the reader sees. The changelog repeats the claim in user terms: a run that "keeps running and never converges" gets `/doctor:deep-loop` (v4.2.0.0.md:727). This sharpens R1-P1-001 with the closure-gate consequence: the packet closed on a row whose verification does not exercise the served path.
   Finding class: traceability
   Scope proof: acceptance-criteria.md is the packet's closure gate and is in the review scope.
   Affected surface hints: acceptance-criteria.md AC-027, deep-loop-offer-cases.vitest.ts, v4.2.0.0.md
   Case: the AC-027 prompt "my deep review run is stuck, /deep:review again" read through advisor_recommend, not attachCommand.

```json
{"type":"traceability","claim":"AC-027's Met status rests on attachCommand-only evidence; the served output for the typed-stuck prompt carries /deep:review.","evidenceRefs":["specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:77",".skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:57",".skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:434"],"counterevidenceSought":"Searched the AC row and REQ-020 for a scope limited to the function; REQ-020 does say `_apply_deep_loop_offer_gate ... returns what attachCommand returns`, which is a function-level claim, but AC-027's 'both gates withhold' and the changelog line 727 are user-level claims.","alternativeExplanation":"If REQ-020 is read strictly as a function-parity requirement the row is Met as worded; the defect then lives only in R1-P1-001 and the changelog.","finalSeverity":"P1","confidence":0.7,"downgradeTrigger":"Same as R1-P1-001: an end-to-end run showing the doctor row tops this prompt, or an amendment scoping AC-027 to function parity."}
```

### P2 Findings
1. **The Python-subprocess brief path drops command, policy and typed, so a typed deep command renders the A/B/C offer there** -- .skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:200 -- `AdvisorRecommendation` declares `command`, `policy`, `ownerSkillId` and `typed` (subprocess.ts:42-48, with the comment "the head offers no choice"), but `parseRecommendations` builds each row from `skill`, `kind`, `confidence`, `uncertainty`, `passes_threshold`, `confidenceFloored`, `reason` and `compiledRouteSummary` only (subprocess.ts:200-209), and `skill_advisor.py` never emits `typed`. `render.ts` `commandLabel` then falls back to `commandRowFor(skill)` (render.ts:230-233): a kept `command-spec-kit-deep-review` row renders `/deep:review (ask: A /deep:review:auto (Recommended), B /deep:review:confirm, C no loop)` because `recommendation.typed !== true` (render.ts:250). Packet 013 REQ-006 and the changelog ("A deep command you typed shows plain (ask) with no options", v4.2.0.0.md:213) hold on the native and CLI-fallback paths (cli-fallback carries `typed` at skill-advisor-cli-fallback.ts:393) but not on this one. Inferred from the code; not run end to end because the brief needs the built runtime.
   Finding class: traceability
   Scope proof: subprocess.ts and render.ts are in the review scope; 013 REQ-006 is the typed-command hint under review.
   Affected surface hints: subprocess.ts parseRecommendations, skill_advisor.py output rows, render.ts commandLabel
   Case: "/deep:review:confirm the auth module" served by the Python subprocess brief path when the native advisor is unavailable.

## Traceability Checks
- spec_code (partial): 013 REQ-006 holds on native and CLI-fallback paths, not on the Python subprocess path.
- checklist_evidence (partial): AC-022 to AC-026 cite `scratch/probes/fresh-review-hook.txt` lines and match the gate code behaviour reproduced in iteration 1; AC-027 evidence does not cover the served path; AC-008 reads `Waived` with ADR-003 present at decision-record.md:223, as AC-029 says.

## Integration Evidence
- Brief paths traced: native `advisor-recommend.ts` -> `render.ts`; CLI fallback `skill-advisor-cli-fallback.ts:390-395` -> `render.ts`; Python `subprocess.ts:344` (`skill_advisor.py`) -> `parseRecommendations` -> `render.ts`.

## Edge Cases
- acceptance-criteria.md frontmatter reads `completion_pct: 0` and `last_updated_by: "scaffold"` on a Closeable packet; already recorded as Q028 and at decision-record.md:951, so not re-reported.

## Confirmed-Clean Surfaces
- AC-008 waiver and ADR-003 exist and agree.
- Changelog line 32 and 483 describe the refusal rule as built (the iteration 1 P2 covers words the rule does not list, which the changelog does not claim).

## Ruled Out
- Changelog overclaiming the refusal vocabulary: it names "don't", "never" and "no need to" only, which match RUN_ASK_NEGATED.

## Next Focus
- Dimension: maintainability
- Focus area: the duplicated TS/Python gate (drift risk, comment hygiene, fixture coverage of the parity), and the size of the regex vocabulary.
- Reason: rotation; last canonical dimension.
- Rotation status: 3 of 4 dimensions done.
- Required evidence: parity test mechanism, places where copies differ.

Review verdict: CONDITIONAL
