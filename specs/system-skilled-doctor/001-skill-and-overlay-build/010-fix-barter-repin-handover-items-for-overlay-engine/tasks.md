---
title: "Tasks: Phase 10: fix-barter-repin-handover-items-for-overlay-engine"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "fix barter repin handover items for overlay engine tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 10: fix-barter-repin-handover-items-for-overlay-engine

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`E` is `.skilled/commands/doctor/scripts/overlay-engine.cjs`. `T` is `.skilled/commands/doctor/scripts/tests`. `R` is `$T/overlay-engine-repin.test.cjs`. `S` is `$T/overlay-engine-sync.test.cjs`. Each implementation task was one brief in `scratch/dispatch/`, run by DeepSeek v4.1 flash at max thinking through the Mistral Vibe CLI. Its outcome record is `scratch/vibe-runs/<number>/export.json`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Capture the engine test baseline before any change (`$T`). Verify: `node --test $T` prints `pass 1170` and `fail 0`. Evidence: it printed `tests 1170`, `pass 1170`, `fail 0`.
- [x] T002 Check whether item 4 needs an engine change (`$R`). Verify: `rg -n 'doesNotMatch.*unowned .*codex.*hooks' $R` prints one line. Evidence: the existing test `an unowned file edited in place refuses the repin, names the path and writes nothing` asserts no `unowned` line for `.codex/hooks.json`, a listed regenerate output that differs from the old pin. No engine change.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Skip the own-copy check in `unownedDrift` for a path below a link on the delete list, with a test for the link replaced by a folder and one for a project link that still refuses (`$E`). Verify: `node --test $R` prints `fail 0`. Evidence: brief 01. Before the fix the two tests printed `pass 1`, `fail 1` with `holds its own copy`. After it, `pass 24`, `fail 0`.
- [x] T004 Mark a file a `directory` overlay's copy lacks as the overlay's own delete in `planDirectoryOverlay`, with a test for an upstream addition and a hand-added file (`$E`). Verify: `node --test $R` prints `fail 0`. Evidence: brief 02. Before the fix the test failed with `blocked owned-dir: live-edited`. After it, the three files `$R`, `$S` and `overlay-engine-fixes.test.cjs` printed `pass 63`, `fail 0`.
- [x] T005 End a stage that is not clean with `RESULT: BLOCKED` (`$E`). Verify: `rg -c "'BLOCKED'" $E` prints 1. Evidence: brief 03. The existing test for a blocked stage now asserts `RESULT: BLOCKED`. The four clean-stage tests still assert `RESULT: STAGED` and pass.
- [x] T006 Add `isRebasedOntoPin` and read an entry's `rebasedOnto` in `classifyDestination`, with a test for no value, another commit and the new pin (`$E`). Verify: `node --test $R $S` prints `fail 0`. Evidence: brief 04. Before the fix the test failed at the live run. After it, `pass 46`, `fail 0`.
- [x] T007 Let a `json-entry` `set` add a missing last key in `planOperation`, with a test for the added key and a missing parent (`$E`). Verify: `node --test $S` prints `fail 0`. Evidence: brief 05. Before the fix the test failed with `missing key "mirrors"`.
- [x] T008 [P] Document the link replaced by a folder, `rebasedOnto`, the stage result and the regenerate `outputs` list (`.skilled/skills/system-skilled-doctor/references/overlays.md`). Verify: `rg -c 'rebasedOnto|RESULT: BLOCKED|lists it under' .skilled/skills/system-skilled-doctor/references/overlays.md` prints 3. Evidence: brief 06 printed 3.
- [x] T009 [P] State what `vocabularyMirrors` means for a host hub (`.skilled/skills/sk-code/README.md`). Verify: `rg -c 'removes that surface from the list' .skilled/skills/sk-code/README.md` prints 1. Evidence: brief 07 printed 1.
- [x] T010 [P] Name the history lookup package's build step (`INSTALL-SKILLED.md`). Verify: `rg -n 'session-handover/history' INSTALL-SKILLED.md` prints one line. Evidence: brief 07 printed one line, and the command itself exited 0 with `dist/cli.js` in place.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Rerun the whole engine test folder from the final state (`$T`). Verify: `node --test $T` prints `pass 1175` and `fail 0`. Evidence: it printed `tests 1175`, `pass 1175`, `fail 0`. That is the 1170 baseline plus the five new tests.
- [x] T012 Run the setup check the engine's documents sit under (`.skilled/commands/doctor/scripts/sk-code-setup-check.cjs`). Verify: `node .skilled/commands/doctor/scripts/sk-code-setup-check.cjs` ends `STATUS=OK`. Evidence: nine `PASS` lines and `STATUS=OK legs=9`, exit 0.
- [x] T013 Write what Barter does after the fixes ship (`handover-to-barter.md`). Verify: `rg -c 'settle-owned|council-path' handover-to-barter.md` prints 1 or more. Evidence: the file names both scripts, `rebasedOnto` and the `outputs` entry.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: the orchestrating session read the whole engine diff against the seven briefs and found no line outside them
- [x] `handover-to-barter.md` exists in this folder and names each workaround Barter drops
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Source handover**: See `handover-from-barter.md`
- **Second handover, recorded and not built**: See `handover-from-barter-024.md`
- **Answer to Barter**: See `handover-to-barter.md`
<!-- /ANCHOR:cross-refs -->

---
