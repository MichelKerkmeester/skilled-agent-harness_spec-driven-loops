---
title: "Verification Checklist: sk-doc Router Path-Contract Fixes"
description: "Verification Date: pending (Status: Planned). Section 9 verification gates plus Section 10 acceptance matrix rows from research.md as QA items."
trigger_phrases:
  - "sk-doc routing fixes checklist"
  - "leaf resource contract verification"
  - "acceptance matrix qa items"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/012-sk-doc-routing-fixes"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored checklist from research.md Section 9 gates and Section 10 matrix"
    next_safe_action: "Leave unchecked until implementation lands. Verify with evidence, not by inspection"
    blockers:
      - "Sequenced after sibling packet 011-skill-advisor-routing-research per the 031 parent"
    key_files:
      - "checklist.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "012-sk-doc-routing-fixes-authoring"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: sk-doc Router Path-Contract Fixes

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

- [ ] CHK-001 [P0] Requirements documented in spec.md, traced to research.md Section 8's nine-step fix plan
- [ ] CHK-002 [P0] Technical approach defined in plan.md, nine dependency-ordered phases matching the fix plan
- [ ] CHK-003 [P1] Dependencies identified: contract library (Phase 1) gates every other phase and sibling packet 011-skill-advisor-routing-research gates implementation start
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `node --check` passes on every added or changed CJS file (Section 9 command 1)
- [ ] CHK-011 [P0] No console errors or warnings during manifest generation or parent-skill-check runs
- [ ] CHK-012 [P1] Fail-closed error handling implemented: invalid oracle and topology-digest mismatches block dispatch with zero denominators
- [ ] CHK-013 [P1] Contract library stays pure. No filesystem writes, no side effects outside `generate-leaf-manifest.cjs --write`
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

Section 9 verification gates.

- [ ] CHK-020 [P0] Command 2: `node .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs --check .opencode/skills/sk-doc` passes
- [ ] CHK-021 [P0] Command 3: `PARENT_HUB_CHECK_STRICT=1 node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/sk-doc` passes
- [ ] CHK-022 [P0] Command 4: `node --test .opencode/skills/sk-doc/create-skill/scripts/tests/leaf-resource-contract.test.cjs` passes
- [ ] CHK-023 [P0] Command 5: `node --test .opencode/commands/doctor/scripts/tests/parent-skill-check-leaf-manifest.test.cjs` passes
- [ ] CHK-024 [P1] Command 6: `npx vitest run --config .opencode/skills/system-deep-loop/deep-improvement/scripts/vitest.config.mjs .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/sk-doc-leaf-routing-contract.vitest.ts` passes
- [ ] CHK-025 [P1] Command 7: `npx vitest run --config .opencode/skills/system-deep-loop/deep-improvement/scripts/vitest.config.mjs --no-coverage` passes with zero new failures against the pre-fix baseline
- [ ] CHK-026 [P0] Command 8: fresh Mode-B live run completed against all 19 sk-doc fixtures, with report, config fingerprint and topology digest recorded
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

Section 10 acceptance matrix rows.

- [ ] CHK-MTX-001 [P0] Wrong-root fixed: SD-007, SD-009, SD-003, SD-016, SD-011 and SD-020 resolve to their expected composite pairs with recall 1. Prefixes convert only through a declared mode or alias, never through generic stripping
- [ ] CHK-MTX-002 [P0] Missing-leaf fixed: SD-013, SD-005, SD-004, SD-001, SD-010 and SD-018 show the expected pair valid, selected and observed. A missing alias or target blocks pre-dispatch rather than silently passing
- [ ] CHK-MTX-003 [P0] Over-bundle fixed: SD-015, SD-014, SD-006, SD-017 and SD-002 show the observed set equal to the selected-map union, zero unexpected entries and D3 equal to 1 where applicable. Deduplication happens by composite pair
- [ ] CHK-MTX-004 [P0] Clean preserved: SD-008 and SD-012 keep their current scores, zero waste and the same first-failing stage. The typed migration never reduces a clean score
- [ ] CHK-MTX-005 [P0] Structural: fresh D5 connectivity reads 100 on the new run. The report never reuses the old 20/100 value
- [ ] CHK-MTX-006 [P1] Invalid oracle: synthetic fixtures with a broken topology produce zero dispatch and are excluded from every scoring denominator, with fixture, topology and selection error counts kept separate
- [ ] CHK-MTX-007 [P1] Reproducibility: permuting registry or enumeration order produces identical manifest bytes and digest. No timestamps, no locale-dependent ordering, no absolute paths
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets introduced in the contract library, fixtures or templates
- [ ] CHK-031 [P0] `leafResourceId` containment check rejects any path resolving outside its packet root
- [ ] CHK-032 [P1] N/A. This change has no auth or authz surface, it is an internal routing contract
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec.md, plan.md, tasks.md, checklist.md and decision-record.md stay synchronized with research.md Sections 8-11
- [ ] CHK-041 [P1] Contract library functions carry doc comments explaining normalization and canonical-bytes behavior
- [ ] CHK-042 [P2] The nine corrected packets' SKILL.md files updated where a publicly documented leaf path changed
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only during implementation
- [ ] CHK-051 [P1] scratch/ cleaned before completion is claimed
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 18 | [ ]/18 |
| P1 Items | 19 | [ ]/19 |
| P2 Items | 13 | [ ]/13 |

**Verification Date**: pending, Status is Planned
<!-- /ANCHOR:summary -->

---

<!-- Append to Level 2 checklist.md -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] All six settled design decisions documented in decision-record.md, matching research.md Section 5
- [ ] CHK-101 [P1] All ADRs carry a status field (Proposed here, Accepted only after operator sign-off)
- [ ] CHK-102 [P1] Eliminated alternatives documented with rejection rationale, matching research.md Section 11
- [ ] CHK-103 [P2] Migration path documented: dual-read, single-write, fail-closed
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] Manifest generation stays deterministic (NFR-P01): repeated runs produce byte-identical output
- [ ] CHK-111 [P2] N/A. No throughput target applies, this is not a request-serving path
- [ ] CHK-112 [P2] Reproducibility check run with a permuted registry or enumeration order (mirrors CHK-MTX-007)
- [ ] CHK-113 [P2] No performance benchmark beyond the reproducibility check is required for this packet
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback procedure documented in plan.md Section 7 and exercised in a dry run before the fresh Mode-B live run
- [ ] CHK-121 [P1] N/A. No feature flag applies, the fail-closed guards (contract library, parent-check, topology validator) are the effective gate
- [ ] CHK-122 [P1] N/A. No production monitoring surface for this internal tooling change
- [ ] CHK-123 [P2] Runbook: the eight Section 9 commands in order serve as the operational runbook
- [ ] CHK-124 [P2] Runbook reviewed against the actual command output before the live benchmark run
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] No new external dependency added. No license review required
- [ ] CHK-131 [P2] N/A. Internal tooling change, no data-handling compliance surface
- [ ] CHK-132 [P2] N/A. No OWASP-relevant surface, this change touches no network input
- [ ] CHK-133 [P2] N/A. No user data processed by the contract library or the fixtures
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] All five packet docs (spec, plan, tasks, checklist, decision-record) synchronized before completion is claimed
- [ ] CHK-141 [P2] N/A. No public API for this internal routing contract
- [ ] CHK-142 [P2] Nine corrected packets' SKILL.md files reviewed for any public-facing path reference
- [ ] CHK-143 [P2] Research-to-implementation handoff documented in this checklist's traceability to research.md Sections 8-10
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Implementation Authorization | [ ] Approved | |
| Implementer | Technical Lead | [ ] Approved | |
| Verifier | Fresh Mode-B Benchmark Reviewer | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
