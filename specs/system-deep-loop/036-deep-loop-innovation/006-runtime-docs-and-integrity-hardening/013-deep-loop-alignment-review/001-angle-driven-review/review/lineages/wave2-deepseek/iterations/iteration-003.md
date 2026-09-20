---
title: "Iteration 3: Angle 13 — Preamble and leaf-set policy contradictions"
trigger_phrases: []
---
# Iteration 3: Angle 13 — Preamble and leaf-set policy contradictions

## Focus

Angle 13 (wave two). Determine from the router code which always-loaded-preamble policy the runtime enforces across the three hubs, and whether the byte-identical improvement-lane leaf sets are defect or design. The angle is rewritten from wave one's F003 (two `system-deep-loop` artifacts state opposite no-match policies) and F004 (identical 61-leaf sets for both improvement lanes; the 2-vs-61 arm was withdrawn in wave one). This iteration closed the enforcement question by executing the runtime: the compiled route front door for all three hubs, and the exact policy snapshot the live engine evaluates for each.

Dimension: traceability (primary), correctness (secondary — the enforcement question is a behavior claim).
Method: read the three `hub-router.json` policy blocks and the three `ROUTER.md` machine blocks; read the compiled-routing compiler chain that consumes the field; ran `.opencode/bin/compiled-route.cjs` for all three hubs; loaded the live policy snapshot each hub engine evaluates and searched it for the field; and re-verified the leaf-set identity plus the generator's stated N-to-1 contract. No fixes.

## Files Reviewed

- `.opencode/skills/system-deep-loop/{hub-router.json:9-20,ROUTER.md:60-70}`
- `.opencode/skills/sk-code/{hub-router.json:9-20,ROUTER.md:315-330,645-660}`
- `.opencode/skills/cli-external-orchestration/{hub-router.json:15-30,ROUTER.md:80-92}`
- `.opencode/skills/sk-code/sk-code-opencode/SKILL.md:55-67` (per-surface preamble block)
- `.opencode/bin/lib/compiled-routing/004-compiler-n1-shadow/compiler/compiler.cjs:180-190`
- `.opencode/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/lib/registry-compiler.cjs:247-266` (the compiler the runtime layout binds)
- `.opencode/bin/lib/compiled-routing/009-parent-hub-rollout/002-system-deep-loop/lib/registry-compiler.cjs:358-420,464-511,580-610`
- `.opencode/bin/lib/compiled-routing/009-parent-hub-rollout/004-cli-external-orchestration/lib/registry-compiler.cjs:235`
- `.opencode/bin/lib/compiled-routing/009-parent-hub-rollout/007-sk-doc/lib/registry-compiler.cjs:313`
- `.opencode/bin/lib/compiled-route-layout.cjs:30-40` (which compiler the runtime binds)
- `.opencode/bin/lib/compiled-routing/014-runtime-engine/lib/{resolve.cjs,compiled-route.cjs}`
- `.opencode/bin/compiled-route.cjs` (executed for all three hubs)
- `.opencode/skills/system-deep-loop/leaf-manifest.json` (both improvement-lane sets)
- `.opencode/skills/system-deep-loop/mode-registry.json` (both lane entries)
- `.opencode/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:155-160` (N-to-1 contract comment)

## Scorecard

- Dimensions covered: traceability, correctness
- Files reviewed: 3 hub-router policies, 3 ROUTER.md machine blocks, 5 compilers, the runtime layout selector, 2 engine modules, 3 executed route calls, 3 loaded policy snapshots, 2 manifest/registry lane entries
- New findings: P0=0 P1=1 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.00

## Preamble Policy Matrix (statements)

| Hub | `hub-router.json` `routerPolicy.defaultResource` | `ROUTER.md` machine block | Agree? |
|-----|---------------------------------------------------|---------------------------|--------|
| system-deep-loop | `["ROUTER.md", "mode-registry.json"]` `hub-router.json:13` | `# No always-loaded preamble …` / `DEFAULT_RESOURCE = []` `ROUTER.md:67-69` | **No** |
| sk-code | `["shared/README.md"]` `hub-router.json:14` | `# Always-loaded routing preamble …` / `DEFAULT_RESOURCE = ["shared/references/stack-detection.md", "…phase-detection.md", "…code-quality-standards.md"]` `ROUTER.md:319-325` | **No (shape and content)** |
| cli-external-orchestration | `["ROUTER.md", "mode-registry.json"]` `hub-router.json:21-24` | `# No always-loaded preamble …` / `DEFAULT_RESOURCE = []` `ROUTER.md:85-87` | **No** |

The schema contract says the field is a scalar when present: `if (normalized.defaultResource !== null) { assertNonEmptyString(normalized.defaultResource, 'defaultResource'); }` (`compiler.cjs:184-185`). All three arrays are therefore outside the authored contract on their face. A fourth statement exists but is per-surface rather than hub-level: `sk-code-opencode/SKILL.md:60-66` declares its own five-file `DEFAULT_RESOURCE`, a third content variant in the same hub.

## Enforcement Trace (what the router code actually binds)

| Layer | Code | What happens to the field |
|---|---|---|
| Runtime layout | `compiled-route-layout.cjs:30-40` | The current coherent layout binds **`009-parent-hub-rollout/001-sk-code/lib/registry-compiler.cjs`** as the compiler for the promoted closure. |
| Bound compiler | `001-sk-code/lib/registry-compiler.cjs:247-266` | Reads `hubRouter.routerPolicy.{ambiguityDelta, defaultMode, tieBreak, outcomes}` and `routerSignals`/`vocabularyClasses`. `defaultResource` is never referenced (0 hits). |
| Per-hub rollout compilers | `004-cli…/registry-compiler.cjs:235`; `007-sk-doc/registry-compiler.cjs:313` | 004 hardcodes `defaultResource: null`; 007 reads `input.hubRouter.routerPolicy.defaultResource?.[0] \|\| null` — i.e. silently takes the first array element and discards the rest. 001, 002 and 003 never reference the field. |
| Compiled policy | live `loadSnapshot()` per hub, this iteration | The policy object the engine evaluates has keys `activationGeneration, authorityGraph, compositionRules, destinations, detectors, provenancePolicy, recoveryPolicy, schemaVersion, selectors, thresholdPolicy, basePolicyHash, effectivePolicyHash` — **`defaultResource` is absent from all three hubs' policies.** |
| Route decision | `compiled-route.cjs:85-104`, executed | The normalized decision carries `{hubId, action, selectionKind, targets, effectivePolicyHash, generation}` and no preamble field for any hub. `DEFAULT_RESOURCE` appears **nowhere** in the compiled-routing tree. |

Observed executions: `system-deep-loop` + "review this spec folder iteratively" → `action:"defer"`; `sk-code` + "implement a feature in the opencode tree" → `route` to `sk-code-opencode`; `cli-external-orchestration` + "dispatch cli-pi for this task" → `route` to `cli-pi`. None of the three decisions carries a default-load list.

**Conclusion (enforcement):** the runtime enforces **neither** statement. The compiled router never loads a preamble; `DEFAULT_RESOURCE` is parsed by no compiler; and the `hub-router.json` field is dropped (001/002/003), nulled (004) or truncated to its first element (007) before it could reach a policy. Preamble behavior is therefore prose-level convention in each `ROUTER.md` — and on two of three hubs the two authored statements of that convention disagree.

## Leaf-Set Question (defect or design)

- Both lanes' sets are byte-identical: `agent-improvement` 61 leaves == `model-benchmark` 61 leaves (`JSON.stringify` equality `true`), including 15 agent-only and 39 benchmark-only members.
- The registry models a genuine N-to-1 fan-out: both modes declare `packet: "deep-improvement"` with distinct `loopHostMode` and distinct vocabulary aliases (6 and 4).
- The generator's own docstring says the opposite outcome is intended: "an N-to-1 alias fan-out (two modes sharing one packet folder) keeps distinct, independently addressable leaf sets" (`generate-leaf-manifest.cjs:155-158`), and `DUPLICATE_COMPOSITE` only rejects repeats inside one mode, so identity across modes passes silently. No `leaf-aliases.json` exists on the hub, so no mechanism distinguishes them.
- Does a live consumer need distinctness? No. The deep-loop compiler validates **per-mode membership** only: every `ROUTER.md` `RESOURCE_MAP` entry for a mode must exist in that mode's manifest set (`002…/registry-compiler.cjs:464-511`, failing `ROUTER_RESOURCE_NOT_IN_MANIFEST`), and identical supersets satisfy it. The route decision itself is driven by vocabulary and detectors, not the manifest. `leaf-manifest.json` is otherwise read only by the fleet gates and the compiled pipeline.

**Verdict: defect with bounded impact.** The intent (independent addressability) is documented by the generator and modeled by the registry; the implementation produces identical sets and no live consumer notices. It is a contract defect, not a runtime break.

## Findings

### P0, Blocker

- None.

### P1, Required

- **F026**: The fleet documents two mutually exclusive always-loaded-preamble policies and enforces neither. `system-deep-loop` and `cli-external-orchestration` each declare a two-element `defaultResource` array in `hub-router.json` (`:13`; `:21-24`) while their `ROUTER.md` machine blocks state "No always-loaded preamble" with `DEFAULT_RESOURCE = []` (`ROUTER.md:67-69`; `:85-87`); `sk-code` declares a one-element `defaultResource` (`hub-router.json:14`) while its `ROUTER.md` declares a three-file always-loaded preamble (`ROUTER.md:319-325`) and its `sk-code-opencode` surface declares a five-file one of its own (`sk-code-opencode/SKILL.md:60-66`). The authored contract admits only a scalar string for this field (`compiler.cjs:184-185`), so every array is out of contract; the compilers that read it drop it (`001/002/003` never reference it; `004` hardcodes null at `:235`) or truncate it to element `[0]` (`007:313`, where `sk-code`'s `[0]` is `shared/README.md`, not any of the three preamble files `ROUTER.md` names); and the live policy snapshots the engine evaluates contain no `defaultResource` key at all, verified this iteration for all three hubs by loading the same snapshots the runtime loads. Executed route decisions carry no preamble field, and `DEFAULT_RESOURCE` appears nowhere in the compiled-routing tree. This extends wave one's F003 from a hub-local contradiction to the fleet: the contradiction is real, the shapes are outside their own contract, and neither artifact is operative — a reader cannot tell which policy runs, because none does. [SOURCE: .opencode/skills/system-deep-loop/hub-router.json:13] [SOURCE: .opencode/skills/system-deep-loop/ROUTER.md:67-69] [SOURCE: .opencode/skills/sk-code/hub-router.json:14] [SOURCE: .opencode/skills/sk-code/ROUTER.md:319-325] [SOURCE: .opencode/skills/cli-external-orchestration/ROUTER.md:85-87] [SOURCE: .opencode/bin/lib/compiled-routing/004-compiler-n1-shadow/compiler/compiler.cjs:184-185] [SOURCE: .opencode/bin/lib/compiled-routing/009-parent-hub-rollout/007-sk-doc/lib/registry-compiler.cjs:313]

### P2, Suggestion

- **F027**: The two improvement lanes receive byte-identical 61-leaf sets against the generator's own N-to-1 distinctness contract, and nothing enforces or consumes the distinction. `agent-improvement` and `model-benchmark` both declare `packet: deep-improvement`; their manifest arrays compare equal; `generate-leaf-manifest.cjs:155-158` says such a fan-out "keeps distinct, independently addressable leaf sets"; `DUPLICATE_COMPOSITE` only guards within one mode; no `leaf-aliases.json` exists; and the compiled pipeline checks per-mode membership only, so identical supersets pass (`002…/registry-compiler.cjs:464-511`). Impact is bounded to manifest semantics and any future leaf-driven consumer; no live route breaks today, which is why this re-adjudication lands at P2 against wave one's F004 P1. [SOURCE: .opencode/skills/system-deep-loop/leaf-manifest.json] [SOURCE: .opencode/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:155-158] [SOURCE: .opencode/bin/lib/compiled-routing/009-parent-hub-rollout/002-system-deep-loop/lib/registry-compiler.cjs:464-511]

## Claim Adjudication

```json
{"findingId":"F026","claim":"hub-router.json and ROUTER.md state opposite always-loaded-preamble policies on two hubs and different preamble contents on the third, every array violates the field's scalar contract, and the compiled runtime carries no preamble for any hub.","evidenceRefs":[".opencode/skills/system-deep-loop/hub-router.json:13",".opencode/skills/system-deep-loop/ROUTER.md:67-69",".opencode/skills/sk-code/hub-router.json:14",".opencode/skills/sk-code/ROUTER.md:319-325",".opencode/skills/cli-external-orchestration/ROUTER.md:85-87",".opencode/bin/lib/compiled-routing/004-compiler-n1-shadow/compiler/compiler.cjs:184-185",".opencode/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/lib/registry-compiler.cjs:247-266"],"counterevidenceSought":"Loaded the live policy snapshot each hub's engine evaluates and searched it for the field (absent in all three), ran the compiled route front door for all three hubs and inspected the decision payload (no preamble field), grepped the entire compiled-routing tree for DEFAULT_RESOURCE (zero hits), and checked each of the five per-hub compilers for a read of defaultResource before concluding no layer enforces it.","alternativeExplanation":"The field could be enforced by the prose router alone — the model reading ROUTER.md applies the preamble by convention — which would make the contradiction a documentation problem rather than a runtime one. Accepted and stated that way: the enforcement conclusion is 'no code path enforces either statement', not 'routing is broken'.","finalSeverity":"P1","confidence":0.9,"downgradeTrigger":"Downgrade to P2 once one statement per hub is deleted or aligned and the field is either removed from hub-router.json or given a single documented meaning with a consumer.","transitions":[{"iteration":3,"from":null,"to":"P1","reason":"Extends wave-one F003 fleet-wide with the enforcement question answered by executing the runtime and loading the live policy snapshots"}]}
```

## Traceability Checks

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | `specs/system-deep-loop/049-deep-loop-alignment-review/001-angle-driven-review/spec.md:100` | Angle 13's two questions are both answered with code proof: the preamble question by the enforcement trace and the leaf-set question by the N-to-1 contract plus the compiled pipeline's membership-only validation. Partial because the artifacts cannot satisfy their own stated rules as written. |
| checklist_evidence | notApplicable | hard | — | No per-iteration checklist rows in the phase spec. |

## Assessment

- New findings ratio: 1.00
- Dimensions addressed: traceability, correctness
- Novelty justification: wave one asked whether the artifacts contradict; this iteration answers what the runtime does about it. Executing the front door, loading the live policy snapshots and tracing the bound compiler turned a documentation contradiction into a precisely bounded statement: two statements, zero enforcers, three content variants — and converted the leaf-set question from "identical sets exist" into "the generator's stated N-to-1 guarantee is unmet but no consumer needs it", which is why the severity lands at P2.

## Ruled Out

- **A runtime that loads the hub-router array as a preamble**: ruled out by execution and by snapshot inspection. The field never reaches a policy the engine evaluates, and no decision payload carries it.
- **`DEFAULT_RESOURCE` being compiled from `ROUTER.md`**: ruled out. Zero compiled-routing references; the compiled route leaf selections are derived from `RESOURCE_MAP`, not the preamble block.
- **The per-surface `DEFAULT_RESOURCE` block (e.g. `sk-code-opencode/SKILL.md:60-66`) being machine-consumed**: ruled out for the same reason; it is prose in a fenced block, and the hub's own `ROUTER.md` remains the authoritative stage-two statement.
- **Identical leaf sets breaking the compiled route**: ruled out. `compileRouteLeafSelections` validates per-mode membership of every `RESOURCE_MAP` entry (`002…/registry-compiler.cjs:464-511`); both lanes' maps are subsets of the shared set, so compilation and routing are unaffected.

## Dead Ends

- **Reading the per-hub compilers as one pipeline**: the rollout directory holds five per-hub compilers, but the promoted runtime layout binds only `001-sk-code`'s, so counting "which compilers read the field" over all five overstates the live surface. The enforcement answer needed the layout selector, not the directory.
- **Treating the schema's `assertNonEmptyString` as the whole contract story**: it proves the arrays are out of contract but says nothing about enforcement; only the snapshot load and the route executions settled that.

## Recommended Next Focus

Iteration 4, angle 14 — roster completeness for the seventh executor. Iteration 3 leaves one exact hand-off: `cli-external-orchestration` routes correctly to `cli-hermes` at the compiled layer (the vocabulary carries it even where the prose roster omits it), so the roster question is whether every *statement* names all seven kinds, not whether the router can route them.

---

Claim adjudication packet for this iteration's new P1 finding is embedded above; the new P2 requires no packet.

Review verdict: CONDITIONAL
