---
title: "Implementation Summary: Phase 4: doctor-symlink-gaps"
description: "The doctor symlink engine now records why a host-relative alias stays out of the ignore file and pins that behavior with a node test; the doctor docs and the 044 limitations name that a whole-linked .skilled reads the checkout's specs folder."
trigger_phrases:
  - "doctor symlink gaps summary"
  - "host-relative alias ignore decision"
  - "whole-linked skilled specs limit"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/044-named-subtracks-and-host-repos/004-doctor-symlink-gaps"
    last_updated_at: "2026-11-07T22:10:00Z"
    last_updated_by: "deepseek-v4.1-flash"
    recent_action: "Implemented both P2 fixes and reran the doctor suite and validation"
    next_safe_action: "None for this phase; the parent closes after its remaining phases"
    blockers: []
    key_files:
      - ".skilled/commands/doctor/scripts/symlink-engine.cjs"
      - ".skilled/commands/doctor/scripts/tests/symlink-engine.test.cjs"
      - ".skilled/commands/doctor/assets/doctor-symlink-presentation.txt"
      - ".skilled/commands/doctor/symlink.md"
      - "specs/system-speckit/044-named-subtracks-and-host-repos/implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "004-doctor-symlink-gaps"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-doctor-symlink-gaps |
| **Completed** | 2026-11-07 |
| **Level** | 1 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A reader of the doctor engine now finds, at the branch itself, why a host-relative alias is treated differently from the machine-local links around it, and a node case fails if that difference changes. The doctor docs and the 044 limitations also say plainly that a whole-linked `.skilled` reads the checkout's `specs/`, not the host's.

### Host-relative alias ignore decision

The host-relative branch of `planMergeTree` pushes its link without adding the path to the ignore candidates. The two branches below it add their machine-local absolute links, because those carry this machine's path into every clone. The alias text is relative and portable, so a host may want it committed. The branch now says that in a comment, and a new test plans a host with a `specs/` folder and asserts that `/.skilled/specs` is absent from the plan's `ignore-add` line while `/.skilled/agents` is present, which proves the ignore bookkeeping ran.

### Whole-link specs limit

The presentation contract's `linked-whole` row and the `--mode` row of `symlink.md` now state that a whole-linked `.skilled` resolves `.skilled/specs` to the checkout's `specs/`. The 044 Known Limitations item about the `.skilled/` shape carries the same consequence and names `--mode merge` as the shape that keeps the host's own `specs/` reachable. No engine behavior changed for an existing whole-link install.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/scripts/symlink-engine.cjs` | Modified | Comment at the host-relative branch records why the alias is not ignored |
| `.skilled/commands/doctor/scripts/tests/symlink-engine.test.cjs` | Modified | Ignore-list helper and one case that pins the alias out of the ignore bookkeeping |
| `.skilled/commands/doctor/assets/doctor-symlink-presentation.txt` | Modified | `linked-whole` row names the whole-link `specs/` consequence |
| `.skilled/commands/doctor/symlink.md` | Modified | `--mode` row names the consequence and points to `merge` |
| `specs/system-speckit/044-named-subtracks-and-host-repos/implementation-summary.md` | Modified | Known Limitations item for the whole-link shape states the `specs/` consequence |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The baseline came first at HEAD `230d22ba88`: the two doctor test files passed 50/50 (16 engine, 34 contract), the packet vitest set passed 178/178 across 10 files, and `validate.sh --strict` printed `RESULT: PASSED`. The baseline is recorded in `scratch/baseline.txt`.

The chosen Option B is a characterization test, so it cannot fail first: it pins behavior that is already correct. To keep the red-first discipline meaningful, `scratch/red-host-relative-ignore.log` holds a negative control, the same case written with the Option A expectation. It failed on the unchanged engine with `false !== true`, and its plan line shows `/.skilled/specs` missing from `ignore-add`, which proves the assertion reads the real ignore list. The chosen assertion then passed on the unchanged engine at 17/17 (`scratch/green-before-comment.log`), the comment landed, and the file passed again at 17/17 (`scratch/green-host-relative-ignore.log`).

The doc rows were checked by grep (`scratch/doc-rows.log`, `scratch/limitation-row.log`). The final doctor run is `scratch/doctor-suite.log`. The packet vitest suite also ran from the final state and passed 182/182 across 10 files; the 4 cases above the 178 baseline belong to the in-flight phase 001 work in the same shared worktree, not to this phase.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Leave the host-relative alias out of the ignore file and document it | The text is relative and portable, so the host may want it committed, unlike the machine-local absolute links that the later branches ignore. The operator chose the recommended Option B on 2026-11-07. |
| Document the whole-link limit and change no engine behavior | An existing whole-link install is left alone by design, and a check note would grow the report contract for a case the docs can cover. The operator chose the recommended answer on 2026-11-07. |
| Build the test on a git work tree | Ignore entries are only computed for a git work tree, so a non-git fixture would pass for the wrong reason. The git fixture plus the `/.skilled/agents` assertion proves the ignore list ran. |
| Use an inverted expectation as the red-first control | A test for unchanged behavior passes before and after the comment, so the red run has to come from the opposite expectation; that is the only way to show the assertion discriminates. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npm run build` under `runtime/` | Exit 0; `tsc --build` and `finalize-dist.mjs` completed |
| Packet vitest set, 10 files | 182/182 pass, 0 failed, exit 0; baseline 178/178. The extra 4 cases are phase 001's in the shared worktree; `scratch/vitest-suite.log` |
| Doctor node tests, two required files | 51/51 pass (baseline 50/50 plus the one new case); exit 0 |
| Doctor mirror check | 13/13 pass; exit 0 |
| Combined doctor run | 64/64 pass, 0 fail; `scratch/doctor-suite.log` |
| `validate.sh` on this phase, `--strict` | `RESULT: PASSED` |
| `quality-gate.cjs` on the two changed JavaScript files | `NO_BLOCKER_FOUND`; 0 P0, 0 P1, 0 P2, no unverified checks |
| `run-all-drift-guards.sh` | All 4 guards PASSED; 11 non-blocking warnings, none in a changed file |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The alias stays visible to git.** A host that wants `/.skilled/specs` ignored must add the line itself. The engine deliberately leaves the relative alias out because a host may want it committed.
2. **The new test pins the ignore list, not the comment.** It fails if the alias starts being ignored; it cannot fail if the comment is reworded or removed. The comment is the record a reader finds at the branch.
3. **A whole-linked `.skilled` still reads the checkout's `specs/`.** This phase documents the limit and does not change resolution. Relink with `--mode merge` when the host's own `specs/` must be reachable.
<!-- /ANCHOR:limitations -->

---
