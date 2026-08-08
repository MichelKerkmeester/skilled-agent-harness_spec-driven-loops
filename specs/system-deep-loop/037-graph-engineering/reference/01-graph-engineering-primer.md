# Graph Engineering Primer — Typed graphs for governed agent workflows

Graph engineering structures agent workflows and durable knowledge as typed, stateful, observable graphs with explicit authority boundaries.

---

## 1. OVERVIEW

**Core Principle**: Graph engineering is the design and operation of typed stateful workflows whose nodes have contracts, whose edges have governed meaning, whose subgraphs make reusable boundaries, whose checkpoints support resume, and whose traces make execution inspectable.

This document is a primer on graph engineering: its purpose, the distinction between knowledge and task graphs, the contracts that govern state and transitions, and the operational criteria for using graphs in system-deep-loop.

Graph engineering is the discipline of structuring agent workflows as typed graphs.

A graph is not merely a diagram of boxes and arrows.

It is an executable contract for what work may occur, what state may change, and which transition may follow.

A graph-engineered workflow makes nodes, state, edges, subgraphs, checkpoints, admission, and traces explicit.

The objective is controlled composition: parallel work where dependencies permit it, bounded routing where decisions vary, and evidence about what happened and why.

This primer uses two related meanings of graph engineering.

Knowledge-graph engineering structures what an agent remembers and retrieves.

Task-graph engineering structures how agents perform work.

They share typed relationships, provenance, validation, and explicit topology.

They are not the same data model and should not be collapsed into one undifferentiated graph.

### Executive definition

> Graph engineering is the design and operation of typed stateful workflows whose nodes have contracts, whose edges have governed meaning, whose subgraphs make reusable boundaries, whose checkpoints support resume, and whose traces make execution inspectable.

A node is a bounded unit of work.

A node contract declares its accepted state, its permitted writes, its result shape, and its failure behavior.

An edge is a permitted dependency or route.

An edge contract declares its source, destination, triggering condition, and any authorization or budget requirements.

State is the typed data shared through the workflow.

A checkpoint is resumable execution state, not automatically an authority ledger or a complete explanation of why a transition occurred.

A trace is an execution record that makes node order, outcomes, deltas, timing, and routing observable.

Admission is the fail-closed decision that a proposed graph or transition is allowed to execute.

A subgraph is a named graph boundary that packages a coherent sequence or pattern behind an explicit input/output contract.

**Key points**

- Graphs are executable contracts, not diagrams.
- Knowledge graphs and task graphs are coupled interfaces with separate schemas and authority rules.
- Nodes, edges, state, admission, checkpoints, and traces require explicit contracts.

## 2. THE SHAPE OF A GRAPH-ENGINEERED WORKFLOW

The smallest useful model is:

```text
Typed input state
      |
      v
  [admitted node] ---- governed edge ----> [admitted node]
      |                                      |
      +---------- declared state delta ------+
                          |
                          v
                  checkpoint + trace
```

The graph runtime should be able to answer these questions without asking the model to explain itself.

| **Question** | Graph-engineering answer |
|---|---|
| **What can run?** | A node registered with a known kind and admitted under policy. |
| **What can it write?** | The fields declared by its node contract. |
| **Where can it go?** | To a declared and governed destination. |
| **How much work is allowed?** | Within admitted and runtime-enforced budgets. |
| **How can it resume?** | From a checkpointed state and position. |
| **What happened?** | From a durable trace of node and transition events. |
| **Why was a route accepted?** | From an admission decision and its evidence. |
| **What is authoritative?** | The system's designated event and authorization plane, not a mutable snapshot by default. |

**Key points**

- Runtime questions must be answerable from contracts and durable records.
- A governed edge connects admitted nodes and carries declared state changes.
- Authority belongs to the designated event and authorization plane, not a mutable snapshot by default.

## 3. TWO COUPLED PROBLEMS

Graph engineering has two coupled but distinct halves.

The knowledge graph models durable meaning.

The task graph models bounded work.

The two halves can exchange identifiers, evidence, and results.

They should retain separate schemas and separate authority rules.

### Knowledge graph: what the system remembers

A knowledge graph represents entities, facts, events, and typed relations.

Its purpose is to preserve meaning that flat retrieval may not expose directly.

A knowledge graph commonly contains:

| **Element** | Definition | Example |
|---|---|---|
| **Entity** | A distinguishable thing with identity. | A mode, incident, decision, service, or person. |
| **Fact** | A statement attached to entities or events. | A mode uses a particular runtime contract. |
| **Event** | A thing that happened at a time or interval. | A policy decision admitted a transition. |
| **Typed relation** | A named relationship with constrained meaning. | `supersedes`, `caused`, `depends_on`, `CITES`. |
| **Ontology** | The vocabulary and constraints for entity and relation types. | Which node kinds may `SUPPORT` which claim kinds. |
| **Provenance** | The origin and support for a fact or relation. | Source path, span, author, timestamp, or receipt. |
| **Temporal semantics** | The distinction between when a fact was true and when it was learned. | Validity interval versus observation time. |

The graph-engineering-master material gives the knowledge-graph pipeline as:

```text
ontology -> extraction -> fusion -> serving
```

A practical expanded pipeline is:

```text
scope -> representation -> ontology -> entities -> relations -> events
      -> quality gate -> fusion -> serve to agents
```

The ordering matters.

Model the domain before extraction.

Extract only structures that the ontology can represent.

Fuse duplicates and conflicts before serving unqualified results.

Verify at each stage instead of treating ingestion as truth.

A knowledge graph is a product with a schema, not a pile of triples.

### Knowledge-graph relations carry meaning

An untyped link says only that two things are related.

A typed edge says how they are related.

```text
Untyped:
  queue --related_to--> decision --related_to--> incident

Typed:
  queue    --decided_by--> ADR-007
  ADR-007  --supersedes--> ADR-003
  ADR-003  --caused--> Incident-2026-03-11
```

The typed version supports a meaningful traversal.

The untyped version leaves direction and semantics to a later reader or model.

A small controlled vocabulary is preferable to a large set of inconsistent verbs.

Candidate relation types include `depends_on`, `supersedes`, `decided_by`, `caused`, `COVERS`, `CITES`, and `CONTRADICTS`.

The allowed vocabulary must be bound to the ontology or registry that governs it.

### Extraction is not truth

Extraction converts documents, records, or execution artifacts into candidate entities, facts, and relations.

Every extracted fact should carry evidence sufficient for review.

A useful extracted relation record contains:

```json
{
  "subject": "ADR-007",
  "predicate": "supersedes",
  "object": "ADR-003",
  "confidence": 0.91,
  "evidence_span": "ADR-007 replaced ADR-003",
  "source": "decision-record.md",
  "observed_at": "2026-07-25T12:00:00Z"
}
```

The exact schema is illustrative.

The durable requirement is that provenance travels with the assertion.

A relation without evidence is a candidate, not an established fact.

### Fusion must preserve disagreement

Fusion resolves duplicates, aligns identifiers, and combines evidence.

A merge must be reversible.

Conflicting values should not be silently overwritten merely because one source arrived later.

The system should preserve aliases, source-specific values, merge decisions, and the evidence used to make them.

Entity-resolution errors compound over multi-hop traversal.

Therefore identity resolution is a graph-quality control, not a cosmetic cleanup step.

### Serving is query-dependent

Graph traversal is useful when the question depends on relationships, multiple hops, temporal order, or corpus-wide synthesis.

Vector or keyword retrieval remains useful for simple lookups and low-cost retrieval.

The practical rule is to route by question type.

Do not force every query through a graph merely because a graph exists.

The graph-engineering corpus explicitly warns that graphs lose their advantage when the question needs aggregation rather than traversal or when the maintenance overhead exceeds the value.

### Task graph: how agents work

A task graph represents jobs and execution dependencies.

Nodes are work units such as planning, retrieval, extraction, review, synthesis, or a human approval.

Edges express data dependencies, control dependencies, or guarded routes.

A task graph makes parallelism and verification topology explicit.

A common governed diamond is:

```text
             +--> [security verifier] --+
[planner] -> [worker]                    +--> [owned merge] -> [gate]
             +--> [logic verifier] -----+
```

The verifier branches should be genuinely independent when declared independent.

Each verifier should receive the right input and produce a typed result.

The merge should have one owner and a clear conflict rule.

A human gate belongs where a mistake becomes expensive to undo.

A stop rule belongs on every potentially repeating route.

### Delete fake edges

An edge is real only when downstream work consumes upstream output or depends on its completion.

An edge that exists only because two nodes happen to run in the same workflow is a fake edge.

Fake edges serialize work unnecessarily and hide the actual dependency shape.

The test is simple: remove the edge and ask whether the downstream job still has the required input and authority.

If it does, the edge may be a scheduling preference rather than a dependency.

If it does not, document the consumed artifact or state field that makes the edge real.

**Key points**

- Knowledge graphs preserve meaning; task graphs govern bounded work.
- Typed relations need ontology, evidence, provenance, and controlled vocabulary.
- Extraction is candidate generation, fusion must preserve disagreement, and serving should route by question type.
- Task-graph branches, joins, human gates, and stop rules must represent real dependencies and risks.

## 4. STABLE CONTROL GRAPH AND PER-RUN WORK GRAPH

A production workflow needs two graph layers.

The stable control graph defines durable roles, registry kinds, policy boundaries, identity rules, and reusable mode contracts.

The per-run work graph defines the concrete jobs, branches, joins, retries, and stop routes for one invocation.

The stable graph changes slowly and is reviewed as system structure.

The work graph changes with the goal, evidence, budget, and failures of a particular run.

| **Stable control graph** | **Per-run work graph** |
|---|---|
| Mode and node kinds. | Concrete node instances for one run. |
| Registry factories. | Materialized work bodies. |
| Policy and identity rules. | Admitted transitions and current frontier. |
| Shared state schema versions. | Run-local state values and evidence IDs. |
| Durable ownership boundaries. | Fan-out branches and join results. |
| Versioned governance. | Checkpoint and trace sequence. |

This separation prevents a run-specific plan from silently redefining the system's authority model.

It also allows the work graph to adapt without turning every dynamic edge into a permanent control-plane change.

For system-deep-loop, the mode registry and shared policy/identity contracts are candidates for the stable control graph.

A run-specific work graph can represent dispatch, evidence fan-out, synthesis, convergence, and blocked or retry routes.

[INFERENCE] The existing evidence ledger should remain adjacent to both graph layers as the authoritative event and authorization plane.

[INFERENCE] A graph adapter should project ledger-backed state into a typed work graph rather than replacing the ledger with graph state.

### Why the distinction matters

A control graph answers what the system is allowed to do in general.

A work graph answers what this run has been admitted to do now.

Confusing the two creates governance bugs.

A planner could otherwise smuggle a new capability into a run by naming a new node instance.

A work graph could otherwise mutate a shared role or policy definition as if it were ordinary run state.

A stable control graph also gives operators a reviewable surface for registry changes.

The work graph gives operators a concrete surface for run inspection and replay.

**Key points**

- Stable governance and dynamic execution must remain separate graph layers.
- The work graph may adapt, but it must not redefine authority or capability classes.
- The evidence ledger remains the authoritative event and authorization plane. [INFERENCE]

## 5. TYPED STATE AND DECLARED WRITES

Typed state is the boundary between a node's contract and the rest of the graph.

The state schema declares the fields that may exist.

The node contract declares which of those fields the node may write.

The runtime validates both the shape of the update and the ownership of the write.

GraphARC illustrates this discipline with a state model that forbids unknown fields and validates assignment.

Its direct graph example declares `writes={"answer"}` for the node that returns an answer.

A small illustrative pattern is:

```python
class WorkState(GraphState):
    question: str
    evidence_ids: list[str] = []
    answer: str = ""


def answer_node(state: WorkState) -> dict:
    return {"answer": render_answer(state.evidence_ids)}

workflow.add_node("answer", answer_node, writes={"answer"})
```

This snippet is illustrative, not a claim about a required project API.

The important invariant is that the returned update and the declared write set agree.

An undeclared field should fail at the boundary.

An unknown route should fail closed.

A malformed result should become an explicit failure record or rejected transition, not an implicit success.

### State planes should be separated

Do not treat every state-like artifact as the same thing.

| **Plane** | Purpose | Mutability | Authority question |
|---|---|---|---|
| **Working graph state** | Current reducer input and node outputs. | Mutable through declared writes. | What does the next node need? |
| **Checkpoint** | Resume position and serialized state. | Versioned snapshots. | How can execution continue safely? |
| **Trace** | Node order, events, deltas, timing, failures. | Append-oriented record. | What happened during execution? |
| **Evidence ledger** | Authorized effects, receipts, sealed references, and temporal events. | Append-only or otherwise governed. | What transition is authoritative and why? |
| **Knowledge graph** | Durable entities, facts, relations, and provenance. | Governed fusion and updates. | What does the system know, and with what support? |

A checkpoint is useful for resume.

A trace is useful for observability and reconstruction.

Neither becomes the evidence ledger merely by being persistent.

[INFERENCE] A graph checkpoint should carry the minimum state needed to resume, while receipts bind authoritative effects and transitions outside the mutable snapshot.

### State reducers need explicit semantics

When parallel branches join, the merge rule is part of the graph contract.

A reducer should state whether values are replaced, appended, deduplicated, merged by key, or rejected on conflict.

Content-first deterministic merging is safer than arrival-order merging.

If two branches produce conflicting claims, preserve both variants with provenance and route the conflict to a verifier or gate.

Never let scheduler timing determine authoritative meaning.

A reducer should be deterministic under branch permutation when the declared input multiset is the same.

This property supports replay and shadow parity.

### Declared writes constrain hidden edges

A node that writes a shared field creates a dependency even if no visual edge shows it.

Shared-resource collisions are hidden edges.

If two branches write the same field without a reducer contract, they are not independent.

The graph should either serialize the writes, partition the fields, or define a conflict-aware join.

This is why typed state is also topology discipline.

**Key points**

- State schemas and node write sets are executable boundary contracts.
- Checkpoints, traces, evidence ledgers, and knowledge graphs serve distinct state planes.
- Reducers must be deterministic and conflict-aware; hidden shared writes are hidden edges.

## 6. ADMISSION AND GOVERNANCE

Graph admission is the gate between a proposed topology and executable work.

A model may propose a graph.

The model must not be the final authority that admits its own proposal.

GraphARC's admission checker is deterministic and fail-closed.

It checks registry membership, node and edge policy, remaining budget, depth, optional reachability, and acyclicity.

It records admitted and rejected decisions as structured trace events.

Work discovered during execution must re-enter the same gate.

Admission is not execution.

The checker should not call node factories or execute worker bodies.

The materializer may execute only after it has received a matching admitted proposal.

### Registry-bound routing

Routing authority must bind to registry kinds, not planner-chosen instance names.

A node instance name is a label for one occurrence.

A registry kind is the governed capability class behind that occurrence.

A rename must not launder a denied capability into an allowed one.

Unknown endpoint kinds must be refused rather than assumed safe.

A policy result of `NEEDS_APPROVAL` is a stop, not an implicit allow.

A minimal conceptual admission record is:

```json
{
  "status": "rejected",
  "proposal_fingerprint": "sha256:…",
  "checks_run": ["registry", "policy", "budget", "depth", "acyclicity"],
  "rejections": ["edge_denied"],
  "executed": false
}
```

The fingerprint, checks, and rejection codes make the decision inspectable.

The exact field names are illustrative.

### Admission is necessary but not sufficient

Admission estimates whether a proposed graph fits policy and budget.

Runtime budget enforcement remains necessary because actual calls, durations, and branch counts may differ from estimates.

A runtime meter should charge work at node or call boundaries.

A deadline guard should enforce wall-clock limits.

A graph should expose terminal reasons such as goal reached, no progress, round cap, budget exhaustion, human stop, or error.

An admitted graph can still fail during execution.

Failure must be represented as data that can be routed, inspected, retried under policy, or terminally recorded.

### Governance boundary for system-deep-loop

The system-deep-loop research concludes that the graph adapter must not bypass the existing authority plane.

The 036 evidence-ledger spine includes a typed event ledger, fail-closed transition authorization, sealed artifacts, replay fingerprints, receipts, and blinded or counterfactual adjudication.

A conditional graph edge provides a topology slot.

It does not itself prove identity, policy binding, stale-writer fencing, append authorization, or adjudication independence.

[INFERENCE] The safe placement is gateway first, graph route second, ledger receipt alongside the resulting effect.

The graph may propose or calculate a route.

The authorization gateway decides whether that route may become an authoritative transition.

**Key points**

- Admission is deterministic, fail-closed, registry-bound, and separate from execution.
- Runtime budgets and failure records remain necessary after admission.
- Graph routes may propose effects, but the authorization gateway and evidence ledger decide authoritative transitions.

## 7. PROVENANCE AND TEMPORAL SEMANTICS

Graph engineering is not complete when nodes and edges exist.

It must preserve where an assertion came from and when it applies.

### Provenance

Provenance answers who, what, when, where, and under which transformation.

For a knowledge fact, record its source document, evidence span, extractor or author, observation time, confidence, and fusion history.

For a task result, record the run, graph version, node kind, node instance, input references, output references, model or tool, attempt, and trace location.

For a transition, record the policy and identity binding, admitted proposal, sealed references, effect outcome, and receipt or fingerprint.

A provenance record should remain linkable after fusion.

Do not replace source-specific evidence with a single unqualified value unless the merge decision is itself recorded.

### Valid time and transaction time

A durable graph often needs two clocks.

Valid time is when a fact was true in the world.

Transaction or observation time is when the system learned, recorded, or accepted the fact.

For example, an employment relation can be valid until May while the system learns of its replacement in July.

Closing the old validity interval is different from deleting the old record.

This distinction supports questions about current state and historical state.

A temporal edge can be represented as:

```json
{
  "subject": "person:42",
  "predicate": "works_at",
  "object": "org:old",
  "valid_from": "2024-01-01",
  "valid_until": "2025-05-31",
  "observed_at": "2025-07-03",
  "provenance": ["hr-export-17", "line-204"]
}
```

A later edge may supersede it without erasing the historical assertion.

### Temporal semantics in task graphs

Task execution also has time semantics.

A node can be scheduled at one time, execute over an interval, finish at another time, and produce a result that becomes authoritative only after admission or verification.

Trace timestamps describe execution.

Validity timestamps describe when a derived fact or decision applies.

Ledger timestamps describe when an authorized event was accepted.

These timestamps must not be conflated.

A late-arriving branch result may be observationally real but no longer admissible for the current route.

A stale checkpoint may be resumable only after fencing or freshness checks.

### Contradiction and supersession

`CONTRADICTS` identifies unresolved incompatibility.

`SUPERSEDES` identifies an ordered replacement.

They are not interchangeable.

A newer assertion can supersede an older policy without claiming the older policy was false when originally valid.

A contradiction may require a verifier, human gate, or adjudication branch.

The graph should preserve the conflict and its resolution path.

**Key points**

- Provenance must travel with facts, results, transitions, and fusion decisions.
- Valid time, observation or transaction time, execution time, and ledger acceptance time are distinct.
- Contradiction preserves unresolved incompatibility; supersession records ordered replacement.

## 8. SUBGRAPHS AND REUSABLE BOUNDARIES

A subgraph packages a coherent workflow behind a contract.

Examples include extraction, independent review, evidence fusion, or convergence analysis.

A subgraph should declare:

| **Boundary item** | Required question |
|---|---|
| **Inputs** | Which typed fields or references are accepted? |
| **Outputs** | Which fields, events, or artifacts are produced? |
| **Writes** | Which state fields may change? |
| **Edges** | Which internal routes are possible? |
| **Budgets** | What work and time limits apply? |
| **Failure** | Which errors are returned, retried, or terminal? |
| **Observability** | What trace and provenance records are emitted? |
| **Authority** | Which effects require an external gateway or ledger? |

A subgraph should not hide an unbounded loop or an ungoverned write.

Its internal topology can evolve while the boundary remains stable.

A subgraph is especially useful when the same verification pattern appears in several work graphs.

[INFERENCE] In system-deep-loop, mode-specific graph adapters are natural subgraph boundaries, but authority changes should wait for the existing per-mode migration and parity gates.

**Key points**

- Reusable subgraphs expose typed inputs, outputs, writes, routes, budgets, failures, observability, and authority.
- A stable subgraph boundary must not conceal unbounded work or ungoverned writes.

## 9. CHECKPOINTING, TRACES, AND REPLAY

Checkpointing preserves enough state and position to resume execution.

A checkpointer can prevent a transient process failure from discarding work.

It does not automatically preserve the complete reason a route was selected.

A trace records execution events and state deltas.

A replay facility can reconstruct node order, outcomes, failures, and fan-out from a trace.

A receipt or evidence event can establish the authoritative result of a governed transition.

These are complementary artifacts.

```text
checkpoint = resume from here
trace      = observe what happened
receipt    = prove an authorized effect
ledger     = authoritative event history
```

GraphARC's JSONL trace is a useful example of a single replayable execution record.

Its OTel projection can expose run, graph, node, phase, step, attempt, state-delta, token, cost, model, and termination metadata.

The research also notes limits: parentage may be inferred or fall back to the run span, and observability projection is not a sealed receipt.

A replayable convergence decision should include more than a scalar score.

It should include a canonical node and edge projection or topology hash, relation counts, coverage paths, contradiction set, source-diversity calculation, thresholds, blockers, and exact inline inputs.

[INFERENCE] Those additions are the smallest useful bridge from “the system resumed” to “the system can reproduce why this route was admitted.”

**Key points**

- Checkpoints resume, traces observe and reconstruct, receipts prove authorized effects, and ledgers preserve authoritative event history.
- Replayable convergence decisions require topology, evidence, thresholds, blockers, and exact inputs rather than a scalar score alone.

## 10. CONVERGENCE AS GRAPH ANALYSIS

A graph can expose structure that scalar novelty does not.

Useful structural signals include question coverage, claim verification, contradiction density, source diversity, evidence depth, and hotspot saturation.

The current system-deep-loop research describes graph convergence as an auxiliary structural guard.

It is a veto over stopping, not a replacement for the inline three-signal vote.

The safe combined rule is:

```text
inline_stop_candidate = rolling novelty AND noise guard AND coverage condition
legal_stop = inline_stop_candidate AND graph is STOP_ALLOWED or unavailable
STOP_BLOCKED -> blockedStop
```

Minimum-iteration rules, stuck recovery, quality guards, and the maximum-iteration cap remain independent controls.

If the graph is empty, stale, malformed, unavailable, or expensive to materialize, it must not silently convert weak evidence into a stop.

Graph unavailability should preserve the documented fallback semantics.

A stronger future predicate can require every required question to have meaningful `COVERS` paths, sufficient `CITES` diversity and evidence depth, no unresolved high-confidence contradiction component, and saturated declared hotspots.

Each failed predicate should identify the question, finding, and source IDs needed for recovery.

This is a structural guard, not a blended score that obscures the reason for continuation.

**Key points**

- Graph convergence is an auxiliary structural guard and a veto over stopping.
- Inline novelty, noise, coverage, minimum iterations, recovery, quality, and maximum-iteration controls remain independent.
- Empty, stale, malformed, unavailable, or expensive graph state must preserve documented fallback semantics.

## 11. GRAPH ENGINEERING VERSUS ADJACENT DISCIPLINES

### Prompt engineering

Prompt engineering shapes the words sent to a model.

It controls instructions, examples, output format, and sometimes refusal behavior.

It does not by itself define durable task topology, branch independence, write ownership, or transition authorization.

A strong prompt can improve one node's behavior.

It cannot make an undeclared edge safe.

It cannot make a shared mutable write deterministic.

It cannot prove that a denied capability was not executed.

Graph engineering treats prompts as node-local implementation details inside a governed workflow.

### Loop engineering

Loop engineering shapes repeated observe, decide, act, verify, and retry behavior.

It is valuable for bounded iteration, stuck recovery, and stopping rules.

A loop is often the right shape for a tight sequential dependency or approval-heavy task.

Graph engineering makes the dependencies between such loops explicit.

A graph can contain loops as bounded subgraphs or feedback edges.

It does not require replacing every loop.

The research verdict for system-deep-loop is hybrid loop plus graph, not a big-bang replacement.

### Context engineering

Context engineering curates what a node receives: instructions, documents, tools, state, and retrieved evidence.

Graph engineering determines which node receives which context, through which typed edge, and with which provenance.

Context quality is local to a node.

Topology determines composition across nodes.

A graph can make context handoff explicit, but it does not excuse oversized or irrelevant context.

### Knowledge-graph engineering

Knowledge-graph engineering models entities, facts, events, relations, ontology, provenance, and temporal validity.

Task-graph engineering models jobs, dependencies, routing, execution, budgets, and joins.

Knowledge graphs answer what is connected and how meaning persists.

Task graphs answer what runs, in what order or parallelism, under which controls.

A system may use both, but a task result is not automatically a durable knowledge fact.

A knowledge fact is not automatically an executable task.

### Ordinary orchestration

Ordinary orchestration may schedule jobs without typed state, governed edges, declared writes, provenance, or replayable decisions.

Graph engineering adds explicit contracts and verification at boundaries.

The distinction is not whether the system draws a DAG.

The distinction is whether topology and state are treated as enforceable semantics.

**Key points**

- Prompt, loop, context, knowledge-graph, and ordinary orchestration disciplines solve adjacent problems.
- Graph engineering governs composition, topology, state, provenance, and authorization across node boundaries.
- The system-deep-loop verdict is hybrid loop plus graph, not a big-bang replacement.

## 12. WHEN TO USE A GRAPH

Use graph engineering when the work has several of these properties:

- Independent work can run concurrently.
- There are at least three independent verification steps.
- Decision routing is conditional and non-trivial.
- The work shape evolves as evidence arrives.
- Fan-out and fan-in need explicit ownership and reduction.
- Multiple teams or agents need durable handoff contracts.
- A human gate belongs at a known high-cost-to-reverse point.
- Checkpointed resume and trace-level inspection have operational value.
- Temporal, provenance, or contradiction semantics matter.

The graph should earn its complexity through a measurable dependency or governance need.

## 13. WHEN NOT TO USE A GRAPH

Prefer a simple function or loop when:

- The task is linear and low-state.
- There is no meaningful parallelism.
- One agent performs a single pass with a clear output.
- Dependencies are genuinely sequential.
- Human approval is required at nearly every step.
- The graph would add more routing and failure modes than it removes.
- The question needs aggregation rather than relationship traversal.
- The work has no durable identity, provenance, or resume requirement.

A parallel loop can be enough for several independent simple tasks.

A staged loop can be enough for complex work with sequential milestones.

Do not graph every leaf operation.

The corpus and system research both reject graph fashion as an architecture criterion.

Choose the simplest topology that makes the real dependencies and risks visible.

**Key points**

- Complexity must be justified by dependency, branching, verification, routing, or governance value.
- Simple, sequential, approval-heavy, or non-durable work should remain a function or loop.

## 14. PRACTICAL DESIGN CHECKLIST

Before implementing a graph, write down:

1. The user-visible goal and terminal conditions.
2. The stable control-graph kinds and their owners.
3. The per-run work-graph node instances.
4. The typed state schema and schema version.
5. The declared write set for each node.
6. The reducer for each parallel join.
7. The edge vocabulary and destination rules.
8. The admission checks and rejection codes.
9. The runtime budget and deadline enforcement.
10. The checkpoint contents and freshness rules.
11. The trace event schema and replay boundary.
12. The provenance fields for every durable assertion.
13. The temporal fields for facts and decisions that can change.
14. The human or authority gate location.
15. The stop, retry, and blocked routes.
16. The failure isolation behavior for each node.
17. The rollback or retirement condition for the graph version.
18. The graph-off or dependency-unavailable fallback.

A design is not ready when the happy path is drawn.

It is ready when denied routes, malformed updates, stale state, conflicting branches, and partial execution have explicit behavior.

**Key points**

- Design must specify the goal, control and work graphs, typed state, writes, reducers, routes, admission, budgets, checkpoints, traces, provenance, time, gates, failure behavior, retirement, and fallback.
- Readiness requires explicit behavior for denied, malformed, stale, conflicting, and partial execution.

## 15. A SMALL END-TO-END ILLUSTRATIVE PATTERN

```text
[admit goal]
      |
      v
[plan work graph]
      |
      +--> reject: unknown kind / denied edge / over budget
      |
      v
[materialize admitted nodes]
      |
      +--> [retrieve evidence] ----+
      |                             |
      +--> [independent verifier] --+--> [owned merge]
                                    |
                                    v
                         [gateway-authorized route]
                              |              |
                              v              v
                         [continue]       [blocked stop]
                              |
                              v
                         [checkpoint + trace]
```

The plan is not execution.

The admission result must match the proposal that is materialized.

The merge must be deterministic and provenance-preserving.

The gateway must authorize effects that matter to the authoritative system.

The checkpoint supports resume.

The trace supports inspection.

The stop route must preserve independent quality guards.

**Key points**

- Plan, admission, materialization, execution, authorization, checkpointing, and tracing are separate stages.
- The merge is deterministic and provenance-preserving.
- A blocked stop and independent quality guards remain explicit routes.

## 16. GLOSSARY

| **Term** | Meaning |
|---|---|
| **Admission** | A deterministic decision that a proposed graph or transition may execute. |
| **Artifact** | A durable output such as a report, evidence bundle, checkpoint, or receipt. |
| **Checkpoint** | A resumable snapshot of graph state and execution position. |
| **Control graph** | Stable, governed topology of roles, kinds, policies, and reusable contracts. |
| **Declared write** | A field or artifact a node is explicitly permitted to mutate or produce. |
| **Edge** | A typed dependency or route between node boundaries. |
| **Entity** | A distinguishable object represented in a knowledge graph. |
| **Evidence ledger** | The authoritative record of governed events, effects, receipts, and references. |
| **Fan-in** | Joining results from multiple upstream branches. |
| **Fan-out** | Splitting work into multiple downstream branches. |
| **Fake edge** | An edge that does not represent consumed data or a real dependency. |
| **Fusion** | Deduplication, alignment, conflict handling, and provenance-preserving combination. |
| **Graph state** | Typed mutable data available to graph nodes under reducer and write rules. |
| **Human gate** | An explicit approval point where a person decides before an expensive-to-reverse action. |
| **Knowledge graph** | A provenance-bearing graph of entities, facts, events, and typed relations. |
| **Node** | A bounded unit of work with input, output, write, budget, and failure contracts. |
| **Node kind** | A registry-bound capability class that governs node behavior and policy. |
| **Ontology** | The schema and vocabulary defining concepts and valid relations. |
| **Per-run work graph** | The dynamic graph materialized for one goal, evidence set, and budget. |
| **Provenance** | Information about the source, transformation, time, and support of an assertion. |
| **Receipt** | Evidence that an authorized transition or effect was accepted and recorded. |
| **Reducer** | A deterministic rule for combining state updates, especially at fan-in. |
| **Registry** | The operator-owned catalog of admissible node kinds, factories, costs, and contracts. |
| **Replay** | Reconstructing execution or a decision from recorded state, events, and topology. |
| **Route** | A selected edge or destination under a condition and policy. |
| **Schema version** | The version identifier for a state, event, or graph contract. |
| **Serving** | Making a fused knowledge graph available to an agent or query path. |
| **Stop rule** | A bounded condition that ends or blocks further graph work. |
| **Subgraph** | A bounded reusable graph with an explicit boundary contract. |
| **Task graph** | A graph of jobs and execution dependencies. |
| **Temporal validity** | The interval during which a fact or relation applies in the world. |
| **Trace** | A record of execution events, deltas, timing, outcomes, and routes. |
| **Transaction time** | When the system recorded or accepted a fact or event. |
| **Typed edge** | A relation whose name and allowed endpoints carry defined meaning. |
| **Typed state** | State whose fields, values, versions, and writes are validated by contract. |
| **Valid time** | When a fact was true or a decision applied. |
| **Verification branch** | An independent task-graph path that checks an output or claim. |
| **Work frontier** | The currently executable or awaiting nodes in a per-run graph. |

## 17. OPERATIONAL TAKEAWAYS

Graph engineering is topology plus contracts, not prompt fashion.

Treat knowledge graphs and task graphs as coupled interfaces with different responsibilities.

Keep stable governance separate from dynamic per-run work.

Make state typed and writes declared.

Bind admission to registry kinds and fail closed on unknown routes.

Keep checkpoints, traces, receipts, ledgers, and knowledge graphs in distinct planes.

Preserve provenance and distinguish valid time from observation or transaction time.

Use graphs for real branching, verification, routing, and temporal relationship problems.

Keep a loop when the work is simple, sequential, approval-heavy, or cheaper to express directly.

For system-deep-loop, graph engineering should be additive and authority-preserving: graph topology can enrich execution and convergence, while the evidence ledger and transition gateway remain authoritative until measured parity and cutover gates pass.

**Key points**

- Graph engineering adds enforceable semantics to topology and state.
- System-deep-loop should adopt graph topology additively while preserving ledger and gateway authority.

## 18. SOURCES

- `specs/system-deep-loop/037-graph-engineering/research/research.md` — synthesis of iterations 001–020; especially sections 8–10 and recommendations.
- `specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-003.md` — core graph concepts, typed state, admission, fan-out, control/work separation, and use criteria.
- `specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-008.md` — GraphARC admission, registry-bound routing, budgets, materialization, traces, and replay.
- `specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-010.md` — two coupled graph problems, workflow patterns, provenance, temporal semantics, and loops-versus-graphs criteria.
- `specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-011.md` — typed state versus authority ledger, gateway boundaries, receipts, branch isolation, and stable control/work graphs.
- `specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-013.md` — graph-assisted convergence, structural guards, replay fingerprints, and graph-unavailable fallback.
- `specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/README.md` — executable admission and declared-write examples.
- `specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/README.md` — graph-engineering definition, knowledge/task split, pipeline, and task-graph rules.
- `specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/WORKFLOWS.md` — ontology, extraction, fusion, evaluation, serving, and task workflow patterns.
- `specs/system-deep-loop/037-graph-engineering/context/What is Graph Engineering?.md` — typed edges, traversal, temporal memory, and question-type routing; article-reported claims are not treated as system evidence.
- `specs/system-deep-loop/037-graph-engineering/context/From Loops to Graphs: The Next Paradigm in AI Agent Engineering.md` — loop/graph comparison, topology, parallel review, and selection criteria; article-reported benchmarks are not treated as acceptance thresholds.
