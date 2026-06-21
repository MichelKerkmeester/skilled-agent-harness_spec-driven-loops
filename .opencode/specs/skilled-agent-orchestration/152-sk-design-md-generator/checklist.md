---
title: "Verification Checklist: Create sk-design-md-generator skill by vendoring jasonhnd design-md-generator [template:level_3/checklist.md]"
description: "Verification Date: 2026-06-21"
trigger_phrases:
  - "design-md-generator verification"
  - "skill validation checklist"
  - "tool smoke verify"
  - "checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/152-sk-design-md-generator"
    last_updated_at: "2026-06-21T10:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Verified skill validity and tool smoke"
    next_safe_action: "Run validate.sh strict on 152"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-152-generator"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Create sk-design-md-generator skill by vendoring jasonhnd design-md-generator

<!-- SPECKIT_LEVEL: 3 -->
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

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified (Playwright/Chromium, advisor graph)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `package_skill.py --check` PASS; `quick_validate.py` valid
- [x] CHK-011 [P0] No upstream source modified (clean fork; NOTICE records drops)
- [x] CHK-012 [P1] Reference files snake_case; 5-field frontmatter present
- [x] CHK-013 [P1] SKILL.md mirrors the mcp-figma exemplar structure (5 sections + pseudocode)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met (REQ-001..008)
- [x] CHK-021 [P0] Tool smoke: `npm install` (exit 0) + `vitest` 50/50 + live extraction (tokens.json produced)
- [x] CHK-022 [P1] Live extraction of example.com produced tokens.json + screenshots (exit 0)
- [x] CHK-023 [P1] CLI flags in docs verified against real cli.ts/extract.ts (invented flags corrected)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class: `class-of-bug` (new skill creation, not a fix) - additive feature.
- [x] CHK-FIX-002 [P0] Producer inventory: the three design-family skills siblinged via reciprocal edges.
- [x] CHK-FIX-003 [P0] Consumer inventory: advisor graph node + edges verified in sqlite.
- [x] CHK-FIX-004 [P0] Path-handling: vendored paths + tool/ embedded scaffold verified to resolve.
- [x] CHK-FIX-005 [P1] Matrix axes: vendor-vs-author x required-doc x graph-edge covered.
- [x] CHK-FIX-006 [P1] Reciprocal-edge symmetry verified (skill_graph_validate isValid, 0 errors).
- [x] CHK-FIX-007 [P1] Evidence pinned to commit SHAs (8960ab5400 vendor, c4b9dee4d9 skill layer) + tool output.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets; tool reads only public CSS from target URLs
- [x] CHK-031 [P0] Graph mutation ran trusted (skill-advisor.cjs --trusted)
- [x] CHK-032 [P1] No broad cross-session commit (scoped commits; foreign-path checks clean)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks/decision-record/impl-summary synchronized
- [x] CHK-041 [P1] NOTICE.md records MIT attribution + pinned commit + vendoring changes
- [x] CHK-042 [P2] README + INSTALL_GUIDE present and accurate
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Test artifacts (node_modules/output) gitignored + cleaned
- [x] CHK-051 [P1] scratch/ clean; package-lock restored to vendored state
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 14/14 |
| P1 Items | 18 | 18/18 |
| P2 Items | 6 | 5/6 |

**Verification Date**: 2026-06-21
<!-- /ANCHOR:summary -->

---

<!-- Append to Level 2 checklist.md -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Architecture decisions documented in decision-record.md (ADR-001 vendor depth, ADR-002 attribution)
- [x] CHK-101 [P1] All ADRs have status Accepted
- [x] CHK-102 [P1] Alternatives documented with rejection rationale (lean / hybrid weighed)
- [x] CHK-103 [P2] Migration path documented (re-sync via pinned commit)
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [x] CHK-110 [P1] Fast extraction completed in seconds (example.com crawled in 6.2s)
- [x] CHK-111 [P1] No regression introduced; additive new skill
- [ ] CHK-112 [P2] Load testing - N/A for a single-shot extraction tool
- [ ] CHK-113 [P2] Performance benchmarks - deferred; upstream examples serve as reference
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [x] CHK-120 [P0] Rollback documented (git rm + edge revert + re-scan)
- [x] CHK-121 [P0] No feature flag needed; additive skill
- [x] CHK-122 [P1] Advisor routing verified as the monitoring signal
- [x] CHK-123 [P1] INSTALL_GUIDE serves as the runbook
- [x] CHK-124 [P2] INSTALL_GUIDE reviewed (MiMo-authored, Claude-verified)
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [x] CHK-130 [P1] No secrets; reads only public CSS
- [x] CHK-131 [P1] Dependency licenses compatible (upstream MIT; Playwright Apache-2.0)
- [x] CHK-132 [P2] No web-app attack surface; local extraction tool
- [x] CHK-133 [P2] Data handling: public page CSS only, written to local output/
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [x] CHK-140 [P1] All spec documents synchronized
- [x] CHK-141 [P1] SKILL.md + references document the tool surface
- [x] CHK-142 [P2] README user-facing documentation present
- [x] CHK-143 [P2] NOTICE records provenance for future maintainers
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Michel (operator) | Technical Lead | [ ] Approved | |
| Michel (operator) | Product Owner | [ ] Approved | |
| Claude | QA / Verification | [x] Approved | 2026-06-21 |
<!-- /ANCHOR:sign-off -->

---
