---
title: "Implementation Plan: Metadata-Driven Executor-Delegation Resolver"
description: "Technical plan for WS2: a metadata-derived executor-delegation resolver applied post-fusion in the TS scorer and mirrored in the Python local scorer, replacing the inline cli-opencode band-aid with no replacement pre-clamp penalty."
trigger_phrases:
  - "executor delegation resolver plan"
  - "post-fusion override architecture"
  - "python ts executor parity"
importance_tier: "high"
contextType: "implementation"
parent: "system-skill-advisor"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/016-skill-advisor-tuning/005-executor-delegation-resolver"
    last_updated_at: "2026-07-06T21:30:00.000Z"
    last_updated_by: "opus-4.8"
    recent_action: "Resolver implemented; all gates green"
    next_safe_action: "Orchestrator pushes the working tree to the shared branch"
---
# Implementation Plan: Metadata-Driven Executor-Delegation Resolver

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

WS2 replaces the explicit-lane band-aid with a metadata-driven resolver. Active executor aliases come from the cli-family projection (name variants + intent signals + derived trigger phrases) plus the shared `model_profiles.json`; suppressed aliases come from archived cli metadata; orchestrator nouns are derived from executor ids. A pure resolver classifies each prompt (negative-guard, suppressed-abstain, direct-alias, orchestrator+cue), and a post-fusion override lifts the resolved executor (injecting it if absent) or abstains. The Python local scorer mirrors the same logic. This design input is the `001-scorer-saturation-root-fix` umbrella, which names this as WS2.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- `npm run typecheck` exits 0.
- `python3 -m py_compile scripts/skill_advisor.py` succeeds.
- `python-ts-parity.vitest.ts` holds at 105/101/4.
- `executor-delegation.vitest.ts` (unit + native + TS/Python parity) green.
- `local-native-divergence-ratchet.vitest.ts` green after the one-entry ledger removal.
- No advisor test regresses versus the pre-existing baseline.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The override is post-fusion because a pre-clamp explicit-lane penalty cannot carry negative evidence (the lane clamps each skill at 1) and abstention must run first. The alias table is metadata-derived so new executors/models need no code change. The filesystem-derived part (model registry + archived metadata) is memoized by workspace root; the projection-derived part is recomputed per call so a fixture projection never contaminates the real one. Precedence in the resolver: negative guard -> suppressed(abstain) -> direct alias(route, longest match) -> orchestrator noun + delegation cue(route).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

- `lib/scorer/executor-delegation.ts` (new module, the resolver + override).
- `lib/scorer/fusion.ts` (one insertion after the breadth-abstention block, before the `passing` filter).
- `lib/scorer/lanes/explicit.ts` (band-aid block removed).
- `scripts/skill_advisor.py` (alias table, resolver, executor-agnostic disambiguation, code-edit skip-guard alignment).
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: TS resolver module
Build the alias table, the pure `resolveExecutorDelegation`, and `applyExecutorDelegationOverride` (inject-if-absent + abstain) in the new module.

### Phase 2: Fusion integration and band-aid removal
Wire the override into fusion.ts at the post-fusion anchor; delete the explicit-lane band-aid with no replacement pre-clamp penalty.

### Phase 3: Python mirror
Mirror the alias table, resolver, and executor-agnostic disambiguation in skill_advisor.py; align the code-edit skip-guard to the shared resolver.

### Phase 4: Fixtures, tests, and ratchet
Author the shared fixture and tests; run all gates; reconcile the divergence ratchet with a single-entry removal.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- Pure-function unit tests on `resolveExecutorDelegation` (each branch + a bare-opencode non-fire).
- A native TS fixture test (`topSkill === expectedTop`).
- A TS/Python parity assertion consuming the same JSON.
- The 193-row parity gate and the divergence ratchet as safety gates.
- Empirical source-vs-dist probe (temporary throw) to confirm vitest exercises source `.ts`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `001-scorer-saturation-root-fix` (design-input umbrella; names WS2).
- `sk-prompt-models/assets/model_profiles.json` (model -> executor map).
- `cli-opencode` / `cli-claude-code` graph metadata; `z_archive/cli-codex-retired` graph metadata.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the four source files and the two new test artifacts, and restore the removed ledger entry. The override is a no-op on non-delegation prompts, so partial rollback of only the Python or only the TS side degrades to the prior split behavior without corpus impact.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

Phase 2 depends on Phase 1 (the override helper). Phase 3 (Python) is independent of 1-2 but must produce identical top-1 decisions. Phase 4 (tests + ratchet) depends on all three.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

~300 LOC net across two TS modules, one Python script, and the fixtures/tests. Single session.
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

The ledger edit is a single-entry removal; restoring it re-approves the prior divergence if WS2 is reverted. No database or embedding state changes, so rollback is a pure file revert with no migration.
<!-- /ANCHOR:enhanced-rollback -->
