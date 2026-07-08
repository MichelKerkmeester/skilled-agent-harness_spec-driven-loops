# Deep Research Strategy — glm52-5 Lineage

## Research Topic

Validate and stress-test the merge design for folding `deep-loop-runtime` into `deep-loop-workflows` as `system-deep-loop`: structural layout, bidirectional path-coupling repair, the `system-spec-kit` tooling-borrow, reference migration across commands/agents/READMEs/advisor-corpus, and whether `fallback-router.ts` should be wired for real GLM-5.2 to MiMo-v2.5-Pro fallback.

## Known Context

- **Two skills today:** `deep-loop-workflows` (hub, advisor-routable, 7 workflow modes; 3 graph-backed: research/review/council, plus 4 improvement/benchmark lanes) consumes `deep-loop-runtime` (frozen backend, MCP-free, owns the convergence/council/state reducers). [SOURCE: .opencode/skills/deep-loop-workflows/mode-registry.json:29-197]
- **Merge target (child 002):** fold `deep-loop-runtime` INTO `deep-loop-workflows`, rename the result to `system-deep-loop`, nest runtime as `system-deep-loop/runtime/`. [SOURCE: 002-hub-rename-and-runtime-nesting/plan.md:118-122]
- **This phase is strictly read-only** — no merge execution; this research independently stress-tests the design produced by 3 parallel Sonnet-5 Plan agents. [SOURCE: spec.md:69-75]
- **Detached fan-out boundary:** this lineage writes ONLY inside `research/lineages/glm52-5/`; `{spec_folder}/spec.md` mutation and memory save are deferred to the parent fan-out merge. [SOURCE: task invocation; gpt55-fast-2 precedent emitted `spec_synthesis_deferred`]
- **artifact-root.cjs re-export seam confirmed:** `deep-loop-runtime/lib/deep-loop/artifact-root.cjs` re-exports from `../../../system-spec-kit/shared/review-research-paths.cjs`. After nesting (runtime moves one level deeper) this needs one more `..`. [SOURCE: artifact-root.cjs:17-18]
- **reverse-coupling surface (workflows → runtime) confirmed broad:** `deep-review/scripts/reduce-state.cjs`, `deep-research/scripts/reduce-state.cjs` (2 requires), `runtime-capabilities.cjs` shims in both research and review, `deep-ai-council/scripts/orchestrate-{topic,session}.cjs` (8 requires), `replay-graph-from-artifacts.cjs` (repo-root absolute paths), `deep-improvement/scripts/shared/{improvement-journal,reduce-state}.cjs`, plus 6 council test files at 4-up depth. [SOURCE: grep across .opencode/skills/deep-loop-workflows]
- **forward-coupling surface (runtime → workflows) confirmed large:** `compile-command-contracts.cjs` carries ~44 absolute-path literals; `check-contract-drift.cjs` SHARED_AUTHORITY_SOURCES; `fanout-run.cjs:942-943`; `render-command-contract.cjs:11` relative require; 10 runtime test files reference `deep-loop-workflows` (plan says "7"). [SOURCE: grep across .opencode/skills/deep-loop-runtime]
- **fallback-router.ts has ZERO production callers:** only its own definition + tests import it; `fanout-pool.cjs` uses same-model `maxRetries` + `classifyLineageFailure`, which marks non-timeout exits FATAL (not retryable, no fallback branch). [SOURCE: grep; cli-guards.cjs:169-200; fanout-pool.cjs:628-651]
- resource-map.md not present; skipping coverage gate.

## Key Questions

- Q1: Is the structural layout (fold runtime into workflows as system-deep-loop) mechanically safe, and where does each component land?
- Q2: How many bidirectional path-couplings exist, and what breaks silently if not fully repaired?
- Q3: How does the system-spec-kit tooling-borrow behave post-merge — net simplification or net risk transfer?
- Q4: What is the full reference-migration surface, and what is the risk of incomplete migration (advisor corpus, test literals, named profile files)?
- Q5: Should fallback-router.ts be wired for real GLM-5.2 -> MiMo-v2.5-Pro fallback?

## Answered Questions

- Q1 (iter 1): Layout sound; `runtime/` stays infrastructure, not an eighth mode.
- Q2 (iter 2): Directional rule correct; inventory incomplete + a third repair class exists.
- Q3 (iter 3): Four Stage 3b edits necessary; add artifact-root depth + non-empty-glob assertion.
- Q4 (iter 3): Category-scoped rewrite right; add reason-prose, named-profile decision, test-fixture allowlist.
- Q5 (iter 4): Worth wiring only as a three-part change; single call site unreachable for quota/auth.

## What Worked

- Direct `rg` inventories of executable surfaces (`*.cjs`/`*.ts`) gave exact line-level evidence that prose plans under-specify.
- Reading the convergence-floor test revealed a load-bearing path dependency the plan's "7 files" understates.
- Classifying repair sites by MECHANISM (relative-hop vs repo-root absolute probe) surfaced the third repair class.

## What Failed

- Counting on the plan's Class A/B tables to be complete — both understated the executable surface.

## Exhausted Approaches

- Trusting static prose-plan inventories as exhaustive; always re-derive from a live executable-surface grep.

## Ruled-Out Directions

- runtime/ as a mode-registry entry; per-replica spec.md writeback; replay-graph as Class B; global find/replace in council tests; decoupling runtime TS tooling during merge; dynamic mode-registry reads on advisor hot path; naive single-call-site fallback; same-provider cross-pool fallback; renaming /deep:* commands or public agent names.

## Non-Goals

- Do NOT execute any part of the merge (delegated to children 002-005).
- Do NOT modify any source path; read-only investigation only.
- Do NOT write outside this lineage directory.

## Stop Conditions

- All 5 key questions have evidence-backed answers, OR maxIterations (5) reached, whichever comes first.
- Convergence floor of 3 evidence iterations honored before any legal stop.

## Next Focus

COMPLETE. Synthesis written to `research.md`; stop reason `maxIterationsReached` with all 5 key questions answered. Eleven ranked revisions (R1-R11) and two genuinely new risks delivered.
