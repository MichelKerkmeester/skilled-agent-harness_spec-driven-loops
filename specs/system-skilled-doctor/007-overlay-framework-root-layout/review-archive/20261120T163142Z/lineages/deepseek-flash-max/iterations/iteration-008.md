# Review Iteration 008

## Dispatcher

- Mode: review, single iteration, LEAF executor (no nested dispatch)
- Run: `fanout-deepseek-flash-max-1795182837437-sws2tv`, generation 1, lineageMode `new`
- Frontier node: `F-1-003` at depth 1 of 3
- Dimension: maintainability
- Operator review focus: the whole overlay framework/root layout change end to end. This iteration addressed the focus through its docs-against-code clause at the operator surface: whether the doctor skill's release notes, its overlay reference and its presentation asset describe the engine that shipped, including the two LAYOUT remedies the engine can print.

## Files Reviewed

- `.skilled/skills/system-skilled-doctor/changelog/v1.2.0.0.md:3,16,29,31,33,51,57`
- `.skilled/skills/system-skilled-doctor/references/overlays.md:51,96,188,259`
- `.skilled/commands/doctor/assets/doctor-overlay-presentation.txt:17,26,34,87,115,228,273,280,290,292,457,517,539,560,562,563,592,593,598`
- `.skilled/commands/doctor/scripts/overlay-engine.cjs:3648-3661` (the LAYOUT lines and the overflow line)
- `.skilled/commands/doctor/scripts/overlay-engine.cjs:6418-6494` (`isRelayout` routing)
- `.skilled/skills/system-skilled-doctor/SKILL.md:5`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The doctor overlay presentation asset documents only one of the two LAYOUT remedies the engine emits** -- `.skilled/commands/doctor/assets/doctor-overlay-presentation.txt:87` -- the engine prints a LAYOUT line in two forms. When the target sits under `root/skilled`, the remedy is `change the destination or remove the entry`; otherwise it is `run <engine> apply --relayout` (`overlay-engine.cjs:3652-3655`). The presentation asset, which is the operator-facing contract for what `/doctor:overlay` prints, shows only the second: its LAYOUT template at `:87` reads `LAYOUT   [overlay]: [field] [from] belongs at [to]; run [the engine command] apply --relayout`, and its LAYOUT row at `:115` describes the same single remedy. `grep -n "root/skilled\|change the destination"` over the whole asset returns nothing, while the case is documented in `references/overlays.md:96` and named in `changelog/v1.2.0.0.md:31`. The asset is otherwise thorough about relayout outcomes, covering the `skipped` line at `:562` and the target-exists refusal at `:563`, so the omission is a gap rather than a stylistic choice.
   Finding class: `docs-code-drift`
   Scope proof: inside the declared review target's doctor command assets; names the exact asset lines and the exact engine lines that emit the undocumented form.
   Affected surface hints: `assets/doctor-overlay-presentation.txt:87,115`; `overlay-engine.cjs:3652-3655`; `references/overlays.md:96`; `changelog/v1.2.0.0.md:31`.
   Case: an operator on a tree whose manifest has a `skilled/...` destination sees `LAYOUT   <overlay>: source skilled/x belongs at root/skilled/x; change the destination or remove the entry`. The presentation asset says the LAYOUT remedy is `run ... apply --relayout`, so the operator has no documented explanation of the line in front of them and may run the relayout the line deliberately does not name, which then refuses the whole run.

## Traceability Checks

| Protocol | Status | Evidence | Summary |
|----------|--------|----------|---------|
| `spec_code` | pass | `changelog/v1.2.0.0.md:16,29,57`; `overlay-engine.cjs:3648-3661`; `SKILL.md:5` | The release notes name `/doctor:overlay apply --relayout` three times, the skill version is `1.2.0.0`, and the LAYOUT cap and overflow wording match the code. |
| `checklist_evidence` | pass | `references/overlays.md:51,96,188,259`; `overlay-engine.cjs:426-470,5139-5150,6082-6091` | Each reference paragraph names the behaviour the engine implements, including the sibling rule, the relayout refusal, the adopt rule and the stage refusal. |
| `skill_agent` | pass | `.skilled/skills/system-skilled-doctor/SKILL.md:5`; `changelog/v1.2.0.0.md` | The skill's version line and its release entry agree, and the entry names the command the completion criteria require. |

## Integration Evidence

- `changelog/v1.2.0.0.md:16` states the layout rule and the one-shot migration, and `:57` gives the runbook step; both match `adoptSource` (`overlay-engine.cjs:5484-5488`) and `commandRelayout`.
- `changelog/v1.2.0.0.md:29` and `presentation.txt:115` both quote the overflow line as `LAYOUT   … <n> more; run node .skilled/commands/doctor/scripts/overlay-engine.cjs apply --relayout`, which is exactly what `:3659` prints.
- `presentation.txt:273` states the engine has no plan mode for `apply --relayout`; `grep -n "isRelayout"` shows the flag only routes to `commandRelayout` at `:6494`, so the claim is true.
- `presentation.txt:280` and `:457` place the relayout backup at `[overlay folder]/relayout-runs/[stamp]/`, matching `references/overlays.md:96` and the engine's backup path.
- `references/overlays.md:51` documents the sibling rule, the refusal messages and the pre-commit repository scope in the same words the engine uses.
- `.skilled/skills/system-skilled-doctor/SKILL.md:5` prints `version: 1.2.0.0`, which is the release the changelog file names.

## Edge Cases

- **This finding shares a root cause with `R1-P2-001`.** That finding records the overflow line always naming `apply --relayout`; this one records the presentation asset documenting only that remedy. They are separate artifacts with separate fixes, so they are recorded separately, and synthesis may group them.
- **The `root/skilled` case is documented twice outside the asset.** `references/overlays.md:96` explains the relayout refusal and `changelog/v1.2.0.0.md:31` names the folder. Recorded because it bounds the severity: an operator who reads the reference finds the answer, so the gap costs a lookup rather than leaving the behaviour unexplained anywhere.
- **The presentation asset was not checked line by line.** The pass compared the LAYOUT, relayout, backup, refusal and next-step rows against the engine, which is the surface this change touched. Recorded so the coverage claim is not read as a full asset audit.
- **Tests were not re-run** for the containment reason recorded in iteration 1.

## Confirmed-Clean Surfaces

- The release notes name the migration command the completion criteria require, three times, and the skill version line agrees with the changelog filename.
- The overflow line's wording in both the changelog and the presentation asset matches the engine's format string character for character, including the three spaces after `LAYOUT`.
- The claim that `apply --relayout` has no plan mode is true: the flag has one routing site and no dry-run branch.
- The relayout backup location is stated identically in the reference, the presentation asset and the engine.
- The reference's sibling rule, refusal messages and pre-commit scope match the engine and the phase 001 requirement rows.
- The presentation asset covers the relayout's `skipped` line and its target-exists refusal, so the relayout's failure surface is documented apart from the `root/skilled` remedy.

## Ruled Out

- **The release notes do not name the migration command.** Checked and ruled out: `apply --relayout` appears three times, including the runbook step at `:57`.
- **The documented overflow-line wording differs from the engine's.** Checked and ruled out: both quote the same string, and `:3659` prints it.
- **`apply --relayout` has a plan mode the presentation asset denies.** Checked and ruled out: `isRelayout` has one routing site and no dry-run branch.
- **The reference describes a sibling rule the engine does not implement.** Checked and ruled out: `references/overlays.md:51` matches `resolveOverlayDir` branch for branch.
- **The skill version line and the changelog filename disagree.** Checked and ruled out: both are `1.2.0.0`.

## Next Focus

- Dimension: maintainability
- Focus area: frontier node `F-1-005` -- whether the Barter overlay folder's own documentation matches the hooks it ships, including `overlays/README.md` and `overlays/framework/scripts/git-hooks/README.md`
- Reason: F-1-003 maintainability is complete; F-1-005 is the node whose hooks the operator focus names, and its README is the surface iteration 2 found the silent-skip omission in
- Rotation status: third pass on F-1-005; F-1-007 keeps maintainability open
- Blocked/productive carry-forward: productive -- reading `overlays/README.md:47` beside the pre-commit hook found the undocumented skip in iteration 2, and the same comparison answers the maintainability question
- Required evidence: `barter/ai-speckit/overlays/README.md`, `barter/ai-speckit/overlays/framework/scripts/git-hooks/README.md`, and the hook lines each describes

Review verdict: CONDITIONAL
