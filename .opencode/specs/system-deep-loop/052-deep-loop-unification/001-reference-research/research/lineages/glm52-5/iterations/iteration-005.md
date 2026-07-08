# Iteration 005 - Consolidation, Residual Risks, And Execution Order

## Focus

Consolidate the four prior iterations into ranked revisions for children 002-004, surface residual risks, and confirm the agent/README/sibling-graph migration surface.

## Findings

1. The external-prose migration surface (child 003 Stage F/G) is confirmed broad but tractable: agent mirrors exist as REAL non-symlinked duplicates in BOTH `.opencode/agents/` and `.claude/agents/` (5 deep agents × 2 runtimes = 10 files, including `orchestrate.md`, `deep-research.md`, `deep-review.md`, `ai-council.md`, `deep-improvement.md`), the root `README.md` carries 8 deep-loop reference lines, and all 5 checked sibling `graph-metadata.json` files (system-spec-kit, system-skill-advisor, sk-code, sk-prompt, cli-opencode) carry deep-loop edges. Stage G's "collapse two edges to one where present" rule applies — these siblings currently may carry separate edges to `deep-loop-workflows` AND `deep-loop-runtime` that must collapse, not duplicate. [SOURCE: .opencode/agents/orchestrate.md] [SOURCE: .claude/agents/orchestrate.md] [SOURCE: README.md (8 hits)] [SOURCE: .opencode/skills/system-spec-kit/graph-metadata.json]

2. **Ranked revisions for child 002 (structural merge), in execution order:**
   - **R1 (Stage 3a, blocker)**: Expand Class B reverse-coupling inventory before edits — add `deep-review/scripts/reduce-state.cjs:14`, both `runtime-capabilities.cjs` shims (research + review), `deep-research/scripts/reduce-state.cjs:20` (continuity-thread, the second require), `orchestrate-session.cjs:16-18` (3 requires, separate from orchestrate-topic).
   - **R2 (Stage 3a, blocker)**: Add a THIRD repair class for `replay-graph-from-artifacts.cjs:51-66` — repo-root absolute existence-probe path construction, rewritten to probe `system-deep-loop/runtime/scripts/upsert.cjs`. Not a Class A/B relative-hop.
   - **R3 (Stage 3b, blocker)**: Add `artifact-root.cjs:18`, `artifact-root.vitest.ts`, `dependency-seams.vitest.ts` to Stage 3b (one extra `..` for the runtime→system-spec-kit reach).
   - **R4 (Stage 3b, quality)**: Add a non-empty-match assertion on the `vitest.config.ts:20` include glob after the move, to catch silent `test:council` test-set shrink.
   - **R5 (Class A, completeness)**: Correct the "7 test files" count to 10, and explicitly flag `deep-research-convergence-floor.vitest.ts:20-28` (hardcodes the old skill path AND is the REQ-002 floor enforcer). [SOURCE: 002-hub-rename-and-runtime-nesting/plan.md:76,80-99]

3. **Ranked revisions for child 003 (reference migration):**
   - **R6 (Stage I, blocker)**: Update divergence-ledger `reason` PROSE together with `nativeTop`/`localTop` fields per entry — `local-native-approved-divergences.json:31` embeds the old name in the rationale text.
   - **R7 (Stage F/J, decision)**: Make an EXPLICIT naming decision for `deep-improvement/assets/non_dev_ai_system/profiles/deep-loop-runtime.json` (filename + `packaging_root` + `system_name_short` + `meta-loop-lane-d-packaging.vitest.ts:15` assertion together). Blind grep-update leaves the filename stale while internal fields rename.
   - **R8 (Stage J, allowlist)**: Add council test fixtures (`persist-artifacts.vitest.ts`, `findings-registry.vitest.ts`, `orchestrate-topic.vitest.ts`) to the residual-grep allowlist — their `deep-loop-runtime` hits are semantic test data, not skill-location references. [SOURCE: 003-external-reference-migration/plan.md:66-67,101-106]

4. **Ranked revisions for child 004 (fallback wiring):**
   - **R9 (blocker)**: Extend `classifyLineageFailure` (cli-guards.cjs:169-200) with a fallback-eligible class for quota/auth/429, else the single-call-site wiring is unreachable for the GLM-quota failure it targets.
   - **R10 (blocker)**: Add a slug→bare-id normalizer (`zai-coding-plan/glm-5.2` → `glm-5.2`) before `resolveFallback`, else the failed slug does not match the registry id.
   - **R11 (quality)**: Extend the forced-failure integration test to cover quota-exhaustion, not only timeout/artifact-miss. [SOURCE: 004-fallback-router-wiring/plan.md:90-94]

5. **Cross-cutting residual risk: detached fan-out `spec.md` write-back (F-P0-001) must be resolved before this very kind of research fan-out is re-run.** Today it is safe only because each lineage's invocation prompt (and operator discipline) defers `spec.md` mutation; the YAML itself does not gate it. If the gap is not patched, a future fan-out whose executor follows the YAML literally will race on `{spec_folder}/spec.md`. This is independent of children 002-004 but should be tracked as a deep-loop-runtime tooling fix. [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:131-137,376-419,1511-1533]

## Ruled Out

- Renaming `/deep:*` commands or public agent names — child 003's own decision (skill identity changes, public command/agent surfaces stay stable). Confirmed: command/agent names are the stable surface, only skill-internal identity moves.
- Auto-wiring fallback without an explicit approved-target policy — `resolveFallback` rejects unapproved substitutions by design; the policy must be authored, not inferred.

## Convergence

All five key questions now have evidence-backed answers from diverse source families (commands, skills/runtime, specs, advisor, model registry, council tests). Novelty has declined monotonically (0.80 → 0.66 → 0.48 → 0.34 → ~0.14 consolidation), and this iteration primarily re-ranked prior findings rather than discovering new evidence. Ready for synthesis.
