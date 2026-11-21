# Review Iteration 007

## Dispatcher

- Target spec folder: `specs/system-skilled-doctor/007-overlay-framework-root-layout`
- Review packet root: `specs/system-skilled-doctor/007-overlay-framework-root-layout/review/lineages/deepseek-flash-max`
- Frontier node: `F-1-002` at depth 1 of 3
- Dimension: traceability
- Focus: Frontier node F-1-002: traceability
- Executor: cli-mistral-vibe model=deepseek-flash (inline, no nested dispatch)
- Operator review focus: follow-up round after remediation. This iteration asks whether the remedies the remediation added are traceable from the packet's own checklist to the tree, and whether the docs still describe the code that ships.

## Files Reviewed

| File | Lines | Why |
|------|-------|-----|
| `specs/system-skilled-doctor/007-overlay-framework-root-layout/003-engine-docs-and-release/goal.md` | 59-73 | The seven completion criteria, re-run read-only |
| `.skilled/commands/doctor/scripts/overlay-engine.cjs` | 87-95, 3686-3712 | `LAYOUT_SHOWN`, the two per-line remedies and the three overflow forms |
| `.skilled/commands/doctor/scripts/overlay-engine.cjs` | 5881-5891, 6661-6670 | The `pre-commit` outside-repository throw and the exit-code mapping |
| `.skilled/commands/doctor/assets/doctor-overlay-presentation.txt` | 17-34, 87-96, 118, 276-293, 560 | The documented LAYOUT forms and the setting refusal table |
| `.skilled/skills/system-skilled-doctor/references/overlays.md` | 51, 169-198, 261-280 | The setting rules, the strict-write refusal and the relayout section |
| `.skilled/skills/system-skilled-doctor/changelog/v1.2.0.0.md` | 1-57 | The release note against the shipped behaviour |
| `.skilled/skills/system-skilled-doctor/SKILL.md` | 5 | The version line |

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **A checked completion criterion does not reproduce** -- `specs/system-skilled-doctor/007-overlay-framework-root-layout/003-engine-docs-and-release/goal.md:62` -- The first criterion's third clause requires `rg -n -e 'source[L]ayout' -e 'framework-root' -e 'opt[-]in' .skilled/commands/doctor .skilled/skills/system-skilled-doctor -g '!**/scripts/**' -g '!**/changelog/v1.1*'` to print nothing, and the criterion is marked `[x]`. Re-running it read-only prints `.skilled/commands/doctor/assets/doctor-env.yaml:48`, which contains `opt-in` in the phrase `or the description says set 1, set true or opt-in`. The hit is unrelated to the layout rule, so the criterion's intent still holds, but the command as written does not pass and the tick cannot be reproduced.
   Finding class: traceability
   Scope proof: ran the criterion's own command verbatim from the repository root; the single hit is in a file the criterion's two globs do not exclude.
   Affected surface hints: `specs/system-skilled-doctor/007-overlay-framework-root-layout/003-engine-docs-and-release/goal.md`, `.skilled/commands/doctor/assets/doctor-env.yaml`
   Case: an evaluator or a later reviewer re-runs the criterion to confirm the phase is done, sees one hit where the criterion promises none, and cannot tell whether the layout rule regressed or the pattern is too broad.

   ```json
   {
     "type": "claim",
     "claim": "The first completion criterion of phase 003 is marked done but its third command prints a hit.",
     "evidenceRefs": [
       "specs/system-skilled-doctor/007-overlay-framework-root-layout/003-engine-docs-and-release/goal.md:62",
       ".skilled/commands/doctor/assets/doctor-env.yaml:48"
     ],
     "counterevidenceSought": "ran the other two clauses of the same criterion and both hold: 'inside the tree' appears only on the line that also names ../<name> at doctor-overlay-presentation.txt:560, and the leading-dot search prints nothing. Ran the second criterion and it prints exactly one heading at overlays.md:261.",
     "alternativeExplanation": "the pattern was written before doctor-env.yaml gained the word opt-in, so the criterion was true when it was ticked and drifted afterwards. That is still a traceability defect, because a ticked criterion is read as reproducible.",
     "finalSeverity": "P2",
     "confidence": "high",
     "downgradeTrigger": "drop if the criterion is amended to exclude assets/ or to anchor the phrase to the layout rule, which makes the tick reproducible again"
   }
   ```

## Traceability Checks

| Check | Protocol | Result | Evidence |
|-------|----------|--------|----------|
| `checklist_evidence` | core | partial | Six of the seven phase-003 criteria re-ran clean; the first criterion's third clause prints one hit, recorded as finding 1 |
| `spec_code` | core | pass | Every documented LAYOUT form matches the code: `doctor-overlay-presentation.txt:118` names the three overflow forms and `overlay-engine.cjs:3702-3708` emits exactly those three |
| `decision_alignment` | core | pass | D1 holds: the changelog and the presentation doc restate the `framework/` + `root/` rule with no opt-in field, and `overlays.md:51` states the sibling rule D2 froze |
| `integration_naming` | core | pass | The docs name the exact command at each remedy: `/doctor:overlay apply --relayout` in `changelog/v1.2.0.0.md:16` and `:57`, and `node .skilled/commands/doctor/scripts/overlay-engine.cjs apply --relayout` in `doctor-overlay-presentation.txt:118` |

## Integration Evidence

- `.skilled/skills/system-skilled-doctor/SKILL.md:5` prints `version: 1.2.0.0`, and `.skilled/skills/system-skilled-doctor/changelog/v1.2.0.0.md:16` and `:57` both name `/doctor:overlay apply --relayout`. This closes completion criterion 2 of the packet.
- `.skilled/commands/doctor/assets/doctor-overlay-presentation.txt:118` documents the three overflow forms, and `.skilled/commands/doctor/scripts/overlay-engine.cjs:3702-3708` branches into exactly those three, so the doc and the code agree line for line.
- `.skilled/commands/doctor/assets/doctor-overlay-presentation.txt:87-88` documents the two per-line remedies, and `.skilled/commands/doctor/scripts/overlay-engine.cjs:3693-3696` selects between them on `isUnderRootSkilled(move.to)`.
- `.skilled/skills/system-skilled-doctor/references/overlays.md:51` says `pre-commit` exits 2 with the outside-repository message; `overlay-engine.cjs:5887` throws that message and `:6665` returns `EXIT_ERROR`, which `:91` defines as 2. The doc and the code agree.
- `.skilled/skills/system-skilled-doctor/changelog/v1.2.0.0.md:51` says a relayout keeps its backup in `<overlay folder>/relayout-runs/<stamp>/`; `overlay-engine.cjs:6491` builds that path from `ctx.overlayRoot` and `RELAYOUT_RUNS_FOLDER`.

## Edge Cases

- **The failing clause is a pattern-drift, not a rule regression.** The `opt-in` hit sits in `doctor-env.yaml`, an asset about documenting environment variables, and has nothing to do with the layout rule. The finding is scoped to the criterion's reproducibility, not to the rule it was written to protect.
- **`validate.sh --recursive --strict` remains unrun.** The packet's sixth completion criterion cannot be executed inside this lineage's write surface. It is recorded as unverified rather than passed, and the synthesis carries that limit forward.
- **The engine suites remain unrun.** `node --test .skilled/commands/doctor/scripts/tests/overlay-engine-*.test.cjs` writes fixtures outside the lineage, so the first completion criterion is read rather than executed. Every assertion cited in this run was read from the suite source.

## Confirmed-Clean Surfaces

- `.skilled/commands/doctor/scripts/overlay-engine.cjs:91` defines `EXIT_ERROR = 2`, so the docs' claim that `pre-commit` exits 2 on an outside-repository folder is accurate.
- `.skilled/commands/doctor/scripts/overlay-engine.cjs:3693-3696` and `:3702-3708` match `doctor-overlay-presentation.txt:87-88` and `:118` form for form, including the mixed overflow line that names both remedies with their counts.
- `.skilled/commands/doctor/scripts/overlay-engine.cjs:88` sets `LAYOUT_SHOWN = 20`, matching the "at most 20" the changelog and the presentation doc both state.
- `.skilled/skills/system-skilled-doctor/references/overlays.md:261` carries exactly one `### Moving an existing tree onto the new layout` heading, and the section names `apply --relayout`, `offLayout` and `--adopt`.
- `.skilled/skills/system-skilled-doctor/changelog/v1.2.0.0.md:3` names `framework/` and `root/`, and `:16` names `/doctor:overlay apply --relayout`, which is what phase 003's fifth criterion asks for.
- `.skilled/commands/doctor/assets/doctor-overlay-presentation.txt:560` states the outside-repository refusal with the same exit code and message the engine throws.

## Ruled Out

- **The docs claim an exit code the engine does not use.** Considered that `overlays.md:51` says `pre-commit` exits 2 while the engine throws. Ruled out: `:6665` returns `EXIT_ERROR`, defined as 2 at `:91`.
- **The LAYOUT overflow line advises relayout for a blocked move.** Ruled out: `:3700-3707` partitions the hidden moves into `blocked` and `movable` and names each remedy for its own count.
- **The changelog overstates the relayout backup location.** Ruled out: `:6491` builds the path from the overlay root, which is what the changelog says.
- **The version bump did not reach the skill file.** Ruled out: `SKILL.md:5` prints `version: 1.2.0.0`.
- **The relayout section is missing from the reference doc.** Ruled out: the heading is present once at `overlays.md:261` and the section names all three required terms.

## Next Focus

- Dimension: maintainability
- Focus area: run-level pass over `overlay-engine.cjs` for duplication and naming drift, and over the packet docs for stale pointers
- Reason: maintainability is the last canonical dimension with no iteration behind it, and the reducer still lists it as remaining
- Rotation status: F-1-002 traceability complete; all three frontier nodes now carry at least two dimensions
- Blocked/productive carry-forward: productive -- re-running the packet's own criteria found one that no longer reproduces
- Required evidence: the engine's largest functions read for duplication; the six phase goals' cross-references to each other; the prior maintainability findings (`:3398`, `:4582`, `:4603`) re-checked
- Recovery note: the two Skilled-side criteria that need execution stay unrun; the synthesis must carry that limit rather than claim a pass

Review verdict: PASS
