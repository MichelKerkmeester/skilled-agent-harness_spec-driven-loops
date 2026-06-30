---
title: "Tasks: Command Pre-Route Headers"
description: "Task list for phase 003. To be detailed by /speckit:plan."
trigger_phrases: ["tasks", "command-pre-route-headers"]
importance_tier: "critical"
contextType: "implementation"
_memory: { continuity: { packet_pointer: "deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/003-command-pre-route-headers", last_updated_at: "2026-06-30T15:30:00Z", last_updated_by: "opencode-gpt", recent_action: "Tasks stub scaffolded", next_safe_action: "Wait for 002, then /speckit:plan", blockers: [], session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "031-001-003-tasks", parent_session_id: "031-001-phase-parent" }, completion_pct: 0, open_questions: [], answered_questions: [] } }
---
# Tasks: Command Pre-Route Headers

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

## PHASE 1: RESEARCH + REVIEW MODES
- [ ] T001 [P0] Add Resolved route header to research template (`prompt_pack_iteration.md.tmpl:1-5`) + CLI (`deep_research_auto.yaml:916-925`)
- [ ] T002 [P0] Mirror for review (template + `deep_review_auto.yaml:895-905`)

## PHASE 2: CONTEXT MODE
- [ ] T003 [P0] Add header to context inline seat prompt (`deep_context_auto.yaml:379-386`) + one-shot contract (`:442-456`)

## PHASE 3: COUNCIL MODE
- [ ] T004 [P0] Add header to council round prompt (`prompt_pack_round.md:14-29`) + propagate via executor_config_json

## PHASE 4: VERIFY
- [ ] T005 [P0] Native `agent:` fields preserved; prompt bodies intact
- [ ] T006 [P0] `validate.sh --strict` passes
