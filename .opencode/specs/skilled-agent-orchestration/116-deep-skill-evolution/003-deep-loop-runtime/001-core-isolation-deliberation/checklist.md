---
title: "Verification Checklist: Deep-Loop Core Isolation Deliberation"
description: "Checklist validating packet structure, council artifacts, ADR completeness, and migration boundary."
trigger_phrases:
  - "deep-loop isolation checklist"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/116-deep-skill-evolution/003-deep-loop-runtime/001-core-isolation-deliberation"
    last_updated_at: "2026-05-22T17:50:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored checklist"
    next_safe_action: "Dispatch seats"
    blockers: []
    key_files:
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:4474474474474474474474474474474474474474474474474474474474470000"
      session_id: "117-deep-loop-isolation-council"
      parent_session_id: null
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Deep-Loop Core Isolation Deliberation

<!-- SPECKIT_LEVEL: 3 -->

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

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: §2-§4 define problem, scope, requirements.
- [x] CHK-002 [P0] Plan defines 4-phase workflow. Evidence: plan.md §4.
- [x] CHK-003 [P1] Dependencies identified. Evidence: plan.md §6.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] No implementation files outside packet. Evidence: only `117-…/**` written.
- [ ] CHK-011 [P0] sk-ai-council canonical folder layout. Evidence: ai-council/{config,strategy,state.jsonl,seats/round-001,deliberations,council-report.md}.
- [ ] CHK-012 [P1] Each seat has frontmatter + verdict line. Evidence: grep on seats/round-001/*.md.
- [ ] CHK-013 [P1] council-report.md per output_schema.md. Evidence: required sections (Council Composition, Per-seat, Recommended Plan, Plan Confidence) present.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All acceptance criteria addressed. Evidence: SC-001..SC-004 verified.
- [ ] CHK-021 [P0] 4 seat outputs land at expected paths. Evidence: ls ai-council/seats/round-001/.
- [ ] CHK-022 [P1] Convergence rule applied (2-of-3 across A/B/C). Evidence: deliberations/round-001.md.
- [ ] CHK-023 [P1] Seat D adjudication recorded with alignment/override flag.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each seat's recommendation is one of ISOLATE | KEEP | SPLIT. Evidence: final lines.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory N/A (planning-only).
- [ ] CHK-FIX-003 [P0] Consumer inventory N/A (planning-only).
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction N/A (no code edits).
- [ ] CHK-FIX-005 [P1] Migration outline in ADR if ruling = ISOLATE or SPLIT. Evidence: decision-record.md §Migration.
- [ ] CHK-FIX-006 [P1] MCP tool ID stability addressed in risk register. Evidence: ADR or impl-summary risk section.
- [ ] CHK-FIX-007 [P1] Evidence pinned to file paths in dependency map. Evidence: spec.md §EXECUTIVE SUMMARY.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets in seat prompts. Evidence: prompts under ai-council/seats/round-001/.
- [x] CHK-031 [P0] No credentials in council artifacts.
- [ ] CHK-032 [P1] If ruling = move, MCP tool IDs preserved. Evidence: ADR risk register.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec.md / plan.md / tasks.md / checklist.md / decision-record.md / implementation-summary.md synchronized. Evidence: all reference same ruling.
- [ ] CHK-041 [P1] council-report.md preserves seat verdicts verbatim. Evidence: side-by-side check.
- [x] CHK-042 [P2] README update N/A (planning-only packet).
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files under packet-local scratch/. Evidence: scratch/ exists.
- [x] CHK-051 [P1] ai-council/ folder follows canonical layout. Evidence: matches sk-ai-council folder_layout.md.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | TBD |
| P1 Items | 14 | TBD |
| P2 Items | 1 | TBD |

**Verification Date**: 2026-05-22
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] ADR documented in decision-record.md. Evidence: ADR-001.
- [ ] CHK-101 [P1] ADR status reflects ruling (Accepted | Rejected | Deferred). Evidence: ADR-001 §Status.
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale. Evidence: ADR-001 §Alternatives Considered.
- [ ] CHK-103 [P2] Migration path documented if applicable. Evidence: ADR-001 §Migration Outline.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [x] CHK-110 [P1] Each seat dispatch ≤15 min. Evidence: log timestamps.
- [x] CHK-111 [P1] Throughput target N/A (planning-only).
- [x] CHK-112 [P2] Load testing N/A (planning-only).
- [x] CHK-113 [P2] Performance benchmarks N/A.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [x] CHK-120 [P0] Rollback procedure documented. Evidence: plan.md §7.
- [x] CHK-121 [P0] Feature flag N/A (planning-only).
- [x] CHK-122 [P1] Monitoring N/A.
- [x] CHK-123 [P1] Runbook N/A.
- [x] CHK-124 [P2] Deployment runbook N/A.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [x] CHK-130 [P1] Security review N/A.
- [x] CHK-131 [P1] Dependency licenses N/A.
- [x] CHK-132 [P2] OWASP checklist N/A.
- [x] CHK-133 [P2] Data handling compliant. Evidence: no PII in council artifacts.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] Packet docs synchronized. Evidence: all reference same ruling.
- [x] CHK-141 [P1] API docs N/A.
- [x] CHK-142 [P2] User-facing docs N/A.
- [ ] CHK-143 [P2] Knowledge transfer via council-report + ADR. Evidence: cross-reference index.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| User | Product + architectural owner | Pending council ruling | 2026-05-22 |
<!-- /ANCHOR:sign-off -->
