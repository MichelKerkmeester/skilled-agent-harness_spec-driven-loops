---
title: "Implementation Summary"
description: "/doctor:overlay repin moves a vendored Skilled copy to a newer upstream commit in one guarded run, with a staged preview and a byte-exact rollback."
trigger_phrases:
  - "repin implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skilled-doctor/001-skill-and-overlay-build/003-repin"
    last_updated_at: "2026-11-06T09:30:27Z"
    last_updated_by: "generate-context"
    recent_action: "Built repin, --stage and --rollback; doctor suite 1067 of 1067"
    next_safe_action: "Commit phase 003, then build the phase 004 guard hook test first"
    blockers: []
    key_files:
      - ".skilled/commands/doctor/scripts/overlay-engine.cjs"
      - ".skilled/commands/doctor/assets/doctor-overlay-repin.yaml"
      - ".skilled/commands/doctor/scripts/tests/overlay-engine-repin.test.cjs"
    session_dedup:
      fingerprint: "sha256:8e3a83a91fafc51729874c16bad111bbf7f8b30b73a1a0d4d634e9974de9a3e2"
      session_id: "scaffold-003-repin"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-repin |
| **Completed** | 2026-11-06 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A project that vendors Skilled can now move to a newer upstream commit with one command and undo it. `/doctor:overlay repin` shows a staged result first, then backs up every path it will touch, copies, re-applies the overlays and checks.

### Phase 3: repin

The engine computes one set of touched paths from the two commits, refuses an in-place edit the copy would revert, and keeps a backup per run. `--stage` runs the same steps on a copy, and `--rollback` restores a run's backup byte for byte.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/scripts/overlay-engine.cjs` | Modified | The `repin` target and the classifier fix |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-repin.test.cjs` | Created | 14 tests against a temporary upstream repository |
| `.skilled/commands/doctor/assets/doctor-overlay-repin.yaml` | Created | The repin workflow |
| `overlay.md`, `_routes.yaml`, the presentation and the contract test | Modified | The `repin` route |
| The bridges, the scoring list, the listing surfaces and the mirrors | Modified, Generated | The new route listed and routed |
| `.skilled/skills/system-skilled-doctor/` | Modified | The re-pin steps, the README row and FAQ, and the v1.2.0.0 changelog |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The engine's command-line contract was fixed first, so the engine and the command files were built side by side. The 13 repin tests all failed on phase 002's engine before the target existed. A fourteenth test, for the `.env` refusal, was checked by removing the refusal from a copy of the engine, where it failed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Pinned upstream bytes read `overlay-edited` after a moved pin | Otherwise no re-pin could apply cleanly over the copied runtime folders (ADR-001) |
| The backup also holds the manifest and the state | A rollback would otherwise keep the new pin (ADR-002) |
| The backup copies token-named files and refuses `.env` | A byte-exact rollback needs every overwritten file (ADR-003) |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Repin tests | PASS, 14 of 14 |
| Doctor contract tests | PASS, `fail 0`, `skipped 0` |
| Stage on a copy of Barter's tree | Refused before any write, 19 unowned paths named, copy unchanged |
| `status` on the same copy | Exit 0, `in-sync=445`, unchanged by the classifier fix |
| Routes, phrase reach and bridges | PASS: 31 routes, `STATUS=OK`, `"changed": []` |
| Skill package `--strict` and Hermes copies | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Barter's tree cannot re-pin live yet.** Its manifest needs `repin.exclude` for `.opencode/scripts`, and its Hermes copies and trigger index declared as regenerate outputs. A stage with those added reported two blocked overlays to rebase.
2. **A directory overlay whose files upstream changed always blocks,** because that scope has no pinned hash to compare with.
3. **Untested:** `--json` output for a live run, a stage or a rollback; upstreams with sha256 object ids, `export-subst` attributes or submodules; and rollback through layout links.
<!-- /ANCHOR:limitations -->
