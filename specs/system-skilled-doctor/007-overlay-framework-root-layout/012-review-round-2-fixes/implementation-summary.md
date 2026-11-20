---
title: "Implementation Summary: Phase 12: fix the Skilled findings of the second overlay layout review"
description: "Every relayout failure now prints a line the apply workflow has a rule for, the engine contains the overlay folder setting and every layout-link path it writes through, manifest revisions follow --end-of-options, and a re-pin stage names a staged tree root status can read. Merged on local Skilled main as 7ededf2efb1."
trigger_phrases:
  - "review round 2 fixes implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skilled-doctor/007-overlay-framework-root-layout/012-review-round-2-fixes"
    last_updated_at: "2026-11-20T21:30:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Merged the second review's Skilled fixes into local main as 7ededf2efb1"
    next_safe_action: "Operator pushes Skilled main, then phase 011 re-pins Barter"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-012-review-round-2-fixes"
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

| Field | Value |
|-------|-------|
| **Spec Folder** | 012-review-round-2-fixes |
| **Completed** | 2026-11-20 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The second review's Skilled findings are fixed at their source, each with a test that fails on the engine before it. No layout-link path now lets `apply`, relayout or a re-pin write outside the vendored tree. A relayout that fails says exactly what it left behind, and a re-pin stage with a sibling overlay folder names a folder `status --root` can read.

### Phase 12: review round 2 fixes

- **Pre-commit probe under a hook `GIT_DIR`.** Already fixed by phase 009. Its linked-worktree hook test fails on the engine before `3ddeef925dd` and passes at main tip.
- **Relayout error contract.** A backup that cannot be written now moves nothing and removes its partial backup, or names it when that fails. A prune failure prints a note and the run still exits 0. The restore-failed line names the files the backup skipped, instead of counting them against `skipped` lines a credential-named source also prints.
- **Containment.** The setting check resolves an in-tree folder. It refuses one that lands outside the tree, behind a link it cannot resolve, or on the tree root itself, and names the right reason for a sibling that resolves into or around the tree. A layout-link path is refused when the disk as it stands, or the links the run will write, take it out of the tree. That covers a linked parent folder, a link nested under another planned link, chains, cycles and other spellings of the tree. The writer checks each parent again before it writes, so a case the plan cannot foresee still refuses before any unlink.
- **Git option guard.** Every manifest revision reaches git after `--end-of-options`.
- **Re-pin stage root.** This upstream item came from the ai-speckit session. With a sibling overlay folder, a stage copies the tree to `<stage>/<tree name>`, while the engine printed only `<stage>`, where `status` finds no setting file and reports `no overlay manifest`. A stage now also prints `staged tree root:`, and the JSON report carries `stagedRoot`.
- **Docs and records.** The presentation, the apply and status workflows and `references/overlays.md` quote the lines the engine prints. The custom folder value in the tests is `custom-overlays`. The phase 003 criterion, the parent's last criterion and the phase 007 and 008 summaries reproduce.
- **Barter half.** It is recorded in ai-speckit's record 039. Before phase 011's re-pin, Barter's `fanout-run.cjs` overlay must be rebased, and phase 011's spec says so.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/scripts/overlay-engine.cjs` | Modified | Relayout contract, setting and layout-link containment, write-time parent check, `--end-of-options`, staged tree root |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-fixes.test.cjs` | Modified | Setting, layout-link and git-argument tests, and the neutral folder value |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-follow-up.test.cjs` | Modified | Relayout failure and layout-link relayout tests |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-repin.test.cjs` | Modified | Staged tree root tests |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-strict-writes.test.cjs` | Modified | Outside-repository assertion matches the setting refusal |
| `.skilled/commands/doctor/assets/doctor-overlay-apply.yaml`, `doctor-overlay-status.yaml`, `doctor-overlay-presentation.txt` | Modified | Rules and rows for the new lines |
| `.skilled/skills/system-skilled-doctor/references/overlays.md` | Modified | Setting refusals, relayout contract, layout-link refusal, staged tree root |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Built on `worktrees/495-overlay-review-round-2-fixes` in nine commits:
- `b3470354ab7` relayout contract
- `8459961bbca` containment and git guard
- `9cac789e095` docs
- `709646d2e7e` linked parent folders
- `d5b258c32e8` staged tree root
- `add6e839c6f` planned links
- `b439bdaeb59` disk-or-planned check
- `93198d56023` retarget exception
- `cf932dc7382` comment

`@review` ran five passes on `95aa07427ec..HEAD`. The first four requested changes: a linked parent folder, a nested planned link, an order-blind match with a raw ELOOP, and a false refusal of a retarget. Each was fixed with a test that fails on the engine before it. The fifth approved with no P0 or P1. The branch merged into local main as `7ededf2efb1`, a `--no-ff` merge like `f2a608297c9`, and the gates were rerun there.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| A layout-link path is refused when either the disk or the planned links take it out | Following planned links alone dropped refusals the disk walk made for one entry order, so neither judgement may loosen the other |
| A dangling parent is let through only when an earlier entry names it | The run writes entries in order, so only an earlier entry can stand there first, and the planned walk still judges where the path lands |
| The stage keeps its `stage` field and line, and adds `staged tree root:` and `stagedRoot` | Readers of the existing line and field stay unchanged, and an in-tree folder's output is unchanged |
| The trigger index on main is not rebuilt | Main's `--check` already failed before the merge on eight docs other sessions own, and a rebuild would fold their work into this packet's commit |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Engine suite on merged main | 294/294 pass, exit 0 (baseline 263) |
| Guard suite, doctor overlay contract | 20/20 and 9/9, exit 0 |
| `route-validate.sh`, release-update and update contract | exit 0, 95/95 |
| Deep-loop vitest, 11 files | 341/341, exit 0 |
| New tests on the engine before each fix | Each fix's refusal tests fail there. The rollback-only and unremovable-backup relayout tests, and two escape guards, pass on both engines as regression guards |
| `@review` | Fifth pass APPROVED, no P0 or P1 |
| Barter `status --root ai-speckit/skilled` with the branch engine | `RESULT: PASSED`, exit 0, read-only |
| Trigger index `--check` on main | exit 1 before and after the merge, the same 13 stale docs. Eight belong to other sessions, and five are this phase's docs |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A layout-link path listed twice can half-apply.** When an earlier copy points out of the tree, `apply` writes it and the write-time check then refuses the nested entry with exit 2. Nothing outside the tree is written, but the outward link stays until it is removed by hand. List each layout-link path once.
2. **Raw errors that predate this branch.** A nested entry listed before its in-tree parent stops with `EPERM`, a nested entry under a link whose target folder is missing stops with `ENOENT` from `ensureSymlink`, and an `EACCES` from `lstat` is not classified. No write leaves the tree. List a parent before its nested entries, and create a link's target folder first.
3. **Two regression-guard tests.** `relayout whose rollback also fails names the backup it keeps` and `relayout that rolls back but cannot remove its backup says so` pass on the unfixed engine, because those lines already worked. They guard behavior, not the fix.
4. **Trigger index.** It stays stale on main until the sessions that own the other eight docs commit them and the index is rebuilt.
<!-- /ANCHOR:limitations -->

---
