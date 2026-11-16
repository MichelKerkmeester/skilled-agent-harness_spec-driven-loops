# Review Iteration 004 - mention-13

## Dispatcher

- Mode: review. Target agent: `@deep-review`, executed in-process by this detached fan-out lineage (no nested dispatch).
- Session: `fanout-mention-13-1794865302020-qunumz`, generation 1, lineage `mention-13`.
- Iteration: 4 of 8. Dimension: maintainability. Focus: the comment paragraph the diff reflowed and the readability of the two new rules' documentation.
- Operator review focus, and how this iteration addressed it: pass thirteen's brief asks for a request that now reads as a mention and for a refusal or question shape still read as a request. This iteration asked how cheaply the next reader can see which shape each rule covers: whether the fold's contract is stated readably and whether the new rules are documented where a maintainer will look. It found one reflow defect (F007) and otherwise clean documentation.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:409-476` (the two new rule comments, the fold comment, the function)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:197-245` (typed reader comment for comparison)
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:200-232` (the comments on the new test rows)

## Findings - New

### P0 Findings

None.

### P1 Findings

None new. F001 and F002 remain active and are carried forward.

### P2 Findings

1. **The fold comment was left mid-sentence by the reflow** -- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:435` -- the paragraph at lines 421-436 now ends with a 148-character line, a 48-character line, a 15-character line (`// maps to. The`) and a 57-character line (`// command reads as the plain refusal does. An underscore`), while every other line in the block runs 75 to 82 characters. The diff inserted the doc-path clause into the last sentence and re-wrapped only that part, so the sentence that carries the fold's whole contract now reads across two widths and a stranded `The`.
   Finding class: documentation-readability
   Scope proof: Measured every line of the block: 421-426 and 428-431 are 78 to 81 characters, 432 is 15, 435 is 148, 436 is 48. The block is the only place the fold's contract is written down, and `commandOnlyMentioned` has no other doc comment.
   Affected surface hints: `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts`
   Case: a maintainer adding a sixth wrapper or a new tail rule reads lines 421-436 to learn what the fold guarantees, and the sentence naming the doc-path skip is the one the reflow broke.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | partial | Unchanged from iteration 3: the document bullet is narrower in code (F005). The scope bullet's fold claim still matches the characters dropped at lines 440-441. |
| `checklist_evidence` | partial | Unchanged from iteration 3: `CHK-FIX-002` overstates matrix coverage (F006). The test comments at `command-attach-guards.vitest.ts:200-232` describe each new row's intent in the same style as the older rows. |
| `skill_agent` | notApplicable | No agent definition in scope for this dimension. |
| `agent_cross_runtime` | notApplicable | No runtime mirror is touched. |
| `feature_catalog_code` | partial | `plan.md:70` names the guards test and the matrix as the verification for the widened check; F001, F002 and F006 remain the shapes that verification cannot see. |
| `playbook_capability` | notApplicable | No playbook scenario covers the mention guard's documentation. |

## Integration Evidence

None this iteration: the maintainability pass read the module and its test comments only.

## Edge Cases

- Ambiguity: whether a comment reflow is worth a finding at all. It is recorded at P2 because the block is the module's only statement of the fold's contract, and the reflow stranded a sentence boundary rather than only changing line lengths.
- Contradiction: none.
- Partial success: the module's own style has other long constant lines (413 and 419 are 127 and 127 characters), so line length alone is not the defect; the orphaned sentence fragments are. The finding states both.
- Correction carried from iteration 3: the iteration 3 record was re-issued with `findingsCount: 6` so its summary reads as the running total, and `deltas/iter-003.jsonl`'s first line was rewritten to match. The reducer now reports six open findings, not twelve. This is disclosed here because it is the lineage's one write-once overwrite.

## Confirmed-Clean Surfaces

- The two new rule comments state their contract and the case that would break them (`run /speckit:save and don't skip it` stays a request; a typed request puts its argument after the name), which is the pattern the module's other rules follow.
- The test comments on the new rows name the intent of each block, and the wrapper matrix's own comment still explains why it exists.
- The module header's "kept free of imports" claim still holds at lines 1-14.

## Ruled Out

- A stale comment on the typed reader: the widened `COMMAND_START_BOUNDARY` at line 208 is described by the fold comment at 425-427, and the typed reader's comment at 197-207 still describes its own rules correctly.
- A missing doc comment on `commandOnlyMentioned`: the fold paragraph is its doc comment, so F007 is the right object rather than a missing-documentation finding.
- A naming or ownership defect in the generated tables: untouched by this pass and outside the scope file's diff.

## Next Focus

- Dimension: none remaining. All four dimensions are covered and the six findings are re-verified; the stop decision is the only open question.
- Focus area: none.
- Reason: four iterations covered correctness, traceability, security and maintainability, and the two active P1s are unchanged.
- Rotation status: exhausted.
- Blocked/productive carry-forward: productive `exported-function probes with concrete prompts` for a follow-up pass after fixes.
- Required evidence: the convergence script's stop decision, recorded in the state log.
- Recovery note: none.

Review verdict: CONDITIONAL
