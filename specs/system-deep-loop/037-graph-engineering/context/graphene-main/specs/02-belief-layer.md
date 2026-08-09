# Graphene · 02 · The belief layer

Belief nodes share the log, the edges, the fold, and cascade with work nodes.
They exist so a human node can show *what its input rests on*, and so sessions
can detect that they disagree.

## 1. The three axes

Three orthogonal properties, never collapsed into fewer.

| Axis | Question | Values | Set by | Mutable |
|---|---|---|---|---|
| **Provenance** | Where did this come from? | `user-instruction`, `tool-observation`, `derived`, `hypothesis`, `artifact`, `job`, `journal` | structurally, from origin | **never** |
| **Fidelity** | How well grounded? | `confirmed` > `claimed` > `guessed` | ingest; raised only by corroboration | up only, with evidence (I8) |
| **Truth state** | What do we believe now? | `IN`, `OUT`, `BOTH`, `NEITHER` | **computed by the fold** | yes, always logged |

Enforcement details that matter:

- **Provenance is immutable after `ADD`.** Any event attempting to change it is
  rejected.
- **Fidelity rises only via `CORROBORATE`**, which must name a supporting belief
  from a **distinct `source_ref`**. Same-source corroboration is rejected — it is
  the same claim twice, not two witnesses.
- **A caller cannot write a truth state.** It emits `ADD`, `RETRACT`,
  `CONTRADICT`, `REINSTATE`; the fold derives the state. This is what makes every
  state auditable — each one has a derivation.

## 2. The truth lattice

Four values, after Belnap (1977).

```
            BOTH              supported AND contradicted
           ╱    ╲
         IN      OUT          believed / not believed
           ╲    ╱
          NEITHER             asserted, support unresolved
```

| From | Event | To |
|---|---|---|
| — | `ADD`, support satisfied | `IN` |
| — | `ADD`, support unresolved | `NEITHER` |
| `NEITHER` | support resolves | `IN` |
| `IN` | `RETRACT` (permission-checked) | `OUT` |
| `IN` | support withdrawn | `OUT` (cascade) |
| `IN` | **support contested** | **`BOTH`** (cascade, §2.3) |
| `IN` | `CONTRADICT` | `BOTH` |
| `BOTH` | `UNCONTRADICT` | `IN` |
| `BOTH` | `SUPERSEDE` by fresh observation | `OUT` (old) + `IN` (new) |
| `OUT` | `REINSTATE` | `IN` |

### 2.2 Why `BOTH` and not a "disputed" flag

A boolean flag leaves the belief believed and rendered, with a warning beside
it — which reproduces the exact failure the design exists to eliminate: **a
refutation sitting next to a claim does not neutralize it.**

`BOTH` is a state with defined semantics, not a marker:

- it **elides content** at render — summary plus contradiction, content
  recallable on request
- it **propagates**: dependents of a `BOTH` belief become `BOTH` (§2.3)
- it is **queryable**: "what is contested right now" is a state filter
- it **blocks nothing by itself** — but a node claiming a `BOTH` premise is
  refused ([04](04-execution.md) §3)

And it does not violate I6: nothing was retracted, the world was not deleted by
fiat. The agent stopped staring at it.

### 2.3 Support has four states, not two

The fold classifies a belief's support before deriving its truth state.
Collapsing that into a boolean produces two wrong answers, both caught by the
implementation tests:

| Support | Means | Belief becomes |
|---|---|---|
| **Satisfied** | every declared support exists and the mode holds | `IN` |
| **Unresolved** | a declared support belief is not in the store yet | `NEITHER` |
| **Withdrawn** | support existed and stopped holding | `OUT` |
| **Contested** | support has not gone away — it is `BOTH` | **`BOTH`** |

Two distinctions a boolean loses:

- **Unresolved is not Withdrawn.** Support that has not arrived yet — the
  streaming case — leaves a belief `NEITHER`; support that was there and failed
  drives it `OUT`. Conflating them makes a retracted premise's dependents read
  as merely pending.
- **Contested is not Withdrawn.** A `BOTH` premise still exists; it is disputed,
  not gone. Its dependents must therefore be **contested**, not retracted.
  Treating a contested premise as withdrawn drives the chain to `OUT` and
  silently destroys the flagship behaviour — a draft resting on contested
  evidence would disappear instead of flagging itself.

**Propagation is unbounded, by design.** A conclusion resting on contested
evidence is contested however long the derivation chain is. Because propagation
falls out of support classification rather than a separate traversal, there is no
depth parameter to tune and no chain length at which a contradiction quietly
stops mattering.

### 2.4 Contradiction is never auto-resolved

Graphene never picks a winner between contradicting sources. It records both,
marks the state, and surfaces it. Resolution requires a fresh observation
(`SUPERSEDE`) or an explicit caller decision (`UNCONTRADICT` with a reason).

An engine that silently resolved contradictions would be last-write-wins with
extra steps.

## 3. Retraction permission (I3)

| Provenance | Caller may retract | Escape valve |
|---|---|---|
| `user-instruction` | **no** | — |
| `tool-observation` | **no** | **`CONTRADICT`**, or re-observe (I6) |
| `derived` | yes | auto-cascade |
| `hypothesis` | yes | cheap to drop |
| `artifact` | yes | decays |
| `job` | **no** | immutable execution record |
| `journal` | **no** | supersede only |

Refusals are **structured and name the alternative**, never a bare error:

```json
{ "refused": "type-forbidden",
  "suggestion": "contradict",
  "reason": "I6 — an observation stops being believed only through a new observation" }
```

A refusal that reads as a failure teaches the caller nothing. A refusal that
names the alternative is how the model learns the model.

### 3.1 The `SUPERSEDE` seam — stated honestly

`SUPERSEDE` on a `tool-observation` is permitted only with evidence of a fresh
observation in the same turn. **Graphene cannot verify this** — it has no notion
of a turn and no view of the caller's tool calls. The caller supplies an
`observation_proof` and Graphene records that a check was claimed.

⚠️ **This is a genuine seam, not an airtight check.** The verification belongs to
the caller — for Genera, the agent checks it against its actual tool-call record
([`../../genera/specs/02-reflection.md`](../../genera/specs/02-reflection.md) §8.2).
Documented as a seam rather than presented as a guarantee.

## 4. Typed edges

Seven kinds, fixed. **Not extensible by callers** — an extensible edge vocabulary
becomes a domain ontology, which is out of scope.

| Edge | DAG? | On withdrawal |
|---|---|---|
| `derives-from` | **yes** | source → `OUT` |
| `corroborates` | no | fidelity drops one rung |
| `refutes` | no | target leaves `BOTH` |
| `supersedes` | no | — |
| `produced-by` | no | **lineage only — never cascades** |
| `scoped-to` | no | **node/graph exit → `OUT`** |
| `assumed-by` | no | see §5 |

`derives-from` cycles are rejected at `ADD`. The rest may cycle freely;
`corroborates` is symmetric in practice.

**`produced-by` explicitly never cascades.** A completed job going out of scope
must not retract what it observed. Lineage is a fact about history, not a support
relation — getting this wrong would make finishing work delete its findings.

**`scoped-to` drives the scope-exit cascade**, which in practice fires far more
often than refutation-driven cascade: work is abandoned, approaches are dropped,
graphs are cancelled. It is the highest-value edge in the set.

## 5. `assumed-by` — the cross-session mechanism

The edge that makes multi-session divergence detectable.

When a session claims a node it declares its **read-set** — the beliefs the work
will rest on ([04](04-execution.md) §3). Graphene records an `assumed-by` edge
from each belief to the claim.

Then:

- a belief moving to `OUT` or `BOTH` finds every active claim assuming it
- the server pushes `premise_invalidated` to those sessions **immediately**, not
  at their next poll ([05](05-server.md) §4)
- a new claim on a stale premise is **refused**, with the stale IDs named

Without this edge, two sessions can hold contradictory beliefs and both proceed
confidently. With it, the second one to act gets stopped.

## 6. Which beliefs are shared

Not every belief crosses the session boundary. The filter:

> A `tool-observation` about a **shared resource** — the repo, a database, a
> deployed system, an external service — is written to the graph. A session's
> private reasoning stays local. A `derived` belief crosses when it is a node's
> **declared output**.

That keeps the shared belief set bounded and meaningful, so contradiction
detection fires on things that matter rather than on trivia.

**Sources are declared**, so "is this a shared resource" is a lookup, not a
judgment:

```json
{ "source_ref": { "kind": "shared", "system": "postgres://…", "path": "users" } }
```

## 7. Source mutation

A deterministic, model-free staleness trigger, and the mechanism behind the
flagship behaviour.

```
source S written
  → beliefs with source_ref ∈ S     → marked stale (still IN)
  → their dependents                → BOTH
  → active claims assuming them     → pushed `premise_invalidated`
  → next read of S                  → SUPERSEDE clears the staleness
```

The observation is not deleted — I6 forbids it. It is marked untrustworthy and
its consequences are flagged. **A drafted action whose premise died flags itself
before anyone acts on it.**

⚠️ Requires the caller to emit `gr stale --source <ref>` after a write. Sources
without a change signal fall back to a declared TTL — declared, never assumed,
because a silently absent signal makes stale data look fresh.

## 8. Bi-temporality

- **`observed_at`** — when the fact was true in the world
- **`recorded_at`** — the log `seq` when Graphene learned it
- **`valid_until`** — closed when a superseding observation arrives

Two query axes, and conflating them is a common and expensive error:

| Question | Axis |
|---|---|
| "What did we believe when this node ran?" | `recorded_at` |
| "What was true on 3 March?" | `observed_at` |

**Out-of-order arrival resolves by `observed_at`, not by arrival.** A
later-arriving, earlier-observed fact does not supersede a newer one.

⚠️ Callers must supply `observed_at`. Where a source cannot, the fallback
(`observed_at = recorded_at`) is recorded with `imputed: true` — never defaulted
silently, because a silently imputed timestamp makes the second axis quietly
wrong.

## 9. Nogoods

```rust
struct Nogood { entries: Vec<BeliefId>, discovered_at: Seq, by: Actor, note: String }
```

Stops thrashing: without them, a caller re-proposes a combination it just
rejected, forever.

- Checked on `ADD` — a derivation completing a nogood is **rejected** with the
  nogood id.
- **Minimality reduction** attempted on record (best-effort, non-blocking).
- **Unenforceable nogoods are surfaced, never dropped.** If every member is a
  `user-instruction`, Graphene cannot evict one; it reports
  `NogoodUnenforceable`. Contradictory instructions are a human problem.

## 10. Queries

```
gr belief <id>            state, axes, source, both timestamps
gr why <id> [--depth 3]   transitive support, typed
gr dependents <id>        what falls if this goes
gr contested              all BOTH, with contradictions
gr pending-beliefs        all NEITHER
gr history <id>           every event touching it, in order
```

`gr why` is depth-limited by default: transitive support over a mature graph is
unbounded, and an unbounded explanation is not an explanation.

## 11. Open questions

- **OPEN** — Depth limit for `BOTH` propagation. Too shallow and contradictions
  never reach the conclusions that matter; too deep and one contested observation
  paints the graph. Needs a measured default.
- **OPEN** — Whether `gr why` returns the shortest support path or all paths.
  Shortest is legible, all is complete. Probably shortest with a flag.
- **OPEN** — Whether beliefs may be `scoped-to` a node (dropped when the node's
  work is superseded) or only to a graph.
