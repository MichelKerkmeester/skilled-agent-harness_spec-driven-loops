# Iteration 3: Metadata Drift Systemicness

## Focus

This iteration tested whether the 026/027 metadata drift cluster is one systemic generator defect or a set of isolated manual edits. The useful split is narrower: there are multiple systemic maintenance mechanisms, but they affect different metadata surfaces.

## Findings

### F1: Parent chronology pointers are preserved by re-derive and updated only by canonical save

The 026 parent `graph-metadata.json` still reports `derived.status` as `in_progress`, `last_save_at` as 2026-05-31, and `last_active_child_id` as `004-code-graph`. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/graph-metadata.json:48] [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/graph-metadata.json:149] [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/graph-metadata.json:156] The live parent phase map says track `000-release-and-program-cleanup` is complete and several other tracks remain in progress, so a single stale last-active pointer is not a reliable recency signal. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/spec.md:97]

The code explains why a plain graph refresh would not repair this. `deriveGraphMetadata()` explicitly carries `last_active_child_id` and `last_active_at` forward rather than inventing or dropping them, and `mergeGraphMetadata()` preserves existing values too. [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1096] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1135] The canonical save path updates only the direct phase parent after save. [SOURCE: file:.opencode/skills/system-spec-kit/scripts/memory/generate-context.ts:493] [SOURCE: file:.opencode/skills/system-spec-kit/scripts/memory/generate-context.ts:504]

Root cause: this is systemic provenance split, not an isolated manual typo. Backfill derives metadata, but active-child chronology is owned by canonical save and can remain stale when work happens through review artifacts, fan-out artifacts, or non-save maintenance paths.

### F2: Status derivation can mark draft placeholders complete

The 027 parent phase map lists phases 003 through 006 as `Draft`. [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:133] Yet each of the four draft child packets has `graph-metadata.json` marked `complete` while its `implementation-summary.md` says it is only a placeholder and claims no implementation changes. [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/003-incremental-index-foundation/spec.md:48] [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/003-incremental-index-foundation/graph-metadata.json:42] [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/003-incremental-index-foundation/implementation-summary.md:3]

The graph metadata parser explains the failure mode: when no frontmatter status is found and an `implementation-summary.md` exists without a checklist, `deriveStatus()` returns `complete`. [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1030] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1032] These draft specs express status in a metadata table, not YAML frontmatter, so the ranked frontmatter status path does not catch them. [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:998] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1012]

Blast radius observed in this pass: at least four 027 draft child packets, phases 003, 004, 005, and 006. The pattern likely extends to any packet with a placeholder implementation summary, no checklist, and no frontmatter status.

### F3: Resource-map drift is an intentionally deferred stale snapshot, not a live backfill failure

The 026 `resource-map.md` warns that it is a stale pre-wave-4 path catalog generated on 2026-04-27 and explicitly says not to navigate from it. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/resource-map.md:24] It also records the live eight top-level children and says full catalog regeneration is deferred. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/resource-map.md:33] The same file still reports `Missing on disk: 0`, which can mislead readers because the rows are historical rather than absence-checked against current paths. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/resource-map.md:44]

Root cause: resource maps are inventory snapshots. The current drift is not proof that `generate-context.js` failed; it is proof that stale snapshot docs remain active navigation surfaces after reorganization.

### F4: Description metadata can retain stale renumbering labels

The 027 `005-learning-feedback-reducers/description.json` still titles itself `Phase Parent - 009 Learning Feedback Reducers` and its trigger phrases include `027 phase 009`, even though the `specFolder` is `005-learning-feedback-reducers`. [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-learning-feedback-reducers/description.json:2] [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-learning-feedback-reducers/description.json:4] [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-learning-feedback-reducers/description.json:40] It also carries `specId` as `007`, another sign of stale renumbering state. [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-learning-feedback-reducers/description.json:53]

The description generator can derive `specId` and `folderSlug` from the current folder name, so this particular stale file is more consistent with "not regenerated after rename" than with an impossible-to-generate schema. [SOURCE: file:.opencode/skills/system-spec-kit/scripts/spec-folder/generate-description.ts:72] [SOURCE: file:.opencode/skills/system-spec-kit/scripts/spec-folder/generate-description.ts:88]

### F5: Changelog rollups disagree with their index after later expansion

The 026 changelog index says track 000 has 128 leaf changelogs and 14 rollups. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/README.md:20] The top rollup for the same track says it groups one child phase and lists only `changelog-000-007-clean-room-license-audit.md`. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/000-release-and-program-cleanup/changelog-000-release-and-program-cleanup-root.md:3] [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/000-release-and-program-cleanup/changelog-000-release-and-program-cleanup-root.md:27]

Root cause: rollups and the index were not updated as one atomic catalog. This belongs to the same metadata program-health class, but it is a documentation/catalog regeneration gap rather than a graph metadata algorithm bug.

### F6: A remediation packet can itself carry conflicting progress metadata

The README/reference accuracy packet says 159 raw findings became 144 confirmed and 142 fixes across 61 files. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/009-readme-and-references-accuracy/spec.md:3] The same file still records continuity `completion_pct: 30` and table status `In Progress`. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/009-readme-and-references-accuracy/spec.md:27] [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/009-readme-and-references-accuracy/spec.md:46]

This is not fatal by itself. It matters because this packet is specifically about reference accuracy, so the stale status signal is a representative example of completion metadata not being reconciled after substantial audit/remediation work.

## Sources Consulted

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/graph-metadata.json`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/resource-map.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/README.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/000-release-and-program-cleanup/changelog-000-release-and-program-cleanup-root.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/009-readme-and-references-accuracy/spec.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/003-incremental-index-foundation/{spec.md,implementation-summary.md,graph-metadata.json}`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-causal-edge-tombstones/{spec.md,implementation-summary.md,graph-metadata.json}`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-metadata-edge-promoter/{spec.md,implementation-summary.md,graph-metadata.json}`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/006-write-path-reconciliation/{spec.md,implementation-summary.md,graph-metadata.json}`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-learning-feedback-reducers/description.json`
- `.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`
- `.opencode/skills/system-spec-kit/scripts/memory/generate-context.ts`
- `.opencode/skills/system-spec-kit/scripts/spec-folder/generate-description.ts`
- `.opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts`

## Assessment

- `newInfoRatio`: 0.64
- Novelty justification: This iteration converted the broad metadata drift cluster into separate mechanisms: preserved chronology pointers, status heuristics, stale snapshot docs, stale description renumbering, and non-atomic catalog rollups.
- Confidence: Medium-high for the mechanisms and observed blast radius. Lower for corpus-wide packet counts because this lineage sampled the highest-signal 026/027 surfaces rather than exhaustively scanning every packet.

## Reflection

What worked: reading live metadata next to the generator code made the answer sharper. Backfill is not the sole culprit; multiple ownership boundaries leave stale signals in place.

What failed: a first folder-name check used stale draft slugs. The live 027 phase map corrected the names, and the corrected check still found the same placeholder-summary status failure across phases 003 through 006.

Ruled out: "metadata drift is only manual edits." The code-level status heuristic and pointer-preservation behavior are reproducible systemic mechanisms. Also ruled out: "graph backfill alone can fix all drift." It intentionally preserves active-child chronology and does not regenerate stale catalog rollups.

## Recommended Next Focus

Investigate severity calibration for governed-scope issues and fan-out runtime reliability: community fallback, bare-ID causal tools, nonzero lineage exit accounting, service-tier defaults, and concurrency delivery.
