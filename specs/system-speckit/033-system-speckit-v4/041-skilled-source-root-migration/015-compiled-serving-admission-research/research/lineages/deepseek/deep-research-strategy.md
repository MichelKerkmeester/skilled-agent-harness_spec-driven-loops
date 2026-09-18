# Deep Research Strategy

## Research Topic

How should a new parent hub be admitted to compiled-serving now that the Lane C parity harness is retired?
Compare three paths: (A) restore the retired legacy-parity path, (B) build a new checker of compiled
decisions from `compiledRoute()` against each routing scenario's gold, (C) keep admission closed.

## Known Context

- The Lane C harness was retired with the skill-benchmark lane in commit `b45ea54cea3` (subject:
  `feat(deep-loop)!: retire the skill-benchmark lane`). The four modules were deleted at
  `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/`: `compiled-routing-parity.cjs`,
  `score-skill-benchmark.cjs`, `router-replay.cjs`, `load-playbook-scenarios.cjs`, plus
  `tests/compiled-routing-parity.vitest.ts`. Read at `b45ea54cea3^`.
- Live compiled-routing code: `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs`
  (`compiledRoute()` at 94-106, `HUB_CHILD` at 30-36, five hubs) and `.../lib/resolve.cjs`
  (`DEFAULT_ON_HUBS` at 34-40, `resolveRoute()` at 101-121).
- The architecture reference for the admission chain is
  `.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/compiled-routing-architecture.md`
  (parity bar at 64-70, path to compiled-serving at 74-83).
- Scenario gold (`expected_workflow_mode`, `expected_leaf_resources`, `expected_resources`, `expected_intent`)
  is authored in per-skill `manual-testing-playbook/` files; e.g. `mcp-tooling` `hub-routing/` and
  `sk-code` `compiled-routing/`.
- The artifact root is the deepseek lineage directory. No writes outside it are authorized.
- `resource-map.md` is absent at initialization, so the coverage gate is skipped.
- This lineage is one of two fan-out lineages; its sibling (`swe2`) ran the same topic on cli-devin.
  Synthesis must stand on cited evidence, never on sibling agreement.

## Key Questions (remaining)

- [ ] KQ-1 (Q1): What exactly did Lane C parity measure, and which retired modules would a restored path need?
- [ ] KQ-2 (Q2): Can `compiledRoute(hubId, taskText)` checked against each routing scenario's gold
  (`expected_workflow_mode`, `expected_leaf_resources`) serve as the admission bar, and how should
  `defer`, holdout and negative scenarios count?
- [ ] KQ-3 (Q3): What else does admission need beyond the check — the frozen `HUB_CHILD` and
  `DEFAULT_ON_HUBS` tables, the activation manifest re-mint, and `compiled-route-guard.cjs` freshness?
- [ ] KQ-4 (Q4): What does each path cost and risk, including keeping admission closed?
- [ ] KQ-5 (Q5): Which path is recommended, and what would a later phase build and test?

## Non-Goals

- Do not implement any admission path; this is research.
- Do not change how the five admitted hubs serve today.
- Do not reopen the decision to retire the skill-benchmark lane as a whole.
- Do not edit repository source, generated artifacts or configuration outside this lineage.

## Stop Conditions

- Run exactly 5 evidence iterations because the fan-out stop policy is `max-iterations`.
- Convergence before iteration 5 is telemetry only; broaden the review angle instead of synthesizing early.
- Synthesis must record `stopReason: maxIterationsReached`.
- Preserve UNKNOWN claims with the missing evidence that would settle them.

## Answered Questions

None yet.

## What Worked

None yet.

## What Failed

None yet.

## Exhausted Approaches

None.

## Ruled Out Directions

None.

## Next Focus

Iteration 1 — Q1: read the four retired modules at `b45ea54cea3^` and establish, with line citations, exactly
what Lane C parity measured (comparison inputs, statuses, guards) and what a restore would have to bring back.
