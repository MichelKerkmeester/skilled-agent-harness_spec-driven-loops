# Iteration 4: The Full Migration Plan

## Focus
Produce the complete, ordered migration plan for grouping the 036 children under the 9 proposed grandparents: the exact directory move sequence, every machine-readable surface updated in lockstep, verification gates, and rollback. Grounded in the reference-surface inventory (iteration 3) and the confirmed field shapes.

## Findings

### F4.1 — The move is `git mv`, not delete+create; directory moves are safe, reference updates are the real work
Renaming/relocating a spec folder is a `git mv` of the directory into the new grandparent. The path change itself is mechanical; the danger is the **hash-locked and index surfaces** that break silently if not updated in lockstep. Because `.opencode/specs` is a symlink to `../specs`, both path spellings resolve to the same files — updates must target the `specs/` canonical path (the symlink target), and the recursive validator's `.opencode/specs/...` references resolve automatically. [SOURCE: file:.opencode/specs (symlink), file:specs/descriptions.json:3207 entries]

### F4.2 — Ordered migration sequence (phased; each phase ends green)

**Phase M0 — Preflight (no writes):**
1. Capture a baseline: run `node .opencode/skills/system-spec-kit/scripts/dist/spec/is-phase-parent.js health specs/system-deep-loop/036-deep-loop-innovation` → expect `error 45`; run `validate.sh specs/system-deep-loop/036-deep-loop-innovation --strict` → record current rc + the 40-entry manifest hash `f6cf1e943d...`. [SOURCE: file:.opencode/skills/system-spec-kit/scripts/spec/validate.sh:217-218]
2. Create the 9 grandparent dirs: `mkdir -p 036-deep-loop-innovation/{001-research-inputs-and-baseline,...,009-review-and-rollback-followup}` (empty; lean trio added in M2).
3. Write the `timeline.md` design (iteration 5) and place it in the parent (or per-grandparent) BEFORE any rename, so the chronological lineage is captured first.

**Phase M1 — `git mv` moves (one grandparent at a time, program order):**
For each of the 9 groups, in order 001→009:
- `git mv specs/system-deep-loop/036-deep-loop-innovation/{child1,child2,...} specs/system-deep-loop/036-deep-loop-innovation/{grandparent}/`
- After each group, run `git status` to confirm moves staged; do NOT commit mid-plan.

**Phase M2 — Create each grandparent's lean trio (spec.md + description.json + graph-metadata.json):**
- Grandparent `graph-metadata.json`: `children_ids` = member paths; `parent_id` = `system-deep-loop/036-deep-loop-innovation`; `derived.last_active_child_id` = null initially.
- Grandparent `spec.md`: Phase Parent Mode lean doc — root purpose only, phase list with outcomes (per system-spec-kit §3 Phase Parent Mode).
- Grandparent `description.json`: `specFolder`, `parentChain: ["system-deep-loop","036-deep-loop-innovation"]`, `specId`/`folderSlug`.

**Phase M3 — Update every moved child's metadata (the lockstep surface):**
For each of the 45 moved children:
- `graph-metadata.json`: `packet_id` → `system-deep-loop/036-deep-loop-innovation/{grandparent}/{child}`; `spec_folder` → same; `parent_id` → `system-deep-loop/036-deep-loop-innovation/{grandparent}`.
- `description.json`: `specFolder` → new path; `parentChain` gains the grandparent level.
- Child phase-parents (004,006-014,047-048-049) keep their own `children_ids` (grandchildren paths move WITH the parent directory, so their absolute paths change too — update grandchildren `graph-metadata.json` `packet_id`/`spec_folder`/`parent_id` as well: ~61 grandchildren).
- Child `spec.md` frontmatter `parent:` field (e.g. 021 has `parent: "system-deep-loop/036-deep-loop-innovation"`) → `parent: "system-deep-loop/036-deep-loop-innovation/{grandparent}"`; `_memory.continuity.packet_pointer` similarly.
[SOURCE: file:specs/system-deep-loop/036-deep-loop-innovation/003-baseline-taxonomy-and-state-census/graph-metadata.json:3-5, file:.../021-completion-evidence-reconcile/spec.md:12-15]

**Phase M4 — Update the parent 036 surfaces:**
- `graph-metadata.json`: `children_ids` → the 9 grandparent paths (+ 057); `last_active_child_id` → null/reset.
- `spec.md`: PHASE DOCUMENTATION MAP → 9-10 rows; Phase Map + Outcomes table → grandparent band rows (or reference per-grandparent maps); Phase Transition/Handoff tables → grandparent-level; replace "44-child"/"live direct children"/"45" prose; renumber text citing child slugs.
- `manifest/phase-tree.json`: `live_direct_children` → 9; add the 9 grandparent band entries to `phases[]` or a new `grandparents[]`; update `notes`.
- Parent-level docs: `handover.md`, `goal.md`, `goal-plan-review.md`, `cutover-execution-plan.md`, `033-dispositions.md`, `before-and-after.md`, `execution-sequencing-strategy.md`, `goal-prompt.md` — update child-slug references and child counts.

**Phase M5 — Update external surfaces:**
1. **validate.sh** `load_child_manifest()` 036 block: replace the 40-entry list with the 9 grandparent slugs (or 9 + 057), ADD 053-056 coverage (fix the pre-existing drift), and **recompute the sha256** (the block is hash-locked). [SOURCE: file:.opencode/skills/system-spec-kit/scripts/spec/validate.sh:217-218]
2. **`recursive-child-manifest.vitest.ts`**: update the `.opencode/specs/system-deep-loop/036-deep-loop-innovation/...` child paths referenced in the test fixtures. [SOURCE: file:.opencode/skills/system-spec-kit/scripts/tests/recursive-child-manifest.vitest.ts:16-24]
3. **Runtime code**: `.opencode/skills/system-deep-loop/runtime/lib/write-set-conflict-graph/{graph.ts,shipped-census.ts}` and the 15 `runtime/tests/unit/*.vitest.ts` + `runtime/tests/helpers/legacy-real-log.ts` — update 036 child-slug references (e.g., `013-.../001-deep-research` → `005-mode-migration-cutover-and-gate/013-mode-and-lane-migrations/001-deep-research`).
4. **Cross-packet specs** (editable): `specs/sk-code/021-code-conformance-alignment/*`, `specs/sk-design/012-sk-design-program/004-hallmark-design-system/{goal,handover}.md`, `specs/sk-doc/022-code-readme-coverage/*`, `specs/sk-doc/023-feature-catalog-integrity/*`, `specs/sk-doc/024-playbook-scenario-coverage/spec.md`, `specs/sk-doc/020-hyphen-naming-convention/000-worktree-baseline-and-census/baseline/census/symlink-mode-manifest.json`.
5. **Regenerate `specs/descriptions.json`**: it is the MCP `folder-discovery.ts` global cache (`cachePath = <specsDir>/descriptions.json`, written by `writeDescriptionsCache`/`upsertFolderDescription`). Do NOT hand-edit it — regenerate via the memory scan/save path (`memory_index_scan`/`generate-context.js`) which rebuilds the cache from on-disk folders. [SOURCE: file:.opencode/skills/system-spec-kit/mcp-server/lib/search/folder-discovery.ts:1236-1330,1463]

**Phase M6 — Verification gates (final):**
1. `node .../is-phase-parent.js health specs/system-deep-loop/036-deep-loop-innovation` → expect `ok` (10 children).
2. `validate.sh specs/system-deep-loop/036-deep-loop-innovation --strict` → Exit 0 with the NEW manifest hash accepted.
3. `validate.sh specs/system-deep-loop/036-deep-loop-innovation --strict --recursive` → Exit 0 over the whole tree (grandparents + moved children + grandchildren).
4. `rg` the repo for old child-slug paths → only historical logs (037 research artifacts, iter-*.err, fanout-lineage.out) remain, which are append-only and intentionally not rewritten.
5. `node .../recursive-child-manifest.vitest.ts` (test suite) green.
6. Re-run `memory_index_scan` so `specs/descriptions.json` + the memory DB reflect the new topology.

**Phase M7 — Commit + rollback:**
- Commit per grandparent group (M1) or as one documented migration commit after M6 green. Conventional message: `refactor(036): consolidate 45 child phases into 9 multi-phase parents`.
- **Rollback:** `git revert` of the migration commit restores every path (git mv is fully revertible; metadata/content is unchanged, only paths + references). No data transformation is performed, so rollback is lossless. Historical lineage is protected because `timeline.md` (M0) recorded order before any move.

### F4.3 — Risks and rules
- **Hash-locked manifest:** the validate.sh 036 block breaks if the list changes without a sha256 recompute. Update list + hash together, in the same commit.
- **Pre-existing drift:** 053-056 are on disk but absent from the manifest; 057 is on disk but absent from `children_ids`. The migration is the right moment to reconcile all three.
- **`z_archive` alternative:** the tooling recommends "move historical phases under z_archive/" as an alternative to splitting. That applies to *completed* phases (e.g., 001,002,003,005,019,020,023,026,027,033,050,052-056). A hybrid is viable: archive genuinely-finished leaf phases, and group active/planned ones. The 9-grandparent plan covers everything; archiving is an optional extra to further slim the tree. [SOURCE: file:.opencode/skills/system-spec-kit/scripts/spec/is-phase-parent.ts:125-145]
- **Do NOT rewrite historical research/lineage logs** (037 research/, iter-*.err, fanout-lineage.out) — they are append-only evidence; leave stale child-slug mentions.
- **Ordering:** timeline.md FIRST (M0) so chronology is captured before any rename — this is the CRITICAL requirement from the research topic.

## Sources Consulted
- validate.sh load_child_manifest (hash-locked 036 block)
- is-phase-parent.ts (thresholds, health CLI)
- recursive-child-manifest.vitest.ts
- folder-discovery.ts (specs/descriptions.json cache mechanics)
- runtime write-set-conflict-graph + tests (external refs)
- Child graph-metadata.json + spec.md frontmatter shapes (003, 021)
- rg external reference inventory (iteration 3)

## Assessment
- **newInfoRatio:** 0.78
- **noveltyJustification:** Produced the complete ordered M0-M7 migration plan with per-surface lockstep updates, hash-recompute detail, regeneration (not hand-edit) of specs/descriptions.json, verification gates, and lossless rollback — all grounded in the actual file shapes.
- **Confidence:** Confirmed for surfaces verified by read/rg; M-order is judgment.

## Reflection
- What worked: tracing `folder-discovery.ts` to prove `specs/descriptions.json` is a regenerated cache (not hand-editable) and confirming the validate.sh hash-lock.
- What failed: nothing.
- Ruled out: hand-editing `specs/descriptions.json` (must regenerate); rewriting historical lineage logs (append-only); doing the manifest update without the sha256 recompute in the same commit (would break validation).

## Recommended Next Focus
Iteration 5: The timeline.md design — how to record which spec folder was worked on first vs later so chronological lineage survives renumbering; derive the chronological order from git history + graph-metadata created/updated timestamps and lay out the timeline.md schema.
