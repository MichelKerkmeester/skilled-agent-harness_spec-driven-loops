---
title: "Tasks: Phase 27: goal-rebind-claude-and-codex"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "goal rebind claude codex tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 27: goal-rebind-claude-and-codex

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

- [x] T001 Read the phase 024 verdicts and pick the Claude path in writing, citing the probe. Picked the goal command as the start prompt with the claim as start context; probe A selects it, probe B rules out a start hook (ADR-001 in `decision-record.md`).
- [x] T002 Baseline: run the relaunch gate in the three environments and record the totals. 814 of 814 with the loop variables set, unset and foreign, exit 0 each. Pi vitest 52 of 52, goal hook suites 187 of 187 (six files), `.opencode/plugins/tests/*.test.cjs` 551 of 551, all exit 0 (`scratch/gate/`).
- [x] T003 Read the hook registry and the generated Claude settings rows to see how a hook is registered. `.claude/settings.json` already registers `compact-pointer.mjs` on `SessionStart` with an empty matcher, so the `startup` source needs no new hook and no registry row.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Write the failing tests first: a path per verdict, over-budget slice not sent, no packet, switch off (`tests/`). 19 tests in `goal-handover.test.cjs` (new, 8), `claude-adapters.test.cjs` (4) and `skilled-loop.test.cjs` (7).
- [x] T005 Add the slice helper that renders the `chat_slice` and checks `packet_budget` (`lib/goal-handover.cjs`).
- [x] T006 Add the Claude receiver path chosen by the probes (`skilled-loop` start prompt and claim variable, `claude/compact-pointer.mjs` start claim). No registry row changed. Also the Hermes export of `HERMES_SPEC_FOLDER`.
- [x] T007 Add the Codex seed instruction (`codex/prompt-seed.mjs`). Deferred under ADR-002, nothing built: a hop restarts the runtime it left and a Codex sender never carries a packet, so no Codex receiver can be handed one. Its `goals_1.sqlite` `thread_goals` table held 0 rows.
- [x] T008 Describe the path and its limits (`README.md`, and the tests README).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Negative control: run the new tests against the code before this phase and confirm each fails. Against `git archive HEAD`: the helper suite cannot load, 3 of 4 new hook tests and 5 of 7 new wrapper tests fail; the rest pin unchanged behavior. Five mutations of the final code each failed one test (`scratch/gate/`).
- [x] T010 Rerun the whole relaunch gate in all three environments and report the delta. 833 of 833, exit 0 in each; delta +19 tests, 0 failures. Pi vitest 52, goal hooks 187 and plugins 551, unchanged.
- [x] T011 Run the sk-code drift guards and `validate.sh --strict` on this folder. Guards: 4 of 4 passed, `shellcheck` and the rule-copies check exit 0. `validate.sh` result is in `implementation-summary.md`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: three live Claude hops (`scratch/claude-live-*`)
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
- [x] CHK-003 [P1] The phase 024 verdicts and the phase 025 export are available, or the seed path is recorded as the choice The phase 024 verdicts and the phase 025 export are read; the start-prompt path is recorded in ADR-001.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Changed code files pass `node --check` and `bash -n` where they apply `node --check` on the code and test files and `bash -n` and `shellcheck` on `skilled-loop`: clean.
- [x] CHK-011 [P0] No console errors or warnings in the suite output No warnings in the suite output.
- [x] CHK-012 [P1] Error handling implemented, and a failed step never blocks a session start A refused slice or a failed render is a one-line warning and the receiver still starts on the claim seed; the hook exits 0 on every refusal.
- [x] CHK-013 [P1] Code follows project patterns and carries no artifact ids in comments Comments carry the reason with no artifact ids; `verify_alignment_drift.py --fail-on-warn` reports 0 findings.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met (see acceptance-criteria.md) All AC rows are Met, Waived or Superseded with evidence.
- [x] CHK-021 [P0] The full relaunch gate passes in all three environments, delta against the baseline reported 814 before, 833 after, exit 0 in the set, unset and foreign loop environments; delta +19.
- [x] CHK-022 [P1] Edge cases tested Exactly 4,000 characters passes and 4,001 does not; a note with no packet; a packet that lost `goal.md`.
- [x] CHK-023 [P1] Error scenarios validated A failing goal command, a missing one, output with frontmatter, markup, a NUL byte, no slice line and an unparseable one are each one-line refusals.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence` or `test-isolation`. Finding class: `class-of-bug` for a receiver that cannot take a goal as a record (Claude), `matrix/evidence` for Codex (unreachable).
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. Same-class producers: `rg -n "prompt-seed|additionalContext" .skilled/hooks/session-relaunch` lists the seed builders; only `compact-pointer.mjs` needed a start branch.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs and tests. Consumers of the slice: the goal posture rule and `budget-and-handoff.md` section 4, both unchanged. Callers of `skilled-loop` outputs: the wrapper tests.
- [x] CHK-FIX-004 [P0] The packet path and the slice carry adversarial table tests: outside-root path, over-budget slice, frontmatter in the slice and an empty slice. Adversarial tables in `goal-handover.test.cjs`: outside-root and malformed packet paths (no command runs), over-budget slice, frontmatter and markup in the slice, empty slice, NUL byte.
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. Matrix: runtime (Claude, Hermes, five others) x switch (on, off) x packet (named, none, refused) x slice (ok, over, unknown budget, empty); 7 wrapper tests, 4 hook tests, 8 helper tests.
- [x] CHK-FIX-006 [P1] Hostile env and global-state variant executed when tests or code read process-wide state. The whole gate ran with the loop variables set, unset and foreign; the new suites scrub `SKILLED_LOOP_CLAIM_SEED` and `HERMES_SPEC_FOLDER`.
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or an explicit diff range, not a moving branch-relative range. Evidence is pinned to the working tree on top of `28b0d197e8`, uncommitted.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets, and no credential or key read, logged or written No secret read or written; `coder/.env` untouched; raw Claude transcripts were reduced to extracts and deleted.
- [x] CHK-031 [P0] The packet path and the slice are validated before a hook or seed sends them The packet path is checked by `goalPacketProblem` before `goal.cjs` runs, and the slice is checked before the wrapper sends it.
- [x] CHK-032 [P1] Auth and authz not applicable: the state files are local and keep their `0o700` directory mode
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks synchronized
- [x] CHK-041 [P1] Code comments carry the reason, with no artifact ids
- [x] CHK-042 [P2] README updated where the behavior changes `README.md` and the tests README.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files kept in the session scratchpad or scratch/ Temp files lived in the session scratchpad.
- [x] CHK-051 [P1] scratch/ holds only evidence this packet cites `scratch/` holds the harness, the three live runs and the gate counts this packet cites.
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
