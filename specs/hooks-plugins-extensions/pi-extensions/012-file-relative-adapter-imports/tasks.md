---
title: "Tasks: Pi loads hook adapters on every version"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "file relative adapter imports tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Pi loads hook adapters on every version

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

`LOAD` is `pi -p "Reply with the single word READY." --mode text --offline`, run in the repository root. `HV` is `.skilled/node_modules/.bin/vitest run --config .skilled/hooks/vitest.config.ts`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Reproduce the load failure on Pi 1.5.2 (`.pi/extensions/`). Verify: `LOAD` exits 1 and prints 16 `Failed to load extension` lines.
- [x] T002 Record the hooks test baseline (`.skilled/hooks/vitest.config.ts`). Verify: `HV` passes 491 tests in 9 files.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Rewrite each `../../.skilled/...` import to the path relative to the adapter's own folder, by script after a dry run, keeping fallback halves of try/catch pairs (20 adapter `.ts` files). Verify: `LOAD` on Pi 1.5.2 prints `READY` and exits 0.
- [x] T004 Fix the `executorSkill` import from `dispatch-audit.mjs` by hand (`.skilled/hooks/dispatch/pi/dispatch-preflight-lint.ts`). Verify: `LOAD` on Pi 1.5.2 prints 0 `Failed to load extension` lines.
- [x] T005 Add `as string` to the four fallback imports and correct two comments (`.skilled/hooks/session-relaunch/pi/session-relaunch.ts`). Verify: `tsc -p tsconfig.pi.json` reports no TS2307 error for this file.
- [x] T006 Name the three adapters by their real paths and remove `preserveSymlinks` (`tsconfig.pi.json`). Verify: `tsc -p tsconfig.pi.json` exits 0.
- [x] T007 Swap one symlink entry for a one-line re-export file as a probe (`.pi/extensions/`). Verify: `LOAD` on Pi 1.5.0 drops from 16 failures to 15, that adapter no longer among them.
- [x] T008 Swap all 22 `*.ts` symlink entries for one-line re-export files (`.pi/extensions/*.ts`). Verify: `LOAD` on Pi 1.5.0 prints `READY` and exits 0.
- [x] T009 Require a one-line re-export entry and reject a symlink entry (`sync-hook-registrations.cjs`). Verify: `--check` prints `PASS: 4 registration files match the 35-hook registry; 22 Pi extensions resolve.`
- [x] T010 Build entry files in the fixtures and add a test for the symlink line (`hook-registration-sync.vitest.ts`). Verify: `vitest run --project cli hook-registration-sync` passes 8.
- [x] T011 List the entry files and read the re-exported path (`hook-adapter-path-parity.vitest.ts`). Verify: vitest passes 149.
- [x] T012 Import `mintHistoryLocator` from the adapter file itself (`history-locator-adapters.vitest.ts`). Verify: with `history-lookup-adapters-e2e.vitest.ts`, vitest passes 21.
- [x] T013 Follow a re-export entry to the adapter file (`.skilled/commands/doctor/scripts/git-setup-check.cjs`). Verify: `--tool pi` prints `STATUS=OK checks=11`.
- [x] T014 Add three tests and repair two Pi cases (`git-setup-check.test.cjs`). Verify: `node --test` on the file passes 80.
- [x] T015 Write a one-line entry file in the fixture (`overlay-guard.test.cjs`) and import the adapter file itself (`env-secret-guard.test.cjs`). Verify: the 84-file `node --test` run passes 1638, 0 failed.
- [x] T016 Describe one-line entry files in the READMEs and the three vitest alias comments (`.pi/extensions/README.md`). Verify: `rg -n 're-export' .pi/extensions/README.md` prints a line.
- [x] T017 Add the fix bullet, the hook suites sentences and the doctor test count (`.skilled/changelog/skilled/v4.0.2.1.md`). Verify: `rg -n 'Pi loads the hook adapters on every version' .skilled/changelog/skilled/v4.0.2.1.md` prints one line.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T018 Run the load test on both versions (`.pi/extensions/`). Verify: `LOAD` prints `READY`, exits 0 and prints 0 `Failed to load extension` lines on Pi 1.5.0 and on Pi 1.5.2.
- [x] T019 [P] Rerun the hooks suite (`.skilled/hooks/vitest.config.ts`). Verify: `HV` passes 491 tests in 9 files.
- [x] T020 [P] Run the doctor script tests (`.skilled/commands/doctor/scripts/tests/`). Verify: `node --test tests/` passes 1152, 0 failed.
- [x] T021 [P] Run the advisor hook test (`.skilled/skills/system-skill-advisor/runtime/tests/hooks/prompt-advisor.vitest.ts`). Verify: vitest passes 13.
- [x] T022 Run the Pi type check (`tsconfig.pi.json`). Verify: `tsc -p tsconfig.pi.json` exits 0.
- [x] T023 Reword the documents and comments an alignment round found (`.skilled/hooks/`, `.skilled/skills/`, `README.md`). Verify: `rg -n "still a symlink under a Pi older" .skilled README.md -g '!**/changelog/**'` prints nothing, and the round's last recheck lists 0 findings open. Rounds seven to ten found more documents of the same kind, the Pi README, the two sync manifests, the Pi extension README, the cross-CLI map and three Pi CLI playbook scenarios, and each round's recheck lists 0 still open.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] `LOAD` prints `READY` and exits 0 on Pi 1.5.0 and on Pi 1.5.2
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **First-pass diff**: `scratch/real-folder-imports.patch` holds the file-relative rewrite before the entry swap.
<!-- /ANCHOR:cross-refs -->

---
