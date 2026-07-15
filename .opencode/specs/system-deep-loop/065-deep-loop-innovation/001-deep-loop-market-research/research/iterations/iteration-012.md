<!-- iteration 12 | model luna (gpt-5.6-luna) | angle: LangGraph persistence/checkpointing internals | 2026-07-14T22:15:21.252Z -->

LangGraph’s transferable abstraction is a checkpointed continuation, not a serialized state blob.

- A checkpoint combines channel state, version vectors, parent lineage, metadata, and pending task writes. Recovery distinguishes completed-task writes from control writes that require rerunning work. This maps directly to JSONL receipts, checkpoint commits, and crash recovery. ([checkpoint contract](https://github.com/langchain-ai/langgraph/blob/main/libs/checkpoint/langgraph/checkpoint/base/__init__.py), [execution loop](https://github.com/langchain-ai/langgraph/blob/main/libs/langgraph/langgraph/pregel/_loop.py))
- Fan-in ordering is part of correctness: task paths and pending writes are canonically ordered before reducer application. Arrival order cannot define replay semantics. ([Python write application](https://github.com/langchain-ai/langgraph/blob/main/libs/langgraph/langgraph/pregel/_algo.py), [JS checkpoint base](https://github.com/langchain-ai/langgraphjs/blob/main/libs/checkpoint/src/base.ts))
- Replay and fork differ. Replay re-executes the suffix—including APIs, LLM calls, and interrupts—while fork creates a child checkpoint and preserves the original lineage. ([time travel docs](https://docs.langchain.com/oss/python/langgraph/use-time-travel))
- Interrupts are indexed continuations: the node restarts from its beginning, resume values must match interrupt order, and parallel interrupts need ID-keyed batch responses. Pre-interrupt side effects therefore require idempotency. ([interrupt docs](https://docs.langchain.com/oss/python/langgraph/interrupts), [Agent Protocol streaming schema](https://github.com/langchain-ai/agent-protocol/blob/main/streaming/protocol.cddl))
- Delta checkpoints require periodic full seeds and retained ancestor writes. Compaction that keeps only the head can make replay reconstruct incomplete state. Redis implementations add the related retention lesson: TTL must cover checkpoint, blob, write, and latest-pointer records together. ([delta checkpoint source](https://github.com/langchain-ai/langgraph/blob/main/libs/langgraph/langgraph/pregel/_checkpoint.py), [Redis TTL docs](https://github.com/redis-developer/langgraph-redis/blob/main/docs/concepts/ttl.md))

Four new adjacent repositories were verified: `langgraphjs` (~3.1k stars; release July 2026, commits July 2026), `agent-protocol` (~634; commit June 2026), `deepagents` (~26.2k; release June 2026, commits July 2026), and `langgraph-redis` (~230; release/commit activity June–July 2026).

```json
{
  "new_repos": [
    {
      "name": "langchain-ai/langgraphjs",
      "url": "https://github.com/langchain-ai/langgraphjs",
      "stars": "~3.1k",
      "what": "TypeScript checkpoint base, validation suite, indexed interrupts, and ReplayState; latest visible release July 2026 with commits in July 2026.",
      "lesson": "Use cross-runtime checkpoint conformance tests to define semantic contracts for JSONL adapters rather than copying implementation-specific fields.",
      "maps_to": [
        "runtime/state-jsonl-checkpointing",
        "runtime/continuity-threading",
        "runtime/fan-out-fan-in"
      ],
      "confidence": "high"
    },
    {
      "name": "langchain-ai/agent-protocol",
      "url": "https://github.com/langchain-ai/agent-protocol",
      "stars": "~634",
      "what": "Thread-centric protocol with append-only history, checkpoint envelopes, reconnect sequence numbers, correlated input.respond, and batched interrupt responses; latest observed commit June 2026.",
      "lesson": "Treat the continuity thread as the durable cursor, keep transport sessions ephemeral, and make resume, state update, and routing decisions explicitly correlated and replayable.",
      "maps_to": [
        "runtime/continuity-threading",
        "runtime/gauges-observability",
        "runtime/locks-recovery",
        "runtime/fan-out-fan-in"
      ],
      "confidence": "high"
    },
    {
      "name": "langchain-ai/deepagents",
      "url": "https://github.com/langchain-ai/deepagents",
      "stars": "~26.2k",
      "what": "Higher-level LangGraph harness combining persistence with context offloading, persistent memory, subagents, and approve/edit/reject HITL; latest release June 2026 and commits July 2026.",
      "lesson": "Keep durable execution state separate from large research artifacts and context-management state; HITL policy belongs above the checkpoint primitive.",
      "maps_to": [
        "deep-research",
        "deep-improvement",
        "runtime/state-jsonl-checkpointing",
        "runtime/budget-cost"
      ],
      "confidence": "high"
    },
    {
      "name": "redis-developer/langgraph-redis",
      "url": "https://github.com/redis-developer/langgraph-redis",
      "stars": "~230",
      "what": "RedisJSON/RediSearch checkpointer with separate checkpoint and write indexes, parent links, latest pointers, and relationship-aware TTL; release page shows 0.5.0 in June 2026 with a 0.5.1 release commit in July 2026.",
      "lesson": "Retention and deletion must operate across the entire checkpoint family; expiring a snapshot while retaining writes or pointers creates orphaned continuation state.",
      "maps_to": [
        "runtime/state-jsonl-checkpointing",
        "runtime/budget-cost",
        "runtime/locks-recovery",
        "runtime/continuity-threading"
      ],
      "confidence": "high"
    }
  ],
  "insights": [
    {
      "insight": "A recoverable checkpoint needs both committed state and an execution receipt layer: ordinary completed-task writes may be reapplied, while error, interrupt, resume, and missing-write tasks must be rerun.",
      "evidence": "https://github.com/langchain-ai/langgraph/blob/main/libs/checkpoint/langgraph/checkpoint/base/__init__.py; https://github.com/langchain-ai/langgraph/blob/main/libs/langgraph/langgraph/pregel/_loop.py",
      "maps_to": [
        "runtime/state-jsonl-checkpointing",
        "runtime/locks-recovery",
        "runtime/fan-out-fan-in"
      ],
      "confidence": "high"
    },
    {
      "insight": "Deterministic fan-in must be encoded in replay: sort child task paths and write indices using stable identifiers before applying reducers.",
      "evidence": "https://github.com/langchain-ai/langgraph/blob/main/libs/langgraph/langgraph/pregel/_algo.py; https://github.com/langchain-ai/langgraphjs/blob/main/libs/checkpoint/src/base.ts",
      "maps_to": [
        "runtime/fan-out-fan-in",
        "runtime/state-jsonl-checkpointing",
        "runtime/convergence"
      ],
      "confidence": "high"
    },
    {
      "insight": "Replay and fork require explicit JSONL modes and immutable lineage: replay reruns a checkpoint suffix, while fork creates a new child branch without rewriting the source history.",
      "evidence": "https://docs.langchain.com/oss/python/langgraph/use-time-travel",
      "maps_to": [
        "runtime/state-jsonl-checkpointing",
        "runtime/continuity-threading",
        "runtime/locks-recovery",
        "runtime/dedup-novelty",
        "deep-review"
      ],
      "confidence": "high"
    },
    {
      "insight": "An interrupt is a deterministic continuation record keyed by thread, namespace, task, interrupt ID, and resume position; node restart semantics make pre-interrupt effects require idempotency or separate effect nodes.",
      "evidence": "https://docs.langchain.com/oss/python/langgraph/interrupts; https://github.com/langchain-ai/agent-protocol/blob/main/streaming/protocol.cddl",
      "maps_to": [
        "runtime/continuity-threading",
        "runtime/dedup-novelty",
        "runtime/locks-recovery",
        "runtime/fan-out-fan-in",
        "deep-alignment"
      ],
      "confidence": "high"
    },
    {
      "insight": "Delta storage needs a compaction invariant: retain a full seed snapshot plus every on-path delta or rebase the branch before pruning ancestors.",
      "evidence": "https://github.com/langchain-ai/langgraph/blob/main/libs/langgraph/langgraph/pregel/_checkpoint.py; https://github.com/redis-developer/langgraph-redis/blob/main/docs/concepts/ttl.md",
      "maps_to": [
        "runtime/state-jsonl-checkpointing",
        "runtime/budget-cost",
        "runtime/locks-recovery",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    }
  ],
  "contradictions": [
    {
      "claim": "Checkpointing gives a saved place where execution simply resumes.",
      "counter": "Time-travel replay re-executes the suffix, including external calls and interrupts, so the same checkpoint can produce different outcomes.",
      "evidence": "https://docs.langchain.com/oss/python/langgraph/use-time-travel"
    },
    {
      "claim": "An interrupt resumes exactly at the suspension line.",
      "counter": "LangGraph restarts the entire node; code before the interrupt runs again, so side effects must be idempotent.",
      "evidence": "https://docs.langchain.com/oss/python/langgraph/interrupts"
    },
    {
      "claim": "Resume is only a scalar continuation value.",
      "counter": "Agent Protocol extends correlated input.respond with optional atomic state update and goto routing, creating a wider composite-decision contract.",
      "evidence": "https://github.com/langchain-ai/agent-protocol/blob/main/streaming/protocol.cddl; https://github.com/langchain-ai/agent-protocol/commit/aae0e86f0daecac8867b90f2a68567641926ea3c"
    }
  ],
  "next_angles": [
    "Fault-inject interrupt handling after request persistence, after duplicate human responses, before node re-entry, and during worker takeover; verify exactly-once decisions and idempotent effects.",
    "Benchmark full-snapshot JSONL versus delta-plus-seed compaction under branch replay, pruning, and schema migration.",
    "Compare resume-only versus resume-plus-update-plus-goto under parallel interrupts, late responses, and duplicate fan-in.",
    "Replay old JSONL segments after step-ID, reducer, and loop-policy changes; identify when resume is safe and when the runtime must force a fork.",
    "Test retention policies that expire inactive thread segments while pinning pending approvals and ancestor seeds."
  ],
  "notes": "Primary-source coverage is strong for LangGraph Python and JavaScript semantics. No separate paper focused specifically on LangGraph checkpointer internals was found in this pass. Python and JavaScript source comments expose format-version skew, so system-deep-loop should use an explicit schema version with semantic compatibility tests rather than copying LangGraph version numbers."
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
session id: 019f62ac-23ee-7493-9a49-3807db6389d8
--------
user
You are iteration 12/45 of a NON-CONVERGING (deliberately BROADENING) research loop mapping the state of the art in LOOP ENGINEERING for agentic / iterative AI systems.
The goal is to improve "system-deep-loop": a parent skill that runs iterative deep-research, deep-review, multi-agent deliberation, self-improvement, and alignment loops on top of an externalized-state (JSONL) runtime with convergence math, fan-out/fan-in, dedup/novelty scoring, budget control, and observability gauges.

THIS ITERATION'S ANGLE: LangGraph persistence/checkpointing internals
DIRECTIVE: Deep-dive LangGraph checkpointers, interrupts, human-in-the-loop, time-travel. Map to runtime/state-jsonl-checkpointing, runtime/continuity-threading.

You have live web search ENABLED. Use it to find REAL, currently-existing GitHub repositories, papers, and authoritative docs. For every repo you MUST give its real URL and, where findable, approximate GitHub star count and a recency signal (last release / commit year). Do NOT invent repos, URLs, or numbers — if unsure, mark confidence "low" and say what you could not verify.

BROADEN — do not repeat prior coverage. Here is what has already been gathered:
Repos already catalogued (54) — do NOT re-list these, find NEW ones or go deeper/adjacent:
  Q00/ouroboros, OpenHands/software-agent-sdk, strongdm/attractor, AIDASLab/MATA, egmaminta/GEPA-Lite, google/ax, langchain-ai/langgraph, temporalio/temporal, restatedev/restate, dbos-inc/dbos-transact-py, microsoft/agent-framework, google/adk-python, ray-project/ray, apache/beam, togethercomputer/MoA, UKGovernmentBEIS/inspect_ai, stanfordnlp/dspy, confident-ai/deepteam, ScalerLab/JudgeBench, openai/prm800k, noahshinn/reflexion, madaan/self-refine, ysymyth/ReAct, spcl/graph-of-thoughts, ace-agent/ace, karpathy/llm-council, machine-theory/lm-council, thunlp/ChatEval, S-Abdelnabi/LLM-Deliberation, Henrymachiyu/Multi_Agent_Judge_Bias, mem0ai/mem0, getzep/graphiti, microsoft/graphrag, microsoft/Mnemis, DSAIL-Memory/EvoMemBench, pydantic/pydantic-ai, BerriAI/litellm, GeniusHTX/TALE, sajjadanwar0/token-budgets, microsoft/LLMLingua, eunomia-bpf/agentsight, open-telemetry/semantic-conventions-genai, Arize-ai/openinference, langfuse/langfuse, comet-ml/opik, stanford-oval/storm, langchain-ai/open_deep_research, OpenBMB/UltraRAG, Ayanami0730/arag, sciknoworg/deep-research, inngest/inngest, hatchet-dev/hatchet, dbos-inc/dbos-transact-golang, microsoft/durabletask-go
Angles already covered: Loop control & termination policies | State externalization, checkpointing, resumability | Fan-out / fan-in orchestration | Evaluator / critic / verifier loops | Reflection & self-improvement | Multi-agent deliberation / debate | Dedup, novelty & knowledge accumulation | Budget / cost / depth control | Observability & gauges | Research-loop specific technique | Durable-execution engines for loop resumability
Insights so far: 55; contradictions logged: 33.
Open threads prior iterations flagged: Test coverage-conditioned stopping: stop when high-priority claim slots have independent support, not when the planner stops proposing queries. | Evaluate adaptive retrieval granularity under fixed budgets: search result, page, section, and chunk reads. | Measure temporal source diversity by separating genuinely independent evidence from repeated recrawls of the same evolving source. | runtime/locks-recovery: fault-inject crashes before the effect, after the effect but before the receipt, after the receipt but before acknowledgement, and after worker takeover. | runtime/state-jsonl-checkpointing plus runtime/continuity-threading: replay old JSONL segments after step-ID, schema, and loop-policy changes. | runtime/dedup-novelty: compare 24-hour, run-lifetime, and permanent idempotency retention for duplicate research events and tool calls. | runtime/fan-out-fan-in: test stable child IDs under duplicate dispatch, partial fan-in, late results, and parent recovery. | runtime/budget-cost: measure durable sleeps and memoized LLM results against replay cost, stale evidence risk, and total loop budget.

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
I’m treating this as a research-only iteration: I’ll verify LangGraph’s current persistence/HITL/time-travel contracts from primary docs and source, then widen into adjacent implementations only where they expose a distinct runtime lesson. I’ll avoid the 54 already-catalogued repositories and keep every finding mapped to a listed system-deep-loop target.
web search: 
web search: site:docs.langchain.com/oss/python/langgraph persistence checkpointer interrupts time travel human-in-the-loop ...
web search: 
web search: site:github.com/langchain-ai/langgraph-checkpoint GitHub ...
web search: 
web search: site:github.com/langchain-ai "langgraphjs" "Stars" ...
web search: 
web search: site:github.com/langchain-ai/deepagents GitHub stars latest release ...
web search: 
web search: https://api.github.com/repos/langchain-ai/langgraphjs
mcp: codex_apps/github.get_repo started
mcp: codex_apps/github.get_repo started
mcp: codex_apps/github.get_repo started
mcp: codex_apps/github.get_repo started
mcp: codex_apps/github.get_repo (completed)
mcp: codex_apps/github.get_repo (completed)
mcp: codex_apps/github.get_repo (completed)
mcp: codex_apps/github.get_repo (completed)
web search: 
web search: https://github.com/langchain-ai/langgraphjs
web search: 
web search: 
web search: 
web search: 
mcp: codex_apps/github.search_commits started
mcp: codex_apps/github.search_commits started
mcp: codex_apps/github.search_commits started
mcp: codex_apps/github.search_commits started
mcp: codex_apps/github.search_commits (completed)
mcp: codex_apps/github.search_commits (completed)
mcp: codex_apps/github.search_commits (completed)
mcp: codex_apps/github.search_commits (completed)
codex
The first pass confirms the useful seam: LangGraph’s “checkpoint” is not only a snapshot. It combines versioned channel state, parent lineage, and pending task writes; interrupts then turn a checkpoint into a durable continuation, while time travel creates replay/fork semantics with explicit re-execution risk. I’m checking the implementation paths now so the transfer reflects actual contracts rather than surface-level API descriptions.
mcp: codex_apps/github.fetch_file started
mcp: codex_apps/github.fetch_file started
mcp: codex_apps/github.fetch_file started
mcp: codex_apps/github.fetch_file started
mcp: codex_apps/github.fetch_file started
mcp: codex_apps/github.fetch_file started
mcp: codex_apps/github.fetch_file (completed)
mcp: codex_apps/github.fetch_file (completed)
mcp: codex_apps/github.fetch_file (completed)
mcp: codex_apps/github.fetch_file (completed)
mcp: codex_apps/github.fetch_file (completed)
mcp: codex_apps/github.fetch_file (completed)
mcp: codex_apps/github.search started
mcp: codex_apps/github.search started
mcp: codex_apps/github.search started
mcp: codex_apps/github.search started
mcp: codex_apps/github.search started
mcp: codex_apps/github.search started
mcp: codex_apps/github.search (completed)
mcp: codex_apps/github.search (completed)
mcp: codex_apps/github.search (completed)
mcp: codex_apps/github.search (completed)
mcp: codex_apps/github.search (completed)
mcp: codex_apps/github.search (completed)
mcp: codex_apps/github.fetch_file started
mcp: codex_apps/github.fetch_file (completed)
mcp: codex_apps/github.fetch_file started
mcp: codex_apps/github.fetch_file (completed)
mcp: codex_apps/github.fetch_file started
mcp: codex_apps/github.fetch_file (completed)
mcp: codex_apps/github.fetch_file started
mcp: codex_apps/github.fetch_file (completed)
mcp: codex_apps/github.fetch_file started
mcp: codex_apps/github.fetch_file (completed)
mcp: codex_apps/github.fetch_file started
mcp: codex_apps/github.fetch_file (completed)
mcp: codex_apps/github.fetch_file started
mcp: codex_apps/github.fetch_file (completed)
mcp: codex_apps/github.fetch_file started
mcp: codex_apps/github.fetch_file (completed)
mcp: codex_apps/github.fetch_file started
mcp: codex_apps/github.fetch_file (completed)
mcp: codex_apps/github.fetch_file started
mcp: codex_apps/github.fetch_file (completed)
mcp: codex_apps/github.fetch_file started
mcp: codex_apps/github.fetch_file (completed)
mcp: codex_apps/github.fetch_file started
mcp: codex_apps/github.fetch_file (completed)
mcp: codex_apps/github.fetch_file started
mcp: codex_apps/github.fetch_file (completed)
mcp: codex_apps/github.fetch_file started
mcp: codex_apps/github.fetch_file (completed)
mcp: codex_apps/github.fetch_file started
mcp: codex_apps/github.fetch_file (completed)
mcp: codex_apps/github.fetch_file started
mcp: codex_apps/github.fetch_file (completed)
mcp: codex_apps/github.fetch_file started
mcp: codex_apps/github.fetch_file (completed)
mcp: codex_apps/github.fetch_file started
mcp: codex_apps/github.fetch_file (completed)
mcp: codex_apps/github.fetch_file started
mcp: codex_apps/github.fetch_file (completed)
mcp: codex_apps/github.fetch_file started
mcp: codex_apps/github.fetch_file (completed)
mcp: codex_apps/github.fetch_file started
mcp: codex_apps/github.fetch_file (completed)
mcp: codex_apps/github.fetch_file started
mcp: codex_apps/github.fetch_file (completed)
mcp: codex_apps/github.fetch_file started
mcp: codex_apps/github.fetch_file (completed)
mcp: codex_apps/github.fetch_file started
mcp: codex_apps/github.fetch_file (completed)
mcp: codex_apps/github.fetch_file started
mcp: codex_apps/github.fetch_file (completed)
mcp: codex_apps/github.fetch_file started
mcp: codex_apps/github.fetch_file (completed)
mcp: codex_apps/github.fetch_file started
mcp: codex_apps/github.fetch_file (completed)
mcp: codex_apps/github.fetch_file started
mcp: codex_apps/github.fetch_file (completed)
mcp: codex_apps/github.fetch_file started
mcp: codex_apps/github.fetch_file (completed)
mcp: codex_apps/github.fetch_file started
mcp: codex_apps/github.fetch_file (completed)
mcp: codex_apps/github.fetch_file started
mcp: codex_apps/github.fetch_file (completed)
mcp: codex_apps/github.fetch_file started
mcp: codex_apps/github.fetch_file (completed)
mcp: codex_apps/github.fetch_file started
mcp: codex_apps/github.fetch_file (completed)
mcp: codex_apps/github.fetch_file started
mcp: codex_apps/github.fetch_file (completed)
mcp: codex_apps/github.fetch_file started
mcp: codex_apps/github.fetch_file (completed)
mcp: codex_apps/github.fetch_file started
mcp: codex_apps/github.fetch_file (completed)
mcp: codex_apps/github.fetch_file started
mcp: codex_apps/github.fetch_file (completed)
web search: 
web search: 
web search: 
web search: 
web search: 
web search: 
mcp: codex_apps/github.fetch_file started
mcp: codex_apps/github.fetch_file (completed)
mcp: codex_apps/github.fetch_file started
mcp: codex_apps/github.fetch_file (completed)
mcp: codex_apps/github.fetch_file started
mcp: codex_apps/github.fetch_file (completed)
mcp: codex_apps/github.search started
mcp: codex_apps/github.search (completed)
mcp: codex_apps/github.fetch_file started
mcp: codex_apps/github.fetch_file (completed)
mcp: codex_apps/github.search started
mcp: codex_apps/github.search started
mcp: codex_apps/github.search started
mcp: codex_apps/github.search started
mcp: codex_apps/github.search started
mcp: codex_apps/github.search (completed)
mcp: codex_apps/github.search (completed)
mcp: codex_apps/github.search (completed)
mcp: codex_apps/github.search (completed)
mcp: codex_apps/github.search (completed)
mcp: codex_apps/github.fetch_file started
mcp: codex_apps/github.fetch_file (completed)
mcp: codex_apps/github.fetch_file started
mcp: codex_apps/github.fetch_file (completed)
mcp: codex_apps/github.fetch_file started
mcp: codex_apps/github.fetch_file (completed)
mcp: codex_apps/github.fetch_file started
mcp: codex_apps/github.fetch_file (completed)
mcp: codex_apps/github.fetch_file started
mcp: codex_apps/github.fetch_file (completed)
mcp: codex_apps/github.fetch_file started
mcp: codex_apps/github.fetch_file (completed)
mcp: codex_apps/github.search started
mcp: codex_apps/github.search (completed)
mcp: codex_apps/github.fetch_file started
mcp: codex_apps/github.fetch_file (completed)
mcp: codex_apps/github.search started
mcp: codex_apps/github.search started
mcp: codex_apps/github.search started
mcp: codex_apps/github.search started
mcp: codex_apps/github.search started
mcp: codex_apps/github.search started
mcp: codex_apps/github.search (completed)
mcp: codex_apps/github.search (completed)
mcp: codex_apps/github.search (completed)
mcp: codex_apps/github.search (completed)
mcp: codex_apps/github.search (completed)
mcp: codex_apps/github.search (completed)
mcp: codex_apps/github.fetch_file started
mcp: codex_apps/github.fetch_file (completed)
mcp: codex_apps/github.fetch_file started
mcp: codex_apps/github.fetch_file (completed)
mcp: codex_apps/github.fetch_file started
mcp: codex_apps/github.fetch_file (completed)
mcp: codex_apps/github.fetch_file started
mcp: codex_apps/github.fetch_file (completed)
mcp: codex_apps/github.fetch_file started
mcp: codex_apps/github.fetch_file (completed)
context compacted
codex
LangGraph’s transferable abstraction is a checkpointed continuation, not a serialized state blob.

- A checkpoint combines channel state, version vectors, parent lineage, metadata, and pending task writes. Recovery distinguishes completed-task writes from control writes that require rerunning work. This maps directly to JSONL receipts, checkpoint commits, and crash recovery. ([checkpoint contract](https://github.com/langchain-ai/langgraph/blob/main/libs/checkpoint/langgraph/checkpoint/base/__init__.py), [execution loop](https://github.com/langchain-ai/langgraph/blob/main/libs/langgraph/langgraph/pregel/_loop.py))
- Fan-in ordering is part of correctness: task paths and pending writes are canonically ordered before reducer application. Arrival order cannot define replay semantics. ([Python write application](https://github.com/langchain-ai/langgraph/blob/main/libs/langgraph/langgraph/pregel/_algo.py), [JS checkpoint base](https://github.com/langchain-ai/langgraphjs/blob/main/libs/checkpoint/src/base.ts))
- Replay and fork differ. Replay re-executes the suffix—including APIs, LLM calls, and interrupts—while fork creates a child checkpoint and preserves the original lineage. ([time travel docs](https://docs.langchain.com/oss/python/langgraph/use-time-travel))
- Interrupts are indexed continuations: the node restarts from its beginning, resume values must match interrupt order, and parallel interrupts need ID-keyed batch responses. Pre-interrupt side effects therefore require idempotency. ([interrupt docs](https://docs.langchain.com/oss/python/langgraph/interrupts), [Agent Protocol streaming schema](https://github.com/langchain-ai/agent-protocol/blob/main/streaming/protocol.cddl))
- Delta checkpoints require periodic full seeds and retained ancestor writes. Compaction that keeps only the head can make replay reconstruct incomplete state. Redis implementations add the related retention lesson: TTL must cover checkpoint, blob, write, and latest-pointer records together. ([delta checkpoint source](https://github.com/langchain-ai/langgraph/blob/main/libs/langgraph/langgraph/pregel/_checkpoint.py), [Redis TTL docs](https://github.com/redis-developer/langgraph-redis/blob/main/docs/concepts/ttl.md))

Four new adjacent repositories were verified: `langgraphjs` (~3.1k stars; release July 2026, commits July 2026), `agent-protocol` (~634; commit June 2026), `deepagents` (~26.2k; release June 2026, commits July 2026), and `langgraph-redis` (~230; release/commit activity June–July 2026).

```json
{
  "new_repos": [
    {
      "name": "langchain-ai/langgraphjs",
      "url": "https://github.com/langchain-ai/langgraphjs",
      "stars": "~3.1k",
      "what": "TypeScript checkpoint base, validation suite, indexed interrupts, and ReplayState; latest visible release July 2026 with commits in July 2026.",
      "lesson": "Use cross-runtime checkpoint conformance tests to define semantic contracts for JSONL adapters rather than copying implementation-specific fields.",
      "maps_to": [
        "runtime/state-jsonl-checkpointing",
        "runtime/continuity-threading",
        "runtime/fan-out-fan-in"
      ],
      "confidence": "high"
    },
    {
      "name": "langchain-ai/agent-protocol",
      "url": "https://github.com/langchain-ai/agent-protocol",
      "stars": "~634",
      "what": "Thread-centric protocol with append-only history, checkpoint envelopes, reconnect sequence numbers, correlated input.respond, and batched interrupt responses; latest observed commit June 2026.",
      "lesson": "Treat the continuity thread as the durable cursor, keep transport sessions ephemeral, and make resume, state update, and routing decisions explicitly correlated and replayable.",
      "maps_to": [
        "runtime/continuity-threading",
        "runtime/gauges-observability",
        "runtime/locks-recovery",
        "runtime/fan-out-fan-in"
      ],
      "confidence": "high"
    },
    {
      "name": "langchain-ai/deepagents",
      "url": "https://github.com/langchain-ai/deepagents",
      "stars": "~26.2k",
      "what": "Higher-level LangGraph harness combining persistence with context offloading, persistent memory, subagents, and approve/edit/reject HITL; latest release June 2026 and commits July 2026.",
      "lesson": "Keep durable execution state separate from large research artifacts and context-management state; HITL policy belongs above the checkpoint primitive.",
      "maps_to": [
        "deep-research",
        "deep-improvement",
        "runtime/state-jsonl-checkpointing",
        "runtime/budget-cost"
      ],
      "confidence": "high"
    },
    {
      "name": "redis-developer/langgraph-redis",
      "url": "https://github.com/redis-developer/langgraph-redis",
      "stars": "~230",
      "what": "RedisJSON/RediSearch checkpointer with separate checkpoint and write indexes, parent links, latest pointers, and relationship-aware TTL; release page shows 0.5.0 in June 2026 with a 0.5.1 release commit in July 2026.",
      "lesson": "Retention and deletion must operate across the entire checkpoint family; expiring a snapshot while retaining writes or pointers creates orphaned continuation state.",
      "maps_to": [
        "runtime/state-jsonl-checkpointing",
        "runtime/budget-cost",
        "runtime/locks-recovery",
        "runtime/continuity-threading"
      ],
      "confidence": "high"
    }
  ],
  "insights": [
    {
      "insight": "A recoverable checkpoint needs both committed state and an execution receipt layer: ordinary completed-task writes may be reapplied, while error, interrupt, resume, and missing-write tasks must be rerun.",
      "evidence": "https://github.com/langchain-ai/langgraph/blob/main/libs/checkpoint/langgraph/checkpoint/base/__init__.py; https://github.com/langchain-ai/langgraph/blob/main/libs/langgraph/langgraph/pregel/_loop.py",
      "maps_to": [
        "runtime/state-jsonl-checkpointing",
        "runtime/locks-recovery",
        "runtime/fan-out-fan-in"
      ],
      "confidence": "high"
    },
    {
      "insight": "Deterministic fan-in must be encoded in replay: sort child task paths and write indices using stable identifiers before applying reducers.",
      "evidence": "https://github.com/langchain-ai/langgraph/blob/main/libs/langgraph/langgraph/pregel/_algo.py; https://github.com/langchain-ai/langgraphjs/blob/main/libs/checkpoint/src/base.ts",
      "maps_to": [
        "runtime/fan-out-fan-in",
        "runtime/state-jsonl-checkpointing",
        "runtime/convergence"
      ],
      "confidence": "high"
    },
    {
      "insight": "Replay and fork require explicit JSONL modes and immutable lineage: replay reruns a checkpoint suffix, while fork creates a new child branch without rewriting the source history.",
      "evidence": "https://docs.langchain.com/oss/python/langgraph/use-time-travel",
      "maps_to": [
        "runtime/state-jsonl-checkpointing",
        "runtime/continuity-threading",
        "runtime/locks-recovery",
        "runtime/dedup-novelty",
        "deep-review"
      ],
      "confidence": "high"
    },
    {
      "insight": "An interrupt is a deterministic continuation record keyed by thread, namespace, task, interrupt ID, and resume position; node restart semantics make pre-interrupt effects require idempotency or separate effect nodes.",
      "evidence": "https://docs.langchain.com/oss/python/langgraph/interrupts; https://github.com/langchain-ai/agent-protocol/blob/main/streaming/protocol.cddl",
      "maps_to": [
        "runtime/continuity-threading",
        "runtime/dedup-novelty",
        "runtime/locks-recovery",
        "runtime/fan-out-fan-in",
        "deep-alignment"
      ],
      "confidence": "high"
    },
    {
      "insight": "Delta storage needs a compaction invariant: retain a full seed snapshot plus every on-path delta or rebase the branch before pruning ancestors.",
      "evidence": "https://github.com/langchain-ai/langgraph/blob/main/libs/langgraph/langgraph/pregel/_checkpoint.py; https://github.com/redis-developer/langgraph-redis/blob/main/docs/concepts/ttl.md",
      "maps_to": [
        "runtime/state-jsonl-checkpointing",
        "runtime/budget-cost",
        "runtime/locks-recovery",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    }
  ],
  "contradictions": [
    {
      "claim": "Checkpointing gives a saved place where execution simply resumes.",
      "counter": "Time-travel replay re-executes the suffix, including external calls and interrupts, so the same checkpoint can produce different outcomes.",
      "evidence": "https://docs.langchain.com/oss/python/langgraph/use-time-travel"
    },
    {
      "claim": "An interrupt resumes exactly at the suspension line.",
      "counter": "LangGraph restarts the entire node; code before the interrupt runs again, so side effects must be idempotent.",
      "evidence": "https://docs.langchain.com/oss/python/langgraph/interrupts"
    },
    {
      "claim": "Resume is only a scalar continuation value.",
      "counter": "Agent Protocol extends correlated input.respond with optional atomic state update and goto routing, creating a wider composite-decision contract.",
      "evidence": "https://github.com/langchain-ai/agent-protocol/blob/main/streaming/protocol.cddl; https://github.com/langchain-ai/agent-protocol/commit/aae0e86f0daecac8867b90f2a68567641926ea3c"
    }
  ],
  "next_angles": [
    "Fault-inject interrupt handling after request persistence, after duplicate human responses, before node re-entry, and during worker takeover; verify exactly-once decisions and idempotent effects.",
    "Benchmark full-snapshot JSONL versus delta-plus-seed compaction under branch replay, pruning, and schema migration.",
    "Compare resume-only versus resume-plus-update-plus-goto under parallel interrupts, late responses, and duplicate fan-in.",
    "Replay old JSONL segments after step-ID, reducer, and loop-policy changes; identify when resume is safe and when the runtime must force a fork.",
    "Test retention policies that expire inactive thread segments while pinning pending approvals and ancestor seeds."
  ],
  "notes": "Primary-source coverage is strong for LangGraph Python and JavaScript semantics. No separate paper focused specifically on LangGraph checkpointer internals was found in this pass. Python and JavaScript source comments expose format-version skew, so system-deep-loop should use an explicit schema version with semantic compatibility tests rather than copying LangGraph version numbers."
}
```
hook: Stop
hook: Stop Completed
tokens used
414,723
