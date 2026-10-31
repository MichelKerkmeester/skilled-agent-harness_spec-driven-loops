# Iteration 3: Producers of the path-drift and template-source classes

## Focus

Read the producers named by the taxonomy (`archive.sh`, `create.sh`, `repair-derived.cjs` and its boundary doc) and confirm or refute the producer hypothesis for the dominant path-drift class: that recorded paths are written at creation time and are not re-derived by move operations. Also read what the existing repair tool already owns, because it defines the boundary any heal tool must inherit.

## Actions Taken

- Read `archive.sh` core functions: `refresh_track_root`, `get_completeness`, `archive_spec` move sequence, `restore_spec`.
- Read `create.sh` metadata generation (`create_graph_metadata_file`) and the generator dependency notes.
- Read `README-repair-derived.md` (tool contract, boundary, exit codes, usage).
- Grepped both scripts for `repair-derived`, `refresh-track-roots`, `sweep-track-roots`, `backfill-graph` call sites.

## Findings

1. `archive.sh` moves a packet by copying to a temp directory under `z_archive/`, atomically renaming, then removing the source (`cp -R`, `mv`, `rm -rf`), and afterwards calls only `refresh_track_root`, which refreshes the track root's `graph-metadata.json` children_ids through `refresh-track-roots.mjs --apply`. It never calls `repair-derived.cjs`, so the moved packet's own recorded paths (`description.json` `specFolder`, `graph-metadata.json` `spec_folder`, document `packet_pointer`) keep their pre-archive values. This confirms the producer of the path-drift class. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh:277] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh:294] CONFIRMED
2. The same script already proves the right pattern for keeping derived data fresh after a move: `refresh_track_root` runs a re-derive (`refresh-track-roots.mjs --apply`) and warns with a copy-pasteable remediation when the script is missing. The packet's own re-derive is simply absent from the same post-move sequence. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh:161] CONFIRMED
3. `restore_spec` has the same shape: `mv` back to the packet home, then `refresh_track_root`, with no packet-level re-derive. Both directions of the move reintroduce path drift. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh:403] CONFIRMED
4. `repair-derived.cjs` is the existing owner for exactly this class: it recomputes the recorded folder name, the frontmatter packet pointer, a missing level in the generated description, and stale generated-metadata fingerprints from disk. Reporting is the default; writes require `--apply`; exit 0 means nothing left to repair, 1 means repairable work found while reporting, 2 means a failed repair. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/README-repair-derived.md:23] CONFIRMED
5. The repair boundary is explicit and matches the phase 013 constraint: derived facts may be rewritten, authored facts (evidence, verification results, decisions, handover accounts) may not. The README states roughly 139 packets and 1,100 rule instances fail for authored reasons and should keep failing until a person writes the missing content. Any heal-on-upgrade path must inherit this refusal, not work around it. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/README-repair-derived.md:40] CONFIRMED
6. `create.sh` derives the packet path at creation time by stripping the specs root from the folder path (`relative_spec="${folder_path#$SPECS_DIR/}"`) and writes `graph-metadata.json` itself; `description.json` comes from a compiled artifact (`dist/spec-folder/generate-description.js`), so a checkout without a build produces a warning and a partially scaffolded packet. Creation-time derivation plus later moves and missing generators are the two entry points for drift. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:701] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:866] CONFIRMED
7. `create.sh` already names `repair-derived.cjs --folder <packet> --apply` as its own remedy when generators are missing, so the tool is acknowledged in the creation path but not in the move path. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:878] CONFIRMED

## Ruled Out

- Writing a new path-repair tool: `repair-derived.cjs` already owns the exact recomputation and has a dry-run default, batched `--folder` support and a documented refusal boundary. The gap is invocation, not capability.

## Dead Ends

- Looking for a packet-level post-move re-derive inside `archive.sh`: three grep patterns (`repair-derived`, `refresh-track-roots`, `sweep-track-roots`) show only the track-root refresh. The absence is the finding.

## Edge Cases

- Ambiguous input: none.
- Contradictory evidence: none; the README boundary and the phase 013 "never change what a document says" constraint agree independently.
- Missing dependencies: none, all sources read.
- Partial success: none.

## Sources Consulted

- `.skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/README-repair-derived.md`

## Assessment

- New information ratio: 0.90 (5 of 6 findings fully new; 1 confirms the iteration-2 producer hypothesis and is half new)
- Questions addressed: Q2 producer attribution for path drift; Q1 candidate (invocation gap, not capability gap)
- Questions answered: none yet

## Recommendations

| ID | Recommendation | Question | Where it lives | Effort | Risk | Files touched | Evidence | Standing | Idempotent? | Reversed by | Changes document prose? |
|----|----------------|----------|----------------|--------|------|---------------|----------|----------|-------------|-------------|--------------------------|
| R-005 | Call `repair-derived.cjs` on the moved packet at the end of both `archive_spec` and `restore_spec`, exactly where `refresh_track_root` runs, so a move can never leave recorded paths stale | Q1, Q2 | `.skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh` (post-move block) | S | Low; report-first tool with a documented refusal boundary | `archive.sh` | archive.sh:279-296 moves and only refreshes the track root; repair-derived already recomputes the three recorded values | CONFIRMED gap and CONFIRMED owner | Yes by construction (recompute and write only differences) | Revert the archive commit; `git checkout -- <moved packet>` | No; derived metadata only |
| R-006 | Make every heal/upgrade path reuse `repair-derived.cjs` as its derived-fact stage instead of reimplementing recomputation, so the authored-fact refusal is inherited rather than duplicated | Q3 | Heal/upgrade tooling under `.skilled/skills/system-spec-kit/runtime/cli/spec/` (`heal-spec-docs.cjs`, `upgrade-legacy.mjs` to be read in a later iteration) | S | Low; inherits an enforced boundary | Heal tool plus its docs | README-repair-derived.md:40-46 defines the refusal and names ~139 packets / 1,100 authored rule instances | INFERRED until the heal tools are read; confirm in the Q1 comparison iteration | Yes when the stage is report-first | Revert the heal commit | No, when the boundary is honored |
| R-007 | Treat missing compiled generators as a first-class failure mode of heal and scaffold paths: the description generator lives under `dist/`, so an old or unbuilt checkout must fail with the documented remedy rather than scaffold partially | Q3 | `create.sh`, heal tooling | S | Low | `create.sh` message reused by heal tooling | create.sh:866-878 warns "partially scaffolded" and names `npm run build` / `repair-derived.cjs` as remedies | CONFIRMED behavior; INFERRED that heal tooling needs the same guard | Yes (message only) | n/a | No |

## Reflection

- What worked and why: reading the move function end-to-end answered the producer question in one read; the post-move call sequence is only three lines and its omission is visible.
- What did not work and why: expecting a repair call and finding only a track-root refresh was the key surprise; grep for the tool names across both scripts settled it quickly.
- What I would do differently: for each remaining failure class, read the full producer function rather than its first 50 lines, because the post-step calls sit at the end.

## Recommended Next Focus

Iteration 4: finish Q2 producer attribution for the remaining top classes: anchors (template scaffold source and the fresh scaffold sample), level mismatch and missing documents (level inference and the lifecycle gate), grep convention and frontmatter (old template versions and grandfathering), using the scaffold sample as the pre-edit baseline.
