# Iteration 014 - Correctness: deep-improvement Packet

## Dimension

Correctness — first `deep-improvement` packet pass, focused on recently renamed skill-benchmark fixtures, Lane B model-benchmark fixture/profile resolution, core scoring/resolution scripts, and cross-file runtime truth claims.

## Files Reviewed

- `.opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/deep-review-strategy.md:86`
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/deep-review-state.jsonl:29`
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/deep-review-findings-registry.json:502`
- `.opencode/skills/sk-code/code-review/references/review_core.md:28`
- `.opencode/skills/system-deep-loop/deep-improvement/SKILL.md:268`
- `.opencode/skills/system-deep-loop/deep-improvement/SKILL.md:279`
- `.opencode/skills/system-deep-loop/deep-improvement/references/shared/runtime_truth_contracts.md:41`
- `.opencode/skills/system-deep-loop/deep-improvement/references/shared/runtime_truth_contracts.md:175`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/lib/profile-resolve.cjs:46`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/loop-host.cjs:191`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/loop-host.cjs:216`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/materialize-benchmark-fixtures.cjs:114`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:100`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs:55`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs:111`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/profile-validator.cjs:40`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:35`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/trade-off-detector.cjs:163`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs:230`
- `.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/deep-improvement/agent_improve_001.public.json:2`
- `.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/deep-improvement/agent_improve_001.private.json:2`
- `.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/deep-loop-workflows/dlw_research_001.public.json:2`
- `.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/deep-loop-workflows/dlw_research_001.private.json:2`
- `.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk-design/sk_design_alias_interface_001.public.json:2`
- `.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk-design/sk_design_alias_interface_001.private.json:2`
- `.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk-design-dispatch/sk_design_dispatch_boundary_present_001.public.json:2`
- `.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/sk-design-dispatch/sk_design_dispatch_boundary_present_001.private.json:2`
- `.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/default.json:8`
- `.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/framework_bakeoff.json:8`
- `.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/kimi_k2.7_frameworks.json:8`
- `.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/reviewer_regression.json:23`
- `.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/t3_bugfix_in_context.json:2`
- `.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/t3_strict_acceptance.json:2`
- `.opencode/commands/deep/assets/deep_model-benchmark_auto.yaml:165`

## Findings by Severity

### P0

None.

### P1

#### DR-014-P1-001 — Literal fixture resolver breaks shipped sweep profiles on the model-benchmark loop-host path

- Claim: The public non-reviewer `/deep:model-benchmark` workflow routes profiles through `loop-host`'s materialize-then-run pipeline, but shipped sweep profiles such as `framework_bakeoff.json` and `kimi_k2.7_frameworks.json` reference fixtures by parsed fixture id (`t3-lower-bound`, `t3-compare-versions`) rather than by actual JSON filename. `sweep-benchmark.cjs` can resolve those ids, but the wired `loop-host` path cannot; it calls `materialize-benchmark-fixtures.cjs`, which maps each ref through `fixturePathFor(ref, fixtureDir)` and fails if `<ref>.json` is absent.
- Evidence refs: `.opencode/commands/deep/assets/deep_model-benchmark_auto.yaml:165`, `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/loop-host.cjs:191`, `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/loop-host.cjs:216`, `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/materialize-benchmark-fixtures.cjs:114`, `.opencode/skills/system-deep-loop/deep-improvement/scripts/lib/profile-resolve.cjs:46`, `.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/framework_bakeoff.json:8`, `.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/kimi_k2.7_frameworks.json:8`, `.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/t3_bugfix_in_context.json:2`, `.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-fixtures/t3_strict_acceptance.json:2`.
- Counterevidence sought: Checked whether reviewer scoring is a similar false positive; command YAML intentionally bypasses `loop-host` for `--scorer reviewer`, so `run-benchmark.cjs` accepting only `pattern|5dim` is not itself a bug. Checked whether sweep profiles resolve by parsed id; `sweep-benchmark.cjs` explicitly indexes fixtures by parsed `id` and filename stem, but the active command path does not call it.
- Alternative explanation: The sweep profiles may be intended for standalone `sweep-benchmark.cjs` only. That does not fully mitigate the issue because the public `/deep:model-benchmark` YAML and `loop-host` accept arbitrary non-reviewer profile paths and route them to the literal materializer, while the shipped profile docs describe these profiles as Lane B profiles a run loads.
- Final severity: P1.
- Confidence: 0.86.
- Downgrade trigger: Downgrade to P2 if the command route is changed or documented to reject sweep profiles before `loop-host`, or if all shipped sweep profiles are moved behind a dedicated `sweep-benchmark.cjs` entry path that never uses the literal materializer.

### P2

None new.

## Traceability Checks

- Asset rename freshness: PASS for sampled public/private fixture pairs. Read four pairs across `deep-improvement`, `deep-loop-workflows`, `sk-design`, and `sk-design-dispatch`; each sampled `scenarioId` matched the filename stem, and a full read-only Node validation parsed all 98 JSON fixture files with zero `scenarioId` mismatches and zero incomplete public/private pairs.
- Model profile fixture references: PARTIAL. `default.json` literal refs resolve on the `run-benchmark.cjs` path. Shipped sweep profiles resolve by parsed fixture id under `sweep-benchmark.cjs`, but not by literal filename under `materialize-benchmark-fixtures.cjs`; recorded as DR-014-P1-001.
- Runtime truth contracts: PASS for sampled enum docs. `SKILL.md` stop reasons/session outcomes match `runtime_truth_contracts.md`, and `improvement-journal.cjs` imports the central lifecycle taxonomy rather than duplicating accepted values.
- Pareto / trade-off path: PASS for active workflow wiring. The auto/confirm workflows call `detectTradeOffs(getTrajectory(...))`; the unused `checkParetoDominance` helper has narrower semantics, but no active command consumer was found in this pass.
- Weight optimizer: PASS for correctness scope sampled. `benchmark-stability.cjs` keeps recommendations advisory, enforces a minimum session threshold, and does not auto-apply weights.
- Cross-file script references: PARTIAL. Sampled SKILL references to the core scripts above resolve. The `SKILL.md` script inventory line is very long and was not exhaustively parsed for every script path.

## Verdict

CONDITIONAL. The recent skill-benchmark fixture rename appears correct in the sampled and full parse/pair validation, but the Lane B model-benchmark path has one new P1 correctness bug: shipped sweep profiles can be handed to the public workflow and then fail because the materializer literal-resolves fixture ids as filenames.

## Next Dimension

Iteration 15 should continue with `deep-improvement` security. Focus on command/YAML shell boundaries, benchmark output/write paths under `.opencode/skills/sk-prompt-models/benchmarks/{run_label}`, profile/fixture path containment, reviewer-scorer flag gating, and whether Lane A/B/C/D helper scripts can write outside their intended packet or benchmark output roots. Do not re-count DR-014-P1-001 unless a security pass proves path escape or broader write-boundary impact.

Review verdict: CONDITIONAL
