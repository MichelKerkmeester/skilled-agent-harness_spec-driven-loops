---
title: "Verification Checklist: sk-design two real bugs"
description: "Verification Date: not started"
trigger_phrases:
  - "sk-design real bugs checklist"
  - "audit router loop checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/017-real-bugs"
    last_updated_at: "2026-06-27T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded the Level-2 checklist, all items pending"
    next_safe_action: "Mark items with evidence as the two bug fixes land"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "author-154-017-real-bugs"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: sk-design two real bugs

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!--
SELF-CHECK:
- Confirm every required item has concrete evidence before marking it complete.
- Keep optional deferrals explicit, owned, and separate from blockers.
FAILURE MODES:
- Rubber-stamping the checklist, vague tested-claims, and hidden blocker deferrals.
-->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] The lockfile, backend README, and audit router config read before any edit
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The regenerated `package.json` is consistent with the lockfile root metadata and the documented dependencies
- [ ] CHK-011 [P0] The audit scoring loop iterates the keyword list and applies each intent's configured weight
- [ ] CHK-012 [P1] The audit register-load reuses the 016 loader mechanism, not a second path
- [ ] CHK-013 [P1] Both fixes follow the existing backend and audit-router patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] `cd backend && npm install` succeeds against the regenerated manifest
- [ ] CHK-021 [P0] The audit router parses and runs, and the replay loads `../shared/register.md`
- [ ] CHK-022 [P1] The five representative audit prompts still route to the same intents after the loop fix
- [ ] CHK-023 [P1] An empty-keyword intent does not crash the corrected loop
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] The manifest bug is classed `instance-only` (md-generator backend) and the audit loop bug is classed `algorithmic`
- [ ] CHK-FIX-002 [P0] No other sk-design backend ships a lockfile without a manifest, confirmed by grep
- [ ] CHK-FIX-003 [P0] Consumers of the audit scoring loop (router-replay, benchmark, manual playbook) are checked after the loop fix
- [ ] CHK-FIX-004 [P0] The register-load path is exercised for outside-root and non-register paths so only `../shared/register.md` is allowed
- [ ] CHK-FIX-005 [P1] The audit replay axes (five prompts by intent) are listed before completion is claimed
- [ ] CHK-FIX-006 [P1] The empty-keyword and missing-register variants are exercised, not just the happy path
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch range
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No secrets introduced by the manifest or router change
- [ ] CHK-031 [P0] The regenerated manifest pins dependency versions consistent with the lockfile, not floating ranges that widen supply-chain risk
- [ ] CHK-032 [P1] The audit register-load accepts only the explicit `../shared/register.md` path
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec.md, plan.md, and tasks.md stay synchronized with the implemented fixes
- [ ] CHK-041 [P1] The backend README setup steps confirmed accurate after the manifest lands
- [ ] CHK-042 [P2] The audit SKILL.md router prose updated if the loop or load comment changes
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Changes confined to the md-generator backend and the design-audit packet
- [ ] CHK-051 [P1] No stray temp files left in the packet
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 12 | 0/12 |
| P2 Items | 2 | 0/2 |

**Verification Date**: not started
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
