<!-- iteration 10 | model luna (gpt-5.6-luna) | angle: Research-loop specific technique | 2026-07-14T22:03:24.813Z -->

The strongest transfer is to make `deep-research` coverage-driven rather than search-count-driven. STORM uses perspective discovery plus grounded follow-up questions; A-RAG lets the agent choose retrieval granularity; DeepResearchEco exposes breadth/depth as experimental controls. Together they suggest JSONL records should carry `perspective_id`, `query_family`, `target_claim`, `source_family`, `retrieval_granularity`, `depth`, `evidence_gain`, and `context_cost`. ([STORM](https://aclanthology.org/2024.naacl-long.347/), [A-RAG](https://github.com/Ayanami0730/arag), [DeepResearchEco](https://arxiv.org/abs/2507.10522))

The scheduler should broaden early, then deepen only branches with high marginal evidence gain. ParallelResearch and FlowSearch formalize this with adaptive branching, pruning, reallocation, and dynamic knowledge-flow refinement. Coverage, citation accuracy, and report quality should remain separate gauges; DeepResearch Bench explicitly evaluates those dimensions independently. ([ParallelResearch](https://arxiv.org/abs/2510.05145), [FlowSearch](https://arxiv.org/abs/2510.08521), [DeepResearch Bench](https://deepresearch-bench.github.io/static/papers/deepresearch-bench.pdf))

GitHub metadata is approximate: STORM ~30k stars, Open Deep Research ~12k, UltraRAG ~5.6k, A-RAG ~300, and DeepResearchEco ~17. Their observed recency signals are included below.

```json
{
  "new_repos": [
    {
      "name": "stanford-oval/storm",
      "url": "https://github.com/stanford-oval/storm",
      "stars": "~30k",
      "what": "Perspective-guided question asking plus simulated writer-expert conversations; latest release Jan 2025 and latest commit Sep 2025.",
      "lesson": "Seed query families from distinct perspectives, then use grounded follow-ups to expand coverage before synthesis.",
      "maps_to": [
        "deep-research",
        "runtime/dedup-novelty",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "name": "langchain-ai/open_deep_research",
      "url": "https://github.com/langchain-ai/open_deep_research",
      "stars": "~12k",
      "what": "Configurable deep-research agent with separate summarization, research, compression, and report stages; no releases and commits through Jun 2026.",
      "lesson": "Make research stages and search providers independently configurable so cost and evidence quality can be measured per stage.",
      "maps_to": [
        "deep-research",
        "runtime/budget-cost",
        "runtime/fan-out-fan-in"
      ],
      "confidence": "high"
    },
    {
      "name": "OpenBMB/UltraRAG",
      "url": "https://github.com/OpenBMB/UltraRAG",
      "stars": "~5.6k",
      "what": "MCP-based modular RAG framework with YAML loops and branches, visible intermediate traces, and a Deep Research pipeline; latest release Apr 2026.",
      "lesson": "Treat retrievers, generators, evaluators, and control flow as swappable experiment units with inspectable intermediate artifacts.",
      "maps_to": [
        "deep-research",
        "runtime/fan-out-fan-in",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "name": "Ayanami0730/arag",
      "url": "https://github.com/Ayanami0730/arag",
      "stars": "~300",
      "what": "Hierarchical agentic RAG with keyword, semantic, and chunk-read tools; latest commit Feb 6, 2026 and no releases.",
      "lesson": "Expose retrieval granularity as a policy action and track already-read chunks to deepen selectively without rereading.",
      "maps_to": [
        "deep-research",
        "runtime/dedup-novelty",
        "runtime/budget-cost",
        "runtime/gauges-observability"
      ],
      "confidence": "med"
    },
    {
      "name": "sciknoworg/deep-research",
      "url": "https://github.com/sciknoworg/deep-research",
      "stars": "~17",
      "what": "Scientific deep-research implementation with explicit depth/breadth configurations and a qualitative evaluation pipeline; latest commit Apr 2026 and no releases.",
      "lesson": "Benchmark breadth/depth settings against source integration per output, not only final-answer quality.",
      "maps_to": [
        "deep-research",
        "runtime/budget-cost",
        "runtime/gauges-observability"
      ],
      "confidence": "low"
    }
  ],
  "insights": [
    {
      "insight": "Represent coverage as weighted necessary query or claim slots, separating characteristic discovery queries from extractive retrieval queries; final-answer scores can hide missing hops.",
      "evidence": "https://openreview.net/pdf?id=5EmpOCq1Ql",
      "maps_to": [
        "deep-research",
        "runtime/gauges-observability",
        "runtime/dedup-novelty"
      ],
      "confidence": "med"
    },
    {
      "insight": "Use an anytime marginal-gain scheduler: broaden early, deepen promising branches, prune redundant paths, and reallocate budget during execution.",
      "evidence": "https://arxiv.org/abs/2510.05145; https://arxiv.org/abs/2510.08521",
      "maps_to": [
        "deep-research",
        "runtime/fan-out-fan-in",
        "runtime/budget-cost",
        "runtime/convergence"
      ],
      "confidence": "med"
    },
    {
      "insight": "Define diversity over perspectives, source families, and stances, with a source-independence penalty; lexical novelty alone is not a reliable diversity signal.",
      "evidence": "https://research.google/pubs/multi-agent-query-reformulation-challenges-and-the-role-of-diversity/; https://aclanthology.org/2024.naacl-long.347/",
      "maps_to": [
        "deep-research",
        "runtime/dedup-novelty",
        "deep-review"
      ],
      "confidence": "high"
    },
    {
      "insight": "Make retrieval granularity a first-class action and charge every granularity transition for tokens, latency, and redundant reads.",
      "evidence": "https://github.com/Ayanami0730/arag",
      "maps_to": [
        "deep-research",
        "runtime/dedup-novelty",
        "runtime/budget-cost",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "insight": "Track evidence acquisition separately from report quality using supported-claim coverage, effective citation count, and citation accuracy.",
      "evidence": "https://deepresearch-bench.github.io/static/papers/deepresearch-bench.pdf",
      "maps_to": [
        "deep-research",
        "deep-review",
        "runtime/gauges-observability",
        "runtime/convergence"
      ],
      "confidence": "high"
    }
  ],
  "contradictions": [
    {
      "claim": "runtime/dedup-novelty: more diverse query families should improve coverage and question answering.",
      "counter": "Diversity improves retrieval in some settings, but it is difficult to characterize; STORM also reports source-bias transfer and unrelated-fact association risks.",
      "evidence": "https://research.google/pubs/multi-agent-query-reformulation-challenges-and-the-role-of-diversity/; https://aclanthology.org/2024.naacl-long.347/"
    },
    {
      "claim": "deep-research: increasing branch count and depth should improve comprehensiveness.",
      "counter": "Breadth can improve necessary-query coverage, but excessive retrieval can overflow context and reduce coherent depth; scheduling must optimize coverage per cost.",
      "evidence": "https://openreview.net/pdf?id=5EmpOCq1Ql; https://arxiv.org/abs/2510.08521"
    },
    {
      "claim": "runtime/gauges-observability: citation volume is a useful proxy for research coverage.",
      "counter": "High effective-citation counts can coexist with weaker citation accuracy, so citation quantity and grounding must be separate gauges.",
      "evidence": "https://deepresearch-bench.github.io/static/papers/deepresearch-bench.pdf"
    }
  ],
  "next_angles": [
    "Compare query-family operators—paraphrase, perspective, contradiction, entity-relation, and source-type expansion—by necessary-claim coverage gained per dollar.",
    "Test coverage-conditioned stopping: stop when high-priority claim slots have independent support, not when the planner stops proposing queries.",
    "Evaluate adaptive retrieval granularity under fixed budgets: search result, page, section, and chunk reads.",
    "Measure temporal source diversity by separating genuinely independent evidence from repeated recrawls of the same evolving source."
  ],
  "notes": "The main gap is an online, authoritative coverage estimator: most systems expose breadth/depth knobs or use LLM judges rather than maintaining a verifiable necessary-claim graph. The DeepResearchEco repository is real and linked from its paper, but its README contains a mismatched clone target, so its implementation evidence is low-confidence."
}
```


----- stderr -----
Reading additional input from stdin...
OpenAI Codex v0.144.4
--------
workdir: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/001-deep-loop-market-research/scratch
model: gpt-5.6-luna
provider: openai
approval: never
sandbox: read-only
reasoning effort: max
reasoning summaries: none
session id: 019f62a3-b2b5-7790-9899-c1e541cc5c16
--------
user
You are iteration 10/45 of a NON-CONVERGING (deliberately BROADENING) research loop mapping the state of the art in LOOP ENGINEERING for agentic / iterative AI systems.
The goal is to improve "system-deep-loop": a parent skill that runs iterative deep-research, deep-review, multi-agent deliberation, self-improvement, and alignment loops on top of an externalized-state (JSONL) runtime with convergence math, fan-out/fan-in, dedup/novelty scoring, budget control, and observability gauges.

THIS ITERATION'S ANGLE: Research-loop specific technique
DIRECTIVE: Agentic RAG, query reformulation, source diversification, breadth-vs-depth scheduling, coverage-driven expansion. Map to deep-research.

You have live web search ENABLED. Use it to find REAL, currently-existing GitHub repositories, papers, and authoritative docs. For every repo you MUST give its real URL and, where findable, approximate GitHub star count and a recency signal (last release / commit year). Do NOT invent repos, URLs, or numbers — if unsure, mark confidence "low" and say what you could not verify.

BROADEN — do not repeat prior coverage. Here is what has already been gathered:
Repos already catalogued (45) — do NOT re-list these, find NEW ones or go deeper/adjacent:
  Q00/ouroboros, OpenHands/software-agent-sdk, strongdm/attractor, AIDASLab/MATA, egmaminta/GEPA-Lite, google/ax, langchain-ai/langgraph, temporalio/temporal, restatedev/restate, dbos-inc/dbos-transact-py, microsoft/agent-framework, google/adk-python, ray-project/ray, apache/beam, togethercomputer/MoA, UKGovernmentBEIS/inspect_ai, stanfordnlp/dspy, confident-ai/deepteam, ScalerLab/JudgeBench, openai/prm800k, noahshinn/reflexion, madaan/self-refine, ysymyth/ReAct, spcl/graph-of-thoughts, ace-agent/ace, karpathy/llm-council, machine-theory/lm-council, thunlp/ChatEval, S-Abdelnabi/LLM-Deliberation, Henrymachiyu/Multi_Agent_Judge_Bias, mem0ai/mem0, getzep/graphiti, microsoft/graphrag, microsoft/Mnemis, DSAIL-Memory/EvoMemBench, pydantic/pydantic-ai, BerriAI/litellm, GeniusHTX/TALE, sajjadanwar0/token-budgets, microsoft/LLMLingua, eunomia-bpf/agentsight, open-telemetry/semantic-conventions-genai, Arize-ai/openinference, langfuse/langfuse, comet-ml/opik
Angles already covered: Loop control & termination policies | State externalization, checkpointing, resumability | Fan-out / fan-in orchestration | Evaluator / critic / verifier loops | Reflection & self-improvement | Multi-agent deliberation / debate | Dedup, novelty & knowledge accumulation | Budget / cost / depth control | Observability & gauges
Insights so far: 45; contradictions logged: 28.
Open threads prior iterations flagged: Compare fixed-round, residual-budget adaptive, and Lagrangian per-task allocation on identical JSONL traces under equal dollar budgets. | Fault-inject concurrent fan-out between reservation and debit; measure overspend, stranded reservations, and fairness under atomic versus best-effort accounting. | Measure full cost curves including repeated JSONL replay, tool latency, retries, evaluator calls, and context compression overhead—not output tokens alone. | runtime/gauges-observability: Test whether progress gauges remain monotone and rank-preserving when branches finish out of order, evaluators disagree, or evidence arrives late. | runtime/state-jsonl-checkpointing: Build frozen record/replay fixtures with mocked model and tool results, then compare exact trajectory identity against semantic trajectory equivalence. | runtime/gauges-observability: Measure semantic-trace coverage versus side-effect coverage to detect work that bypasses instrumentation. | runtime/convergence: Stress-test gauge Goodharting by constructing branches that improve visible scores while degrading external task utility. | runtime/locks-recovery: Fault-inject schema-version mismatches and partial event upgrades during resume, replay, and fan-in.

Map every finding to at least one concrete system-deep-loop target from this list: deep-research, deep-review, deep-ai-council, deep-improvement, deep-alignment, runtime/convergence, runtime/fan-out-fan-in, runtime/dedup-novelty, runtime/gauges-observability, runtime/state-jsonl-checkpointing, runtime/budget-cost, runtime/locks-recovery, runtime/continuity-threading.

Write a concise analysis (what you found + why it transfers), THEN end your message with a SINGLE fenced json block that is valid JSON and the LAST thing in your message, matching exactly:
```json
{
  "new_repos": [{"name":"owner/repo","url":"https://...","stars":"~N or unknown","what":"one line","lesson":"transferable lesson for system-deep-loop","maps_to":["subsystem"],"confidence":"high|med|low"}],
  "insights": [{"insight":"one specific transferable idea","evidence":"repo/paper/url","maps_to":["subsystem"],"confidence":"high|med|low"}],
  "contradictions": [{"claim":"","counter":"","evidence":""}],
  "next_angles": ["a specific divergent angle worth exploring next"],
  "notes": "coverage gaps you noticed"
}
```
Target 2-5 NEW repos and 2-5 insights. Novelty and verifiable specifics over volume. If this angle is genuinely exhausted, return few/no new_repos but propose sharp next_angles (that is the divergent pivot, not a failure).
codex
I’m checking primary repository and paper pages for new systems that explicitly implement research expansion, query reformulation, source diversity, or coverage-aware scheduling. I’ll verify stars and recency separately rather than infer them from secondary writeups.
web search: 
web search: GitHub STORM Stanford OVAL automated report generation multi-perspective question asking ...
web search: 
web search: 
web search: 
web search: 
web search: 
web search: 
codex
Three strong candidates are already distinct: STORM’s perspective-driven questioning, LangChain’s configurable research planner, and UltraRAG’s benchmarkable modular retrieval pipelines. I’m checking one adjacent hierarchical-retrieval system and the supporting papers so the final set is not four versions of the same deep-research scaffold.
web search: 
web search: site:github.com agentic RAG hierarchical retrieval interfaces multi-hop A-RAG repository ...
web search: 
web search: 
web search: 
web search: 
web search: 
web search: "coverage" "breadth" "depth" deep research search queries ICLR 2026 ...
web search: 
web search: https://github.com/sciknoworg/deep-research
web search: 
web search: "Necessary Query Coverage" "Deep Research" ...
web search: 
web search: https://aclanthology.org/2024.naacl-long.347/
web search: 
web search: 
web search: 
web search: 
web search: 
web search: https://github.com/langchain-ai/open_deep_research/commits/main
web search: 
web search: GitHub bytedance deer-flow deep exploration efficient research flow query planning ...
web search: 
web search: 
codex
The evidence is converging on a concrete loop shape: maintain a coverage map, fan out independent query families, retrieve at the granularity the evidence requires, then spend remaining budget on branches whose marginal information gain justifies deeper search. I’m doing a final verification pass on the benchmark and repository metadata before writing the transfer map.
web search: 
web search: 
web search: 
web search: 
web search: 
web search: 
web search: 
web search: 
codex
The strongest transfer is to make `deep-research` coverage-driven rather than search-count-driven. STORM uses perspective discovery plus grounded follow-up questions; A-RAG lets the agent choose retrieval granularity; DeepResearchEco exposes breadth/depth as experimental controls. Together they suggest JSONL records should carry `perspective_id`, `query_family`, `target_claim`, `source_family`, `retrieval_granularity`, `depth`, `evidence_gain`, and `context_cost`. ([STORM](https://aclanthology.org/2024.naacl-long.347/), [A-RAG](https://github.com/Ayanami0730/arag), [DeepResearchEco](https://arxiv.org/abs/2507.10522))

The scheduler should broaden early, then deepen only branches with high marginal evidence gain. ParallelResearch and FlowSearch formalize this with adaptive branching, pruning, reallocation, and dynamic knowledge-flow refinement. Coverage, citation accuracy, and report quality should remain separate gauges; DeepResearch Bench explicitly evaluates those dimensions independently. ([ParallelResearch](https://arxiv.org/abs/2510.05145), [FlowSearch](https://arxiv.org/abs/2510.08521), [DeepResearch Bench](https://deepresearch-bench.github.io/static/papers/deepresearch-bench.pdf))

GitHub metadata is approximate: STORM ~30k stars, Open Deep Research ~12k, UltraRAG ~5.6k, A-RAG ~300, and DeepResearchEco ~17. Their observed recency signals are included below.

```json
{
  "new_repos": [
    {
      "name": "stanford-oval/storm",
      "url": "https://github.com/stanford-oval/storm",
      "stars": "~30k",
      "what": "Perspective-guided question asking plus simulated writer-expert conversations; latest release Jan 2025 and latest commit Sep 2025.",
      "lesson": "Seed query families from distinct perspectives, then use grounded follow-ups to expand coverage before synthesis.",
      "maps_to": [
        "deep-research",
        "runtime/dedup-novelty",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "name": "langchain-ai/open_deep_research",
      "url": "https://github.com/langchain-ai/open_deep_research",
      "stars": "~12k",
      "what": "Configurable deep-research agent with separate summarization, research, compression, and report stages; no releases and commits through Jun 2026.",
      "lesson": "Make research stages and search providers independently configurable so cost and evidence quality can be measured per stage.",
      "maps_to": [
        "deep-research",
        "runtime/budget-cost",
        "runtime/fan-out-fan-in"
      ],
      "confidence": "high"
    },
    {
      "name": "OpenBMB/UltraRAG",
      "url": "https://github.com/OpenBMB/UltraRAG",
      "stars": "~5.6k",
      "what": "MCP-based modular RAG framework with YAML loops and branches, visible intermediate traces, and a Deep Research pipeline; latest release Apr 2026.",
      "lesson": "Treat retrievers, generators, evaluators, and control flow as swappable experiment units with inspectable intermediate artifacts.",
      "maps_to": [
        "deep-research",
        "runtime/fan-out-fan-in",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "name": "Ayanami0730/arag",
      "url": "https://github.com/Ayanami0730/arag",
      "stars": "~300",
      "what": "Hierarchical agentic RAG with keyword, semantic, and chunk-read tools; latest commit Feb 6, 2026 and no releases.",
      "lesson": "Expose retrieval granularity as a policy action and track already-read chunks to deepen selectively without rereading.",
      "maps_to": [
        "deep-research",
        "runtime/dedup-novelty",
        "runtime/budget-cost",
        "runtime/gauges-observability"
      ],
      "confidence": "med"
    },
    {
      "name": "sciknoworg/deep-research",
      "url": "https://github.com/sciknoworg/deep-research",
      "stars": "~17",
      "what": "Scientific deep-research implementation with explicit depth/breadth configurations and a qualitative evaluation pipeline; latest commit Apr 2026 and no releases.",
      "lesson": "Benchmark breadth/depth settings against source integration per output, not only final-answer quality.",
      "maps_to": [
        "deep-research",
        "runtime/budget-cost",
        "runtime/gauges-observability"
      ],
      "confidence": "low"
    }
  ],
  "insights": [
    {
      "insight": "Represent coverage as weighted necessary query or claim slots, separating characteristic discovery queries from extractive retrieval queries; final-answer scores can hide missing hops.",
      "evidence": "https://openreview.net/pdf?id=5EmpOCq1Ql",
      "maps_to": [
        "deep-research",
        "runtime/gauges-observability",
        "runtime/dedup-novelty"
      ],
      "confidence": "med"
    },
    {
      "insight": "Use an anytime marginal-gain scheduler: broaden early, deepen promising branches, prune redundant paths, and reallocate budget during execution.",
      "evidence": "https://arxiv.org/abs/2510.05145; https://arxiv.org/abs/2510.08521",
      "maps_to": [
        "deep-research",
        "runtime/fan-out-fan-in",
        "runtime/budget-cost",
        "runtime/convergence"
      ],
      "confidence": "med"
    },
    {
      "insight": "Define diversity over perspectives, source families, and stances, with a source-independence penalty; lexical novelty alone is not a reliable diversity signal.",
      "evidence": "https://research.google/pubs/multi-agent-query-reformulation-challenges-and-the-role-of-diversity/; https://aclanthology.org/2024.naacl-long.347/",
      "maps_to": [
        "deep-research",
        "runtime/dedup-novelty",
        "deep-review"
      ],
      "confidence": "high"
    },
    {
      "insight": "Make retrieval granularity a first-class action and charge every granularity transition for tokens, latency, and redundant reads.",
      "evidence": "https://github.com/Ayanami0730/arag",
      "maps_to": [
        "deep-research",
        "runtime/dedup-novelty",
        "runtime/budget-cost",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "insight": "Track evidence acquisition separately from report quality using supported-claim coverage, effective citation count, and citation accuracy.",
      "evidence": "https://deepresearch-bench.github.io/static/papers/deepresearch-bench.pdf",
      "maps_to": [
        "deep-research",
        "deep-review",
        "runtime/gauges-observability",
        "runtime/convergence"
      ],
      "confidence": "high"
    }
  ],
  "contradictions": [
    {
      "claim": "runtime/dedup-novelty: more diverse query families should improve coverage and question answering.",
      "counter": "Diversity improves retrieval in some settings, but it is difficult to characterize; STORM also reports source-bias transfer and unrelated-fact association risks.",
      "evidence": "https://research.google/pubs/multi-agent-query-reformulation-challenges-and-the-role-of-diversity/; https://aclanthology.org/2024.naacl-long.347/"
    },
    {
      "claim": "deep-research: increasing branch count and depth should improve comprehensiveness.",
      "counter": "Breadth can improve necessary-query coverage, but excessive retrieval can overflow context and reduce coherent depth; scheduling must optimize coverage per cost.",
      "evidence": "https://openreview.net/pdf?id=5EmpOCq1Ql; https://arxiv.org/abs/2510.08521"
    },
    {
      "claim": "runtime/gauges-observability: citation volume is a useful proxy for research coverage.",
      "counter": "High effective-citation counts can coexist with weaker citation accuracy, so citation quantity and grounding must be separate gauges.",
      "evidence": "https://deepresearch-bench.github.io/static/papers/deepresearch-bench.pdf"
    }
  ],
  "next_angles": [
    "Compare query-family operators—paraphrase, perspective, contradiction, entity-relation, and source-type expansion—by necessary-claim coverage gained per dollar.",
    "Test coverage-conditioned stopping: stop when high-priority claim slots have independent support, not when the planner stops proposing queries.",
    "Evaluate adaptive retrieval granularity under fixed budgets: search result, page, section, and chunk reads.",
    "Measure temporal source diversity by separating genuinely independent evidence from repeated recrawls of the same evolving source."
  ],
  "notes": "The main gap is an online, authoritative coverage estimator: most systems expose breadth/depth knobs or use LLM judges rather than maintaining a verifiable necessary-claim graph. The DeepResearchEco repository is real and linked from its paper, but its README contains a mismatched clone target, so its implementation evidence is low-confidence."
}
```
hook: Stop
hook: Stop Completed
tokens used
237,735
