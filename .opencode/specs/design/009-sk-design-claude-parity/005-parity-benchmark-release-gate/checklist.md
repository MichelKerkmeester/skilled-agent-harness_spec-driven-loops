---
title: "Verification Checklist: Phase 005 - Parity Benchmark Release Gate"
description: "Verification checklist for proving sk-design parity release readiness with benchmark, manual, routing, procedure, proof, and preservation evidence."
trigger_phrases:
  - "phase 005 checklist"
  - "parity release gate checklist"
  - "benchmark verification"
  - "release readiness"
importance_tier: "high"
contextType: "validation"
_memory:
  continuity:
    packet_pointer: "design/009-sk-design-claude-parity/005-parity-benchmark-release-gate"
    last_updated_at: "2026-07-05T00:00:00.000Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Created Phase 005 checklist."
    next_safe_action: "Use checklist during future benchmark execution and release decision."
---
# Verification Checklist: Phase 005 - Parity Benchmark Release Gate

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist + level3-arch | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | Hard blocker | Cannot claim release readiness until verified or explicitly accepted by release owner |
| **[P1]** | Required | Must complete or receive explicit approval to defer |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Phase 004 implementation evidence exists before benchmark execution.
- [ ] CHK-002 [P0] Release owner is named for failures, conditional release, and baseline overwrite authority.
- [ ] CHK-003 [P0] Existing baseline status is known before any no-regression claim.
- [ ] CHK-004 [P0] Golden prompt corpus covers all five public `sk-design` modes.
- [ ] CHK-005 [P1] Manual playbook scenarios and negative controls are approved before execution.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Single `sk-design` advisor identity remains intact.
- [ ] CHK-011 [P0] Five public modes remain the visible execution lanes.
- [ ] CHK-012 [P0] Private procedure behavior stays internal after public mode selection.
- [ ] CHK-013 [P0] Public mode outputs cite context/proof evidence before completion claims.
- [ ] CHK-014 [P1] No hidden dependency on Claude-only tooling, hidden subagents, or non-OpenCode execution assumptions is introduced.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Golden prompt benchmark records baseline, current result, delta, verdict, and evidence for every prompt.
- [ ] CHK-021 [P0] Procedure-selection checks pass for expected procedures and reject negative controls.
- [ ] CHK-022 [P0] Context manifest and proof gates pass for every accepted output.
- [ ] CHK-023 [P0] Anti-slop review lane passes or blocks release.
- [ ] CHK-024 [P0] Accessibility review lane passes or blocks release.
- [ ] CHK-025 [P0] Hierarchy review lane passes or blocks release.
- [ ] CHK-026 [P0] Interaction review lane passes or blocks release.
- [ ] CHK-027 [P0] Polish and usefulness review lanes pass or block release.
- [ ] CHK-028 [P0] md-generator preservation tests pass or block release.
- [ ] CHK-029 [P1] Manual playbook scenarios include reviewer notes for parity feel and usefulness.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-030 [P0] Each failed benchmark lane has a failure class: `router`, `procedure-selection`, `proof`, `design-quality`, `md-generator-preservation`, `manual-usefulness`, or `baseline-discipline`.
- [ ] CHK-031 [P0] Each failed P0 lane is blocked, fixed, or accepted by release owner with written rationale.
- [ ] CHK-032 [P0] Negative controls demonstrate false-positive prevention.
- [ ] CHK-033 [P1] Evidence gaps are listed in the release report.
- [ ] CHK-034 [P1] Current run artifacts are compared against the named baseline, not an implicit moving target.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-040 [P0] No private procedure content, secrets, or hidden prompts are exposed through public docs or reports.
- [ ] CHK-041 [P0] Negative controls include unsafe or out-of-scope requests that must fail safely.
- [ ] CHK-042 [P1] md-generator side effects remain explicit and separately verified.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-050 [P0] `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, and `implementation-summary.md` stay synchronized.
- [ ] CHK-051 [P0] `description.json` and `graph-metadata.json` exist in the Phase 005 root.
- [ ] CHK-052 [P0] Release report states ready, blocked, or conditional with evidence.
- [ ] CHK-053 [P1] Implementation summary remains planned/not-started until benchmark execution occurs.
- [ ] CHK-054 [P1] No standard spec artifact includes a Table of Contents section.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-060 [P0] Packet creation writes only inside the Phase 005 root.
- [ ] CHK-061 [P0] Future benchmark artifacts are append-only unless overwrite authority is recorded.
- [ ] CHK-062 [P1] Temporary or scratch artifacts are removed before claiming release readiness.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 29 | 0/29 |
| P1 Items | 10 | 0/10 |
| P2 Items | 0 | 0/0 |

**Verification Date**: Not run; planned/not-started.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3: Architecture Verification

- [ ] CHK-100 [P0] Release gate keeps router/advisor invariants separate from live usefulness and design-quality evidence.
- [ ] CHK-101 [P0] Decision record defines release authority for failures and baseline overwrite.
- [ ] CHK-102 [P1] Alternatives document why router-only release is rejected.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] Benchmark execution time and reviewer time are recorded for future repeatability.
- [ ] CHK-111 [P1] md-generator preservation tests include any relevant runtime or extraction-duration notes.
- [ ] CHK-112 [P2] Optional load-style repetition is completed if benchmark flakiness appears.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Release-ready claim is blocked until all P0 lanes pass or release owner accepts risk.
- [ ] CHK-121 [P0] Baseline overwrite, if any, has recorded authority.
- [ ] CHK-122 [P1] Release report includes rollback or correction procedure for bad benchmark artifacts.
- [ ] CHK-123 [P1] Runbook or playbook references are recorded for repeat execution.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] Evidence does not persist secrets, private prompts, or unrelated user data.
- [ ] CHK-131 [P1] Public/private procedure boundary remains documented and respected.
- [ ] CHK-132 [P2] Accessibility review notes include any unresolved WCAG-related risks.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] All Phase 005 docs are synchronized after benchmark execution.
- [ ] CHK-141 [P1] Release report links to or summarizes benchmark, manual, and preservation evidence.
- [ ] CHK-142 [P2] Knowledge transfer notes are added if release is approved.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Release owner | Benchmark and release authority | Pending | |
| Design reviewer | Usefulness and parity review | Pending | |
| Maintainer | OpenCode-native routing and md-generator preservation | Pending | |
<!-- /ANCHOR:sign-off -->
