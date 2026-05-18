---
title: "Verification Checklist: shared model intelligence"
description: "L3 checks for Phase D."
trigger_phrases: ["shared intelligence checklist"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/114-small-ai-model-optimization/005-shared-intelligence"
    last_updated_at: "2026-05-18T16:57:00Z"
    last_updated_by: "codex"
    recent_action: "Marked Phase 005 verification checklist with implementation evidence"
    next_safe_action: "Review diffs and commit the explicit Phase 005 path list"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000022"
      session_id: "114-005-checklist-init"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Verification Checklist: shared model intelligence

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling |
|----------|----------|
| **[P0]** | HARD BLOCKER |
| **[P1]** | Required |
| **[P2]** | Optional |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] 002 + 004 shipped — read shipped summaries and Phase 004 budget asset before implementation.
- [x] CHK-002 [P0] spec.md L3 validates — final strict validation captured in `/tmp/validate-005.log`.
- [x] CHK-003 [P0] plan.md L3 validates — final strict validation captured in `/tmp/validate-005.log`.
- [x] CHK-004 [P1] Research §RQ3 + iter-008 re-read — read `research.md:414-620`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] model-profiles.json well-formed; 4 required + 2 optional present — `jq empty` passed; count `6/4/2`.
- [x] CHK-011 [P0] Schema versioned (`version: "1.0"`) — registry top-level version set.
- [x] CHK-012 [P1] Bayesian scoring uses Laplace smoothing (success+1)/(total+2) — `bayesian-scorer.ts` plus unit tests.
- [x] CHK-013 [P1] Tool demote threshold >50% on ≥3 calls — `shouldDemote(score, totalCalls)` plus threshold tests.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Unit: bayesian scoring with mock sequences — `npx vitest run tests/deep-loop/bayesian-scorer.vitest.ts`.
- [x] CHK-021 [P0] Unit: fallback routing for each required pair from registry — `fallback-router.vitest.ts`, including 16 required combinations and optional adoption paths.
- [x] CHK-022 [P0] Empirical: SWE-1.6 free exhaustion → fail-fast, not gpt-5.5 — `/tmp/phase-005-tests.log`.
- [x] CHK-023 [P0] Empirical: below-50% score after 3+ calls → demoted in next iter — `bayesian-scorer.vitest.ts`.
- [x] CHK-024 [P1] Both SWE-1.6 free + Pro exhausted → operator alerted (no silent fallback) — default fail-fast reasons name `cognition-free` and `cognition-pro`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P0] Affected files modified per revised user scope — registry/doc, recipes, router/scorer/tests, refs, and packet docs.
- [x] CHK-031 [P0] No regression in existing cli-* dispatches — new recipe fields default off; focused tests and typecheck pass.
- [x] CHK-032 [P0] cli-* SKILL.md §3 reference registry — cli-devin and cli-opencode cross-ref `sk-prompt/assets/model-profiles.json`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P1] Registry doesn't leak credentials or internal endpoints — JSON contains model metadata only.
- [x] CHK-041 [P2] Fallback result names target and pool for audit trail — `resolveFallback` reason strings include source pool and target pool/model.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P0] sk-prompt/references/model-profiles.md explains schema + update protocol — 417 LOC.
- [x] CHK-051 [P0] cli-devin/references/quota-fallback.md has decision matrix + worked examples — 479 LOC.
- [x] CHK-052 [P1] sk-small-model pattern-index has 3 shipped rows.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P0] Registry under sk-prompt/assets/ (per iter-008 verdict) — `.opencode/skills/sk-prompt/assets/model-profiles.json`.
- [x] CHK-061 [P0] Bayesian state per-iter ephemeral in `agent-state/` paths — documented in recipes and output-verification.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

- **Total checks**: 25+
- **P0 blockers**: 13+
- **P1 required**: 8+
- **P2 optional**: 2+
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Registry is data (JSON), not code.
- [x] CHK-101 [P0] Bayesian scoring lives in agent-config recipes (per iter-008 verdict, not in mcp-code-mode); TS helper only tests the documented formula.
- [x] CHK-102 [P1] Three features (registry/scoring/fallback) loosely coupled and independently rollbackable.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [x] CHK-110 [P0] Registry lookup is in-memory array lookup in `fallback-router.ts`; focused tests complete in 192ms overall.
- [x] CHK-111 [P0] Bayesian scoring is constant-time arithmetic in `bayesian-scorer.ts`; focused tests complete in 192ms overall.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [x] CHK-120 [P0] Each feature independently rollback-able — data-only registry, opt-in recipe fields, and standalone helper/tests.
- [x] CHK-121 [P0] Memory indexing picks up new assets — packet continuity frontmatter updated; canonical DB save/re-index not requested in this implementation handoff.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [x] CHK-130 [P0] No re-proposal of 113 shipped findings.
- [x] CHK-131 [P1] Free-tier disclosure for SWE-1.6 preserved in registry (`free_tier: true`, `quota_pool: cognition-free`).
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [x] CHK-140 [P0] Reference docs cite research §RQ3 + iter-008 and ADR-001.
- [x] CHK-141 [P1] Update protocol in model-profiles.md is actionable.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Role | Reviewer | Date | Notes |
|------|----------|------|-------|
| Implementer | TBD | TBD | |
| Fallback pair reviewer | TBD | TBD | Validate all routing pairs |
| User | michelkerkmeester | TBD | |
<!-- /ANCHOR:sign-off -->
