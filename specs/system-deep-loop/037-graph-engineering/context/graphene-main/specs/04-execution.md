# Graphene · 04 · The execution protocol

**Graphene coordinates; the agent executes.** This document defines the protocol
between them.

## 1. The session loop

```
gr attach <graph> --session <sid>
loop {
    gr status                     → state + recommended next action
    gr next                       → claimable nodes
    gr claim <node> --assumes …   → spec + inputs, or a refusal
    ... the agent does the work, calling gr checkpoint as it crosses edges ...
    gr done <node> --output …     → validated against the declared schema
}
gr wait                           → blocks; returns on the first relevant event
```

The loop ends when `gr status` reports `done`, or blocks in `gr wait` when
nothing is runnable but the graph is not finished.

## 2. Claims and leases

A claim is a **lease with a read-set assertion**. It is the mechanism that makes
multi-session safe.

```
gr claim gn_7f3… --session s1 --assumes gb_a1,gb_b2 --lease 300
```

```json
{ "ok": true, "node": { "id": "gn_7f3…", "kind": "agent", "spec": {…},
                        "inputs": {…}, "outputs_schema": {…}, "budget": {…} },
  "claim": "gc_…", "expires_at": 1754… }
```

### 2.1 One claim per node, enforced in SQL

By a partial unique index, not by application logic
([03](03-store.md) §7). Two sessions racing: one wins, the other receives

```json
{ "refused": "already_claimed", "by": "s2", "expires_at": 1754… }
```

### 2.2 Lease expiry — two paths

| Path | When | Effect |
|---|---|---|
| **Presence** | the session's WebSocket drops | claims released **immediately** |
| **TTL** | no heartbeat and no socket | claims released at `expires_at` |

Presence is the fast path and the reason the server earns its place: a crashed
session's work returns to the pool in seconds rather than after a timeout.

**Expiry is evaluated at query time, not stored** — otherwise the fold would
depend on wall-clock and stop being replayable ([03](03-store.md) §6).

A session whose lease was revoked mid-work is pushed `claim_revoked` and must
discard its in-flight result: `gr done` on a revoked claim is refused.

### 2.3 Renewal

`gr renew <claim>` extends the lease. A long node renews as it works;
`gr checkpoint` renews implicitly, which means a node making progress never
loses its lease and a node that hangs does.

## 3. The read-set assertion

The `--assumes` list is the beliefs the work will rest on. Graphene records
`assumed-by` edges ([02](02-belief-layer.md) §5) and validates them at claim time:

```json
{ "refused": "stale_premise",
  "stale": [ { "id": "gb_b2", "state": "BOTH", "summary": "migration 0042 applied",
               "contradicted_by": "gb_x9", "at": 1754… } ] }
```

**Optimistic concurrency control, applied to agent work.** You do not need
continuous global consistency — you need consistency at the point of use.

Three properties:

- **Cheap.** An indexed lookup over `assumed_by`, at claim time only.
- **Precise.** It names which premise died and what killed it, so the agent can
  re-read and re-decide rather than starting over.
- **Live.** A belief moving to `OUT` or `BOTH` *during* the work pushes
  `premise_invalidated` to the holder immediately (§5), rather than the session
  discovering it after paying for the node.

An empty `--assumes` is legal and means "this node rests on nothing shared" —
true for a pure function, and a smell for an `agent` node. `gr check` does not
flag it; the review lens does.

## 4. Human nodes

The design that makes gates survive: **a human node blocks its dependents and
nothing else.**

```
gr await gn_9k2… --ask "Approve the outreach to c17?" \
                 --context gb_a1,gb_b2,gb_c3 \
                 --options approve,reject,amend
```

Node → `awaiting`. Dependents → `blocked`. **Everything not downstream keeps
running.** A graph where all runnable work is done and only human nodes remain is
`awaiting-input`, not stalled, and `gr status` says so.

### 4.1 Answerable out of band

The person opening this tomorrow was not in the original session and has no
context. Neither does the agent they are talking to. So `gr node <id>` on a human
node returns everything needed, cold:

```json
{ "id": "gn_9k2…", "kind": "human", "state": "awaiting",
  "ask": "Approve the outreach to c17?",
  "options": ["approve", "reject", "amend"],
  "outputs_schema": {…},
  "context": [
    { "id": "gb_a1", "summary": "c17 churn risk 0.81", "state": "IN",
      "fidelity": "claimed", "source": "warehouse", "observed_at": … },
    { "id": "gb_b2", "summary": "no exec touchpoint in 90d", "state": "BOTH",
      "fidelity": "claimed", "contradiction": "CRM shows a call on 2026-07-30",
      "stale": true } ],
  "consequence": { "approve": ["gn_send…"], "reject": ["gn_archive…"] },
  "graph": { "id": "gg_…", "title": "Q3 churn outreach", "task": "…" } }
```

That second context row is the product: **the draft says its premise died before
the approver reads it.** It is only possible because beliefs and work share a
graph.

### 4.2 Resolution

```
gr resolve gn_9k2… --by mel --choice approve --input '{"tone":"warm"}'
```

Validated against `outputs_schema`, recorded as `HUMAN_RESOLVE`, dependents
unblock, and every affected session is pushed `human_resolved`.

`--choice amend` produces a **new graph derived from this one**
([01](01-graph-model.md) §2.2) rather than mutating a running plan.

### 4.3 Unanswered

Declared per node, never defaulted silently:

```json
{ "on_timeout": { "after_ms": 604800000, "then": "escalate" } }
```

`escalate` | `expire` (dependents → `skipped`) | `wait` (forever, explicitly).

**Silence must not be indistinguishable from approval.** There is no `approve`
option here, by design.

## 5. Push, not poll

Events delivered to affected sessions ([05](05-server.md) §4):

| Event | To |
|---|---|
| `node_ready` | attached sessions with capacity |
| `human_resolved` | the blocked session, and everyone downstream |
| `premise_invalidated` | **holders of active claims assuming the stale belief** |
| `claim_revoked` | the holder |
| `node_failed` | sessions with dependents |
| `graph_changed` | all — amended, paused, cancelled |

`premise_invalidated` closes the divergence loop: session A writes a shared
observation → cascade marks B's premise `BOTH` → B is pushed **mid-node**, rather
than discovering it at next claim after paying for the work.

### 5.1 Sessions coordinate through the graph, never directly

There is no agent-to-agent channel, deliberately. Every real case resolves
through graph state — B finishes, A gets `node_ready`; A invalidates a premise, B
gets `premise_invalidated`; a human answers, both get `human_resolved`.

The reason: a direct channel reintroduces exactly the negotiation overhead the
graph removes, and the scaling evidence is blunt — uncoordinated agents amplified
errors **17.2×**; a single coordinator owning the merge cut it to **4.4×**. Two
sessions reading one graph is the coordinated shape.

## 6. Checkpoints

> *"Checkpoint at every edge crossing. Failure stops meaning 'restart the run'
> and starts meaning 'retry the node.'"*

```
gr checkpoint gn_7f3… --state '{"scanned": 40, "cursor": "c17"}'
```

Recorded, lease renewed, visible in the UI. A retry resumes from the last
checkpoint rather than from zero.

`gr done` validates the output against `outputs_schema` and **fails closed** —
an unvalidated output is a refusal, not a warning, because every downstream
binding was checked against that schema at `gr check`.

## 7. Failure and retry

```
gr fail gn_7f3… --reason "…" [--retryable]
```

| Retry policy | Behaviour |
|---|---|
| `none` | node → `failed`, descendants → `skipped` |
| `bounded(n)` | back to `ready` up to n attempts, resuming from checkpoint |
| `escalate` | converts to a `human` node carrying the failure as context |

`escalate` is the most useful and least obvious: a node that cannot be retried
becomes a question for a person, without the graph dying.

**Idempotency.** A node with an `idempotency` key that has already produced an
output returns the recorded output rather than re-running — which is what makes
retry safe when a node has external side effects.

**Blast radius is bounded by structure.** A failure marks only its descendants;
independent branches continue. `gr status` reports both a live count and a lost
count, so a partially-failed graph is never mistaken for a healthy one.

## 8. `forEach` expansion

When the source completes, `NODE_EXPAND` materializes one child per element, each
with `parent_node` set and content-anchored ids derived from
`(parent, index)` — so expansion is deterministic and replayable.

`max` is checked at `gr check` against the declared cardinality bound, so a
fan-out over 50,000 rows is rejected at authoring time, not discovered at node
500 ([06](06-check.md) §5).

## 9. Sessions

```
gr attach gg_… --session s1 --label "impl"
gr detach --session s1
gr sessions
```

A session is a **worker**, not an owner. It claims what it can, releases what it
cannot finish, and its death costs nothing but its leases.

**The graph outlives every session.** Human input does not return to session A —
it unblocks nodes, and any session, new or existing, claims them. That is what
makes *"wait three days for a human sign-off without holding a context window
hostage"* literally true.

## 10. Open questions

- **OPEN** — Default lease TTL. Too short and long nodes churn; too long and a
  crashed session parks work. Checkpoint-renewal makes a shorter default safe;
  300s is a starting point to be measured.
- **OPEN** — Whether a session may claim more than one node concurrently. Yes for
  parallel sub-agents inside one session, and it needs a per-session cap.
- **OPEN** — Whether `premise_invalidated` should hard-revoke the claim or only
  notify. Notify-and-let-the-agent-decide is more flexible; revoke is safer.
  Leaning notify, with revocation on `gr done` if the premise is still dead.


## Deadlines need a caller

`sweep_human_timeouts` existed with **no caller anywhere** — not the server, not
the CLI, not a test. `expire` and `escalate` were accepted, validated, stored and
ignored, so silence *was* indistinguishable from approval. `sweep_leases` was
called only from a unit test, so a session that died holding a claim held it
forever.

Both now run from `sweep_deadlines`, called in two places:

- the server's watcher tick, before it folds what is new — a lease that lapsed or
  a gate past its deadline is a state change with no writer, so nothing would
  otherwise push it;
- the CLI read paths whose answer would otherwise be wrong (`status`, `next`,
  `awaiting`, `claim`). Deadlines pass whether or not a daemon is running, so
  **reading is what makes an expiry real** in a no-daemon workflow.

Escalation is recorded once, as `HUMAN_ESCALATE` carrying how long it had waited.
Re-deriving it on each sweep appended an event per `gr status` — unbounded log
growth from doing nothing — and left the escalation invisible, which is the same
as not escalating.

### An escalated failure is a question, not a state

`retry: escalate` set the node to `awaiting` without creating a pending ask: it
never appeared in `gr awaiting`, any invented string was accepted as an answer,
and it blocked its dependents forever. The failure now creates a real ask —
`retry` or `abandon`, with the failure text — and the answer decides whether the
work runs again rather than marking a node done it never completed.

## What a `forEach` produces

Expanding replaces the template with its children. The parent keeps its original
dependencies, gains its children, and **its output is the array of theirs** —
nothing else can produce the collection a downstream binding names.

Two rules keep that honest:

- a binding from a fan-out must use `$[*]`, because the parent's declared schema
  describes *one* child and a plain `$.field` would type-check against the
  declaration while returning an array at runtime (`for-each-binding-not-indexed`);
- the parent is not claimable once expanded — the children are the work, and
  claiming the template failed on inputs only a child is given.

Before this, `expand` wrote `$.urls[0]` bindings that the value resolver could not
read at all, so no child could ever be claimed and the entire fan-out path was
inert.
