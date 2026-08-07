---
title: "Verification Checklist: Skill Routing Optimization Mode"
description: "QA checklist for the deep-improvement routing-optimization capability: audit coverage, methodology completeness, command posture, and anti-gaming."
trigger_phrases:
  - "routing optimization mode checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/031-smart-routing-benchmark-program/003-routing-optimization-mode"
    last_updated_at: "2026-07-09T05:03:26Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored the routing-optimization-mode checklist"
    next_safe_action: "Implement the optimize mode + command; run the cross-skill audit"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-improvement/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session_01Ht7J9NZTEBBXwzTeNvras9"
      parent_session_id: null
    completion_pct: 20
    open_questions: []
    answered_questions:
      - "Optimize parent-router + per-child routing in deep-improvement with a command — operator-locked"
---
# Verification Checklist: Skill Routing Optimization Mode

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol
| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get approval |
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [x] CHK-001 [P0] The optimization is repeatable and signal-driven (proven on code-review) [EVIDENCE: packet 002 orphan-wiring + gold-alignment] (verified)
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality
- [x] CHK-002 [P1] Propose-by-default; apply behind an explicit flag (verified)
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing
- [ ] CHK-003 [P0] Cross-skill audit covers all children + both hubs
- [ ] CHK-004 [P1] Command optimize mode documented + argument-hint present
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
No additional fix-completeness checklist items were recorded in the existing checklist.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security
No security-specific checklist items were recorded in the existing checklist.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation
- [ ] CHK-005 [P0] Methodology reference includes the anti-gaming guard
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization
No file-organization checklist items were recorded in the existing checklist.
<!-- /ANCHOR:file-org -->

### Sign-off
- [~] CHK-006 [P1] Audit + methodology + command landed

<!-- ANCHOR:summary -->
## Verification Summary
| Category | Status |
|----------|--------|
| Audit + methodology + command | In progress |
<!-- /ANCHOR:summary -->
