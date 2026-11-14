---
title: "Goal: Phase 12: purpose-reader-precision"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "purpose reader precision goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/012-purpose-reader-precision"
    last_updated_at: "2026-11-14T11:26:57Z"
    last_updated_by: "scaffold"
    recent_action: "Built and verified the phase"
    next_safe_action: "Build phase 013"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plan-012-purpose-reader-precision"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 12: purpose-reader-precision

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Print a Purpose line only when a packet states its purpose, and state the same rule on every hop, so the purpose that survives a handover is the real one.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | This phase changes only the files its `spec.md` lists under Files to Change, plus its own packet docs. |
| D2 | The reader decides what a purpose is. The hooks print what it returns and the hop rules describe the same decision in words. |
| D3 | The opening paragraph of a `## PROBLEM & PURPOSE` section is the problem, never the purpose. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [x] REQ-001: the probe prints `combinedOpening":0` and `layout sentence as own purpose: 0` (T030)
- [x] REQ-002: `nudge.test.cjs` prints `pass 89` with the new parts and the workflow test prints `passed=150 failed=0` (T031, T032)
- [x] REQ-003: the Pi walk-up test passes and both hooks call `enclosingPacketFolder` (T029)
- [x] REQ-004 to REQ-007: the four purpose suites print `Tests  82 passed (82)` (T029)
- [x] REQ-008: the Pi hook declares no local purpose type and logs a failed import (T015, T033)
- [x] REQ-009: no `goal.md` in phases 006 to 011 holds `completion_pct: 100` (T035)
- [x] REQ-010: typecheck, lint, build, continuity and mirror checks print their baselines (T028, T032 to T034)
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
| Phase planned | Done | 2026-11-14 at `1bedb33577`, baselines in `plan.md` section 5 |
| Operator answers | Done | 2026-11-14: the five packets get no new sentence, a packet's own problem line takes precedence over its parent's, the goal objective carries the packet's own problem line and tests write their temporary folders to the system temp dir. All four are the planner's defaults |
| Build start | Done | Start commit `26cfcdb603`. Every section 5 baseline reproduced. The probe read `own purpose read: 2931 of 2984`, `combinedOpening":203`, layout 8, short 7, three packets more than at planning. All 59 search texts counted as stated |
| Phase built | Done | One DeepSeek V4.1 Flash max worker on dsh 0.2.2-rc.3 applied E1 to E24 in about three minutes, exit 0 with a `completed` final event |
| Probe after | Done | `combinedOpening":0`, layout 0, short 0, `own purpose read: 2721 of 2985`. The extra packet was the first rc.3 repin phase, since folded into `017-dsh-rc3-repin`, which states its own purpose |

### Deviations and findings

| Item | Note |
|------|------|
| Deep-review findings | Folded in from `../review/review-report.md`: R1-P1-001, R1-P1-002, R1-P2-001, R2-P2-001 and R3-P2-001 are items A3, A4, A10, A11 and A5 |
| Dropped | The other-worktree half of Fable A-P2-4 and the `Not recorded` fragment did not reproduce in this tree |
| Plan miss fixed | E8 kept `join` in the `session-prime.ts` path import, but E10 removed its last call. eslint failed with `'join' is defined but never used`, so the orchestrator changed the import to `resolve` alone |
| Count shift | T012 expects 2 uses of `RECOVERED_CONTEXT_TITLE` right after E9. E11 adds a third, so the final count is 3 |
<!-- /ANCHOR:log -->
