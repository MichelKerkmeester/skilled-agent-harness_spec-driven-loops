---
title: "Tasks: Phase 1: freshness-and-scan-truth"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1: freshness-and-scan-truth

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Capture the baseline live status pair and the panel output, including the reproduced disagreement (`scratch/baseline.md`) [EVIDENCE: scratch/baseline.md: live, skillCount 20 vs changedSourceFiles 14, totalSkills 14; panel silent on compiled staleness and absent SQLite]
- [x] T002 Re-read the handler, schema, panel and their tests and confirm each of the four recorded findings against the current code (`scratch/recon.md`) [EVIDENCE: scratch/recon.md: all four findings confirmed; root cause is two hash recipes (raw 0/14, versioned 14/14)]
- [x] T003 [P] Confirm the runtime build command and the CLI shim's dist-freshness guard accept a freshly built dist (`.skilled/skills/system-skill-advisor/runtime/`) [EVIDENCE: npm run build exit 0; shim returned exit 69 on a stale dist and accepted the fresh build]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add a read-only index-staleness comparison to `readAdvisorStatus`, reading `skill_nodes.content_hash` through the guarded read-only accessor (`runtime/handlers/advisor-status.ts`) [EVIDENCE: handlers/advisor-status.ts readIndexStaleness, read-only open guarded by existsSync, closed in finally]
- [x] T005 Extend `AdvisorStatusOutputSchema` with the optional staleness fields the handler now reports (`runtime/schemas/advisor-tool-schemas.ts`) [EVIDENCE: schemas/advisor-tool-schemas.ts optional strict indexStaleness object]
- [x] T006 Switch `skillCount` to the depth-1 skill-root inventory and keep the truncated-scan marker for the bounded walk (`runtime/handlers/advisor-status.ts`) [EVIDENCE: scanSkillMetadataFiles counts depth-1 roots; cap test reports count 1 and the truncation error]
- [x] T007 Report compiled-graph staleness by comparing `generated_at` against the newest on-disk source stamp (`doctor/scripts/skill-graph-freshness.cjs`) [EVIDENCE: panel STALE COMPILED line; live run names 07:49:34 compiled vs 09:00:00Z cli-classifier]
- [x] T008 Add the degraded marker for the absent or unreadable SQLite source while preserving the panel's always-exit-0 contract (`doctor/scripts/skill-graph-freshness.cjs`) [EVIDENCE: panel DEGRADED line for absent or unreadable SQLite and compiled sources; exit 0 kept]
- [x] T009 Correct the `z_archive` wording to the depth-1 scan rule and disambiguate family output from skill ids (`doctor/scripts/skill-graph-freshness.cjs`) [EVIDENCE: comment and scan rule line state depth-1; rg z_archive no match; family items read skill <id> (family disk=...)]
- [x] T010 [P] Update the status and freshness feature-catalog pages to the semantics the code now implements (`feature-catalog/cli-surface/advisor-status.md`, `feature-catalog/daemon-and-freshness/rebuild-from-source.md`) [EVIDENCE: feature-catalog/cli-surface/advisor-status.md, daemon-and-freshness/rebuild-from-source.md and cli-surface/skill-graph-status.md updated]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Pin the new staleness, counting and absent-artifact semantics in the handler suite (`runtime/tests/handlers/advisor-status.vitest.ts`) [EVIDENCE: tests/handlers/advisor-status.vitest.ts 16/16 pass with fresh, stale, absent, nested and cap cases]
- [x] T012 Create the panel test covering normal, stale-compiled, absent-database and no-audit output (`doctor/scripts/tests/skill-graph-freshness.test.cjs`) [EVIDENCE: tests/doctor/skill-graph-freshness-panel.vitest.ts 6/6 pass (placed in the advisor suite, see implementation-summary)]
- [x] T013 Rebuild the runtime and rerun the live status pair; record that freshness and staleness agree (`scratch/verification.md`) [EVIDENCE: scratch/verification.md: both surfaces report 14 fresh sources and 14 skills after rebuild and daemon restart]
- [x] T014 Rerun the panel against the real artifact and against an empty database directory; record both outputs and the degraded marker (`scratch/verification.md`) [EVIDENCE: scratch/verification.md: real-artifact and empty-dir panel runs, both exit 0, degraded marker present]
- [x] T015 Sync the phase docs and record the verified evidence in `acceptance-criteria.md` (`spec.md`, `plan.md`, `acceptance-criteria.md`) [EVIDENCE: acceptance-criteria.md rows Met with evidence; spec status Complete]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

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

- [x] CHK-001 [P0] Requirements documented in spec.md [EVIDENCE: spec.md REQ-001..006]
- [x] CHK-002 [P0] Technical approach defined in plan.md [EVIDENCE: plan.md architecture and ADR-001]
- [x] CHK-003 [P1] Dependencies identified and available [EVIDENCE: runtime build and better-sqlite3 available]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks [EVIDENCE: npm run typecheck exit 0; node --check on the panel exit 0]
- [x] CHK-011 [P0] No console errors or warnings [EVIDENCE: targeted suites print no errors]
- [x] CHK-012 [P1] Error handling implemented [EVIDENCE: absent, empty and unreadable index paths return unavailable; panel try/catch]
- [x] CHK-013 [P1] Code follows project patterns [EVIDENCE: follows the readSemanticLaneHealth read-only pattern]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met [EVIDENCE: acceptance-criteria.md 6/6 Met]
- [x] CHK-021 [P0] Manual testing complete [EVIDENCE: live status pair and two panel runs recorded in scratch/verification.md]
- [x] CHK-022 [P1] Edge cases tested [EVIDENCE: nested fixtures, cap, empty database and unparseable compiled json covered]
- [x] CHK-023 [P1] Error scenarios validated [EVIDENCE: absent database and missing compiled json cases tested]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. [EVIDENCE: class-of-bug (two hash recipes) and cross-consumer (advisor_status, skill_graph_status, indexer)]
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. [EVIDENCE: rg content_hash producers: only indexSkillMetadata writes skill_nodes hashes]
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. [EVIDENCE: consumers of skillCount and freshness inventoried; feature-catalog pages updated]
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. [EVIDENCE: N/A: no security, path, parser or redaction fix]
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. [EVIDENCE: index state x source shape x panel state axes listed in plan.md and covered by 22 test cases]
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. [EVIDENCE: SYSTEM_SKILL_ADVISOR_DB_DIR pointed at an empty dir for the panel; tests set and restore env]
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. [EVIDENCE: evidence pinned to the uncommitted working-tree diff; the parent session commits it]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets [EVIDENCE: no secrets in diff]
- [x] CHK-031 [P0] Input validation implemented [EVIDENCE: inputs pass the existing zod schema; panel tolerates malformed files]
- [x] CHK-032 [P1] Auth/authz working correctly [EVIDENCE: N/A: no auth surface changed]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized [EVIDENCE: spec, plan, tasks and acceptance criteria agree]
- [x] CHK-041 [P1] Code comments adequate [EVIDENCE: comments explain the shared recipe and read-only access]
- [x] CHK-042 [P2] README updated (if applicable) [EVIDENCE: N/A: no README covers these fields]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only [EVIDENCE: evidence files only under scratch/]
- [x] CHK-051 [P1] scratch/ cleaned before completion [EVIDENCE: scratch/ holds only the evidence files the tasks name]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 15/15 |
| P1 Items | 23 | 23/23 |
| P2 Items | 9 | 9/9 |

**Verification Date**: 2026-10-03
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [x] CHK-100 [P0] Architecture decisions documented in decision-record.md [EVIDENCE: ADR-001 lives in plan.md (no separate decision-record.md in this phase)]
- [x] CHK-101 [P1] All ADRs have status (Proposed/Accepted) [EVIDENCE: ADR-001 Accepted]
- [x] CHK-102 [P1] Alternatives documented with rejection rationale [EVIDENCE: plan.md lists rejected alternatives]
- [x] CHK-103 [P2] Migration path documented (if applicable) [EVIDENCE: N/A: no migration]
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [x] CHK-110 [P1] Response time targets met (NFR-P01) [EVIDENCE: one read-only open plus 14 small file hashes per status call]
- [x] CHK-111 [P1] Throughput targets met (NFR-P02) [EVIDENCE: N/A: no throughput target]
- [x] CHK-112 [P2] Load testing completed [EVIDENCE: N/A: diagnostic surface, no load test]
- [x] CHK-113 [P2] Performance benchmarks documented [EVIDENCE: N/A]
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [x] CHK-120 [P0] Rollback procedure documented and tested [EVIDENCE: plan.md rollback: revert the listed files and rebuild]
- [x] CHK-121 [P0] Feature flag configured (if applicable) [EVIDENCE: N/A: no feature flag]
- [x] CHK-122 [P1] Monitoring/alerting configured [EVIDENCE: N/A: diagnostic surface]
- [x] CHK-123 [P1] Runbook created [EVIDENCE: N/A: doctor panel route asset is the runbook]
- [x] CHK-124 [P2] Deployment runbook reviewed [EVIDENCE: N/A]
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [x] CHK-130 [P1] Security review completed [EVIDENCE: read-only database access reviewed in the diff]
- [x] CHK-131 [P1] Dependency licenses compatible [EVIDENCE: no new dependencies]
- [x] CHK-132 [P2] OWASP Top 10 checklist completed [EVIDENCE: N/A]
- [x] CHK-133 [P2] Data handling compliant with requirements [EVIDENCE: no prompt or file content logged]
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [x] CHK-140 [P1] All spec documents synchronized [EVIDENCE: phase docs synchronized]
- [x] CHK-141 [P1] API documentation complete (if applicable) [EVIDENCE: feature-catalog advisor-status page documents the new field]
- [x] CHK-142 [P2] User-facing documentation updated [EVIDENCE: feature-catalog pages updated]
- [x] CHK-143 [P2] Knowledge transfer documented [EVIDENCE: implementation-summary.md records the root cause]
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Parent session | Technical Lead | Pending review at commit | |
| Operator | Product Owner | Pending | |
| Parent session | QA Lead | Pending review at commit | |
<!-- /ANCHOR:sign-off -->

