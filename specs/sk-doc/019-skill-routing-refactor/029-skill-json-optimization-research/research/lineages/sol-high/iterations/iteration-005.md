# Iteration 5: Testing and integration coverage

## Focus
Dimension 5 only: test depth and integration across each governed JSON surface, the scaffold-to-root-gate-to-advisor-ingest-to-parent-selection-to-compiled-mode route, failure/fallback behavior, source invalidation, and natural-language per-mode evaluation. “Covered” means a test asserts an observable decision, mutation boundary, freshness result, or failure—not merely that a fixture/file exists.

## Findings
1. **The per-JSON matrix is strongest for generated artifacts and command metadata, but weakest at authored identity semantics.** The root suite behaviorally asserts H/S classification, required/forbidden sets, generated-file class sensitivity, stale manifest/alias detection, idempotent repair, authored-alias preservation, deterministic projections, and command ownership/choreography failures. In contrast, `description.json` is tested as required/forbidden presence, while `graph-metadata.json` gets identity/nesting and downstream freshness tests but no single fleet gate that validates its complete advisor schema; `mode-registry.json`/`hub-router.json` receive compiled-input freshness and parent checks rather than a unified schema-to-advisor assertion. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/tests/skill-root-metadata-contract.test.cjs:117-207] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/tests/skill-root-metadata-contract.test.cjs:296-359] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/tests/skill-root-metadata-contract.test.cjs:406-479] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/tests/scorer/projection-freshness.vitest.ts:43-88]

   | JSON surface | Behavioral unit/schema/freshness coverage | CI/integration coverage | Residual gap |
   |---|---|---|---|
   | `description.json` | H/S presence policy | parent checker fleet loop | no field-to-runtime behavior assertion |
   | `graph-metadata.json` | nested identity, discovery parity, derived freshness | workflow path-triggered; advisor suites selectively run | no one canonical full-schema/ingest gate |
   | `mode-registry.json`, `hub-router.json` | compiled decisions and all-input hash drift | parent checker + compiled guard | parent selection is not joined to mode selection |
   | `command-metadata.json` | strong core schema, ownership, resource probes | root fleet gate | no command-to-advisor-to-compiled journey |
   | `leaf-manifest.config.json` | class policy and generator input | root gate | scaffold does not prove generated outputs |
   | `leaf-manifest.json` | deterministic bytes, missing/stale repair | two freshness gates | duplicated gate, no advisor relevance expected |
   | `leaf-aliases.json` | S projection/set preservation; H non-mutation | root gate | no consumer-level relocated-resource journey |
   | activation `manifest.json` | extensive mint/freshness/refresh/lock/rollback/runtime behavior | compiled guard | not connected to advisor root selection |

2. **There is no end-to-end scaffold → generated gate → advisor ingest → root selection → compiled hub-mode route test.** The root suite creates synthetic roots directly and runs contract/gate functions; the advisor discovery test starts from already-written graph metadata; and compiled manifest tests start from parent fixtures and exercise compiled serving independently. Those tests assert real behavior inside each stage, but their seams are untested: a scaffold can omit generated files, a green root gate can still fail advisor ingest, or a correct advisor parent can fail to reach the intended compiled mode without one test failing across the journey. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/tests/skill-root-metadata-contract.test.cjs:222-235] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/tests/discovery-pipeline-parity.vitest.ts:47-85] [SOURCE: .opencode/bin/tests/compiled-route-manifest.test.cjs:276-364] [INFERENCE: the three independently cited stage suites have no shared scaffold artifact or cross-stage assertion]

3. **Failure-mode coverage is deep but compartmentalized.** The root gate proves unclassifiable declarations, nested identities, missing/stale generated files, safe repair, and non-zero exits; advisor discovery proves the intentional TS-reject/Python-depth-1 divergence; compiled tests cover malformed/missing/unsafe manifests, publication locks, concurrent writers, stale-source refresh, preserved serving flips, and runtime fail-safe to legacy on missing manifest or engine throw. Missing are seam failures such as “root gate passes but graph compiler rejects,” “watch reindex succeeds but root recommendation remains stale,” and “advisor selects the parent but compiled mode defers/clarifies unexpectedly.” [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/tests/skill-root-metadata-contract.test.cjs:262-328] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/tests/discovery-pipeline-parity.vitest.ts:66-80] [SOURCE: .opencode/bin/tests/compiled-route-manifest.test.cjs:967-1082] [SOURCE: .opencode/bin/tests/compiled-route-manifest.test.cjs:1118-1237] [SOURCE: .opencode/bin/compiled-routing-foundation.vitest.ts:199-240]

4. **Fallback tests prove availability and warning behavior, not effectiveness parity.** SQLite absence/corruption tests assert the projection source label, fallback reason, warning, and presence of an on-disk skill; they do not compare recommendations, lane contributions, graph edges, or doc-trigger outcomes between SQLite and filesystem projections. By contrast, executor delegation’s shared fixture does assert expected top-1 behavior and TS/Python parity for every case. A fallback-parity suite should therefore encode both expected degradations and invariants rather than equating “skill was returned” with routing parity. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/tests/scorer/projection-fallback-049-005.vitest.ts:45-106] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/tests/scorer/executor-delegation.vitest.ts:177-228]

5. **Source-change invalidation is strong for compiled manifests and absent at two advisor-side caches.** Compiled tests mutate every router input and require `stale-manifest`, then prove refresh changes the policy hash/generation and that restoring old source becomes stale again. Watcher tests validate malformed-derived diagnostics and backward-compatible target discovery, but do not mutate a watched derived key file and assert that the advisor projection/recommendation changes. Executor delegation tests construct one alias table and exercise decisions/parity, but never mutate registry/model/archive sources in-process; production rebuilds the table through a workspace-keyed cache path, leaving the stale-alias scenario from iteration 4 unguarded. [SOURCE: .opencode/bin/tests/compiled-route-manifest.test.cjs:323-364] [SOURCE: .opencode/bin/tests/compiled-route-manifest.test.cjs:1118-1162] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/tests/daemon-watcher-resource-leaks-049-005.vitest.ts:283-312] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/tests/scorer/executor-delegation.vitest.ts:119-175] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/scorer/executor-delegation.ts:435-446]

6. **Natural-language evaluation asserts behavior for its cases but does not cover each mode—or the root-to-mode chain.** The sk-doc canary has command-form positives for all 12 modes, but only two positive natural-language cases, plus clarify/defer/reject negatives. The advisor regression corpus has one generic sk-doc positive and no per-sk-doc-mode expectations. Therefore fixture presence is not the core weakness: the canary and scorer suites compare expected actions/top skills; the weakness is missing semantic breadth and a joined assertion that each mode’s natural phrase first selects `sk-doc` and then compiles to that mode. Ranked additions for synthesis are: **P1** one joined natural-language case per mode; **P1** scaffold-to-ingest happy/failure journeys; **P1** watched-key-file and delegation-cache invalidation; **P2** SQLite/filesystem expected-degradation parity; **P2** canonical graph schema/derived-freshness CI; **P3** retire the output-first duplicate freshness gate after coverage migration. [SOURCE: .opencode/bin/lib/compiled-routing/009-parent-hub-rollout/007-sk-doc/fixtures/canary-cases.v1.json:5-23] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/scripts/fixtures/skill-advisor-regression-cases.jsonl:30] [SOURCE: .github/workflows/routing-registry-drift.yml:68-110]

## Ruled Out
- Treating fixture presence as behavioral coverage: the root, delegation, and compiled suites do assert outputs and failure codes; the shortfall is missing semantic and cross-stage scenarios. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/tests/skill-root-metadata-contract.test.cjs:455-479] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/tests/scorer/executor-delegation.vitest.ts:190-228]
- Treating isolated TS/Python discovery parity as complete ingest parity: the test deliberately preserves a depth-1 divergence and verifies identity exclusion, not full schema or recommendation equivalence. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/tests/discovery-pipeline-parity.vitest.ts:66-80]

## Dead Ends
- Adding more command-form canaries alone cannot expose the parent-activation gap; commands already dominate the sk-doc fixture while natural per-mode root selection is largely absent. [SOURCE: .opencode/bin/lib/compiled-routing/009-parent-hub-rollout/007-sk-doc/fixtures/canary-cases.v1.json:5-18]

## Edge Cases
- Ambiguous input: none; “coverage” was classified as behaviorally asserted coverage, with fixture-only evidence called out separately.
- Contradictory evidence: none; high unit depth and missing end-to-end coverage coexist at different boundaries.
- Missing dependencies: none; local checked-in tests, workflow, fixtures, and runtime sources were sufficient.
- Partial success: none; all requested testing/integration dimensions were mapped without running or modifying production code.

## Sources Consulted
- `.opencode/skills/sk-doc/create-skill/scripts/tests/skill-root-metadata-contract.test.cjs:77-484`
- `.opencode/skills/system-skill-advisor/mcp-server/tests/discovery-pipeline-parity.vitest.ts:1-86`
- `.opencode/skills/system-skill-advisor/mcp-server/tests/scorer/projection-fallback-049-005.vitest.ts:1-107`
- `.opencode/skills/system-skill-advisor/mcp-server/tests/scorer/projection-freshness.vitest.ts:1-89`
- `.opencode/skills/system-skill-advisor/mcp-server/tests/scorer/executor-delegation.vitest.ts:1-229`
- `.opencode/skills/system-skill-advisor/mcp-server/tests/daemon-watcher-resource-leaks-049-005.vitest.ts:283-312`
- `.opencode/bin/tests/compiled-route-manifest.test.cjs:270-439,900-1239`
- `.opencode/bin/compiled-routing-foundation.vitest.ts:182-257`
- `.opencode/bin/lib/compiled-routing/009-parent-hub-rollout/007-sk-doc/fixtures/canary-cases.v1.json:1-32`
- `.github/workflows/routing-registry-drift.yml:1-110`

## Assessment
- New information ratio: 0.92
- Questions addressed: Which JSON surfaces lack unit, CI, freshness, scaffold-to-ingest, and end-to-end routing coverage?
- Questions answered: The final testing/integration question is answered with a per-surface matrix, behavior-versus-presence distinction, failure/fallback/invalidation assessment, and ranked missing scenarios.

## Reflection
- What worked and why: Reading assertions rather than test names separated real behavioral gates from fixture inventory and exposed strong stage-local coverage alongside missing seam coverage.
- What did not work and why: Broad test-name searches produced many unrelated compiled-routing phases; narrowing to stage entrypoints and their exact assertions was necessary.
- What I would do differently: Start from one synthetic hub artifact and trace whether any test reuses it across all five stages; the absence of a shared artifact is the fastest end-to-end gap signal.

## Recommended Next Focus
Workflow-owned final synthesis: combine iterations 1-5 into the ranked opportunity map, led by canonical derived-schema ownership, scaffold-to-ingest integration, parent-signal projection, cache/watch invalidation, and natural-language root-to-mode coverage. Do not perform another leaf evidence pass unless synthesis finds a citation gap.
