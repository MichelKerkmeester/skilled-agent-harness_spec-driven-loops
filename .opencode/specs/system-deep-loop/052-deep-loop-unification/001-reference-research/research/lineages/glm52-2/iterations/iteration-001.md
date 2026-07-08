# Iteration 001 — Structural Layout

**Focus:** Verify child 002 §8's target layout (`system-deep-loop/runtime/` nesting) against the live trees.
**Status:** complete · **newInfoRatio:** 1.0 · **Lineage:** glm52-2

## Approach
Compared the proposed target layout (002/spec.md §8 Architecture Addendum) against the actual directory inventories of `deep-loop-workflows/` and `deep-loop-runtime/` read this session, plus `mode-registry.json`'s mode taxonomy and `package.json`/`tsconfig.json` ownership.

## Findings

### F1.1 — Target layout is structurally correct and complete [CONFIRM]
The proposed shape nests the entire `deep-loop-runtime/` tree as `system-deep-loop/runtime/`, preserving `lib/{deep-loop,coverage-graph,council}/`, `scripts/`, `database/`, `tests/`, `package.json`, `tsconfig.json`, `vitest.config.ts`, `node_modules/`. The live runtime tree (read this session) maps 1:1 onto this. The four mode packets (`deep-research`, `deep-review`, `deep-ai-council`, `deep-improvement`) and hub-level `shared/`, `benchmark/`, `manual_testing_playbook/` stay at hub level untouched — consistent with the diagram.
[SOURCE: 002/spec.md:156-167; live reads of deep-loop-runtime/ + deep-loop-workflows/ dirs]

### F1.2 — runtime/ as infrastructure (not a workflowMode) is the right call [CONFIRM]
`mode-registry.json` exposes exactly `runtimeLoopType` ∈ {research, review, council} for graph-backed modes plus the four improvement lanes; runtime owns no command, no agent, no `artifactRoot`. Adding `runtime` as an 8th mode-registry entry would be a category error (it has no convergence loopType — explicitly `null`-forbidden territory). Correct to delete runtime's `graph-metadata.json` and demote `SKILL.md`→`README.md`.
[SOURCE: deep-loop-workflows/mode-registry.json:7-20; 002/spec.md:169]

### F1.3 — Runtime-owned doc families move as a unit [CLARIFICATION, minor]
The spec diagram lists `feature_catalog/`, `references/`, `changelog/` (frozen v1.5.0.1), `manual_testing_playbook/` under `runtime/`. These are runtime-scoped (e.g. `feature_catalog/01--executor/fallback-router.md` documents `lib/deep-loop/fallback-router.ts`) and must move with runtime, not be hoisted to hub. The prose in §3 Stage 2 only names `graph-metadata.json` deletion + `SKILL.md`→`README.md` demotion, leaving the doc families implicit. No correction — they're carried by the whole-tree `git mv` — but execution should verify no tool assumes these live at hub level.
[SOURCE: deep-loop-runtime/feature_catalog/feature_catalog.md:23; 002/spec.md:163-166]

### F1.4 — Nested package.json at two levels (NEW risk, low) [RISK]
`deep-loop-runtime/package.json` is a "self-contained dependency root" (better-sqlite3, tsx, zod, vitest) with its own `node_modules/`. After nesting, `system-deep-loop/` will host `node_modules/` at hub level (none today) AND at `runtime/node_modules/`. There is no hub-level `package.json` for workflows today, so no immediate conflict. Genuine TS-tooling decoupling (giving runtime its own `typescript`/`@types` instead of borrowing) is explicitly deferred to follow-up hardening (002 §3 Out of Scope). Risk is low but two package.json files under one skill should be sanity-checked against `package_skill.py --check` (002 REQ-007).
[SOURCE: deep-loop-runtime/package.json:1-25; 002/spec.md:77-79]

## Key Questions
- Considered: Q1 (structural layout)
- Answered: Q1 — layout correct; one minor clarification (F1.3) + one low new risk (F1.4)

## Ruled Out
- Splitting runtime's `lib/` across the four mode packets (would destroy the "one frozen backend" invariant both SKILL.md files narrate). BLOCKED — do not attempt; the entire point of the merge is co-location, not fragmentation.
[SOURCE: deep-loop-workflows/SKILL.md:12,112,138; deep-loop-runtime/SKILL.md:10]

## Novelty Justification
First pass; every finding is new to this packet (ratio 1.0). Layout correctness is the load-bearing foundation for all four subsequent questions.

## Next Focus
Iteration 2: Verify the directional path-coupling repair rule (Q2) — the single highest-probability mechanical failure mode per 002 §6.
