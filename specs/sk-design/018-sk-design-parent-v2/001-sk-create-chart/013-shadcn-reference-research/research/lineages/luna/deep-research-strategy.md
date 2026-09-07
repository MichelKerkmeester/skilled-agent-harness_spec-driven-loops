# Deep Research Strategy

## Research Topic

Which of shadcn's chart decisions should our standalone-HTML corpus adopt, and which of ours are already better. Six angles, one per iteration, in order.

## Known Context

- The frozen local shadcn corpus contains 70 chart examples plus the shared `chart.tsx` helper.
- The standalone corpus contains 26 templates and six examples, with a question-first catalog and a static corpus checker.
- The static checker baseline passed with 0 errors before this lineage began.
- Research is local-only. No network fetch, rebuild, implementation, or sibling-agent dispatch is permitted.
- The in-app browser inventory was empty, so runtime keyboard walking cannot be claimed from this session.

## Non-Goals

- Do not add or modify templates, checker rules, dependencies, or production code.
- Do not fetch current shadcn sources or infer behavior not visible in the frozen corpus.
- Do not treat presentation variants as new chart forms without a distinct reader question.

## Key Questions

1. Which shadcn examples are distinct reader-question forms rather than restyles, and which are answered by the 26-template corpus?
2. How many edit sites are needed to retarget data, series, and presentation in each system?
3. What tooltip, pointer, accessibility, and keyboard contract is actually evidenced?
4. How do the shadcn five-token ramps compare numerically with the local palette systems?
5. What defaults and explicit choices affect domains, baselines, stacking, curves, gaps, and ticks?
6. Which findings are enforceable by the current checker and which remain per-template judgement?

## Answered Questions

- Q1: The useful comparison unit is a reader-question form; radar and pie/donut are deliberate substitutions or omissions.
- Q2: One adjustment point is reachable for schema-preserving `CHART_DATA` replacement, not arbitrary semantic or schema changes.
- Q3: Keep the standalone table and explicit interaction register as the floor; adopt shadcn semantic tooltip knobs locally; runtime keyboard and pointer behavior remains unverified.
- Q4: Keep standalone role-specific ramps and numeric gates; adopt only shadcn-style token indirection, not the raw five-token ramp.
- Q5: Keep standalone direct-path and gap policy; adopt explicit per-form interpolation choices and do not treat shadcn natural interpolation as a measured-data default.
- Q6: Existing checks cover structural, palette, catalog, static interaction, and determinism findings; runtime, semantic data accuracy, CVD/hue, keyboard, and arbitrary retargetability require new evidence or contracts.

## What Worked

- Local source inventory and read-only scripts produced reproducible counts.
- The static checker provided a green baseline and named assertion/error boundaries.
- Local OKLCH conversion and contrast/CVD calculations supplied numeric palette evidence.

## What Failed

- In-app browser startup was unavailable, so no actual keyboard walk or runtime pointer test was possible.

## Exhausted Approaches

- Browser inventory: `agent.browsers.list()` returned an empty list and setup reported that no browser was available.
- Network research was intentionally not attempted because the worker prompt freezes the local corpus and forbids fetching.

## Ruled-Out Directions

- Counting all 70 shadcn files as distinct forms.
- Treating tooltip-only examples as geometry forms.
- Replacing local measurements with source-only accessibility or palette claims.

## Stop Conditions

- Continue through all six angles even if convergence telemetry crosses the configured threshold.
- Terminal synthesis must record `stopReason` as `maxIterationsReached`.

## Synthesis

- Six inline iterations completed and consolidated into `research.md` and `synthesis-v1.md`.
- Terminal stop reason: `maxIterationsReached`.
- Questions answered: 6 / 6; four residual product/runtime/policy questions remain explicit in the synthesis.

## Next Focus

No further loop focus. The lineage is terminal; any continuation requires a new run or an external browser/policy decision.
