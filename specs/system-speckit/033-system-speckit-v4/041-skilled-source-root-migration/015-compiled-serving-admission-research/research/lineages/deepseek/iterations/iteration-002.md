---
title: "Iteration 2: Can compiledRoute() + Routing Gold Serve as the Admission Bar?"
trigger_phrases: []
---

# Iteration 2: Can compiledRoute() + Routing Gold Serve as the Admission Bar?

## Focus

Q2 — test whether the live `compiledRoute(hubId, taskText)` decision, checked against each routing
scenario's gold (`expected_workflow_mode`, `expected_leaf_resources`), can serve as the admission bar,
and decide how `defer`, holdout and negative scenarios should count.

## Findings

### F2.1 — The typed-gold corpus is live, bounded, and unevenly distributed

Across the five admitted hubs, 74 playbook scenario files carry `expected_workflow_mode` and
`expected_leaf_resources`:

| Hub | Scenarios with typed gold | Concrete mode | `defer` | `UNKNOWN` |
| --- | --- | --- | --- | --- |
| `sk-code` | 1 | 1 | 0 | 0 |
| `system-deep-loop` | 21 | 18 | 0 | 3 |
| `mcp-tooling` | 16 | 15 | 1 | 0 |
| `cli-external-orchestration` | 10 | 5 | 1 | 4 |
| `sk-doc` | 26 | 25 | 0 | 1 |
| **Total** | **74** | **64** | **2** | **8** |

Counted with `grep -rh "^expected_workflow_mode:"` over each hub's `manual-testing-playbook/`.
The corpus exists and is machine-readable, but `sk-code` contributes a single scenario
(`CB-CR-001`), so the playbook corpus alone is a thin admission bar for that hub — and any new hub
would arrive with whatever corpus its authors write, which is an admission-policy question, not a
tooling question.

[SOURCE: `.skilled/skills/sk-code/manual-testing-playbook/compiled-routing/surface-bundle-compiled-routing.md:1-16`]
[SOURCE: `.skilled/skills/mcp-tooling/manual-testing-playbook/hub-routing/ambiguous-defer.md:1-12`]
[SOURCE: `.skilled/skills/system-deep-loop/manual-testing-playbook/advisor-integration/no-false-fire-code-edit.md:1-8`]

### F2.2 — `compiledRoute()` alone is insufficient: the live shape bridge is still present and required

`compiledRoute()` returns `{ hubId, action, selectionKind, targets, effectivePolicyHash, generation }`
where `targets` are **qualified id strings only** — no leaves, no resources. Checking
`expected_leaf_resources` therefore requires resolving each target through the live shared contract
`qualifiedIdToLeaf(qualifiedId, { modeIndex })` at
`.skilled/skills/sk-doc/sk-create-skill/scripts/lib/leaf-resource-contract.cjs:435-467`, with a
`modeIndex` built from each destination hub's live `leaf-manifest.json` and `mode-registry.json`
(both present; e.g. `mcp-tooling/leaf-manifest.json` declares 9 modes with leaves).
The function fails closed (`ok:false`, named code) and never throws, so a bridge failure can be
counted rather than swallowed. Feasibility: **yes — every dependency the bridge needs is live.**

Two caveats the retired harness already encoded:

1. A qualified id parsed without a `modeIndex` returns `mode:null`; only with the manifest index does
   the target resolve to a `workflowMode`.
2. The comparison it enables is mode-granular: `expected_leaf_resources ⊆ mode.leaves` (must-include),
   not the task-scoped leaf subset legacy assembles at request time. The compiled engine selects the
   mode; the retained legacy surface layer selects leaves within it. A checker must state this
   explicitly or it will over-claim.

[SOURCE: `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs:94-106`]
[SOURCE: `.skilled/skills/sk-doc/sk-create-skill/scripts/lib/leaf-resource-contract.cjs:415-467`]
[SOURCE: `compiled-routing-parity.cjs:301-350` (the retired bridge this mirrors) at `b45ea54cea3^`]

### F2.3 — Action vocabulary is wider than the gold vocabulary and must be defined by the checker

The compiled engine's decision contract emits `route`/`clarify`/`defer`/`reject`; the legacy replay
projection only ever emits `route`/`defer` (`normalizeLegacyProjection` maps empty targets to `defer`).
The retired harness compared raw action strings, so a compiled `clarify` was already a projection
mismatch against legacy's `defer`. A gold-only checker must therefore define the mapping itself:
the gold vocabulary is `defer`, `UNKNOWN`, and concrete modes; all non-route actions must map to the
"no route" outcome for `defer`/`UNKNOWN` gold, and must fail for concrete-mode gold. The engine's own
canary corpus shows all four actions in play: across the five hubs' `canary-cases.v1.json`,
50 cases expect `route`, 7 `defer`, 7 `reject`, 3 `clarify`.

[SOURCE: `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs:92-106`]
[SOURCE: `compiled-routing-parity.cjs:418-452` at `b45ea54cea3^`]
[SOURCE: `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/*/fixtures/canary-cases.v1.json` — action histogram]

### F2.4 — Defer must count as an assertion, not be excluded

There are exactly 2 defer scenarios in the admitted corpus (`mcp-tooling` MT-004 and one
`cli-external-orchestration` scenario; gold `expected_workflow_mode: defer`, `expected_leaf_resources: []`).
A defer scenario asserts a **negative**: an ambiguous prompt must not silently route. Correct scoring
mirrors the retired `scoreHubRoute`:

- compiled emits a living route → `wrong-mode` fail (over-detection);
- compiled emits no route → pass for defer/UNKNOWN gold;
- concrete-mode gold with no compiled route → `silent-default` fail.

Excluding defer scenarios would be worse than including them (they are 2 of 74 and they pin the
conservative half of the contract), but including them alone is not sufficient: a degenerate
always-defer engine passes both defer scenarios and fails the 64 concrete ones, which is the intended
trade.

[SOURCE: `.skilled/skills/mcp-tooling/manual-testing-playbook/hub-routing/ambiguous-defer.md:1-12,29-34`]
[SOURCE: `score-skill-benchmark.cjs:980-1040` (`scoreHubRoute` defer/silent-default) at `b45ea54cea3^`]

### F2.5 — Holdout and negative scenarios: count in the verdict, report the partition, never exclude silently

- **Holdout** — 19 scenarios across the admitted hubs (`mcp-tooling` 7, `cli-external-orchestration` 2,
  `sk-doc` 10); their files declare `blindToRouterKeywords: true` plus `blindExceptions`. The retired
  scorer's partition: fitted = routing + negative, holdout excluded from the headline aggregate, and
  `generalizationGap = fitted − holdout`. Admission should require zero drift on **all** stages and
  report the gap as a quality signal — a hub that fails only holdout is overfit, a hub that fails
  routing but passes holdout is broken, and both are real admission failures.
- **Negative** — 2 scenarios in the admitted corpus (both `system-deep-loop`; e.g. `AI-004` with
  `expected_workflow_mode: UNKNOWN`, `expected_leaf_resources: []`): a suppression test. Pass = no
  route and no forbidden mode. The loader converted `stage: negative` to `negativeActivation: true`.
- **UNKNOWN** — 8 scenarios. The frozen scorer's `REJECTION_INTENT_LABELS = none|defer|unknown` maps
  them to the empty expected-intent set; a checker that treated `UNKNOWN` as "no gold" would silently
  drop 8 of 74 assertions.

[SOURCE: `.skilled/skills/mcp-tooling/manual-testing-playbook/hub-routing/holdout-design-tokens.md:1-17`]
[SOURCE: `load-playbook-scenarios.cjs:556-616` (stage parse, negativeActivation) at `b45ea54cea3^`]
[SOURCE: `score-skill-benchmark.cjs:874-876,1623-1685` at `b45ea54cea3^`]

### F2.6 — The canary fixtures are a compiled-native corpus, not an admission oracle

Each shadow child ships `fixtures/canary-cases.v1.json` (10 + 9 + 14 + 13 + 21 = 67 cases) carrying
`expectedAction`, `expectedReason`, `expectedSelectionKind`, `expectedModes` and
`gold.expectedIntents/expectedResources`. These validate the engine's own behavior (including
defer reasons `no-match` and `dependency-failure` and calibration certificate fixtures), but they are
compiled expectations authored for the engine — not the legacy-authored routing gold. They cannot by
themselves measure "new hub is compiled-equivalent to legacy"; they can supplement the typed-gold
corpus (especially for defer/reject coverage, where the playbook corpus has only 2 + 8 assertions).

[SOURCE: `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json:35-70`]
[SOURCE: `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/003-mcp-tooling/fixtures/canary-cases.v1.json` — `zero-signal-defer` case]

### F2.7 — The semantic gap: a gold-only checker loses the independent legacy side

Lane C compared **two observations plus gold**: it classified a shared gold failure on matching
routing as parity, not drift. A `compiledRoute`-vs-gold checker has only one observation. Two
consequences:

1. If legacy itself disagrees with the authored gold, the retired harness would still have shown
   parity (both sides fail the same gold row); the new checker fails compiled. The new bar is
   therefore *stricter against gold* and *blind to legacy drift*.
2. If the gold is stale (a renamed resource), the new checker fails a compiled engine that is
   byte-identical to legacy; Lane C would have named it a `route-gold-failure` drift on both sides.

This does not disqualify Path B, but it changes what "admission" means: from "compiled mirrors
legacy" to "compiled satisfies the authored routing contract". A build phase must choose the bar
knowingly, ideally asserting both the mode-level equality and an explicit corpus-coverage floor.

[SOURCE: `compiled-routing-parity.cjs:675-705` (`compiledGoldPass === legacyGoldPass`) at `b45ea54cea3^`]
[SOURCE: `compiled-routing-architecture.md:64-70` — "its compiled decision must match its legacy decision on every scenario ... zero drift"]

## Ruled-Out Directions

- **Scoring `expected_leaf_resources` directly against `compiledRoute().targets` without the manifest
  bridge** — targets are qualified ids with a synthetic trailing identity (`<hub>/<mode>/<packet>/<kind>/<slug>`),
  not leaf paths; a string comparison would fail every scenario. Ruled out by F2.2.
- **Treating `UNKNOWN`/`defer` gold as "no gold" and skipping** — would drop 10 of 74 assertions and
  erase the conservative half of the contract. Ruled out by F2.4/F2.5.

## Open Threads Carried Forward

- Iteration 3: inventory the admission machinery that is *not* the check — frozen `HUB_CHILD` /
  `DEFAULT_ON_HUBS`, manifest re-mint (`compiled-route-manifest.cjs mint`/`freshness`),
  `compiled-route-guard.cjs` freshness, `serving-closure.manifest.json`, and doc/code drift
  (architecture doc cites `011-runtime-engine`/`006-parent-hub-rollout`/seven hubs where live code
  says `014`/`009`/five).
- Iteration 4: price the three paths against this evidence.

## Quality Note

Corpus counts were produced by deterministic `grep -r` over the live tree; every structural claim is
cited to a live file or to the retired module at `b45ea54cea3^`. No writes outside the lineage.
