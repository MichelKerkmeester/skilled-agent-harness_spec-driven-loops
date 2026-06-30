---
title: "Implementation Plan: Agent Dispatch Hardening"
description: "Plan for landing deep.md + orchestrate Deep Route field + Claude mirrors. To be detailed by /speckit:plan."
trigger_phrases: ["plan", "agent-dispatch-hardening"]
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/002-agent-dispatch-hardening"
    last_updated_at: "2026-06-30T15:30:00Z"
    last_updated_by: "opencode-gpt"
    recent_action: "Plan stub scaffolded; awaiting /speckit:plan"
    next_safe_action: "Wait for 001, then /speckit:plan"
    blockers: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "031-001-002-plan"
      parent_session_id: "031-001-phase-parent"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Agent Dispatch Hardening

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

## APPROACH
Awaiting `/speckit:plan`. High-level approach (from spec.md §3): land `deep.md` from the iter-4 draft (`../../research/iterations/iteration-004.md`); add `Deep Route:` field to `orchestrate.md:206-208`; mirror both to `.claude/agents/`.

## AFFECTED SURFACES
See spec.md §3 "Files Likely to Change".

## VERIFICATION PATH
Route resolution per mode (via mode-registry); Claude-flex regression test (all must PASS per iter 6); `validate.sh --strict`.
