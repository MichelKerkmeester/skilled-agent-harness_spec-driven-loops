---
title: "Tasks: Phase 25: goal-binding-record-and-launcher"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "goal binding record launcher tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 25: goal-binding-record-and-launcher

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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Baseline: run the relaunch gate in the three environments the 023 phase used and record the totals (`.skilled/hooks/session-relaunch/tests/`). `node --test` over `tests/*.test.cjs` and `.opencode/plugins/tests/session-relaunch.test.cjs`: 752 of 752, exit 0, with the loop variables set, unset and foreign. Pi vitest: 52 of 52.
- [x] T002 Read how `spec_folder` is validated and decide whether `spec_folder` plus `goal.md` already suffices (`lib/relaunch-core.cjs`, `bin/session-relaunch.cjs`). Decided by the operator default: keep the separate `goal_packet` field, because it is the only signal that the sender had a goal. See spec.md section 10.
- [x] T003 Re-read the Claude session log goal entries and the goal record shape under `.skilled/skills/.state/goal/`. Claude logs a `goal_status` attachment (`met`, `sentinel`, `condition`, and `failed` on a failed check) and a `/goal` local command entry. OpenCode keeps `<sha256 of session id>.json`, the runtime-neutral core keeps a workspace, runtime and session scoped file, and both carry `status` and `packetPath`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Write the failing tests first: field written, field refused outside the repository, claim prints it, launcher exports it, switch removes it, old note unchanged (`tests/`)
- [x] T005 Add the field, its validation and the per-runtime resolver (`lib/relaunch-core.cjs`)
- [x] T006 Write the field at prepare and keep and print it at claim (`bin/session-relaunch.cjs`)
- [x] T007 Export the packet to the receiver and honor `SESSION_RELAUNCH_GOAL=0` (`.skilled/bin/skilled-loop`)
- [x] T008 Describe the field and the switch (`handoff.md`, `README.md`, `ENV-REFERENCE.md`, `.env.example`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Negative control: run the new tests against the code before this phase and confirm each fails. Run against a `git archive HEAD` copy: 37 of the 54 new tests fail there. The other 17 pin unchanged defaults (field absent, switch off, unreadable record, empty field, a packet only the note cwd holds), so they pass on the old code by design.
- [x] T010 Rerun the whole relaunch gate in all three environments and report the delta against the baseline. 806 of 806, exit 0, in all three: delta +54 tests, 0 failures. Pi vitest 52 of 52.
- [x] T011 Run the sk-code drift guards and `validate.sh --strict` on this folder. `run-all-drift-guards.sh` exit 0, all 4 guards PASSED, 10 warnings none in the changed files. `verify_alignment_drift.py --fail-on-warn` over the hooks folder and `.skilled/bin`: 0 findings. `validate.sh --strict`: see the implementation summary.
- [x] T012 Fix pass, baseline: relaunch gate 806 of 806 with the loop variables set, unset and foreign, exit 0 each. Pi vitest 52 of 52.
- [x] T013 Fix pass, failing-first tests: Codex and a Claude session with no log write no field, a note prepared again after its goal ended loses the field, a held value is replaced or removed, and a two-hop wrapper test where the second note has no packet. 16 fail against the code before the fix. Negative control on the wrapper: with the per-hop `unset` in `skilled-loop` replaced by a no-op, only the new test fails.
- [x] T014 Fix pass, code: Codex and a missing or unreadable Claude log resolve to nothing, `recordGoalPacket` replaces or removes the field and skips an unchanged note, and `prepare` and `keep` re-resolve on every call (`lib/relaunch-core.cjs`, `bin/session-relaunch.cjs`). The `keep` step of the worktree spec-folder test also asserts exit 0.
- [x] T015 Fix pass, docs: README, `handoff.md`, `ENV-REFERENCE.md` and this phase's spec, acceptance criteria and summary state when the field is written and who owns it.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: no tmux hop was run, so the wrapper path rests on the stub-runtime wrapper suite, which runs the real wrapper and CLI
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
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
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `node --check` on each changed file and `bash -n .skilled/bin/skilled-loop` are clean `node --check` clean on the core, the CLI and the three test files, `bash -n` and `shellcheck` clean on `skilled-loop`, exit 0. Rerun in the fix pass: `node --check` on the changed files and `bash -n` on `skilled-loop`, which that pass did not change.
- [x] CHK-011 [P0] No console errors or warnings in the suite output No `not ok` line in the 814-test TAP output.
- [x] CHK-012 [P1] Error handling implemented, and a failed step never blocks a session start The CLI swallows a failed `recordGoalPacket` write and `resolveGoalPacket` returns empty on any read error, so prepare still succeeds (tests: unreadable record, unreadable Claude log, unknown runtime).
- [x] CHK-013 [P1] Code follows project patterns and carries no artifact ids in comments Comment hygiene grep over the added lines finds no spec path, packet, phase, task or ADR id.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met (see acceptance-criteria.md) All five rows of acceptance-criteria.md are Met.
- [x] CHK-021 [P0] The full relaunch gate passes in all three environments, delta against the baseline reported 752 of 752 before, 806 of 806 after the first build and 814 of 814 after the fix pass, in the set, unset and foreign loop environments, exit 0 each.
- [x] CHK-022 [P1] Edge cases tested Field absent, empty field, switch off, deleted goal.md, packet only in the note cwd, a log with no goal entry.
- [x] CHK-023 [P1] Error scenarios validated Outside the repository, absolute, joined, dot-dot, symlinked packet, symlinked goal.md, missing goal.md and a goal.md directory are each refused by `goalPacketProblem`. In a note, `prepare` and `keep` replace or remove such a value, and `claim` and `consume` do not hand it on.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence` or `test-isolation`. Class: cross-consumer, since the note frontmatter is shared by the CLI, the wrapper and every adapter. No review finding is being fixed.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. `rg -n spec_folder` over the hooks and the wrapper lists the readers: the CLI (validatedNote, consume, the broken-note fallback), the killer, the nudge, the compaction pointer and the OpenCode and Pi adapters. Only the CLI and the wrapper handle `goal_packet`, and the others read other keys of the same flat frontmatter.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs and tests. Consumers of the note frontmatter checked: `parseHandoff` accepts any flat key, the nudge text and the adapters never list keys, and the `consume` JSON gains `goal_packet` only when a packet is usable, so every existing `deepEqual` on its output still holds.
- [x] CHK-FIX-004 [P0] The packet path carries adversarial table tests: outside the repository, a joined path, a symlink out, no `goal.md` and an empty value. Table tests in the core suite and in the CLI suite for prepare and keep, covering outside the repository, absolute, joined by a space or a newline, dot-dot, a symlinked packet, a symlinked goal.md, no goal.md and an empty value.
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. Axes: sender runtime (7: claude, pi, opencode, codex, cursor, hermes, devin), goal present or absent, switch on or off, command (prepare, keep). The record-per-runtime table runs 6 rows for each of prepare and keep (every runtime but Codex, which has its own no-field test), and the absent and off rows run for opencode and pi.
- [x] CHK-FIX-006 [P1] Hostile env and global-state variant executed when tests or code read process-wide state. The whole gate ran with this session's loop variables set, unset and foreign, and the new suites scrub `SESSION_RELAUNCH_GOAL`, `SESSION_RELAUNCH_GOAL_PACKET`, `OPENCODE_GOAL_STATE_DIR` and `CLAUDE_CONFIG_DIR` from the sandbox environment.
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or an explicit diff range, not a moving branch-relative range. Pinned to the working tree on top of fc9a104eb6: `git diff fc9a104eb6` over the ten files listed in the implementation summary. Nothing is committed.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets, and no credential or key read, logged or written The resolver reads goal records and a session log tail and no credential or key file.
- [x] CHK-031 [P0] The packet path is validated before it is written or exported `resolveGoalPacket` returns only a packet `goalPacketProblem` accepted, and `claim` and `consume` check it again before they report it.
- [x] CHK-032 [P1] Auth and authz not applicable: the state files are local and keep their `0o700` directory mode No state file is created by this phase, so the `0o700` mode is untouched.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks synchronized Spec, plan and tasks agree with the implementation summary.
- [x] CHK-041 [P1] Code comments carry the reason, with no artifact ids Comments name the reason and carry no artifact ids.
- [x] CHK-042 [P2] README updated where the behavior changes The relaunch README, the env reference, `.env.example` and `/speckit:handoff` name the field and the switch.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files kept in the session scratchpad or scratch/ Scratch output went to the session scratchpad.
- [x] CHK-051 [P1] scratch/ holds only evidence this packet cites scratch/ is untouched and holds no evidence this packet cites.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-25
<!-- /ANCHOR:summary -->

---
