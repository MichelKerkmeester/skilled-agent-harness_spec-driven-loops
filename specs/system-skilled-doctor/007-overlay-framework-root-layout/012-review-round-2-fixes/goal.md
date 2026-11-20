---
title: "Goal: Phase 12: fix the Skilled findings of the second overlay layout review"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "review round 2 fixes goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skilled-doctor/007-overlay-framework-root-layout/012-review-round-2-fixes"
    last_updated_at: "2026-11-20T17:47:01Z"
    last_updated_by: "orchestrator"
    recent_action: "Authored the durable directive"
    next_safe_action: "Operator pushes Skilled main, then phase 011 re-pins Barter"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "review-round-2-fixes"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 12: fix the Skilled findings of the second overlay layout review

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Each Skilled-side finding of the second overlay layout review is fixed at its source with a test, or recorded as already fixed or false with evidence, and the fixes are merged on local Skilled main before phase 011 pushes.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Code changes are built on `worktrees/495-overlay-review-round-2-fixes` and merged into local Skilled main; nothing is pushed. |
| D2 | Each finding is a hypothesis: it is confirmed against the current code before it is fixed, and one already fixed or false is recorded with the evidence. |
| D3 | A relayout that moved every copy never exits as a failure, and a failure before the first move leaves no partial backup behind. |
| D4 | The custom overlay folder value in the engine tests is a neutral name, superseding phase 005's decision to keep `barter-overlays`. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [x] `node --test .skilled/commands/doctor/scripts/tests/overlay-engine-*.test.cjs` exits 0 on Skilled main with more than 263 tests.
- [x] `rg -n 'barter-overlays' .skilled/commands/doctor/scripts/tests` prints nothing on Skilled main.
- [x] `node --test .skilled/commands/doctor/scripts/tests/doctor-overlay-contract.test.cjs` exits 0 and `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0 on Skilled main.
- [x] `validate.sh --recursive --strict` on the parent packet prints `RESULT: PASSED`.
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
| Pre-commit probe under a hook `GIT_DIR` | Done | Already fixed by phase 009: its linked-worktree hook test fails on the engine before `3ddeef925dd` and passes at main tip |
| Relayout error contract | Done | Branch commit `b3470354ab7`; engine suite 268/268 |
| Packet records | Done | The amended phase 003 search prints nothing; 007 and 008 summaries corrected |
| Containment and git guard | Done | Branch commits 8459961bbca, 709646d2e7e, add6e839c6f, b439bdaeb59, 93198d56023; refusal tests fail on the engine before each |
| Re-pin staged tree root | Done | Branch commit d5b258c32e8; the sibling-stage test fails on the engine before it |
| Review and merge | Done | Fifth @review pass APPROVED at 93198d56023; merged on local main as 7ededf2efb1; engine 294/294 on main |

### Deviations and findings

| Item | Note |
|------|------|
| Rollback tests that pass before the fix | The restore-failed line with nothing skipped and the backup-removal line already existed, so their tests guard behavior that must not change rather than fail first |
<!-- /ANCHOR:log -->
