---
title: "Verification Checklist: Deprecate project .gemini runtime surface"
description: "Checklist for project .gemini deletion, active-reference cleanup, and verification."
trigger_phrases:
  - "gemini deprecation checklist"
importance_tier: "important"
contextType: "checklist"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/021-cli-gemini-deprecation/001-runtime-surface-and-skill-deletion"
    last_updated_at: "2026-06-05T07:35:35Z"
    last_updated_by: "opencode"
    recent_action: "Completed .gemini deletion"
    next_safe_action: "None"
    blockers: []
    key_files:
      - ".gemini/**"
      - "AGENTS.md"
      - "README.md"
      - ".opencode/commands/**"
      - ".opencode/skills/**"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "gemini-deprecation-2026-06-05"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Deprecate project .gemini runtime surface

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

- [x] CHK-001 [P0] Requirements documented in spec.md. [EVIDENCE: spec.md defines P0/P1 requirements and scope]
- [x] CHK-002 [P0] Technical approach defined in plan.md. [EVIDENCE: plan.md phases and affected surfaces]
- [x] CHK-003 [P1] Dependencies identified and available. [EVIDENCE: plan.md dependencies table]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Changed source, scripts, and config parse or test successfully. [EVIDENCE: targeted Vitest suites and direct handback assertions passed; JSON/TOML/Python/Shell/YAML syntax checks passed; the workspace handback Vitest runner timed out before printing a banner]
- [x] CHK-011 [P0] No active project `.gemini` path references remain outside approved exclusions. [EVIDENCE: final disallowed project `.gemini` path scan returned no output]
- [x] CHK-012 [P1] Updated tests preserve coverage for removed mirror assumptions. [EVIDENCE: deep-research/deep-review runtime ID expectations now assert `opencode`, `claude`, `codex`; parity suites pass]
- [x] CHK-013 [P1] Code follows existing OpenCode patterns. [EVIDENCE: alignment drift PASS for active changed surfaces; skills scan reported unrelated non-blocking benchmark warnings; comment hygiene clean]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] `.gemini/**` tracked-file deletion verified. [EVIDENCE: `glob .gemini/**` returned no files; `git diff --name-only` lists tracked `.gemini/**` deletions]
- [x] CHK-021 [P0] Active-reference search complete with specs excluded. [EVIDENCE: targeted `rg --pcre2` scans excluded `specs/**` and `.opencode/specs/**`; disallowed path scan clean]
- [x] CHK-022 [P1] Targeted runtime/parity tests pass or are updated with evidence. [EVIDENCE: SpecKit runtime tests 33/33 pass; deep-loop parity tests 16 pass/1 skipped; deep-improvement mirror verifier 3/3 pass]
- [x] CHK-023 [P1] Shell/Python/JSON/YAML syntax checks run for changed files. [EVIDENCE: `bash -n`, `python3 -m py_compile`, `python3 -m json.tool`, `python3.11 tomllib`, and PyYAML parse checks passed]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class documented as cross-consumer runtime-surface deprecation. [EVIDENCE: spec.md problem statement and implementation summary classify the runtime-surface deletion]
- [x] CHK-FIX-002 [P0] Same-class project `.gemini` producer inventory completed. [EVIDENCE: tracked `.gemini/**` deletion list and command/create/deep-loop producer updates]
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, manifests, docs, and tests. [EVIDENCE: updates span runtime manifests, parity tests, command assets, doctor scripts, top-level docs, and skill docs]
- [x] CHK-FIX-004 [P0] Deleted-path behavior validated by tests or targeted static checks. [EVIDENCE: `glob .gemini/**` no files; runtime detection tests expect Gemini hookPolicy `unavailable`; manual test now asserts absence]
- [x] CHK-FIX-005 [P1] Matrix axes listed: project runtime path, user-home Gemini state, specs historical scope, generated artifacts. [EVIDENCE: spec.md scope/out-of-scope and implementation-summary decisions cover all four axes]
- [x] CHK-FIX-006 [P1] Environment/global-state variant considered for Gemini runtime detection. [EVIDENCE: user-home `$HOME/.gemini` and `~/.gemini` docs are treated separately from the deleted checked-in skill and project runtime directory]
- [x] CHK-FIX-007 [P1] Evidence is pinned to explicit commands and working-tree diff, not branch-relative claims. [EVIDENCE: checklist and implementation summary cite concrete commands and working-tree scans]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets introduced. [EVIDENCE: diff secret-pattern scan returned no output]
- [x] CHK-031 [P0] Deleted config does not expose secrets in summaries or docs. [EVIDENCE: summaries describe deleted paths and verification, not secret values; diff secret-pattern scan clean]
- [x] CHK-032 [P1] User-home Gemini auth docs remain scoped to `~/.gemini` where retained. [EVIDENCE: retained Gemini references must describe user-home or external binary behavior, not a checked-in `cli-gemini` skill]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks, decision record, and implementation summary synchronized. [EVIDENCE: packet docs updated with implementation and validation evidence]
- [x] CHK-041 [P1] README and AGENTS active runtime guidance updated. [EVIDENCE: edited top-level docs; final disallowed project path scan clean]
- [x] CHK-042 [P2] Historical non-spec changelog mentions reviewed and either updated or documented as intentional history. [EVIDENCE: agent-orchestration and skill changelog literals updated to former-Gemini wording]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files kept in scratch or approved temp locations only. [EVIDENCE: no packet scratch temp files added; generated Python `__pycache__` check found no files]
- [x] CHK-051 [P1] scratch cleanup reviewed before completion. [EVIDENCE: no scratch artifacts created for this packet]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 15/15 |
| P1 Items | 23 | 23/23 |
| P2 Items | 9 | 9/9 |

**Verification Date**: 2026-06-05
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Architecture decisions documented in decision-record.md. [EVIDENCE: decision-record.md ADR-001]
- [x] CHK-101 [P1] All ADRs have status. [EVIDENCE: ADR-001 status Accepted]
- [x] CHK-102 [P1] Alternatives documented with rejection rationale. [EVIDENCE: decision-record.md alternatives table]
- [x] CHK-103 [P2] Migration path documented after implementation. [EVIDENCE: implementation-summary.md documents remaining repo-managed runtimes and restart note]
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3: PERFORMANCE VERIFICATION

- [x] CHK-110 [P1] No runtime performance path changed by repository runtime-surface deletion. [EVIDENCE: project config/skill/doc cleanup only; no application serving path changed]
- [x] CHK-111 [P1] Post-edit test/runtime checks confirm no new startup path requires project `.gemini`. [EVIDENCE: runtime detection tests pass; final disallowed path scan clean]
- [x] CHK-112 [P2] Load testing not applicable for repository runtime-surface deletion. [EVIDENCE: no application serving path in scope]
- [x] CHK-113 [P2] Performance impact documented after implementation. [EVIDENCE: implementation-summary notes repository config cleanup only; no runtime serving path changed]
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3: DEPLOYMENT READINESS

- [x] CHK-120 [P0] Rollback procedure documented and verified against working-tree diff. [EVIDENCE: implementation-summary rollback notes restore deleted `.gemini/**` and revert edited references from git diff]
- [x] CHK-121 [P0] Feature flag not applicable. [EVIDENCE: deletion of checked-in runtime mirror has no runtime flag surface]
- [x] CHK-122 [P1] Monitoring not applicable. [EVIDENCE: repository configuration cleanup only]
- [x] CHK-123 [P1] Operator restart note documented if OpenCode config-time files change. [EVIDENCE: implementation-summary includes OpenCode restart note]
- [x] CHK-124 [P2] Deployment runbook reviewed after implementation. [EVIDENCE: deployment impact is config/doc surface only; no feature flag or service rollout path]
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3: COMPLIANCE VERIFICATION

- [x] CHK-130 [P1] Security review completed for deleted config and retained user-home docs. [EVIDENCE: diff secret-pattern scan clean; retained docs stay user-home/sandbox scoped]
- [x] CHK-131 [P1] Dependency licenses unchanged. [EVIDENCE: no dependency changes in scope]
- [x] CHK-132 [P2] OWASP checklist not applicable. [EVIDENCE: no web/API auth surface in scope]
- [x] CHK-133 [P2] Data handling checked for deleted config summaries. [EVIDENCE: summaries avoid secret values and describe only deleted runtime-surface paths]
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3: DOCUMENTATION VERIFICATION

- [x] CHK-140 [P1] All packet docs synchronized after implementation. [EVIDENCE: spec.md, tasks.md, checklist.md, and implementation-summary.md updated after verification]
- [x] CHK-141 [P1] API documentation not applicable or documented as such after implementation. [EVIDENCE: no public API surface changed]
- [x] CHK-142 [P2] User-facing documentation updated. [EVIDENCE: README and active skill docs updated to remove project `.gemini` setup]
- [x] CHK-143 [P2] Knowledge transfer documented in implementation summary. [EVIDENCE: implementation-summary captures decisions, verification, rollback, and operator restart note]
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| User | Scope owner | Approved deletion semantics | 2026-06-05 |
| OpenCode | Implementation owner | Complete | 2026-06-05 |
<!-- /ANCHOR:sign-off -->
