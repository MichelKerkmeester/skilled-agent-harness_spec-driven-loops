# Iteration 8: Overlay Adopt, Re-Pin and Doctor Update Paths

## Focus

Take one more defect pass on surfaces not yet read closely: the overlay `apply --adopt` path, the re-pin and rollback path, and the doctor update apply path. Selected interpretation: a defect needs a refusal that should exist and does not, a write that can escape its guard, or a restore that can leave a half state. Deferred: final consolidation.

## Actions Taken

1. Read `adoptUnderLock` end to end: candidate selection, the root/skilled refusal, the exclude rule, the overlay-folder link guard, the generated-path refusal, the overlap check, the documentation-only README refusals, and the per-file `isRefusedAdoptName` and regular-file checks.
2. Checked `isRefusedAdoptName` against the notes' `.env` and token-named refusals, and confirmed it is called for every adopted file.
3. Checked the re-pin rollback contract and the `repin --stage` path against the notes' restore claims.
4. Checked the doctor update apply phase order against the notes' "the cleanup runs after the rebuild prompt".

## Findings

No new findings. Every refusal and restore contract checked this iteration holds at HEAD.

## Verified Claims (not findings)

- **Adopt refuses what the notes say it refuses.** `isRefusedAdoptName` rejects a `.env` name and a token-named file whose extension is not source or prose (`overlay-engine.cjs:7678-7681`), and it runs for every file the adopt would copy (`7802`). The root/skilled refusal (`7753`), the generated-path refusal (`7775`), the overlap check (`7662-7674`), the documentation-only README refusals (`7786-7794`), and the both-exist and nothing-to-adopt refusals (`7796-7797`) are all present.
- **Adopt refuses an escaping overlay source.** A source that resolves outside the overlay folder through a link is refused before any write (`7772`).
- **The relayout restore contract is implemented.** A failed move, manifest write or relink restores every copy, the manifest and the links, removes its own backup folder, prints the step that failed and exits 2; a failed restore names the path it could not restore and keeps the backup.
- **The update apply order matches the notes.** The phase list is `release.apply.dry_run -> startup.approval -> release.apply -> post_apply.battery -> rebuild.prompt -> lane.cleanup -> state.log`, so the cleanup runs after the rebuild prompt, and a missing lane-cleanup tool records `not_applicable` without running anything.

## Ruled Out

- **An adopt path that ships a credential file.** Both the `.env` and the token-named refusals run per file before any copy.
- **An adopt that writes outside the overlay folder.** The link guard resolves the source and refuses an escape.
- **A relayout that leaves a half state.** The restore path covers every move, the manifest write and each relink.
- **A doctor update that cleans before rebuilding.** The phase order puts the cleanup last.

## Dead Ends

- **Executing an adopt or relayout against a real tree.** Both write outside the lineage directory, which the dispatch forbids; the refusals were read from the code instead.

## Edge Cases

- Ambiguous input: none; each refusal maps to a notes sentence.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- `.skilled/commands/doctor/scripts/overlay-engine.cjs:7662-7674,7678-7681,7718-7830`
- `.skilled/skills/system-skilled-doctor/references/overlays.md`
- `.skilled/commands/doctor/assets/doctor-update-apply.yaml:6,99,217-222`
- `.skilled/changelog/skilled/v4.2.0.0.md:556-573,594-616`

## Assessment

- New information ratio: 0.10
- Questions addressed: Q4 (a further surface cleared)
- Questions answered: none

## Reflection

- What worked and why: reading the adopt function as a refusal sequence and matching each refusal to a notes sentence is a fast way to prove a negative; every guard the notes promise is present and runs before the first write.
- What did not work and why: no defect surfaced. The overlay engine carries dense guard comments and a large test suite, so a defect there would need a fixture run that the write boundary forbids.
- What I would do differently: stop the defect pass after the first clean surface when the remaining surfaces have the same guard density, and spend the iteration on consolidation instead.

## Recommended Next Focus

Consolidate the audit: restate every finding from iterations 1 to 8 with severity, classification, commit, `file:line` and notes line, drop any that a later iteration superseded, and mark the four key questions answered so synthesis can close the run.
