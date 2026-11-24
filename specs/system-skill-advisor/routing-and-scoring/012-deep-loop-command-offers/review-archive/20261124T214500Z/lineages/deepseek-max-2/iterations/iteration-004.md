# Review Iteration 004

## Dispatcher
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; dimension=traceability (spec_code).
Artifact directory: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/review/lineages/deepseek-max-2`. Read-only review; no `steer.md` exists in this lineage.

## Files Reviewed
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:220` (REQ-001 to REQ-053 tables)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:161` (Files to Change tables)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:58` (AC rows and REQ column)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:33` (ADR-001 to ADR-009)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:268` (CHK-001)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:197` (REQ-053 constant)
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:27` (REQ-053 import)
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1061` (naming pattern built from the constant)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:252` (REQ-025 `typedCommandIn`)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:275` (REQ-025 `typedCommandsIn`)
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:415` (REQ-046 withhold-and-strip)
- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:227` (REQ-052)
- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2402` (REQ-046 reopenable ruling)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/scratch/probes/results-after.json` (REQ-001, REQ-002, REQ-014 probe rows)

## Findings by Severity

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
1. **CHK-001 records a REQ count the tree no longer prints** -- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:268` -- The ticked P0 checklist item states `rg -c '^\| REQ-' spec.md` prints 52 and that it printed 52 when observed. The command prints 53, because REQ-053 joined the table and neither CHK-001 nor the task that claims to keep its count current was updated.
Finding class: instance-only (one stale count, one row).
Scope proof: the claim is at `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:268`; the count comes from the 53 REQ rows of `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:220` onward; the task that promises to carry the current count is `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:164` (T082), which says CHK-001 "itself carries the current count".
Affected surface hints: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md`, `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md` (AC-041 cites CHK-001's count as evidence).
Case: a reader reruns CHK-001's own verification command from the repository root, gets 53, and the P0 item that the Verification Summary counts as verified fails its stated check; AC-041, whose evidence row names CHK-001's count among the closure records, then rests on a number the tree contradicts.
Claim adjudication:
```json
{"type":"stale_record","claim":"CHK-001 states a REQ count of 52 while spec.md holds 53 REQ rows.","evidenceRefs":["specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:268","specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:220","specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:164"],"counterevidenceSought":"ran the exact command from the packet folder (prints 53), checked whether a second REQ table form could make the count 52 (no: one table, 53 rows, REQ-001 to REQ-053), and read T082 for a later correction of the number (none: it defers to CHK-001).","alternativeExplanation":"the count was correct when the item was ticked and the packet's own rule leaves earlier observations in place as history.","finalSeverity":"P2","confidence":"high","downgradeTrigger":"a later row that states the current count and marks the CHK-001 sentence as its observation date would leave only the historical record."}
```

## Traceability Checks
- `spec_code` (core, hard), status `pass`: all 53 REQ rows were swept by the symbols, constants and files each one names, and each REQ has an owning acceptance row (the AC table's REQ column names every one of REQ-001 to REQ-053; no REQ is unowned). The sweep found no REQ whose named symbol is missing from the tree except the two REQ-011 names the requirement removes on purpose: the `DEPTH_WORDING` family and the `comprehensive research` alias, both of which the requirement states leave the tree. Evidence rows read in full: REQ-025 ([SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:252] keeps the longest-key reading and has no production caller; `typedCommandsIn` at [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:275] is the production reading), REQ-046 ([SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2402] one ruling reads reopenable, [SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:424] the withheld row loses `command`, `policy`, `ownerSkillId` and `typed`), REQ-052 ([SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:227]), REQ-053 ([SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:197] one declaration, [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:27] imported, [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1061] the naming pattern built from it), REQ-001, REQ-002 and REQ-014 against the probe rows (V6, H1a and E3 carry `/deep:review pol=ask`; H1b and E1 carry `/deep:research pol=ask`; R7 and N9 carry no command).
  Limitation stated honestly: the sweep proves the named symbols exist and that the probe rows say what the requirement says; it does not re-run the suites, which this review may not do.
- `checklist_evidence` (core, hard), status `partial`: the acceptance table's `Evidence:` tails all resolve (the packet's own `scratch/citations/evidence-tails.py` reports `problems=0` over `acceptance-criteria.md`), and CHK-001 fails its own command (the P2 above). The task ticks are completed in iteration 5.

## Integration Evidence
- ADR range checked: ADR-001 to ADR-009 exist as `## ADR-00N` sections in `decision-record.md` ([SOURCE: specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:33], [SOURCE: specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:796]), and each of the four non-`Met` acceptance rows names one of them (AC-008→ADR-003, AC-017→ADR-002, AC-019→ADR-001, AC-020→ADR-009).
- Declared change set checked against the review scope: the 26 full repository paths in `spec.md` section 3 are all either a line of `review/lineages/deepseek-max-2/review-scope-files.txt` or a directory whose tracked files are (`compiled/` and `dist/`), and every declared path exists in the tree, so T111's seeding claim holds.

## Edge Cases
- **A requirement that removes a symbol.** REQ-011 names `DEPTH_WORDING` and the `comprehensive research` alias as things that must leave the tree, so their absence is the requirement being met, not a broken reference. Recorded so a later symbol sweep does not read the absence as a gap.
- **A requirement owned by another requirement's row.** REQ-021 and REQ-034 each have more than one acceptance row (AC-028 and AC-042 for REQ-021; AC-041 for REQ-034), so a one-REQ-to-one-AC mapping is not the packet's model. Checked by the reverse direction instead: every REQ appears in at least one AC row.

## Confirmed-Clean Surfaces
- **No unowned requirement.** Every REQ-001 to REQ-053 appears in the REQ column of at least one acceptance row.
- **No unbacked waiver.** The three `Waived` and one `Superseded` rows each name an ADR that exists.
- **The declared change set matches the review scope.** 26 full paths, all present, all covered by the seeded scope files.

## Ruled Out
1. **A declared change-set path is missing from the seeded review scope** — ruled out: the only two entries not present as lines are the `compiled/` and `dist/` directories, whose individual tracked files are in the scope list, and `dist/` is gitignored and rebuilt, which T111 states.
2. **A REQ row names a symbol that no longer exists** — ruled out: the sweep resolves every symbol token except the REQ-011 names the requirement removes.
3. **An acceptance row carries an evidence tail that does not resolve** — ruled out: `scratch/citations/evidence-tails.py` reports `problems=0` on `acceptance-criteria.md`.

## Next Focus
- Dimension: traceability (checklist_evidence)
- Focus area: every ticked task in `tasks.md` (T001 to T114, CHK-001 to CHK-051) and every `Met` row in `acceptance-criteria.md` (AC-001 to AC-061) against evidence that exists in the tree, with the twelfth round (T112 to T114) read closely.
- Reason: `spec_code` is complete; `checklist_evidence` is the remaining core protocol.
- Rotation status: all four dimensions recorded; traceability continues.
- Required evidence: `file:line` or a named anchor for each row's evidence, full repo-relative paths.
- Blocked/productive carry-forward: CHK-001's stale count is already a P2; do not re-report it, and look for the same staleness in the other counts the checklist and the tasks state.
- Recovery note: not applicable.

Review verdict: PASS
