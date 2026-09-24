---
title: "Track-root children lists"
description: "Keeps each track root's children_ids equal to the packets the track holds: a writer sets the list from disk, create.sh --track lists a new packet, and a pre-push gate blocks a commit whose list disagrees."
trigger_phrases:
  - "track root children_ids"
  - "refresh-track-roots"
  - "sweep-track-roots"
  - "track-root pre-push gate"
version: 4.0.0.0
---

# Track-root children lists

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

A track root is a folder directly under `specs/`, such as `specs/sk-doc/`, that
holds numbered packets and no spec docs of its own. Its `graph-metadata.json`
lists those packets in `children_ids`.

No packet rule reaches a track root, because validation exempts tracks, and
the graph backfill refuses one as "not a spec folder". So nothing kept the list
current. When the feature landed, 15 of 18 track roots listed packets that
disagreed with the folders on disk.

The feature keeps the list equal to the packets and stops a push that would
publish a list that disagrees.

---

## 2. HOW IT WORKS

`refresh-track-roots.mjs` sets a track's `children_ids` to its numbered packet
folders, sorted, and changes no other field. It is dry by default and writes
with `--apply`, and `--track <name>` limits it to one track. A file named like a
packet, an archive folder and an entry under an earlier identity are not
packets. A record it cannot read is reported and left alone, with exit 2.

`sweep-track-roots.mjs` reports. It compares the list with the packets as sets,
because a packet renamed on disk leaves both counts equal. With `--rev <commit>`
it reads that commit instead of the working tree, and leaves out a symlinked
track, whose files live in another repository.

`create.sh --track` runs the writer for its track after a normal or phase
scaffold, so a new packet is listed from the start. The pre-push hook sweeps
each pushed commit with `--rev` and blocks on drift. It reads the commit rather
than the working tree, because a shared checkout holds other sessions'
unfinished packets. `SPECKIT_SKIP_PREPUSH_TRACK_GATE=1` skips it for one push.

A packet moved, renamed or deleted by hand leaves the list stale until the
writer runs again. The gate then names the fix.

---

## 3. SOURCE FILES

| File | Role |
|------|------|
| `runtime/cli/lib/track-roots.mjs` | Reads tracks from the working tree or a commit and compares lists as sets |
| `runtime/cli/spec/refresh-track-roots.mjs` | The writer |
| `runtime/cli/spec/sweep-track-roots.mjs` | The read-only report, and the check the gate runs |
| `runtime/cli/spec/create.sh` | Runs the writer after scaffolding into a track |
| `.skilled/scripts/git-hooks/pre-push` | The track-root gate |
| `runtime/cli/tests/track-roots.vitest.ts` | Sweep and writer cases in a throwaway repository |
| `runtime/cli/tests/create-track-refresh.vitest.ts` | The `create.sh` hook-up |
| `.skilled/scripts/git-hooks/tests/pre-push.test.sh` | The gate's cases |

---

## 4. SOURCE METADATA

Introduced after a survey found 15 of 18 track roots drifted: `system-deep-loop`
listed 26 packets and held 2, `ai-systems` listed 11 and held 76. The sweep
that existed before compared counts and ran nowhere.
