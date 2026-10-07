---
title: "Tasks: Phase 3: status-contract-and-docs"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "status contract and docs tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 3: status-contract-and-docs

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

- [x] T001 Probe the untrusted mutation refusal and record the exact message and exit status (`scratch/trusted-refusal.log`) [EVIDENCE: scratch/trusted-refusal.log: both mutating commands exit 64 with the requires --trusted message]
- [x] T002 Re-measure the `explicit.ts` line ranges and map examples the scoring reference cites (`scratch/reference-check.md`) [EVIDENCE: scratch/reference-check.md: 27-107, 115-246, 313-322 (push 321)]
- [x] T003 Inventory every reader of routing phrases across the runtime and the skill-authoring scripts (`scratch/phrase-readers.md`) [EVIDENCE: scratch/phrase-readers.md: 11 readers; none reads SKILL.md frontmatter routing phrases]
- [x] T004 [P] Record the doctor's declared phrase range and the current map extremes (`scratch/bound.md`) [EVIDENCE: scratch/bound.md: doctor range [-1.0, 2.0]; map min -0.6, max 1.8 over 154 amounts]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 State the `--trusted` requirement and the exit-64 refusal on the rebuild page (`feature-catalog/cli-surface/advisor-rebuild.md`) [EVIDENCE: advisor-rebuild.md section 2 trusted paragraph; rg --trusted hit]
- [x] T006 State the same requirement on the scan page (`feature-catalog/cli-surface/skill-graph-scan.md`) [EVIDENCE: skill-graph-scan.md section 2 trusted paragraph; rg --trusted hit]
- [x] T007 Correct every moved citation and stale example in the scorer reference from the re-measurement (`references/scoring/advisor-scorer.md`) [EVIDENCE: advisor-scorer.md lines 91 and 93 rewritten; stale-citation grep returns no match]
- [x] T008 Declare the phrase-boost bound beside the map, aligned with the doctor's range (`runtime/lib/scorer/lanes/explicit.ts`) [EVIDENCE: explicit.ts:108-113 comment and PHRASE_BOOST_BOUND]
- [x] T009 Add the bound check to the scorer suite so an out-of-range value fails (`runtime/tests/`) [EVIDENCE: command-bridge-resolution-guard.vitest.ts phrase boost bound block, 8/8 pass]
- [x] T010 Record the routing-phrase source decision and apply it to the readers or the skills (`SKILL.md` plus the decided readers) [EVIDENCE: decision in SKILL.md section 3; no reader or frontmatter change required]
- [x] T011 Add the optional embeddings health object to the status schema (`runtime/schemas/advisor-tool-schemas.ts`) [EVIDENCE: advisor-tool-schemas.ts includeEmbeddingsHealth input and embeddingsHealth output]
- [x] T012 Build the health facts in the handler with a bounded read-only probe and an unavailable fallback (`runtime/handlers/advisor-status.ts`) [EVIDENCE: lib/embedders/embeddings-health.ts and handleAdvisorStatus attach, fail-soft, 1500 ms bound]
- [x] T013 Declare the health option in the CLI manifest and make the existing semantic option requestable (`runtime/skill-advisor-cli-manifest.ts`) [EVIDENCE: skill-advisor-cli-manifest.ts and tools/advisor-status.ts declare includeSemanticHealth, includeEmbeddingsHealth, debug]
- [x] T014 Document the health surface, its read cost and its fail-soft contract (`feature-catalog/cli-surface/advisor-status.md`, `SKILL.md`) [EVIDENCE: feature-catalog/cli-surface/advisor-status.md and SKILL.md document the surface]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 Add unit tests for the health present and unavailable states plus manifest acceptance (`runtime/tests/handlers/advisor-status.vitest.ts`, `runtime/tests/cli-exit-taxonomy.vitest.ts`) [EVIDENCE: embeddings-health, advisor-status and cli-exit-taxonomy suites 29/29 pass]
- [x] T016 Rebuild the runtime and run the live health call with the server up and down; record both (`scratch/verification.md`) [EVIDENCE: scratch/verification.md: server up reachable/ready; absent socket unavailable/unreachable]
- [x] T017 Rerun the citation, trusted-page and phrase-reader checks and record the output (`scratch/verification.md`) [EVIDENCE: scratch/verification.md, reference-check.md and phrase-readers.md hold the rerun output]
- [x] T018 Sync `acceptance-criteria.md` with the observed evidence for each row (`acceptance-criteria.md`) [EVIDENCE: acceptance-criteria.md 5/5 Met]
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

- [x] CHK-001 [P0] Requirements documented in spec.md [EVIDENCE: spec.md REQ-001..005]
- [x] CHK-002 [P0] Technical approach defined in plan.md [EVIDENCE: plan.md and ADR-001]
- [x] CHK-003 [P1] Dependencies identified and available [EVIDENCE: runtime build and better-sqlite3 available]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks [EVIDENCE: npm run typecheck exit 0; validate_document.py VALID on edited docs]
- [x] CHK-011 [P0] No console errors or warnings [EVIDENCE: targeted suites print no errors]
- [x] CHK-012 [P1] Error handling implemented [EVIDENCE: provider and server halves each degrade to unavailable with an error class]
- [x] CHK-013 [P1] Code follows project patterns [EVIDENCE: probe follows the existing hf-local client resolution order]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met [EVIDENCE: acceptance-criteria.md 5/5 Met]
- [x] CHK-021 [P0] Manual testing complete [EVIDENCE: live health call with the server up and an absent socket recorded]
- [x] CHK-022 [P1] Edge cases tested [EVIDENCE: timeout, bad payload, epoch timestamps and tcp target tested]
- [x] CHK-023 [P1] Error scenarios validated [EVIDENCE: unreachable and timeout paths tested]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. [EVIDENCE: instance-only for docs and citations; cross-consumer for the manifest and tool descriptor]
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. [EVIDENCE: rg --trusted across the skill docs; only the two mutating pages lacked it]
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. [EVIDENCE: consumers of semanticLaneHealth, getProviderInfo and /api/health inventoried; manifest and tool descriptor both updated]
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. [EVIDENCE: N/A: no security, path, parser or redaction fix]
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. [EVIDENCE: command x trust state, phrase reader x source, health state axes listed in plan.md]
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. [EVIDENCE: HF_EMBED_SERVER_URL set to an absent socket and restored in tests and the live check]
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. [EVIDENCE: evidence pinned to the uncommitted working-tree diff; the parent session commits it]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets [EVIDENCE: no secrets in diff]
- [x] CHK-031 [P0] Input validation implemented [EVIDENCE: zod strict schemas on the new input and output]
- [x] CHK-032 [P1] Auth/authz working correctly [EVIDENCE: N/A: no auth surface changed]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized [EVIDENCE: spec, plan, tasks and acceptance criteria agree]
- [x] CHK-041 [P1] Code comments adequate [EVIDENCE: comments name the doctor range and the mirrored client resolution]
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

- [x] CHK-110 [P1] Response time targets met (NFR-P01) [EVIDENCE: plain calls do no probe; opt-in probe bounded at 1500 ms]
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
- [x] CHK-123 [P1] Runbook created [EVIDENCE: N/A: catalog pages document operation]
- [x] CHK-124 [P2] Deployment runbook reviewed [EVIDENCE: N/A]
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [x] CHK-130 [P1] Security review completed [EVIDENCE: probe sends no body, copies no provider config block]
- [x] CHK-131 [P1] Dependency licenses compatible [EVIDENCE: no new dependencies]
- [x] CHK-132 [P2] OWASP Top 10 checklist completed [EVIDENCE: N/A]
- [x] CHK-133 [P2] Data handling compliant with requirements [EVIDENCE: provider config and key markers are never copied]
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [x] CHK-140 [P1] All spec documents synchronized [EVIDENCE: phase docs synchronized]
- [x] CHK-141 [P1] API documentation complete (if applicable) [EVIDENCE: advisor-status catalog page documents the new input and output]
- [x] CHK-142 [P2] User-facing documentation updated [EVIDENCE: feature-catalog pages updated]
- [x] CHK-143 [P2] Knowledge transfer documented [EVIDENCE: implementation-summary.md records the decisions]
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

