# Graphene · 01 · The graph model

## 1. Definition

**Nodes are units of capability. An edge from A to B means B's input is bound to
A's output.**

The word doing the work is *bound*. An edge is not "A happens before B" — it is a
declared data dependency, expressed as a binding, and checkable
([06](06-check.md) §3).

## A human node's answer must be load-bearing

A gate that releases every dependent whatever the answer is not a gate. Before
this was enforced, `gr check` could prove a human node sat on every path to
`send_email`, the person could answer "cancel", and the send node was claimable
anyway — the decision was recorded and ignored.

So `HumanAsk.consequence` maps each option to the dependents it releases, and the
fold **skips** every dependent an answer does not name. An option mapped to the
empty list is how "no" is expressed.

Two rules make it fail closed rather than fail silent:

- `gr check` refuses (`ungated-choice`) any human node that has dependents and
  does not say what each of its options releases. There is no permissive default,
  because the permissive default *was* the bug.
- The `consequence` shown on `gr node` is the same declaration the fold enforces,
  so what a person is told an answer will do is what it does.

A human node with no dependents gates nothing and declares nothing.

## 2. Graph

One object with a lifecycle state. A "plan" is a graph in `draft`; a "run" is the
same graph in `running`. Three nouns for one object is where confusion starts.

```rust
struct Graph {
    id:           GraphId,          // gg_…
    title:        String,           // agent-authored, user-editable by prompt
    description:  String,
    task:         String,           // the originating request, verbatim
    state:        GraphState,
    parent:       Option<GraphId>,  // clone or amendment lineage
    budget:       Budget,
    limits:       Limits,
    tags:         Vec<String>,
    created_at:   Timestamp,
    updated_at:   Timestamp,
    completed_at: Option<Timestamp>,
    requested_by: Option<ActorId>,
}
```

### 2.1 Lifecycle

```
draft ──▶ checked ──▶ reviewed ──▶ approved ──▶ running ──▶ done
  │          │           │            │            │        (│)
  └──────────┴───────────┴────────────┴────────────┴──▶ cancelled
                                                   └──▶ failed
```

Every transition has a **deterministic precondition**. Graphene enforces the
transition; it does not know what any of the work means.

| To | Precondition |
|---|---|
| `checked` | `gr check` passes with zero errors |
| `reviewed` | every node with `kind: review` is `done`, and every finding it produced is resolved (applied or rejected with a reason) |
| `approved` | an explicit `gr approve` by an actor |
| `running` | `gr start`; at least one node is `ready` |
| `done` | no node is `pending`, `ready`, `claimed`, `running`, or `awaiting` |
| `failed` | a node failed non-retryably and no path to a terminal remains |
| `cancelled` | explicit, at any time |

**`reviewed` is a state Graphene can verify without knowing what review is.** It
checks that review-kind nodes completed and their findings were resolved. What a
review *asks* lives in the skill ([09](09-skill.md) §5).

**A `done` graph is immutable.** `gr clone` makes a new one.

### 2.2 Amendment

A human amendment or a post-start plan change produces a **new graph derived from
the old** with `parent` set, not a mutation. The original keeps its history; the
amendment carries forward completed node outputs so work is not redone.

Immutability of a started plan holds; the graph forks forward.

## 3. Work nodes

```rust
struct Node {
    id:          NodeId,            // gn_…
    graph:       GraphId,
    name:        String,            // unique within graph, agent-assigned, meaningful
    kind:        NodeKind,
    capability:  CapabilityRef,     // what this node is permitted to do
    spec:        NodeSpec,          // prompt / function ref / ask — kind-dependent
    inputs:      Schema,            // JSON Schema
    outputs:     Schema,            // JSON Schema
    bindings:    Vec<Binding>,      // how inputs are filled from upstream outputs
    needs:       Vec<NodeId>,       // must equal the set referenced by bindings (06 §3)
    for_each:    Option<ForEach>,   // runtime expansion
    budget:      Budget,
    retry:       RetryPolicy,
    idempotency: Option<String>,
    state:       NodeState,
    // runtime
    claim:       Option<Claim>,
    output:      Option<Value>,
    checkpoints: Vec<Checkpoint>,
    attempts:    u32,
}
```

### 3.1 Kinds

| Kind | Runs as | Notes |
|---|---|---|
| `agent` | an agent loop in its own context | the common case |
| `function` | a deterministic call the agent performs | tests, builds, a script |
| `retrieval` | a read against a source | no side effects by declaration |
| `human` | **a person** | asynchronous; never blocks the graph ([04](04-execution.md) §4) |
| `review` | an agent loop reviewing the graph itself | marker for `gr status` and the UI |
| `merge` | consolidates parallel outputs; **one owner** | required at every fan-in |

`human` and `merge` are the two that carry rules rather than just labels.

### 3.2 What makes a node good

> *"A good node is boring. It does one thing, you can test it alone, and you can
> swap it out without touching anything else."*
> — Simmons, *We Are Entering the Graph Engineering Phase*

Multi-function nodes become *"a loop with extra steps"* and lose testability,
caching, retry, and replaceability.

**Graphene cannot check this.** Granularity is judgment, so it belongs to the
review nodes and the skill ([09](09-skill.md) §4) — never to a keyword heuristic.
What Graphene *can* check is that inputs and outputs are declared and bound, and
declared contracts are what make "test it alone" true rather than aspirational.

### 3.3 States

```
pending ──▶ ready ──▶ claimed ──▶ running ──┬─▶ done
   ▲                     │                  ├─▶ failed ──▶ (retry) ready
   │                     └──(lease lost)────┘  └─▶ awaiting ──▶ ready
blocked ◀── an upstream node failed or is awaiting
```

| State | Means |
|---|---|
| `pending` | upstream incomplete |
| `ready` | all `needs` satisfied, claimable |
| `claimed` | a session holds a lease, not yet started |
| `running` | in progress, lease held |
| `awaiting` | a `human` node waiting on a person — **only its dependents block** |
| `blocked` | an upstream node is failed or awaiting |
| `done` | output recorded and schema-valid |
| `failed` | terminal for this node; retryable or not per policy |
| `skipped` | an ancestor failed; not attempted |

## 4. Edges, bindings, and state

State is *"an object with a schema, checkpointed every time you cross an edge.
Not whatever happens to be sitting in the context window right now."*

```rust
struct Binding {
    from:   NodeId,
    select: JsonPath,     // into the source's declared output schema
    into:   String,       // a field in this node's input schema
}

enum EdgeKind {
    Deterministic,        // "tests pass → deploy"
    ModelDecided,         // "billing or abuse?"
}
```

**Every edge carries its kind.** A model-decided edge is a place the graph can go
wrong; they are visible in the UI, counted in telemetry, and are the first thing
to look at when a run went somewhere unexpected.

**`needs` must equal the set of nodes referenced by `bindings`.** An edge with no
binding reading through it is a **fake edge**, and that is a structural fact, not
a heuristic ([06](06-check.md) §3).

### 4.1 `forEach`

```rust
struct ForEach {
    over:   Binding,          // an array in an upstream output
    max:    u32,              // declared bound, checked (06 §5)
    as_:    String,           // the field each element binds into
}
```

Expansion happens at runtime when the source completes. **The shape is fixed in
the plan; only the cardinality is discovered.** The model fills the jobs; it
never invents the routing.

## 5. Budget in the state

> *"Put budget in the state. Tokens, dollars, and wall-clock time live in the
> state object and get enforced at edges."*

```rust
struct Budget { tokens: Option<u64>, micros_usd: Option<u64>, wall_ms: Option<u64> }
```

Declared per node and per graph; **actuals recorded at `gr done`**; enforced at
edges — `gr claim` refuses when the graph budget is exhausted, and the refusal
names which dimension.

Budget overflow at plan time (sum of node budgets exceeding the graph's) is a
`gr check` error, not a runtime surprise.

## 6. Identity

| Object | Prefix | Derivation |
|---|---|---|
| Graph | `gg_` | random at creation, recorded in the `GRAPH_CREATE` event |
| Work node | `gn_` | **content-anchored**: `hash(graph_id, node.name)` |
| Belief | `gb_` | **content-anchored**: `hash(graph_id, content, provenance, source_ref)` |
| Claim | `gc_` | `hash(node_id, session_id, seq)` |

Base32, unpadded, lowercase. Example: `gn_7f3k2q9wx4m1v8p0rj6htzbn5c`.

Three properties this buys, and each is load-bearing:

- **Self-identifying.** A user copies a bare ID from the UI into a fresh session
  with no context. The prefix makes it unmistakable, so the skill's trigger is
  reliable: *"when the user provides a bare `gn_…`, run `gr node <id>` first"*
  ([08](08-ui.md) §4).
- **Stable across edits.** Anchoring node IDs on `name` rather than full spec
  means editing a node's prompt does not break every reference to it.
- **Deterministic.** Replaying a log reproduces every ID, which is what makes
  replay diffable and retry idempotent.

Graph IDs are random because a graph is a root; the value is recorded in the
creation event, so replay is unaffected.

## 7. Limits

Declared per graph, defaulted by config, checked at `gr check`:

```rust
struct Limits {
    max_nodes:       u32,   // default 500
    max_concurrency: u32,   // default 16
    max_rounds:      u32,   // per loop; default 3
    max_depth:       u32,   // default 20
    max_for_each:    u32,   // per expansion; default 200
}
```

These are the task-graph guardrails made mechanical. A plan exceeding any of them
fails `gr check` at authoring time — never mid-run at node 500.

## 8. Open questions

- **OPEN** — Whether `merge` should be a distinct kind or a property of any node
  with more than one inbound edge. A distinct kind makes the fan-in owner
  explicit and checkable; a property is less ceremony. Leaning distinct, because
  "one owner of the merge" is the finding worth enforcing structurally.
- **OPEN** — Whether nodes may declare `reads` and `writes` on named artifacts
  beyond the one-writer check ([06](06-check.md) §7), enabling finer conflict
  detection across sessions. It is more precise and more to declare.
