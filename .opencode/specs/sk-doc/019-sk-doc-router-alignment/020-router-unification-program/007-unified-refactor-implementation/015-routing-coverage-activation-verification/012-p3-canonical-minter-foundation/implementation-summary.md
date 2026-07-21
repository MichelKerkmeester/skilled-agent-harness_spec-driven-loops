---
title: "Implementation Summary: P3 Canonical Manifest Minter Foundation"
description: "Implemented-state record for the shared initial minter, exact freshness predicate, additive status visibility, sync preservation, and zero-routing-delta evidence."
trigger_phrases:
  - "canonical minter implementation summary"
  - "manifest freshness current status"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/012-p3-canonical-minter-foundation"
    last_updated_at: "2026-07-21T05:29:04Z"
    last_updated_by: "codex"
    recent_action: "Implemented and verified the canonical minter foundation"
    next_safe_action: "Integrate the stable JSON CLI in the create-skill consumer"
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
      - "Refresh and data-driven serving ownership remain future decisions."
    answered_questions:
      - "The 006 compiler core is reusable; its hardcoded harness is not."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify + level3-architecture | v2.2 -->
# Implementation Summary: P3 Canonical Manifest Minter Foundation

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Implemented |
| **Date** | 2026-07-21 |
| **Level** | 3 |
| **Implementation** | Shared module, CLI, status integration, sync preservation, and contract tests |
| **Consumer** | `../../013-create-skill-alignment/` |
| **Routing impact** | None; resolver bytes and pre/post new-hub legacy sentinel are unchanged |
| **Strict validation** | Final metadata refresh and strict validation recorded below |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The implementation adds five scoped runtime/test surfaces:

| File | Delivered behavior |
|------|--------------------|
| `.opencode/bin/lib/compiled-route-manifest.cjs` | Canonical path resolution, exact input loading, unchanged `compileRegistry()` reuse, structural validation, freshness, and atomic initial mint |
| `.opencode/bin/compiled-route-manifest.cjs` | Thin `mint` and `freshness` JSON CLI with `0|1|2` exit semantics |
| `.opencode/bin/compiled-route-status.cjs` | Nested `manifestFreshness` plus observability-only activation-directory discovery |
| `.opencode/bin/compiled-route-sync.cjs` | Byte-preserving capture and restore of safe external inert manifests around root replacement |
| `.opencode/bin/tests/compiled-route-manifest.test.cjs` | Thirteen contract tests covering positive, negative, integration, status, sync, concurrency, and routing-invariance cases |

A minted manifest contains only the existing V1 fields, uses generation `1`, `servingAuthority: "legacy"`, and `shadowOnly: true`. It is artifact-ready but is not registered in either fixed serving map.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The shared module reads exact `SKILL.md`, `mode-registry.json`, and `hub-router.json` bytes from a validated final root, then passes parsed inputs and source bytes to the existing 006 `compileRegistry()`. Mint serializes with the compiler's existing `artifactBytes()` helper and creates the file with `wx`; retry and concurrent-writer paths preserve the winner's bytes.

Freshness validates the manifest shape, recompiles at the selected generation, and requires both generation and `effectivePolicyHash` equality. Existing status records use each specialized engine snapshot as current policy; newly discovered registry-driven hubs use the generic shared compile path. Sync captures only structurally valid generation-1 legacy/shadow manifests outside the fixed seven and restores exact bytes without overwriting conflicts.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Wrap the generic 006 `compileRegistry()` | It already computes the authoritative policy hash for the generated registry-driven parent shape. |
| Add a small stable CommonJS module and JSON CLI | create-skill is Python and needs one callable contract without embedding policy logic. |
| Use generation `1` and create-if-absent | Packet 013 creates new hubs; refresh and overwrite authority are unnecessary and risky here. |
| Keep `servingAuthority: legacy` and `shadowOnly: true` | Minting proves artifact readiness without changing a routing decision. |
| Compare a new compile with the selected policy hash | The current status fingerprint identifies bytes but does not prove current inputs produced them. |
| Preserve new-hub manifest bytes across sync | The sync build replaces the promoted runtime root, so external inert manifests are captured first and restored exactly. |
| Defer fixed-map removal and P4 advancement | They are separate serving and eligibility changes, not prerequisites for initial mint and freshness. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Evidence | Result |
|----------|--------|
| Baseline routing suites | `.opencode/bin/compiled-routing-{foundation,flag-propagation}.vitest.ts`: 2 files, 33/33 tests passed before edits. |
| Baseline integrity | Frozen scorer SHA-256 values were captured before edits; all seven committed manifest SHA-256 values and seven top-level status causes were also captured. |
| Syntax | `node --check` passed for all five new or modified `.cjs` files. |
| Focused contract matrix | `node .opencode/bin/tests/compiled-route-manifest.test.cjs`: 13/13 passed, covering mint, freshness, three drift axes, failures, status, sync, concurrent writers, Python JSON parsing, and pre/post legacy sentinel equality. |
| Routing regression delta | The two existing routing suites passed 33/33 after edits; delta from baseline is 0 tests and 0 failures. Promoted resolver and engine files have no diff. |
| Status integration | `node .opencode/bin/compiled-route-status.cjs --all --pretty` returned seven records with nested `manifestFreshness`; all seven serving `causeCode` values remain `flag-off`. Five manifests are fresh and two existing manifests are truthfully stale. |
| Status timing | One local `--all` run measured `real 0.02s` before and `real 0.07s` after freshness compilation; no hard latency threshold applies. |
| Sync durability | The focused suite exercises actual capture/root-removal/restore helpers with byte equality, invalid/conflict rejection, and fixed-hub exclusion. Real `--check` reports 72 authored closure paths and all 7 hubs resolved; real `--verify` reports all 7 resolved and 0 reads under `.opencode/specs`. |
| Quality workflow | `run-all-drift-guards.sh` passed alignment drift, stack folders, and router sync (10/10); per-file comment hygiene passed with zero findings. |
| Frozen files and defaults | End hashes equal the recorded scorer baselines; all seven committed manifest hashes are unchanged; `DEFAULT_ON_HUBS` remains empty; no `SKILL.md`, resolver, engine dispatch, or eligibility source changed. |
| Downstream boundary | `../../013-create-skill-alignment/spec.md:75` and `:130` require this canonical interface and forbid a synthetic replacement; its plan routes `ready` through the canonical minter. |
| Strict packet validation | `validate.sh --strict` completed with 0 errors and 0 warnings after metadata regeneration. |

### Frozen scorer SHA-256 equality

| File | Start | End |
|------|-------|-----|
| `load-playbook-scenarios.cjs` | `5029f22df920418eb0f87859a7146b83656619943a9fe6f010d6d06e96cdd029` | `5029f22df920418eb0f87859a7146b83656619943a9fe6f010d6d06e96cdd029` |
| `router-replay.cjs` | `d5e13daf3e99469c079e8037c988b31db4d27dfcf5045789d70dceb48de8af47` | `d5e13daf3e99469c079e8037c988b31db4d27dfcf5045789d70dceb48de8af47` |
| `score-skill-benchmark.cjs` | `d5a9cc72ec7cfcfb6484f0998f78e7ec16160ecdfee9e3c63f3215c72bf8780c` | `d5a9cc72ec7cfcfb6484f0998f78e7ec16160ecdfee9e3c63f3215c72bf8780c` |

### Sign-off

Codex implementation verification on 2026-07-21 confirms the shared compiler path, exact freshness behavior, zero routing delta, and unchanged scope locks. Runtime discovery, allowlist removal, refresh, and the default-on cohort remain deferred.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A fresh manifest is not a serving registration.** The new hub stays on the legacy sentinel until later data-driven discovery and eligibility work.
2. **Initial mint only.** Refresh, overwrite, generation increment, rollback, and promotion remain deferred.
3. **One generated archetype only.** The adapter targets the registry-driven create-skill parent and does not unify the specialized existing hub compilers.
4. **Status remains control-plane.** Freshness recompiles inputs and is not imported by the per-request resolver.
5. **Sync verification used the approved dry path.** The real capture/restore helpers ran against an isolated activation root, while live `--check` and `--verify` protected the promoted closure; a full live rebuild was not required for this phase.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:follow-up -->
## Follow-ups

- [x] Execute T001-T022 in `tasks.md` and record baseline-to-final verification.
- Deferred: implement packet 013 against the shipped CLI after final router inputs exist.
- Deferred: assign separate future ownership for refresh semantics.
- Deferred: execute ADR-002 data-driven eligibility and fixed-map removal as named future work.
- Deferred: advance hubs through P4 only after the existing cutover join gate passes.
<!-- /ANCHOR:follow-up -->
