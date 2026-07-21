---
title: "Feature Specification: P3 Canonical Manifest Minter Foundation"
description: "Defines the minimal shared interface that mints and verifies an initial compiled-routing activation manifest for a newly generated registry-driven parent hub. The contract reuses the shipped parent-hub compiler, preserves legacy serving authority, and does not change runtime eligibility or routing decisions."
trigger_phrases:
  - "canonical manifest minter"
  - "compiled routing freshness predicate"
  - "new hub activation manifest"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/012-p3-canonical-minter-foundation"
    last_updated_at: "2026-07-21T05:29:04Z"
    last_updated_by: "codex"
    recent_action: "Implemented and verified the canonical minter foundation"
    next_safe_action: "Integrate this CLI contract in the create-skill consumer"
    blockers:
      - "No implementation blockers remain; later serving changes stay explicitly deferred."
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-21-canonical-minter-spec"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Which future packet will own refresh or overwrite semantics after initial mint?"
    answered_questions:
      - "Reuse the generic 006 compiler and keep the resolver on legacy authority."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-architecture | v2.2 -->
# P3 Canonical Manifest Minter Foundation

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

Create-skill needs one truthful control-plane result: a newly generated parent hub has one valid manifest at the canonical path, and that manifest still matches its final router inputs. This phase supplies that result by wrapping the existing generic 006 compiler. It leaves the manifest inert and leaves every serving gate unchanged.

The implementation is deliberately smaller than ADR-002's eventual data-driven eligibility design. It proves `manifest-ready`; it does not claim `runtime-serving`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Implemented |
| **Created** | 2026-07-21 |
| **Branch** | `sk-doc/0089-default-routing-cutover` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 12 of 12 |
| **Predecessor** | `011-activation-cutover-p4/` by phase order |
| **Successor** | None inside packet 015; packet `../../013-create-skill-alignment/` is the consumer |
| **Depends On** | `002-runtime-promotion-and-status-foundation/` and the promoted 006 parent-hub compiler |
| **Consumer** | `../../013-create-skill-alignment/` |
| **Handoff Criteria** | The shared mint and freshness contracts pass their matrix and return a canonical manifest path. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

The compiled-routing program has a promoted serving closure and seven activated hubs, but it has no supported way to mint a manifest for a newly generated hub. The create-skill `ready` mode therefore cannot obtain or validate the canonical artifact it promises to consume.

This phase supplies that missing P3 foundation only. It does not make a new hub runtime-eligible, change either hardcoded hub set, or advance any hub into the default-on cohort.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The seven current activation manifests were produced by fixed per-hub build harnesses. The reusable compiler exists, but the harness that invokes it hardcodes the `sk-code` source root and rollout folder. The promoted status probe fingerprints manifests but does not compare the selected policy hash with a compile of current router inputs. A newly generated parent hub consequently has neither a canonical mint call nor a truthful freshness result.

The current runtime also keeps separate fixed hub maps for engine dispatch and advisor eligibility. Those maps deliberately remain unchanged here, so a newly minted hub stays on the legacy path until separate discovery and eligibility work lands.

### Purpose

Provide one shared, fail-closed initial-minter and one exact freshness predicate that create-skill can call after final router inputs exist, while preserving every current routing decision.

### Confirmed Existing Behavior

| Finding | Evidence | Consequence |
|---------|----------|-------------|
| The registry compiler accepts authored registry, router, skill Markdown, source bytes, and generation without hardcoding a hub ID. | `.opencode/bin/lib/compiled-routing/006-parent-hub-rollout/001-sk-code/lib/registry-compiler.cjs:230` | Its `compileRegistry()` function can compile a newly generated registry-driven parent hub. |
| The current build harness hardcodes the `sk-code` skill root and rollout child. | `.opencode/bin/lib/compiled-routing/006-parent-hub-rollout/001-sk-code/harness/build-artifacts.cjs:31` | The harness itself is not a canonical new-hub minter. |
| Status records manifest fingerprints and authority but does not recompile current inputs. | `.opencode/bin/compiled-route-status.cjs:91` | Fingerprint presence is not freshness. |
| Runtime sync deletes the promoted root before copying the fixed closure. | `.opencode/bin/compiled-route-sync.cjs:140` | A minted manifest needs explicit preservation across sync. |
| Engine dispatch remains a fixed seven-hub map. | `.opencode/bin/lib/compiled-routing/011-runtime-engine/lib/compiled-route.cjs:30` | Minting cannot honestly mean runtime-serving. |
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A shared CommonJS module with `canonicalManifestPath()`, `evaluateManifestFreshness()`, `mintCanonicalManifest()`, and `checkCanonicalManifestFreshness()`.
- A `compiled-route-manifest.cjs` CLI with `mint` and `freshness` verbs for cross-language use by create-skill.
- Initial generation only: generation `1`, atomic create-if-absent, and no overwrite or refresh behavior.
- The canonical store at `.opencode/bin/lib/compiled-routing/010-live-activation/activation/<hub-id>/manifest.json`.
- Exact freshness based on a new compile of final `SKILL.md`, `mode-registry.json`, and `hub-router.json` inputs at the manifest generation.
- Reuse of `compileRegistry()` from the generic 006 `sk-code` compiler and the existing canonical JSON/hash helpers.
- An additive `manifestFreshness` object in `compiled-route-status.cjs` and union discovery for status visibility only.
- Preservation of valid minter-owned new-hub manifests across `compiled-route-sync.cjs` rebuilds.
- Contract tests for valid, stale, malformed, missing, traversal, duplicate-mint, sync-preservation, and no-routing-change cases.

### Out of Scope

- Removing or deriving `COMPILED_ROUTING_HUBS` and `HUB_CHILD`. That is the named future ADR-002 allowlist-removal work.
- Adding a new hub to `DEFAULT_ON_HUBS`, changing `servingAuthority` to `compiled`, or performing the P4 staged flip.
- Implementing create-skill `legacy|ready` behavior. Packet `013-create-skill-alignment/` consumes this interface after it exists.
- Dynamic runtime engine discovery or serving for a new hub.
- Refresh, overwrite, generation increment, rollback, or promotion verbs.
- Generalizing the minter to the specialized existing hub archetypes. This contract targets the registry-driven parent shape emitted by create-skill.
- Editing the frozen benchmark scorer files.

### Implemented Files

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/bin/lib/compiled-route-manifest.cjs` | Create | Shared path, compile, mint, validation, and freshness functions |
| `.opencode/bin/compiled-route-manifest.cjs` | Create | Stable JSON CLI with `mint` and `freshness` verbs |
| `.opencode/bin/compiled-route-status.cjs` | Modify | Reuse the predicate and expose validity/freshness without changing serving authority |
| `.opencode/bin/compiled-route-sync.cjs` | Modify | Preserve valid non-seven-hub canonical manifests across runtime rebuilds |
| `.opencode/bin/tests/compiled-route-manifest.test.cjs` | Create | Contract, failure, sync, and routing-invariance tests |

This implementation did not modify `resolve.cjs`, `compiled-route.cjs`, the advisor allowlists, `DEFAULT_ON_HUBS`, or the three frozen scorer files.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Ship the shared module contract. | The module exports `canonicalManifestPath({hubId})`, `evaluateManifestFreshness({hubId, currentPolicy})`, `mintCanonicalManifest({hubId, skillRoot})`, and `checkCanonicalManifestFreshness({hubId, skillRoot})`; all return JSON-serializable records and never write outside the canonical activation root. |
| REQ-002 | Reuse the shipped generic parent compiler. | Mint and freshness call `compileRegistry()` from the promoted 006 `001-sk-code` compiler with parsed final inputs and source bytes. No second routing compiler or policy-hash algorithm exists. |
| REQ-003 | Mint one canonical initial manifest. | `mint` validates hub/root identity, compiles generation `1`, writes one canonical V1 manifest atomically with `servingAuthority: legacy` and `shadowOnly: true`, fails if the target already exists, then re-reads through the freshness predicate. |
| REQ-004 | Define freshness as exact current-policy equality. | `fresh` is true only when the manifest is structurally valid and its selected generation and `effectivePolicyHash` equal the same fields from a new compile of the current final router inputs. |
| REQ-005 | Return one stable result envelope. | Both verbs return `hubId`, repo-relative `manifestPath`, `manifestValid`, `fresh`, `causeCode`, `selectedPolicy`, `currentPolicyHash`, and `manifestFingerprint`; `mint` also reports `created`. |
| REQ-006 | Reuse and extend status without conflating serving and freshness. | `computeHubStatus()` adds `manifestFreshness: {manifestValid, fresh, causeCode, currentPolicyHash}` while retaining the existing top-level serving `causeCode`. Existing hubs use their specialized engine snapshot; new registry-driven hubs use `checkCanonicalManifestFreshness()`. `knownHubs()` unions fixed engine hubs and activation directories for observability only. |
| REQ-007 | Keep canonical manifests durable across sync. | A successful `compiled-route-sync.cjs` rebuild restores byte-identical, valid, legacy-authority manifests for non-seven hubs; invalid, traversal-shaped, or conflicting entries fail closed. |
| REQ-008 | Preserve routing behavior. | The minter never edits authority, flags, eligibility sets, dispatch maps, or resolver code. Freshness failure exits non-zero, create-skill cannot claim `ready`, and the resolver continues to return the legacy sentinel for a new hub. |
| REQ-009 | Fail closed on every invalid input or artifact. | Missing inputs, hub-ID mismatch, schema error, stale hash, unsafe path, compiler error, duplicate mint, or sync conflict returns `fresh: false`, a stable cause code, and a non-zero CLI exit. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-010 | Keep the CLI automation-safe. | Success JSON is written to stdout, diagnostics to stderr, exit `0` means valid and fresh, exit `1` means operation or freshness failure, and exit `2` means usage error. |
| REQ-011 | Prove compiler reuse and scope locks. | Tests spy on or fixture-drive the shared `compileRegistry()` path and assert no changes to resolver decisions, default-on cohorts, fixed allowlists, or frozen scorer hashes. |
| REQ-012 | Document the consumer boundary. | The result distinguishes `manifest-ready` from `runtime-serving`; create-skill may report only the former until discovery and eligibility work is complete. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A generated parent-hub fixture mints exactly one manifest at the canonical path and immediately returns `manifestValid: true`, `fresh: true`, and `created: true`.
- **SC-002**: Changing any final router input makes `freshness` return `fresh: false`, `causeCode: stale-manifest`, and exit `1`.
- **SC-003**: A second mint cannot replace the first manifest; the original bytes remain unchanged.
- **SC-004**: Runtime sync preserves the new-hub manifest byte-for-byte.
- **SC-005**: All current routing parity and fallback tests remain unchanged and pass; a newly minted hub still resolves through the legacy sentinel.
- **SC-006**: Packet validation and the implementation test suite report zero errors.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Generic 006 registry compiler | A specialized hub shape may not compile through this interface. | Validate the create-skill registry-driven shape and reject unsupported inputs; do not add compiler logic. |
| Dependency | Canonical promoted activation root | Runtime sync currently deletes it. | Capture and restore valid non-seven-hub manifest bytes in the sync transaction. |
| Risk | Freshness mistaken for serving eligibility | create-skill could overstate readiness. | Return separate freshness and serving fields; keep fixed runtime maps unchanged. |
| Risk | Existing manifest overwritten | A retry could destroy activation history. | Initial mint is create-if-absent with no force option. |
| Risk | Path traversal through hub ID or skill root | Writes could escape the store. | Enforce hyphen-case hub IDs, root identity, and canonical containment before reading or writing. |
| Risk | Compiler drift after mint | A once-valid manifest becomes stale. | Recompile on every freshness check and fail closed on hash mismatch. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

| Category | Requirement | Verification |
|----------|-------------|--------------|
| Determinism | Identical final inputs produce identical manifest bytes and fingerprints. | Cross-temp-root fixture comparison |
| Safety | No operation changes authority, eligibility, dispatch, default-on state, or route output. | Source and behavior audit |
| Durability | A normal runtime sync preserves the canonical new-hub manifest exactly. | Pre/post SHA-256 equality |
| Compatibility | Existing status fields and seven-hub records remain available. | Additive schema comparison |
| Performance | Freshness compiles only on explicit control-plane calls, never per route. | Call-site inventory |

## 8. EDGE CASES

| Case | Required Outcome |
|------|------------------|
| Manifest already exists | Fail with `already-exists`; retain original bytes. |
| One final input changes after mint | Return `stale-manifest`; do not rewrite. |
| Hub ID disagrees across requested ID, registry, router, or root | Return `hub-mismatch`; do not create directories. |
| Hub ID or path contains traversal | Return `unsafe-path`; do not read or write outside approved roots. |
| Compiler rejects the generated shape | Return `compile-error`; do not introduce fallback compiler logic. |
| Sync sees an invalid or conflicting retained manifest | Fail the sync transaction; do not silently discard or replace. |
| Status sees a fresh legacy manifest for an unknown engine hub | Report freshness and legacy authority; do not report compiled-serving. |

## 9. COMPLEXITY ASSESSMENT

| Factor | Assessment |
|--------|------------|
| Implementation size | Small adapter and CLI, plus narrow status and sync changes |
| Architectural reach | High: compiler, canonical store, status, sync, and Python consumer boundary |
| Failure impact | High if authority, overwrite, or freshness semantics drift |
| Documentation level | Level 3 because cross-runtime ownership and state semantics require accepted ADRs |

## 10. RISK MATRIX

| Risk | Likelihood | Impact | Control |
|------|------------|--------|---------|
| Duplicate compiler logic | Low | High | Import and test the existing 006 compiler |
| False fresh result | Medium | High | Recompile exact current bytes and compare policy hash plus generation |
| Manifest erased by sync | High without change | High | Validated byte-preserving capture and restore |
| Ready mislabeled as serving | Medium | High | Separate result fields and legacy-sentinel test |
| Scope expands into allowlist removal | Medium | High | Frozen out-of-scope list and diff audit |

## 11. USER STORIES

### US-001: Mint a new parent-hub manifest

**As** create-skill, **I need** one canonical call after final router inputs exist **so that** `ready` does not synthesize or guess an activation artifact.

**Acceptance**: The call returns a canonical repo-relative path and a valid, fresh, inert generation-1 manifest.

### US-002: Detect input drift

**As** a validator, **I need** freshness to reflect current router inputs **so that** a stale manifest cannot support a readiness claim.

**Acceptance**: Any policy-affecting input change returns stale and non-zero without rewriting the manifest.

### US-003: Observe without serving

**As** an operator, **I need** status to show a new manifest separately from runtime eligibility **so that** artifact readiness is not confused with compiled serving.

**Acceptance**: Status reports freshness and legacy authority while the resolver still returns the legacy sentinel.

## 12. OPEN QUESTIONS

- Which future packet owns refresh, generation increment, and overwrite authorization after the initial create-skill mint? This does not block the initial-only contract.
- Which future packet replaces the fixed advisor and engine maps with data-driven eligibility and dispatch? ADR-002 requires that later work, but this phase deliberately does not absorb it.
<!-- /ANCHOR:questions -->

## RELATED DOCUMENTS

- `../002-runtime-promotion-and-status-foundation/implementation-summary.md`
- `../../013-create-skill-alignment/spec.md`
- `../../013-create-skill-alignment/plan.md`
- `../../012-default-on-decision/decision-record.md`
- `decision-record.md`
