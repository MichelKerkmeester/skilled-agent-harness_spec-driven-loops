---
title: "Implementation Summary"
description: "The command contract now names the single speckit-resume.yaml for /speckit:resume, so the router drift check exits 0 again and Spec-Kit Check stops failing on main."
trigger_phrases:
  - "resume contract owned assets implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-authoring-and-continuity/007-speckit-command-gates-step-order-drift/009-resume-contract-owned-assets"
    last_updated_at: "2026-11-14T18:05:06Z"
    last_updated_by: "generate-context"
    recent_action: "Fixed the resume owned-asset drift; drift check exits 0"
    next_safe_action: "Verify Spec-Kit Check passes on main after the push"
    packet_purpose: "Purpose: The contract names the single resume workflow, the drift check exits 0 and Spec-Kit Check passes on main."
    blockers: []
    key_files:
      - ".skilled/skills/sk-doc/sk-create-command/assets/command-contract.json"
      - ".skilled/skills/system-spec-kit/runtime/cli/codex/generate-command-routers.cjs"
    session_dedup:
      fingerprint: "sha256:4f388b121ccdf7375a1b9d6f2ee87d4d520132fec79f3ec52802412b41a9e283"
      session_id: "scaffold-009-resume-contract-owned-assets"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-resume-contract-owned-assets |
| **Completed** | 2026-11-14 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

The router drift check passes again. Spec-Kit Check had been red on main since the phase 5 merge, because the command contract still pointed `/speckit:resume` at two workflow files that no longer exist.

### Phase 9: resume-contract-owned-assets

Phase 5 merged the resume auto and confirm workflows into one `speckit-resume.yaml` and fixed the contract's execution targets. It missed the two matching `owned_assets` rows. The drift check reads those rows, expected the deleted paths in `resume.md` and exited 1. You now get one speckit `workflow` row that covers plan, implement, complete and resume, and the contract names only files on disk.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json` | Modified | Drop the two stale resume rows and add `/speckit:resume` to the speckit workflow row |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

The drift check and the typo-flags test failed first in worktree 389, cut from `d3f08a81ac`. After the edit, the drift check, the typo-flags test, CLI vitest shard 2 and the doctor contract tests ran in that order, and all passed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fix the contract, not the generator or the test | The contract was the stale producer, and the generator read it correctly |
| Keep the `auto_workflow` and `confirm_workflow` schema enum values | The create, design and deep families still use them |
| Fix in this session rather than wait for the 381 session | Operator answer on 2026-11-14: "Fix here" |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `ls logs/archive | wc -l` after `--keep 3`: 3. After a plain run: 10. Suite: PASSED. WEAK: All tests pass. -->

| Check | Result |
|-------|--------|
| `generate-command-routers.cjs --check` before the edit | FAIL as expected: `routers=42 clean=41 path-drift=1`, exit 1 |
| `generate-command-routers.cjs --check` after the edit | PASS: `routers=42 clean=42 path-drift=0 shape-drift=0`, exit 0 |
| `tests/typo-flags.vitest.ts` | PASS: 34 of 34 (was 33 passed, 1 failed) |
| CLI vitest shard 2 | PASS: 71 files passed, 1 skipped. 1135 tests passed, 8 skipped. Exit 0 |
| Doctor contract tests | PASS: 190 of 190, exit 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **CLI vitest shards 1 and 3 were not rerun locally.** They passed in CI on `d3f08a81ac`, and this change touches only the contract the drift check reads. The CI run on the pushed commit confirms all three shards.
<!-- /ANCHOR:limitations -->

---

