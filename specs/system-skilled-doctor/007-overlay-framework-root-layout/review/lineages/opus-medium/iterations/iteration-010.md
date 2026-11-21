# Iteration 010 - Frontier node F-1-003: traceability and maintainability

## Dispatcher

- Lineage: opus-medium, session fanout-opus-medium-1795192401900-xpt66n
- Node: F-1-003 (doctor docs), dimensions traceability (registry next) and maintainability, each with its own pass, for the same budget reason as iteration 9.
- Review focus addressed: docs against code. Traced where the LAYOUT remedies are restated across the doctor command's docs and workflows, checked for code line pointers that could go stale, and reran the contract test that ties the route docs to the engine's flags.
- Sources: steer.md absent; strategy; registry frontier (F-1-003 next traceability).

## Files Reviewed

- `.skilled/commands/doctor/assets/doctor-overlay-status.yaml:28, 56-58, 68` (status workflow)
- `.skilled/commands/doctor/assets/doctor-overlay-presentation.txt:87-96, 118, 563, 595`, `.skilled/skills/system-skilled-doctor/references/overlays.md:92, 96`, `.skilled/commands/doctor/assets/doctor-overlay-apply.yaml`
- `.skilled/commands/doctor/scripts/overlay-engine.cjs:3689-3708` (LAYOUT remedies)
- `.skilled/commands/doctor/scripts/tests/doctor-overlay-contract.test.cjs:112-135`; run: `node --test .skilled/commands/doctor/scripts/tests/doctor-overlay-contract.test.cjs` -> 9 of 9, exit 0
- grep for `overlay-engine.cjs:<line>` pointers in the doctor docs: none

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None new. R5-P1-001 stays active.

### P2 Findings

1. **The status workflow tells the agent to name apply --relayout beside every LAYOUT line, including those relayout refuses** -- .skilled/commands/doctor/assets/doctor-overlay-status.yaml:58 -- The status route's instruction reads "Show both with the engine's own fix, and name /doctor:overlay apply --relayout beside each LAYOUT line." A LAYOUT line whose target sits under root/skilled already carries the fix "change the destination or remove the entry" (`.skilled/commands/doctor/scripts/overlay-engine.cjs:3693-3696`), and relayout refuses that move. Following the workflow puts a relayout suggestion next to an engine line that says not to relayout. This is the executable copy of the contradiction R2-P2-001 found in the presentation's reference rows.
   - Finding class: workflow-doc-contradiction (refines R2-P2-001)
   - Scope proof: the status YAML has no mention of root/skilled (grep count 0); the apply YAML never suggests relayout for a LAYOUT line.
   - Affected surface hints: doctor-overlay-status.yaml render rule; doctor-overlay-presentation.txt rows 563 and 595.
   - Case: status prints "LAYOUT   hub-notes: source custom/notes.md belongs at root/skilled/notes.md; change the destination or remove the entry"; the status workflow renders it with "/doctor:overlay apply --relayout" beside it.

## Traceability Pass

- LAYOUT line format and both remedies: engine `.skilled/commands/doctor/scripts/overlay-engine.cjs:3693-3696` = `.skilled/commands/doctor/assets/doctor-overlay-presentation.txt:87-88` = `.skilled/skills/system-skilled-doctor/references/overlays.md:92`.
- Overflow forms: engine `.skilled/commands/doctor/scripts/overlay-engine.cjs:3698-3708` = `.skilled/commands/doctor/assets/doctor-overlay-presentation.txt:118` = `.skilled/skills/system-skilled-doctor/references/overlays.md:92`, word for word.
- Relayout failure contract: engine `.skilled/commands/doctor/scripts/overlay-engine.cjs:6531-6549` = `.skilled/skills/system-skilled-doctor/references/overlays.md:96` = apply YAML line 116, apart from the backup overclaim (R1-P2-001).
- No doctor doc cites an engine line number, so no pointer can go stale; specs do (phase 002), and those were re-derived (iteration 4).
- Route flags: `.skilled/commands/doctor/scripts/tests/doctor-overlay-contract.test.cjs:114` asserts apply's four flags; pass.

## Maintainability Pass

- The remedy wording lives in the engine and is restated in full in four doc places (presentation lines 87-96 and 118, overlays.md line 92, apply YAML line 116), plus the two generic pointers in the presentation and the status YAML. The two copies that missed the root/skilled exception (R2-P2-001 and finding 1) are both the short generic ones, so the drift sits where a doc summarizes instead of quoting. Recorded as the shared root cause of those findings, not as a separate finding.

## Traceability Checks

- spec_code: partial. Quoted text matches the engine; the generic LAYOUT guidance in two places does not.
- playbook_capability: pass for the contract test (9 of 9).

## Edge Cases

- None beyond the shared-root-cause note.

## Confirmed-Clean Surfaces

- LAYOUT quoting in presentation, overlays.md and apply YAML; contract test.

## Ruled Out

- Stale engine line pointers in doctor docs: there are none.

## Next Focus

- Dimension: traceability
- Focus area: frontier node F-1-005 (Barter), with maintainability in the same pass
- Reason: registry rotation
- Rotation status: F-1-001 and F-1-003 all dimensions done
- Required evidence: ai-speckit 039 record against 5dd004f3faa; hook duplication

Review verdict: CONDITIONAL
