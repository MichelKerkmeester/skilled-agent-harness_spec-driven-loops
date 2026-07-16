# Deep Research Strategy — glm52-3 Lineage

## Research Topic

Validate and stress-test the merge design for folding `deep-loop-runtime` into `deep-loop-workflows` as `system-deep-loop`: structural layout, bidirectional path-coupling repair, the `system-spec-kit` tooling-borrow, reference migration across commands/agents/READMEs/advisor-corpus, and whether `fallback-router.ts` should be wired for real GLM-5.2 to MiMo-v2.5-Pro fallback.

## Known Context

- **Two skills today:** `deep-loop-workflows` (hub, advisor-routable, 4 active workflow families: research/review/ai-council/improvement) consumes `deep-loop-runtime` (frozen, MCP-free backend). [SOURCE: .opencode/skills/deep-loop-workflows/SKILL.md:12]
- **Merge target:** fold runtime INTO workflows skill, rename result to `system-deep-loop`; runtime lands as a nested `runtime/` folder. [SOURCE: spec.md:64-65,74]
- **This phase is strictly read-only** — no merge execution; validates/extends the design produced by 3 parallel Sonnet-5 Plan agents. [SOURCE: 001-reference-research/spec.md:69-75]
- **runtime structure:** `lib/{council,coverage-graph,deep-loop}` + `scripts/` (fanout-{merge,pool,run,salvage}, convergence, query, upsert, verify-iteration, loop-lock, status, check-contract-drift, compile-command-contracts, render-command-contract). [SOURCE: ls deep-loop-runtime/lib + scripts]
- **CRITICAL coupling-mechanism finding (independent):** runtime->workflows coupling is via ABSOLUTE repo-root string paths (`'.opencode/skills/deep-loop-workflows/...'` literals in `compile-command-contracts.cjs` and `check-contract-drift.cjs`), NOT relative `require()` hops. [SOURCE: deep-loop-runtime/scripts/compile-command-contracts.cjs:15-75; check-contract-drift.cjs:40-42]. Only `artifact-root.cjs` uses a REAL relative path: `path.join(__dirname,'..','..','..','system-spec-kit','shared','review-research-paths.cjs')`. [SOURCE: deep-loop-runtime/lib/deep-loop/artifact-root.cjs:18]. Implication: a naive "add ../ everywhere because things nested deeper" pass is WRONG for the absolute-path sites (they stay valid as repo-root strings) and would silently corrupt them.
- **fallback-router.ts zero callers confirmed:** only `fallback-router.vitest.ts` and `executor-provenance-mismatch.vitest.ts` import `resolveFallback`/`createFallbackRouter`; no `.cjs` runtime script or production `.ts` path calls them. [SOURCE: rg fallback-router across .opencode/skills excluding node_modules]
- **artifact-root.cjs is the canonical tooling-borrow seam:** re-exports `resolveArtifactRoot` from system-spec-kit; runtime's own README explicitly states the single implementation stays in system-spec-kit. [SOURCE: deep-loop-runtime/lib/deep-loop/README.md:33]
- **workflows->runtime references are predominantly DOC/PROSE** (SKILL.md, README.md, feature_catalog, manual_testing_playbook, graph-metadata.json edges, description.json), not executable require() hops. Needs iteration-by-iteration verification of whether any `.cjs`/`.ts` in workflows mode packets reach into runtime via relative require. [SOURCE: rg deep-loop-runtime in deep-loop-workflows]
- resource-map.md not present; skipping coverage gate.

## Key Questions

- Q1: Is the structural layout (fold runtime into workflows as system-deep-loop) mechanically safe, and where does each component land?
- Q2: How many bidirectional path-couplings exist, what is the REAL path mechanism (absolute repo-root string vs relative require), and what breaks silently if not repaired correctly?
- Q3: How does the system-spec-kit tooling-borrow behave post-merge — net simplification or net risk transfer?
- Q4: What is the full reference-migration surface (commands/agents/READMEs/advisor-corpus) and the risk of incomplete migration?
- Q5: Should fallback-router.ts be wired for real GLM-5.2 -> MiMo-v2.5-Pro fallback?

## Non-Goals

- Executing any part of the merge (delegated to sibling children 002-005).
- Changing deep-loop workflow behavior (loop semantics, convergence math, fan-out mechanics).
- Renaming the `/deep:*` command surface or agent names.
- Full historical `.opencode/specs/**` rename (non-breaking history, left untouched).

## Stop Conditions

- All 5 key questions have evidence-backed answers, OR
- maxIterations (5) reached, OR
- 3 consecutive no-progress iterations (stuck), OR
- convergence threshold met after the minIterations floor (3).

## Answered Questions

- Q1 (iteration 1): Mechanically safe. Runtime relocates as self-contained `runtime/` subtree. THREE distinct path-repair mechanisms identified (see F1.2). spec.md:132 asymmetry confirmed.
- Q2 (iteration 2): 41 grep hits in reverse direction but only ~12 CODE sites (uniform mechanism) + 1 absolute shell-out (replay-graph-from-artifacts.cjs:26) + ~28 test-fixture/comment strings needing semantic review. Forward: ~40+ absolute-string sites + 1 relative require.
- Q3 (iteration 2): Net NEUTRAL. node_modules tooling-borrow already shipped (runtime has own node_modules). Only the artifact-root.cjs LOGIC seam remains, +1 hop post-merge. Keep the borrow, fix the hop, document the seam.
- Q4 (iteration 3): Surface = ~780+ non-history lines (commands 452, advisor 264, agents 18×2, plugins 3, ci 1). Advisor ALREADY has a merge-identity layer (aliases.ts:92-109); system-deep-loop is the SECOND fold (id-rename of MERGED_DEEP_SKILL_ID). Divergence-ledger reason strings are historical narration needing manual review (REQ-007). skill-graph.json is generated (edit sources + re-scan, don't hand-edit).
- Q5 (iteration 4): DEFER. Zero production callers repo-wide; today's failure path is same-model retry-and-salvage (fanout-pool.cjs), not model-swap. fallback-router relocates as-is with zero merge-blocking dependency and no router-contract debt. Keep optional child 004.

## What Worked

- Mechanism-classification audit (iteration 1): separating absolute-string sites from relative-require sites exposed that the plan conflates them. 8-10 file reads + targeted rg gave full coverage.
- system-spec-kit surface enumeration (iteration 2): reading vitest.config.ts + package.json test:council + the council-playbook anchor test caught the 4→9 undercount that a grep-only audit would miss.
- Reading aliases.ts module header (iteration 3): the "already merged" discovery reframed the advisor risk from build-merge to rename-id + review-narration.

## What Failed

(none yet)

## Exhausted Approaches

(none yet)

## Ruled-Out Directions

- R1.1 (iteration 1): Single mechanical find/replace across all coupling — breaks class A absolute-string sites.
- R1.2 (iteration 1): Treating reverse direction as larger per-site risk — uniform mechanism; forward single site riskier.
- R2.1 (iteration 2): Mechanism A (absolute-string) is forward-only — refuted by replay-graph-from-artifacts.cjs:26 reverse shell-out.
- R2.2 (iteration 2): "4 system-spec-kit edits suffice for REQ-003" — real surface ~9 sites/5 files.
- R3.1 (iteration 3): Advisor needs from-scratch merge-identity layer — already has one (aliases.ts:92-109).
- R3.2 (iteration 3): Hand-edit skill-graph.json — it's generated; edit sources + re-scan.
- R3.3 (iteration 3): Mechanical full-file replace on divergence ledger — corrupts historical narration, fails REQ-007.

## Next Focus

LOOP CONVERGED at iteration 4 (all 5 key questions answered; minIterations floor met; quality gates pass). Proceeding to synthesis.

## Research Boundaries

- Max iterations: 5
- Convergence threshold: 0.05
- Per-iteration budget: ~10-12 tool calls, ~10 minutes
- Progressive synthesis: true
- Min iterations floor: 3 (antiConvergence)
- Machine-owned sections: reducer/analyst updates per iteration
