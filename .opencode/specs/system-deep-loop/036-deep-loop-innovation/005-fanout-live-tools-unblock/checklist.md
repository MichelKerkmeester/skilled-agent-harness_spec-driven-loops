---
title: "Checklist: fan-out live-tools unblock"
description: "Blocking verification contract for live cli-codex dispatch, fail-closed capability validation, deterministic manifest expansion, legacy parity, and the dispatch-only persistence boundary."
trigger_phrases:
  - "fan-out live-tools checklist"
  - "fanout live search verification"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/005-fanout-live-tools-unblock"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/005-fanout-live-tools-unblock"
    last_updated_at: "2026-07-15T13:07:03Z"
    last_updated_by: "codex"
    recent_action: "Defined blocking live-dispatch, fail-closed, legacy-parity, and persistence checks"
    next_safe_action: "Capture baseline evidence and execute the matrix against hermetic spawn sentinels"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Fan-out Live-Tools Unblock

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking verifier contract for phase 005. Every item remains unchecked while the phase is Planned. The implementation verifier records the candidate SHA, phase-004 dependency SHA, exact commands and exit codes, matrix row counts, expanded logical IDs, spawn-sentinel evidence, and legacy artifact hashes. Any unsupported live-search request that reaches a worker, any legacy behavior drift, or any canonical persistence-shape change fails the phase.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Phase 004 is complete and the executor/transition vocabulary used by this phase is pinned to its exact SHA
- [ ] CHK-002 [P0] Current `executor-config.vitest.ts` and `fanout-run.vitest.ts` baselines pass before implementation
- [ ] CHK-003 [P1] Baseline evidence captures legacy config normalization, count expansion, cli-codex argv, pool events, summary shape, and lineage artifact paths
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-004 [P0] `liveTools.webSearch` is a four-value typed enum and omission normalizes to `inherit`
- [ ] CHK-005 [P0] The capability matrix is exhaustive across all shipped executor kinds and every search-policy value
- [ ] CHK-006 [P0] Each executor kind resolves through a named adapter returning command, args, input, effective config, and invocation fingerprint
- [ ] CHK-007 [P1] The manifest compiler uses explicit directory-safe IDs and deterministic model → branch → replica expansion order
- [ ] CHK-008 [P1] New logic is additive; `runCappedPool`, retry, budget, timeout, sandbox, recursion-guard, and artifact-validation semantics are unchanged
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-009 [P0] A live `cli-codex` adapter fixture proves argv index 0 is `--search` and index 1 is `exec`
- [ ] CHK-010 [P0] A live or hermetic cli-codex lineage completes through the existing pool with the top-level search form
- [ ] CHK-011 [P0] Every unsupported kind × requested search-policy row throws before a pool-worker or subprocess-spawn sentinel is touched
- [ ] CHK-012 [P0] Legacy configs with omitted `liveTools` retain exact command argv and input behavior for every executor kind
- [ ] CHK-013 [P0] Existing `executors[]` + `count` expansion retains its labels, order, uniqueness checks, and hard ceilings
- [ ] CHK-014 [P0] A 2-model × 3-branch × 2-replica manifest emits exactly 12 stable logical branch IDs in deterministic order
- [ ] CHK-015 [P0] Duplicate/invalid model or branch IDs and cross-product ID collisions fail during config validation
- [ ] CHK-016 [P1] Fingerprints are stable for equal effective launches and change when kind, model, effort, search mode, CLI version, argv, or prompt digest changes
- [ ] CHK-017 [P1] Fingerprint fixtures prove no credential, raw environment map, or raw prompt content enters the fingerprint payload
- [ ] CHK-018 [P0] Existing fan-out pool concurrency, retry, aggregate/per-lineage budget, timeout, salvage, heartbeat, and artifact tests stay green
- [ ] CHK-019 [P0] Persisted orchestration status, summary, checkpoint, lineage-state, and fan-in artifact schemas match the baseline; no new canonical receipt/event is emitted
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-020 [P0] Consumer inventory covers config parsing, lineage expansion, command construction, dispatch environment, pool input, tests, and runtime feature documentation
- [ ] CHK-021 [P0] The implementation changes only the missing live-tools and manifest dispatch path; it does not rewrite the scheduler or reducer
- [ ] CHK-022 [P1] Phase 009 handoff records the returned invocation fingerprint and stable logical IDs without prematurely adding durable state here
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-023 [P0] Capability validation fails closed; no unsupported search request silently falls back to training data
- [ ] CHK-024 [P0] Sandbox, permission, approval-policy, recursion-guard, and dispatch-environment allowlists retain baseline behavior
- [ ] CHK-025 [P1] Command/fingerprint diagnostics redact prompts and credentials and do not widen executor permissions
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-026 [P1] Runtime config/feature documentation describes all four policies, the capability matrix, manifest form, and explicit rejection behavior
- [ ] CHK-027 [P2] The 036/002 prototype remains cited as design evidence and is not promoted into shipped runtime code
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-028 [P1] Production changes stay in the executor-config/fanout dispatch surfaces and their focused tests; unrelated runtime cleanup is absent
- [ ] CHK-029 [P1] No generated results, credentials, temporary manifests, or live-search outputs are committed outside approved test fixtures
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete only when all P0 and P1 items carry exact-SHA evidence, the live cli-codex launch and pre-spawn rejection tests pass, legacy fan-out remains baseline-equivalent, the 12-leaf manifest fixture is deterministic, canonical persistence shapes are unchanged, and the targeted runtime plus strict spec-kit gates are green.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the verifier confirms the dispatch-only contract on the candidate SHA and proves that unsupported live search cannot reach spawn, existing fan-out behavior did not drift, and no canonical persisted state or event schema changed.
<!-- /ANCHOR:sign-off -->
