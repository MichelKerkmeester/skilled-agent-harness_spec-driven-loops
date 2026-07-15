---
title: "Memclaw Derived Memory Hardening 003: Feedback Safety-Posture Lock-In"
description: "Reserved feedback event and artifact type rejection at dispatch, shadow-only ledger contract proof, future-reducer invariants (symmetric damping, rare-but-correct, constitutional immunity), and a provenance connection to the Phase 1 guard. No schema version bump."
trigger_phrases:
  - "002/005 003 feedback safety posture changelog"
  - "reserved feedback type rejection shipped"
  - "shadow-only feedback invariant lock-in"
  - "future reducer symmetric damping invariant"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-10

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/005-memclaw-derived-memory-hardening/003-feedback-log-and-005-reframe` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/005-memclaw-derived-memory-hardening`

### Summary

This leaf pins the feedback safety posture in code, tests, and phase docs without activating any feedback-driven reducer. Public memory writes can no longer forge reserved feedback event or artifact types. Feedback capture and batch learning remain shadow-only: the ledger can write diagnostic rows, but ranking, retention, and FSRS state are untouched. Three invariants any future reducer must honor are recorded as inert contract helpers: symmetric damping, rare-but-correct protection, and constitutional immunity. Active reducer work under 005 is explicitly deferred and coordinated as diagnostics-first.

### Added

- Reserved feedback type guard in `tool-input-schemas.ts`: forged `type` or `artifactType` fields on `memory_save` and `memory_update` are rejected with `E_RESERVED_FEEDBACK_TYPE` before generic unknown-key handling.
- Shadow-only table contract exported from `feedback-ledger.ts`; tests assert that feedback capture and `runBatchLearning()` leave `importance_weight`, retention state, and FSRS columns unchanged.
- Inert future-reducer invariant helpers in `batch-learning.ts` for symmetric/soft damping, rare-but-correct protection, and constitutional immunity.
- `tests/feedback-safety-posture.vitest.ts` covering forged-type rejection, system-stamped ledger path, shadow-only invariant, fail-safe logging, symmetric damping, and constitutional immunity.
- Phase docs recording the 008 reducer coordination note: `004-learning-feedback-reducers/{001-aggregator, 003-causal-reducer, 004-retention-reducer, 005-env-tests-integration}` are deferred as diagnostics-first and default-off.

### Changed

- `feedback-ledger.ts`: shadow-only table contract exported for test assertion.
- `batch-learning.ts`: inert future-reducer invariant contract helpers added alongside existing aggregation logic.

### Fixed

- None.

### Verification

- `npm run build`: passed.
- `npm run test:core` targeting 5 files (`feedback-safety-posture.vitest.ts` `feedback-ledger.vitest.ts` `batch-learning.vitest.ts` `feedback-reducers-integration.vitest.ts` `review-fixes.vitest.ts`): 128 tests passed.
- Forged feedback writes rejected with `E_RESERVED_FEEDBACK_TYPE`: passed.
- Ledger path produces no ranking, retention, or FSRS side effects: passed.
- Ledger append failure is non-fatal: passed.
- Symmetric damping invariant catches asymmetric contract: passed.
- Constitutional and protected immunity contract: passed.
- `validate.sh --strict` on this spec folder: 0 errors, 0 warnings.

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts` | Modified | Reserved feedback event and artifact type rejection with `E_RESERVED_FEEDBACK_TYPE`. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts` | Modified | Shadow-only table contract exported for invariant tests. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts` | Modified | Inert future-reducer invariant contract helpers added. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/feedback-safety-posture.vitest.ts` | Added | Full safety-posture suite: forged rejection, system-stamped path, shadow-only, fail-safe, symmetric damping, constitutional immunity. |

### Follow-Ups

- Active reducer work (ranking, retention, FSRS mutation) remains deferred until ledger quality is measured; the concrete thresholds that justify enabling a reducer are defined in the 005 diagnostics-first children.
- Any future reducer that mutates memory must inject automated `__provenanceContext` so it remains governed by the Phase 1 provenance overwrite guard.
