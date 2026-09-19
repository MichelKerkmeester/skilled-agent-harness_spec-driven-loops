# Iteration 3: Traceability — goal.md completion checklist vs. child acceptance criteria

## Focus

Dimension: Traceability (`spec_code`, `checklist_evidence` core protocols). Files: `goal.md` (completion criteria + LOG), `002-synthesis-and-decisions/decision-record.md` (ADR count), `002-synthesis-and-decisions/allocation-table.md` (29-row arithmetic), `006-reply-shape-rules/acceptance-criteria.md`, `008-decision-and-handoff-rules/acceptance-criteria.md`. Scope: resolve the discrepancy flagged in iteration 2 between `goal.md`'s unchecked completion-criteria row and its own LOG table's "Done" claims for the same two phases.

## Scorecard

- Dimensions covered: traceability
- Files reviewed: 5
- New findings: P0=0 P1=1 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.55

## Findings

### P1, Required

- **F003**: `goal.md`'s own completion-criteria checklist contradicts its own LOG table and both owning children's acceptance criteria, `specs/sk-communication/006-sk-communication-clarity/goal.md:96`. Completion criterion row 3, "The 10 reply-shape candidates and the 5 decision, handback and evidence candidates are in their rule files," is unchecked (`- [ ]`). But the same file's LOG table two sections below marks both owning phases `Done`: `goal.md:121` ("006 reply-shape | Done | 10 candidates across both halves ... strict validate PASSED") and `goal.md:120` ("008 decision, handback and evidence | Done | 5 candidates in three rule files ... strict validate PASSED"). Primary evidence confirms the LOG, not the checkbox: `006-reply-shape-rules/acceptance-criteria.md:61-66` shows all 6 AC rows (`AC-001`-`AC-006`) as `Met`, and `008-decision-and-handoff-rules/acceptance-criteria.md:61-67` shows all 7 AC rows (`AC-001`-`AC-007`) as `Met`. Since `goal.md` §2 states "Stop. Only the criteria below decide done," an unticked row that should be ticked understates the packet's actual completion state against its own stop rule.

### P2, Suggestion

- **F004**: Both `006-reply-shape-rules/acceptance-criteria.md` and `008-decision-and-handoff-rules/acceptance-criteria.md` carry stale `_memory.continuity` frontmatter and a stale `## 1. METADATA` `**Status:** Draft` line, despite every AC row in both documents reading `Met`. `006-reply-shape-rules/acceptance-criteria.md:18-28` still lists `blockers: ["Phase 3 has not run", "Phase 2 has not run"]` and `completion_pct: 0`; `008-decision-and-handoff-rules/acceptance-criteria.md:18-28` still lists `blockers: ["Phase 2 has not run"]` and `completion_pct: 0`. Both dependency phases (002, 003) are marked `Complete` in the parent `spec.md` Phase Documentation Map, and both children's own AC rows are fully `Met` — the metadata was written at packet-authoring time and never refreshed at closure. Likely the same root cause as F003: the closure step that should flip these fields ran inconsistently across children.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| checklist_evidence | fail | hard | `goal.md:96,120-121`; `006-reply-shape-rules/acceptance-criteria.md:61-66`; `008-decision-and-handoff-rules/acceptance-criteria.md:61-67` | One unchecked completion-criteria row contradicts fully-Met child evidence (F003) |
| spec_code | pass | hard | `002-synthesis-and-decisions/decision-record.md:54,152,251,348,447,548,646,744,842` (9 `## ADR-NNN` headers); `002-synthesis-and-decisions/allocation-table.md:23-70` (29 numbered rows in Section 1, confirmed by direct count matching the document's own self-verification note at `:171-177`) | `goal.md` D1's "nine ADRs" claim and the LOG's "29 rows, 25 adopted, 4 non-work" claim both verified against primary artifacts, not just narrative |

## Assessment

- New findings ratio: 0.55
- Dimensions addressed: traceability
- Novelty justification: This iteration resolves the open question iteration 2 flagged (the unchecked `goal.md` row) with primary-source evidence rather than leaving it as a note — counts as a genuine traceability finding (F003), not a restatement. F004 is a related but distinct observation (metadata hygiene, not the closure gate itself).

## Ruled Out

- Miscounted allocation-table rows: ruled out. An unscoped grep first returned 47 (it matched numbered lists in later sections too); re-scoping the grep to Section 1's line range (`23-70`) returned exactly 29, matching the document's own arithmetic note.

## Dead Ends

None this iteration.

## Claim Adjudication Packets

```json
{
  "findingId": "F003",
  "claim": "goal.md's completion-criteria row for the reply-shape and decision/handoff candidates is unchecked even though both owning children's acceptance-criteria.md files show every AC row Met and goal.md's own LOG table marks both phases Done.",
  "evidenceRefs": [
    "specs/sk-communication/006-sk-communication-clarity/goal.md:96",
    "specs/sk-communication/006-sk-communication-clarity/goal.md:120-121",
    "specs/sk-communication/006-sk-communication-clarity/006-reply-shape-rules/acceptance-criteria.md:61-66",
    "specs/sk-communication/006-sk-communication-clarity/008-decision-and-handoff-rules/acceptance-criteria.md:61-67"
  ],
  "counterevidenceSought": "Checked whether the checklist row might legitimately require something beyond the AC rows (e.g. a later validation pass not yet run) by rereading goal.md's own binding rule ('Stop. Only the criteria below decide done.') and the phase transition rules in spec.md; also checked whether any AC row was Waived/Superseded rather than genuinely Met, which would explain a deliberately-unchecked box. All 13 AC rows across both children read plain 'Met' with no Waiver, and both children's own strict-validate claims in the LOG ('strict validate PASSED') were not contradicted by anything found this iteration.",
  "alternativeExplanation": "The row could be intentionally left unchecked pending a distinct integration-level check beyond the two children's individual AC gates (e.g. a cross-file duplication scan spanning both halves together, not just each child's own scope). Rejected: 008's own AC-007 already performs exactly that cross-file duplication scan across all three owned rule files and reads Met, and no other packet document references an unresolved integration check for this pair.",
  "finalSeverity": "P1",
  "confidence": 0.8,
  "downgradeTrigger": "If the packet owner confirms the checkbox is deliberately reserved for a distinct, not-yet-run verification step (and names it), downgrade to P2 documentation note; if the checkbox is ticked with no further work found, this closes as resolved rather than downgrades.",
  "transitions": [
    { "iteration": 3, "from": null, "to": "P1", "reason": "Initial discovery: self-contradiction between goal.md's own checklist and LOG table, confirmed against primary child evidence" }
  ]
}
```

## Recommended Next Focus

Iteration 4: Maintainability. Check D9's comment-hygiene hard block ("no packet id, phase number or ADR id enters a code comment") against the actual code comments touched by this packet's diff (`src/fidelity/semantics.ts`, `src/fidelity/validator.ts`, `src/config/copy-editing-instruction.ts`), and run `feature_catalog_code`/`playbook_capability` against `.opencode/skills/sk-communication/feature-catalog/feature-catalog.md` and the manual-testing playbook if `sk-communication` references one.
