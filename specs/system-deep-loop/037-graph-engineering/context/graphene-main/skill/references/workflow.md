# Workflow

## Which situation are you in?

| Signal | Entry point |
|---|---|
| The user described a task and there is no graph yet | **Plan** |
| You are attached and `gr status` says `claim` | **Work** |
| The user pasted a bare `gn_…` id | **Resolve** |
| A graph exists and you have just started | **Join** |

## Plan

```
gr new --task "<the user's words, verbatim>"
# draft a task.v1 document (see nodes.md, decomposition.md)
gr plan <graph> --file plan.json
gr check <graph>                      # exits 3 on failure; fix and repeat
# instantiate templates/review-subgraph.json into the plan
gr claim <review-node> --graph <g> && gr done <review-node> --graph <g> --output '{"findings":[…]}'
gr findings <graph> --open
gr finding <gf_…> --graph <g> --resolution applied --reason "…"   # every one
gr status <graph>                     # → present-to-user
```

**Then stop.** Show the plan — node count, systems touched, which steps are
irreversible and gated — and wait. The user says go; you do not.

On go: `gr approve <graph>` then `gr start <graph>`.

Review nodes are claimable while the graph is `checked`. Ordinary work is not
claimable until `running`.

## Work

```
gr status <graph>
gr claim <node> --graph <g> --assumes <belief-ids>
# … do the work, calling gr checkpoint as you cross edges …
gr done <node> --graph <g> --output '<json matching the declared schema>' --tokens N
gr wait --graph <g>
```

`gr done` validates against the node's declared output schema and **fails
closed**. Every downstream binding was checked against that declaration at plan
time, so a mismatch is a refusal, not a warning.

`gr wait` blocks until something relevant happens and returns it as JSON. Call
it when you have nothing runnable but the graph is not finished. It works with
or without a server; you cannot tell the difference except in latency.

## Resolve

The user pasted an id. They are not going to explain it, and you have no
context.

```
gr node <gn_…>          # FIRST. Always.
```

You get the ask, the options, the beliefs it rests on with their states, which
of them are stale or contested, and what each answer unblocks. Read it, take the
user's input, then:

```
gr resolve <gn_…> --graph <g> --by <who> --choice <one of the options> --input '{…}'
```

**If any context belief is stale or contested, say so before asking them to
decide.** That is the entire reason the context travels with the ask.

## Join

```
gr attach <graph> --label "<what you are here to do>"
gr status <graph>
```

`attach` starts the server if none is running. You are a worker: claim what you
can, release what you cannot finish, and expect the graph to outlive you.

## When a claim is refused

Refusals are results, not errors — exit 0, structured JSON, and every one names
what to do instead.

| Refusal | Do |
|---|---|
| `already-claimed` | claim a different node |
| `stale-premise` | re-read the named beliefs, then re-claim |
| `not-claimable` | the node is not `ready`; check `gr status` |
| `bad-graph-state` | the graph has not reached `running` |
| `budget-exhausted` | stop and tell the user which dimension ran out |
| `output-schema-violation` | your output does not match what the node declared |

Never retry a refusal unchanged. It told you what to fix.
