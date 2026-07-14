---
title: "Verification Checklist: Eradicate Gemini as a host runtime and as a model everywhere outside specs"
description: "Checklist for Gemini runtime + model eradication across source, tests, manifests, catalogs, playbooks, docs, and changelogs with delete-vs-rewrite discipline and concurrent-session coordination."
trigger_phrases:
  - "gemini runtime eradication checklist"
importance_tier: "important"
contextType: "checklist"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/107-cli-gemini-deprecation/004-gemini-runtime-and-model-eradication"
    last_updated_at: "2026-06-08T19:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Recorded completed verification checklist"
    next_safe_action: "None"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/hooks/**"
      - ".opencode/skills/system-skill-advisor/**"
      - ".opencode/skills/system-code-graph/mcp_server/lib/runtime-detection.ts"
      - ".opencode/changelog/**"
    session_dedup:
      fingerprint: "sha256:d464ca6a83d0383f7b4e43cdad2b95f0f5bf7a070cd5700609ad373ca85d65c9"
      session_id: "gemini-deprecation-phase4-2026-06-08"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Eradicate Gemini as a host runtime and as a model everywhere outside specs

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

- [x] CHK-001 [P0] Requirements documented in spec.md. [EVIDENCE: spec.md defines P0/P1 requirements REQ-001..REQ-008 and scope]
- [x] CHK-002 [P0] Technical approach defined in plan.md. [EVIDENCE: plan.md four-wave phases, affected surfaces, and delete/modify/rewrite classification]
- [x] CHK-003 [P1] Dependencies identified and available. [EVIDENCE: plan.md dependencies table covers operator approval, the concurrent `devin`-removal session, count self-checks, and the user-home boundary]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Changed source compiles and touched suites pass. [EVIDENCE: system-spec-kit hooks 59 (1 pre-existing copilot skip; tsc clean), code-graph runtime 14/14, fallback-router 8/8, remediation 25/25, spec-kit scripts 8/8 + 267/267 extractors, promote 3/3 GREEN]
- [x] CHK-011 [P0] No active Gemini references remain outside specs except the 2 documented deferred files. [EVIDENCE: global `rg "gemini"` excluding `specs/**` returned only `settings-driven-invocation-parity.vitest.ts` and `references/decisions/deferred_decisions.md`]
- [x] CHK-012 [P1] Updated tests preserve coverage for removed runtime/model. [EVIDENCE: hook/runtime suites updated with the narrowed `RuntimeId` union; fallback-router retains the surviving model fallbacks]
- [x] CHK-013 [P1] Code follows existing OpenCode patterns. [EVIDENCE: runtime unions narrowed consistently across both MCP servers; the advisor runtime-value tuple stays canonical after the merge]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Hook-subsystem and runtime-doc deletions verified. [EVIDENCE: `hooks/gemini/` absent in system-spec-kit and system-skill-advisor; the 4 Gemini-runtime docs are deleted and de-indexed]
- [x] CHK-021 [P0] Global runtime/model search complete with specs excluded. [EVIDENCE: `rg "gemini"` excluding `specs/**` returns only the 2 deferred files]
- [x] CHK-022 [P1] Touched suites pass or are updated with evidence. [EVIDENCE: hooks 59, code-graph 14, fallback 8, remediation 25, scripts 8 + 267, promote 3]
- [x] CHK-023 [P1] Count self-checks and JSON/shell syntax validated. [EVIDENCE: playbook hard-coded file-count 387==387; catalog 324; advisor catalog 36 / playbook 45; 3 shell scripts `bash -n` OK; matrix/JSON parse OK]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class documented as cross-skill runtime + model surface eradication. [EVIDENCE: spec.md problem statement classifies Gemini as a still-wired host runtime and model after phase 003 deferred them]
- [x] CHK-FIX-002 [P0] Same-class Gemini producer inventory completed. [EVIDENCE: runtime enums, hook subsystems, the runtime-value tuple, model references, and 4 runtime docs all inventoried]
- [x] CHK-FIX-003 [P0] Consumer inventory completed across catalogs, playbooks, docs, scripts, tests, and changelogs. [EVIDENCE: resource-map.md tabulates every file by skill with change-type, including the 2 deferred files]
- [x] CHK-FIX-004 [P0] Deleted/modified/rewritten behavior validated by tests or targeted checks. [EVIDENCE: suites GREEN; `gate-3-classifier.ts` confirmed docs-comment only; `bash -n` OK]
- [x] CHK-FIX-005 [P1] Boundary axes listed: executor (done in 003) vs runtime vs model vs external binary state. [EVIDENCE: spec.md scope/out-of-scope splits runtime + model eradication from the retained `~/.gemini` binary state]
- [x] CHK-FIX-006 [P1] Mixed/comparison variant considered with rewrite-not-gut and concurrent-session coordination. [EVIDENCE: `claude_tools.md` rewritten 3-way to 2-way; 2 advisor files deferred to the concurrent session]
- [x] CHK-FIX-007 [P1] Evidence pinned to explicit commands and counts, not branch-relative claims. [EVIDENCE: checklist cites named suites, count self-checks, and global search results]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets introduced. [EVIDENCE: edits remove runtime/model identifiers; no credentials added]
- [x] CHK-031 [P0] Edited changelogs and scripts do not expose secrets. [EVIDENCE: changelog edits replace runtime/model wording only; shell-script edits remove a pgrep pattern]
- [x] CHK-032 [P1] External Gemini-CLI binary state not accidentally scrubbed. [EVIDENCE: `~/.gemini` and `.geminiignore` left intact by design]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks, decision record, and implementation summary synchronized. [EVIDENCE: packet docs authored together with consistent evidence]
- [x] CHK-041 [P1] Feature catalogs, guides, and the comparison doc updated. [EVIDENCE: 14 top-level/refs/guides + 29 cli-* docs updated; `claude_tools.md` rewritten 3-way to 2-way]
- [x] CHK-042 [P2] Release-history changelog mentions edited per operator direction. [EVIDENCE: 43 changelogs + `PUBLIC_RELEASE.md` updated; runtime/mirror counts reconciled]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No stray temp files added. [EVIDENCE: no packet scratch temp files created]
- [x] CHK-051 [P1] Deletions and de-indexing preserve count self-checks. [EVIDENCE: playbook 391 to 387, catalog 325 to 324; advisor catalog 37 to 36, playbook 46 to 45; 387==387 self-check passes]
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

- [x] CHK-100 [P0] Architecture decisions documented in decision-record.md. [EVIDENCE: ADR-001 runtime eradication, ADR-002 swap/rewrite, ADR-003 concurrent-session coordination, ADR-004 changelog edits, ADR-005 gate-3 neutrality, ADR-006 external-binary boundary]
- [x] CHK-101 [P1] All ADRs have status. [EVIDENCE: ADR-001..ADR-006 status Accepted]
- [x] CHK-102 [P1] Alternatives documented with rejection rationale. [EVIDENCE: each ADR lists rejected alternatives]
- [x] CHK-103 [P2] Migration/follow-on path documented. [EVIDENCE: the 2 deferred system-skill-advisor files are flagged for the concurrent `devin`-removal session]
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3: PERFORMANCE VERIFICATION

- [x] CHK-110 [P1] No runtime performance path changed by runtime/model surface removal. [EVIDENCE: source/doc/manifest cleanup only; no serving path changed]
- [x] CHK-111 [P1] Post-edit test runs confirm no path requires Gemini. [EVIDENCE: hook/runtime/fallback suites pass with the narrowed enums and tuple]
- [x] CHK-112 [P2] Load testing not applicable for runtime/model surface removal. [EVIDENCE: no application serving path in scope]
- [x] CHK-113 [P2] Performance impact documented. [EVIDENCE: implementation-summary notes config/source/doc cleanup only]
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3: DEPLOYMENT READINESS

- [x] CHK-120 [P0] Rollback procedure documented and verified against working-tree diff. [EVIDENCE: plan.md rollback restores the deleted hook subsystems, 4 docs, and runtime-enum members and reverts edits from git]
- [x] CHK-121 [P0] Feature flag not applicable. [EVIDENCE: runtime/model removal has no runtime flag surface]
- [x] CHK-122 [P1] Monitoring not applicable. [EVIDENCE: source/doc cleanup only]
- [x] CHK-123 [P1] Operator note documented for the deferred advisor files. [EVIDENCE: decision-record ADR-003 flags the 2 files for the concurrent session]
- [x] CHK-124 [P2] Deployment runbook reviewed. [EVIDENCE: no feature flag or service rollout path; central validation runs after metadata]
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3: COMPLIANCE VERIFICATION

- [x] CHK-130 [P1] Review completed for edited source, scripts, and changelogs. [EVIDENCE: touched suites GREEN; `bash -n` OK; changelog edits reviewed]
- [x] CHK-131 [P1] Dependency licenses unchanged. [EVIDENCE: no dependency changes in scope]
- [x] CHK-132 [P2] OWASP checklist not applicable. [EVIDENCE: no web/API auth surface in scope]
- [x] CHK-133 [P2] Data handling checked for edited changelog summaries. [EVIDENCE: edits change runtime/model wording and reconcile counts only]
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3: DOCUMENTATION VERIFICATION

- [x] CHK-140 [P1] All packet docs synchronized. [EVIDENCE: spec, plan, tasks, checklist, decision-record, implementation-summary, resource-map authored together]
- [x] CHK-141 [P1] API documentation not applicable. [EVIDENCE: no public API surface changed]
- [x] CHK-142 [P2] User-facing docs updated. [EVIDENCE: README, install guides, feature catalogs, and cli-* docs across affected skills updated]
- [x] CHK-143 [P2] Knowledge transfer documented in implementation summary. [EVIDENCE: implementation-summary captures the four waves, decisions, verification, and the concurrent-session coordination]
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| User | Scope owner | Approved "no Gemini anywhere" + changelog edits | 2026-06-08 |
| claude-opus | Implementation author | Complete | 2026-06-08 |
<!-- /ANCHOR:sign-off -->
