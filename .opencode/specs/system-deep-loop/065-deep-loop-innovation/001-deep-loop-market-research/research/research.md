# Deep-Loop Market Research — The Loop-Engineering Landscape

> A 45-iteration, non-converging (broadening) research synthesis on the state of the art in **loop engineering** for agentic / iterative AI systems, mined for transferable lessons to improve `system-deep-loop` and its modes.

---

## 1. Executive Summary

We ran a full-depth, deliberately **broadening** research loop — 45 iterations, three model lineages (LUNA 25, SOL 10, GLM 10) — over the loop-engineering landscape, mining live GitHub and primary sources. The run catalogued **216 deduplicated, URL-verified repositories**, **222 insights**, and **134 evidence-backed contradictions**, and mapped every retained finding to at least one of the 13 `system-deep-loop` subsystems (all 13 covered).

The single most important structural finding: **the wider ecosystem has already solved, formally, most of the hard problems `system-deep-loop`'s runtime faces — but the solutions live in adjacent fields** (durable-execution engines, stream processors, workflow schedulers, RL training frameworks, eval/red-team harnesses) that agent-framework surveys rarely connect to loop control. The highest-leverage improvements are therefore *cross-domain imports*, not agent-framework mimicry.

Five load-bearing takeaways (each expanded below and grounded in §15 contradictions):

1. **A stop decision on "semantic stability" alone is unsafe** — a loop can converge to a *stable but wrong* answer. Termination must fuse a quality/critic/execution signal with the novelty signal, and the *bound must cover the entire feedback path* (retries, handoffs, tool re-entry), not just a global `max-iterations`.
2. **A checkpoint is not a safe resume boundary without a side-effect receipt.** LangGraph re-executes post-checkpoint LLM/API calls on resume; Temporal/Restate reuse recorded history. Encode replay semantics *per event* (reuse / re-execute / compensate) and treat replay compatibility as a *versioned contract* (fingerprint code+graph+model+prompt+schema).
3. **More judges ≠ more reliability.** Nine frontier judges provided ~2 effective independent votes; the best single judge sometimes matched the panel. `deep-ai-council` needs an *effective-independence* gauge, not a seat count — and should separate the five evaluator roles (generator / detector / orchestrator / scorer / target) that it currently conflates into one "critic."
4. **Fan-in should be budget-aware and conditional**, not an always-wait barrier: skip redundant branches on agreement, expand or invoke the expensive judge on disagreement; and *deterministic scheduling does not imply deterministic result order* — store logical branch IDs and canonical indexes.
5. **Novelty/coverage should be tracked at the semantic-community level and drive broadening** (GraphRAG-style), with contradiction handled as a *versioned knowledge event* (Graphiti), not destructive deduplication.

Success criteria: 45/45 iterations completed (0 parse failures); 216 repos catalogued (target ≥10); 13/13 subsystems mapped (target ≥6). Full machine-readable catalogue: `research/findings-registry.json`; per-iteration evidence: `research/iterations/`.

---

## 2. Method & Provenance

**Loop shape.** Plan.md Shape B (sequential, findings-seeded generations) realized as a **hand-rolled driver** (`scratch/deep-loop-driver.cjs`), not the `/deep:research` fan-out loop. Reason (recorded in `decision-record.md` ADR-002): the fan-out codex executor builds its command without codex's top-level `--search` flag, so its leaves have no live web access and cannot mine real repositories — the core requirement of this phase — and patching that executor is out of scope (research-only, no writes outside the spec folder). The manual loop additionally enables true cross-iteration seeding.

**Executors (operator mandate).** GPT lineages via **cli-codex** only; GLM via **cli-opencode**.

| Lineage | Iterations | Model | Effort | Live search |
|---------|-----------|-------|--------|-------------|
| LUNA | 1–25 | `gpt-5.6-luna` (cli-codex) | `max` | codex top-level `--search` (`web_search` tool) |
| SOL | 26–35 | `gpt-5.6-sol` (cli-codex) | `ultra` | codex `--search` |
| GLM | 36–45 | `zai-coding-plan/glm-5.2` (cli-opencode) | `--variant max` | opencode `WebFetch` (observed self-correcting: guess→404→search→correct) |

**Non-convergence.** `stop-policy = max-iterations`, `convergence-mode = divergent`: each iteration received a compact digest of already-catalogued repos + covered angles + open threads, and was instructed to *broaden* (find new/adjacent/contradictory sources) rather than re-affirm. Yield stayed high through iteration 45 (the space did not saturate), confirming the space is genuinely rich.

**Dedup & verification.** A running `findings-registry.json` deduplicated repos by normalized URL/name. Reality was spot-checked by resolving repo URLs against GitHub (13/13 early + late LUNA, 6/6 SOL, 5/5 GLM sampled → all HTTP 200); GLM's tool trace shows it *self-corrected* hallucinated URLs against live fetch. Confidence distribution: **176 high / 34 med / 6 low**.

**Limits of method.** Star counts and recency are model-reported "GitHub snapshots" (directionally right, not audited). Insight de-duplication is normalized-text exact-match, so near-duplicate phrasings survive (visible as repeated insights across subsystems in §6–§14). Relevance curation for this document is orchestrator judgment, not a metric.

---

## 3. Scope & Success Criteria

**In scope (delivered):** one broadening research run at full depth; a catalogue of transferable repos with the lesson each teaches; mapping of insights to concrete `system-deep-loop` subsystems; this synthesis with a mandatory Eliminated Alternatives section. **Out of scope (held):** any code or skill change — this phase wrote nothing outside the spec folder. Ranking/prioritization is phase 002; concrete design is phase 003.

| Criterion | Target | Result |
|-----------|--------|--------|
| Iterations complete | 45 | **45/45** (0 parse failures) |
| Repos catalogued (link + lesson) | ≥10 | **216** |
| Distinct subsystems mapped | ≥6 | **13/13** |
| Synthesis incl. Eliminated Alternatives | yes | this document (§16) |
| Zero writes outside spec folder | yes | held (verified at close-out) |

---

## 4. The Loop-Engineering Landscape

The 216 repos cluster into eight source-families, each contributing a distinct lens on iteration:

1. **Agent frameworks** (LangGraph, AutoGen, CrewAI, smolagents, mastra, agentscope, openai-agents) — loop control *hooks*, checkpointing, HITL.
2. **Durable-execution / workflow engines** (Temporal, Restate, DBOS, Conductor, Airflow, Dagster, Prefect, Argo, Flyte) — the *formal* resume/retry/idempotency layer; the richest untapped vein.
3. **Stream processors & distributed runtimes** (Kafka, Flink, Spark, Ray, RisingWave) — consistent snapshots, exactly-once, determinism classes, incremental folds.
4. **Memory / RAG / knowledge-graph** (mem0, Graphiti, GraphRAG, LightRAG, HippoRAG, MemOS) — cross-iteration accumulation, novelty at community level, contradiction-as-version.
5. **Eval / red-team harnesses** (promptfoo, Inspect, OpenCompass, oss-fuzz, OSWorld, garak, PyRIT, agentdojo) — evaluator composition, regression-gated convergence, role separation.
6. **RL / optimization frameworks** (verl, OpenRLHF, trl, DSPy, TextGrad, Optuna, Vizier, agent-lightning) — proposal-evaluate-select loops, bounded staleness, pruning theory.
7. **Council / debate** (karpathy/llm-council, lm-council, ChatEval, weak-to-strong) — blind review, effective-independence, adjudication bias.
8. **Control-theory / ops loops** (kubernetes controller-runtime, changedetection.io) — reconcile-to-desired-state, observe→diff→act.

The clusters that agent-framework literature *under*-connects to loop control — durable execution (2), stream processing (3), and eval harnesses (5) — are where the sharpest, most formal, and most transferable lessons live.

---

## 5. Repository Catalogue (curated core)

The strongest ~35 of 216, grouped by the primary subsystem each informs (link + transferable lesson). Full 216-repo index: `findings-registry.json`; live dashboard: `research/deep-research-dashboard.md`.

### Loop control & termination — `runtime/convergence`
- **[kubernetes-sigs/controller-runtime](https://github.com/kubernetes-sigs/controller-runtime)** (~2.9k) — Model a loop iteration as a `Reconcile()` over externalized desired-state so any crash resumes by re-running against last-persisted state; `requeue-after` is the cadence knob.
- **[optuna/optuna](https://github.com/optuna/optuna)** (~14.5k) — Pruning as a first-class API (median, successive-halving, Hyperband, patient); warm-up + comparable-depth before pruning; bracket-level ≠ study-level termination.
- **[google/vizier](https://github.com/google/vizier)** (~1.7k) — Separate global incumbent-vs-history pruning from local trajectory stopping; reconstruct policy state from persisted trial history.
- **[strongdm/attractor](https://github.com/strongdm/attractor)** (~1.2k) — Make loop/oscillation detection an *observable control event* that steers the next turn; keep independent round/turn/abort bounds.
- **[huggingface/smolagents](https://github.com/huggingface/smolagents)** (~28.3k) — Expose step callbacks, planning checkpoints, replayable memory, and final-answer validators as stable loop-control hooks.

### State, checkpointing, replay — `runtime/state-jsonl-checkpointing` + `runtime/locks-recovery`
- **[langchain-ai/langgraph](https://github.com/langchain-ai/langgraph)** (~37.3k) — Parent-linked checkpoints + pending writes preserve completed parallel work, **but post-checkpoint LLM/API calls replay** — side effects need idempotent tasks or receipts.
- **[apache/kafka](https://github.com/apache/kafka)** (~33.2k) — State-write + output-emit + checkpoint-advance must be **one atomic transaction** or retries double-process (dual hot-store + changelog model).
- **[apache/flink](https://github.com/apache/flink)** (~26.2k) — Chandy-Lamport async barrier snapshotting = consistent cut across concurrent workers without stop-the-world (net-positive only at high partition counts).
- **[conductor-oss/conductor](https://github.com/conductor-oss/conductor)** (~32k) — Separate restart / rerun-from-task / retry-from-failure / compensation — not one generic "resume."
- **[hazelcast/hazelcast](https://github.com/hazelcast/hazelcast)** (~6.6k) — A lease must yield a **monotonic fencing epoch** that every state sink validates; the lock service alone cannot stop a paused stale worker.
- **[apache/airflow](https://github.com/apache/airflow)** (~46k) — Backfill = idempotent per-partition recovery (not monolithic replay); Pools = named per-resource semaphores; sensors must release their slot or the pool deadlocks.
- **[dagster-io/dagster](https://github.com/dagster-io/dagster)** (~15.8k) — Partition-keyed backfill over software-defined assets is the cleanest "recover only the stale slice" model; concurrency keys generalize pools.

### Fan-out / fan-in — `runtime/fan-out-fan-in`
- **[ray-project/ray](https://github.com/ray-project/ray)** (~43.2k) — Bound in-flight fan-out, process ready results incrementally, distinguish crash retries from application failures.
- **[apache/spark](https://github.com/apache/spark)** (~43.6k) — Attach a **determinism class** (DETERMINATE / UNORDERED / INDETERMINATE) to every fan-out stage; compare ordered vs multiset digests accordingly.
- **[langchain-ai/langchain](https://github.com/langchain-ai/langchain)** (~140k) — Bounded reduction tree: collapse branch summaries until they fit the reducer budget, checkpoint each collapse level, preserve provenance.
- **[agentscope-ai/agentscope](https://github.com/agentscope-ai/agentscope)** (~27k) — Keep fan-out transport separate from reduction: return branch envelopes first, then an explicit reducer with a deterministic ordering policy.
- **[verl-project/verl](https://github.com/verl-project/verl)** (~22.5k) — Async fan-out needs an explicit **staleness bound** (one-step window) + a transfer queue that buffers/orders stale samples before merge.

### Dedup, novelty, continuity — `runtime/dedup-novelty` + `runtime/continuity-threading`
- **[microsoft/graphrag](https://github.com/microsoft/graphrag)** (~34.4k) — Track coverage at **semantic-community level** and broaden toward underrepresented communities instead of flat top-k.
- **[getzep/graphiti](https://github.com/getzep/graphiti)** (~28.7k) — Treat contradiction/supersession as **versioned knowledge events**, not destructive dedup.
- **[mem0ai/mem0](https://github.com/mem0ai/mem0)** (~60.8k) — Separate append-only evidence accumulation from later conflict/validity resolution.
- **[HKUDS/LightRAG](https://github.com/HKUDS/LightRAG)** (~37.7k) — Accumulate per-iteration deltas by local-build-then-set-merge keyed on content; add a "rich-enough" saturation gate per node.
- **[dgtlmoon/changedetection.io](https://github.com/dgtlmoon/changedetection.io)** (~32.3k) — Observe→diff-vs-baseline→signal is the loop reduced to essence; intent-rule filtering ("only signal when X") is novelty-gating that cuts false-positive iterations.

### Budget / cost — `runtime/budget-cost`
- **[BerriAI/litellm](https://github.com/BerriAI/litellm)** (~53.6k) — Centralize pre-call enforcement, rolling budget windows, per-model ceilings, and cheaper fallback routing *outside* the loop body.
- **[pydantic/pydantic-ai](https://github.com/pydantic/pydantic-ai)** (~18.5k) — Hierarchical, resource-typed budgets with explicit soft-vs-hard exhaustion and parent-child aggregation.
- **[simplescaling/s1](https://github.com/simplescaling/s1)** (~6.7k) — Represent budget exhaustion as an explicit *stop / summarize / continue* state transition, not an opaque kill.

### Observability & gauges — `runtime/gauges-observability`
- **[langfuse/langfuse](https://github.com/langfuse/langfuse)** (~31.1k) — Keep execution records immutable; attach evaluator judgments *later* by trace/observation/session/run; aggregate by release+version.
- **[risingwavelabs/risingwave](https://github.com/risingwavelabs/risingwave)** (~9.2k) — Define each gauge/novelty-set as an **incremental stream-fold (O(delta) not O(total))** so observability cost is scale-independent of iteration count.
- **[eunomia-bpf/agentsight](https://github.com/eunomia-bpf/agentsight)** (~294) — Add semantic + side-effect telemetry planes so gauges distinguish productive progress from activity/retries/hidden subprocess work.

### Research / review / improvement / council / alignment — mode subsystems
- **[stanford-oval/storm](https://github.com/stanford-oval/storm)** (~30k) — Seed query families from distinct *perspectives*, then grounded follow-ups expand coverage before synthesis. (`deep-research`)
- **[promptfoo/promptfoo](https://github.com/promptfoo/promptfoo)** (~23.3k) — **Cheap deterministic checks before expensive judges**; gate promotion with weighted thresholds; persist grader evidence. (`deep-review`)
- **[google/oss-fuzz](https://github.com/google/oss-fuzz)** (~12.4k) — Industrial convergence = coverage-frontier plateau + **every fix gated by a regression re-run**, not the fixer's claim; findings become a test corpus. (`deep-review`)
- **[stanfordnlp/dspy](https://github.com/stanfordnlp/dspy)** (~36.1k) — Improvement as **propose → evaluate → update → full-validate → accept/reject** with holdouts and explicit trial budgets. (`deep-improvement`)
- **[OpenBMB/ChatDev](https://github.com/OpenBMB/ChatDev)** (~33.7k) — Run a second, slower **meta-improvement loop over the fan-out/routing policy itself**; give the experience store an elimination/decay gate, not only dedup. (`deep-improvement`)
- **[karpathy/llm-council](https://github.com/karpathy/llm-council)** (~22.5k) — Three-stage council: independent answers → **anonymous** cross-review/ranking → chairman synthesis; identity reveal outside adjudication. (`deep-ai-council`)
- **[NVIDIA/garak](https://github.com/NVIDIA/garak)** (~8.4k) — Clean 5-role separation generator/detector/orchestrator/scorer/target; conflating these into one "critic" is the evaluator-reliability root cause. (`deep-alignment`/`deep-review`)
- **[microsoft/PyRIT](https://github.com/microsoft/PyRIT)** (~4.1k) — Externalized-state checkpointing applied to the *critique* dimension: persisted memory of "which attacks already failed" = a novelty signal over the attack/search space. (`deep-alignment`)

---

## 6. `runtime/convergence` — findings & what to adopt

**Landscape:** 21 primary repos, 97 insights. The field has moved from "stop on stability" to **multi-signal, path-aware termination**.

**What to adopt:**
- Oscillation detection on **normalized action-observation events** (exact repeats, repeated errors, agent monologues, period-2 alternation as *distinct* gauges with separate thresholds) — OpenHands stuck-detector.
- A stop bound must cover the **entire repeated feedback path** (retries, handoffs, tool re-entry, state growth); a `max-iterations` elsewhere is insufficient.
- Fuse novelty with a **quality/critic/execution** signal before declaring convergence (see §15 contradiction #1).
- Borrow pruning theory (Optuna/Vizier): warm-up before pruning; separate incumbent-vs-history from local-trajectory stopping.

## 7. `runtime/state-jsonl-checkpointing` & `runtime/locks-recovery` — findings & what to adopt

**Landscape:** 30 + 7 primary repos, 80 + 58 insights — the richest and most formal vein, dominated by durable-execution engines and stream processors.

**What to adopt:**
- **Make the JSONL stream the canonical fact log**; derive current state, gauges, continuity, and novelty indexes as *deterministic projections*; compaction preserves parent sequence + projection hashes. (`system-deep-loop` already does event-sourced JSONL — this validates the architecture and sharpens the projection contract.)
- **Encode replay semantics per event**: reuse / pure re-execute / compensate-reconcile. A checkpoint without a side-effect receipt is *not* a safe resume boundary.
- **Replay compatibility as a versioned contract**: fingerprint code + graph + model + provider + tool + prompt + schema; reject / migrate / fork when it changes.
- **Fencing epochs** (Hazelcast CP): a lease must emit a monotonic epoch every state sink validates — locks alone don't stop a paused stale worker.
- **Recover the stale slice, not the whole run** (Airflow/Dagster partition backfill); separate restart / rerun-from-task / retry-from-failure / compensation (Conductor).

## 8. `runtime/fan-out-fan-in` — findings & what to adopt

**Landscape:** 27 primary repos, 73 insights.

**What to adopt:**
- **Budget-aware conditional fan-in**: on branch agreement, skip redundant branches; on disagreement/low-confidence, widen or invoke the expensive judge. Conditional widening, not fixed fan-out.
- **Deterministic scheduling ≠ deterministic order**: store logical branch IDs + canonical indexes; record arrival order separately (Spark/Beam/Ray/ADK all warn on this).
- **Explicit partial-failure policy**: strict / quorum / deadline / progressive; per-error retry allowlists; never silently convert a failed branch into missing data.
- **Algebraic reducer contract**: associativity + commutativity (+ idempotence under duplicate delivery), else reduce in stable order and model late results explicitly.
- **Bounded staleness** for any async fan-out (verl one-step window + transfer queue).

## 9. `runtime/dedup-novelty` & `runtime/continuity-threading` — findings & what to adopt

**Landscape:** 18 + 8 primary repos, 61 + 38 insights.

**What to adopt:**
- Coverage/novelty at **semantic-community level** (GraphRAG Leiden) to drive broadening toward underrepresented regions — directly relevant to this packet's own divergent mode.
- **Contradiction as a versioned event** (Graphiti validity windows), append-only accumulation with later conflict resolution (mem0), local-build-then-set-merge deltas + per-node saturation gate (LightRAG).
- Memory consolidation over destructive dedup (HippoRAG): cheaper indexing can beat heavier GraphRAG on continual learning — budget and quality aren't opposed when the consolidation mechanism is right.

## 10. `runtime/budget-cost` — findings & what to adopt

**Landscape:** 15 primary repos, 84 insights.

**What to adopt:** hierarchical resource-typed budgets with soft/hard exhaustion + parent-child aggregation (pydantic-ai); centralized pre-call enforcement + rolling windows + fallback routing outside the loop body (litellm); budget exhaustion as an explicit state transition (s1); charge replay/tool/state context as real cost and compress selectively while reporting quality loss (LLMLingua).

## 11. `runtime/gauges-observability` — findings & what to adopt

**Landscape:** 6 primary repos, 89 insights (highly cross-referenced).

**What to adopt:** immutable execution records with evaluator judgments attached *later* (langfuse); **incremental stream-fold gauges** so observability is O(delta) not O(total) per iteration (risingwave); semantic + side-effect telemetry planes to separate progress from activity (agentsight); typed span kinds + lineage IDs + redacted payload identity for replay/attribution (openinference).

## 12. `deep-research` — findings & what to adopt

**Landscape:** 23 primary repos, 44 insights.

**What to adopt:** perspective-seeded query families + grounded follow-ups before synthesis (STORM); tool observations as **hard evidence boundaries** in loop state so reflection can separate failed execution / bad assumptions / unsupported reasoning (ReAct); path-aware convergence for tree/graph reasoning (branch value + parent hash + evidence + merge provenance + cost survive fan-in); keep durable execution state separate from large research artifacts and context-management state (deepagents).

## 13. `deep-review` & `deep-improvement` — findings & what to adopt

**Landscape:** 21 + 18 primary repos, 43 + 44 insights.

**What to adopt:**
- **Cheap deterministic checks before expensive judges**, weighted-threshold promotion gates, persisted grader evidence (promptfoo); composable sequential evaluator DAG with per-stage short-circuit (OpenCompass CascadeEvaluator).
- **Regression-gated self-repair**: every fix proven by a re-run, not the fixer's claim; accumulated findings = a growing test corpus (oss-fuzz); verify externally observable state/artifacts, not the final textual answer (OSWorld).
- **Keep raw judge + step-level scores before reduction** so disagreement/drift stay observable (Inspect multiple-scorers).
- Improvement as a typed state machine (propose/score/update/full-validate/accept-reject) with holdouts (DSPy); **separate reflector and curator** roles, apply incremental deltas with helpful/harmful evidence + dedup metadata (ACE); own scoring in the evaluated environment, not the loop driver (trl).

## 14. `deep-ai-council` & `deep-alignment` — findings & what to adopt

**Landscape:** 18 + 4 primary repos, 34 + 24 insights.

**What to adopt:**
- **Effective-independence gauge**, not seat count: many judges share correlated errors (~2 effective votes from 9). Estimate effective judge count from behavioral independence + marginal utility.
- **Blind peer review as a separate durable stage**, identity revealed outside adjudication (llm-council); seats need explicit traits + structured evidence before scoring (ChatEval); seat selection as experimental design measured by info-gain-per-cost (lm-council).
- **Consensus is not sufficient adjudication** — debate amplifies position/verbosity/bandwagon bias; meta-judge protocols resist differently.
- **5-role separation** generator/detector/orchestrator/scorer/target (garak); score task-utility and safety **independently** (agentdojo); persist "which attacks/critiques already failed" as a novelty signal over the search space (PyRIT).

---

## 15. Contradictions & Tensions (evidence-backed)

The sharpest disagreements the run surfaced (134 total; the load-bearing subset). Each is a *design fork* phase 003 must resolve.

1. **"Semantic stability ⇒ converged"** vs. a loop can converge *stable-but-wrong*; semantic stopping needs quality/critic/execution/confidence signals. *(arXiv:2606.27009)*
2. **"A global iteration/token cap is adequate termination"** vs. caps are progress-blind and may not cover the actual repeated feedback path. *(arXiv:2607.01641)*
3. **"More iterations/branches are monotonically better"** vs. most refinements finish in 1–2 rounds (MATA); extra mutations create churn absent non-regression gates (GEPA-Lite).
4. **"A checkpoint prevents duplicate work on resume"** vs. only with completed-output/side-effect receipts; LangGraph re-executes post-checkpoint calls, Temporal/Restate reuse history.
5. **"Exactly-once workflow ⇒ exactly-once external effects"** vs. exactly-once is the *orchestration* layer; external APIs still need idempotency keys / receipts / compensation.
6. **"A current snapshot suffices for long-running loops"** vs. replay depends on code+schema compatibility; positional replay can bind cached results to the wrong call after graph edits.
7. **"Fan-in must wait for every branch"** vs. early/late emission (Beam) and incremental ready-branch processing (Ray) are valid closure modes; all-branches barrier is only one.
8. **"Deterministic parallel execution ⇒ deterministic aggregate output"** vs. result order is often nondeterministic; store logical branch IDs, record arrival order separately.
9. **"Retries are a transparent reliability layer"** vs. Ray doesn't retry app exceptions by default; multiple user-code invocations demand idempotence/receipts.
10. **"More judges ⇒ more reliability"** vs. 9 frontier judges ≈ 2 effective independent votes; best single judge sometimes matched the panel. *(arXiv:2605.29800)*
11. **"A fluent NL critique is a sufficient repair signal"** vs. critiques are often ineffective/style-focused and can induce answer flips (JETTS); Self-Refine gains are task-dependent.
12. **"A rubric/reference answer makes LLM judging reliable"** vs. rubrics help but don't remove long-form instability, position bias, or objective-correctness failures.

---

## 16. Eliminated Alternatives

Candidates considered but **not** recommended for the core catalogue or for adoption, with the reason (per the phase contract: record rather than pad):

- **Treating a general-purpose data engine as a loop primitive** — `apache/spark` (~43.6k) and `apache/kafka` (~33.2k) appear in the catalogue *only* for a single transferable idea each (determinism classes; transactional state+emit+commit). Adopting their runtimes wholesale is a category error: they are heavyweight distributed-data systems, not agent-loop engines. Import the *concept*, not the dependency.
- **Coupling the runtime to an archived project** — `microsoft/onefuzz` (ARCHIVED Nov 2023) teaches the closed-loop triage/dedup/reproducible-finding contract, but its own abandonment is the lesson: borrow the architecture, never couple `system-deep-loop`'s runtime to an unmaintained external dependency.
- **"Reflection everywhere" as a default** — Reflexion/Self-Refine gains are task-dependent and critiques can degrade answers (contradictions #11); reflection should be *gated* (typed, scoped memory candidate + explicit promotion decision), not an unconditional loop stage.
- **Maximizing council seat count** — refuted by the effective-independence finding (#10); more seats mostly add correlated cost. Eliminated in favor of diversity/independence measurement.
- **Barrier-only fan-in and fixed fan-out width** — eliminated in favor of conditional, budget-aware widening (#7).
- **6 low-confidence repos** (`findings-registry.json` → `confidence:"low"`) are held out of the core catalogue pending verification; they remain in the machine-readable index for phase 002 triage, not cited as evidence here.
- **The `--search`-less fan-out path itself** — eliminated as the execution vehicle for this phase (ADR-002): without live search the loop cannot mine external repos, which is the entire point.

---

## 17. Recommendations, Open Questions & Confidence

### Highest-leverage adoptions for `system-deep-loop` (ranked, for phase 002/003)
1. **Multi-signal, path-covering termination** — fuse novelty with a quality/critic/execution gate; ensure the bound spans retries/handoffs/tool re-entry. *(convergence; contradictions #1,#2,#3)*
2. **Side-effect-receipt resume contract** — per-event replay semantics + versioned replay-compatibility fingerprint on the JSONL projection. *(state; #4,#5,#6)*
3. **Effective-independence for `deep-ai-council`** + 5-role evaluator separation (generator/detector/orchestrator/scorer/target). *(council/alignment; #10)*
4. **Conditional, budget-aware fan-in** + logical-branch-ID determinism + explicit partial-failure policy. *(fan-out; #7,#8,#9)*
5. **Cheap-checks-before-judges + regression-gated self-repair** for `deep-review`; keep raw pre-reduction scores. *(review; #11,#12)*
6. **Semantic-community novelty + contradiction-as-version** for dedup/continuity. *(dedup; drives divergent mode)*
7. **Incremental stream-fold gauges** + immutable-record/attach-judgment-later observability.
8. **Hierarchical typed budgets** enforced centrally, exhaustion as an explicit state transition.

### Open questions (for later phases)
- No repo formally connects **RL convergence theory** (regret bounds, sample complexity) to **LLM agent-loop termination** — a genuine gap and a possible original contribution.
- When does self-play / self-improvement **degenerate vs. converge**? The "zero-data" framing obscures the bootstrapping dependency.
- Which durable-execution guarantees survive the **nondeterminism of LLM steps**, and which break? (Temporal-style determinism assumptions are the fault line.)

### Confidence & limitations
High confidence in the *existence and relevance* of catalogued repos (URL-verified sample all resolved; 176/216 high-confidence). Medium confidence in reported star/recency figures (model-snapshot, unaudited). The insight/contradiction set is broad and evidence-linked but **not exhaustively re-verified against each primary source** — phase 002 should spot-audit the arXiv/doc citations before any load-bearing design decision rests on them. Relevance curation in §5–§14 is orchestrator judgment; the full 216-repo index in `findings-registry.json` is the auditable ground truth.

---

*Generated by the manual deep-loop research driver (Shape B). Provenance: `research/deep-research-config.json`, `research/deep-research-state.jsonl` (45 iterations), `research/iterations/iteration-001.md … iteration-045.md`, `research/findings-registry.json`.*

---

<!-- ANCHOR:sources -->
## 18. Sources & Provenance

- **Full machine-readable catalogue** (216 repos with links, transferable lessons, per-repo `maps_to`/`confidence`): `research/findings-registry.json`.
- **Representative primary sources** (full set in §5–§14): [kubernetes-sigs/controller-runtime](https://github.com/kubernetes-sigs/controller-runtime), [optuna/optuna](https://github.com/optuna/optuna), [huggingface/smolagents](https://github.com/huggingface/smolagents), [google/vizier](https://github.com/google/vizier).
- **Per-iteration provenance**: `research/iterations/iteration-001.md … iteration-045.md`; run state in `research/deep-research-state.jsonl` (45 lines).
- source: public GitHub + arXiv/doc URLs captured per finding; URL sample HTTP 200-verified (see §15 citations).
<!-- /ANCHOR:sources -->
