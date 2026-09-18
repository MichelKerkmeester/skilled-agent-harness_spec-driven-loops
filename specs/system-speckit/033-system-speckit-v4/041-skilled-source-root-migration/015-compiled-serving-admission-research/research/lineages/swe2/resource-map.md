# Resource Map — compiled-serving admission research (swe2 lineage)

## Retired Lane C sources (read at `b45ea54cea3^`)

| Resource | Path (@b45ea54cea3^) | Role in research |
|---|---|---|
| Parity harness | `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/compiled-routing-parity.cjs` | Lane C semantics: per-scenario statuses, vacuous guard, qualifiedIdToLeaf bridge, ordered projection, granularity projection, frozen-scorer pin (iter 1) |
| Gold scorer | `…/skill-benchmark/score-skill-benchmark.cjs` | `evaluateRouteGold`, `scoreHubRoute`, defer/negative semantics, gold-parse-failure=violation (iter 1, 2) |
| Router replay | `…/skill-benchmark/router-replay.cjs` | Legacy replay proxy: substring-scoring, AMBIGUITY_DELTA, SKILL.md dict sources (iter 1) |
| Scenario loader | `…/skill-benchmark/load-playbook-scenarios.cjs` | Two gold shapes, stage/classKind taxonomy, gold captured-as-authored (iter 1, 2, 5) |
| Orchestrator | `…/skill-benchmark/run-skill-benchmark.cjs` | `--compiled-routing-parity`, sub-verdict rollup, require-graph for restore census (iter 1, 4) |
| Playbook executor | `…/skill-benchmark/cutover-playbook-executor.cjs` | Second parity consumer in restore census (iter 4) |
| Advisor probe | `…/skill-benchmark/advisor-probe.cjs` | scorer sibling dependency (iter 4) |
| Parity tests | `…/deep-improvement/tests/compiled-routing-parity.vitest.ts` | Status-space test pattern (iter 1, 5) |
| Deletion commit | `b45ea54cea3` | 268-file lane census; full vs surgical restore pricing (iter 1, 4) |

## Live compiled-routing runtime

| Resource | Path | Role |
|---|---|---|
| Compiled engine | `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs` | `compiledRoute()` API, `HUB_CHILD` (5 hubs), decision shape; live-called (iter 2, 3) |
| Resolver/gate | `…/lib/resolve.cjs` | `DEFAULT_ON_HUBS` (5), flag policy, manifest-identity binding, stale "7" comment (iter 2, 3) |
| Front doors | `.skilled/bin/compiled-route.cjs`, `compiled-route-status.cjs` | thin CLI/probe; status probe is serving check not parity (iter 1) |
| Manifest tool | `.skilled/bin/lib/compiled-route-manifest.cjs` | mint (inert legacy/shadowOnly) vs refresh (gen+1, preserves serving), atomic publish (iter 3) |
| Freshness guard | `.skilled/bin/compiled-route-guard.cjs` | `HUBS` cohort, freshness + authored-drift check; live all-fresh run (iter 3) |
| Sync/promotion | `.skilled/bin/compiled-route-sync.cjs` | authored spec-tree → `.skilled` promotion + `serving-closure.manifest.json` regeneration (iter 3) |
| Serving closure | `.skilled/bin/lib/compiled-routing/serving-closure.manifest.json` | promoted inventory; parity's declared-files pin (iter 1, 3) |
| Foundation test | `.skilled/bin/compiled-routing-foundation.vitest.ts` | cohort-copy agreement + working-golden assertions (iter 3) |
| Manifest tests | `.skilled/bin/tests/compiled-route-manifest.test.cjs` | `DEFAULT_ON_HUBS.size===5` pin (iter 3) |

## Contract / architecture

| Resource | Path | Role |
|---|---|---|
| Leaf contract | `.skilled/skills/sk-doc/sk-create-skill/scripts/lib/leaf-resource-contract.cjs` | `qualifiedIdToLeaf` fail-closed decomposition; survives retirement (iter 1, 2) |
| Architecture doc | `.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/compiled-routing-architecture.md` | 8-step per-hub recipe, ready-scaffold semantics, stale "seven" (iter 3, 4, 5) |
| Coverage recipe | `specs/sk-doc/…/019-routing-coverage-activation-verification/goal-coverage-buildout.md` | proven build-out steps + bar definition + all-7 historical claim (iter 5) |

## Authored spec-tree cutover tooling

| Resource | Path | Role |
|---|---|---|
| Flip tool | `specs/sk-doc/…/014-runtime-engine/lib/flip-serving.cjs` | authored-only legacy→compiled flip; P4b fenced; scorer gate now stale (iter 3) |
| Activate tool | `specs/sk-doc/…/013-live-activation/lib/activate-hub.cjs` | authored-only HUB_CHILD binding gate (iter 3) |
| Scorer contract | `specs/sk-doc/…/shared/frozen-scorer-contract.cjs` | pin discipline + frozen-trio manifest; SCORER_DIR dead path (iter 3, 4) |

## Advisor cohort copies

| Resource | Path | Role |
|---|---|---|
| Flag module | `.skilled/skills/system-skill-advisor/runtime/lib/compiled-routing-flag.ts` | `COMPILED_ROUTING_HUBS`, `DEFAULT_ON_HUBS` copies (iter 3) |
| Advisor handler | `…/handlers/advisor-recommend.ts` | consumption point for cohort flag (iter 3) |

## Scenario corpora

| Resource | Path | Role |
|---|---|---|
| Playbook gold | `.skilled/skills/<hub>/**/manual-testing-playbook/**` | 262 gold-bearing files, 44 dirs, 5 hubs; `expected_workflow_mode`/`leaf_resource_id`/`UNKNOWN` counts (iter 2, 5) |
| Canary fixtures | `…/009-parent-hub-rollout/<hub>/fixtures/canary-cases.v1.json` | 67 normalized cases (50 route/7 defer/7 reject/3 clarify); smoke-gate corpus (iter 4) |
| Leaf manifests | `.skilled/skills/<hub>/leaf-manifest.json` | declared mode→leaves inventory for granularity rule + completeness gate (iter 2, 5) |

## Archived evidence

| Resource | Path | Role |
|---|---|---|
| Sweep report | `.skilled/skills/sk-code/benchmark/reports/compiled-routing/*benchmark-sweep--r3*/report.json` | all-7 parity, 0 drift, 258/258, 47/47 — measured verdicts (iter 4) |
| Playbook-verify | `.skilled/skills/sk-code/benchmark/reports/compiled-routing/2026-07-21--playbook-verify--sonnet/report.md` | CS-002/CS-005 shared-gold-gap pattern (iter 2, 5) |

## Automation

| Resource | Path | Role |
|---|---|---|
| Pre-commit hook | `.opencode/scripts/git-hooks/pre-commit` (= `.skilled/scripts/git-hooks/pre-commit`) | auto-remint on staged routing inputs; reads hub list from guard HUBS (iter 3) |

## Commits

| Commit | Relevance |
|---|---|
| `b45ea54cea3` | lane retirement; `b45ea54cea3^` read point |
| `f931ba2e14` | sk-design dissolution → cohort 7→6 |
| `a9286399bc3` | sk-prompt removal → cohort 5 |
| `a1faf0914a` | auto-remint pre-commit hook |
| `4cd19370da1` | default-on flip for all 7 (historical) |
