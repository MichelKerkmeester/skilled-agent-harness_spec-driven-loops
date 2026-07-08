# Deep Research Strategy — glm52-1 Lineage

## Research Topic

Validate and stress-test the merge design for folding `deep-loop-runtime` into `deep-loop-workflows` as `system-deep-loop`: structural layout, bidirectional path-coupling repair, the `system-spec-kit` tooling-borrow, reference migration across commands/agents/READMEs/advisor-corpus, and whether `fallback-router.ts` should be wired for real GLM-5.2 to MiMo-v2.5-Pro fallback.

## Known Context

- **Two skills today:** `deep-loop-workflows` (hub, advisor-routable, 4 active workflow families: research/review/ai-council/improvement) consumes `deep-loop-runtime` (frozen, MCP-free backend). [SOURCE: .opencode/skills/deep-loop-workflows/SKILL.md:12]
- **Merge target:** fold the runtime INTO the workflows skill, renaming the result to `system-deep-loop`. [SOURCE: spec.md:57]
- **This phase is strictly read-only** — no merge execution; this research validates/extends the design produced by 3 parallel Sonnet-5 Plan agents. [SOURCE: spec.md:69-75]
- **Bidirectional coupling confirmed:** `deep-loop-workflows/deep-ai-council/scripts/orchestrate-*.cjs` require `../../../deep-loop-runtime/lib/council/*.cjs` (5+ seam files). [SOURCE: grep hits]
- **fallback-router.ts zero callers:** Only tests (`fallback-router.vitest.ts`, `executor-provenance-mismatch.vitest.ts`) and docs import it; no `.cjs` runtime script or production `.ts` path calls `resolveFallback`/`createFallbackRouter`. [SOURCE: grep across .opencode/skills; spec.md:124]
- **artifact-root.cjs is a re-export seam:** `deep-loop-runtime/lib/deep-loop/artifact-root.cjs` re-exports from `../../../system-spec-kit/shared/review-research-paths.cjs`. [SOURCE: artifact-root.cjs:17-18]
- **node_modules borrow:** runtime reaches into system-spec-kit's internal node_modules for zod/better-sqlite3/tsx (8+ reach-ins). [SOURCE: 117-improvement-research findings]
- **Commands invoke runtime scripts:** `deep/{research,review,ai-council}.md` shell out to `deep-loop-runtime/scripts/render-command-contract.cjs`. [SOURCE: .opencode/commands/deep/*.md]
- resource-map.md not present; skipping coverage gate.

## Key Questions

- Q1: Is the structural layout (fold runtime into workflows as system-deep-loop) mechanically safe, and where does each component land?
- Q2: How many bidirectional path-couplings exist between the two skills, and what breaks silently if not repaired?
- Q3: How does the system-spec-kit tooling-borrow behave post-merge — net simplification or net risk transfer?
- Q4: What is the full reference-migration surface and the risk of incomplete migration?
- Q5: Should fallback-router.ts be wired for real GLM-5.2 -> MiMo-v2.5-Pro fallback?

## Answered Questions

- Q1: ANSWERED (iter 1). Merge is mechanically safe IF nesting depth preserved. Runtime carries own node_modules/package.json/tsconfig as a unit; system-spec-kit path coupling is depth-invariant; no orphaned entry points. mode-registry.json + 3 command entry points are the rename keystones.
- Q2: ANSWERED (iter 2). 14 relative requires (workflows->runtime) break LOUDLY; 50 string literals (runtime->workflows in compile-command-contracts.cjs) break SILENTLY — these are the real risk. check-contract-drift.cjs is the built-in migration gate.
- Q3: ANSWERED (iter 3). system-spec-kit coupling is NEUTRAL to merge (3 depth-invariant intentional seams: artifact-root re-export, tsc borrow, contract refs). Merge is net simplification on workflows<->runtime axis (15 requires + 50 literals become intra-skill). Do NOT inline review-research-paths.cjs.
- Q4: ANSWERED (iter 4). 6 migration tiers by loudness. Advisor corpus is highest-risk (MERGED_DEEP_SKILL_ID propagates to ~40 routing entries; coupled-pair atomic migration gated by drift-guard). .claude/agents mirror is silent-migration trap. 2 automated guards (advisor drift-guard + check-contract-drift) bound risk; ungated prose needs grep pass.
- Q5: ANSWERED (iter 5). Do NOT wire fallback-router during merge. Zero callers confirmed; wiring is 4-piece feature out of scope for read-only phase; approval-guard would reject unapproved MiMo swaps. Preserve router, track as post-merge follow-up.

## What Worked

- Enumerating actual import styles (bare specifiers vs reach-ins) corrected a stale assumption from 117-research before it propagated.
- Separating requires (loud) from string literals (silent) surfaced the real risk class.
- Treating system-spec-kit coupling as a separate axis from workflows<->runtime produced a clear two-axis verdict.
- Ranking migration tiers by breakage loudness separated gating constraints from cosmetic prose.
- Decomposing "should we wire fallback-router" into cost + scope + merge-calculus + approval-guard semantics.

## What Failed

- ripgrep `-o` flag with custom type-add produced help text; recovered with Grep tool.

## Exhausted Approaches

(none — all 5 questions answered)

## Ruled-Out Directions

- Resolve 8 system-spec-kit node_modules reach-ins as part of merge: ALREADY RESOLVED. [package.json:1-25; executor-config.ts:5]
- Direction A (14 requires) as the primary merge risk: Loud MODULE_NOT_FOUND; 50 silent string literals are the real exposure. [compile-command-contracts.cjs:15-288]
- Inline review-research-paths.cjs into system-deep-loop during merge: Intentional single-source seam; duplicating reintroduces drift. [artifact-root.cjs:5-9]
- Migration is uniform across all surfaces: Tiered (2 automated guards + ungated prose). [mode-registry.json:16; aliases.ts:109]
- Wire fallback-router during the merge: Out of scope + moving-target + approval-guard rejects unapproved swaps. [spec.md:69-75; fallback-router.ts:411-420]

## Next Focus

All 5 key questions answered with evidence. CONVERGED — proceed to synthesis.
