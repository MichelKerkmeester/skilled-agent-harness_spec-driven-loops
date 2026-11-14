---
title: "Tasks: Phase 6: purpose-carry-follow-ups"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "purpose carry follow ups tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 6: purpose-carry-follow-ups

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
- `C=specs/system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/006-purpose-carry-follow-ups`
- `A=.skilled/commands/speckit/assets`

Edit tasks name the edit in `plan.md` section 4. That section holds the search text, the replacement and the source docs for each one. Every `Verify:` runs from the worktree root unless it names `(runtime)`, which means `.skilled/skills/system-spec-kit/runtime`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [ ] T001 Capture the hook test baseline (`.skilled/skills/system-spec-kit/runtime/tests/hook-precompact.vitest.ts`). Verify: `(runtime) ../node_modules/.bin/vitest run --config vitest.config.ts runtime/tests/hook-precompact.vitest.ts runtime/tests/hook-session-start.vitest.ts` prints `(17 tests)`, `(23 tests)` and `Tests  40 passed (40)`.
- [ ] T002 Capture the command and mirror baselines (`.skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-command-workflows.js`). Verify: it prints `Result: passed=148 failed=0`, and `sync-runtime-mirrors.cjs --check` prints `PASS: 256 mirrors across 10 trees are in sync.`
- [ ] T003 Capture the five parent validation baselines (each parent `spec.md` in `plan.md` E1 to E10). Verify: `CI=1 bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <parent> --strict` prints a first `Summary` line of `Errors: 0  Warnings: 1` for the local embeddings parent and `Errors: 0  Warnings: 0` for the other four, each followed by `RESULT: PASSED`.
- [ ] T004 Confirm every search text matches once (`$C/plan.md`). Verify: `rg -c -F -- '<search text>' <file>` prints `1` for E1 to E11, E13 and E14, and `rg -U -c -F` prints `1` for E12.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

- [ ] T005 Apply E1, the local embeddings Problem Statement (`specs/system-speckit/memory-search-and-knowledge/001-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/spec.md`). Verify: `rg -c -F 'sent their text to the Voyage cloud API' <file>` prints `1`.
- [ ] T006 Apply E2, the local embeddings Purpose (same file as T005). Verify: `rg -c -F 'Run memory and code embeddings on this machine' <file>` prints `1` and `rg -c -F 'Keep parent documentation lean' <file>` prints nothing.
- [ ] T007 Apply E3, the install scripts Problem Statement (`specs/system-speckit/memory-search-and-knowledge/001-graph-and-context-optimization/006-operator-tooling/003-install-scripts-doctor-realignment/spec.md`). Verify: `rg -c -F 'described a system that had since changed' <file>` prints `1`.
- [ ] T008 Apply E4, the install scripts Purpose (same file as T007). Verify: `rg -c -F 'one agreed database path for each store' <file>` prints `1` and `rg -c -F 'Keep parent documentation lean' <file>` prints nothing.
- [ ] T009 Apply E5, the template reduction Problem Statement (`specs/system-speckit/runtime-and-release/001-system-speckit-v4/003-spec-doc-template-reduction/spec.md`). Verify: `rg -c -F 'rendered more text than an author needed' <file>` prints `1`.
- [ ] T010 Apply E6, the template reduction Purpose (same file as T009). Verify: `rg -c -F 'Cut the templates down to what each doc needs' <file>` prints `1` and `rg -c -F 'Keep parent documentation lean' <file>` prints nothing.
- [ ] T011 Apply E7, the decisions and notes Problem Statement (`specs/system-speckit/runtime-and-release/001-system-speckit-v4/004-decisions-and-notes-system/spec.md`). Verify: `rg -c -F 'looked like a steering layer' <file>` prints `1`.
- [ ] T012 Apply E8, the decisions and notes Purpose (same file as T011). Verify: `rg -c -F 'Retire the constitutional memory tier' <file>` prints `1` and `rg -c -F 'Keep parent documentation lean' <file>` prints nothing.
- [ ] T013 Apply E9, the simplification research Problem Statement (`specs/system-speckit/runtime-and-release/001-system-speckit-v4/030-spec-kit-simplification-research/spec.md`). Verify: `rg -c -F 'had grown by accretion' <file>` prints `1`.
- [ ] T014 Apply E10, the simplification research Purpose (same file as T013). Verify: `rg -c -F 'fix every finding that reproduces' <file>` prints `1` and `rg -c -F 'Keep parent documentation lean' <file>` prints nothing.
- [ ] T015 Apply E11, the folder regex (`.skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts`). Verify: `rg -c -F 'const specFolderRe = /(?:\.opencode\/)?specs\/' <file>` prints `1`.
- [ ] T016 Apply E12, the `specs/` folder test (`.skilled/skills/system-spec-kit/runtime/tests/hook-precompact.vitest.ts`). Verify: `rg -c -F 'names it in the brief' <file>` prints `1`.
- [ ] T017 Apply E13, the auto asset `reply_format` (`$A/speckit-resume-auto.yaml`). Verify: `rg -c -F '"Why this is next"]' $A/speckit-resume-auto.yaml` prints `1`.
- [ ] T018 Apply E14, the confirm asset `reply_format` (`$A/speckit-resume-confirm.yaml`). Verify: `rg -c -F '"Why this is next"]' $A/speckit-resume-confirm.yaml` prints `1`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [ ] T019 REQ-001: no live parent carries the scaffold sentence (`specs/`). Verify: `rg -l -F 'Keep parent documentation lean' specs/ -g spec.md -g '!**/z_archive/**' -g '!specs/system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/**' | wc -l` prints `0`.
- [ ] T020 REQ-002: the hook test proves the `specs/` folder and its brief line (`.skilled/skills/system-spec-kit/runtime/tests/hook-precompact.vitest.ts`). Verify: `(runtime) ../node_modules/.bin/vitest run --config vitest.config.ts runtime/tests/hook-precompact.vitest.ts` prints `(18 tests)` and `Tests  18 passed (18)`.
- [ ] T021 REQ-003: both assets list the presentation rows (`$C/scratch/check-brief-rows.py`). Verify: `python3 $C/scratch/check-brief-rows.py $A/speckit-resume-presentation.txt $A/speckit-resume-auto.yaml $A/speckit-resume-confirm.yaml` prints `speckit-resume-auto.yaml match` and `speckit-resume-confirm.yaml match`.
- [ ] T022 REQ-004: each rewritten parent still validates (the five parent `spec.md` files). Verify: `CI=1 bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <parent> --strict` prints the T003 `Summary` line or a better one, and `RESULT: PASSED`, for each parent.
- [ ] T023 REQ-005: the purpose line and the command checks are unchanged (`.skilled/skills/system-spec-kit/runtime/tests/hook-session-start.vitest.ts`). Verify: the T001 command prints `(23 tests)` for this file and `Tests  41 passed (41)` in total, the T002 commands print the T002 lines and the YAML load in `plan.md` section 5 prints `yaml ok`.
- [ ] T024 REQ-006: the runtime typechecks and the built hook carries the fix (`.skilled/skills/system-spec-kit/runtime/dist/hooks/claude/compact-inject.js`). Verify: `(runtime) npm run typecheck` and `(runtime) npm run build` exit 0, then the second Measured Behavior command in `spec.md` prints `specs/ -> "specs/system-speckit/x/y"` and `Active spec folder lines in brief: 1`.
- [ ] T025 Confirm only the nine planned files changed (`git status`). Verify: `git status --short` lists the nine files in `plan.md` section 4 and this packet's own docs, and nothing else.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] T021 prints `match` for both assets and T024 prints `Active spec folder lines in brief: 1`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`, section 4 for the fourteen edits and section 5 for the baselines
<!-- /ANCHOR:cross-refs -->

---
