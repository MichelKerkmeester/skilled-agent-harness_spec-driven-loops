# Review Iteration 007

## Dispatcher

- Mode: review (fan-out lineage `vibe-2`)
- Session: `fanout-vibe-2-1795172940208-84a42n`, generation 1, lineageMode `new`
- Focus: Frontier node F-1-002, dimension `maintainability`
- Review target type: `files`
- Operator review focus: the commit set `31ffd18beab`, `1ccbb3283c6`, `dc3979eb451`, `86038dfba80`, `c74042fd559`, `571575632a4`, `5c91b2f3f5d`, `0390556ee2b`, and the ten `docs(specs)` commits `2f5fe41bb9e`..`aaaff7dd9df`.

### How this iteration addressed the operator review focus

The focus asks for defects in shipped behavior rather than style. This iteration read the lane's weight guard and the registry that feeds it, and found the guard correct but its input misnamed in a way that invites a wrong follow-on change. That is a shipped-code hazard, not a style preference: the constant a maintainer would reach for to "fix" the guard is the one that already carries the operator override.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:150-200,230-262`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts:60-110`
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:493`
- `.skilled/skills/system-skill-advisor/runtime/tests/semantic-lane-weight-zero.vitest.ts:43,69-84`
- `.skilled/skills/system-skill-advisor/runtime/tests/semantic-prompt-embedding-degrade.vitest.ts:170,183`

## Findings - New

### P0 Findings

None.

### P1 Findings

None new. R1-P1-001 from iteration 1 remains active and keeps this run at CONDITIONAL.

### P2 Findings

1. **The lane's weight guard reads a constant named `DEFAULT_SCORER_LANE_WEIGHTS` that actually holds the resolved live weights** -- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:156` -- the guard reads `(DEFAULT_SCORER_LANE_WEIGHTS.semantic_shadow ?? 0) <= 0` and short-circuits with `lane_weight_zero`. That constant is assigned `RESOLVED_WEIGHTS` (`lane-registry.ts:105`), which is `resolveLaneWeightsOverride(LIVE_LANE_WEIGHTS_ENV_KEY, DEFAULT_WEIGHTS)` (`lane-registry.ts:74-77`), so it already carries the `SPECKIT_ADVISOR_LANE_WEIGHTS_JSON` override. The behavior is right and the opt-in works. The name is not: a maintainer reading the guard concludes it ignores the operator override and "fixes" it by reading live weights, which would leave the lane embedding at weight 0 and silently disable the documented opt-in.
   Finding class: `maintainability`
   Scope proof: the guard is in the declared target `runtime/lib/scorer/lanes/semantic-shadow.ts`; the constant definition is in the same declared target tree.
   Affected surface hints: `withSemanticShadowPromptEmbedding`, `SPECKIT_ADVISOR_LANE_WEIGHTS_JSON` opt-in, `semantic-lane-weight-zero.vitest.ts`, lane weight resolution.
   Case: a maintainer is asked why the lane still embeds when the default weight is 0. They read `semantic-shadow.ts:156`, see `DEFAULT_SCORER_LANE_WEIGHTS`, and conclude the guard is stale because the default is 0. They change it to read the live weights through a new accessor. The lane now short-circuits on the default and the documented `SPECKIT_ADVISOR_LANE_WEIGHTS_JSON='{"semantic_shadow":0.05}'` opt-in stops embedding, with no test failing because the existing test stubs the env before the module loads.

## Traceability Checks

| Protocol | Status | Evidence | Summary |
|----------|--------|----------|---------|
| `spec_code` | pass | `semantic-shadow.ts:156`, `lane-registry.ts:74-105` | The guard's behavior matches the documented opt-in; only the constant's name misdescribes its content. |
| `checklist_evidence` | pass | `acceptance-criteria.md:56-66` | No `Unmet` row. |
| `agent_cross_runtime` | notApplicable | `.skilled/agents/` (no advisor status reference) | No agent definition integrates the advisor surface. |

## Integration Evidence

- The opt-in path is exercised: `semantic-lane-weight-zero.vitest.ts:80` stubs `SPECKIT_ADVISOR_LANE_WEIGHTS_JSON` to `{"semantic_shadow":0.05}` and asserts the lane proceeds, so the resolved-weights behavior is covered.
- The zero-weight path is exercised: `semantic-lane-weight-zero.vitest.ts:72` asserts the short-circuit at the default.
- The degrade path is exercised: `semantic-prompt-embedding-degrade.vitest.ts:170,183` drives `withSemanticShadowPromptEmbedding` through a failed embed.
- The recommend handler calls the wrapper once per scored prompt (`advisor-recommend.ts:493`), so the guard runs on the live path.

## Edge Cases

- **Ambiguity: whether a misleading constant name is a maintainability finding or style.** The name is load-bearing: it is the input to a guard whose correctness depends on the reader knowing the constant is resolved, not default. Recorded as a finding.
- **Contradiction: the name says default, the assignment says resolved.** Both were read; the assignment is authoritative, so the name is the side that misdescribes.
- **Missing dependency: no test asserts the constant's identity.** No test pins `DEFAULT_SCORER_LANE_WEIGHTS` to the resolved weights, so a rename or a re-pointing would not be caught. Recorded, not converted into a pass.

## Confirmed-Clean Surfaces

- The zero-weight short-circuit does not cost an embed call, as its comment claims.
- The read-only database access on the recommend path is documented at the call site (`semantic-shadow.ts:170-172`).
- The pre-embed failure flag keeps a check's own reason from being overwritten by the transport catch.
- The prompt embedding is cleared in a `finally`, so a throwing `run` does not leak state.

## Ruled Out

- **The guard ignores the operator override.** Ruled out: the constant it reads is the resolved weights, and a test stubs the env to prove the lane proceeds.
- **The module-level prompt embedding races across concurrent calls.** Ruled out in iteration 3: set, run and clear share one microtask with no await between them.
- **`_semanticShadowTest` exposing internals is a defect.** Ruled out: it is a named test hook, not a production surface.
- **The lane's health object is a hidden global that callers must know to read.** Ruled out as a finding: the tests read it deliberately and the status handler surfaces it, so the coupling is documented by use.

## Next Focus

- Dimension: none remaining. All four configured dimensions are covered.
- Focus area: cross-reference synthesis across the seven iterations.
- Reason: `maintainability` was the last uncovered dimension; the run has no further dimension to rotate to.
- Rotation status: F-1-002 all four dimensions complete; F-1-005 `correctness`, `security` and `traceability` complete.
- Blocked/productive carry-forward: productive — reading a guard's input back to its assignment is what turned a suspected behavior bug into a naming hazard.
- Required evidence: the findings registry and the seven iteration artifacts, for synthesis.
- Recovery note: none.

Review verdict: CONDITIONAL
