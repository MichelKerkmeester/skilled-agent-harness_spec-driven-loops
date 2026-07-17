---
title: Deep Research Strategy - Parent-Hub defaultMode Policy
description: Runtime strategy for the parent-hub defaultMode policy research loop.
trigger_phrases:
  - "default mode policy research strategy"
importance_tier: normal
contextType: planning
---

# Deep Research Strategy - Parent-Hub defaultMode Policy

## 1. OVERVIEW

### Purpose

Maintain the externalized research plan, evidence coverage, negative knowledge, and next focus for this loop.

## 2. TOPIC

Determine when a pure parent hub should default to a child mode versus defer with `defaultMode: null`, issue per-hub verdicts for all seven hubs, and specify the exact create-skill canon and route-gold encoding.

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] What does deterministic router replay actually do when no intent scores and `defaultMode` is a child versus `null`, including `sameSet` behavior?
- [x] What evidence-backed decision rule distinguishes a genuine dominant child from a presumptive default?
- [ ] Which of the five auto-defaulting hubs should keep its child default, and which should flip to `null`, based on mode mix and misroute cost?
- [ ] How do the `sk-doc` defer model and `sk-code` detection model constrain the fleet policy?
- [ ] What exact create-skill canon and route-gold benchmark changes encode default, defer, and detect outcomes deliberately?

<!-- /ANCHOR:key-questions -->

## 4. NON-GOALS

- Do not change any shipped hub's `defaultMode`.
- Do not implement the proposed create-skill or benchmark changes.
- Do not evaluate Layer-0 skill-advisor selection.
- Do not propose a parent hub as its own mode.

## 5. STOP CONDITIONS

- Run all 5 requested iterations because convergence mode is `off`.
- Cover router semantics, all seven hubs, the two null patterns, create-skill canon, and route-gold encoding with file citations.
- Preserve unresolved uncertainty and eliminated alternatives rather than manufacturing an implementation decision.

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- What evidence-backed decision rule distinguishes a genuine dominant child from a presumptive default?

<!-- /ANCHOR:answered-questions -->

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- reading the score-to-return data path established the behavior directly and avoided inferring fallback from policy names. (iteration 1)
- comparing the scaffold, benchmark contract, and two shipped null variants exposed both the missing author declaration and the missing observable assertion surface. (iteration 3)

<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- the bounded helper-name search found no `sameSet` implementation in the benchmark CJS directory, indicating the comparison is implemented elsewhere or expressed through another helper name. (iteration 1)
- current intent exact-set gold cannot distinguish the policy variants because zero signal emits the same empty intent set. (iteration 3)

<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **Existing `defaultMode` as proof of genuine dominance.** Multiple parent contracts explicitly defer on ambiguity even while their router metadata names a child, so the configuration is the hypothesis under test, not evidence for itself. [SOURCE: .opencode/skills/cli-external-orchestration/SKILL.md:56-64] [SOURCE: .opencode/skills/system-deep-loop/SKILL.md:51-68] [SOURCE: .opencode/skills/mcp-tooling/SKILL.md:59-65] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Existing `defaultMode` as proof of genuine dominance.** Multiple parent contracts explicitly defer on ambiguity even while their router metadata names a child, so the configuration is the hypothesis under test, not evidence for itself. [SOURCE: .opencode/skills/cli-external-orchestration/SKILL.md:56-64] [SOURCE: .opencode/skills/system-deep-loop/SKILL.md:51-68] [SOURCE: .opencode/skills/mcp-tooling/SKILL.md:59-65]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Existing `defaultMode` as proof of genuine dominance.** Multiple parent contracts explicitly defer on ambiguity even while their router metadata names a child, so the configuration is the hypothesis under test, not evidence for itself. [SOURCE: .opencode/skills/cli-external-orchestration/SKILL.md:56-64] [SOURCE: .opencode/skills/system-deep-loop/SKILL.md:51-68] [SOURCE: .opencode/skills/mcp-tooling/SKILL.md:59-65]

### **Mode count alone as the policy.** `sk-doc` has many modes and nulls, but the decisive property is unresolved choice/cost; `sk-code` also nulls despite being able to detect and bundle a surface separately. [SOURCE: .opencode/skills/sk-doc/hub-router.json:4-34] [SOURCE: .opencode/skills/sk-code/SKILL.md:50-57] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Mode count alone as the policy.** `sk-doc` has many modes and nulls, but the decisive property is unresolved choice/cost; `sk-code` also nulls despite being able to detect and bundle a surface separately. [SOURCE: .opencode/skills/sk-doc/hub-router.json:4-34] [SOURCE: .opencode/skills/sk-code/SKILL.md:50-57]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Mode count alone as the policy.** `sk-doc` has many modes and nulls, but the decisive property is unresolved choice/cost; `sk-code` also nulls despite being able to detect and bundle a surface separately. [SOURCE: .opencode/skills/sk-doc/hub-router.json:4-34] [SOURCE: .opencode/skills/sk-code/SKILL.md:50-57]

### **Tie-break or registry order as dominance evidence.** The peer modes in CLI, deep-loop, MCP, and design carry equal weights; ordering resolves ties but does not measure `P(mode|Z)`. [SOURCE: .opencode/skills/cli-external-orchestration/hub-router.json:4-30] [SOURCE: .opencode/skills/system-deep-loop/hub-router.json:4-50] [SOURCE: .opencode/skills/mcp-tooling/hub-router.json:4-91] [SOURCE: .opencode/skills/sk-design/hub-router.json:4-91] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Tie-break or registry order as dominance evidence.** The peer modes in CLI, deep-loop, MCP, and design carry equal weights; ordering resolves ties but does not measure `P(mode|Z)`. [SOURCE: .opencode/skills/cli-external-orchestration/hub-router.json:4-30] [SOURCE: .opencode/skills/system-deep-loop/hub-router.json:4-50] [SOURCE: .opencode/skills/mcp-tooling/hub-router.json:4-91] [SOURCE: .opencode/skills/sk-design/hub-router.json:4-91]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Tie-break or registry order as dominance evidence.** The peer modes in CLI, deep-loop, MCP, and design carry equal weights; ordering resolves ties but does not measure `P(mode|Z)`. [SOURCE: .opencode/skills/cli-external-orchestration/hub-router.json:4-30] [SOURCE: .opencode/skills/system-deep-loop/hub-router.json:4-50] [SOURCE: .opencode/skills/mcp-tooling/hub-router.json:4-91] [SOURCE: .opencode/skills/sk-design/hub-router.json:4-91]

### A dedicated `sameSet()` implementation in the skill-benchmark CJS directory was not found by the bounded source search. The exact-equality semantics are nevertheless explicit in the packet's benchmark documentation, so broadening the search would add little to this focus. [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/routing-before-after.md:146-147] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: A dedicated `sameSet()` implementation in the skill-benchmark CJS directory was not found by the bounded source search. The exact-equality semantics are nevertheless explicit in the packet's benchmark documentation, so broadening the search would add little to this focus. [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/routing-before-after.md:146-147]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A dedicated `sameSet()` implementation in the skill-benchmark CJS directory was not found by the bounded source search. The exact-equality semantics are nevertheless explicit in the packet's benchmark documentation, so broadening the search would add little to this focus. [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/routing-before-after.md:146-147]

### No consulted canonical hub artifact contains representative zero-signal traffic counts or adjudicated misroute-cost telemetry. Therefore all verdicts remain provisional; repeating policy prose cannot turn them into empirical dominance claims. The smallest decisive evidence is a labeled held-out corpus for each hub's zero-signal branch. [INFERENCE: based on the five mode registries, five hub routers, and five parent routing contracts consulted this iteration] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: No consulted canonical hub artifact contains representative zero-signal traffic counts or adjudicated misroute-cost telemetry. Therefore all verdicts remain provisional; repeating policy prose cannot turn them into empirical dominance claims. The smallest decisive evidence is a labeled held-out corpus for each hub's zero-signal branch. [INFERENCE: based on the five mode registries, five hub routers, and five parent routing contracts consulted this iteration]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No consulted canonical hub artifact contains representative zero-signal traffic counts or adjudicated misroute-cost telemetry. Therefore all verdicts remain provisional; repeating policy prose cannot turn them into empirical dominance claims. The smallest decisive evidence is a labeled held-out corpus for each hub's zero-signal branch. [INFERENCE: based on the five mode registries, five hub routers, and five parent routing contracts consulted this iteration]

### Reusing only `expected_intent: []` for zero-signal policy: exact-set success is identical for named-child and null under current replay. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/README.md:176-178] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:342-352] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Reusing only `expected_intent: []` for zero-signal policy: exact-set success is identical for named-child and null under current replay. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/README.md:176-178] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:342-352]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reusing only `expected_intent: []` for zero-signal policy: exact-set success is identical for named-child and null under current replay. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/README.md:176-178] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:342-352]

### Treating `routeTelemetry.defaultApplied: true` as evidence that the child was selected is ruled out by the simultaneous `workflowMode: null` assignment. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:342-353] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Treating `routeTelemetry.defaultApplied: true` as evidence that the child was selected is ruled out by the simultaneous `workflowMode: null` assignment. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:342-353]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `routeTelemetry.defaultApplied: true` as evidence that the child was selected is ruled out by the simultaneous `workflowMode: null` assignment. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:342-353]

### Treating the first workflow placeholder or hub-identity vocabulary owner as an implicit dominance declaration: those are scaffold mechanics, not traffic or expected-loss evidence. [SOURCE: .opencode/skills/sk-doc/create-skill/assets/parent_skill/parent_skill_hub_router_template.json:5-16] [SOURCE: .opencode/skills/sk-doc/create-skill/assets/parent_skill/parent_skill_hub_router_template.json:37] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Treating the first workflow placeholder or hub-identity vocabulary owner as an implicit dominance declaration: those are scaffold mechanics, not traffic or expected-loss evidence. [SOURCE: .opencode/skills/sk-doc/create-skill/assets/parent_skill/parent_skill_hub_router_template.json:5-16] [SOURCE: .opencode/skills/sk-doc/create-skill/assets/parent_skill/parent_skill_hub_router_template.json:37]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the first workflow placeholder or hub-identity vocabulary owner as an implicit dominance declaration: those are scaffold mechanics, not traffic or expected-loss evidence. [SOURCE: .opencode/skills/sk-doc/create-skill/assets/parent_skill/parent_skill_hub_router_template.json:5-16] [SOURCE: .opencode/skills/sk-doc/create-skill/assets/parent_skill/parent_skill_hub_router_template.json:37]

<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- A dedicated `sameSet()` implementation in the skill-benchmark CJS directory was not found by the bounded source search. The exact-equality semantics are nevertheless explicit in the packet's benchmark documentation, so broadening the search would add little to this focus. [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/routing-before-after.md:146-147] (iteration 1)
- Treating `routeTelemetry.defaultApplied: true` as evidence that the child was selected is ruled out by the simultaneous `workflowMode: null` assignment. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:342-353] (iteration 1)
- **Existing `defaultMode` as proof of genuine dominance.** Multiple parent contracts explicitly defer on ambiguity even while their router metadata names a child, so the configuration is the hypothesis under test, not evidence for itself. [SOURCE: .opencode/skills/cli-external-orchestration/SKILL.md:56-64] [SOURCE: .opencode/skills/system-deep-loop/SKILL.md:51-68] [SOURCE: .opencode/skills/mcp-tooling/SKILL.md:59-65] (iteration 2)
- **Mode count alone as the policy.** `sk-doc` has many modes and nulls, but the decisive property is unresolved choice/cost; `sk-code` also nulls despite being able to detect and bundle a surface separately. [SOURCE: .opencode/skills/sk-doc/hub-router.json:4-34] [SOURCE: .opencode/skills/sk-code/SKILL.md:50-57] (iteration 2)
- **Tie-break or registry order as dominance evidence.** The peer modes in CLI, deep-loop, MCP, and design carry equal weights; ordering resolves ties but does not measure `P(mode|Z)`. [SOURCE: .opencode/skills/cli-external-orchestration/hub-router.json:4-30] [SOURCE: .opencode/skills/system-deep-loop/hub-router.json:4-50] [SOURCE: .opencode/skills/mcp-tooling/hub-router.json:4-91] [SOURCE: .opencode/skills/sk-design/hub-router.json:4-91] (iteration 2)
- No consulted canonical hub artifact contains representative zero-signal traffic counts or adjudicated misroute-cost telemetry. Therefore all verdicts remain provisional; repeating policy prose cannot turn them into empirical dominance claims. The smallest decisive evidence is a labeled held-out corpus for each hub's zero-signal branch. [INFERENCE: based on the five mode registries, five hub routers, and five parent routing contracts consulted this iteration] (iteration 2)
- Reusing only `expected_intent: []` for zero-signal policy: exact-set success is identical for named-child and null under current replay. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/README.md:176-178] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:342-352] (iteration 3)
- Treating the first workflow placeholder or hub-identity vocabulary owner as an implicit dominance declaration: those are scaffold mechanics, not traffic or expected-loss evidence. [SOURCE: .opencode/skills/sk-doc/create-skill/assets/parent_skill/parent_skill_hub_router_template.json:5-16] [SOURCE: .opencode/skills/sk-doc/create-skill/assets/parent_skill/parent_skill_hub_router_template.json:37] (iteration 3)

<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- What exact create-skill canon and route-gold schema should encode default, defer, and detect outcomes deliberately? (iteration 1)
- How do the `sk-doc` defer model and `sk-code` detection model constrain fleet policy? (iteration 1)
- What evidence-backed decision rule distinguishes a genuine dominant child from a presumptive default? (iteration 1)
- Which of the five auto-defaulting hubs should keep its child default, and which should flip to `null`? (iteration 1)
- What exact create-skill canon should force authors to declare and justify `default`, `defer`, or `detect`? (iteration 2)
- What exact route-gold schema and assertions should make named-child, null-defer, and detect-and-bundle outcomes observable despite iteration 1's replay limitation? (iteration 2)
- How should the `sk-doc` defer model and `sk-code` detect-and-bundle model be expressed as distinct fleet policy variants rather than merely controls? (iteration 2)
- What migration rule should grandfather shipped hubs whose named defaults lack the newly required corpus and cost evidence? (iteration 3)
- Which validator, template, scenario parser, evaluator, report, and test files must change to implement this canon without weakening existing route-gold? (iteration 3)
- Which five provisional fleet verdicts survive representative zero-signal corpus validation? (iteration 3)

<!-- /ANCHOR:carried-forward-open-questions -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Which five provisional fleet verdicts survive representative zero-signal corpus validation?

<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->

## 12. KNOWN CONTEXT

- Canonical framing: `.opencode/specs/sk-doc/019-sk-doc-router-alignment/021-default-mode-policy-research/spec.md:39-67`.
- Named comparison set: five child-default hubs (`sk-prompt`, `cli-external-orchestration`, `system-deep-loop`, `mcp-tooling`, `sk-design`) and two null models (`sk-doc`, `sk-code`).
- Resource map: `resource-map.md` not present; skipping coverage gate.
- Memory context: unavailable at initialization because the local Spec Kit Memory CLI could not resolve `@spec-kit/shared/paths`; agents should use direct repository evidence.

### Bounded Context Snapshot

- Source pointers: parent hub `SKILL.md` and `mode-registry.json` files; create-skill parent templates and schema docs; router replay and route-gold benchmark files.
- Reuse candidates: existing null policies in `sk-doc` and `sk-code`, plus current route-gold scenario schema.
- Integration points: `routerPolicy.defaultMode`, deterministic replay fallback, `sameSet` comparison, create-skill canon, and route-gold expected outcomes.
- Constraints and risks: `AMBIGUITY_DELTA` is hard-coded to 1; shipped default changes are proposals only; no implementation writes are authorized.

## 13. RESEARCH BOUNDARIES

- Max iterations: 5
- Convergence threshold: 0.05
- Convergence mode: off
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- Lifecycle mode: new, generation 1
- Canonical pause sentinel: `research/.deep-research-pause`
