# Iteration 16: Blog Corpus Grounding Pass A

## Focus

This iteration grounds the graph-architecture decisions from studies 1–2 and iterations 3–15 against the first six blog posts in lexical filename order. It accepts concrete topology, contract, evaluation, and retrieval guidance only where the source supports a named decision or bounded refinement, separates examples and marketing from evidence, and tests recommendations against checked-in GraphARC mechanisms.

## Findings

1. **Explicit data dependencies, bounded node contracts, and deterministic reducers confirm the compiled-graph design, but topology remains authority-neutral — CONFIRM studies 1–2 and iterations 3–5 and 15.** Posts 2, 3, 4, and 6 define an edge as an actual data dependency and recommend schema-bounded nodes plus code-owned reduction. That guides proposal compilation and scheduling; it does not authorize a transition, prove an output, or confer capability. GraphARC's proposal/admission/materialization layers substantially instantiate topology and contracts, while iteration 15's 036 gateway remains the mutation boundary. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/From Loops to Graphs: The Next Paradigm in AI Agent Engineering.md:30-58] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering Roadmap.md:22-88] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/planner/materialize.py:239-335]

2. **Evaluation must inspect outcomes, trajectories, and components with external answer keys and negative controls; judge confidence is evidence, never authorization — EXTEND iteration 10 and REFINE iteration 15.** Post 1 distinguishes deterministic checks from model judgments, recommends a different judge family or panel, pins judge/rubric versions, and requires external grounding and negative controls. It also keeps irreversible production writes closed regardless of score. This supports typed evaluation certificates and mutants, while contradicting any reading of majority-vote verifier panels in posts 3, 4, and 6 as truth or permission. GraphARC exposes policies, traces, and approval callbacks, but not a durable independently grounded evaluation authority. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Eval Engineering: build the gate that lets your agents merge without you (full 6-step course).md:14-39] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Eval Engineering: build the gate that lets your agents merge without you (full 6-step course).md:90-180] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/session/approval.py:1-6]

3. **Fan-out/fan-in guidance refines scheduling readiness, but one roadmap example violates closed observation by dropping failed branches — REFINE study 1 and iteration 13.** Posts 3, 4, and 6 separate pipeline stages from barriers and describe the diamond as fan-out, deterministic reduce, then synthesize. However, post 3's failed-result-to-null plus `filter(Boolean)` pattern silently changes the observed branch set. Post 4 later warns that silent failure invalidates the result and requires expected-versus-completed counts. Preserve a typed terminal result for every expected branch and let an admitted fan-in policy decide whether partial evidence is acceptable; absence is data. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering Roadmap.md:96-143] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering explained: what it is, when to use it and when not to.md:151-192] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering with Claude: How to Stop Running a Line and Start Running a Fleet.md:195-236]

4. **Resource separation is not evidence independence, and worktree isolation is not canonical write fencing — EXTEND iteration 14.** Posts 3, 4, and 6 use worktrees or separate directories to reduce parallel-writer collisions and warn that shared context destroys supposed independence. Filesystem isolation does not establish protected-resource ownership, a monotone fence, canonical commit order, or ancestor-wide budget capacity. GraphARC's local runtime budget and session state are likewise advisory; the 036 budget and fencing services remain required for state-changing work. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering Roadmap.md:195-207] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering explained: what it is, when to use it and when not to.md:151-192] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/runtime/budget.py:1-120]

5. **Generated workflows require the same compile, admission, seal, gate, and live revalidation path as hand-authored workflows — CONFIRM iterations 3–4 and 15.** The roadmap's suggestion that a model can inspect a request and save a runnable graph is useful only as proposal generation. A saved script or plausible topology is not proof of bounded cycles, allowed transitions, executable closure, capability, budget, or approval. GraphARC provides proposal/admission/materialization, but its ordinary `AdmissionResult` and materialized objects are not a durable unforgeable seal or 036 receipt. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering Roadmap.md:258-266] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/planner/admission.py:976-1012] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/planner/materialize.py:1-31]

6. **Knowledge-graph retrieval guidance adds useful evidence-shaping rules but does not justify replacing RAG, Graphene truth, or the 036 authority plane — REFINE study 2 and iteration 1.** Post 5's controlled predicates, entity normalization, evidence-backed merges, supported paths, temporal/contradiction relations, and prohibition on causal inference from correlation fit an evidence projection. The post also admits zero-shot construction is unreliable without schema and deduplication review. GraphARC is a work-graph runtime, not Microsoft GraphRAG, STORM, or a governed knowledge ledger; it can at most orchestrate extraction/query nodes. Retrieved paths remain provenance-bearing claims. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering replaced RAG at Microsoft, Stanford and Anthropic. Here's how it works.md:248-372] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:275-328]

7. **The corpus itself rejects universal graph adoption; applicability depends on real independence, governance need, and measured value — EXTEND iteration 15's non-applicability boundary.** Posts 2, 4, and 6 retain loops or simple harnesses for small, exploratory, tightly supervised, or truly sequential work. They warn that breadth is not judgment and graph hops compound error. A graph is warranted only when actual dependencies permit useful parallelism or explicit gates/subgraphs/recovery make control state clearer. Product latency, quality, and cost anecdotes remain hypotheses until reproduced against a pinned workload and baseline. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/From Loops to Graphs: The Next Paradigm in AI Agent Engineering.md:160-195] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering explained: what it is, when to use it and when not to.md:193-209] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering with Claude: How to Stop Running a Line and Start Running a Fleet.md:303-334]

## Six-Post Evidence Matrix

| # | Post | Supported delta | Unsupported or bounded claim | GraphARC fidelity |
|---|---|---|---|---|
| 1 | Eval Engineering | Extends iteration 10 with multi-level evaluation, versioned heterogeneous judges, answer keys, negative controls, and blast-radius gates | “At least 500 cases” lacks a repository-specific derivation; a green panel is not proof or production authority | **Partial:** traces/policies collect inputs, but no durable eval-certificate owner or direct 036 binding |
| 2 | From Loops to Graphs | Confirms explicit dependency graphs, real concurrency, controlled cycles, and hybrid graph/vector retrieval | “Graphs replace loops,” the local 3x result, and universal speedups are not portable; the Stanford-grant example is explicitly fabricated | **Partial:** work topology exists; governed knowledge retrieval is outside core GraphARC |
| 3 | Graph Engineering Roadmap | Confirms typed nodes/edges, reducers, diamonds, dedupe across all seen candidates, and pipeline/barrier choice | Null filtering violates complete evidence; majority survival is evaluation; generated scripts are not authority | **Strong for work shape, weak for governance:** durable gates, budgets, fences, and authority remain external |
| 4 | Graph Engineering explained | Adds false-independence, silent-failure, anchor, and when-not-to-use warnings; consistency is not verification | Exact latency and migration/revenue examples lack local methodology; prompt approval is not durable | **Partial:** diamonds/traces fit, branch closure and durable approval-to-036 linkage do not |
| 5 | Graph Engineering replaced RAG | Adds controlled predicates, entity resolution, provenance, contradiction/update relations, path support, and hybrid routing | “Replaced RAG,” “all moved,” “reality,” “every time,” and generalized 18%/85% claims exceed cited domains/configurations | **Low/directly out of scope:** GraphARC may orchestrate retrieval but is not a knowledge graph or fact store |
| 6 | Graph Engineering with Claude | Confirms diamonds, fresh-context review, bounded cycles, dedupe, stop guards, cost caps, and simple-loop fallback | “Every serious system” and near-universal fake-edge claims are rhetoric; budget/cap termination is `incomplete`, not convergence | **Partial:** work mechanics fit; local tiering, session state, and majority review provide no budget/mutation authority |

## Cross-Post Tensions

| Tension | Architecture resolution |
|---|---|
| Post 3 drops failed branches; posts 4 and 6 require visible expected/completed counts | Preserve one typed terminal observation per expected branch; partial acceptance must name missing/failed identities |
| Posts 3, 4, and 6 use fresh/majority verifier panels; post 1 requires external grounding and negative controls | Panels are evidence producers; deterministic facts, pinned rubrics/models, answer keys, mutants, and a separate gate decide promotion |
| Posts 2, 4, and 6 announce a graph paradigm while retaining loops/sequences in their own decision rules | Choose topology from actual dependencies and control needs; chains and loops remain valid when their conditions hold |
| Post 5 frames knowledge graphs as RAG replacement while requiring human schema/dedupe review | Route by query shape, retain vector lookup, and make graph extraction a versioned provenance-bearing projection |
| Cycles stop on dry rounds, budget, or iteration cap | Only a witnessed dry fixed point may mean convergence; budget/cap/time termination records `incomplete` or `exhausted` |
| Worktrees are offered as write isolation | Worktrees reduce local collisions; canonical mutation still needs write sets, ordered claims, fences, authorization, and receipts |

## Unsupported Marketing and Generalization Register

- Post 2 explicitly labels its Stanford grant amount as fabricated; it demonstrates output shape, not adoption or performance.
- The 3x concurrency result, five-minutes-to-fifteen-seconds example, 18% quality gain, 85% cost reduction, migration counts, and revenue figures lack a common workload, baseline, and local reproduction.
- “Graphs replace loops,” “replaced RAG,” “right graph beats a bigger model every time,” “all moved,” and “every serious system” conflict with the posts' own hybrid and when-not-to-use sections.
- Microsoft GraphRAG, Stanford/STORM, Anthropic, and Claude examples show related patterns, not that their mechanism, quality, or governance exists in GraphARC.
- A callback, confirmation prompt, majority vote, high score, or saved script is a workflow device—not proof of authorization, append, budget ownership, fencing, or effect completion.

## Concrete GraphARC Fidelity Test

| Blog governance claim | GraphARC mechanism | Verdict |
|---|---|---|
| Explicit bounded node/edge contracts | Proposal/admission/materialization validate topology, schemas, transitions, and construction | **Faithful for static work shape** |
| Cycles require dedupe and hard limits | Admission/runtime expose bounded transitions and local budget/trace controls | **Partial:** authoritative budget settlement and terminal classification remain external |
| Human approval gates risky work | Session callback and policy approval states | **Partial/unfaithful at authority boundary:** not a durable subject-bound 036 receipt |
| Parallel writers need isolation | Caller can arrange separate contexts/worktrees | **Insufficient:** no canonical claim, monotone fence, or fenced append follows |
| Evaluators make promotion reliable | Policies and trace/replay provide observations | **Insufficient:** no external answer key, negative controls, independent certificate, or authority binding |
| Knowledge graphs preserve provenance/contradiction | Experimental memory/evidence relationships | **Insufficient for truth:** GraphARC owns neither entity resolution nor canonical fact history/admission |
| Generated workflows run after design | Planner generates and materializes an admitted proposal | **Partial:** materialized objects lack the durable seal/resolver/gateway/fence chain |

## Explicit When-Not-to-Use Boundary

- Use a function, harness, chain, or loop for one bounded transformation, small prompt/tool work, or truly sequential dependencies.
- Do not fan out tightly supervised exploratory work when every intermediate needs human review and parallelism only increases review load.
- Do not call branches independent when they share mutable files, budgets, credentials, rate limits, or canonical state without declared resources and fencing.
- Do not use a model-generated knowledge graph for exact lookup, high-volume simple retrieval, or authoritative facts without governed schema, entity resolution, provenance, contradiction, and time semantics.
- Prefer deterministic assertions, types, model checking, or executable tests over verifier panels where they establish the property directly.
- Never convert topology, evaluation confidence, or local approval into permission for irreversible writes or wider capability/budget/data access.
- Require a representative baseline, full cost accounting, visible failures, and comparison with a simpler alternative before adopting graph complexity.

## Ruled Out

- Majority vote or fresh-context evaluation as truth or mutation authority.
- Silent removal of failed/missing fan-out results.
- Worktree/process separation as a replacement for claims, leases, fences, and canonical append.
- Graph retrieval as a universal RAG replacement or source of canonical facts.
- A generated script, trace, local meter, or callback as proof of the iteration-15 authority protocol.
- Budget exhaustion or maximum iterations as convergence.

## Dead Ends

- Posts 3, 4, and 6 substantially duplicate one claim family; repetition was not counted as independent evidence.
- Product and organization references lacked reproducible local methodology and were excluded from performance, cutover, and authority decisions.

## Edge Cases

- Ambiguous input: “First six” used the prompt's exact lexical-order list, not filesystem enumeration or publication date.
- Contradictory evidence: Post 3's null filtering conflicts with post 4's silent-failure warning; closed observation wins because it preserves evidence for later policy.
- Missing dependencies: No local benchmark reproduces the latency, quality, cost, migration, or revenue figures.
- Partial success: Five planned research actions plus a bounded recovery read covered all six sources and targeted GraphARC anchors; an incorrect recovery path was resolved by exact filename search and made no write.

## Sources Consulted

1. `specs/system-deep-loop/037-graph-engineering/context/blog-posts/Eval Engineering: build the gate that lets your agents merge without you (full 6-step course).md`
2. `specs/system-deep-loop/037-graph-engineering/context/blog-posts/From Loops to Graphs: The Next Paradigm in AI Agent Engineering.md`
3. `specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering Roadmap.md`
4. `specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering explained: what it is, when to use it and when not to.md`
5. `specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering replaced RAG at Microsoft, Stanford and Anthropic. Here's how it works.md`
6. `specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering with Claude: How to Stop Running a Line and Start Running a Fleet.md`
7. `specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/{planner,session,runtime,gateway,memory,observe}/`
8. `specs/system-deep-loop/037-graph-engineering/{001-agent-swarms,002-graphene-main}/research/research.md`
9. Graph-arch lineage iterations 3–15

## Assessment

- New information ratio: 0.64
- Calculation: 2 fully new findings (closed-observation contradiction and knowledge-graph/GraphARC fidelity boundary) and 5 partially new findings (topology, evaluation, isolation, generation, applicability): `(2 + 0.5 × 5) / 7 = 0.643`, rounded to `0.64`.
- Questions addressed: Which claims in posts 1–6 confirm, refine, extend, or contradict existing decisions, and which GraphARC mechanisms instantiate them?
- Questions answered: The six-post matrix, tensions, unsupported-claim register, fidelity test, and when-not-to-use boundary are complete for pass A.

## Reflection

- What worked and why: Comparing claim families across duplicated posts exposed internal corrections and prevented repetition from counting as independent evidence.
- What did not work and why: Named organizations and headline metrics lacked reproducible methods, so they could not support performance, cutover, or authority decisions.
- What I would do differently: Classify each later claim at capture time as mechanism, measured evidence, example, or marketing before mapping it to the owner/fact matrix.

## Route Proof

- Resolved route: `mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true`
- Agent definition loaded: `.opencode/agents/deep-research.md`
- Iteration/run: `16/16`
- Executor: `cli-codex/gpt-5.6-sol/high/fast`
- Research actions: 5 plus one bounded source-recovery read; no subagents.
- Stop policy: continue to maximum iteration count; convergence telemetry does not stop the lineage.

## Recommended Next Focus

Blog corpus synthesis, posts 7–12. Reuse the mechanism/evidence/example/marketing classification, test claims against the iteration-15 owner/fact matrix and this pass's closed-observation and knowledge-graph boundaries, and identify any reproducible evidence rather than product generalization.
