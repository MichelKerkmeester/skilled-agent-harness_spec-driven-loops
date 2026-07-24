---
title: "Implementation Plan: Benchmark — Compiled Lane C Parity"
description: "How the non-frozen compiled-routing-parity harness will translate, gate, and score compiled-vs-legacy routing without ever touching the frozen scorer trio."
trigger_phrases:
  - "compiled lane c parity plan"
  - "non-frozen verdict sub-state plan"
importance_tier: "critical"
contextType: "implementation"
---
# Implementation Plan: Benchmark — Compiled Lane C Parity

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node CommonJS — matches the existing skill-benchmark scripts; zero new runtime dependencies |
| **Comparison mechanism** | `compiledParity()` translates compiled `targetQualifiedIds` → legacy `observedResources` via `qualifiedIdToLeaf`, then calls the frozen `evaluateRouteGold` unmodified |
| **Gating authority** | The hub's `activation/<hub>/manifest.json` `servingAuthority` field is the sole vacuous-parity gate input — never the flag alone |
| **Frozen inputs** | Three pinned scorer digests (`router-replay.cjs`, `score-skill-benchmark.cjs`, `load-playbook-scenarios.cjs`) — read-hashed, never edited |

### Overview

This is a Planned, not-yet-implemented packet. Once built, a single new non-frozen file (`compiled-routing-parity.cjs`) plus two orchestrator hooks give Lane C its first real exercise of the compiled routing path. The harness never re-implements scoring: it gates on the hub's actual serving authority (never trusting the flag alone), bridges the compiled and legacy resource vocabularies, and hands the translated comparison to the frozen evaluator unmodified. The one piece of new judgment logic — the three-way verdict sub-state — is deliberately placed in the non-frozen `run-skill-benchmark.cjs` orchestrator, per the orchestrator review's highest-priority correction, so the frozen scorer trio never needs to change.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The hub activation manifest shape (`servingAuthority`, `selectedPolicy`, `shadowOnly` at `010-live-activation/activation/<hub>/manifest.json`) is confirmed stable enough to read directly, independent of whether `002`'s wired probe has shipped.
- [ ] The three frozen-trio digest values to pin are confirmed against `010-live-activation/implementation-summary.md`.
- [ ] `leaf-resource-contract.cjs`'s current export surface is confirmed so `qualifiedIdToLeaf` can be added additively, not as a rename.

### Definition of Done
- [ ] `compiled-routing-parity.cjs` ships and exports `compiledParity(...)`.
- [ ] Both orchestrator hooks land (`row.compiledParity` attach + `BLOCKED-BY-COMPILED-DRIFT` branch; `build-report.cjs` render block).
- [ ] The verdict sub-state lives only in `run-skill-benchmark.cjs`; the frozen `score-skill-benchmark.cjs` SHA-256 is unchanged.
- [ ] The vacuous-parity guard hard-fails every `servingAuthority !== 'compiled'` case in a fixture sweep.
- [ ] The flag-state matrix (`unset/0/1/invalid`) produces 4 distinct, correct outcomes in a Vitest table.
- [ ] The `qualifiedIdToLeaf` bijection Vitest passes against every eligible hub's `leaf-manifest.json`.
- [ ] Exactly one blocking drift-gate owner is documented; other consumers are named report-only.
- [ ] `validate.sh --strict` on this phase folder reports Errors: 0.

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Compare, never replace. `compiled-routing-parity.cjs` does not re-implement the frozen scorer's judgment; it translates compiled output into the frozen evaluator's own vocabulary, calls it unmodified, and layers a sub-state classification and a vacuous-serving guard on top — entirely in non-frozen code.

### Key Components
- **`compiled-routing-parity.cjs`**: the new non-frozen parity harness (`compiledParity({scenario, legacyObserved, skillRoot, skillId})`).
- **`run-skill-benchmark.cjs` hook**: attaches `row.compiledParity`, hosts the verdict sub-state, and the `BLOCKED-BY-COMPILED-DRIFT` exit-3 branch.
- **`build-report.cjs` hook**: renders the `compiledRouting` JSON block into the Markdown report.
- **`leaf-resource-contract.cjs` addition**: `qualifiedIdToLeaf`, the shared shape-bridge primitive (also cited by 008's CF-SC-2 bijection test).

### Data Flow

Compiled artifact (`targetQualifiedIds`) + hub activation manifest (`servingAuthority`) → vacuous-parity guard (hard-fail if not `compiled`) → `qualifiedIdToLeaf` translation → frozen `evaluateRouteGold` (unmodified) → sub-verdict classification in `run-skill-benchmark.cjs` → `row.compiledParity` attached → `build-report.cjs` renders the `compiledRouting` block.

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase introduces a new comparison layer over the existing benchmark orchestrator, so the surface inventory is required before any file is touched.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Three frozen scorer files | Sole route-gold authority | Read-hashed only, never edited | Pinned digests unchanged before and after every run |
| `run-skill-benchmark.cjs` | Non-frozen orchestrator; already maps verdict → exit codes | Attach `row.compiledParity`; add the verdict sub-state; add `BLOCKED-BY-COMPILED-DRIFT` exit 3 | Vitest: 3 distinct sub-verdicts, never OR-collapsed into one `BLOCKED` |
| `build-report.cjs` | Renderer; no template today for this block | Add the `compiledRouting` JSON→Markdown block | Rendered-report fixture test |
| `leaf-resource-contract.cjs` | Hosts `buildResourceContract`/`selectResourceContract` | Add `qualifiedIdToLeaf` reverse lookup (additive) | Bijection Vitest against every eligible hub's `leaf-manifest.json` |
| `010-live-activation/activation/<hub>/manifest.json` (7 files) | Per-hub `servingAuthority` record | Read-only precondition input | Vacuous-guard fixture: `servingAuthority !== 'compiled'` → hard fail |
| `loop-host.cjs` + both skill-benchmark workflow dispatches | CLI/workflow option whitelist | Add `--compiled-routing-parity`, or record the unconditional `auto` mode | Flag (or fallback marker) reaches the orchestrator in an integration run |

Required inventories before build:
- Confirm the pinned digest values match `010-live-activation/implementation-summary.md`'s three hashes before writing the pin into this harness.
- `rg -n "compiledParity|targetQualifiedIds" .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/` — confirm no prior partial implementation exists to conflict with.
- Confirm `leaf-resource-contract.cjs`'s current exports so `qualifiedIdToLeaf` is additive, not a rename.

<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Read the hub manifest schema and pin the frozen-trio digests against `010-live-activation/implementation-summary.md`.
- [ ] Confirm `leaf-resource-contract.cjs`'s current export surface (additive-only plan for `qualifiedIdToLeaf`).
- [ ] Re-anchor `run-skill-benchmark.cjs`'s verdict switch on the named symbol, not the ±2-10 line citation (review-v1 §2 line-drift note), before editing.

### Phase 2: Core Implementation
- [ ] Author `compiled-routing-parity.cjs` (`compiledParity({scenario, legacyObserved, skillRoot, skillId})`).
- [ ] Add `qualifiedIdToLeaf` to `leaf-resource-contract.cjs`, exposed via `selectResourceContract`.
- [ ] Wire the vacuous-parity guard (reads `servingAuthority`; hard-fails `vacuous`).
- [ ] Implement the flag-state matrix (`unset/0/1/invalid`).
- [ ] Implement the verdict sub-state in `run-skill-benchmark.cjs` (non-frozen only) + the `BLOCKED-BY-COMPILED-DRIFT` exit-3 branch.
- [ ] Attach `row.compiledParity`; add `compiledEligibility` + the status enum to `routeGold.summary`.
- [ ] Add the `compiledRouting` render block to `build-report.cjs`.
- [ ] Wire `--compiled-routing-parity` through `loop-host.cjs` + both workflow dispatches (or the unconditional-`auto` fallback).

### Phase 3: Verification
- [ ] Frozen-trio SHA-256 diff (pre/post the full change set): zero drift.
- [ ] Vacuous-parity fixture sweep (all 7 current hub manifests + one synthetic `servingAuthority: legacy` fixture).
- [ ] `qualifiedIdToLeaf` bijection Vitest against every eligible hub's `leaf-manifest.json`.
- [ ] Flag-state matrix Vitest (4 states × expected outcomes).
- [ ] Verdict sub-state Vitest (3 distinct outer verdicts; assert no OR-collapse).
- [ ] Rendered-report fixture test (`compiledRouting` block populated, not a placeholder).
- [ ] `validate.sh --strict` on this phase folder.

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Precondition | Frozen-scorer pin; vacuous-parity guard | Digest re-hash + manifest fixture sweep |
| Translation | Shape-bridge correctness | `qualifiedIdToLeaf` bijection Vitest against `leaf-manifest.json` |
| State-space | Flag-state matrix; verdict sub-state | Vitest tables (4 flag states; 3 sub-verdicts) |
| Rendering | Report block population | Rendered-report fixture test |
| Reachability | CLI/workflow wiring | Integration run per dispatch surface |

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `002-runtime-promotion-and-status-foundation` | Internal | Planned/Not-started | Soft-coupled only: the vacuous-parity guard reads the hub manifest directly (CF-BM-2), so this child is not hard-blocked; it is blocked only if 002 later relocates or reshapes the manifest file |
| Frozen benchmark scorer trio | Internal | Green (shipped, pinned) | Drift would invalidate the parity baseline; the harness aborts before any write |
| `leaf-resource-contract.cjs` | Internal | Green (exists today) | An additive `qualifiedIdToLeaf` export; blocked only if the file's current export surface must be renamed to fit |

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A frozen-trio digest drift is detected, or a vacuous-parity/flag-matrix/verdict-substate fixture fails during implementation.
- **Procedure**: The harness and its two hooks are additive-only; disabling `--compiled-routing-parity` (or reverting the hook diffs) returns Lane C to its exact current legacy-only behavior. No runtime routing decision is touched by this child, so rollback has zero effect outside the benchmark/CI surface.

<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup / read + pin + re-anchor) ──► Phase 2 (Core / harness + hooks + guard + matrix) ──► Phase 3 (Verify / digests + fixtures + Vitests)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Stable manifest shape, pinned digests | Core |
| Core | Setup | Verify |
| Verify | Core | This child's completion claim; 005's consumption of the report/evidence shape |

<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup (read + pin + re-anchor) | Low | One pass per shared file touched |
| Core (harness + 2 hooks + guard + matrix + sub-state) | Med | The bulk of the work; several small, well-fenced diffs |
| Verification (digests + fixtures + Vitests) | Low | Automated once the fixtures exist |

<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-implementation checklist
- [ ] Frozen-trio digests pinned and confirmed against `010-live-activation/implementation-summary.md`.
- [ ] Hub manifest shape confirmed stable for direct reads.
- [ ] `leaf-resource-contract.cjs` export surface confirmed additive-safe.

### Rollback procedure
1. Revert the `run-skill-benchmark.cjs` and `build-report.cjs` hook diffs.
2. Remove or disable `compiled-routing-parity.cjs` and the `qualifiedIdToLeaf` export.
3. Confirm Lane C's existing (legacy-only) tests are unaffected — this child adds a path, it does not alter the existing one.

### Data reversal
- **Has runtime effect?** No — this child never changes what routes; it only benchmarks what already does.
- **Reversal procedure**: Delete/revert the additive files and hook diffs; no external committed effect exists to undo.

<!-- /ANCHOR:enhanced-rollback -->
