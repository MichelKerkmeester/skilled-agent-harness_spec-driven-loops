# Reference implementations for graph engineering

This document is a practical reading guide to the three graph-engineering references in this packet and to the implications for `system-deep-loop`.

The references do not describe one interchangeable product.

- **GraphARC-main** is executable Python: a governance and audit wrapper around a LangGraph-compatible runtime.
- **LangGraph** is the official graph-runtime model: typed state, nodes, edges, conditional routing, persistence, and map/fan-out primitives.
- **graph-engineering-master** is a documentary skill and workflow package. Its local implementation directory is empty, so it is not evidence of a runnable graph engine.

The recommended lesson is a hybrid. Keep the evidence ledger and transition authority authoritative. Add a governed control graph and per-run work graphs only where topology earns its cost.

## Reading conventions

| Label | Meaning |
|---|---|
| **Executable** | The cited checkout contains code or a runnable path for the behavior. |
| **Documented** | The source describes a pattern or workflow, but the local checkout does not prove execution. |
| **Partial** | Some of the boundary works, while a stated seam remains incomplete. |
| **Aspirational** | The source lists the behavior as pending, unverified, or not wired. |
| **[INFERENCE]** | A design implication derived from the sources rather than a fact directly asserted by one source. |

The iteration numbers below refer to the deep-research evidence pack. The synthesis is authoritative for the current `system-deep-loop` status and for the distinction between fact and inference.

## At-a-glance comparison

| Concern | GraphARC-main | Official LangGraph | graph-engineering-master | Lesson for `system-deep-loop` |
|---|---|---|---|---|
| Primary purpose | Govern proposed agent graphs before execution | Provide graph construction and execution primitives | Teach graph and knowledge-graph design | Use a graph as a governed projection, not as the authority plane |
| State | Typed state with declared node writes and runtime validation | User-defined state in `StateGraph`, reducers, and snapshots | Prompt guidance for schemas, provenance, and workflows | Preserve typed evidence state and explicit write ownership |
| Topology | Planner proposes; admission checks; materializer builds | Builder declares static and conditional edges; `compile()` validates structure | Prompt blocks teach real dependencies and fan-out/fan-in | Admission must remain fail-closed and registry-backed |
| Dynamic routing | Operator code may return `Command`/`Send`, confined to admitted destinations | Conditional edges and `Send` select next nodes or map work | Described as a task-graph pattern, not an engine | Route convergence through authorized transitions |
| Persistence | Checkpointer is accepted; ordinary resume exists, interrupt resume remains partial | Checkpointers persist thread-scoped graph state and history | Checkpointing is discussed as workflow practice | Checkpoints support resume; the ledger records why |
| Audit | JSONL trace, replay reconstruction, admission fingerprints, stop reasons | Persistence snapshots are not a sealed why-audit | Provenance is a design requirement in prompts | Use receipts, fingerprints, and ledger events beside graph state |
| Observability | Trace replay can be transformed into OTel spans | Runtime APIs expose state/history; tracing is separate | Observability is guidance | Keep trace parentage and causal rationale explicit |
| Durability | Durability pass-through remains unimplemented in the roadmap | Checkpointer choice is a runtime integration point | No local implementation to verify | Do not claim durable graph semantics until the boundary is implemented |
| Benchmarks | Harness for hashing, agent invocation, grading, and comparisons | No benchmark harness supplied by this packet | No executable benchmark path | Measure parity against the current loop before authority cutover |
| Maturity | Executable with explicit limits | Primitive runtime, not governance | Documentary/package artifact | Migrate additively and per mode |

## 1. GraphARC-main: the architecture map

### 1.1 What GraphARC is

GraphARC describes itself as “the admission gate for agent graphs,” built on LangGraph. Its central contract is simple: a model proposes a graph of work; a deterministic checker admits or refuses it; only an admitted graph executes; budgets and a replayable JSONL trace surround the run. The README explicitly separates GraphARC from raw LangGraph: raw LangGraph supplies graph machinery, while GraphARC supplies authorization, cost controls, and audit boundaries.

That makes GraphARC most useful as a reference for **governance wrappers**, not as evidence that a graph runtime should replace the deep-loop ledger.

The practical pipeline is:

```text
planner proposal
      |
      v
admission checker
  registry / policy / budget / depth / acyclicity / reachability
      |
      +--> rejected: structured feedback + admission trace event
      |
      v
materializer
  exact proposal fingerprint + registry-owned factories + declared writes
      |
      v
runtime graph/state
  typed state + bounded execution + fan-out + convergence + JSONL trace
      |
      +--> replay reconstruction
      +--> metrics / bench inputs
      +--> replay-to-OTel span projection
```

This separation is the primary GraphARC lesson for system design.

### 1.2 Planner admission

The admission module states five core checks:

| Check | Question | Authority |
|---|---|---|
| Registry | Is every proposed node kind allowed, and does every endpoint resolve? | `NodeRegistry` |
| Policy | May each node kind run, and may each edge be taken? | Node and edge policy |
| Budget | Does the estimated worst case fit the remaining budget? | Runtime budget headroom |
| Depth | Is nesting within the configured limit? | Admission limits |
| Acyclicity | Is the proposed topology acyclic when required? | Admission limits |

The implementation also supports a reachability check for standalone materialization. This avoids admitting a graph that has no `START` entry or contains nodes that nothing can reach.

The checker is deliberately **not an executor**.

```python
result = checker.check(
    proposal,
    meter=meter,
    parent_depth=parent_depth,
    ctx=run_context,
)

if not result.admitted:
    # The result carries status, fingerprint, failed checks, and remedies.
    planner_feedback = result.feedback()
```

The important behavior is not the syntax. It is the asymmetry:

1. The proposal arrives as data.
2. Registry factories are not called.
3. State is not mutated.
4. The budget meter is read, not charged.
5. All configured checks run, rather than stopping at the first complaint.
6. A rejection is returned as structured data and recorded as `phase="admission"` when tracing is enabled.

GraphARC keys policy decisions on the registered **kind**, not on the planner-chosen instance name. Renaming a proposed `deploy` instance cannot launder a denied kind. An endpoint whose kind cannot be resolved is refused rather than assumed safe.

A useful operator rule follows directly:

> The registry is the identity boundary. Instance names identify graph nodes; registered kinds identify what policy is authorizing.

The admission result also carries a proposal fingerprint. This gives the next boundary something stronger than “the planner said it was approved”: materialization can require that the proposal content still hashes to the approved fingerprint.

### 1.3 Admission is not argument authorization

GraphARC documents an important limit that is easy to miss. Admission authorizes a node **kind**, not its arguments.

By default, the materializer does not forward planner arguments. An explicit `forward_args=True` path forwards the raw dictionary to a registry factory without an argument-specific admission check. That is a sharp opt-in boundary, not a general claim that arguments are governed.

This distinction matters for any deep-loop adapter:

| Layer | What it can prove |
|---|---|
| Registry admission | The proposed kind exists and is allowed |
| Edge policy | The kind-to-kind transition is allowed |
| Budget admission | The registered worst-case estimate fits remaining headroom |
| Materializer | The exact admitted proposal becomes the graph |
| Argument policy | **Not supplied by GraphARC admission**; it needs a separate contract |
| Evidence ledger | The authorized transition and receipt can be retained as authority evidence |

[INFERENCE] If a deep-loop graph node can carry paths, commands, or external side effects, those arguments need their own policy and receipt fields. A graph edge alone cannot establish that the object of an operation was safe.

### 1.4 Materialize only what was admitted

The materializer is the second governance seam. Its signature puts the authorization first:

```python
compiled = materializer.materialize(
    admitted_result,
    proposal,
    checkpointer=checkpointer,
)
```

The materializer refuses three important mismatches:

- The first value is not an `AdmissionResult`.
- The admission result is not admitted.
- The result fingerprint or proposal id does not match the proposal being materialized.

This makes “what ran is what was admitted” a checked equality for the planner-to-runtime boundary.

Node bodies come only from operator-owned registry factories. A planner proposal contains node data, not a callable. The materializer then calls `GraphARC.add_node`, `GraphARC.add_edge`, and `compile()`, preserving the runtime’s typed-state and declared-write checks.

The materializer’s topology model is intentionally conservative:

- Proposed edges are static edges.
- Fan-out is represented by multiple outgoing edges.
- Joins are represented by multiple incoming edges.
- A body may return an operator-authored `Command(goto=...)`.
- Dynamic destinations are confined to destinations declared in the admitted edge set, or `END`.
- Nested proposed subgraphs are not materialized by this path.
- Standalone materialization refuses missing entry edges and unreachable nodes.

A compact version of the actual factory pattern is:

```python
def factory(spec):
    def body(state):
        if spec.name == "search":
            return {"found": "cause"}
        return {"fixed": "patch"}
    return body
```

The important fact is that `factory` is registered by the operator. The proposal selects a registered kind and instance name; it does not inject the executable body.

### 1.5 Runtime graph and state

GraphARC’s runtime contract has four coupled controls:

1. **Typed state.** State fields are declared on a state model. Unknown fields are rejected.
2. **Declared writes.** Each node kind or body has an operator-owned set of fields it may write.
3. **Budget enforcement.** Runtime metering charges iterations and tokens and checks time ceilings at execution boundaries.
4. **Trace recording.** Node starts, ends, failures, state deltas, admission decisions, and stop conditions are emitted to JSONL.

The README’s minimal graph illustrates the shape:

```python
from grapharc import GraphARC, GraphARCState, Budget
from grapharc.runtime.graph import START, END

class State(GraphARCState):
    question: str
    answer: str = ""

def answer(state: State) -> dict:
    return {"answer": f"42 (asked: {state.question})"}

g = GraphARC(State, name="demo", budget=Budget(max_iterations=10))
g.add_node("answer", answer, writes={"answer"})
g.add_edge(START, "answer")
g.add_edge("answer", END)
result = g.compile().invoke({"question": "meaning of life"})
```

The example is intentionally small, but it exposes the runtime contract: state schema, node body, declared write set, entry edge, terminal edge, budget, compile, and invoke.

GraphARC’s fan-out helper treats worker exceptions, malformed returns, and timeouts as data rather than allowing one worker failure to become an unstructured process failure. It also deduplicates evidence before synthesis. This is a useful pattern for deep-loop branches, where a failed leaf should be represented in the evidence and reducer input rather than silently disappearing.

The runtime and the governance layers remain separate:

```text
operator-owned registry + policy
              |
       deterministic admission
              |
       exact materialization
              |
       graph kernel + typed state
              |
          trace / replay
```

[INFERENCE] This is the strongest transferable GraphARC pattern: wrap a compatible graph runtime with registry, admission, declared-write, budget, and trace layers instead of replacing the runtime with a second bespoke scheduler.

### 1.6 Observe: trace replay to OpenTelemetry

GraphARC’s OTel module is optional by construction. The module can build spans without importing the OTel dependency. A caller can supply a no-op exporter, an in-memory exporter, or the OTel exporter when the dependency is present.

The replay path is:

```text
JSONL trace
   |
   v
ReplayedRun
   |
   v
to_spans()
   |
   +--> one root span per run
   +--> one child span per node execution
   +--> sub-step spans for model/tool/stop events
   |
   v
SpanExporter / OTelSpanExporter
```

The implementation documents these details:

- The root span represents the run.
- A node execution becomes a child span of the run.
- Model, tool, and stop sub-events are attached to the node execution reconstructed by replay when a parent can be identified.
- An orphan sub-event is attached to the run rather than to a guessed node.
- Timestamps come from recorded event timestamps; node end time is derived from recorded duration.
- Trace events do not carry an explicit parent pointer, so sub-event parentage is an inference made by replay.

That last point is a useful warning for any audit design:

> A trace can be transformed into a useful observability tree without proving that the inferred parent relationship was the causal relationship.

The OTel projection is therefore an observability projection, not the authority ledger. GraphARC’s admission fingerprints and trace events preserve more causal context than a state snapshot, but the deep-loop ledger still needs to carry the authoritative transition decision, policy binding, receipt, and replay fingerprint.

### 1.7 Bench harness

GraphARC includes a benchmark surface under `bench/`. The research evidence describes it as a harness for:

- hashing inputs and outputs;
- invoking an external agent or backend;
- grading task results;
- exposing a command-line entry point; and
- comparing runs using recorded outcomes.

The README describes measured comparisons on common tasks, with success, cost, wall time, and policy-violation information. The harness is useful because it makes the reference implementation testable as a system rather than only readable as an architecture essay.

It is not a deep-loop parity oracle by itself.

A benchmark can show that one implementation completed a task. It does not prove:

- identical reducer output;
- identical convergence decisions;
- identical failure behavior;
- identical authority receipts; or
- identical replay semantics.

For `system-deep-loop`, a graph adapter benchmark needs a current-loop baseline and a graph-shadow result for the same fixture. The research synthesis calls for a deterministic replay fixture and a five-row shadow-parity gate: narrative, state record, delta, reducer output, and convergence/failure decision.

### 1.8 Executable versus aspirational in GraphARC

The README and roadmap are unusually valuable because they distinguish code that exists from seams that remain.

| GraphARC capability | Status supported by the sources | Practical interpretation |
|---|---|---|
| Typed state and declared writes | Executable | The runtime checks state shape and write ownership. |
| Planner proposes data, not callables | Executable | Proposal parsing does not itself execute a body. |
| Deterministic admission | Executable | Registry, policy, budget, depth, and acyclicity checks run before execution. |
| Admission feedback and trace event | Executable | Rejected proposals are recorded and can drive replanning. |
| Exact admission-to-materialization fingerprint | Executable | A changed proposal is refused. |
| Bounded fan-out and worker isolation | Executable | Failures and malformed worker results become result data. |
| JSONL trace replay | Executable | A run can be reconstructed from the trace without re-executing work. |
| Replay-to-OTel transformation | Executable as a trace projection | The span model and exporter seam exist; optional dependency availability remains environment-dependent. |
| Checkpoint compilation and ordinary checkpoint resume | Landed, but bounded | The roadmap marks checkpoint resume as done. Interrupt-style resume remains partial. |
| Interrupt resume | Partial | Suspension exists, but the documented resume path is unsupported and a spurious error trace line remains. |
| `retry_policy`, `cache_policy`, `durability`, and subgraph pass-through | Aspirational | The roadmap marks this seam not started; a checkpointer argument is not equivalent to complete durability pass-through. |
| HTTP API on durable session layer | Aspirational seam | The roadmap says the server still uses a separate in-process session runtime. |
| Argument-level admission | Known limitation | Admission authorizes kind, not arguments. |
| Production deep-loop authority parity | Not established | The bench harness and GraphARC tests do not prove parity with the ledger-backed loop. |

The requested honest summary is therefore:

> GraphARC is executable at the planner/admission/materialize/runtime/trace boundary. Checkpoint support is useful but partial at the interrupt-resume boundary. Durability pass-through is explicitly unimplemented in the roadmap. Do not promote roadmap items into current runtime guarantees.

## 2. LangGraph: official runtime primitives

### 2.1 StateGraph is the builder contract

The official Graph API presents `StateGraph` as a graph builder over application state. A caller declares nodes and edges, then calls `compile()` before invocation.

A minimal shape from the documented API is:

```python
from typing_extensions import TypedDict
from langgraph.graph import StateGraph, START, END

class State(TypedDict):
    input: str
    output: str

def transform(state: State):
    return {"output": state["input"].upper()}

builder = StateGraph(State)
builder.add_node("transform", transform)
builder.add_edge(START, "transform")
builder.add_edge("transform", END)
graph = builder.compile()
```

The API boundary is clear:

- `StateGraph` declares the state contract.
- `add_node` registers executable node functions.
- `add_edge` declares topology.
- `START` and `END` express graph entry and termination.
- `compile()` validates and produces the runnable graph.

LangGraph is a runtime primitive. It does not, by itself, answer who is authorized to propose a node kind, how a policy digest binds to a transition, or how an evidence receipt is sealed.

### 2.2 Nodes and ordinary edges

A node reads the current state and returns a state update. A static edge specifies the next node after the current node. Multiple outgoing edges can express fan-out; multiple incoming edges express a join under the runtime’s super-step model.

The direct operational benefit is explicit topology. The graph makes dependencies inspectable before execution and gives the runtime a place to apply state reducers and persistence.

The graph does not remove ordinary workflow concerns:

- a node can fail;
- a state update can be malformed;
- a fan-in can receive incomplete branch results;
- shared resources can create hidden dependencies; and
- a valid topology can still produce an incorrect answer.

[INFERENCE] For system-deep-loop, each edge should carry enough authority context to explain why that transition was allowed. A bare LangGraph edge is a routing mechanism, not an authorization record.

### 2.3 Conditional edges

The official API exposes `add_conditional_edges`. A routing function reads the current state and returns one or more destinations. A mapping can translate a routing key into a destination node.

```python
def route(state: State):
    if state["output"]:
        return "finish"
    return "retry"

builder.add_conditional_edges(
    "transform",
    route,
    {
        "finish": "finish",
        "retry": "retry",
    },
)
```

Conditional edges are data-driven routing. They are not automatically fail-closed authorization.

GraphARC narrows this capability in two ways:

1. The planner’s proposed topology is admitted against registry, policy, budget, depth, and acyclicity checks.
2. Operator-authored dynamic `Command`/`Send` destinations are confined to destinations declared in the admitted graph.

This is the governance-wrapper insight in concrete form:

```text
LangGraph conditional routing = runtime routing primitive
GraphARC admission + materialize = governance boundary around that primitive
036 ledger/gateway = authority and receipt boundary beside the graph
```

### 2.4 Send and map semantics

The official Graph API documents `Send` for dynamic map-style fan-out. A conditional route can return multiple `Send` objects, each targeting a node with a per-branch argument or state fragment.

A representative shape is:

```python
from langgraph.types import Send

def map_subjects(state: State):
    return [
        Send("worker", {"subject": subject})
        for subject in state["subjects"]
    ]

builder.add_conditional_edges("split", map_subjects)
```

The important semantics are:

- the route function determines the branch set from current state;
- each `Send` identifies a destination node and branch input;
- multiple destinations execute as a fan-out in the next superstep; and
- a reducer or downstream join must define how branch updates combine.

The source corpus warns against treating scheduler metadata as an implicit graph. In the current deep-loop runtime, `wave`, `depends_on`, and `touches` are rejected rather than approximated; the explicit flat-pool behavior must not be silently converted into a graph shape.

[INFERENCE] A graph adapter should preserve the existing filesystem-enforced detached lineages for flat-pool fan-out. It should project those lineages into branch nodes, not infer dependencies that the current scheduler intentionally rejected.

### 2.5 Checkpointers and state persistence

The official Persistence documentation distinguishes thread-scoped checkpoints from longer-lived stores. A checkpointer is supplied when compiling the graph, and invocation uses a `thread_id` so state history can be associated with a run/thread.

The useful capabilities include:

- continuity across steps;
- human-in-the-loop interruption patterns;
- fault tolerance;
- state history and time travel; and
- persistence of graph state between invocations.

A representative compile/invoke shape is:

```python
from langgraph.checkpoint.memory import InMemorySaver

checkpointer = InMemorySaver()
graph = builder.compile(checkpointer=checkpointer)

config = {"configurable": {"thread_id": "run-123"}}
result = graph.invoke(initial_state, config)
```

A checkpointer preserves execution state. It does not automatically preserve all of the evidence needed to answer a replayable “why” question.

The distinction should be explicit:

| Checkpoint state | Why-audit evidence |
|---|---|
| Current or historical state snapshot | Transition decision and policy evaluation |
| Thread identity | Sealed artifact and receipt identity |
| Reducer-applied values | Exact input/output fingerprints |
| Resume position | Identity, authorization, and stale-writer fencing |
| Runtime continuation | Blinded/counterfactual adjudication evidence |

The research synthesis therefore rules out “checkpoint as authority ledger.” LangGraph persistence is a resume/state primitive. The deep-loop ledger remains the authority and audit plane.

### 2.6 Why a checkpoint is not a replayable why-audit

A checkpoint can answer questions such as:

- What state was saved for this thread?
- What node or step was next?
- What state history is available for time travel?
- Can execution continue from the saved state?

It does not, without an additional event and receipt layer, establish:

- which policy digest authorized the transition;
- whether the writer held the current fence capability;
- which evidence was blinded from an adjudicator;
- which artifact hashes were sealed at the decision boundary;
- whether a transition was a replay of a prior decision; or
- why a convergence vote was allowed to stop the loop.

This is not a criticism of LangGraph. It is a scope distinction between state persistence and authority evidence.

[INFERENCE] A reliable deep-loop graph implementation can use a LangGraph checkpointer for operational resume while writing every authority-bearing transition to the 036 ledger. Neither layer should be treated as a substitute for the other.

### 2.7 LangGraph gotchas for deep-loop operators

1. **Compile is not admission.** Compilation checks graph structure. It does not replace policy, identity, or budget admission.
2. **Conditional edges are not authorization.** A route function can choose a destination; it does not prove the caller was authorized to take it.
3. **Send is not evidence completeness.** A map branch can be launched, but fan-in still needs branch accounting and missing-result handling.
4. **Checkpoint is not a sealed receipt.** State history does not automatically bind to artifact hashes or policy digests.
5. **Reducer behavior matters at replay.** A state snapshot may show the merged result while a why-audit needs the individual branch inputs and merge evidence.
6. **Topology does not create truth.** A graph can be well-formed and still produce a wrong answer.
7. **Shared resources create hidden edges.** Filesystem and registry mutations can make apparently parallel work unsafe.

## 3. graph-engineering-master: documentary workflows

### 3.1 What the repository delivers

The README defines graph engineering as two related disciplines:

1. **Knowledge graphs:** what agents remember, including entities, facts, typed relationships, time, and provenance.
2. **Task graphs:** how agents work, including jobs, execution dependencies, parallel fan-out, separate verifiers, stop rules, and human gates.

The repository presents:

- a `graph-engineering/` skill directory;
- a `references/` curriculum and topic set;
- `WORKFLOWS.md` with nine paste-ready prompt blocks; and
- `dist/graph-engineering.skill` as a packaged skill artifact.

The local implementation directory is empty in the supplied snapshot. The research iteration verified the package inventory and the absence of files under that directory. The honest status is therefore:

> documentary guidance plus a packaged skill, not a checked-in executable graph implementation.

This distinction matters when borrowing ideas. The README’s task-graph rules are useful design heuristics, but they are not local runtime guarantees.

### 3.2 The nine workflow blocks

`WORKFLOWS.md` contains nine prompt blocks. They form a staged knowledge-graph design and evaluation discipline.

| Block | Purpose | Useful graph-engineering habit |
|---|---|---|
| `/kg-tutor` | Interactive course route | Ask for domain, level, and time; teach one module; require a build artifact before continuing |
| `/kg-scope` | Domain scope and questions | Decide whether questions need traversal or aggregation before writing code |
| `/kg-schema` | Ontology construction | Define classes, properties, domains, ranges, and modeling decisions before extraction |
| `/kg-extract` | Extraction pipeline | Route structured data without a model; measure prompted extraction before fine-tuning |
| `/kg-relations` | Relation extraction | Require typed triples, confidence, evidence spans, and provenance |
| `/kg-events` | Event extraction | Keep event nodes separate from entities; preserve causal and temporal structure |
| `/kg-fuse` | Entity resolution and merge | Use blocking, a review band, source precedence, and reversible merges |
| `/kg-eval` | Skeptical evaluation | Sample precision/recall, identify leakage, and compare against trivial baselines |
| `/kg-rag` | Graph retrieval | Route question types to lookup, traversal, subgraph, or vector retrieval; prove graph value |

The task-graph advice is especially relevant to deep-loop work:

- remove fake edges;
- use a split → parallel workers → separate verifiers → owned merge diamond;
- place a human gate where a mistake becomes expensive to undo; and
- stop when the graph’s declared objective or evidence condition is met.

The workflow blocks also insist on evidence spans and provenance for extracted graph facts. That is directly compatible with an evidence-ledger mindset, but the prompts themselves do not implement ledger append authorization.

### 3.3 Knowledge graph versus task graph

Do not collapse these two meanings of “graph.”

| Knowledge graph | Task graph |
|---|---|
| Models entities, facts, relationships, time, and provenance | Models jobs, dependencies, branch execution, and joins |
| Answers multi-hop domain questions | Coordinates work and control flow |
| Needs ontology, extraction, fusion, and serving | Needs node contracts, routing, budgets, verifiers, and stop rules |
| Persistent memory-oriented structure | Often ephemeral per-run work structure |
| Quality risks include entity resolution and provenance loss | Quality risks include missing branches, hidden shared edges, and bad fan-in |

The current `system-deep-loop` graph track is primarily about **task/orchestration graphs**. Coverage graphs and knowledge-graph concepts can support evidence analysis, but they are not the same as the control graph.

### 3.4 What is useful despite the missing implementation

The documentary package contributes four practical tests:

1. **Fake-edge test:** remove an edge if downstream work does not consume upstream output.
2. **Diamond test:** split work, run independent workers, verify in fresh contexts, then merge through one owner.
3. **Question-shape test:** use a graph when the question needs traversal; use aggregation when it needs a database-style calculation.
4. **Maintenance test:** require a multi-hop evaluation that proves the graph earns its maintenance cost.

These tests are design guidance, not runtime enforcement. [INFERENCE] They can become review criteria for a graph adapter without pretending that the documentary package supplies executable scheduler code.

## 4. Lessons for system-deep-loop

### 4.1 Preserve the current authority split

The research synthesis describes the live loop as a seven-mode workflow family with externalized JSONL state, strategy, registry, dashboard, iterations, and deltas. The 036 work adds an evidence-ledger spine, fail-closed transition authorization, sealed artifacts, replay fingerprints, receipts/certificates, and blinded adjudication, but authority cutover remains gated.

The graph track must therefore be additive and shadowable.

```text
stable control graph
  mode registry
  shared policy and identity contracts
  graph-version/config metadata
          |
          +--> per-run work graph
                  phase nodes
                  flat-pool branch nodes
                  verifier/fan-in nodes
                  convergence routes
                  checkpoint references
          |
          +--> evidence ledger
                  authorized transitions
                  sealed artifacts
                  receipts
                  replay fingerprints
                  adjudication evidence
```

The graph is a structural execution and visualization layer. The ledger remains the authority layer.

### 4.2 Stable control graph plus per-run work graphs

The research corpus and iteration findings support two coupled graph layers:

- a **stable control graph** for durable modes, ownership, shared policies, and routing contracts; and
- an **ephemeral work graph** for a particular run’s tasks, branches, verifiers, merges, and convergence decisions.

For `system-deep-loop`, this means:

| Stable control graph candidate | Per-run work graph candidate |
|---|---|
| `mode-registry.json` routing authority | One node per bounded iteration or phase |
| Mode family and backend contracts | Focus-specific research/review/council work |
| Shared identity and policy rules | Branch lineages and verifier nodes |
| Ledger gateway boundary | Current state snapshot and artifact references |
| Graph schema/version | Branch-to-join topology for one run |
| Operator rollback policy | Stop, retry, block, or continue route |

This is a target mapping, not a claim that the current runtime has already migrated.

### 4.3 Mapping current deep-loop concepts to graph concepts

| Current deep-loop concept | Graph representation | What must not be lost |
|---|---|---|
| Mode registry | Stable control-graph routing and node-kind registry | Registry remains routing authority |
| Mode phase | Bounded node or subgraph | Explicit input/output contract |
| Iteration focus | Work-graph node metadata | Focus, iteration number, and artifact identity |
| JSONL state | Graph state plus event references | Append-only event history and exact reducer inputs |
| Reducer | State reducer or owned merge node | Deterministic merge and branch completeness |
| Flat-pool fan-out | Explicit parallel branch nodes | Detached filesystem lineages and no inferred dependencies |
| Fan-in | Owned merge/verifier node | Content-first deterministic merge and contradictions |
| Convergence | Conditional route to continue, stop, or block | Inline three-signal vote remains authoritative |
| Loop lock | Serialized gateway or lease/fence boundary | Owner, nonce, stale reclaim, and partial-record risk |
| Sealed artifact | Artifact reference in state plus ledger event | Hash, provenance, and receipt |
| Transition authorization | Ledger gateway event adjacent to edge | Identity, policy digest, and stale-writer fencing |
| Replay fixture | Deterministic graph run plus ledger replay | Why-audit, not only state reconstruction |
| Coverage graph | Auxiliary projection | Missing edges can reduce coverage, not change inline ratio |

The graph should expose the control-flow structure while the ledger records the authority-bearing facts that make a transition acceptable.

### 4.4 Convergence is not merely an edge

A graph can represent the route after a convergence decision:

```text
aggregate evidence
       |
       v
compute inline signals
       |
       +--> continue
       +--> stop_allowed
       +--> stop_blocked
       +--> error / operator hold
```

The graph must not replace the inline three-signal vote with topology. The synthesis explicitly states that the graph layer is a structural guard for contradiction, coverage, diversity, hotspots, and replay. It is not a replacement for the inline vote.

The current graph-assisted behavior is a veto shape: stop only when the inline decision permits stop and the graph does not block it. A `STOP_BLOCKED` outcome becomes `blockedStop` rather than silently terminating.

[INFERENCE] A convergence node should emit both its computed route and the ledger receipt that binds the route to the exact evidence snapshot. A route label without the evidence fingerprint is not enough for a why-audit.

### 4.5 Branches, lineages, and joins

The research findings specifically caution against inventing graph dependencies from rejected scheduler metadata. The current flat-pool model is explicit: branch lineages are filesystem-enforced detached subgraphs. Preserve that property.

A practical graph projection is:

```text
frontier
  |
  +--> branch-001 (detached lineage)
  +--> branch-002 (detached lineage)
  +--> branch-003 (detached lineage)
  |
  v
completeness check
  |
  +--> missing branch: block or record failure
  |
  v
fan-in merge
  |
  +--> deterministic output
  +--> CONTRADICTS variants
  +--> registry-only writes
```

The merge policy from the research synthesis is content-first with an ID tiebreak. Contradictory variants remain explicit rather than being silently discarded. This is a task-graph merge, not a claim that the coverage graph is the source of truth.

### 4.6 Proposed adapter state

The research identifies a first adapter candidate: research mode in additive-dark shadow. The suggested typed `ResearchGraphState` includes fields for:

- schema version;
- namespace;
- iteration;
- artifact hashes;
- knowledge identifiers;
- signals; and
- route.

The exact implementation belongs in a follow-up implementation packet. This reference document records the contract boundary only.

A useful state-shape sketch is:

```text
ResearchGraphState
  schemaVersion
  namespace
  iteration
  artifactHashes
  knowledgeIds
  signals
  route
  graphEvents
```

`graphEvents` is a bridge or projection input, not a replacement for ledger events.

### 4.7 Migration sequence

The research synthesis recommends four stages.

#### Phase A: additive-dark research adapter

- Build the adapter without making the graph authoritative.
- Keep the existing research loop as the behavior under test.
- Emit graph state and graph events beside existing JSONL state.
- Keep the adapter database-independent.
- Preserve existing flat-pool lineages.

#### Phase B: exact shadow parity

Compare the legacy and graph paths on deterministic fixtures.

Required parity rows:

| Row | Pass condition |
|---|---|
| Narrative | One equivalent narrative artifact is produced |
| State | One equivalent state record is produced |
| Delta | One equivalent delta is produced |
| Reducer | Reducer outputs are identical |
| Convergence/failure | Decisions and failure cases are identical |

Add a permutation-based branch-to-join replay fixture. Branch completion order must not change the deterministic merge result.

#### Phase C: per-mode cutover

- Cut over one mode at a time.
- Place the graph path behind the 036 gateway.
- Keep a rollback window.
- Retire the legacy path only after zero-use evidence.
- Do not cut authority while 024 fencing, identity binding, lock closure, and parity prerequisites remain blocked.

#### Phase D: convergence-graph enrichment

Only after the projection dependency is healthy:

- add contradiction, coverage, citation, and topology fingerprints;
- measure graph-assisted veto behavior;
- restore or deliberately resolve coverage-graph database availability; and
- keep the inline vote authoritative.

The migration is not a big-bang graph replacement.

### 4.8 When not to use a graph

The corpus recommends graph engineering for complex or high-concurrency work, at least three independent verification steps, complex decision routing, or governed fan-out/fan-in. It recommends keeping a loop when the work is simple, linear, low-state, single-pass, approval-heavy, or genuinely sequential.

Use a loop when:

- each step depends on the immediately previous step;
- there is no meaningful independent fan-out;
- a human must approve each tight step;
- state is small and local;
- graph design and routing overhead exceed the task value; or
- the backend already fits the least-complex workflow shape.

Use a graph when:

- independent work can safely run in parallel;
- separate verifiers improve confidence;
- a governed diamond is real rather than decorative;
- routing decisions need explicit inspection;
- branch completeness and join behavior need machine checks; or
- replay and observability benefit from explicit topology.

Do not graph every leaf operation. A graph node should represent a meaningful boundary with an input/output contract, a write set, and an observable decision or artifact.

### 4.9 Operational gotchas

1. **Registry drift:** A repeated planner run must use a frozen registry. Otherwise later proposals can see a different allowlist than earlier decisions.
2. **Unknown endpoint kinds:** Fail closed. Do not treat an unresolvable live node as permitted.
3. **Argument forwarding:** Treat `forward_args=True` as a separate policy surface.
4. **Unreachable nodes:** Reject before materialization, not after a supposedly successful admission.
5. **Dynamic goto:** Confine destinations to the admitted edge set.
6. **Budget estimates:** Registry worst-case values are estimates; runtime meters enforce actual ceilings.
7. **Checkpoints:** Do not call persistence a why-audit.
8. **Trace parentage:** If the trace has no parent pointer, OTel hierarchy may include inferred relationships.
9. **Fan-in completeness:** A successful join must account for every required branch, including recorded failures.
10. **Shared files:** Parallel branches can collide through shared resources even when the graph has no edge.
11. **Coverage graph availability:** Do not make adapter correctness depend on the optional graph database projection.
12. **Stale prose:** Treat code-verified runtime behavior as authoritative over old landing text.
13. **Authority gates:** Do not cut over before 036 prerequisites are discharged.
14. **Benchmark inflation:** A passing benchmark is not parity unless it compares the same fixture and reducer/convergence outputs.
15. **Empty implementation directories:** README claims do not prove executable behavior.

## 5. Recommended review checklist

Use this checklist before approving a graph adapter or graph-shaped runtime change.

### Graph contract

- [ ] Every node has a declared input and output/state contract.
- [ ] Every node has an operator-owned write set.
- [ ] Every edge has a real data or control dependency.
- [ ] Conditional routes have an explicit finite destination policy.
- [ ] Fan-out and fan-in account for missing and failed branches.
- [ ] The graph has an explicit stop, block, retry, or human-hold route.

### Admission and materialization

- [ ] The proposal is data, not an executable callable.
- [ ] Registry, policy, budget, depth, and acyclicity checks run before execution.
- [ ] Rejections are structured, traceable, and fed back for replanning.
- [ ] Materialization requires the exact admitted proposal fingerprint.
- [ ] Dynamic destinations are confined to admitted edges.
- [ ] Argument forwarding is either forbidden or separately authorized.

### Ledger and audit

- [ ] Checkpoint state is separate from authority evidence.
- [ ] Every authority-bearing transition has an event, receipt, and fingerprint.
- [ ] Sealed artifact hashes bind to the decision snapshot.
- [ ] Identity and stale-writer fencing are enforced at the gateway.
- [ ] Blinded/counterfactual adjudication is represented by evidence, not topology alone.
- [ ] Replay can reconstruct both state and why, subject to documented limits.

### Shadow parity

- [ ] One deterministic fixture runs through legacy and graph paths.
- [ ] Branch completion order is permuted.
- [ ] Reducer output remains identical under permutation.
- [ ] Convergence decisions remain identical.
- [ ] Failure and malformed-worker behavior remains identical.
- [ ] No coverage-graph database is required for the correctness gate.

### Maturity and rollout

- [ ] Executable behavior is distinguished from roadmap items.
- [ ] GraphARC-style checkpoint limitations are documented.
- [ ] Durability pass-through is not claimed until implemented and tested.
- [ ] A rollback window exists for per-mode cutover.
- [ ] Legacy retirement waits for zero-use evidence.
- [ ] 036 authority prerequisites are green before graph authority changes.

## 6. Glossary

| Term | Definition in this reference |
|---|---|
| Admission | Deterministic decision that a proposed graph shape may execute |
| Materialization | Turning one exact admitted proposal into a runnable graph |
| Node kind | Registry identity used for policy and cost decisions |
| Node instance name | Planner-chosen label identifying one node instance |
| Declared writes | Operator-owned state fields a node may update |
| Conditional edge | State-driven route to one or more graph destinations |
| Send/map | Dynamic map-style fan-out with per-branch input |
| Checkpointer | Persistence mechanism for graph execution state and history |
| Why-audit | Evidence-backed explanation of an admitted transition and its inputs |
| Work graph | Per-run, often ephemeral task topology |
| Control graph | Stable topology of modes, policies, ownership, and routing contracts |
| Fan-in | Merge of branch results into an owned downstream step |
| Flat-pool lineage | Detached branch execution with no inferred dependency schedule |
| Ledger plane | Authority, receipts, sealed artifacts, fingerprints, and adjudication evidence |
| Projection | Derived graph, coverage, metrics, or OTel representation |

## Sources

- `specs/system-deep-loop/037-graph-engineering/research/research.md` — authoritative 20-iteration synthesis; especially findings and recommendations in sections 8–11.
- `specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-003.md` — GraphARC contracts, task-graph patterns, and stable-control/work-graph inference.
- `specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-004.md` — official LangGraph API and persistence findings; GraphARC wrapper comparison.
- `specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-008.md` — GraphARC admission, materialization, state, trace, budget, replay, and bench verification.
- `specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-010.md` — graph-engineering-master delivery boundary, nine-workflow synthesis, and graph-selection criteria.
- `specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/README.md` — GraphARC architecture, quick start, admission example, comparison, and limits.
- `specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/ROADMAP.md` — measured maturity, checkpoint/interrupt status, durability pass-through status, bench and seam notes.
- `specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/grapharc/planner/admission.py` — admission checks, result shape, policy identity, budget estimation, and trace emission.
- `specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/grapharc/planner/materialize.py` — exact admission matching, registry factories, declared topology, and dynamic-route confinement.
- `specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/grapharc/observe/otel.py` — replay-to-OTel span model, exporter seam, and parentage limitations.
- `specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/README.md` — knowledge/task graph distinction, package contents, pipeline, and task-graph rules.
- `specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/WORKFLOWS.md` — nine prompt blocks and evidence-oriented workflow discipline.
- `https://docs.langchain.com/oss/python/langgraph/graph-api` — official StateGraph, nodes, edges, conditional routing, and Send/map semantics, as consulted and recorded in iteration-004.
- `https://docs.langchain.com/oss/python/langgraph/persistence` — official checkpointer, thread, state-history, and persistence semantics, as consulted and recorded in iteration-004.
