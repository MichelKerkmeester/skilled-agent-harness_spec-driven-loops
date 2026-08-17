---
title: "Tasks: Deep Improvement Common Services - Resume Adapter"
description: "Tasks for planning and verifying the sealed-ledger resume adapter, continuity-ladder reducers, idempotent re-entry, and shared evaluator, canary, and guarded-promotion services."
trigger_phrases:
  - "deep improvement resume adapter tasks"
  - "sealed ledger resume tasks"
  - "deep improvement common services tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/004-deep-improvement-common/005-resume-adapter"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/003-mode-contracts-migration-and-cutover/002-mode-and-lane-migrations/004-deep-improvement-common/005-resume-adapter"
    last_updated_at: "2026-08-17T04:04:40Z"
    last_updated_by: "codex"
    recent_action: "Completed the common resume adapter contract"
    next_safe_action: "Import the contract from shadow parity"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-improvement-common-resume-adapter/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/deep-improvement-common-resume-adapter.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Deep Improvement Common Services - Resume Adapter

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the landed ledger, reducer, sealed-artifact, certificate, and effect-recovery contracts -- Evidence: the adapter imports each production module and whole-runtime TypeScript exits 0. -- Evidence: targeted Vitest reports 23 passed (23) and runtime tsc exits 0.
- [x] T002 Inventory common transitions, artifact claims, receipt identities, component facts, and effect evidence -- Evidence: the implementation derives decisions from verified projection, certificate, artifact, and effect-ledger records. -- Evidence: targeted Vitest reports 23 passed (23) and runtime tsc exits 0.
- [x] T003 Freeze the seven-step continuity ladder and the ordered tool, model, policy, target, and schema fingerprint inputs -- Evidence: exported constants and closed component parsers compile and the matrix suite passes. -- Evidence: targeted Vitest reports 23 passed (23) and runtime tsc exits 0.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Drive the offline certificate verifier and recompute the versioned resume fingerprint over real ordered inputs -- Evidence: exact and changed-input fixtures return different recomputed fingerprints. -- Evidence: targeted Vitest reports 23 passed (23) and runtime tsc exits 0.
- [x] T005 Consume the frozen common reducer rather than adding a second projection authority -- Evidence: continuity uses `foldDeepImprovementCommonEvents` and no reducer file changed. -- Evidence: targeted Vitest reports 23 passed (23) and runtime tsc exits 0.
- [x] T006 Add typed compatibility, branch, effect, invalidation, lease, decision, continuity, and result contracts -- Evidence: `types.ts` exports the closed shared surface. -- Evidence: targeted Vitest reports 23 passed (23) and runtime tsc exits 0.
- [x] T007 Classify compatibility inside the adapter against only a digest-authenticated migration registry -- Evidence: caller-authored verdicts are rejected and an untrusted registry blocks. -- Evidence: targeted Vitest reports 23 passed (23) and runtime tsc exits 0.
- [x] T008 Resolve candidate, evaluator, target, schema, canary, and promotion evidence through verified common artifacts and receipts -- Evidence: certificate issuance and offline verification use the production sealed store. -- Evidence: targeted Vitest reports 23 passed (23) and runtime tsc exits 0.
- [x] T009 Bind applied effects through the shared seven-fact confirmation predicate -- Evidence: forged confirmation stays unknown and blocked while the genuine control reuses. -- Evidence: targeted Vitest reports 23 passed (23) and runtime tsc exits 0.
- [x] T010 Derive exact-reuse, compatible, migrate, rebuild-required, and blocked dispositions without changing authority -- Evidence: all five matrix cases pass with dark-only output. -- Evidence: targeted Vitest reports 23 passed (23) and runtime tsc exits 0.
- [x] T011 Export one stable common contract for agent-improvement, model-benchmark, and skill-benchmark consumers -- Evidence: `index.ts` exports the adapter, parsers, digests, ladder, and all decision types. -- Evidence: targeted Vitest reports 23 passed (23) and runtime tsc exits 0.
- [x] T012 Add real-substrate negative fixtures for compatibility, fingerprint, effects, lease ownership, and certificate integrity -- Evidence: targeted Vitest reports 23 passed. -- Evidence: targeted Vitest reports 23 passed (23) and runtime tsc exits 0.
- [x] T022 Reconstruct the authenticated replay range and reject causal cursor gaps or stream splits -- Evidence: two real-ledger negative fixtures return typed cursor-gap rebuild decisions and targeted Vitest reports 23 passed (23).
- [x] T023 Validate non-null checkpoints by folding their authenticated prefix -- Evidence: a self-consistent wrong cursor returns checkpoint-digest-mismatch and targeted Vitest reports 23 passed (23).
- [x] T024 Compare certificate heads with the real replay frontier -- Evidence: a mismatched final head returns frontier-mismatch before reuse and targeted Vitest reports 23 passed (23).
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Verify the decision matrix from one offline-verifiable certificate and sealed artifact closure -- Evidence: five typed dispositions pass. -- Evidence: targeted Vitest reports 23 passed (23) and runtime tsc exits 0.
- [x] T014 Verify caller assertions cannot bypass real pinned component facts -- Evidence: the closed parser rejects the extra verdict and the adapter classifies the real policy drift. -- Evidence: targeted Vitest reports 23 passed (23) and runtime tsc exits 0.
- [x] T015 Verify an unauthenticated migration registry cannot authorize compatibility -- Evidence: the adapter returns blocked. -- Evidence: targeted Vitest reports 23 passed (23) and runtime tsc exits 0.
- [x] T016 Verify changed tool, model, policy, target, or schema inputs cannot silently reuse the prior fingerprint -- Evidence: the recomputed digest changes and uncovered drift rebuilds. -- Evidence: targeted Vitest reports 23 passed (23) and runtime tsc exits 0.
- [x] T017 Verify a mutated or otherwise unverified prior certificate cannot resume -- Evidence: offline verification is non-valid and the decision blocks without a persisted fingerprint. -- Evidence: targeted Vitest reports 23 passed (23) and runtime tsc exits 0.
- [x] T018 Verify a forged intent digest or postcondition cannot certify an effect -- Evidence: the shared binder returns false and the effect remains unknown and blocked. -- Evidence: targeted Vitest reports 23 passed (23) and runtime tsc exits 0.
- [x] T019 Verify a genuine seven-fact confirmation is reusable -- Evidence: the shared binder returns true and the effect is applied with reuse. -- Evidence: targeted Vitest reports 23 passed (23) and runtime tsc exits 0.
- [x] T020 Verify the whole runtime compiles with the landed predecessor imports -- Evidence: TypeScript exits 0 with zero adapter-path diagnostics. -- Evidence: targeted Vitest reports 23 passed (23) and runtime tsc exits 0.
- [x] T021 Verify the adapter remains additive-dark and successor-ready -- Evidence: only the module, unit test, and this leaf's docs are in scope. -- Evidence: targeted Vitest reports 23 passed (23) and runtime tsc exits 0.
- [x] T025 Run focused mutation checks for compatibility, effect binding, checkpoint, and frontier guards -- Evidence: deleting each guard makes its filtered test fail at the intended assertion and targeted Vitest reports 23 passed (23).
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks complete
- [x] All resume-adapter requirements have executable evidence
- [x] Build and targeted test gates are green
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
