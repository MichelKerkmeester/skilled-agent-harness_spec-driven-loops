---
title: "Verification Checklist: Authentication and Tailnet Boundary"
description: "Evidence gates for authentication and tailnet boundary; product checks remain open until implementation."
trigger_phrases:
  - "pi remote auth and tailnet boundary"
  - "pi mobile phase 4"
  - "auth and tailnet boundary"
importance_tier: "critical"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/004-auth-and-tailnet-boundary"
    last_updated_at: "2026-08-10T18:43:21Z"
    last_updated_by: "codex"
    recent_action: "Authored the approved phase planning packet"
    next_safe_action: "Run this phase's definition-of-ready checks before implementation"
    blockers:
      - "Product implementation for this phase has not started"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    completion_pct: 0
---

# Verification Checklist: Authentication and Tailnet Boundary

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | Hard blocker | Cannot enable dependent capability or complete the phase |
| **[P1]** | Required | Must pass or receive explicit operator deferral |
| **[P2]** | Optional | May defer with owner and reason |

Checked items below prove planning readiness only. Product implementation and release evidence remain open.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements and measurable acceptance criteria are documented. - [EVIDENCE: `spec.md` requirements and success-criteria tables authored 2026-08-10]
- [x] CHK-002 [P0] Technical approach, dependencies, rollback, and test strategy are documented. - [EVIDENCE: `plan.md` quality-gates, dependencies, rollback, and testing anchors authored 2026-08-10]
- [x] CHK-003 [P1] Owned surfaces and downstream consumers are identified. - [EVIDENCE: `spec.md` Files to Change table and `plan.md` affected-surfaces inventory authored 2026-08-10]
- [ ] CHK-004 [P0] Live predecessor inputs, repository paths, versions, workspace, and negative controls are confirmed.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Repository-required format, lint, type, build, and package checks pass.
- [ ] CHK-011 [P0] Processes, browser, protocol, and deployment start without unexpected errors.
- [ ] CHK-012 [P1] Errors, timeouts, cancellation, retry bounds, and negative defaults are implemented.
- [ ] CHK-013 [P1] Implementation follows the routed repository surface and introduces no duplicate authority path.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] HTTP/WSS authentication integration suite passes with exact command and environment evidence.
- [ ] CHK-021 [P0] Origin and ticket replay suite passes with exact command and environment evidence.
- [ ] CHK-022 [P1] Authorization matrix suite passes with exact command and environment evidence.
- [ ] CHK-023 [P1] Target-host Serve spoof and bypass probes passes with exact command and environment evidence.
- [ ] CHK-024 [P1] Revocation and connection-limit tests passes with exact command and environment evidence.
- [ ] CHK-025 [P0] Safe negative controls fail before the implementation and pass only through the intended boundary afterward.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] This is scoped feature work, not an untriaged defect-remediation packet. - [EVIDENCE: `spec.md` problem, purpose, and scope explicitly define a new bounded phase]
- [x] CHK-FIX-002 [P0] Producers, consumers, policies, evidence surfaces, and successor handoff are inventoried. - [EVIDENCE: `plan.md` affected-surfaces and dependency matrices enumerate producer and consumer boundaries]
- [x] CHK-FIX-003 [P1] Independent matrix axes and adversarial classes are named before implementation. - [EVIDENCE: `spec.md` edge cases and `plan.md` testing strategy name boundary and failure classes]
- [ ] CHK-FIX-004 [P1] Final evidence is pinned to exact versions and the completed diff or revision.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No secret, raw credential, private host path, transcript, or approval payload leaks into code, logs, evidence, cache, audit, or push.
- [ ] CHK-031 [P0] Untrusted input, cross-workspace/session state, stale epochs, replays, malformed data, and unavailable dependencies fail closed.
- [ ] CHK-032 [P1] Authentication, authorization, revocation, containment, and redaction requirements applicable to this phase pass.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks, checklist, decision where required, and current state share the same planned scope. - [EVIDENCE: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md` where required, and `implementation-summary.md` cross-reviewed on 2026-08-10]
- [ ] CHK-041 [P1] Final implementation contracts and operator impacts are handed to phase 008.
- [ ] CHK-042 [P2] Optional examples and troubleshooting notes are added where evidence shows they are useful.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temporary output is confined to approved test or scratch locations.
- [ ] CHK-051 [P1] Final scoped status contains no task-created residue or unrelated edit.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| Planning P0/P1 | 7 | 7/7 |
| Product P0 | 10 | 0/10, not started |
| Product P1 | 6 | 0/6, not started |
| Optional | 2 | 0/2 |

**Verification Date**: 2026-08-10 for planning evidence only.
<!-- /ANCHOR:summary -->

---


<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] The phase's primary architecture choice and alternatives are documented. - [EVIDENCE: `decision-record.md` accepted decision and `plan.md` architecture section authored 2026-08-10]
- [ ] CHK-101 [P0] Implemented boundaries match the accepted decision and pinned contracts.
- [ ] CHK-102 [P1] Consumer inventory and successor handoff match the final implementation.
- [ ] CHK-103 [P2] Any migration or compatibility path is exercised.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] Phase-specific latency, throughput, cadence, or runtime targets are measured where applicable.
- [ ] CHK-111 [P0] Queues, payloads, timeouts, processes, and stored evidence have enforced bounds.
- [ ] CHK-112 [P2] Benchmarks state versions, environment, dataset, duration, baseline, and delta.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback or capability disablement is executed successfully.
- [ ] CHK-121 [P0] Required feature gate or negative-default policy starts disabled.
- [ ] CHK-122 [P1] Health, failures, revocation, and relevant state transitions are observable.
- [ ] CHK-123 [P1] Operator actions needed by this phase are handed to phase 008.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] Security and privacy implications receive the required review.
- [ ] CHK-131 [P1] Dependency and extension provenance is recorded.
- [ ] CHK-132 [P1] Data collection, retention, deletion, backup, and cache behavior match policy.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] Final contracts and operator behavior are handed to phase 008.
- [ ] CHK-141 [P1] Supported versions, limitations, evidence, and next safe action are current.
- [ ] CHK-142 [P1] Parent map and successor references match on-disk status.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Phase-map scope | Approved | 2026-08-10 |
| Technical reviewer | Implementation and architecture | Pending | N/A |
| Security reviewer | Security-critical boundary | Pending or not applicable | N/A |
| Operator | Capability enablement | Pending | N/A |
<!-- /ANCHOR:sign-off -->
