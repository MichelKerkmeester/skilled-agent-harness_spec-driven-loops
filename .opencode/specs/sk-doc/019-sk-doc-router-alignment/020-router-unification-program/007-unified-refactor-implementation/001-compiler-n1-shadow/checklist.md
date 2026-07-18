---
title: "Verification Checklist: Shadow Compiler + mcp-code-mode N=1 Compile"
description: "Level-2 verification checklist for Phase 1 of the unified router refactor: proves the shadow compiler is pure/deterministic/fail-closed, that mcp-code-mode compiles as the degenerate N=1 case with no special-casing, that the scorer is untouched and route-gold stays green, and that fenced activation + byte-exact rollback hold at zero live authority."
trigger_phrases:
  - "shadow compiler n1 checklist"
  - "mcp-code-mode compile verification"
  - "route-gold parity rollback checklist"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/001-compiler-n1-shadow"
    last_updated_at: "2026-07-18T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored Phase 1 verification checklist"
    next_safe_action: "Mark items [x] with evidence as the build lands"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm every required item has concrete evidence before marking it complete.
- Keep optional deferrals explicit, owned, and separate from blockers.
FAILURE MODES:
- Rubber-stamping the checklist, vague tested-claims, and hidden blocker deferrals.
-->

# Verification Checklist: Shadow Compiler + mcp-code-mode N=1 Compile

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

- [ ] CHK-001 [P0] Requirements documented in spec.md (REQ-001..010)
- [ ] CHK-002 [P0] Technical approach defined in plan.md (compiler → projections → parity → activation)
- [ ] CHK-003 [P0] Phase 0 schemas + deterministic serialization frozen and importable; else fail closed (spec REQ-002)
- [ ] CHK-004 [P1] `mcp-code-mode` authored sources confirmed against synthesis §5 line refs
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `compile()` is a total, side-effect-free function (no writes/network beyond declared source reads)
- [ ] CHK-011 [P0] No `skillId == "mcp-code-mode"` (or equivalent name) branch anywhere in the compiler/evaluator path (SC-002)
- [ ] CHK-012 [P0] Fail-closed guards raise a typed `CompileError` and write no partial artifact (REQ-002)
- [ ] CHK-013 [P1] N=1 empties emerge by partial evaluation, not by special-casing (synthesis §5.1)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All acceptance criteria met (REQ-001..008)
- [ ] CHK-021 [P0] Determinism proven: ≥3× recompile → byte-identical body + identical `effectivePolicyHash` (SC-001)
- [ ] CHK-022 [P0] Three fail-closed negatives pass: missing mode, unresolved leaf, authority contradiction (SC-003)
- [ ] CHK-023 [P0] Route-gold stays green via the compatibility projector; scorer diff empty (SC-004)
- [ ] CHK-024 [P0] Shadow parity runs at zero live authority — no COMMIT/effect, legacy authoritative (SC-005)
- [ ] CHK-025 [P0] Fenced activation + byte-exact rollback drill passes; one generation pinned per request (SC-006)
- [ ] CHK-026 [P1] Edge cases tested: zero-signal `defer(no-match)`, ambiguous `clarify`, forbidden `reject`, concurrent activation loses on stale token (synthesis §5.2, §9)
- [ ] CHK-027 [P1] Three projections carry the same `effectivePolicyHash` (SC-007); document-only card route reaches `PREPARED_DRAFT`/`DOCUMENT_ONLY_UNATTESTED` (REQ-010)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed: the legacy router is the only serving authority during shadow (synthesis §9).
- [ ] CHK-FIX-003 [P0] Consumer inventory completed: only the three projections + parity harness read the compiled artifact; nothing commits.
- [ ] CHK-FIX-004 [P0] Adversarial cases covered for the fail-closed + fence paths: unmapped leaf, authority contradiction, stale fencing token, missing schema.
- [ ] CHK-FIX-005 [P1] Fixture-family matrix listed before completion (single route, idle defer, clarify, reject, singular-omission + zero-rank-call) (synthesis §8.2).
- [ ] CHK-FIX-006 [P1] Determinism variant executed across two processes/machines, not one run (SC-001).
- [ ] CHK-FIX-007 [P1] Evidence pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets in shadow artifacts or fixtures
- [ ] CHK-031 [P0] Authority stays destination-local — a proof/recommendation is never a capability; negatives withhold authority (synthesis §2.3, §10)
- [ ] CHK-032 [P1] `mcp-route-guard.cjs` stays advisory (fails open) and is never wired as destination VERIFY (synthesis §5.2)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks/checklist synchronized
- [ ] CHK-041 [P1] Migration Stage-1 gate (spec §6) documented and satisfied before Phase 2 activation
- [ ] CHK-042 [P2] Master-plan phase map (`../spec.md`) reflects Phase 1 status
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Shadow artifacts confined to the isolated `<shadow-root>/`; no live routing path written
- [ ] CHK-051 [P1] Temp/scratch files cleaned before completion; new route-gold fixtures are append-only
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 17 | [ ]/17 |
| P1 Items | 12 | [ ]/12 |
| P2 Items | 2 | [ ]/2 |

**Verification Date**: [YYYY-MM-DD]
<!-- /ANCHOR:summary -->
