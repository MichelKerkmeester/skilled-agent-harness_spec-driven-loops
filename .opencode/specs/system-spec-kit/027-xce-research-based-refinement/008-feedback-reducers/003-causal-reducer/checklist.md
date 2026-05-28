---
title: "Checklist — 003 Session-Trace Causal Reducer"
description: "Verification checklist for the causal reducer child."
trigger_phrases:
  - "009 causal reducer checklist"
importance_tier: "normal"
contextType: "task"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/008-feedback-reducers/003-causal-reducer"
    last_updated_at: "2026-05-12T07:20:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Scaffolded Level 2 child packet"
    next_safe_action: "Implement tasks.md"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md", "implementation-summary.md"]
    completion_pct: 0
---
# Verification Checklist: Session-Trace Causal Reducer

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

P0 items block completion.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] `001-aggregator` dependency available.
- [ ] CHK-002 [P0] Phase 002 guardrails confirmed.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Reducer is deferred-only.
- [ ] CHK-011 [P0] Existing manual edges are not overwritten.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Source selection deterministic.
- [ ] CHK-021 [P0] Caps enforced.
- [ ] CHK-022 [P0] Idempotent rerun behavior verified.
- [ ] CHK-023 [P1] Flag-off creates no edges.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX COMPLETENESS

- [ ] CHK-900 [P0] All requirements in spec.md map to checklist items before implementation completion.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] Evidence string includes session/query IDs only, no comment text.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] ENV flag documented by child 005.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Reducer lives under `mcp_server/lib/feedback/`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

Pending implementation.
<!-- /ANCHOR:summary -->
