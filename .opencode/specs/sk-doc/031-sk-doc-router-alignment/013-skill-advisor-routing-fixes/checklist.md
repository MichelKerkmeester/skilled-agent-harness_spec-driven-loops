---
title: "Verification Checklist: system-skill-advisor Routing Fixes"
description: "Verification Date: pending. Section 9 verification commands plus Section 10 acceptance-matrix rows from research.md, alongside standard Level 3 code, testing, security, documentation and architecture verification."
trigger_phrases:
  - "skill advisor routing fixes checklist"
  - "advisor fix verification commands"
  - "acceptance matrix rows advisor"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/031-sk-doc-router-alignment/013-skill-advisor-routing-fixes"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the Level 3 verification checklist from research.md Sections 9-10"
    next_safe_action: "Leave unchecked until implementation runs each verification command"
    blockers: []
    key_files:
      - "checklist.md"
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "013-skill-advisor-routing-fixes-authoring"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: system-skill-advisor Routing Fixes

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

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

- [ ] CHK-001 [P0] Requirements documented in spec.md (REQ-001 through REQ-008)
- [ ] CHK-002 [P0] Technical approach and phase dependencies defined in plan.md
- [ ] CHK-003 [P1] The P0-1 output-contract decision made per decision-record.md ADR-007 before Phase 1 code lands
- [ ] CHK-004 [P1] Fixture format and location for T005 (P1-5) confirmed jointly with sibling packet 012-sk-doc-routing-fixes
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:research-verification -->
## Research Verification Commands (research.md Section 9)

- [ ] CHK-RV-001 [P0] Hook and fallback suites green: `npm --prefix .opencode/skills/system-skill-advisor/mcp_server test -- --run tests/hooks/claude-user-prompt-submit-hook.vitest.ts tests/hooks/skill-advisor-cli-fallback-envelope.vitest.ts`
- [ ] CHK-RV-002 [P0] Executor-delegation parity green in verbose mode: `npm --prefix .opencode/skills/system-skill-advisor/mcp_server test -- --run tests/scorer/executor-delegation.vitest.ts --reporter=verbose`
- [ ] CHK-RV-003 [P0] Baseline freshness restored: `shasum -a 256 .opencode/skills/system-skill-advisor/mcp_server/scripts/routing-accuracy/*.jsonl` matches the recorded hashes, then `npm --prefix .opencode/skills/system-skill-advisor/mcp_server test -- --run tests/parity/scorer-eval-baseline-ratchet.vitest.ts` passes
- [ ] CHK-RV-004 [P1] Warm-only CLI fallback behaves correctly when the daemon is absent: `node .opencode/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"test"}' --warm-only --format json --timeout-ms 3000` returns exit 75
<!-- /ANCHOR:research-verification -->

---

<!-- ANCHOR:acceptance-matrix -->
## Acceptance Matrix (research.md Section 10)

- [ ] CHK-AM-001 [P0] P0-1: 11/11 hook tests green, reference text matches the chosen output contract
- [ ] CHK-AM-002 [P0] P0-2: primary-timeout to fallback-success test passes within the total hook budget
- [ ] CHK-AM-003 [P0] P0-3: executor suite green, `result.ambiguous` coherent with the top `ambiguousWith` on every fixture, both override branches covered
- [ ] CHK-AM-004 [P0] P0-4: ratchet hash assertions pass, joined report includes reliability bins
- [ ] CHK-AM-005 [P1] P1-5: every sk-doc workflow mode has a passing discovery fixture, `parent-skill-check.cjs` fails on a missing one
- [ ] CHK-AM-006 [P1] P1-6: parity suite green across the 4 env-row surfaces and the 2 call-row surfaces
- [ ] CHK-AM-007 [P2] P2-8: shadow floor change accepted or rejected strictly by the three empirical gates, no gate relaxation
<!-- /ANCHOR:acceptance-matrix -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] TypeScript files pass the existing project typecheck
- [ ] CHK-011 [P0] No new console errors or warnings in vitest output
- [ ] CHK-012 [P1] Error handling for the daemon-absent and probe-timeout fallback paths implemented explicitly, not inferred from a passing happy path
- [ ] CHK-013 [P1] New guard suites (P1-5, P1-6) follow the existing `tests/parity/` and `tests/hooks/` file conventions
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All acceptance criteria in spec.md REQ-001 through REQ-008 met
- [ ] CHK-021 [P0] All 4 Section 9 verification commands run and pass
- [ ] CHK-022 [P1] Edge cases from spec.md Section 8 tested: env-override module freeze, retired-alias fixture, daemon-absent exit 75
- [ ] CHK-023 [P1] The `better-sqlite3` ABI mismatch from the research session confirmed resolved, or Phase 3's live verification explicitly run in filesystem-projection fallback mode
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each of the 8 fix-plan items (P0-1 through P2-8) has a finding class: P0-1 and P0-3 are `algorithmic` (contract/finalization-boundary defects), P0-2 is `class-of-bug` (budget-starvation pattern), P0-4 is `matrix/evidence` (measurement repair), P1-5/P1-6/P1-P2-7 are `test-isolation` (missing guard coverage), P2-8 is `algorithmic` (gated constant change)
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed for `result.ambiguous`/`ambiguousWith` writers (plan.md FIX ADDENDUM), or instance-only status proven by grep
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for `taskIntentFloor`, the no-brief output shape, and `hookTimeout` (plan.md FIX ADDENDUM required inventories)
- [ ] CHK-FIX-004 [P0] Fallback-budget and finalization-boundary fixes include adversarial table tests for daemon-absent, probe-timeout, primary-timeout and existing-candidate-branch cases
- [ ] CHK-FIX-005 [P1] Matrix axes and row count listed before completion is claimed: research.md Section 10's 7 rows plus P1-6's 4-by-2 surface matrix
- [ ] CHK-FIX-006 [P1] Env-override hostile-state variant executed for P1-6 (module-load freezing behavior under `vi.resetModules()`)
- [ ] CHK-FIX-007 [P1] Evidence pinned to the fix commit SHA for each of the 8 fix-plan items, not a moving branch-relative range
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets introduced in any fixture, baseline or diagnostic-taxonomy change
- [ ] CHK-031 [P0] HMAC prompt cache keying and SQLite integrity quick_check confirmed untouched (NFR-S01)
- [ ] CHK-032 [P1] Fail-open freshness behavior (`absent`/`unavailable` empty recommendations with warnings, `stale` degrades only `graph_causal`) confirmed unchanged after Phase 4
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec.md, plan.md, tasks.md, checklist.md and decision-record.md synchronized on the P0-1 contract decision and the P2-8 verdict
- [ ] CHK-041 [P1] `references/hooks/skill_advisor_hook.md` states the resolved output contract and the transport diagnostic taxonomy
- [ ] CHK-042 [P2] Manual playbook doc corrected for authored-source vs build-owner vs executed-dist ownership
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only during implementation
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:arch-verify -->
## Architecture Verification

- [ ] CHK-100 [P0] All 8 architecture decisions documented in decision-record.md with a status
- [ ] CHK-101 [P1] ADR-007 (output contract) moved from Proposed to Accepted once Phase 1 makes the decision
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale for each ADR, sourced from research.md's Eliminated Alternatives table
- [ ] CHK-103 [P2] Migration path documented for the calibration-baseline regeneration (Phase 4)
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [ ] CHK-110 [P1] Reserved fallback budget slice keeps the total hook path inside the existing 2500 ms budget (NFR-P01), no new p95 target introduced
- [ ] CHK-111 [P1] Primary-timeout to fallback-success timing test measured and passing within the total hook budget
- [ ] CHK-112 [P2] Probe-timeout scenario timed and confirmed within the total hook budget
- [ ] CHK-113 [P2] No latency regression observed from the executor-delegation finalization boundary fix
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [ ] CHK-120 [P0] P2-8's experiment path defaults off, rollback is a one-line config change (decision-record.md ADR-002)
- [ ] CHK-121 [P0] The `taskIntentFloor` experiment path confirmed present and off before any candidate run
- [ ] CHK-122 [P1] No monitoring or alerting changes required, this packet touches no production telemetry surface
- [ ] CHK-123 [P1] Per-phase rollback procedure documented in plan.md Section 7
- [ ] CHK-124 [P2] Regenerated calibration baseline hashes recorded for the pre-fix and post-fix state
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [ ] CHK-130 [P1] Security review completed for the finalization-boundary and fallback-budget changes (NFR-S01)
- [ ] CHK-131 [P1] No new dependencies introduced, license surface unchanged
- [ ] CHK-132 [P2] No user data handled by this packet's fixtures, baselines or diagnostic-taxonomy split
- [ ] CHK-133 [P2] Fail-open freshness behavior (`absent`/`unavailable` empty recommendations, `stale` degrades only `graph_causal`) confirmed unchanged after Phase 4
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [ ] CHK-140 [P1] All five spec documents (spec.md, plan.md, tasks.md, checklist.md, decision-record.md) pass `validate.sh --strict` with Errors: 0
- [ ] CHK-141 [P1] No API documentation applicable, this packet has no external API surface
- [ ] CHK-142 [P2] `references/hooks/skill_advisor_hook.md` and the manual playbook updated per Phase 7 (P1/P2-7)
- [ ] CHK-143 [P2] Knowledge transfer: decision-record.md's 8 ADRs stay the canonical reference for the routing-fix rationale
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Pending | Technical Lead | [ ] Not started | |
| Pending | Product Owner | [ ] Not started | |
| Pending | QA Lead | [ ] Not started | |
<!-- /ANCHOR:sign-off -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 22 | 0/22 |
| P1 Items | 27 | 0/27 |
| P2 Items | 10 | 0/10 |

**Verification Date**: pending, implementation not started
<!-- /ANCHOR:summary -->
