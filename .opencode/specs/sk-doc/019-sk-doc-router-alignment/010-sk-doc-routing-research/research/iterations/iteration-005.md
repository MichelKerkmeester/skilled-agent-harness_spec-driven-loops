# Iteration 5: Trace validator coverage from hub registry to benchmark evidence

## Focus

Answer Q4 by tracing `routing-registry-drift-guard` and the adjacent parent-hub and skill-benchmark validators across six distinct boundaries: registry/router key equality, resource existence, output path namespace, second-layer leaf coverage, fixture-to-topology validity, and execution-time provenance capture. Name the first missing check at each boundary.

## Actions Taken

1. Read the canonical state log, reducer-owned strategy, config, iteration 4, and the deep-research iteration contracts before investigating; preserved the saturated literal alias-gap direction.
2. Traced `routing-registry-drift-guard.vitest.ts` from its fixed registry input through its generated TypeScript/Python projection comparisons.
3. Traced `parent-skill-check.cjs`, `parent-hub-vocab-sync.cjs`, and `d5-connectivity.cjs` across registry, packet, router-resource, vocabulary, and orphan checks.
4. Traced playbook gold extraction, dispatch/scoring, report emission, and the retained `SD-016` / `SD-020` rows to identify where topology validation and provenance disappear.

## Findings

### 1. `routing-registry-drift-guard` is not a generic `sk-doc` registry/router guard

The named test is hardwired to `.opencode/skills/system-deep-loop/mode-registry.json`. It compares that registry's `advisorRouting` projection to generated TypeScript and Python advisor maps, checks projection hashes, requires one default mode, and verifies legacy advisor keys. It never opens `sk-doc/mode-registry.json`, `sk-doc/hub-router.json`, packet resources, playbook fixtures, or benchmark output. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts:26] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts:55] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts:144] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts:207]

`parent-skill-check` does not execute a hub-declared drift guard. Check 4a only verifies that the declared guard path exists; its dynamic advisor comparison is global-owner-specific or checks that non-owner lexical ids appear in the global map. [SOURCE: .opencode/commands/doctor/scripts/parent-skill-check.cjs:632] [SOURCE: .opencode/commands/doctor/scripts/parent-skill-check.cjs:650] [SOURCE: .opencode/commands/doctor/scripts/parent-skill-check.cjs:652] [SOURCE: .opencode/commands/doctor/scripts/parent-skill-check.cjs:685]

First missing check: a hub-scoped executable guard contract. For `sk-doc`, the declared test must be run against the hub and must state which projection it protects; path existence alone is not evidence that `sk-doc` registry/router parity was tested.

### 2. Registry/router key equality is covered by the generic parent validator

`parent-skill-check` check 5b performs the needed bidirectional set comparison between registry `workflowMode` values and `hub-router.json > routerSignals` keys. It reports both missing and stray signals. Check 5c then verifies that every signal's vocabulary-class key exists. [SOURCE: .opencode/commands/doctor/scripts/parent-skill-check.cjs:693] [SOURCE: .opencode/commands/doctor/scripts/parent-skill-check.cjs:718] [SOURCE: .opencode/commands/doctor/scripts/parent-skill-check.cjs:721] [SOURCE: .opencode/commands/doctor/scripts/parent-skill-check.cjs:730]

`scanHubRegistry` overlaps but is weaker at this boundary: it walks registry modes and detects a missing packet, signal, or referenced vocabulary class, but that loop does not reject a router-only stray mode. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/d5-connectivity.cjs:183] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/d5-connectivity.cjs:218]

Boundary verdict: covered, with `parent-skill-check` 5b as the first complete equality check. No new equality check is needed; the gap is ensuring this validator is part of the required `sk-doc` gate rather than conflating it with the advisor projection test.

### 3. First-layer resource and packet existence are covered, but identity is not

Registry packets are required to resolve to existing direct child directories, packet `SKILL.md` files are checked by the benchmark registry scan, and parent check 5d verifies that signal/default resource strings resolve on disk from the hub root. [SOURCE: .opencode/commands/doctor/scripts/parent-skill-check.cjs:314] [SOURCE: .opencode/commands/doctor/scripts/parent-skill-check.cjs:330] [SOURCE: .opencode/commands/doctor/scripts/parent-skill-check.cjs:733] [SOURCE: .opencode/commands/doctor/scripts/parent-skill-check.cjs:746] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/d5-connectivity.cjs:196] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/d5-connectivity.cjs:218]

These are existence checks only. They cannot distinguish an internal hub load address from a public leaf identifier when both strings happen to resolve, and they do not attach a path type or coordinate system to the value.

First missing check: immediately after existence, validate a declared path role and namespace, such as `hubLoadAddress` versus `leafResourceId`, then reject a value whose prefix/coordinate frame does not match that role. This is the first guard that would catch the four confirmed wrong-root handoff rows.

### 4. No validator proves second-layer leaf coverage for a parent hub

`parent-hub-vocab-sync` enters each packet only to parse intent-signal keywords and assign vocabulary ownership; it does not validate the packet's `RESOURCE_MAP` paths or expose their leaf inventory to the hub. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/parent-hub-vocab-sync.cjs:191] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/parent-hub-vocab-sync.cjs:220]

The D5 orphan inventory is also root-local: `listMarkdownRefs(skillRoot)` recursively scans only that root's `references/` and `assets/` directories. When invoked for `sk-doc`, it does not enumerate `create-*` packet leaves or `shared/` leaves. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/d5-connectivity.cjs:53] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/d5-connectivity.cjs:68] The live hub and emitted parent-hub template stop at packet `SKILL.md` entrypoints, which iteration 4 already established. [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/010-sk-doc-routing-research/research/iterations/iteration-004.md:53] [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/010-sk-doc-routing-research/research/iterations/iteration-004.md:57]

First missing check: for every registered packet, run a packet-root connectivity scan and project the reachable leaf ids into a hub-level manifest using the declared public namespace. Then compare expected leaves and routed leaves to that manifest. Without that recursive projection, six missing-leaf rows remain invisible to structural validation.

### 5. Fixture gold is scored without a topology-validity gate

The playbook loader extracts expected path strings and returns them as `expectedResources`; the benchmark runner then dispatches each scenario and passes the scenario directly to `scoreScenario`. D5 runs against the skill/router before scenarios, but no step between playbook loading and scoring resolves each expected leaf against the current hub-plus-packet topology. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:230] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:257] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:137] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:162] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:193]

That missing gate explains why `SD-020` can retain `assets/changelog_template.md` while the physical asset is `shared/assets/changelog_template.md`; the current model's hub-root path is topologically real, while the gold is legacy/virtual. [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/010-sk-doc-routing-research/research/iterations/iteration-004.md:41] [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/010-sk-doc-routing-research/research/iterations/iteration-004.md:45]

First missing check: before dispatch, normalize every positive gold path through the same namespace manifest used for routed output and fail fixture validation if the path is absent, ambiguous, or only resolves through an undeclared legacy alias.

### 6. Execution-time provenance is insufficient to reconstruct contradictory rows

The runner aggregates scored rows and writes the report, but does not persist a run-level snapshot of the exact normalized gold, scenario source hash/path, hub/registry hash, or full normalized observed route. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:210] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:216] Retained live rows preserve `responseHead`, which is truncated evidence, and omit the exact execution-time gold join. This is why current `SD-016` gold and the retained response can appear to agree while the stored report says zero recall. [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/010-sk-doc-routing-research/research/iterations/iteration-004.md:47] [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/010-sk-doc-routing-research/research/iterations/iteration-004.md:51]

First missing check: at the score join, persist and hash the normalized expected route and normalized observed route, plus the scenario file, router, registry, and leaf-manifest identities. Report emission should reject a scored row that lacks this provenance block rather than retaining an unreconstructable score.

### Boundary matrix

| Boundary | First effective check | Verdict | First missing check |
|---|---|---|---|
| Registry modes ↔ router signal keys | `parent-skill-check` 5b | Covered bidirectionally | Require this generic hub gate in `sk-doc`'s validation path; do not treat advisor drift-guard presence as equivalent. |
| Packet and hub resource existence | parent checks 3c/5d; D5 `scanHubRegistry` | Covered at first layer | Validate path role/namespace after existence. |
| Root-relative vs packet-relative output | None | Missing | Typed path roles plus canonical public leaf namespace. |
| Second-layer leaf coverage | None; current scans stop at hub root or packet keywords | Missing | Recursively project packet/shared leaves into a hub manifest and validate coverage. |
| Fixture/gold ↔ current topology | None between playbook extraction and scoring | Missing | Pre-dispatch gold normalization and topology validation. |
| Execution-time provenance | Partial `responseHead` only | Missing | Persist exact normalized gold/observation and source/config hashes; fail closed if absent. |

## Questions Answered

- **Q4:** Answered. The named `routing-registry-drift-guard` protects only `system-deep-loop`'s advisor projections. Generic parent-hub validation separately covers bidirectional registry/router keys and first-layer existence. No current guard checks output namespace semantics, recursive packet-leaf coverage, fixture-to-topology validity, or sufficient execution-time provenance. The first missing check at each boundary is identified above.

## Questions Remaining

- **Q5:** Convert the six boundary results into a prioritized implementation sequence across `hub-router.json`, `mode-registry.json`, the absent `command-metadata.json`, create-skill teaching/templates, a second-layer leaf manifest/router, bundle caps, fixture validation, and benchmark provenance.

## Sources Consulted

- `.opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts`
- `.opencode/commands/doctor/scripts/parent-skill-check.cjs`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/parent-hub-vocab-sync.cjs`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/d5-connectivity.cjs`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs`
- Tier-2 report rows `SD-016` and `SD-020`, plus iteration 4's topology/provenance join.

## Assessment

- New information ratio: **0.86**.
- Novelty justification: this iteration separates three validators that were previously conflated, establishes exactly which two boundaries are covered, and locates the first absent enforcement point for four uncovered semantic/evidence boundaries.
- Status: **complete** for Q4.
- Confidence: high for guard scope, key equality, existence, and second-layer coverage gaps; high for the absence of a pre-score topology gate; medium-high for the minimum provenance design because the required snapshot fields are an implementation recommendation, while the retained-evidence gap itself is confirmed.

## Reflection

- What worked: treating each boundary as a separate contract prevented a passing existence check from being mistaken for path correctness or leaf discoverability.
- Ruled out: `routing-registry-drift-guard` as a universal hub validator; it is a fixed `system-deep-loop` advisor-projection test.
- Ruled out: top-level D5 orphan coverage as proof of nested packet coverage; its inventory starts only at the supplied root's `references/` and `assets/` trees.

## SCOPE VIOLATIONS

- Implementing the missing guards would modify researched validators, hub config, create-skill templates, benchmark fixtures, or runner output outside the allowed write fence. Those would-be mutations are recorded as findings only; none were executed.
- The reducer-owned strategy currently points to Q5 while this frozen dispatch assigned Q4. No reducer-owned file was changed; the workflow reducer can reconcile the state after consuming this iteration delta.

## Next Focus

Answer Q5 by ranking fixes in dependency order: canonical path types/namespace first, recursive leaf manifest and fixture validation second, bundle caps third, and execution-provenance fail-closed checks alongside gold cleanup. Tie each item to the 6 wrong-root, 6 missing-leaf, 5 over-bundle, and 2 clean benchmark classes without collapsing distinct causes.
