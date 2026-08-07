# Iteration 1: Correctness — deterministic hub routing

## Focus

Deterministic scoring, positive-route recall, default-resource behavior, and defer semantics across the six-mode router.

## Files Reviewed

- `.opencode/skills/mcp-tooling/mode-registry.json`
- `.opencode/skills/mcp-tooling/hub-router.json`
- `.opencode/skills/mcp-tooling/SKILL.md`
- `.opencode/skills/mcp-tooling/description.json`
- `.opencode/skills/mcp-tooling/manual_testing_playbook/hub_routing/*.md`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs`
- `.opencode/skills/sk-doc/create-skill/references/parent_skill/parent_hub_router_schema.md`

## Scorecard

- Dimensions covered: correctness
- Hub scenarios replayed: 13 (7 primary + 6 holdouts)
- New findings: P0=2 P1=2 P2=0
- New findings ratio: 1.00

## Findings

### P0

- **F001**: Explicit Figma render/export scenario produces no Figma intent, `.opencode/skills/mcp-tooling/hub-router.json:141`, the shipped replay uses exact lowercase substring matching, but MT-003's “Render this component in Figma and export the design tokens” contains none of the declared Figma phrases contiguously; the result is `intents=[]` with the Chrome default resource. [SOURCE: .opencode/skills/mcp-tooling/manual_testing_playbook/hub_routing/figma_transport.md:15] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:376]
- **F002**: Chrome packet is unconditionally loaded on every non-Chrome route, `.opencode/skills/mcp-tooling/hub-router.json:20`, `defaultResource` is `mcp-chrome-devtools/SKILL.md` and the consumer unions that resource before every selected-mode resource; replay therefore loads Chrome alongside ClickUp, Aside, Refero, and Mobbin despite their single-mode expected resources. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:512]

### P1

- **F003**: Shared hub-identity vocabulary defeats the defer contract, `.opencode/skills/mcp-tooling/hub-router.json:25`, every mode references the same weight-4 `hub-identity` class, so MT-004's exact “mcp tool bridge” phrase gives all six modes score 4 and selects them all instead of deferring. [SOURCE: .opencode/skills/mcp-tooling/manual_testing_playbook/hub_routing/ambiguous_defer.md:14] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:404]
- **F004**: Five of six blind hub holdouts have zero lexical recall, `.opencode/skills/mcp-tooling/hub-router.json:101`, only MT-H01 matches a committed keyword; MT-H02/H03/H04/H05/H06 each score no mode and inherit Chrome's default resource, contradicting the corpus expectations for Figma, ClickUp, Aside, Refero, and Mobbin. [SOURCE: .opencode/skills/mcp-tooling/manual_testing_playbook/hub_routing/holdout_browser_inspect.md:13] [SOURCE: .opencode/skills/mcp-tooling/manual_testing_playbook/hub_routing/holdout_agentic_browser.md:14]

### P2

- None.

## Claim Adjudication

```json
{"findingId":"F001","claim":"The committed explicit Figma render/export scenario does not select mcp-figma in the shipped deterministic replay.","evidenceRefs":[".opencode/skills/mcp-tooling/hub-router.json:141-159",".opencode/skills/mcp-tooling/manual_testing_playbook/hub_routing/figma_transport.md:15",".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:376-407"],"counterevidenceSought":"Checked every figma-aliases and design-transport keyword and replayed MT-003 through routeSkillResources.","alternativeExplanation":"A human LLM could infer the Figma intent semantically, but the benchmark and CI contract is explicitly deterministic exact-substring replay.","finalSeverity":"P0","confidence":0.99,"downgradeTrigger":"Downgrade only if the authoritative router is proven not to use router-replay semantics or the committed scenario selects mcp-figma in that consumer.","transitions":[{"iteration":1,"from":null,"to":"P0","reason":"Initial deterministic replay"}]}
```

```json
{"findingId":"F002","claim":"The Chrome packet resource is included on every routed request because it is configured as defaultResource and defaultResource is always unioned.","evidenceRefs":[".opencode/skills/mcp-tooling/hub-router.json:20-22",".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:512-518"],"counterevidenceSought":"Checked for hub-specific fallback-only handling and inspected replay outputs for ClickUp, Aside, Refero, and Mobbin.","alternativeExplanation":"The Chrome packet might have been intended as a universal preamble, but it is a full sibling SKILL.md and the scenarios explicitly exclude sibling packet loading.","finalSeverity":"P0","confidence":0.99,"downgradeTrigger":"Downgrade if defaultResource is demonstrably ignored for parent hubs or Chrome is documented and tested as a universal preamble for all modes.","transitions":[{"iteration":1,"from":null,"to":"P0","reason":"Initial producer-consumer trace"}]}
```

```json
{"findingId":"F003","claim":"Bare hub identity ties all six modes instead of producing the documented defer outcome.","evidenceRefs":[".opencode/skills/mcp-tooling/hub-router.json:25-99",".opencode/skills/mcp-tooling/manual_testing_playbook/hub_routing/ambiguous_defer.md:14-22",".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:384-407"],"counterevidenceSought":"Checked for weak-signal treatment, class-specific weights, and explicit defer post-processing; none exists in the replay path.","alternativeExplanation":"routeTelemetry labels a multi-mode result ambiguous, but it still returns all six modes/resources rather than the expected empty/defer result.","finalSeverity":"P1","confidence":0.98,"downgradeTrigger":"Downgrade if a later authoritative stage converts this exact six-way tie into a disambiguation without loading packets.","transitions":[{"iteration":1,"from":null,"to":"P1","reason":"Initial deterministic replay"}]}
```

```json
{"findingId":"F004","claim":"Five of the six committed natural-language holdouts do not match any router vocabulary phrase.","evidenceRefs":[".opencode/skills/mcp-tooling/hub-router.json:101-220",".opencode/skills/mcp-tooling/manual_testing_playbook/hub_routing/holdout_agentic_browser.md:14-18",".opencode/skills/mcp-tooling/manual_testing_playbook/hub_routing/holdout_design_tokens.md:13-15",".opencode/skills/mcp-tooling/manual_testing_playbook/hub_routing/holdout_task_tracking.md:14-18",".opencode/skills/mcp-tooling/manual_testing_playbook/hub_routing/holdout_web_design_reference.md:14-18",".opencode/skills/mcp-tooling/manual_testing_playbook/hub_routing/holdout_mobile_pattern_research.md:14-18"],"counterevidenceSought":"Replayed all six holdouts and checked partial substrings against every expanded vocabulary class.","alternativeExplanation":"A generative router could infer paraphrases, but the committed deterministic replay is the declared CI path.","finalSeverity":"P1","confidence":0.99,"downgradeTrigger":"Downgrade when the five holdouts select their intended mode in the authoritative replay or are explicitly removed from the executable gold corpus.","transitions":[{"iteration":1,"from":null,"to":"P1","reason":"Initial holdout replay"}]}
```

## Traceability Checks

- Not the dedicated traceability iteration; source-to-consumer routing evidence was recorded for correctness.

## Assessment

- New findings ratio: 1.00
- Dimensions addressed: correctness
- Novelty justification: four distinct failure classes were observed in deterministic replay.

## Ruled Out

- Registry/router key-set drift: ruled out; both enumerate the same six workflowMode keys. [SOURCE: .opencode/skills/mcp-tooling/mode-registry.json:31] [SOURCE: .opencode/skills/mcp-tooling/hub-router.json:24]
- MT-H01 Chrome-versus-Aside boundary regression: ruled out; “network requests” gives Chrome a positive score while Aside remains zero. [SOURCE: .opencode/skills/mcp-tooling/manual_testing_playbook/hub_routing/holdout_browser_inspect.md:13] [SOURCE: .opencode/skills/mcp-tooling/hub-router.json:111]

## Dead Ends

- Treating tieBreak as a single-winner policy: the consumer retains all intents within delta 1; tieBreak does not collapse them.

## Next Focus

Security and collision boundaries: shared design-transport vocabulary, Chrome-versus-Aside contamination, transport write permissions, and sk-design ownership separation.

Review verdict: FAIL
