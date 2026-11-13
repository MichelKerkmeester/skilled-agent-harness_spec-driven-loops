---
title: "Implementation Summary"
description: "relocate.mjs moves, renumbers or re-parents spec packets with one command and leaves every store that records a packet path correct, proven in a throwaway clone."
trigger_phrases:
  - "relocation engine implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/001-relocation-engine"
    last_updated_at: "2026-11-13T10:29:45Z"
    last_updated_by: "generate-context"
    recent_action: "Authored planning docs for parent and five phases"
    next_safe_action: "Run /speckit:implement on 001-relocation-engine"
    blockers: []
    key_files:
      - "specs/system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/001-relocation-engine/spec.md"
      - "specs/system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/001-relocation-engine/plan.md"
      - "specs/system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/001-relocation-engine/tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-001-relocation-engine"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "af8d5552-c79a-45e0-acf2-f076146fb351"
      workspace: "/Users/michelkerkmeester/worktrees/public/364-subtrack-proposal-archive-reach"
      savedAt: "2026-11-13T10:29:45Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-relocation-engine |
| **Completed** | 2026-11-13 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

One command, `relocate.mjs`, now moves, renumbers or re-parents spec packets and leaves every store that names a packet path agreeing with the new place. A second `--apply` of the same map reports nothing to do, and a map that stopped part-way finishes when you run it again.

### Phase 1: relocation-engine

You hand `relocate.mjs` a map, a single `--from` and `--to`, or a folder to `--renumber`. It prints every move and every file it would change and writes nothing until you pass `--apply`. Every refusal happens before the first write: a collision, a taken number, a track left mixed, a second sub-track level, a bad name, a path outside `specs/` or through a link, and uncommitted work on a path it would touch. Exit codes match `repair-derived.cjs`: 0 nothing left, 1 work found, 2 refused or failed.

On `--apply` it moves each folder with `git mv` (a plain rename when untracked), fixes phase-parent `children_ids` for the ids the map names, rewrites every whole old id under `specs/` and recomputes relative links, then drives the writers that own each store: `migrate-generated-json --only`, `repair-derived.cjs`, `refresh-track-roots.mjs`, `cite-drift-scan.mjs --rebuild-redirects` and `generate-trigger-index.mjs`. Each move is appended to a committed ledger. The run closes with `sweep-track-roots.mjs` and `validate.sh --strict` on each moved packet, so its last line is the moved packet's `RESULT`. A moved path named in code or CI fails the run and is reported, never rewritten. `--declare-subtrack` writes the first sub-track declaration any tool produces, and `archive.sh --restore` uses the engine when a differently named live packet holds the restored number.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/relocate.mjs` | Created | The engine: inputs, preflight, move, rewrites, ledger, refresh and close |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs` | Modified | `DOCS` covers nine documents, and `expectedParentId` clears a parent a packet moved into a track root no longer has |
| `.skilled/skills/system-spec-kit/runtime/cli/rules/check-metadata-disk-consistency-helper.cjs` | Modified | The pointer candidate list gains `goal.md`, `acceptance-criteria.md` and `resource-map.md` |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh` | Modified | A restore whose number a differently named live packet holds lands on the next free number through the engine |
| `.skilled/skills/sk-doc/shared/scripts/relocation-ledger.json` | Created | Committed record of applied moves, empty until the first real apply |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/README.md` | Modified | Lists `relocate.mjs` in the tree, the key-files table and the entrypoints |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

The `npm test` baseline was saved to `scratch/baseline.txt` before the first edit. On the real tree only dry runs ran, each with `git status --porcelain` compared before and after. Every `--apply` ran in a throwaway clone under `/private/tmp`, which was deleted afterwards: the sample map, a fixture map covering a re-parent and a tracked and an untracked move, eight refusal cases, a sub-track declaration, a restore beside a live number holder, a forced validation failure, and two moves into flat tracks. Then the full suite and strict validation of this folder ran. Nothing was committed or pushed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Option over environment variable: one run can pick a different count without editing config. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| Replace every whole old id under `specs/`, not only `manual.*` and link targets | The success criteria require that no old id remain under `specs/`, and any mention left behind would need a hand edit |
| Recompute relative markdown links by resolving them | A relative link never contains the full id, so substitution cannot reach it, and a move changes the depth of outbound links too |
| Rewrite references before the identity writers run | A rewritten document changes the fingerprint those writers record, so running them last keeps the metadata current |
| Rename `specs/descriptions.json` rows by substitution | No command regenerates the cache, and a full rebuild would drop archive rows, which is phase 004's change |
| Never rewrite the `--map` file | It names every old id on purpose and is the run's input |
| Refuse chains and swaps, and numbers held by live or archived siblings | A chain makes a rerun rename legitimate references, and archived numbers count per decision D4 |
| Declare a new sub-track named by a map, and refuse `--declare-subtrack` on a track with flat packets | A whole-track map then runs in one step, and a lone declaration beside flat packets would leave the track mixed |
| Run the dirty-tree check only while moves are pending | A rerun works on the tool's own uncommitted output and would otherwise refuse itself |
| Keep the helper's first-hit pointer read | Reading every document would fail the live packets whose stale pointers T001 measured |
| Keep refusing a restore onto a same-named live folder | Two live packets under one name is a choice for a person, and the operator decided to keep the refusal |
| Clear a stale parent in `repair-derived.cjs` `expectedParentId` | The merge keeps a stored parent over a null re-derive, and `expectedParentId` is the step meant to settle a parent from the new location |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `ls logs/archive | wc -l` after `--keep 3`: 3. After a plain run: 10. Suite: PASSED. WEAK: All tests pass. -->

| Check | Result |
|-------|--------|
| Real tree: `relocate.mjs --map scratch/sample-map.json` | Exit 1, `moves=1 ... rewrites=31`, `git status --porcelain` identical before and after |
| Real tree: dry run moving `sk-doc/z_archive/019-skill-routing-refactor` | Exit 2, names `.skilled/bin/lib/compiled-route-layout.cjs:54` and `routing-registry-drift.yml` lines 69 and 118 |
| Clone: sample map `--apply`, then again | First exit 0 ending `RESULT: PASSED`. Second `relocate: nothing to do`, exit 0 |
| Clone: fixture map (re-parent, tracked, untracked) | Exit 0. Old parent lost the id, new parent gained it, adversarial prefix-id file byte-identical, no old id left under `specs/` |
| Clone: eight refusal cases | Each exit 2 with a `refused:` line, `git status` unchanged |
| Clone: sub-track packet into a flat track | Exit 0, `RESULT: PASSED`, `parent_id=null`, second run nothing to do. Before the fix the same move failed with `parent_id="sk-git/live-sync-and-publishing" expected=cli-classifier` |
| Clone: flat-track packet into another flat track | Exit 0, `RESULT: PASSED`, `parent_id=null`, second run nothing to do |
| Clone: `archive.sh --restore` of `001-old` beside live `001-holder` | Exit 0, landed on `011-old`, `RESULT: PASSED` |
| Clone: `--declare-subtrack demo/sub --apply` | Exit 0, description, graph metadata and `z_archive/.gitkeep` written, `create.sh --track demo/sub` exit 0 |
| `npm test` | Exit 0. Vitest 206 files passed, 3 skipped. 2524 tests passed, 20 skipped. Legacy and validation stages 0 failed. Identical to `scratch/baseline.txt` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **The redirect rebuild sees only committed renames.** `cite-drift-scan.mjs --rebuild-redirects` reads git history, so it cannot record a move until that move is committed, and it rewrites the whole table to the current history. The ledger records the move. Rebuild the table again after the commit that carries the move.
2. **The description cache is renamed, not regenerated.** Moved rows in `specs/descriptions.json` get their new path by substitution, and rows already stale before the move stay stale. Full regeneration is phase 004.
3. **The close fails on any track drift in the tree.** `sweep-track-roots.mjs` checks every track, so drift in a track the map never touched also ends the run with exit 2. Refresh that track and rerun the same map.
4. **A restore onto a same-named live folder is refused.** Rename or archive the live folder first, then restore.
<!-- /ANCHOR:limitations -->

---


