---
title: "Implementation Plan: Give every hook, plugin and extension feature its own sub-track under the hooks track, with one overview of all features and their owning packets."
description: "Move packets by declaration: a JSON map drives relocate.mjs, which declares the destination sub-tracks, moves and renumbers the packets, rewrites every store that records a packet path and records one ledger batch. refresh-track-roots.mjs then rebuilds each track's children_ids from disk. The proof is a strict recursive validation of the track plus a path-by-path check of the map."
trigger_phrases:
  - "feature subtrack restructure plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Give every hook, plugin and extension feature its own sub-track under the hooks track, with one overview of all features and their owning packets.

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash and Node.js CLI tools; no application code changes |
| **Framework** | None |
| **Storage** | The `specs/` tree plus `.skilled/skills/sk-doc/shared/scripts/relocation-ledger.json` |
| **Testing** | `validate.sh --strict --recursive` plus `rg` and path checks |

### Overview
The move is declared, not hand-made. Two JSON maps feed `relocate.mjs`, which declares the destination sub-tracks, moves and renumbers the packets, rewrites every store that records a packet path and records one ledger batch per run; `refresh-track-roots.mjs` then rebuilds the track's `children_ids` from disk. It is proved by a strict recursive validation of the track and by a path-by-path check that every map row left its old path and arrived at its new one.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The operator-approved map exists at `scratch/move-map/map.txt` and its two JSON inputs parse
- [ ] Every destination sub-track is declared with `"level": "sub-track"` and a `z_archive/`
- [ ] The working tree holds only `specs/hooks-plugins-extensions/` changes, so the pre-move commit is exact

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions --strict --recursive --quiet` prints no `RESULT:` line other than `PASSED`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Declarative relocation

### Key Components
- **Move map** (`scratch/move-map/map.txt`, `map-intrack.json`, `map-foreign.json`): the approved `from`/`to` pairs; the JSON files are the tool inputs and the text file is the readable ledger.
- **`relocate.mjs`**: declares each destination sub-track, moves and renumbers the packets, rewrites every store that records a packet path, refreshes the affected track roots and records one ledger batch.
- **`refresh-track-roots.mjs`**: rebuilds a track's `children_ids` from the folders on disk, using the track's own `packet_id` as the identity prefix.
- **Relocation ledger**: `.skilled/skills/sk-doc/shared/scripts/relocation-ledger.json`, one batch per map run, so a rerun can tell what already moved.
- **`validate.sh`**: the gate; a strict recursive run over the track.

### Data Flow
`map.txt` is reviewed against the dry-run output; `relocate.mjs` reads the JSON map, refuses over uncommitted changes, then declares, moves, rewrites and records. The track root is refreshed from disk, and the recursive validator reads the result. Nothing is pushed.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `specs/hooks-plugins-extensions/graph-metadata.json` | Owns the track's `children_ids` and identity | update | `refresh-track-roots.mjs --apply`, then the identity `rg` in REQ-005 |
| Packet `description.json` and `graph-metadata.json` | Each records its own `specFolder` and packet pointer | update (tool) | the map coverage loop in REQ-001 |
| `.skilled/skills/sk-doc/shared/scripts/relocation-ledger.json` | Records each batch of moves | update (tool) | one ledger batch per map run |
| `feature-overview.md` | Names each packet and its path | update (tool) | the coverage loops in REQ-008 to REQ-010 |
| `validate.sh` | Reads the tree it is given | unchanged | the recursive run in REQ-004 |

Required inventories:
- Same-class producers: `rg -n '"specFolder"' specs --glob 'description.json'` lists every store the move rewrites.
- Consumers of changed paths: `rg -n 'hooks-plugins-extensions/(goal-and-directive-hooks|hook-injection-pipeline|repo-commit-gates)/' specs` names every remaining reference.
- Matrix axes: in-track rows, whole-packet rows from other tracks, held rows, and retired source sub-tracks; each axis has its own check in `acceptance-criteria.md`.
- Algorithm invariant: a packet exists at exactly one path, and every store that names it names that path.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup confirms the destination sub-tracks are declared, the map covers the track and the tree is clean enough to commit. Implementation commits the scaffolding, runs the two maps through `relocate.mjs`, retires the emptied source sub-tracks, renames the track identity and refreshes the track root. Verification runs the recursive strict validator, the map coverage loop, the overview coverage loops and the held-packet checks.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | N/A - no code changes | None |
| Integration | The whole track: every packet, sub-track and track root | `validate.sh --strict --recursive` |
| Manual | Reading each dry-run line against `map.txt` before `--apply` | Terminal |

The one command that decides the packet is the recursive strict validator; the map and overview loops in `acceptance-criteria.md` decide the rest.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `node` | Internal | Green | No move, no refresh and no validation. |
| `bash` | Internal | Green | No validator. |
| `rg` | Internal | Green | The coverage checks cannot run. |
| `git` | Internal | Green | No pre-move commit, so `relocate.mjs` refuses. |
| `relocate.mjs` | Internal | Green | The only tool allowed to move a packet. |
| `refresh-track-roots.mjs` | Internal | Green | `children_ids` stays stale. |
| `validate.sh` | Internal | Green | No gate. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the recursive validator reports a packet at a path the map does not name, or a moved packet loses its metadata.
- **Procedure**: the move is its own local commit and nothing is pushed, so `git reset --hard HEAD~1` restores the pre-move tree exactly, including the ledger. Revert the retirement commit the same way if only that step is wrong.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Nothing | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | The completion claim |
<!-- /ANCHOR:phase-deps -->

---
