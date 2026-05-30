# Focus

RQ1: define scoring dimensions for a real-world skill benchmark: routing/activation accuracy, unprompted reference/asset discovery, efficiency/bottlenecks, usefulness via skill-on/skill-off ablation, and structural connectivity. Secondary focus: RQ7 prior art for external tool/agent discoverability evaluation, plus a first rename-surface map for deep-agent-improvement -> deep-improvement.

# Actions Taken

- Read the target skill contract, including the current two-lane structure, smart router, three seams, Lane B mode behavior, runtime truth contracts, and integration points. [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:27] [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:113] [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:273]
- Read sk-doc and system-skill-advisor to separate Lane C from document-shape validation, manual playbooks, and prompt-time skill routing. [SOURCE: .opencode/skills/sk-doc/SKILL.md:20] [SOURCE: .opencode/skills/sk-doc/SKILL.md:117] [SOURCE: .opencode/skills/system-skill-advisor/SKILL.md:35]
- Read the Lane B sibling packet and current 122 phase specs for the loop-host, seam, identity-gate, Lane C, and rename templates. [SOURCE: .opencode/specs/skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/003-build-benchmark-mode/spec.md:82] [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/spec.md:120]
- Searched external prior art for tool selection, tool retrieval, agent trajectories, RAG retrieval metrics, ablation, and LLM-as-judge evaluation. [SOURCE: https://arxiv.org/abs/2307.16789] [SOURCE: https://arxiv.org/abs/2310.03128] [SOURCE: https://arxiv.org/abs/2508.20453] [SOURCE: https://docs.langchain.com/langsmith/evaluation-concepts?mode=ui] [SOURCE: https://docs.ragas.io/en/v0.1.21/concepts/metrics/index.html]

# Findings

## f-gpt55-i1-01 — Lane C must be scored as observed utilization, not as skill prose quality.

The parent spec already states the gap: sk-doc and validate-style checks cover document shape, while manual playbooks cover described behavior, but neither measures whether an AI actually routes to the skill, finds the right references/assets unprompted, and reaches a good outcome efficiently. [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/spec.md:64] [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/spec.md:71] sk-doc confirms this separation: it owns markdown quality, component scaffolding, and playbook creation rather than live utilization scoring. [SOURCE: .opencode/skills/sk-doc/SKILL.md:12] [SOURCE: .opencode/skills/sk-doc/SKILL.md:117]

Remediation implication: Lane C should emit "what failed in observed use" findings, not "section missing" findings. Structural problems matter only when they explain missed activation, missed discovery, wasted context, or weaker outcomes.

## f-gpt55-i1-02 — Recommended scorecard: 25 routing, 25 discovery, 20 usefulness, 15 efficiency, 15 structural connectivity, with repeatability reported separately.

The working 122 requirements list R1-R5 exactly as routing, unprompted discovery, efficiency, usefulness, and structural connectivity. [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/spec.md:124] [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/spec.md:128] My recommendation is:

| Dimension | Weight | Primary observable |
| --- | ---: | --- |
| Routing / activation accuracy | 0.25 | correct skill, correct intent, false-positive/false-negative rate |
| Unprompted reference / asset discovery | 0.25 | expected-resource precision/recall, first useful resource rank |
| Usefulness ablation | 0.20 | skill-on vs skill-off outcome delta |
| Efficiency / bottlenecks | 0.15 | calls, tokens, time, fallback cycles before useful resource |
| Structural connectivity | 0.15 | orphan resources, dead router keys, broken or over-broad mappings |

Repeatability should be a confidence modifier, not a sixth primary score, because Lane B already treats repeatability as separate evidence from benchmark completion. [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:350] [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/spec.md:155]

## f-gpt55-i1-03 — Routing accuracy should be split into advisor selection and in-skill resource routing.

system-skill-advisor routes non-trivial prompts through a named-skill / advisor-recommend / ambiguity flow, and it explicitly handles low confidence and ambiguous scores. [SOURCE: .opencode/skills/system-skill-advisor/SKILL.md:61] [SOURCE: .opencode/skills/system-skill-advisor/SKILL.md:257] The target skill also has its own smart router with INTENT_SIGNALS and RESOURCE_MAP, so a prompt can pass advisor selection but still load the wrong in-skill resources. [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:113] [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:124]

Metric design: score advisor top-1/top-2 skill accuracy, should-not-activate negatives, in-skill intent accuracy, and expected resource-set recall as separate sub-scores. MetaTool supports this split externally because it evaluates both whether to use a tool and which tool to choose, including single-tool and multi-tool scenarios. [SOURCE: https://arxiv.org/abs/2310.03128]

## f-gpt55-i1-04 — Unprompted discovery should be a retrieval-style metric over loaded references/assets, with path hints withheld.

The current target skill discovers markdown recursively and loads mapped resources only when routed by intent. [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:158] [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:189] Lane C's parent spec requires a hint-free harness that captures what was opened, in what order, and how many calls were needed. [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/spec.md:133] [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/spec.md:135]

The right submetrics are expected-resource recall, irrelevant-load precision, first useful resource rank, and whether any required asset was opened before final answer. Ragas prior art supports component-wise retrieval scoring with context precision, context recall, context utilization, and answer relevancy. [SOURCE: https://docs.ragas.io/en/v0.1.21/concepts/metrics/index.html] MCP-Bench is especially close: it tests agents' ability to retrieve relevant tools from fuzzy instructions without explicit tool names and evaluates tool-level, trajectory-level, and task-completion behavior. [SOURCE: https://arxiv.org/abs/2508.20453]

## f-gpt55-i1-05 — Efficiency should score the path to the first useful resource, not just total runtime.

The 122 hypothesis already names tool calls and token cost to reach the needed resource, over-loading, under-loading, fallback misfires, and dead ends. [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/spec.md:126] Existing skill routers have ALWAYS/CONDITIONAL/ON_DEMAND loading levels, so efficiency regressions can be traced to over-eager defaults, ambiguous intent hits, or on-demand resources that are never found. [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:89] [SOURCE: .opencode/skills/sk-doc/SKILL.md:191]

Metric design: record `calls_to_first_expected_resource`, `tokens_before_first_expected_resource`, `irrelevant_resource_count`, `fallback_count`, `ambiguous_intent_count`, and `dead_end_count`. LangSmith's evaluation guidance supports decomposing an agent into critical components such as tool invocations, retrieval steps, output formatting, and trajectory. [SOURCE: https://docs.langchain.com/langsmith/evaluation-concepts?mode=ui]

## f-gpt55-i1-06 — Usefulness needs skill-on / skill-off ablation because routing/discovery can be correct while the skill still adds no value.

The target skill frames benchmark-backed evaluation as judging produced artifacts and repeatability, not just prompt text. [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:54] Parent 122 makes usefulness a required skill-on versus skill-off delta. [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/spec.md:127]

Metric design: run each scenario twice, once with the target skill available and once with it hidden or non-routable, then score the delta with deterministic checks where possible and LLM-as-judge only for semantic outcomes. LangSmith supports both reference-based evaluators and pairwise comparison, which fits this ablation shape. [SOURCE: https://docs.langchain.com/langsmith/evaluation-concepts?mode=ui] ToolLLM/ToolBench also points toward expected solution paths plus automatic evaluation, not final-answer vibes alone. [SOURCE: https://arxiv.org/abs/2307.16789]

## f-gpt55-i1-07 — Structural connectivity should be a static-plus-dynamic diagnostic graph.

Static checks alone can find orphan references/assets, dead RESOURCE_MAP entries, missing trigger phrases, and broken path literals. Dynamic traces then prove whether those problems matter in real scenarios. system-skill-advisor already names the relevant anti-patterns: static inventories that miss moved docs, routers pointing at compatibility stubs, raw loads without guards, and hardcoded tool IDs. [SOURCE: .opencode/skills/system-skill-advisor/SKILL.md:264] [SOURCE: .opencode/skills/system-skill-advisor/SKILL.md:270] The target skill's router and runtime asset maps give Lane C clear graph nodes: INTENT_SIGNALS, RESOURCE_MAP, RUNTIME_ASSETS, discovered references/assets, scripts, and commands. [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:113] [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:135]

Remediation implication: every structural finding should name the broken edge and the observed consequence, e.g. "reference X exists but no intent maps to it; scenario Y missed it and loaded Z irrelevant files."

## f-gpt55-i1-08 — Lane C should reuse the Lane B seam pattern but must not inherit Lane B's "model output fixture" assumptions.

Lane B's template is the right implementation skeleton: `loop-host.cjs --mode=model-benchmark`, a model-agnostic dispatcher, scorer selection, mode-aware records, and shared promotion/report boundaries. [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:275] [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:279] The 121 build packet made backward compatibility explicit with a byte-identical identity gate for the default agent-improvement path. [SOURCE: .opencode/specs/skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/003-build-benchmark-mode/spec.md:125]

Lane C should copy the seam shape but change the fixture object: scenario prompt, expected skill activation, expected intent/resource set, expected outcome rubric, negative activation labels, and trace assertions. The 122 Phase 003 scaffold already names this candidate-source/dispatcher/scorer mapping. [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/003-skill-benchmark-mode/spec.md:39] [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/003-skill-benchmark-mode/spec.md:44]

## f-gpt55-i1-09 — Prior art agrees that trajectories matter; final answer scoring is insufficient.

AgentBench evaluates LLMs as agents in interactive environments and identifies failures in long-term reasoning, decision-making, and instruction following. [SOURCE: https://arxiv.org/abs/2308.03688] MCP-Bench adds trajectory-level planning and tool-level schema/usage evaluation. [SOURCE: https://arxiv.org/abs/2508.20453] LangSmith explicitly lists correct tool selection, argument formatting, and trajectory as agent examples to evaluate. [SOURCE: https://docs.langchain.com/langsmith/evaluation-concepts?mode=ui]

Implication: Lane C should persist a trace artifact per scenario, not just an aggregate score. The trace should include advisor result, loaded skill docs, opened references/assets, tool calls, token estimates, and final output score.

## f-gpt55-i1-10 — Rename surface is wider than the skill directory and should be treated as a graph rewrite.

The planned Phase 002 scope already lists the skill dir/SKILL.md, commands, agent and runtime mirrors, advisor graph/descriptions, root docs, cross-skill references, and internal self-references. [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/002-skill-rename-deep-improvement/spec.md:37] [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/002-skill-rename-deep-improvement/spec.md:45] Local search confirms live references in the OpenCode agent, Codex mirror, Lane A command, Lane B command, benchmark profile, feature catalog, scripts READMEs, references, manual playbooks, and tests. [SOURCE: .opencode/agents/deep-agent-improvement.md:44] [SOURCE: .codex/agents/deep-agent-improvement.toml:34] [SOURCE: .opencode/commands/deep/start-agent-improvement-loop.md:490] [SOURCE: .opencode/commands/deep/start-model-benchmark-loop.md:490] [SOURCE: .opencode/skills/deep-agent-improvement/assets/model-benchmark/benchmark-profiles/default.json:5]

Recommended rename buckets: canonical skill package; agent/mirrors; commands and YAML assets; advisor metadata/graph/descriptions; skill-local assets/references/scripts/readmes; feature catalog and manual playbook; tests/fixtures; root/global routing docs; historical specs/changelogs allowed as archives. The command verbs should remain lane-specific unless later research proves user confusion, matching Phase 002's current non-goal. [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/002-skill-rename-deep-improvement/spec.md:40] [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/spec.md:91]

# Recommendations

1. Implement Lane C as a 100-point weighted scorecard plus no-go gates. No-go gates should include wrong skill activation on critical positive scenarios, activation on critical negatives, and zero expected-resource recall for a scenario whose rubric requires that resource. [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/spec.md:124]
2. Store per-scenario traces as first-class evidence: advisor result, skill router intent, opened files in order, tool-call count, token estimate, final output, and evaluator verdict. [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/spec.md:134]
3. Keep structural connectivity diagnostic and remediable: every orphan/dead-key finding should include the static edge, the scenario that exposed it, and the suggested router/resource edit. [SOURCE: .opencode/skills/system-skill-advisor/SKILL.md:264]
4. Reuse Lane B's loop-host mode pattern and backward-compat identity gate, but define new `skill-benchmark` fixtures rather than bending model-benchmark fixtures into skill routing tests. [SOURCE: .opencode/specs/skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/003-build-benchmark-mode/spec.md:125] [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/003-skill-benchmark-mode/spec.md:41]
5. Treat rename as a dependency graph migration with an allowlist for historical archives; the operational surfaces must be grep-clean for the new `deep-improvement` name. [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/002-skill-rename-deep-improvement/spec.md:50]

# Open Questions

- What trace-capture mechanism can observe `Read`/resource loads consistently across Codex, Claude, Gemini, OpenCode, and Devin without leaking expected paths into the prompt? [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/spec.md:173]
- Should routing accuracy count advisor and in-skill router as separate top-level scores or as sub-scores under one 0.25 dimension? The evidence points to sub-scores, but Phase 001 should validate with real traces. [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/spec.md:174]
- How should skill-off baselines be isolated: hide the skill from advisor metadata, remove it from available skills, or instruct the agent not to use it? The first two are cleaner but may require runtime-specific harness support. [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/spec.md:127]
- How much variance is acceptable before a score becomes "inconclusive" rather than pass/fail? Lane B keeps repeatability separate, but Lane C needs a concrete threshold. [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:350]
