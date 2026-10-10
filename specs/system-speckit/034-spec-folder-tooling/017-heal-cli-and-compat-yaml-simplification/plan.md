---
title: "Implementation Plan: Phase 17: heal-cli-and-compat-yaml-simplification"
description: "Four small phases, each its own commit: pin the refusal order, drop --mode, drop --json after proving the corpus check runs from plain output, and merge the compat action's failed-step fields."
trigger_phrases:
  - "heal cli and compat yaml simplification plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 17: heal-cli-and-compat-yaml-simplification

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js (CommonJS healer, ESM upgrade script), YAML workflow asset |
| **Framework** | None |
| **Storage** | None |
| **Testing** | Vitest for the CLI, `node --test` for the doctor scripts |

### Overview
Four phases, each one commit. The order test lands first, so the later removals run against a pinned refusal order. The `--json` removal waits until the phase 15 corpus check has been run from plain output.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified, and the operator answered the caller question

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing
- [x] Docs updated (spec/plan/tasks and the CLI README)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Removal only. No new module, option or export.

### Key Components
- **`runLaneModesCli`** (`heal-spec-docs.cjs:1360`): loses its flag parsing for `--mode` and its `--json` branch. It keeps `--apply`, `--folder` and `--roots`.
- **`runLaneModes`** (`heal-spec-docs.cjs:1332`): unchanged. Its `options.modes` stays, because the tests narrow modes through it.
- **`sortRefusals`** (`upgrade-legacy.mjs:1141`): unchanged, newly pinned by a test.
- **`phase_4_move`** (`doctor-update-compat-action.yaml:117`): one failure field instead of two.

### Data Flow
`upgrade-legacy --apply` calls `runLaneModes` with no mode list (`upgrade-legacy.mjs:881`), collects refusals, sorts them and writes them to `upgrade-baseline.json`. None of that path changes.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `runLaneModesCli` flag parsing | Reads `--mode` and `--json` | Update: both removed | `rg -n -- "--mode|--json" heal-spec-docs.cjs` finds neither |
| `runLaneModes(options.modes)` | Narrows modes for tests | Unchanged | `heal-lane-modes.vitest.ts` still passes |
| `upgrade-legacy.mjs:881` | Production caller, no mode list | Unchanged, not a consumer of either flag | Read at planning time |
| CLI README lines 113 and 271 | Documents the flags | Update | Search after the edit |
| `step_failure` in the compat YAML | Failed-step rule, first copy | Update: folded into `on_step_failure` | `rg -n step_failure .skilled .opencode .claude` finds only `on_step_failure` |
| `doctor-update-compat.test.cjs:823-833` | Reads both fields | Update | `node --test` on that file |

Required inventories:
- Same-class producers: none. No other healer entry point parses `--mode` or `--json`. `--anchor-repair` and the default run parse only `--apply`, `--folder` and `--roots`.
- Consumers of changed symbols: run at planning time, `rg -n -- "lane-modes"` outside `specs/` finds `heal-spec-docs.cjs`, `upgrade-legacy.mjs`, the CLI README and `heal-lane-modes.vitest.ts`. `step_failure` appears only in the YAML and its test.
- Matrix axes: none. No parser, path or security logic changes.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the task state. The phases, in order:

1. **Pin the refusal order.** Add one `upgrade-legacy.vitest.ts` case whose packet refuses in two or more lane modes across two or more documents. The healer loops documents on the outside and modes inside, so it emits refusals document by document while the sort orders them mode by mode, and a fixture with both axes makes the two orders differ. Assert the exact `refusals` array in `upgrade-baseline.json`. Check the test is discriminating by commenting out the sort locally and watching it fail.
2. **Drop `--mode`.** Remove lines 1363-1379 and the `modes` argument at 1390 of `heal-spec-docs.cjs`, the usage text at line 23, the README mention at line 113 and the bracket at line 271, and the unknown-mode assertions at `heal-lane-modes.vitest.ts:587-591`.
3. **Drop `--json`.** First rerun the phase 15 two-pass corpus check from plain output on a scratch copy. Count the `applied` and `refused` lines on each pass, compare the refused lines between the passes and hash the copies. If every number AC-019 recorded can be read that way, remove line 1362 and lines 1392-1395, the usage text, the README bracket and the `--json` assertions at `heal-lane-modes.vitest.ts:578-585`, and rename the case to `lane-modes-cli-dry-run`. If a number cannot be read, stop, keep the flag and record why.
4. **Merge the failure fields.** Replace lines 125-126 of the compat YAML with one `on_step_failure` that says: append step-failed with the step id and argv, stop with STATUS=FAILED and run no further step, show the step id, its argv and the exit code, show every step-done step so far in the Compatibility rollback block newest first, and never retry a step automatically. Point the test's five phrase checks at `on_step_failure`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Refusal order, lane-mode CLI dry run | `npx vitest run --config ../../vitest.config.ts --project cli tests/upgrade-legacy.vitest.ts tests/heal-lane-modes.vitest.ts` from `runtime/cli` |
| Unit | Compat action fields | `node --test .skilled/commands/doctor/scripts/tests/doctor-update-compat.test.cjs` |
| Integration | Whole CLI suite | `npm --prefix .skilled/skills/system-spec-kit/runtime/cli test`, against a count taken before phase 1 |
| Manual | Phase 15 corpus two-pass from plain output | The procedure in phase 3, on a scratch copy outside the repository |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 16 shipped to main | Internal | Green | None, it is shipped |
| Operator answer on outside callers | Internal | Green, answered 2026-10-09 | Phases 2 and 3 would wait |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A caller of `--mode` or `--json` turns up, or a test fails that the phase cannot fix.
- **Procedure**: `git revert <phase commit>`. Each phase is its own commit, so one can be undone without the others.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (order test) ──► Phase 2 (--mode) ──► Phase 3 (--json)
Phase 4 (YAML fields)    independent, may run beside 1-3
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 1 Order test | None | 2 |
| 2 Drop `--mode` | 1 | 3, because both edit `runLaneModesCli` |
| 3 Drop `--json` | 2 | None |
| 4 Merge YAML fields | None | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| 1 Order test | Low | One test case |
| 2 Drop `--mode` | Low | About 20 lines across 4 files |
| 3 Drop `--json` | Med | About 10 lines, plus one corpus two-pass run |
| 4 Merge YAML fields | Low | 2 YAML lines, about 10 test lines |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] CLI suite count recorded before phase 1
- [x] Each phase committed on its own, except that phases 2 and 3 edit the same function and test case and shipped as one commit

### Rollback Procedure
1. Revert the phase's commit with `git revert`.
2. Rerun the phase's own test command and the CLI suite.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A, no persisted data changes shape
<!-- /ANCHOR:enhanced-rollback -->

---
