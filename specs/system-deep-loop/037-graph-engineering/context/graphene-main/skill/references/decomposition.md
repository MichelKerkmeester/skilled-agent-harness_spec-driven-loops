# Decomposition

`gr check` verifies structure. It cannot verify judgment. Everything here is
judgment, which is why it is prose and not a lint rule.

## The test

> A good node is boring. It does one thing, you can test it alone, and you can
> swap it out without touching anything else.

Multi-function nodes become *a loop with extra steps*: they lose testability,
caching, retry, and replaceability at once. If you cannot say what a node does
without using "and", split it.

## Find where the work splits

Ask one question before drawing anything:

> **Where does this work decompose into pieces that never read each other's
> results?**

Split only that. Everything sequential stays in one node.

The evidence is unambiguous. Coordinated teams beat a single agent by ~80% on
work that splits. On sequential work that needs the full picture, **every**
multi-agent configuration tested lost — degrading 39–70%. More nodes is not a
strategy.

| Work | Splits? | So |
|---|---|---|
| Fetch from five systems | yes | fan out |
| Scan two hundred documents | yes | fan out |
| Draft three independent emails | yes | fan out |
| Decide what the company believes about churn | **no** | one node |
| Resolve a contradiction between two sources | **no** | one node |
| Choose the architecture | **no** | one node |

## Draw an edge only when B reads A's output

Every "and then" is a suspect. *"Summarize this file and then check my
calendar"* — the calendar step never reads the summary. That edge is fake, and
deleting it makes both run in parallel.

Most hand-built pipelines carry two or three fake edges. `gr check` finds them,
because `needs` and `bindings` are both declared and it can compare the two sets
— but it is cheaper to not write them.

See `examples/BAD-fake-edges.json`.

## The diamond

```
        ┌─ worker 1 ─┐
plan ───┼─ worker 2 ─┼──▶ verify ──▶ merge ──▶ result
        └─ worker 3 ─┘
```

The verifier being a **separate node with its own context** is the entire point.
A model grading its own work in its own window has already committed to its
reasoning and misses most of its own mistakes.

Give each verifier a **different question** — *is it correct? is it current? is
the source real?* Diverse skeptics catch what three identical ones cannot. See
`examples/deploy-service.json`.

## One owner of the merge

Every fan-in gets exactly one `merge` node. Uncoordinated agents amplified
errors **17.2×**; a single coordinator owning the merge cut that to **4.4×**.

`gr check` warns when a node with several inputs is not a merge. Take the
warning seriously — it is the difference between the two numbers above.

## Gate where a mistake is expensive to undo

Not on every step. A gate on everything makes the human a rubber stamp, and a
rubber stamp is worse than no gate because it manufactures assurance nobody
earned.

Irreversible capabilities — `send_email`, `post_message`, `write_crm`,
`write_database`, `grant_access`, `publish_view`, `delete_*`, `spend_above` —
must have a human node on **every** path to them. `gr check` proves this by
reachability and names the unguarded paths. See `examples/BAD-monolith.json`.

## Watch for shared implicit assumptions

If two nodes both need to know whether the migration ran, they are **not
independent**, and that fact should come from a node rather than from each of
them discovering it separately.

This is where parallel sessions silently diverge: both are locally correct and
globally inconsistent. It is a decomposition defect, not a runtime problem, and
the `stop-rule` review lens exists to find it.

## Put budget in the state

Tokens, dollars, and wall-clock belong on the node, not in your head. Declared
budgets let `gr check` catch an overrun at plan time instead of mid-run. An
undeclared budget is legal — the graph ceiling is still enforced at claim time —
but you lose the early warning.

## Bound every fan-out

`for_each` requires `max`. You do not know there are fifty customers until the
source returns, but you *do* know fifty thousand would be wrong. Declaring the
bound is what makes that a check error at authoring time rather than a discovery
at node five hundred.

## Shapes worth knowing

Read these as artifacts, not descriptions. They are in the format you are about
to write.

| Example | Shape |
|---|---|
| `research-competitors.json` | fan-out → separate verifier → owned merge |
| `refactor-module.json` | serial, one writer per artifact, tests as a deterministic edge |
| `churn-outreach.json` | signals in parallel, merge, human gate before an irreversible send |
| `deploy-service.json` | diamond with three differently-questioned verifiers |
| `investigate-incident.json` | model-decided edge, bounded `for_each`, shape unknown up front |
| `BAD-fake-edges.json` | rejected: `fake-edge` |
| `BAD-monolith.json` | rejected: `ungated-capability` — and the granularity problem `check` *cannot* see |

`BAD-monolith.json` is worth a second look. `gr check` rejects it for the missing
gate. It says nothing about the node doing four things, because granularity is
not structurally checkable. **That is what the review lenses are for.**
