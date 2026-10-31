# Iteration 7 - Phase 007 documentation alignment and phase 008 playbook execution evidence

## Focus

Maintainability, with the overlay protocols `feature_catalog_code` and `playbook_capability` in view: does the playbook index carry every scenario the packet added and does each scenario have a run behind it, do the catalog rows and the authoring references describe behaviour the shipped code actually has, and did the phase that owned the stale authoring guidance finish the job the earlier phase handed it?

## Files Reviewed

- `.skilled/skills/system-spec-kit/manual-testing-playbook/manual-testing-playbook.md:341-348` (scenario index rows 476 to 483)
- `.skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/` (eight scenario files)
- `specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree/scratch/runs/` (per-scenario transcript, command and check files)
- `.skilled/skills/system-spec-kit/benchmark/reports/2026-10-25--manual-testing-playbook--weak-model-authoring/results.csv`
- `.skilled/skills/system-spec-kit/assets/template-mapping.md:231-235,279-284,344`
- `.skilled/skills/system-spec-kit/README.md:538,624`
- `.skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md:218,554`
- `.skilled/skills/system-spec-kit/references/structure/folder-structure.md:140`
- `specs/system-speckit/054-weak-model-spec-authoring/003-versioned-placeholder-gate/goal.md:114` (OP-4)
- `specs/system-speckit/054-weak-model-spec-authoring/007-playbook-catalog-readme-alignment/acceptance-criteria.md:58,60`

## Findings

### P0 Findings

None.

### P1 Findings

1. **`assets/template-mapping.md` still teaches `[PLACEHOLDER]` as the marker to replace, and no shipped validator detects it, so a packet that follows this guidance can ship looking filled** -- `.skilled/skills/system-spec-kit/assets/template-mapping.md:233` -- The file's placeholder-conventions section leads with "`[PLACEHOLDER]` - Must be replaced with actual content" (`:233`), repeats it as "**Fill every placeholder** - Replace `[PLACEHOLDER]` with actual content" (`:281`) and again at `:344`. The canonical markers since v2.3 are `[YOUR_VALUE_HERE:` and `[NEEDS_CLARIFICATION:`, and `PLACEHOLDER_MARKER_RE` in the orchestrator matches exactly those (`orchestrator.ts:665`), so `[PLACEHOLDER]` passes strict validation. The packet knew: phase 003 recorded "`README.md` lines about `check-placeholders.sh` and `assets/template-mapping.md` still say `[PLACEHOLDER]`. Phase 7 owns the README alignment" as OP-4 (`003/goal.md:114`). Phase 007 fixed the README (`README.md:538,624` now name the value token) and its AC-005 asserted only `README.md` (`007/acceptance-criteria.md:58`), so the second half of OP-4 was never owned by any row and the file is unchanged.
   - Claim: the packet's own follow-up named this file, the owning phase closed without it, and the surviving text teaches a marker the gate cannot see.
   - Evidence refs: `template-mapping.md:233`, `:281`, `:344`; `orchestrator.ts:665`; `003/goal.md:114`; `007/acceptance-criteria.md:58`.
   - Counterevidence sought: a phase 007 row covering `assets/`, and a validator rule that flags `[PLACEHOLDER]`. AC-005 and AC-007 name `README.md` and the four reference files only; the broad post-edit scan would flag a bracket but the strict validator does not.
   - Alternative explanation: `[PLACEHOLDER]` might be a harmless illustrative spelling. Rejected: the line is an instruction ("Must be replaced"), so a reader follows it literally, and the result passes the gate.
   - Final severity: P1, confidence 0.88.
   - Downgrade trigger: a later commit that rewrites those three lines to the v2.3 token form, or a validator rule that flags bare `[PLACEHOLDER]`.

### P2 Findings

1. **The same asset states `decision-record.md` is required, while the contract makes it optional and this packet's nine phases all omit it** -- `.skilled/skills/system-spec-kit/assets/template-mapping.md:283` -- The rule reads "**Use canonical required filenames** - `decision-record.md` is required; topic-specific ADR files are supplemental artifacts, not replacements." `references/structure/folder-structure.md:140` says the opposite ("`decision-record.md` - architecture decisions; created on request, skipped silently when absent"), and every one of the nine phase folders in this packet has no `decision-record.md`, with ADRs living in `plan.md` (for example `003-versioned-placeholder-gate/plan.md:437`). A reader who trusts the asset creates a file the contract does not require, or concludes the packet is non-compliant.
2. **The catalog's two new sections are indexed by the playbook but carry no `Last verified` marker tied to a run** -- `.skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md:218` -- Both new sections (`### Example drift guard` at `:218`, `### Spec authoring card` at `:554`) exist and are linked from the playbook index rows, which satisfies `feature_catalog_code` at the row level. Neither states which scenario verified it or when, while the eight scenario files do carry a verification section. The overlay is therefore satisfied as a pointer and thin as evidence; advisory only.

## Traceability Checks

- **`playbook_capability`**: all eight scenario ids the packet added (476 to 483) appear in the index with a title, a relative file link and a catalog link, and each id has a scenario file under `template-authoring/`. Phase 007's handoff criterion holds.
- **Phase 008 execution evidence**: every id has a transcript, a command file, a stderr file and a check file in `008/scratch/runs/` (four files per id, eight ids), and `results.csv` holds eight rows, all `PASS`, matching the two parent-facing claims (`goal.md:95`, `criteria.txt` line C6).
- **`feature_catalog_code`**: the catalog links resolve, and each of the three new catalog entries named by the index exists (`versioned-placeholder-gate`, `example-drift-guard`, `template-section-fill-guidance`, `spec-authoring-card`).
- **README alignment**: `README.md:538` and `:624` describe the token lifecycle and the Draft warning correctly, including that a Draft v2.3 packet "may warn and still pass strict". This matches the orchestrator's behaviour and is a correct statement of the contract.
- **`skill_agent` and `agent_cross_runtime`**: closed in iteration 6 with two P2 findings; not reopened.

## Confirmed-Clean Surfaces

- The phase 007 acceptance rows do not overstate what they checked: AC-005 scopes itself to `README.md` and AC-007 to the four reference files plus `template-guide.md`, so the surviving `template-mapping.md` text is a coverage gap rather than a false `Met`.
- No `[PLACEHOLDER]` remains in `README.md` or in the four reference files, which is what those two rows assert.
- The scenario files' slug ids (`template-authoring-placeholder-token-warning-while-draft`) and the index's numeric ids coexist without a mapping table because the index row carries both the number and the relative path; no reader has to guess.
- The feature catalog is a single index file plus per-feature files, so the two new sections cannot drift from their detail pages without the link check failing.

## Assessment

Dimensions addressed: maintainability

One P1 and two P2 findings, all in the documentation half of the packet. The playbook and run evidence are solid: eight scenarios, eight transcripts, eight PASS rows, an index that links both. The surviving defects are the ones a follow-up note already named: the file that teaches the old placeholder form was never in any accepted row, and it also asserts a document requirement the contract does not have.

## Next Focus

Iteration 8 (correctness): the phase 009 benchmark methodology as an artifact rather than as a result — whether `baseline.json`, `delta.json`, `delta.md` and the report's tables are arithmetically consistent with the per-run transcripts, whether the deciding set's worktree and commit are recoverable from what is stored, and whether the frozen brief is byte-identical between the baseline and final sides.

Review verdict: CONDITIONAL
