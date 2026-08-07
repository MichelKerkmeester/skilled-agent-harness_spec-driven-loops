---
title: "Verification Checklist: Devin hook truth and runtime README parity"
description: "Evidence gates for hook-truth reconciliation, runtime mirror parity, local credential cleanup and recursive packet validation."
trigger_phrases:
  - "Devin hook truth checklist"
  - "runtime README parity verification"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival/011-hook-truth-and-runtime-readmes"
    last_updated_at: "2026-07-26T19:05:13Z"
    last_updated_by: "opencode"
    recent_action: "Verified phase 011 and the recursive parent packet"
    next_safe_action: "Rotate or revoke the removed credentials in the provider dashboards"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "decision-record.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-011-hook-truth"
      parent_session_id: null
    completion_pct: 100
    open_questions: ["Provider-side credential rotation requires operator access."]
    answered_questions: []
---
# Verification Checklist: Devin Hook Truth and Runtime README Parity

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | Hard blocker | Cannot claim completion until verified |
| **[P1]** | Required | Complete or obtain explicit user deferral |
| **[P2]** | Optional | May defer with a documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in `spec.md`. [EVIDENCE: `spec.md` defines six P0 and two P1 requirements with measurable acceptance criteria.]
- [x] CHK-002 [P0] Technical approach documented in `plan.md`. [EVIDENCE: `plan.md` records source-ranked correction, rollback and the test matrix.]
- [x] CHK-003 [P1] Dependencies identified in `spec.md`. [EVIDENCE: `spec.md` names corrected schema, live evidence and operator-only provider rotation.]
- [x] CHK-004 [P0] Baseline validation passed. [EVIDENCE: `validate.sh --recursive --strict` returned 0 errors and 0 warnings across the parent plus 10 children.]
- [x] CHK-005 [P0] Target paths were clean before edits. [EVIDENCE: target-scoped `git status --short` returned no output.]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Current docs lead with corrected schema and live event evidence. [EVIDENCE: `hook-testing-results.md:34` records tests 10-14 as current truth.]
- [x] CHK-011 [P0] Historical negative tests remain present and explicitly superseded. [EVIDENCE: `hook-testing-results.md:63` preserves tests 1-9 under explicit supersession.]
- [x] CHK-012 [P0] No unverified event or branch is described as observed. [EVIDENCE: `handover.md` retains the PermissionRequest, PostCompaction, run_subagent and deny-branch limits.]
- [x] CHK-013 [P1] Runtime READMEs use current file names, wiring and relative links. [EVIDENCE: all 11 `validate_document.py` runs reported zero issues.]
- [x] CHK-014 [P1] Zed edit changes only approved context-server blocks and the Code Mode path. [EVIDENCE: bounded `node -e` JSONC assertion found two required servers and zero obsolete keys.]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] `.devin/hooks.v1.json` remains unchanged. [EVIDENCE: Node assertion reported 8 events, 11 matcher groups, 19 commands and no wrapper keys.]
- [x] CHK-021 [P0] Eleven target READMEs pass validation. [EVIDENCE: 11/11 `validate_document.py --blocking-only` runs reported zero issues.]
- [x] CHK-022 [P0] Cursor mirror symlink resolves to the approved source and compares byte-for-byte equal. [EVIDENCE: `readlink`, `test -f` and `cmp -s` returned `cursor mirror: PASS`.]
- [x] CHK-023 [P0] Zed settings parse and obsolete keys plus local credentials are absent. [EVIDENCE: string-aware JSONC assertion returned `zed settings: PASS`.]
- [x] CHK-024 [P0] Recursive strict packet validation passes with 0 errors and 0 warnings. [EVIDENCE: `validate.sh --recursive --strict` passed the parent plus 11 children.]
- [x] CHK-025 [P1] Focused grep leaves only intentional historical or independently current dormant references. [EVIDENCE: focused `rg -n dormant` results were classified against current evidence and independent Cursor/MCP conditions.]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class is recorded. [EVIDENCE: `spec.md` defines cross-consumer schema-truth correction plus local security cleanup.]
- [x] CHK-FIX-002 [P0] Same-class producer inventory is captured. [EVIDENCE: `rg -l -i dormant` was run against the parent packet.]
- [x] CHK-FIX-003 [P0] Consumer inventory is complete. [EVIDENCE: `plan.md` covers parent docs, four phase surfaces, seven Devin READMEs and four runtime mirrors.]
- [x] CHK-FIX-004 [P0] Security invariant is defined. [EVIDENCE: `spec.md` requires no plaintext credential value in local config or authored docs.]
- [x] CHK-FIX-005 [P1] Matrix axes are listed. [EVIDENCE: `plan.md` records event observation, adapter verification, registration state and mirror role.]
- [x] CHK-FIX-006 [P1] Process-global hostile-state testing is not applicable. [EVIDENCE: `git diff --name-only` shows no runtime code or environment-precedence target.]
- [x] CHK-FIX-007 [P1] Baseline evidence is pinned to direct checks. [EVIDENCE: target-scoped `git status --short` and named validation commands record the baseline.]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] Local plaintext provider credentials removed from Zed settings. [EVIDENCE: JSONC assertion found zero affected credential keys in `settings.json`.]
- [x] CHK-031 [P0] Credential values are not reproduced in repository docs, patches or final output. [EVIDENCE: authored `handover.md` identifies credential classes only, never secret values.]
- [x] CHK-032 [P1] Provider-side rotation is explicitly handed back to the operator as unverified. [EVIDENCE: `handover.md` section 5 records remote revocation as operator-only.]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Parent, phase docs, handover and continuation prompt agree on current hook status. [EVIDENCE: `spec.md`, `handover.md` and `goal-prompt.md` identify six observed events and retain unobserved caveats.]
- [x] CHK-041 [P1] Seven Devin READMEs and four runtime mirror READMEs validate. [EVIDENCE: 11/11 `validate_document.py --type readme --blocking-only` checks passed.]
- [x] CHK-042 [P1] Generated description and graph metadata match authored docs. [EVIDENCE: `description.json` and `graph-metadata.json` refreshes reported zero failures; strict drift checks passed.]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temporary renderer output is outside the repository. [EVIDENCE: `/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/opencode/phase-011-level3` contains the renderer output.]
- [x] CHK-051 [P1] Upgrade backup or scaffold residue is absent from the final child packet; the reversible backup is in the approved temporary area. [EVIDENCE: child directory inventory contains only canonical docs, metadata and `scratch/`.]
- [x] CHK-052 [P1] Final diff contains only allowlisted files and the approved symlink. [EVIDENCE: target-scoped `git status --short` listed only phase-011 allowlist paths; `git diff --check` returned no output.]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:arch-verify -->
## Architecture Verification

- [x] CHK-100 [P0] Source-precedence decision is documented. [EVIDENCE: `decision-record.md:34` records the accepted corrected-schema precedence.]
- [x] CHK-101 [P1] Decision status is accepted. [EVIDENCE: `decision-record.md:40` records status `Accepted`.]
- [x] CHK-102 [P1] Alternatives are documented. [EVIDENCE: `decision-record.md:71` compares delete-history and leave-as-is options with rejection rationale.]
- [x] CHK-103 [P2] Data migration is not applicable; rollback covers repository and user-local surfaces.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## Performance Verification

- [x] CHK-110 [P1] Registration command count remains unchanged at 19. [EVIDENCE: `.devin/hooks.v1.json` assertion reported 8 events, 11 groups and 19 commands.]
- [x] CHK-111 [P1] Throughput testing is not applicable. [EVIDENCE: `spec.md` scopes only documentation, symlink and local configuration changes.]
- [x] CHK-112 [P2] Load testing is not applicable.
- [x] CHK-113 [P2] Performance benchmarks are not applicable.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## Deployment Readiness

- [x] CHK-120 [P0] Rollback paths verified from repository diff and the captured pre-edit Zed structure; removed credential values must not be restored. [EVIDENCE: `plan.md` section 7 records repository, symlink and sanitized Zed reversal steps.]
- [x] CHK-121 [P0] Feature flags are not applicable. [EVIDENCE: `git diff -- .devin/hooks.v1.json` is empty and no runtime behavior changed.]
- [x] CHK-122 [P1] Monitoring is not applicable. [EVIDENCE: `spec.md` limits delivery to documentation, discovery symlink and local configuration cleanup.]
- [x] CHK-123 [P1] Runtime operator guidance is present. [EVIDENCE: all 11 target `README.md` files document hook discovery and verification.]
- [x] CHK-124 [P2] No deployment runbook is required.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## Compliance Verification

- [x] CHK-130 [P1] Security review confirms no affected credential keys or values remain in Zed settings. [EVIDENCE: `node -e` JSONC credential-key assertion passed after the bounded edit.]
- [x] CHK-131 [P1] Dependency licenses are unchanged. [EVIDENCE: `git diff -- package.json package-lock.json` returned no dependency changes.]
- [x] CHK-132 [P2] OWASP review is not applicable to documentation and local config removal.
- [x] CHK-133 [P2] No user or application data is handled.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## Documentation Verification

- [x] CHK-140 [P1] All authored packet docs are synchronized. [EVIDENCE: `handover.md:23`, `goal-prompt.md:1` and phase-011 summaries record the same event matrix and operator handback.]
- [x] CHK-141 [P1] API documentation is not applicable. [EVIDENCE: `spec.md` lists only non-API documentation, symlink and local configuration surfaces.]
- [x] CHK-142 [P2] Runtime operator documentation is updated.
- [x] CHK-143 [P2] Handover and continuation guidance reflect the final state.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| OpenCode verification | Technical executor | Verified | 2026-07-25 |
| Operator | Credential owner | Action required: provider rotation | 2026-07-25 |
<!-- /ANCHOR:sign-off -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 21 | 21/21 |
| P1 Items | 24 | 24/24 |
| P2 Items | 8 | 8/8 |

**Verification Date**: 2026-07-25
<!-- /ANCHOR:summary -->
