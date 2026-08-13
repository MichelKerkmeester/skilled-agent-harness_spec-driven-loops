# Iteration 17: Blog Corpus Grounding Pass B

## Focus

This iteration synthesizes the remaining six blog files in the prompt's lexical order against studies 1–2 and iterations 3–16. It distinguishes work orchestration, nested verification loops, harness controls, and knowledge retrieval rather than treating every use of “graph” as one architecture. Each claim is classified as a source-backed delta or unsupported generalization and checked against concrete GraphARC boundaries.

## Findings

1. **Harness, loop, and graph failures have different owners; GraphARC expresses candidate control flow but does not decide what is authorized — EXTEND iteration 15 and REFINE iteration 16.** Post 2 gives the cleanest diagnostic: the harness owns environment/capability controls, the loop owns evidence-producing correction, and the graph owns explicit flow. Its phrase “what is allowed to happen next” is too broad for this architecture: a graph edge may constrain or propose the next transition, but 036 alone authorizes mutation. GraphARC faithfully bounds dynamic routing to admitted edges, yet its materializer itself says a proposal fingerprint has no signature check; admission is not authorization. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Harness, Loop, or Graph? Building Reliable Agent Systems at the Right Layer.md:12-28] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Harness, Loop, or Graph? Building Reliable Agent Systems at the Right Layer.md:52-72] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/planner/materialize.py:35-74]

2. **The org-graph/work-graph split confirms study 1, but runtime “self-rewrite” crosses two different governance classes — REFINE iteration 1 and EXTEND iterations 3–6.** Post 1 separates stable role/zone ownership from ephemeral task structure. Spawning, cancelling, or reordering task nodes can be a new immutable work-graph proposal followed by admission. Adding tool access to an existing node is different: it changes capability and must re-enter identity, policy, approval, budget, and 036 authorization rather than being normalized as a topology edit. Persistent role context is also not canonical memory merely because it belongs to a long-lived agent. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering: After Loops, This Is How You Wire Multi-Agent Orgs.md:124-170] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering: After Loops, This Is How You Wire Multi-Agent Orgs.md:174-185] [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:5-20]

3. **Builder–Judge–Manager is a useful evidence loop only when the judge has external ground truth and caps terminate as incomplete/escalated — CONFIRM iterations 10 and 16 and REFINE iteration 13.** Post 3 requires structured handoffs, per-check verdicts, actual source/tests, a hard revision ceiling, measurable criteria, and cost/time caps. Its unsolvable-task, confidently-wrong, same-model-blind-spot, and runaway-cost tests extend the mutant corpus. However, Manager `PASS` is not a mutation receipt, and maximum revision/time/cost termination is not convergence. Scaling concurrent loops also requires an aggregate authoritative budget, not per-loop dashboards alone. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/How to Build a Self-Correcting AI Loop That Catches Its Own Mistakes Before You See Them.md:21-37] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/How to Build a Self-Correcting AI Loop That Catches Its Own Mistakes Before You See Them.md:63-99] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/How to Build a Self-Correcting AI Loop That Catches Its Own Mistakes Before You See Them.md:112-136] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/How to Build a Self-Correcting AI Loop That Catches Its Own Mistakes Before You See Them.md:149-158]

4. **The alpha-model post supplies a concrete fan-out/gated-fan-in fixture and an unusually honest advisory-budget boundary, but not evidence of tradable alpha or safe financial autonomy — CONFIRM iteration 9 and EXTEND iteration 16's marketing register.** Seven factor calculations followed by validation, regime audit, construction, and decomposition are a useful typed fixture. The author later admits the advertised `$30/run` cap is self-reported and advisory because no real-time cost primitive exists. GraphARC's local meter is similarly useful at node boundaries but cannot provide hierarchical reservation or provider settlement. Claims that every serious fund uses the stated stack, that 80% of candidates are rejected, or that a solo builder will obtain a tradable signal in a month are unsupported here; statistical gates also omit data lineage, leakage, execution, market-impact, and risk authority. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/How to Use Graph Engineering to Build a Multi-Factor Alpha Model.md:133-204] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/How to Use Graph Engineering to Build a Multi-Factor Alpha Model.md:325-361] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/How to Use Graph Engineering to Build a Multi-Factor Alpha Model.md:381-433] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/runtime/budget.py:129-308]

5. **Clean context and return-first design improve epistemic isolation, but they do not establish resource isolation or authority — REFINE iteration 14 and CONFIRM pass A.** Post 5 usefully requires the child to start with fresh context, receive one slice, and return a predeclared shape; it prefers deterministic verification and sandboxing. Those controls reduce contamination and token growth. They do not prove independent data provenance, prevent shared-file races, allocate global budget, or fence a canonical commit. Its offline 218-byte/9-test demo proves only that example's context accounting, not production cost or reliability. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/LOOP ⭢ GRAPH ⭢ HARNESS: build the whole pipeline in one sitting.md:34-55] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/LOOP ⭢ GRAPH ⭢ HARNESS: build the whole pipeline in one sitting.md:75-99] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/LOOP ⭢ GRAPH ⭢ HARNESS: build the whole pipeline in one sitting.md:101-149]

6. **Pass B resolves the term collision: GraphARC is a work-graph runtime, not a graph-of-loops truth system or GraphRAG store — REFINE study 2 and iteration 16.** Post 6 explicitly identifies orchestration graphs, graphs of supervising loops, and graph-structured knowledge/memory as three competing meanings. Its strongest retrieval deltas are small typed vocabularies, temporal supersession, hybrid routing, and the multiplicative risk of entity-resolution errors across hops. Its claim that wikilinks solve entity resolution “by construction” is too strong: a link resolves a chosen identifier but not aliases, duplicate identities, conflicting claims, or ontology evolution. GraphARC has work topology, trace/replay, and bounded materialization; the exact implementation inventory contains no governed knowledge-graph store. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/What is Graph Engineering.md:100-142] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/What is Graph Engineering.md:144-180] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/What is Graph Engineering.md:184-233] [INFERENCE: exact GraphARC file inventory plus planner/materialize.py and observe/replay.py show work execution and observational replay, not canonical entity/relationship admission]

7. **Architecture should follow observed failure ownership and stable work structure, not diagram-first enthusiasm — EXTEND iteration 16's non-applicability rule.** Posts 1 and 2 acknowledge graph design overhead, broader failure surfaces, missing-edge risks, and orchestration theater. Start with the smallest harness and objective loop, use traces to discover stable dependencies, then formalize a graph only when specialists, parallelism, gates, recovery, or pause/resume require explicit state. Traces are design evidence and debugging projections, not authority. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering: After Loops, This Is How You Wire Multi-Agent Orgs.md:174-189] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Harness, Loop, or Graph? Building Reliable Agent Systems at the Right Layer.md:92-118] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/observe/replay.py:1-34]

## Six-Post Evidence Matrix

| # | Post | Source-backed delta | Unsupported/generalized claim | GraphARC fidelity |
|---|---|---|---|---|
| 1 | Graph Engineering: After Loops | Confirms distinct org/work graphs, explicit ownership/handoffs/failure paths, and harness needs | Viral view counts, 92%-quality/63%-price result, universal “loops are over,” and long-lived specialists automatically accumulating sound knowledge | **Partial:** proposal/materialization model work graphs; no independent canonical org-memory owner, capability-safe self-rewrite, or 036 authority |
| 2 | Harness, Loop, or Graph? | Adds failure-owner diagnosis and a minimal-layer adoption rule; confirms graph-around-loop composition | “Graph determines what is allowed next” conflates declared flow with authorization | **Strong for explicit flow; partial for governance:** GraphARC constrains routes, but harness/policy/session controls are not durable mutation authority |
| 3 | Self-Correcting AI Loop | Adds external-ground-truth handoffs, per-check verdicts, hard stop logic, four stress mutants, and aggregate scaling concerns | “Every working system” reduces to three roles and “trust unattended output” overstate what these mechanisms prove | **Partial:** loops, schemas, budgets, traces fit; independent ground truth, eval certificates, hierarchical budget, and authorization remain integration obligations |
| 4 | Multi-Factor Alpha Model | Provides a rich parallel/static fixture and explicit admission that budget enforcement is advisory | Hedge-fund equivalence, universal factor claims, 80% rejection, one-month tradable alpha, hard `$30` language, and graph immunity to pipeline failure | **Mechanically plausible, governance-incomplete:** static DAG/local meter fit; no hard reservation, data/effect authority, financial risk gate, or trade receipt |
| 5 | LOOP ⭢ GRAPH ⭢ HARNESS | Adds return-first boundaries, fresh child context, deterministic verification, sandboxing, and a runnable toy negative control | 218-byte context and 9 tests do not establish general cost/reliability; clean context does not imply independent evidence or isolated writes | **Partial:** typed returns, input copying, runtime checks, and traces align; canonical fencing and authority do not follow |
| 6 | What is Graph Engineering | Explicitly separates three graph meanings; adds hybrid routing, typed temporal edges, independent-eval warnings, and hop-error compounding | “Only graph traversal” follows chains, wikilinks solve entity resolution, “80% of an index,” and “exists nowhere” are overbroad or time-sensitive | **Low for knowledge-graph claims:** GraphARC implements work orchestration and observational replay, not governed GraphRAG/memory truth |

## Cross-Post Tensions

| Tension | Resolution |
|---|---|
| Post 1 says loops are the prior era; posts 2, 3, and 5 put loops inside graphs and retain them for bounded correction | Loops and graphs are compositional, not chronological replacements; choose the smallest layer that owns the failure |
| Post 2 says graphs decide what is allowed next; posts 3 and 5 rely on verifiers/managers; iteration 15 reserves authorization to 036 | Graphs declare candidate transitions and gating prerequisites; evidence and 036 authorization decide whether a mutation may occur |
| Post 1's dynamic org may add tool access during work; post 2 says capability belongs to the harness | Treat topology change and capability change separately; tool-access expansion requires a new governed authority path |
| Post 3 favors independent ground truth; posts 1 and 4 use stronger/different models as validators | Model diversity reduces correlated error but is not ground truth; retain deterministic checks, source evidence, mutants, and human gates |
| Post 4 advertises a `$30` cap, then admits it is advisory | Preserve the later implementation disclosure; local self-report is a quote/alert, never an authoritative reservation or hard ceiling |
| Post 5 treats fresh context as isolation; post 1 proposes long-lived context-rich specialists | Use fresh execution context for evidence independence while retrieving only versioned role knowledge; neither context policy owns canonical truth |
| Post 6 emphasizes knowledge graphs; the other five primarily mean work orchestration | Maintain distinct schemas and owners; never transfer a retrieval edge into a work dependency or authorization fact without explicit admission |

## Interaction With Pass A

- Pass A's “topology is authority-neutral” is strengthened by pass B's layer-owner model: graphs expose flow, harnesses constrain capability, loops produce evidence, and 036 authorizes mutation.
- Pass A's closed-observation rule gains concrete loop mutants: unsolvable task, confidently wrong output, shared-model blind spot, cost runaway, and test modification.
- Pass A's worktree-not-fencing boundary is generalized: fresh context, sandboxing, separate roles, and process isolation also do not establish canonical resource ownership.
- Pass A's hybrid-retrieval conclusion is reinforced by independent-evaluation warnings and per-hop entity-resolution decay; pass B additionally rejects the claim that wikilinks alone solve identity.
- Pass A's incomplete/exhausted terminal semantics are confirmed: hard iteration, time, and budget caps stop and escalate; they never mean verified convergence.
- Pass A's generated-workflow boundary gains a specific mutation split: a new task node may be a proposal, while new tool access is capability escalation requiring renewed authorization.

## Unsupported Marketing and Generalization Register

- **Trend claims:** views, “dominant topic,” named-community adoption, “loops are over,” and “next layer” establish popularity at most, not architecture suitability.
- **Product benchmarks:** 92% quality/63% price, Slate runtimes, context-byte counts, GraphRAG cost, and retrieval scores lack one locally reproduced workload and cannot set promotion thresholds.
- **Financial claims:** hedge-fund equivalence, universal factor usage, rejection rates, compounding research, and promised tradable signals are not supported by governed data, out-of-sample protocol, execution cost, or risk receipts.
- **Reliability absolutes:** graphs do not eliminate pipeline failure; isolated nodes, retries, and diagrams merely change failure shape. A stopped dependency, stale state, or poisoned join can still invalidate downstream work.
- **Knowledge absolutes:** relational databases, explicit links, and programmatic joins can follow chains; graph traversal is not the only mechanism. Wikilinks resolve authored references, not the complete entity-resolution problem.
- **Approval inflation:** diagram review, a Manager pass, fresh-context checker, or stronger model remains evidence/proposal state rather than authorization.

## Concrete GraphARC Fidelity Test

| Pass-B mechanism | GraphARC implementation | Fidelity verdict |
|---|---|---|
| Static work graph with bounded dynamic routing | Materializer wires static edges and confines dynamic targets to admitted outgoing destinations | **Faithful for work topology** |
| Org graph with durable role context | Node registry/policy can name kinds and constraints | **Partial:** no canonical long-lived role-memory truth or organization-ledger ownership follows |
| Self-rewriting graph | New proposals can be checked and materialized | **Partial:** ordinary objects lack durable seal/authorization; capability expansion cannot be a graph-local rewrite |
| Builder/Judge/Manager with hard stops | Nodes, conditional edges, budgets, and trace events can encode the pattern | **Partial:** external answer keys, eval certificates, aggregate reservations, and human authority are not guaranteed |
| Fresh child context and return-first contract | Runtime isolation, typed state/write declarations, and schemas constrain node exchange | **Partial:** context isolation does not fence shared resources or prove source independence |
| Hard monetary budget | `BudgetMeter` and `SpendMeter` meter local reported usage | **Not faithful as a hard distributed cap:** no ancestor reservation/provider settlement follows from local accounting |
| Canonical replay/evidence | File-first trace and replay reconstruct observed path/deltas and explicitly expose reducer/truncation limits | **Observational only:** useful debugging, never ledger truth or authorization |
| GraphRAG/temporal knowledge graph | No governed knowledge-graph store appears in the exact GraphARC implementation inventory | **Not implemented:** work topology and trace relationships are different graph kinds |

## Explicit When-Not-to-Use Boundary

- Do not add a graph when the defect belongs to unsafe tools, missing permissions, stale state, weak sandboxing, or absent auditability; repair the harness.
- Do not add a graph when one bounded attempt is often close and an objective retry loop resolves it; build the verifier and hard stop first.
- Do not automate evaluation when no external ground truth or independently checkable criterion can be named; escalate judgment rather than looping on opinion.
- Do not dynamically rewrite capability, credentials, data access, approval policy, or budget as if it were ordinary work topology.
- Do not use a work graph as a knowledge graph, or use a knowledge traversal path as canonical causation, identity, dependency, or authorization.
- Do not use GraphRAG for simple lookup/high-volume cost-sensitive queries where vector/keyword/relational retrieval is adequate.
- Do not deploy autonomous financial graphs from statistical thresholds alone; require governed data lineage, leakage controls, transaction-cost/risk modeling, effect authorization, and human accountability.
- Do not scale concurrent loops from one demo; first measure failure/escalation rates, worst-case aggregate cost, and shared-resource behavior.
- Do not formalize a large graph before traces show stable work boundaries; architecture theater freezes guesses into control flow.

## Ruled Out

- Treating graph, loop, and harness as successive replacements rather than nested layers with distinct failure ownership.
- Allowing a dynamic work graph to grant itself tools, credentials, roles, or wider budget.
- Using model diversity, diagram approval, or Manager `PASS` as ground truth or mutation authority.
- Treating local reported cost as a hard budget or cap termination as convergence.
- Equating fresh context with independent evidence, filesystem isolation, or fencing.
- Equating work-graph edges, retrieval edges, causal claims, and authorization facts.
- Adopting an autonomous alpha graph on the blog's performance assertions.

## Dead Ends

- Posts 1, 3, and 4 repeat pass-A maker/checker and fan-out claims; only the new layer ownership, stress mutants, capability-rewrite boundary, and finance fixture were retained as deltas.
- A targeted GraphARC inventory requested `memory/graph.py`, which does not exist. The narrower implementation inventory and existing materializer/replay sources established that knowledge-graph storage is outside GraphARC rather than inventing a replacement path.

## Edge Cases

- Ambiguous input: “graph engineering” denotes three incompatible graph kinds in post 6; this iteration keeps work, supervision, and knowledge schemas separate.
- Contradictory evidence: Post 4 first describes a `$30/run` cap as enforced, then discloses it is advisory; the implementation disclosure governs the classification.
- Missing dependencies: The posts cite external benchmarks/products without local methods or fixtures, and GraphARC has no `memory/graph.py`; claims depending on them remain unverified or out of scope.
- Partial success: All six requested files were read. One batched read truncated and was recovered with the exact missing ranges; the final GraphARC scan truncated after yielding the load-bearing materialization, replay, trace, and budget anchors.

## Sources Consulted

1. `specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering: After Loops, This Is How You Wire Multi-Agent Orgs.md`
2. `specs/system-deep-loop/037-graph-engineering/context/blog-posts/Harness, Loop, or Graph? Building Reliable Agent Systems at the Right Layer.md`
3. `specs/system-deep-loop/037-graph-engineering/context/blog-posts/How to Build a Self-Correcting AI Loop That Catches Its Own Mistakes Before You See Them.md`
4. `specs/system-deep-loop/037-graph-engineering/context/blog-posts/How to Use Graph Engineering to Build a Multi-Factor Alpha Model.md`
5. `specs/system-deep-loop/037-graph-engineering/context/blog-posts/LOOP ⭢ GRAPH ⭢ HARNESS: build the whole pipeline in one sitting.md`
6. `specs/system-deep-loop/037-graph-engineering/context/blog-posts/What is Graph Engineering.md`
7. `specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/planner/{proposal,admission,materialize}.py`
8. `specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/{runtime/budget,gateway/spend,session/approval,observe/trace,observe/replay}.py`
9. `specs/system-deep-loop/037-graph-engineering/{001-agent-swarms,002-graphene-main}/research/research.md`
10. Graph-arch lineage iteration 16

## Assessment

- New information ratio: 0.64
- Calculation: 2 fully new findings (layer-owner/authorization correction and capability-versus-topology rewrite boundary) plus 5 partially new findings (evidence-loop mutants, finance fixture, context isolation, graph-kind disambiguation, and non-applicability): `(2 + 0.5 × 5) / 7 = 0.643`, rounded to `0.64`.
- Questions addressed: Which remaining-corpus claims change the existing design, how do they interact with pass A, and which does GraphARC actually implement?
- Questions answered: The pass-B evidence matrix, tensions, pass-A interactions, unsupported-claim register, GraphARC fidelity test, and expanded when-not-to-use boundary are complete.

## Reflection

- What worked and why: Assigning each claim to harness, loop, work graph, supervision graph, knowledge graph, or 036 authority exposed category errors that a generic “graph” label hid.
- What did not work and why: Product/financial/benchmark claims were not reproducible from the corpus, and a guessed GraphARC knowledge-graph module was absent; neither can carry design authority.
- What I would do differently: In iteration 18, index contradictions by claim owner and falsifier so negative evidence becomes an explicit architecture constraint rather than another prose warning.

## Route Proof

- Resolved route: `mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true`
- Agent definition loaded: `.opencode/agents/deep-research.md`
- Iteration/run: `17/17`
- Executor: `cli-codex/gpt-5.6-sol/high/fast`
- Research actions: 5, including one bounded truncation recovery; no subagents.
- Stop policy: continue to maximum iteration count; convergence telemetry does not stop the lineage.

## Recommended Next Focus

Iteration 18 should reconcile contradictions and negative evidence across all 12 posts, studies, and iterations: build a claim-owner/falsifier table, distinguish resolved contradiction from unsupported assertion, and convert the strongest when-not-to-use statements into explicit admission refusals or operator decision points without expanding GraphARC authority.
