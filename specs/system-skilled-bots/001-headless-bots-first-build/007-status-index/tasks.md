---
title: "Tasks: Phase 7: status-index"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "status index tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 7: status-index

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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`H` is `.skilled/skills/system-skilled-bots/runtime`. `T` is a temp state root set through `XDG_STATE_HOME` for tests.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm phases 001, 003 and 006 are closed (`../003-manual-runner/acceptance-criteria.md`). Verify: `rg -n 'Closeable:\*\* Yes' ../001-*/acceptance-criteria.md ../003-*/acceptance-criteria.md ../006-*/acceptance-criteria.md` prints three lines.
- [ ] T002 Get the operator's choice on the SQLite binding (`decision-record.md`). The retention numbers in ADR-002 and the needs-you item retention in ADR-005 are already accepted (operator decisions D5 and D10). Verify: `rg -n 'Status\*\* \| Accepted' decision-record.md` prints a line for ADR-001, ADR-002 and ADR-005.
- [ ] T003 Declare the chosen binding (`H/package.json`). Verify: `node -e "require('better-sqlite3')"` run from `H` exits 0, or the built-in option loads if ADR-001 picks it.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Open the index with WAL, `busy_timeout = 5000` and `synchronous = FULL`, under the state root (`H/lib/status-index.ts`). Verify: a test reads back `PRAGMA journal_mode`, `busy_timeout` and `synchronous` and prints `wal`, `5000` and `2`.
- [ ] T005 Build and upsert one summary row per run record, keyed by identity plus last known path, and write `builtAt` (`H/lib/status-index.ts`). Verify: a test with three fixture records counts three rows and a non-null `builtAt`.
- [ ] T006 Add `--rebuild`, which writes a new file and renames it into place (`H/lib/status-index.ts`). Verify: the parity test deletes the index, rebuilds and finds identical rows ignoring `builtAt`.
- [ ] T007 Add the stale check from the generation stamp ADR-004 settles (`H/lib/status-index.ts`). Verify: a test bumps the stamp without rebuilding and `bots status` prints `stale` and `builtAt`.
- [ ] T008 Add retention with the ADR-002 bounds, deleting oldest terminal rows first and never updating a terminal row (`H/lib/status-index.ts`). Verify: a test writes bound plus 10 runs, counts the bound and finds each kept terminal row unchanged.
- [ ] T009 [P] Parse `launchctl print` output for state, run count and last exit code (`H/lib/launchctl-print.ts`). Verify: a test over captured output for a loaded, a never-run and a failed label returns the three expected objects, and an unknown field returns `unknown`.
- [ ] T010 Merge index rows with launchd results and assign row states (`H/lib/status.ts`). Verify: the four-row fixture prints `never-run`, `launchd-failed`, `missing` and `unreadable` as expected.
- [ ] T011 Relink a missing checkout when exactly one other registered root reports the same identity, and flag an identity with two present roots (`H/lib/status.ts`). Verify: a test moves a fixture checkout and the row shows the new path and the previous path. A second test registers two present clones and status names both paths and moves no row.
- [ ] T012 Add `--unregister <identity>`, which retires rows and deletes nothing (`H/lib/status.ts`). Verify: after unregister, `bots status` hides the rows and `find "$T" -type f | wc -l` prints the same count as before.
- [ ] T013 Wire the `status` verb with `--rebuild`, `--unregister` and `--json` into the phase 3 CLI entry (`.skilled/bin/bots.cjs`). Verify: `bots status --json` over an empty state root prints `[]` rows and a `builtAt`, and exits 0.
- [ ] T014 Report a corrupt index or a failed binding load without reading run folders (`H/lib/status.ts`). Verify: a test with a truncated index file exits non-zero and its message names `--rebuild`.
- [ ] T019 Show `run-folder-gone` for a row whose run folder under `.skilled/skills/.state/system-skilled-bots/<identity>/runs/` was deleted, and keep that row through a rebuild (`H/lib/status.ts`, `H/lib/status-index.ts`). Verify: a test deletes one fixture run folder, `bots status --json` exits 0 and prints that row as `run-folder-gone`, and the row is still there after `--rebuild`.
- [ ] T020 Limit run folder pruning to the identity's runs folder in the Skilled tree (`H/lib/status-index.ts`). Verify: a test plants a symlink in the runs folder that points outside it and a second identity's runs folder, runs retention past the bound, and finds both outside targets unchanged.
- [ ] T021 Index needs-you items from `<state root>/<identity>/needs-you/` and show each open item as its own `needs-you` row, and an open item past expiry as `expired` (`H/lib/status-index.ts`, `H/lib/status.ts`). Verify: a test with one open, one answered and one past-expiry item prints one `needs-you` row and one `expired` row, no question text, and leaves every item file byte-identical.
- [ ] T022 Add retention for answered and expired items with the bound `retention.closedNeedsYouPerIdentity`, default 200 (`H/lib/status-index.ts`). Verify: a test writes the bound plus 10 closed items and 3 open items, runs retention and counts the bound plus 3 item files.
- [ ] T023 Flag `needs-reinstall` from phase 6's install record (`H/lib/status.ts`). Verify: a test with one install record whose runner path was deleted and one whose `.skilled` symlink was retargeted prints `needs-reinstall` for both, and a third untouched record prints no flag.
- [ ] T024 Show the row state `held` for a bot with an open needs-you item, derived from the index's item rows (`H/lib/status.ts`). Verify: a test with one open item prints `held` and the item id on that bot's row, and after the item is answered the row no longer reads `held`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T015 Prove status never opens a run folder (`H/tests/status.vitest.ts`). Verify: a test makes the runs folder unreadable after the build and `bots status` still prints all rows.
- [ ] T016 Run the full status suite (`H/tests/status-index.vitest.ts`). Verify: `npx vitest run tests/status-index.vitest.ts tests/status.vitest.ts` from `H` exits 0 with no skipped test.
- [ ] T017 Check one real disabled label from phase 6 on the operator's Mac (`H/lib/status.ts`). Verify: `bots status` shows the label as installed and `never-run`.
- [ ] T018 Confirm no code path in this phase calls `launchctl bootstrap` or writes a plist (`H/lib/`). Verify: `rg -n 'bootstrap|\.plist' H/lib/status*.ts H/lib/launchctl-print.ts` prints no write call.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] Every row in `acceptance-criteria.md` is `Met`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decisions**: See `decision-record.md`
- **Acceptance**: See `acceptance-criteria.md`
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

A blocked task is marked `[B]` with its reason on the same line, and a `[B]` line blocks close.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Phases 001, 003 and 006 closed, per T001
- [ ] CHK-004 [P0] ADR-001, ADR-002 and ADR-005 accepted by the operator, per T002. ADR-002 and ADR-005 were accepted on 2026-11-22
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `npx tsc --noEmit` from the hub runtime exits 0
- [ ] CHK-011 [P0] The status suite prints no warning
- [ ] CHK-012 [P1] A corrupt index and a failed binding load each exit non-zero with a message naming `--rebuild`
- [ ] CHK-013 [P1] Code follows the deep-loop runtime's module layout and comment rules
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Manual check on one real disabled label complete, per T017
- [ ] CHK-022 [P1] Empty state root and retention overflow tested
- [ ] CHK-023 [P1] Corrupt index and unreadable checkout tested
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

N/A. This phase fixes no reported finding.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] The index stores no secret and no run output, checked by `rg` over a built index dump
- [ ] CHK-031 [P0] Index file mode is 0600 and its folder 0700
- [ ] CHK-032 [P1] Nothing is written into a checkout, and in the Skilled tree only the identity's gitignored runs folder is pruned, checked by `git status --porcelain` in a fixture checkout after a status and retention run
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Each module opens with a comment that says why it exists
- [ ] CHK-042 [P2] No phase doc claims the status mode is routed
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 0/9 |
| P1 Items | 10 | 0/10 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-11-22
<!-- /ANCHOR:summary -->

---
