# Writing the `task.v1` document

You write **local names**. Graphene derives content-anchored ids. You never type
a hash.

```json
{
  "graph": "task.v1",
  "goal": "Summarize what last quarter's support tickets are telling us.",
  "nodes": [
    { "id": "fetch-tickets", "job": "read_zendesk",
      "prompt": "Pull last quarter's support tickets.",
      "tokens": 40000,
      "outputs": { "type": "object",
        "properties": { "tickets": { "type": "array", "items": { "type": "string" } } },
        "required": ["tickets"] } },

    { "id": "summarize", "job": "agent",
      "prompt": "What themes do these tickets share?",
      "needs": ["fetch-tickets"],
      "inputs": { "type": "object",
        "properties": { "tickets": { "type": "array", "items": { "type": "string" } } },
        "required": ["tickets"] },
      "outputs": { "type": "object",
        "properties": { "themes": { "type": "string" } },
        "required": ["themes"] },
      "bindings": [{ "from": "fetch-tickets", "select": "$.tickets", "into": "tickets" }] }
  ]
}
```

`gr plan <graph> --file plan.json` compiles it and prints the name → id mapping.
`gr check <graph>` verifies it.

## `job` — one field, two meanings

`job` is the capability the node exercises, **and** six reserved words pick a
node kind:

| `job` | Node |
|---|---|
| `human` | a person answers ([human-nodes.md](human-nodes.md)). Needs `ask` |
| `review` | a lens over the plan itself ([review.md](review.md)). Needs `lens` |
| `merge` | the single owner of a fan-in |
| `function` | a command whose output is a function of its input. Needs `run` |
| `retrieval` | a read from a named source |
| anything else | an agent node, and `job` is its capability |

`function` is not decoration. It marks the nodes whose results can be cached and
replayed, and it separates "the tests failed" from "the model was wrong."

Everything else — `read_zendesk`, `send_email`, `write_crm` — is a capability
name, and that is what gates hang on.

### Register a capability before you use it

Graphene ships knowing `agent`, `function`, `retrieval`, `human`, `review`,
`merge`, `read`, `query`, and the eight gated ones below. Anything else your
workspace can do must be declared once, or `gr check` refuses the plan with
`unknown-capability`:

```
gr capabilities                                      # the effective set
gr capabilities --register read_zendesk,read_web     # additive
gr capabilities --register spend_refund --gated      # and irreversible
```

It writes `capabilities.json` beside the store, so the workspace's policy is a
file you can diff and review rather than a value buried in a database.

**Gating is one-way.** A registry adds gates; it cannot remove one. Registering
`send_email` does not un-gate it — otherwise registration would be a supported
way to delete every gate in front of the one capability gates exist for.

## `needs` and `bindings` are two different claims

- `needs: ["fetch-tickets"]` — **ordering**. This node does not start first.
- `bindings: [{from, select, into}]` — **data**. This node reads that field.

`gr check` compares the two sets. A `needs` with no corresponding binding and no
other justification is a `fake-edge` error: you serialized work that could have
run in parallel. Drop it. See `examples/BAD-fake-edges.json`.

A binding is three parts:

```json
{ "from": "fetch-tickets", "select": "$.tickets", "into": "tickets" }
```

`select` is a path into the source's **declared `outputs` schema** — `$` for the
whole thing, `$.field`, `$.field.nested`, `$.list[*].field`. It is resolved
against that schema at plan time, so a typo is a `bad-select-path` error now,
not a runtime surprise three nodes later.

`into` is the field it lands in, and it is checked against **this** node's
`inputs` schema. A type mismatch between the two is `type-mismatch`.

## `inputs` and `outputs` are contracts, not hints

`gr done` validates the result against `outputs` and **fails closed**. Declare
`outputs` on every node whose result anyone binds, and `inputs` on every node
that binds anything.

Supported: `type`, `required`, `properties`, `items`, `enum`, `minimum`,
`maximum`, `minLength`, `maxLength`, `pattern`, `additionalProperties`.

**Refused at authoring time** with `unsupported-schema`: `anyOf`, `oneOf`,
`allOf`, `not`, `$ref`, `if`/`then`/`else`. A schema that cannot be statically
resolved is a schema a `select` cannot be checked against, and an unchecked
binding is the failure this whole layer exists to prevent. Model a variant as an
`enum` discriminator plus optional fields.

## Gates

The irreversible capabilities —

`send_email`, `post_message`, `write_crm`, `write_database`, `grant_access`,
`publish_view`, `delete`, `spend_above`

— must have a `human` node on **every** path to them. `gr check` proves it by
reachability and names the unguarded paths in `ungated-capability`. See
`examples/BAD-monolith.json`.

## `tokens`

```json
{ "id": "research", "job": "agent", "tokens": 40000 }
```

Per node. The graph ceiling (`gr new --task … --tokens N`) is enforced at claim time
whether or not you declare per-node budgets, but declaring them moves the
discovery from mid-run to `gr check`.

## `for_each`

```json
{
  "graph": "task.v1",
  "nodes": [
    { "id": "gather-sources", "job": "agent",
      "prompt": "List the sources worth checking.",
      "outputs": { "type": "object",
        "properties": { "urls": { "type": "array", "items": { "type": "string" } } },
        "required": ["urls"] } },

    { "id": "check-each-source", "job": "read_web",
      "prompt": "Check this source.",
      "needs": ["gather-sources"],
      "inputs": { "type": "object",
        "properties": { "url": { "type": "string" } }, "required": ["url"] },
      "outputs": { "type": "object",
        "properties": { "verdict": { "type": "string" } }, "required": ["verdict"] },
      "for_each": { "from": "gather-sources", "select": "$.urls", "as_field": "url", "max": 25 } }
  ]
}
```

`max` is **required**. You do not know the count until the source returns; you do
know the number at which something has gone wrong. Declaring it makes the runaway
a check error at authoring time instead of a discovery at item four hundred.

`select` must resolve to an array, or you get `bad-select-path`.
`gr expand <node> --graph <g>` materializes the children once the collection
exists.

### What a fan-out produces

Expanding replaces the template with its children. The template stops being work
of its own: it waits on the children, and **its output is the array of theirs**.

So a downstream binding reads the collection with `$[*]`:

```json
{ "from": "check-each-source", "select": "$[*].verdict", "into": "verdicts" }
```

and the field it lands in is an array:

```json
{ "verdicts": { "type": "array", "items": { "type": "string" } } }
```

A plain `$.verdict` is refused (`for-each-binding-not-indexed`). It would
type-check against the template's declared shape — one child — and hand you an
array at runtime, which is a mismatch no gate could catch.

## `retry`, `idempotency`, `writes`

```json
{ "id": "post-summary", "job": "post_message",
  "prompt": "Post the summary.",
  "retry": "escalate",
  "idempotency": "summary-2026-q1",
  "writes": ["slack#eng-updates"] }
```

- `retry`: `"none"` (default), `{"bounded": {"attempts": 3}}`, or `"escalate"`.
- `idempotency`: a key that makes a re-run safe. Declare it on anything with an
  external effect.
- `writes`: the sources this node mutates. This is what makes the staleness
  cascade reach other sessions ([beliefs.md](beliefs.md)) — a write nobody
  declared is a divergence nobody can detect.

## Node ids

Content-anchored: `gn_` plus a blake3 over the node's semantic content. Change
what a node *means* and the id changes; change its position and it does not.
That is what makes two sessions planning from the same task converge on the same
ids, and what makes `gr export` diffable in git.

You never write one. `gr plan` prints the mapping from your local names.
