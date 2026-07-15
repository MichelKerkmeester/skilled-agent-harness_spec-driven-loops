---
title: "Implementation Plan: fan-out live-tools unblock (065/006 phase 002)"
description: "Implementation plan for the early dispatch-only fan-out unblock: typed live-search policy, fail-closed capabilities, per-kind adapters, invocation fingerprints, and deterministic manifest expansion over the existing capped pool."
trigger_phrases:
  - "fan-out live-tools implementation plan"
  - "fanout search adapter plan"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/002-fanout-live-tools-unblock"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/002-fanout-live-tools-unblock"
    last_updated_at: "2026-07-15T13:07:03Z"
    last_updated_by: "codex"
    recent_action: "Defined the adapter, capability, manifest, and legacy-parity implementation sequence"
    next_safe_action: "Implement schema-first preflight and preserve the legacy executor expansion path"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Fan-out Live-Tools Unblock

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop runtime fan-out dispatch (phase 002) |
| **Change class** | Additive executor config + dispatch adapters + manifest compiler |
| **Execution** | Future implementation on the operator-selected git workspace, pinned after phase 001 |

### Overview
The existing fan-out scheduler is retained. `executor-config.ts` gains a backward-compatible live-tools policy and a discriminated manifest input; `fanout-run.cjs` gains a capability preflight plus per-kind adapters whose output includes an invocation fingerprint. The new manifest compiles to the same flat lineage list consumed by `runCappedPool`, and omission of every new field preserves the current parse, argv, expansion, and persisted-artifact behavior.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 001 is complete and its executor/transition vocabulary is frozen
- [ ] Baseline fixtures pin current `executors[]`, `count`, `buildLineageCommand`, and pool behavior
- [ ] The capability matrix declares all four executor kinds against all four search policies
- [ ] The dispatch-only boundary explicitly excludes canonical receipts and persisted-shape changes

### Definition of Done
- [ ] A live-search `cli-codex` leaf launches with `codex --search exec`
- [ ] An unsupported kind × live-search combination fails before any dispatch
- [ ] Existing fan-out behavior and persisted artifacts are unchanged when new fields are absent
- [ ] Manifest cross-products emit stable logical branch IDs into the existing pool
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Typed policy boundary**: add a nested `liveTools.webSearch` enum to `executorConfigSchema`, normalized to `inherit`. Include the field in kind-support validation without weakening any existing unsupported-field checks.
- **Capability preflight**: define an exhaustive `ExecutorKind` matrix whose rows advertise supported web-search modes and adapter semantics. Validate every expanded lineage immediately after `expandLineages` and before budget waits, `runCappedPool`, or spawn. Unknown or unsupported combinations throw `ExecutorConfigError` with the lineage and requested mode.
- **Adapter registry**: split `buildLineageCommand` by executor kind. Each adapter returns `{ command, args, input, effectiveConfig, invocationFingerprint }`. `cli-codex` prepends `--search` only for the validated `live` mode, yielding `codex --search exec ...`; `inherit` follows the current byte-for-byte argv path.
- **Fingerprint contract**: hash a canonical serialization of executor kind, executable/version, resolved model, reasoning effort, service tier, sandbox/permission posture, effective web-search mode, argv, and prompt digest. Exclude credentials, full environment maps, and raw prompt content. The fingerprint is returned to the caller but is not persisted as a new canonical event in this phase.
- **Manifest compiler**: make legacy `{ executors: [...] }` and new `{ models: [...], branches: [...], replicas: N }` mutually exclusive schema branches. Require directory-safe explicit IDs; expand in declared model order, branch order, then replica ordinal; derive a stable ID such as `<branch>-<model>-r<ordinal>`; collision-check; emit the current `LineageExecutor` item shape.
- **Existing execution engine**: pass both legacy and compiled lineages through the unchanged aggregate-budget calculation, existing work-conserving `runCappedPool`, retry logic, lineage directories, artifact validation, and summaries in `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`.
- **Reference implementation**: preserve the proven mechanisms in `.opencode/specs/system-deep-loop/065-deep-loop-innovation/005-deep-loop-effectiveness-and-fanout/scratch/fanout-prototype.cjs` while adapting them to production config validation and hermetic tests.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Pin phase-001 dependency evidence and capture green baselines for `executor-config.vitest.ts` and `fanout-run.vitest.ts`.
- Record current legacy config normalization, count expansion, cli-codex argv, pool events, and persisted artifact shapes.

### Phase 2: Implementation
- Add `liveTools.webSearch`, its four-value enum, default `inherit`, exhaustive capability matrix, and pre-dispatch validator in `executor-config.ts`.
- Add the discriminated manifest schema/compiler and deterministic logical branch ID collision checks while leaving `executors[]` + `count` expansion intact.
- Refactor command construction into per-kind adapters; implement exact top-level `--search` placement for live `cli-codex` and return effective config plus invocation fingerprint.
- Wire capability preflight and compiled lineages into `fanout-run.cjs` before the existing pool, without adding any canonical event or persisted record field.

### Phase 3: Verification
- Prove a hermetic or authorized live `cli-codex` leaf receives `--search` before `exec` and completes.
- Prove unsupported live search fails before a spawn sentinel or pool worker runs.
- Prove legacy configs, argv, labels, pool scheduling, retries, budgets, summaries, and artifacts retain baseline behavior.
- Prove models × branches × replicas counts, deterministic order, stable IDs, collision rejection, and unchanged hard ceilings.
- Run targeted runtime unit tests, the relevant full runtime gate, and strict phase validation.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | `executor-config.vitest.ts` table-tests all enum values, invalid values, omission, and legacy normalization |
| REQ-002 | A matrix test covers every executor kind × policy cell; a spawn sentinel proves rejection precedes dispatch |
| REQ-003 | Adapter contract tests cover every kind and compare `inherit` outputs to the pinned command fixtures |
| REQ-004 | `fanout-run.vitest.ts` asserts `args[0] === '--search'` and `args[1] === 'exec'`; a live or hermetic leaf proves launch |
| REQ-005 | Determinism/sensitivity tests vary one effective input at a time and confirm secrets/raw environment are absent |
| REQ-006 | Cartesian-product fixtures verify `models × branches × replicas`, ID order, collision handling, and limits |
| REQ-007 | Existing executor-config and fanout-run suites pass unchanged; legacy snapshots and artifact schemas match baseline |
| REQ-008 | Diff/fixture checks show no new canonical event, status-ledger field, checkpoint field, or fan-in artifact shape |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Phase 001 is the sole blocking program dependency. Runtime dependencies are the shipped Zod executor schema, `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`, `fanout-pool.cjs`, and the existing Vitest harness. The live argv contract is grounded in the 065/005 prototype. Phase 006 consumes this phase's stable logical IDs and invocation fingerprint later, when durable receipts and fan-in persistence are authorized.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The change is additive and has no data migration. Revert the phase's config, adapter, compiler, and test commits together; legacy configs then continue through the original `executors[]` and `buildLineageCommand` behavior. Before accepting rollback, rerun the pinned legacy executor-config/fanout-run fixtures and confirm no canonical artifact migration or cleanup is required.
<!-- /ANCHOR:rollback -->
