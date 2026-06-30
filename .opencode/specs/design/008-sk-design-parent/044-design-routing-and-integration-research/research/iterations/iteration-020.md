# Iteration 20: Registry Source-Of-Truth Runtime Boundary

## Focus

[D3-A3 / D3] registry-as-source-of-truth is fictional at runtime: the advisor does not read `mode-registry.json` for mode selection, and `sk-design` has no hub executable. This pass resolves the contradiction between "never hardcode a router mapping" and the currently hardcoded `interface` default.

This pass does not re-cover D2 command wrapper metadata, command tool grants, the missing parseable hub router from iteration 18, or content-bound utilization proof from iteration 19. It narrows the problem to source-of-truth ownership and enforceable projections.

## Actions Taken

1. Re-read iterations 18 and 19 plus the current strategy questions to avoid repeating the hub-router and proof-card findings. [SOURCE: .opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/iterations/iteration-018.md:18] [SOURCE: .opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/iterations/iteration-019.md:18] [SOURCE: .opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/deep-research-strategy.md:36]
2. Read the live `sk-design` hub, `mode-registry.json`, graph metadata, and context-loading contract to separate registry identity, routing prose, graph-advisor metadata, and hard gates. [SOURCE: .opencode/skills/sk-design/SKILL.md:41] [SOURCE: .opencode/skills/sk-design/SKILL.md:56] [SOURCE: .opencode/skills/sk-design/SKILL.md:88] [SOURCE: .opencode/skills/sk-design/mode-registry.json:4] [SOURCE: .opencode/skills/sk-design/graph-metadata.json:133] [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:46]
3. Read the skill-advisor indexer, projection, freshness, watcher, and alias-layer code to verify whether the advisor reads `mode-registry.json` semantics at runtime. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:658] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/projection.ts:191] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/freshness.ts:148] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/daemon/watcher.ts:228] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:71]
4. Checked the current executable surface under `sk-design` and replayed the benchmark router against the parent hub. The skill root has only `graph-metadata.json` and `mode-registry.json` at max depth 2 for executable/config files, and `router-replay.cjs` still returns `parseable:false` on the parent. [SOURCE: command output from local `find`, iteration 20] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/router-replay.cjs:12] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/router-replay.cjs:166] [SOURCE: command output from local router replay, iteration 20]

## Findings

### Finding 1: `mode-registry.json` is an identity registry, not the runtime source of truth it claims to be

Severity: P1. Label: ENFORCEABLE for static/projection tests; ADVISORY for open-ended live prompt interpretation.

The hub states that routing is registry-driven, calls `mode-registry.json` the single source of truth, and says the hub reads it rather than re-deriving the mapping. [SOURCE: .opencode/skills/sk-design/SKILL.md:41] The registry itself immediately narrows that claim: it is the source for the discriminator plus advisorRouting projection, while "the advisor does not read this file at runtime." [SOURCE: .opencode/skills/sk-design/mode-registry.json:4] Its concrete rows provide mode identity, backend kind, packet path, aliases, and `advisorRouting`; they do not provide weights, default mode, ambiguity threshold, mode-pair ordering, or a runnable classifier. [SOURCE: .opencode/skills/sk-design/mode-registry.json:14] [SOURCE: .opencode/skills/sk-design/mode-registry.json:16] [SOURCE: .opencode/skills/sk-design/mode-registry.json:18] [SOURCE: .opencode/skills/sk-design/mode-registry.json:21] [SOURCE: .opencode/skills/sk-design/mode-registry.json:22]

The runtime facts match the narrower reading. `sk-design` has no parent hub executable under the skill root; the current benchmark router extracts `INTENT_SIGNALS`, `RESOURCE_MAP`, and `DEFAULT_RESOURCE` from `SKILL.md` or a referenced markdown router, and it returns `parseable:false` for the parent hub because those maps do not exist there. [SOURCE: command output from local `find`, iteration 20] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/router-replay.cjs:12] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/router-replay.cjs:144] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/router-replay.cjs:260] [SOURCE: command output from local router replay, iteration 20]

Buildable recommendation: stop treating "single source of truth" as "the live runtime reads this file." Define three explicit layers instead:

- `mode-registry.json`: authoritative source for mode identity, packet paths, backend kind, aliases, and router policy.
- Generated projections: `graph-metadata.json.derived.*`, `/design:*` wrappers, and benchmark fixtures are derived from or drift-checked against the registry.
- Runtime surfaces: advisor wakes the single `sk-design` identity; the hub or command surface consumes the generated projection to pick mode(s).

This is enforceable by a projection test that loads `mode-registry.json`, generated graph metadata, `/design:*` command files, and hub-router fixtures, then fails on missing modes, stale aliases, stale default, or packet-path drift.

### Finding 2: The "never hardcode" rule conflicts with a prose-only hardcoded default

Severity: P1. Label: ENFORCEABLE.

The rules say to always resolve a mode through `mode-registry.json` and never hardcode a router mapping in the hub. [SOURCE: .opencode/skills/sk-design/SKILL.md:88] Two lines later, the same rules hardcode the generic-design fallback: default to `interface` when no other axis dominates. [SOURCE: .opencode/skills/sk-design/SKILL.md:92] The routing section repeats the same default and mode-pairing policy in prose. [SOURCE: .opencode/skills/sk-design/SKILL.md:56]

That default is not represented in the registry. The registry lists the `interface` row and aliases, but there is no `routerPolicy.defaultMode`, `modeHintOverrides`, `ambiguityPolicy`, or multi-axis policy field. [SOURCE: .opencode/skills/sk-design/mode-registry.json:14] [SOURCE: .opencode/skills/sk-design/mode-registry.json:16] [SOURCE: .opencode/skills/sk-design/mode-registry.json:21] [SOURCE: .opencode/skills/sk-design/mode-registry.json:75]

Buildable recommendation: move the default into a parseable registry router policy rather than prose:

```json
{
  "routerPolicy": {
    "defaultMode": "interface",
    "hintOverride": true,
    "ambiguityPolicy": "return_bundle_for_separate_axes_else_defer",
    "maxBundleModes": 3
  },
  "routerSignals": {
    "interface": { "weight": 3, "phrases": ["make it look good", "redesign the ui", "visual design"] }
  }
}
```

Then revise the rule to: "Never hand-hardcode router mappings outside the registry projection; generated defaults are allowed only when drift-checked." This resolves the contradiction because `interface` remains the default, but the default becomes data.

### Finding 3: The advisor can notice `mode-registry.json`, but it does not consume its content as routing policy

Severity: P1. Label: ENFORCEABLE.

`sk-design` graph metadata declares `mode-registry.json` as a derived key file. [SOURCE: .opencode/skills/sk-design/graph-metadata.json:133] The watcher honors derived key files as watch targets. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/daemon/watcher.ts:228] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/daemon/watcher.ts:242] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/daemon/watcher.ts:244] The advisor projection also includes `derived.key_files` and `derived.source_docs` as phrase variants in `derivedKeywords`. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/projection.ts:204] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/projection.ts:216] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/projection.ts:219]

That still does not make the registry a runtime mode router. The skill-graph indexer discovers and reads `graph-metadata.json` files, parses `intent_signals` and `derived`, and stores those fields. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:847] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:860] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:869] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:677] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:678] The projection reads `SKILL.md` and graph metadata, then scores against frontmatter description, keywords, domains, intent signals, derived triggers, and derived keywords. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/projection.ts:191] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/projection.ts:193] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/projection.ts:195] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/projection.ts:223] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/projection.ts:230] It does not parse `mode-registry.json.modes[].aliases` or `routerPolicy` because no such registry-reading path exists in the projection.

Buildable recommendation: keep advisor responsibility narrow. Do not make advisor pick `interface` versus `motion`; that belongs to the hub layer. Instead, add a registry-to-advisor projection generator or validator that ensures:

- every registry alias that should wake design work appears in graph metadata derived trigger phrases or `SKILL.md` keywords;
- `graph-metadata.json.derived.key_files` includes the registry for freshness;
- the advisor still returns only the single `sk-design` identity;
- hub-router replay, not advisor scoring, proves the selected `workflowMode`.

This is deterministically enforceable on a fixture corpus: prompts should activate `sk-design`, then hub fixtures should route to expected modes.

### Finding 4: The existing benchmark gate enforces router parseability, but needs a registry-router adapter for parent hubs

Severity: P2. Label: ENFORCEABLE.

The current D5 connectivity gate is built around the packet-router shape: paths in `RESOURCE_MAP`, keys in `INTENT_SIGNALS`, path containment, orphan references, and a P0 when the router cannot be parsed. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/d5-connectivity.cjs:10] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/d5-connectivity.cjs:12] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/d5-connectivity.cjs:15] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/d5-connectivity.cjs:125] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/d5-connectivity.cjs:128]

That gate is still useful, but the parent hub is a different shape: it needs prompt-to-`workflowMode` projection, not resource-list replay. The hub's current `parseable:false` result is a true failure for "hub router replay," but the remedy should not be to stuff all nested resources into the parent hub. The hub should expose or generate a registry router projection, and packet routers should remain inside each selected packet.

Buildable recommendation: add a `hub-registry-router` benchmark mode:

- input: `mode-registry.json`, hub `SKILL.md`, optional command metadata, and a fixture corpus;
- checks: registry schema, default mode, hint override, mode aliases, ambiguity policy, packet existence, command path parity, graph metadata alias parity;
- output: `{activatedSkill:"sk-design", workflowMode, packet, routeTrace, deferReason?}`;
- next gate: run existing packet `router-replay.cjs` against the selected packet only.

This makes the source-of-truth line enforceable without collapsing the hub and packet responsibilities.

## Questions Answered

- Q2/D3: Parent-to-sub-skill routing cannot be made truthful by saying the registry is a live runtime source. It becomes provable by making the registry own a parseable router policy and validating generated projections: advisor activation, hub mode selection, command wrappers, and packet router replay.
- Q5/all: Enforceable items are registry schema, projection drift, advisor single-identity activation, default-mode fixture replay, packet-path existence, command wrapper parity, and selected-packet router parseability. Advisory items are final taste judgment and open-ended live prompt interpretation outside the fixture corpus.

## Questions Remaining

- Should `routerPolicy` live directly in `mode-registry.json`, or should the registry stay identity-only and generate a sibling `hub-router.json`?
- Should registry aliases be the same strings used for advisor activation, or should aliases split into `wakeAliases` and `modeAliases` to avoid over-triggering the parent skill?
- Should the benchmark harness own the registry-router adapter generically for parent hubs, or should `sk-design` own a local adapter until another hub needs the same shape?

## Next Focus

Continue D3 by designing the projection-check contract: exact schema fields, fixture format, and drift failures that connect `mode-registry.json`, graph metadata, `/design:*` commands, and selected packet router replay without making the advisor responsible for mode selection.

Assessment: newInfoRatio 0.66. Novelty is moderate-high: iteration 18 found the unparseable hub router, while this pass pins the runtime source-of-truth boundary, distinguishes watched key files from consumed routing policy, and resolves the hardcoded-default contradiction into a generated projection contract.
