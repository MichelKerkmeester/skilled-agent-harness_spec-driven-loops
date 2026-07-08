# Research Synthesis - gpt55-fast-10

## 1. Executive Summary

The merge design is sound with guardrails. The structural plan for `system-deep-loop/` plus nested `runtime/` is correct, the asymmetric path-coupling rule is the central invariant, and child 003's staged reference migration plan is appropriately broad. The highest-risk area is advisor migration because it mixes generated projection/hash surfaces with hand-authored scoring constants, graph edges, corpus records, and divergence fixtures. `fallback-router.ts` is real and useful, but GLM-5.2 to MiMo-v2.5-Pro fallback should remain optional feature scope unless explicitly approved.

## 2. Research Scope

This lineage investigated only the merge design. It did not implement or modify `deep-loop-workflows`, `deep-loop-runtime`, parent specs, memory, or git state. The parent research packet explicitly defines this as read-only investigation and excludes merge execution [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/001-reference-research/spec.md:69].

## 3. Method

The lineage ran ten evidence passes against specs, command YAMLs, agents, advisor code, runtime scripts, and model profiles. Convergence was reached when all five key questions had evidence-backed answers and the final composite stop score was 0.70.

## 4. Structural Layout

The target layout should proceed: `system-deep-loop/` contains the public hub and mode packets, while `runtime/` contains the former backend without its own `graph-metadata.json` [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/spec.md:157]. `runtime/` must not be added as an eighth `workflowMode`; the spec calls that a category error [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/spec.md:169].

## 5. Path Coupling

The bidirectional repair rule is correct and must be enforced manually by category. Forward runtime-to-workflow references keep hop count and delete the old workflow segment; reverse workflow-to-runtime references move one hop nearer and rename the segment [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/spec.md:173]. A global replace is unsafe.

## 6. System-Spec-Kit Tooling-Borrow

The tooling-borrow is load-bearing. Runtime typecheck uses `../system-spec-kit/node_modules/.bin/tsc` [SOURCE: .opencode/skills/deep-loop-runtime/package.json:11], runtime `typeRoots` points to `../system-spec-kit/node_modules/@types` [SOURCE: .opencode/skills/deep-loop-runtime/tsconfig.json:12], and system-spec-kit vitest includes `../deep-loop-runtime/tests/**/*` [SOURCE: .opencode/skills/system-spec-kit/mcp_server/vitest.config.ts:18]. Child 002 is right to keep this in structural scope [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/spec.md:73].

## 7. External Reference Migration

Child 003's staged plan is sufficient if followed exactly. It requires grep-before/after bracketing [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/003-external-reference-migration/plan.md:67], hardcoded constants before generated fields [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/003-external-reference-migration/plan.md:75], compiled command-contract regeneration [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/003-external-reference-migration/plan.md:89], and an 11-step exit gate [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/003-external-reference-migration/plan.md:106].

## 8. Commands, Agents, And Doctor Routes

Migration must treat commands and agents as executable surfaces. The doctor deep-loop route invokes runtime scripts directly [SOURCE: .opencode/commands/doctor/_routes.yaml:108], command YAMLs cite workflow and runtime paths [SOURCE: .opencode/commands/deep/assets/deep_ai-council_confirm.yaml:40], and both OpenCode and Claude orchestrate agents reference the workflow mode registry [SOURCE: .opencode/agents/orchestrate.md:185] [SOURCE: .claude/agents/orchestrate.md:174].

## 9. Advisor Migration

Advisor migration is the highest-risk surface. `skill_advisor.py` hardcodes `MODE_REGISTRY_PATH` to `deep-loop-workflows` [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:83]. `aliases.ts` carries a generated projection hash [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:23] and the hand-authored `MERGED_DEEP_SKILL_ID` constant [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:109]. The explicit scorer also has hand-authored boosts to `deep-loop-workflows` [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts:28]. This validates 003's split between hardcoded constants, codegen, corpus, and divergence-ratchet phases.

## 10. Fallback Router

`fallback-router.ts` is implemented and has the right guards: it resolves a configured fallback target [SOURCE: .opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts:357], fails fast when no separate-pool fallback is configured [SOURCE: .opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts:376], and rejects same-pool fallbacks [SOURCE: .opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts:400]. `fanout-pool.cjs` currently retries and then records retry exhaustion [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:628] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:650]. The optional phase's success criterion, a real non-test caller, is the right criterion [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/004-fallback-router-wiring/spec.md:104].

## 11. Model Fallback Facts

MiMo and GLM are separate active pools, which makes a cross-pool fallback plausible, but neither profile currently declares `fallback_target`. MiMo uses `xiaomi-token-plan` and has `fallback_target: null` [SOURCE: .opencode/skills/sk-prompt-models/assets/model_profiles.json:190] [SOURCE: .opencode/skills/sk-prompt-models/assets/model_profiles.json:203]. GLM uses `zai-coding-plan` and also has `fallback_target: null` [SOURCE: .opencode/skills/sk-prompt-models/assets/model_profiles.json:255] [SOURCE: .opencode/skills/sk-prompt-models/assets/model_profiles.json:269]. Automatic GLM-to-MiMo fallback would therefore be new policy, not latent behavior.

## 12. Recommendations

1. Proceed with 002 as written, preserving the asymmetric coupling rule as a hard checklist item.
2. Proceed with 003 as written, but treat advisor generated projection/hash, hand constants, corpus, and divergence fixtures as separate gates.
3. Keep 004 optional. If accepted, wire `resolveFallback()` into the retry-exhausted branch with an explicit approved model set and model-profile `fallback_target` update.
4. Do not add `runtime/` to `mode-registry.json`.
5. Do not use a blanket residual-grep gate without a historical-spec/manual-log allowlist.

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|----------|-------------------|----------|--------------|
| Naive global old-name replace | Path repair is direction-dependent. | `.opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/spec.md:173` | 3, 10 |
| Add runtime as workflowMode | `runtime/` is infrastructure, not a mode. | `.opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/spec.md:169` | 2, 10 |
| Treat fallback-router wiring as mandatory rename work | Optional feature scope can change model routing semantics. | `.opencode/specs/system-deep-loop/052-deep-loop-unification/004-fallback-router-wiring/spec.md:115` | 7, 10 |
| Rely on same-model GLM retries only if operator wants graceful cross-model behavior | Current pool only retries and exhausts; it does not route fallback targets. | `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:650` | 7 |

## 13. Open Questions

- Operator decision: should 004 land before the merge, or remain follow-up hardening after 002/003/005?
- If 004 lands, what exact registry/config surface should authorize `glm-5.2 -> mimo-v2.5-pro`?

## 14. Confidence

High for 002/003 readiness, because findings are corroborated by specs and live code. Medium for fallback wiring priority, because it depends on operator scope preference and live provider reliability.

## 15. Convergence Report

- Stop reason: converged.
- Total iterations: 10.
- Questions answered: 5 / 5.
- Remaining questions: 0 blocking, 2 operator-scope questions.
- Average newInfoRatio trend: `[1.00, 0.82, 0.76, 0.70, 0.66, 0.62, 0.52, 0.35, 0.18, 0.06]`.
- Composite stop score: 0.70.
- Legal-stop gates: pass.
- Graph gates: not applicable.

## 16. Boundary And Side Effects

Spec write-back, memory save, and git staging were intentionally skipped because the detached lineage prompt constrained writes to `.opencode/specs/system-deep-loop/052-deep-loop-unification/001-reference-research/research/lineages/gpt55-fast-10` only.

## 17. References

- `.opencode/specs/system-deep-loop/052-deep-loop-unification/001-reference-research/spec.md`
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/spec.md`
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/003-external-reference-migration/plan.md`
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/004-fallback-router-wiring/spec.md`
- `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs`
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts`
- `.opencode/skills/sk-prompt-models/assets/model_profiles.json`
