---
title: "Verification Checklist: code-review Routing Optimization"
description: "QA checklist for wiring code-review's orphan references, aligning its gold, and confirming the score rise with no regression."
trigger_phrases:
  - "code-review optimization checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/054-smart-routing-benchmark-program/002-code-review-optimization"
    last_updated_at: "2026-07-09T05:03:21Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored the code-review routing-optimization checklist"
    next_safe_action: "Wire orphan refs into intents, align gold, re-benchmark"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code/code-review/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session_01Ht7J9NZTEBBXwzTeNvras9"
      parent_session_id: null
    completion_pct: 30
    open_questions: []
    answered_questions:
      - "Wire orphans + map ALWAYS into intents; no thoroughness change — operator-locked"
---
# Verification Checklist: code-review Routing Optimization

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
- [x] CHK-001 [P0] Root cause confirmed: D1intra/D2 = 100 (routes correctly); drag is D5 orphans + D3 gold under-spec [EVIDENCE: re-baseline dims D3=0 D5=85] (verified)
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality
- [ ] CHK-002 [P0] Router change is additive-only (pre-existing intents byte-unchanged)
- [x] CHK-003 [P1] Comment hygiene: durable WHY only in any touched code (verified)
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing
- [ ] CHK-004 [P0] D5 = 100 (0 orphan references)
- [ ] CHK-005 [P0] Mode-A verdict stays PASS; D3 > 0 on aligned gold
- [ ] CHK-006 [P1] Mode-B aggregate materially above 69
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
- [ ] CHK-007 [P1] Parent circularity meter updated with the optimized code-review score
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization
No file-organization checklist items were recorded in the existing checklist.
<!-- /ANCHOR:file-org -->

### Sign-off
- [~] CHK-008 [P1] Re-benchmark captured; no sibling regression

<!-- ANCHOR:summary -->
## Verification Summary
| Category | Status |
|----------|--------|
| Orphan wiring + gold alignment | In progress |
| Re-benchmark + meter | In progress |
<!-- /ANCHOR:summary -->
