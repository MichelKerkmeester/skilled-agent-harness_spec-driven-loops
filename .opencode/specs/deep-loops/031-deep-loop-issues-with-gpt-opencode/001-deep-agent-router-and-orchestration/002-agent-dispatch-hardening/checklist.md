---
title: "Verification Checklist: Agent Dispatch Hardening"
description: "Verification Date: TBD"
trigger_phrases: ["verification", "checklist", "agent-dispatch-hardening"]
importance_tier: "critical"
contextType: "implementation"
_memory: { continuity: { packet_pointer: "deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/002-agent-dispatch-hardening", last_updated_at: "2026-06-30T15:30:00Z", last_updated_by: "opencode-gpt", recent_action: "Checklist stub scaffolded", next_safe_action: "Complete during implementation", blockers: [], session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "031-001-002-checklist", parent_session_id: "031-001-phase-parent" }, completion_pct: 0, open_questions: [], answered_questions: [] } }
---
# Verification Checklist: Agent Dispatch Hardening

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->

## FUNCTIONAL
- [ ] deep.md resolves correct sub-agent for all 4 modes via mode-registry.json
- [ ] ai-council dual reachability preserved (stays mode: all)
- [ ] orchestrate emits Deep Route field for deep targets only

## PARITY + FLEX
- [ ] .claude/agents/{deep,orchestrate}.md mirrors present
- [ ] Claude-flex test all PASS (planning / evidence-response / advisory-metadata)

## VALIDATION
- [ ] `validate.sh --strict` passes on this phase
