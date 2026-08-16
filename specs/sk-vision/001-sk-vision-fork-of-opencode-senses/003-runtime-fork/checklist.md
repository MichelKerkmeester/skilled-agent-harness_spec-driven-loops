---
title: "Verification Checklist: sk-vision 003 runtime fork"
description: "Verification checklist for sk-vision runtime fork and rebranding."
trigger_phrases:
  - "sk-vision runtime checklist"
importance_tier: "critical"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "sk-vision/001-sk-vision-fork-of-opencode-senses/003-runtime-fork"
    last_updated_at: "2026-08-15T17:45:00.000Z"
    last_updated_by: "cursor-grok"
    recent_action: "Specified GPU load then status or SKIP."
    next_safe_action: "Wait for 002 before pre-implementation checks."
    blockers: []
    key_files:
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-003-runtime-20260815"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: sk-vision 003 runtime fork

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

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

- [ ] CHK-001 [P0] Requirements documented in spec.md | Evidence: Spec Section 4
- [ ] CHK-002 [P0] Technical approach defined in plan.md | Evidence: Plan Section 1
- [ ] CHK-003 [P1] Dependencies identified and available | Evidence: Plan Section 6
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Zero residual `SENSES_` / `opencode-senses` / `senses_` identifiers (LICENSE copyright excepted) | Evidence: Ripgrep scan output
- [ ] CHK-011 [P0] TypeScript code compiles to dist/plugin.js | Evidence: dist/plugin.js file check
- [ ] CHK-012 [P1] Error handling uses `<SK-VISION ...>` tag format | Evidence: src/core/context-builder.ts
- [ ] CHK-013 [P1] Cache paths point to `~/.cache/sk-vision` | Evidence: src/providers/types.ts & python/runtime.py
- [ ] CHK-014 [P0] package.json name is `sk-vision` (not `@opencode-ai/sk-vision`) | Evidence: vision-runtime/package.json
- [ ] CHK-015 [P0] Tools are the 13 dump `sk_vision_*` names; no `sk_vision_query` | Evidence: tools.ts after rebrand
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Unit tests pass cleanly | Evidence: Test runner output
- [ ] CHK-021 [P1] GPU smoke is JSON-RPC `load` then `status` on NVIDIA Ampere+ or Apple Silicon, or SKIP with hardware note. `ping` is not the smoke. | Evidence: Implementation summary
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class | Evidence: Planned for phase execution
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed | Evidence: Planned for phase execution
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed symbols | Evidence: Planned for phase execution
- [ ] CHK-FIX-004 [P0] Path and boundary cases handled cleanly | Evidence: Planned for phase execution
- [ ] CHK-FIX-005 [P1] Matrix axes and row count listed | Evidence: Planned for phase execution
- [ ] CHK-FIX-006 [P1] Hostile env variant verified | Evidence: Planned for phase execution
- [ ] CHK-FIX-007 [P1] Evidence pinned to fix commits | Evidence: Planned for phase execution
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded tokens or sensitive paths | Evidence: Static code scan
- [ ] CHK-031 [P0] Subprocess stdio communication bounded and sanitized | Evidence: client.ts review
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan, tasks, and checklist synchronized | Evidence: Spec suite audit
- [ ] CHK-041 [P1] MIT copyright notice retained and updated in LICENSE | Evidence: LICENSE file
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] All runtime code scoped under `.opencode/skills/sk-vision/vision-runtime/` | Evidence: Directory listing
- [ ] CHK-051 [P1] Scratch directory cleaned before completion | Evidence: scratch/ check
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 0/15 |
| P1 Items | 18 | 0/18 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-08-15
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] Architecture decisions documented in decision-record.md | Evidence: ADR-001
- [ ] CHK-101 [P1] All ADRs have status (Accepted) | Evidence: decision-record.md
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale | Evidence: decision-record.md
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] Daemon startup overhead bounded | Evidence: NFR-P01 check
- [ ] CHK-111 [P1] Memory footprint documented | Evidence: Implementation summary
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback procedure documented | Evidence: Plan Section 8
- [ ] CHK-121 [P1] Build artifacts ready for adapter import | Evidence: dist/plugin.js check
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] MIT License compliance verified | Evidence: LICENSE audit
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] All spec documents synchronized | Evidence: validate.sh output
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Technical Lead | Architect | [ ] Approved | 2026-08-15 |
<!-- /ANCHOR:sign-off -->
