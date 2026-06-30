# Iteration 23: Registry Completeness And Alias-Collision Static Audit

## Focus

[D3-A6 / D3] Registry completeness plus alias-collision static audit for `sk-design`: every mode reachable, no alias owned by two modes, and a first-pass uncovered-intent rate over the local repo corpus.

This does not re-cover the prior D3 findings that the parent hub lacks a parseable registry router, that ambiguity needs ordered bundles, or that transport skills must rank below taste authority. This pass narrows to the static audit that should sit underneath those later router and benchmark gates.

## Actions Taken

1. Re-read the previous D3 iteration narratives and the active strategy so this pass stayed on registry completeness rather than source-of-truth or ambiguity policy.
2. Read the live `sk-design` hub and registry to compare declared modes, packet paths, backend kinds, packet skill names, and alias ownership. [SOURCE: .opencode/skills/sk-design/SKILL.md:23] [SOURCE: .opencode/skills/sk-design/SKILL.md:29] [SOURCE: .opencode/skills/sk-design/SKILL.md:68] [SOURCE: .opencode/skills/sk-design/SKILL.md:76] [SOURCE: .opencode/skills/sk-design/mode-registry.json:14] [SOURCE: .opencode/skills/sk-design/mode-registry.json:75]
3. Read the shared context-loading contract to see where mode bundles and proof manifests would consume a registry-backed route result. [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:48] [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:65] [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:138] [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:150]
4. Read the deep-improvement benchmark scripts to check whether any existing static gate already understands a hub `mode-registry.json`, alias collisions, or uncovered mode intents. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/d5-connectivity.cjs:10] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/d5-connectivity.cjs:16] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/router-replay.cjs:10] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/router-replay.cjs:17] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:16] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:25]
5. Ran a local static audit over `mode-registry.json`, packet `SKILL.md` files, and the hub keyword projection. The audit checked packet existence, packet skill names, duplicate normalized aliases, and normalized coverage of hub keywords by registry aliases.

## Findings

### Finding 1: The current registry passes the narrow structural completeness check

Severity: P2. Label: ENFORCEABLE.

The hub declares exactly five design modes: `interface`, `foundations`, `motion`, `audit`, and `md-generator`. [SOURCE: .opencode/skills/sk-design/SKILL.md:23] [SOURCE: .opencode/skills/sk-design/SKILL.md:29] The registry also carries five rows, one for each mode, with `workflowMode`, `backendKind`, `packet`, `packetSkillName`, aliases, and an `advisorRouting.packetSkillName`. [SOURCE: .opencode/skills/sk-design/mode-registry.json:14] [SOURCE: .opencode/skills/sk-design/mode-registry.json:21] [SOURCE: .opencode/skills/sk-design/mode-registry.json:27] [SOURCE: .opencode/skills/sk-design/mode-registry.json:33] [SOURCE: .opencode/skills/sk-design/mode-registry.json:39] [SOURCE: .opencode/skills/sk-design/mode-registry.json:45] [SOURCE: .opencode/skills/sk-design/mode-registry.json:51] [SOURCE: .opencode/skills/sk-design/mode-registry.json:57] [SOURCE: .opencode/skills/sk-design/mode-registry.json:63] [SOURCE: .opencode/skills/sk-design/mode-registry.json:69]

The local audit found:

- mode count: 5
- packet `SKILL.md` existence: 5/5
- packet `name:` matches registry `packetSkillName`: 5/5
- normalized alias collisions across registry modes: 0
- alias counts: `interface` 10, `foundations` 17, `motion` 9, `audit` 8, `md-generator` 12

This means the first static gate can be simple and deterministic: load the registry, require the five hub table modes to match registry rows, require every packet path to exist, require packet `name:` parity, require valid `backendKind`, and fail on any alias with more than one owner.

Buildable recommendation: add a registry audit step before hub-router replay, either as `sk-design/scripts/design-registry-audit.cjs` or as a generic `skill-benchmark` hub-registry adapter. Its output should include `modeCoverage`, `packetReachability`, `packetNameParity`, `aliasOwnerMap`, and `aliasCollisionCount`. This gate is fully deterministic on the repo checkout.

### Finding 2: The registry alias layer is much narrower than the hub keyword projection

Severity: P1. Label: ENFORCEABLE for a declared static corpus; ADVISORY for live natural-language intent outside that corpus.

The hub's frontmatter description and keyword projection advertise a broad design vocabulary: taste, visual direction, custom UI, polish, theme/audit terms, motion terms, and extraction terms. [SOURCE: .opencode/skills/sk-design/SKILL.md:3] [SOURCE: .opencode/skills/sk-design/SKILL.md:11] The registry's alias arrays are shorter and mode-owned; for example, `interface` owns ten aliases, `foundations` owns seventeen, `motion` owns nine, `audit` owns eight, and `md-generator` owns twelve. [SOURCE: .opencode/skills/sk-design/mode-registry.json:21] [SOURCE: .opencode/skills/sk-design/mode-registry.json:33] [SOURCE: .opencode/skills/sk-design/mode-registry.json:45] [SOURCE: .opencode/skills/sk-design/mode-registry.json:57] [SOURCE: .opencode/skills/sk-design/mode-registry.json:69]

Using the hub keyword comment as the only existing local intent corpus, and excluding six infrastructure tokens (`sk-design`, `design-family`, `mode-registry`, `workflowmode`, `backendkind`, `reference-base`), the static audit found 101 projected keywords. Normalized exact-or-substring matching against registry aliases covered 54 and left 47 uncovered, for a raw uncovered projection rate of 46.5%.

Representative uncovered terms include `polish`, `theming`, `design-taste`, `visual-direction`, `make-it-beautiful`, `hover-effect`, `scroll-animation`, `choreography`, `interaction-feel`, `design-review`, `wcag-contrast`, `css-extraction`, `tokens.json`, and `playwright`.

That raw rate is not an end-user miss-rate. Several uncovered terms are tool/file/wake tokens that should not necessarily become mode aliases. The finding is that the repo has no parseable classification separating:

- `wakeAliases`: phrases that should activate the parent `sk-design` identity;
- `modeAliases`: phrases that should choose exactly one mode;
- `bundleAliases`: phrases that should choose an ordered mode bundle;
- `nonRoutingKeywords`: implementation, file, or compatibility terms that should not count against mode coverage.

Buildable recommendation: extend the registry or a sibling `hub-router.json` with typed alias classes and a `coverageCorpus` section. Then compute three rates separately: parent wake coverage, mode-owned alias coverage, and fixture uncovered-intent rate. Make duplicate mode ownership a hard failure, and make uncovered fixture intents a hard failure unless marked `nonRoutingKeyword` or `deferExpected`.

### Finding 3: The current benchmark hard gate cannot see registry completeness or alias collisions

Severity: P1. Label: ENFORCEABLE.

`d5-connectivity.cjs` is a useful hard gate, but it only scans `RESOURCE_MAP` paths, `INTENT_SIGNALS` keys, path escapes, orphan references, and unparseable routers. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/d5-connectivity.cjs:10] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/d5-connectivity.cjs:16] Its implementation parses `SKILL.md` through `parseRouter()` and then compares `RESOURCE_MAP` entries to `INTENT_SIGNALS`. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/d5-connectivity.cjs:92] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/d5-connectivity.cjs:130]

`router-replay.cjs` has the same shape: it extracts `INTENT_SIGNALS`, `RESOURCE_MAP`, and optional default resources, then scores substring keywords and keeps intents within a fixed ambiguity delta. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/router-replay.cjs:10] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/router-replay.cjs:17] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/router-replay.cjs:144] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/router-replay.cjs:167] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/router-replay.cjs:198] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/router-replay.cjs:201]

That means a registry could lose a mode, point at a missing packet, duplicate an alias across two modes, or drop half the hub keyword projection without the current D5 gate naming the right failure. The older `router_unparseable` finding is still true, but D3-A6 needs a different adapter: registry audits before mode-router replay, not packet resource replay.

Buildable recommendation: add `scanHubRegistry({ skillRoot })` next to `scanConnectivity({ skillRoot })`, returning a hard-gated result:

- `missingModes`: hub-declared modes not in the registry;
- `extraModes`: registry rows not declared by the hub;
- `deadPackets`: registry packet paths without `SKILL.md`;
- `packetNameMismatches`: packet `name:` differs from registry `packetSkillName`;
- `aliasCollisions`: normalized alias strings owned by more than one mode;
- `uncoveredIntentRate`: computed only over an explicit local corpus, not over arbitrary live prompts.

This should run before packet-level `router-replay`. If it fails, the benchmark should report `BLOCKED-BY-REGISTRY` rather than `router_unparseable`.

### Finding 4: Context manifests need registry-key validation, not free-text mode proof

Severity: P2. Label: ENFORCEABLE for manifest shape; ADVISORY for final design quality.

The context-loading contract already requires a `MODE BUNDLE LOADED` manifest for design/build decisions, with `interface`, `foundations`, and `audit` fields. [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:48] [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:63] It also says no palette, layout, motion, copy, accessibility, score, release, or readiness claim passes until the files behind the claim are named as loaded. [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:65] The hard-gate table then blocks design decisions, contrast claims, ready claims, audit claims, and adoption claims. [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:138] [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:150]

The missing link is registry-key validation. The manifest names a few mode slots, but it does not say "these slots are valid registry `workflowMode` values" or "every required route mode from the hub-router result appears in the manifest." Once the registry audit and router output exist, the proof card should validate against them rather than accepting free text.

Buildable recommendation: have the future hub router emit `route.workflowModes[]`, then make `proof_check.py --require-route-manifest` validate that every listed `workflowMode` is a current registry mode and has a loaded-file proof row. This is enforceable as a shape/content gate. It still will not prove taste; it proves the right design materials were actually loaded and named.

## Questions Answered

- Q2/D3: Parent-to-sub-skill routing needs a registry audit before router replay. The current registry passes mode reachability and alias collision checks, but the broader hub keyword projection is not typed enough to prove uncovered-intent rate without false positives.
- Q5/all: Enforceable items are mode-row parity, packet existence, packet-name parity, valid backend kind, alias uniqueness, typed alias ownership, explicit corpus uncovered-intent rate, and route-manifest validation. Advisory items are live prompt interpretation outside fixtures and final visual quality.

## Questions Remaining

- Should typed alias classes live in `mode-registry.json`, or should `mode-registry.json` stay identity-focused while a sibling `hub-router.json` owns `wakeAliases`, `modeAliases`, `bundleAliases`, and `nonRoutingKeywords`?
- What should count as the first official uncovered-intent corpus: hub keyword projection, command metadata once generated, or a hand-authored hub-router fixture suite?
- Should `BLOCKED-BY-REGISTRY` be a new benchmark verdict cap, or should registry failures remain D5 structural findings under the existing `BLOCKED-BY-STRUCTURE` cap?

## Next Focus

Move from registry static checks to fixture corpus design: define the minimum hub-router fixture shape that can measure expected single-mode, ordered-bundle, defer, and non-routing outcomes without leaking registry alias strings into public prompts.

## Sources Consulted

- `.opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/iterations/iteration-020.md`
- `.opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/iterations/iteration-021.md`
- `.opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/iterations/iteration-022.md`
- `.opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/deep-research-strategy.md`
- `.opencode/skills/sk-design/SKILL.md`
- `.opencode/skills/sk-design/mode-registry.json`
- `.opencode/skills/sk-design/shared/context_loading_contract.md`
- `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/d5-connectivity.cjs`
- `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/router-replay.cjs`
- `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs`

## Assessment

newInfoRatio: 0.62. Novelty is moderate: earlier D3 work established the missing hub router and benchmark adapter, but this pass adds concrete registry audit metrics, a zero-collision result, and a measured 46.5% raw uncovered hub-keyword projection rate.

Confidence: high for registry row/packet/alias facts because they were read directly from the repo and checked mechanically. Medium for the uncovered-intent rate because the current only-available local corpus is an over-broad hub keyword projection; a typed fixture suite should replace it before treating the number as a real miss rate.

## Reflection

The useful split is "complete enough to be structurally valid" versus "complete enough to be a router corpus." `mode-registry.json` passes the first bar today. It does not yet define the second bar because aliases are untyped and the broader hub vocabulary has no owner/defer/non-routing classification.

Ruled out: treating every hub keyword as a required mode alias. That would inflate the alias set with tool names, file names, and compatibility wake terms, and would make the router noisier rather than more enforceable.
