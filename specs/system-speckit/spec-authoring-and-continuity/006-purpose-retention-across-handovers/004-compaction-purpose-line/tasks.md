---
title: "Tasks: Phase 4: compaction-purpose-line"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "compaction purpose line tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 4: compaction-purpose-line

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

Run every command from the worktree root. `RT` is `.skilled/skills/system-spec-kit/runtime`. `P` is `specs/system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers`. `M` is `$P/004-compaction-purpose-line/scratch/measure-compact-brief.mjs`. `VT` is `(cd $RT && ../node_modules/.bin/vitest run --config vitest.config.ts runtime/tests/hook-session-start.vitest.ts runtime/tests/history-locator-adapters.vitest.ts runtime/tests/hook-precompact.vitest.ts runtime/tests/phase-parent-health.vitest.ts)`. Step numbers refer to `plan.md` section 4.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [x] T001 Record the baseline of the four existing test files (`$RT/tests/`). Verify: `VT` prints `Test Files  4 passed (4)` and `Tests  64 passed (64)`. Evidence: Observed in gates-371-baseline.txt before any edit: `Test Files  4 passed (4)` and `Tests  64 passed (64)`.
- [x] T002 Record the baseline brief (`$RT/dist/hooks/claude/session-prime.js`). Verify: `node $M "$PWD/$RT" $P 2>/dev/null | tail -1` prints `--- exit=0 purpose_heading=0 purpose_text=0`. Evidence: Observed in gates-371-baseline.txt: `--- exit=0 purpose_heading=0 purpose_text=0`.
- [x] T003 Confirm no module named `packet-purpose` exists yet (`$RT/lib/spec/`). Verify: `rg -l 'packet-purpose' $RT --glob '!**/dist/**' | wc -l` prints 0. Evidence: `packet-purpose.ts` is untracked and `git cat-file -e HEAD:` on its path fails with `exists on disk, but not in 'HEAD'`, so the module did not exist before the build.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

- [x] T004 Create the helper from Step 1 (`$RT/lib/spec/packet-purpose.ts`). Verify: `rg -c '^export function (resolvePacketPurpose|formatPacketPurpose)' $RT/lib/spec/packet-purpose.ts` prints 2. Evidence: `rg -c` printed 2.
- [x] T005 Create the helper test from Step 2 (`$RT/tests/packet-purpose.vitest.ts`). Verify: `(cd $RT && ../node_modules/.bin/vitest run --config vitest.config.ts runtime/tests/packet-purpose.vitest.ts)` prints `Tests  4 passed (4)`. Evidence: The new test file ran alone: `Test Files  1 passed (1)` and `Tests  4 passed (4)`.
- [x] T006 Import `resolve` from `node:path` per Step 3 (`$RT/hooks/claude/session-prime.ts`). Verify: `rg -c "^import \{ resolve \} from 'node:path';" $RT/hooks/claude/session-prime.ts` prints 1. Evidence: `rg -c` printed 1.
- [x] T007 Import the helper per Step 4 (`$RT/hooks/claude/session-prime.ts`). Verify: `rg -c "from '../../lib/spec/packet-purpose.js'" $RT/hooks/claude/session-prime.ts` prints 1. Evidence: `rg -c` printed 1.
- [x] T008 Add `buildPacketPurposeSection` per Step 5 (`$RT/hooks/claude/session-prime.ts`). Verify: `rg -c '^export function buildPacketPurposeSection' $RT/hooks/claude/session-prime.ts` prints 1. Evidence: `rg -c` printed 1.
- [x] T009 Lead the compact sections with the purpose per Step 6 (`$RT/hooks/claude/session-prime.ts`). Verify: `rg -c 'sections.unshift\(purposeSection\)' $RT/hooks/claude/session-prime.ts` prints 1. Evidence: `rg -c` printed 1.
- [x] T010 Add the two compact tests per Step 7 (`$RT/tests/hook-session-start.vitest.ts`). Verify: `rg -c "it\('(leads the compact recovery with the packet purpose|adds no purpose section when the last spec folder has no spec.md)'" $RT/tests/hook-session-start.vitest.ts` prints 2. Evidence: `rg -c` printed 2.
- [x] T011 Import `resolve` per Step 8 (`$RT/hooks/pi/session-compact-context.ts`). Verify: `rg -c '^import \{ join, resolve \} from "node:path";' $RT/hooks/pi/session-compact-context.ts` prints 1. Evidence: `rg -c` printed 1.
- [x] T012 Add `readPacketPurposeSection` per Step 9 (`$RT/hooks/pi/session-compact-context.ts`). Verify: `rg -c '"../../dist/lib/spec/packet-purpose.js"' $RT/hooks/pi/session-compact-context.ts` prints 1. Evidence: `rg -c` printed 1.
- [x] T013 Add the section to the Pi message per Step 10 (`$RT/hooks/pi/session-compact-context.ts`). Verify: `rg -c 'await readPacketPurposeSection\(ctx.cwd, specFolder\)' $RT/hooks/pi/session-compact-context.ts` prints 1. Evidence: `rg -c` printed 1.
- [x] T014 Add the test imports per Step 11 (`$RT/tests/history-locator-adapters.vitest.ts`). Verify: `rg -c "^import \{ createHash \} from 'node:crypto';" $RT/tests/history-locator-adapters.vitest.ts` prints 1. Evidence: `rg -c` printed 1.
- [x] T015 Add the Pi edge assertion and the Pi purpose test per Step 12 (`$RT/tests/history-locator-adapters.vitest.ts`). Verify: `rg -c "## Packet Purpose" $RT/tests/history-locator-adapters.vitest.ts` prints 2. Evidence: `rg -c` printed 2.
- [x] T016 [P] Update the current-state line per Step 13 (`$RT/lib/spec/README.md`). Verify: `rg -c 'is the only implementation file' $RT/lib/spec/README.md || echo 0` prints 0. Evidence: `rg -c` printed nothing and the fallback `echo 0` printed 0.
- [x] T017 [P] Add the key-file row per Step 14 (`$RT/lib/spec/README.md`). Verify: `rg -c '^\| `packet-purpose.ts` \|' $RT/lib/spec/README.md` prints 1. Evidence: `rg -c` printed 1.
- [x] T018 [P] Add the two entrypoint rows per Step 15 (`$RT/lib/spec/README.md`). Verify: `rg -c '^\| `(resolvePacketPurpose|formatPacketPurpose)\(' $RT/lib/spec/README.md` prints 2. Evidence: `rg -c` printed 2.
- [x] T019 [P] Add the key-file line per Step 16 (`$RT/lib/MODULE-MAP.md`). Verify: `rg -c '`packet-purpose.ts`' $RT/lib/MODULE-MAP.md` prints 1. Evidence: `rg -c` printed 1.
- [x] T020 [P] Add the key-file row per Step 17 (`$RT/lib/README.md`). Verify: `rg -c '`spec/packet-purpose.ts`' $RT/lib/README.md` prints 1. Evidence: `rg -c` printed 1.
- [x] T021 [P] Extend the session-prime row per Step 18 (`$RT/hooks/claude/README.md`). Verify: `rg -c 'opens with a `## Packet Purpose` section' $RT/hooks/claude/README.md` prints 1. Evidence: `rg -c` printed 1.
- [x] T022 [P] Extend the session-compact-context row per Step 19 (`$RT/hooks/pi/README.md`). Verify: `rg -c 'a `## Packet Purpose` section comes before' $RT/hooks/pi/README.md` prints 1. Evidence: `rg -c` printed 1.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [x] T023 Build the runtime so the hooks and Pi load the new code (`$RT/dist/`). Verify: `npm --prefix $RT run build; echo $?` ends with `0` and `ls $RT/dist/lib/spec/packet-purpose.js` prints the path. Evidence: The orchestrating session built the runtime and the build exited 0. `ls` shows `dist/lib/spec/packet-purpose.js` (dist is gitignored).
- [x] T024 Rerun the tests with the new file for REQ-001 to REQ-005 (`$RT/tests/`). Verify: `VT` with `runtime/tests/packet-purpose.vitest.ts` added prints `Test Files  5 passed (5)` and `Tests  71 passed (71)`. Evidence: Observed in gates-371-final.txt: `Test Files  5 passed (5)` and `Tests  71 passed (71)`.
- [x] T025 Typecheck the runtime for REQ-005 (`$RT/tsconfig.json`). Verify: `(cd $RT && ../node_modules/.bin/tsc --noEmit --composite false -p tsconfig.json); echo $?` prints only `0`. Evidence: Observed in gates-371-final.txt: runtime typecheck, exit 0.
- [x] T026 Lint the changed code for REQ-005 (`$RT/lib/spec/packet-purpose.ts`). Verify: `(cd $RT && ../node_modules/.bin/eslint lib/spec/packet-purpose.ts hooks/claude/session-prime.ts hooks/pi/session-compact-context.ts tests/packet-purpose.vitest.ts); echo $?` prints only `0`. Evidence: Reran eslint on the four files: exit 0 with no output.
- [x] T027 Rerun the brief measurement for REQ-001 (`$RT/dist/hooks/claude/session-prime.js`). Verify: `node $M "$PWD/$RT" $P 2>/dev/null | tail -1` prints `--- exit=0 purpose_heading=1 purpose_text=1`. Evidence: Observed in gates-371-final.txt: `--- exit=0 purpose_heading=1 purpose_text=1`.
- [x] T028 Confirm the change stays inside its eleven files (`$RT/`). Verify: `git status --short $RT` lists exactly the eleven files in `spec.md` section 3. Evidence: `git status --short` on the runtime lists the eleven files of this phase (nine modified and two new). The other runtime entries belong to the sibling phases.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [ ] Manual verification passed. Open: no real compaction was triggered, so the section has not been seen in a live recovery
- [x] The measurement prints `purpose_heading=1 purpose_text=1` and the five-file run prints `Tests  71 passed (71)`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`, section 4 for each literal edit and section 5 for the baseline numbers
<!-- /ANCHOR:cross-refs -->

---
