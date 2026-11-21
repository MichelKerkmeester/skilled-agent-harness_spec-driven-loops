---
title: "Goal: Align the spec-kit CLI deep-research reducer test with the leaf-first Next Focus contract"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "reducer test focus contract goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/015-reducer-test-focus-contract"
    last_updated_at: "2026-11-21T09:25:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-child-authoring-015"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Align the spec-kit CLI deep-research reducer test with the leaf-first Next Focus contract

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** The spec-kit CLI deep-research reducer test asserts the Next Focus contract phase 004 shipped, so the Spec-Kit Check workflow no longer fails on it, and each case still reaches the branch its name describes.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Only the test file changes. The reducer and `continuity-thread.cjs` stay as they are, because the leaf-first rule is the intended contract, not a regression. |
| D2 | The answer-seeded and fallback cases recommend the resolved `Question B` in their second iteration, so the reducer skips it and both keep their original Next Focus assertions. No case is renamed or added. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [x] From `.skilled/skills/system-spec-kit/runtime/cli`, `npx vitest run --config ../../vitest.config.ts --project cli tests/deep-research-reducer.vitest.ts` exits 0 and prints `Tests  13 passed (13)`.
- [x] `git show -U0 af471c253e2 -- .skilled/skills/system-spec-kit/runtime/cli/tests/deep-research-reducer.vitest.ts` shows exactly one removed and one added `expect(` line, both inside the `writes idempotent registry, strategy, and dashboard outputs from iteration state` case.
- [x] Outside `015-reducer-test-focus-contract/`, `git show --stat af471c253e2` lists only the reducer test file, the parent `spec.md` and the parent `graph-metadata.json`, and no `reduce-state.cjs` or `continuity-thread.cjs`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG
<!-- FILL: Record each step with its command output. Keep this table current. GOOD: T001 Done. `ls logs/archive | wc -l` printed 3. WEAK: Progress is good. -->

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Goal retrofitted | Done | 2026-11-21, authored from this phase spec.md REQ-001, REQ-002, SC-002 and tasks.md after the phase finished in af471c253e2 |
| Reducer test file | Done | 2026-11-21 at the integration worktree HEAD: the criterion 1 command exited 0, Test Files 1 passed (1), Tests 13 passed (13) |
| Commit scope | Done | git show -U0 af471c253e2 on the test file: 2 expect( lines (one removed, one added) at old line 291, inside the case opening at line 250; --stat lists the test file, parent spec.md and parent graph-metadata.json outside this folder |
| SC-001 not a criterion | Deviation | The full spec-kit CLI project run (SC-001) is not a goal criterion: the 2026-11-21 retrofit ran in a shared tree where only targeted test files may run. tasks.md T006 records the 2026-11-20 full-project run |

### Deviations and findings

| Item | Note |
|------|------|
<!-- /ANCHOR:log -->
