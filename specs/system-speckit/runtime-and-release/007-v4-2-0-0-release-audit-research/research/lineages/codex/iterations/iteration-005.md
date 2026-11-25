# Iteration 5: Installs and Overlays

## Focus
Audit the Installs and Overlays notes against current layout mapping, rollback behavior, manifest validation, framework/root paths, and late JSON-entry behavior. The strategy selected this section; the packet's implementation summaries helped distinguish feature coverage from a documented implementation limit.

## Findings
1. **MISSING — P2:** The notes cover apply changing an entry between file, folder, and layout-link shapes, but omit the Nov 23 JSON-entry writer change that preserves the destination document's indentation depth, detected indent unit, and prevailing CRLF line endings when it serializes values. The change is user-visible in the resulting JSON. Commit `512be46971ab0b86fe3ca45850ff9f488d3aa3bb`; current layout detection and JSON operation application are at `.skilled/commands/doctor/scripts/overlay-engine.cjs:1220-1251,1426-1633,2226-2228`; related notes are `.skilled/changelog/skilled/v4.2.0.0.md:594-599` [SOURCE: `.skilled/commands/doctor/scripts/overlay-engine.cjs:1220-1251,1426-1633,2226-2228`; `.skilled/changelog/skilled/v4.2.0.0.md:594-599`; `512be46971ab0b86fe3ca45850ff9f488d3aa3bb`].
2. **BUG — P2:** The new reserved-path guard normalizes `root/skilled` but compares it case-sensitively, so `root/Skilled/...` passes `isUnderRootSkilled`; on a case-insensitive filesystem it aliases the reserved `root/skilled` path and can collide with framework content. The source-root feature introduced the check in commit `5913aebc267b50c4cdb1ccc0ddf6441ae3e53639`; current guard and caller are `.skilled/commands/doctor/scripts/overlay-engine.cjs:4160-4164,4533-4535`. The phase summary independently records this case-variant limitation at `specs/system-skilled-doctor/007-overlay-framework-root-layout/002-engine-framework-root-source-layout/implementation-summary.md:126`; related note is `.skilled/changelog/skilled/v4.2.0.0.md:546` [SOURCE: `.skilled/commands/doctor/scripts/overlay-engine.cjs:4160-4164,4533-4535`; `specs/system-skilled-doctor/007-overlay-framework-root-layout/002-engine-framework-root-source-layout/implementation-summary.md:126`; `.skilled/changelog/skilled/v4.2.0.0.md:546`; `5913aebc267b50c4cdb1ccc0ddf6441ae3e53639`].

## Ruled Out
The section's explicit claims about sibling overlay folders, rollback, duplicate and escaping layout links, README auditing, Python cache filtering, apply shape changes, refusal remedies, and pinned release bases have matching current implementation or documentation in the inspected paths; no separate contradiction was confirmed in this pass.

## Dead Ends
None.

## Edge Cases
- Ambiguous input: none.
- Contradictory evidence: none; the case-sensitive guard was also listed as a known limitation in the phase summary.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted
- `steer.md` (checked before iteration and before classifying findings; absent)
- `specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/research/lineages/codex/deep-research-config.json`
- `specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/research/lineages/codex/deep-research-state.jsonl`
- `specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/research/lineages/codex/deep-research-strategy.md`
- `specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/scratch/window-commits.txt`
- `specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/scratch/recent-packets.txt`
- `.skilled/changelog/skilled/v4.2.0.0.md:533-599`
- `.skilled/commands/doctor/scripts/overlay-engine.cjs:1220-1251,1426-1633,2226-2228,4160-4164,4533-4535`
- `specs/system-skilled-doctor/007-overlay-framework-root-layout/spec.md:64-80`
- `specs/system-skilled-doctor/007-overlay-framework-root-layout/002-engine-framework-root-source-layout/implementation-summary.md:126`
- Commits `512be46971ab0b86fe3ca45850ff9f488d3aa3bb` and `5913aebc267b50c4cdb1ccc0ddf6441ae3e53639`

## Assessment
- New information ratio: 1.0
- Questions addressed: Installs and Overlays notes compared against current layout mapping, JSON-entry serialization behavior, and reserved framework/root paths.
- Questions answered: none of the global questions; this section pass added one omission and one confirmed code defect.

## Reflection
- What worked and why: Reading the feature commit and current serializer together exposed a formatting behavior absent from the notes; the current reserved-path predicate plus the packet's recorded limitation confirmed the case-variant defect.
- What did not work and why: A broad keyword scan was noisy because the overlay engine has many small follow-up commits; comparing the nearest note claims to focused current predicates and writers gave a clearer boundary.
- What I would do differently: For the next section, start from its note headings and search the current source paths named by the recent packet summaries before scanning commit subjects.

## Recommended Next Focus
Audit OpenCode and Browser Use notes against the current hub implementations, recent packet summaries, and post-draft commits; keep a separate pass for the remaining Skills and Worktrees, How It Was Checked, and Upgrade Notes sections.
