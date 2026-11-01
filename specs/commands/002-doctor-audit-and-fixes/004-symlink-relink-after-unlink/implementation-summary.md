---
title: "Implementation Summary"
description: "A project can now be linked again after an unlink: each symlink apply claims its own run folder, and earlier run records stay untouched."
trigger_phrases:
  - "symlink relink after unlink implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "commands/002-doctor-audit-and-fixes/004-symlink-relink-after-unlink"
    last_updated_at: "2026-11-01T09:10:00Z"
    last_updated_by: "opus-medium"
    recent_action: "Fixed the run-folder collision, red to green, whole doctor gate passing"
    next_safe_action: "Operator reviews and commits the uncommitted change"
    blockers: []
    key_files:
      - ".skilled/commands/doctor/scripts/symlink-engine.cjs"
      - ".skilled/commands/doctor/scripts/tests/symlink-engine.test.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-004-symlink-relink-after-unlink"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-symlink-relink-after-unlink |
| **Status** | Complete |
| **Completed** | 2026-11-01, uncommitted on `main` at `e586366c87` |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

You can now link a project with `/doctor:symlink`, unlink it and link it again with the same plan. Before this change the second apply stopped with `EEXIST` and wrote nothing, because the run folder it wanted was the undo record the unlink kept.

### Phase 4: symlink-relink-after-unlink

Each apply now claims a run folder no earlier run owns. The first run of a digest still gets the plain `<first 16 hex of the digest>` folder, so existing records and anything that reads them keep working. A later run of the same digest takes `<prefix>-2`, then `<prefix>-3`, and the claim is a plain `mkdir` that fails on an existing folder, so an apply never writes into, overwrites or removes an earlier record. Unlink accepts those numbered folders for the digest its manifest records, and still refuses any folder outside the runs root or named outside that sequence.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/scripts/symlink-engine.cjs` | Modified | `createRunRecord()` claims the first free folder; `runNamePattern()` names the folders a digest owns; `runUnlink()` checks against it |
| `.skilled/commands/doctor/scripts/tests/symlink-engine.test.cjs` | Modified | Relink regression test and misnamed-folder edge test |
| `.skilled/commands/doctor/symlink.md` | Modified | Step 7 states the numbered fallback |
| `.skilled/commands/doctor/assets/doctor-symlink-link.yaml` | Modified | The allowed run-record target states the numbered fallback |
| `.skilled/commands/doctor/_routes.yaml` | Modified | The link route's `gate3_location` states the real folder name |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The whole doctor gate ran first as the baseline. The relink test went in next and failed against the unmodified engine with the same `EEXIST` the orchestrator reproduced. The engine change made it pass, the edge test pinned the loosened unlink check, and the whole gate ran again from the final tree.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Number the second and later runs instead of adding a timestamp to every name | The first run keeps the exact name existing records and the playbook use, so nothing that reads a current record changes |
| Claim the folder with a non-recursive `mkdir` | It fails on an existing folder in one call, so two applies cannot share a folder and an empty folder from a crash is skipped, not reused |
| Keep every earlier record | Unlink keeps the run folder as the undo history by contract; pruning would change that contract |
| Cap the sequence at 1000 per digest | A bounded loop ends with a clear exit-2 message instead of scanning without limit |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Relink regression test | Before: `fail 1`, exit 1, `EEXIST` at `doctor-symlink/5a04d2913a6c3745/manifest.json` (`scratch/red-before-change.md`). After: `pass 1`, exit 0 |
| Engine suite | 10 pass before; 12 pass, 0 fail after (+2 new tests) |
| Contract suites | `doctor-symlink-contract` 34 pass before and after; `doctor-install-contract` 16 pass after |
| Whole doctor gate | `run-all.sh` exit 0, `7 suite(s) passed, 0 failed` before and after; node aggregate 999 pass before, 1001 pass, 0 fail after (`scratch/verification-evidence.md`) |
| Static checks | `node -c` exit 0; no `slice(0, 16)` left in the engine; no packet ids or secrets in the changed code |
| Strict packet validation | `validate.sh --strict` on this folder and on the parent: `RESULT: PASSED` for both |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Run folders accumulate.** Every apply leaves one folder under `.skilled/output/doctor-symlink/`, and nothing prunes them. Delete old folders by hand once their undo is no longer wanted.
2. **The 1000-run cap and the crash-left empty folder are not tested.** Both follow from the code (`MAX_RUNS_PER_DIGEST` and the `EEXIST` skip in `createRunRecord()`); no test drives 1000 applies or a crash between `mkdir` and the manifest write.
3. **The live Barter proof is not run here.** The fix is proven in the engine fixture; a project that vendors the framework sees it after the commit and its next re-pin.
<!-- /ANCHOR:limitations -->

---
