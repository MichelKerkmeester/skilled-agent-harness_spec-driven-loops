---
title: "Verification Checklist: Validate advisor extraction and remove deprecated bridge"
description: "Checklist for package-local tests, four-runtime MCP validation, bridge removal, stale-doc cleanup, and final metadata verification."
trigger_phrases:
  - "013/009/006 checklist"
  - "advisor cleanup checklist"
  - "system_skill_advisor verification checklist"
importance_tier: "critical"
contextType: "checklist"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/013-skill-advisor-semantic-lane/009-system-skill-advisor-extraction/006-validation-cleanup-and-deprecation-removal"
    last_updated_at: "2026-05-14T12:45:00Z"
    last_updated_by: "codex"
    recent_action: "Docs authored"
    next_safe_action: "Execute Phase 1 inventory"
    blockers: []
    key_files:
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0130090060000000000000000000000000000000000000000000000000000000"
      session_id: "013-009-006-validation-cleanup"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Validate Advisor Extraction and Remove Deprecated Bridge

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim packet implementation complete until verified. |
| **[P1]** | Required | Must complete or receive explicit user-approved deferral. |
| **[P2]** | Optional | Can defer with documented reason. |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in `spec.md`. Evidence: REQ-001 through REQ-009 authored in this scaffold.
- [x] CHK-002 [P0] Technical approach defined in `plan.md`. Evidence: three phases and rollback plan authored.
- [x] CHK-003 [P1] Dependencies identified. Evidence: ADR-001 plus child 003-005 dependencies listed in `plan.md`.
- [ ] CHK-004 [P0] Child 003, 004, and 005 deliverables verified present before cleanup execution.
- [ ] CHK-005 [P0] ADR-003 manual operator confirmation captured before proxy removal.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## CODE QUALITY

- [ ] CHK-010 [P0] `spec_kit_memory` advisor proxy registrations removed.
- [ ] CHK-011 [P0] Memory MCP no longer imports advisor implementation modules.
- [ ] CHK-012 [P0] Old `spec_kit_memory.advisor_*` schema/tool ids absent from memory MCP exposure.
- [ ] CHK-013 [P1] Deprecation hints and fail-fast messages for the retired surface removed.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## TESTING

- [ ] CHK-020 [P0] Package-local Vitest passes from `.opencode/skills/system-skill-advisor/mcp_server/`.
- [ ] CHK-021 [P0] OpenCode config lists `spec_kit_memory` and `system_skill_advisor`.
- [ ] CHK-022 [P0] Codex config lists `spec_kit_memory` and `system_skill_advisor`.
- [ ] CHK-023 [P0] Claude config lists `spec_kit_memory` and `system_skill_advisor`.
- [ ] CHK-024 [P0] Gemini config lists `spec_kit_memory` and `system_skill_advisor`.
- [ ] CHK-025 [P0] `advisor_recommend` probe passes from OpenCode.
- [ ] CHK-026 [P0] `advisor_recommend` probe passes from Codex.
- [ ] CHK-027 [P0] `advisor_recommend` probe passes from Claude.
- [ ] CHK-028 [P0] `advisor_recommend` probe passes from Gemini.
- [ ] CHK-029 [P1] Python parity tests pass against the moved shim.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX COMPLETENESS

- [ ] CHK-030 [P0] No live-code grep hits remain for `mcp_server/skill_advisor/`.
- [ ] CHK-031 [P0] Zero live callers found for `spec_kit_memory.advisor_*` before bridge removal.
- [ ] CHK-032 [P1] Hook smoke tests pass after consumer cutover.
- [ ] CHK-033 [P1] Historical old-path references are annotated, not presented as live instructions.
- [ ] CHK-034 [P1] Matrix axes and row counts are recorded in `implementation-summary.md`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## SECURITY

- [ ] CHK-040 [P0] Cleanup does not delete or overwrite advisor SQLite data.
- [ ] CHK-041 [P1] Cold-start DB checks use disposable override state where mutation is needed.
- [ ] CHK-042 [P1] No hardcoded secrets are added to runtime configs or docs.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## DOCUMENTATION

- [ ] CHK-050 [P1] Install guides in both skill folders match final topology.
- [ ] CHK-051 [P1] Invalid "DO NOT register a second MCP server" warnings removed.
- [ ] CHK-052 [P1] `implementation-summary.md` records final commands, counts, and caveats.
- [ ] CHK-053 [P2] Old `spec_kit_memory.advisor_*` tool ids explicitly absent in final schema inspection.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## FILE ORGANIZATION

- [ ] CHK-060 [P0] Default DB path verified at `system-skill-advisor/mcp_server/database/skill-graph.sqlite`.
- [ ] CHK-061 [P1] No temp files remain outside approved scratch or test-temp locations.
- [ ] CHK-062 [P1] Scope stays limited to packet-approved implementation files during cleanup.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 21 | 3/21 |
| P1 Items | 15 | 5/15 |
| P2 Items | 2 | 0/2 |

**Verification Date**: 2026-05-14

This scaffold verifies documentation authoring only. Packet implementation remains pending until the cleanup and runtime validation work executes.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Architecture decisions documented in `decision-record.md`. Evidence: ADR-001 through ADR-005 authored.
- [x] CHK-101 [P1] All ADRs have accepted status. Evidence: each ADR metadata table lists Accepted.
- [x] CHK-102 [P1] Alternatives documented with rejection rationale. Evidence: ADR-002 through ADR-005 include alternatives or policy trade-offs.
- [ ] CHK-103 [P2] Post-cleanup migration path documented with final evidence.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] Package-local Vitest runtime is recorded.
- [ ] CHK-111 [P1] Runtime probe latency or timeout behavior is recorded when smoke tests run.
- [ ] CHK-112 [P2] Performance benchmarks documented if cleanup changes runtime behavior.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback procedure documented in `plan.md`.
- [ ] CHK-121 [P0] Four-runtime smoke matrix passes after cleanup.
- [ ] CHK-122 [P1] Operator-facing install docs reviewed.
- [x] CHK-123 [P1] Final strict validation exits 0. Evidence: `validate.sh <006-folder> --strict --verbose` exited 0 during scaffold verification.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] DB verification avoids destructive data operations.
- [ ] CHK-131 [P1] Stale historical references are handled under ADR-004 policy.
- [ ] CHK-132 [P2] License or dependency changes are confirmed unnecessary.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] All spec documents synchronized after implementation evidence is added.
- [x] CHK-141 [P1] `description.json` and `graph-metadata.json` parse as JSON. Evidence: Node JSON.parse smoke exited 0 during scaffold verification.
- [ ] CHK-142 [P2] Knowledge transfer notes are captured in `implementation-summary.md`.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Bridge removal confirmation | Pending | |
| Implementer | Validation evidence owner | Pending | |
| Reviewer | Final topology review | Pending | |
<!-- /ANCHOR:sign-off -->
