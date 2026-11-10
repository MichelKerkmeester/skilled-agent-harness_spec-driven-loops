---
title: "Tasks: Phase 7: search-routing-followups"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "search routing followups tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 7: search-routing-followups

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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [x] T001 Record the raw recipe's output for a common phrase (`retrieval-conventions.md` Section 2.1). Verify: the recipe on `trigger index` piped to `grep -c '"type":"match"'` prints 2614.
- [x] T002 Record the advisor baseline (`system-skill-advisor/runtime`). Verify: `npx vitest run tests/parity/local-native-divergence-ratchet.vitest.ts` on the unchanged metadata prints `Tests  9 passed (9)`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

- [x] T003 Make the wrapper the default free-text command (`.skilled/commands/speckit/search.md`). Verify: `rg -c "rg-wrapper.mjs structured '<QUERY>' --json" .skilled/commands/speckit/search.md` prints 1.
- [x] T004 Describe the raw recipe as the exception (`.skilled/commands/speckit/assets/search-presentation.txt`, `.skilled/commands/speckit/README.txt`). Verify: `rg -c "runs the raw Section 2.1" .skilled/commands/speckit` prints nothing.
- [x] T005 Add `spec docs`, `spec and skill docs`, `ripgrep retrieval` and `ripgrep wrapper` to `intent_signals` (`.skilled/skills/system-spec-kit/graph-metadata.json`). Verify: `rg -c "ripgrep wrapper" .skilled/skills/system-spec-kit/graph-metadata.json` prints 1.
- [x] T006 Write the changelog entry and bump the version (`.skilled/skills/system-spec-kit/changelog/v2.12.44.0.md`, `SKILL.md`). Verify: `rg -n "^version: 2.12.44.0" .skilled/skills/system-spec-kit/SKILL.md` prints one line.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [x] T007 Run the wrapper on the same phrase (`rg-wrapper.mjs`). Verify: `structured 'trigger index' --json` returns 20 results, `matchCount` 2614 and `hidden.files` 1329.
- [x] T008 Rebuild the advisor and rerun probe P01 (`.skilled/bin/skill-advisor.cjs`). Verify: `advisor_recommend` names `system-spec-kit` first at 0.885.
- [x] T009 Run the advisor suite (`system-skill-advisor/runtime`). Verify: `npx vitest run` exits 0 with 0 failed.
- [x] T010 Run the alignment battery over the change (`run-battery.cjs`). Verify: the status line prints `fail=0`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---



