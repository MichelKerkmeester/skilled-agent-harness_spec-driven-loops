# Research Synthesis: Critical Re-Review of GPT Behavioral Hardening Research (gpt-critical)

Spec folder: `.opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/007-gpt-behavioral-hardening-research`

Lineage artifact dir: `.opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/007-gpt-behavioral-hardening-research/research/lineages/gpt-critical`

Stop reason: `max_iterations`. Iterations completed: 10/10. Questions answered: 9/9.

Per `research-prompt.md` section 9, the operator-confirmed symptoms are treated as ground truth: GPT is slow as `@orchestrate`, invokes the wrong sub-agent, gets stuck on predefined flows, and overthinks/needs literal instructions. This lineage does not re-litigate whether those symptoms exist. [SOURCE: research-prompt.md:91-104]

## 1. Executive Summary

The prior GPT lineage was not fabricated, but it was too deferential to missing route-proof artifacts. Its key self-protective pattern was to convert confirmed operator symptoms into "not yet route-proof" uncertainty, then use that uncertainty to defer harder conclusions. [SOURCE: research/lineages/gpt-fast-high/research.md:11-20] The corrected conclusion is: the behavioral problem is confirmed; route-proof artifacts are still needed for benchmark scoring and FIX-5 escalation, not for acknowledging the problem.

The concrete fixes are clearer after this critical pass:

1. Replace fuzzy Phase 0 `@general` self-assessment gates across deep commands; phase 005 already failed at this exact gate. [SOURCE: .opencode/commands/deep/research.md:39-72] [SOURCE: 005-gpt-verification-smoke/verification-smoke.md:117-124]
2. Canonicalize ai-council route-proof fields before any benchmark; current runtime/YAML can validate noncanonical `council` / `deep-ai-council` values that disagree with `mode-registry.json`. [SOURCE: .opencode/skills/deep-loop-workflows/mode-registry.json:66-72] [SOURCE: .opencode/commands/deep/assets/deep_ai-council_auto.yaml:117-136] [SOURCE: .opencode/skills/deep-loop-workflows/deep-ai-council/scripts/orchestrate-topic.cjs:305-313]
3. Harden `@orchestrate` with NDP-safe registry reuse, not a literal Task dispatch to primary `@deep`. [SOURCE: .opencode/agents/orchestrate.md:143-149] [SOURCE: .opencode/agents/deep.md:63-79]
4. Build a route-guard plugin only after route fields are canonical; the installed hook surface supports command/tool pre-hooks and chat transforms, but direct fail-closed rejection remains to be smoke-tested. [SOURCE: .opencode/node_modules/@opencode-ai/plugin/dist/index.d.ts:225-241]
5. Keep FIX-5 conditional, but for the right reason: not because symptoms are unproven, but because the first confirmed mechanisms are cheaper and more targeted than host/process hard identity.

## 2. Corrections to Prior Conclusions

| Area | Prior framing | Corrected framing | Disposition |
|---|---|---|---|
| Symptom reality | Operator symptoms are active but not route-proof artifacts | Symptoms are confirmed behavioral failures; route-proof is a validation artifact class | SHARPENED |
| Mode D | Hypothesis / stuck_latency adjacent | Confirmed in at least one phase-005 research-mode failure; magnitude unmeasured | SHARPENED |
| ai-council | Naming drift/alignment | False-pass risk against noncanonical route identity | SHARPENED |
| Orchestrate -> deep | Dispatch `@deep` and stop | Reuse registry/header pattern inside orchestrate or perform explicit session handoff; do not Task-dispatch primary `@deep` as depth-1 worker | OVERTURNED literal reading |
| Plugin | Enforcement plugin feasible | Injection/mutation feasible; fail-closed and semantic correctness are limits | SHARPENED |
| FIX-5 | Wait for decisive evidence | Wait for targeted fixes first; unpark if post-fix benchmark still shows semantic misroute or disproportionate stuck/latency | SHARPENED |

## 3. Where `gpt-fast-high` Was Self-Protective

- It used "not yet a route-proof failure artifact" as a softener even though the operator-confirmed symptoms now remove the need to prove existence. [SOURCE: research/lineages/gpt-fast-high/research.md:11] [SOURCE: research-prompt.md:91-104]
- It framed phase 005 as "did not prove the agent-layer fix works" rather than emphasizing that all four command-owned attempts failed or blocked before a passing leaf dispatch. [SOURCE: research/lineages/gpt-fast-high/research.md:27-30] [SOURCE: 005-gpt-verification-smoke/verification-smoke.md:117-124]
- It collapsed stuck predefined flows into `stuck_latency`, hiding the more actionable Phase-0/advisory-gate literalism mechanism. [SOURCE: research/lineages/gpt-fast-high/research.md:40-44]
- It eliminated immediate FIX-5 primarily on "hard evidence inconclusive" grounds; the stronger reason is blast-radius and target mismatch, not symptom uncertainty. [SOURCE: research/lineages/gpt-fast-high/research.md:170-178] [SOURCE: 001-deep-agent-router-and-orchestration/research/research.md:163-171]

## 4. Confirmed Mechanisms and Fixes

### 4.1 Phase 0 Mode-D Fix

The Phase 0 self-check asks a model to decide whether it is operating as `@general`, then hard-blocks on uncertainty. [SOURCE: .opencode/commands/deep/research.md:39-72] The research smoke failed at exactly this gate. [SOURCE: 005-gpt-verification-smoke/verification-smoke.md:117-124]

Fix: replace self-assessment with deterministic invocation context. If the registered command file is executing, the general-agent command router condition is satisfied by construction; otherwise fail with a non-model-inferred command-invocation error. Apply to all 7 deep command files found by the `GENERAL AGENT REQUIRED` pattern.

### 4.2 ai-council Route-Proof Canonicalization

The registry says `workflowMode=ai-council`, `runtimeLoopType=council`, `agent=ai-council`. [SOURCE: .opencode/skills/deep-loop-workflows/mode-registry.json:66-72] The YAML build step matches this with `mode=ai-council` and `target_agent=@ai-council`, but the validator expects `mode=council` and `target_agent=deep-ai-council`, while `orchestrate-topic.cjs` writes those same noncanonical values. [SOURCE: .opencode/commands/deep/assets/deep_ai-council_auto.yaml:117-136] [SOURCE: .opencode/skills/deep-loop-workflows/deep-ai-council/scripts/orchestrate-topic.cjs:305-313]

Fix: make runtime writer and YAML validator use the registry-canonical workflow identity. Add a regression test that route-proof fields equal the registry projection, not just local YAML expectations.

### 4.3 NDP-Safe Orchestrate Registry Reuse

`@orchestrate` forbids nested primary-router chains; `Orch(0) -> Sub-Orch(1) -> @leaf(2)` is illegal. [SOURCE: .opencode/agents/orchestrate.md:143-149] `@deep` is itself a primary router that dispatches exactly once. [SOURCE: .opencode/agents/deep.md:20-28] [SOURCE: .opencode/agents/deep.md:63-79]

Fix: `orchestrate.md` should implement a deep-intent branch that reads `mode-registry.json`, builds the same Deep Route header shape, loads the resolved leaf definition, and dispatches the resolved leaf directly at depth 1. If a future design wants session-level handoff to `@deep`, name it as handoff, not Task delegation.

### 4.4 Plugin Guard Scope

OpenCode plugins can run command/tool pre-hooks and chat transforms. [SOURCE: .opencode/node_modules/@opencode-ai/plugin/dist/index.d.ts:225-241] Existing plugins already inject system and message context. [SOURCE: .opencode/plugins/mk-code-graph.js:442-518]

Fix: add a small route-guard plugin after route fields are canonical. It should inject/mutate a Deep Route Contract for `/deep:*` and Task dispatches, and emit diagnostics on contradictions. It must not be sold as hard identity until fail-closed behavior is smoke-tested.

## 5. Benchmark Update

The benchmark should measure mechanism and regression, not symptom existence. Required failure classes:

- `phase0_self_check`
- `route_mismatch`
- `noncanonical_route_false_pass`
- `missing_artifact`
- `semantic_wrong_mode`
- `timeout_latency`
- `executor_env_blocked`

Preconditions:

- Canonicalize ai-council route proof before the ai-council leg.
- Remove/replace Phase 0 self-assessment gates before measuring post-fix GPT reliability.
- Run the GPT CLI leg from a genuine external non-OpenCode shell or equivalent clean environment because phase 005 and `cli-opencode` self-guards show nested OpenCode is not a clean test surface. [SOURCE: .opencode/skills/cli-opencode/SKILL.md:319-322] [SOURCE: 005-gpt-verification-smoke/verification-smoke.md:117-124]

## 6. FIX-5 Decision

Do not unpark FIX-5 immediately, but do not justify that with "symptoms unproven." Symptoms are proven by operator report for this round. The reason to keep FIX-5 conditional is that confirmed mechanisms now include cheap, targeted prompt/route bugs that host hard identity does not directly fix.

Unpark FIX-5 if, after Phase-0 gate removal, ai-council canonicalization, NDP-safe orchestrate registry reuse, and plugin guard, the benchmark still shows any of:

- GPT semantic wrong-mode artifacts while Claude passes.
- GPT route-proof mismatch after canonicalization while Claude passes.
- GPT repeated setup-loop/stuck/latency failure beyond an operator-approved threshold while Claude passes.
- Plugin/orchestrate guard cannot prevent mode switching or contradictory Task packages.

This sharpens the existing trigger without pretending the operator's symptoms are uncertain. [SOURCE: 006-host-hard-identity-fix5/decision-record.md:20-34]

## 7. Recommended Phase Order

1. Phase 008: Mode-D and route-proof canonicalization. Replace Phase 0 self-assessment gates; canonicalize ai-council route-proof writer/validator; add registry-projection tests.
2. Phase 009: NDP-safe orchestrate registry reuse. Add the deep-intent branch in `orchestrate.md` and mirrors.
3. Phase 010: Route-guard plugin. Add injection/mutation diagnostics; smoke-test whether fail-closed rejection is possible.
4. Phase 011: GPT-vs-Claude benchmark. Run with failure classes above and clean GPT shell preflight.
5. Phase 012: FIX-5 checkpoint. Unpark only if the post-fix benchmark triggers the sharpened criterion.

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Re-litigate whether GPT symptoms exist | Operator confirms all four symptoms first-hand | `research-prompt.md:91-104` | 1 |
| Treat phase 005 as neutral/inconclusive | All command-owned attempts failed or blocked before a passing leaf dispatch | `005-gpt-verification-smoke/verification-smoke.md:117-124` | 1 |
| Treat Mode D as generic latency | Phase 0 self-check is a hard gate and has an exact failure record | `.opencode/commands/deep/research.md:39-72`; `verification-smoke.md:119` | 2 |
| Benchmark ai-council before route canonicalization | Runtime/YAML can validate noncanonical values | `deep_ai-council_auto.yaml:117-136`; `orchestrate-topic.cjs:305-313` | 3,6 |
| Task-dispatch primary `@deep` from `@orchestrate` | Violates NDP under literal Task-dispatch reading | `.opencode/agents/orchestrate.md:143-149`; `.opencode/agents/deep.md:63-79` | 4 |
| Plugin as hard identity | Hook surface supports injection/mutation, not proven identity binding | `index.d.ts:225-241` | 5 |
| Immediate FIX-5 on symptom confirmation alone | Confirmed mechanisms have cheaper targeted fixes and FIX-5 does not directly remove Phase 0/council bugs | `001.../research.md:163-171` | 7 |

## 8. Residual Risks

- Mode-D magnitude is confirmed in one phase-005 instance but not measured across all current operator experiences.
- Plugin fail-closed capability is unproven from the type surface; smoke-test before relying on it as a blocker.
- The exact latency threshold for FIX-5 escalation remains operator policy, not a research-derived constant.
- This lineage is itself GPT; the self-check in iteration 9 downgrades measurement and fail-closed claims where no executable proof exists.

## 9. Convergence Report

- Stop reason: `max_iterations`.
- Iterations completed: 10/10.
- Questions answered: 9/9.
- newInfoRatio trend: `0.82 -> 0.78 -> 0.80 -> 0.66 -> 0.62 -> 0.57 -> 0.52 -> 0.48 -> 0.30 -> 0.18`.
- Early convergence was telemetry only; the lineage continued through bias audit, mechanism tracing, implementation ordering, and self-adversarial review.

## 10. References

- `research-prompt.md:87-127`
- `research/research.md`
- `research/lineages/glm-max/research.md`
- `research/lineages/gpt-fast-high/research.md`
- `research/lineages/sonnet-critical/research.md`
- `research/lineages/glm-critical/iterations/iteration-001.md`
- `.opencode/commands/deep/research.md:39-72`
- `.opencode/commands/deep/assets/deep_ai-council_auto.yaml:117-136`
- `.opencode/skills/deep-loop-workflows/deep-ai-council/scripts/orchestrate-topic.cjs:305-313`
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts:636-661`
- `.opencode/agents/orchestrate.md:42-48,143-149,196-225`
- `.opencode/agents/deep.md:20-28,63-79`
- `.opencode/node_modules/@opencode-ai/plugin/dist/index.d.ts:225-241`
- `005-gpt-verification-smoke/verification-smoke.md:117-124`
- `006-host-hard-identity-fix5/decision-record.md:20-34`

---

*Synthesis by the gpt-critical fan-out lineage (cli-opencode / openai/gpt-5.5-fast) from 10 fresh-context iterations, stop policy max-iterations per operator-directed charter section 9.4.*
