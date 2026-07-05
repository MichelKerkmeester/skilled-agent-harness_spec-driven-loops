# Deep-Research Iteration 004: reduce-state reducer consolidation

> Engine: openai/gpt-5.5 --variant xhigh (read-only seat) · orchestrator-written.

Read-only scope confirmed. I’ll first surface existing memory/routing context, then read the established context report in full before inspecting the reducer/runtime files.
Memory trigger lookup timed out, so I’m continuing read-only using the supplied spec path and the startup advisor signal rather than blocking on memory transport. SKILL ROUTING: advisor hook surfaced `deep-context` and `deep-loop-runtime` above threshold; I’m loading `deep-context` because this is a focused read-only codebase research pass.
The relevant skill confirms this is a read-only analyzer pass and points specifically at the reducer/state robustness boundary. I’m now reading the established context report first, as requested, before comparing reducer bodies.
The baseline report already frames reducer consolidation as medium-risk: keep domain bodies per mode, centralize drifting durability/gate scaffolding. I’m now reading the four reducer files plus the runtime atomic/JSONL helpers to verify that recommendation at function-body level.
One expected path is different: `deep-improvement/scripts/reduce-state.cjs` does not exist at the flat scripts root, so I’m locating the actual reducer and continuing the capped deep-review read before drawing conclusions.
Confirmed the improvement reducer lives under `scripts/shared/`, not the flat scripts root. I’m reading that reducer now, then I’ll quantify which functions are shared plumbing versus mode/domain logic.
I’ve read the reducer/runtime helper bodies. To quantify the overlap rather than rely on line-count impressions, I’m running a read-only function extractor that compares same-named function bodies across the four reducers.
The first extractor exposed the right overlap categories but misparsed functions with default `{}` parameters, so I’m rerunning it with parameter-brace handling before using the counts.
Function-body comparison confirms the core reducers are mostly domain-specific, while exact duplicate plumbing is concentrated in small helpers and the context/improvement durability shim. I’m checking the runtime signal constants now because context currently hard-codes agreement/relevance gates that claim to mirror runtime values.
The context gate constants exist in runtime code but are not exported, so “import gate constants” would require a small runtime export change rather than only moving paths. The text atomic writer is intentionally text-capable, not an accidental JSON serializer fork, but its implementation is duplicated exactly in context and improvement.
I’m doing one final count pass to separate exact duplicate helper-body lines from the much larger per-mode reducer bodies, so the recommendation has a concrete ratio rather than just examples.
## Recommendation

Pick **option (a)**: keep the four reducer bodies **per-mode inside `deep-loop-workflows`**, and import only shared durability/plumbing constants from `deep-loop-runtime`. Do **not** fold a parameterized reducer into `deep-loop-runtime`.

The reducer bodies are not duplicated enough to justify a runtime-level parameterized reducer. The real duplication is small helper scaffolding: exact duplicate function-body excess is **178 lines out of 4,326 function-body lines** across the four reducers, about **4.1%**. The domain reducers are strongly divergent: `buildRegistry` exists in all four but every body is unique, with minimum token Jaccard **0.07**; `renderDashboard` exists in all four but every body is unique, minimum token Jaccard **0.06**. A parameterized runtime reducer would move workflow state shape, artifact rendering, stop semantics, and dashboard content into the backend, which violates the frozen two-skill boundary.

## Evidence Read

Read in full:

- `.opencode/specs/deep-loops/029-deep-loop-workflows/context/context-report.md:1-206`

Reducer/runtime files read:

- `.opencode/skills/deep-context/scripts/reduce-state.cjs:1-801`
- `.opencode/skills/deep-research/scripts/reduce-state.cjs:1-1072`
- `.opencode/skills/deep-review/scripts/reduce-state.cjs:1-1853`
- `.opencode/skills/deep-improvement/scripts/shared/reduce-state.cjs:1-1350`
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts:1-54`
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/jsonl-repair.ts:1-107`
- `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts:540-699`
- `.opencode/skills/deep-loop-runtime/tests/unit/atomic-state.vitest.ts:1-59`

## Function-Level Split

Measured by extracting function declarations from the four reducers and comparing normalized bodies:

| Category | Evidence | Recommendation |
|---|---:|---|
| Total reducer function-body lines | 4,326 | Too large and mode-specific for runtime folding |
| Exact duplicate helper-body excess | 178 lines | Hoist/import only helpers |
| Exact duplicate clusters | 16 | Small shared plumbing surface |
| `buildRegistry` bodies | 83L context, 111L research, 66L review, 138L improvement, all unique | Keep per-mode |
| `renderDashboard` bodies | 79L context, 136L research, 215L review, 63L improvement, all unique | Keep per-mode |
| `writeTextAtomic`, `writeStateAtomicInline`, `repairJsonlTailInline`, `loadStateSafety` | Exact duplicate between context and improvement | Replace with runtime imports |
| research/review parser/write helpers | Many are similar or exact tiny helpers, but corruption semantics differ | Do not force one reducer skeleton |

## Why Option (A) Wins

`deep-loop-runtime` should own durability primitives, JSONL repair primitives, graph constants, dispatch/fanout/convergence backend, and coverage/council storage. It should **not** own mode artifact reducers.

The current code supports that boundary:

- Context reducer owns agreement-weighted reuse catalog semantics: `unitId`, `dedupByUnit`, `detectContradictions`, `buildRegistry`, and context dashboard rendering in `.opencode/skills/deep-context/scripts/reduce-state.cjs:175-523` and `575-653`.
- Research reducer owns strategy-question state, research iteration markdown parsing, mutable strategy anchors, resource-map emission, and research dashboard rendering in `.opencode/skills/deep-research/scripts/reduce-state.cjs:183-271`, `547-657`, `716-884`, and `895-1006`.
- Review reducer owns P0/P1/P2 severity semantics, traceability/search ledger state, finding adjudication, verdict dashboard, and optional missing-anchor bootstrap in `.opencode/skills/deep-review/scripts/reduce-state.cjs:20-23`, `531-903`, `1201-1266`, `1368-1656`, and `1667-1774`.
- Improvement reducer owns profile buckets, benchmark/prompt metrics, plateau stop logic, mirror drift ambiguity, journal/candidate-lineage/mutation-coverage summaries, and promotion-loop dashboard semantics in `.opencode/skills/deep-improvement/scripts/shared/reduce-state.cjs:601-945`, `999-1273`, and `1279-1350`.

Those are workflow semantics, not backend primitives.

## What To Move Or Export

Concrete runtime-side changes:

- Add a runtime text atomic helper in `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts`.
- Preserve existing `writeStateAtomic(path, data)` JSON behavior from `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts:36-47`.
- Add something like `writeTextAtomic(path, content, options)` or `writeFileAtomic(path, content, options)`, with explicit parent-dir behavior matching the duplicated reducer helper.
- Keep `repairJsonlTail` in `.opencode/skills/deep-loop-runtime/lib/deep-loop/jsonl-repair.ts:77-97` as the canonical JSONL repair primitive.
- Export context gate defaults from runtime, preferably via a pure constants module such as `.opencode/skills/deep-loop-runtime/lib/coverage-graph/context-gates.ts`, then import it from `coverage-graph-signals.ts` and the context reducer.
- Do not import the whole `coverage-graph-signals.ts` just to get constants if it drags graph/database dependencies into reducer startup.
- Consider a CJS-safe runtime bridge under `.opencode/skills/deep-loop-runtime/scripts/lib/` only if the merged workflow reducers remain CommonJS and direct TS imports remain awkward.

Concrete workflow-side reducer changes after the skill merge:

- Move/retain context reducer under the chosen `deep-loop-workflows` mode path, preserving `reduceContextState` exports and CLI behavior from `.opencode/skills/deep-context/scripts/reduce-state.cjs:668-801`.
- Move/retain research reducer under the chosen `deep-loop-workflows` mode path, preserving `reduceResearchState` exports and CLI behavior from `.opencode/skills/deep-research/scripts/reduce-state.cjs:895-1072`.
- Move/retain review reducer under the chosen `deep-loop-workflows` mode path, preserving `reduceReviewState` exports and CLI behavior from `.opencode/skills/deep-review/scripts/reduce-state.cjs:1667-1853`.
- Move/retain improvement reducer under the chosen `deep-loop-workflows` mode path, preserving the `scripts/shared/reduce-state.cjs` shape from `.opencode/skills/deep-improvement/scripts/shared/reduce-state.cjs:1279-1350`.
- Replace context reducer’s hard-coded `DEFAULT_RELEVANCE_GATE` and `DEFAULT_AGREEMENT_MIN` at `.opencode/skills/deep-context/scripts/reduce-state.cjs:26-31` with runtime constants that currently exist unexported at `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts:568-572`.
- Replace context/improvement duplicated `writeTextAtomic`, `writeStateAtomicInline`, `repairJsonlTailInline`, and `loadStateSafety` at `.opencode/skills/deep-context/scripts/reduce-state.cjs:55-148` and `.opencode/skills/deep-improvement/scripts/shared/reduce-state.cjs:46-140` with runtime imports.
- Do not blindly add `repairJsonlTail` to research/review reducers, because their current semantics are fail-closed parse warnings/errors with `--lenient`, not pre-read tail truncation. Research has this path at `.opencode/skills/deep-research/scripts/reduce-state.cjs:95-154` and `.opencode/skills/deep-research/scripts/reduce-state.cjs:954-956`; review has it at `.opencode/skills/deep-review/scripts/reduce-state.cjs:127-151` and `.opencode/skills/deep-review/scripts/reduce-state.cjs:1720-1722`.

## Text Atomic Difference

Deep-context’s inline `writeTextAtomic` is **intentional**, not accidental drift.

Evidence:

- Context explicitly says the helper mirrors runtime atomicity but exists because the runtime helper is JSON-only and cannot serialize the markdown dashboard: `.opencode/skills/deep-context/scripts/reduce-state.cjs:55-59`.
- Improvement carries the same text helper and same rationale: `.opencode/skills/deep-improvement/scripts/shared/reduce-state.cjs:46-50`.
- Runtime `writeStateAtomic` serializes `data` through `JSON.stringify(data, null, 2)` at `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts:36-39`.
- Context uses both APIs for different artifact types: JSON registry through `stateSafety.writeStateAtomic`, markdown dashboard through `writeTextAtomic` at `.opencode/skills/deep-context/scripts/reduce-state.cjs:719-724`.
- Improvement uses the same split at `.opencode/skills/deep-improvement/scripts/shared/reduce-state.cjs:1314-1317`.

So the right consolidation is **not** “use `writeStateAtomic` everywhere.” The right consolidation is to add/export a runtime-owned atomic text writer and keep JSON state writing as JSON.

## Rejected Alternative

Reject option (b): a parameterized reducer inside `deep-loop-runtime`.

Reasons:

- It would put mode artifact contracts into the backend, contradicting the two-skill target where `deep-loop-workflows` owns modes/personas.
- It would need callbacks or mode tables for `parseIterationFile`, `buildRegistry`, `updateStrategyContent`, `renderDashboard`, resource-map emission, terminal-stop state, lineage state, and stop-status behavior.
- It increases behavior-change risk precisely where the acceptance bar is byte-identical artifacts.
- It would blur the improvement exception: improvement is not graph-convergence-based and owns plateau/trajectory stop logic, visible in `.opencode/skills/deep-improvement/scripts/shared/reduce-state.cjs:841-945`.
- It would create a runtime dependency on research/review/context/improvement artifact layouts, which are supposed to be workflow-level.

## Risks

- Exporting constants from `coverage-graph-signals.ts` directly may pull graph dependencies into reducers; use a pure constants module instead.
- Changing research/review to repair JSONL tails would change corrupt-state behavior; keep repair import limited to reducers that already repair unless a separate mode-contract decision approves it.
- Runtime `writeStateAtomic` currently does not create parent directories, while duplicated `writeTextAtomic` does; preserve this distinction or make parent creation an explicit option.
- CJS reducers currently use a `tsx` register path through `system-spec-kit` in context/improvement; a runtime CJS bridge would be cleaner but adds a small new runtime surface.
- Path recommendations depend on the unresolved internal layout decision for `deep-loop-workflows`.

## Dependency On Other Angles

This decision depends on:

- Q-ARCH 2: final internal layout, because paths may be `modes/context/...` or old-shape-preserving subtrees.
- Q-BACKEND 9: whether `resolveArtifactRoot` and `emitResourceMap` stay in `system-spec-kit` or move toward runtime/workflow-local ownership.
- Q-CMD 6: whether one workflow host dispatches all modes or the existing per-command entrypoints remain separate.
- Q-IMPROVE 11: whether improvement remains convergence-divergent or gains a future `loopType`; this should not block reducer consolidation, but it affects future reducer adapter names.
