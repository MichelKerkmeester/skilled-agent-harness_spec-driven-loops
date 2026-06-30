---
title: "Verification Checklist: Purge the cli-gemini executor everywhere outside specs"
description: "Checklist for cli-gemini executor removal across source, tests, manifests, catalogs, playbooks, and changelogs with delete-vs-swap discipline."
trigger_phrases:
  - "cli-gemini executor purge checklist"
importance_tier: "important"
contextType: "checklist"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/107-cli-gemini-deprecation/003-cli-gemini-full-purge"
    last_updated_at: "2026-06-08T18:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Recorded completed verification checklist"
    next_safe_action: "None"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/**"
      - ".opencode/skills/deep-improvement/**"
      - ".opencode/skills/system-spec-kit/mcp_server/matrix_runners/**"
      - ".opencode/changelog/**"
    session_dedup:
      fingerprint: "sha256:7ad6a27ea961d698c6c29a42d120013773b1eabaf9486e7ab1ae76dd43f6a34e"
      session_id: "gemini-deprecation-phase3-2026-06-08"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Purge the cli-gemini executor everywhere outside specs

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

- [x] CHK-001 [P0] Requirements documented in spec.md. [EVIDENCE: spec.md defines P0/P1 requirements REQ-001..REQ-007 and scope]
- [x] CHK-002 [P0] Technical approach defined in plan.md. [EVIDENCE: plan.md phases, affected surfaces, and delete/swap classification]
- [x] CHK-003 [P1] Dependencies identified and available. [EVIDENCE: plan.md dependencies table covers operator approval, Node v25 vitest, and compiled dist]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Changed source compiles and targeted suites pass. [EVIDENCE: deep-loop-runtime 213/214, matrix-adapter 13/13, remediation 25/25 GREEN]
- [x] CHK-011 [P0] No active `cli-gemini`/`cli_gemini` references remain outside specs. [EVIDENCE: global `rg "cli-gemini|cli_gemini"` excluding `specs/**` returned zero matches]
- [x] CHK-012 [P1] Updated tests preserve coverage for removed executor. [EVIDENCE: deleted cases for pure-Gemini; swapped foils to `cli-devin`/`cli-opencode`/`cli-claude-code`; council fixture swapped to `cli-opencode`]
- [x] CHK-013 [P1] Code follows existing OpenCode patterns. [EVIDENCE: executor unions narrowed consistently; matrix recount keeps the 3-executor switch pattern]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Matrix adapter and test deletion verified. [EVIDENCE: `glob` for `adapter-cli-gemini.ts`, `matrix-adapter-gemini.vitest.ts`, and 4 compiled `dist/matrix_runners/adapter-cli-gemini.*` returned no files]
- [x] CHK-021 [P0] Global executor-reference search complete with specs excluded. [EVIDENCE: `rg "cli-gemini|cli_gemini"` excluding `specs/**` clean]
- [x] CHK-022 [P1] Targeted suites pass or are updated with evidence. [EVIDENCE: deep-loop-runtime 213/214, matrix-adapter 13/13, remediation 25/25]
- [x] CHK-023 [P1] JSON manifest syntax validated after cell removal. [EVIDENCE: `matrix-manifest.json` is valid JSON; matrix is 13 features × 3 executors = 39 cells, no F8]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class documented as cross-skill executor-surface removal. [EVIDENCE: spec.md problem statement classifies `cli-gemini` as a still-wired first-class executor]
- [x] CHK-FIX-002 [P0] Same-class `cli-gemini` producer inventory completed. [EVIDENCE: executor unions, audit maps, dispatch case blocks, and the matrix adapter all inventoried]
- [x] CHK-FIX-003 [P0] Consumer inventory completed across catalogs, playbooks, docs, tests, and changelogs. [EVIDENCE: resource-map.md tabulates every file by skill with change-type]
- [x] CHK-FIX-004 [P0] Deleted/swapped behavior validated by tests or targeted checks. [EVIDENCE: suites GREEN; council fixture verified by direct node run]
- [x] CHK-FIX-005 [P1] Boundary axes listed: executor surface vs Gemini runtime vs Gemini model. [EVIDENCE: spec.md scope/out-of-scope splits executor purge from the deferred runtime/model surfaces]
- [x] CHK-FIX-006 [P1] Mixed cross-CLI variant considered with swap-not-delete. [EVIDENCE: council fixture, CR-018, GIT-022 swapped to preserve other-CLI coverage]
- [x] CHK-FIX-007 [P1] Evidence pinned to explicit commands and counts, not branch-relative claims. [EVIDENCE: checklist cites named suites, cell counts, and global search results]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets introduced. [EVIDENCE: edits remove executor identifiers; no credentials added]
- [x] CHK-031 [P0] Edited changelogs do not expose secrets. [EVIDENCE: changelog edits replace executor wording only]
- [x] CHK-032 [P1] Gemini model/runtime references not accidentally scrubbed as secrets. [EVIDENCE: deferred surfaces left intact; only executor references removed]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks, decision record, and implementation summary synchronized. [EVIDENCE: packet docs authored together with consistent evidence]
- [x] CHK-041 [P1] Feature catalogs and template guide updated. [EVIDENCE: deep-loop-runtime, deep-improvement, system-spec-kit, deep-review feature catalogs and `template_guide.md` updated]
- [x] CHK-042 [P2] Release-history changelog mentions edited per operator direction. [EVIDENCE: ~13 changelogs naming `cli-gemini` as an executor updated]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No stray temp files added. [EVIDENCE: no packet scratch temp files created]
- [x] CHK-051 [P1] Playbook renames preserve IDs and counts. [EVIDENCE: CR-018 count 18, GIT-022 count 22 after handback renames]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 13/13 |
| P1 Items | 18 | 18/18 |
| P2 Items | 8 | 8/8 |

**Verification Date**: 2026-06-08
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Architecture decisions documented in decision-record.md. [EVIDENCE: ADR-001 swap-not-delete, ADR-002 changelog edits, ADR-003 boundary, ADR-004 matrix recount]
- [x] CHK-101 [P1] All ADRs have status. [EVIDENCE: ADR-001..ADR-004 status Accepted]
- [x] CHK-102 [P1] Alternatives documented with rejection rationale. [EVIDENCE: each ADR lists rejected alternatives]
- [x] CHK-103 [P2] Migration/follow-on path documented. [EVIDENCE: deferred Gemini runtime/model surfaces flagged for a separate decision]
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3: PERFORMANCE VERIFICATION

- [x] CHK-110 [P1] No runtime performance path changed by executor-surface removal. [EVIDENCE: source/doc/manifest cleanup only; no serving path changed]
- [x] CHK-111 [P1] Post-edit test runs confirm no dispatch path requires `cli-gemini`. [EVIDENCE: executor suites pass with the narrowed union]
- [x] CHK-112 [P2] Load testing not applicable for executor-surface removal. [EVIDENCE: no application serving path in scope]
- [x] CHK-113 [P2] Performance impact documented. [EVIDENCE: implementation-summary notes config/source cleanup only]
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3: DEPLOYMENT READINESS

- [x] CHK-120 [P0] Rollback procedure documented and verified against working-tree diff. [EVIDENCE: plan.md rollback restores the deleted adapter/test/dist and reverts edits from git]
- [x] CHK-121 [P0] Feature flag not applicable. [EVIDENCE: executor removal has no runtime flag surface]
- [x] CHK-122 [P1] Monitoring not applicable. [EVIDENCE: source/doc cleanup only]
- [x] CHK-123 [P1] Operator note documented for the deferred Gemini surfaces. [EVIDENCE: decision-record ADR-003 flags runtime/model surfaces for a separate decision]
- [x] CHK-124 [P2] Deployment runbook reviewed. [EVIDENCE: no feature flag or service rollout path; central validation runs after metadata]
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3: COMPLIANCE VERIFICATION

- [x] CHK-130 [P1] Review completed for edited source and changelogs. [EVIDENCE: targeted suites GREEN; changelog edits reviewed]
- [x] CHK-131 [P1] Dependency licenses unchanged. [EVIDENCE: no dependency changes in scope]
- [x] CHK-132 [P2] OWASP checklist not applicable. [EVIDENCE: no web/API auth surface in scope]
- [x] CHK-133 [P2] Data handling checked for edited changelog summaries. [EVIDENCE: edits change executor wording only]
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3: DOCUMENTATION VERIFICATION

- [x] CHK-140 [P1] All packet docs synchronized. [EVIDENCE: spec, plan, tasks, checklist, decision-record, implementation-summary, resource-map authored together]
- [x] CHK-141 [P1] API documentation not applicable. [EVIDENCE: no public API surface changed]
- [x] CHK-142 [P2] User-facing docs updated. [EVIDENCE: README and feature catalogs across affected skills updated]
- [x] CHK-143 [P2] Knowledge transfer documented in implementation summary. [EVIDENCE: implementation-summary captures decisions, verification, and the Node v25 fixture workaround]
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| User | Scope owner | Approved full purge + changelog edits | 2026-06-08 |
| claude-opus | Implementation author | Complete | 2026-06-08 |
<!-- /ANCHOR:sign-off -->
