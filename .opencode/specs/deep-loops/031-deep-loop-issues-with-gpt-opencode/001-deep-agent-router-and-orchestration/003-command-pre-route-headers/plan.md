---
title: "Implementation Plan: Command Pre-Route Headers"
description: "Plan for adding Resolved route headers across all 4 deep modes. To be detailed by /speckit:plan."
trigger_phrases: ["plan", "command-pre-route-headers"]
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/003-command-pre-route-headers"
    last_updated_at: "2026-06-30T15:30:00Z"
    last_updated_by: "opencode-gpt"
    recent_action: "Plan stub scaffolded; awaiting /speckit:plan"
    next_safe_action: "Wait for 002, then /speckit:plan"
    blockers: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "031-001-003-plan"
      parent_session_id: "031-001-phase-parent"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Command Pre-Route Headers

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

## APPROACH
Awaiting `/speckit:plan`. High-level approach (from spec.md §3 + research §3 table): add `Resolved route:` headers at each mode's prompt/CLI seam — research/review (template + CLI); context (inline seat + one-shot); council (round prompt + executor_config_json).

## AFFECTED SURFACES
See spec.md §3 "Files Likely to Change".

## VERIFICATION PATH
Each mode's dispatched prompt begins with the Resolved route header; native `agent:` fields preserved; `validate.sh --strict`.
