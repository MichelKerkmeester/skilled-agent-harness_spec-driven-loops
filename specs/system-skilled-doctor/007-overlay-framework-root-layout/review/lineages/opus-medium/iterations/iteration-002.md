# Iteration 002 - Frontier node F-1-003: correctness

## Dispatcher

- Lineage: opus-medium, session fanout-opus-medium-1795192401900-xpt66n
- Node: F-1-003 (doctor docs against the engine), dimension correctness
- Review focus addressed: verified prior R8-P2-001 (one LAYOUT remedy documented) and the LAYOUT overflow fix against the engine, and read the relayout failure contract in references/overlays.md and the apply workflow for claims the code does not back.
- Sources: steer.md absent; strategy; frontier block F-1-003.

## Files Reviewed

- `.skilled/commands/doctor/scripts/overlay-engine.cjs:3689-3710` (LAYOUT line and overflow remedies), `.skilled/commands/doctor/scripts/overlay-engine.cjs:6207-6211` (root/skilled refusal), `.skilled/commands/doctor/scripts/overlay-engine.cjs:6531-6549` (failure lines)
- `.skilled/commands/doctor/assets/doctor-overlay-presentation.txt:87-96, 118, 276-295, 542, 563-566, 595`
- `.skilled/skills/system-skilled-doctor/references/overlays.md:92, 96, 263-268`
- `.skilled/commands/doctor/assets/doctor-overlay-apply.yaml:60, 105, 111-117, 126`

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The presentation's next-step rows send every LAYOUT line to apply --relayout, including the root/skilled lines relayout refuses** -- .skilled/commands/doctor/assets/doctor-overlay-presentation.txt:563 -- The fix table row "A LAYOUT line in a status report | Run /doctor:overlay apply --relayout" (`.skilled/commands/doctor/assets/doctor-overlay-presentation.txt:563`) and the next-command row at `.skilled/commands/doctor/assets/doctor-overlay-presentation.txt:595` make no exception for a LAYOUT line whose target sits under root/skilled. The same file says that line names "change the destination or remove the entry" instead (`.skilled/commands/doctor/assets/doctor-overlay-presentation.txt:88, 96`), and the engine refuses the move (`.skilled/commands/doctor/scripts/overlay-engine.cjs:6207-6211`) and prints that remedy (`.skilled/commands/doctor/scripts/overlay-engine.cjs:3693-3695`). An agent reading the fix table offers a relayout that exits 2.
   - Finding class: doc-contradiction
   - Scope proof: the two rows are the only generic LAYOUT next-step entries; lines 87-96 and 118 already carry the exception.
   - Affected surface hints: doctor-overlay-presentation.txt fix table and next-command table.
   - Case: status prints LAYOUT for an entry whose destination is skilled/notes.md at the tree root; the next-step row says run apply --relayout, which refuses with exit 2.

2. **references/overlays.md repeats the claim that a kept relayout backup holds every moved copy** -- .skilled/skills/system-skilled-doctor/references/overlays.md:96 -- The restore-failed paragraph says the line "names relayout-runs/<stamp> as the place that holds every moved copy and the manifest as it was". The backup skips token-named files inside a moved folder (`.skilled/commands/doctor/scripts/overlay-engine.cjs:6278-6281`), as the presentation itself admits at `.skilled/commands/doctor/assets/doctor-overlay-presentation.txt:542, 565`. The reference page is where an operator goes to recover by hand.
   - Finding class: doc-overclaim
   - Scope proof: only the restore-failed sentence; the success-path sentences are accurate.
   - Affected surface hints: overlays.md relayout paragraph; same root cause as R1-P2-001.
   - Case: a moved folder with assets/api-token.js and a failed restore; overlays.md tells the operator the backup holds the whole folder.

## Prior-Finding Verification

- R8-P2-001 (presentation documents one LAYOUT remedy): FIXED. Both forms at `.skilled/commands/doctor/assets/doctor-overlay-presentation.txt:87-88`, explained at `.skilled/commands/doctor/assets/doctor-overlay-presentation.txt:96`, matching `.skilled/commands/doctor/scripts/overlay-engine.cjs:3693-3696`.
- R1-P2-001 overflow variant (overflow line advises relayout for refused entries): FIXED. The engine splits hidden moves into movable and blocked (`.skilled/commands/doctor/scripts/overlay-engine.cjs:3698-3708`), and `.skilled/commands/doctor/assets/doctor-overlay-presentation.txt:118` and `.skilled/skills/system-skilled-doctor/references/overlays.md:92` document all three forms with the engine's exact wording.

## Traceability Checks

- spec_code: partial. Engine and docs agree on LAYOUT text, the relayout-then-apply sequence (`.skilled/commands/doctor/assets/doctor-overlay-apply.yaml:105`, `.skilled/skills/system-skilled-doctor/references/overlays.md:96`), and the three failure-line endings; two doc rows disagree (findings 1-2).
- playbook_capability: pass for the apply workflow's relayout branches (`.skilled/commands/doctor/assets/doctor-overlay-apply.yaml:111-117`) against the engine's printed lines.

## Integration Evidence

- `.skilled/commands/doctor/assets/doctor-overlay-apply.yaml:105` runs plain apply after relayout, matching `.skilled/commands/doctor/assets/doctor-overlay-presentation.txt:563` "and then applies" and `.skilled/skills/system-skilled-doctor/references/overlays.md:96`.

## Edge Cases

- `.skilled/commands/doctor/assets/doctor-overlay-apply.yaml:114` lists the refuse reasons without the root/skilled one; the step still says to quote every refuse line, so the outcome is right. Recorded as advisory, not a finding.
- "Leading dots dropped" under root/ (`.skilled/skills/system-skilled-doctor/references/overlays.md:92`, `.skilled/commands/doctor/assets/doctor-overlay-presentation.txt:118`) is the current layout, not the retired dot-dropped-without-prefix layout (`.skilled/skills/system-skilled-doctor/references/overlays.md:263`).

## Confirmed-Clean Surfaces

- LAYOUT line format, overflow forms, relayout-runs backup location, failure-line wording.

## Ruled Out

- Docs claiming relayout applies by itself: the workflow runs apply as a second call (`.skilled/commands/doctor/assets/doctor-overlay-apply.yaml:105`), and the engine prints "run ... apply" (`.skilled/commands/doctor/scripts/overlay-engine.cjs:6557`).

## Next Focus

- Dimension: correctness
- Focus area: frontier node F-1-005 (Barter hygiene, nested repo)
- Reason: rotate frontier nodes
- Rotation status: F-1-001 and F-1-003 correctness done
- Required evidence: barter/ai-speckit .gitignore, fixture rename, hooks reading overlayDir, pre-commit fail-closed

Review verdict: PASS
