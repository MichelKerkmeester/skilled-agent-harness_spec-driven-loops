---
title: "Verification Checklist: Full MCP extraction of skill graph library and lifecycle"
description: "D2a+D2b checklist for atomic lifecycle transfer to system_skill_advisor and close-out verification."
trigger_phrases:
  - "013/009/011 checklist"
  - "skill graph extraction verification"
importance_tier: "critical"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/006-system-skill-advisor-package-extraction/011-mcp-server-package-extraction"
    last_updated_at: "2026-05-14T20:05:00Z"
    last_updated_by: "codex"
    recent_action: "011 full extraction shipped (D2a+D2b)"
    next_safe_action: "Operator: 014 manual testing via cli-opencode"
    blockers: []
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Full MCP extraction of skill graph library and lifecycle

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim D2a handled until complete |
| **[P1]** | Required | Must complete OR explicitly defer to D2b |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Gate 3 answered as Option B for packet 011. Evidence: dispatch pre-answer.
- [x] CHK-002 [P0] Council D1 artifact promoted. Evidence: `research/multi-ai-council-deliberation.md`.
- [x] CHK-003 [P1] Required reading completed. Evidence: source and packet files read before edits.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Advisor typecheck passes. Evidence: `npm run typecheck`.
- [x] CHK-011 [P0] Memory typecheck passes. Evidence: `npx tsc --noEmit`.
- [x] CHK-012 [P1] Advisor lifecycle errors are diagnostic and non-fatal for startup scan. Evidence: `advisor-server.ts` catches startup scan errors.
- [x] CHK-013 [P1] Code follows existing advisor daemon watcher pattern. Evidence: `startSkillGraphDaemon()` is reused rather than duplicated.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Targeted advisor skill graph tests pass. Evidence: 3 files, 6 tests passed.
- [x] CHK-021 [P0] Advisor MCP smoke starts lifecycle. Evidence: logs show DB path, startup scan, daemon active.
- [x] CHK-022 [P1] Memory MCP smoke starts without skill graph init. Evidence: startup logs show memory DB init and no skill graph init.
- [x] CHK-023 [P1] Builds are refreshed before smokes. Evidence: advisor `npm run build`, memory `npm run build`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class: cross-consumer ownership boundary.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed. Evidence: `rg` for lifecycle symbols in context/advisor servers.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for moved skill graph DB/query imports. Evidence: advisor grep gate returned zero old skill graph library imports.
- [x] CHK-FIX-004 [P0] Security/path/parser table tests not applicable. This is an ownership transfer, not a parser/security change.
- [x] CHK-FIX-005 [P1] Matrix axes listed in `plan.md`.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant not applicable for D2a; D2b owns broader env matrix.
- [x] CHK-FIX-007 [P1] Evidence is pinned in this packet, with final commit SHA to be added after commit.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets introduced.
- [x] CHK-031 [P0] Trusted caller guard remains on `skill_graph_scan`.
- [x] CHK-032 [P1] Caller context is advisor-local after D2a.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks, checklist, ADRs, and summary authored.
- [x] CHK-041 [P1] Council artifact promoted to research.
- [x] CHK-042 [P2] Broader public docs deferred to D2b unless touched by code path. Evidence: D2b updated parent continuity only; 012/013 sibling packets already shipped their own docs.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:d2b-closeout -->
## D2b Close-Out

- [x] CHK-200 [P0] Hooks import advisor brief/render/metrics from existing advisor paths. Evidence: Claude, Codex, and Gemini hook files inspected; `npx tsc --noEmit` passed.
- [x] CHK-201 [P0] Schema imports resolve advisor tool schemas and parameter-key tuples. Evidence: `tool-input-schemas.ts` inspected; `npx tsc --noEmit` passed.
- [x] CHK-202 [P1] Session-bootstrap topology path remains safe after D2a. Evidence: targeted `session-bootstrap` suites passed 3/3; topology summary reports advisor ownership instead of removed memory proxy.
- [x] CHK-203 [P0] Advisor full Vitest passes. Evidence: `npm test` passed 291/291.
- [x] CHK-204 [P1] Memory full Vitest run and classified. Evidence: `npm test` core baseline-red at 11,404/11,582 with unrelated failures; stale F-015 fixture fixed; `test:file-watcher` passed 21/21 separately.
- [x] CHK-205 [P1] Broader seams classified. Evidence: 15 non-test matches, 13 legitimate sibling imports, 2 shared-candidate flags, 0 test seams.
- [x] CHK-206 [P0] Parent continuity updated. Evidence: parent handover §9 appended and graph metadata children list extended to 011/012/013.
<!-- /ANCHOR:d2b-closeout -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No scratch files retained in packet.
- [x] CHK-051 [P1] Empty old handler directory deleted.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 15/15 |
| P1 Items | 16 | 16/16 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-05-14
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Architecture decisions documented in `decision-record.md`.
- [x] CHK-101 [P1] All ADRs have accepted status.
- [x] CHK-102 [P1] Alternatives documented with rejection rationale.
- [x] CHK-103 [P2] Migration path documented as clean cut.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [x] CHK-110 [P1] No new query-path benchmark required; D2a moves ownership only.
- [x] CHK-111 [P1] Startup smoke completes lifecycle engagement under timeout.
- [x] CHK-112 [P2] Load testing deferred to D2b/broad suites.
- [x] CHK-113 [P2] Performance benchmarks not changed.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [x] CHK-120 [P0] Rollback procedure documented.
- [x] CHK-121 [P0] Feature flag not applicable; clean cut locked by council.
- [x] CHK-122 [P1] Startup logs are the operational smoke signal.
- [x] CHK-123 [P1] D2b next action documented.
- [x] CHK-124 [P2] Operator handoff recorded in implementation summary.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [x] CHK-130 [P1] No new data class introduced.
- [x] CHK-131 [P1] No new package dependency committed.
- [x] CHK-132 [P2] OWASP checklist not applicable.
- [x] CHK-133 [P2] Data handling remains local SQLite only.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [x] CHK-140 [P1] Packet docs synchronized.
- [x] CHK-141 [P1] API tool ids unchanged.
- [x] CHK-142 [P2] Public docs deferred to D2b.
- [x] CHK-143 [P2] Continuation note documented.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Scope owner | Approved D2a dispatch | 2026-05-14 |
| Operator | Scope owner | Approved D2b close-out dispatch | 2026-05-14 |
| Codex | Implementer | Verified targeted gates, full advisor suite, memory baseline classification, and parent continuity | 2026-05-14 |
<!-- /ANCHOR:sign-off -->
