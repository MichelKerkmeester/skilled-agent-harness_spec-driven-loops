# Graphene · 03 · The store

## 1. Why SQLite

Multiple sessions append to one graph concurrently. That is the requirement, and
it is exactly what SQLite in WAL mode is for: concurrent readers with a
serialized writer, atomic transactions, durability, and crash recovery — from a
library, with no daemon to manage, no port, no lifecycle, and no second failure
mode.

**SQLite is the coordination substrate.** The server ([05](05-server.md)) adds
push and presence on top; it never mediates writes.

One file. Copyable, inspectable, shippable. `gr export` emits JSONL for git and
diffing, so nothing is lost by not being a text format on disk.

## 2. Layout

```
.graphene/
  store.db          SQLite (WAL) — the log and its fold
  store.db-wal
  store.db-shm
  server.json       pid, port, protocol version, store path (05 §6)
```

Discovered by walking up from `$CWD` like `.git`, overridable with
`--store <path>` or `GRAPHENE_STORE`.

## 3. The log is the truth

```sql
CREATE TABLE events (
  seq        INTEGER PRIMARY KEY AUTOINCREMENT,  -- the logical clock
  graph_id   TEXT    NOT NULL,
  kind       TEXT    NOT NULL,
  payload    TEXT    NOT NULL,                   -- JSON
  actor      TEXT    NOT NULL,                   -- session, human, or system
  session_id TEXT,
  at         INTEGER NOT NULL                    -- wall clock, informational only
);
CREATE INDEX events_graph ON events(graph_id, seq);
```

**No row in `events` is ever updated or deleted** (I1, I2). Every other table is
a fold — a cache — and `gr rebuild` regenerates all of them from the log.

`at` is informational. **The fold never reads it**, because a fold that consults
wall-clock time is not replayable (§6).

### 3.1 Event kinds

| Group | Kinds |
|---|---|
| Graph | `GRAPH_CREATE` `GRAPH_STATE` `GRAPH_CLONE` `GRAPH_AMEND` |
| Node | `NODE_ADD` `NODE_UPDATE` `NODE_EXPAND` `NODE_STATE` |
| Execution | `CLAIM` `CLAIM_RELEASE` `CLAIM_REVOKE` `CHECKPOINT` `NODE_DONE` `NODE_FAIL` |
| Human | `HUMAN_ASK` `HUMAN_RESOLVE` |
| Belief | `BELIEF_ADD` `RETRACT` `REINSTATE` `SUPERSEDE` `CONTRADICT` `UNCONTRADICT` `CORROBORATE` `STALE` `NOGOOD` |
| Session | `SESSION_ATTACH` `SESSION_DETACH` `SESSION_HEARTBEAT` |
| Record | `CHECK_RESULT` `REVIEW_FINDING` `MODEL_CALL` |

`MODEL_CALL` is written by the **caller**, never by Graphene, and is opaque to
the fold. It exists so a caller's non-deterministic decisions replay (I5).
Graphene's only job is to preserve it in order.

## 4. The fold

```sql
CREATE TABLE graphs (
  id TEXT PRIMARY KEY, title TEXT, description TEXT, task TEXT,
  state TEXT NOT NULL, parent TEXT,
  budget TEXT, limits TEXT, tags TEXT,
  created_at INTEGER, updated_at INTEGER, completed_at INTEGER,
  requested_by TEXT,
  fold_seq INTEGER NOT NULL                     -- fold is current through this seq
);

CREATE TABLE nodes (
  id TEXT PRIMARY KEY, graph_id TEXT NOT NULL, name TEXT NOT NULL,
  kind TEXT NOT NULL, capability TEXT,
  spec TEXT, inputs_schema TEXT, outputs_schema TEXT,
  bindings TEXT, for_each TEXT, budget TEXT, retry TEXT, idempotency TEXT,
  state TEXT NOT NULL, output TEXT, attempts INTEGER NOT NULL DEFAULT 0,
  parent_node TEXT,                             -- set on forEach expansion
  UNIQUE(graph_id, name)
);

CREATE TABLE node_edges (
  graph_id TEXT, from_node TEXT, to_node TEXT,
  edge_kind TEXT NOT NULL,                      -- deterministic | model-decided
  PRIMARY KEY(graph_id, from_node, to_node)
);

CREATE TABLE beliefs (
  id TEXT PRIMARY KEY, graph_id TEXT NOT NULL,
  provenance TEXT NOT NULL, fidelity TEXT NOT NULL, state TEXT NOT NULL,
  content TEXT NOT NULL, summary TEXT NOT NULL,
  source_ref TEXT, shared INTEGER NOT NULL DEFAULT 0,
  observed_at INTEGER, observed_at_imputed INTEGER NOT NULL DEFAULT 0,
  recorded_at INTEGER NOT NULL, valid_until INTEGER,
  stale INTEGER NOT NULL DEFAULT 0,
  contradiction TEXT, retraction TEXT,
  produced_by TEXT, scoped_to TEXT,
  content_hash TEXT NOT NULL
);

CREATE TABLE belief_edges (
  from_belief TEXT, to_belief TEXT, kind TEXT NOT NULL,
  PRIMARY KEY(from_belief, to_belief, kind)
);

CREATE TABLE claims (
  id TEXT PRIMARY KEY, node_id TEXT NOT NULL, session_id TEXT NOT NULL,
  read_set TEXT NOT NULL,                       -- belief ids, JSON array
  leased_at INTEGER, expires_at INTEGER,
  released INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX claims_active ON claims(node_id) WHERE released = 0;

CREATE TABLE assumed_by (                       -- 02 §5
  belief_id TEXT, claim_id TEXT,
  PRIMARY KEY(belief_id, claim_id)
);

CREATE TABLE sessions (
  id TEXT PRIMARY KEY, graph_id TEXT NOT NULL,
  label TEXT, attached_at INTEGER, last_seen INTEGER,
  state TEXT NOT NULL                           -- attached | idle | gone
);

CREATE TABLE checkpoints (
  node_id TEXT, seq INTEGER, state TEXT NOT NULL,
  PRIMARY KEY(node_id, seq)
);

CREATE TABLE findings (
  id TEXT PRIMARY KEY, graph_id TEXT, review_node TEXT,
  target_node TEXT, severity TEXT, body TEXT,
  resolution TEXT, resolved_by TEXT             -- applied | rejected + reason
);
```

**Every append is one transaction**: insert the event, apply it to the fold,
commit. The fold can never lag or diverge from the log within a transaction
boundary, and a crash mid-append rolls back both.

`assumed_by` and `claims_active` are what make premise invalidation an indexed
lookup rather than a scan.

## 5. Snapshots and rebuild

The fold tables *are* the working state; there is no separate snapshot format.

- **`gr rebuild`** truncates the fold and replays the log. Always safe. Used
  after an upgrade that changes fold semantics, and by tests to assert
  fold-equivalence.
- **`gr fold --up-to <seq>`** materializes state at a point into a scratch
  database, without touching the live one. This is what answers *"what did we
  believe when node X ran?"*

**Property, tested continuously:** `rebuild(log) == incremental_fold(log)` for
every log in the golden corpus ([10](10-verification.md) §4).

## 6. Determinism (I5)

**Replay the log, get the same fold.** Three requirements:

1. **No wall-clock reads in the fold.** Time enters only as event payload
   (`observed_at`, `recorded_at`). Lease expiry is evaluated against a clock at
   *query* time and is therefore not part of the fold — an expired lease is a
   derived view, not stored state.
2. **No randomness.** Map iteration is ordered; ties break by `seq`, then id.
3. **Model outputs are data.** `MODEL_CALL` replays verbatim, never re-invoked.

What this buys beyond audit: **you can replay the construction of any node's
result** — not merely see the output, but the exact decision sequence that
produced it, including which model said what.

## 7. Concurrency

WAL mode, `busy_timeout` set, one writer at a time, readers never blocked.

Two invariants enforced in SQL, not in application logic — because application
logic loses races:

- **One active claim per node**, by the partial unique index on
  `claims(node_id) WHERE released = 0`. Two sessions racing to claim the same
  node: one wins, one gets a constraint violation and a structured refusal.
- **Node names unique per graph**, by `UNIQUE(graph_id, name)`, which is also
  what makes content-anchored node IDs collision-free.

Every write is a single transaction. There is no read-modify-write across
statements anywhere in the codebase.

## 8. The graph library

Because graphs are rows with metadata, the library is nearly free:

```
gr list                       # pending, by default
gr list --all --state done
gr show gg_…
gr clone gg_… [--params …]
```

Two things worth more than the browsing:

**Completed graphs are templates.** A finished graph is a proven shape. *"Do the
churn analysis again for Q4"* is `gr clone` plus re-parameterization — the same
object as a user-authored workflow, so the two features are one feature.

**A corpus of graphs is evidence about decomposition.** After fifty runs you can
see which nodes fail most, which human gates are approved 100% of the time (the
gate is misplaced), which plans needed the most amendments, which shapes were
abandoned. That is the feedback loop into the skill, which is otherwise guesswork
([09](09-skill.md) §7).

A `done` graph is immutable. `gr clone` makes a new one with `parent` set.

## 9. Retention

Nothing in `events` is deleted (I1, I2).

`gr compact` is permitted only where the fold is provably unchanged: collapsing
consecutive `SESSION_HEARTBEAT` runs, and superseded `CHECK_RESULT` records. It
must never touch a `RETRACT` reason, a `MODEL_CALL`, a `HUMAN_RESOLVE`, or any
node output.

Compaction verifies itself: `fold(before) == fold(after)`, or it aborts.

## 10. Open questions

- **OPEN** — Whether node outputs live inline in `nodes.output` or in a
  content-addressed blob table. Inline is simpler; large outputs (a full file, a
  200-row result) will want the blob table with the row holding a hash.
- **OPEN** — Whether `gr fold --up-to` materializes into a scratch DB (simple,
  correct, slow for large logs) or supports an in-memory fold with a bounded
  window.
- **OPEN** — Cross-store references. A Genera session's local store and a
  knowledge base are separate stores; a belief promoted across them needs a
  stable external reference. Currently the promotion carries a copy plus the
  original id as a `source_ref`.
