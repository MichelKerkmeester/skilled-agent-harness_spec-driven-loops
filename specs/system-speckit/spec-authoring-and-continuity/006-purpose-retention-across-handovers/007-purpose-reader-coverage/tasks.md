---
title: "Tasks: Phase 7: purpose-reader-coverage"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "purpose reader coverage tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 7: purpose-reader-coverage

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
- `C=specs/system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/007-purpose-reader-coverage`
- `P=.skilled/skills/system-spec-kit/runtime/lib/spec/packet-purpose.ts`
- `T=.skilled/skills/system-spec-kit/runtime/tests/packet-purpose.vitest.ts`
- `G=specs/hooks-plugins-extensions/goal-and-directive-hooks/001-goal-hooks-cross-runtime`
- `D=specs/system-deep-loop/loop-architecture/001-deep-loop-innovation/003-mode-contracts-migration-and-cutover/002-mode-and-lane-migrations/001-deep-research`

`LIST` stands for the command that lists the live `spec.md` files with no exact `### Purpose` heading: `rg --files-without-match '^\s*###\s+Purpose\s*$' specs -g spec.md -g '!**/z_archive/**' -g '!**/scratch/**' -g '!**/lineages/**'`. The probe reads that list from standard input.

Edit tasks name the edit in `plan.md` section 4, which holds the search text and the replacement for each one. Every `Verify:` runs from the worktree root unless it names `(runtime)`, which means `.skilled/skills/system-spec-kit/runtime`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [x] T001 Capture the helper test baseline (`$T`). Verify: `(runtime) ../node_modules/.bin/vitest run --config vitest.config.ts runtime/tests/packet-purpose.vitest.ts` prints `Tests  4 passed (4)`.
- [x] T002 Capture the probe baseline on two real packets (`$C/scratch/probe-reader.mjs`). Verify: `LIST | node $C/scratch/probe-reader.mjs $G $D` prints `001-goal-hooks-cross-runtime none`, `001-deep-research ancestor` and `own purpose read: 0 of 292`.
- [x] T003 Capture the caller test baseline (`.skilled/skills/system-spec-kit/runtime/tests/hook-session-start.vitest.ts`). Verify: `(runtime) ../node_modules/.bin/vitest run --config vitest.config.ts runtime/tests/hook-session-start.vitest.ts runtime/tests/history-locator-adapters.vitest.ts` prints `(23 tests)`, `(18 tests)` and `Tests  41 passed (41)`.
- [x] T004 Confirm every search text matches once (`$C/plan.md`). Verify: `rg -c -F -- '<search text>' <file>` prints `1` for E1, E3, E4, E5 and E7, and `rg -U -c -F` prints `1` for E2 and for both search texts of E6.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

- [x] T005 Apply E1, the four constants (`$P`). Verify: `rg -c '^const (PURPOSE_SECTION_HEADING|PURPOSE_LABEL|LIST_MARKER|SENTENCE_END) = ' $P` prints `4`.
- [x] T006 Apply E2, the reader for three shapes (`$P`). Verify: `rg -c '^function (paragraphAfter|extractPurposeParagraph)\(' $P` prints `2` and `rg -c -F 'PURPOSE_SECTION_HEADING.test(line)' $P` prints `1`.
- [x] T007 Apply E3, the list marker (`$P`). Verify: `rg -c -F ".trim().replace(LIST_MARKER, '');" $P` prints `1`.
- [x] T008 Apply E4, the sentence end (`$P`). Verify: `rg -c -F 'text.match(SENTENCE_END)' $P` prints `1`.
- [x] T009 Apply E5, the doc comment (`$P`). Verify: `rg -c -F "Reads the packet's own purpose first." $P` prints `1`.
- [x] T010 Apply E6, the five fixtures and five tests (`$T`). Verify: `rg -c "^  it\('" $T` prints `9` and `rg -c '^function rawPacket' $T` prints `1`.
- [x] T011 Apply E7, the README row (`.skilled/skills/system-spec-kit/runtime/lib/spec/README.md`). Verify: `rg -c -F 'under a level-two purpose heading' .skilled/skills/system-spec-kit/runtime/lib/spec/README.md` prints `1`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [x] T012 REQ-001, REQ-003 and REQ-004: the helper reads the three shapes, ignores a stray label and keeps the sentence whole (`$T`). Verify: the T001 command prints `Tests  9 passed (9)`.
- [x] T013 REQ-005: the callers are unchanged (`.skilled/skills/system-spec-kit/runtime/tests/hook-session-start.vitest.ts`). Verify: the T003 command prints `(23 tests)`, `(18 tests)` and `Tests  41 passed (41)`, and `(runtime) npm run typecheck` exits 0.
- [x] T014 Lint the two changed TypeScript files (`$P`). Verify: `(runtime) ../node_modules/.bin/eslint lib/spec/packet-purpose.ts tests/packet-purpose.vitest.ts; echo $?` prints only `0`.
- [x] T015 Build the runtime so the hooks load the new reader (`.skilled/skills/system-spec-kit/runtime/dist/lib/spec/packet-purpose.js`). Verify: `(runtime) npm run build; echo $?` ends with `0` and `rg -c 'PURPOSE_SECTION_HEADING' .skilled/skills/system-spec-kit/runtime/dist/lib/spec/packet-purpose.js` prints `2`.
- [x] T016 REQ-002: two real packets resolve to their own purpose (`$C/scratch/probe-reader.mjs`). Verify: `LIST | node $C/scratch/probe-reader.mjs $G $D` prints `001-goal-hooks-cross-runtime packet` and `001-deep-research packet`, and its last line starts with `own purpose read: ` and ends with ` of 292`.
- [x] T017 Record the probe's last line (`$C/implementation-summary.md`). Verify: `rg -c 'own purpose read: [0-9]+ of 292' $C/implementation-summary.md` prints `1`.
- [x] T018 Confirm only the three planned files changed (`git status`). Verify: `git status --short` lists the three files in `plan.md` section 4 and this packet's own docs, and nothing else.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] T012 prints `Tests  9 passed (9)` and T016 prints `packet` for both named packets
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`, section 4 for the seven edits and section 5 for the baselines
<!-- /ANCHOR:cross-refs -->

---
