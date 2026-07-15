# Research Synthesis - glm52-5

## 1. Executive Summary

This GLM-5.2 lineage validates the `system-deep-loop/` merge direction as sound, and independently confirms the core of the three Sonnet-5 Plan agents' design. It surfaces ten ranked, evidence-backed revisions (R1-R10) plus two genuinely new risks the plan does not cover:

1. **NEW — a third path-repair class**: `replay-graph-from-artifacts.cjs` builds repo-root absolute paths via an existence probe, which neither Class A (same-hop delete segment) nor Class B (minus-one-hop rename) models. It breaks silently (repo-root detection fails, returned path points nowhere) rather than crashing.
2. **NEW — the fallback-router wiring is unreachable for the exact failure it targets**: `classifyLineageFailure` routes quota/auth failures to FATAL before retry exhaustion, so a naive single-call-site `resolveFallback()` never fires for GLM quota-out.

The structural concept is correct: `deep-loop-workflows` becomes `system-deep-loop`, `deep-loop-runtime` becomes nested `runtime/`, public `/deep:*` command and agent names stay stable, and `runtime/` stays infrastructure (not a seventh mode).

## 2. Research Scope

Scope covered: structural layout, bidirectional path coupling, the `system-spec-kit` tooling-borrow, external reference migration (commands/agents/READMEs/advisor-corpus/sibling-graphs/test-fixtures), and fallback-router wiring feasibility for GLM-5.2 → MiMo-v2.5-Pro.

Out of scope: executing any part of the merge, editing any source path, or writing outside this lineage directory. `{spec_folder}/spec.md` mutation and memory save were deferred (detached fan-out boundary).

## 3. Method

Five evidence iterations using direct source reads and scoped `rg` inventories. Each iteration focused on one key question and cited concrete file:line evidence. The loop ran to the 5-iteration cap (`maxIterationsReached`) with all five key questions answered; novelty declined monotonically (0.80 → 0.66 → 0.48 → 0.34 → 0.14).

## 4. Key Question Coverage

| Question | Status | Answer |
|---|---|---|
| Q1 Structural layout | Answered | Sound if `runtime/` remains infrastructure, not a workflow mode. |
| Q2 Path coupling | Answered | Directional rule correct, but inventory misses 4+ relative-hop seams AND a distinct third repair class. |
| Q3 Tooling-borrow | Answered | Four Stage 3b edits necessary and correctly scoped; add artifact-root depth + a non-empty-glob assertion. |
| Q4 Reference migration | Answered | Category-scoped rewrite is right; add divergence-reason prose and test-fixture allowlist. |
| Q5 Fallback wiring | Answered | Worth wiring only as a three-part change; a single call site is unreachable for quota/auth. |

## 5. Ranked Findings

### F-P0-001 - Detached Fan-Out Lineage Boundary Conflicts With YAML `spec.md` Mutation

`deep_research_auto.yaml:131` branches on `config.fanout_lineage_artifact_dir` to bind `artifact_dir`/roots to the lineage directory, but the pre-init `spec.md` branch (lines 376-419) and the post-synthesis generated-findings writeback (lines 1511-1533) have NO equivalent fan-out branch. A detached executor following the YAML literally mutates the shared `{spec_folder}/spec.md` from N concurrent replicas. This lineage deferred those steps (per its invocation boundary), but the gap is real. [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:131-137] [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:376-419] [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:1511-1533]

Recommendation: when `config.fanout_lineage_artifact_dir` is present, emit `spec_synthesis_deferred` and skip both pre-init and post-synthesis `spec.md` mutation. Parent fan-out merge owns writeback. Track as a deep-loop-runtime tooling fix independent of children 002-004.

### F-P1-001 - Convergence-Floor Test Hardcodes Old Skill Name (Enforces REQ-002)

`deep-research-convergence-floor.vitest.ts:20-28` resolves `repoRoot/skills/deep-loop-workflows/deep-research/assets/deep_research_config.json` — this is the test that enforces the `minIterations: 3` floor this phase's spec.md REQ-002 relies on. After rename it reads a non-existent path and fails. Child 002's Class A list says "7 test files"; the real count is 9, and this load-bearing test is un-enumerated. [SOURCE: .opencode/skills/deep-loop-runtime/tests/unit/deep-research-convergence-floor.vitest.ts:19-29] [SOURCE: 002-hub-rename-and-runtime-nesting/plan.md:76]

### F-P1-002 - Class B Reverse-Coupling Inventory Is Incomplete

The table omits `deep-review/scripts/reduce-state.cjs:14`, both `runtime-capabilities.cjs` shims (research + review, 3-ups each), and the SECOND require in `deep-research/scripts/reduce-state.cjs:20` (`continuity-thread.cjs`). It also lists only `orchestrate-topic.cjs`; `orchestrate-session.cjs:16-18` is a separate file with 3 of its own requires. [SOURCE: .opencode/skills/deep-loop-workflows/deep-review/scripts/reduce-state.cjs:14] [SOURCE: .opencode/skills/deep-loop-workflows/deep-ai-council/scripts/orchestrate-session.cjs:16-18]

### F-P1-003 - Third Path-Repair Class: Repo-Root Absolute Existence-Probe

`replay-graph-from-artifacts.cjs:51-66` is NOT a relative-hop site. `findRepoRoot()` probes `fs.existsSync(path.join(current,'.opencode','skills','deep-loop-runtime','scripts','upsert.cjs'))` (line 56) and `runtimeUpsertScript()` returns that absolute path (line 65). After rename, the probe never matches → repo-root detection silently fails and the returned script path points nowhere. Needs its own inventory row rewritten to probe `system-deep-loop/runtime/scripts/upsert.cjs`. [SOURCE: .opencode/skills/deep-loop-workflows/deep-ai-council/scripts/replay-graph-from-artifacts.cjs:51-66]

### F-P1-004 - Council Test Fixtures Are Semantic Data, Not Path References

`persist-artifacts.vitest.ts:60`, `findings-registry.vitest.ts:43`, `orchestrate-topic.vitest.ts:28,131` embed `deep-loop-runtime` as council-domain test data ("extend-deep-loop-runtime" recommendation strings), not skill-location references. Blind residual-grep replacement corrupts test semantics. Add to the Stage J residual-grep allowlist. [SOURCE: .opencode/skills/deep-loop-workflows/deep-ai-council/scripts/tests/persist-artifacts.vitest.ts:60]

### F-P1-005 - `test:council` Include Glob Can Silently Shrink

`vitest.config.ts:20` is the sole gate pulling runtime tests into system-spec-kit's council suite. An off-by-one in the new `../system-deep-loop/runtime/tests/**` path matches zero tests with a green exit. Stage 3b must assert the glob matches a non-empty set after the move. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/vitest.config.ts:18-21]

### F-P1-006 - Divergence-Ledger `reason` Prose Embeds Old Name

`local-native-approved-divergences.json:30-31` pairs `nativeTop:"deep-loop-workflows"` with a free-text `reason` that names the old skill. Stage I must update `nativeTop`/`localTop`/`reason`/`approvedAt` TOGETHER per entry; updating only the structured field leaves the rationale contradicting the value. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/tests/parity/fixtures/local-native-approved-divergences.json:30-31]

### F-P1-008 - `classifyLineageFailure` Makes Fallback Unreachable For Quota/Auth

`cli-guards.cjs:169-200` marks only `timeout`/`salvage_miss`/`artifact_miss` retryable; quota/auth/429 exits are `EXIT`→`FATAL`→not retried, so they never reach the retry-exhaustion point where child 004 proposes to call `resolveFallback`. The GLM-quota failure mode — the exact case the fallback is meant to heal — is therefore unreachable. [SOURCE: .opencode/skills/deep-loop-runtime/scripts/lib/cli-guards.cjs:169-200]

### F-P1-009 - Registry Id vs Provider Slug Mismatch Needs Normalizer

`resolveFallback(failedModelId,...)` keys on the registry bare id (`glm-5.2`), but fan-out dispatches provider slugs (`zai-coding-plan/glm-5.2`). Without a slug→bare-id normalizer, the failed slug does not match the registry and fallback resolves to `fail-fast`. [SOURCE: .opencode/skills/sk-prompt-models/assets/model_profiles.json:190] [SOURCE: .opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts:337-431]

### F-P1-010 - External-Prose Surface Breadth Confirmed (Agents/README/Sibling-Graphs)

5 deep agents exist as real non-symlinked duplicates across `.opencode/agents/` AND `.claude/agents/` (10 files), the root README carries 8 deep-loop lines, and all 5 checked sibling `graph-metadata.json` files carry deep-loop edges. Stage G's "collapse two edges to one where present" applies to avoid duplicate edges post-merge. [SOURCE: .opencode/agents/orchestrate.md] [SOURCE: .claude/agents/orchestrate.md] [SOURCE: .opencode/skills/system-spec-kit/graph-metadata.json]

## 6. Structural Layout Assessment

Sound. `system-deep-loop/` owns public routing and mode packets; `runtime/` is nested infrastructure with no `graph-metadata.json` of its own. The mode registry's three-tier discriminator (`workflowMode`/`runtimeLoopType`/`backendKind`) already models the runtime as backend-only — only research/review/council carry a non-null `runtimeLoopType`; the three remaining improvement lanes stay host/external-adapter backed. No seventh runtime mode should be added. [SOURCE: .opencode/skills/deep-loop-workflows/mode-registry.json:5-27] [SOURCE: .opencode/skills/deep-loop-workflows/mode-registry.json:29-197]

## 7. Path-Coupling Assessment

The Class A forward rule (same hop count, delete old segment) and Class B reverse rule (minus one hop, rename segment) are correct for relative-hop requires. But two corrections are needed: the Class B inventory is incomplete (F-P1-002), and a third repair class exists for repo-root absolute existence-probe construction (F-P1-003).

| Class | Rule | Status |
|---|---|---|
| Forward (runtime → workflows) | Same hops, delete `deep-loop-workflows` segment / rename to `system-deep-loop` | Correct; test-file count understated (7→10). |
| Reverse (workflows → runtime) | Minus one hop, rename segment to `runtime` | Correct rule, incomplete inventory. |
| Runtime → system-spec-kit | Add one hop (runtime nests one level deeper) | Missing `artifact-root.cjs` + tests from plan. |
| Repo-root absolute (existence-probe) | Rewrite probe target to `system-deep-loop/runtime/...` | NEW class; not modeled by A/B. |

## 8. Tooling-Borrow Assessment

The four Stage 3b edits are necessary and correctly placed in child 002 (they gate physical-move validation). Add `artifact-root.cjs` + its two tests to the same stage (runtime→system-spec-kit reach family), and add a non-empty-match assertion on the `test:council` include glob (F-P1-005). Decoupling runtime's TS tooling from system-spec-kit stays out of scope, per child 002's own decision — bundling it would make a merge failure and a decoupling failure indistinguishable. [SOURCE: .opencode/skills/deep-loop-runtime/lib/deep-loop/artifact-root.cjs:17-18] [SOURCE: 002-hub-rename-and-runtime-nesting/plan.md:90-99]

## 9. External Migration Assessment

Child 003's dependency-ordered staging (hardcoded constants → structured fields + codegen → command contracts → prose → sibling graphs → grandfather examples → advisor corpus → exit gate) is the right shape. Category-scoped grep bracketing (never global find/replace) is essential: council test fixtures are semantic data (F-P1-004), and the divergence-ledger reason prose must move with its structured fields (F-P1-006). Do NOT rename `/deep:*` commands or public agent names — only skill-internal identity moves. [SOURCE: 003-external-reference-migration/plan.md:66-106]

## 10. Advisor Corpus Assessment

High risk, correctly guarded. The advisor hot path does NOT read `mode-registry.json` at runtime; it uses generated/hardcoded projection maps (intentional cross-skill-import-coupling avoidance). Migration must re-run the projection emitter and let the drift-guard assert maps == registry projection, then re-baseline routing accuracy. Renaming the registry `skill` field without re-emitting makes the drift-guard fail loudly — the desired behavior. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:83] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts:26]

## 11. Recommendations

Ten ranked revisions (R1-R10), grouped by child:

**Child 002 (structural):** R1 expand Class B inventory · R2 add third repair class (replay-graph) · R3 add artifact-root to Stage 3b · R4 non-empty-glob assertion · R5 correct test-file count to 9, flag the convergence-floor test.

**Child 003 (references):** R6 update divergence `reason` prose with fields · R7 council test-fixture residual-grep allowlist.

**Child 004 (fallback):** R8 extend `classifyLineageFailure` for quota/auth · R9 slug→bare-id normalizer · R10 quota-exhaustion forced-failure integration test.

## 12. Eliminated Alternatives

| Approach | Reason Eliminated | Evidence |
|---|---|---|
| `runtime/` as a mode-registry entry | Category error; blurs backend infra with public workflow modes | mode-registry.json:5-27 |
| Per-replica `spec.md` writeback in fan-out | N replicas race on the same generated fence | deep_research_auto.yaml:1511-1533 |
| `replay-graph` as a Class B relative-hop site | Uses repo-root absolute existence-probe path construction | replay-graph-from-artifacts.cjs:51-66 |
| Global find/replace of `deep-loop-runtime` in council tests | Hits are semantic test data, not skill-location references | persist-artifacts.vitest.ts:60 |
| Decoupling runtime TS tooling during the merge | Merge failure and decoupling failure indistinguishable | 002 plan.md:99 |
| Dynamic mode-registry reads on advisor hot path | Intentional cross-skill-import-coupling avoidance | mode-registry.json:4 |
| Naive single-call-site fallback wiring | Unreachable for quota/auth; FATAL before retry exhaustion | cli-guards.cjs:169-200 |
| Same-provider cross-pool fallback | fallback-router rejects same-pool by graph validation | fallback-router.ts:337-431 |
| Renaming `/deep:*` commands or public agent names | Skill identity changes; public surfaces stay stable | 003 spec.md |

## 13. Open Questions

No blocking open questions remain for this lineage. Two operator decisions remain downstream:

1. Resolve F-P0-001 (gate YAML `spec.md` mutation on `fanout_lineage_artifact_dir`) before rerunning this kind of research fan-out, or accept operator-mediated deferral per-replica.

## 14. Validation Recommendations

After child 002:
1. `npm test` + `npm run typecheck` from nested `runtime/` (tolerate the known flake).
2. `npm run test:council` in `system-spec-kit/mcp_server/` AND assert the glob matched a non-empty test set.
3. `find system-deep-loop -iname graph-metadata.json | wc -l` == 1.
4. A live `/deep:research` or `/deep:review` short run confirming `replay-graph-from-artifacts.cjs`'s existence probe resolves and reverse `require()`s load. [SOURCE: 002-hub-rename-and-runtime-nesting/plan.md:124-131]

After child 003:
1. Residual reference grep with an explicit allowlist (council test fixtures).
2. `parent-skill-check.cjs` self-check.
3. Advisor projection regeneration + drift-guard.
4. Routing-accuracy re-baseline vs Stage-A baseline.
5. Agent-mirror sync check across both runtime directories.

After child 004 (if scoped in):
1. Forced-failure integration test covering BOTH timeout/artifact-miss AND quota-exhaustion classes.

## 15. Fan-Out Boundary Notes

This lineage wrote only inside `research/lineages/glm52-5/`. The workflow `spec.md` pre-init and writeback steps were recorded as `spec_synthesis_deferred` because the detached fan-out prompt forbids writes outside the artifact directory. No memory save was performed; the parent fan-out merge owns canonical continuity.

## 16. References

- `.opencode/commands/deep/assets/deep_research_auto.yaml`
- `.opencode/skills/deep-loop-workflows/mode-registry.json`
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/artifact-root.cjs`
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts`
- `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs`
- `.opencode/skills/deep-loop-runtime/scripts/lib/cli-guards.cjs`
- `.opencode/skills/deep-loop-runtime/tests/unit/deep-research-convergence-floor.vitest.ts`
- `.opencode/skills/deep-loop-workflows/deep-ai-council/scripts/replay-graph-from-artifacts.cjs`
- `.opencode/skills/system-spec-kit/mcp_server/{package.json,vitest.config.ts}`
- `.opencode/skills/system-skill-advisor/mcp_server/{scripts/skill_advisor.py,lib/scorer/aliases.ts,tests/...}`
- `.opencode/skills/sk-prompt-models/assets/model_profiles.json`
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/{002,003,004}-*/{spec,plan}.md`

## 17. Convergence Report

- Stop reason: `maxIterationsReached` (5/5 iterations)
- Total iterations completed: 5
- Questions answered: 5 / 5
- Remaining questions: 0
- newInfoRatio trend: 0.80 → 0.66 → 0.48 → 0.34 → 0.14 (monotonic decline)
- Convergence threshold: 0.05
- Composite stop score: 0.35 (below 0.60; entropy signal STOP, rolling-avg and MAD CONTINUE)
- Legal-stop basis: terminal `maxIterationsReached` hard stop; all five key questions carry evidence-backed answers from diverse source families; final iteration was consolidation only.
