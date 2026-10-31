# Iteration 2: compiledRoute() vs scenario gold as the admission bar (Q2)

## Focus

Whether the compiled decision from `compiledRoute(hubId, taskText)` checked against each routing scenario's gold (`expected_workflow_mode`, `expected_leaf_resources`) can serve as the admission bar, and how `defer`, holdout and negative scenarios should count.

## Findings

1. **`compiledRoute(hubId, taskText)` is the pure engine evaluation — exactly the right surface to measure.** It loads the hub's shadow-child engine via the frozen `HUB_CHILD` table (`009-parent-hub-rollout/00N-<hub>`), runs `evaluateCanary`/`evaluateRoute` over the compiled snapshot, and returns `{hubId, action, selectionKind, targets, effectivePolicyHash, generation}` with `action ∈ {route, clarify, defer, reject}`. It never consults the flag or manifest — that gating is `resolveRoute`'s job — so it measures the engine, not the serving gate. [SOURCE: file:.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs:30-36,53-106; file:.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs:101-121]

2. **The decision↔gold bridge exists and runs today.** A compiled target decomposes to `{skillId, workflowMode, packetId, packetKind, backendKind}` — observed live: `compiledRoute('sk-doc','author a changelog entry')` → `{action:"route", targets:[{skillId:"sk-doc", workflowMode:"sk-create-changelog", packetId:"sk-create-changelog",...}]}`, and `compiledRoute('sk-doc','what is the weather today')` → `{action:"defer", targets:[]}`. `qualifiedIdToLeaf` in `leaf-resource-contract.cjs` already owns the qualified-id → `{hub, workflowMode, packet, kind, slug, mode}` decomposition with fail-closed orphan codes (`ORPHAN_WORKFLOW_MODE`, `PACKET_MISMATCH`) — the same boundary the retired harness used. [SOURCE: live run `node .skilled/bin/compiled-route.cjs --hub sk-doc`; file:.skilled/skills/sk-doc/sk-create-skill/scripts/lib/leaf-resource-contract.cjs:430-463; file:compiled-routing-parity.cjs@b45ea54cea3^:272-351]

3. **The scenario golds needed are all still authored in the live tree.** Per-hub `manual-testing-playbook/` corpora carry `expected_workflow_mode`, `expected_leaf_resources` (`{workflow_mode, leaf_resource_id}` pairs), `expected_intent`, `expected_resources`, and `expected_rank_below_skill_ids`; 111 files carry `leaf_resource_id` gold and 78 carry `expected_workflow_mode: UNKNOWN` negative gold today. Leaf ids match `leaf-manifest.json` mode `leaves` byte-for-byte (e.g. `references/validation.md` under mode `sk-create-quality-control`). [SOURCE: file:.skilled/skills/sk-doc/manual-testing-playbook/holdout/ind-doc-quality.md:1-19; file:.skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/recursive-phase-validation.md:6-11; live leaf-manifest.json modes]

4. **Gold-checking measures something deliberately different from parity — stricter in one axis, looser in another.** Parity required `compiled == legacy` regardless of gold achievability (a shared pre-existing gold gap was parity, not drift). A gold checker requires `compiled == gold`: (a) it FAILS a hub where compiled==legacy but both miss authored gold — e.g. the documented CS-002/CS-005 "non-Webflow" negation quirk where both engines shared the same gold gap and parity held at 0 drift; (b) it PASSES a hub where compiled is correct-but-different-from-legacy — meaning serving could change behavior on scenarios gold doesn't cover, where parity guaranteed zero behavior change. Which semantic the bar should mean is an admission-policy decision, not a technical one. [SOURCE: file:compiled-routing-parity.cjs@b45ea54cea3^:712-740; file:.skilled/skills/sk-code/benchmark/reports/compiled-routing/2026-07-21--playbook-verify--sonnet/report.md:33-44]

5. **The leaf-resource gold needs a granularity rule, not a naive set-equality.** Compiled routing selects a whole mode (its leaf-manifest declaration is mode-wide); legacy replay selected a task-scoped subset. The retired harness solved this with `projectCompiledResourcesToLegacyGranularity` — projecting to the task-scoped intersection. A gold checker should score `expected_leaf_resources ⊆ declaredLeaves(routedMode)` (must-include) and flag expected leaves the mode does not declare as genuine compiled gaps; scoring declared-set-equality would fail every correct route on breadth. [SOURCE: file:compiled-routing-parity.cjs@b45ea54cea3^:29-35,392-440; file:.skilled/skills/sk-doc/leaf-manifest.json (mode leaves)]

6. **Defer/negative/holdout counting — the retired semantics give a defensible rule.** (a) `stage: negative` / `expected_workflow_mode: UNKNOWN` / rejection labels `none|defer|unknown` → expected set is empty: compiled MUST NOT route; a route is unsafe over-detection and blocks. (b) `routeOutcome: defer` gold → compiled `action` must be non-route; routing is drift. (c) Routing-stage scenarios where gold routes → compiled `defer` is a silent defer and blocks. (d) `stage: holdout` counts identically to routing — holdout is keyword-blind anti-overfit evidence, not a discount tier. (e) `classKind: browser` and gold-absent rows stay `n/a`, out of the denominator. These are exactly the Section-4 bar's own terms: "zero drift, zero unsafe over-detection, zero silent defers on a scenario legacy actually routes." [SOURCE: file:load-playbook-scenarios.cjs@b45ea54cea3^:461-481,555-575; file:score-skill-benchmark.cjs@b45ea54cea3^:874-945,963-1000; file:compiled-routing-architecture.md:66]

7. **What a gold checker cannot see that parity could:** the projection comparison covered `action + selectionKind + ordered targets` — a richer equivalence than workflowMode-set agreement. Two engines that agree on the mode but differ on `selectionKind` (single vs bundle vs disambiguate) or cross-hub targets were drift under parity but invisible to a `expected_workflow_mode`-only check. Mitigation: keep `selectionKind` and the ordered target list in the checked projection, not just the mode set. [SOURCE: file:compiled-routing-parity.cjs@b45ea54cea3^:402-453; file:compiled-route.cjs:97-105]

8. **A gold checker rebuilds less than a parity restore — but the loader is still the heavy piece.** Needed: a corpus loader for the playbook gold format (frontmatter `expected_*` fields; the sk-code index-table shape and the sk-doc per-scenario shape), a comparator (mode-set equality + leaf must-include + defer semantics + gold-parse-failure-as-violation), and the rollup. NOT needed: `router-replay.cjs` (no legacy replay when checking gold), `score-skill-benchmark.cjs`'s unrelated signals, the frozen-trio hash pins (there is no trio), and the `n/a`-by-eligibility machinery stays trivial. `evaluateRouteGold`'s semantics (~55 lines) port cleanly. [SOURCE: file:load-playbook-scenarios.cjs@b45ea54cea3^:15-24; file:score-skill-benchmark.cjs@b45ea54cea3^:891-945]

9. **Prior art already validates the approach end-to-end.** The archived `playbook-verify` report manually ran compiled (`resolve.cjs --hub --prompt`) vs legacy (`router-replay.cjs`) over the full sk-code playbook and diffed decisions — 0/31 drift — demonstrating the compiled-decision-vs-corpus comparison is executable with the live front door and a retired-module loader. [SOURCE: file:.skilled/skills/sk-code/benchmark/reports/compiled-routing/2026-07-21--playbook-verify--sonnet/report.md:11-44]

10. **`compiledRoute` throws `unknown hub` for any hub absent from `HUB_CHILD`** — so a new hub must be registered in the frozen table before it can even be measured; admission ordering is build-engine→register→measure→flip, matching the architecture doc's step order. [SOURCE: file:compiled-route.cjs:58-59; file:compiled-routing-architecture.md:78-83]

## Sources Consulted

- `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs` (full file)
- `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs` (full file)
- `.skilled/skills/sk-doc/sk-create-skill/scripts/lib/leaf-resource-contract.cjs` (`qualifiedIdToLeaf`)
- Live runs: `compiled-route.cjs --hub sk-doc`, direct `compiledRoute()` calls (route + defer)
- Scenario golds: `sk-doc/manual-testing-playbook/holdout/ind-doc-quality.md`, `system-spec-kit` playbook files
- `.skilled/skills/sk-doc/leaf-manifest.json` (mode leaves)
- `.skilled/skills/sk-code/benchmark/reports/compiled-routing/2026-07-21--playbook-verify--sonnet/report.md`
- Retired: `compiled-routing-parity.cjs` (shape bridge, granularity projection, match formula)

## Assessment

- **newInfoRatio: 0.90** — the decision↔gold bridge, the parity-vs-gold semantic delta, and the defer/holdout/negative counting rule are all new; only the corpus mechanics overlapped iteration 1.
- Confidence: high — the front door and `compiledRoute()` were executed live, gold files read directly, and the retired comparator semantics traced from source.

## Reflection

- **Worked:** executing `compiledRoute()` live settled the decision shape (structured `qualifiedId` objects, clean `defer` signal) — no inference needed.
- **Failed/limited:** I did not measure the full per-hub scenario counts (which hubs' corpora use which loader shape); the mcp-tooling/sk-code index-table shape is documented but not yet re-derived.
- **Ruled out:** naive leaf set-equality between compiled output and `expected_leaf_resources` — compiled declares mode-wide leaves by design; must-include is the correct assertion (parity's granularity projection exists precisely because of this).

## Recommended Next Focus

Q3: the non-checker admission machinery — the frozen `HUB_CHILD`/`DEFAULT_ON_HUBS` tables, the activation manifest re-mint path (`compiled-route-manifest.cjs mint`), and `compiled-route-guard.cjs` freshness enforcement.
