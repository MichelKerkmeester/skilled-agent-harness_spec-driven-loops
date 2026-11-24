# Iteration 003 - Traceability

## Dispatcher
- Lineage opus-medium-3, inline executor. steer.md: not present.

## Dimension
traceability: acceptance-criteria.md rows, the shared fixture and the implementation-summary claims, checked against the code paths that serve the brief. Review focus applied: REQ-020/AC-027 (Python typed-command parity with the TS gate) and the packet 013 typed hint.

## Files Reviewed
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:58-114`
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/implementation-summary.md:205-220`
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:223-310`
- `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:31-57`
- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:2, 118-121`
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:428-447, 556-561, 628-632`
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:257-265, 837-841`
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4832-4855`
- `.skilled/changelog/skilled/v4.2.0.0.md` (refusal and typed wording search)

## Findings by Severity

### P0 Findings
None.

### P1 Findings
1. **A typed `/deep:review` in a stuck-run complaint still reaches the native brief, while the Python gate drops it; AC-027 records both as withheld** -- .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:434 -- For `my deep review run is stuck, /deep:review again`, `attachCommand` returns `/doctor:deep-loop` (`command-attach.ts:837-840`), so the fixture's `typedReviewKept: false` (`deep-loop-offer-cases.json:121`) passes, because the TS test asserts `attachCommand` alone (`deep-loop-offer-cases.vitest.ts:57`). Both native return paths then run `attachTypedCommand` (`advisor-recommend.ts:556, 628`), and `typedCommandForTop` has no stuck-run check (`command-attach.ts:257-265`). The probe returns `typedTop=/deep:review`, so the top row's command becomes `/deep:review` (ask, typed) and replaces the doctor. The Python gate drops the run row on a stuck run "even when one is typed" (`skill_advisor.py:4836-4838, 4848-4850`). The two paths disagree on a REQ-020 prompt. AC-027 says "Both gates withhold the run command on all four", and `implementation-summary.md:216` says the stuck drop happens "as `attachCommand` does". Neither claim holds for what the native brief prints.
   Finding class: evidence-scope mismatch (unit-level parity standing in for end-to-end parity).
   Scope proof: every cited file is in the declared scope.
   Affected surface hints: typedCommandForTop / attachTypedCommand (add the stuck-run rule or record the override as intended), deep-loop-offer-cases.vitest.ts (assert through attachTypedCommand), AC-027 evidence cell, implementation-summary typed-check bullet.
   Case: the reader writes "my deep review run is stuck, /deep:review again". The native brief offers /deep:review and the Python fallback offers no run command.

```json
{"type":"traceability","claim":"For the REQ-020 typed-stuck prompt the native recommend output carries /deep:review while the Python gate drops the run row, contradicting AC-027's 'both gates withhold'","evidenceRefs":[".skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:434",".skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:628",".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:257",".skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4848",".skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:57"],"counterevidenceSought":"REQ-020's text compares _apply_deep_loop_offer_gate with attachCommand only, and that literal comparison holds; looked for a stuck check inside typedCommandForTop or attachTypedCommand and found none","alternativeExplanation":"The typed override may be intended (a reader who types the command wants it). Then the Python gate and the AC/summary wording are what is wrong, not the TS code","finalSeverity":"P1","confidence":0.8,"downgradeTrigger":"Downgrade to P2 if the operator rules that REQ-020 parity is meant only at the attachCommand layer and the typed override on a stuck run is intended. The doc claims would then still need narrowing."}
```
Skeptic: the requirement text names `attachCommand` as the comparison target, so it can be called met. Referee: the AC evidence and the implementation summary claim more than that layer ("both gates withhold"), and the user-visible native output contradicts them. Kept at P1.

### P2 Findings
1. **AC-008's evidence cell says "accepted that as Met" while its status is `Waived`** -- specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:65 -- The verification text ends "the operator accepted that as Met with the rate disclosed", and the status column reads `Waived` with ADR-003 (`decision-record.md:223-231`, operator chose "Change to Waived"). The cell keeps the wording from before the waiver and contradicts the row's own status.
   Finding class: stale evidence wording.
   Scope proof: in declared scope.
   Affected surface hints: acceptance-criteria.md AC-008 verification cell.
   Case: someone reads AC-008 to learn whether the offer rate was accepted as met. The row says Met in its text and Waived in its status.

## Traceability Checks
- spec_code (partial): REQ-020 is literal-pass at the attachCommand layer and fails end to end on the typed-stuck prompt (P1 above).
- checklist_evidence (partial): AC rows 001-029 have evidence cells. AC-027 overclaims, and AC-008's text contradicts its status. The other cells cite concrete files. Probe and behaviour artifacts were not rerun here, because the lineage may not run repo tooling.

## Integration Evidence
- `/deep:review` command doc and presentation files were not re-read this iteration. They are left for the maintainability pass.

## Edge Cases
- The other three REQ-020 prompts (`typed-refused`, `typed-question`, `typed-doc-path`) give `typedTop=null` on the native path, which matches Python.

## Confirmed-Clean Surfaces
- ADR-003 exists and names AC-008. ADR-001 covers AC-019's supersession (`acceptance-criteria.md:76`).

## Ruled Out
- A missing ADR for a Waived or Superseded row: every such row names an ADR present in decision-record.md.

## Next Focus
- Dimension: maintainability. Focus: duplicated TS/Python regex vocabularies (drift cost), the shared fixture as the only sync guard, and the offer sections in the deep presentation files and command docs against the 013 brief head.

Review verdict: CONDITIONAL
