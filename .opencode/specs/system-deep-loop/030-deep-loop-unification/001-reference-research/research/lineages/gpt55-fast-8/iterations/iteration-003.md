# Iteration 3: Fanout Override, Fallback Router, And Final Recommendation

## Focus

Resolve the remaining scope question: whether fallback-router wiring belongs in the merge packet, and verify detached lineage artifact handling.

## Findings

1. Detached CLI lineage prompts already carry the correct artifact-root override contract. `fanout-run.cjs` tells the subprocess not to run the resolver and to bind `artifact_dir` directly to the lineage dir, then to write all outputs inside that lineage directory and emit the completion token. [SOURCE: file:.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1010] [SOURCE: file:.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1014] [SOURCE: file:.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1017]
2. The fanout executor command path supports the planned `cli-opencode` and `cli-claude-code` shapes. Claude lineages use `claude -p`, model, permission mode, output format, and optional effort; OpenCode lineages use `opencode run --model`, `--format json`, `--pure`, `--dir`, and optional `--variant`. [SOURCE: file:.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1302] [SOURCE: file:.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1313] [SOURCE: file:.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1343] [SOURCE: file:.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1371]
3. `fanout-pool.cjs` currently implements same-item retry only. On retryable failure it requeues the same index until `maxRetries`; after exhaustion it sets `retry_exhausted` and records the rejected result. There is no fallback-route decision at this branch. [SOURCE: file:.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:628] [SOURCE: file:.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:650]
4. `fallback-router.ts` is a good reuse target if fallback wiring is approved. It validates graphs before dispatch, rejects missing/cyclic/same-pool/unapproved targets, and returns an explicit fallback target and reason when a separate-pool route is valid. [SOURCE: file:.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts:299] [SOURCE: file:.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts:320] [SOURCE: file:.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts:357] [SOURCE: file:.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts:400] [SOURCE: file:.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts:411] [SOURCE: file:.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts:422]
5. GLM to MiMo fallback should not be silently bundled into the structural merge. The model registry says GLM-5.2 has `fallback_target: null` and a single executor path with no fallback; MiMo docs say manual direct-provider reroute exists but no automatic gateway fallback is defined. The CLI reference says MiMo substitution is explicitly selectable and missing providers require asking, never silent substitution. [SOURCE: file:.opencode/skills/sk-prompt-models/assets/model_profiles.json:255] [SOURCE: file:.opencode/skills/sk-prompt-models/assets/model_profiles.json:268] [SOURCE: file:.opencode/skills/sk-prompt-models/assets/model_profiles.json:294] [SOURCE: file:.opencode/skills/sk-prompt-models/assets/model_profiles.json:190] [SOURCE: file:.opencode/skills/sk-prompt-models/assets/model_profiles.json:214] [SOURCE: file:.opencode/skills/cli-opencode/references/cli_reference.md:196] [SOURCE: file:.opencode/skills/cli-opencode/references/cli_reference.md:231]

## Sources Consulted

- `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs`
- `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs`
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts`
- `.opencode/skills/sk-prompt-models/assets/model_profiles.json`
- `.opencode/skills/cli-opencode/references/cli_reference.md`
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/004-fallback-router-wiring/spec.md`
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/004-fallback-router-wiring/plan.md`

## Assessment

- newInfoRatio: 0.28
- Novelty justification: third pass added focused fallback/fanout evidence and closed the remaining open scope question.
- Confidence: high that fallback is optional/operator-gated; high that detached lineage artifacts must not use stock resolver-driven reducer paths.

## Reflection

- Worked: reading `fanout-pool.cjs` at the retry branch made the absence of model substitution explicit.
- Failed: none blocking; remaining fallback work is scope choice, not a prerequisite to the merge.
- Ruled out: silent GLM to MiMo substitution.

## Recommended Next Focus

Synthesis complete. Merge this lineage with peer lineages and carry forward the optional fallback decision as a separate operator choice.
