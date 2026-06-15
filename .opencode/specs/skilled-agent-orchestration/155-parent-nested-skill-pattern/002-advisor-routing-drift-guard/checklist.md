---
title: "Verification Checklist: Registry advisorRouting block + CI drift-guard"
description: "Verification Checklist for phase 002: advisorRouting coverage, projection equality, alias parity, and no-regression on the existing fixtures."
trigger_phrases:
  - "advisorRouting drift guard checklist"
  - "phase 002 checklist"
  - "C-plus routing verification"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/155-parent-nested-skill-pattern/002-advisor-routing-drift-guard"
    last_updated_at: "2026-06-15T13:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Assembled verification checklist for the C-plus routing change"
    next_safe_action: "Run validate.sh --strict then commit"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-155-002-advisor-routing-drift-guard-verificationchecklist"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Registry advisorRouting block + CI drift-guard

<!-- SPECKIT_LEVEL: 2 -->
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

- [x] CHK-001 [P0] Phase-2 research recommendation + C-plus mechanism available
  - **Evidence**: `../research/research.md` Executive Recommendation.
- [x] CHK-002 [P0] Real Python/TS maps + alias groups verified against source before writing the guard
  - **Evidence**: `skill_advisor.py:2307/2320`, `aliases.ts:96`, `RAW_ALIAS_GROUPS:5-48`.

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Change is additive; no routing behavior altered
  - **Evidence**: advisorRouting is data nothing reads at runtime; flag + export are additive.
- [x] CHK-011 [P1] No spec-path/artifact-id in code comments (comment hygiene)
  - **Evidence**: the test header + Python help describe the durable WHY only.

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Every mode carries an `advisorRouting` block with a valid `routingClass` + `packetSkillName`
  - **Evidence**: drift-guard test 1 green; 8/8 modes.
- [x] CHK-021 [P0] Python `DEEP_ROUTING_MODE_BY_KEY` == registry lexical projection
  - **Evidence**: drift-guard test 2 green (via `--dump-routing-maps`).
- [x] CHK-022 [P0] TS `DEEP_MODE_BY_CANONICAL` == registry lexical+alias-fold projection
  - **Evidence**: drift-guard test 3 green.
- [x] CHK-023 [P0] `legacyAliases` == `SKILL_ALIAS_GROUPS` per routed mode
  - **Evidence**: drift-guard test 5 green (order-insensitive).
- [x] CHK-024 [P0] Existing routing-parity fixtures stay green (14 invariants)
  - **Evidence**: `vitest run` 19 passed (5 + 9 + 5).

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-060 [P0] `--dump-routing-maps` flag emits the maps as JSON
  - **Evidence**: `skill_advisor.py --dump-routing-maps` exit 0, correct output.
- [x] CHK-061 [P0] Exactly one `advisorDefaultMode` (agent-improvement)
  - **Evidence**: drift-guard test 4 green.
- [x] CHK-062 [P0] No runtime registry read added to the advisor (C-plus)
  - **Evidence**: advisor imports unchanged; only a test reads the registry.

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets introduced
  - **Evidence**: routing metadata + a test; no credentials.
- [x] CHK-031 [P1] One `graph-metadata.json` under `deep-loop-workflows` (no new identity)
  - **Evidence**: `find` count == 1.

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Registry documents the routing contract
  - **Evidence**: top-level `advisorRoutingContract` legend.
- [x] CHK-041 [P1] spec/plan/tasks synchronized for this phase
  - **Evidence**: this packet's docs describe the same scope.

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Test placed beside the existing routing-parity suites
  - **Evidence**: `tests/routing-registry-drift-guard.vitest.ts`.
- [x] CHK-051 [P1] No stray temp files committed
  - **Evidence**: research scratch stays in `/tmp`.

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 6 | 6/6 |
| P2 Items | 0 | 0/0 |

**Note**: `validate.sh --strict` + the scoped commit are close-out steps tracked in `tasks.md` (T008/T009).

**Verification Date**: 2026-06-15
**Verified By**: claude-opus (orchestrator), 19/19 vitest green

<!-- /ANCHOR:summary -->
