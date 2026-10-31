# Iteration 1: What Lane C parity measured and what a restore needs (Q1)

## Focus

Read the retired Lane C parity modules at `b45ea54cea3^` — `compiled-routing-parity.cjs`, `score-skill-benchmark.cjs`, `router-replay.cjs`, `load-playbook-scenarios.cjs`, plus their orchestrator `run-skill-benchmark.cjs` — to answer Q1: what exactly parity measured, and which modules a restored path would need.

## Findings

1. **Lane C measured per-scenario behavioral equivalence between the compiled decision and a deterministic replay of the legacy prose router.** `compiled-routing-parity.cjs`'s own contract: "prove the compiled routing decision matches the legacy decision on a scenario, WITHOUT re-implementing any scoring judgment" — it translated the compiled decision into the legacy evaluator's vocabulary and delegated the verdict to the frozen `evaluateRouteGold`. [SOURCE: file:.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/compiled-routing-parity.cjs@b45ea54cea3^:7-45]

2. **Per-scenario statuses were `match` / `drift` / `vacuous` / `n/a` / `resolver-missing`; only `match` counted as a pass.** `n/a` was informational (non-routing scenario, route-gold absent, or hub outside the compiled serving closure), never scored as drift. [SOURCE: file:compiled-routing-parity.cjs@b45ea54cea3^:103-113,562-578]

3. **Three guards kept the comparison honest.** (a) Vacuous-parity guard: the hub's activation manifest had to read `servingAuthority: "compiled"` or the row hard-failed `vacuous` — trusting the runtime flag alone would read a legacy fallback as a false pass. (b) Shape bridge: compiled qualified target ids were translated through the shared `qualifiedIdToLeaf` boundary into legacy `observedIntents`/`observedResources`, with unresolved ids failing closed and a granularity projection so mode-wide compiled declarations were never mistaken for task-scoped legacy selections. (c) Frozen-scorer pin: the three scorer files were re-hashed against pinned SHA-256 digests before and after the run; drift aborted with no report. [SOURCE: file:compiled-routing-parity.cjs@b45ea54cea3^:14-45,92-100,636-643; file:run-skill-benchmark.cjs@b45ea54cea3^:565-576]

4. **The match formula was two-sided and decoupled from gold achievability.** `match` required `firstDifference === null` between the legacy and compiled routing projections AND, only when the decision was a `route`, equal gold outcomes (`compiledGoldPass === legacyGoldPass`). Both sides failing the same pre-existing gold gap under identical routing was parity, not drift; only an outcome difference drifted. Non-route decisions (`defer`/`clarify`/`reject`) carry no resources by schema, so resource gold was not compared on them. [SOURCE: file:compiled-routing-parity.cjs@b45ea54cea3^:712-740]

5. **The legacy side came from `router-replay.cjs` (Mode A).** It extracted the `INTENT_SIGNALS`/`INTENT_MODEL` + `RESOURCE_MAP` dictionaries from the fenced block in the hub's `SKILL.md` and reproduced the exact substring-scoring semantics: lowercase the task, score each intent by keyword substring, keep intents within `AMBIGUITY_DELTA = 1` of the top score, assemble `RESOURCE_MAP[intent]`. Declared `defaultResourceSemantics: fallback-only` routers treated the default as a defer-time suggestion; undeclared routers kept union-default behavior so they replayed byte-identically. [SOURCE: file:router-replay.cjs@b45ea54cea3^:7-21,33]

6. **The scenario corpus came from `load-playbook-scenarios.cjs`.** It parsed each skill's `manual-testing-playbook` into normalized scenarios with gold captured AS AUTHORED (`expected_intent`, `expected_resources`, `expected_workflow_mode`, `expected_leaf_resources`, `expected_rank_below_skill_ids`), a `classKind` of `browser`/`advisor`/`routing`, and a `stage` of `routing`/`holdout`/`negative` (suppression/`negativeActivation` scenarios are `stage:negative`). Two source shapes were supported: the sk-code index-table shape and the sk-doc per-scenario-frontmatter shape. Gold was never checked for on-disk existence — a stale expectation was a real drift finding, not a silent drop. [SOURCE: file:load-playbook-scenarios.cjs@b45ea54cea3^:7-24,461-481,555-575]

7. **The frozen scorer `score-skill-benchmark.cjs` owned the gold verdicts.** `evaluateRouteGold` asserted intent gold as an exact set (rejection labels `none`/`defer`/`unknown` map to the empty expected set) and resource gold as exact-assembly for sk-doc-shape corpora vs must-include + no-forbidden-prefix for sk-code-shape corpora; a gold parse failure was itself a violation and never dropped from the denominator. `scoreHubRoute` scored `routeOutcome: defer` as pass only when actual intents were empty and no forbidden workflow mode fired. [SOURCE: file:score-skill-benchmark.cjs@b45ea54cea3^:874-945,963-1000]

8. **The orchestrator `run-skill-benchmark.cjs` wired the lane end-to-end.** A `--compiled-routing-parity on|off|auto` flag enabled the lane; each scenario row got `row.compiledParity = compiledParity({scenario, legacyObserved, skillRoot, skillId})` where `legacyObserved` was the router-replay observation; `rollupCompiledParity` folded rows into sub-verdicts `compiled-serving` / `legacy-fallback-drifted` / `broken-compiled-path` / `n/a` (resolver-missing outranks drift, both block); `applyCompiledDriftVerdict` raised the outer report verdict without collapsing it into generic route-gold blocks. [SOURCE: file:run-skill-benchmark.cjs@b45ea54cea3^:43-45,272-287,460-462,565-615,795]

9. **A restore needs more than the four named modules.** The live dependency graph also pulls in `run-skill-benchmark.cjs` (orchestrator + report writer), `cutover-playbook-executor.cjs` (the other parity consumer), `compiled-routing-parity.vitest.ts` (764-line test surface), `loop-host.cjs` (registered `compiled-routing-parity` as a loop host), the benchmark command/YAML/doc surface (~250 files deleted in the same commit), and the runtime inputs that still exist: `serving-closure.manifest.json`, the `compiled-route.cjs` front door, `compiled-route-status.cjs` probe, and `leaf-resource-contract.cjs` (`qualifiedIdToLeaf`, still live at `.skilled/skills/sk-doc/sk-create-skill/scripts/lib/`). Commit `b45ea54cea3` deleted 268 files. [SOURCE: commit:b45ea54cea3 --stat; file:run-skill-benchmark.cjs@b45ea54cea3^:43-45; file:.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/loop-host.cjs@b45ea54cea3^:81; file:.skilled/skills/sk-doc/sk-create-skill/scripts/lib/leaf-resource-contract.cjs]

10. **The runtime inputs the harness probed are still live and load-bearing.** `compiledParity` ran the front door `.skilled/bin/compiled-route.cjs --hub <id> --prompt <text>` under `SPECKIT_COMPILED_ROUTING=1` and the probe `.skilled/bin/compiled-route-status.cjs --hub <id> --no-probe`; eligibility came from `serving-closure.manifest.json`; per-hub mode indexes came from each hub's `leaf-manifest.json` + `mode-registry.json`. All of those paths exist today. [SOURCE: file:compiled-routing-parity.cjs@b45ea54cea3^:78-90,211-270]

## Sources Consulted

- `git show b45ea54cea3^:.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/compiled-routing-parity.cjs` (full file, 845 lines)
- `git show b45ea54cea3^:.../run-skill-benchmark.cjs` (parity wiring, rollup, verdict)
- `git show b45ea54cea3^:.../router-replay.cjs` (header + replay semantics)
- `git show b45ea54cea3^:.../load-playbook-scenarios.cjs` (header, gold parsing, stage model)
- `git show b45ea54cea3^:.../score-skill-benchmark.cjs` (`evaluateRouteGold`, `scoreHubRoute`, rejection labels)
- `git show b45ea54cea3 --stat` (268 deleted files)
- `git grep` at `b45ea54cea3^` for parity callers
- Live tree: `.skilled/bin/lib/compiled-routing/`, `leaf-resource-contract.cjs`, per-hub playbook dirs

## Assessment

- **newInfoRatio: 0.95** — first pass; nearly all findings are new to this packet and directly answer Q1.
- Confidence: high on semantics (read the actual code, not summaries); medium on the complete caller inventory (callers were enumerated by grep, not exhaustively executed).

## Reflection

- **Worked:** reading the retired modules at `b45ea54cea3^` directly; tracing `compiledParity` → `evaluateRouteGold` → `rollupCompiledParity` → report verdict gives the full measurement contract.
- **Failed/limited:** the benchmark report JSONs under `benchmark/reports/compiled-routing/` still exist per hub and could confirm the measured verdicts empirically — deferred to a later iteration.
- **Ruled out:** treating `compiled-route-status.cjs` as a parity replacement — the architecture doc explicitly says its `causeCode: 'compiled-serving'` is a request-time gate check, not a coverage judgment. [SOURCE: file:.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/compiled-routing-architecture.md:70]

## Recommended Next Focus

Q2: inspect `compiledRoute()` in `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs` — its decision shape, what gold fields it can be checked against, and how `defer`/holdout/negative scenarios should count under a gold-agreement admission bar.
