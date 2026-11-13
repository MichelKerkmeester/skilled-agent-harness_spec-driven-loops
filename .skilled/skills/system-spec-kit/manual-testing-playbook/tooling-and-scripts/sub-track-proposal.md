---
title: "493 -- Sub-track proposal"
description: "This scenario validates the sub-track proposal for `493`. It focuses on suggest-subtracks.mjs printing a whole-track map for a flat track, withholding it below the threshold and writing nothing."
version: 1.0.0.0
---

# 493 -- Sub-track proposal

This document captures the scratch-directory manual validation contract for `suggest-subtracks.mjs`.

---

## 1. OVERVIEW

This scenario validates the sub-track proposal for `493`. It focuses on `suggest-subtracks.mjs` printing a whole-track map for a flat track, withholding it below the threshold and writing nothing. The fixture track lives in a scratch directory under the operating-system temp directory, and the tool reads it through `--specs`. It never reads or writes this checkout's `specs/` tree.

### Why This Matters

A track that grows flat mixes unrelated subjects in one list. The proposal groups packets by the words their `description.json` keywords and graph metadata already carry, and prints the grouping as a `from` and `to` map. It is advice. Nothing moves until an operator reviews the map and hands it to `relocate.mjs --map`.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `493` and confirm each outcome without contradictory evidence.

- Objective: Prove that `suggest-subtracks.mjs` withholds a map below its threshold, prints a map covering every packet once the threshold is met, answers a `--describe` question on a flat track with a plain sentence, rejects a track that does not exist and leaves the fixture unchanged.
- Real user request: `The tools track is one flat list. Suggest how its packets could be grouped into sub-tracks, but don't move anything yet.`
- Prompt: `Propose a sub-track grouping for the flat tools track with suggest-subtracks.mjs and show me the map it prints. Do not move or write anything. Return PASS or FAIL with the map and the exit codes.`
- Expected execution process: Build a five-packet `tools` track in a scratch directory, run the proposal at the default threshold, rerun it with `--threshold 4`, ask a `--describe` question, name a missing track and list the fixture.
- Expected signals: The default run prints `track tools has 5 live packets, below the threshold of 8; no map`. The `--threshold 4` run prints a JSON array of five `from` and `to` pairs on stdout and three group lines on stderr. The `--describe` run prints `track tools is flat; no sub-track to fit`. The missing track exits `2`. The fixture listing is unchanged.
- Desired user-visible outcome: A concise `PASS` with the proposed map and the exit codes, or a `FAIL` that names the first violated check.
- Pass/fail: PASS if every condition in Section 3 Pass / Fail holds, FAIL if any one does not.

---

## 3. TEST EXECUTION

### Prompt

```text
Propose a sub-track grouping for the flat tools track with suggest-subtracks.mjs and show me the map it prints. Do not move or write anything. Return PASS or FAIL with the map and the exit codes.
```

### Commands

1. From the repository root, create an isolated scratch directory. Confirm the printed path begins with the operating-system temp directory and is not the repository root.

   ```bash
   export SUBTRACK_DEMO="$(cd "$(mktemp -d "${TMPDIR:-/tmp}/subtrack-manual.XXXXXX")" && pwd -P)"
   printf 'SUBTRACK_DEMO=%s\n' "$SUBTRACK_DEMO"
   ```

2. Build a flat `tools` track with five packets. Two share ranking words, two share archive words and one shares nothing.

   ```bash
   mkdir -p "$SUBTRACK_DEMO/specs/tools/001-rank-tuning" "$SUBTRACK_DEMO/specs/tools/002-rank-cache" "$SUBTRACK_DEMO/specs/tools/003-archive-restore" "$SUBTRACK_DEMO/specs/tools/004-archive-listing" "$SUBTRACK_DEMO/specs/tools/005-release-notes"
   printf '# Rank tuning\n' > "$SUBTRACK_DEMO/specs/tools/001-rank-tuning/spec.md"
   printf '# Rank cache\n' > "$SUBTRACK_DEMO/specs/tools/002-rank-cache/spec.md"
   printf '# Archive restore\n' > "$SUBTRACK_DEMO/specs/tools/003-archive-restore/spec.md"
   printf '# Archive listing\n' > "$SUBTRACK_DEMO/specs/tools/004-archive-listing/spec.md"
   printf '# Release notes\n' > "$SUBTRACK_DEMO/specs/tools/005-release-notes/spec.md"
   printf '{"level":"task","specFolder":"tools/001-rank-tuning","keywords":["search ranking","ranking weights"]}\n' > "$SUBTRACK_DEMO/specs/tools/001-rank-tuning/description.json"
   printf '{"level":"task","specFolder":"tools/002-rank-cache","keywords":["search ranking","ranking cache"]}\n' > "$SUBTRACK_DEMO/specs/tools/002-rank-cache/description.json"
   printf '{"level":"task","specFolder":"tools/003-archive-restore","keywords":["archive restore","restore numbering"]}\n' > "$SUBTRACK_DEMO/specs/tools/003-archive-restore/description.json"
   printf '{"level":"task","specFolder":"tools/004-archive-listing","keywords":["archive restore","archive listing"]}\n' > "$SUBTRACK_DEMO/specs/tools/004-archive-listing/description.json"
   printf '{"level":"task","specFolder":"tools/005-release-notes","keywords":["release notes"]}\n' > "$SUBTRACK_DEMO/specs/tools/005-release-notes/description.json"
   ```

3. Run the proposal at the default threshold of 8.

   ```bash
   node .skilled/skills/system-spec-kit/runtime/cli/spec/suggest-subtracks.mjs --track tools --specs "$SUBTRACK_DEMO/specs"
   echo "DEFAULT_EXIT=$?"
   ```

4. Lower the threshold so the five packets qualify.

   ```bash
   node .skilled/skills/system-spec-kit/runtime/cli/spec/suggest-subtracks.mjs --track tools --specs "$SUBTRACK_DEMO/specs" --threshold 4
   echo "MAP_EXIT=$?"
   ```

5. Ask which declared sub-track a new packet fits. The track is flat, so there is none to fit.

   ```bash
   node .skilled/skills/system-spec-kit/runtime/cli/spec/suggest-subtracks.mjs --track tools --specs "$SUBTRACK_DEMO/specs" --describe "archive restore numbering"
   echo "DESCRIBE_EXIT=$?"
   ```

6. Name a track that does not exist, then list the fixture to confirm nothing was created or moved.

   ```bash
   node .skilled/skills/system-spec-kit/runtime/cli/spec/suggest-subtracks.mjs --track missing --specs "$SUBTRACK_DEMO/specs"
   echo "MISSING_EXIT=$?"
   ls "$SUBTRACK_DEMO/specs/tools"
   ```

7. Remove the scratch directory.

   ```bash
   rm -rf "$SUBTRACK_DEMO"
   ```

### Expected

Step 3 prints one line and `DEFAULT_EXIT=0`.

```text
track tools has 5 live packets, below the threshold of 8; no map
```

Step 4 prints three group lines on stderr, the map on stdout and `MAP_EXIT=0`. Each packet is renumbered from `001` inside its proposed sub-track, and the packet that shares no words lands in `general`.

```text
suggest-subtracks: tools/ranking-search <- 001-rank-tuning, 002-rank-cache
suggest-subtracks: tools/archive-restore <- 003-archive-restore, 004-archive-listing
suggest-subtracks: tools/general <- 005-release-notes
[
  {
    "from": "tools/001-rank-tuning",
    "to": "tools/ranking-search/001-rank-tuning"
  },
  {
    "from": "tools/002-rank-cache",
    "to": "tools/ranking-search/002-rank-cache"
  },
  {
    "from": "tools/003-archive-restore",
    "to": "tools/archive-restore/001-archive-restore"
  },
  {
    "from": "tools/004-archive-listing",
    "to": "tools/archive-restore/002-archive-listing"
  },
  {
    "from": "tools/005-release-notes",
    "to": "tools/general/001-release-notes"
  }
]
```

Step 5 prints one line and `DESCRIBE_EXIT=0`.

```text
track tools is flat; no sub-track to fit
```

Step 6 prints the rejection on stderr, `MISSING_EXIT=2` and the five original folders.

```text
suggest-subtracks: track missing does not exist
```

```text
001-rank-tuning
002-rank-cache
003-archive-restore
004-archive-listing
005-release-notes
```

### Evidence

Capture the printed `SUBTRACK_DEMO` path, the full output of steps 3 to 6 and each `_EXIT` line. Keep stdout and stderr of step 4 apart when the map is saved to a file, because only stdout is the map.

### Pass / Fail

- **Pass**: `DEFAULT_EXIT=0` with the below-threshold line, `MAP_EXIT=0` with a five-entry map whose `from` values name every packet once, `DESCRIBE_EXIT=0` with the flat-track line, `MISSING_EXIT=2`, and a step 6 listing that holds the five original folders and no sub-track folder.
- **Fail**: a map is printed below the threshold, the map omits or repeats a packet, any proposal run exits non-zero, the missing track exits `0`, or the listing shows a new or moved folder.

### Failure Triage

1. If step 4 prints `track tools: no grouping found; no map`, the packets did not cluster. Confirm each `description.json` from step 2 carries its `keywords` array, since the tool reads words from there and from `derived.trigger_phrases` and `derived.key_topics` in `graph-metadata.json`.
2. If a group name differs, read `nameGroups` in `runtime/cli/spec/suggest-subtracks.mjs`. A name is the two words that cover the most packets of the group, ranked by coverage and then alphabetically.
3. A `--specs requires a value` or `--track is required` message points at the command line. `--help` is not an accepted argument and exits `2`.
4. Run `npx vitest run runtime/cli/tests/suggest-subtracks.vitest.ts` from `.skilled/skills/system-spec-kit` and read its first failing assertion before changing this scenario.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario registration |
| [sub-track-proposal.md](../../feature-catalog/tooling-and-scripts/sub-track-proposal.md) | Matching current-state feature reference |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/suggest-subtracks.mjs` | Threshold check, clustering, group naming and the `--describe` fit |
| `.skilled/skills/system-spec-kit/runtime/cli/lib/track-roots.mjs` | Track reader and layout the proposal starts from |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/suggest-subtracks.vitest.ts` | Map, threshold, empty track, best fit, missing track and unchanged-tree cases |

Provenance: manual only - node .skilled/skills/system-spec-kit/runtime/cli/spec/suggest-subtracks.mjs --track tools --specs "$SUBTRACK_DEMO/specs" --threshold 4

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 493
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `tooling-and-scripts/sub-track-proposal.md`
- Destructive: No. The tool only reads. The scenario writes its fixture into the scratch directory step 1 created, and step 7 removes that directory.
