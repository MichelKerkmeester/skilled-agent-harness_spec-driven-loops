---
title: "Tasks: Phase 9: compaction-purpose-folder"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "compaction purpose folder tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 9: compaction-purpose-folder

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation
<!-- FILL: Keep the prefix table and add the two shell variables this task list uses. GOOD: `R` is `scripts/rotate-logs.sh`. `A` is `logs/archive/`. WEAK: Variables are defined below. -->

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

Shell variables, set from the worktree root before the first task:
- `C=specs/system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/009-compaction-purpose-folder`
- `RT=.skilled/skills/system-spec-kit/runtime`
- `S=$RT/hooks/claude/session-prime.ts`
- `PI=$RT/hooks/pi/session-compact-context.ts`
- `ST=$RT/tests/hook-session-start.vitest.ts`
- `PT=$RT/tests/history-locator-adapters.vitest.ts`

Edit tasks name the edit in `plan.md` section 4, which holds the search text and the replacement for each one. Every `Verify:` runs from the worktree root unless it names `(runtime)`, which means `$RT`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [x] T001 Capture the compaction test baseline (`$ST`). Verify: `(runtime) ../node_modules/.bin/vitest run --config vitest.config.ts runtime/tests/hook-session-start.vitest.ts runtime/tests/history-locator-adapters.vitest.ts` prints `(23 tests)`, `(18 tests)` and `Tests  41 passed (41)`.
- [x] T002 Capture the two code baselines (`$S`). Verify: `rg -c 'resolvePacketPurpose\(resolve\(' $S $PI` prints `1` for each file, and `rg -c 'lastSpecFolder: (packetDir|emptyDir)' $ST $PT` prints `2` for `$ST` and `1` for `$PT`.
- [x] T003 Confirm every search text matches once (`$C/plan.md`). Verify: `rg -c -F -- '<search text>' <file>` prints `1` for each single-line search text of E1, E3, E4, E6, E7 and E9, and `rg -U -c -F` prints `1` for E2, E5, E8 and the fifth search text of E9.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

- [x] T004 Apply E1, the path separator import (`$S`). Verify: `rg -c -F "import { resolve, sep } from 'node:path';" $S` prints `1`.
- [x] T005 Apply E2, containment and `folderNamedInBrief` (`$S`). Verify: `rg -c -F 'if (!folder.startsWith(root + sep)) return null;' $S` prints `1` and `rg -c '^export function folderNamedInBrief' $S` prints `1`.
- [x] T006 Apply E3, the fallback in the compact branch (`$S`). Verify: `rg -c -F 'priorState?.lastSpecFolder || folderNamedInBrief(priorState?.pendingCompactPrime?.payload)' $S` prints `1`.
- [x] T007 Apply E4, the Pi path separator import (`$PI`). Verify: `rg -c -F 'import { join, resolve, sep } from "node:path";' $PI` prints `1`.
- [x] T008 Apply E5, the Pi containment (`$PI`). Verify: `rg -c -F 'if (!folder.startsWith(root + sep)) return null;' $PI` prints `1`.
- [x] T009 Apply E6, the two import lines (`$ST`). Verify: `rg -c -F "import { join, relative, resolve } from 'node:path';" $ST` prints `1` and `rg -c -F "import { buildMergedCompactResult } from '../hooks/claude/compact-inject.js';" $ST` prints `1`.
- [x] T010 Apply E7, the two purpose tests store a repo-relative folder (`$ST`). Verify: `rg -c -F 'relative(process.cwd(), ' $ST` prints `2` and `rg -c 'lastSpecFolder: (packetDir|emptyDir),' $ST` prints nothing.
- [x] T011 Apply E8, the four new tests (`$ST`). Verify: `rg -c "it\('(adds no purpose section for a last spec folder outside the project|takes the purpose from the folder the cached brief names when no last folder is pinned|reads the folder line the PreCompact brief writes|walks up from a packet subfolder and ignores a folder line quoted under recent context)'" $ST` prints `4`.
- [x] T012 Apply E9, the Pi test changes (`$PT`). Verify: `rg -c -F 'relative(WORKSPACE, packetDir)' $PT` prints `2` and `rg -c -F "it('adds no packet purpose for a last spec folder outside the workspace'" $PT` prints `1`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [x] T013 REQ-001 to REQ-004: both adapters refuse an outside folder, the brief fallback works and the tests store relative folders (`$ST`). Verify: the T001 command prints `(27 tests)`, `(19 tests)` and `Tests  46 passed (46)`.
- [x] T014 REQ-001 and REQ-003: no unchecked resolve and no absolute test folder remain (`$S`). Verify: `rg -c 'resolvePacketPurpose\(resolve\(' $S $PI` prints nothing and `rg -c 'lastSpecFolder: (packetDir|emptyDir)' $ST $PT` prints nothing.
- [x] T015 Confirm the tests left no temp folder behind (`$RT`). Verify: `ls -a $RT | rg -c '^\.tmp-session-prime-'` prints nothing.
- [x] T016 Lint the four changed files (`$S`). Verify: `(runtime) ../node_modules/.bin/eslint hooks/claude/session-prime.ts hooks/pi/session-compact-context.ts tests/hook-session-start.vitest.ts tests/history-locator-adapters.vitest.ts; echo $?` prints only `0`.
- [x] T017 REQ-005: the runtime typechecks and the built hook carries the change (`$RT/dist/hooks/claude/session-prime.js`). Verify: `(runtime) npm run typecheck` and `(runtime) npm run build` exit 0, and `rg -c 'folderNamedInBrief' $RT/dist/hooks/claude/session-prime.js` prints `2`.
- [x] T018 Confirm only the four planned files changed (`git status`). Verify: `git status --short` lists the four files in `plan.md` section 4 and this packet's own docs, and nothing else.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] T013 prints `Tests  46 passed (46)` and T014 prints nothing for both checks
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`, section 4 for the nine edits and section 5 for the baselines
<!-- /ANCHOR:cross-refs -->

---
