# Research Synthesis: GPT Behavioral Hardening Follow-Up (gpt-fast-high)

Spec folder: `.opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/007-gpt-behavioral-hardening-research`

Lineage artifact dir: `.opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/007-gpt-behavioral-hardening-research/research/lineages/gpt-fast-high`

Stop reason: `max_iterations`. Iterations completed: 30/30. Questions answered: 9/9.

## 1. Executive Summary

The evidence supports a staged hardening path, not immediate FIX-5 implementation. Phase 005 did not prove the agent-layer fix works because all command-owned GPT smokes failed before real leaf dispatch [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/005-gpt-verification-smoke/implementation-summary.md:99-115]. The operator's real-world symptoms are enough to keep the problem active, but they are not yet a route-proof failure artifact [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/spec.md:58-60].

Recommended sequence:

1. Run an external-shell registered-command smoke and benchmark for all four deep modes.
2. Harden `@orchestrate` by delegating deep routes to `deep.md`/`mode-registry.json` as the single routing source.
3. Preserve `ai-council` as `mode: all`, but fix council route-proof naming drift before using council smoke as evidence.
4. Add an optional plugin guardrail only as prompt/diagnostic enforcement, not hard identity.
5. Unpark FIX-5 only if external smoke/benchmark evidence shows route-proof failures or persistent stuck/latency regressions after route-unification.

## 2. KQ1 - Decisive Smoke Evidence

Recommendation: design phase 008 as an external, non-OpenCode shell benchmark using registered commands, not another nested OpenCode invocation.

Evidence:

- Phase 005's command-owned smokes failed at `GENERAL AGENT REQUIRED`, self-invocation, and missing route-proof conditions before comparable leaf execution [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/005-gpt-verification-smoke/implementation-summary.md:99-104].
- The command router requires setup values to bind before the YAML workflow owns dispatch [SOURCE: .opencode/commands/deep/research.md:19-37].
- `cli-opencode` requires a self-invocation guard and refuses OpenCode-in-OpenCode unless explicitly parallel-detached [SOURCE: .opencode/skills/cli-opencode/SKILL.md:319-322].
- Registered command dispatch must use `opencode run --command`; raw slash text is a negative control because it bypasses command template expansion [SOURCE: .opencode/skills/cli-opencode/SKILL.md:271].

The smoke contract should assert: no `OPENCODE_*` environment, no OpenCode parent process, provider preflight recorded, `</dev/null` used, `--command deep/<mode>` used, and route-proof fields checked in state/delta outputs.

## 3. KQ2 - Real-World Mis-Route Mechanism

Recommendation: classify the current symptom set into four measurable failure classes rather than calling everything misrouting.

Failure classes:

- `env_blocked`: self-invocation or host-role setup blocks leaf dispatch.
- `route_mismatch`: route-proof fields mismatch expected mode/target.
- `missing_artifact`: expected state, delta, or narrative artifact is absent.
- `stuck_latency`: route-proof fields pass but execution is too slow, loops in setup, or exceeds timeout.

Evidence:

- The operator reports slow orchestrate, wrong sub-agent invocation, stuck flows, and overthinking [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/spec.md:58-60].
- Phase 005 had direct route probes but `agent_definition_loaded:false`, so those probes did not establish real leaf loading [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/005-gpt-verification-smoke/implementation-summary.md:95-98].
- The route-proof validator can distinguish wrong route from missing route fields [SOURCE: .opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts:619-665].

## 4. KQ3 - ai-council Subagent-Only Conversion

Recommendation: do not convert `ai-council` to subagent-only now. Keep `mode: all`, repair route-proof naming, and make deep-route usage explicit.

Evidence:

- `ai-council` is `mode: all` [SOURCE: .opencode/agents/ai-council.md:1-5].
- It intentionally dispatches council seats at Depth 0 and switches to inline sequential reasoning at Depth 1 [SOURCE: .opencode/agents/ai-council.md:53-58].
- Predecessor research explicitly preserved council dual reachability [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/research/research.md:55-58].

Concrete fix before smoke: align council route-proof naming. Registry says workflow mode `ai-council`, runtime type `council`, agent `ai-council` [SOURCE: .opencode/skills/deep-loop-workflows/mode-registry.json:65-79], while council YAML currently expects `mode: council` and `target_agent: deep-ai-council` [SOURCE: .opencode/commands/deep/assets/deep_ai-council_auto.yaml:128-137].

## 5. KQ4 - @orchestrate Hardening V2

Recommendation: make `@orchestrate` route deep tasks through `deep.md` or the same registry resolution helper, instead of duplicating deep-route judgment inside orchestrate prose.

Evidence:

- `deep.md` has a deterministic workflow: classify mode, resolve registry, load agent definition, emit route header, dispatch once, verify consistency before dispatch [SOURCE: .opencode/agents/deep.md:63-79].
- `orchestrate.md` is broad and judgment-heavy by design: decomposition, delegation, quality evaluation, conflict resolution, and synthesis [SOURCE: .opencode/agents/orchestrate.md:20-28].
- The orchestrator task format includes a `Deep Route` field but still leaves route derivation to the broad orchestrator context [SOURCE: .opencode/agents/orchestrate.md:196-225].

Smallest implementation: insert a deep-route branch in `orchestrate.md` that says, for `/deep:*` or `deep-*` requests, resolve via `.opencode/agents/deep.md` / `mode-registry.json` and emit the exact `Deep Route` package from that route, with no fallback to the general priority table unless the mode is unknown.

## 6. KQ5 - Sub-Agent Enforcement Plugin

Recommendation: feasible as a small `mk-deep-route-guard` plugin, but only as prompt/diagnostic enforcement. It should not be described as hard runtime identity.

Evidence:

- OpenCode auto-loads `.opencode/plugins/*.js` entrypoints [SOURCE: .opencode/plugins/README.md:24-36].
- Existing plugins use `experimental.chat.system.transform` and `experimental.chat.messages.transform` hooks to inject context into system/messages [SOURCE: .opencode/plugins/mk-code-graph.js:442-518].
- Existing plugin inventory already separates advisor, memory, code graph, goal, and cleanup roles [SOURCE: .opencode/plugins/README.md:44-50].

Plugin scope:

- Detect user prompts containing `/deep:*`, `deep-research`, `deep-review`, `deep-context`, or `deep-ai-council`.
- Inject a compact `Deep Route Contract` block from `mode-registry.json`.
- Optionally add synthetic metadata to the prompt so the model sees `do_not_switch_mode` before prose.
- Emit diagnostics when raw slash command text appears in `opencode run` contexts where `--command` is required.

Out of scope: binding Task tool `subagent_type` to a real custom-agent identity. That remains host hard identity / FIX-5 territory.

## 7. KQ6 - GPT-vs-Claude Behavioral Benchmark

Recommendation: build a repeatable four-mode benchmark with route-proof correctness and latency/stuck metrics.

Matrix:

| Mode | Positive command | Expected route proof |
|---|---|---|
| research | `--command deep/research` | `mode=research`, `target_agent=deep-research`, `agent_definition_loaded=true` |
| review | `--command deep/review` | `mode=review`, `target_agent=deep-review`, `agent_definition_loaded=true` |
| context | `--command deep/context` | `mode=context`, `target_agent=deep-context`, route header per seat |
| ai-council | `--command deep/ai-council` | aligned workflow/runtime/agent fields after naming repair |

Evidence:

- Research YAML already validates route-proof fields and delta files [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:940-958].
- Review YAML has equivalent route-proof validation [SOURCE: .opencode/commands/deep/assets/deep_review_auto.yaml:919-929].
- Context already has explicit per-seat route contracts [SOURCE: .opencode/commands/deep/assets/deep_context_auto.yaml:379-387].

Minimum benchmark: 4 modes x 2 model families x 3 repeats. Record environment preflight, command form, first artifact time, total time, route-proof result, failure category, and raw log pointer.

## 8. KQ7 - Literal-Instruction-Following Pattern

Recommendation: codify the `deep.md` pattern as the default GPT-hardening pattern for deep-loop flows.

Pattern:

1. Explicit discriminator (`workflowMode`) from command or registry.
2. Deterministic table lookup (`mode-registry.json`).
3. Loaded agent definition path.
4. Route header before long prose.
5. Fail-closed consistency check before dispatch.
6. Exactly one dispatch to the resolved target.
7. No state advancement without mode-local artifacts.

Evidence:

- `deep.md` implements the table, hard boundaries, and dispatch package [SOURCE: .opencode/agents/deep.md:34-79].
- `mode-registry.json` is the single source of truth for mode, command, agent, and artifact root [SOURCE: .opencode/skills/deep-loop-workflows/mode-registry.json:18-80].

## 9. KQ8 - Propagation Scope

Concrete files for follow-up phases:

- `.opencode/agents/orchestrate.md` - route deep tasks through `deep.md` / registry [SOURCE: .opencode/agents/orchestrate.md:196-225].
- `.opencode/agents/deep.md` - keep as source pattern and possibly add benchmark-facing route proof language [SOURCE: .opencode/agents/deep.md:63-79].
- `.opencode/skills/deep-loop-workflows/mode-registry.json` - source of truth for route labels [SOURCE: .opencode/skills/deep-loop-workflows/mode-registry.json:18-80].
- `.opencode/commands/deep/assets/deep_ai-council_auto.yaml` - repair route-proof naming mismatch [SOURCE: .opencode/commands/deep/assets/deep_ai-council_auto.yaml:128-137].
- `.opencode/skills/deep-loop-workflows/deep-ai-council/scripts/orchestrate-topic.cjs` - align emitted route-proof fields [SOURCE: .opencode/skills/deep-loop-workflows/deep-ai-council/scripts/orchestrate-topic.cjs:305-314].
- `.opencode/plugins/` plus helper under deep-loop skills - optional route guard plugin [SOURCE: .opencode/plugins/README.md:24-36].
- Benchmark harness under the next phase packet - captures environment, command, route-proof, and latency evidence.

## 10. KQ9 - FIX-5 Unpark Decision

Decision: do not unpark FIX-5 for implementation immediately. Prepare the escalation path now, but require decisive external evidence.

Unpark if any of these occur after phase 008/009/010:

- External registered-command smoke produces route-proof mismatch for any deep mode while the Claude/native baseline passes.
- GPT produces schema-valid artifacts with wrong semantic route content after route-proof validation and route-unification.
- GPT route-proof passes but benchmark shows repeated stuck/latency regression beyond the agreed threshold across all repeats for one or more modes.
- The route-guard plugin and orchestrate route-unification cannot prevent mode switching or setup-loop failures.

Evidence:

- Original FIX-5 trigger already requires observed route-mismatched artifacts or failure signals with baseline comparison [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/006-host-hard-identity-fix5/decision-record.md:20-34].
- Phase 005 did not produce that evidence because external clean-pass evidence remains absent [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/005-gpt-verification-smoke/implementation-summary.md:112-115].

## 11. Recommendations

1. Phase 008: External Smoke and Benchmark Harness.
2. Phase 009: Orchestrate Deep-Route Unification.
3. Phase 010: AI-Council Route-Proof Alignment, no subagent-only conversion.
4. Phase 011: Optional Deep Route Guard Plugin.
5. Phase 012: FIX-5 Decision Checkpoint and, only if triggered, host hard identity/process isolation plan.

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Treat phase 005 as accepted | Smokes failed before real leaf dispatch | `.opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/005-gpt-verification-smoke/implementation-summary.md:99-115` | 1, 10, 29 |
| Convert ai-council to subagent-only now | Breaks documented direct Depth 0 council seat dispatch | `.opencode/agents/ai-council.md:53-58` | 4, 11 |
| Expand orchestrate prose as main fix | Broad orchestrator is not the narrow route source of truth | `.opencode/agents/orchestrate.md:20-28`; `.opencode/agents/deep.md:63-79` | 5, 17 |
| Plugin as hard identity | Current plugin evidence supports prompt/system transforms, not Task identity binding | `.opencode/plugins/mk-code-graph.js:442-518` | 6, 15 |
| Immediate FIX-5 implementation | Current hard evidence is still inconclusive; external smoke not yet run | `.opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/006-host-hard-identity-fix5/decision-record.md:26-34` | 10, 25, 29 |

## 12. Open Questions

- Exact latency threshold should be operator-approved before phase 008 runs.
- The sibling GLM lineage may produce a different ordering or risk emphasis; merge before final parent-level phase planning.
- Plugin hook availability should be smoke-tested on the installed OpenCode version before implementation.

## 13. Convergence Report

- Stop reason: `max_iterations`.
- Total iterations: 30.
- Questions answered: 9/9.
- newInfoRatio trend: `0.92 -> 0.86 -> 0.82 -> 0.76 -> 0.74 -> 0.70 -> 0.68 -> 0.64 -> 0.62 -> 0.58 -> 0.42 -> 0.40 -> 0.38 -> 0.36 -> 0.34 -> 0.32 -> 0.30 -> 0.28 -> 0.26 -> 0.24 -> 0.22 -> 0.20 -> 0.18 -> 0.16 -> 0.14 -> 0.12 -> 0.10 -> 0.08 -> 0.06 -> 0.04`.
- Early convergence before iteration 30 was treated as telemetry only per charter.

## 14. References

- `.opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/spec.md:56-78`
- `.opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/007-gpt-behavioral-hardening-research/research-prompt.md:25-43`
- `.opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/005-gpt-verification-smoke/implementation-summary.md:95-115`
- `.opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/006-host-hard-identity-fix5/decision-record.md:20-38`
- `.opencode/agents/deep.md:34-79`
- `.opencode/agents/orchestrate.md:196-225`
- `.opencode/agents/ai-council.md:53-58`
- `.opencode/commands/deep/assets/deep_research_auto.yaml:916-958`
- `.opencode/commands/deep/assets/deep_review_auto.yaml:895-929`
- `.opencode/commands/deep/assets/deep_context_auto.yaml:379-387`
- `.opencode/commands/deep/assets/deep_ai-council_auto.yaml:116-137`
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts:619-665`
- `.opencode/plugins/README.md:24-50`
- `.opencode/plugins/mk-code-graph.js:442-518`
