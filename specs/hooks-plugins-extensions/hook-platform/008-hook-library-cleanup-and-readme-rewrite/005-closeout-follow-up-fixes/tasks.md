---
title: "Tasks: Phase 5: closeout-follow-up-fixes"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "closeout follow up fixes tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 5: closeout-follow-up-fixes

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

`Q` is `.skilled/skills/sk-code/sk-code-quality`. `S` is `.skilled/skills/sk-doc/sk-create-readme/scripts`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [x] T001 Record each fault's checker output before the fix (`spec.md`). Verify: the Measured Behavior block holds the actionlint, reference, count and `HYGIENE_HOOK` outputs. Evidence: four outputs recorded.
- [x] T002 Record the hook suite baseline (`.skilled/hooks/vitest.config.ts`). Verify: the hook Vitest run prints 503 passed. Evidence: the merged-tree baseline printed 503/503.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

- [x] T003 Narrow the actionlint `paths` to `*.yml` and `*.yaml` (`$Q/repository/quality.json`, `$Q/scripts/lib/quality-config-discovery.cjs`, `$Q/references/quality-config.md`). Verify: the gate on the workflows README reports actionlint `NOT_APPLICABLE`. Evidence: `NOT_APPLICABLE`, and `hook-vitest-suites.yml` reports `RAN_CLEAN`.
- [x] T004 Correct the three citations (`sk-code-ci/references/job-shape-rules.md`). Verify: `grep -n 'uses: ./.github/actions/setup'` prints `opencode-plugin-tests.yml:108` and `routing-registry-drift.yml:271`, and `check-gate-inputs.sh:507` holds the actions block. Evidence: all three match.
- [x] T005 Replace `HYGIENE_HOOK` and the moved doc-model check (`comment-hygiene-opencode-plugin.md`). Verify: `grep -c 'gate:comment-hygiene' .skilled/scripts/git-hooks/pre-commit` prints 5. Evidence: prints 5.
- [x] T006 Correct the Codex loading claim (`.opencode/plugins/codex-hooks-watchdog.js`). Verify: `node --check` exits 0. Evidence: exits 0, comments only.
- [x] T007 Fix paths, key names and markers (`.skilled/hooks/coverage-rationale.md`, `.github/workflows/README.md`). Verify: both checkers print `SUMMARY files=1 pass=1 fail=0` on each file. Evidence: four passes.
- [x] T008 Remove the dead Pi fallbacks, the inverted first tries, the Vitest alias and the tests that pinned them (Pi adapters, `.skilled/hooks/vitest.config.ts`). Verify: the hook Vitest suite passes with no alias. Evidence: 503 of 503, and the dead specifier search finds nothing.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [x] T009 Run the sk-code-quality suite (`$Q/scripts/tests`). Verify: `node --test` prints `fail 0`. Evidence: 154 of 154 pass.
- [x] T010 Rerun the hook suites and both sync checks (`.skilled/hooks`). Verify: counts match the baseline with 0 failures. Evidence: Vitest 503/503, `node --test` 1888/1888, both syncs PASS.
- [x] T011 Run strict validation on this phase (`spec.md`). Verify: `validate.sh --strict` prints `RESULT: PASSED`. Evidence: the recursive strict run on the parent prints `RESULT: PASSED` for this phase.
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
