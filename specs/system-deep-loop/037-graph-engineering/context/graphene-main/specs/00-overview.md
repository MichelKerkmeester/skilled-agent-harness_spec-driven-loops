# Graphene · 00 · Overview

## 1. What Graphene is

**A work-graph engine for agents.** A single Rust binary that holds the graph an
agent works through — the nodes, their state, what is claimable, what is blocked,
what each node concluded, and who is doing what — and pushes changes to every
session attached to it.

It ships as four things in one binary:

| | |
|---|---|
| **CLI** | the agent's interface: subcommand verbs, JSON payloads, over stdio |
| **Server** | presence and notification, over WebSocket, so sessions learn without asking |
| **UI** | a read-only localhost view of the live graph |
| **Skill** | the file set that teaches an agent to drive all of it |

## 2. Two constraints that define everything

### 2.1 Graphene never calls a model

Planning, reviewing, deciding, extracting, adjudicating — all of it belongs to
the agent. Graphene receives structure and enforces it.

This is what buys determinism, testability with zero LLM calls, auditability,
speed, and usability by anyone with any agent and no API key.

### 2.2 Graphene never executes a node

> **It is a coordinator, not an executor.**

It tracks what is ready, what is claimed, and what happened. **The agent runs the
work.** No execution daemon, no worker pool, no sandbox — and no way for
Graphene to become the thing that has to understand every kind of job.

Together: *the agent decides and does; Graphene remembers, validates, and tells
everyone.*

## 3. Two planes

| Plane | Holds | If it dies |
|---|---|---|
| **SQLite store** | the log, and the fold of it: graphs, nodes, edges, beliefs, claims | nothing works — it is the truth |
| **WebSocket server** | presence, notification, fan-out, the UI stream | **work continues**; push degrades to file-watch polling; no data is lost |

The server **observes and notifies; it never mediates writes.** Sessions write to
SQLite directly. That keeps the log the single source of truth (I1) and makes a
server crash cost push, not data.

The server exists because polling solves coordination but not **liveness**: an
agent that has gone idle, or is mid-turn, is unreachable. Human input arrives and
nothing wakes the session that needed it. That is the requirement the server
answers, and `gr wait` is how it reaches an agent ([05](05-server.md) §3).

## 4. Two kinds of node, one log

| Kind | Is | Produces |
|---|---|---|
| **work node** | a unit of capability — agent loop, deterministic function, retrieval, or **human** | state, and belief nodes |
| **belief node** | a claim with provenance, support, and truth state | — |

They share the log, the typed edges, the fold, cascade, and replay. This is not
an aesthetic unification — it is what makes the two things the product is sold on
possible:

- **A human node can show `why()` on its inputs.** *"Approve this email"* is
  useless; *"approve this email, which rests on three facts, one of which went
  stale two hours ago"* is the product.
- **Cross-session divergence is detectable.** Sessions coordinate work through the
  graph and coordinate *understanding* through beliefs. Without the second, six
  sessions can each be locally correct and globally inconsistent
  ([04](04-execution.md) §5).

### 4.1 Graphene depends on nothing

**Graphene is a complete product on its own.** It has no dependency on the
knowledge base, on Genera, on the platform, on Postgres, or on any service. One
binary, one SQLite file, no account, no API key, no network.

What Graphene deliberately does **not** implement — ontology projection, entity
fusion, retrieval at scale — are **features it does not have**, not features it
outsources. Nothing in Graphene calls out to get them.

They are absent because they sit **above** the belief layer, not below it:

```
   entities · links · fusion · resolution      ← knowledge base ONLY
                    ▲ projected FROM
   beliefs · support edges · truth state       ← GRAPHENE
```

An ontology entity *is* a fold over the beliefs supporting it. Beliefs without
entities are complete and useful; entities without beliefs are impossible. So
Graphene holds the base and the knowledge base builds a superstructure over it,
at tenant scale, for its own reasons.

Two consequences worth stating outright, because the layering is easy to invert
when reading quickly:

- **If the knowledge base is never built, Graphene loses nothing.** Every
  capability in these specs — planning, checking, execution, multi-session
  coordination, divergence detection, human nodes, the UI — works with beliefs
  alone.
- **Entity fusion is not merely omitted, it is meaningless here.** Fusion asks
  *"are these two entities the same thing?"* and Graphene has no entities. It has
  beliefs keyed by content hash, and identical beliefs collapse by hash in
  `graphene-core`.

## 5. Who it is for, in order

1. **Anyone with an agent.** Install the binary, drop in the skill, and your agent
   plans work as a graph, runs it, coordinates across sessions, and asks humans
   for input without blocking.
2. **Genera**, as the engine under its local context store and its orchestrator.
3. **The knowledge base**, as the semantics under its durable store.

Consumer 1 is first as a design constraint, not marketing. **If Graphene only
makes sense inside our product, the separation has failed and it should have been
a library.**

## 6. Scope

### Owns

| Area | Spec |
|---|---|
| Graphs, work nodes, edges, typed state, lifecycle, IDs | [01](01-graph-model.md) |
| Beliefs: three axes, four truth states, cascade, `why` | [02](02-belief-layer.md) |
| The SQLite store, the log, fold, replay, determinism | [03](03-store.md) |
| Claims, leases, read-set assertion, checkpointing, human nodes | [04](04-execution.md) |
| The server: WebSocket protocol, events, presence, lifecycle | [05](05-server.md) |
| `gr check` — every deterministic validation, and why each is deterministic | [06](06-check.md) |
| The full CLI surface and its JSON contracts | [07](07-cli.md) |
| The read-only UI | [08](08-ui.md) |
| The skill: workflow, decomposition, templates, examples | [09](09-skill.md) |
| BMB, property tests, golden logs, adversarial suite | [10](10-verification.md) |

### Must not own

| Not here | Lives in |
|---|---|
| Any model call | the calling agent |
| Node execution | the calling agent |
| Ontology projection, entity fusion, retrieval at scale | knowledge base |
| Access-control **decisions** (labels are carried and joined as data, I7) | platform |
| Context windows, assembly, token budgets | Genera |
| Tenancy, users, identity | platform |

Two boundaries most likely to erode under pressure, to watch for in review:

- **A model call sneaking in** for "just this one ambiguous case." There is no
  ambiguous case Graphene resolves; ambiguity is emitted for the caller.
- **Execution sneaking in** for "just this one trivial node type." The first
  built-in executor is the end of the coordinator boundary.

## 7. Why Rust

- The fold, cascade, and check run on every agent turn.
- A single static binary with no runtime is what makes *"anyone can use it"*
  literally true.
- An embedded server and embedded UI assets ship as one file, no npm, no deploy.
- It forces the model-free boundary: there is no ambient LLM SDK to reach for.

## 8. Naming

**Graphene** — a single-atom lattice, the strongest known material, and
*lightweight* is literally its defining property. Binary: **`gr`**.

⚠️ Namespace collisions to go in with eyes open: `graphene` on npm (taken, dead
package), **graphene-python** (the GraphQL library — the notable one), GNOME's
`graphene` C math library. Verify crates.io before publishing.

## 9. Reading order

[`../../specs/`](../../specs/) first — the contracts and invariants are shared.
Then [01](01-graph-model.md) → [02](02-belief-layer.md) → [03](03-store.md) →
[04](04-execution.md) → [05](05-server.md) → [06](06-check.md) →
[07](07-cli.md) → [08](08-ui.md) → [09](09-skill.md) → [10](10-verification.md).

Implementation: [`../IMPLEMENTATION.md`](../IMPLEMENTATION.md).
