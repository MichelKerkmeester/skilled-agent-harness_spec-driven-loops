# Exploration findings for packet 005

Collected 2026-11-13 by three read-only exploration agents. The orchestrator verified only the items marked (checked). Everything else is a pointer: open the file and confirm the line before citing it in a spec doc. All script paths are under `.skilled/skills/system-spec-kit/` unless they start with another root.

## Operator decisions (binding)

- Archive search is opt-in and live: ripgrep plus per-packet JSON, no committed archive index, CI unchanged.
- Mixed tracks stay forbidden. A subtrack proposal is a whole-track map.
- Renumbering is a deterministic tool that updates every store. No hand edits, no AI fix-up work.
- Next-number allocation counts archived packets (operator approved the plan carrying this assumption).
- Packet is phased with five children. `recommend-level.sh --loc 2500 --files 35` returned Level 2 and `recommended_phases: false` (checked). The operator approved five phases anyway; record that in the parent spec as an operator decision.

## Subtrack model today

- Track root: non-numbered folder under `specs/`, no `spec.md`, `description.json` with `"level": "track"`. `runtime/cli/lib/track-roots.mjs` lines 4-9, 98-116.
- Subtrack: non-numbered direct child of a track, no `spec.md`, `description.json` with `"level": "sub-track"`. Names starting `z_` or `.` never qualify. `track-roots.mjs` 11-17, 71-73. `references/structure/folder-structure.md` 110-117: "A sub-track is declared, not inferred."
- One level only. `folder-structure.md:119`. `create.sh` 1433-1436 refuses more than two path segments.
- No code writes the declaration. `create.sh` 1443-1451 refuses `--track demo/sub` until it exists.
- Mixed-track detection: `track-roots.mjs:356-362` returns `mixed` when a track holds both packets and subtracks (checked).
- The predicate is re-implemented in seven files: `track-roots.mjs:71`, `spec/validate.sh:192-222`, `spec/create.sh:1034-1101`, `spec/archive.sh:193-214`, `spec/repair-derived.cjs:315-327`, `runtime/lib/validation/orchestrator.ts:226-251`, `runtime/lib/graph/graph-metadata-parser.ts:847-885`. Parity suite: `runtime/cli/tests/subtrack-predicate-parity.vitest.ts`. Unifying them is out of scope.
- Numbering is per folder: `create.sh` `resolve_branch_name`, highest numeric prefix among direct children plus one (checked, lines 1605-1627 in the main checkout). `z_archive` has no numeric prefix so archives are not counted.
- Zero live-versus-archived number collisions exist today (checked by script over the whole tree).

## Proposal guidance today

- None. Spec-folder question wording lives in `runtime/hooks/lib/spec-gate/spec-gate-core.mjs` 157-163 and 170-177, `AGENTS.md` Gate 3, `.skilled/commands/speckit/assets/speckit-plan-presentation.txt:73`, `speckit-complete-presentation.txt:71`, `speckit-implement.yaml:71`.
- `create.sh` `list_recent_track_packets` (about line 1553) prints a stderr hint about series parents only (checked).
- The only grouping threshold is prose: `specs/system-speckit/spec-folder-tooling/002-named-subtracks-and-host-repos/008-track-subtrack-regrouping/spec.md` line 88, "below the approved threshold of 8". Its operator-approved maps were never stored in the repo.

## Move and renumber tooling today

- `spec/archive.sh`: `archive_spec` (382-490) and `restore_spec` (558-625) move a packet, then run `repair-derived.cjs --roots <dest> --apply` and `refresh-track-roots.mjs --track … --apply`. It supports subtrack archives. It does not rebuild the trigger index or `specs/descriptions.json`, and leaves a phase parent's `children_ids` alone.
- `spec/repair-derived.cjs`: dry run by default, `--apply` writes, idempotent, exit 0/1/2 (checked header). `DOCS` at line 104 is `spec.md, plan.md, tasks.md, implementation-summary.md, handover.md` (checked). It rewrites `level`, `specFolder`, those five pointers, the Spec Folder row, and re-derives graph metadata. It does not touch `specId`, `parentChain`, `folderSlug`, the pointers in `goal.md` / `acceptance-criteria.md` / `resource-map.md`, or parent `children_ids`.
- `graph/migrate-generated-json.ts --only <folder>`: the only path found that recomputes `specId` and `parentChain`.
- `spec/refresh-track-roots.mjs --track <t|t/sub> --apply` and read-only `spec/sweep-track-roots.mjs`.
- `retrieval/generate-trigger-index.mjs` (`--check` writes nothing).
- Old-to-new redirect table: `.skilled/skills/sk-doc/shared/scripts/cite-drift-redirects.json`, rebuilt by `cite-drift-scan.mjs --rebuild-redirects`.
- Manual procedure: `references/structure/phase-definitions.md` 80-95.
- Measured stale pointers: `goal.md` 129 of 913, `acceptance-criteria.md` 187 of 869, `resource-map.md` 64 of 65. `specs/descriptions.json` has 1,334 of 3,916 rows for folders not on disk.
- Cross-packet references `manual.depends_on|supersedes|related_to` are never rewritten on a move.
- Hard-coded packet paths that a move would break: `.skilled/bin/lib/compiled-route-layout.cjs:53-55`, several `.github/workflows/*` files.
- Gates: pre-commit `gate:spec-remint` (`.skilled/scripts/git-hooks/pre-commit` 900-1045), pre-push `gate:track-roots` (`pre-push` 565-606), CI `trigger-index-rebuild.yml`.
- Validator rules about paths: `METADATA_DISK_PATH_CONSISTENCY`, `GRAPH_METADATA_CHILD_IDENTITY`, `GRAPH_METADATA_CHILD_DRIFT`, `SPEC_DOC_INTEGRITY`, registry at `runtime/cli/lib/validator-registry.json`.

## z_archive today

- Trigger index walker excludes it at every depth: `retrieval/lib/corpus.mjs` lines 62, 106, 190-196, 325-331.
- Ripgrep recipes exclude it: `retrieval/rg-wrapper.mjs:97` and `retrieval/lib/rg-lane.mjs:54` both carry `'--glob', '!**/z_archive/**'` (checked). `references/retrieval/retrieval-conventions.md` lines 83-139, 250, 315.
- `validate.sh --recursive` never descends: `collect_phase_dirs` (348) globs `[0-9][0-9][0-9]-*/`.
- `specs/descriptions.json` includes archives (1,058 rows) although comments say otherwise: `runtime/lib/search/folder-discovery.ts:470-486`, `ENV-REFERENCE.md:49,206`, `runtime/lib/search/README.md:150`. Code: `runtime/lib/utils/index-scope.ts:199-201`.
- `orchestrator.ts:1290-1295` says nothing re-derives an archived snapshot; `repair-derived.cjs:668-670` and `archive.sh:481` do.
- 40 subtrack `z_archive/` folders exist in the operator's main checkout holding only `.gitkeep`, untracked. They are not in this worktree. No script creates them.
- 35 archived packets record an archive or a track as `parent_id`; `repair-derived.cjs:381` expects null.
- Archives hold 18,197 markdown files; the trigger index lists 18,252 paths (checked).
- Docs that describe only track and phase archives: `runtime/cli/spec/README.md:112`, `feature-catalog/tooling-and-scripts/spec-lifecycle-automation.md:41`.

## Tests

- Runner: `cd .skilled/skills/system-spec-kit/runtime/cli && npm test`.
- Temp-repo pattern: `runtime/cli/tests/archive-track.vitest.ts` lines 1-60. Shared builder: `runtime/cli/tests/fixtures/subtrack-tree.mjs` (`buildSubtrackTree`, line 68).
- Related suites: `track-roots.vitest.ts`, `validate-subtrack.vitest.ts`, `create-track-containment.vitest.ts`, `create-track-refresh.vitest.ts`, `repair-derived.vitest.ts`, `create-root-numbering.vitest.ts` (no archive case).

## Out of scope, record under the parent's out-of-scope list

- Unifying the seven predicate copies.
- `hooks-plugins-extensions` declares identity `hooks` while its subtracks point at the folder name.
- `ai-systems` has one undeclared packet in the main working tree.
- Recursive validation does not reach phase children from a track root.
