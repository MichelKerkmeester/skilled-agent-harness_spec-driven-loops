---
title: "Implementation Summary"
description: "Archiving or restoring a packet now leaves it passing strict validation, because the move re-derives its recorded paths. A local trigger index build now matches CI, because it skips the files the committed ignore rules exclude."
trigger_phrases:
  - "archive current location and ignored files implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/034-spec-folder-tooling/015-archive-current-location-and-ignored-files"
    last_updated_at: "2026-10-08T01:00:00Z"
    last_updated_by: "claude-opus-5.5"
    recent_action: "Archived and restored a real packet and closed the phase"
    next_safe_action: "None, the phase is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "015-archive-current-location-and-ignored-files-close"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
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
| **Spec Folder** | 015-archive-current-location-and-ignored-files |
| **Completed** | 2026-10-08 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

An archive move no longer breaks the packet it moves. A packet records where it lives now, archived or not, and the move keeps that record true.

### Phase 15: archive-current-location-and-ignored-files

`archive.sh` hands the moved folder to `repair-derived.cjs` after every archive and every restore. That tool now walks archived packets, writes the `description.json` `specFolder` it never wrote before, and clears the parent a packet keeps after it lands directly in an archive. `upgrade-legacy --include-archive` repairs an archived packet's derived fields the same way and still never runs the steps that write document content.

The index build now skips untracked files the committed `.gitignore` files exclude. A local build had indexed 30 containment copies left by a review run, and CI's fresh checkout then rewrote the committed index.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh` | Modified | Re-derive after archive and restore |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs` | Modified | Walk archives, write `specFolder`, clear an archived packet's stale parent |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs` | Modified | Repair archived packets' derived fields only |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs` | Modified | Skip git-ignored paths |
| Four test files under `runtime/cli/tests/` | Modified | One test per change |
| `README-repair-derived.md` and the spec CLI `README.md` | Modified | Describe the new behavior |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The first archive check failed on a cause nobody had named: the graph merge keeps a stored parent when a re-derive computes none, and a packet directly in an archive always computes none. That is why phase 13's archived 042 packet needed a hand fix. The repair now clears that parent, which is what the re-derive itself derives and what archived siblings already carry.

The ignore fix first used git's standard exclude set, and its test caught a second problem: the operator's global gitignore ignores `specs/`, so every uncommitted packet would have vanished from a local build. Only the committed `.gitignore` files count now, which every machine and CI share.

Each change has a test, and the repair test was checked against the previous tool, which inspected 0 packets and left the field stale. A real track packet was archived and restored with validation at each step, then deleted. The CLI suite passed 1,639 tests with 0 failed, up from 1,636.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Current-location semantics for archived packets | The operator chose phase 14's recommendation: recorded paths are derived facts, the validator demands them and git history keeps the old path |
| Re-derive through `repair-derived.cjs` rather than inside `archive.sh` | One tool owns derived fields, so the archive move cannot drift from the repair |
| Clear an archived packet's parent rather than change the graph merge | The merge's safety rule protects lineage elsewhere, and the archived case is the one where the old parent is known stale |
| Only committed `.gitignore` files count | Global and per-clone excludes differ by machine, and one of them hid every uncommitted packet |
| Do not list ignored paths as skipped | Which ones exist depends on the machine, and the committed manifest must not |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Spec-kit CLI suite | PASS - 1,639 passed, 19 skipped, 0 failed, baseline 1,636 passed |
| Real archive and restore | PASS - RESULT: PASSED before the move, archived and restored |
| Previous repair tool on the archived fixture | Fails as expected - inspected 0 packets, `specFolder` stale |
| Trigger index rebuild | PASS - 30 untracked containment copies dropped, `--check` exit 0 |
| `archive.sh` syntax | PASS - `bash -n` and shellcheck report nothing |
| sk-code drift guards | FAIL, pre-existing - 60 errors in fixture and evidence scripts this phase does not touch, none in a changed file |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A phase parent still lists an archived phase in `children_ids`.** Its writer drops a child only through a reviewed prune, as before.
2. **The drift guard wrapper exits 1 on the current tree.** Its 60 errors sit in files outside this phase, so the wrapper cannot report clean until they are fixed.
<!-- /ANCHOR:limitations -->

---
