---
title: "Implementation Plan: P3 Canonical Manifest Minter Foundation"
description: "Implementation plan for a shared initial manifest minter, exact freshness predicate, status integration, and sync durability. The plan wraps the existing generic 006 compiler and preserves legacy serving behavior."
trigger_phrases:
  - "implement canonical manifest minter"
  - "compiled manifest freshness plan"
  - "new hub manifest store"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/012-p3-canonical-minter-foundation"
    last_updated_at: "2026-07-21T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Planned the shared minter adapter and freshness verification path"
    next_safe_action: "Implement Phase 1 without changing runtime eligibility or serving authority"
    blockers:
      - "Implementation and test evidence are pending."
    key_files:
      - "plan.md"
      - ".opencode/bin/lib/compiled-route-manifest.cjs"
      - ".opencode/bin/compiled-route-manifest.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-21-canonical-minter-spec"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Future ownership of refresh and runtime-discovery work remains unassigned."
    answered_questions:
      - "Initial mint uses generation 1 and legacy authority."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-architecture | v2.2 -->
# Implementation Plan: P3 Canonical Manifest Minter Foundation

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS; existing Python create-skill consumer shells out to JSON CLI |
| **Framework** | Compiled-routing runtime and system-spec-kit verification |
| **Storage** | Promoted activation directory under `.opencode/bin/lib/compiled-routing/010-live-activation/activation/` |
| **Testing** | Node contract tests, current compiled-routing suites, strict spec validation |

### Overview

Add a small stable module outside the sync-deleted runtime root. It reads the three final router inputs, delegates policy construction and hashing to the generic 006 compiler, emits the existing V1 activation shape with legacy authority, and validates freshness by compiling those inputs again. A thin CLI makes the contract callable from Python without duplicating policy logic.

Status will surface the shared result under a nested `manifestFreshness` object, while sync will preserve valid manifests for hubs outside the fixed seven. Neither change registers a hub for serving.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Existing compiler, build harness, status probe, runtime engine, sync behavior, and create-skill dependency were inspected.
- [x] The generic compiler was confirmed reusable for the registry-driven create-skill parent shape.
- [x] Runtime discovery and full ADR-002 allowlist removal were separated from this contract.
- [ ] Baseline hashes and routing test results are captured before implementation.

### Definition of Done

- [ ] All P0 requirements and checklist items have executable evidence.
- [ ] Mint and freshness return the specified stable JSON contract and exit codes.
- [ ] Duplicate, stale, malformed, unsafe-path, and sync-conflict cases fail closed.
- [ ] Existing compiled and legacy routing outputs remain byte-identical.
- [ ] Frozen scorer hashes match the captured baseline.
- [ ] `validate.sh --strict` reports zero errors and warnings.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Thin adapter over an existing deterministic compiler, with one shared predicate consumed by mint, status, and create-skill.

### Public Module Contract

| Function | Input | Output | Mutation |
|----------|-------|--------|----------|
| `canonicalManifestPath({hubId})` | Valid hyphen-case hub ID | Absolute internal path plus repo-relative public path | None |
| `evaluateManifestFreshness({hubId, currentPolicy})` | Canonical manifest and already compiled current policy | Stable validity/freshness result | None |
| `mintCanonicalManifest({hubId, skillRoot})` | Hub ID and final generated root | Freshness result plus `created: true` | Atomic create of one manifest only |
| `checkCanonicalManifestFreshness({hubId, skillRoot})` | Same hub identity and inputs | Stable validity/freshness result | None |

`skillRoot` resolves to the final generated hub directory. The adapter reads `SKILL.md`, `mode-registry.json`, and `hub-router.json`, checks that their hub identities agree with `hubId`, and passes their parsed forms and exact bytes to `compileRegistry()` with `activationGeneration: 1` for initial mint or the manifest generation for freshness. The status consumer uses each existing hub's specialized `loadHubEngine()` snapshot as `currentPolicy`; it uses the generic compile path only for a newly minted registry-driven hub. Both paths finish in the same `evaluateManifestFreshness()` equality predicate.

### CLI Contract

```text
node .opencode/bin/compiled-route-manifest.cjs mint --hub <hub-id> --skill-root <path> [--pretty]
node .opencode/bin/compiled-route-manifest.cjs freshness --hub <hub-id> --skill-root <path> [--pretty]
```

Both verbs emit one JSON object. Exit `0` means the returned manifest is valid and fresh, exit `1` means a mint or freshness failure, and exit `2` means invalid CLI usage.

### Result Envelope

```json
{
  "hubId": "example-hub",
  "manifestPath": ".opencode/bin/lib/compiled-routing/010-live-activation/activation/example-hub/manifest.json",
  "manifestValid": true,
  "fresh": true,
  "causeCode": "fresh",
  "selectedPolicy": { "effectivePolicyHash": "<sha256>", "generation": 1 },
  "currentPolicyHash": "<sha256>",
  "manifestFingerprint": "<sha256>",
  "created": true
}
```

`created` is present only for `mint`. Stable failure causes are `missing-manifest`, `invalid-manifest`, `invalid-input`, `unsafe-path`, `hub-mismatch`, `compile-error`, `stale-manifest`, `already-exists`, and `sync-conflict`.

### Manifest Contract

The initial manifest uses the shipped V1 shape:

```json
{
  "schemaVersion": "V1",
  "selectedPolicy": { "effectivePolicyHash": "<sha256>", "generation": 1 },
  "servingAuthority": "legacy",
  "shadowOnly": true
}
```

No timestamp, absolute source path, or environment-derived value enters the canonical bytes.

### Data Flow

1. create-skill finishes all parent router files.
2. `mint` validates identity and containment, reads exact bytes, and calls the existing generic 006 compiler.
3. The adapter serializes the existing V1 fields and atomically creates the canonical manifest.
4. `mint` calls the same read-only freshness function and returns its result plus `created: true`.
5. `freshness` recompiles current bytes at the selected generation and compares exact effective policy hashes.
6. Status reports freshness under `manifestFreshness` and keeps its existing top-level serving `causeCode`. The runtime resolver remains unchanged and continues to choose legacy for a new hub.

### Invariant

`mint(inputs)` may create an inert manifest; it may not change any resolver input that permits compiled serving. A false or indeterminate freshness result is never converted into `ready` or `compiled-serving`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## AFFECTED SURFACES

| Surface | Current Role | Planned Action | Verification |
|---------|--------------|----------------|--------------|
| `006-parent-hub-rollout/001-sk-code/lib/registry-compiler.cjs` | Generic registry-driven policy compiler | Reuse unchanged through `compileRegistry()` | Import/call-path test and policy hash fixture |
| `006-parent-hub-rollout/001-sk-code/harness/build-artifacts.cjs` | Fixed sk-code artifact harness | Leave unchanged | Diff audit |
| `.opencode/bin/lib/compiled-route-manifest.cjs` | Missing shared contract | Add three public functions and private input loader | Unit and integration tests |
| `.opencode/bin/compiled-route-manifest.cjs` | Missing cross-language entry point | Add two verbs and stable exits | CLI contract tests |
| `.opencode/bin/compiled-route-status.cjs` | Authority and engine status | Add nested `manifestFreshness`; union fixed hubs with manifest directories | Status fixture matrix |
| `.opencode/bin/compiled-route-sync.cjs` | Rebuild promoted closure | Preserve byte-identical valid new-hub manifests around root replacement | Sync preservation/conflict tests |
| Resolver, engine maps, advisor allowlists, default cohort | Serving eligibility and routing | Unchanged | Source hash and behavior audit |
| Frozen scorer trio | Benchmark authority | Unchanged | SHA-256 baseline and delta |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [ ] Capture baseline test results and frozen scorer hashes.
- [ ] Add fixtures for a valid generated registry-driven parent hub.
- [ ] Record the existing seven-hub status schema for additive compatibility.

### Phase 2: Core Implementation

- [ ] Create `.opencode/bin/lib/compiled-route-manifest.cjs` with `canonicalManifestPath`, `loadCanonicalRouterInputs`, `compileCanonicalParent`, `evaluateManifestFreshness`, `checkCanonicalManifestFreshness`, and `mintCanonicalManifest`.
- [ ] Create `.opencode/bin/compiled-route-manifest.cjs` with `main`, argument parsing, JSON output, and stable exit mapping.
- [ ] Extend `.opencode/bin/compiled-route-status.cjs::baseRecord`, `computeHubStatus`, and `knownHubs` with nested `manifestFreshness` and union discovery; existing hubs supply their specialized engine snapshot to the shared equality predicate.
- [ ] Extend `.opencode/bin/compiled-route-sync.cjs::build` using `captureExternalActivationManifests` and `restoreExternalActivationManifests` around the root replacement.

### Phase 3: Verification

- [ ] Run the full mint/freshness/status/sync negative matrix.
- [ ] Run current compiled-routing parity, fallback, and status suites.
- [ ] Prove a new hub remains legacy-serving before and after mint.
- [ ] Recompute frozen scorer hashes and compare with baseline.
- [ ] Run strict packet validation and update evidence without claiming P4 cutover.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Required Cases |
|-----------|-------|----------------|
| Unit | Path, identity, schema, serialization, freshness | valid, missing, malformed, mismatch, traversal, stale |
| Integration | CLI to canonical store | first mint, duplicate mint, immediate freshness, input edit |
| Status | Additive compatibility | existing seven records, explicit new hub, `--all` union, stale manifest |
| Sync | Store durability | preserve bytes, reject invalid retained entry, reject destination conflict |
| Regression | Serving behavior | current route parity, unknown/new hub legacy sentinel, kill switch |
| Integrity | Frozen files | before/after SHA-256 equality |

The implementation records baseline counts before claiming no regression, then reruns the whole matching gate and reports the delta.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Generic 006 `compileRegistry()` | Internal | Confirmed reusable | No truthful policy hash can be minted without it |
| Existing V1 manifest field contract | Internal | Confirmed | Canonical bytes would diverge from activation tooling |
| 002 status foundation | Internal | Shipped, lacks freshness | Status integration has no stable consumer surface without it |
| `013-create-skill-alignment/` | Downstream consumer | Planned | It remains blocked until this contract ships |
| Runtime discovery and allowlist removal | Future work | Deferred | A fresh manifest does not make a new hub runtime-serving |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any routing delta, manifest overwrite, sync loss, status compatibility break, or frozen scorer hash change.
- **Procedure**: Revert the two new manifest files and the status/sync changes; remove only test-created fixture manifests; rerun the current routing and status suites. Existing seven manifests and serving authority are never modified by this phase.
- **Data safety**: The production minter has no delete, force, refresh, or promotion verb. A failed retry leaves the original manifest bytes in place.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
006 generic compileRegistry()
          |
          v
shared manifest module -----> JSON CLI -----> create-skill 013
          |                       |
          +----> status fields ---+
          |
          +----> canonical activation store <---- sync preservation

resolver / HUB_CHILD / advisor allowlist / DEFAULT_ON_HUBS
          remain unchanged and continue to select legacy for a new hub
```

The shared module is the only policy-hash and freshness authority added by this phase. Status and create-skill are consumers; sync protects storage only.
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. Prove the generated parent fixture compiles through existing `compileRegistry()`.
2. Implement path validation and the read-only compile/freshness path.
3. Implement atomic initial mint and post-write verification.
4. Expose the CLI contract.
5. Add status visibility and sync durability.
6. Run routing invariance, negative cases, and whole-gate regression.

Any failure in steps 1-3 blocks all downstream work. Status and sync changes may not ship without the shared predicate tests.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Exit Evidence |
|-----------|---------------|
| M1: Compiler adapter proven | Generated fixture policy hash from unchanged 006 compiler |
| M2: Canonical contract complete | Mint and freshness matrix passes |
| M3: Store and observability complete | Status and sync preservation matrix passes |
| M4: Safety closure | Full routing delta is zero; frozen hashes unchanged; strict validation passes |
<!-- /ANCHOR:milestones -->

---

## AI EXECUTION

### Pre-Task Checklist

- Read every planned target before editing.
- Confirm the generic compiler import still exposes `compileRegistry()`.
- Capture baselines and validate that no frozen file is dirty.

### Execution Rules

- Implement tasks in order and stop on any routing delta or failed whole gate.
- Do not add runtime eligibility, serving promotion, or allowlist cleanup.
- Keep manifest and freshness logic in the shared module; consumers must not duplicate it.

### Status Reporting Format

Report changed files, exact commands, baseline versus final results, and any remaining deferred discovery work.

### Blocked Task Protocol

If the generic compiler no longer accepts the create-skill parent shape, stop with the failing input and compiler evidence. Do not replace it with a new compiler.
