# Graphene · 05 · The server

## 1. Why it exists

Polling solves coordination but not **liveness**. An agent that has gone idle, or
is mid-turn, is unreachable — human input arrives and nothing wakes the session
that needed it.

The server answers exactly that, plus three things a file cannot:

| | |
|---|---|
| **Push** | a blocked session learns without asking |
| **Presence** | when a socket drops, that session's claims release **immediately** rather than waiting out a TTL |
| **Targeted routing** | only affected sessions are woken, not all of them |
| **One stream for the UI** | already needed ([08](08-ui.md)) |

## 2. What it is not

**The server never mediates writes.** Sessions write to SQLite directly. The
server observes the log and notifies.

That keeps the log the single source of truth (I1) and makes the failure mode
benign: if the server dies, work continues, no data is lost, and push degrades to
file-watch polling until it returns.

It is also why there is no daemon to install or supervise — the server is a
convenience process over a store that is already correct without it.

## 3. `gr wait` — how push reaches an agent

An agent has no socket. Its **tools** do.

```
gr wait --session s1 [--timeout 300] [--on node_ready,human_resolved]
```

Blocks. Internally holds a WebSocket. Returns the first matching event as JSON
and exits:

```json
{ "event": "human_resolved", "node": "gn_9k2…",
  "unblocked": ["gn_a…", "gn_b…"], "seq": 4471 }
```

On timeout:

```json
{ "event": "timeout", "graph_state": "running", "awaiting": ["gn_9k2…"] }
```

The agent never sees a socket — it sees a tool call that blocks and returns.
**That works in any harness with no special support**, and it is what makes the
server useful rather than merely present.

The session's whole life becomes: `gr status` → claim → work → report →
`gr wait` → repeat.

## 4. The protocol

WebSocket at `ws://127.0.0.1:<port>/ws`, JSON frames, one protocol version
negotiated at connect.

### 4.1 Client → server

```json
{ "t": "hello",     "session": "s1", "graph": "gg_…", "label": "impl",
  "protocol": 1, "interests": ["node_ready", "premise_invalidated"] }
{ "t": "heartbeat", "session": "s1" }
{ "t": "bye",       "session": "s1" }
```

`interests` is a filter, not a subscription list — the server always sends
`claim_revoked` and `graph_changed` regardless, because a session must not be
able to opt out of learning that its work was invalidated.

### 4.2 Server → client

```json
{ "t": "welcome", "protocol": 1, "graph": "gg_…", "seq": 4470,
  "sessions": [{ "id": "s2", "label": "review", "holding": ["gn_c…"] }] }

{ "t": "event", "seq": 4471, "event": "node_ready",           "nodes": ["gn_a…"] }
{ "t": "event", "seq": 4472, "event": "human_resolved",       "node": "gn_9k2…",
                             "unblocked": ["gn_a…"] }
{ "t": "event", "seq": 4473, "event": "premise_invalidated",
                             "claim": "gc_…", "node": "gn_7f3…",
                             "stale": [{ "id": "gb_b2", "state": "BOTH",
                                         "contradicted_by": "gb_x9" }] }
{ "t": "event", "seq": 4474, "event": "claim_revoked",  "claim": "gc_…",
                             "reason": "lease_expired" }
{ "t": "event", "seq": 4475, "event": "node_failed",    "node": "gn_d…",
                             "skipped": ["gn_e…"] }
{ "t": "event", "seq": 4476, "event": "graph_changed",  "state": "cancelled" }
```

**Every frame carries `seq`.** A client that reconnects sends its last seen seq
and receives everything since — so a dropped connection never loses an event, and
the client can always reconcile against the store.

### 4.3 Routing

| Event | Routed to |
|---|---|
| `node_ready` | sessions attached to the graph, with capacity, matching interests |
| `human_resolved` | the session holding a blocked claim downstream, plus all attached |
| `premise_invalidated` | **only** holders of active claims in `assumed_by` for that belief |
| `claim_revoked` | the holder only |
| `node_failed` | holders of claims on descendants, plus all attached |
| `graph_changed` | all attached |

`premise_invalidated` routing is an indexed lookup over `assumed_by` joined with
active claims ([03](03-store.md) §4), which is what makes it precise instead of a
broadcast everyone learns to ignore.

## 5. Presence

A session is `attached` while its socket is open, `idle` after a missed
heartbeat, `gone` when the socket closes or the heartbeat window lapses.

**On `gone`, its claims release immediately** and the freed nodes emit
`node_ready` to whoever remains. That is the operational payoff of presence: a
crashed session's work returns to the pool in seconds.

Heartbeat every 15s, `gone` after 45s. A session may also `bye` cleanly, which
releases claims without waiting.

## 6. Lifecycle

**Start.** The first `gr attach` spawns the server detached if none is running,
then connects. Idempotent — a second session finds the running one. No user ever
starts it manually; `gr serve` exists only to run it in the foreground for
debugging.

**Discovery.** `.graphene/server.json` beside the store:

```json
{ "pid": 48213, "port": 7717, "protocol": 1,
  "store": "/abs/path/.graphene/store.db", "started_at": 1754… }
```

Port is OS-assigned and written on bind — no configuration, no conflicts. A stale
file whose pid is dead is replaced by the next `attach`.

**Version mismatch.** A CLI whose protocol version differs refuses to connect and
reports the mismatch rather than speaking a stale protocol. Upgrading the binary
and re-attaching resolves it.

**Exit.** After a grace period (default 300s) with zero attached sessions and no
UI client. No orphans, no supervision.

## 7. Degradation

If no server is reachable, **nothing blocks and nothing is lost**:

| Capability | Without a server |
|---|---|
| All writes | unaffected — straight to SQLite |
| All reads | unaffected |
| `gr wait` | falls back to watching the SQLite WAL, then reading new events by `seq` |
| Presence-based claim release | falls back to TTL expiry |
| Targeted routing | untargeted — the fallback wakes on any change and filters client-side |
| UI | unavailable |

Slower and less precise, but correct. **The server is an accelerator, not a
dependency** — which is the property that lets it be started casually and killed
without ceremony.

## 8. HTTP surface

Same process, for the UI only. **All read-only** — there is no write endpoint,
anywhere ([08](08-ui.md) §1).

```
GET  /                     the embedded UI
GET  /api/graphs
GET  /api/graph/:id        graph + nodes + edges + sessions
GET  /api/node/:id         full node detail, incl. human context
GET  /api/belief/:id
GET  /api/why/:id
GET  /events?graph=…       SSE stream, same events as §4.2
```

Bound to `127.0.0.1` only. Never `0.0.0.0`, not behind a flag — a read-only view
of a company's work graph is not something to make reachable by accident.

## 9. Security posture

- **Loopback only.** No remote binding, no TLS, no auth — because there is no
  write surface and no remote exposure.
- **No write endpoint.** The only path back into the graph is an agent running
  the CLI ([08](08-ui.md) §4).
- **The store is the boundary.** Anyone who can reach the socket can already read
  the SQLite file; the server exposes nothing further.
- **Local privilege only.** File permissions on `.graphene/` are the access
  control, exactly as for a `.git` directory.

## 10. Open questions

- **OPEN** — Whether one server process serves multiple stores or one per store.
  One per store is simpler and matches `.git`-style discovery; one process is
  friendlier when an agent works across several projects. Leaning one per store.
- **OPEN** — Whether `gr wait` should support a long-poll HTTP fallback in
  addition to WAL watching, for environments where spawning a background process
  is blocked.
- **OPEN** — Backpressure on a very chatty graph: whether the server coalesces
  rapid `node_ready` bursts into one frame. Probably yes, with the seq range
  preserved so nothing is lost.
