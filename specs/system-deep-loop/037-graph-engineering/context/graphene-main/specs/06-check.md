# Graphene · 06 · `gr check`

## 1. The rule

> **Deterministic checks for deterministic properties. Everything else is
> reviewed by an agent.**

Every check in this document is a fact about **declarations** — schemas,
bindings, capabilities, bounds — not an inference about content or intent. There
are no keyword heuristics, no "if the description contains 'and'", no scoring.
That kind of check fakes determinism over a non-deterministic property and is
worse than no check, because it produces confident wrong answers.

The judgment half — granularity, decomposition quality, whether a gate is in the
*right* place — lives in review nodes and the skill ([09](09-skill.md) §5). It is
not `gr check`'s job and never will be.

## 2. What makes this possible

**Typed node contracts.** Because every node declares an input schema, an output
schema, and explicit bindings, a whole class of things that would otherwise be
guesswork becomes type checking.

Without schemas, "is this edge real?" is a heuristic. With them it is a
comparison of two declarations. The schemas are not bureaucracy — they are what
converts opinion into arithmetic.

## 3. Structure and bindings

| # | Check | Deterministic because |
|---|---|---|
| S1 | No cycles in the `needs` graph | pure graph structure |
| S2 | Every `needs` resolves to an existing node | set membership |
| S3 | Node names unique within the graph | enforced by the store's unique index |
| S4 | No orphan nodes — every node is on a path from a root to a terminal | reachability |
| S5 | Every node's required inputs are bound | schema `required` vs. binding set |
| S6 | Every binding's `select` path is satisfiable by the source's output schema | JSON-path against JSON Schema |
| S7 | Source output type satisfies target input type at every binding | structural subtyping |
| S8 | **No fake edges** — every node in `needs` is referenced by at least one binding | **set equality between `needs` and the nodes referenced by `bindings`** |

**S8 is the one people assume must be a heuristic, and it is not.** An edge
exists only because it was declared; a binding exists only because it was
declared. If `needs` contains a node that no binding reads from, the plan says
"B depends on A" and also says "B never reads A." That is a contradiction between
two declarations, detected by set difference.

The error names both sides:

```json
{ "code": "fake_edge", "node": "gn_score…", "unused_dep": "gn_fetch…",
  "detail": "gn_score lists gn_fetch in needs but no binding reads from it. Either bind its output or remove the dependency — these nodes can run in parallel.",
  "fix_hint": "remove_need | add_binding" }
```

## 4. Capabilities and gates

| # | Check |
|---|---|
| C1 | Every node's `capability` is registered in the capability set |
| C2 | Every node declaring a **gated** capability has a `human` node on **every** path from a root to it |
| C3 | No `human` node declares a non-human capability |
| C4 | Every `merge` node has more than one inbound edge; every fan-in has exactly one `merge` owner |

C2 is a reachability computation over declared capabilities, not an inference
about what a node "probably does". A node reaches `send_email` only if it says
so; gate placement is then a graph property.

C2's error names the unguarded paths, so the fix is mechanical:

```json
{ "code": "ungated_capability", "node": "gn_send…", "capability": "send_email",
  "unguarded_paths": [["gn_root…","gn_draft…","gn_send…"]] }
```

C4 encodes the finding that a single coordinator owning the merge cuts error
amplification from 17.2× to 4.4×. A fan-in with no owner is a structural defect,
and it is countable.

### 4.0 A gate's answers must be load-bearing

`ungated-choice`: a human node with dependents must say what each of its options
releases. C2 proves a gate is *on the path*; without this the answer changes
nothing, and "reject" left the irreversible node claimable. See
[01](01-graph-model.md).

### 4.1 The capability set is declarable

C1 needs a set to check against, and Graphene cannot know what a deployment can
do. It ships knowing `agent`, `function`, `retrieval`, `human`, `review`,
`merge`, `read`, `query`, plus the eight gated names; a workspace declares the
rest in `capabilities.json` beside the store — data, versioned and diffable, not
a value in a database or a constant in the binary.

**Gating is one-way.** A registry may gate more, never less. `resolve()` unions
the declared gated set onto the built-in one and never subtracts, so registering
`send_email` cannot un-gate it. Without that rule, registration would be a
supported way to delete every gate in front of the one capability gates exist
for, and C2 would be advisory. `redundant_gates()` reports declarations the
built-in set already covers, so the answer is "that gate is not negotiable"
rather than silence.

The alternative — inferring capabilities from node content — is the keyword
heuristic §1 rejects, and it fails in the direction that matters: a node whose
prompt does not obviously read as sending mail would slip past the gate.

## 5. Bounds

| # | Check |
|---|---|
| B1 | Node count ≤ `limits.max_nodes` |
| B2 | Graph depth ≤ `limits.max_depth` |
| B3 | Every `forEach` declares `max`, and `max` ≤ `limits.max_for_each` |
| B4 | Every loop has `max_rounds` |
| B5 | Σ node budgets ≤ graph budget, per dimension |
| B6 | Concurrency declared ≤ `limits.max_concurrency` |

B3 is why a fan-out over 50,000 rows is rejected at authoring time rather than
discovered at node 500. B5 turns budget overrun from a runtime surprise into a
plan-time error.

## 6. Determinism and replay

| # | Check |
|---|---|
| D1 | Every node has an `outputs` schema |
| D2 | Every retryable node has an `idempotency` key |
| D3 | Every edge declares its kind — `deterministic` or `model-decided` |
| D4 | Every `human` node declares an `on_timeout` policy |

D2 is what makes retry safe for a node with external side effects. D4 exists so
**silence is never indistinguishable from approval** — there is no default, and
omitting it fails the check.

D3 costs nothing and buys the ability to count where a graph can go wrong: a
model-decided edge is a branch a model chose, and when a run went somewhere
unexpected those are the first things to look at.

## 7. Concurrency safety

| # | Check |
|---|---|
| X1 | No two nodes declare a write to the same artifact — **one writer per artifact** |
| X2 | No node both reads and writes an artifact another node writes concurrently |

Both are declared-set comparisons. X1 is one of the four task-graph guardrails
and it is the only one that is structurally checkable, so it should be.

## 8. Output

```
gr check [gg_…]
```

```json
{ "ok": false, "graph": "gg_…",
  "errors": [ { "code": "fake_edge", "node": "gn_score…", "detail": "…", "fix_hint": "…" } ],
  "warnings": [ { "code": "no_read_set", "node": "gn_apply…",
                  "detail": "an agent node with an empty --assumes rests on nothing shared" } ] }
```

- **Errors block** the `draft → checked` transition. Fail closed.
- **Warnings do not block** and are limited to declarations that are legal but
  suspicious. There are very few, and none is a content heuristic.
- Every error carries a **`fix_hint`** naming the mechanical remedy, because the
  consumer is an agent that will act on it directly.
- A `CHECK_RESULT` event is recorded, so "did this plan ever pass" is answerable
  from the log.

## 9. What `gr check` deliberately does not check

Stated explicitly so the gap is never mistaken for coverage. Each belongs to a
review lens ([09](09-skill.md) §5):

| Not checked | Why | Reviewed by |
|---|---|---|
| Is this node doing one thing? | judgment about intent | granularity lens |
| Is the decomposition right for the task? | requires understanding the task | completeness lens |
| Is the gate in the *right* place, not merely present? | "expensive to undo" is a judgment | gate lens |
| Should these serial nodes be parallel? | requires knowing whether B *semantically* needs A | dependency lens |
| Will this prompt produce the declared output? | requires running a model | — untestable pre-run |
| Do two nodes share an implicit assumption? | the divergence risk; judgment | stop-rule lens |
| Is the node's `ask` answerable by a human cold? | judgment | human-node lens |

**The temptation to approximate any of these with a heuristic must be refused.**
A rule that is right 70% of the time trains an agent to ignore the checker, which
costs more than the 30% it catches.

## 10. Performance

Whole-graph check is linear in nodes plus edges plus schema size. A 500-node plan
checks in single-digit milliseconds — cheap enough that the agent runs it after
every edit rather than once at the end, which is exactly when a checker changes
authoring behaviour.

## 11. Open questions

- **OPEN** — Whether S7 (structural subtyping) uses full JSON Schema
  satisfiability (correct, complex, slow) or a restricted subtype lattice over a
  declared subset of Schema. Leaning restricted, with unsupported constructs
  rejected at authoring time rather than silently unchecked.
- **OPEN** — Whether `gr check` warns on an `agent` node with an empty
  `--assumes` at plan time, or only observes it at claim time. Plan time is
  earlier; claim time is more accurate.
- **OPEN** — Whether X2 is checkable without a fuller artifact-dependency model
  ([01](01-graph-model.md) §8).
