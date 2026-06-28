# Iteration 29: D3-A12 Four-Copy Intent Vocabulary Drift Gate

## Focus

[D3-A12 / D3] four-copy intent-vocabulary drift across `sk-design` graph metadata, hub `SKILL.md` prose/keywords, `mode-registry.json` aliases, and packet-level `INTENT_SIGNALS`. The goal was to define a drift gate that is buildable and deterministic without pretending all vocabulary copies should be byte-identical.

## Actions Taken

1. Re-read iterations 26-28 and the active strategy so this pass did not re-cover child-boundary proof, the hub-route gold corpus, or the silent `interface` default sink.
2. Read the four live vocabulary copies: graph metadata trigger phrases, hub frontmatter/keywords/routing prose, registry aliases, and packet-level `INTENT_SIGNALS`. [SOURCE: .opencode/skills/sk-design/graph-metadata.json:67] [SOURCE: .opencode/skills/sk-design/SKILL.md:11] [SOURCE: .opencode/skills/sk-design/SKILL.md:41] [SOURCE: .opencode/skills/sk-design/mode-registry.json:21] [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:101]
3. Ran a read-only extraction over the cited sources. It counted 48 graph trigger phrases, 107 hub keyword entries, 56 registry aliases, and 356 packet intent keywords across 35 packet intent keys.
4. Read the existing benchmark enforcement pattern: router replay, D5 connectivity, contamination lint, and the `sk-code` router sync test. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/router-replay.cjs:12] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/d5-connectivity.cjs:8] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/contamination-lint.cjs:70] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/tests/sk-code-router-sync.vitest.ts:5]

## Findings

### Finding 1: The four vocabulary copies are real, but no file declares projection ownership

Severity: P1. Label: ENFORCEABLE for structural drift detection; ADVISORY for deciding whether a new term is good design language.

The hub says routing is registry-driven and calls `mode-registry.json` the single source of truth. [SOURCE: .opencode/skills/sk-design/SKILL.md:41] The registry then stores five mode rows and 56 aliases. [SOURCE: .opencode/skills/sk-design/mode-registry.json:14] [SOURCE: .opencode/skills/sk-design/mode-registry.json:21] [SOURCE: .opencode/skills/sk-design/mode-registry.json:33] [SOURCE: .opencode/skills/sk-design/mode-registry.json:45] [SOURCE: .opencode/skills/sk-design/mode-registry.json:57] [SOURCE: .opencode/skills/sk-design/mode-registry.json:69]

But the advisor-facing metadata is a separate derived list: `graph-metadata.json` carries its own `trigger_phrases` array. [SOURCE: .opencode/skills/sk-design/graph-metadata.json:67] The hub also carries a long HTML keyword projection. [SOURCE: .opencode/skills/sk-design/SKILL.md:11] Packet routers carry their own `INTENT_SIGNALS`, starting with `design-interface` and repeated in the other modes. [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:101] [SOURCE: .opencode/skills/sk-design/design-foundations/SKILL.md:111] [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:121] [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:131] [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:130]

The read-only extraction found concrete drift examples. Registry aliases such as `visual identity`, `ui build`, `design foundations`, `container queries`, `data visualization`, `validate design.md`, and `render design preview` are not all present in graph metadata. Several registry aliases are also absent from the hub keyword line, including `design foundations`, `oklch palette`, `context adaptation`, `data tables`, `create design reference`, and `study design.md format`. Many registry aliases are absent from packet `INTENT_SIGNALS`, including `interface design`, `frontend design`, `motion design`, `animate this`, and `design audit`.

Buildable recommendation: introduce one classified vocabulary contract, preferably as a sibling `hub-router.json` rather than overloading the identity-focused `mode-registry.json`. It should name terms by role:

```json
{
  "vocabulary": {
    "advisorWake": [],
    "modeAliases": { "interface": [], "foundations": [], "motion": [], "audit": [], "md-generator": [] },
    "packetIntentRequired": { "interface": [], "foundations": [], "motion": [], "audit": [], "md-generator": [] },
    "topicKeywords": [],
    "nonRoutingKeywords": []
  },
  "projections": {
    "graphMetadataTriggerPhrases": "mustInclude: advisorWake",
    "hubSkillKeywords": "mustInclude: advisorWake + modeAliases + topicKeywords",
    "modeRegistryAliases": "mustEqual: modeAliases",
    "packetIntentSignals": "mustCover: packetIntentRequired"
  }
}
```

This avoids the wrong gate. Exact set equality would fail valid distinctions: graph metadata needs wake phrases, registry aliases need hub-route gold, and packet routers need resource-loading vocabulary.

### Finding 2: Current benchmark enforcement sees packet routers, not parent-hub vocabulary drift

Severity: P1. Label: ENFORCEABLE.

`router-replay.cjs` is intentionally scoped to an in-skill smart router: it extracts `INTENT_SIGNALS`, `RESOURCE_MAP`, and `DEFAULT_RESOURCE` from a `SKILL.md` or a referenced router doc. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/router-replay.cjs:12] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/router-replay.cjs:144] It does not read `graph-metadata.json` or `mode-registry.json`. `d5-connectivity.cjs` builds on that same parse and catches dead resource paths, dead intent keys, path escapes, or unparseable routers. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/d5-connectivity.cjs:79] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/d5-connectivity.cjs:102] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/d5-connectivity.cjs:125]

Contamination lint also builds banned vocabulary from the target `SKILL.md` frontmatter, parsed router keywords, resource path tokens, and private expected labels. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/contamination-lint.cjs:70] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/contamination-lint.cjs:87] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/contamination-lint.cjs:97] That is useful for fixture leakage, but it does not prove graph metadata, hub keywords, registry aliases, and packet `INTENT_SIGNALS` are in sync.

Buildable recommendation: add a static `parent-hub-vocab-sync` gate before hub-route replay. Inputs:

- `graph-metadata.json.derived.trigger_phrases`.
- Hub `SKILL.md` description and `<!-- Keywords: ... -->`.
- `mode-registry.json.modes[].aliases`.
- Each registered packet's parsed `INTENT_SIGNALS`.

Outputs:

- `missing_projection`: required canonical term absent from a projection.
- `unclassified_term`: term present in a projection but absent from the canonical vocabulary contract.
- `wrong_mode_projection`: alias appears under a different mode's required packet vocabulary.
- `advisor_only_extra`: allowed extra wake/topic term, reported but not gated.

This gate should run before the D3 hub-route corpus from iterations 27-28. If the vocabulary contract is stale, the corpus can produce misleading route results.

### Finding 3: The right precedent is the existing router-sync test, not another prose instruction

Severity: P2. Label: ENFORCEABLE.

The repo already has a drift-guard pattern. The `sk-code` router sync test says its machine block and prose maps can drift, then pins the checkable parts: parsed machine-router paths must exist, every routable reference/asset doc must be covered, and every explicit full path named in prose must be present. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/tests/sk-code-router-sync.vitest.ts:5] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/tests/sk-code-router-sync.vitest.ts:78] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/tests/sk-code-router-sync.vitest.ts:83] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/tests/sk-code-router-sync.vitest.ts:90]

`sk-design` needs the same pattern for intent vocabulary. The checkable parts are not "does every copy match?" but:

- every canonical mode alias appears in `mode-registry.json`;
- every alias intended to wake the advisor appears in graph metadata and hub keywords;
- every alias intended to drive packet resource loading is covered by that packet's `INTENT_SIGNALS`;
- every extra term in graph metadata or hub keywords is classified as `advisorWake`, `topicKeyword`, or `nonRoutingKeyword`.

Buildable recommendation: implement the gate as a Vitest fixture plus a CLI script under the skill-benchmark suite. The script can reuse `parseRouter` for packets and JSON parsing for metadata/registry, then emit a report compatible with D5 hard-gate findings. A missing required projection should be P1; an unclassified projection extra should be P2 unless it creates mode ambiguity.

### Finding 4: This gate answers the "nearTieOutcome home" question by separating identity from router policy

Severity: P2. Label: ENFORCEABLE for file-shape and projection checks; ADVISORY for route-policy thresholds until a corpus validates them.

`mode-registry.json` currently describes identity: `workflowMode`, `backendKind`, packet, packet skill name, aliases, and advisor routing metadata. [SOURCE: .opencode/skills/sk-design/mode-registry.json:5] [SOURCE: .opencode/skills/sk-design/mode-registry.json:16] [SOURCE: .opencode/skills/sk-design/mode-registry.json:22] It also states that the advisor does not read the file at runtime. [SOURCE: .opencode/skills/sk-design/mode-registry.json:4] The hub prose, meanwhile, owns route behavior such as defaulting generic design prompts to `interface` and pairing modes only when separate axes are clear. [SOURCE: .opencode/skills/sk-design/SKILL.md:56] [SOURCE: .opencode/skills/sk-design/SKILL.md:92]

That split points to a sibling router-policy file. `mode-registry.json` should stay the mode identity source. A generated or hand-authored `hub-router.json` should own `nearTieOutcome`, alias classes, default policy, bundle policy, and vocabulary projection rules. Then the drift gate checks `mode-registry.json` as one projection, not as the only vocabulary owner.

Buildable recommendation: add this gate order:

```text
registry-shape
parent-hub-vocab-sync
hub-router-policy-parse
hub-route-corpus
backend-tool-lockstep
boundary-proof
resource-recall
proof-card-validation
```

That makes vocabulary drift the first structural failure before route correctness, backend/tool correctness, or utilization proof can score.

## Questions Answered

- Q2/D3: Parent-to-sub-skill routing needs a structural vocabulary projection gate before `prompt -> workflowMode` replay. The gate is deterministic if vocabulary terms are classified by role rather than compared as one flat set.
- Q5/all: The buildable backlog item is `hub-router.json` plus a `parent-hub-vocab-sync` hard gate wired into the skill-benchmark suite before hub-route corpus scoring.

## Questions Remaining

- Which registry aliases should be marked `packetIntentRequired`, and which should remain hub-only aliases that route to a mode without forcing packet resource keywords?
- Should graph metadata be generated from `hub-router.json`, or should it remain checked-in with a drift test?
- Should `hubSkillKeywords` be strict enough to fail missing aliases, or should it only fail missing `advisorWake` terms and report missing aliases as P2?

## Next Focus

D3-A13: specify the `hub-router.json` schema and checker placement precisely: vocabulary classes, severity map, corpus interaction, and whether graph metadata/hub keywords are generated or only drift-checked.

## Sources Consulted

- `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/037-design-routing-and-integration-research/research/deep-research-strategy.md`
- `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/037-design-routing-and-integration-research/research/iterations/iteration-026.md`
- `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/037-design-routing-and-integration-research/research/iterations/iteration-027.md`
- `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/037-design-routing-and-integration-research/research/iterations/iteration-028.md`
- `.opencode/skills/sk-design/graph-metadata.json`
- `.opencode/skills/sk-design/SKILL.md`
- `.opencode/skills/sk-design/mode-registry.json`
- `.opencode/skills/sk-design/design-interface/SKILL.md`
- `.opencode/skills/sk-design/design-foundations/SKILL.md`
- `.opencode/skills/sk-design/design-motion/SKILL.md`
- `.opencode/skills/sk-design/design-audit/SKILL.md`
- `.opencode/skills/sk-design/design-md-generator/SKILL.md`
- `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/router-replay.cjs`
- `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/d5-connectivity.cjs`
- `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/contamination-lint.cjs`
- `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/tests/sk-code-router-sync.vitest.ts`
- `.opencode/skills/deep-loop-workflows/deep-improvement/references/skill_benchmark/scenario_authoring.md`

## Assessment

newInfoRatio: 0.69. Prior D3 iterations already established registry completeness, hub-route gold, and false-default metrics. This pass adds a separate structural precondition: before a prompt corpus can measure route correctness, the vocabulary copies feeding advisor wakeup, hub route identity, and packet resource loading must be classified and projection-checked.

Confidence: high for the local drift and enforcement gap because every vocabulary source and benchmark parser was read directly. Medium for the exact home of `hub-router.json` because implementation should decide whether to generate graph/hub projections or only check them.

## Reflection

The useful rule is "classified projection", not "single list everywhere". Advisor wake phrases, route aliases, and packet resource keywords have different jobs. The failure is that the repo does not yet declare those jobs in a machine-checkable place.
