---
title: "Feature Specification: fan-out live-tools unblock (065/006 phase 002)"
description: "Ship the early, backward-compatible fan-out live-tools unblock on fanout-run.cjs: a typed liveTools.webSearch policy, a fail-closed executor capability matrix, per-kind command adapters with invocation fingerprints, and models-by-branches-by-replicas manifest expansion. The phase changes dispatch only and preserves every canonical persisted state and event shape."
trigger_phrases:
  - "fan-out live-tools unblock"
  - "fanout live web search"
  - "codex search exec fanout"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/005-fanout-live-tools-unblock"
    last_updated_at: "2026-07-15T13:07:03Z"
    last_updated_by: "codex"
    recent_action: "Authored the live-tools dispatch contract and backward-compatibility acceptance gates"
    next_safe_action: "Implement the config, adapters, manifest compiler, and pre-dispatch matrix tests"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Fan-out Live-Tools Unblock

> Sibling phase adjacency (sorted order under the 065 parent): predecessor `004-architecture-coverage-and-transition-contract`; successor `006-transition-authorized-ledger-core`.

> Required dependency: `004-architecture-coverage-and-transition-contract`. The next numbered sibling is phase 003; durable fan-in and canonical dispatch receipts remain owned by phase 006.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/065-deep-loop-innovation/005-fanout-live-tools-unblock |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop |
| **Origin** | Phase 002 of the 065/006 recommendations-implementation program; early split from durable fan-in after the SOL-ultra design review |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The shipped `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1382` already launches heterogeneous executor kinds, per-lineage models, reasoning efforts, replicas, and a capped work-conserving pool. Its `cli-codex` command builder starts argv with `exec`, however, so a leaf cannot request the proven live-search form `codex --search exec`. Operators must therefore hand-roll the highest-value multi-model live-search runs even though scheduling already works.

The reference `.opencode/specs/system-deep-loop/065-deep-loop-innovation/002-deep-loop-effectiveness-and-fanout/scratch/fanout-prototype.cjs:47` proved the missing mechanism with SOL and LUNA through `codex --search exec`, GLM through `opencode`, per-leaf invocation fingerprints, and provenance-preserving reduction. This phase productionizes only that dispatch boundary: typed policy, fail-closed capability validation, per-kind argv adapters, and deterministic manifest expansion. It must not add or alter canonical state, ledger, event, checkpoint, or fan-in persistence.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Extend `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` with `liveTools.webSearch: inherit|disabled|cached|live`, defaulting an omitted field to `inherit` so every existing config keeps its current behavior.
- Declare an exhaustive executor-kind capability matrix and reject an unsupported kind × requested search-policy combination after config expansion but before the pool or any subprocess starts.
- Replace the shared command switch in `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` with per-kind adapters returning `{ command, args, input, effectiveConfig, invocationFingerprint }`; the `cli-codex` live form places `--search` before `exec`.
- Add a mutually exclusive fan-out manifest form with `models[]`, `branches[]`, and `replicas`; compile its Cartesian product into stable logical branch IDs and the existing single-lineage pool item shape.
- Extend `runtime/tests/unit/executor-config.vitest.ts` and `runtime/tests/unit/fanout-run.vitest.ts` with policy, matrix, argv-order, fingerprint, manifest, fail-before-spawn, and legacy-parity fixtures.

### Out of Scope
- Canonical dispatch receipts, `lineage_dispatch_resolved` events, result envelopes, leases, resume/salvage redesign, fan-in policy, or reducer changes; phase 006 owns those durable contracts.
- Any canonical persisted state/event/log/checkpoint shape change. The invocation fingerprint is an adapter return value in this phase, not a new ledger event.
- Replacing `runCappedPool`, changing concurrency/retry/budget semantics, or adding a heterogeneous scheduler; the existing pool remains the execution engine.
- Model selection, prompt policy, convergence, novelty, or authority-cutover changes.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The executor config exposes typed `liveTools.webSearch` values `inherit`, `disabled`, `cached`, and `live` | Schema tests accept all four values, reject unknown values, and normalize omission to `inherit` |
| REQ-002 | A capability matrix is authoritative for kind × search-policy support | Every executor kind has an explicit row; unsupported requested modes fail before `runCappedPool` or subprocess spawn |
| REQ-003 | Each executor kind resolves through its own adapter | Adapters return command, argv, input, effective config, and an invocation fingerprint without changing legacy command shapes |
| REQ-004 | `cli-codex` can request live web search | The resolved argv begins `--search`, `exec`; a real or hermetic leaf launch proves the top-level ordering |
| REQ-005 | Invocation fingerprints identify the resolved launch contract | Equal effective launches produce equal fingerprints; changes to kind, model, effort, search mode, executable version, or prompt digest change the fingerprint; secrets and raw environment values are excluded |
| REQ-006 | The manifest compiler expands `models[] × branches[] × replicas` deterministically | Expansion count equals the Cartesian product; IDs derive from explicit model/branch IDs plus replica ordinal, are directory-safe, collision-checked, and independent of runtime timing |
| REQ-007 | Legacy fan-out remains backward-compatible | Existing `executors[]` + `count` configs parse and expand identically, omitted live-tools policy emits identical argv, and existing pool/retry/budget tests stay green |
| REQ-008 | The phase remains dispatch-only | No canonical event name, persisted record schema, checkpoint, status-ledger shape, or fan-in artifact changes; durable receipts remain deferred to phase 006 |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A `cli-codex` lineage launches with live web search using top-level `--search` before `exec`.
- **SC-002**: An unsupported live-search request is rejected before the first subprocess spawn.
- **SC-003**: Existing fan-out configs, command fixtures, pool behavior, retries, budgets, and persisted artifacts are unchanged when `liveTools` and the new manifest form are absent.
- **SC-004**: A models-by-branches-by-replicas manifest expands into stable, unique logical branch IDs and runs through the existing capped pool.

**Given** a legacy `executors[]` config with no `liveTools`, **When** it is parsed and resolved, **Then** its expanded labels and command argv match the pinned baseline.

**Given** a `cli-codex` leaf with `webSearch: live`, **When** its adapter resolves the command, **Then** argv starts with `--search`, `exec` and the leaf completes with live-search evidence.

**Given** an executor kind whose matrix row does not support `live`, **When** fan-out preflight runs, **Then** the submission fails before the pool worker or spawn stub is invoked.

**Given** two models, three branches, and two replicas, **When** the manifest compiler expands the request, **Then** it emits 12 collision-free logical branch IDs in deterministic order.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

This phase depends on phase 001 freezing the executor/transition vocabulary and on the existing `executor-config.ts`, `fanout-run.cjs`, and capped-pool contracts. The main risks are placing `--search` after `exec`, treating an unsupported mode as an implicit training-data fallback, letting new manifest IDs collide with lineage directories, fingerprinting secrets, or accidentally expanding this dispatch-only change into canonical persistence. Mitigations are exact argv fixtures, exhaustive matrix tests, pre-spawn sentinel tests, explicit-ID validation, fingerprint allowlisting, legacy snapshot parity, and a persistence-shape diff gate. Phase 006 may later persist the fingerprint in a canonical receipt without changing this phase's adapter contract.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. Capability rows are evidence-based: any policy without a proven executor mapping, including `cached` where no stable CLI contract exists, remains a typed but rejected combination rather than silently degrading. Phase 001 supplies the frozen vocabulary; phase 006 decides how the returned invocation fingerprint enters durable state.
<!-- /ANCHOR:questions -->
