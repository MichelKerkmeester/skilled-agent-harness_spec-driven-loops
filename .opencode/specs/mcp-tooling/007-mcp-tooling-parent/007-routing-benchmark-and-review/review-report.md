# Deep Review Report — mcp-tooling Six-Mode Routing

## Executive Summary

**Verdict: FAIL**  
**Release readiness:** `release-blocking`  
**hasAdvisories:** `false`  
**Active findings:** P0=3, P1=10, P2=2

The four-iteration independent review covered correctness, security, traceability, and maintainability across the six-mode registry/router, hub documentation and graph metadata, all 13 hub-routing scenarios, and all 49 packet-local recall scenarios. Three blockers remain: the committed Figma positive route fails, Chrome's packet is injected into every non-Chrome route, and the committed benchmark reports PASS despite seven route-contract violations because it scores zero route-gold rows.

The Chrome-versus-Aside MT-H01 boundary itself is correct: `network requests` selects Chrome and not Aside. Registry/router mode keys and registry aliases are also bidirectionally aligned. Those clean boundaries do not offset the release-blocking route, resource-isolation, and acceptance-gate failures.

No reviewed source was changed. All writes are review artifacts in this lineage directory.

## Planning Trigger

`/speckit:plan` is required. The FAIL verdict contains active P0 findings and two failed core traceability protocols; remediation must be planned and verified as a complete router/benchmark/metadata change set rather than as isolated vocabulary edits.

Planning Packet

```json
{
  "triggered": true,
  "verdict": "FAIL",
  "hasAdvisories": false,
  "activeFindings": [
    {"id":"F001","severity":"P0","findingClass":"routing-positive-failure","title":"Explicit Figma render/export scenario produces no Figma intent"},
    {"id":"F002","severity":"P0","findingClass":"cross-mode-resource-contamination","title":"Chrome packet is unconditionally loaded on every non-Chrome route"},
    {"id":"F008","severity":"P0","findingClass":"benchmark-route-gate-blindness","title":"Baseline benchmark passes seven route-contract violations"},
    {"id":"F003","severity":"P1","findingClass":"defer-contract-bypass","title":"Shared hub-identity vocabulary defeats the defer contract"},
    {"id":"F004","severity":"P1","findingClass":"blind-holdout-recall-gap","title":"Five of six blind hub holdouts have zero lexical recall"},
    {"id":"F005","severity":"P1","findingClass":"cross-transport-vocabulary-collision","title":"Generic screen-examples phrase loads both Refero and Mobbin"},
    {"id":"F006","severity":"P1","findingClass":"workspace-mutation-metadata","title":"Figma transport is marked workspace-read-only despite local export writes"},
    {"id":"F007","severity":"P1","findingClass":"design-judgment-pairing-gap","title":"Figma authoring path lacks mandatory sk-design pairing"},
    {"id":"F009","severity":"P1","findingClass":"graph-projection-drift","title":"Derived graph intent projection omits three added modes"},
    {"id":"F010","severity":"P1","findingClass":"phase-acceptance-drift","title":"Phase acceptance package remains scoped to three modes"},
    {"id":"F012","severity":"P1","findingClass":"packet-holdout-recall-gap","title":"Four packet blind holdouts miss their declared intent"},
    {"id":"F013","severity":"P1","findingClass":"packet-negative-suppression-bypass","title":"All six runtime fallbacks violate negative no-resource gold"},
    {"id":"F014","severity":"P1","findingClass":"packet-replay-runtime-parity","title":"Deterministic replay omits runtime no-match behavior"},
    {"id":"F011","severity":"P2","findingClass":"playbook-index-drift","title":"Hub playbook index omits three modes and nine scenarios"},
    {"id":"F015","severity":"P2","findingClass":"packet-base-gold-drift","title":"Eleven positive packet scenarios omit always-loaded base gold"}
  ],
  "remediationWorkstreams": [
    "WS1 deterministic hub routing and packet isolation",
    "WS2 benchmark route-gold enforcement and runtime parity",
    "WS3 design-transport trust and sk-design ownership",
    "WS4 six-mode metadata, phase, and playbook traceability"
  ],
  "specSeed": [
    "Define executable expected intent, defer, and exact resource isolation for all 13 hub scenarios.",
    "Define the three design transports' provider-specific vocabulary and mandatory sk-design pairing boundary.",
    "Make route gold a hard benchmark gate and define packet runtime/replay parity for all 49 recall scenarios.",
    "Require one consistent six-mode inventory across registry, router, graph metadata, phase acceptance, and playbook index."
  ],
  "planSeed": [
    "Freeze current failing replays as regression evidence.",
    "Adjudicate fallback versus universal-default semantics before changing router data.",
    "Correct hub scoring, defer, provider collision, and Figma recall behavior as one route-policy workstream.",
    "Reconcile Figma mutation and sk-design ownership contracts.",
    "Unify runtime router behavior with deterministic replay and hard-gate expected intent/resources.",
    "Regenerate all six-mode projections and rerun 13 hub plus 49 packet scenarios."
  ],
  "findingClasses": [
    "routing-positive-failure",
    "cross-mode-resource-contamination",
    "benchmark-route-gate-blindness",
    "defer-contract-bypass",
    "blind-holdout-recall-gap",
    "cross-transport-vocabulary-collision",
    "workspace-mutation-metadata",
    "design-judgment-pairing-gap",
    "graph-projection-drift",
    "phase-acceptance-drift",
    "packet-holdout-recall-gap",
    "packet-negative-suppression-bypass",
    "packet-replay-runtime-parity",
    "playbook-index-drift",
    "packet-base-gold-drift"
  ],
  "affectedSurfacesSeed": [
    "mcp-tooling/hub-router.json",
    "mcp-tooling/mode-registry.json",
    "mcp-tooling/SKILL.md and description.json",
    "mcp-tooling/graph-metadata.json",
    "mcp-tooling benchmark and hub_routing corpus",
    "mcp-figma plus sk-design cross-hub doctrine",
    "six packet routers and intra_routing_recall packs",
    "phase spec.md, plan.md, tasks.md and manual playbook index"
  ],
  "fixCompletenessRequired": true
}
```

## Active Finding Registry

### P0 — Blockers

#### F001 — Explicit Figma render/export scenario produces no Figma intent

- Dimension: correctness
- Location: `.opencode/skills/mcp-tooling/hub-router.json:141-159`
- Evidence: MT-003's committed prompt contains no declared Figma phrase as an exact substring; deterministic replay returns no mode and the Chrome default resource.
- Impact: The central Figma transport positive scenario and advisor trigger example do not route to Figma.
- Recommendation: Treat the Figma lexical route and its regression scenario as a release-blocking route-policy amendment.
- Disposition: active
- findingClass: `routing-positive-failure`
- scopeProof: Router vocabulary, scenario prompt, and deterministic scoring consumer were inspected and replayed.
- affectedSurfaceHints: `figma-aliases`, `design-transport`, MT-003, `description.json` trigger example.

#### F002 — Chrome packet is unconditionally loaded on every non-Chrome route

- Dimension: correctness
- Location: `.opencode/skills/mcp-tooling/hub-router.json:5,20-22`
- Evidence: `defaultResource` names Chrome, and the consumer unions defaults before every selected-mode resource.
- Impact: Correct ClickUp, Aside, Figma, Refero, and Mobbin routes receive an unrelated browser-debugging packet and violate single-mode isolation.
- Recommendation: Define and implement fallback-only versus universal-preamble semantics before changing the policy field.
- Disposition: active
- findingClass: `cross-mode-resource-contamination`
- scopeProof: The policy producer and `assembleResources` consumer were traced directly.
- affectedSurfaceHints: `routerPolicy.defaultResource`, all non-Chrome resources, expected-resource gold.

#### F008 — Baseline benchmark passes seven route-contract violations

- Dimension: traceability
- Location: `.opencode/skills/mcp-tooling/benchmark/baseline/skill-benchmark-report.json:11-126,180-1329`
- Evidence: Verdict is PASS, hub regressions are zero, and all 13 rows pass with `routeGoldRows:0`; telemetry nevertheless shows MT-004 selecting six modes and MT-003 plus MT-H02–H06 selecting no intended mode.
- Impact: The designated deterministic CI gate certifies broken routing and supplies a false release signal.
- Recommendation: Make expected intent/defer/resource assertions hard route gold and fail the benchmark on any mismatch.
- Disposition: active
- findingClass: `benchmark-route-gate-blindness`
- scopeProof: Report verdict, counters, all telemetry rows, and scenario frontmatter expectations were compared.
- affectedSurfaceHints: Mode A gate, route-gold loader/scorer, hub regression counter, 13 scenario verdicts.

### P1 — Required

#### F003 — Shared hub-identity vocabulary defeats the defer contract

- Dimension: correctness
- Location: `.opencode/skills/mcp-tooling/hub-router.json:25-99`
- Evidence: All six modes inherit weight-4 `hub-identity`; MT-004's `mcp tool bridge` phrase ties and selects all six.
- Impact: An intentionally ambiguous request loads every packet instead of asking for disambiguation.
- Recommendation: Separate hub discovery evidence from per-mode scoring and define executable defer behavior.
- Disposition: active
- findingClass: `defer-contract-bypass`
- scopeProof: Signal classes, shared vocabulary, selection algorithm, and MT-004 were replayed.
- affectedSurfaceHints: `hub-identity`, `ambiguityDelta`, `outcomes.defer`, MT-004.

#### F004 — Five of six blind hub holdouts have zero lexical recall

- Dimension: correctness
- Location: `.opencode/skills/mcp-tooling/hub-router.json:101-220`
- Evidence: Only MT-H01 scores; MT-H02–H06 return no intended mode.
- Impact: Aside, ClickUp, Figma, Refero, and Mobbin each fail their natural-language generalization case.
- Recommendation: Adjudicate intended semantic coverage, then bind each retained holdout to executable route gold.
- Disposition: active
- findingClass: `blind-holdout-recall-gap`
- scopeProof: All six holdouts were replayed against every vocabulary class.
- affectedSurfaceHints: MT-H02, MT-H03, MT-H04, MT-H05, MT-H06, vocabulary classes.

#### F005 — Generic screen-examples phrase loads both Refero and Mobbin

- Dimension: security
- Location: `.opencode/skills/mcp-tooling/hub-router.json:192-210`
- Evidence: `screen examples` appears in both provider classes; an unqualified signup-flow request selects both transports.
- Impact: Generic design research over-dispatches two external provider contracts and bypasses provider choice/design-hub ownership.
- Recommendation: Reserve provider-neutral vocabulary for defer or `sk-design`; keep provider transports provider-specific unless explicitly bundled.
- Disposition: active
- findingClass: `cross-transport-vocabulary-collision`
- scopeProof: Duplicate phrases, both packet exclusions, and replay output were compared.
- affectedSurfaceHints: Refero/Mobbin classes, `orderedBundle`, generic screen/design language.

#### F006 — Figma transport is marked workspace-read-only despite local export writes

- Dimension: security
- Location: `.opencode/skills/mcp-tooling/mode-registry.json:139-156`
- Evidence: `mutatesWorkspace:false` conflicts with allowed Bash exports that explicitly write local files.
- Impact: Permission and audit consumers can treat a locally mutating path as non-mutating.
- Recommendation: Define mutation semantics that distinguish external-document mutation, local export writes, and direct editing tools.
- Disposition: active
- findingClass: `workspace-mutation-metadata`
- scopeProof: Registry flag, transport extension prose, packet command taxonomy, and Bash ownership were traced.
- affectedSurfaceHints: `toolSurface.mutatesWorkspace`, transport-axis description, Figma exports.

#### F007 — Figma authoring path lacks mandatory sk-design pairing

- Dimension: security
- Location: `.opencode/skills/mcp-tooling/mcp-figma/SKILL.md:24-44,262-269`
- Evidence: Figma's pairing rules cover reads/exports feeding decisions but omit its author/modify and token paths; parent hubs require judgment before design-affecting transport work.
- Impact: The transport can create design artifacts without the designated design-judgment owner.
- Recommendation: Make the cross-hub ownership precondition explicit for every design-affecting Figma authoring path.
- Disposition: active
- findingClass: `design-judgment-pairing-gap`
- scopeProof: Figma activation/ALWAYS/integration text was compared with both parent-hub doctrines.
- affectedSurfaceHints: Figma author/modify, design tokens, `crossHubPairing`, `sk-design` transport rules.

#### F009 — Derived graph intent projection omits three added modes

- Dimension: traceability
- Location: `.opencode/skills/mcp-tooling/graph-metadata.json:196-218`
- Evidence: Root signals and entities cover six modes; derived intent signals and narrative edges retain the original Chrome/ClickUp/Figma projection.
- Impact: Graph consumers receive inconsistent inventory and discovery for Aside, Refero, and Mobbin.
- Recommendation: Regenerate every graph projection from the authoritative six-mode inventory and verify consumer parity.
- Disposition: active
- findingClass: `graph-projection-drift`
- scopeProof: Root, derived, entity, edge, and causal-summary projections were compared within the same file.
- affectedSurfaceHints: `derived.intent_signals`, depends/enhances contexts, causal summary.

#### F010 — Phase acceptance package remains scoped to three modes

- Dimension: traceability
- Location: `.opencode/specs/mcp-tooling/007-mcp-tooling-parent/007-routing-benchmark-and-review/spec.md:61-148`
- Evidence: Spec, plan, and tasks repeatedly define three modes, omit Aside/Refero/Mobbin, and inaccurately say only a `.gitkeep` baseline exists.
- Impact: Half of the current router inventory has no requirement-to-task-to-evidence chain.
- Recommendation: Amend the phase acceptance packet to the six-mode corpus and current evidence paths before claiming completion.
- Disposition: active
- findingClass: `phase-acceptance-drift`
- scopeProof: Requirements, criteria, plan axes, tasks, status, and committed benchmark paths were compared.
- affectedSurfaceHints: REQ-001, SC-001, T002, T007, execution note, three-mode matrix.

#### F012 — Four packet blind holdouts miss their declared intent

- Dimension: maintainability
- Location: `.opencode/skills/mcp-tooling/mcp-click-up/manual_testing_playbook/intra_routing_recall/holdout_daily.md:13-17`
- Evidence: CU-H01, CU-H02, MB-H01, and MB-H02 score no intent; the other eight packet holdouts pass intent recall.
- Impact: ClickUp and Mobbin have no demonstrated local generalization beyond literal keyword fixtures.
- Recommendation: Decide whether semantic holdout recall is required, then keep only executable expected intents in the gold corpus.
- Disposition: active
- findingClass: `packet-holdout-recall-gap`
- scopeProof: All 12 packet holdouts across all six routers were replayed.
- affectedSurfaceHints: CU-H01, CU-H02, MB-H01, MB-H02, ClickUp/Mobbin signals.

#### F013 — All six runtime fallbacks violate negative no-resource gold

- Dimension: maintainability
- Location: `.opencode/skills/mcp-tooling/mcp-click-up/manual_testing_playbook/intra_routing_recall/negative.md:1-16`
- Evidence: Every negative requires no intent/resource; every documented runtime no-score branch loads fallback context, and five expose a fallback intent label.
- Impact: The authored suppression contract and runtime contract cannot both pass.
- Recommendation: Choose rejection versus packet-level fallback semantics and align all six negative fixtures with that decision.
- Disposition: active
- findingClass: `packet-negative-suppression-bypass`
- scopeProof: Six negative files and six zero-score runtime branches were traced.
- affectedSurfaceHints: six negative cases, `UNKNOWN_FALLBACK`, default resources, ClickUp hardcoded fallback.

#### F014 — Deterministic replay omits runtime no-match behavior

- Dimension: maintainability
- Location: `.opencode/skills/mcp-tooling/mcp-click-up/SKILL.md:155-217`
- Evidence: Generic replay returns no intents on zero scores; runtimes emit fallback labels, and ClickUp's intentionally undeclared hardcoded fallback resource is invisible to replay.
- Impact: CI and runtime produce different packet route contracts for suppression and unknown requests.
- Recommendation: Establish one executable router representation or add parity assertions for every documented fallback branch.
- Disposition: active
- findingClass: `packet-replay-runtime-parity`
- scopeProof: Replay selection/resource assembly was compared with all six runtime pseudocode paths.
- affectedSurfaceHints: `selectIntents`, `DEFAULT_RESOURCE`, ClickUp fallback, UNKNOWN/setup/wiring labels.

### P2 — Suggestions

#### F011 — Hub playbook index omits three modes and nine scenarios

- Dimension: traceability
- Location: `.opencode/skills/mcp-tooling/manual_testing_playbook/manual_testing_playbook.md:3-49`
- Evidence: The index lists three modes and four scenarios while the directory holds six modes and 13 files.
- Impact: Operators following the documented entry point under-test the expanded hub.
- Recommendation: Regenerate the index and related links from the committed corpus.
- Disposition: active
- findingClass: `playbook-index-drift`
- scopeProof: The index was compared to the complete `hub_routing/` inventory.
- affectedSurfaceHints: overview, scenario table, success criteria, packet links.

#### F015 — Eleven positive packet scenarios omit always-loaded base gold

- Dimension: maintainability
- Location: `.opencode/skills/mcp-tooling/mcp-aside-devtools/manual_testing_playbook/intra_routing_recall/install.md:1-18`
- Evidence: Four Aside, three Chrome, two Mobbin, and two Refero rows omit their documented universal preamble from `expected_resources`.
- Impact: Exact resource scoring will classify declared base behavior as waste or stale gold.
- Recommendation: Adjudicate which base resources are truly universal, then align positive gold without blessing unrelated eager loads.
- Disposition: active
- findingClass: `packet-base-gold-drift`
- scopeProof: All 49 expected resource sets were compared to replay output and default-resource producers.
- affectedSurfaceHints: 11 positive gold rows, default preambles, D3 efficiency, `expected_resources`.

## Remediation Workstreams

1. **WS1 — Deterministic hub routing and packet isolation (P0 first):** F001, F002, F003, F004, F005. Establish explicit discovery-versus-scoring signals, fallback-only resource semantics, provider-neutral defer behavior, and regression expectations for all 13 hub cases.
2. **WS2 — Benchmark route-gold enforcement and runtime parity (P0 first):** F008, F012, F013, F014. Make intent/defer/resource gold executable, unify or parity-test runtime and replay paths, and fail on unknown-route divergence.
3. **WS3 — Design-transport trust and ownership:** F006, F007. Reconcile local writes with mutation metadata and apply `sk-design` before all design-affecting Figma operations.
4. **WS4 — Six-mode metadata and acceptance traceability:** F009, F010. Regenerate graph projections and update phase requirements/tasks to cover every mode and current evidence path.
5. **Advisory maintenance:** F011, F015. Refresh the playbook index and adjudicate legitimate base-resource gold after the blocking semantics are settled.

## Spec Seed

- Add normative expected outcomes for all 13 hub scenarios: exact intended mode(s), a real defer state for MT-004, and allowed resource sets with no implicit Chrome contamination.
- State whether provider-neutral design research routes to `sk-design`, defers for provider choice, or forms an explicitly requested multi-provider bundle.
- Define Figma transport mutation classes and require a selected `sk-design` judgment mode before document authoring, token creation, or other design-affecting mutations.
- Define benchmark acceptance so every `expected_intent` and `expected_resources` assertion is consumed by a hard gate; a route mismatch cannot remain a PASS.
- Define one authoritative packet-router behavior for positive, holdout, negative, and zero-score fallback cases across all six packets.
- Require registry, router, description, graph metadata, phase criteria, and operator index to expose the same six-mode inventory.

## Plan Seed

1. Capture current outputs for the 13 hub and 49 packet scenarios as failing regression fixtures.
2. Decide and document fallback/default/defer semantics before editing vocabulary or resource maps.
3. Amend hub scoring and vocabulary to resolve Figma recall, hub-identity ties, natural-language holdouts, and Refero/Mobbin collisions.
4. Enforce packet isolation and verify every single-mode route loads only allowed resources.
5. Reconcile Figma mutation metadata and mandatory `sk-design` pairing across registry, hub, Figma packet, and design hub.
6. Replace or parity-test duplicated runtime/replay router representations, including every no-score branch.
7. Wire route gold into the benchmark hard gate and rerun all 62 scenarios with exact assertions.
8. Regenerate graph metadata, phase acceptance docs, and playbook index; rerun core traceability protocols.

## Traceability Status

### Core Protocols

| Protocol | Status | Evidence | Unresolved drift |
|---|---|---|---|
| `spec_code` | fail | Phase spec lines 61-148 versus six router signal keys | Requirements and criteria cover three modes; shipped hub exposes six. |
| `checklist_evidence` | fail | `tasks.md:53-88`; baseline report route-gold counters | Tasks remain unchecked, `router-final/` is absent, and committed evidence passes unscored route mismatches. |

`AC_COVERAGE`: **exempt** — the target is a Level-1 spec and does not satisfy the lifecycle-active Level-2+/checklist/implementation-summary applicability condition.

### Overlay Protocols

| Protocol | Status | Evidence | Unresolved drift |
|---|---|---|---|
| `skill_agent` | notApplicable | Spec-folder target | No skill-agent pair under review. |
| `agent_cross_runtime` | notApplicable | Spec-folder target | No agent runtime target. |
| `feature_catalog_code` | partial | Registry/router inventory and `graph-metadata.json:196-218` | Keys and aliases align, but the graph derived projection omits three modes. |
| `playbook_capability` | fail | Hub index; 13 hub and 49 packet replays | Index is stale; hub gold is not hard-gated; 20 packet rows miss at least one authored assertion. |

## Deferred Items

- F011 is advisory documentation debt: refresh the operator index after the route corpus is finalized.
- F015 is advisory gold maintenance: decide which base resources are legitimate before adding them to expected sets, so unrelated eager loads are not normalized.
- Live advisor ranking and Mode-B usefulness were not part of this deterministic, source-bound lineage. They should follow—not replace—the blocking Mode-A route corrections.

## Dimension Expansion Map

- Formal divergent pivots: none requested or required.
- Selected directions:
  - Iteration 1 — correctness: deterministic hub scoring, resources, defer, and 13 hub scenarios.
  - Iteration 2 — security: design-provider collisions, workspace mutation, and `sk-design` ownership.
  - Iteration 3 — traceability: benchmark gate, graph projections, phase acceptance, and playbook index.
  - Iteration 4 — maintainability: all 49 packet scenarios and runtime/replay parity.
- Saturated/ruled-out directions: registry/router key drift, registry alias drift, MT-H01 Chrome-versus-Aside regression, unparseable packet routers, and missing returned resource files.
- Remaining frontier: live advisor/utility measurement after deterministic route correctness and route-gold gating are repaired.

## Search Ledger

`hasSearchDebt: false`. Review used graphless fallback because no semantic/code graph was available to the detached lineage; every required class was covered by direct reads, exact search, negative replay, and producer-consumer traces.

| IDs | Dimension | Covered classes | Result |
|---|---|---|---|
| SL-001–SL-004 | correctness | positive recall, default isolation, defer, hub holdouts | 4 findings; registry keys and MT-H01 ruled out. |
| SL-005–SL-007 | security | transport over-dispatch, mutation boundary, design ownership | 3 findings; direct transport edit-tool grants ruled out. |
| SL-008–SL-011 | traceability | benchmark fidelity, graph projection, phase acceptance, playbook inventory | 4 findings; registry aliases and description inventory ruled out. |
| SL-012–SL-015 | maintainability | packet holdouts, negative suppression, replay parity, resource gold | 4 findings; router parseability and missing files ruled out. |

Candidate coverage: 15 covered bug classes, no deferred or blocked candidates. Search debt: none. Clean-search proof is captured in each iteration's Ruled Out section and the reducer strategy's exhausted directions.

## Audit Appendix

### Convergence and Lifecycle

- Session: `fanout-sol-review-1784209544620-5f3v0s`
- Executor: `cli-codex`, model `gpt-5.6-sol`
- Stop policy: `max-iterations`
- Stop reason: `maxIterationsReached`
- Iterations: 4/4; every iteration mechanically verified with narrative, route proof, and JSONL delta.
- New-findings ratios: 1.00, 1.00, 1.00, 1.00.
- Convergence score: 0.00; convergence was telemetry-only before the required ceiling.
- Final coverage: correctness, security, traceability, maintainability = 4/4.
- Active registry: 15 findings; P0=3, P1=10, P2=2; resolved=0.
- Claim adjudication: present for all 13 active P0/P1 findings.
- Reducer validation: search debt=0, corruption warnings=0.
- Release readiness: `release-blocking` because active P0 findings remain.

### Replay Coverage

- Hub routing: 13/13 committed cases replayed (7 primary, 6 holdouts).
- Hub outcome: 6 intended route/defer outcomes satisfied and 7 violated; MT-H01 correctly preserves the Chrome-versus-Aside boundary.
- Packet routing: 49/49 cases replayed across all six packets.
- Packet outcome: intent 45/49; exact resources 31/49; full contract 29/49; holdout intent 8/12.
- Runtime parity: all six zero-score branches inspected independently of generic replay.
- Resource map: emitted at synthesis to `resource-map.md`; the initialization-time Resource Map Coverage Gate remained disabled because no source resource map was present.

### Ruled-Out Claims

- Registry and router expose the same six `workflowMode` keys.
- Every registry alias is reachable through its corresponding router signal classes.
- `description.json` names all six modes.
- MT-H01's `network requests` wording selects Chrome without activating Aside.
- All six packet routers are parseable by deterministic replay.
- Every resource returned by the 49 packet replays exists on disk.

### Core Protocols

- `spec_code`: fail.
- `checklist_evidence`: fail.
- `AC_COVERAGE`: exempt.

### Overlay Protocols

- `skill_agent`: notApplicable.
- `agent_cross_runtime`: notApplicable.
- `feature_catalog_code`: partial.
- `playbook_capability`: fail.

### Sources Reviewed

- Hub: `mode-registry.json`, `hub-router.json`, `SKILL.md`, `description.json`, `graph-metadata.json`.
- Corpus: all 13 `manual_testing_playbook/hub_routing/` files and all 49 six-packet `intra_routing_recall/` files.
- Packets: Aside, Chrome DevTools, ClickUp, Figma, Refero, and Mobbin `SKILL.md` routers; `sk-design/SKILL.md` pairing doctrine.
- Consumers/evidence: `router-replay.cjs`, routing-optimization contract, baseline benchmark JSON/Markdown.
- Acceptance: phase `spec.md`, `plan.md`, `tasks.md`, and hub manual playbook index.

