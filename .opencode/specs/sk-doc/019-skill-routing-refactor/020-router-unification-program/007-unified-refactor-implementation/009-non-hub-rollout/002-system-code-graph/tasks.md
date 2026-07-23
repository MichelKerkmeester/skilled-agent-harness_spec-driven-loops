---
title: "Task Breakdown: system-code-graph Non-Hub Router Rollout"
description: "Completed implementation and evidence tasks for the target-local system-code-graph compiled-policy rollout."
trigger_phrases:
  - "system code graph rollout tasks"
  - "system code graph compiler tasks"
  - "system code graph real green tasks"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/009-non-hub-rollout/002-system-code-graph"
    last_updated_at: "2026-07-19T12:10:00.000Z"
    last_updated_by: "codex"
    recent_action: "Closed target, scorer, parity, rollback, syntax, and strict gates"
    next_safe_action: "Keep live activation deferred until the program promotion gate"
    blockers: []
    key_files:
      - "harness/validate.cjs"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Task Breakdown: system-code-graph Non-Hub Router Rollout

<!-- ANCHOR:notation -->
## Task Notation

- [x] means fresh evidence exists in the current child.
- [ ] means the gate remains open and blocks completion.
- Every completed task names a command, file, artifact hash, or validator result.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the singleton template, target router, leaf inventory, and design authority.
  - Evidence: `shasum -a 256` captured the live skill, manifest, aliases, and shared module entry points.
- [x] T002 Establish a target-local source adapter without modifying shared compiler code.
  - Evidence: `harness/support.cjs` imports `buildAuthoredSources`, derives exclusions, and retains only target source hashes.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Emit canonical policy, projections, fixtures, and activation manifests.
  - Evidence: `node harness/build.cjs --write` reports 13 artifacts at `ceadd464648a46488ca3781bcb37b72782221352fb191b78f0d7a92d0a487a40`.
- [x] T004 Implement target-local parity and activation adapters over shared modules.
  - Evidence: `parity/run-shadow.cjs` and `activation/run-drill.cjs` contain target orchestration around imported shared behavior.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 Prove singleton degeneracy and closed algebra.
  - Evidence: `node harness/validate.cjs` reports candidate 1, selectors 37, leaves 53, four actions, and rank calls 0.
- [x] T006 Run typed fixtures through the real frozen scorer.
  - Evidence: `node harness/validate.cjs` reports 5 scorer rows and 2 rejected falsifiers.
- [x] T007 Run zero-authority legacy shadow parity.
  - Evidence: `node harness/validate.cjs` reports legacy authoritative, effects 0, one match, and three classified mismatches.
- [x] T008 Prove fenced activation and byte-exact rollback.
  - Evidence: `activation/run-drill.cjs` restores `5485c5a4a6faddca886425dedc59bd0d5340f7946f9bf7f6a8fec36e802a8c23` at fence 2.
- [x] T009 Run strict packet validation after metadata synchronization.
  - Evidence: `validate.sh <child-folder> --strict` exited 0 with 0 errors and 0 warnings.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- Target harness exits 0 with GREEN result=PASS.
- All six target CommonJS files pass node --check.
- All target JSON parses and all protected scorer digests match.
- Strict packet validation exits 0 after checklist reconciliation.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- Scope and acceptance: `spec.md`.
- Build and verification sequence: `plan.md`.
- P0/P1 evidence: `checklist.md`.
- Final evidence and limitations: `implementation-summary.md`.
<!-- /ANCHOR:cross-refs -->
