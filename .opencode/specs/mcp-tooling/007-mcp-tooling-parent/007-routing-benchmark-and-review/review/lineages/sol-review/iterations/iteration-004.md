# Iteration 4: Maintainability — six packet recall packs

## Focus

Deterministic replay of every `intra_routing_recall` scenario in all six mode packets, exact intent/resource contract comparison, and benchmark-to-runtime fallback parity.

## Files Reviewed

- `mcp-aside-devtools/SKILL.md` and 8 intra-routing scenarios
- `mcp-chrome-devtools/SKILL.md` and 8 intra-routing scenarios
- `mcp-click-up/SKILL.md` and 7 intra-routing scenarios
- `mcp-figma/SKILL.md` and 9 intra-routing scenarios
- `mcp-mobbin/SKILL.md` and 9 intra-routing scenarios
- `mcp-refero/SKILL.md` and 8 intra-routing scenarios
- skill-benchmark router replay and routing-optimization contracts

## Scorecard

- Dimensions covered: maintainability
- Packet scenarios replayed: 49/49
- Declared intent satisfied: 45/49
- Declared resource set satisfied exactly: 31/49
- Full intent + exact-resource contract satisfied: 29/49
- Blind holdout intent recall: 8/12
- New findings: P0=0 P1=3 P2=1
- New findings ratio: 1.00

## Per-Packet Results

| Packet | Scenarios | Intent pass | Full contract pass |
|---|---:|---:|---:|
| Aside | 8 | 8 | 3 |
| Chrome DevTools | 8 | 8 | 4 |
| ClickUp | 7 | 5 | 5 |
| Figma | 9 | 9 | 8 |
| Mobbin | 9 | 7 | 4 |
| Refero | 8 | 8 | 5 |

## Findings

### P0

- None.

### P1

- **F012**: Four of twelve packet blind holdouts miss their declared intent: ClickUp CU-H01/CU-H02 and Mobbin MB-H01/MB-H02 all score zero. The prompts intentionally paraphrase daily/advanced ClickUp work and screen/flow research without copying router keywords, demonstrating that two packets' local recall fails on both of their natural-language generalization cases. [SOURCE: .opencode/skills/mcp-tooling/mcp-click-up/manual_testing_playbook/intra_routing_recall/holdout_daily.md:13] [SOURCE: .opencode/skills/mcp-tooling/mcp-click-up/manual_testing_playbook/intra_routing_recall/holdout_advanced.md:13] [SOURCE: .opencode/skills/mcp-tooling/mcp-mobbin/manual_testing_playbook/intra_routing_recall/holdout_screens.md:13] [SOURCE: .opencode/skills/mcp-tooling/mcp-mobbin/manual_testing_playbook/intra_routing_recall/holdout_flows.md:13]
- **F013**: Every packet's negative scenario requires `expected_intent:none` and no reference load, yet each runtime pseudocode takes a no-score fallback that loads a packet reference; Aside/Chrome also return `UNKNOWN`, Figma returns `CONNECT_SETUP_DAEMON`, and Refero/Mobbin return `WIRING_AUTH`. The packet-local suppression contract is therefore unattainable in the documented runtime routers. [SOURCE: .opencode/skills/mcp-tooling/mcp-click-up/SKILL.md:210] [SOURCE: .opencode/skills/mcp-tooling/mcp-figma/SKILL.md:189] [SOURCE: .opencode/skills/mcp-tooling/mcp-mobbin/SKILL.md:181] [SOURCE: .opencode/skills/mcp-tooling/mcp-refero/SKILL.md:175]
- **F014**: Deterministic replay does not model those runtime no-match semantics. It reports no intent for all six negative prompts and no resource for ClickUp, while the documented routers return fallback labels and/or resources. ClickUp intentionally hides its hardcoded `cupt_commands.md` fallback from `DEFAULT_RESOURCE`, so router replay cannot observe the real path. [SOURCE: .opencode/skills/mcp-tooling/mcp-click-up/SKILL.md:155] [SOURCE: .opencode/skills/mcp-tooling/mcp-click-up/SKILL.md:210] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:504]

### P2

- **F015**: Eleven positive/holdout scenarios across Aside, Chrome, Mobbin, and Refero omit their documented always-loaded base reference from `expected_resources`. Their routers return the legitimate base preamble plus the listed intent resources, but the authored gold represents only the latter, creating predictable D3/gold drift once route-resource scoring is enabled. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/routing_optimization.md:78]

## Claim Adjudication

```json
{"findingId":"F012","claim":"Four of twelve committed packet-level blind holdouts do not select their expected intent under deterministic replay.","evidenceRefs":[".opencode/skills/mcp-tooling/mcp-click-up/manual_testing_playbook/intra_routing_recall/holdout_daily.md:13-17",".opencode/skills/mcp-tooling/mcp-click-up/manual_testing_playbook/intra_routing_recall/holdout_advanced.md:13-17",".opencode/skills/mcp-tooling/mcp-mobbin/manual_testing_playbook/intra_routing_recall/holdout_screens.md:13-17",".opencode/skills/mcp-tooling/mcp-mobbin/manual_testing_playbook/intra_routing_recall/holdout_flows.md:13-17",".opencode/skills/mcp-tooling/mcp-click-up/SKILL.md:115-151",".opencode/skills/mcp-tooling/mcp-mobbin/SKILL.md:118-140"],"counterevidenceSought":"Replayed all 12 holdouts across six packets and checked every failed prompt against the complete intent vocabulary.","alternativeExplanation":"The ClickUp files explicitly predict honest under-routing for keyword-only logic, but they still declare semantic expected intents and are part of the recall pack being reviewed.","finalSeverity":"P1","confidence":0.99,"downgradeTrigger":"Downgrade when these four files are explicitly reclassified as expected misses outside the acceptance corpus or select their declared intents.","transitions":[{"iteration":4,"from":null,"to":"P1","reason":"Complete six-packet recall sweep"}]}
```

```json
{"findingId":"F013","claim":"All six documented packet routers load fallback context for their out-of-domain negative scenario even though each negative gold contract requires no resources.","evidenceRefs":[".opencode/skills/mcp-tooling/mcp-aside-devtools/manual_testing_playbook/intra_routing_recall/negative.md:1-17",".opencode/skills/mcp-tooling/mcp-chrome-devtools/manual_testing_playbook/intra_routing_recall/negative.md:1-17",".opencode/skills/mcp-tooling/mcp-click-up/manual_testing_playbook/intra_routing_recall/negative.md:1-16",".opencode/skills/mcp-tooling/mcp-figma/manual_testing_playbook/intra_routing_recall/negative.md:1-17",".opencode/skills/mcp-tooling/mcp-mobbin/manual_testing_playbook/intra_routing_recall/negative.md:1-17",".opencode/skills/mcp-tooling/mcp-refero/manual_testing_playbook/intra_routing_recall/negative.md:1-17",".opencode/skills/mcp-tooling/mcp-click-up/SKILL.md:210-217",".opencode/skills/mcp-tooling/mcp-figma/SKILL.md:189-214"],"counterevidenceSought":"Traced each no-score branch rather than relying only on generic replay, including ClickUp's hardcoded fallback.","alternativeExplanation":"Fallback context can be useful after a packet has already been selected, but the authored negative contracts explicitly prohibit activation or reference loading.","finalSeverity":"P1","confidence":0.98,"downgradeTrigger":"Downgrade if packet-level negatives are formally redefined to permit fallback loads and their gold is updated consistently.","transitions":[{"iteration":4,"from":null,"to":"P1","reason":"Negative-gold-to-runtime branch trace"}]}
```

```json
{"findingId":"F014","claim":"The deterministic replay's no-match results are not behaviorally equivalent to the packet runtime pseudocode, including an invisible ClickUp fallback resource.","evidenceRefs":[".opencode/skills/mcp-tooling/mcp-click-up/SKILL.md:155-217",".opencode/skills/mcp-tooling/mcp-aside-devtools/SKILL.md:135-170",".opencode/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md:137-172",".opencode/skills/mcp-tooling/mcp-figma/SKILL.md:180-214",".opencode/skills/mcp-tooling/mcp-mobbin/SKILL.md:172-205",".opencode/skills/mcp-tooling/mcp-refero/SKILL.md:166-198",".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:376-407",".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:504-518"],"counterevidenceSought":"Compared generic replay output with every packet's explicit zero-score branch and fallback resource path.","alternativeExplanation":"The benchmark mirror intentionally abstracts runtime details, but intent/resource recall gold depends on exactly those details.","finalSeverity":"P1","confidence":0.98,"downgradeTrigger":"Downgrade if the runtime pseudocode is declared non-authoritative and an actual runtime consumer is proven equivalent to router replay.","transitions":[{"iteration":4,"from":null,"to":"P1","reason":"Benchmark-to-runtime parity trace"}]}
```

## Traceability Checks

- Prior traceability results remain active. This iteration adds complete `playbook_capability` evidence: 49/49 packet scenarios were replayed; 20 fail at least one authored intent/resource assertion.

## Assessment

- New findings ratio: 1.00
- Dimensions addressed: maintainability
- Novelty justification: packet holdout recall, suppression behavior, replay/runtime parity, and base-resource gold maintenance are independent failure classes.
- Stop policy: `max-iterations`; iteration 4 reached. Convergence telemetry did not truncate review breadth.

## Ruled Out

- Unparseable packet routers: ruled out; all six expose a parseable deterministic intent/resource map.
- Missing routed files: ruled out for the 49 replayed cases; every returned resource path exists.
- General packet-level positive recall failure: bounded to ClickUp and Mobbin holdouts; all 37 non-holdout positive intent expectations and the other eight holdouts select their declared intent.

## Dead Ends

- Counting any expected-resource subset as a full contract pass: the routing methodology explicitly distinguishes legitimate base gold alignment from genuine extra-resource waste.

## Next Focus

Maximum iteration count reached; synthesize the active findings and remediation workstreams without changing reviewed sources.

Review verdict: CONDITIONAL
