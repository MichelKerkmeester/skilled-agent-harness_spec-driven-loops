# Reviewing the plan

`gr check` proves structure. It cannot judge decomposition. Review nodes close
that gap, and they run **inside the graph** — so the review is a recorded
artifact with outputs, not a paragraph you wrote and forgot.

Graphene has no model. **You** run these lenses.

## Instantiate

Copy `templates/review-subgraph.json` into your plan after `gr plan` and before
you present anything. `gr status` will say `review` while any lens — **or the
merge node that owns their findings** — is still outstanding.

Review nodes are claimable while the graph is `checked` — ordinary work is not.
That is deliberate: the review has to happen before the run starts.

```
gr claim <review-node> --graph <g>
gr done <review-node> --graph <g> --output '{"findings":[…]}'
```

## The six lenses

Run each as its own node with its own fresh reading of the plan. A single pass
asking "is this plan good?" produces one answer shaped by whatever you noticed
first.

**granularity** — Does any node do more than one thing? Say what each node does
in one sentence with no "and". Where you cannot, that is the finding.

**dependency** — For every edge: does the downstream node actually read the
upstream node's output? An edge with no binding and no other justification is
fake, and it serialized work that could have run in parallel.

**gate-placement** — For every irreversible capability, is there a human node on
every path? And separately: can the person at that gate actually evaluate what
they are approving, with what `--context` gives them? A gate before the artifact
exists is theatre.

**completeness** — What does this plan assume exists that no node produces? The
premise nobody fetched is the one that fails silently three nodes in.

**stop-rule** — Does any fan-out cover work that does not split? Do two parallel
branches share an implicit assumption that should be a node? This is the lens
that catches the 39–70% loss.

**failure** — For each node: what happens if it fails? Which failures should stop
the graph, and which should route to a different path? A plan with no answer here
has one answer by default — stop everything.

## Findings

A lens reports findings as its declared output, and `gr done` turns each one
into a real finding you can resolve. `target` must name a node in the plan.

```json
{
  "findings": [
    {
      "target": "draft-and-send",
      "severity": "error",
      "body": "Does two things: drafts copy and sends it. The send is irreversible and cannot be gated separately while they share a node.",
      "suggestion": "Split into draft-copy and send-copy, gate between them."
    }
  ]
}
```

A finding targeting a node that does not exist is refused — one that cannot be
applied would hold the graph forever. A lens with nothing to say returns
`{"findings": []}`.

Then resolve every one:

```
gr findings <graph> --open
gr finding <gf_…> --graph <g> --resolution applied --reason "split into two nodes"
gr finding <gf_…> --graph <g> --resolution rejected --reason "the gate is correct; the reviewer missed the human node on the other path"
```

`gr status` returns `resolve-findings` while any are open. An unresolved finding
is not a note — **it holds the graph.**

Rejecting is legitimate. Rejecting silently is not: `--reason` is required, and
it is what a person reads when they ask why the plan looks like this.

## Then

`gr check` again — you changed the plan — and `gr status` moves to
`present-to-user`. Show the plan and **wait**.
