---
title: "Tasks: GPT First-Dispatch Verification Smoke"
description: "Task list for phase 004. To be detailed by /speckit:plan."
trigger_phrases: ["tasks", "gpt-verification-smoke"]
importance_tier: "critical"
contextType: "implementation"
_memory: { continuity: { packet_pointer: "deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/004-gpt-verification-smoke", last_updated_at: "2026-06-30T15:30:00Z", last_updated_by: "opencode-gpt", recent_action: "Tasks stub scaffolded", next_safe_action: "Wait for 001+002+003", blockers: [], session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "031-001-004-tasks", parent_session_id: "031-001-phase-parent" }, completion_pct: 0, open_questions: [], answered_questions: [] } }
---
# Tasks: GPT First-Dispatch Verification Smoke

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

## PHASE 1: PROCEDURE
- [ ] T001 [P0] Write `verification-smoke.md` — per-mode before/after steps using existing provenance + route-proof assertions

## PHASE 2: RUN
- [ ] T002 [P0] Run GPT-backed first dispatch per mode (research/review/context/council) on a tiny packet
- [ ] T003 [P0] Record native/Claude baseline per mode

## PHASE 3: DECISION
- [ ] T004 [P0] Record FIX-5 escalation decision (correct → close 005; mis-dispatch → unpark 005)
