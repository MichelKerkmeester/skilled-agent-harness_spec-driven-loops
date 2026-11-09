---
title: "Track-root children lists"
description: "Keeps each track root's `children_ids` equal to the packets the track holds, and blocks a push whose list disagrees."
trigger_phrases:
  - "track root children_ids"
  - "refresh-track-roots"
  - "sweep-track-roots"
  - "track-root pre-push gate"
version: 2.0.6.0
---

# Track-root children lists

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
packet, a numbered folder without a `spec.md`, an archive folder and an entry
under an earlier identity are not packets. A declared sub-track with missing `graph-metadata.json` is reported as
a pending creation in a dry run; `--apply` seeds its track-root record before
updating `children_ids`. The writer refuses a `graph-metadata.json` symlink and
leaves it unchanged. Empty or unreadable metadata is also left alone and exits
with status 2.

`sweep-track-roots.mjs` reports. It compares the list with the packets as sets,
because a packet renamed on disk leaves both counts equal. With `--rev <commit>`
it reads that commit instead of the working tree, and leaves out a symlinked
track, whose files live in another repository. A packet named more than once is
drift even though the set is unchanged: the sweep names it and the writer
removes the repeat.

A declared sub-track is a container one level below a track: its
`"level": "sub-track"` description makes it a track root in miniature, with the
identity `<track>/<sub>`. The reader returns it after its track, the writer
refreshes its `children_ids` and the track's in one pass, and the sweep reports
its packets at the same depth as a flat track's. A non-numbered folder without
the declaration is reported once and never promoted, and a symlinked sub-track
is skipped with a diagnostic in both views. These diagnostics are advisory to
the sweep and do not change its exit code. `create.sh` uses the same diagnostic
to explain a refusal, then exits with status 1.

`create.sh --track` scaffolds under a track or one declared sub-track, then
refreshes that root and, for a sub-track, its parent. A declared sub-track with
missing metadata is seeded by the refresh. A flat track without
`graph-metadata.json` remains unrefreshed. If the parent track has no graph metadata,
creation proceeds without refreshing. It exits with status 1 for absolute paths,
`.`, `..` or empty segments, and for undeclared or symlinked sub-tracks, declared
folders containing `spec.md`, or values with more than two path segments. The
check reads the value as written and never resolves it, so a one-level track
that is a deliberate symlink to another tree still works. The pre-push hook sweeps
each pushed commit with `--rev` and blocks on drift. It reads the commit rather
than the working tree, because a shared checkout holds other sessions'
unfinished packets. `SPECKIT_SKIP_PREPUSH_TRACK_GATE=1` skips it for one push.

`archive.sh` moves a track packet into the track's own `z_archive/` and
restores it to the track, and runs the writer for that track after both moves.

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
| `runtime/cli/spec/archive.sh` | Runs the writer after archiving or restoring a track packet |
| `.skilled/scripts/git-hooks/pre-push` | The track-root gate |
| `runtime/cli/tests/track-roots.vitest.ts` | Sweep and writer cases in a throwaway repository |
| `runtime/cli/tests/create-track-refresh.vitest.ts` | The `create.sh` hook-up |
| `runtime/cli/tests/archive-track.vitest.ts` | Archive and restore inside a track |
| `runtime/cli/tests/fixtures/subtrack-tree.mjs` | The shared sub-track tree every sub-track suite builds on |
| `runtime/cli/tests/validate-subtrack.vitest.ts` | Recursive validation through a declared sub-track |
| `.skilled/scripts/git-hooks/tests/pre-push.test.sh` | The gate's cases |

---

## 4. SOURCE METADATA

Introduced after a survey found 15 of 18 track roots drifted: `system-deep-loop`
listed 26 packets and held 2, `ai-systems` listed 11 and held 76. The sweep
that existed before compared counts and ran nowhere.
