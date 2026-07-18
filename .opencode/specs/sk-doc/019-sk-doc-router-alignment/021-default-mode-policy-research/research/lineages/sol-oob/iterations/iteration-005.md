# Iteration 5: Calibrated One-Turn Routing Negotiation

## Run Identity
- iteration: 5
- run: 5
- Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true
- Executor: `{"kind":"cli-codex","model":"gpt-5.6-sol"}`

## Focus
Formalize the zero-signal branch as a one-turn negotiation with calibrated confidence, compressed options, typed clarification, and a measurable friction budget. “Subsumes” is interpreted narrowly: one outer control contract may choose `route`, `clarify`, `defer`, or `reject` across named-default, defer-routed, and detection-routed hubs. It does not imply that a scalar deletes their different evidence, capability, resource, or authority contracts.

## Findings
1. The current advisor field named `confidence` is a bounded routing heuristic, not a demonstrated probability of correctness. It is constructed from a base constant, normalized live-lane evidence, floors, and direct-score bonuses; `uncertainty` is separately derived from evidence counts, direct evidence, low-confidence penalties, and ambiguity pressure. A recommendation passes only when both configured thresholds hold, and a top-two confidence gap of at most `0.05` adds ambiguity pressure. Those formulas support ranking and abstention policy, but neither a raw value nor its margin is automatically “an 80% chance this route is right.” [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:381] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:431] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:761] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:766] [INFERENCE: a hand-authored bounded transform has no observed-frequency semantics until validated against routing outcomes]
2. A calibrated field needs a different contract from a ranking score. Guo et al. define confidence calibration in terms of probability estimates representing the true likelihood of correctness and show that high-performing classifiers can still be poorly calibrated. Transferred conservatively, the route record should always expose `rankScore` and `scoreMargin`, but expose `estimatedCorrectness` or `estimatedError` only when `calibration.status=validated` names a versioned held-out corpus, method, policy hash, and evaluation window. Without that evidence, the status is `unvalidated` and probability language is forbidden. [SOURCE: https://arxiv.org/abs/1706.04599] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:381] [INFERENCE: the paper supplies the calibration semantics, not proof that temperature scaling or any neural calibration method fits this heuristic router]
3. Confidence-first routing is better modeled as selective classification than as “pick the largest score.” Selective classification explicitly trades coverage for controlled risk by rejecting some cases; the local advisor already makes `unknown` true when no candidate passes and deliberately raises uncertainty for low-information ambiguity. The unifying outer policy is therefore: auto-route only under a validated risk budget, otherwise enter the one-turn clarification branch, then defer or reject if the clarified case still fails. The threshold is selected from held-out risk/coverage curves per immutable policy snapshot, not copied as one fleet-wide constant. [SOURCE: https://arxiv.org/abs/1705.08500] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:772] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:851] [INFERENCE: selective rejection transfers as a control principle; the paper's DNN guarantees do not transfer without a router-specific corpus]
4. The zero-signal interaction can be one typed turn with enforceable cost bounds. MCP elicitation supplies the compatible wire shape: a flat, primitive JSON Schema, enum choices, and distinct `accept`, `decline`, and `cancel` results. For this router, the provisional budget is `clarificationTurns <= 1`, `schemaProperties = 1`, `presentedCandidates <= 3` plus `none_of_these`, `routeAttempts <= 2` including the initial attempt, and `cardTokens <= 256`. These are benchmarkable engineering caps, not claimed human-optimal constants; promotion requires measuring option recall, clarification resolution, cancel/abandonment, added turns, and serialized card size. [SOURCE: https://modelcontextprotocol.io/specification/2025-06-18/client/elicitation] [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/021-default-mode-policy-research/spec.md:116] [INFERENCE: a single flat enum and hard counters turn “ask briefly” into a replayable interaction budget]
5. The three hub archetypes are subsumed only at the action boundary. A named default becomes an evidence-bearing candidate or prior that may auto-route only under the same risk and capability checks; defer-routed is the reject option when zero-signal evidence cannot meet policy; detection-routed contributes non-keyword surface/capability evidence before the same decision. The canonical router contract still says keyword routing is binary and distinguishes named-default, detection-routed, and defer-routed behavior, so confidence cannot safely erase `routerSignals`, the mode registry, resource selection, or destination authority. It can normalize their terminal decision and telemetry. [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_hub_router_schema.md:227] [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_hub_router_schema.md:229] [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_hub_router_schema.md:231] [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/021-default-mode-policy-research/spec.md:117] [INFERENCE: one controller can consume heterogeneous evidence without pretending that the evidence channels are interchangeable]

## Proposed Decision and Interaction Schema

```json
{
  "policy": {
    "basePolicyHash": "sha256:...",
    "overlayHash": "sha256:...",
    "featureSchemaVersion": "..."
  },
  "evidence": {
    "kind": ["explicit-intent", "detected-surface", "capability-match"],
    "requiredCapability": "...",
    "matchedSignals": ["..."]
  },
  "ranking": {
    "topMode": "...",
    "rankScore": 0.0,
    "runnerUpMode": "...",
    "scoreMargin": 0.0
  },
  "calibration": {
    "status": "unvalidated",
    "corpusId": null,
    "method": null,
    "estimatedError": null
  },
  "decision": {
    "action": "clarify",
    "reasonCode": "zero-signal",
    "requestedCapability": "...",
    "candidateModes": ["mode-a", "mode-b"]
  },
  "clarification": {
    "questionId": "...",
    "requestedSchema": {
      "type": "object",
      "properties": {
        "routeChoice": {
          "type": "string",
          "enum": ["mode-a", "mode-b", "none_of_these"]
        }
      },
      "required": ["routeChoice"]
    },
    "budget": {
      "maxTurns": 1,
      "maxCandidates": 3,
      "maxRouteAttempts": 2,
      "maxCardTokens": 256
    }
  }
}
```

`estimatedError` stays `null` until the calibration block is validated. After one accepted answer, the router rescored once with the typed slot; a second non-passing result returns `defer` or `reject` rather than asking again. `decline` and `cancel` are terminal typed outcomes for this negotiation.

## Friction and Calibration Budget

The offline gate should report, per policy hash and hub:

- `coverage`: fraction auto-routed without clarification.
- `selectiveRisk`: wrong-route rate among auto-routed cases.
- `clarificationRate` and `clarificationResolutionRate`.
- `optionRecall`: fraction of ambiguous fixtures whose gold route appears in the compressed card.
- `cancelRate` / `declineRate` and downstream defer rate.
- added turns, route attempts, candidate count, and serialized card tokens.

The hard interaction caps above can ship as replay assertions. A score-to-risk threshold cannot: it is eligible for promotion only after a held-out, hub-relevant corpus demonstrates the chosen risk/coverage target under the exact policy and feature-schema hashes.

## Ruled Out
- Treating the advisor's `confidence` or top-two margin as a calibrated probability.
- Copying one universal numerical threshold across hubs without held-out risk/coverage evidence.
- Presenting the whole mode registry as a clarification menu; compression is part of the contract.
- Letting a confidence controller replace capability validation, resource loading, or packet authority.

## Dead Ends
“Every route carries a calibrated confidence” is a dead end if `calibrated` is merely a field name. Until a corpus connects scores to observed correctness, the truthful representation is `rankScore + calibration.status=unvalidated` and the safe action is bounded clarification or defer.

## Edge Cases
- Ambiguous input: “subsumes all three archetypes” was interpreted as a shared terminal action protocol, not removal of their distinct evidence mechanisms.
- Contradictory evidence: the code calls its bounded value `confidence`, while calibration literature reserves probabilistic meaning for estimates tied to correctness likelihood. The schema resolves the semantic conflict by separating `rankScore` from optional validated correctness estimates.
- Missing dependencies: this packet has no observed, held-out zero-signal routing corpus. Probability calibration, risk thresholds, the 256-token cap, and user-friction acceptability remain unvalidated proposals.
- Partial success: the contract and measurable budget are specified, but no empirical threshold is claimed. This is sufficient for a complete contract-level iteration, not for production promotion.

## Sources Consulted
- .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:381
- .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:431
- .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:761
- .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:766
- .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:772
- .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:851
- .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_hub_router_schema.md:227
- .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_hub_router_schema.md:229
- .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_hub_router_schema.md:231
- .opencode/specs/sk-doc/019-sk-doc-router-alignment/021-default-mode-policy-research/spec.md:116
- .opencode/specs/sk-doc/019-sk-doc-router-alignment/021-default-mode-policy-research/spec.md:117
- https://arxiv.org/abs/1706.04599
- https://arxiv.org/abs/1705.08500
- https://modelcontextprotocol.io/specification/2025-06-18/client/elicitation

## Assessment
- New information ratio: 0.80 (3 fully new findings, 2 partially new findings, no simplicity bonus)
- Questions addressed: Does a calibrated confidence-first controller subsume named-default, defer-routed, and detection-routed archetypes?
- Questions answered: none of the lineage's remaining exact questions.

The controller subsumes the archetypes' terminal choice but not their evidence or execution contracts. This advances the remaining architecture-smell question without resolving whether `INTENT_SIGNALS + RESOURCE_MAP` can be replaced.

## Reflection
- What worked and why: reading the actual confidence and uncertainty formulas before importing calibration vocabulary exposed the score/probability mismatch; selective classification then supplied a precise risk/coverage frame for abstention.
- What did not work and why: a universal numeric threshold cannot be justified from contracts or external classifier results because the required router-specific outcome corpus does not exist.
- What I would do differently: build the next iteration around an information-preservation test—list the minimum capability, evidence, resource, and authority fields, then prove which current fields are derivable or redundant.

## Recommended Next Focus
Radical simplification of `INTENT_SIGNALS + RESOURCE_MAP`: test a capability/type-directed minimal replacement and identify what information cannot be removed.
