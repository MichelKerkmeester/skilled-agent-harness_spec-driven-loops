---
title: "Implementation Summary"
description: "archive.sh now archives a phase into its parent's own z_archive and restores it back into the parent. One rule covers every case, the z_archive beside the folder, and archives only count beside packet folders, so research copies of a specs tree never show up."
trigger_phrases:
  - "phase-aware archive"
  - "archive a phase"
  - "packet home"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/039-phase-aware-archive"
    last_updated_at: "2026-09-24T15:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Made archive.sh archive phases beside their parent, with 16 cases and 20 mutation runs"
    next_safe_action: "Commit, build the push candidate and ask before pushing"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh"
      - ".skilled/skills/system-spec-kit/runtime/cli/tests/archive-track.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-039-phase-aware-archive"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The phase parent's children_ids is left alone; the script names the reviewed prune"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 039-phase-aware-archive |
| **Completed** | 2026-09-24 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

You can now archive a single phase with `archive.sh`, and it stays with its packet. It goes into the parent's own `z_archive/`, and a restore puts it back into the parent.

### Archive a phase into its parent's own z_archive and restore it back into the parent, leaving the parent's phase list to the reviewed prune

Before this, a phase went to the root `specs/z_archive/`, where nothing showed which packet it came from and same-numbered phases from different packets collided. A restore left it loose at the specs root. The repository keeps archived phases in the parent's own `z_archive/`, and `is-phase-parent.ts` tells you to.

One rule now covers every case: a folder goes into the `z_archive/` beside it, and a restore returns it to the place that archive belongs to. Archives only count beside a packet home: the specs root, a track, or a packet or phase reached through numbered folders. That keeps out the `z_archive/` folders inside research copies of a whole specs tree, which a plain search of this repository finds by the dozen. `--list` walks packet folders instead of searching, so it shows the 4 archived entries in `026-graph-and-context-optimization` beside the 268 in tracks and none of the copies.

The parent's `children_ids` and its phase table are left as they are. Its writer only adds children and drops one through a reviewed prune, no check reports an archived phase that is still listed, and a restore then finds it listed. The script prints the prune command after archiving a phase whose parent has a `graph-metadata.json`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `skills/system-spec-kit/runtime/cli/spec/archive.sh` | Modified | The archive beside the folder, packet homes, the list walk, the phase note and the help text |
| `skills/system-spec-kit/runtime/cli/tests/archive-track.vitest.ts` | Modified | Seven new cases and three new guard assertions, 16 in all |
| `skills/system-spec-kit/runtime/cli/spec/README.md` | Modified | The `archive.sh` row |
| `skills/system-spec-kit/feature-catalog/tooling-and-scripts/spec-lifecycle-automation.md` | Modified | The archival paragraph |
| `skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/spec-lifecycle-automation.md` | Modified | The recorded `--help` output |
| `specs/system-speckit/038-track-aware-archive/implementation-summary.md` | Modified | Its phase limitation now points here |

Paths are under `.skilled/` unless stated otherwise.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A phase was first archived by hand in a scratch copy of the tree, to see what the parent's checks make of it: no validation rule changed, and the phase-map sync skipped the archived phase. That, and the writer's reviewed-prune rule, led to the operator's call to leave the parent's list alone.

The four phase cases ran red, 4 of 13, and passed once the archive moved beside the folder. The first `--list` on this repository then showed 381 entries where 272 were expected. A search for every `z_archive/` had found copies of whole specs trees kept under research and review folders, and restore would have accepted them as well. Archives now count only beside a packet home, the same check guards archive, restore and the list, and cases cover the copy, an archive inside an archived packet and a linked folder. Those cases were written after the fix, so each guard was removed on purpose to prove they catch it: all 20 removals fail the suite.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| One rule: the `z_archive/` beside the folder | It is where the repository already keeps root, track and phase archives, and it needs no case per kind |
| Leave the phase parent's `children_ids` alone | The operator's call. Its writer drops a child only through a reviewed prune, and a round trip leaves the list right |
| Leave the phase table alone | It is authored, no check reports an archived phase's row, and the status sync skips it |
| Archives only count beside a packet home | Research folders hold copies of whole specs trees, archives included |
| Walk packet folders for `--list` | The walk follows the same rule restore checks, and takes 1.3 seconds instead of 6 |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `archive-track.vitest.ts` | PASS, 16 of 16 |
| Mutation runs | PASS, 20 of 20 removals fail the suite |
| `test-phase-validation.js` | PASS, 51 passed, 0 failed |
| `archive.sh --list` on this repository, read-only | PASS, 272 entries: 268 in tracks and 4 in `026-graph-and-context-optimization`, no research copies |
| `validate_document.py` on the three changed docs | PASS, 0 issues each |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **An archived phase stays in its parent's `children_ids`.** That is the writer's rule, not an oversight. Run `backfill-graph-metadata.js <parent> --prune-report`, review it, then `--prune --prune-confirm <hash>` to drop it.
2. **Symlinked tracks stay out of reach**, as in packet 038. Archive in those repositories by hand.
<!-- /ANCHOR:limitations -->

---
