---
title: "Verification Checklist: Spec Kit Code Graph Decoupling"
description: "Verification checklist for packet 020."
trigger_phrases:
  - "020 checklist"
importance_tier: "critical"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/004-skill-graph/006-system-skill-advisor-package-extraction/020-spec-kit-codegraph-decoupling"
    last_updated_at: "2026-05-15T09:35:00Z"
    last_updated_by: "codex"
    recent_action: "Static verification passed"
    next_safe_action: "Run vitest, strict validate, MCP and hook smoke"
    blockers: []
    key_files:
      - "checklist.md"
    completion_pct: 70
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Spec Kit Code Graph Decoupling

<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| P0 | Hard blocker | Cannot claim done until complete |
| P1 | Required | Complete or document deferral |
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in `spec.md`.
  Evidence: packet 020 `spec.md` contains REQ-001 through REQ-006.
- [x] CHK-002 [P0] ADR documented and accepted.
  Evidence: `decision-record.md` ADR-001 accepted and supersedes 014/007 ADR-002.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-003 [P0] Import audit is clean.
  Evidence: `rg -n 'from.*system-code-graph' .opencode/skills/system-spec-kit/mcp_server --glob '!**/node_modules/**' --glob '!**/dist/**'` exited 1 with no matches.
- [x] CHK-004 [P0] Shared contracts build.
  Evidence: `npm run build` in `system-spec-kit/shared` passed.
- [x] CHK-005 [P0] Spec-kit typecheck passes.
  Evidence: `npx tsc -p tsconfig.json --noEmit` in `system-spec-kit/mcp_server` passed.
- [x] CHK-006 [P0] Code-graph typecheck passes.
  Evidence: `node node_modules/typescript/bin/tsc -p tsconfig.json --noEmit` in `system-code-graph` passed.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-007 [P0] Target Vitest matrix has no new 020 regressions.
  Evidence: spec-kit targeted boundary/hook tests passed 177/179 with 2 existing skipped; code-graph moved smoke subset passed 66 tests; two legacy mixed suites still need broader follow-up classification.
- [x] CHK-008 [P0] Strict validate packet 020 passes.
  Evidence: packet strict validation passed with 0 errors and 0 warnings.
- [x] CHK-009 [P0] Strict validate parent passes.
  Evidence: parent validation passed in recursive phase mode.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-020 [P1] Startup hooks use marker-backed startup brief.
  Evidence: Claude, Codex, and Gemini startup surfaces import `getStartupBriefFromMarker`.
- [x] CHK-021 [P1] Runtime graph reads use boundary/RPC or marker fallback.
  Evidence: session, search, memory-context, and passive enrichment no longer import code-graph internals.
- [x] CHK-022 [P1] Code-graph tests moved to code-graph ownership.
  Evidence: moved tests exist under `system-code-graph/mcp_server/tests` and `stress_test/code-graph`.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets introduced.
- [x] CHK-031 [P0] Boundary fails closed on missing marker or RPC error.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized.
- [x] CHK-041 [P1] ADR supersession documented.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files limited to scratch or test temp dirs.
- [ ] CHK-051 [P0] Commit contains no unrelated dirty files.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 | 10 | 9/10 |
| P1 | 5 | 5/5 |
| P2 | 0 | 0/0 |

Verification date: 2026-05-15
<!-- /ANCHOR:summary -->

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Architecture decisions documented in `decision-record.md`.
- [x] CHK-101 [P1] ADR has Accepted status.
- [x] CHK-102 [P1] Alternatives documented.
- [x] CHK-103 [P1] Migration path documented.
<!-- /ANCHOR:arch-verify -->

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [x] CHK-110 [P1] Startup path avoids RPC latency by using marker reads.
<!-- /ANCHOR:perf-verify -->

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [x] CHK-120 [P0] MCP list shows all expected servers connected.
  Evidence: `opencode mcp list` reported 6 connected servers.
- [x] CHK-121 [P0] Hook smoke is PASS or documented inconclusive with reason.
  Evidence: hook smoke target passed 20/22 with 2 existing skipped.
<!-- /ANCHOR:deploy-ready -->

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [x] CHK-130 [P1] Dependency surface unchanged except shared internal contracts.
<!-- /ANCHOR:compliance-verify -->

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [x] CHK-140 [P1] Spec documents synchronized.
<!-- /ANCHOR:docs-verify -->

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Technical owner | Pending final verification | 2026-05-15 |
<!-- /ANCHOR:sign-off -->
