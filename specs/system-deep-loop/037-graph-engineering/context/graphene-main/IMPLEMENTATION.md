# Graphene — implementation plan

---

> # ⛔ STOP — READ BEFORE ANY UI WORK
>
> ## The UI **MUST** be built using the `frontend-design` skill.
>
> **Before writing a single line of UI code — any HTML, any CSS, any component,
> any layout, any colour, any spacing — invoke:**
>
> ```
> /frontend-design:frontend-design
> ```
>
> This is **not optional**, **not a suggestion**, and **not something to skip
> because "it's only a dev tool."** Graphene's UI is the human-node inbox: the
> surface a person opens to decide whether to approve an irreversible action. It
> is the most visible artifact in the product.
>
> **A generic, default-styled, AI-looking UI is a failed deliverable.** It gets
> rejected and rebuilt at full cost.
>
> Applies to **all of W7**, and to **every later change that touches the UI** —
> a new view, a restyle, a single component. Load the skill first, every time.
>
> Binding requirement restated in [W7](#w7--ui).

---

**Posture: one complete v1.** No placeholders, no stubs, no "wire this up later."
Every workstream below ships its full surface, its tests, and its documentation
together. The ordering is driven by **dependency**, not by scope reduction —
nothing here is deferred, only sequenced.

A workstream is done when: the spec's surface is fully implemented, its tests
pass, its adversarial cases are covered, and nothing it exposes is a TODO.

## 0. Repository

```
graphene/
  Cargo.toml                    workspace
  crates/
    graphene-core/              model, fold, cascade, belief semantics — NO I/O
    graphene-store/             SQLite: log, fold tables, transactions, replay
    graphene-check/             deterministic validation (06)
    graphene-server/            WebSocket + SSE + static HTTP
    graphene-cli/               clap, subcommands, JSON I/O, exit codes
    graphene-bench/             BMB harness
  ui/                           frontend source; built and embedded
  skill/                        SKILL.md, references, templates, examples
  tests/
    golden/                     committed logs + expected folds
    property/                   generated-log properties
    concurrency/                real SQLite, real threads
    server/                     real server, kill-and-degrade
  specs/                        this design set
```

**Dependency direction:** `core ← store ← {check, server, cli}`. `core` has no
I/O, no clock, no randomness, no async. That constraint is what makes
determinism testable rather than aspirational.

## 1. Workstreams

| # | Workstream | Depends on | Spec |
|---|---|---|---|
| W1 | Core model and fold | — | [01](specs/01-graph-model.md), [02](specs/02-belief-layer.md) |
| W2 | Store | W1 | [03](specs/03-store.md) |
| W3 | Check | W1 | [06](specs/06-check.md) |
| W4 | Execution protocol | W1, W2 | [04](specs/04-execution.md) |
| W5 | Server | W2, W4 | [05](specs/05-server.md) |
| W6 | CLI | W1–W5 | [07](specs/07-cli.md) |
| W7 | UI | W5 | [08](specs/08-ui.md) |
| W8 | Skill | W6 | [09](specs/09-skill.md) |
| W9 | Verification | spans all | [10](specs/10-verification.md) |

W3 runs parallel to W2 once W1 lands. W7 runs parallel to W6 once W5 lands. W9
begins with W1 and never stops.

---

## W1 · Core model and fold

Pure Rust. No I/O, no clock, no randomness, no async.

**Deliverables**

- Full type set: `Graph`, `Node`, `Belief`, `Edge`, `Binding`, `Claim`,
  `Budget`, `Limits`, `ForEach`, `RetryPolicy`, `Checkpoint`, `Finding`,
  every enum and state.
- **Content-anchored ID derivation** with the `gg_`/`gn_`/`gb_`/`gc_` prefixes,
  base32 unpadded.
- The complete event enum ([03](specs/03-store.md) §3.1) with serde round-trip.
- `fold(events) -> State` — total, deterministic, side-effect free.
- **The truth lattice**: all transitions in [02](specs/02-belief-layer.md) §2,
  including `NEITHER` resolution and unbounded `BOTH` propagation via the
  four-state support classification (§2.3).
- **Cascade**: support-withdrawn, scope-exit, contradiction, source-mutation —
  with a proof of termination in the test suite, not just an assertion.
- **Retraction permission matrix**, returning structured refusals that always
  carry a `suggestion`.
- **Fidelity monotonicity** (I8) including distinct-`source_ref` enforcement.
- **Sensitivity join** (I7) over support.
- Bi-temporal ordering: out-of-order arrival resolved by `observed_at`; imputed
  timestamps flagged.
- Nogoods: `ADD`-time rejection, minimality reduction, `NogoodUnenforceable`.
- `forEach` expansion with deterministic child ids from `(parent, index)`.
- Node state machine, including `awaiting` blocking only dependents.
- Graph lifecycle state machine with every precondition from
  [01](specs/01-graph-model.md) §2.1.

**Tests** — property suite from [10](specs/10-verification.md) §4 (determinism,
cascade termination, non-deletion, fidelity/sensitivity monotonicity, permission
totality) plus exhaustive transition-table coverage.

**Done when** the fold is deterministic under a generated-log fuzzer and every
invariant I1–I8 has a property test that fails if the invariant is removed.

---

## W2 · Store

**Deliverables**

- Full schema from [03](specs/03-store.md) §3–4, with migrations from empty.
- WAL mode, `busy_timeout`, foreign keys on.
- **Single-transaction append**: insert event → apply to fold → commit. No
  read-modify-write anywhere.
- The **partial unique index** enforcing one active claim per node — correctness
  in SQL, not in application logic.
- `assumed_by` and the active-claim index, so premise invalidation is an indexed
  lookup.
- `gr rebuild` — truncate fold, replay log.
- `gr fold --up-to <seq>` into a scratch database.
- `gr export` / `gr apply` JSONL round-trip.
- `gr compact`, self-verifying (`fold(before) == fold(after)` or abort).
- Store discovery: walk up for `.graphene/`, `--store`, `GRAPHENE_STORE`.
- **Lease expiry as a query-time view**, never stored — the fold must not read a
  clock.

**Tests** — rebuild equivalence on every golden log; concurrency suite with real
threads racing claims; crash-injection mid-append asserting rollback of both
event and fold.

**Done when** `rebuild(log) == incremental_fold(log)` holds for the entire golden
corpus and N-thread claim races produce exactly one winner every time.

---

## W3 · Check

**Deliverables**

- Every check S1–S8, C1–C4, B1–B6, D1–D4, X1–X2 from
  [06](specs/06-check.md).
- JSON Schema handling for S5–S7 — the restricted subtype lattice, with
  unsupported constructs **rejected at authoring time** rather than silently
  unchecked.
- Structured errors carrying `code`, `node`, `detail`, and **`fix_hint`**.
- `CHECK_RESULT` recorded to the log.
- Exit code 3 on failure.

**Explicitly excluded** — and this is a standing review rule: no keyword
heuristics, no scoring, no content inspection. If a proposed check cannot be
stated as a fact about declarations, it belongs in a review lens.

**Tests** — a negative fixture per check that fails with exactly the expected
code; the two `BAD-*` examples failing with their documented codes; a 500-node
plan checking in single-digit milliseconds.

---

## W4 · Execution protocol

**Deliverables**

- `attach` / `detach` / `sessions`, session state machine.
- `next`, `claim` with **read-set assertion**, `renew`, `release`.
- Refusals: `already_claimed`, `stale_premise` (naming the dead premises and
  what killed them), `budget_exhausted` (naming the dimension), `revoked`.
- `checkpoint` with implicit lease renewal.
- `done` with **schema validation, failing closed**.
- `fail` with all three retry policies, including `escalate` converting a node
  into a `human` node carrying the failure as context.
- **Idempotency**: a node with a recorded output returns it rather than re-running.
- Human nodes: `await`, `awaiting`, `resolve`, all three `on_timeout` policies,
  and the cold-context `gr node <id>` payload with `why()` on its context.
- `amend` producing a child graph carrying forward completed outputs.
- `forEach` expansion at source completion.
- Budget accounting: declared vs. actual, enforced at claim.

**Tests** — the full lease lifecycle including revocation mid-work; `done`
refused after revocation; every timeout policy; idempotent retry with side
effects; a golden log for the flagship stale-premise-under-awaiting-human case.

---

## W5 · Server

**Deliverables**

- WebSocket at `/ws`, protocol v1, version negotiation and refusal on mismatch.
- Full frame set ([05](specs/05-server.md) §4), every frame carrying `seq`.
- **Reconnect with a last-seen seq replaying everything missed, in order.**
- **Routing**, precisely as specified — `premise_invalidated` reaching only
  holders of active claims in `assumed_by`, via the index.
- `interests` filtering, with `claim_revoked` and `graph_changed` **never
  filterable**.
- Presence: heartbeat 15s, `gone` at 45s, **immediate claim release on socket
  drop**, `node_ready` to survivors.
- `gr wait`: holds the socket, returns the first matching event as JSON, exits.
- **WAL-watch fallback** when no server is reachable — `gr wait` still works,
  untargeted.
- Lifecycle: detached spawn on first `attach`, `server.json` with pid/port/
  protocol/store, stale-file replacement, grace-period exit.
- HTTP read surface + SSE, **loopback only, no write endpoint**.
- Frame coalescing on bursts, preserving the seq range.

**Tests** — kill the server mid-run and assert writes continue, `gr wait`
degrades, and push resumes with no gap on restart; routing-precision test
asserting a session that should *not* receive an event does not; reconnect-gap
test.

---

## W6 · CLI

**Deliverables**

- Every command in [07](specs/07-cli.md) §3–10.
- JSON on stdout by default; `--human` tables; `--quiet`.
- **Refusals as exit-0 structured results**; non-zero reserved for genuine
  failure. Exit codes 0–4 as specified.
- Every write echoes its event.
- `gr status` with the full `next_action` computation — the deterministic
  workflow, in code.
- `gr apply` raw event stream; every subcommand is sugar over the same internal
  apply path.
- `gr ui`, `gr serve --foreground`.
- `gr bench --bmb`.

**Tests** — a golden CLI-transcript suite: a scripted multi-session run compared
byte-for-byte against expected JSON; exit-code coverage per class.

---

## W7 · UI

> ## ⛔ FIRST ACTION OF THIS WORKSTREAM
>
> **Invoke `/frontend-design:frontend-design` before writing any UI code.**
>
> Not after a draft. Not "if it looks off." **First.** Before the first
> component, the first stylesheet, the first colour token.
>
> Re-invoke it for any subsequent UI change, however small.
>
> **Rationale:** this is the human-node inbox — where a person decides whether an
> irreversible action goes ahead, reading a draft that may be resting on a dead
> premise. A generic AI-default interface undermines the one moment the product
> is judged on. **Shipping a default-looking UI is a failed deliverable, not a
> rough first pass.**

**Deliverables**

- Layered DAG (ELK), node states, session labels, **deterministic vs.
  model-decided edges visually distinct**.
- Live via SSE with seq reconciliation and an honest reconnect banner.
- Node detail: bindings with resolved values, output, checkpoints, budget
  declared vs. actual, produced beliefs.
- **Human-node inbox** — the priority view: ask, options, context beliefs with
  state and fidelity, **stale and contested premises marked with what
  contradicted them**, consequences, age, timeout policy.
- Timeline view of real parallelism.
- Belief views: contested, stale, `why()` explorer.
- Library: graphs by state with metadata; clone.
- **Copy: single ID, and multi-selection.** The only path back to an agent.
- Embedded via `rust-embed`; **no network access at build or runtime**.
- Loopback binding only. **No write endpoint — verified by a test that asserts
  the router exposes no non-GET route.**
- 500-node layout without degradation; above the limit, fall back to list and
  timeline rather than a hairball.

---

## W8 · Skill

**Deliverables**

- `SKILL.md`: the mental model, the four entry points, the `next_action` table,
  the prohibitions, the asymmetry.
- References: `workflow`, `decomposition`, `nodes`, `human-nodes`, `beliefs`,
  `review`, `failure`.
- `templates/review-subgraph.json` — all six lenses plus the owning merge node.
- **`examples/*.json` — runnable**, spanning shapes not domains: fan-out, serial,
  diamond, discover-then-fan-out, unknown-shape, plus the two `BAD-*`.
- `manifest.json` mirroring the CLI surface exactly.

**Tests** — every example except `BAD-*` passes `gr check`; each `BAD-*` fails
with its documented code; the review template instantiates and checks; **every
command named in the skill exists in the CLI with the documented flags.** That
last test is what keeps prose and binary from drifting.

**Status: done.** `skill_consistency.rs` derives the surface from the compiled
clap tree — commands, flags, required flags, `next_action` variants, refusal
codes, and every link — so a rename in `cli.rs` fails the build rather than an
agent's next command. `skill_examples.rs` compiles and checks every shipped
example, the review template, and **every fenced `task.v1` block in the prose**.

Two defects surfaced by writing the skill against the real binary:

- The capability set was a constant, so no real deployment could name what it
  does. Now declarable ([06](specs/06-check.md) §4.1), with gating one-way.
- `discovery::is_alive` forked a `kill -0`, and a spawn failure under process
  pressure read as "dead" — which evicts a *running* server's record and starts
  a second one for the same store.

---

## W9 · Verification — done

Begins with W1, never stops.

- Property suite ([10](specs/10-verification.md) §4).
- Golden logs ([10](specs/10-verification.md) §5) — every listed case, including
  a dedicated log for the flagship stale-premise behaviour.
- Gates G1–G11 with an adversarial case each.
- Concurrency suite against real SQLite and real threads.
- Server suite including kill-and-degrade and routing precision.
- Skill-consistency suite.
- **`gr bench --bmb` on every commit, score committed as a tracked artifact** —
  a regression is a build failure, and the number is reproducible by anyone.

---

## 2. Cross-cutting rules

Enforced in review, every time:

1. **No model call anywhere in the codebase.** No LLM SDK in `Cargo.toml`. Grep
   for it in CI.
2. **No execution.** No process spawning except the detached server. No node
   runner, ever.
3. **`graphene-core` has no I/O, no clock, no randomness, no async.** Enforced by
   dependency lint.
4. **No wall-clock read inside the fold.** Lease expiry is a query-time view.
5. **Every refusal carries a `suggestion` or a `fix_hint`.**
6. **Every write is one transaction.** No read-modify-write across statements.
7. **No non-GET route in the server.**
8. **No heuristic in `gr check`.** If it cannot be stated as a fact about
   declarations, it is a review lens.

## 3. The first thing to run

Before W2 is finished: **`gr bench --bmb` against W1's belief layer.**

It needs no store, no server, no CLI, no agent — just the fold. It is the
cheapest available falsification of the belief layer's core claim, and learning
it now is worth far more than learning it after nine workstreams
([10](specs/10-verification.md) §2).

## 4. Open decisions to close before the workstream that needs them

| Decision | Blocks | Spec |
|---|---|---|
| JSON Schema subset for subtype checking | W3 | [06](specs/06-check.md) §11 |
| Node output inline vs. content-addressed blobs | W2 | [03](specs/03-store.md) §10 |
| `premise_invalidated`: notify vs. hard-revoke | W4 | [04](specs/04-execution.md) §10 |
| Default lease TTL | W4 | [04](specs/04-execution.md) §10 |
| Frontend stack (Svelte/Solid + ELK) | W7 | [08](specs/08-ui.md) §8 |
| One skill or two (drive / teach) | W8 | [09](specs/09-skill.md) §9 |
| One server per store vs. per process | W5 | [05](specs/05-server.md) §10 |

Each is a real fork with a stated leaning, not a blocker. Close it when its
workstream starts, and record the decision as an ADR.

**Status: done.**

- **Gates G1–G11** — `crates/graphene-check/src/gates.rs`, run by `gr validate`,
  with an adversarial case each in `tests/gates.rs`. G7 has two: the fold joins
  the sensitivity label at write time so a laundered belief cannot be recorded,
  and the gate catches it anyway if a state ever claims otherwise.
- **Property suite** — `crates/graphene-core/tests/properties.rs`, 13 properties
  over 24 seeded generated logs. The seed is the whole reproduction; a failure
  is replayable from the number in the message.
- **Golden logs** — `crates/graphene-core/tests/golden/`, ten committed logs with
  their folds, produced by driving the real binary. Includes the flagship
  stale-chain: a source rewritten under a pending approval, ending at a `BOTH`
  conclusion. `GRAPHENE_BLESS=1` regenerates; read the diff before committing it.
- **Concurrency** — `crates/graphene-exec/tests/concurrency.rs`, real OS threads
  against a real SQLite file, one `Store` per thread. Twelve sessions race one
  node and exactly one wins.
- **`gr bench --bmb`** — the MnemeBrain belief benchmark, unmodified, driven
  through `bench/graphene_adapter.py`. Score in `bench/score.json`.

### What the benchmark said

**38/39 checks. 100% belief revision, 100% evidence tracking, 91.7%
contradiction — 97.2% over the three categories Graphene claims.**

Five of the eight categories are **skipped, not failed**: temporal decay,
counterfactual sandboxing, consolidation tiers, multi-hop retrieval and pattern
separation are not in Graphene's design. They belong to the knowledge base, which
does not exist yet. Spec [10](specs/10-verification.md) §2 wanted this run early
precisely so that scope line would be drawn from evidence rather than opinion.

The one remaining check is a **deliberate divergence**, recorded in the artifact:
the scenario retracts an observation, I6 forbids that, and a disputed attacker
still disputes. Support and attack are treated symmetrically — a `BOTH` premise
contests what rests on it, so a `BOTH` attacker contests what it attacks.

It also found a real defect: **a contradiction survived the death of its own
evidence.** A claim stayed contested forever because of a marker whose basis
nobody held any more — the fold trusting itself over its own log. Fixed in
`settle_beliefs`; a contradiction that named evidence now stands only while some
of it is still believed, and one that named none stands until withdrawn.
