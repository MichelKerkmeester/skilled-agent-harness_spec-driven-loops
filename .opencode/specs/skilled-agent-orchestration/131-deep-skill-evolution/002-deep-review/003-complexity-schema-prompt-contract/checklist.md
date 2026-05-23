---
title: "Verification Checklist: 116/003 - Review-Depth Schema and Prompt Contract"
description: "Level 3 verification checklist for reviewDepthSchemaVersion v2 documentation and prompt contract."
trigger_phrases:
  - "116 review depth checklist"
  - "searchLedger contract checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/131-deep-skill-evolution/002-deep-review/003-complexity-schema-prompt-contract"
    last_updated_at: "2026-05-22T00:00:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Verified phase 003 contract docs and prompt template."
    next_safe_action: "Use checklist evidence for phase 004 handoff."
    blockers: []
---

# Verification Checklist: 116/003 - Review-Depth Schema and Prompt Contract

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete or document approved deferral |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Gate 3 spec folder established [EVIDENCE: user pre-approved phase 003 folder as option C]
- [x] CHK-002 [P0] Phase context read [EVIDENCE: parent spec, research synthesis, Phase 002 summary, validator fixture, current state docs, and prompt template inspected]
- [x] CHK-003 [P0] Prohibited files preserved [EVIDENCE: no edits to validator, reducer, YAML gate, graph DB/handlers, or `review-depth-*.vitest.ts` files]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Template placeholders preserved [EVIDENCE: prompt-pack Vitest rendered production templates successfully]
- [x] CHK-011 [P0] Contract names match Phase B fixtures [EVIDENCE: `reviewDepthSchemaVersion`, `reviewDepthApplicability`, `targetSelection`, `searchCoverage`, and `searchLedger` documented]
- [x] CHK-012 [P1] Phase boundaries respected [EVIDENCE: implementation summary lists later validator/reducer/gate/graph phases as follow-up]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Prompt-pack Vitest passes [EVIDENCE: `pnpm --dir .opencode/skills/system-spec-kit/mcp_server exec vitest run --no-coverage prompt-pack` passed]
- [x] CHK-021 [P0] Strict spec validation passes [EVIDENCE: `validate.sh .../003-review-depth-schema-and-prompt-contract --strict` passed]
- [x] CHK-022 [P1] Metadata refreshed [EVIDENCE: `generate-context.js --json ...` refreshed graph metadata; `description.json` corrected to Level 3]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Discriminator documented [EVIDENCE: `state_format.md` documents `reviewDepthSchemaVersion: 2` and v1 fallback behavior]
- [x] CHK-FIX-002 [P0] Applicability documented [EVIDENCE: `reviewDepthApplicability` includes scope, enforcement, reason, and evidence refs]
- [x] CHK-FIX-003 [P0] Target selection documented [EVIDENCE: `targetSelection` includes selected targets, discovery methods, graph/semantic status, omitted targets, and evidence refs]
- [x] CHK-FIX-004 [P0] Search coverage documented [EVIDENCE: `searchCoverage` includes required arrays and all graph coverage modes]
- [x] CHK-FIX-005 [P0] Ledger linkage documented [EVIDENCE: disposition-specific linkage matrix included]
- [x] CHK-FIX-006 [P1] Trivial-scope skip documented [EVIDENCE: trivial+skip exemption documented in state docs and prompt template]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets introduced [EVIDENCE: documentation/template-only changes reviewed]
- [x] CHK-031 [P1] No command or prompt grants mutation authority outside review artifacts [EVIDENCE: prompt output section only adds JSONL field obligations]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P0] Spec/plan/tasks synchronized [EVIDENCE: all three docs describe setup, schema docs, prompt-pack edit, and verification]
- [x] CHK-041 [P0] ADR documented [EVIDENCE: `decision-record.md` contains ADR-001]
- [x] CHK-042 [P1] Downstream obligations named [EVIDENCE: `state_format.md` references `candidateCoverage`, `searchDebt`, `ruledOutCandidates`, `cleanSearchProof`, and `searchCoverage`]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Files stayed in approved scope [EVIDENCE: changed files match phase 003 docs/template scope]
- [x] CHK-051 [P1] No scratch artifacts left behind [EVIDENCE: no temp files created in the packet]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 15/15 |
| P1 Items | 8 | 8/8 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-05-22
**Verified By**: GPT-5.5 via cli-codex
**ADRs**: 1 documented, 1 accepted
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Architecture decisions documented in decision-record.md [EVIDENCE: ADR-001 present]
- [x] CHK-101 [P1] All ADRs have status [EVIDENCE: ADR-001 status is Accepted]
- [x] CHK-102 [P1] Alternatives documented with rejection rationale [EVIDENCE: big-bang rename, hard-fail v2, and unversioned additive alternatives documented]
- [x] CHK-103 [P1] Five Checks evaluation included [EVIDENCE: ADR-001 includes clarity, systems, bias, sustainability, and scope/value evaluation]
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [x] CHK-110 [P1] Prompt remains compact enough for LEAF-agent use [EVIDENCE: v2 subsection is a compact contract and example, not a full validator spec]
- [x] CHK-111 [P1] Verification commands complete locally [EVIDENCE: prompt-pack Vitest and strict spec validation completed]
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [x] CHK-120 [P0] Rollback procedure documented [EVIDENCE: `plan.md` enhanced rollback section]
- [x] CHK-121 [P1] Commit handoff included [EVIDENCE: `implementation-summary.md` ends with suggested commit message and `git add` paths]
- [x] CHK-122 [P1] Follow-up phases identified [EVIDENCE: implementation summary lists Phases 004-007]
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [x] CHK-130 [P1] Legacy compatibility documented [EVIDENCE: v1/v2 compatibility table included]
- [x] CHK-131 [P1] Trivial-scope exemption requires evidence [EVIDENCE: exemption requires `reviewDepthApplicability.evidenceRefs`]
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [x] CHK-140 [P1] All spec documents synchronized [EVIDENCE: spec, plan, tasks, checklist, decision record, and implementation summary reflect phase 003]
- [x] CHK-141 [P1] State-format and prompt docs cross-reference downstream ownership [EVIDENCE: Phase D/E/F/G boundaries documented]
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| GPT-5.5 via cli-codex | Phase C implementer | [x] Approved | 2026-05-22 |
<!-- /ANCHOR:sign-off -->
