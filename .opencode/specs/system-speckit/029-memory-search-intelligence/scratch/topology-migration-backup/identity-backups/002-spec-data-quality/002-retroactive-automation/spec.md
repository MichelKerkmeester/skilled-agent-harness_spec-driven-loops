---
title: "Feature Specification: Retroactive Automation Phase Parent"
description: "Retroactive Automation subgroup of the spec-data-quality track: scheduled/doctor/feedback automation over stored metadata."
trigger_phrases:
  - "retroactive automation"
  - "spec data quality retroactive automation"
  - "retroactive automation phase parent"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/002-spec-data-quality/002-retroactive-automation"
    last_updated_at: "2026-07-04T17:11:48.231Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Grouped the retroactive automation phases under one subparent during the 005 restructure"
    next_safe_action: "None — subgroup complete"
    blockers: []
    key_files:
      - "spec.md"
      - "011-scheduled-dq-sweep/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-27-028-005-002-retroactive-automation-parent"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The retroactive automation phases are grouped under this subparent (3 children)."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Retroactive Automation

Groups retroactive and scheduled data-quality automation phases, including sweep scheduling, doctor routing, and retrieval-feedback edges that repair or enrich existing packet records after write time.

| Child | Description |
|-------|-------------|
| `011-scheduled-dq-sweep/` | Scheduled DQ Sweep |
| `012-doctor-dq-route/` | Doctor DQ Route |
| `013-retrieval-feedback-edge/` | Retrieval Feedback Edge |
