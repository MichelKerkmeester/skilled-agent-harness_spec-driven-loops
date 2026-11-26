# Review Iteration 004 — maintainability (with the operator traceability focus)

## Dispatcher

- Mode: `review`; target agent: `@deep-review` (LEAF, single iteration).
- Resolved route: `Resolved route: mode=review target_agent=deep-review`.
- Lineage: sessionId `fanout-deepseek-max-3-1795546920757-7pyjry`, generation 1, lineageMode `new`, executor cli-pi (deepseek-v4.1-flash-1017).
- Setup bindings (unchanged; emitted in full at iteration 1).
- Review focus for this iteration: the operator's traceability focus read against the closure-record layer — REQ-034's "the closure docs match the built behaviour" and the tenth round's own record, which is the newest part of the sixth-to-tenth round chain the focus names.
- `steer.md` is absent at this iteration.

## Files Reviewed

- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/implementation-summary.md:196` (Known Limitations), `:240-253` (sixth-round paragraph), `:255` (seventh), `:257` (eighth), `:259` (ninth), `:261` (tenth), `:263-275` (What stays open)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:187-212` (ninth and tenth rounds), `:327-336` (Verification Summary)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md` (all 56 `Evidence:` tails)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts`, `.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts`, `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts`, `.skilled/skills/system-skill-advisor/runtime/lib/render.ts`, `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts`, `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts`, `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs`, `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py`, `.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts` (comment hygiene and dead-code scan)
- `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:80` (`VOCABULARY_PAIRS`), `:434` (`PATTERN_PAIRS`), `:497` (four-surface vocabulary)
- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2405-2470` (`replaceAnchorSection`)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/scratch/` (listed, to test whether an evidence-tail checker lives there)

## Findings - New

### P0 Findings

None.

### P1 Findings

None new.

### P2 Findings

1. **The tenth round's citation claim names a checker that does not exist** -- specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/implementation-summary.md:261 -- The tenth-round paragraph states: "Every acceptance and task citation now names its evidence by symbol, test title, fixture row id, summary row label or task id, and each acceptance row ends with one `Evidence:` tail that a script checks against the tree, so a later edit above a cited line no longer breaks a cell silently." The tree contradicts both halves. (a) No script checks an `Evidence:` tail: `rg -rln 'Evidence tail' .skilled/commands .skilled/skills` returns nothing, and the packet's `scratch/` holds only `behaviour/`, `probes/`, `corpus-before.json`, `decisions.md` and `routing-analysis.md`. (b) The tails still cite line numbers: 56 of 56 acceptance rows end with an `Evidence: \`path:line\`` cell, and AC-040's cell proves the failure mode the sentence claims is closed — the cited `review/review-report.md:71` no longer resolves after the restart (P2 finding R1-P2-001). A reader taking the paragraph at face value stops checking cells by hand, which is the one thing that would have caught AC-040.
   Finding class: `closure-record`
   Scope proof: read the paragraph at `implementation-summary.md:261`, counted the acceptance tails (`rg -c 'Evidence: \`[^\`]+:[0-9]+\`' acceptance-criteria.md` → 56), and searched `.skilled/commands`, `.skilled/skills` and the packet `scratch/` for a checker that reads them (none).
   Affected surface hints: `implementation-summary.md`, `acceptance-criteria.md`, `tasks.md`, `scratch/`
   Case: a maintainer edits a paragraph above a cited line; nothing re-checks the acceptance cell, and the tenth round's record says something would.

## Traceability Checks

| Protocol | Status | Evidence |
|---|---|---|
| `spec_code` | fail | unchanged from iteration 3: REQ-031 drift (P2) and REQ-033 unmet (P1) |
| `checklist_evidence` | not run this iteration | the task and acceptance rows are iteration 5's protocol; this iteration read the closure prose only. The iteration record wrote `notApplicable` for this row, which is a bookkeeping error: the protocol does apply and is simply deferred, so iteration 5 records its real result and this note is the correction |

- REQ-034 ("the closure docs match the built behaviour"): confirmed for the sixth-round clauses in iteration 1 (fixture header, limitations 6-8, changelog, packet 013 row, Verification Summary). The tenth round's paragraph is one round past REQ-034's scope and is the finding above.
- REQ-048 (reducer section numbering): re-confirmed — `replaceAnchorSection` (`reduce-state.cjs:2405-2470`) resolves the ordinal from the anchor span or the authored heading, and `golden-review-default/next-focus.txt` carries `## 12. NEXT FOCUS`. The reducer also kept this lineage's own section numbers when it rewrote the strategy.
- Comment hygiene on every changed code file: clean. `rg -n '^\s*(//|#|\*).*\b(ADR-[0-9]|REQ-[0-9]|CHK-|AC-[0-9]|T[0-9]{3}\b)'` over the nine in-scope code files returns only `P0/P1/P2` severity terms in `reduce-state.cjs` docblocks (`:242`, `:279`, `:2205`, `:2885-2886`), which are domain vocabulary rather than task ids, and no `specs/` path appears in any code comment.
- Dead-code scan: every `export const` word list in `command-attach.ts` is read somewhere (`rg -c` per name; the lowest count is 2 for `RUN_REFUSED`, i.e. its declaration and one reader), and no `TODO`/`FIXME`/`XXX`/`HACK` marker exists in the nine files.

## Integration Evidence

- The strategy/dashboard writers are reducer-owned: `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` rewrote `## 12. NEXT FOCUS`, `## 6. COMPLETED DIMENSIONS`, `## 7. RUNNING FINDINGS` and `## 10. EXHAUSTED APPROACHES` in this lineage's strategy on every pass, which is the documented ownership boundary.
- `implementation-summary.md` is the continuity target the workflow names (`generate-context.js` routes there or to `decision-record.md`/`handover.md`); this iteration read it as the closure record, not as a write target.

## Edge Cases

- The sixth-round paragraph says "The guard compares eleven pairs" (`implementation-summary.md:251`) while the tree holds 22. That paragraph describes the sixth round, when eleven was accurate, and T087/T092 record the growth to twelve then fifteen. A historical paragraph is not drift, so it is not reported; it is listed here because a reader comparing it with AC-038's 22 needs the round boundary to reconcile them.
- The tenth round's claim could be read as an intention ("a script checks…" meaning a future one). There is no wording that marks it as future work, and the same paragraph's purpose is to record what was built, so it is reported.

## Confirmed-Clean Surfaces

- No ephemeral artifact label in any in-scope code comment; no spec path in a code comment.
- No dead exported word list and no TODO/FIXME marker in the nine code files.
- The reducer's section-numbering fix is pinned by a unit test and by the golden `next-focus.txt` fixture, and it held while rewriting this lineage's own strategy.
- The closure docs' ten rounds each name the review they answer, the commit they were built at and the counts they measured; the round boundaries are legible.

## Ruled Out

- "The sixth-round paragraph's eleven pairs is stale": it is a historical statement about the sixth round, and the later rounds record the growth (T087 twelfth pair, T092 fifteen). Not drift.
- "The reducer flattening a multi-line Next Focus into one line is a defect": the reducer owns the anchor body and the template requires only the fields, so the flattening loses formatting but no content. Not a finding.
- "The closure docs' five different suite totals for one suite are contradictory": each total carries its commit stamp (3,029 at the sixth round, 3,188 at the eighth, 3,415 at `3db3085bcf0`, 3,418 on the final tree), and AC-028 states which is the final tree. Not drift.

## Next Focus

- Dimension: traceability
- Focus area: the core `checklist_evidence` protocol — every ticked `[x]` task in `tasks.md` (135 boxes across ten rounds) and every `Met` row in `acceptance-criteria.md` checked for evidence that exists in the tree.
- Reason: `spec_code` is finished and `checklist_evidence` is the one core protocol the coverage gate still lists as unfinished; the operator focus names both.
- Rotation status: correctness, security, traceability-half and maintainability complete; the second traceability pass finishes the protocols.
- Blocked / productive carry-forward: the evidence-citation sweep and the fixture probe are productive; nothing is blocked.
- Required evidence: `tasks.md` task lines and their `Observed` tails, `acceptance-criteria.md` 56 rows, `implementation-summary.md` verification rows, and the artifacts each names.

Review verdict: CONDITIONAL
