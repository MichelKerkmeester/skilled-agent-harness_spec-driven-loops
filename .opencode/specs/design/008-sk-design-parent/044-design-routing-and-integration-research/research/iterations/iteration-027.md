# Iteration 27: D3-A10 Standing Routing Self-Test Gold Corpus

## Focus

[D3-A10 / D3] A standing routing self-test gold corpus for `prompt -> expected workflowMode`, with hint-free public prompts and adversarial minimal pairs. The measurement target is the engine, not another prose routing rule: can `sk-design` prove the hub selected the right mode before context/resource/utilization proof gets partial credit?

## Actions Taken

1. Re-read the active strategy and prior D3 trail so this pass did not re-cover route-token, backend/tool, or child-boundary proof findings.
2. Re-read the live `sk-design` hub and `mode-registry.json` to anchor the expected route vocabulary: `workflowMode`, `backendKind`, mode packet, and aliases. [SOURCE: .opencode/skills/sk-design/SKILL.md:41] [SOURCE: .opencode/skills/sk-design/SKILL.md:44] [SOURCE: .opencode/skills/sk-design/mode-registry.json:14]
3. Checked the shared context contract to keep this measurement layer separate from context loading and proof cards. [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:44] [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:65]
4. Read the skill-benchmark fixture, contamination, router-replay, and scoring contracts to see what can be reused for a hub-mode corpus. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/references/skill_benchmark/scenario_authoring.md:22] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:107] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:242]
5. Checked current fixture/playbook inventory: legacy fixture dirs exist for `deep-improvement` and `deep-loop-workflows`, while `sk-design` has per-mode manual testing playbooks but no parent hub routing corpus.

## Findings

### Finding 1: `sk-design` has stable route labels, but the current deterministic benchmark scores the wrong primitive

Severity: P1. Label: ENFORCEABLE.

The hub says routing is registry-driven, with `workflowMode` as the public mode key and `backendKind` as the backend discriminator. [SOURCE: .opencode/skills/sk-design/SKILL.md:41] [SOURCE: .opencode/skills/sk-design/SKILL.md:44] The registry then defines exactly five valid mode rows: `interface`, `foundations`, `motion`, `audit`, and `md-generator`, each with packet and alias data. [SOURCE: .opencode/skills/sk-design/mode-registry.json:14] [SOURCE: .opencode/skills/sk-design/mode-registry.json:16] [SOURCE: .opencode/skills/sk-design/mode-registry.json:28] [SOURCE: .opencode/skills/sk-design/mode-registry.json:40] [SOURCE: .opencode/skills/sk-design/mode-registry.json:52] [SOURCE: .opencode/skills/sk-design/mode-registry.json:64]

But the deterministic benchmark's core score is still `expected.intentKeys` and `expected.resources` against `routerResult.intents` and `routerResult.resources`. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:242] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:245] Its router replay expects `INTENT_SIGNALS` and `RESOURCE_MAP` dictionaries inside the target skill or referenced router doc. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/router-replay.cjs:10] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/router-replay.cjs:12] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/router-replay.cjs:166]

Buildable recommendation: add a `hubRoute` lane to the skill-benchmark scorer before D1-intra. For `sk-design`, this lane should compare parsed route output to private gold:

```json
{
  "expected": {
    "skillId": "sk-design",
    "workflowMode": "motion",
    "routeOutcome": "single",
    "workflowModes": ["motion"],
    "forbiddenWorkflowModes": ["foundations", "audit"]
  }
}
```

Failing this lane should set `firstFailingStage: "hub-route"` before `routed-intra` or `discovered`, because resource recall can otherwise mask the wrong mode. Deterministically enforceable on a static corpus; open-ended prompt interpretation outside the corpus remains advisory.

### Finding 2: The existing public/private fixture split is the right anti-leakage mechanism, but the private schema needs route gold

Severity: P1. Label: ENFORCEABLE.

Lane C already has the core shape needed for hint-free routing tests. The public half crosses the dispatch boundary; the private half is scorer-only gold. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/references/skill_benchmark/scenario_authoring.md:22] Public prompts must be domain language and must not name the skill, triggers, intent keys, resource paths, basenames, or commands; contamination lint rejects leaks before scoring. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/references/skill_benchmark/scenario_authoring.md:26] The runner builds banned vocabulary from private expected data, lints the public prompt, and only then runs router replay and scoring. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:107] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:108] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:118]

The current authoring schema, however, names private gold as `skillId`, `advisorLane`, `intentKeys`, `resources`, and `negativeActivation`; it does not include `workflowMode`, route bundles, or minimal-pair metadata. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/references/skill_benchmark/scenario_authoring.md:27]

Buildable recommendation: extend fixture private gold for parent hubs with:

```json
{
  "expected": {
    "skillId": "sk-design",
    "workflowMode": "foundations",
    "routeOutcome": "single|orderedBundle|defer",
    "workflowModes": ["foundations"],
    "minimalPairGroup": "tokens-vs-ui-build-001",
    "pairRole": "target|foil",
    "forbiddenWorkflowModes": ["interface", "md-generator"],
    "reasonTag": "static-visual-system"
  }
}
```

The public half stays clean: prompts like "tighten the typography scale and color tokens for this dashboard" should not mention `foundations`, packet names, registry aliases, or resource basenames. This is enforceable with the existing contamination lint plus added banned terms from `workflowMode`, `workflowModes`, aliases for expected and forbidden modes, packet names, and route-output tokens.

### Finding 3: `modePrecision` exists, but it is explicitly advisory and cannot be the enforcement layer

Severity: P1. Label: ENFORCEABLE for reporting the gap; ADVISORY in the current scorer.

The scorer has a `modePrecision` field that reads `expected.mode`, but comments state it is advisory and never gated; the main gate remains skill-id. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:278] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:285] The underlying advisor probe repeats the same contract: mode precision is an advisory signal and returns `advisory: true`. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs:112] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs:124] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs:136]

The deep-loop parent-skill routing-precision probe confirms the limitation in plain language: the skill-benchmark harness scores skill-id only, while per-mode precision is enforced elsewhere by parity fixtures. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/assets/skill_benchmark/fixtures/deep-loop-workflows/routing-precision.md:3] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/assets/skill_benchmark/fixtures/deep-loop-workflows/routing-precision.md:5] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/assets/skill_benchmark/fixtures/deep-loop-workflows/routing-precision.md:6]

Buildable recommendation: do not repurpose `modePrecision`. Add a hard `hubRoute` gate with its own report section:

- `hubRoute.score`: 1/0 or partial for ordered bundles.
- `hubRoute.expectedWorkflowMode`.
- `hubRoute.observedWorkflowMode`.
- `hubRoute.pairGroupPass`: all foils rejected, target selected.
- `hubRoute.routeTrace`: scores and tie-break/defer reason.

Then keep `modePrecision` as an advisor-mode diagnostic. The hard gate should run before `routed-intra`, matching the existing first-failing-stage funnel. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/references/skill_benchmark/scoring_contract.md:60]

### Finding 4: The corpus should be adversarial minimal pairs, not only one happy-path fixture per mode

Severity: P2. Label: ENFORCEABLE.

The scenario authoring guide already defines three fixture tiers, including adversarial sibling-skill paraphrases, decoys, and negative activation. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/references/skill_benchmark/scenario_authoring.md:29] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/references/skill_benchmark/scenario_authoring.md:33] It also says coverage should include at least one fixture per router key, per resource-map target, and per "When NOT to Use" class. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/references/skill_benchmark/scenario_authoring.md:37] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/references/skill_benchmark/scenario_authoring.md:39]

For `sk-design`, one fixture per mode is too weak because the hard failures are near-neighbor confusions:

- `interface` vs `foundations`: "make this dashboard feel less generic" versus "define typography, spacing, and token rules for this dashboard".
- `foundations` vs `md-generator`: "create color/type tokens from this URL's existing site" versus "extract the live site CSS into a DESIGN.md".
- `motion` vs `interface`: "add hover and page-transition choreography" versus "produce three visual directions for the page".
- `audit` vs `interface`: "critique this UI for accessibility and production readiness" versus "redesign this UI so it is ready to build".
- bundle vs single: "build a landing page with refined layout and subtle choreography" should route to an ordered bundle, not only `interface`.

Buildable recommendation: create a standing corpus with three strata:

- `T1`: paraphrased mode-alias coverage from `mode-registry.json` aliases.
- `T2`: hand-authored holdout prompts by someone blind to the registry aliases.
- `T3`: adversarial minimal pairs with `minimalPairGroup`, `targetWorkflowMode`, `foilWorkflowModes`, and `expectedRouteReason`.

This is enforceable because the runner can score exact expected mode, forbidden modes, bundle order, and minimal-pair pass rates. The inherently advisory part is whether the corpus fully represents future user language.

## Questions Answered

- Q2/D3: Parent-to-sub-skill routing needs a hard hub-route corpus before utilization proof. The enforcement unit is `public prompt -> private expected.workflowMode/routeOutcome/workflowModes`, with contamination lint ensuring the prompt does not leak labels.
- Q5/all: This item is enforceable on a deterministic corpus and CI-friendly. It should be advisory only when extrapolating beyond the corpus or judging design taste after the correct mode is selected.

## Questions Remaining

- Should the `sk-design` corpus live as legacy public/private fixtures under `deep-improvement/assets/skill_benchmark/fixtures/sk-design/`, or as a parent `sk-design/manual_testing_playbook` consumed by the newer playbook loader?
- Should `hubRoute` be generic for all parent hubs, or first implemented as a `sk-design` adapter until another registry-mode hub exists?
- Should bundle order be scored strictly, or should role labels such as `primary`, `support`, `validation`, and `handoff` matter more than array position?

## Next Focus

D3-A11: scorer and report placement for `hubRoute`: exact fixture schema, parser output shape, first-failing-stage order, and how `hubRoute` interacts with the earlier D3-A7 `ROUTED` declaration and D3-A8 backend/tool lock.

## Sources Consulted

- `.opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/deep-research-strategy.md`
- `.opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/iterations/iteration-024.md`
- `.opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/iterations/iteration-025.md`
- `.opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/iterations/iteration-026.md`
- `.opencode/skills/sk-design/SKILL.md`
- `.opencode/skills/sk-design/mode-registry.json`
- `.opencode/skills/sk-design/shared/context_loading_contract.md`
- `.opencode/skills/deep-loop-workflows/deep-improvement/references/skill_benchmark/scenario_authoring.md`
- `.opencode/skills/deep-loop-workflows/deep-improvement/references/skill_benchmark/operator_guide.md`
- `.opencode/skills/deep-loop-workflows/deep-improvement/references/skill_benchmark/scoring_contract.md`
- `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs`
- `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/router-replay.cjs`
- `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs`
- `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs`
- `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs`
- `.opencode/skills/deep-loop-workflows/deep-improvement/assets/skill_benchmark/fixtures/deep-loop-workflows/routing-precision.md`

## Assessment

newInfoRatio: 0.66. Prior D3 iterations established that `sk-design` needs a route token, backend/tool lock, and boundary proof. This iteration adds the missing measurement engine: a private-gold corpus that can fail the wrong `workflowMode` before resources or proof cards can hide the error. The novelty is moderate-high because the repo already has public/private fixtures and contamination lint, but not a hard parent-hub `workflowMode` lane or adversarial minimal-pair corpus for `sk-design`.

## Reflection

The build should reuse the current fixture discipline rather than create a separate bespoke test runner. The critical change is schema and scorer order: `expected.workflowMode` must be private gold, public prompts must be hint-free, and the first hard failure should be mode selection itself.
