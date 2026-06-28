# Iteration 21: Ambiguous Multi-Axis Routing Contract

## Focus

[D3-A4 / D3] Ambiguous and multi-axis prompt resolution is undefined for the `sk-design` hub. This pass narrows the prior D3 findings into the missing routing policy: weighted hub scoring, ambiguity delta, deterministic tie-breaks, and first-class ordered multi-mode bundle output.

This does not re-cover the missing parseable parent router from iteration 18, content-bound utilization proof from iteration 19, or the registry source-of-truth boundary from iteration 20. It assumes those gaps and asks what the router must return when more than one mode plausibly applies.

## Actions Taken

1. Re-read prior D3 iterations and the strategy open questions to avoid repeating the already-established hub-router, content-proof, and registry-runtime findings. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/037-design-routing-and-integration-research/research/iterations/iteration-018.md:18] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/037-design-routing-and-integration-research/research/iterations/iteration-019.md:18] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/037-design-routing-and-integration-research/research/iterations/iteration-020.md:18] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/037-design-routing-and-integration-research/research/deep-research-strategy.md:133]
2. Read the live `sk-design` hub, registry, and shared context-loading contract for the current prose rules around smallest-useful mode, pairing modes, build bundles, and escalation. [SOURCE: .opencode/skills/sk-design/SKILL.md:47] [SOURCE: .opencode/skills/sk-design/SKILL.md:56] [SOURCE: .opencode/skills/sk-design/SKILL.md:60] [SOURCE: .opencode/skills/sk-design/SKILL.md:102] [SOURCE: .opencode/skills/sk-design/mode-registry.json:14] [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:31]
3. Read the deep-improvement skill-benchmark router and scoring scripts to compare the existing deterministic ambiguity primitive with what a parent design-mode router needs. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/router-replay.cjs:10] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/router-replay.cjs:33] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/router-replay.cjs:198] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/router-replay.cjs:257] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:278]
4. Checked the skill-benchmark operator and scoring references to determine whether parent-mode precision is currently enforceable or merely diagnostic. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/references/skill_benchmark/operator_guide.md:22] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/references/skill_benchmark/operator_guide.md:60] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/references/skill_benchmark/scoring_contract.md:54] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:384]

## Findings

### Finding 1: The hub names multi-axis behavior, but it has no ambiguity contract

Severity: P1. Label: ENFORCEABLE on a fixture corpus; ADVISORY for open-ended live prompts outside that corpus.

The `sk-design` hub currently says to classify a request to a dominant design intent, lets explicit mode hints override, defaults generic design prompts to `interface`, and pairs modes only when the prompt has clearly separate axes. [SOURCE: .opencode/skills/sk-design/SKILL.md:49] [SOURCE: .opencode/skills/sk-design/SKILL.md:56] It also says prompts spanning more than three design axes need an explicit workflow order. [SOURCE: .opencode/skills/sk-design/SKILL.md:102]

That is the right design instinct, but it is not a deterministic contract. There is no weighted score model, ambiguity delta, tie-break order, "separate axes" test, maximum bundle rule beyond the prose escalation line, or machine-readable return shape. The registry rows provide mode identity and aliases, but stop at `workflowMode`, `backendKind`, `packet`, `aliases`, and `advisorRouting`. [SOURCE: .opencode/skills/sk-design/mode-registry.json:14] [SOURCE: .opencode/skills/sk-design/mode-registry.json:16] [SOURCE: .opencode/skills/sk-design/mode-registry.json:21] [SOURCE: .opencode/skills/sk-design/mode-registry.json:22] [SOURCE: .opencode/skills/sk-design/mode-registry.json:75]

Buildable recommendation: add a parseable hub router policy, either inside `mode-registry.json` or in a generated sibling file, with these minimum fields:

```json
{
  "routerPolicy": {
    "defaultMode": "interface",
    "modeHintOverride": true,
    "ambiguityDelta": 1,
    "maxBundleModes": 3,
    "tieBreakOrder": ["md-generator", "foundations", "interface", "motion", "audit"],
    "outcomes": ["single", "orderedBundle", "defer"]
  },
  "routerSignals": {
    "interface": { "weight": 3, "axis": "direction", "phrases": ["make it look good", "redesign the ui"] },
    "motion": { "weight": 3, "axis": "temporal", "phrases": ["animate this", "micro-interactions"] }
  }
}
```

The deterministic router should emit one of:

```json
{
  "outcome": "orderedBundle",
  "primaryMode": "interface",
  "workflowModes": [
    { "workflowMode": "interface", "packet": "design-interface", "role": "primary", "score": 6 },
    { "workflowMode": "motion", "packet": "design-motion", "role": "support", "score": 5 }
  ],
  "routeTrace": ["matched:interface.redesign", "matched:motion.micro-interactions"],
  "deferReason": null
}
```

### Finding 2: Existing router-replay has a useful ambiguity primitive, but its output is not sufficient for a design-mode hub

Severity: P1. Label: ENFORCEABLE.

The skill-benchmark router already implements a deterministic scoring pattern: it lowercases the task, sums keyword weights, keeps intents within an ambiguity delta of the top score, and unions the default resource plus resources for selected intents. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/router-replay.cjs:10] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/router-replay.cjs:14] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/router-replay.cjs:16] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/router-replay.cjs:33] The implementation confirms the mechanics: `scoreIntents()` sorts weighted matches, `selectIntents()` returns all near-ties, and `routeSkillResources()` returns `intents`, `resources`, `missingResources`, and `scores`. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/router-replay.cjs:178] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/router-replay.cjs:198] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/router-replay.cjs:257]

For `sk-design`, that primitive needs one more semantic layer. A packet router can union resources when two intent keys are near-tied, but a parent design hub must distinguish additive axes from mutually ambiguous alternatives. "Interface + motion" may be a valid ordered bundle for a landing page with choreography; "audit + interface" may mean critique-first then redesign only if implementation is requested; "foundations + md-generator" may need extraction before token decisions if the prompt includes a URL. The current `router-replay.cjs` output has no `primaryMode`, no ordered roles, and no `deferReason`.

Buildable recommendation: extend Lane C with a `hub-router-replay` adapter rather than forcing parent hubs into the packet `RESOURCE_MAP` shape. The adapter should reuse weighted phrase scoring and ambiguity-delta math, then apply hub-specific bundle semantics:

- score each mode from `routerSignals`;
- apply explicit mode hints before score selection unless contradictory;
- if only one positive winner exceeds the next score by more than `ambiguityDelta`, return `outcome: "single"`;
- if near-tied winners are declared compatible axes, return `outcome: "orderedBundle"` with roles;
- if near-tied winners are competing interpretations of the same axis, return `outcome: "defer"` with a concrete question or `deferReason`;
- if selected modes exceed `maxBundleModes`, return `defer` rather than silently loading everything.

### Finding 3: The current benchmark can report mode precision, but it intentionally cannot enforce ordered mode bundles

Severity: P1. Label: ENFORCEABLE once fixtures carry expected bundle gold.

Lane C already treats deterministic router mode as the CI gate and D5 connectivity as a hard gate. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/references/skill_benchmark/operator_guide.md:22] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/references/skill_benchmark/operator_guide.md:60] But the mode-precision signal is explicitly non-gating. `scoreScenario()` calls `scoreModePrecision()` as an advisory field, and the comments say the gate stays skill-id while mode precision only reports whether the resolved mode matches `expected.mode`. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:278] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:283] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:288]

The aggregate keeps that promise: `modePrecision` is averaged under `advisorySignals` and is not included in `dimensionScores` or the weighted aggregate. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:384] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:415] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:433] The test suite locks this in by asserting a wrong mode does not lower the scenario score and that mode precision is outside the weighted aggregate. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts:257] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts:264]

That is acceptable for deep-loop's advisor-mode diagnostic, but it is too weak for `sk-design` hub routing enforcement. If the user asks for a polished animated UI build and the hub returns only `interface`, a benchmark should fail the bundle expectation, not pass the skill-id gate with an advisory warning.

Buildable recommendation: add `expectedModeBundle` gold to hub-router fixtures and score it as a gated hub-routing dimension:

```json
{
  "expected": {
    "skillId": "sk-design",
    "routeOutcome": "orderedBundle",
    "primaryMode": "interface",
    "modeBundle": ["interface", "foundations", "motion"],
    "deferReason": null
  }
}
```

Scoring should check exact primary mode, ordered-prefix match, allowed-support recall, unexpected-mode penalty, and defer correctness. This should be enforceable in Mode A because it depends on local registry data and private fixture gold, not live taste judgment.

### Finding 4: Build work already requires a bundle, but the router cannot return that bundle as a first-class result

Severity: P1. Label: ENFORCEABLE for load/proof fields; ADVISORY for final design quality.

The hub says UI build, page/component generation, and redesign implementation must auto-load a build bundle before decisions: `interface`, `foundations`, interface preflight, register, brief-to-dials, and matching foundations references. [SOURCE: .opencode/skills/sk-design/SKILL.md:58] [SOURCE: .opencode/skills/sk-design/SKILL.md:60] The shared context contract repeats that for build, redesign, generation, or evaluation, the smallest useful bundle is larger than one mode, with `interface`, `foundations`, optional audit refs, and proof manifest fields. [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:31] [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:33] [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:35] [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:40] [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:46]

The enforcement gap is that the bundle is a loading rule, not a router output. The hub success criteria still say "one primary mode" or "a small set only for clearly separate axes." [SOURCE: .opencode/skills/sk-design/SKILL.md:118] Without a first-class `workflowModes` result, later checks cannot distinguish "the hub intentionally selected interface plus foundations plus motion" from "the agent loaded extra files because it felt useful."

Buildable recommendation: make ordered bundles the normal output for any task that produces, evaluates, or hands off a UI surface. Then bind context manifests to that output:

- `route.workflowModes[]` lists required mode packets and roles;
- `context manifest.MODE BUNDLE LOADED` must contain each required mode;
- `proof_check.py --require-source-proof` should reject READY when a required bundle item has no loaded-file/source-proof row;
- benchmark fixtures should fail when an expected support mode is missing, even if the primary mode is correct.

This gives the runtime a deterministic guarantee of "right design materials were required and named." It still cannot guarantee taste; that remains audit/advisory after the proof gate.

## Questions Answered

- Q2/D3: Parent-to-sub-skill routing needs a three-outcome router contract: single mode, ordered mode bundle, or defer. Weighted scoring and an ambiguity delta choose candidates; tie-break and compatibility rules decide whether near ties become bundles or questions.
- Q5/all: Enforceable parts are router schema, weighted replay, ambiguity-delta selection, bundle ordering, fixture expected-bundle matching, required context-manifest rows, source-proof rows, and hard failure on missing bundle members. Advisory parts are live prompt judgment outside the corpus and the aesthetic quality of the resulting design work.

## Questions Remaining

- Should equal-score tie-break order be global, per task type, or stage-specific? A URL extraction task likely wants `md-generator` before foundations, while a UI build wants `interface` plus foundations before motion.
- Should mutually ambiguous prompts like "make this cleaner" defer by default, or should they map to `interface` with an explicit `routeTrace` that marks audit/foundations as rejected alternatives?
- Should `modeBundle` be an ordered list of mode keys only, or should it carry roles such as `primary`, `foundation`, `support`, `validation`, and `handoff`?
- Should bundle-mismatch become a D1-intra gate in the skill-benchmark harness, or a new hub-routing gate before packet router replay?

## Next Focus

Continue D3 with fixture design for the hub-router adapter: expected bundle schema, tie-break test cases, competing-axis defer cases, and scoring bands that make wrong mode order fail deterministically without treating final visual taste as deterministic.

Assessment: newInfoRatio 0.69. Novelty is moderate-high because iterations 18-20 established the parent router and registry gaps, while this pass pins the missing ambiguity semantics and shows why the existing advisory mode-precision signal is too weak for `sk-design` bundle enforcement.
