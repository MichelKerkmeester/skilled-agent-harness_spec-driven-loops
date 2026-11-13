---
title: "Sub-track proposal"
description: "Proposes a sub-track grouping for a whole flat track, or names the declared sub-track a new packet fits, and writes nothing."
trigger_phrases:
  - "Sub-track proposal"
  - "suggest-subtracks.mjs"
  - "propose sub-tracks for a track"
  - "which sub-track fits this packet"
version: 1.0.0.0
---

# Sub-track proposal (suggest-subtracks.mjs)

## 1. OVERVIEW

Proposes a sub-track grouping for a whole flat track, or names the declared sub-track a new packet fits, and writes nothing.

A track that grows flat puts unrelated subjects in one list. This tool reads the words the packets already carry and prints advice a person reviews. It never moves or writes a folder. The map it prints is the input `relocate.mjs --map` takes, and `create.sh --track` runs it to decide whether to print its one advisory line.

---

## 2. HOW IT WORKS

### Whole-track map

`suggest-subtracks.mjs --track <name>` answers for a flat track. It reads each live packet's `description.json` keywords and the trigger phrases and key topics in its `graph-metadata.json`. Words that appear in more than three fifths of the packets describe the track as a whole and are dropped. Packets that share enough of the remaining words are clustered, each cluster of two or more is named after the words most of its packets share, and the packets left over join one group named `general`.

The proposal is a JSON array on stdout with one `{ "from", "to" }` entry per packet, and the packets in each proposed sub-track are renumbered from 001. One summary line per group goes to stderr. Archived packets are not counted or mapped.

The tool prints one explanatory line and no map when the track is already grouped into sub-tracks, when it holds fewer live packets than the threshold or when no grouping of at least two groups is found. The threshold is 8 live packets unless `--threshold <n>` sets another positive whole number.

### Fit for one packet

`--describe "<text>"` answers for a track that already has declared sub-tracks. Each sub-track is scored by the share of the description's words found in its own keywords and its packets' words. The tool prints `best fit: <track>/<sub>` when at least two words match and they are at least a fifth of the description's words. Otherwise it prints `none fits: propose a new sub-track in <track>`. A flat track prints that it has no sub-track to fit.

### Arguments and exit codes

`--specs <dir>` points the tool at another specs root. Exit status 0 covers a proposal and every explained non-answer. Status 2 means an unknown argument, a missing value, a missing `--track` or a track that does not exist. The tool has no help flag: `--help` is rejected as an unknown argument, and the usage line is in the header of the script.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/suggest-subtracks.mjs` | Script | Reads packet words, clusters a flat track, scores a description against declared sub-tracks and prints the result |
| `.skilled/skills/system-spec-kit/runtime/cli/lib/track-roots.mjs` | Shared | Resolves the specs root and reads the track's packets and declared sub-tracks |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh` | Script | Runs the tool for a `--track` scaffold and prints at most one advisory line |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/system-spec-kit/runtime/cli/tests/suggest-subtracks.vitest.ts` | Vitest | Covers the whole-track map, the threshold, an empty track, the best-fit and none-fits answers, a missing track and an unchanged tree after a proposal |

---

## 4. SOURCE METADATA

- Group: Tooling And Scripts
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `tooling-and-scripts/sub-track-proposal.md`

Related references:
- [spec-packet-relocation.md](spec-packet-relocation.md) - Applies the map this tool prints.
- [spec-lifecycle-automation.md](spec-lifecycle-automation.md) - Covers the `create.sh` advisory line that runs this tool.
- [track-root-children-lists.md](track-root-children-lists.md) - Covers how a declared sub-track is read and listed.
