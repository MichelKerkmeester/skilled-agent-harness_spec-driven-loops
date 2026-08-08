# Loops vs. Graphs: Decision Guide for `system-deep-loop`

Use this guide to decide whether a loop-based mode, phase, or adapter should become a graph.

---

## 1. OVERVIEW

**Core Principle**: Use a graph when the work is both complex and materially concurrent, with at least three independent verification steps and complex decision routing; keep a loop when the work is simple, sequential, exploratory, approval-heavy, or has no real independent branches.

This document is a selection guide, not a graph-first architecture proposal. The current system remains a hybrid loop-plus-graph design. The evidence ledger remains authoritative; graph state, checkpoints, and topology do not replace transition authorization, sealed receipts, blinded adjudication, or replay fingerprints. [SOURCE: `research/research.md`, §§5, 9–11]

> Use a graph when the work is both complex and materially concurrent, with at least three independent verification steps and complex decision routing. Keep a loop when the work is simple, sequential, exploratory, approval-heavy, or has no real independent branches.

**Key points**

- Use graph structure for real concurrency and complex routing, not for appearance.
- Keep evidence, authority, receipts, and replay semantics outside convenience graph state.

## 2. THE SHORT RULE

Ask these questions in order:

1. **Is the task simple or complex?**
2. **Does it have real concurrency, or only a list of sequential steps?**
3. **Can at least three independent verification steps run without consuming one another's outputs?**
4. **Does the result require complex conditional routing, fan-out/fan-in, fallback, or multi-lineage synthesis?**
5. **Can the team afford and operate the graph harness?**

Use the following rule:

| Complexity | Concurrency | Default | Use when |
|---|---|---|---|
| Simple | Low | **Single loop** | One bounded task, one main context, little branching, or a genuinely sequential procedure |
| Simple | High | **Parallel loops** | Many independent, similarly shaped tasks; each task can remain an ordinary loop |
| Complex | Low | **Staged loops** | The task needs checkpoints and retries, but its stages depend on one another |
| Complex | High | **Graph engineering** | At least three independent verification steps plus complex routing, governed fan-out/fan-in, or evolving work shape |

The matrix is drawn from the corpus's explicit loops-versus-graphs decision criteria. [SOURCE: `context/From Loops to Graphs: The Next Paradigm in AI Agent Engineering.md`, “When to Use Loops vs Graphs: The Decision Matrix”]

**Key points**

- Test complexity, real concurrency, independent verification, routing, and harness operability in that order.
- High concurrency alone selects parallel loops, not necessarily graph engineering.

## 3. DEFINITIONS

### 3.1 Loop

A loop is an autonomous cycle for one agent or one bounded executor:

```text
Trigger → Act → Verify → Retry or Exit
```

The loop owns its context, iteration limit, token budget, retry behavior, output capture, and completion check. [SOURCE: `context/Graph Engineering: After Loops, This Is How You Wire Multi-Agent Orgs.md`, “What a Loop Is”]

A loop is not a failure of architecture. It is the correct unit when the work is narrow or its steps genuinely depend on one another.

### 3.2 Graph

A graph is an explicit organization of jobs or agents:

| **Term** | Meaning |
|---|---|
| **Node** | One bounded job with a declared input and output. |
| **Edge** | A real dependency or data transfer between nodes. |
| **Conditional edge** | A route selected by a result or gate. |
| **Fan-out** | Independent branches run at the same time. |
| **Fan-in** | Branch results are reduced or synthesized. |
| **Checkpoint** | Resumable execution state, not automatically an audit record. |

A graph exposes who exists, what each node owns, how work moves, and what happens when a branch fails. Each node may still run its own loop. [SOURCE: `context/Graph Engineering explained: what it is, when to use it and when not to.md`, §§2–3; `context/Graph Engineering: After Loops, This Is How You Wire Multi-Agent Orgs.md`, “What a Graph Is”]

### 3.3 Real edges and fake edges

An edge is real only when the downstream job consumes something produced upstream. If the downstream job does not need the upstream result, the wait is unnecessary and the jobs are candidates for parallel execution.

Use this test for every arrow:

```text
Does this step actually need the result of the one before it?

Yes → keep the edge.
No  → remove the edge and consider parallel execution.
```

This is the corpus's “fake-edge” test. It is the fastest way to find concurrency without changing the work itself. [SOURCE: `context/Graph Engineering explained: what it is, when to use it and when not to.md`, §3; `context/From Loops to Graphs: The Next Paradigm in AI Agent Engineering.md`, “What a Loop Looks Like”]

### 3.4 Node contracts

A graph is wire-able only when a node has a bounded job, defined input, and defined output. Free-form output forces a human or an implicit parser to guess what the next node should consume.

The corpus gives this contract shape:

```text
▸ NODE CONTRACT
JOB:     research one competitor's pricing (one job, nothing else)
IN:      { competitor: "name", url: "https://..." }   ← passed in, never assumed
OUT:     { price: number, plan: string, source: url, date: "YYYY-MM-DD" }
SCHEMA:  enforced. if the agent returns free text, it's rejected and retried
WHY:     a defined output is what lets the next node read this one
         without a human in the middle. that is what makes it wire-able.
```

[SOURCE: `context/Graph Engineering explained: what it is, when to use it and when not to.md`, §2]

### 3.5 Control graph and work graph

The research synthesis distinguishes two graph layers:

| **Graph layer** | Purpose |
|---|---|
| **Stable control or org graph** | Defines durable roles, ownership, and routing structure. |
| **Dynamic work graph** | Defines the tasks for one run. It can split, merge, reorder, or disappear as evidence changes. |

For `system-deep-loop`, this distinction supports a stable governed control graph with per-run work graphs. It does **not** authorize replacing the evidence ledger with graph state. [SOURCE: `research/research.md`, §§5, 9–11; `context/Graph Engineering: After Loops, This Is How You Wire Multi-Agent Orgs.md`, “Two Graphs, Not One”]

**Key points**

- A graph is made of bounded contracts and real dependencies.
- Checkpoints support resumption but are not automatically audit authority.
- Stable control structure and dynamic per-run work structure are separate layers.

## 4. THE DECISION MATRIX

### Matrix at a glance

| Cell | Work shape | Default implementation | Graph threshold | Typical example |
|---|---|---|---|---|
| A | Simple × low concurrency | Single loop | No independent branches to expose | Write one sorting function |
| B | Simple × high concurrency | Parallel loops | Independent jobs, but no complex routing | Review ten independent pull requests |
| C | Complex × low concurrency | Staged loops | Checkpoints matter; stages still depend on prior stages | Build a feature with review at each milestone |
| D | Complex × high concurrency | Graph engineering | Three or more independent verification steps **and** complex routing | Critical PR touching auth, schema, and API contracts |

The examples in the matrix are source examples. The implementation labels follow the corpus's explicit quadrant names. [SOURCE: `context/From Loops to Graphs: The Next Paradigm in AI Agent Engineering.md`, “When to Use Loops vs Graphs: The Decision Matrix”]

### Cell A — Simple work, low concurrency: single loop

#### Decision

Choose a single loop when the work is small, isolated, or naturally sequential. Do not introduce graph coordination merely because the runtime can spawn agents.

#### Worked example

**Task:** “Write a function that sorts a list.”

A single agent can observe the request, implement the function, run the relevant check, revise if needed, and stop. There is no demonstrated independent fan-out, no complex route, and no need for a multi-node harness.

```text
Observe → Decide → Act → Verify → Retry or Exit
```

This is the matrix's simple/low-concurrency example. [SOURCE: `context/From Loops to Graphs: The Next Paradigm in AI Agent Engineering.md`, “Quadrant 1 — Simple Task + Low Concurrency Need”]

#### Checklist

- [ ] The task is bounded and isolated.
- [ ] There is no second job that can consume the same input independently.
- [ ] There are fewer than three independent verification lenses.
- [ ] A single context is sufficient.
- [ ] A graph would add routing or state machinery without removing a real wait.
- [ ] The output can be checked by the loop's ordinary verifier.

#### Stop condition

If you cannot identify two jobs with no data dependency between them, stop graph design. The corpus states that a graph is not warranted when the fake-edge test finds no removable edge. [SOURCE: `context/Graph Engineering explained: what it is, when to use it and when not to.md`, §8]

#### `system-deep-loop` application

A sequential leaf phase—reading the current state, researching, writing one iteration artifact, verifying it, and reducing it—stays an ordinary step or loop. Turning each file operation into a graph node would add edges without adding useful concurrency. [SOURCE: `research/iterations/iteration-017.md`, Finding 3]

### Cell B — Simple work, high concurrency: parallel loops

#### Decision

Choose parallel loops when many independent tasks share a simple shape. Parallelism is useful; graph engineering is not automatically required. Each branch can remain an ordinary loop with its own input and output.

#### Worked example

**Task:** “Review 10 independent pull requests.”

Run one simple review loop per pull request. The branches do not consume one another's findings. A small reducer can collect the ten outputs. No complex decision route is required merely because the jobs run concurrently.

```text
PR 1 → review loop ─┐
PR 2 → review loop ─┤
PR 3 → review loop ─┤
...                 ├→ collect results
PR 10 → review loop ┘
```

This is the matrix's simple/high-concurrency example. [SOURCE: `context/From Loops to Graphs: The Next Paradigm in AI Agent Engineering.md`, “Quadrant 2 — Simple Task + High Concurrency Need”]

#### Checklist

- [ ] Each branch has an independent input.
- [ ] No branch needs another branch's output before it can finish.
- [ ] Branch outputs share one simple schema.
- [ ] A flat result collection is sufficient.
- [ ] There is no conditional branch routing beyond success/failure of an individual loop.
- [ ] Shared files, workspaces, and rate-limited services are isolated or explicitly serialized.
- [ ] The merge checks that all expected branches returned.

#### Gotcha: apparent independence

Two prompts can be independent while their side effects are not. Two workers writing the same file, workspace, or rate-limited API have a hidden edge. Isolate each worker or make the dependency explicit.

The source example uses separate worktrees:

```text
// isolate the workers — no shared file, no shared workspace
await parallel(files.map(f => () => agent({
  task: `refactor ${f}`,
  worktree: true,        // each agent works in its own git worktree
})));
// they can't overwrite each other, then the results merge cleanly
// rule: any two nodes writing the same file need an edge, not parallelism
```

[SOURCE: `context/Graph Engineering explained: what it is, when to use it and when not to.md`, §7]

#### `system-deep-loop` application

A batched set of similarly shaped, independent tasks can use parallel loops. Do not infer that the mode itself needs a graph from the existence of fan-out. The decision depends on whether the fan-out is paired with complex verification and routing. [SOURCE: `research/research.md`, §§8–11]

### Cell C — Complex work, low concurrency: staged loops

#### Decision

Choose staged loops when the task is difficult but the stages genuinely depend on each other. Add explicit checkpoints, bounded retries, and human or authority gates at milestone boundaries. Do not force parallelism where the dependency is real.

#### Worked example

**Task:** “Build a feature with review at each milestone.”

A staged loop can run:

```text
Stage 1: define the feature
    ↓ checkpoint
Stage 2: implement the feature
    ↓ checkpoint
Stage 3: review the implementation
    ↓ checkpoint
Stage 4: revise or complete
```

The next stage consumes the prior stage's artifact. If the review determines that implementation must change, the route returns to the implementation stage. The work is complex, but the source example does not require multiple independent branches at every stage.

This is the matrix's complex/low-concurrency example. [SOURCE: `context/From Loops to Graphs: The Next Paradigm in AI Agent Engineering.md`, “Quadrant 3 — Complex Task + Low Concurrency Need”]

#### Checklist

- [ ] Complexity comes from the depth of the work, not from independent breadth.
- [ ] Each stage consumes the previous stage's output.
- [ ] Checkpoints have a defined artifact and resume rule.
- [ ] Retry scope is limited to the failed stage where possible.
- [ ] A human or authority gate is placed before irreversible changes.
- [ ] Stage completion is explicit and auditable.
- [ ] No graph is being added solely to make a sequential chain look more sophisticated.

#### `system-deep-loop` application

Initialization, preflight, lock acquisition, state classification, one leaf iteration's read/research/write/verify sequence, and a no-fan-out synthesis path are predominantly linear. Preserve them as ordinary steps while reserving graph structure for seams where branches and convergence actually occur. [SOURCE: `research/iterations/iteration-017.md`, Finding 3]

### Cell D — Complex work, high concurrency: graph engineering

#### Decision

Choose graph engineering only when all of the following are true:

1. The work is complex.
2. Independent branches materially reduce waiting or improve independent judgment.
3. There are at least three independent verification steps, or an equivalent governed verification fan-out.
4. Routing is complex: conditional feedback, fallbacks, multi-lineage synthesis, or evolving task shape.
5. The team can operate the required harness and its failure model.

#### Worked example

**Task:** “Review a critical PR that touches auth, database schema, and API contracts.”

The source's graph shape is:

```text
Planner
   ↓
Worker
   ↓
┌──────────────┬──────────────┬──────────────┐
│ Security     │ Logic        │ Style        │
│ reviewer     │ reviewer     │ reviewer     │
└──────────────┴──────────────┴──────────────┘
                ↓
           Synthesizer
                ↓
          Pass/Fail gate
          ↙            ↘
       Output       feedback → Worker
```

The review dimensions are independent after the worker output exists. The synthesizer needs all results. The gate either completes or routes feedback back to work. This is the matrix's complex/high-concurrency example. [SOURCE: `context/From Loops to Graphs: The Next Paradigm in AI Agent Engineering.md`, “Quadrant 4 — Complex Task + High Concurrency Need”]

The source's executable contrast is:

```python
import asyncio

# Parallel: all reviews run simultaneously
async def agent_graph(task):
    plan = await planner(task)
    while True:
        code = await worker(plan)
        # Three reviews fire in PARALLEL
        sec, log, sty = await asyncio.gather(
            security_reviewer(code),
            logic_reviewer(code),
            style_reviewer(code)
        )
        synthesis = synthesize([sec, log, sty])
        if synthesis["pass"]:
            return synthesis["output"]
        plan = await replan(plan, synthesis["feedback"])
```

The source prints `async def agent_graph`; the implementation shown above preserves that source spelling. It is a source example, not a `system-deep-loop` runtime contract. [SOURCE: `context/From Loops to Graphs: The Next Paradigm in AI Agent Engineering.md`, “Example: Loop vs Graph in Code”]

#### Checklist

- [ ] The task has real independent branches.
- [ ] Each branch has a bounded input and typed output.
- [ ] At least three verification lenses are independent in context and purpose.
- [ ] The verifier does not inherit the worker's conversational context.
- [ ] A reducer or synthesizer has a declared input-count contract.
- [ ] Conditional routes define retry, fallback, escalation, and abort behavior.
- [ ] Shared resources are isolated or represented as serialized dependencies.
- [ ] Checkpoints and observability can identify which nodes ran and what they produced.
- [ ] Cost, latency, and branch failure are measurable.
- [ ] The evidence and authority plane remains outside the graph's convenience state.

**Key points**

- Complex/high-concurrency work requires both independent verification and complex routing.
- A graph node must have a bounded contract, and every join must account for branch completeness.

## 5. THE GRAPH ADMISSION CHECKLIST

Run this checklist before implementation. A “no” is a reason to stay with a loop or to gather missing evidence before designing a graph.

### 5.1 Work-shape checks

- [ ] What is the bounded unit of work?
- [ ] Which outputs are consumed by which later jobs?
- [ ] Which apparent edges fail the fake-edge test?
- [ ] How many independent branches exist at the same time?
- [ ] Does the work shape change as evidence arrives?
- [ ] Is the work one task, a batch of independent tasks, or a multi-stage organization?

### 5.2 Verification checks

- [ ] What is the first verification step?
- [ ] What are the second and third independent verification steps?
- [ ] Does each verifier receive the finding or artifact, rather than the worker's chat?
- [ ] Are correctness, currency, and source validity separate questions where applicable?
- [ ] Is there an anchor that cannot be “verified” only by another model-generated report?

The corpus gives this verifier contract:

```text
▸ VERIFIER NODE
INPUT:    one finding from a worker (the finding only, never the worker's chat)
CONTEXT:  fresh and empty. it has not seen the work it is judging
CHECKS:   three skeptics run in parallel, each with a different question
  1. is it correct?      → does the claim actually hold up
  2. is it current?       → is the source recent, not something stale
  3. is the source real?  → does the link resolve to the claim it's cited for
PASS:     keep the finding only if a majority of skeptics let it live
FAIL:     drop it before it ever reaches the final answer
```

[SOURCE: `context/Graph Engineering explained: what it is, when to use it and when not to.md`, §6]

### 5.3 Routing checks

- [ ] What starts the graph?
- [ ] What data selects each conditional route?
- [ ] What happens when a node returns no result?
- [ ] What happens when a node returns malformed output?
- [ ] What happens when a branch is slower than its peers?
- [ ] What happens when a verifier rejects an artifact?
- [ ] Can a failed branch retry without replaying unrelated work?
- [ ] Is human approval required before an irreversible action?
- [ ] Is the graph routing merely advisory, or does an authoritative gateway enforce the transition?

### 5.4 Harness checks

A loop harness manages input, context, budget, retry, and capture. A graph harness additionally manages inter-agent routing, node failure isolation, state consistency, dynamic spawning, and graph observability. [SOURCE: `context/Graph Engineering: After Loops, This Is How You Wire Multi-Agent Orgs.md`, “The Harness Connection”]

Confirm that the team can operate:

- [ ] Inter-node message routing.
- [ ] Node-level retry and failure isolation.
- [ ] Consistent state across branches and joins.
- [ ] Dynamic node spawning only where explicitly supported.
- [ ] Traceability of node order, latency, outputs, and route decisions.
- [ ] Recovery from partial completion.
- [ ] Context and token-budget limits.
- [ ] Cost caps and branch-count caps.

If these capabilities are unavailable, a staged or parallel-loop design is safer than a graph-shaped promise. [INFERENCE: this applies the source's harness-cost description to the selection decision.]

**Key points**

- A “no” in the admission checklist blocks graph design until the missing evidence or capability is addressed.
- The harness must make routing, state, recovery, observability, and cost boundaries explicit.

## 6. COST ARGUMENTS: WHAT A GRAPH ADDS

A graph does not make the underlying model work free. It makes coordination and independent work possible, while adding a second class of costs.

### 6.1 Design overhead

Graphs require explicit nodes, handoff protocols, output contracts, edge semantics, failure routes, and completion rules before execution. A loop can defer more of this structure to the agent's context; a graph must model it up front. [SOURCE: `context/Graph Engineering: After Loops, This Is How You Wire Multi-Agent Orgs.md`, “Why Graphs Are Harder Than Loops”]

**Operational consequence:** if the team cannot name the input, output, owner, and failure route for a node, the graph is not ready to build.

### 6.2 Failure propagation

A loop failure is local and obvious: one agent retries or stops. A graph failure can produce invalid downstream state, partial fan-in, or a report that appears complete while one branch silently died. [SOURCE: `context/Graph Engineering explained: what it is, when to use it and when not to.md`, §7; `context/Graph Engineering: After Loops, This Is How You Wire Multi-Agent Orgs.md`, “Why Graphs Are Harder Than Loops”]

Use an input-count guard at every merge:

```text
// fan-in guard — catch the node that quietly died
const results = (await parallel(jobs)).filter(Boolean);   // dropped nodes = null
if (results.length < jobs.length) {
  flag(`WARNING: ${jobs.length - results.length} of ${jobs.length} nodes returned nothing`);
}
// never synthesize on a partial set and call the report complete
```

[SOURCE: `context/Graph Engineering explained: what it is, when to use it and when not to.md`, §7]

### 6.3 Context routing

A graph does not automatically carry context between nodes. Every edge must carry the information the downstream node needs. Missing an edge can make a downstream decision with incomplete information; carrying every raw output can cause context collapse at synthesis. [SOURCE: `context/Graph Engineering: After Loops, This Is How You Wire Multi-Agent Orgs.md`, “Why Graphs Are Harder Than Loops”; `context/Graph Engineering explained: what it is, when to use it and when not to.md`, §7]

Use layered fan-in when branch count is large:

```text
// layered fan-in — never pour 1,000 raw outputs into one step
const batches = chunk(results, 40);              // groups of 40
const summaries = await parallel(
  batches.map(b => () => agent({ task: "summarize this batch", input: b }))
);
return agent({ task: "write the answer from the summaries", input: summaries });
// the final step reads ~25 summaries, not 1,000 raw outputs
```

[SOURCE: `context/Graph Engineering explained: what it is, when to use it and when not to.md`, §7]

### 6.4 Distributed-runtime overhead

The graph harness is closer to a distributed-systems runtime than to a shell loop. It must coordinate routing, state consistency, failure isolation, spawning, observability, and recovery. [SOURCE: `context/Graph Engineering: After Loops, This Is How You Wire Multi-Agent Orgs.md`, “The Harness Connection”]

**Selection consequence:** graphs lose when the coordination cost exceeds the removed waiting time or added independent judgment. The corpus explicitly says graphs lose on simple lookups and that design, failure propagation, context routing, and runtime overhead are real costs. [SOURCE: `research/iterations/iteration-017.md`, Finding 1]

### 6.5 Why graphs lose on simple lookups

A graph is useful for width, typed relationships, and multi-hop coordination. It does not inherently improve judgment, and it adds coordination even when one lookup or one bounded change would be enough. [SOURCE: `context/Graph Engineering explained: what it is, when to use it and when not to.md`, §§8–9; `research/iterations/iteration-010.md`, Finding 6]

Use the simpler path when:

- The task is small or isolated.
- The operator must approve every step.
- The task is exploratory and the target is not known yet.
- The steps genuinely depend on each other.
- No pair of jobs passes the fake-edge test.

[SOURCE: `context/Graph Engineering explained: what it is, when to use it and when not to.md`, §8]

**Key points**

- Graph coordination is justified only when it removes waiting or adds independent judgment worth its cost.
- Design overhead, failure propagation, context routing, and distributed-runtime overhead are selection costs.

## 7. APPLYING THE MATRIX TO THE SEVEN MODES

The seven registered modes are research, review, ai-council, alignment, agent-improvement, model-benchmark, and skill-benchmark. The first three expose the strongest graph-shaped work: evidence branching, review fan-out, deliberation, and convergence. The custom-backend lanes fit graphs least when they are a single candidate, benchmark, or conformance pass without material branching. [SOURCE: `research/research.md`, §§2, 8–11; `research/iterations/iteration-017.md`, Finding 2]

| Mode | Default fit | Why | Graph boundary |
|---|---|---|---|
| Research | Strongest candidate | Evidence collection, independent angles, verification, convergence, and multi-lineage synthesis naturally expose branches | Graph the fan-out, guarded verification, and convergence seams; keep leaf artifact steps ordinary |
| Review | Strongest candidate | Independent review lenses can run in parallel and route findings through synthesis and pass/fail feedback | Use a graph when review dimensions are independent and routing is complex |
| AI-council | Strongest candidate | Deliberation can use separate roles and anti-groupthink or adjudication paths | Keep authority and adjudication contracts outside convenience graph state |
| Alignment | Usually low graph value | It uses a separate alignment-convergence backend; a single read-only conformance pass may have no material branching | Consider a graph only for batched or branching alignment work [INFERENCE] |
| Agent-improvement | Usually low graph value | Improvement lanes use custom backends; a single candidate improvement can remain a staged loop | Graph only when independent evaluators or candidate branches create real routing [INFERENCE] |
| Model-benchmark | Usually low graph value | A single benchmark run is often a bounded loop with structured results | Parallelize independent benchmark cases first; graph only when routing and verification become complex [INFERENCE] |
| Skill-benchmark | Usually low graph value | A single skill or conformance pass can stay sequential | Use a graph for independent evaluators and conditional remediation, not for every check [INFERENCE] |

### Mode-specific guardrails

- Do not graph every mode just for consistency. The corpus explicitly rules out graphing every mode and every leaf operation. [SOURCE: `research/research.md`, “ELIMINATED ALTERNATIVES”]
- Do not graph every sequential leaf phase. The research workflow explicitly skips fan-out for single-executor runs and retains linear initialization, preflight, locking, state classification, leaf execution, and no-fan-out synthesis paths. [SOURCE: `research/iterations/iteration-017.md`, Finding 3]
- For research, the first adapter target is the fan-out and convergence boundary, not a replacement for the complete loop. [SOURCE: `research/research.md`, §§9, 11]
- For review and council, independent verification and deliberation are the strongest reasons to test graph structure. [SOURCE: `research/research.md`, §8]
- For custom backends, treat graph adoption as a measured exception. The fit assessment is not a claim that those modes can never use graphs. [SOURCE: `research/iterations/iteration-017.md`, Finding 2]

**Key points**

- Research, review, and AI-council are the strongest candidates because their branches can expose independent evidence or judgment.
- Custom-backend modes require measured evidence before graph adoption.

## 8. A PRACTICAL GRAPH SHAPE FOR THE HIGH-VALUE CASES

The corpus's recurring governed pattern is:

```text
Fan out → code reduction/deduplication → fresh-context verification → synthesis
```

This is the diamond. It is useful when branches are independent and the final answer needs all surviving results. [SOURCE: `research/iterations/iteration-010.md`, Finding 5; `context/Graph Engineering explained: what it is, when to use it and when not to.md`, §5]

A source implementation sketch is:

```text
const angles = [
  "pricing vs the top 3 competitors",
  "what buyers complain about in reviews",
  "the feature gaps in the category",
  "where the market moves in the next 12 months",
];

// FAN OUT — one researcher per angle, all running at the same time
const raw = await parallel(
  angles.map(a => () => agent({
    task: `research: ${a}. every claim needs a source url + date.`,
    schema: Finding,
    model: "cheap",
  }))
);

// REDUCE — plain code, no model, no tokens
const findings = dedupeBySource(raw.flat().filter(Boolean));

// VERIFY — a FRESH skeptic per finding, tries to kill it
const survivors = await parallel(
  findings.map(f => () => agent({
    task: "try to disprove this. return keep | drop + why.",
    input: f,
    freshContext: true,
    model: "strong",
  }))
).then(v => findings.filter((_, i) => v[i].verdict === "keep"));

// SYNTHESIZE — one agent writes the answer from what survived
return agent({ task: "one report, ranked by confidence, sources attached.",
               input: survivors, model: "strong" });
```

[SOURCE: `context/Graph Engineering explained: what it is, when to use it and when not to.md`, §5]

### Required properties of this shape

1. The fan-out inputs are distinct.
2. The reducer is deterministic code where possible.
3. Verification receives only the artifact under review.
4. Verification uses fresh context.
5. The fan-in checks completeness.
6. Synthesis sees a bounded representation, not an unbounded raw pile.
7. The final route has explicit pass, retry, and failure behavior.

**Key points**

- Use the diamond only where independent branches and governed convergence are real.
- Reduce deterministically, verify in fresh context, and bound the final synthesis input.

## 9. `system-deep-loop` BOUNDARY: GRAPH AROUND LOOPS, NOT INSTEAD OF LOOPS

The research synthesis recommends a hybrid architecture:

```text
Stable governed control graph
        +
Per-run work graphs
        +
Evidence ledger as authority
        +
Ordinary loops inside sequential leaf phases
```

The mapping is useful but bounded:

| Existing loop concept | Graph interpretation | What must remain outside graph convenience state |
|---|---|---|
| Mode routing | Graph or subgraph selection | Authoritative registry and transition authorization |
| Iteration focus | Work-graph node | Ledger events and sealed artifacts |
| Convergence | Conditional edge or termination route | Inline convergence vote and authoritative evidence |
| JSONL state and reducer | Graph state and reducers | Append authorization, receipts, fingerprints, and replay authority |
| Flat-pool fan-out | Parallel work branches | Filesystem-enforced lineages and deterministic merge |
| Loop lock | Serialized execution boundary | Stale-writer and append-boundary fencing |
| Branch-to-join | Fan-in | Completeness, contradiction handling, and audit receipts |

[SOURCE: `research/research.md`, §§9, 11]

The graph is therefore a coordination and structural-guard layer. It is not a substitute for the inline three-signal convergence vote, and it must not be treated as transition authorization. [SOURCE: `research/research.md`, §§5, 8–11]

**Key points**

- Graphs coordinate structure around loops; they do not replace sequential leaf execution.
- The evidence ledger and authority plane remain authoritative.

## 10. GOTCHAS AND FAILURE PATTERNS

### 10.1 Context collapse

Do not send every raw branch result to one synthesis node. Batch and summarize before final synthesis. [SOURCE: `context/Graph Engineering explained: what it is, when to use it and when not to.md`, §7]

### 10.2 False independence

Audit shared files, workspaces, APIs, locks, and rate limits. Prompt independence is not resource independence. [SOURCE: `context/Graph Engineering explained: what it is, when to use it and when not to.md`, §7]

### 10.3 Silent worker failure

A missing branch is not an empty answer. Count expected inputs, report missing outputs, and block “complete” synthesis on an incomplete set unless an explicit degraded route exists. [SOURCE: `context/Graph Engineering explained: what it is, when to use it and when not to.md`, §7]

### 10.4 Self-review disguised as independent review

A worker and its verifier must not share the worker's context. A separate node with the same context is still too close to independent judgment. [SOURCE: `context/Graph Engineering explained: what it is, when to use it and when not to.md`, §6]

### 10.5 Topology is not truth

A graph can be internally consistent and still verify one report against another report produced by the same ungrounded system. Use anchors such as tests that actually ran or external facts that cannot be optimized away. [SOURCE: `context/Graph Engineering explained: what it is, when to use it and when not to.md`, §9]

### 10.6 Hidden scheduler semantics

Do not infer a graph from scheduler metadata that the runtime explicitly rejects. In the current workflow, wave/depends-on scheduling is rejected rather than approximated; flat-pool fallback is explicit. [SOURCE: `research/research.md`, §§6, 9–11]

### 10.7 Checkpoints are not audit authority

A checkpoint preserves resumable execution state. It does not by itself provide sealed receipts, replay fingerprints, or temporal authority. [SOURCE: `research/research.md`, “ELIMINATED ALTERNATIVES”]

### 10.8 Dynamic graph enthusiasm

Dynamic spawning, branch collapse, and route rewrites are attractive only when the work shape genuinely changes. If the task is known and sequential, dynamic structure adds failure routes without adding value. [SOURCE: `context/Graph Engineering: After Loops, This Is How You Wire Multi-Agent Orgs.md`, “Dynamic Agent Orgs”; `research/iterations/iteration-017.md`, Findings 1–3]

**Key points**

- Resource, context, and scheduler semantics can create dependencies that the prompt does not show.
- Topology and checkpoints cannot substitute for truth, audit authority, or explicit failure handling.

## 11. MEASUREMENT AND ROLLOUT CHECKLIST

Measure before and after changing topology:

- [ ] Wall-clock completion time.
- [ ] Cost per successful completion.
- [ ] Number of branches started and completed.
- [ ] Missing or malformed branch outputs.
- [ ] Retry count by node.
- [ ] Fan-in completeness.
- [ ] Context size at every join.
- [ ] Verification rejection rate.
- [ ] Route and fallback counts.
- [ ] Evidence-ledger and artifact parity.

The source methodology recommends auditing current loops, identifying independent work, starting with a small topology, implementing and measuring it, and then adding typed edges. [SOURCE: `context/From Loops to Graphs: The Next Paradigm in AI Agent Engineering.md`, “The 5-Stage Graph Engineering Methodology”]

For the current system, use an additive-dark adapter and shadow parity before any authority cutover. The research recommends research first because its artifact contract and parity oracle are strongest, followed by exact reducer and convergence comparisons. [SOURCE: `research/research.md`, §§9, 11]

### Suggested rollout sequence

1. Inventory the existing loop and record baseline latency, cost, and outputs.
2. Mark every dependency with the fake-edge test.
3. Isolate only the fan-out/convergence seam.
4. Keep sequential leaf phases unchanged.
5. Add typed node inputs and outputs.
6. Add completeness, malformed-output, retry, and fallback guards.
7. Run graph-off and graph-on shadow paths.
8. Compare reducer output, convergence decisions, failures, and artifacts.
9. Cut over one mode only after parity and authority gates pass.
10. Retire the legacy path only after zero-use evidence.

Steps 7–10 are the research's migration direction, not a claim that cutover has already happened. [SOURCE: `research/research.md`, §§1, 7, 9, 11]

**Key points**

- Establish baseline evidence before changing topology.
- Shadow parity and authority gates precede any cutover.

## 12. FINAL SELECTION CARD

Choose **single loop** when the work is simple and narrow.

Choose **parallel loops** when the work is simple but repeated across independent inputs.

Choose **staged loops** when the work is complex but its stages genuinely depend on one another.

Choose **graph engineering** when the work is complex, broad, independently verifiable, and needs conditional routing or governed fan-in.

Before approving a graph, require:

- Real edges.
- Typed node contracts.
- Three or more independent verification steps for the high-concurrency case.
- Fresh-context verification.
- Completeness guards.
- Resource isolation.
- Explicit failure routes.
- Measured cost and latency.
- Authority and audit semantics outside convenience graph state.

If those conditions are absent, the simpler loop is the more engineered choice.

**Key points**

- Choose the least complex structure that exposes real independent work.
- If graph admission conditions are absent, retain the simpler loop.

## 13. SOURCES

- `specs/system-deep-loop/037-graph-engineering/research/research.md` — synthesis §§1–17, especially §§5, 8–11 and “ELIMINATED ALTERNATIVES”.
- `specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-010.md` — Findings 1–7, especially the corpus definition, diamond pattern, failure model, and use/not-use criteria.
- `specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-017.md` — Findings 1–6, especially the decision matrix, seven-mode fit, sequential leaf boundary, and graph overhead.
- `specs/system-deep-loop/037-graph-engineering/context/Graph Engineering explained: what it is, when to use it and when not to.md` — §§2–9, including node contracts, fake edges, diamond, verifiers, failure guards, overhead, and anchors.
- `specs/system-deep-loop/037-graph-engineering/context/From Loops to Graphs: The Next Paradigm in AI Agent Engineering.md` — loop/graph definitions, loop-vs-graph code, five-stage method, and four-cell decision matrix.
- `specs/system-deep-loop/037-graph-engineering/context/Graph Engineering: After Loops, This Is How You Wire Multi-Agent Orgs.md` — loop/graph distinction, stable org graph versus dynamic work graph, harness costs, and failure responsibilities.
