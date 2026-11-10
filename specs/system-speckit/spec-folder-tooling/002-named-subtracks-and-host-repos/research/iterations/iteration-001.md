## Focus

Q1: complete the inventory of one-level track assumptions and what each does with a packet inside a named sub-track.

## Actions Taken

- Read the run config, state log and strategy. The strategy confirms Q1 is the active focus and the reducer-owned strategy sections remain untouched.
- Searched spec-kit runtime, command assets, hooks, generators and documentation for track-root discovery, path-depth checks, numbered-child traversal and metadata grouping.
- Read each direct-child implementation hit and checked recursive document discovery as a counterexample.
- The two supplied Barter reference files were not found by a hidden-file search under the mounted MEGA tree, so their contents could not be independently checked in this iteration. No `.env` file was opened.

## Findings

1. **Track-root support is rooted at one level.** The shared reader describes track roots as direct children of `specs/`, enumerates that directory and includes only immediate numbered children in each track's packet set [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/track-roots.mjs:4] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/track-roots.mjs:38] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/track-roots.mjs:56] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/track-roots.mjs:104] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/track-roots.mjs:125]. Refresh and the pre-push sweep use that reader [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/refresh-track-roots.mjs:72] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/sweep-track-roots.mjs:37] [SOURCE: .skilled/scripts/git-hooks/pre-push:577]. The create helper also skips refresh for a track value containing a slash [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1008] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1012]. A packet beneath `specs/<track>/<sub-track>/` therefore has no independently discovered or refreshed sub-track root today.

2. **Validation and archive traversal do not cross a named segment.** The validation shell loops match only direct `NNN-*` directories [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:183] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:273] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:315]. From the outer track, a nonnumeric sub-track is skipped; validating the sub-track path itself can still see its numbered packet children. The orchestrator exempts only a spec-less directory directly under `specs/`, so a named sub-track is not classified as a track root [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:215] [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:221] [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:1340]. Archive accepts numbered path segments below a top-level track and rejects a named segment; its track lookup also recognizes only the packet directly under the track [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh:186] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh:194] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh:207] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh:219]. Thus archive or restore of a nested packet fails the home-path check before the move.

3. **Additional runtime assumption found in the retrofit reporting path.** `trackOf` returns the first two path segments [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/ops/retrofit-convention.mjs:296] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/ops/retrofit-convention.mjs:298]. A nested packet is consequently grouped as `specs/<outer-track>` in the `byTrack` counters [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/ops/retrofit-convention.mjs:372]. Its `--track` prefix filter can select a nested sub-track path, but planning and write counts still aggregate under the outer track [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/ops/retrofit-convention.mjs:318] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/ops/retrofit-convention.mjs:563] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/ops/retrofit-convention.mjs:658].

4. **Docs describe only direct tracks and numeric phase nesting.** Search examples list a track, packet and numeric phase-child path, without a named intermediate level [SOURCE: .skilled/commands/speckit/search.md:108]. The implement asset's recursive phase grammar requires numeric slug segments at every phase level [SOURCE: .skilled/commands/speckit/assets/speckit-implement.yaml:116]. The README describes `specs/<track>/<packet>` and puts packet IDs in the track root's `children_ids` [SOURCE: .skilled/skills/system-spec-kit/README.md:227] [SOURCE: .skilled/skills/system-spec-kit/README.md:241]. Those are docs/model gaps for a nonnumeric named sub-track, not evidence that the general document scanner rejects it.

5. **Recursive discovery is already depth-aware.** Spec-document and graph-metadata discovery walk child directories recursively until the configured depth guard, so these paths should not be treated as direct-child blockers [SOURCE: .skilled/skills/system-spec-kit/runtime/handlers/spec-doc-discovery.ts:161] [SOURCE: .skilled/skills/system-spec-kit/runtime/handlers/spec-doc-discovery.ts:172] [SOURCE: .skilled/skills/system-spec-kit/runtime/handlers/spec-doc-discovery.ts:183] [SOURCE: .skilled/skills/system-spec-kit/runtime/handlers/spec-doc-discovery.ts:290] [SOURCE: .skilled/skills/system-spec-kit/runtime/handlers/spec-doc-discovery.ts:312].

## Questions Answered

- Q1: The known direct-root family remains the primary gap. One additional runtime hit is `retrofit-convention.mjs`, which silently folds sub-track reporting into the outer track. Search, README and phase grammar docs also omit the named intermediate level. Recursive spec-document and graph-metadata discovery already traverses nested directories.

## Questions Remaining

- Q2: How should a named sub-track be defined: its detection rule, its own graph-metadata.json and description.json, parent_id and children_ids on the track and the sub-track, and how ids and numbering work, with flat tracks unchanged?
- Q3: What failing-first test plan proves sub-track support (track roots, refresh, create, validate, recursive validate, archive, pre-push sweep, repair-derived on move) and proves flat tracks unchanged?
- Q4: How should a project-owned doctor manifest entry for .env.example work upstream: the manifest flag, the engine's project-owned status and the setup post-check, compared with Barter's overlay?
- Q5: How should the dangling .skilled/specs link in a vendored copy be fixed, and how should a host-repository trigger index be documented, including how the Gate 1 lookup finds it?

## Next Focus

Q2: determine the named sub-track detection rule and the metadata/ID/numbering contract while preserving flat-track behavior.
