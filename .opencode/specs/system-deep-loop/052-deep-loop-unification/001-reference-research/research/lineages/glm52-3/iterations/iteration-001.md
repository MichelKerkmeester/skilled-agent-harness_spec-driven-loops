# Iteration 001 — Structural Layout Safety + Path-Mechanism Audit

**Lineage:** glm52-3 | **Iteration:** 1 of 5 | **Focus:** Q1 (structural layout) + Q2 mechanism (absolute-vs-relative path coupling)
**Date:** 2026-07-08

## Focus

Verify the fold is mechanically safe by enumerating runtime components and auditing every REAL relative `require()`/`path.join(__dirname)` hop (the ones that break on nesting) vs the absolute-path string sites (which survive via repo-root resolution). Distinguish the distinct repair strategies.

## Findings

### F1.1 — runtime component inventory (where each lands post-merge)

Runtime folds INTO `system-deep-loop/` as a nested `runtime/` folder. Confirmed inventory:

- `runtime/lib/{council,coverage-graph,deep-loop}/` — the loop infrastructure (artifact-root, atomic-state, bayesian-scorer, continuity-thread, executor-{config,audit}, fallback-router, jsonl-repair, loop-lock, observability-events, permissions-gate, post-dispatch-validate, prompt-pack, runtime-capabilities, lifecycle-taxonomy + council/coverage-graph modules). [SOURCE: ls deep-loop-runtime/lib]
- `runtime/scripts/` — fanout-{merge,pool,run,salvage}, convergence, query, upsert, verify-iteration, loop-lock, status, check-contract-drift, compile-command-contracts, render-command-contract. [SOURCE: ls deep-loop-runtime/scripts]
- `runtime/package.json`, `runtime/tsconfig.json`, `runtime/vitest.config.ts`, `runtime/tests/`, `runtime/database/` — own TS tooling + test suite. [SOURCE: ls deep-loop-runtime]

Layout is mechanically safe: runtime is a self-contained unit with its own build tooling, so it relocates as a subtree. No orphaned entry points found — every script is invoked via absolute repo-root path from commands or via relative require from a peer. [SOURCE: commands/deep/*.md shell out to deep-loop-runtime/scripts/render-command-contract.cjs]

### F1.2 — THREE distinct path-repair mechanisms, NOT a single "bidirectional" class

This is the core stress-test finding. The plan/spec frames coupling as "bidirectional path-coupling repair." The real code exhibits THREE mechanically-distinct repair strategies that a single mechanical pass would conflate:

**(A) ABSOLUTE repo-root string paths (runtime→workflows):** `compile-command-contracts.cjs:15-75` and `check-contract-drift.cjs:40-42` hold ~40+ string literals like `'.opencode/skills/deep-loop-workflows/mode-registry.json'`. These resolve from CWD/repo-root, NOT `__dirname`. Post-merge they need a TEXTUAL skill-name segment replace (`deep-loop-workflows` → `system-deep-loop`) with ZERO hop-count change — and the targets themselves move (mode-registry.json etc. land under system-deep-loop), so the strings must be rewritten to the new locations, not just renamed. [SOURCE: deep-loop-runtime/scripts/compile-command-contracts.cjs:15,17,27,44-75; check-contract-drift.cjs:40-42]

**(B) RELATIVE `require()` hops — forward direction (runtime→workflows/shared):** exactly ONE site: `render-command-contract.cjs:11` → `require('../../deep-loop-workflows/shared/rollout/resolve-injection-mode.cjs')`. From `runtime/scripts/`, `../../` reaches `system-deep-loop/` root post-merge, so target becomes `../../shared/rollout/resolve-injection-mode.cjs`. **CONFIRMS spec.md:132 forward rule: SAME hop-count (2), segment `deep-loop-workflows` DELETED** (now self-referential). [SOURCE: deep-loop-runtime/scripts/render-command-contract.cjs:11]

**(C) RELATIVE `path.join(__dirname...)` — runtime→system-spec-kit tooling-borrow:** exactly ONE site: `artifact-root.cjs:18` → `path.join(__dirname,'..','..','..','system-spec-kit','shared','review-research-paths.cjs')`. From `runtime/lib/deep-loop/`, post-merge `../../../` now undershoots (lands at system-deep-loop root). Needs **+1 hop** → `../../../../system-spec-kit/...`. [SOURCE: deep-loop-runtime/lib/deep-loop/artifact-root.cjs:18]

**(D) RELATIVE `require()` hops — reverse direction (workflows mode packets→runtime):** the largest class, ALL following the SAME rule. `../../../deep-loop-runtime/lib/...` (3 hops) → post-merge `../../runtime/lib/...` (2 hops). **CONFIRMS spec.md:132 reverse rule: ONE FEWER hop + segment `deep-loop-runtime`→`runtime` renamed.** Sites (sample, mechanism uniform):
- `deep-review/scripts/reduce-state.cjs:14`, `deep-research/scripts/reduce-state.cjs:15,20`
- `deep-review/scripts/runtime-capabilities.cjs:18`, `deep-research/scripts/runtime-capabilities.cjs:18`
- `deep-improvement/scripts/shared/reduce-state.cjs:124`, `improvement-journal.cjs:24`
- `deep-ai-council/scripts/orchestrate-session.cjs:16-18`, `orchestrate-topic.cjs:14-18` (the "5+ seam files": round-state-jsonl, cost-guards, session-state-hierarchy, multi-seat-dispatch, adjudicator-verdict-scoring)
- 6 test files under `deep-ai-council/scripts/tests/*.vitest.ts` (4-hop `../../../../` → 3-hop, same rename) [SOURCE: rg require across deep-loop-workflows scripts]

### F1.3 — spec.md:132 asymmetry risk CONFIRMED, not overstated

The "get it backwards" risk is real and verified: forward = same-hops+delete (mechanism B); reverse = fewer-hops+rename (mechanism D). A naive "add `..` everywhere since things nested deeper" corrupts BOTH directions. Child 002's before/after table per site is the correct mitigation; exit-gate is real `npm test`, not just grep. [SOURCE: spec.md:132; this iteration's mechanism enumeration]

## Ruled Out

- **Ruled out:** "treat all coupling as one mechanical find/replace." Three strategies (absolute-string rewrite, forward-relative segment-delete, reverse-relative hop-reduce+rename, plus the +1-hop tooling-borrow) must be applied per-mechanism. A single sed pass would break class (A) sites by injecting hop changes into absolute strings.
- **Ruled out:** "the reverse direction is the larger risk by count." It's the larger by SITE count (~12 vs 1 forward + 1 tooling-borrow) but mechanism-uniform; the forward direction's single site (B) is riskier per-site because its self-referential nature is easy to misrepair.

## Novelty Assessment

newInfoRatio: 0.85 — Fully-new characterization of the THREE-mechanism split (the spec/plan only framed "bidirectional"). Independently confirmed the spec.md:132 asymmetry with exact file:line evidence and computed the post-merge hop arithmetic. Novelty: the plan conflates absolute-string sites (class A) with relative-require sites; this iteration separates them and warns a single mechanical pass breaks class A.

## Sources

- [SOURCE: .opencode/skills/deep-loop-runtime/scripts/compile-command-contracts.cjs:15-75]
- [SOURCE: .opencode/skills/deep-loop-runtime/scripts/check-contract-drift.cjs:40-42]
- [SOURCE: .opencode/skills/deep-loop-runtime/scripts/render-command-contract.cjs:11]
- [SOURCE: .opencode/skills/deep-loop-runtime/lib/deep-loop/artifact-root.cjs:18]
- [SOURCE: .opencode/skills/deep-loop-workflows/deep-{review,research}/scripts/{reduce-state,runtime-capabilities}.cjs]
- [SOURCE: .opencode/skills/deep-loop-workflows/deep-ai-council/scripts/orchestrate-{session,topic}.cjs]
- [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/spec.md:62,132]
