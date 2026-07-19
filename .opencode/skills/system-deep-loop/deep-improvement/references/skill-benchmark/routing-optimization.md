---
title: "Skill Routing Optimization"
description: "Lane C methodology for improving a skill's live routing score by fixing real router reachability, gold alignment, and over-routing issues without gaming the benchmark."
trigger_phrases:
  - "skill routing optimization"
  - "raise live routing score"
  - "lane c routing remediation"
  - "resource map optimization"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Skill Routing Optimization

Lane C rewards skills that route to the right resources for the right task, keep every declared support file reachable, and avoid loading unrelated material. Raising a live routing score is therefore a remediation exercise, not a metric exercise: make the router express the skill's real operating contract, then align the benchmark gold to that contract.

This reference covers the common score blockers and the safe changes that improve them without hiding defects.

---

## 1. OVERVIEW

The fastest honest score gains usually come from five places:

- **D5 structural connectivity** — every real `references/*.md` and `assets/*.md` file must be reachable through a meaningful `RESOURCE_MAP` intent.
- **D5 ALWAYS coverage** — files the skill always loads must still be mapped into intent/resource coverage so they are credited instead of appearing disconnected.
- **D1/D2 gold alignment** — private scenario gold must include legitimate base loads, especially resources the router always selects.
- **D3 efficiency** — eager loads that are not needed for a scenario should be intent-gated.
- **Parent-hub drift** — parent `RESOURCE_MAP` must remain the union of child routes, with every child reachable.

Treat the benchmark report as a funnel: fix hard structural failures first, then fix scenario gold, then reduce genuine waste.

## 2. D5 ORPHAN REFERENCES

Signal: `D5 orphan_reference`.

What the benchmark sees: a file under `references/*.md` or `assets/*.md` exists, but no parseable `RESOURCE_MAP` path can reach it. Lane C treats that as a structural connectivity defect because the skill cannot reliably route to material it ships.

Concrete remediation:

1. List every D5 `orphan_reference` path from the Skill Benchmark Report.
2. For each path, identify the real task intent that needs it. Do not create a junk intent such as `misc` unless the skill genuinely has a miscellaneous workflow.
3. Add the file to that intent's `RESOURCE_MAP` entry.
4. Add only domain-language `INTENT_SIGNALS` keywords that would appear in a user's real prompt for that intent.
5. Add or update at least one scenario whose private `expected.resources` includes the newly reachable file when that file is required for the task.
6. Re-run Lane C and confirm the D5 orphan finding is gone and D1/D2 recall did not drop.

Good pattern:

```text
User task language -> INTENT_SIGNALS key -> RESOURCE_MAP intent -> concrete reference or asset path
```

Avoid:

- Mapping an orphan into an unrelated high-traffic intent just to make D5 green.
- Adding keywords copied from the filename instead of user-domain language.
- Adding every orphan to every intent, which fixes D5 but usually creates D3 waste.

## 3. ALWAYS-TIER FILES NOT IN RESOURCE_MAP

Signal: D5 coverage gaps and D1/D2 under-credit for files that are legitimately loaded as base context.

What the benchmark sees: a file is loaded by the skill's always-on path, but the router map does not declare where it belongs. That can make a real base load look structurally disconnected or invisible to scenario scoring.

Concrete remediation:

1. Identify the skill's ALWAYS-tier files: the files loaded for nearly every activation because they define contracts, safety rules, common workflow, or router doctrine.
2. Decide whether each file is truly universal or only frequently useful. Universal files can remain base loads; frequently useful files should move behind intents.
3. Add universal files to the relevant `RESOURCE_MAP` entries that depend on them. If every intent needs the file, include it in every meaningful intent rather than leaving it unrepresented.
4. Keep `INTENT_SIGNALS` focused on task language. Do not add broad keywords solely to pull an ALWAYS file into more scenarios.
5. Update private scenario gold so `expected.resources` includes the ALWAYS files that the router legitimately loads for that scenario.
6. Re-run the benchmark and inspect both D5 and D3. A base load should be credited when legitimate, but it should still count as waste when it is unrelated.

Rule of thumb: if the skill would be unsafe or impossible to execute without the file, make it visible in `RESOURCE_MAP`; if it is only occasionally useful, intent-gate it.

## 4. GOLD ALIGNMENT FOR LEGITIMATE BASE LOADS

Signals: D1-intra resource recall, D2 discovery recall, and D3 over-routing.

What the benchmark sees: router output is scored against private gold. If a scenario's `expected.resources` omits files the router always and legitimately loads, D3 may classify those files as wasted routing even though they are part of the correct base context.

Concrete remediation:

1. For each scenario, replay the router and record the resources it always selects before intent-specific additions.
2. Classify each base resource as legitimate for the scenario or genuinely unrelated.
3. Add legitimate base resources to the private gold field (`expected.resources`; also called `expected_resources` in some report prose).
4. Leave unrelated base resources out of gold. They should remain visible as D3 waste.
5. For scenarios with negative activation, verify gold does not accidentally bless resources from the skill that should not activate.
6. Keep public prompts uncontaminated: they must not name skill ids, route keys, resource basenames, or commands unless the scenario is explicitly testing router keywords under the allowed lint mode.

Gold alignment is not inventing new truth; it is making scorer-only gold match the router contract the skill actually promises.

## 5. GENUINE OVER-ROUTING

Signal: D3 efficiency, computed as wasted routed resources over total routed resources in Mode A and replaced by live calls/tokens-to-first-expected in Mode B.

What the benchmark sees: the router selected resources that were not expected for the scenario. If those resources are not legitimate base loads, D3 is correctly reporting over-routing.

Concrete remediation:

1. Sort scenarios by lowest D3 score or largest wasted-routed count.
2. For each wasted file, ask whether a skilled human would need it to answer that prompt.
3. If no, remove it from the eager route and place it behind the narrowest meaningful intent.
4. Add or tighten `INTENT_SIGNALS` so the file loads only when user-domain language indicates that intent.
5. If the file is useful only after another decision point, keep it as a deferred resource or child-mode resource rather than a default load.
6. Re-run Lane C and verify D3 improves without hurting D1/D2 recall for scenarios that genuinely need the file.

Do not solve D3 by deleting resources from gold or from the skill when they are actually required. Solve it by making the router discriminate.

## 6. PARENT-HUB ROUTING

Signals: D5 dead paths, orphan children, parent/child drift, D1/D2 misses for child routes.

What the benchmark sees: a parent skill is a router surface. If child skills own workflow-specific resources, the parent must still expose a coherent union route so every child can be reached from the parent activation path.

Concrete remediation:

1. Treat the parent `RESOURCE_MAP` as the union of child `RESOURCE_MAP` entries, not as a hand-written subset.
2. For every child, confirm there is at least one parent intent that reaches that child or the child's entrypoint resource.
3. Keep parent `INTENT_SIGNALS` broad enough to choose the correct child, but not so broad that sibling children activate together by default.
4. Add a drift guard to the maintenance workflow: when a child adds, removes, or renames a route, update the parent union in the same change.
5. Add coverage scenarios for each child route and at least one sibling negative/adversarial prompt.
6. Re-run Lane C on both the child and parent. The child should pass its own routing contract; the parent should pass reachability and avoid sibling over-routing.

Parent hubs should make children discoverable, not flatten all child resources into one always-loaded bundle.

## 7. DO NOT GAME THE METRIC

Lane C is useful only if the router, resources, and private gold represent real behavior.

Do not:

- Invent gold resources that a scenario does not need.
- Add keywords that cause the skill to activate for the wrong user intent.
- Hide unrelated eager loads by marking everything expected.
- Move every file into ALWAYS-tier to bypass intent routing.
- Create placeholder intents whose only purpose is to silence `orphan_reference`.
- Let parent hubs over-claim child routes they cannot safely execute.

Accept lower scores when they describe real ambiguity. Fix the skill, the route map, or the scenario authoring; do not train the benchmark to lie.

## 8. REMEDIATION ORDER

Use this order when improving a skill after a Lane C run:

1. Fix D5 P0/P1 structural findings first: unparseable router, dead routed paths, path escapes, orphan references, and dead intent keys.
2. Map ALWAYS-tier files into meaningful `RESOURCE_MAP` coverage.
3. Align private scenario gold with legitimate base loads.
4. Intent-gate genuine over-routing until D3 waste reflects only acceptable base context.
5. For parent hubs, update the parent union and confirm every child is reachable.
6. Re-run deterministic Mode A; enable advisor/live probes only after static routing is structurally clean.

The expected result is not merely a higher number. It is a router whose score explains the skill's real behavior: reachable resources, honest gold, narrow intent gates, and no silent parent/child drift.
