---
title: "Verification Checklist: Compiled-Routing Coverage Build-Out & Genuine Default-On"
description: "QA and verification gates: per-hub compiled-serving parity, legacy byte-identity, frozen scorer SHA unchanged, fleet vitest green, fleet kill-switch, per-hub reversibility, validate --strict Errors:0."
trigger_phrases:
  - "compiled routing coverage checklist"
  - "compiled-serving verification"
  - "frozen scorer sha check"
importance_tier: "critical"
contextType: "implementation"
status: "planned"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/013-compiled-coverage-buildout"
    last_updated_at: "2026-07-21T12:00:00.000Z"
    last_updated_by: "claude"
    recent_action: "Authored the 42-item Level-3 verification checklist."
    next_safe_action: "Leave unchecked until Phase 1 build-out produces real evidence."
    blockers:
      - "No checklist item has evidence yet; build-out has not started."
    key_files:
      - "system-deep-loop/deep-improvement/scripts/skill-benchmark/compiled-routing-parity.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "packet-013-authoring"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Compiled-Routing Coverage Build-Out & Genuine Default-On

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!--
SELF-CHECK:
- Confirm every required item has concrete evidence before marking it complete.
- Keep optional deferrals explicit, owned, and separate from blockers.
FAILURE MODES:
- Rubber-stamping the checklist, vague tested-claims, and hidden blocker deferrals.
-->

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

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Reference implementation (sk-design `006-sk-design`) reviewed as the coverage build-out pattern
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Every hub's compiled route set is a subset of legacy's (never adds, never drops a target)
- [ ] CHK-011 [P0] No hub's build-out edits the 3 frozen scorer files
- [ ] CHK-012 [P1] Detector changes follow the sk-design reference pattern rather than a bespoke per-hub approach
- [ ] CHK-013 [P1] `node --check` passes for every modified `.cjs` file
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Route-gold parity run shows `compiled-serving` for sk-code
- [ ] CHK-021 [P0] Route-gold parity run shows `compiled-serving` for cli-external-orchestration, mcp-tooling, and sk-prompt
- [ ] CHK-022 [P0] Route-gold parity run shows `compiled-serving` for sk-design with TV-003 resolved
- [ ] CHK-023 [P0] Route-gold parity run shows `compiled-serving` for sk-doc and system-deep-loop, post-remint
- [ ] CHK-024 [P0] 18-file / 247-test fleet vitest suite green
- [ ] CHK-025 [P1] LUNA-HIGH two-plane acceptance (routing + gold holdout) archived per hub under `<hub>/benchmark/compiled-routing/<run-label>/`
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] TV-003 and MT-008 are each classed `class-of-bug` (over-detection: compiled adds a target legacy does not route), not `instance-only`
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed: every hub's compiler audited for the same over-detection pattern, not just the 2 known bugs
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for `DEFAULT_ON_HUBS`: both resolver copies, `compiled-route-sync.cjs`, 7 `SKILL.md` files, 2 create-skill templates, catalog wording
- [ ] CHK-FIX-004 [P0] Adversarial route-gold cases exercised per hub: ambiguous prompts, forbidden prompts, tied-signal prompts, not just the clean-match cases
- [ ] CHK-FIX-005 [P1] Matrix axes listed before completion is claimed: hub (7) x {coverage build-out, over-detection fix, re-mint, default-on flip}
- [ ] CHK-FIX-006 [P1] Evidence pinned to a fix SHA or explicit diff range per hub, not a moving branch-relative range
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No routing decision changes for any prompt already covered by legacy (byte-identical outcomes)
- [ ] CHK-031 [P0] No runtime path reads under `.opencode/specs`
- [ ] CHK-032 [P1] Non-hub skills (sk-git, system-code-graph, system-skill-advisor, system-spec-kit, mcp-code-mode) are never added to `DEFAULT_ON_HUBS`
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec.md, plan.md, tasks.md, checklist.md, and decision-record.md stay synchronized as phases complete
- [ ] CHK-041 [P1] `findings-traceability.md` (parent 015 folder) kept current per the goal doc's Part E
- [ ] CHK-042 [P2] Per-hub `SKILL.md` default-on directive wording reviewed for consistency across all 7 hubs
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 20 | 0/20 |
| P1 Items | 17 | 0/17 |
| P2 Items | 5 | 0/5 |

**Verification Date**: Not yet run - coverage build-out has not started.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] Architecture decision documented in decision-record.md (Path 1 vs Path 2 vs Path 3)
- [ ] CHK-101 [P1] ADR-001 has status Accepted before the sk-code pilot starts
- [ ] CHK-102 [P1] Alternatives (Path 2, Path 3) documented with rejection rationale
- [ ] CHK-103 [P2] Component diagram in plan.md matches the final per-hub compiler/router/fixture layout
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] Route-gold parity runs complete in bounded time per hub (no runaway detector complexity)
- [ ] CHK-111 [P2] Fleet vitest suite runtime does not regress meaningfully once 7 hubs are `compiled-serving`
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback procedure documented and drilled (plan.md L2 Enhanced Rollback)
- [ ] CHK-121 [P0] `SPECKIT_COMPILED_ROUTING=0` fleet kill-switch drilled before the flip is considered complete
- [ ] CHK-122 [P1] Per-hub cohort-removal reversibility drilled for at least one hub
- [ ] CHK-123 [P2] Controller's stop-on-first-failure order documented for the staged flip
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P0] The 3 frozen scorer files are never edited - hard constraint, no exceptions
- [ ] CHK-131 [P0] The 2 pre-existing strays (`mcp-tooling/008-mcp-aside/…`, `system-deep-loop/032-…`) are never touched
- [ ] CHK-132 [P1] This worktree is never merged to v4 without explicit operator go-ahead
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] All 5 packet documents synchronized with the final per-hub outcome
- [ ] CHK-141 [P2] `compiled-routing-coverage-diagnosis.md` and `goal-coverage-buildout.md` (parent 015 folder) referenced, not duplicated, as the source of truth
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Program owner | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
