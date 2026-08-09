# Graphene · 10 · Verification

## 1. Posture

Graphene is **the most testable component in the system**, deliberately: no model
calls, no execution, no network in the core. Every property is a pure function of
a log, which means every property is a unit test.

Two consequences worth acting on:

- The belief engine can be scored against an **external benchmark before any
  other component exists** (§2).
- Determinism is testable by construction: same log, same fold, or it is a bug.

## 2. The Belief Maintenance Benchmark

[MnemeBrain's BMB](https://mnemebrain.github.io/mnemebrain-benchmark/): 48 tasks,
8 categories, ~100 checks, **zero LLM calls, fully deterministic**. Contradiction
detection, revision, evidence tracking, temporal decay, explanation,
counterfactual sandboxing, consolidation — the belief layer's job almost line for
line.

Published scores: MnemeBrain 100%, Lite 93%, Structured Memory 36%, Mem0 29%,
**RAG / OpenAI / LangChain baselines 0%** — the stated reason being that
retrieval architectures *cannot represent* a contradiction.

**Run `gr bench --bmb` before anything else in the system is built.** It needs no
model, no database beyond SQLite, no agent, no server. Graphene's belief layer is
a full truth-maintenance system with four-valued states and typed edges; it
should score well. **If it does not, that is decisive and far cheaper to learn
now than after four components exist.**

Two cautions applied to ourselves as strictly as to others:

- MnemeBrain publishes the benchmark **and** tops it. Treat the leaderboard
  accordingly.
- LightRAG self-reported 59.8 F1 and scored **6.6** under independent
  re-evaluation. Any number we publish must be reproducible from a committed
  harness, or it does not get published.

## 3. Gates

`gr validate` runs every gate and **fails closed** — non-zero exit, store not
served. Each needs adversarial coverage, not happy-path.

| Gate | Checks | Adversarial case |
|---|---|---|
| G1 grounding | every belief has a real `source_ref` | a receipt naming a source that never existed |
| G2 edges | endpoints exist, `derives-from` acyclic, cardinalities hold | a cycle introduced across three separate events |
| G3 states | every state derivable from its events | a hand-edited log where a state cannot be derived |
| G4 identity | ids content-anchored and unique | two distinct contents colliding to one id |
| G5 permissions | no event violates the retraction matrix | `RETRACT` on an observation via a crafted event stream |
| G6 fidelity | no upward move without distinct-source corroboration | `CORROBORATE` from the **same** `source_ref` |
| G7 sensitivity | no derived belief below the join of its support | **a laundering chain producing an unrestricted conclusion from restricted support** |
| G8 nogoods | no `IN` set contains all members of a nogood | a set assembled to violate one |
| G9 temporal | `observed_at` present or explicitly imputed | out-of-order arrival contradicting arrival order |
| G10 determinism | every `MODEL_CALL` carries `{purpose, modelId, promptHash, output}` | a call missing its hash |
| G11 graph | node schemas, bindings, capabilities per [06](06-check.md) | every check in that document, negated |

**G7 must never be relaxed.** It is checkable precisely *because* sensitivity is
a lattice join over support — pure structure, no policy, no judgment.

## 4. Property tests

Generated logs, asserted properties.

| Property | Statement |
|---|---|
| **Determinism** | `fold(log) == fold(log)` across processes, machines, runs |
| **Rebuild equivalence** | `rebuild(log) == incremental_fold(log)` for every golden log |
| **Point-in-time** | `fold(log, up_to: n)` equals the state observed after event *n* in a live fold |
| **Cascade termination** | cascade halts on every generated graph, bounded by depth |
| **Non-deletion (I2)** | no operation reduces the belief or event count |
| **Fidelity monotonicity (I8)** | no event raises fidelity without distinct-source corroboration |
| **Sensitivity monotonicity (I7)** | no derived belief below the join of its support |
| **Permission totality (I3)** | every refused operation returns a `suggestion`, never a bare error |
| **Claim exclusivity** | under concurrent claims, exactly one succeeds — asserted by racing threads against real SQLite |
| **Lease safety** | a revoked claim's `gr done` is always refused |
| **Compaction safety** | `fold(before) == fold(after)` for every compaction |

Permission totality is a usability property behaving like a correctness one: a
refusal without an alternative teaches the caller nothing, and callers that learn
nothing produce worse graphs.

## 5. Golden logs

A committed corpus of event logs with their expected folds, asserted exactly. Any
change to fold semantics either preserves them or bumps a version and updates
them deliberately — never silently.

Coverage the corpus must include:

- every truth-state transition ([02](02-belief-layer.md) §2)
- each cascade trigger, alone and interacting
- a nogood rejection at `ADD`, and an unenforceable nogood
- `forEach` expansion, including the deterministic child ids
- a claim, a lease expiry, a revocation, and a `gr done` refused after revocation
- a human node: ask → wait → resolve → unblock
- a human node reaching its timeout under each policy
- out-of-order arrival resolved by `observed_at`
- **source mutation producing a stale chain ending at a `BOTH` conclusion under
  an awaiting human node** — the flagship behaviour, with its own log
- a graph amendment producing a child graph that carries forward completed output

## 6. Concurrency and server tests

Deterministic tests against real SQLite and a real server, not mocks:

- N sessions racing to claim one node → exactly one wins, N−1 get structured
  refusals
- a session killed mid-node → presence drops → claims released → `node_ready`
  fires to the survivors
- **`premise_invalidated` reaches the right session and only that session** —
  routing precision, not just delivery
- reconnect with a stale `seq` → all missed events replayed in order
- server killed mid-run → writes continue → `gr wait` degrades to WAL watching →
  server restarts → push resumes with no gap
- protocol version mismatch → refusal, not a corrupted exchange
- a chatty graph → coalesced frames preserve the seq range

## 7. Skill and example verification

The examples are executable, so they are tested:

- every `examples/*.json` except the `BAD-*` pair passes `gr check`
- each `BAD-*` fails with **the specific expected error code**, not merely fails
- the review subgraph template instantiates and passes `gr check`
- every command named in `SKILL.md` and `manifest.json` exists in the CLI, with
  the documented flags — **a skill that references a command that does not exist
  is a defect**, and this test is what keeps prose and binary in step

## 8. What Graphene cannot verify

Stated so gaps are not mistaken for coverage:

- **Whether a graph is a good decomposition.** Judgment; the review lenses'
  problem, and measurable only from the corpus over time
  ([09](09-skill.md) §7).
- **Whether a node's prompt produces its declared output.** Requires running a
  model; untestable before the run. The schema check at `gr done` catches it
  after.
- **Outcome parity** — whether working through a graph produces better results
  than not. The caller's question.
- **Whether the sensitivity labels are correct.** G7 enforces that a label is
  honoured transitively; whether it was the right label is the platform's.
- **Whether contradiction is frequent enough to matter** in the target domain.
  Belief revision is inert where contradiction is rare or reliability is flat
  ([`../../specs/00-vision.md`](../../specs/00-vision.md) §2) — and that
  measurement precedes the build.

## 9. Continuous

| Runs | What |
|---|---|
| Every commit | unit, property, golden logs, gates, examples, skill-consistency |
| Every commit | concurrency suite against real SQLite |
| Every commit | server suite, including kill-and-degrade |
| Every commit | `gr bench --bmb`, with the score committed as a tracked artifact |
| Nightly | extended property generation with a larger seed space |

The BMB score being a **tracked artifact rather than a badge** is deliberate: a
regression in it is a build failure, and the number is reproducible by anyone
from the committed harness.
