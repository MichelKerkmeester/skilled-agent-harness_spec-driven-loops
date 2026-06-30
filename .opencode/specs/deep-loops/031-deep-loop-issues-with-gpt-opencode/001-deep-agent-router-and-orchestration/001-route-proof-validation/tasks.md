---
title: "Tasks: Route-Proof Validation"
description: "Task list for phase 001. To be detailed by /speckit:plan."
trigger_phrases: ["tasks", "route-proof-validation"]
importance_tier: "critical"
contextType: "implementation"
_memory: { continuity: { packet_pointer: "deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/001-route-proof-validation", last_updated_at: "2026-06-30T15:30:00Z", last_updated_by: "opencode-gpt", recent_action: "Tasks stub scaffolded", next_safe_action: "/speckit:plan", blockers: [], session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "031-001-001-tasks", parent_session_id: "031-001-phase-parent" }, completion_pct: 0, open_questions: [], answered_questions: [] } }
---
# Tasks: Route-Proof Validation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

## PHASE 1: SETUP
- [ ] T001 [P0] Add route-proof fields to `deep_research_auto.yaml:940-968` validator (mode/target_agent/agent_definition_loaded/Resolved route) — `.opencode/commands/deep/assets/deep_research_auto.yaml`
- [ ] T002 [P0] Mirror route-proof fields in review/context/council validators
- [ ] T003 [P0] Construct wrong-mode rejection test (closes F27)

## PHASE 2: EVIDENCE + CITATIONS
- [ ] T004 [P0] R10 — locate or formally accept-as-axiom the prior-research evidence base; write decision-record
- [ ] T005 [P1] C1 — fix ai-council mode claim in research-prompt.md
- [ ] T006 [P1] C3 — fix/remove spec.md predecessor_research broken path

## PHASE 3: VERIFY
- [ ] T007 [P0] `validate.sh --strict` passes
