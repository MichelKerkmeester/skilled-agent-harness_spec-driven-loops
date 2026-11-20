---
title: "Tasks: Upstream fixes so Barter can drop four overlays: Code Mode disabled manuals, provider-neutral Pi config, doctor tests outside the source repo, overlay anchor placement"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "barter upstream fixes tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Upstream fixes so Barter can drop four overlays: Code Mode disabled manuals, provider-neutral Pi config, doctor tests outside the source repo, overlay anchor placement

<!-- SPECKIT_LEVEL: 2 -->

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

`T` is `.skilled/commands/doctor/scripts/tests`. `H` is the scratch copy of the consumer's vendored tree.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [x] T001 Build `H` as a full copy of the vendored tree with `node_modules` linked. Verify: the seven test files in `H/T` print `tests 154`, `fail 24`.
- [x] T002 Baseline the same seven files in the worktree. Verify: `tests 166`, `pass 166`, `skipped 0`.
- [x] T003 Reproduce the review-core C3 finding in `H`. Verify: `sk-skill-check` prints `"RELATED RESOURCES" must be the last H2`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

- [x] T004 Filter disabled manuals before validation (`.skilled/skills/mcp-code-mode/mcp-server/index.ts`). Verify: `tsc` exits 0 and the probe prints `started at startup: ["live"]`.
- [x] T005 Mark `clickup_official`, `mobbin` and `refero` disabled (`.utcp_config.json`). Verify: the three entries print `True` for `disabled`.
- [x] T006 [P] Add the ask-then-register step (`mcp-tooling/mcp-mobbin/SKILL.md`, `mcp-tooling/mcp-refero/SKILL.md`). Verify: `sk-skill-check` prints `NO FINDINGS` for both.
- [x] T007 [P] Drop the personal defaults (`.pi/settings.json`, `.pi/pi-blackhole-config.json`). Verify: `cmp` against the consumer's overlays prints nothing.
- [x] T008 Make six doctor test files host-independent (`T/*.test.cjs`). `symlink-engine.test.cjs` needs no change: the 9 failures in `H` come from the consumer's own overlay of that test and engine. Verify: the six files in `H` print `fail 0`, `skipped 8`.
- [x] T009 Add `insertBefore` to marked-section plan and capture (`.skilled/commands/doctor/scripts/overlay-engine.cjs`). Verify: `node --check` exits 0.
- [x] T010 Add five `insertBefore` tests (`T/overlay-engine-sync.test.cjs`) and document the field (`system-skilled-doctor/references/overlays.md`). Verify: the tests fail on the old engine and pass on the new one.
- [x] T014 Port the consumer's Pi entry load check (`.skilled/commands/doctor/scripts/hook-wiring-check.cjs`, `T/hook-wiring-check.test.cjs`, `assets/doctor-setup.yaml`, `doctor-setup-presentation.txt`, `doctor-symlink-check.yaml`). Verify: the old script fails the new symlink test, and the old tree prints 21 `pi-extension-broken` lines.
- [x] T015 Add the Pi entry template, its renderer and write-mode migration (`runtime-mirrors/sync-hook-registrations.cjs`, `hook-registry.json`), then render the 22 entries (`.pi/extensions/*.ts`). Verify: `--check` lists 22 template drifts before the write, then prints `PASS ... 22 Pi extensions resolve`.
- [x] T016 [P] Hold every entry to the template (`runtime/tests/hook-adapter-path-parity.vitest.ts`) and test the migration (`runtime/cli/tests/hook-registration-sync.vitest.ts`). Verify: 154/154 and 10/10, and the template test fails on a one-line entry.
- [x] T017 [P] Follow the lazy import in `doctor:git` (`.skilled/commands/doctor/scripts/git-setup-check.cjs`, `T/git-setup-check.test.cjs`). Verify: `--tool pi` prints `pi (active): registered`, and the suite passes 87/87.
- [x] T018 [P] Follow a single relative import one hop in the wiring check (`hook-wiring-check.cjs`, `T/hook-wiring-check.test.cjs`). Verify: the new test fails on the item-5 script and passes at 53/53.
- [x] T019 [P] Type-check the template through three entries (`tsconfig.pi.json`, `.pi/types/pi-coding-agent.d.ts`, `.pi/types/node-globals.d.ts`). Verify: `tsc -p tsconfig.pi.json` exits 0 and `--listFiles` names the three entries.
- [x] T020 Describe the rendered entry and the session notice (`.pi/SYNC.md`, `.pi/README.md`, `.pi/extensions/README.md`, `.skilled/CROSS-CLI.md`, the hook READMEs). Verify: the stale-wording grep lists only history, templates and unrelated uses.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [x] T011 Run the Code Mode probe against patched and unpatched builds. Verify: unpatched starts both manuals, patched starts one and registers the other on demand.
- [x] T012 Apply the anchored review-core entry in a copy of `H`. Verify: `sk-skill-check` C3 passes with the block one heading level down, and a second apply prints `0 changed`.
- [x] T013 Run the full doctor runner in the worktree (`T/run-all.sh`). Verify: `7 suite(s) passed, 0 failed`, node:test `1327` pass, `0` skipped.
- [x] T021 Load the rendered entries through Pi's installed loader in scratch trees (full, without `.skilled`, one missing dependency, throwing adapter) on Pi 1.5.0 and 1.5.2. Verify: 22 loaded with 37 handlers, then 0 errors with one notice, then a notice naming one entry, then a Pi load error.
- [x] T022 Rerun the full doctor runner after items 5 and 6 (`T/run-all.sh`). Verify: `7 suite(s) passed, 0 failed`, node:test `1331` pass, `0` skipped.
- [x] T023 [P] Say that the ask step's `register_manual` loads the disabled manual (`mcp-tooling/mcp-mobbin`, `mcp-tooling/mcp-refero`, `mcp-tooling/mcp-click-up`). Verify: the stale-wording grep finds no claim outside changelogs, and `sk-skill-check` prints `NO FINDINGS (1 UNKNOWN)` on each mode, as before.
- [x] T024 [P] Cover the backup path outside the source repo (`T/agents-md-embed.test.cjs`). Verify: the case passes with the `.skilled/output/` line in `.gitignore` and fails without it.
- [x] T025 [P] Run the Pi type gate and wiring check in CI (`.github/workflows/pi-entry-checks.yml`, `.github/workflows/README.md`, `.pi/SYNC.md`). Verify: on a clean clone both exit 0 after `provision_worktree`, and `check-gate-inputs.sh` prints `RESULT: PASSED`.
- [x] T026 Rename the `create-skill-*` assets to `create-sk-skill-*` and drop the advisor stem (`.skilled/commands/create/assets/`, `score-command-transcripts.mjs`). Verify: router `--check` prints `routers=42 clean=42`, and the advisor transcript tests pass 359/359.
- [x] T027 Run the no-token Code Mode probe and the live registration. Verify: `{"tools":[]}` with no `npx` call, then `register_manual` succeeds for all three manuals.
- [x] T028 Rerun the doctor runner and the spec-kit cli vitest. Verify: `7 suite(s) passed, 0 failed` with 1332 pass, and 2592 passed, 0 failed.
- [x] T029 Fold the republish lessons into the changelog skill (`sk-doc/sk-create-changelog/SKILL.md` §8 and §10). Verify: `git tag -d` on a missing tag exits 0 with the tolerant form, and `validate_document.py` reports 0 issues.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: a fresh session with no OAuth tokens opens no sign-in tab. The shipped dist with an empty `HOME` lists `{"tools":[]}` and makes no `npx` call, and live `register_manual` loads all three manuals after the operator picked Ready
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist
<!-- FILL: Fill each checklist section below. GOOD: Each CHK line names the command that answers it. WEAK: The checklist is done. -->

<!-- ANCHOR:protocol -->
## Verification Protocol
<!-- FILL: Keep the three rows and add the rule this packet uses for a blocked task. GOOD: P0 blocks close. P1 needs a recorded reason. WEAK: Follow the priorities. -->

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
<!-- FILL: Write one check per setup fact, each with a command. GOOD: CHK-001 [P0] The start commit is in `goal.md` section 4. WEAK: Setup is ready. -->

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available: Node 24 and the primary checkout's Code Mode `node_modules`
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
<!-- FILL: Write one check per file rule. A command must answer it. GOOD: CHK-010 [P0] `bash -n scripts/rotate-logs.sh` exits 0. WEAK: Code is clean. -->

- [x] CHK-010 [P0] `tsc` on the Code Mode server and `node --check overlay-engine.cjs` exit 0
- [x] CHK-011 [P0] No console errors or warnings in the probe or the overlay suites
- [x] CHK-012 [P1] A missing anchor refuses the entry instead of appending
- [x] CHK-013 [P1] Comments carry the reason only, with no packet or task ids
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist
<!-- FILL: Write one check per acceptance criterion. GOOD: CHK-020 [P0] `--keep 3` leaves 3 archives. WEAK: Tests pass. -->

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Code Mode probe and the review-core apply run by hand in scratch
- [x] CHK-022 [P1] Edge cases tested: duplicate anchor lines, an appended block moving, a missing anchor
- [x] CHK-023 [P1] Error scenarios validated: the missing-anchor refusal leaves the destination unchanged
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security
<!-- FILL: Write one check per security surface. Write `N/A` with a reason when none applies. GOOD: CHK-030 [P0] `scripts/rotate-logs.sh` reads no credential. WEAK: Security is fine. -->

- [x] CHK-030 [P0] No hardcoded secrets: the config edits add a boolean, and the Pi edits remove a provider name
- [x] CHK-031 [P0] `insertBefore` is checked to be one non-empty line before use
- [x] CHK-032 [P1] No OAuth sign-in starts without a user choice once the three manuals are disabled
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
<!-- FILL: Write one check per document that must agree. GOOD: CHK-040 [P1] `spec.md` and `tasks.md` both name `--keep <n>`. WEAK: Docs are updated. -->

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate
- [x] CHK-042 [P2] `overlays.md` documents `insertBefore`, and `validate_document.py` reports 0 issues
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
<!-- FILL: Write one check per file location rule. GOOD: CHK-050 [P1] Test copies live under `scratch/test/`. WEAK: Files are organized. -->

- [x] CHK-050 [P1] Temp files live in the session scratchpad, outside the repository
- [x] CHK-051 [P1] The packet's scratch/ holds only `.gitkeep`
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary
<!-- FILL: Count the boxes by priority and write the three totals. GOOD: P0 12, P1 13, P2 1. WEAK: Most items done. -->

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 9 | 9/9 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-18
<!-- /ANCHOR:summary -->

---
