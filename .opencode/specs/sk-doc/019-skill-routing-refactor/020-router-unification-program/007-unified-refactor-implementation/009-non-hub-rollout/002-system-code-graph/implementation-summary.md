---
title: "Implementation Summary: system-code-graph Non-Hub Router Rollout"
description: "A target-local shadow gate now compiles system-code-graph through the frozen generic singleton compiler and proves real-scorer compatibility, zero effects, and byte-exact rollback without touching live routing."
trigger_phrases:
  - "system code graph rollout implementation"
  - "system code graph compiled artifacts"
  - "system code graph real green evidence"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/009-non-hub-rollout/002-system-code-graph"
    last_updated_at: "2026-07-19T12:10:00.000Z"
    last_updated_by: "codex"
    recent_action: "Closed target, scorer, parity, rollback, syntax, and strict gates"
    next_safe_action: "Keep live activation deferred until the program promotion gate"
    blockers: []
    key_files:
      - "harness/validate.cjs"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

# Implementation Summary: system-code-graph Non-Hub Router Rollout

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-system-code-graph |
| **Completed** | 2026-07-19 |
| **Level** | 2 |
| **Status** | Complete |
| **Local Status** | Target harness and strict packet validation green |
| **Live Authority** | None; legacy remains serving-authoritative |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built

`system-code-graph` now has an isolated compiled-policy rollout child. The child reads the live skill and manifest without modifying them, runs those authored bytes through the unchanged generic compiler, and emits a canonical singleton policy plus advisor, typed route-gold, policy-card, fixture, and activation artifacts.

The target-local validator proves the part that matters operationally: every typed fixture projects through the real frozen scorer, the compiled evaluator emits no effects, and rollback returns to the exact prior manifest bytes while stale epochs stay fenced.

### Files Changed

| Group | Action | Purpose |
|-------|--------|---------|
| `harness/` | Created | Authored-source normalization, deterministic generation, fingerprints, and full target gate |
| `parity/` | Created | Thin adapter over the shared shadow-parity module |
| `activation/` | Created | Checked manifest set and thin adapter over shared fenced transitions |
| `compiled/system-code-graph/` | Created | Canonical policy, three projections, and five fixture families |
| Packet docs and metadata | Created | Scope, plan, evidence, and continuity |
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The adapter uses the frozen source normalizer, then adds the three exclusions already authored under “When NOT to use.” Because this standalone skill owns no live advisory guard file, a target-local allow/warn sentinel satisfies the normalizer's advisory-only precondition and is removed from policy provenance. Only `SKILL.md` and `leaf-manifest.json` hashes remain load-bearing.

The explicit build writes 13 child-local artifacts. Default verification is read-only: it generates twice in memory, checks two isolated process fingerprints, validates schemas and hashes, calls the protected scorer and legacy router in subprocesses, runs the closed-algebra and document-only cases, exercises fenced activation/rollback, and compares before/after child and scorer bytes.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Reuse phase-001 modules directly | The rollout must prove the same compiler contract, not a copied local variant |
| Keep plural defaults outside selected routes | The skill explicitly declares them fallback-only, so zero signal must defer |
| Derive exclusions from authored prose | The shared source parser recognizes mcp-code-mode's historical heading, while this skill authors the same boundary under “When NOT to use” |
| Exclude the adapter sentinel from provenance | It proves advisory disposition but is not an authored live target source |
| Treat parity as classified shadow partial | The legacy replay returns intent/resource observations, not typed non-route actions; hiding those three differences would overstate parity |
| Use in-memory fenced transitions | It proves generation pinning, CAS, stale rejection, and exact bytes without writing outside the child |
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Deterministic build | PASS: 13 artifacts; two in-memory builds and two process fingerprints; body SHA-256 `de55cf0b63df31b27ceb1cc1078d6e3c09b41b3ee14ae2bb76144ec1e7e1443f` |
| Effective policy | PASS: `ceadd464648a46488ca3781bcb37b72782221352fb191b78f0d7a92d0a487a40` across all projections |
| Authored router | PASS: candidate 1, selectors 37, leaves 53, fallback defaults 2, exclusions 3, static provenance, null overlay |
| Closed algebra | PASS: route, defer(no-match), one clarify, reject(forbidden); non-routes target-free and effect-free; rank calls 0 |
| Real scorer | PASS: 5/5 projected rows; two falsifiers rejected in protected subprocess |
| Shadow parity | SHADOW-PARTIAL by design: legacy authoritative, effects 0, one match, three classified non-route differences, no gold mutation |
| Fenced rollback | PASS: pre/restored SHA-256 `5485c5a4a6faddca886425dedc59bd0d5340f7946f9bf7f6a8fec36e802a8c23`; fence 2 |
| Protected scorer | PASS: all three before/after SHA-256 baselines unchanged |
| Static checks | PASS: six `.cjs` files pass `node --check`; comment hygiene passes |
| Strict packet validation | PASS: exit 0, 0 errors, 0 warnings |
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations

1. Shadow parity is not zero-mismatch. The legacy router returns two selected leaves for equal evidence and empty observations for defer/reject, while the compiled algebra emits typed clarify/defer/reject. All three differences are classified and effect-free; live activation remains deferred.
2. The shared source adapter still names its advisory input `mcp-route-guard.cjs`. This child excludes that adapter-only sentinel from provenance rather than claiming the target owns such a file.
3. The activation drill is in memory. It exercises the same frozen fenced state machine but does not select a live policy or perform a filesystem rename.
4. No repository-wide test suite was run; this delivery is gated by the target-local real scorer, schema, parity, rollback, syntax, JSON, and strict packet checks.
<!-- /ANCHOR:limitations -->
