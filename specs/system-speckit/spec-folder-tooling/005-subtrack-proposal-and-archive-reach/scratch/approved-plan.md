# Plan: subtrack proposal, deterministic relocation, and archive reach in system-spec-kit

## Context

Subtracks exist in system-spec-kit but only as a hand-written declaration (`description.json` with `"level": "sub-track"`), one level deep. Three gaps prompted this work:

1. **Nothing proposes a subtrack.** The spec-folder question offers four options with no subtrack wording, `create.sh` hints only about series parents, and no tool detects a cluster in a flat track. The November regroup (174 packets) was driven by hand with `git mv` plus repair commands, and its maps were never stored.
2. **Moving or renumbering a packet is manual.** `repair-derived.cjs` heals some stores but leaves `specId`, `parentChain`, `folderSlug`, the `packet_pointer` in `goal.md` / `acceptance-criteria.md` / `resource-map.md`, phase-parent `children_ids` and cross-packet `manual.*` references untouched. Measured residue: 129 stale `goal.md` pointers, 187 in `acceptance-criteria.md`, 64 in `resource-map.md`.
3. **Archives are half-supported.** `archive.sh` handles subtrack archives, but nothing guarantees a subtrack has a `z_archive/`, search skips archives at every depth, recursive validation never enters them, numbering ignores them, and `specs/descriptions.json` carries 1,334 rows for folders that no longer exist.

Operator decisions taken in this session:
- Spec folder: **B) new phased packet** `specs/system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach`.
- Archive search: **opt-in, live search** (ripgrep plus per-packet JSON, no committed archive index, CI untouched).
- Mixed tracks stay forbidden: a subtrack proposal is a **whole-track map**.
- Renumbering must be **a deterministic tool that updates every store**, with no hand edits and no AI token spend on fix-ups.

Assumption to confirm on approval: next-number allocation also **counts archived packets** (cheap, prevents collisions; zero live-vs-archived collisions exist today). The relocation tool covers any renumber that is still wanted.

All script paths below are under `.skilled/skills/system-spec-kit/`.

## Workflow

After approval: run `/speckit:plan` (not `:auto`) for the new packet, then ask the worktree-versus-branch question before the first code write. Phases are built and verified one at a time.

## Phase 001: relocation engine (move, renumber, re-parent)

New `runtime/cli/spec/relocate.mjs`. Dry run by default, `--apply` writes, idempotent, exit codes matching `repair-derived.cjs` (0 clean, 1 work found, 2 failure).

- Input: `--map <file.json>` (`[{ "from": "...", "to": "..." }]`), or `--from/--to` for one packet, or `--renumber <folder>` to close gaps in one folder.
- Preflight, all refusals before any write: destination collisions, the no-mix rule (reuse `classifyTrackShape` in `runtime/cli/lib/track-roots.mjs:356`), depth limit of one subtrack, `NNN-slug` naming, dirty-tree check on affected paths.
- Move: `git mv` for tracked folders, plain rename for untracked.
- Rewrite, in this order, reusing existing writers:
  - `description.json` identity (`specFolder`, `specId`, `folderSlug`, `parentChain`) through the generator behind `graph/migrate-generated-json.ts --only`, the one path that already recomputes them.
  - `graph-metadata.json` identity and the five-doc pointers through `repair-derived.cjs --roots <dest> --apply`.
  - Extend `DOCS` in `repair-derived.cjs:104` to cover `goal.md`, `acceptance-criteria.md`, `resource-map.md` and `decision-record.md`, and add the same files to the candidate list of `METADATA_DISK_PATH_CONSISTENCY` so the gap is both healed and gated.
  - Phase-parent `children_ids` on the old and the new parent (drop the moved id, add the new one).
  - Track and subtrack roots through `refresh-track-roots.mjs --track … --apply` for every affected track.
  - Inbound references across `specs/`: `manual.depends_on|supersedes|related_to` ids and markdown link targets, by exact old-id to new-id substitution from the map.
- Record: append the applied map to a committed ledger beside the redirect table (`sk-doc/shared/scripts/cite-drift-redirects.json` is rebuilt with `cite-drift-scan.mjs --rebuild-redirects`), so a regroup can be replayed and audited.
- Refresh: `retrieval/generate-trigger-index.mjs` and the `specs/descriptions.json` cache.
- Report only, never rewrite: hard-coded packet paths in code and CI (`.skilled/bin/lib/compiled-route-layout.cjs:54`, `.github/workflows/*`). The run fails closed when a moved path appears there.
- Close: run `validate.sh` on each moved packet and `sweep-track-roots.mjs`; a failure leaves the report and exit 2.
- `--declare-subtrack <track>/<name>` writes the subtrack `description.json` and `graph-metadata.json` and scaffolds `z_archive/.gitkeep`. This is the first code that writes the declaration.
- `archive.sh` restore calls the engine when the restored number is taken, assigning the next free one.

## Phase 002: subtrack proposal (present and retroactive)

New read-only `runtime/cli/spec/suggest-subtracks.mjs`:

- **Retroactive:** for a flat track at or above a threshold (default 8 live packets, the figure the regroup packet already approved; a flag overrides it), cluster packets by overlap of `description.json` keywords and `graph-metadata.json` `trigger_phrases` / `key_topics`. Output is a complete whole-track map in the `relocate.mjs` format, with candidate subtrack names taken from each cluster's shared terms. The AI's job shrinks to naming and presenting; the operator approves; `relocate.mjs --map … --apply` does the rest.
- **Present:** given a track and a description, name the best-fitting existing subtrack, or say none fits and that a new subtrack is the proposal.

Wiring so the AI raises it at the right moment:
- `create.sh` `list_recent_track_packets` (line 1553): add one advisory stderr line when the target track crosses the threshold or the new packet fits no subtrack. Never blocks the scaffold.
- Spec-folder question wording: `runtime/hooks/lib/spec-gate/spec-gate-core.mjs:157-177`, the `speckit-plan` / `speckit-complete` presentation assets, and option C in `AGENTS.md` gain one clause naming a new subtrack as a choice.
- Docs: a "when to propose a subtrack" section in `references/structure/folder-structure.md` (beside lines 97-123), a pointer from `phase-definitions.md` §2, and `SKILL.md` / `quick-reference.md` documenting `--track <track>/<sub>`.

## Phase 003: z_archive on every subtrack, numbering

- `refresh-track-roots.mjs --apply` seeds a missing `z_archive/.gitkeep` in every declared subtrack; `sweep-track-roots.mjs` reports a subtrack without one.
- Commit the 40 existing untracked subtrack `z_archive/.gitkeep` folders.
- `create.sh` `resolve_branch_name` (line 1605): the highest-number loop also reads `$SPECS_DIR/z_archive/*`. Add the missing archive case to `create-root-numbering.vitest.ts`.
- Update the feature catalog and `runtime/cli/spec/README.md:112`, which still describe only track and phase archives.

## Phase 004: archive search and JSON support at every depth

- `retrieval/rg-wrapper.mjs:97` and `retrieval/lib/rg-lane.mjs:54`: an `--include-archive` mode drops the `!**/z_archive/**` glob and labels each hit `archived`. A JSON lane searches `description.json` and `graph-metadata.json` under archives. Default behavior and the trigger index are unchanged.
- `/speckit:search` (`commands/speckit/search.md`) and `references/retrieval/retrieval-conventions.md` document the mode and one recipe. Resume keeps excluding archives.
- `validate.sh --recursive --include-archive` descends into `z_archive` at track, subtrack and phase depth.
- JSON health: one `repair-derived.cjs --roots` pass over archives to clear the 35 stale `parent_id` records; regenerate `specs/descriptions.json` and have `archive.sh` refresh it after each move.
- Correct the comments and docs that claim archives are excluded from the description cache (`folder-discovery.ts:470-486`, `ENV-REFERENCE.md:49,206`, `runtime/lib/search/README.md:150`, `orchestrator.ts:1290-1295`).

## Phase 005: tests and closeout

- New vitest suites in `runtime/cli/tests/`, built on `fixtures/subtrack-tree.mjs` and the temp-repo pattern in `archive-track.vitest.ts`: relocate (move, renumber, re-parent, refusals, idempotence, inbound references), suggest-subtracks (cluster map, threshold, present-time fit), archive numbering, include-archive search, recursive archive validation.
- Packet closeout per the completion rule.

## Noted, not in scope

- The subtrack predicate is re-implemented in seven files; unifying it is a separate change.
- `hooks-plugins-extensions` declares identity `hooks` while its subtracks point at the folder name.
- `ai-systems` has one undeclared packet in the working tree.
- Recursive validation does not reach phase children from a track root.

## Verification

1. `cd .skilled/skills/system-spec-kit/runtime/cli && npm test`, with a baseline run captured before the first edit and the delta reported.
2. `relocate.mjs --map <sample>` dry run against the real tree, then `--apply` inside a throwaway copy; second run must report nothing to do.
3. `suggest-subtracks.mjs` on a real flat track with more than eight packets; the emitted map must pass `relocate.mjs` preflight.
4. `sweep-track-roots.mjs` exit 0 apart from the known `ai-systems` drift; `generate-trigger-index.mjs --check` clean.
5. `/speckit:search` with and without the archive mode on a phrase known to live only in `specs/sk-doc/z_archive/`.
6. `validate.sh <packet> --strict` on the new packet with an explicit `RESULT: PASSED`.
