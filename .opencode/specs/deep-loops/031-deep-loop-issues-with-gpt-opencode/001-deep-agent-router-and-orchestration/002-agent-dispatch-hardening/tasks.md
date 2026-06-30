---
title: "Tasks: Agent Dispatch Hardening"
description: "Task list for phase 002. To be detailed by /speckit:plan."
trigger_phrases: ["tasks", "agent-dispatch-hardening"]
importance_tier: "critical"
contextType: "implementation"
_memory: { continuity: { packet_pointer: "deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/002-agent-dispatch-hardening", last_updated_at: "2026-06-30T15:30:00Z", last_updated_by: "opencode-gpt", recent_action: "Tasks stub scaffolded", next_safe_action: "Wait for 001, then /speckit:plan", blockers: [], session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "031-001-002-tasks", parent_session_id: "031-001-phase-parent" }, completion_pct: 0, open_questions: [], answered_questions: [] } }
---
# Tasks: Agent Dispatch Hardening

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

## PHASE 1: DEEP.MD
- [ ] T001 [P0] Create `.opencode/agents/deep.md` from iter-4 draft (`../../research/iterations/iteration-004.md`)
- [ ] T002 [P0] Verify route table agrees with `mode-registry.json`

## PHASE 2: ORCHESTRATE
- [ ] T003 [P0] Add `Deep Route:` field to `orchestrate.md:206-208` (deep routes only)

## PHASE 3: MIRRORS
- [ ] T004 [P0] Create `.claude/agents/deep.md` mirror
- [ ] T005 [P0] Mirror orchestrate change to `.claude/agents/orchestrate.md`

## PHASE 4: VERIFY
- [ ] T006 [P0] Claude-flex regression test (all PASS per iter 6)
- [ ] T007 [P0] `validate.sh --strict` passes
