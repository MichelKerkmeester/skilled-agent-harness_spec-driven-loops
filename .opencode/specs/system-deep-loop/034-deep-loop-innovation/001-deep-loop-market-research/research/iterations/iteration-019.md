<!-- iteration 19 | model luna (gpt-5.6-luna) | angle: Query reformulation & source diversification | 2026-07-14T22:47:16.829Z -->

Query reformulation should be a typed, lineage-preserving branch family—not an opaque prompt rewrite. HyDE generates a fictional document for retrieval, while Query2doc concatenates an LLM-generated pseudo-document with the original query; the synthetic text should receive zero evidence credit until grounded by real sources. [HyDE](https://github.com/texttron/hyde), [Query2doc](https://aclanthology.org/2023.emnlp-main.585/)

Production frameworks now expose the needed fan-out/fan-in primitives: Haystack parallelizes multi-query retrieval and deduplicates documents, while LlamaIndex fuses multiple query/index result lists with RRF. [Haystack](https://docs.haystack.deepset.ai/docs/multiqueryembeddingretriever), [LlamaIndex](https://developers.llamaindex.ai/python/framework/integrations/retrievers/reciprocal_rerank_fusion/)

The main caution is adaptive admission. A 2026 production-style study found raw recall gains often disappear after reranking and truncation, while latency increases. The RAG-Fusion implementation consequently recommends baseline-first routing and activating fusion only on weakness signals. [Study](https://arxiv.org/html/2603.02153), [RAG-Fusion](https://github.com/Raudaschl/rag-fusion)

For source diversification, use separate gauges for semantic novelty, independent-source coverage, new claims, contradictions, and marginal evidence per cost. DIVERGE’s viewpoint memory and history-aware reranking transfer directly to JSONL state; Vendi-RAG and DF-RAG support query-adaptive relevance/diversity weighting. Simple clustering is not enough: Google’s multi-agent reformulation work explicitly found useful diversity difficult to characterize, while Search Wisely shows both over-search and under-search are common. [DIVERGE](https://arxiv.org/html/2602.00238), [Vendi-RAG](https://arxiv.org/html/2502.11228), [DF-RAG](https://arxiv.org/abs/2601.17212), [Google research](https://research.google/pubs/multi-agent-query-reformulation-challenges-and-the-role-of-diversity/), [Search Wisely](https://aclanthology.org/2025.emnlp-main.998/)

```json
{
  "new_repos": [
    {
      "name": "texttron/hyde",
      "url": "https://github.com/texttron/hyde",
      "stars": "~580",
      "what": "Canonical HyDE reference implementation; no releases, 7 commits, and latest commit year not verified.",
      "lesson": "Represent hypothetical documents as untrusted query-control artifacts, not evidence or novelty.",
      "maps_to": ["deep-research", "runtime/dedup-novelty", "runtime/state-jsonl-checkpointing"],
      "confidence": "med"
    },
    {
      "name": "Raudaschl/rag-fusion",
      "url": "https://github.com/Raudaschl/rag-fusion",
      "stars": "~940",
      "what": "Multi-query RRF evaluation harness with hybrid, reranking, bootstrap-CI, and 2026 replication experiments; exact latest commit date not exposed.",
      "lesson": "Evaluate fusion after reranking and truncation, then route it adaptively against a baseline.",
      "maps_to": ["deep-research", "runtime/fan-out-fan-in", "runtime/budget-cost", "runtime/convergence"],
      "confidence": "med"
    },
    {
      "name": "au-clan/Diverge",
      "url": "https://github.com/au-clan/Diverge",
      "stars": "~3",
      "what": "Reference implementation for iterative viewpoint-conditioned, diversity-aware agentic RAG; 20 commits, 2026 paper, no releases.",
      "lesson": "Persist viewpoints, prior queries, answers, and retrieved embeddings so later branches target uncovered regions.",
      "maps_to": ["deep-research", "runtime/dedup-novelty", "runtime/gauges-observability", "runtime/state-jsonl-checkpointing"],
      "confidence": "high"
    },
    {
      "name": "deepset-ai/haystack",
      "url": "https://github.com/deepset-ai/haystack",
      "stars": "~25.9k",
      "what": "Production RAG/agent orchestration with QueryExpander and parallel multi-query retrievers; v2.31.0 released 2026-07-08 and repo pushed 2026-07-14.",
      "lesson": "Use a standard branch contract: expand, retrieve in parallel, deduplicate, preserve the original query for synthesis.",
      "maps_to": ["deep-research", "runtime/fan-out-fan-in", "runtime/dedup-novelty", "runtime/budget-cost"],
      "confidence": "high"
    },
    {
      "name": "run-llama/llama_index",
      "url": "https://github.com/run-llama/llama_index",
      "stars": "~50.8k",
      "what": "Agentic data framework with query transformations and fusion retrievers; v0.14.23 released 2026-06-24.",
      "lesson": "Make RRF a pluggable fan-in stage while retaining per-query and per-index provenance for audit.",
      "maps_to": ["deep-research", "runtime/fan-out-fan-in", "runtime/dedup-novelty", "runtime/gauges-observability"],
      "confidence": "high"
    }
  ],
  "insights": [
    {
      "insight": "Synthetic reformulations need lineage fields such as parent_query_id, transform_type, synthetic_text, and grounded_source_ids; synthetic text should contribute zero support until verified.",
      "evidence": "https://github.com/texttron/hyde; https://aclanthology.org/2023.emnlp-main.585/",
      "maps_to": ["deep-research", "runtime/state-jsonl-checkpointing", "runtime/dedup-novelty"],
      "confidence": "med"
    },
    {
      "insight": "Novelty should be a vector, separating semantic/document novelty from independent-source and new-claim novelty; embedding distance alone can reward correlated or near-duplicate sources.",
      "evidence": "https://arxiv.org/html/2602.00238; https://arxiv.org/html/2502.11228; https://research.google/pubs/multi-agent-query-reformulation-challenges-and-the-role-of-diversity/",
      "maps_to": ["runtime/dedup-novelty", "runtime/gauges-observability", "deep-research"],
      "confidence": "med"
    },
    {
      "insight": "Use baseline-first adaptive branch admission: spawn HyDE, paraphrase, or fusion branches only when ambiguity, weak lexical match, low coverage, or low source diversity justifies their cost.",
      "evidence": "https://arxiv.org/html/2603.02153; https://github.com/Raudaschl/rag-fusion",
      "maps_to": ["runtime/budget-cost", "runtime/convergence", "runtime/fan-out-fan-in", "deep-research"],
      "confidence": "high"
    },
    {
      "insight": "Make the relevance/diversity weight query-adaptive and quality-conditioned; Vendi-RAG adjusts it from answer quality, while DF-RAG searches the diversity parameter with planner/evaluator feedback.",
      "evidence": "https://arxiv.org/html/2502.11228; https://arxiv.org/abs/2601.17212",
      "maps_to": ["runtime/convergence", "runtime/dedup-novelty", "runtime/budget-cost", "runtime/gauges-observability"],
      "confidence": "high"
    },
    {
      "insight": "Add explicit over-search, under-search, marginal-claim-gain, source-independence, and contradiction gauges; query diversity is difficult to characterize and search decisions correlate with uncertainty.",
      "evidence": "https://aclanthology.org/2025.emnlp-main.998/; https://research.google/pubs/multi-agent-query-reformulation-challenges-and-the-role-of-diversity/",
      "maps_to": ["runtime/gauges-observability", "runtime/budget-cost", "runtime/convergence", "deep-research"],
      "confidence": "med"
    }
  ],
  "contradictions": [
    {
      "claim": "[runtime/convergence] More query variants and higher retrieval recall should monotonically improve final answer quality.",
      "counter": "[runtime/budget-cost] Reranking, truncation, redundancy, and latency can neutralize or reverse recall gains; branch admission must be conditional.",
      "evidence": "https://arxiv.org/html/2603.02153"
    },
    {
      "claim": "[runtime/dedup-novelty] Increasing semantic diversity in retrieved documents is sufficient to produce diverse answers.",
      "counter": "[deep-research] DIVERGE finds standard RAG can repeat viewpoints despite diverse contexts; viewpoint-conditioned generation and historical memory are required.",
      "evidence": "https://arxiv.org/html/2602.00238"
    },
    {
      "claim": "[runtime/gauges-observability] Query embedding clusters are an adequate measure of useful reformulation diversity.",
      "counter": "[runtime/dedup-novelty] Useful diversity is task- and utility-dependent; simple clustering failed in the cited multi-agent reformulation study.",
      "evidence": "https://research.google/pubs/multi-agent-query-reformulation-challenges-and-the-role-of-diversity/"
    }
  ],
  "next_angles": [
    "Compare semantic novelty, unique-domain novelty, and independent-claim novelty under correlated web syndication; map to runtime/dedup-novelty and runtime/gauges-observability.",
    "Benchmark baseline-first branch admission using weakness signals, false-stop rate, wasted budget, and final evidence availability; map to deep-research, runtime/convergence, and runtime/budget-cost.",
    "Fault-inject hallucinated HyDE or Query2doc entities and measure source anchoring, contradiction rate, rollback, and recovery; map to deep-review, runtime/locks-recovery, and runtime/continuity-threading.",
    "Compare RRF, MMR, Vendi, and adaptive DF-RAG weighting under asynchronous fan-in and evaluator drift; map to runtime/fan-out-fan-in, runtime/convergence, and runtime/gauges-observability."
  ],
  "notes": "Coverage is strong on HyDE, pseudo-document expansion, RRF/MMR/Vendi, and viewpoint memory. The main gap is provenance independence: most systems score embeddings, URLs, chunks, or viewpoints rather than publisher, author, citation, or syndication clusters. Star counts are approximate as of 2026-07-15; texttron/hyde has no releases, and Raudaschl/rag-fusion's exact latest commit date was not exposed."
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
session id: 019f62cb-c761-7a71-9540-ba3035ac9919
--------
user
You are iteration 19/45 of a NON-CONVERGING (deliberately BROADENING) research loop mapping the state of the art in LOOP ENGINEERING for agentic / iterative AI systems.
The goal is to improve "system-deep-loop": a parent skill that runs iterative deep-research, deep-review, multi-agent deliberation, self-improvement, and alignment loops on top of an externalized-state (JSONL) runtime with convergence math, fan-out/fan-in, dedup/novelty scoring, budget control, and observability gauges.

THIS ITERATION'S ANGLE: Query reformulation & source diversification
DIRECTIVE: Multi-query, HyDE, RAG-fusion, source-diversity scoring in research agents. Map to deep-research, runtime/dedup-novelty.

You have live web search ENABLED. Use it to find REAL, currently-existing GitHub repositories, papers, and authoritative docs. For every repo you MUST give its real URL and, where findable, approximate GitHub star count and a recency signal (last release / commit year). Do NOT invent repos, URLs, or numbers — if unsure, mark confidence "low" and say what you could not verify.

BROADEN — do not repeat prior coverage. Here is what has already been gathered:
Repos already catalogued (86) — do NOT re-list these, find NEW ones or go deeper/adjacent:
  Q00/ouroboros, OpenHands/software-agent-sdk, strongdm/attractor, AIDASLab/MATA, egmaminta/GEPA-Lite, google/ax, langchain-ai/langgraph, temporalio/temporal, restatedev/restate, dbos-inc/dbos-transact-py, microsoft/agent-framework, google/adk-python, ray-project/ray, apache/beam, togethercomputer/MoA, UKGovernmentBEIS/inspect_ai, stanfordnlp/dspy, confident-ai/deepteam, ScalerLab/JudgeBench, openai/prm800k, noahshinn/reflexion, madaan/self-refine, ysymyth/ReAct, spcl/graph-of-thoughts, ace-agent/ace, karpathy/llm-council, machine-theory/lm-council, thunlp/ChatEval, S-Abdelnabi/LLM-Deliberation, Henrymachiyu/Multi_Agent_Judge_Bias, mem0ai/mem0, getzep/graphiti, microsoft/graphrag, microsoft/Mnemis, DSAIL-Memory/EvoMemBench, pydantic/pydantic-ai, BerriAI/litellm, GeniusHTX/TALE, sajjadanwar0/token-budgets, microsoft/LLMLingua, eunomia-bpf/agentsight, open-telemetry/semantic-conventions-genai, Arize-ai/openinference, langfuse/langfuse, comet-ml/opik, stanford-oval/storm, langchain-ai/open_deep_research, OpenBMB/UltraRAG, Ayanami0730/arag, sciknoworg/deep-research, inngest/inngest, hatchet-dev/hatchet, dbos-inc/dbos-transact-golang, microsoft/durabletask-go, langchain-ai/langgraphjs, langchain-ai/agent-protocol, langchain-ai/deepagents, redis-developer/langgraph-redis, ag2ai/ag2, crewAIInc/crewAI, microsoft/autogen, zou-group/textgrad, microsoft/Trace, microsoft/PromptWizard, google-deepmind/opro, meta-llama/prompt-ops, SWE-agent/SWE-agent, SWE-agent/mini-swe-agent, huggingface/smolagents, SWE-agent/SWE-ReX, hyang0129/onlycodes, promptfoo/promptfoo, UKGovernmentBEIS/inspect_evals, ServiceNow/AgentLab, sierra-research/tau2-bench, xlang-ai/OSWorld, google/vizier, optuna/optuna, zhengkid/AutoTTS, Xieyangxinyu/reasoning_uncertainty, QianJaneXie/CostAwareStoppingBayesOpt, microsoft/lost_in_conversation, microsoft/DELEGATE52, OpenAutoCoder/Agentless, slhleosun/reasoning-trajectory, wzy6642/ProCo
Angles already covered: Loop control & termination policies | State externalization, checkpointing, resumability | Fan-out / fan-in orchestration | Evaluator / critic / verifier loops | Reflection & self-improvement | Multi-agent deliberation / debate | Dedup, novelty & knowledge accumulation | Budget / cost / depth control | Observability & gauges | Research-loop specific technique | Durable-execution engines for loop resumability | LangGraph persistence/checkpointing internals | AutoGen/AG2 + CrewAI orchestration patterns | DSPy / TextGrad — optimization-as-loop | Coding-agent loop control (OpenHands/SWE-agent/smolagents) | Eval harnesses as loops (Inspect/promptfoo) | Convergence math & formal stopping rules | CONTRADICTION: when NOT to loop
Insights so far: 90; contradictions logged: 53.
Open threads prior iterations flagged: Estimate adaptive-submodularity or weak-submodularity ratios for novelty, evidence coverage, and verifier utility on existing JSONL traces. | Fault-inject correlated, nonstationary, and evaluator-drifted branches to compare Track-and-Stop, martingale certificates, bootstrap bounds, and heuristic patience. | Implement separate branch-prune and parent-stop decisions under asynchronous fan-in, including retries and duplicate observations. | Calibrate two-sided stopping thresholds under domain shift and report false-stop rate, wasted-budget rate, and coverage by stop reason. | Benchmark continuation versus fresh restart versus branch-and-rollback after injecting the same early wrong assumption. | Build a task-admission classifier using reversibility, verifier availability, artifact mutation, and expected error cost to predict when single-shot should win. | Measure loop-depth hazard curves on reversible artifacts, distinguishing sparse catastrophic corruption from gradual quality drift. | Test baseline preservation under verifier abstention: compare forced correction, no-op, and fresh independent regeneration under asymmetric loss.

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
I’m treating this as a read-only research pass. I’ll verify current GitHub metadata and primary papers/docs, avoid the 86 catalogued repositories, and map each finding to a concrete system-deep-loop subsystem.
web search: 
web search: GitHub HyDE hypothetical document embeddings query expansion repository ...
web search: 
web search: site:research.google multi-agent query reformulation diversity retrieval paper ...
web search: 
web search: Vendi-RAG GitHub repository Vendi score RAG ...
web search: 
web search: https://github.com/au-clan/Diverge
web search: 
web search: 
web search: 
web search: https://api.github.com/repos/deepset-ai/haystack
web search: 
web search: site:github.com/NirDiamant/RAG_Techniques/commits RAG_Techniques 2026 ...
web search: 
web search: https://github.com/Raudaschl/rag-fusion/commits/main
web search: 
web search: 
codex
The strongest new seam is not “generate more queries.” It is controlled branch diversification: preserve the original query, tag each reformulation’s intent/viewpoint, deduplicate at document/source level, and stop branches when incremental evidence collapses. I’m checking the empirical caveats now—especially where recall gains disappear after reranking or answer evaluation.
web search: 
web search: https://arxiv.org/abs/2212.10496
web search: 
web search: 
web search: 
web search: https://docs.llamaindex.ai/en/stable/examples/retrievers/reciprocal_rerank_fusion/
web search: 
web search: 
web search: 
web search: https://github.com/texttron/hyde
web search: 
web search: 
web search: 
web search: site:developers.llamaindex.ai QueryFusionRetriever HyDEQueryTransform current docs ...
web search: 
web search: "Scaling Retrieval Augmented Generation with RAG Fusion" conclusions vector-only fusion reranking answer quality ...
web search: 
web search: https://aclanthology.org/2023.emnlp-main.585/
web search: 
web search: 
web search: 
web search: 
codex
GitHub access would make star/recency verification more reliable for this repository-heavy angle, so I’m also suggesting the available GitHub connector while continuing with the live web evidence.
codex
Query reformulation should be a typed, lineage-preserving branch family—not an opaque prompt rewrite. HyDE generates a fictional document for retrieval, while Query2doc concatenates an LLM-generated pseudo-document with the original query; the synthetic text should receive zero evidence credit until grounded by real sources. [HyDE](https://github.com/texttron/hyde), [Query2doc](https://aclanthology.org/2023.emnlp-main.585/)

Production frameworks now expose the needed fan-out/fan-in primitives: Haystack parallelizes multi-query retrieval and deduplicates documents, while LlamaIndex fuses multiple query/index result lists with RRF. [Haystack](https://docs.haystack.deepset.ai/docs/multiqueryembeddingretriever), [LlamaIndex](https://developers.llamaindex.ai/python/framework/integrations/retrievers/reciprocal_rerank_fusion/)

The main caution is adaptive admission. A 2026 production-style study found raw recall gains often disappear after reranking and truncation, while latency increases. The RAG-Fusion implementation consequently recommends baseline-first routing and activating fusion only on weakness signals. [Study](https://arxiv.org/html/2603.02153), [RAG-Fusion](https://github.com/Raudaschl/rag-fusion)

For source diversification, use separate gauges for semantic novelty, independent-source coverage, new claims, contradictions, and marginal evidence per cost. DIVERGE’s viewpoint memory and history-aware reranking transfer directly to JSONL state; Vendi-RAG and DF-RAG support query-adaptive relevance/diversity weighting. Simple clustering is not enough: Google’s multi-agent reformulation work explicitly found useful diversity difficult to characterize, while Search Wisely shows both over-search and under-search are common. [DIVERGE](https://arxiv.org/html/2602.00238), [Vendi-RAG](https://arxiv.org/html/2502.11228), [DF-RAG](https://arxiv.org/abs/2601.17212), [Google research](https://research.google/pubs/multi-agent-query-reformulation-challenges-and-the-role-of-diversity/), [Search Wisely](https://aclanthology.org/2025.emnlp-main.998/)

```json
{
  "new_repos": [
    {
      "name": "texttron/hyde",
      "url": "https://github.com/texttron/hyde",
      "stars": "~580",
      "what": "Canonical HyDE reference implementation; no releases, 7 commits, and latest commit year not verified.",
      "lesson": "Represent hypothetical documents as untrusted query-control artifacts, not evidence or novelty.",
      "maps_to": ["deep-research", "runtime/dedup-novelty", "runtime/state-jsonl-checkpointing"],
      "confidence": "med"
    },
    {
      "name": "Raudaschl/rag-fusion",
      "url": "https://github.com/Raudaschl/rag-fusion",
      "stars": "~940",
      "what": "Multi-query RRF evaluation harness with hybrid, reranking, bootstrap-CI, and 2026 replication experiments; exact latest commit date not exposed.",
      "lesson": "Evaluate fusion after reranking and truncation, then route it adaptively against a baseline.",
      "maps_to": ["deep-research", "runtime/fan-out-fan-in", "runtime/budget-cost", "runtime/convergence"],
      "confidence": "med"
    },
    {
      "name": "au-clan/Diverge",
      "url": "https://github.com/au-clan/Diverge",
      "stars": "~3",
      "what": "Reference implementation for iterative viewpoint-conditioned, diversity-aware agentic RAG; 20 commits, 2026 paper, no releases.",
      "lesson": "Persist viewpoints, prior queries, answers, and retrieved embeddings so later branches target uncovered regions.",
      "maps_to": ["deep-research", "runtime/dedup-novelty", "runtime/gauges-observability", "runtime/state-jsonl-checkpointing"],
      "confidence": "high"
    },
    {
      "name": "deepset-ai/haystack",
      "url": "https://github.com/deepset-ai/haystack",
      "stars": "~25.9k",
      "what": "Production RAG/agent orchestration with QueryExpander and parallel multi-query retrievers; v2.31.0 released 2026-07-08 and repo pushed 2026-07-14.",
      "lesson": "Use a standard branch contract: expand, retrieve in parallel, deduplicate, preserve the original query for synthesis.",
      "maps_to": ["deep-research", "runtime/fan-out-fan-in", "runtime/dedup-novelty", "runtime/budget-cost"],
      "confidence": "high"
    },
    {
      "name": "run-llama/llama_index",
      "url": "https://github.com/run-llama/llama_index",
      "stars": "~50.8k",
      "what": "Agentic data framework with query transformations and fusion retrievers; v0.14.23 released 2026-06-24.",
      "lesson": "Make RRF a pluggable fan-in stage while retaining per-query and per-index provenance for audit.",
      "maps_to": ["deep-research", "runtime/fan-out-fan-in", "runtime/dedup-novelty", "runtime/gauges-observability"],
      "confidence": "high"
    }
  ],
  "insights": [
    {
      "insight": "Synthetic reformulations need lineage fields such as parent_query_id, transform_type, synthetic_text, and grounded_source_ids; synthetic text should contribute zero support until verified.",
      "evidence": "https://github.com/texttron/hyde; https://aclanthology.org/2023.emnlp-main.585/",
      "maps_to": ["deep-research", "runtime/state-jsonl-checkpointing", "runtime/dedup-novelty"],
      "confidence": "med"
    },
    {
      "insight": "Novelty should be a vector, separating semantic/document novelty from independent-source and new-claim novelty; embedding distance alone can reward correlated or near-duplicate sources.",
      "evidence": "https://arxiv.org/html/2602.00238; https://arxiv.org/html/2502.11228; https://research.google/pubs/multi-agent-query-reformulation-challenges-and-the-role-of-diversity/",
      "maps_to": ["runtime/dedup-novelty", "runtime/gauges-observability", "deep-research"],
      "confidence": "med"
    },
    {
      "insight": "Use baseline-first adaptive branch admission: spawn HyDE, paraphrase, or fusion branches only when ambiguity, weak lexical match, low coverage, or low source diversity justifies their cost.",
      "evidence": "https://arxiv.org/html/2603.02153; https://github.com/Raudaschl/rag-fusion",
      "maps_to": ["runtime/budget-cost", "runtime/convergence", "runtime/fan-out-fan-in", "deep-research"],
      "confidence": "high"
    },
    {
      "insight": "Make the relevance/diversity weight query-adaptive and quality-conditioned; Vendi-RAG adjusts it from answer quality, while DF-RAG searches the diversity parameter with planner/evaluator feedback.",
      "evidence": "https://arxiv.org/html/2502.11228; https://arxiv.org/abs/2601.17212",
      "maps_to": ["runtime/convergence", "runtime/dedup-novelty", "runtime/budget-cost", "runtime/gauges-observability"],
      "confidence": "high"
    },
    {
      "insight": "Add explicit over-search, under-search, marginal-claim-gain, source-independence, and contradiction gauges; query diversity is difficult to characterize and search decisions correlate with uncertainty.",
      "evidence": "https://aclanthology.org/2025.emnlp-main.998/; https://research.google/pubs/multi-agent-query-reformulation-challenges-and-the-role-of-diversity/",
      "maps_to": ["runtime/gauges-observability", "runtime/budget-cost", "runtime/convergence", "deep-research"],
      "confidence": "med"
    }
  ],
  "contradictions": [
    {
      "claim": "[runtime/convergence] More query variants and higher retrieval recall should monotonically improve final answer quality.",
      "counter": "[runtime/budget-cost] Reranking, truncation, redundancy, and latency can neutralize or reverse recall gains; branch admission must be conditional.",
      "evidence": "https://arxiv.org/html/2603.02153"
    },
    {
      "claim": "[runtime/dedup-novelty] Increasing semantic diversity in retrieved documents is sufficient to produce diverse answers.",
      "counter": "[deep-research] DIVERGE finds standard RAG can repeat viewpoints despite diverse contexts; viewpoint-conditioned generation and historical memory are required.",
      "evidence": "https://arxiv.org/html/2602.00238"
    },
    {
      "claim": "[runtime/gauges-observability] Query embedding clusters are an adequate measure of useful reformulation diversity.",
      "counter": "[runtime/dedup-novelty] Useful diversity is task- and utility-dependent; simple clustering failed in the cited multi-agent reformulation study.",
      "evidence": "https://research.google/pubs/multi-agent-query-reformulation-challenges-and-the-role-of-diversity/"
    }
  ],
  "next_angles": [
    "Compare semantic novelty, unique-domain novelty, and independent-claim novelty under correlated web syndication; map to runtime/dedup-novelty and runtime/gauges-observability.",
    "Benchmark baseline-first branch admission using weakness signals, false-stop rate, wasted budget, and final evidence availability; map to deep-research, runtime/convergence, and runtime/budget-cost.",
    "Fault-inject hallucinated HyDE or Query2doc entities and measure source anchoring, contradiction rate, rollback, and recovery; map to deep-review, runtime/locks-recovery, and runtime/continuity-threading.",
    "Compare RRF, MMR, Vendi, and adaptive DF-RAG weighting under asynchronous fan-in and evaluator drift; map to runtime/fan-out-fan-in, runtime/convergence, and runtime/gauges-observability."
  ],
  "notes": "Coverage is strong on HyDE, pseudo-document expansion, RRF/MMR/Vendi, and viewpoint memory. The main gap is provenance independence: most systems score embeddings, URLs, chunks, or viewpoints rather than publisher, author, citation, or syndication clusters. Star counts are approximate as of 2026-07-15; texttron/hyde has no releases, and Raudaschl/rag-fusion's exact latest commit date was not exposed."
}
```
hook: Stop
hook: Stop Completed
tokens used
233,740
