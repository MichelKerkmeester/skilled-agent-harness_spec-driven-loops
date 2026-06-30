---
title: "Implementation Plan: Route-Proof Validation"
description: "Plan for adding route-proof validator fields + resolving prior-research evidence + citation fixes. To be detailed by /speckit:plan."
trigger_phrases: ["plan", "route-proof-validation"]
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/001-route-proof-validation"
    last_updated_at: "2026-06-30T15:30:00Z"
    last_updated_by: "opencode-gpt"
    recent_action: "Plan stub scaffolded; awaiting /speckit:plan"
    next_safe_action: "/speckit:plan this phase"
    blockers: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "031-001-001-plan"
      parent_session_id: "031-001-phase-parent"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Route-Proof Validation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

## APPROACH
Awaiting `/speckit:plan`. High-level approach (from spec.md §3): add route-proof fields (`mode`/`target_agent`/`agent_definition_loaded`/echoed `Resolved route`) to the 4 deep-mode validators; resolve prior-research evidence base; fix citation/slug drift (C1-C3).

## AFFECTED SURFACES
See spec.md §3 "Files Likely to Change".

## VERIFICATION PATH
Construct a schema-valid-but-wrong-mode artifact; assert the validator rejects it (closes F27). Then `validate.sh --strict`.
