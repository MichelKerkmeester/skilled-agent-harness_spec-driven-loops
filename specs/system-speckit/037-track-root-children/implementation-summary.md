---
title: "Implementation Summary"
description: "Every track root now lists exactly the packets it holds. A writer sets each list from disk, create.sh --track lists a new packet as it scaffolds it, and a pre-push gate blocks a commit whose track roots disagree with its packets. Fifteen drifted track roots were refreshed."
trigger_phrases:
  - "track root children_ids"
  - "refresh-track-roots"
  - "track-root pre-push gate"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/037-track-root-children"
    last_updated_at: "2026-09-24T12:40:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Added the track-root writer and gate; refreshed 15 tracks"
    next_safe_action: "Push, then restore the new hook in the checkout"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/runtime/cli/lib/track-roots.mjs"
      - ".skilled/skills/system-spec-kit/runtime/cli/spec/sweep-track-roots.mjs"
      - ".skilled/skills/system-spec-kit/runtime/cli/spec/refresh-track-roots.mjs"
      - ".skilled/skills/system-spec-kit/runtime/cli/spec/create.sh"
      - ".skilled/scripts/git-hooks/pre-push"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-037-track-root-children"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Should anobel.com's specs/description.json, which describes app-remote-agent-chat, be rewritten?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 037-track-root-children |
| **Completed** | 2026-09-24 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Each track root now lists exactly the packets it holds, and it stays that way. A new packet is listed when you scaffold it, and a push that would publish a list that disagrees with its packets stops at the hook.

### Keep every track root's children_ids equal to its packets on disk, and block a push that breaks it

Fifteen of the eighteen track roots had drifted. `system-deep-loop` listed 26 packets and held 2, `ai-systems` listed 11 and held 76, and `anobel.com`'s file was empty. Nothing wrote these lists, and the one check compared counts and ran nowhere.

`refresh-track-roots.mjs` sets a track's `children_ids` to its numbered packet folders and touches no other field. It is dry by default and writes with `--apply`. `sweep-track-roots.mjs` now compares the list with the packets as sets, so a renamed packet is caught even when the counts agree, and `--rev <commit>` reads a commit instead of the working tree. `create.sh --track` runs the writer for its track after scaffolding. The pre-push hook sweeps each pushed commit and blocks on drift. It reads the commit rather than the shared working tree, where other sessions' unfinished packets sit.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `skills/system-spec-kit/runtime/cli/lib/track-roots.mjs` | Created | Reads tracks from the working tree or a commit and compares lists as sets |
| `skills/system-spec-kit/runtime/cli/spec/sweep-track-roots.mjs` | Modified | Set comparison, `--rev`, symlinked tracks left out of a commit |
| `skills/system-spec-kit/runtime/cli/spec/refresh-track-roots.mjs` | Created | The writer |
| `skills/system-spec-kit/runtime/cli/spec/create.sh` | Modified | `refresh_track_root` after a normal and a phase scaffold |
| `skills/system-spec-kit/runtime/cli/tests/track-roots.vitest.ts` | Created | Ten cases for the sweep and the writer |
| `skills/system-spec-kit/runtime/cli/tests/create-track-refresh.vitest.ts` | Created | Six cases for the `create.sh` hook-up |
| `scripts/git-hooks/pre-push` | Modified | The track-root gate |
| `scripts/git-hooks/tests/pre-push.test.sh` | Modified | Nine cases for the gate |
| Three READMEs and `.env.example` | Modified | The writer, the set comparison, the gate and its skip variable |
| `specs/<track>/graph-metadata.json`, 13 tracks | Modified | `children_ids` set to the packets on disk |

Paths are under `.skilled/` unless stated otherwise. The two linked track roots, `ai-systems` and `anobel.com`, were refreshed too. Neither repository tracks its spec folder in git, so those two changes exist only on this machine.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The drift was surveyed first, track by track, against the packets on disk. The tests came next and ran red, 8 of 10. The fixture's own commits then failed for an unrelated reason: the machine's global ignore file lists `/specs`, so `git add -A` staged nothing, and the fixture now sets `core.excludesFile=/dev/null`. Each guarded rule was then removed on purpose, one at a time. One removal survived, the rule that only folders count as packets, so a file named like a packet was added to the fixture, and that removal now fails three cases.

The gate first warned when its sweep was missing. The hooks README requires a blocking gate with a missing script to block where the toolchain ships, as the route guard does, so it now blocks and names its skip variable. The global pre-push hook is a symlink to this checkout's working-tree file, which made the uncommitted gate live for every push from this repository while `origin` still held the drifted tracks. The working-tree hook was put back to its committed version until the push, and the new version is committed from a saved copy.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Auto-refresh in `create.sh`, then block at push | The operator's call. Drift then fails a push instead of accumulating |
| Refresh all fifteen, the two linked ones included | The operator's call |
| Compare sets, not counts | A renamed packet leaves both counts equal |
| The gate reads the pushed commit | The shared working tree holds other sessions' unfinished packets, which are not being pushed |
| Only numbered real folders are packets, so `z_archive` entries leave three lists | The packet deriver uses the same rule, and a commit holds a linked packet as a link, not a folder, so both views count the same packets |
| Unreadable metadata is reported and left alone | Rewriting one field of a record that cannot be read means inventing the rest of it |
| Write `anobel.com`'s record by hand from cli-jev's shape | The file was empty, and the writer only changes `children_ids` of a record it can read |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `track-roots.vitest.ts` | PASS, 10 tests. 8 failed before the scripts existed |
| `create-track-refresh.vitest.ts` | PASS, 6 tests |
| `pre-push.test.sh` | PASS=41 FAIL=0, up from 32 |
| Mutations | 8 on the module and scripts, 4 on `create.sh` and 6 on the gate, each failing its suite, each file restored and compared byte for byte |
| Sweep of the real `specs/` | Exit 0, all 18 track roots match. Before the refresh: 15 drifted |
| The 13 refreshed files and `ai-systems` | Every field but `children_ids`, the key order and the two-space format unchanged |
| Sweep of one commit with `--rev` | About 0.7 s with a test suite running beside it |
| `cli` vitest project | PASS, 1488 tests and 19 declared skips, 16 more than before this packet |
| `npm run test:legacy` in `runtime/cli` | PASS, 27 of 27 |
| `npm run test:validation` in `runtime/cli` | PASS, exit 0 |
| Strict validation of this packet | PASS, 0 errors and 0 warnings |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The gate starts only once the shared checkout's working tree holds the new hook.** The global pre-push hook is a symlink to that file. Put the committed version in place after the push.
2. **In the shared checkout, the writer lists every packet on disk, another session's unfinished one included.** A commit of that track file without the packet is blocked. Commit each track file with the packets it lists.
3. **The linked tracks are refreshed but not gated.** Their repositories do not track their spec folders, so there is no commit to check. `create.sh --track` still keeps them current.
4. **A context save appends its packet to the track list unsorted.** The list still matches as a set, and the next refresh sorts it.
5. **`anobel.com`'s `description.json` describes `app-remote-agent-chat`.** It waits on the operator's answer.
<!-- /ANCHOR:limitations -->

---
