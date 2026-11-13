---
title: "Spec packet relocation"
description: "Moves, renumbers and re-parents spec packets and rewrites every store that records the packet path, as a dry run unless --apply is passed."
trigger_phrases:
  - "Spec packet relocation"
  - "relocate.mjs"
  - "move or renumber a spec packet"
  - "declare a sub-track"
  - "re-parent packets into a sub-track"
version: 1.0.0.0
---

# Spec packet relocation (relocate.mjs)

## 1. OVERVIEW

Moves, renumbers and re-parents spec packets and rewrites every store that records the packet path, as a dry run unless --apply is passed.

A packet's path is written in many places, so a folder moved by hand leaves most of them naming the old place. `relocate.mjs` owns the order of operations and drives the writer that already owns each store. It is the tool an operator runs to regroup a track into sub-tracks, and the tool `archive.sh` calls when a restored packet needs a new number.

---

## 2. HOW IT WORKS

### Modes

The tool runs from the repository root and takes exactly one mode. Paths are relative to the specs root, and a leading `specs/` is accepted.

| Mode | What it does |
|---|---|
| `--map <file.json>` | Applies a list of `{ "from", "to" }` moves. A destination in a sub-track that does not exist yet declares that sub-track in the same run |
| `--from <path> --to <path>` | Moves one packet. Both flags are needed together |
| `--renumber <folder>` | Closes the number gaps among a folder's numbered children in their current order. Numbers held in that folder's `z_archive/` count as taken |
| `--declare-subtrack <track>/<name>` | Declares a sub-track in a track that holds no flat packets |

`--apply` writes. Without it the run prints every move and every file it would change and writes nothing. `--help` prints the usage line and exits 0.

### What a move rewrites

An applied plan runs in a fixed order, and each step prints `ok` or `FAILED`:

1. New sub-tracks are declared: a `description.json` with level `sub-track` and a `z_archive/.gitkeep`.
2. Each folder moves, through `git mv` when git tracks it and a plain rename when it does not.
3. References to the old path are rewritten in the text files under `specs/`, and a phase parent's `children_ids` drops or adds the moved child. An old id is matched as a whole path, so a longer id that starts with it is left alone.
4. The moved packets' own recorded paths are re-derived: `description.json` through the generated-JSON migration, then graph ids and document packet pointers through `repair-derived.cjs`. Packets whose references changed are re-derived too.
5. The affected track and sub-track roots are refreshed through `refresh-track-roots.mjs`.
6. The moves are recorded in the relocation ledger, the citation redirect table is rebuilt and the trigger index is regenerated.

The run then closes with `sweep-track-roots.mjs` and `validate.sh --strict` on each moved packet, and prints each packet's result line last.

Code and CI files are never rewritten. A moved path named in the compiled route layout or in a workflow file under `.github/workflows` refuses the run, and the message names the file and line to update by hand.

### Refusals and exit codes

Every refusal happens before the first write, each is printed as `relocate: refused: ...` and the run ends with `nothing was written`. The tool refuses:

- a path outside `specs/` or one that passes through a symbolic link
- a source or destination name that is not `NNN-slug`
- a destination that already exists, or a number a live or archived sibling already holds
- a source or destination named by two entries, a chain or swap between entries, or a destination inside its own source
- a destination deeper than one sub-track, or in a folder that exists without the sub-track declaration
- a plan that would leave a track holding flat packets beside sub-tracks
- a tracked source with uncommitted changes, or an uncommitted file the run would rewrite
- `--declare-subtrack` on a track without `graph-metadata.json`, on a folder that holds `spec.md` or on a track that still holds flat packets

Exit status 0 means nothing is left to do, and after `--apply` it means every step landed and the close passed. Status 1 means a dry run found work. Status 2 means a rejected argument, a refused plan, a failed step or a failed close.

The run is safe to repeat. An entry whose folder already sits at its destination is checked for stale records only, a second `--apply` of an applied map finds nothing to do, and a run that stopped on a failed step is finished by running the same map again.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/relocate.mjs` | Script | Parses the mode, checks the plan, moves folders, rewrites references and drives the store writers |
| `.skilled/skills/system-spec-kit/runtime/cli/lib/track-roots.mjs` | Shared | Reads tracks and sub-tracks and decides whether a track layout is mixed |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs` | Script | Re-derives graph ids and packet pointers for moved packets and packets whose references changed |
| `.skilled/skills/system-spec-kit/runtime/cli/graph/migrate-generated-json.ts` | Script | Rewrites the path identity in each moved packet's `description.json` |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/refresh-track-roots.mjs` | Script | Refreshes the track and sub-track children lists the moves change |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs` | Script | Regenerates the trigger index after the moves |
| `.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs` | Script | Rebuilds the citation redirect table from the relocation ledger |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh` | Script | Calls the tool to restore an archived packet onto the next free number |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/system-spec-kit/runtime/cli/tests/relocate.vitest.ts` | Vitest | Covers move, renumber, re-parent, sub-track declaration, the refusals, the dry-run exit status and a repeated apply |

---

## 4. SOURCE METADATA

- Group: Tooling And Scripts
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `tooling-and-scripts/spec-packet-relocation.md`

Related references:
- [sub-track-proposal.md](sub-track-proposal.md) - Prints the map this tool applies.
- [spec-lifecycle-automation.md](spec-lifecycle-automation.md) - Covers the archive restore that calls this tool.
- [track-root-children-lists.md](track-root-children-lists.md) - Covers the children lists this tool refreshes.
