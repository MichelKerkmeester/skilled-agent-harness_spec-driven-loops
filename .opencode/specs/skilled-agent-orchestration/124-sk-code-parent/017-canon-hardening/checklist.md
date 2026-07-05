---
title: "Verification Checklist: Phase 17 canon hardening"
description: "Unchecked verification checklist for the planned parent-hub canon hardening phase."
trigger_phrases:
  - "phase 017 checklist"
  - "canon hardening verification"
  - "bundleRules verification"
importance_tier: "high"
contextType: "implementation"
status: "Draft"
parent: "skilled-agent-orchestration/124-sk-code-parent"
phase: "017"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/124-sk-code-parent/017-canon-hardening"
    last_updated_at: "2026-07-05T00:00:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Phase planned and documented"
    next_safe_action: "Start T001 canon source inventory"
---
# Verification Checklist: Phase 17 canon hardening

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

All checklist items are intentionally unchecked because this phase is planned and not yet executed.

<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md [SOURCE: brief lines 17-26; master plan lines 38-47]
- [ ] CHK-002 [P0] Technical approach defined in plan.md [SOURCE: master plan lines 61-63]
- [ ] CHK-003 [P1] Dependencies identified and available [SOURCE: master plan lines 45-46; audit digest lines 3-5]

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Validator change is additive and tolerant [SOURCE: master plan lines 45-46]
- [ ] CHK-011 [P0] No new deep-loop parent-skill-check failures are introduced [SOURCE: audit digest lines 3-5]
- [ ] CHK-012 [P1] BundleRules parser rejects unknown mode references while accepting migration aliases [SOURCE: parent-skill-check.cjs lines 591-606]
- [ ] CHK-013 [P1] sk-code registry/router fields follow parent-hub canon naming and 4-part versions [SOURCE: master plan lines 41-42]

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] sk-code strict parent-skill-check passes after edits [SOURCE: master plan line 46; audit digest lines 42-43]
- [ ] CHK-021 [P0] deep-loop strict parent-skill-check failure count is unchanged or reduced [SOURCE: master plan lines 45-46]
- [ ] CHK-022 [P1] Changed JSON files parse successfully [SOURCE: spec.md Files to Change table]
- [ ] CHK-023 [P1] Template-schema-validator grep/read consistency checks pass for bundleRules fields [SOURCE: master plan lines 40 and 44]

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding is classified as cross-consumer because template, schema, validator, and sk-code reference files interact [SOURCE: audit digest lines 49-51]
- [ ] CHK-FIX-002 [P0] Same-class producer inventory covers parent hub router template and schema docs [SOURCE: master plan line 40]
- [ ] CHK-FIX-003 [P0] Consumer inventory covers parent-skill-check and downstream hub router consumers [SOURCE: parent_hub_router_schema.md consumer inventory]
- [ ] CHK-FIX-004 [P0] Validator matrix includes canonical surfaceBundle, orderedBundle, legacy template fields, legacy validator fields, and absent bundleRules [SOURCE: decision-record.md]
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed [SOURCE: plan.md affected surfaces]
- [ ] CHK-FIX-006 [P1] No hostile env/global-state variant is required unless parent-skill-check test harness reads process-wide strict flags beyond `PARENT_HUB_CHECK_STRICT` [SOURCE: validator strict-mode behavior]
- [ ] CHK-FIX-007 [P1] Verification evidence is pinned to command output or explicit diff range, not a moving branch statement [SOURCE: operating discipline]

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets introduced [SOURCE: file list is JSON/Markdown/validator code only]
- [ ] CHK-031 [P0] Input validation remains bounded to mode-reference validation in bundleRules [SOURCE: parent-skill-check.cjs check 5f]
- [ ] CHK-032 [P1] Auth/authz is not applicable because this phase changes local skill canon and validator behavior only [SOURCE: scope in spec.md]

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks/checklist/decision-record stay synchronized [SOURCE: brief lines 12-16]
- [ ] CHK-041 [P1] Code comments, if any, avoid ephemeral packet IDs and explain durable why only [SOURCE: brief lines 33-38]
- [ ] CHK-042 [P2] README updates are not applicable unless execution discovers a public README that repeats the conflicting bundleRules shape [SOURCE: master plan line 44]

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Phase execution modifies only files listed in spec.md unless the user approves scope change [SOURCE: brief lines 33-36]
- [ ] CHK-051 [P1] No metadata generation, description generation, graph backfill, or scratch files are created by this planning-doc phase [SOURCE: brief lines 33-36]

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 0/11 |
| P1 Items | 12 | 0/12 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Planned for execution phase; not yet run.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] Architecture decision documented in decision-record.md [SOURCE: user prompt line 5]
- [ ] CHK-101 [P1] Decision status reflects planned/not-yet-executed state [SOURCE: brief lines 17-24]
- [ ] CHK-102 [P1] Alternatives document the three current field vocabularies [SOURCE: master plan line 40]
- [ ] CHK-103 [P2] Migration path documents alias tolerance and later promotion path [SOURCE: master plan lines 45-46 and 54-59]

<!-- /ANCHOR:arch-verify -->
---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] Parent-skill-check runtime remains acceptable for three hub checks [SOURCE: phase 017 verification scope]
- [ ] CHK-111 [P1] No additional throughput target applies [SOURCE: local validator/documentation work only]
- [ ] CHK-112 [P2] Load testing is not applicable [SOURCE: no service runtime]
- [ ] CHK-113 [P2] Benchmark documentation is not part of this phase; phase 019 owns benchmark rollup [SOURCE: master plan lines 54-59]

<!-- /ANCHOR:perf-verify -->
---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback procedure documented and tested through checker reruns [SOURCE: plan.md rollback]
- [ ] CHK-121 [P0] Feature flag not applicable; migration safety comes from tolerant validator parsing [SOURCE: decision-record.md]
- [ ] CHK-122 [P1] Monitoring/alerting not applicable for local repo validator changes [SOURCE: scope in spec.md]
- [ ] CHK-123 [P1] Runbook exists through tasks.md and plan.md verification commands [SOURCE: tasks.md Phase 3]
- [ ] CHK-124 [P2] Deployment runbook review not applicable until phase 019 promotion [SOURCE: master plan lines 54-59]

<!-- /ANCHOR:deploy-ready -->
---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] Comment hygiene reviewed for validator code changes [SOURCE: brief lines 33-38]
- [ ] CHK-131 [P1] Dependency licenses not applicable; no new dependency planned [SOURCE: file list in spec.md]
- [ ] CHK-132 [P2] OWASP Top 10 not applicable [SOURCE: no network/auth surface]
- [ ] CHK-133 [P2] Data handling not applicable [SOURCE: no persisted data migration]

<!-- /ANCHOR:compliance-verify -->
---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] All spec documents synchronized [SOURCE: brief lines 12-16]
- [ ] CHK-141 [P1] API documentation not applicable unless validator CLI usage changes [SOURCE: scope in spec.md]
- [ ] CHK-142 [P2] User-facing documentation not applicable unless public sk-doc schema prose changes require a README pointer [SOURCE: master plan line 44]
- [ ] CHK-143 [P2] Knowledge transfer is covered by decision-record.md and implementation-summary.md after execution [SOURCE: Level 3 packet contract]

<!-- /ANCHOR:docs-verify -->
---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Scope owner | [ ] Approved for execution | |
| Implementer | Canon hardening executor | [ ] Completed verification | |

<!-- /ANCHOR:sign-off -->
