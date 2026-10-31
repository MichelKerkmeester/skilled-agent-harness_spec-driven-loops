# Iteration 004: Customization handling

## Focus

Q4: Is customization handling sound end to end: base recording, three-way merge, provenance, hashes; align never writes skill bodies; apply applies only accepted decisions?

## Actions Taken

- Traced base selection, file and unit classification, merge proposal creation, decisions, apply writes, hashes and generator follow-ups in `.skilled/commands/doctor/scripts/release-update.cjs`.
- Compared the engine with the align and apply workflow assets and inspected the related release-update tests.
- Read the earlier customization implementation summary as context and checked its claims against the current source. Inspected tests but did not run them.

## Findings

### P2: Apply acceptance is a workflow gate

For pristine `update` and `new` units, `prepareWrites` queues every `take-release` file without requiring a per-file decision (`.skilled/commands/doctor/scripts/release-update.cjs:1680-1689`). For customized units, it selects only file entries present in `decisions.files` (`.skilled/commands/doctor/scripts/release-update.cjs:1691-1703`). However, align pre-fills `adopt-release` for `take-release` files in customized units (`.skilled/commands/doctor/scripts/release-update.cjs:1273-1280`). A direct `release-update.cjs apply --decisions <path>` can therefore consume that prefilled choice without a separate `decide` call.

The routed workflow closes this boundary: align requires an answer for every presented file and instructs the executor to call `decide` even when the answer matches a suggestion (`.skilled/commands/doctor/assets/doctor-update-align.yaml:110-124`). Apply requires approval of the exact dry-run plan before invoking the write command (`.skilled/commands/doctor/assets/doctor-update-apply.yaml:103-121`). So the engine alone does not prove per-file human acceptance; the complete `/doctor:update` route supplies that approval. Its no-decisions fallback also auto-plans only `update` and `new` units and skips customized/conflicting units (`.skilled/commands/doctor/assets/doctor-update-apply.yaml:95-100`).

### P2: Legacy base records can lack a fingerprint

`record-base` writes each unit's release tag and tree fingerprint (`.skilled/commands/doctor/scripts/release-update.cjs:1971-2003`), and the fingerprint covers paths, modes and blob ids (`.skilled/commands/doctor/scripts/release-update.cjs:432-442`). Base resolution accepts a record when its tag resolves and either its tree is absent or the fingerprint matches (`.skilled/commands/doctor/scripts/release-update.cjs:797-809`). The report asks for base recording only for `inferred` or `none` sources (`.skilled/commands/doctor/scripts/release-update.cjs:1102-1110`). Thus a tree-less legacy record is still reported as `recorded` without a tree comparison. This is a provenance gap if a recorded tag or record is stale; I did not reproduce a silent overwrite from it.

### Confirmed invariant: align does not write skill bodies

The materialized align path writes only evidence, proposals, `plan.json` and `decisions.json` under its run directory; dry-run writes none of those (`.skilled/commands/doctor/scripts/release-update.cjs:1371-1382`). Its unit and file plan can contain skill paths and proposal bytes, but the destination is still the run directory. The test checks that after align, every working-tree status row belongs to `.skilled/release/runs/` (`.skilled/commands/doctor/scripts/tests/release-update.test.cjs:456-475`). This proves the checked implementation path does not mutate checkout skill bodies.

### Three-way merge, hashes and generated versus authored files

The engine classifies each file by base/local/release state, distinguishing same, take-release, local-only and conflicts (`.skilled/commands/doctor/scripts/release-update.cjs:645-663`). It uses Git's three-way merge when blobs are available and otherwise falls back to its text merge (`.skilled/commands/doctor/scripts/release-update.cjs:858-895`). Plans and evidence retain the base/local/release blob ids and modes (`.skilled/commands/doctor/scripts/release-update.cjs:1047-1054`, `.skilled/commands/doctor/scripts/release-update.cjs:1216-1247`). For `merge` and `use-proposal`, `decide` stores a SHA-256 of the proposal and apply re-hashes it and rejects unresolved conflict markers (`.skilled/commands/doctor/scripts/release-update.cjs:1461-1475`, `.skilled/commands/doctor/scripts/release-update.cjs:1514-1527`).

The generated inventory is explicit: leaf manifests and trigger-index artifacts are whole-file generated, while only the top-level `derived` property of `graph-metadata.json` is generated (`.skilled/commands/doctor/scripts/release-update.cjs:70-100`, `.skilled/commands/doctor/scripts/release-update.cjs:685-723`). A local edit outside `derived` remains authored; tests verify authored graph metadata stays local and generated artifacts are named for regeneration (`.skilled/commands/doctor/scripts/release-update.cjs:701-723`, `.skilled/commands/doctor/scripts/tests/release-update.test.cjs:503-527`). Apply reports generators instead of writing generated bytes (`.skilled/commands/doctor/scripts/release-update.cjs:1922-1936`); the apply workflow checks leaf manifests and derived metadata and requires approval before repair writes (`.skilled/commands/doctor/assets/doctor-update-apply.yaml:133-144`).

### Silent overwrite assessment

I found no silent loss path in the routed apply path for planned authored files. Apply rechecks local and release blob state against the plan (`.skilled/commands/doctor/scripts/release-update.cjs:1644-1660`), checks target cleanliness before writing and again after acquiring the lock (`.skilled/commands/doctor/scripts/release-update.cjs:1755-1760`, `.skilled/commands/doctor/scripts/release-update.cjs:1875-1882`), and rollback skips a path that no longer matches the apply result (`.skilled/commands/doctor/scripts/release-update.cjs:2035-2061`). A hand edit to a whole-file generator-owned artifact is classified as generated by policy, not as an authored customization; apply itself leaves those bytes to the named generator follow-up. That ownership rule means such a direct artifact edit is outside the updater's customization protection.

## Questions Answered

- Q4: Is customization handling sound end to end: base recording, three-way merge, provenance, hashes; align never writes skill bodies; apply applies only accepted decisions?

## Questions Remaining

- Q1, Q2, Q3 and Q5 remain outside this iteration's focus.
- The practical impact of tree-less legacy base records with mutable release tags was not reproduced; the code path is confirmed, but the resulting misclassification is not measured.

## Next Focus

No additional Q4 subquestion emerged from this source pass. Leave the next focus to the reducer/orchestrator; do not broaden this iteration into Q1, Q2, Q3 or Q5.
