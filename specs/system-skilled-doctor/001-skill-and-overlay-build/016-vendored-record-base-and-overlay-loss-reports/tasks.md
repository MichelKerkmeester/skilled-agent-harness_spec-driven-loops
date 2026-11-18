---
title: "Tasks: Record-base in a vendored layout and overlay-engine loss reports"
description: "Ordered tasks for the record-base and overlay-loss fixes. Each completed task names the command or the work-record line, that evidences it."
trigger_phrases:
  - "vendored record base and overlay loss reports tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Record-base in a vendored layout and overlay-engine loss reports

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

Shell variables used in this list:
- `R` is `.skilled/commands/doctor/`.
- `P` is `specs/system-skilled-doctor/001-skill-and-overlay-build/016-vendored-record-base-and-overlay-loss-reports/`.

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Scaffold the Level 2 packet (`P`). Verify: `ls P` lists `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `implementation-summary.md` and `scratch`.
- [x] T002 Split the report by packet: fixes 1 and 2 here, fixes 3 to 6 in packet 011 (`P/scratch/request-from-vendoring-project.md`). Verify: `grep -c '^## Fix' P/scratch/request-from-vendoring-project.md` prints 6.
- [x] T003 [P] Read the work record for the recorded evidence behind each item (`P/scratch/work-record.md`). Verify: `grep -n '^## ' P/scratch/work-record.md` prints the Fix 1 and Fix 2 headings and the independent rerun heading.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Choose the `--repo` root from a real `.skilled` directory or from a symlink that passes the three checks (`R/scripts/release-update.cjs`, `resolveRepo`). Verify: `grep -n 'resolveRepo' R/scripts/release-update.cjs` prints the definition and its call. Test receipt: work record, line 15.
- [x] T005 Read the project's own HEAD with `headFilesAt()` at three call sites and anchor the `releaseRenames` pathspec with `:(top)` (`R/scripts/release-update.cjs`). Verify: `grep -n 'headFilesAt\|:(top)' R/scripts/release-update.cjs` prints five lines: one definition, three call sites and one `:(top)` pathspec.
- [x] T006 Add `record-base --pin <full-sha>`, with a local-then-fetch resolve, the `recordRevision()` read and the downgrade guard (`R/scripts/release-update.cjs`). Verify: `grep -n '{ commit, tree }' R/scripts/release-update.cjs` prints the pinned record line. Test receipt: work record, line 15.
- [x] T007 Name each upstream change a json-entry `set` or `setKeyOnItem` writes over, before the copy (`R/scripts/overlay-engine.cjs`, `jsonEntryLosses`, `upstreamLosses`). Verify: `grep -n 'jsonEntryLosses\|upstreamLosses' R/scripts/overlay-engine.cjs` prints the definitions and the call that reports them.
- [x] T008 Name each upstream-added file a directory overlay or a skill-root `replace` folder removes (`R/scripts/overlay-engine.cjs`, `removedUpstreamChanges`). Verify: `grep -n 'removedUpstreamChanges' R/scripts/overlay-engine.cjs` prints the definition and its two calls.
- [x] T009 Warn on a missing `before` anchor and extend the numeric-path warning to every operation kind (`R/scripts/overlay-engine.cjs`). Verify: `grep -n 'array index\|no identityKey' R/scripts/overlay-engine.cjs` prints the array-index and identityKey warning sites.
- [x] T010 Record the keys that `setKeyOnItem` and `insertObjectKeys` write and restore a dropped key or refuse (`R/scripts/overlay-engine.cjs`, `restoreDroppedKeys`). Verify: `grep -n 'restoreDroppedKeys' R/scripts/overlay-engine.cjs` prints the definition and the apply call.
- [x] T011 Document `--pin` in the command doc and its assets (`R/update.md`, `R/assets/doctor-update-record-base.yaml`, `R/assets/doctor-update-presentation.txt`). Verify: `grep -n -- '--pin' R/update.md R/assets/doctor-update-record-base.yaml R/assets/doctor-update-presentation.txt` prints the record-base lines.
- [x] T012 Name the `upstream-lost` and anchor NOTE lines in the overlay assets and `overlays.md` (`R/assets/doctor-overlay-repin.yaml`, `R/assets/doctor-overlay-presentation.txt`, `R/assets/doctor-overlay-status.yaml`, `.skilled/skills/system-skilled-doctor/references/overlays.md`). Verify: `grep -l 'upstream-lost' R/assets/doctor-overlay-repin.yaml R/assets/doctor-overlay-presentation.txt .skilled/skills/system-skilled-doctor/references/overlays.md` lists three files and `grep -n 'NOTE' R/assets/doctor-overlay-status.yaml` prints the NOTE text.
- [x] T013 Add the release-update cases, the re-pin cases and the status and apply cases (`R/scripts/tests/release-update.test.cjs`, `R/scripts/tests/overlay-engine-repin.test.cjs`, `R/scripts/tests/overlay-engine-sync.test.cjs`). Verify: `git diff -- R/scripts/tests/release-update.test.cjs` adds four `test(` cases, as the work record, line 15, lists.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Run `node --check` on both engine scripts (`R/scripts/release-update.cjs`, `R/scripts/overlay-engine.cjs`). Verify: each `node --check` call exits 0.
- [x] T015 Run the release-update suite before and after the change (`R/scripts/tests/release-update.test.cjs`). Verify: work record, line 15, records 77 of 77 before and 81 of 81 after, exit 0. Recorded, not re-run for this packet.
- [x] T016 Run the overlay suites before and after and the fail-before proof against a pristine engine copy (`R/scripts/tests/overlay-engine-*.test.cjs`). Verify: work record, line 27, records 195 of 195 before, 206 after with exit 0 and 12 failures on the pristine copy (sync 9, repin 3). Recorded, not re-run for this packet.
- [x] T017 Run the contract, compat and agents-md suites (`R/scripts/tests/`). Verify: work record, line 15, records contract 12 of 12, compat 30 of 30 and agents-md contract 39 of 39, before and after. Recorded, not re-run for this packet.
- [x] T018 Run the independent rerun over the named suites with `node --test`. Verify: work record, line 33, records 368 tests, 368 pass, 0 fail, exit 0. Recorded, not re-run for this packet.
- [x] T019 Run `validate.sh --strict` on the packet until it prints `RESULT: PASSED`. Verify: the last run prints `RESULT: PASSED`. Evidence: it printed `Errors: 0  Warnings: 0` and `RESULT: PASSED` on 2026-11-18 after the continuity save.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- N/A: manual verification. The work record names no manual run and the vendored layout is covered by the release-update test (T013).
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

A row with no receipt stays `[ ]` and says `Open:` with what is missing. A row the work record does not cover says `N/A:` with the reason.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: spec.md section 4 holds REQ-001 to REQ-011. Verify: `grep -c '^| REQ-0' P/spec.md` prints 11.
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: plan.md section 4 names the three phases on one line. Verify: `grep -n '^## 4' P/plan.md` prints one line.
- [x] CHK-003 [P1] Dependencies identified and listed in plan.md section 6. Evidence: the table names git, Node.js and the overlay state file.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `node --check` passes on both engine scripts. Evidence: T014, observed in this packet.
- [x] CHK-011 [P0] No stray console output. Evidence: the diff of both engines adds 2 `console.log` lines, and both are the engine's report lines (`NOTE` and `upstream-lost`), which the repin and status workflows read.
- [x] CHK-012 [P1] Error handling implemented: a `--pin` value that is not 40 or 64 lowercase hex or that comes with `--release`, exits 2 and a dropped key is refused without a readable pin (work record, lines 13 and 25).
- [ ] CHK-013 [P1] Open: the work record gives the `--pin` name and the `{ commit, tree }` record reasons (lines 13 and 14), but no separate pattern review is recorded.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: every row in acceptance-criteria.md is Met. Verify: `grep -c '| Met |' P/acceptance-criteria.md` prints 11.
- [x] CHK-021 [P0] Manual run on a real vendored tree. Evidence: `overlay-engine.cjs status --root skilled` from the vendoring project's checkout, read-only, on main and on this worktree. Main printed 6 `keeps no record` NOTE lines, and this worktree printed none of them and 1 array-index NOTE. Both printed `checked=100 ok=100 miss=0` and `RESULT: PASSED`, and that checkout's `git status` was identical before and after (`scratch/work-record.md`, manual run).
- [x] CHK-022 [P1] Edge cases tested: a symlink that leaves the work tree or names another folder is refused and a normal checkout still resolves to the git top level (work record, line 15).
- [ ] CHK-023 [P1] Open: the work record describes the exit-2 and refusal behavior (lines 13 and 25), but names no test that covers it.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each finding has a class. Evidence: the fix 1 root choice is `instance-only` (one producer, see CHK-FIX-002), and the pin form is `cross-consumer` (`base.json` is read by check, align and apply). Fixes 2a, 2b, 2c and 2d are `class-of-bug` (silent loss across operation kinds and overlay kinds, now reported for each). Fix 2e is `cross-consumer` (`sync-state.json` records read by status, apply and repin).
- [x] CHK-FIX-002 [P0] Same-class producers inventoried. Evidence: `rg -l show-toplevel .skilled/commands/doctor/scripts/*.cjs` lists release-update, overlay-engine, git-hook-gates, git-setup-check, git-standards and sk-code-quality-config. The four git and quality tools act on the git repository itself, where the top level is right, and overlay-engine takes `--root` explicitly. Only release-update mapped a `.skilled` tree from the top level.
- [x] CHK-FIX-003 [P0] Consumers inventoried. Evidence: `resolveRepo` has one caller (`runCommand`). The pinned `{ commit, tree }` record is read by `isReleaseRecord`, `baseForUnit`, `buildReport` and `normalizeBaseUnits`, all updated, with the downgrade guard. The `upstream-lost` lines are read by `doctor-overlay-repin.yaml`, `doctor-overlay-presentation.txt` and `references/overlays.md` (`rg -l upstream-lost`). The new `keys` record is read by every state load, check and save in the engine.
- [x] CHK-FIX-004 [P0] The path fix carries adversarial cases. Evidence: `release-update.test.cjs` refuses a root `.skilled` symlink to a tree outside the work tree and an in-tree symlink whose target is not named `.skilled`, keeps a normal checkout on its top level, and the unchanged `safeResolve` guard still refuses a symlinked parent. `--pin` rejects an abbreviated id and `--pin` with `--release`, each with exit 2.
- [ ] CHK-FIX-005 [P1] Open: the axes are listed in plan.md, but the work record gives no row count.
- [x] CHK-FIX-006 [P1] N/A: the added code reads no environment variable (a scan of the added lines found 0) and uses the working directory only as the default `--repo`, as before.
- [ ] CHK-FIX-007 [P1] Open: nothing is committed. The evidence is not pinned to a fix SHA or a diff range yet.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. Evidence: a scan of the added lines in the doctor scripts, assets and references for key, secret, password and token assignments found 0.
- [x] CHK-031 [P0] Input validation implemented: the pin must be a full lowercase hex id of 40 or 64 characters and `--pin` cannot combine with `--release` (work record, line 13). Observed in this packet: `--pin abc --dry-run` exits 2 with "--pin must be a full lowercase hexadecimal commit id" and `--pin <40-hex> --release v4.1.0.0 --dry-run` exits 2 with "cannot be combined".
- [ ] CHK-032 [P1] N/A: the work record names no auth or authz surface and the change adds none.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks and acceptance criteria agree on REQ and AC ids and on status. Evidence: spec.md, plan.md, tasks.md and acceptance-criteria.md all cite REQ-001 to REQ-011.
- [x] CHK-041 [P1] Code comments keep the durable why only. Evidence: a scan of every added comment line in the changed `.cjs` and `.ts` files for the vendoring project's name, spec paths, packet numbers, and REQ, ADR, CHK, task and item ids found 0.
- [ ] CHK-042 [P2] N/A: the work record names no README change and the doc surfaces it names are listed in plan.md.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only. Evidence: `ls P/scratch` lists `.gitkeep`, `request-from-vendoring-project.md` and `work-record.md` and nothing else.
- [x] CHK-051 [P1] scratch/ cleaned before completion. Evidence: scratch keeps only the two source files and `.gitkeep`. The backups made for this packet sit outside the packet.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 5/12 |
| P1 Items | 13 | 6/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-11-18
<!-- /ANCHOR:summary -->
