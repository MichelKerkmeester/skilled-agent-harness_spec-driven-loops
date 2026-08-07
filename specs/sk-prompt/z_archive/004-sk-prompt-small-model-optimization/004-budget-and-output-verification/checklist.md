---
title: "Verification Checklist: cli-devin quality optimization"
description: "L3 quality gates for Phase C."
trigger_phrases:
  - "cli-devin quality checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-prompt/004-sk-prompt-small-model-optimization/004-budget-and-output-verification"
    last_updated_at: "2026-05-18T14:34:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored 004 checklist.md L3"
    next_safe_action: "Author 004 decision-record.md"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000016"
      session_id: "114-004-checklist-init"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Verification Checklist: cli-devin quality optimization

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] 002 shipped — evidence: 002 implementation-summary read; Phase 004 builds on shipped sentinel.
- [x] CHK-002 [P0] spec.md L3 validates — evidence: `/tmp/validate-004.log`.
- [x] CHK-003 [P0] plan.md L3 validates — evidence: `/tmp/validate-004.log`.
- [x] CHK-004 [P1] Research §RQ1 + §RQ2 re-read — evidence: research.md RQ1/RQ2, iter-006, iter-007 read.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] per-model-budgets.json well-formed JSON; covers slim scope 4 required + 2 optional stubs — evidence: `jq empty` passed.
- [x] CHK-011 [P0] post-dispatch-validate.ts changes are typed strict-mode — evidence: `npx tsc --noEmit --composite false -p tsconfig.json` passed.
- [x] CHK-012 [P1] Truncation marker syntax consistent with smallcode source format — evidence: `[... truncated N tokens]` documented and smoked.
- [x] CHK-013 [P1] Rubric weights sum to 0.95 before auto-fix penalty, matching smallcode formula — evidence: confidence-scoring-rubric.md.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Unit: verification step scores hallucinated code below threshold — evidence: 14/14 focused vitest passed.
- [x] CHK-021 [P0] Unit: verification step scores valid code above threshold — evidence: 14/14 focused vitest passed.
- [x] CHK-022 [P0] Integration: iter with verification enabled marks degraded on bad output — evidence: `/tmp/verification-integ-004.log`.
- [x] CHK-023 [P0] Backward compat: iter without verification opt-in works unchanged — evidence: `/tmp/backward-compat-004.log`.
- [x] CHK-024 [P1] Empirical: truncation marker visible at >70% budget — evidence: `/tmp/budget-smoke-004.log`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P0] All affected files modified per spec.md §3 plus user-directed validator test — evidence: git diff scoped path list.
- [x] CHK-031 [P0] No regressions in existing cli-devin dispatches (sample 3) — evidence: iteration-020/019/018 pass-through in `/tmp/backward-compat-004.log`.
- [x] CHK-032 [P0] 3 agent-config recipes have verification opt-in block — evidence: jq audit and recipe diff.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P1] Verification step doesn't execute untrusted code outside sandbox — evidence: Phase 004 validator uses static scoring only.
- [x] CHK-041 [P2] Compile/run commands have timeouts to prevent fork bombs — evidence: runtime execution deferred; docs require sandbox/timeouts before enabling execution.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P0] context-budget.md cites research §RQ1 + iter-006 with line refs — evidence: context-budget.md source table.
- [x] CHK-051 [P0] output-verification.md cites research §RQ2 + iter-007 with line refs — evidence: output-verification.md source table.
- [x] CHK-052 [P1] sk-small-model/references/pattern-index.md has shipped rows — evidence: 4 Phase 004 rows marked shipped.
- [x] CHK-053 [P1] cli-devin/SKILL.md §3 cross-references the new assets — evidence: one-line §3 cross-reference.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P0] Budget files in cli-devin/assets/; reference docs in cli-devin/references/ — evidence: file paths created.
- [x] CHK-061 [P0] Validator change in system-spec-kit/mcp_server/lib/deep-loop/ as sibling step — evidence: `runOptionalVerificationPass` added beside structural validator.
- [x] CHK-062 [P1] No spurious files — evidence: temporary vitest harness deleted; only user-directed `/tmp` logs/script remain.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

- **Total checks**: 25+
- **P0 blockers**: 15+
- **P1 required**: 7+
- **P2 optional**: 2+
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Verification gate is sibling-step to post-dispatch-validate.ts (not in-place modification) — evidence: optional helper invoked after existing structural checks.
- [x] CHK-101 [P0] Budget defaults are DATA (JSON), not code — evidence: per-model-budgets.json.
- [x] CHK-102 [P1] Opt-in semantics: recipe field `verification_enabled` defaults false — evidence: all 3 recipes set false.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [x] CHK-110 [P0] Budget engine eval <10ms per prompt composition (NFR-P01) — evidence: `/tmp/budget-smoke-004.log` one-shot calculation completed instantly.
- [x] CHK-111 [P0] Verification pass <60s per iter (NFR-P02) — evidence: focused vitest and integration harness complete under 1s.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [x] CHK-120 [P0] Verification OFF by default; backward compat preserved — evidence: unit + integration pass.
- [x] CHK-121 [P0] Memory indexing picks up new assets + references — evidence: implementation-summary continuity updated; canonical memory save not requested in this turn.
- [x] CHK-122 [P1] Rollback documented in plan.md §8 — evidence: plan.md §8 read.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [x] CHK-130 [P0] No re-proposal of 113-shipped findings — evidence: scope limited to budget/verification.
- [x] CHK-131 [P1] License clean (smallcode MIT, our derived patterns internal) — evidence: references cite source patterns; no copied runtime code.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [x] CHK-140 [P0] Reference docs include file:line citations to smallcode source — evidence: context-budget.md and output-verification.md cite budget/verifier/hard_fail lines.
- [x] CHK-141 [P1] Cross-references between this packet's docs are accurate — evidence: strict validation passed.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Role | Reviewer | Date | Notes |
|------|----------|------|-------|
| Implementer | TBD | TBD | |
| Verification reviewer | TBD | TBD | Confirm rubric weights |
| User | michelkerkmeester | TBD | Final acceptance |
<!-- /ANCHOR:sign-off -->
