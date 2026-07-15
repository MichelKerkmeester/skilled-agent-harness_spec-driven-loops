# Synthesis Digest (authoring aid)

Totals: 216 repos, 222 insights, 134 contradictions.


## A. CORE CATALOGUE CANDIDATES (top 5 per primary subsystem)


### runtime/convergence  (21 primary)
- **huggingface/smolagents** (~28.3k, high) — Compact ReAct/code-agent library; latest release v1.26.0 on May 29, 2026.
  - lesson: Expose step callbacks, planning checkpoints, replayable memory, and final-answer validators as stable loop-control hooks.
  - url: https://github.com/huggingface/smolagents  | maps: runtime/convergence, runtime/gauges-observability, deep-review
- **optuna/optuna** (~14.5k, high) — Mature pruning framework with median, percentile, successive-halving, Hyperband, threshold, and patient pruners; recency: v4.9.0 released Jun 2026.
  - lesson: Use warm-up and comparable-depth sample requirements before pruning; treat bracket-level pruning as different from study-level termination.
  - url: https://github.com/optuna/optuna  | maps: runtime/convergence, runtime/fan-out-fan-in, runtime/budget-cost
- **kubernetes-sigs/controller-runtime** (~2.9k, high) — The canonical Kubernetes Reconcile() control-loop library behind every operator; observe→delta→act→requeue-with-backoff, idempotent by contract.
  - lesson: Model a deep-loop iteration body as a reconciler over an externalized desired-state spec so any crash resumes by re-running Reconcile against last persisted state instead of replaying events; requeue-after is the loop-cadence knob.
  - url: https://github.com/kubernetes-sigs/controller-runtime  | maps: runtime/convergence, runtime/locks-recovery, runtime/state-jsonl-checkpointing
- **google/vizier** (~1.7k, high) — Distributed black-box optimization with an explicit early-stop policy API; recency: latest release v0.1.24 in Feb 2025, 1,236 commits, exact latest commit year not surfaced.
  - lesson: Separate global incumbent-vs-history pruning from local trajectory stopping and reconstruct policy state from persisted trial history.
  - url: https://github.com/google/vizier  | maps: runtime/convergence, runtime/fan-out-fan-in, runtime/state-jsonl-checkpointing
- **strongdm/attractor** (~1.2k (GitHub snapshot), high) — Language-agnostic coding-agent loop specification; no releases, with the latest visible commit on 2026-03-17.
  - lesson: Make loop detection an observable control event that can steer the next turn, while retaining independent round, turn, and abort bounds.
  - url: https://github.com/strongdm/attractor  | maps: runtime/convergence, runtime/gauges-observability, runtime/locks-recovery, runtime/state-jsonl-checkpointing, deep-review

### runtime/state-jsonl-checkpointing  (30 primary)
- **langchain-ai/langgraph** (~37.3k, high) — Stateful graph runtime for long-running agents; latest release 1.2.9 on July 10, 2026.
  - lesson: Parent-linked checkpoints and pending writes preserve completed parallel work, but post-checkpoint LLM and API calls replay; side effects need idempotent tasks or receipts.
  - url: https://github.com/langchain-ai/langgraph  | maps: runtime/state-jsonl-checkpointing, runtime/fan-out-fan-in, runtime/dedup-novelty, deep-ai-council
- **apache/kafka** (~33.2k, high) — Kafka Streams: local state stores (RocksDB) backed by changelog topics for automatic recovery; exactly-once via transactional consume-produce-commit in one transaction
  - lesson: State-write + output-emission + checkpoint-advance must be one atomic transaction (all-or-nothing) or retry causes double-processing — the dual hot-store + changelog model with transactional commit
  - url: https://github.com/apache/kafka  | maps: runtime/state-jsonl-checkpointing, runtime/locks-recovery
- **openai/openai-agents-python** (~27.9k, high) — Approval-aware multi-agent SDK; latest release v0.18.2 on 2026-07-11.
  - lesson: Persist pending decisions, nested-agent identity, usage, and context merge semantics, then resume from the same agent graph.
  - url: https://github.com/openai/openai-agents-python  | maps: runtime/state-jsonl-checkpointing, runtime/continuity-threading, deep-alignment, runtime/budget-cost
- **mastra-ai/mastra** (~26.2k, high) — TypeScript agent and workflow framework; release feed current through July 8, 2026.
  - lesson: Parallel resume must merge branch-local snapshots without clearing sibling suspension payloads or retry budgets.
  - url: https://github.com/mastra-ai/mastra  | maps: runtime/state-jsonl-checkpointing, runtime/fan-out-fan-in, runtime/locks-recovery
- **apache/flink** (~26.2k, high) — Stream processor with Chandy-Lamport async barrier snapshotting (consistent distributed snapshots without stop-the-world), iterate operator for bounded-stream loops, pluggable state backends
  - lesson: Checkpoint-barrier injection is the formal mechanism for consistent-cut snapshots across concurrent fan-out workers — but its coordination cost is only net-positive at high partition counts
  - url: https://github.com/apache/flink  | maps: runtime/state-jsonl-checkpointing, runtime/fan-out-fan-in, runtime/convergence

### runtime/fan-out-fan-in  (27 primary)
- **langchain-ai/langchain** (~140k, high) — Classic map/reduce document chains support recursive collapse, token_max, and collapse retry limits; langchain-core 1.4.9 released Jul 8, 2026.
  - lesson: Use a bounded reduction tree: collapse intermediate branch summaries until they fit the final reducer budget, checkpointing each collapse level and preserving provenance.
  - url: https://github.com/langchain-ai/langchain  | maps: runtime/fan-out-fan-in, runtime/budget-cost, runtime/state-jsonl-checkpointing, deep-research
- **apache/spark** (~43.6k, high) — Large-scale data engine with explicit DETERMINATE, UNORDERED, and INDETERMINATE replay classes; Spark 4.1.2 released May 2026.
  - lesson: Attach a determinism class to every fan-out stage and compare ordered versus multiset digests according to that contract.
  - url: https://github.com/apache/spark  | maps: runtime/fan-out-fan-in, runtime/state-jsonl-checkpointing, runtime/gauges-observability
- **ray-project/ray** (~43.2k, high) — Distributed AI/Python runtime with tasks, actors, objects, and MapReduce; latest release Ray-2.56.0 (2026-06-29).
  - lesson: Bound in-flight fan-out, process ready results incrementally, and distinguish crash retries from application failures.
  - url: https://github.com/ray-project/ray  | maps: runtime/fan-out-fan-in, runtime/locks-recovery, runtime/budget-cost, runtime/gauges-observability
- **agentscope-ai/agentscope** (~27k, high) — MsgHub plus sequential and fanout pipelines; v2.0.4 released Jul 7, 2026.
  - lesson: Keep fan-out transport separate from reduction: return branch envelopes first, then apply an explicit reducer or synthesis node with deterministic ordering policy.
  - url: https://github.com/agentscope-ai/agentscope  | maps: runtime/fan-out-fan-in, runtime/gauges-observability, runtime/budget-cost
- **verl-project/verl** (~22.5k, high) — HybridFlow RL library with experimental fully_async_policy, one_step_off_policy, and transfer_queue modules for bounded-staleness async RL
  - lesson: Async fan-out needs an explicit staleness bound (one-step window) plus a transfer queue that buffers and orders stale samples before merge
  - url: https://github.com/verl-project/verl  | maps: runtime/fan-out-fan-in, runtime/locks-recovery, runtime/state-jsonl-checkpointing

### runtime/dedup-novelty  (18 primary)
- **mem0ai/mem0** (~60.8k, high) — Add-only memory extraction with entity linking, hybrid retrieval, and temporal ranking; GitHub latest release listed as v0.2.11 on Jul 13, 2026.
  - lesson: Separate append-only evidence accumulation from later conflict and validity resolution.
  - url: https://github.com/mem0ai/mem0  | maps: runtime/dedup-novelty, runtime/continuity-threading, runtime/budget-cost
- **microsoft/graphrag** (~34.4k, high) — Leiden community hierarchy with multi-level reports and local, global, and DRIFT search; v3.1.0 released May 28, 2026.
  - lesson: Track coverage at semantic-community level and broaden toward underrepresented communities instead of flat top-k retrieval.
  - url: https://github.com/microsoft/graphrag  | maps: runtime/dedup-novelty, deep-research, runtime/fan-out-fan-in, runtime/budget-cost
- **dgtlmoon/changedetection.io** (~32.3k, high) — Poll→diff→alert loop with LLM change-summarization that suppresses irrelevant diffs via plain-English intent rules.
  - lesson: Observe→diff-vs-baseline→signal is a loop reduced to its essence; LLM-based intent filtering ('only signal when X') is a concrete instance of novelty metrics driving loop gating and reducing false-positive iterations.
  - url: https://github.com/dgtlmoon/changedetection.io  | maps: runtime/dedup-novelty, runtime/gauges-observability, runtime/convergence
- **getzep/graphiti** (~28.7k, high) — Temporal context graph with validity windows, episode provenance, incremental updates, and hybrid retrieval; v0.29.2 released Jun 8, 2026.
  - lesson: Treat contradiction and supersession as versioned knowledge events, not destructive deduplication.
  - url: https://github.com/getzep/graphiti  | maps: runtime/dedup-novelty, runtime/state-jsonl-checkpointing, runtime/continuity-threading
- **PrefectHQ/prefect** (~23.4k, high) — Python workflow engine whose cache isolation documents concurrent same-key execution under READ_COMMITTED; release 3.7.8 in July 2026.
  - lesson: A matching cache key is not mutual exclusion; novelty reuse needs a serialized claim or atomic compare-and-set.
  - url: https://github.com/PrefectHQ/prefect  | maps: runtime/dedup-novelty, runtime/locks-recovery, runtime/budget-cost

### runtime/budget-cost  (15 primary)
- **BerriAI/litellm** (~53.6k, high) — Latest release v1.92.0 on 2026-07-12; gateway supports multi-window spend limits, agent max_iterations, max_budget_per_session, and budget fallbacks.
  - lesson: Centralize pre-call enforcement, rolling budget windows, model-specific ceilings, and cheaper fallback routing outside individual loop implementations.
  - url: https://github.com/BerriAI/litellm  | maps: runtime/budget-cost, runtime/gauges-observability, runtime/locks-recovery
- **SWE-agent/SWE-agent** (~19.8k, high) — ACI-based GitHub-issue coding agent; latest release v1.1.0 on May 22, 2025, with activity through July 2026.
  - lesson: Separate parser requery, full-attempt retry, reviewer selection, and total-cost termination into explicit retry scopes.
  - url: https://github.com/SWE-agent/SWE-agent  | maps: runtime/budget-cost, runtime/convergence, runtime/state-jsonl-checkpointing
- **pydantic/pydantic-ai** (~18.5k, high) — Latest release v2.9.1 on 2026-07-13; UsageLimits covers requests, input/output/total tokens, and tool calls, with per-delegation sub-agent budgets.
  - lesson: Make budgets hierarchical and typed by resource, with explicit soft-versus-hard exhaustion and parent-child aggregation semantics.
  - url: https://github.com/pydantic/pydantic-ai  | maps: runtime/budget-cost, runtime/fan-out-fan-in, runtime/gauges-observability
- **simplescaling/s1** (~6.7k; latest commit Jun 2025, high) — 2025 test-time scaling code implementing budget forcing by truncating reasoning or appending continuation prompts.
  - lesson: Represent budget exhaustion as an explicit stop, summarize, or continue state transition rather than an opaque kill.
  - url: https://github.com/simplescaling/s1  | maps: runtime/budget-cost, runtime/convergence, runtime/state-jsonl-checkpointing, deep-improvement
- **microsoft/LLMLingua** (~6.4k, high) — Latest release v0.2.2 in 2024; latest visible commit is 2025-10-28; prompt and KV-cache compression supports target-token and structured-context budgets.
  - lesson: Charge repeated state, tool output, and replay context as real cost, then compress selectively while preserving high-priority evidence and reporting quality loss.
  - url: https://github.com/microsoft/LLMLingua  | maps: runtime/budget-cost, runtime/state-jsonl-checkpointing, runtime/gauges-observability

### runtime/gauges-observability  (6 primary)
- **langfuse/langfuse** (~31.1k, high) — Trace/observation/session hierarchy, scores, dataset runs, metrics, and dashboards; v3.213.0 released Jul 14 2026.
  - lesson: Keep execution records immutable and attach evaluator judgments later by trace, observation, session, or run; aggregate by release and version.
  - url: https://github.com/langfuse/langfuse  | maps: runtime/gauges-observability, runtime/continuity-threading, deep-research
- **comet-ml/opik** (~20.6k, high) — Open-source tracing, online evaluation, experiment comparison, and production dashboards; v2.1.27 released Jul 14 2026.
  - lesson: Expose run health, experiment deltas, cost/latency, and quality time series together instead of treating final score as convergence evidence.
  - url: https://github.com/comet-ml/opik  | maps: runtime/gauges-observability, runtime/convergence, deep-improvement
- **risingwavelabs/risingwave** (~9.2k, high) — Streaming DB repositioned for agentic AI: incremental materialized views (only affected results recomputed on change, <100ms freshness), state in cheap object storage, provides MCP server
  - lesson: Define each gauge/novelty-set as an incremental stream-fold (O(delta) not O(total)) so observability cost is scale-independent of iteration count
  - url: https://github.com/risingwavelabs/risingwave  | maps: runtime/gauges-observability, runtime/convergence, runtime/dedup-novelty
- **Arize-ai/openinference** (~1.1k, high) — OpenTelemetry-compatible AI tracing with typed span kinds, masking, and multi-language instrumentation; latest package release Jul 1 2026.
  - lesson: Use typed operation kinds and lineage IDs, while recording model/tool configuration and redacted payload identity for replay and attribution.
  - url: https://github.com/Arize-ai/openinference  | maps: runtime/gauges-observability, runtime/state-jsonl-checkpointing, runtime/continuity-threading
- **eunomia-bpf/agentsight** (~294, high) — eBPF boundary tracing for LLM intent, process/file effects, and live timelines; v0.1.36 released Apr 2026.
  - lesson: Add semantic and side-effect telemetry planes so gauges distinguish productive progress from activity, retries, or hidden subprocess work.
  - url: https://github.com/eunomia-bpf/agentsight  | maps: runtime/gauges-observability, runtime/state-jsonl-checkpointing

### runtime/locks-recovery  (7 primary)
- **apache/airflow** (~46100, high) — The canonical DAG scheduler; Pools (named semaphores), SensorOperators, backfills over (task,partition) grids, max_retries default of 3.
  - lesson: Backfill = idempotent per-partition recovery (not monolithic replay); Pools = named per-resource concurrency gating; sensors must release their slot (reschedule mode) or the pool deadlocks.
  - url: https://github.com/apache/airflow  | maps: runtime/locks-recovery, runtime/fan-out-fan-in, runtime/budget-cost
- **conductor-oss/conductor** (~32k, high) — Durable agentic workflow engine; latest release June 25, 2026.
  - lesson: Separate restart, rerun-from-task, retry-from-failure, and compensation workflows instead of using one generic resume operation.
  - url: https://github.com/conductor-oss/conductor  | maps: runtime/locks-recovery, runtime/continuity-threading, runtime/state-jsonl-checkpointing
- **argoproj/argo-workflows** (~16.8k, high) — Kubernetes workflow engine; latest release July 7, 2026.
  - lesson: Retry decisions should be conditional on failure metadata, while locks require shared storage, namespaces, queues, and multi-controller recovery.
  - url: https://github.com/argoproj/argo-workflows  | maps: runtime/locks-recovery, runtime/fan-out-fan-in, runtime/gauges-observability
- **dagster-io/dagster** (~15800, high) — Asset-centric orchestration; partition-based backfills as a first-class primitive, sensors, and per-task concurrency keys.
  - lesson: Partition-keyed backfill over software-defined assets is the cleanest 'recover only the stale slice' model; concurrency keys generalize pools to per-resource semaphores.
  - url: https://github.com/dagster-io/dagster  | maps: runtime/locks-recovery, runtime/fan-out-fan-in, runtime/state-jsonl-checkpointing
- **hazelcast/hazelcast** (~6.6k, high) — Distributed data platform with CP FencedLock; v5.7.0 released 2026-05-13.
  - lesson: A lease must yield a monotonic fencing epoch that every state sink and effect broker validates; the lock service alone cannot stop a paused stale worker.
  - url: https://github.com/hazelcast/hazelcast  | maps: runtime/locks-recovery, runtime/state-jsonl-checkpointing, runtime/fan-out-fan-in

### runtime/continuity-threading  (8 primary)
- **HKUDS/LightRAG** (~37.7k, high) — GraphRAG alt (EMNLP'25) with dual-layer KG+vector; incremental KB via local-graph set-merge, no global rebuild
  - lesson: Accumulate per-iteration deltas by local-build-then-set-merge keyed on content, not global re-derivation; add a 'rich-enough' saturation gate that stops enriching a node
  - url: https://github.com/HKUDS/LightRAG  | maps: runtime/continuity-threading, runtime/budget-cost, runtime/dedup-novelty
- **ag-ui-protocol/ag-ui** (~14.7k, high) — Event-based agent-user interaction protocol; latest release listed as 2026-07-03.
  - lesson: Make pause, approve, edit, retry, escalate, cancel, and steering typed events with event-sourced state diffs and conflict resolution.
  - url: https://github.com/ag-ui-protocol/ag-ui  | maps: runtime/continuity-threading, runtime/state-jsonl-checkpointing, runtime/gauges-observability, deep-research, deep-review
- **MemTensor/MemOS** (~10.2k, high) — Memory OS with graph-inspectable MemCubes, asynchronous ingestion, multi-cube sharing, and feedback correction; v2.0.23 released 2026-07-09.
  - lesson: Represent each memory as a versioned, provenance-bearing object with explicit lifecycle states and auditable correction operations.
  - url: https://github.com/MemTensor/MemOS  | maps: runtime/continuity-threading, runtime/state-jsonl-checkpointing, runtime/dedup-novelty, runtime/budget-cost
- **cloudflare/agents** (~5.3k, high) — Durable-Object agent/workflow runtime; latest listed release @cloudflare/think@0.13.0 on 2026-07-13.
  - lesson: Represent approval as a durable external wait with actor identity, progress, timeout, escalation, and multi-approver quorum.
  - url: https://github.com/cloudflare/agents  | maps: runtime/continuity-threading, runtime/locks-recovery, runtime/budget-cost, runtime/gauges-observability, deep-alignment
- **OSU-NLP-Group/HippoRAG** (~3.9k, high) — NeurIPS'24 + ICML'25 'From RAG to Memory'; personalized PageRank + continual knowledge integration across documents
  - lesson: Frame cross-iteration accumulation as memory consolidation (continuous integration), and that cheaper indexing can beat heavier GraphRAG on continual-learning — budget and quality are not opposed when the consolidation mechanism is right
  - url: https://github.com/OSU-NLP-Group/HippoRAG  | maps: runtime/continuity-threading, runtime/budget-cost, deep-research

### deep-research  (23 primary)
- **microsoft/autogen** (~59.7k; latest python-v0.7.5 released Sep 30, 2025; maintenance mode, high) — Layered agent framework with AgentChat teams, SelectorGroupChat, Swarm, GraphFlow, and Magentic-One.
  - lesson: Separate adaptive conversation scheduling from deterministic graph execution, and model termination as a composable policy.
  - url: https://github.com/microsoft/autogen  | maps: deep-research, deep-ai-council, runtime/convergence, runtime/fan-out-fan-in, runtime/budget-cost
- **crewAIInc/crewAI** (~55.5k; latest 1.15.2 released Jul 8, 2026, high) — Role-based crews with sequential or hierarchical manager processes, collaboration tools, Flows, and task guardrails.
  - lesson: Use a manager/control plane for planning and delegation while keeping worker retries and validation local to each task.
  - url: https://github.com/crewAIInc/crewAI  | maps: deep-research, deep-ai-council, deep-review, deep-improvement, runtime/budget-cost
- **run-llama/llama_index** (~50.8k, high) — Agentic data framework with query transformations and fusion retrievers; v0.14.23 released 2026-06-24.
  - lesson: Make RRF a pluggable fan-in stage while retaining per-query and per-index provenance for audit.
  - url: https://github.com/run-llama/llama_index  | maps: deep-research, runtime/fan-out-fan-in, runtime/dedup-novelty, runtime/gauges-observability
- **stanford-oval/storm** (~30k, high) — Perspective-guided question asking plus simulated writer-expert conversations; latest release Jan 2025 and latest commit Sep 2025.
  - lesson: Seed query families from distinct perspectives, then use grounded follow-ups to expand coverage before synthesis.
  - url: https://github.com/stanford-oval/storm  | maps: deep-research, runtime/dedup-novelty, runtime/gauges-observability
- **langchain-ai/deepagents** (~26.2k, high) — Higher-level LangGraph harness combining persistence with context offloading, persistent memory, subagents, and approve/edit/reject HITL; latest release June 2026 and commits July 2026.
  - lesson: Keep durable execution state separate from large research artifacts and context-management state; HITL policy belongs above the checkpoint primitive.
  - url: https://github.com/langchain-ai/deepagents  | maps: deep-research, deep-improvement, runtime/state-jsonl-checkpointing, runtime/budget-cost

### deep-review  (21 primary)
- **promptfoo/promptfoo** (~23.3k, high) — Declarative prompt, agent, and RAG evaluation/red-team CLI with deterministic assertions, model rubrics, trajectory checks, and CI; latest release 0.121.19 on 2026-07-14.
  - lesson: Use cheap deterministic checks before expensive judges, then gate promotion with weighted thresholds while persisting grader evidence and provenance.
  - url: https://github.com/promptfoo/promptfoo  | maps: deep-review, deep-improvement, runtime/convergence, runtime/gauges-observability, runtime/budget-cost
- **google/oss-fuzz** (~12.4k, high) — Continuous fuzzing infra (libFuzzer/AFL++/Honggfuzz + ClusterFuzz); regression mode; 13k vulns/50k bugs fixed across 1k projects as of May 2025.
  - lesson: Industrial-grade convergence = coverage-frontier plateau + every fix gated by a regression re-run, not by the fixer's claim; accumulated findings are a test corpus. Direct model for deep-review self-repair-prove-it.
  - url: https://github.com/google/oss-fuzz  | maps: deep-review, runtime/convergence, runtime/dedup-novelty, runtime/locks-recovery
- **open-compass/opencompass** (~7.2k, high) — LLM eval platform; CascadeEvaluator composes sequential evaluator stages, GenericLLMEvaluator makes LLM-judge a first-class stage alongside rule-based (v0.5.3, Jun 2026).
  - lesson: Build deep-review's evaluator as a composable sequential DAG (rule fast-path -> LLM-judge fallback -> human) that can short-circuit per stage for graceful degradation.
  - url: https://github.com/open-compass/opencompass  | maps: deep-review, runtime/gauges-observability
- **xlang-ai/OSWorld** (~2.9k, high) — Stateful desktop/web agent benchmark with task setup, execution-based postcondition scripts, and multi-application environments; latest visible main-branch activity is 2026-06-10.
  - lesson: For agentic work, verify externally observable state and artifacts after execution rather than trusting the final textual answer or action trace.
  - url: https://github.com/xlang-ai/OSWorld  | maps: deep-review, deep-improvement, runtime/convergence, runtime/state-jsonl-checkpointing, runtime/locks-recovery
- **microsoft/onefuzz** (~2.8k (ARCHIVED Nov 2023), high) — Self-hosted Fuzzing-as-a-Service: programmatic triage, result de-duplication, reproducible crashes, ensemble fuzzing sharing inputs. Archived; reference architecture only.
  - lesson: Programmatic triage + dedup + guaranteed-reproducible findings is the closed-loop self-repair contract; but an archived project proves you must borrow the architecture, never couple your runtime to one external dependency.
  - url: https://github.com/microsoft/onefuzz  | maps: deep-review, runtime/dedup-novelty, runtime/locks-recovery

### deep-improvement  (18 primary)
- **stanfordnlp/dspy** (~36.1k, high) — Declarative LM-program optimizer with MIPROv2 proposal, minibatch evaluation, Bayesian search, and commits through Jul 2026.
  - lesson: Implement improvement as proposal-evaluate-update-select with holdouts, full-validation checkpoints, and explicit trial budgets.
  - url: https://github.com/stanfordnlp/dspy  | maps: deep-improvement, runtime/convergence, runtime/budget-cost, runtime/state-jsonl-checkpointing
- **OpenBMB/ChatDev** (~33.7k, high) — Virtual software co. (code->test->review) plus Puppeteer (NeurIPS 2025): a learnable RL-optimized orchestrator improving fan-out routing; IER experience lifecycle has explicit elimination operator.
  - lesson: Run a second, slower improvement loop over the fan-out/fan-in policy itself (meta-improvement); give the accumulated experience store an elimination/decay gate, not only dedup.
  - url: https://github.com/OpenBMB/ChatDev  | maps: deep-improvement, deep-review, runtime/fan-out-fan-in, runtime/dedup-novelty
- **huggingface/trl** (~18.8k, high) — RL post-training loop; GRPOTrainer now supports environment-owned rewards + per-example environment selection across mixed sandboxed suites (v1.8.0, Jul 2026).
  - lesson: Own the scoring in the evaluated environment, not the loop driver; let multiple evaluator suites coexist in one run so loop control is decoupled from eval semantics.
  - url: https://github.com/huggingface/trl  | maps: deep-improvement, deep-alignment, runtime/gauges-observability
- **microsoft/agent-lightning** (~17.4k, high) — Framework-agnostic agent training control plane with rollouts, retryable attempts, spans, workers, and versioned resources; latest release v0.3.0 in Dec 2025.
  - lesson: Make rollout identity stable across retries, separate attempt state from aggregate state, and use monotonic event sequencing for distributed fan-in.
  - url: https://github.com/microsoft/agent-lightning  | maps: deep-improvement, runtime/fan-out-fan-in, runtime/gauges-observability, runtime/budget-cost
- **microsoft/PromptWizard** (~3.9k, high) — Staged mutation, scoring, critique, synthesis, and example optimization; latest visible commit Aug 4, 2025.
  - lesson: Separate instruction search from example search, retain positive and negative evidence, and gate stage transitions with explicit thresholds.
  - url: https://github.com/microsoft/PromptWizard  | maps: deep-improvement, runtime/fan-out-fan-in, runtime/dedup-novelty, runtime/budget-cost

### deep-ai-council  (18 primary)
- **karpathy/llm-council** (~22.5k, high) — Three-stage local council: independent answers, anonymous cross-review/ranking, and chairman synthesis; latest visible commit 2025.
  - lesson: Make blind peer review a separate durable event stage, with identity reveal outside adjudication.
  - url: https://github.com/karpathy/llm-council  | maps: deep-ai-council, runtime/state-jsonl-checkpointing, runtime/gauges-observability
- **openai/weak-to-strong** (~2.5k, high) — Sandwiching/scalable-oversight loop: weak supervisor labels a stronger model; sweep.py over capability-gap pairs; confidence auxiliary loss
  - lesson: Naive imitation of a weak critic DEGRADES the stronger model (sycophancy); requires an explicit anti-overconfidence regularizer. Direct warning: deep-ai-council must penalize over-anchoring to the first/weak seat, and capability-in-the-loop is NOT monotonic.
  - url: https://github.com/openai/weak-to-strong  | maps: deep-ai-council, runtime/convergence, deep-improvement
- **allenai/reward-bench** (~726, high) — Meta-eval that benchmarks reward models (the critic) themselves; offline RM ensembling; generative-judge ensembles require an ODD count>1 for majority vote; RewardBench 2 Jun 2025
  - lesson: 'Who validates the validator' made operational: ensemble critics with odd seat counts so ties are impossible, and treat any residual tie as 'no convergence' not 'pick one'.
  - url: https://github.com/allenai/reward-bench  | maps: deep-ai-council, runtime/convergence, runtime/dedup-novelty
- **thunlp/ChatEval** (~340, high) — Persona-conditioned referee team for comparing generated responses, with evidence and score outputs; latest visible commit 2024.
  - lesson: Give seats explicit evaluation traits and require structured evidence before scoring or synthesis.
  - url: https://github.com/thunlp/ChatEval  | maps: deep-ai-council, deep-review, runtime/fan-out-fan-in, runtime/gauges-observability
- **machine-theory/lm-council** (~310, high) — Council research toolkit covering 20-model subjective evaluation, jury ablations, leaderboards, and sub-council analysis; latest visible commit 2025.
  - lesson: Treat seat selection as an experimental-design problem measured by marginal information gain per cost.
  - url: https://github.com/machine-theory/lm-council  | maps: deep-ai-council, runtime/dedup-novelty, runtime/budget-cost, runtime/fan-out-fan-in

### deep-alignment  (4 primary)
- **NVIDIA/garak** (~8.4k, high) — LLM vulnerability scanner: probe/detector/harness/evaluator/generator plugin architecture (nmap for LLMs)
  - lesson: Clean 5-role separation of generator-vs-detector-vs-orchestrator-vs-scorer-vs-target; deep-loop conflates these into one 'critic' and that is the evaluator-reliability root cause. Each is an independently swappable plugin with a base class.
  - url: https://github.com/NVIDIA/garak  | maps: deep-alignment, deep-review, runtime/gauges-observability
- **github/gh-aw** (~4.8k, high) — Compiles natural-language Markdown workflows into hardened GitHub Actions; latest release v0.81.6 in Jun 2026.
  - lesson: Compile mutable intent into a locked execution artifact, isolate read-only reasoning from approved writes, and enforce turns, time, and credit ceilings outside the model.
  - url: https://github.com/github/gh-aw  | maps: deep-alignment, runtime/convergence, runtime/budget-cost, runtime/locks-recovery, runtime/gauges-observability
- **microsoft/PyRIT** (~4.1k, high) — Goal-based multi-turn red-team orchestrator that persists cross-turn conversation memory of which attacks already failed
  - lesson: Externalized-state checkpointing applied to the critique dimension: accumulated memory is 'what attacks failed' = a dedup/novelty signal over the attack/search space, not over document content. v0.14.0 Jun 2026.
  - url: https://github.com/microsoft/PyRIT  | maps: deep-alignment, runtime/state-jsonl-checkpointing, runtime/dedup-novelty
- **ethz-spylab/agentdojo** (~582, high) — Dynamic prompt-injection attack/defense benchmark for tool-using agents; latest release v0.1.35 in Oct 2025.
  - lesson: Score task utility and security independently; a successful answer must not compensate for an unsafe tool transition or policy violation.
  - url: https://github.com/ethz-spylab/agentdojo  | maps: deep-alignment, runtime/convergence, runtime/fan-out-fan-in, runtime/gauges-observability


## B. KEY INSIGHTS BY SUBSYSTEM (top 4)


### runtime/convergence  (97 insights)
- Oscillation detection should operate on normalized action-observation events, not raw text or IDs: exact repeats, repeated errors, agent monologues, and period-2 alternation are distinct gauges with separate thresholds.  _(high; ev: https://docs.openhands.dev/sdk/guides/agent-stuck-detector a)_
- Make fan-in budget-aware: if candidates or paths agree, skip redundant branches; if they disagree or confidence is low, expand the branch set or invoke the expensive judge. This is conditional widening, not fixed fan-out.  _(high; ev: https://aclanthology.org/2026.findings-acl.1672/ and https:/)_
- Safe parallel reduction requires an algebraic contract such as associativity and commutativity, plus idempotence when duplicate delivery is possible; otherwise reduce in stable order and model late results explicitly.  _(high; ev: https://beam.apache.org/documentation/transforms/java/aggreg)_
- Treat evaluator optimization as a typed state machine: propose, score, update, full-validate, accept or reject.  _(high; ev: https://arxiv.org/abs/2406.11695)_

### runtime/state-jsonl-checkpointing  (80 insights)
- A loop is safe only when a bound covers the entire repeated feedback path, including retries, handoffs, tool re-entry, and state growth; a max-iterations setting elsewhere is not sufficient.  _(high; ev: https://arxiv.org/abs/2607.01641)_
- Make the JSONL stream the canonical fact log and derive current state, gauges, continuity, and novelty indexes as deterministic projections; compaction must preserve parent sequence and projection hashes.  _(high; ev: https://arxiv.org/abs/2602.23193; https://docs.restate.dev/r)_
- Encode replay semantics per event as reuse, pure re-execution, or compensation/reconciliation; a checkpoint without a side-effect receipt is not a safe resume boundary.  _(high; ev: https://docs.langchain.com/oss/python/langgraph/persistence;)_
- Treat replay compatibility as a versioned contract: record code, graph, model, provider, tool, prompt, and schema fingerprints, then reject, migrate, or fork runs when the contract changes.  _(high; ev: https://docs.temporal.io/workflow-definition; https://docs.l)_

### runtime/fan-out-fan-in  (73 insights)
- Make fan-in budget-aware: if candidates or paths agree, skip redundant branches; if they disagree or confidence is low, expand the branch set or invoke the expensive judge. This is conditional widening, not fixed fan-out.  _(high; ev: https://aclanthology.org/2026.findings-acl.1672/ and https:/)_
- Fan-in should close on an explicit barrier and pass a branch-labelled outcome set to a reducer; the reducer may be deterministic, associative, or model-based, while branch errors remain visible as data.  _(high; ev: https://learn.microsoft.com/en-us/agent-framework/workflows/)_
- Deterministic branch scheduling does not imply deterministic result order; store logical branch IDs and canonical indexes, and record arrival order separately.  _(high; ev: https://adk.dev/agents/workflow-agents/parallel-agents/; htt)_
- Partial-failure tolerance must be an explicit fan-in policy such as strict, quorum, deadline, or progressive; retries need per-error allowlists and must not silently convert failed branches into missing data.  _(high; ev: https://docs.ray.io/en/latest/ray-core/fault_tolerance/tasks)_

### runtime/dedup-novelty  (61 insights)
- Oscillation detection should operate on normalized action-observation events, not raw text or IDs: exact repeats, repeated errors, agent monologues, and period-2 alternation are distinct gauges with separate thresholds.  _(high; ev: https://docs.openhands.dev/sdk/guides/agent-stuck-detector a)_
- Encode replay semantics per event as reuse, pure re-execution, or compensation/reconciliation; a checkpoint without a side-effect receipt is not a safe resume boundary.  _(high; ev: https://docs.langchain.com/oss/python/langgraph/persistence;)_
- Safe parallel reduction requires an algebraic contract such as associativity and commutativity, plus idempotence when duplicate delivery is possible; otherwise reduce in stable order and model late results explicitly.  _(high; ev: https://beam.apache.org/documentation/transforms/java/aggreg)_
- Adversarial verification should adapt attacks by vulnerability coverage and marginal novelty, not run a fixed prompt list.  _(high; ev: https://github.com/confident-ai/deepteam)_

### runtime/budget-cost  (84 insights)
- Make fan-in budget-aware: if candidates or paths agree, skip redundant branches; if they disagree or confidence is low, expand the branch set or invoke the expensive judge. This is conditional widening, not fixed fan-out.  _(high; ev: https://aclanthology.org/2026.findings-acl.1672/ and https:/)_
- A loop is safe only when a bound covers the entire repeated feedback path, including retries, handoffs, tool re-entry, and state growth; a max-iterations setting elsewhere is not sufficient.  _(high; ev: https://arxiv.org/abs/2607.01641)_
- Make the JSONL stream the canonical fact log and derive current state, gauges, continuity, and novelty indexes as deterministic projections; compaction must preserve parent sequence and projection hashes.  _(high; ev: https://arxiv.org/abs/2602.23193; https://docs.restate.dev/r)_
- Partial-failure tolerance must be an explicit fan-in policy such as strict, quorum, deadline, or progressive; retries need per-error allowlists and must not silently convert failed branches into missing data.  _(high; ev: https://docs.ray.io/en/latest/ray-core/fault_tolerance/tasks)_

### runtime/gauges-observability  (89 insights)
- Oscillation detection should operate on normalized action-observation events, not raw text or IDs: exact repeats, repeated errors, agent monologues, and period-2 alternation are distinct gauges with separate thresholds.  _(high; ev: https://docs.openhands.dev/sdk/guides/agent-stuck-detector a)_
- A loop is safe only when a bound covers the entire repeated feedback path, including retries, handoffs, tool re-entry, and state growth; a max-iterations setting elsewhere is not sufficient.  _(high; ev: https://arxiv.org/abs/2607.01641)_
- Make the JSONL stream the canonical fact log and derive current state, gauges, continuity, and novelty indexes as deterministic projections; compaction must preserve parent sequence and projection hashes.  _(high; ev: https://arxiv.org/abs/2602.23193; https://docs.restate.dev/r)_
- Fan-in should close on an explicit barrier and pass a branch-labelled outcome set to a reducer; the reducer may be deterministic, associative, or model-based, while branch errors remain visible as data.  _(high; ev: https://learn.microsoft.com/en-us/agent-framework/workflows/)_

### runtime/locks-recovery  (58 insights)
- Oscillation detection should operate on normalized action-observation events, not raw text or IDs: exact repeats, repeated errors, agent monologues, and period-2 alternation are distinct gauges with separate thresholds.  _(high; ev: https://docs.openhands.dev/sdk/guides/agent-stuck-detector a)_
- A loop is safe only when a bound covers the entire repeated feedback path, including retries, handoffs, tool re-entry, and state growth; a max-iterations setting elsewhere is not sufficient.  _(high; ev: https://arxiv.org/abs/2607.01641)_
- Encode replay semantics per event as reuse, pure re-execution, or compensation/reconciliation; a checkpoint without a side-effect receipt is not a safe resume boundary.  _(high; ev: https://docs.langchain.com/oss/python/langgraph/persistence;)_
- Treat replay compatibility as a versioned contract: record code, graph, model, provider, tool, prompt, and schema fingerprints, then reject, migrate, or fork runs when the contract changes.  _(high; ev: https://docs.temporal.io/workflow-definition; https://docs.l)_

### runtime/continuity-threading  (38 insights)
- Make the JSONL stream the canonical fact log and derive current state, gauges, continuity, and novelty indexes as deterministic projections; compaction must preserve parent sequence and projection hashes.  _(high; ev: https://arxiv.org/abs/2602.23193; https://docs.restate.dev/r)_
- Treat replay compatibility as a versioned contract: record code, graph, model, provider, tool, prompt, and schema fingerprints, then reject, migrate, or fork runs when the contract changes.  _(high; ev: https://docs.temporal.io/workflow-definition; https://docs.l)_
- External evidence and process-level checks are stronger repair signals than final-score-only self-critique.  _(high; ev: https://openai.com/index/improving-mathematical-reasoning-wi)_
- Reflection should produce a typed, scoped memory candidate and require an explicit promotion decision; raw traces, reflective summaries, and accepted lessons should not share the same trust level.  _(high; ev: https://arxiv.org/abs/2303.11366; https://github.com/noahshi)_

### deep-research  (44 insights)
- Encode replay semantics per event as reuse, pure re-execution, or compensation/reconciliation; a checkpoint without a side-effect receipt is not a safe resume boundary.  _(high; ev: https://docs.langchain.com/oss/python/langgraph/persistence;)_
- Tool observations should be hard evidence boundaries in the loop state, allowing reflection to distinguish failed execution, bad assumptions, and unsupported reasoning.  _(high; ev: https://arxiv.org/abs/2210.03629)_
- Tree and graph reasoning require path-aware convergence: branch value, parent hash, evaluator evidence, merge provenance, and branch cost must survive fan-in.  _(high; ev: https://arxiv.org/abs/2305.10601; https://arxiv.org/abs/2308)_
- Seat diversity needs incentive and role-fidelity tests; cooperation, competition, and malicious behavior are distinct deliberation regimes.  _(high; ev: https://arxiv.org/abs/2309.17234; https://github.com/S-Abdel)_

### deep-review  (43 insights)
- Treat replay compatibility as a versioned contract: record code, graph, model, provider, tool, prompt, and schema fingerprints, then reject, migrate, or fork runs when the contract changes.  _(high; ev: https://docs.temporal.io/workflow-definition; https://docs.l)_
- Keep raw judge and step-level scores before reduction so disagreement, rescoring, and evaluator drift remain observable.  _(high; ev: https://inspect.aisi.org.uk/multiple-scorers.html)_
- External evidence and process-level checks are stronger repair signals than final-score-only self-critique.  _(high; ev: https://openai.com/index/improving-mathematical-reasoning-wi)_
- Adversarial verification should adapt attacks by vulnerability coverage and marginal novelty, not run a fixed prompt list.  _(high; ev: https://github.com/confident-ai/deepteam)_

### deep-improvement  (44 insights)
- Treat evaluator optimization as a typed state machine: propose, score, update, full-validate, accept or reject.  _(high; ev: https://arxiv.org/abs/2406.11695)_
- External evidence and process-level checks are stronger repair signals than final-score-only self-critique.  _(high; ev: https://openai.com/index/improving-mathematical-reasoning-wi)_
- Reflection should produce a typed, scoped memory candidate and require an explicit promotion decision; raw traces, reflective summaries, and accepted lessons should not share the same trust level.  _(high; ev: https://arxiv.org/abs/2303.11366; https://github.com/noahshi)_
- Separate reflector and curator roles, then apply incremental deltas instead of rewriting the whole memory; attach helpful/harmful evidence and deduplication metadata to each lesson.  _(high; ev: https://github.com/ace-agent/ace; https://arxiv.org/abs/2510)_

### deep-ai-council  (34 insights)
- Make fan-in budget-aware: if candidates or paths agree, skip redundant branches; if they disagree or confidence is low, expand the branch set or invoke the expensive judge. This is conditional widening, not fixed fan-out.  _(high; ev: https://aclanthology.org/2026.findings-acl.1672/ and https:/)_
- Self-consistency needs an effective-independence gauge: many sampled paths or judges can share correlated errors.  _(high; ev: https://arxiv.org/abs/2203.11171; https://arxiv.org/abs/2605)_
- Effective judge count should be estimated from behavioral independence and marginal utility, not the number of seats.  _(high; ev: https://arxiv.org/abs/2406.08598; https://proceedings.neurip)_
- Anonymous peer review should be persisted separately from model identity, then passed to a chairman or adjudicator as a blind evidence bundle.  _(high; ev: https://github.com/karpathy/llm-council; https://github.com/)_

### deep-alignment  (24 insights)
- External evidence and process-level checks are stronger repair signals than final-score-only self-critique.  _(high; ev: https://openai.com/index/improving-mathematical-reasoning-wi)_
- Adversarial verification should adapt attacks by vulnerability coverage and marginal novelty, not run a fixed prompt list.  _(high; ev: https://github.com/confident-ai/deepteam)_
- Seat diversity needs incentive and role-fidelity tests; cooperation, competition, and malicious behavior are distinct deliberation regimes.  _(high; ev: https://arxiv.org/abs/2309.17234; https://github.com/S-Abdel)_
- Consensus is not a sufficient adjudication signal: debate can amplify position, verbosity, chain-of-thought, and bandwagon biases, while meta-judge protocols may resist them differently.  _(high; ev: https://arxiv.org/abs/2505.19477; https://github.com/Henryma)_


## C. CONTRADICTIONS / TENSIONS (deduped)

- **Claim:** Semantic similarity or stability is sufficient to declare convergence.
  - **Counter:** A loop can converge to a stable but wrong answer; semantic stopping needs quality, critic, execution, or confidence signals.  (ev: https://arxiv.org/abs/2606.27009; https://aclanthology.org/2026.findin)
- **Claim:** A global iteration or token cap is an adequate termination policy.
  - **Counter:** Caps are progress-blind, and a bound may fail to cover the actual repeated feedback path.  (ev: https://arxiv.org/abs/2606.27009; https://arxiv.org/abs/2607.01641; ht)
- **Claim:** More iterations or branches are monotonically better.
  - **Counter:** MATA reports that most refinements finish in one or two rounds, while GEPA-Lite uses non-regression gates because additional mutations can create churn.  (ev: https://aclanthology.org/2026.findings-acl.1672/; https://github.com/e)
- **Claim:** A checkpoint is enough to prevent duplicate work on resume.
  - **Counter:** Only if it stores completed step outputs or side-effect receipts; LangGraph re-executes post-checkpoint LLM and API calls, while Temporal and Restate reuse recorded history.  (ev: https://docs.langchain.com/oss/python/langgraph/persistence; https://d)
- **Claim:** Exactly-once workflow execution implies exactly-once external effects.
  - **Counter:** Exactly-once usually applies to the durable orchestration layer; external APIs still require idempotency keys, receipts, transactional coupling, or compensation.  (ev: https://docs.langchain.com/oss/python/langgraph/functional-api; https:)
- **Claim:** Persisting a current snapshot is sufficient for long-running loops.
  - **Counter:** Replay also depends on code and schema compatibility; Temporal requires deterministic versioning, and LangGraph warns that positional replay can associate cached results with the wrong call after graph edits.  (ev: https://docs.temporal.io/workflow-definition; https://docs.langchain.c)
- **Claim:** runtime/fan-out-fan-in should always wait for every branch before downstream synthesis.
  - **Counter:** Beam supports early and late emissions, while Ray supports processing ready branches incrementally; an all-branches barrier is only one closure mode.  (ev: https://learn.microsoft.com/en-us/agent-framework/workflows/orchestrat)
- **Claim:** Deterministic parallel execution yields deterministic aggregate output.
  - **Counter:** ADK describes deterministic orchestration but warns result order may be nondeterministic; Beam explicitly sorts unordered grouped values, and Ray actor ordering changes across submitters and retries.  (ev: https://adk.dev/agents/workflow-agents/parallel-agents/; https://beam.)
- **Claim:** Retries are a transparent reliability layer.
  - **Counter:** Ray does not retry application exceptions by default and actor calls can have at-most-once side-effect ambiguity; Beam may invoke user code multiple times, so idempotence or receipts are required.  (ev: https://docs.ray.io/en/latest/ray-core/fault_tolerance/tasks.html; htt)
- **Claim:** [deep-ai-council/runtime/fan-out-fan-in] More judges should monotonically improve reliability.
  - **Counter:** Nine frontier judges provided only about two effective independent votes; the best single judge sometimes matched or beat the panel.  (ev: https://arxiv.org/abs/2605.29800)
- **Claim:** [deep-improvement/deep-review] A fluent natural-language critique is a sufficient repair signal.
  - **Counter:** JETTS found critiques often ineffective, style-focused, or capable of inducing meaningless changes and answer flips; Self-Refine's gains are task-dependent.  (ev: https://arxiv.org/abs/2504.15253; https://arxiv.org/abs/2303.17651)
- **Claim:** [deep-review/deep-alignment] A rubric or reference answer makes LLM judging reliable.
  - **Counter:** Rubrics and references help but do not remove long-form instability, position bias, or objective-correctness failures.  (ev: https://arxiv.org/abs/2606.01629; https://arxiv.org/abs/2306.05685)
- **Claim:** deep-improvement/runtime/convergence: More reflection iterations should monotonically improve quality.
  - **Counter:** Self-Refine and Reflexion depend on task-specific feedback and memory, while ACE identifies brevity bias and context collapse; every promotion needs held-out regression checks.  (ev: https://arxiv.org/abs/2303.17651; https://arxiv.org/abs/2303.11366; ht)
- **Claim:** runtime/continuity-threading: Replaying the full prior trace is the safest cross-iteration memory policy.
  - **Counter:** Reflexion distinguishes full last-attempt replay from compact reflection, while ACE uses structured deltas and counters; full replay increases cost and can preserve repeated mistakes.  (ev: https://github.com/noahshinn/reflexion; https://github.com/ace-agent/a)
- **Claim:** runtime/budget-cost: Wider tree or graph search is a free reliability improvement.
  - **Counter:** ToT, GoT, and LATS add generation, evaluation, environment, and merge calls; branch factor and reflection frequency must be treated as explicit budget variables.  (ev: https://arxiv.org/abs/2305.10601; https://arxiv.org/abs/2308.09687; ht)
- **Claim:** [deep-ai-council, runtime/dedup-novelty] More seats and debate rounds should monotonically improve reliability.
  - **Counter:** Correlated seats can form echo chambers; later debate can amplify shared misconceptions or existing judge bias.  (ev: https://proceedings.neurips.cc/paper_files/paper/2024/file/32e07a110c6)
- **Claim:** [deep-ai-council, deep-alignment, runtime/gauges-observability] Anonymous reviewing is enough to make adjudication unbiased.
  - **Counter:** Anonymity can reduce model-name favoritism, but does not remove order, verbosity, chain-of-thought, or bandwagon effects.  (ev: https://github.com/karpathy/llm-council; https://arxiv.org/abs/2505.19)
- **Claim:** [deep-ai-council, runtime/convergence] Majority consensus is a safe stopping signal.
  - **Counter:** Majority pressure can suppress independent correction; a correct minority may require an explicit challenge or sentinel path.  (ev: https://arxiv.org/abs/2511.07784; https://proceedings.neurips.cc/paper)
- **Claim:** runtime/dedup-novelty: low embedding similarity is sufficient evidence of novelty.
  - **Counter:** Semantic equivalence requires entailment or clustering, while useful novelty may be observable only through new coverage, claims, entities, or outcomes.  (ev: https://aclanthology.org/2025.acl-long.29.pdf; https://arxiv.org/abs/2)
- **Claim:** runtime/dedup-novelty: accumulation means never updating or invalidating stored knowledge.
  - **Counter:** Append-only evidence is safe, but derived facts need temporal validity, supersession, and explicit contradiction handling.  (ev: https://github.com/mem0ai/mem0; https://github.com/getzep/graphiti; ht)
- **Claim:** deep-research: broader search is equivalent to increasing fan-out.
  - **Counter:** Uncontrolled fan-out repeats semantic regions; hierarchical global selection and coverage ledgers are needed to direct expansion toward gaps.  (ev: https://github.com/microsoft/Mnemis; https://microsoft.github.io/graph)
- **Claim:** runtime/budget-cost: A single parent token cap is sufficient to bound a multi-agent tree.
  - **Counter:** Sub-agent budgets may be isolated, parent limits may not forward, and concurrent shared counters can be best-effort; fan-out requires explicit allocation semantics.  (ev: https://pydantic.dev/docs/ai/harness/dynamic-workflow/; https://pydant)
- **Claim:** runtime/convergence: More test-time reasoning monotonically improves answer quality.
  - **Counter:** Marginal returns diminish, overthinking can abandon correct answers, and optimal depth varies by problem difficulty.  (ev: https://aclanthology.org/2026.findings-acl.1199/; https://arxiv.org/ab)
- **Claim:** runtime/budget-cost: Budget exhaustion should always hard-fail the run.
  - **Counter:** Soft exhaustion with partial output preserves already-paid work, while hard rejection remains appropriate at provider or safety boundaries.  (ev: https://pydantic.dev/docs/ai/harness/subagents/; https://docs.litellm.)
- **Claim:** [runtime/gauges-observability] A final quality score or aggregate cost curve is sufficient evidence of progress.
  - **Counter:** AgentOps research emphasizes trace inputs, outputs, model data, and checkpoints; Agentic CLEAR adds path, node, and temporal analysis because scalar outcomes hide silent stalls and inefficient trajectories.  (ev: https://arxiv.org/abs/2508.02121; https://ibm.github.io/CLEAR/)
- **Claim:** [runtime/state-jsonl-checkpointing] Re-emitting the same record ID is a safe enrichment mechanism.
  - **Counter:** Langfuse treats traces and observations as immutable; re-ingestion can create duplicates and inflate aggregate metrics, so enrichment should be a separate score or event.  (ev: https://langfuse.com/faq/all/tracing-data-updates)
- **Claim:** [runtime/gauges-observability] Application-level tracing alone provides complete agent observability.
  - **Counter:** AgentSight argues that intent-only and action-only views miss causal linkage; correlating LLM intent with process, file, and kernel effects exposes hidden retries and side effects.  (ev: https://arxiv.org/abs/2508.02736; https://github.com/eunomia-bpf/agent)
- **Claim:** [runtime/locks-recovery] GenAI telemetry semantics can be treated as stable once adopted.
  - **Counter:** The official GenAI conventions are still a separate active repository with no releases and frequent schema changes, requiring explicit versioning and compatibility tests.  (ev: https://github.com/open-telemetry/semantic-conventions-genai/commits/m)
- **Claim:** runtime/dedup-novelty: more diverse query families should improve coverage and question answering.
  - **Counter:** Diversity improves retrieval in some settings, but it is difficult to characterize; STORM also reports source-bias transfer and unrelated-fact association risks.  (ev: https://research.google/pubs/multi-agent-query-reformulation-challenge)
- **Claim:** deep-research: increasing branch count and depth should improve comprehensiveness.
  - **Counter:** Breadth can improve necessary-query coverage, but excessive retrieval can overflow context and reduce coherent depth; scheduling must optimize coverage per cost.  (ev: https://openreview.net/pdf?id=5EmpOCq1Ql; https://arxiv.org/abs/2510.0)
- **Claim:** runtime/gauges-observability: citation volume is a useful proxy for research coverage.
  - **Counter:** High effective-citation counts can coexist with weaker citation accuracy, so citation quantity and grounding must be separate gauges.  (ev: https://deepresearch-bench.github.io/static/papers/deepresearch-bench.)
- **Claim:** runtime/state-jsonl-checkpointing: a durable checkpoint makes a side effect exactly once.
  - **Counter:** Checkpoint replay prevents re-execution only after the receipt commits; task execution remains at-least-once and can duplicate an effect during the crash window before receipt persistence.  (ev: https://docs.hatchet.run/v1/architecture-and-guarantees; https://www.i)
- **Claim:** runtime/dedup-novelty: one generic idempotency key can cover the whole research run.
  - **Counter:** Inngest event and function deduplication defaults to a 24-hour horizon; long-lived research loops need a retention-aware run ledger aligned with continuation segments.  (ev: https://www.inngest.com/docs/guides/handling-idempotency; https://docs)
- **Claim:** Checkpointing gives a saved place where execution simply resumes.
  - **Counter:** Time-travel replay re-executes the suffix, including external calls and interrupts, so the same checkpoint can produce different outcomes.  (ev: https://docs.langchain.com/oss/python/langgraph/use-time-travel)
- **Claim:** An interrupt resumes exactly at the suspension line.
  - **Counter:** LangGraph restarts the entire node; code before the interrupt runs again, so side effects must be idempotent.  (ev: https://docs.langchain.com/oss/python/langgraph/interrupts)


## D. FULL REPO INDEX (216)

- high | ~140k | langchain-ai/langchain | https://github.com/langchain-ai/langchain | runtime/fan-out-fan-in,runtime/budget-cost,runtime/state-jsonl-checkpointing,deep-research
- high | ~60.8k | mem0ai/mem0 | https://github.com/mem0ai/mem0 | runtime/dedup-novelty,runtime/continuity-threading,runtime/budget-cost
- high | ~59.7k; latest python-v0.7.5 released Sep 30, 2025; maintenance mode | microsoft/autogen | https://github.com/microsoft/autogen | deep-research,deep-ai-council,runtime/convergence,runtime/fan-out-fan-in,runtime/budget-cost
- high | ~55.5k; latest 1.15.2 released Jul 8, 2026 | crewAIInc/crewAI | https://github.com/crewAIInc/crewAI | deep-research,deep-ai-council,deep-review,deep-improvement,runtime/budget-cost
- high | ~53.6k | BerriAI/litellm | https://github.com/BerriAI/litellm | runtime/budget-cost,runtime/gauges-observability,runtime/locks-recovery
- high | ~50.8k | run-llama/llama_index | https://github.com/run-llama/llama_index | deep-research,runtime/fan-out-fan-in,runtime/dedup-novelty,runtime/gauges-observability
- high | ~46100 | apache/airflow | https://github.com/apache/airflow | runtime/locks-recovery,runtime/fan-out-fan-in,runtime/budget-cost
- high | ~43.6k | apache/spark | https://github.com/apache/spark | runtime/fan-out-fan-in,runtime/state-jsonl-checkpointing,runtime/gauges-observability
- high | ~43.2k | ray-project/ray | https://github.com/ray-project/ray | runtime/fan-out-fan-in,runtime/locks-recovery,runtime/budget-cost,runtime/gauges-observability
- high | ~37.7k | HKUDS/LightRAG | https://github.com/HKUDS/LightRAG | runtime/continuity-threading,runtime/budget-cost,runtime/dedup-novelty
- high | ~37.3k | langchain-ai/langgraph | https://github.com/langchain-ai/langgraph | runtime/state-jsonl-checkpointing,runtime/fan-out-fan-in,runtime/dedup-novelty,deep-ai-council
- high | ~36.1k | stanfordnlp/dspy | https://github.com/stanfordnlp/dspy | deep-improvement,runtime/convergence,runtime/budget-cost,runtime/state-jsonl-checkpointing
- high | ~34.4k | microsoft/graphrag | https://github.com/microsoft/graphrag | runtime/dedup-novelty,deep-research,runtime/fan-out-fan-in,runtime/budget-cost
- high | ~33.7k | OpenBMB/ChatDev | https://github.com/OpenBMB/ChatDev | deep-improvement,deep-review,runtime/fan-out-fan-in,runtime/dedup-novelty
- high | ~33.2k | apache/kafka | https://github.com/apache/kafka | runtime/state-jsonl-checkpointing,runtime/locks-recovery
- high | ~32.3k | dgtlmoon/changedetection.io | https://github.com/dgtlmoon/changedetection.io | runtime/dedup-novelty,runtime/gauges-observability,runtime/convergence
- high | ~32k | conductor-oss/conductor | https://github.com/conductor-oss/conductor | runtime/locks-recovery,runtime/continuity-threading,runtime/state-jsonl-checkpointing
- high | ~31.1k | langfuse/langfuse | https://github.com/langfuse/langfuse | runtime/gauges-observability,runtime/continuity-threading,deep-research
- high | ~30k | stanford-oval/storm | https://github.com/stanford-oval/storm | deep-research,runtime/dedup-novelty,runtime/gauges-observability
- high | ~28.7k | getzep/graphiti | https://github.com/getzep/graphiti | runtime/dedup-novelty,runtime/state-jsonl-checkpointing,runtime/continuity-threading
- high | ~28.3k | huggingface/smolagents | https://github.com/huggingface/smolagents | runtime/convergence,runtime/gauges-observability,deep-review
- high | ~27.9k | openai/openai-agents-python | https://github.com/openai/openai-agents-python | runtime/state-jsonl-checkpointing,runtime/continuity-threading,deep-alignment,runtime/budget-cost
- high | ~27k | agentscope-ai/agentscope | https://github.com/agentscope-ai/agentscope | runtime/fan-out-fan-in,runtime/gauges-observability,runtime/budget-cost
- high | ~26.2k | langchain-ai/deepagents | https://github.com/langchain-ai/deepagents | deep-research,deep-improvement,runtime/state-jsonl-checkpointing,runtime/budget-cost
- high | ~26.2k | mastra-ai/mastra | https://github.com/mastra-ai/mastra | runtime/state-jsonl-checkpointing,runtime/fan-out-fan-in,runtime/locks-recovery
- high | ~26.2k | apache/flink | https://github.com/apache/flink | runtime/state-jsonl-checkpointing,runtime/fan-out-fan-in,runtime/convergence
- high | ~25.9k | deepset-ai/haystack | https://github.com/deepset-ai/haystack | deep-research,runtime/fan-out-fan-in,runtime/dedup-novelty,runtime/budget-cost
- high | ~23.4k | PrefectHQ/prefect | https://github.com/PrefectHQ/prefect | runtime/dedup-novelty,runtime/locks-recovery,runtime/budget-cost
- high | ~23.3k | promptfoo/promptfoo | https://github.com/promptfoo/promptfoo | deep-review,deep-improvement,runtime/convergence,runtime/gauges-observability,runtime/budget-cost
- high | ~22.5k | karpathy/llm-council | https://github.com/karpathy/llm-council | deep-ai-council,runtime/state-jsonl-checkpointing,runtime/gauges-observability
- high | ~22.5k | verl-project/verl | https://github.com/verl-project/verl | runtime/fan-out-fan-in,runtime/locks-recovery,runtime/state-jsonl-checkpointing
- high | ~22.2k | yjs/yjs | https://github.com/yjs/yjs | runtime/state-jsonl-checkpointing,runtime/fan-out-fan-in,runtime/locks-recovery
- high | ~21.6k | temporalio/temporal | https://github.com/temporalio/temporal | runtime/state-jsonl-checkpointing,runtime/continuity-threading,runtime/budget-cost,deep-improvement
- high | ~20.6k | google/adk-python | https://github.com/google/adk-python | runtime/fan-out-fan-in,runtime/state-jsonl-checkpointing,runtime/continuity-threading,deep-research
- high | ~20.6k | comet-ml/opik | https://github.com/comet-ml/opik | runtime/gauges-observability,runtime/convergence,deep-improvement
- high | ~19.8k | SWE-agent/SWE-agent | https://github.com/SWE-agent/SWE-agent | runtime/budget-cost,runtime/convergence,runtime/state-jsonl-checkpointing
- high | ~18.8k | huggingface/trl | https://github.com/huggingface/trl | deep-improvement,deep-alignment,runtime/gauges-observability
- high | ~18.5k | pydantic/pydantic-ai | https://github.com/pydantic/pydantic-ai | runtime/budget-cost,runtime/fan-out-fan-in,runtime/gauges-observability
- high | ~17.4k | microsoft/agent-lightning | https://github.com/microsoft/agent-lightning | deep-improvement,runtime/fan-out-fan-in,runtime/gauges-observability,runtime/budget-cost
- high | ~16.8k | argoproj/argo-workflows | https://github.com/argoproj/argo-workflows | runtime/locks-recovery,runtime/fan-out-fan-in,runtime/gauges-observability
- high | ~15800 | dagster-io/dagster | https://github.com/dagster-io/dagster | runtime/locks-recovery,runtime/fan-out-fan-in,runtime/state-jsonl-checkpointing
- high | ~15.6k | triggerdotdev/trigger.dev | https://github.com/triggerdotdev/trigger.dev | runtime/dedup-novelty,runtime/locks-recovery,runtime/budget-cost
- high | ~14.7k | ag-ui-protocol/ag-ui | https://github.com/ag-ui-protocol/ag-ui | runtime/continuity-threading,runtime/state-jsonl-checkpointing,runtime/gauges-observability,deep-research,deep-review
- high | ~14.5k | optuna/optuna | https://github.com/optuna/optuna | runtime/convergence,runtime/fan-out-fan-in,runtime/budget-cost
- high | ~13.5k | hibiken/asynq | https://github.com/hibiken/asynq | runtime/dedup-novelty,runtime/locks-recovery,runtime/state-jsonl-checkpointing
- high | ~13.3k | EleutherAI/lm-evaluation-harness | https://github.com/EleutherAI/lm-evaluation-harness | runtime/state-jsonl-checkpointing,runtime/locks-recovery,deep-improvement,runtime/continuity-threading
- high | ~12.4k | google/oss-fuzz | https://github.com/google/oss-fuzz | deep-review,runtime/convergence,runtime/dedup-novelty,runtime/locks-recovery
- high | ~12.1k | microsoft/agent-framework | https://github.com/microsoft/agent-framework | runtime/fan-out-fan-in,runtime/state-jsonl-checkpointing,runtime/gauges-observability,deep-ai-council
- high | ~12.1k | keephq/keep | https://github.com/keephq/keep | runtime/dedup-novelty,runtime/gauges-observability,runtime/fan-out-fan-in
- high | ~12k | langchain-ai/open_deep_research | https://github.com/langchain-ai/open_deep_research | deep-research,runtime/budget-cost,runtime/fan-out-fan-in
- high | ~10.8k | dotnet/orleans | https://github.com/dotnet/orleans | runtime/fan-out-fan-in,runtime/state-jsonl-checkpointing,runtime/locks-recovery
- high | ~10.7k | resilience4j/resilience4j | https://github.com/resilience4j/resilience4j | runtime/fan-out-fan-in,runtime/locks-recovery,runtime/budget-cost
- high | ~10.5k | rr-debugger/rr | https://github.com/rr-debugger/rr | runtime/state-jsonl-checkpointing,runtime/locks-recovery,runtime/continuity-threading,runtime/gauges-observability
- high | ~10.2k | MemTensor/MemOS | https://github.com/MemTensor/MemOS | runtime/continuity-threading,runtime/state-jsonl-checkpointing,runtime/dedup-novelty,runtime/budget-cost
- high | ~10200 | Netflix/metaflow | https://github.com/Netflix/metaflow | runtime/fan-out-fan-in,runtime/state-jsonl-checkpointing,runtime/locks-recovery
- high | ~9.8k | OpenRLHF/OpenRLHF | https://github.com/OpenRLHF/OpenRLHF | runtime/fan-out-fan-in,runtime/convergence,runtime/dedup-novelty
- high | ~9.2k | risingwavelabs/risingwave | https://github.com/risingwavelabs/risingwave | runtime/gauges-observability,runtime/convergence,runtime/dedup-novelty
- high | ~8.9k | OpenSPG/KAG | https://github.com/OpenSPG/KAG | runtime/dedup-novelty,runtime/continuity-threading,deep-research
- high | ~8.6k | apache/beam | https://github.com/apache/beam | runtime/fan-out-fan-in,runtime/dedup-novelty,runtime/state-jsonl-checkpointing,runtime/convergence
- high | ~8.4k | NVIDIA/garak | https://github.com/NVIDIA/garak | deep-alignment,deep-review,runtime/gauges-observability
- high | ~7.5k | hatchet-dev/hatchet | https://github.com/hatchet-dev/hatchet | runtime/fan-out-fan-in,runtime/state-jsonl-checkpointing,runtime/locks-recovery,runtime/budget-cost,deep-ai-council
- high | ~7.2k | open-compass/opencompass | https://github.com/open-compass/opencompass | deep-review,runtime/gauges-observability
- high | ~7100 | flyteorg/flyte | https://github.com/flyteorg/flyte | runtime/fan-out-fan-in,runtime/budget-cost,runtime/locks-recovery
- high | ~6.7k; latest commit Jun 2025 | simplescaling/s1 | https://github.com/simplescaling/s1 | runtime/budget-cost,runtime/convergence,runtime/state-jsonl-checkpointing,deep-improvement
- high | ~6.7k | uxlfoundation/oneTBB | https://github.com/uxlfoundation/oneTBB | runtime/fan-out-fan-in,runtime/convergence,runtime/gauges-observability
- high | ~6.6k | hazelcast/hazelcast | https://github.com/hazelcast/hazelcast | runtime/locks-recovery,runtime/state-jsonl-checkpointing,runtime/fan-out-fan-in
- high | ~6.4k | microsoft/LLMLingua | https://github.com/microsoft/LLMLingua | runtime/budget-cost,runtime/state-jsonl-checkpointing,runtime/gauges-observability
- high | ~6.4k | automerge/automerge | https://github.com/automerge/automerge | runtime/fan-out-fan-in,runtime/state-jsonl-checkpointing,runtime/dedup-novelty
- high | ~5.8k | SWE-agent/mini-swe-agent | https://github.com/SWE-agent/mini-swe-agent | runtime/budget-cost,runtime/state-jsonl-checkpointing,runtime/locks-recovery
- high | ~5.8k | kurrent-io/KurrentDB | https://github.com/kurrent-io/KurrentDB | runtime/state-jsonl-checkpointing,runtime/locks-recovery,runtime/continuity-threading
- high | ~5.6k | OpenBMB/UltraRAG | https://github.com/OpenBMB/UltraRAG | deep-research,runtime/fan-out-fan-in,runtime/gauges-observability
- high | ~5.6k | inngest/inngest | https://github.com/inngest/inngest | runtime/state-jsonl-checkpointing,runtime/locks-recovery,deep-research
- high | ~5.3k | cloudflare/agents | https://github.com/cloudflare/agents | runtime/continuity-threading,runtime/locks-recovery,runtime/budget-cost,runtime/gauges-observability,deep-alignment
- high | ~4.8k | github/gh-aw | https://github.com/github/gh-aw | deep-alignment,runtime/convergence,runtime/budget-cost,runtime/locks-recovery,runtime/gauges-observability
- high | ~4.2k | restatedev/restate | https://github.com/restatedev/restate | runtime/locks-recovery,runtime/dedup-novelty,runtime/state-jsonl-checkpointing,deep-alignment
- high | ~4.1k | ysymyth/ReAct | https://github.com/ysymyth/ReAct | deep-research,deep-improvement,runtime/state-jsonl-checkpointing,runtime/locks-recovery,runtime/gauges-observability
- high | ~4.1k | microsoft/PyRIT | https://github.com/microsoft/PyRIT | deep-alignment,runtime/state-jsonl-checkpointing,runtime/dedup-novelty
- high | ~3.9k | microsoft/PromptWizard | https://github.com/microsoft/PromptWizard | deep-improvement,runtime/fan-out-fan-in,runtime/dedup-novelty,runtime/budget-cost
- high | ~3.9k | gusye1234/nano-graphrag | https://github.com/gusye1234/nano-graphrag | runtime/dedup-novelty,runtime/budget-cost
- high | ~3.9k | OSU-NLP-Group/HippoRAG | https://github.com/OSU-NLP-Group/HippoRAG | runtime/continuity-threading,runtime/budget-cost,deep-research
- high | ~3.8k | circlemind-ai/fast-graphrag | https://github.com/circlemind-ai/fast-graphrag | deep-research,runtime/state-jsonl-checkpointing,runtime/fan-out-fan-in
- high | ~3.6k | zou-group/textgrad | https://github.com/zou-group/textgrad | deep-improvement,runtime/convergence,runtime/state-jsonl-checkpointing,runtime/gauges-observability
- high | ~3.6k (release v0.5.4, Dec 2025) | Netflix/concurrency-limits | https://github.com/Netflix/concurrency-limits | runtime/locks-recovery,runtime/budget-cost,runtime/fan-out-fan-in,runtime/gauges-observability
- high | ~3.5k | meta-pytorch/botorch | https://github.com/meta-pytorch/botorch | runtime/budget-cost,runtime/convergence,runtime/gauges-observability
- high | ~3.2k | noahshinn/reflexion | https://github.com/noahshinn/reflexion | deep-improvement,deep-research,runtime/state-jsonl-checkpointing,runtime/continuity-threading
- high | ~3.2k | ResearAI/DeepScientist | https://github.com/ResearAI/DeepScientist | deep-research,deep-improvement,runtime/continuity-threading,runtime/dedup-novelty,runtime/gauges-observability
- high | ~3.2k | eureka-research/Eureka | https://github.com/eureka-research/Eureka | deep-improvement,runtime/fan-out-fan-in,runtime/convergence
- high | ~3.1k | langchain-ai/langgraphjs | https://github.com/langchain-ai/langgraphjs | runtime/state-jsonl-checkpointing,runtime/continuity-threading,runtime/fan-out-fan-in
- high | ~3.1k | robusta-dev/robusta | https://github.com/robusta-dev/robusta | deep-improvement,runtime/locks-recovery,runtime/gauges-observability
- high | ~2.9k | xlang-ai/OSWorld | https://github.com/xlang-ai/OSWorld | deep-review,deep-improvement,runtime/convergence,runtime/state-jsonl-checkpointing,runtime/locks-recovery
- high | ~2.9k | kubernetes-sigs/controller-runtime | https://github.com/kubernetes-sigs/controller-runtime | runtime/convergence,runtime/locks-recovery,runtime/state-jsonl-checkpointing
- high | ~2.9k (ACL 2024, news Jul 2026) | zjunlp/EasyEdit | https://github.com/zjunlp/EasyEdit | runtime/dedup-novelty,runtime/state-jsonl-checkpointing,deep-review,deep-improvement
- high | ~2.8k | spcl/graph-of-thoughts | https://github.com/spcl/graph-of-thoughts | deep-research,deep-improvement,runtime/fan-out-fan-in,runtime/convergence,runtime/dedup-novelty,runtime/budget-cost
- high | ~2.8k | letta-ai/letta-code | https://github.com/letta-ai/letta-code | runtime/continuity-threading,runtime/state-jsonl-checkpointing,runtime/locks-recovery,deep-improvement
- high | ~2.8k (ARCHIVED Nov 2023) | microsoft/onefuzz | https://github.com/microsoft/onefuzz | deep-review,runtime/dedup-novelty,runtime/locks-recovery
- high | ~2.7k | mll-lab-nu/RAGEN | https://github.com/mll-lab-nu/RAGEN | runtime/dedup-novelty,runtime/gauges-observability,runtime/budget-cost
- high | ~2.5k | openai/weak-to-strong | https://github.com/openai/weak-to-strong | deep-ai-council,runtime/convergence,deep-improvement
- high | ~2.3k | UKGovernmentBEIS/inspect_ai | https://github.com/UKGovernmentBEIS/inspect_ai | deep-review,runtime/state-jsonl-checkpointing,runtime/gauges-observability,runtime/convergence
- high | ~2.2k | confident-ai/deepteam | https://github.com/confident-ai/deepteam | deep-review,deep-alignment,runtime/dedup-novelty,runtime/budget-cost,runtime/continuity-threading
- high | ~2.1k | openai/prm800k | https://github.com/openai/prm800k | deep-review,deep-improvement,deep-alignment,runtime/gauges-observability
- high | ~2.1k | OpenAutoCoder/Agentless | https://github.com/OpenAutoCoder/Agentless | deep-review,deep-improvement,runtime/budget-cost,runtime/convergence
- high | ~2.1k | langfengQ/verl-agent | https://github.com/langfengQ/verl-agent | runtime/fan-out-fan-in,runtime/state-jsonl-checkpointing,deep-improvement
- high | ~1.9k | google/ax | https://github.com/google/ax | runtime/state-jsonl-checkpointing,runtime/locks-recovery,runtime/continuity-threading,deep-research
- high | ~1.9k | LeapLabTHU/Absolute-Zero-Reasoner | https://github.com/LeapLabTHU/Absolute-Zero-Reasoner | deep-improvement,runtime/convergence,runtime/dedup-novelty
- high | ~1.7k | google/vizier | https://github.com/google/vizier | runtime/convergence,runtime/fan-out-fan-in,runtime/state-jsonl-checkpointing
- high | ~1.7k | dask/distributed | https://github.com/dask/distributed | runtime/fan-out-fan-in,runtime/dedup-novelty,runtime/state-jsonl-checkpointing
- high | ~1.7k | pyeventsourcing/eventsourcing | https://github.com/pyeventsourcing/eventsourcing | runtime/state-jsonl-checkpointing,runtime/locks-recovery,runtime/continuity-threading
- high | ~1.6k | sierra-research/tau2-bench | https://github.com/sierra-research/tau2-bench | deep-review,deep-improvement,runtime/convergence,runtime/dedup-novelty,runtime/gauges-observability
- high | ~1.6k | apache/pekko | https://github.com/apache/pekko | runtime/state-jsonl-checkpointing,runtime/dedup-novelty
- high | ~1.5k | dbos-inc/dbos-transact-py | https://github.com/dbos-inc/dbos-transact-py | runtime/state-jsonl-checkpointing,runtime/locks-recovery,runtime/continuity-threading,deep-review
- high | ~1.5k | trpc-group/trpc-agent-go | https://github.com/trpc-group/trpc-agent-go | runtime/fan-out-fan-in,runtime/state-jsonl-checkpointing,runtime/locks-recovery,runtime/gauges-observability
- high | ~1.3k | ServiceNow/BrowserGym | https://github.com/ServiceNow/BrowserGym | deep-research,deep-review,runtime/convergence,runtime/gauges-observability
- high | ~1.2k (GitHub snapshot) | strongdm/attractor | https://github.com/strongdm/attractor | runtime/convergence,runtime/gauges-observability,runtime/locks-recovery,runtime/state-jsonl-checkpointing,deep-review
- high | ~1.2k | scikit-bio/scikit-bio | https://github.com/scikit-bio/scikit-bio | runtime/convergence,runtime/dedup-novelty,runtime/gauges-observability
- high | ~1.1k | Arize-ai/openinference | https://github.com/Arize-ai/openinference | runtime/gauges-observability,runtime/state-jsonl-checkpointing,runtime/continuity-threading
- high | ~1.0k | agiresearch/A-mem | https://github.com/agiresearch/A-mem | deep-research,runtime/dedup-novelty,runtime/continuity-threading,deep-improvement
- high | ~1.0k | yuchenlin/LLM-Blender | https://github.com/yuchenlin/LLM-Blender | deep-review,deep-ai-council,runtime/dedup-novelty,runtime/gauges-observability
- high | ~1k | thinking-machines-lab/batch_invariant_ops | https://github.com/thinking-machines-lab/batch_invariant_ops | runtime/state-jsonl-checkpointing,runtime/budget-cost,runtime/gauges-observability
- high | ~1k | centerforaisafety/HarmBench | https://github.com/centerforaisafety/HarmBench | deep-improvement,deep-alignment,runtime/dedup-novelty
- high | ~900 (GitHub snapshot) | OpenHands/software-agent-sdk | https://github.com/OpenHands/software-agent-sdk | runtime/convergence,runtime/dedup-novelty,runtime/gauges-observability,runtime/locks-recovery,deep-review
- high | ~800 | madaan/self-refine | https://github.com/madaan/self-refine | deep-improvement,deep-review,runtime/convergence,runtime/budget-cost
- high | ~800 | meta-llama/prompt-ops | https://github.com/meta-llama/prompt-ops | deep-improvement,deep-alignment,runtime/convergence,runtime/budget-cost,runtime/gauges-observability
- high | ~754 | dbos-inc/dbos-transact-golang | https://github.com/dbos-inc/dbos-transact-golang | runtime/state-jsonl-checkpointing,runtime/dedup-novelty,runtime/locks-recovery,runtime/continuity-threading
- high | ~726 | allenai/reward-bench | https://github.com/allenai/reward-bench | deep-ai-council,runtime/convergence,runtime/dedup-novelty
- high | ~721 | infer-actively/pymdp | https://github.com/infer-actively/pymdp | runtime/dedup-novelty,runtime/convergence,runtime/budget-cost
- high | ~713 | dapr/dapr-agents | https://github.com/dapr/dapr-agents | runtime/state-jsonl-checkpointing,runtime/locks-recovery,deep-research,deep-ai-council
- high | ~700 | microsoft/Trace | https://github.com/microsoft/Trace | deep-improvement,runtime/state-jsonl-checkpointing,runtime/locks-recovery,runtime/continuity-threading
- high | ~700 | google-deepmind/opro | https://github.com/google-deepmind/opro | deep-improvement,runtime/convergence,runtime/state-jsonl-checkpointing,runtime/budget-cost
- high | ~700 | st-tech/zr-obp | https://github.com/st-tech/zr-obp | runtime/state-jsonl-checkpointing,runtime/convergence,runtime/budget-cost,deep-improvement
- high | ~634 | langchain-ai/agent-protocol | https://github.com/langchain-ai/agent-protocol | runtime/continuity-threading,runtime/gauges-observability,runtime/locks-recovery,runtime/fan-out-fan-in
- high | ~625 | potsawee/selfcheckgpt | https://github.com/potsawee/selfcheckgpt | deep-review,runtime/convergence,runtime/gauges-observability,deep-ai-council
- high | ~600 | ServiceNow/AgentLab | https://github.com/ServiceNow/AgentLab | runtime/fan-out-fan-in,runtime/continuity-threading,runtime/locks-recovery,runtime/gauges-observability,deep-review
- high | ~582 | UKGovernmentBEIS/inspect_evals | https://github.com/UKGovernmentBEIS/inspect_evals | deep-review,deep-improvement,runtime/convergence,runtime/locks-recovery,runtime/budget-cost
- high | ~582 | ethz-spylab/agentdojo | https://github.com/ethz-spylab/agentdojo | deep-alignment,runtime/convergence,runtime/fan-out-fan-in,runtime/gauges-observability
- high | ~554 | SakanaAI/treequest | https://github.com/SakanaAI/treequest | runtime/convergence,runtime/fan-out-fan-in,runtime/budget-cost
- high | ~549 | SWE-agent/SWE-ReX | https://github.com/SWE-agent/swe-rex | runtime/fan-out-fan-in,runtime/state-jsonl-checkpointing,runtime/locks-recovery,runtime/budget-cost
- high | ~424 | syne-tune/syne-tune | https://github.com/syne-tune/syne-tune | runtime/fan-out-fan-in,runtime/budget-cost,runtime/convergence
- high | ~368 | MaximeRobeyns/self_improving_coding_agent | https://github.com/MaximeRobeyns/self_improving_coding_agent | runtime/convergence,runtime/state-jsonl-checkpointing,deep-improvement,runtime/gauges-observability
- high | ~340 | thunlp/ChatEval | https://github.com/thunlp/ChatEval | deep-ai-council,deep-review,runtime/fan-out-fan-in,runtime/gauges-observability
- high | ~310 | machine-theory/lm-council | https://github.com/machine-theory/lm-council | deep-ai-council,runtime/dedup-novelty,runtime/budget-cost,runtime/fan-out-fan-in
- high | ~294 | eunomia-bpf/agentsight | https://github.com/eunomia-bpf/agentsight | runtime/gauges-observability,runtime/state-jsonl-checkpointing
- high | ~289 | microsoft/lost_in_conversation | https://github.com/microsoft/lost_in_conversation | runtime/convergence,runtime/continuity-threading,runtime/gauges-observability,deep-research,deep-review
- high | ~280 | fidelity/mabwiser | https://github.com/fidelity/mabwiser | deep-research,deep-improvement,runtime/fan-out-fan-in,runtime/budget-cost
- high | ~270 | stanford-futuredata/FrugalGPT | https://github.com/stanford-futuredata/FrugalGPT | deep-research,deep-review,runtime/budget-cost
- high | ~260 | VainF/Thinkless | https://github.com/VainF/Thinkless | runtime/convergence,runtime/budget-cost,deep-research
- high | ~239 | RICommunity/TAP | https://github.com/RICommunity/TAP | runtime/fan-out-fan-in,runtime/convergence,runtime/budget-cost
- high | ~231 | RLHFlow/Self-rewarding-reasoning-LLM | https://github.com/RLHFlow/Self-rewarding-reasoning-LLM | deep-improvement,runtime/convergence,runtime/gauges-observability,runtime/budget-cost
- high | ~230 | redis-developer/langgraph-redis | https://github.com/redis-developer/langgraph-redis | runtime/state-jsonl-checkpointing,runtime/budget-cost,runtime/locks-recovery,runtime/continuity-threading
- high | ~169 | zhengkid/AutoTTS | https://github.com/zhengkid/AutoTTS | runtime/convergence,runtime/fan-out-fan-in,runtime/budget-cost,deep-improvement
- high | ~145 | i-Eval/FairEval | https://github.com/i-Eval/FairEval | deep-review,deep-ai-council,runtime/fan-out-fan-in,runtime/convergence,runtime/gauges-observability
- high | ~131 | decile-team/submodlib | https://github.com/decile-team/submodlib | runtime/dedup-novelty,runtime/convergence,runtime/budget-cost
- high | ~115 | microsoft/DELEGATE52 | https://github.com/microsoft/DELEGATE52 | runtime/state-jsonl-checkpointing,runtime/locks-recovery,runtime/gauges-observability,runtime/convergence,deep-improvement
- high | ~106 | nanomaoli/llm_reproducibility | https://github.com/nanomaoli/llm_reproducibility | runtime/state-jsonl-checkpointing,runtime/gauges-observability,deep-review
- high | ~101 | terrierteam/ir_measures | https://github.com/terrierteam/ir_measures | runtime/dedup-novelty,runtime/convergence,deep-research
- high | ~100 | microsoft/Mnemis | https://github.com/microsoft/Mnemis | runtime/dedup-novelty,deep-research,runtime/budget-cost
- high | ~89 | WHGTyen/BIG-Bench-Mistake | https://github.com/WHGTyen/BIG-Bench-Mistake | deep-review,deep-improvement,runtime/convergence,runtime/gauges-observability
- high | ~76 | get-convex/workflow | https://github.com/get-convex/workflow | runtime/state-jsonl-checkpointing,runtime/continuity-threading,runtime/budget-cost
- high | ~76 | deeplearning-wisc/debate-or-vote | https://github.com/deeplearning-wisc/debate-or-vote | deep-ai-council,runtime/fan-out-fan-in,runtime/budget-cost
- high | ~60–66; latest commit Jul 2025 | microsoft/best-route-llm | https://github.com/microsoft/best-route-llm | runtime/budget-cost,runtime/convergence,deep-research,deep-review
- high | ~54 | S-Abdelnabi/LLM-Deliberation | https://github.com/S-Abdelnabi/LLM-Deliberation | deep-ai-council,deep-alignment,deep-research,runtime/gauges-observability
- high | ~50 | aws/aws-durable-execution-sdk-python | https://github.com/aws/aws-durable-execution-sdk-python | runtime/state-jsonl-checkpointing,runtime/locks-recovery,runtime/continuity-threading
- high | ~49 | open-compass/CriticEval | https://github.com/open-compass/CriticEval | deep-review,deep-improvement,deep-ai-council,runtime/gauges-observability
- high | ~41; latest commit Dec 2023 | Pranjal2041/AdaptiveConsistency | https://github.com/Pranjal2041/AdaptiveConsistency | runtime/fan-out-fan-in,runtime/convergence,runtime/budget-cost,runtime/gauges-observability,deep-ai-council
- high | ~37 | microsoft/LLM-Rubric | https://github.com/microsoft/LLM-Rubric | deep-review,deep-alignment,runtime/convergence,runtime/gauges-observability
- high | ~10 | princeton-pli/Contextual-Drag | https://github.com/princeton-pli/Contextual-Drag | deep-improvement,runtime/continuity-threading,runtime/state-jsonl-checkpointing,runtime/gauges-observability
- high | ~8–15; latest commit Mar 2026 | junhongmit/P-and-B | https://github.com/junhongmit/P-and-B | runtime/budget-cost,runtime/fan-out-fan-in,runtime/convergence,deep-research
- high | ~7 | wzy6642/ProCo | https://github.com/wzy6642/ProCo | deep-research,deep-review,deep-improvement,runtime/convergence,runtime/gauges-observability
- high | ~5 | S3IC-Lab/RobustJudge | https://github.com/S3IC-Lab/RobustJudge | deep-review,deep-ai-council,deep-alignment,runtime/gauges-observability,runtime/state-jsonl-checkpointing
- high | ~4 | QianJaneXie/CostAwareStoppingBayesOpt | https://github.com/QianJaneXie/CostAwareStoppingBayesOpt | runtime/convergence,runtime/budget-cost,runtime/fan-out-fan-in,deep-research
- high | ~3 (GitHub snapshot) | AIDASLab/MATA | https://github.com/AIDASLab/MATA | runtime/convergence,runtime/fan-out-fan-in,runtime/budget-cost,deep-ai-council,deep-research
- high | ~3 | au-clan/Diverge | https://github.com/au-clan/Diverge | deep-research,runtime/dedup-novelty,runtime/gauges-observability,runtime/state-jsonl-checkpointing
- high | ~3 | Azure-Samples/eval-driven-agents | https://github.com/Azure-Samples/eval-driven-agents | deep-review,runtime/gauges-observability,runtime/locks-recovery
- high | ~2,000 | tatsu-lab/alpaca_eval | https://github.com/tatsu-lab/alpaca_eval | deep-review,deep-ai-council,runtime/convergence,runtime/gauges-observability
- high | unknown | instadeepai/DebateLLM | https://github.com/instadeepai/DebateLLM | deep-ai-council,runtime/convergence,runtime/budget-cost
- high | unknown | dinobby/ReConcile | https://github.com/dinobby/ReConcile | deep-ai-council,runtime/fan-out-fan-in,runtime/gauges-observability
- high | unknown | vllm-project/vllm | https://github.com/vllm-project/vllm | runtime/state-jsonl-checkpointing,runtime/fan-out-fan-in,runtime/gauges-observability
- med | ~18700 | spotify/luigi | https://github.com/spotify/luigi | runtime/dedup-novelty,runtime/locks-recovery
- med | ~6.4K | microsoft/SkillOpt | https://github.com/microsoft/SkillOpt | runtime/convergence,deep-improvement,runtime/budget-cost
- med | ~5.1k | agentscope-ai/AgentTeams | https://github.com/agentscope-ai/AgentTeams | deep-ai-council,runtime/fan-out-fan-in,runtime/continuity-threading,runtime/gauges-observability,runtime/locks-recovery
- med | ~4.9k (GitHub snapshot) | Q00/ouroboros | https://github.com/Q00/ouroboros | runtime/convergence,runtime/dedup-novelty,runtime/gauges-observability,runtime/state-jsonl-checkpointing,runtime/locks-recovery
- med | ~4.8k; latest v1.0.0b0 released Jul 3, 2026 | ag2ai/ag2 | https://github.com/ag2ai/ag2 | deep-ai-council,deep-alignment,runtime/continuity-threading,runtime/state-jsonl-checkpointing
- med | ~3.5k | aiming-lab/SimpleMem | https://github.com/aiming-lab/SimpleMem | runtime/budget-cost,runtime/dedup-novelty,runtime/state-jsonl-checkpointing,runtime/continuity-threading,deep-research
- med | ~3k | togethercomputer/MoA | https://github.com/togethercomputer/MoA | deep-ai-council,deep-research,runtime/fan-out-fan-in,runtime/dedup-novelty,runtime/budget-cost
- med | ~2.2k | OpenSPG/openspg | https://github.com/OpenSPG/openspg | runtime/continuity-threading,runtime/dedup-novelty
- med | ~1.2k | ace-agent/ace | https://github.com/ace-agent/ace | deep-improvement,deep-research,runtime/dedup-novelty,runtime/convergence,runtime/state-jsonl-checkpointing,runtime/gauges-observability,runtime/continuity-threading
- med | ~940 | Raudaschl/rag-fusion | https://github.com/Raudaschl/rag-fusion | deep-research,runtime/fan-out-fan-in,runtime/budget-cost,runtime/convergence
- med | ~580 | texttron/hyde | https://github.com/texttron/hyde | deep-research,runtime/dedup-novelty,runtime/state-jsonl-checkpointing
- med | ~550–580; latest commit Sep 2025 | raymin0223/mixture_of_recursions | https://github.com/raymin0223/mixture_of_recursions | runtime/budget-cost,runtime/gauges-observability,runtime/convergence
- med | ~300 | Ayanami0730/arag | https://github.com/Ayanami0730/arag | deep-research,runtime/dedup-novelty,runtime/budget-cost,runtime/gauges-observability
- med | ~300 | microsoft/durabletask-go | https://github.com/microsoft/durabletask-go | runtime/state-jsonl-checkpointing,runtime/locks-recovery,runtime/fan-out-fan-in
- med | ~240 | guilgautier/DPPy | https://github.com/guilgautier/DPPy | runtime/fan-out-fan-in,runtime/dedup-novelty,deep-ai-council
- med | ~230 | hao-ai-lab/Dynasor | https://github.com/hao-ai-lab/Dynasor | runtime/convergence,runtime/gauges-observability,runtime/budget-cost
- med | ~156 | open-telemetry/semantic-conventions-genai | https://github.com/open-telemetry/semantic-conventions-genai | runtime/gauges-observability,runtime/state-jsonl-checkpointing,runtime/convergence
- med | ~149 | GeniusHTX/TALE | https://github.com/GeniusHTX/TALE | runtime/budget-cost,runtime/convergence,deep-research,deep-improvement
- med | ~120 | ScalerLab/JudgeBench | https://github.com/ScalerLab/JudgeBench | deep-review,deep-ai-council,runtime/gauges-observability,runtime/fan-out-fan-in
- med | ~117 | ScalingIntelligence/large_language_monkeys | https://github.com/ScalingIntelligence/large_language_monkeys | runtime/fan-out-fan-in,runtime/dedup-novelty,runtime/convergence,deep-review
- med | ~91 | automl/DEHB | https://github.com/automl/DEHB | runtime/convergence,runtime/fan-out-fan-in,runtime/budget-cost
- med | ~85 | LLM-VLM-GSL/AriadneMem | https://github.com/LLM-VLM-GSL/AriadneMem | runtime/fan-out-fan-in,runtime/dedup-novelty,runtime/gauges-observability,deep-research,deep-review
- med | ~70 | MAS-Infra-Layer/Agent-Git | https://github.com/MAS-Infra-Layer/Agent-Git | runtime/state-jsonl-checkpointing,runtime/fan-out-fan-in,runtime/continuity-threading,runtime/locks-recovery
- med | ~56 (GitHub snapshot) | egmaminta/GEPA-Lite | https://github.com/egmaminta/GEPA-Lite | deep-research,deep-improvement,runtime/fan-out-fan-in,runtime/dedup-novelty,runtime/budget-cost,runtime/convergence
- med | ~18 | slhleosun/reasoning-trajectory | https://github.com/slhleosun/reasoning-trajectory | runtime/convergence,runtime/budget-cost,runtime/gauges-observability,deep-review,deep-improvement
- med | ~10 | aixgo-dev/aixgo | https://github.com/aixgo-dev/aixgo | deep-ai-council,runtime/fan-out-fan-in,runtime/convergence,runtime/budget-cost
- med | ~8 | Henrymachiyu/Multi_Agent_Judge_Bias | https://github.com/Henrymachiyu/Multi_Agent_Judge_Bias | deep-ai-council,deep-alignment,runtime/gauges-observability,runtime/dedup-novelty
- med | ~6 | NEUIR/Genii | https://github.com/NEUIR/Genii | deep-ai-council,deep-review,deep-improvement,runtime/fan-out-fan-in,runtime/gauges-observability
- med | ~3 | DSAIL-Memory/EvoMemBench | https://github.com/DSAIL-Memory/EvoMemBench | runtime/dedup-novelty,deep-improvement,runtime/budget-cost,runtime/gauges-observability
- med | ~1 | Xieyangxinyu/reasoning_uncertainty | https://github.com/Xieyangxinyu/reasoning_uncertainty | runtime/convergence,runtime/gauges-observability,deep-research,deep-review
- med | 0 | hyang0129/onlycodes | https://github.com/hyang0129/onlycodes | runtime/budget-cost,runtime/convergence,deep-research
- med | unknown | DA2I2-SLM/DAR | https://github.com/DA2I2-SLM/DAR | deep-ai-council,runtime/fan-out-fan-in,runtime/dedup-novelty,runtime/budget-cost
- med | unknown | vcr/vcr | https://github.com/vcr/vcr | runtime/state-jsonl-checkpointing,runtime/budget-cost,runtime/locks-recovery
- med | unknown | cobusgreyling/loop-engineering | https://github.com/cobusgreyling/loop-engineering | runtime/budget-cost,runtime/convergence
- low | ~17 | sciknoworg/deep-research | https://github.com/sciknoworg/deep-research | deep-research,runtime/budget-cost,runtime/gauges-observability
- low | ~1 | sajjadanwar0/token-budgets | https://github.com/sajjadanwar0/token-budgets | runtime/budget-cost,runtime/fan-out-fan-in,runtime/locks-recovery
- low | unknown | UKGovernmentBEIS/control-arena | https://github.com/UKGovernmentBEIS/control-arena | deep-ai-council,deep-alignment,runtime/fan-out-fan-in,runtime/gauges-observability
- low | unknown | gostevehoward/confseq | https://github.com/gostevehoward/confseq | runtime/convergence,runtime/gauges-observability,deep-ai-council,deep-review
- low | unknown | codenotary/immudb | https://github.com/codenotary/immudb | runtime/state-jsonl-checkpointing,runtime/continuity-threading,runtime/gauges-observability,deep-alignment
- low | ~0 (34 commits) | comp-17/llm-debate-system | https://github.com/comp-17/llm-debate-system | deep-ai-council,runtime/convergence


## E. ELIMINATION CANDIDATES (low confidence)

- sajjadanwar0/token-budgets (https://github.com/sajjadanwar0/token-budgets) — Associated with a 2026 paper; no GitHub releases published; Rust affine budget values make cloning, double-spending, and use-after-delegation compile-time errors. — lesson: Treat budget ownership like a capability: reserve before fan-out, transfer ownership explicitly, and prevent concurrent branches from spending the same allocation.
- sciknoworg/deep-research (https://github.com/sciknoworg/deep-research) — Scientific deep-research implementation with explicit depth/breadth configurations and a qualitative evaluation pipeline; latest commit Apr 2026 and no releases. — lesson: Benchmark breadth/depth settings against source integration per output, not only final-answer quality.
- UKGovernmentBEIS/control-arena (https://github.com/UKGovernmentBEIS/control-arena) — Official AISI framework for paired honest-versus-attack AI-control evaluations and post-hoc macro-protocol analysis; official launch and v2.1.0 package are visible from 2025, but GitHub stars and exact latest commit were not retrievable. — lesson: Test councils as adversarial control protocols: run matched honest and attack conditions, vary compromised-seat topology, and measure both safety and usefulness rather than agreement alone.
- gostevehoward/confseq (https://github.com/gostevehoward/confseq) — Reference implementation of time-uniform confidence sequences and uniform boundaries; the latest package release surfaced by search is from 2022, while GitHub stars and latest commit year were not verified. — lesson: Replace repeated fixed-horizon confidence tests with an anytime-valid gate, but encode the filtration, predictable selection rule, and shared-model dependence assumptions explicitly.
- codenotary/immudb (https://github.com/codenotary/immudb) — Cryptographically coherent immutable database with verifiable reads and structured JSON audit events; the current repository page references v1.9.5 and recent audit-log work, but stars and exact latest release date were not verified. — lesson: Keep the replay ledger immutable but move sensitive content into per-record encrypted sidecars; chain ciphertext commitments and redaction events, then erase payload keys without rewriting history.
- comp-17/llm-debate-system (https://github.com/comp-17/llm-debate-system) — Irving AI-safety-via-debate impl with floor-gated convergence: min 3 rounds, stop after 2 consecutive identical answer-pairs — lesson: A cheap, testable debate-convergence rule (floor + N-consecutive-agreement) for deep-ai-council; BUT must be paired with a disagreement/variance gauge because agreement != truth
