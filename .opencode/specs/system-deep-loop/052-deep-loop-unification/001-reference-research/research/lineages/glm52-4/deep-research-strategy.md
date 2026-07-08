# Deep Research Strategy — glm52-4 Lineage

## Research Topic

Validate and stress-test the merge design for folding `deep-loop-runtime` into `deep-loop-workflows` as `system-deep-loop`: structural layout, bidirectional path-coupling repair, the `system-spec-kit` tooling-borrow, reference migration across commands/agents/READMEs/advisor-corpus, and whether `fallback-router.ts` should be wired for real GLM-5.2 to MiMo-v2.5-Pro fallback.

## Known Context

- **Two skills today:** `deep-loop-workflows` (advisor-routable hub; 4 active mode packets: deep-research / deep-review / deep-ai-council / deep-improvement) consumes `deep-loop-runtime` (frozen backend; lib/{deep-loop,council,coverage-graph}, scripts/, tests/). [SOURCE: .opencode/skills/deep-loop-workflows/SKILL.md:12] [SOURCE: ls deep-loop-runtime/]
- **Merge target (child 002):** `git mv deep-loop-workflows system-deep-loop` then `git mv deep-loop-runtime system-deep-loop/runtime`; delete `runtime/graph-metadata.json`; demote `runtime/SKILL.md` to README; fresh-author a single hub graph-metadata; bump version `2.0.0.0`. [SOURCE: 002/plan.md Phase 2]
- **This phase is strictly read-only** — no merge execution; research validates/extends the 3-Sonnet-5-Plan-agent design. [SOURCE: spec.md:69-75]
- **Reverse coupling (workflows → runtime):** 23 `require()` hits across 7 executable files + 4 council test files. Two depth tiers: `scripts/` = 3 hops (`../../../deep-loop-runtime`), `scripts/{tests,shared}/` = 4 hops. [SOURCE: rg require deep-loop-runtime in deep-loop-workflows]
- **Forward coupling (runtime → workflows):** single live seam `render-command-contract.cjs:11` → `../../deep-loop-workflows/shared/rollout/resolve-injection-mode.cjs`; plus 7 runtime test files and `compile-command-contracts.cjs`/`check-contract-drift.cjs`/`fanout-run.cjs` literals. [SOURCE: rg require deep-loop-workflows in deep-loop-runtime]
- **system-spec-kit tooling borrow:** runtime `package.json` typecheck → `../system-spec-kit/node_modules/.bin/tsc`; `tsconfig.json` typeRoots → `../system-spec-kit/node_modules/@types`. Both are 1-hop relative; nesting adds one level so both need +1 `..`. [SOURCE: deep-loop-runtime/package.json:14] [SOURCE: deep-loop-runtime/tsconfig.json:13-15]
- **artifact-root.cjs internal seam:** `lib/deep-loop/artifact-root.cjs` re-exports via `path.join(__dirname,'..','..','..','system-spec-kit',...)` (3 hops). After nesting under `system-deep-loop/runtime/lib/deep-loop`, reaching sibling `system-spec-kit` needs 4 hops — one more `..`. The 002 Stage-3b table lists package.json/tsconfig but NOT artifact-root.cjs's own internal path. [SOURCE: artifact-root.cjs:17-18] [SOURCE: 002/plan.md tooling-borrow table]
- **fallback-router.ts zero production callers:** `resolveFallback`/`createFallbackRouter` referenced only by tests (`fallback-router.vitest.ts`, `executor-provenance-mismatch.vitest.ts`) and docs (READMEs/feature_catalog/playbook). `fanout-pool.cjs` does not import it. [SOURCE: rg fallback-router across skills]
- **fanout failure classification:** `classifyLineageFailure` marks only TIMEOUT/SALVAGE_MISS/ARTIFACT_MISS retryable; non-timeout CLI exits are FATAL and never reach a fallback branch. [SOURCE: cli-guards.cjs:169-199]
- **model-id mismatch:** registry id is `glm-5.2` / `mimo-v2.5-pro` but fan-out dispatches provider slugs `zai-coding-plan/glm-5.2` / `xiaomi-token-plan-ams/mimo-v2.5-pro`; both have `fallback_target: null` and separate quota pools. [SOURCE: model_profiles.json:190-299]
- **advisor hardcoding:** `skill_advisor.py:83` `MODE_REGISTRY_PATH = SKILLS_DIR/deep-loop-workflows/mode-registry.json`; `:2579` `MERGED_DEEP_SKILL_ID = "deep-loop-workflows"`; embedded routing projection + divergence-ledger rows store the old identity. [SOURCE: skill_advisor.py grep]
- resource-map.md not present; skipping coverage gate.

## Key Questions

- Q1: Is the structural layout (fold runtime into workflows as system-deep-loop) mechanically safe, and where does each component land?
- Q2: How many bidirectional path-couplings exist between the two skills, and what breaks silently if not repaired?
- Q3: How does the system-spec-kit tooling-borrow behave post-merge — is it a complete repair or does artifact-root.cjs slip through?
- Q4: What is the full reference-migration surface (commands/agents/READMEs/advisor-corpus), and what is the risk of incomplete migration?
- Q5: Should fallback-router.ts be wired for real GLM-5.2 -> MiMo-v2.5-Pro fallback?

## Answered Questions

- Q1 (structural layout): SOUND. Fold runtime in as nested infrastructure; do NOT add a runtime workflowMode. Fresh-author one hub graph-metadata; collapse runtime↔workflows edges to intra-skill structure.
- Q2 (path coupling): RULES CORRECT, INVENTORY INCOMPLETE. Class A/B directional rules verified by path arithmetic, but Class B table omits orchestrate-session.cjs + both runtime-capabilities.cjs + deep-review/reduce-state.cjs, and replay-graph-from-artifacts.cjs uses an absolute-path form invisible to relative-require grep.
- Q3 (tooling borrow): Stage-3b package.json/tsconfig repairs are correct, but artifact-root.cjs's OWN internal path.join (+2 test companions) is a missed P0 load-bearing seam.
- Q4 (reference migration): Surface is broad but bounded (33 commands + dual-runtime agents + 4 READMEs). Advisor is highest-risk — does not read registry at runtime, so rename = regenerate projection maps + update 3 hardcoded constants + re-approve divergence-ledger identity fields (not prose) through the ratchet.
- Q5 (fallback wiring): WIRE IT (optional), but 004 plan needs a slug→id model adapter + failure-class capture for quota/auth. Router is ready to reuse as-is; same-pool guard satisfied for glm→mimo. Independent of the structural merge (correctly P2).

## What Worked

- Three-tier mode-registry discriminator cleanly justifies keeping runtime as infrastructure, not a mode.
- `step_resolve_artifact_root` fanout branch proves the YAML *can* branch on `config.fanout_lineage_artifact_dir`; the same guard pattern can fix the spec.md steps.

## What Failed

- Trusting that artifact_dir override implies spec.md override — it does not; the guard is one-sided.

## Exhausted Approaches

- All 5 key questions answered; no remaining investigative thread.

## Ruled-Out Directions

- Do not add `runtime` as a mode-registry `workflowMode`.
- Do not let detached replicas mutate shared `{spec_folder}/spec.md`.
- Do not assume relative-require grep is a complete Stage-3a checklist (misses absolute-path forms).
- Do not point the advisor hot path at `mode-registry.json` dynamically.
- Do not blind-replace across the divergence ledger (corrupts reason prose).
- Do not wire fallback without a slug→id normalizer and quota/auth failure-class capture.

## Next Focus

CONVERGED. All 5 key questions answered. Proceed to phase_synthesis (research.md, resource-map.md, dashboard.md).
