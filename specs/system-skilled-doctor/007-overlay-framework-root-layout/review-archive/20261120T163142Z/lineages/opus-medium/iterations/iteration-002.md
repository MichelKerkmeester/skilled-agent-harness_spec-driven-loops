# Iteration 002 - Frontier node F-1-004: correctness

## Dispatcher
- Lineage opus-medium, iteration 2 (1 prior iteration record in the state log). steer.md absent.
- Node F-1-004 marked active with frontier-admit close --status active; dimension correctness.
- Review focus addressed: docs against code. Every behavioral sentence the change added to the doctor overlay command doc, the apply/repin/update workflow YAML, the presentation text, references/overlays.md, the SKD-013 playbook scenario and the v1.2.0.0 release note was checked against the engine function that implements it, including the stated single migration step (re-pin, then `apply --relayout` once).

## Files Reviewed
- .skilled/commands/doctor/overlay.md (diff 57c01fb4c11^..d42bafc890c)
- .skilled/commands/doctor/_routes.yaml:696-700
- .skilled/commands/doctor/assets/doctor-overlay-apply.yaml, doctor-overlay-repin.yaml, doctor-update-apply.yaml, doctor-overlay-presentation.txt (diff)
- .skilled/skills/system-skilled-doctor/changelog/v1.2.0.0.md:1-57
- .skilled/skills/system-skilled-doctor/references/overlays.md:51
- .skilled/skills/system-skilled-doctor/manual-testing-playbook/overlays/sibling-folder-relayout.md
- .skilled/commands/doctor/scripts/overlay-engine.cjs:3397-3432 (layoutMoves), :3611-3660 (status LAYOUT cap and --json offLayout), :5482-5492 (adoptSource, legacyAdoptSource), :5634-5668 (adopt prefers the current place), :6097-6175 (groupLayoutMoves, planRelayout)
- specs/.../003-engine-docs-and-release/scratch/evidence/scenario-runs.md, implementation-summary.md:89,117

## Findings - New

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
1. **layoutMoves JSDoc still describes the old dot-dropped layout** -- .skilled/commands/doctor/scripts/overlay-engine.cjs:3398 -- The doc comment says a copy is on layout when it sits "inside the overlay folder at its destination path with the leading dot dropped". The function now compares against adoptSource (:3415), which returns `framework/<X>` for `.skilled/<X>` and `root/<dots dropped>` otherwise (:5485-5487). The comment describes exactly the layout the function now reports as off-layout, so a maintainer reading it gets the rule backwards.
   Finding class: stale code comment
   Scope proof: grep for "leading dot dropped" in .skilled/commands/doctor and system-skilled-doctor finds this comment plus the intentional legacy notes at :5490 and in follow-up.test.cjs:1486, which correctly label the old layout as older.
   Affected surface hints: overlay-engine.cjs layoutMoves header
   Case: a maintainer edits layoutMoves trusting the comment and treats `skilled/skills/x` (the old place) as the layout path, which reintroduces the old layout.

## Traceability Checks
- spec_code (pass): release note bullets map to code: framework/root mapping (:5485-5487), LAYOUT cap 20 plus overflow line (:3652-3660, LAYOUT_SHOWN :88), status --json offLayout (:3631), root/skilled refusal in plan, adopt and relayout (:2824, :5650-5656, :6137), adopt prefers current over legacy copy (:5637-5640), duplicate targets refused (:6158-6161).
- checklist_evidence (pass): 003 implementation-summary.md:89,117 says SKD-006/007/010 failed as written and passed after the quoting fix; the current scenario docs carry no unescaped `"source"` fragment (grep), and scenario-runs.md:250 records `bash -n` exit 0 on every extracted step.
- playbook_capability (pass): SKD-013 step 13 counts `"field": "source"` lines, which works because status --json pretty-prints with 2-space indentation (overlay-engine.cjs:3636 JSON.stringify(report, null, 2)).

## Integration Evidence
- /doctor:overlay apply workflow (.skilled/commands/doctor/assets/doctor-overlay-apply.yaml) now builds the relayout plan from `status --json` offLayout rather than the capped text lines, matching the engine cap.

## Edge Cases
- A marked-section entry whose source differs from its fragment keeps its source where it is (:3420-3423), so the "one relayout settles the layout" claim holds only for the fields the engine reports; the docs say "the overlay sources the manifest keeps off their layout paths", which is consistent.

## Confirmed-Clean Surfaces
- overlay.md error table for `.skilled-overlays.json` refusals matches the two engine messages and the pre-commit message verbatim.
- Repin rollback path in doctor-overlay-repin.yaml resolves `../<name>` against the tree root, matching createContext.

## Ruled Out
- Relayout overwriting when two off-layout sources map to the same layout path: refused by the claimed map (:6158-6161).
- SKD-013 grep miscount: ruled out, JSON output is indented.

## Next Focus
- Dimension: correctness
- Focus area: F-1-006 Barter relayout and move to overlays/ in the nested ai-speckit repo
- Reason: frontier rotation
- Rotation status: F-1-002 and F-1-004 correctness done

Review verdict: PASS
