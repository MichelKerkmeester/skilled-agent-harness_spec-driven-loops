---
title: "Tasks: Phase 20: capability-additions"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "goal plugin capability additions tasks"
  - "phase 020 tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/032-goal-opencode-plugin/020-capability-additions"
    last_updated_at: "2026-07-03T00:00:00Z"
    last_updated_by: "claude-fable-5"
    recent_action: "Authored task list from plan.md"
    next_safe_action: "T001 baseline once phases 016-019 are green"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-goal.js"
      - ".opencode/commands/goal_opencode.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "032-remediation-authoring-20260703"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 20: capability-additions

<!-- SPECKIT_LEVEL: 1 -->

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

- [x] T001 Confirm phases 016/017/019 landed and run the full mk-goal test suite as a green baseline; evidence: `node --test .opencode/plugins/tests/mk-goal-*.test.cjs` -> 85 tests, 85 pass, 0 fail, duration 1801.736166ms
- [x] T002 [P] Inventory action-enum consumers and env-name collisions; evidence: `rg -n "GOAL_ACTIONS|executeGoalAction" .opencode/plugins/ .opencode/commands/goal_opencode.md` found enum/dispatch at `.opencode/plugins/mk-goal.js`; `rg -n "MK_GOAL_MAX_AUTO_TURNS|MK_GOAL_MAX_WALL_MS" .opencode/plugins .opencode/commands .opencode/skills` returned no runtime/doc-surface collisions before change
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 e-3.2: add `history` action reading `.archive/` read-only; evidence: `mk-goal-capabilities.test.cjs` subtest `history lists archived goals and leaves active state untouched`
- [x] T004 e-3.2: route `history` verb and document its output; evidence: `.opencode/commands/goal_opencode.md` documents `archive_count` and `archive_N_*` fields
- [x] T005 e-3.4: add doctor/health action; evidence: `mk-goal-capabilities.test.cjs` subtest `doctor and health report counts, log sizes, last sweep, and orphan candidates read-only`
- [x] T006 e-3.5: add `resume` action; evidence: `mk-goal-capabilities.test.cjs` subtest `resume reactivates paused and usage-limited goals but rejects terminal resurrection`
- [x] T007 e-3.6: parse `set <objective> --budget N` and pass `tokenBudget`; evidence: command router docs plus `token budget appears in status and invalid set budgets fail closed`
- [x] T008 e-3.7: add `MK_GOAL_MAX_AUTO_TURNS`/`MK_GOAL_MAX_WALL_MS` env overrides and status surfacing; evidence: `env caps configure new goals and status exposes remaining budgets`
- [x] T009 e-3.9: widen provider-limit detection behind one predicate; evidence: `provider-limit detection accepts 429 variants and quota patterns only`
- [x] T010 e-3.8: record retry-after recovery deadline and un-suppress lazily once passed; evidence: `retry-after deadline recovers lazily and malformed payloads stay suppressed`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Doc Sync (REQ-007 — P0, precedes test verification)

- [x] T011 Sync new verbs/envs/status fields into `goal_plugin.md`; evidence: doc names `history`, `resume`, `doctor`, `health`, `MK_GOAL_MAX_AUTO_TURNS`, `MK_GOAL_MAX_WALL_MS`, `remaining_auto_turns`, `remaining_wall_ms`, and `provider_retry_after_ms`
- [x] T012 Add new `MK_GOAL_*` vars with code-matching defaults; evidence: `ENV_REFERENCE.md` now documents `MK_GOAL_MAX_AUTO_TURNS` default `8` and `MK_GOAL_MAX_WALL_MS` default `1800000`
- [x] T013 [P] Sync both feature catalogs; evidence: both catalog files name the new verbs, env caps, status fields, and capability test
- [x] T014 [P] Sync both manual-testing playbooks with steps for the new verbs; evidence: both playbooks include `history`, `doctor`, `health`, `resume`, budget, and env-cap checks

### Test And Deferral Verification

- [x] T015 Add `node:test` subtests for every new path; evidence: new `.opencode/plugins/tests/mk-goal-capabilities.test.cjs` adds 8 passing subtests
- [x] T016 Run the full mk-goal test suite; evidence: `node --test .opencode/plugins/tests/mk-goal-*.test.cjs` -> 93 tests, 93 pass, 0 fail, duration 2002.763334ms; delta vs baseline +8 tests, 0 new failures
- [x] T017 Grep-verify doc sync; evidence: `rg` checks for each new verb/env across all six doc surfaces plus `goal_opencode.md` completed with hits in every surface
- [x] T018 Record the e-3.10 deferral disposition in implementation-summary.md; evidence: see `implementation-summary.md` Key Decisions and Verification
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Fresh full-suite test run pasted as evidence, not cited from a prior run
- [x] Doc-sync grep evidence pasted for all six surfaces
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Finding source**: `../scratch/2026-07-03-four-reviewer-audit-findings.md` §B e-3.2 (T003-T004), e-3.4 (T005), e-3.5 (T006), e-3.6 (T007), e-3.7 (T008), e-3.9 (T009), e-3.8 (T010), doc-sync NOTE (T011-T014, T017), e-3.10 deferral (T018)
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
