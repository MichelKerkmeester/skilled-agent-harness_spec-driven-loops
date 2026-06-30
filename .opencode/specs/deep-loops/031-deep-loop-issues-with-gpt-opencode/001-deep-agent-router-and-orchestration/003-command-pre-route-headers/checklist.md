---
title: "Verification Checklist: Command Pre-Route Headers"
description: "Verification Date: TBD"
trigger_phrases: ["verification", "checklist", "command-pre-route-headers"]
importance_tier: "critical"
contextType: "implementation"
_memory: { continuity: { packet_pointer: "deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/003-command-pre-route-headers", last_updated_at: "2026-06-30T15:30:00Z", last_updated_by: "opencode-gpt", recent_action: "Checklist stub scaffolded", next_safe_action: "Complete during implementation", blockers: [], session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "031-001-003-checklist", parent_session_id: "031-001-phase-parent" }, completion_pct: 0, open_questions: [], answered_questions: [] } }
---
# Verification Checklist: Command Pre-Route Headers

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->

## FUNCTIONAL
- [ ] Each deep mode's dispatched prompt begins with Resolved route header
- [ ] Council route fields reach seat prompts via executor_config_json (no YAML if_cli_opencode branch)
- [ ] Native `agent:` dispatch fields preserved (headers are additive)

## NO REGRESSION
- [ ] Existing prompt-pack bodies unchanged (Claude cues intact)

## VALIDATION
- [ ] `validate.sh --strict` passes on this phase
