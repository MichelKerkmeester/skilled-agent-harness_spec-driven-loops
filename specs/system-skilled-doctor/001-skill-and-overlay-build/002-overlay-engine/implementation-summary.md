---
title: "Implementation Summary"
description: "Skilled now has one overlay engine behind /doctor:overlay status and apply, ported from Barter with six defects fixed test first."
trigger_phrases:
  - "overlay engine implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skilled-doctor/001-skill-and-overlay-build/002-overlay-engine"
    last_updated_at: "2026-11-06T08:54:35Z"
    last_updated_by: "generate-context"
    recent_action: "Built the overlay engine and /doctor:overlay status and apply; doctor suite 1051 of 1051"
    next_safe_action: "Commit phase 002, then start phase 003 repin with its tests first"
    blockers: []
    key_files:
      - ".skilled/commands/doctor/scripts/overlay-engine.cjs"
      - ".skilled/commands/doctor/overlay.md"
      - ".skilled/skills/system-skilled-doctor/references/overlays.md"
    session_dedup:
      fingerprint: "sha256:18f54b197eac57f36b0c77ab2b340c0b526731f155e1b2fd0340ff1ddbec2d6c"
      session_id: "scaffold-002-overlay-engine"
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
| **Spec Folder** | 002-overlay-engine |
| **Completed** | 2026-11-06 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A project that vendors Skilled can now check and restore its own changes with `/doctor:overlay`. `status` names every overlay that is out of sync and the fix, and `apply` puts the overlays back after showing what will change.

### Phase 2: overlay-engine

The engine merges Barter's two scripts into one standard-library file. It reads the overlay folder from one setting, plans the full check with the same accepted hashes as apply, guards a retained path the overlay also writes, owns its lock, applies one json-entry set in order, and reads a token-named file only when a manifest entry names it.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/scripts/overlay-engine.cjs` | Created | The engine |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-*.cjs` | Created | The ported tests, the fix tests and their fixtures |
| `.skilled/commands/doctor/overlay.md` and `assets/doctor-overlay-*` | Created | The command router, its two workflows and its presentation |
| `.skilled/commands/doctor/scripts/tests/doctor-overlay-contract.test.cjs` | Created | The command's contract |
| `_routes.yaml`, `command-contract.json`, the listing surfaces | Modified | The new command listed |
| The bridges, `skill_advisor.py` and the runtime mirrors | Generated | The new command routed in each runtime |
| `.skilled/skills/system-skilled-doctor/` | Modified | The overlay reference, router intent, README row and changelog |
| Ten moved commands' workflow files | Modified | Their `skill_owner` now names the new skill |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Barter's files were frozen with their SHA-256 values first. The straight port passed Barter's 21 tests before any change. Each fix test then ran against the straight port and failed, and passed after its fix. The last step ran `status` on a scratch copy of Barter's tree.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| A walked token-named file passes only when its entry lists it in `protectedPaths` | The exact-path rule refused Barter's `repo-frontend` walk, and the operator chose an exact list over an extension list (ADR-001) |
| Report lines keep their plain shape | Tests and the guard read them exactly, so only error lines carry the `[overlay-engine]` prefix (ADR-002) |
| Barter's route-guard test is not ported | It tests Barter's copy of the routing guard and never calls the engine (ADR-003) |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Engine tests | PASS, 40 of 40 |
| Doctor contract tests | PASS, 1051 of 1051, up from 1005 by the 46 new tests |
| Parity on a copy of Barter's tree | Exit 0, `in-sync=445`, `checked=118 ok=118`, copy unchanged |
| Routes, phrase reach and bridges | PASS: 30 routes, `STATUS=OK`, `"changed": []` |
| Skill package `--strict` and Hermes copies | PASS, 66 copies in sync |
| Advisor on "re-pin my vendored Skilled" | `system-skilled-doctor` first |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The overlay folder check is lexical.** A symlink inside the tree can point the folder outside it. No test covers that case.
2. **`status` does not read the lock.** It can report a tree another `apply` is still writing.
3. **"re-pin my vendored Skilled" routes to `status` for now.** It moves to `repin` when phase 003 adds that target.
<!-- /ANCHOR:limitations -->
