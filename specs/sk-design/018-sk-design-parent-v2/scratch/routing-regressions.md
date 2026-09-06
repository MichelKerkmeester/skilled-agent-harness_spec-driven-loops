# Routing, measured before and after each step

`routing-baseline.txt` was captured before any file moved and is the only record of what the fleet
answered beforehand. Every later file in this directory is a replay of the same sixteen phrases.

## What the baseline already showed, before this packet touched anything

`sk-doc` answers short chart phrasings and not task-shaped ones. `create a chart` scores 0.918 and
`sk-create-chart` 0.874, while `make a chart of orders by month`, `flowchart`, `redraw this drawio
diagram` and `ascii flowchart of the approval loop` each return nothing at all. `sk-doc` carries 27
chart and diagram vocabulary strings, `ascii flowchart` among them verbatim.

This is inherited, not caused here, and it is out of scope. It is recorded so nobody later reads a
silent phrase as damage this packet did.

## Regression introduced by the hub conversion, and why it is expected to close

`validate this design.md` scored `sk-design-md-generator=0.8451` at baseline and returns nothing
after the conversion. Consistent across three calls, at a live daemon generation, so it is real.

The cause is signal splitting rather than lost vocabulary. Converting the root created a second
advisor identity carrying design vocabulary, and a weak phrase now divides its score between
`sk-design` and `sk-design-md-generator` so neither clears 0.8. The stronger sibling phrase,
`extract design tokens from stripe.com`, is untouched at 0.9157.

**This is expected to close when the md generator becomes a mode of this hub**, because the two
identities become one and stop competing. That expectation is an obligation, not a hope: it is an
acceptance criterion of that child, and if the phrase still returns nothing after the generator
moves in, the vocabulary needs tuning rather than waiting.

Deliberately not fixed here by trimming keywords, because that tuning would be undone by the very
next step.


## Resolution, measured after the generator became a mode

`validate this design.md` returns `sk-design=0.82`. The regression is closed: it routes again, to
the skill that now owns the generator.

Two scores moved down and neither is a fault. `validate this design.md` went 0.8451 to 0.82 and
`extract design tokens from stripe.com` went 0.9157 to 0.896, because the answering identity changed
from a standalone skill to a hub speaking for two modes. Comparing the two numbers compares
different things. Both clear the 0.8 bar and both reach the owner.

Adding extraction vocabulary to the hub description did not move either score, which says the
residual is a property of the scorer rather than a gap in the vocabulary. Recorded rather than
chased.

Measured at daemon generation 618, rebuilt explicitly after the move, because a replay against a
stale generation proves nothing.

## The inherited weakness turned out to be a one-file fix

The baseline recorded four phrases that reached nobody: `flowchart`, `make a chart of orders by
month`, `redraw this drawio diagram` and `ascii flowchart of the approval loop`. This packet
declared them inherited and out of scope, on the reasoning that `sk-doc` already carried the
vocabulary and it still did not work.

That reasoning was half right. The vocabulary existed, but in the wrong file.

Adding phrases to `description.json` keywords does nothing to the score. It was tried twice, once
for the md generator and once for chart, and neither moved a single number. The advisor reads a
hub's `graph-metadata.json` `intent_signals`, exactly as the routing rules state, and
`description.json` is documentation rather than routing input.

Adding eleven signals there moved all four dead phrases above the bar:

| Phrase | Baseline | After |
|--------|----------|-------|
| `flowchart` | nothing | `sk-design=0.82` |
| `make a chart of orders by month` | nothing | `sk-design=0.8277` |
| `redraw this drawio diagram` | nothing | `sk-design=0.82` |
| `ascii flowchart of the approval loop` | nothing | `sk-design=0.821` |

So the corpus-wide long-phrase weakness is probably not a scorer threshold problem at all. It is
vocabulary sitting in a file the scorer does not read. That is worth checking across the fleet
before anyone writes a packet to tune thresholds.


## The final replay, taken from the closing state

Measured at daemon generation 638, after an explicit rebuild that moved the generation from 632.
`routing-after-005.txt` beside this file is the full sixteen-phrase result.

**No phrase reaches nobody.** Four that reached nobody at the baseline now route, and the three
`sk-doc` controls are byte-identical to the baseline: `write a readme for this package` at 0.95,
`build a feature catalog` at 0.82, `create a repo rule file` at 0.9405.

Four phrases score numerically lower than their baseline, and every one of them changed owner:

| Phrase | Baseline | Final | What changed |
|--------|----------|-------|--------------|
| `create a chart` | `sk-doc=0.918` | `sk-design=0.8461` | owner moved with the mode |
| `sk-create-chart` | `sk-doc=0.8744` | `sk-design=0.82` | owner moved with the mode |
| `extract design tokens from stripe.com` | `sk-design-md-generator=0.9157` | `sk-design=0.9026` | standalone identity merged into the hub |
| `validate this design.md` | `sk-design-md-generator=0.8451` | `sk-design=0.82` | standalone identity merged into the hub |

Comparing those pairs compares two different identities, which is the same correction phase 003
recorded. The substantive test is whether the phrase reaches the skill that owns the work, and in
all four it does.

## Two dangling graph edges were changing scores, silently

The closing rebuild reported `rejectedEdges: 4`, which no earlier step had read. Phase 003 folded the
md generator's sibling edges into the hub by concatenation, without retargeting or deduplication, so
four edges named a skill that no longer exists:

- `mcp-tooling` → `sk-design-md-generator`
- `sk-communication` → `sk-design-md-generator`
- `sk-design` → `sk-design-md-generator`
- `sk-design` → `sk-design`, a self-loop created when the generator's own edge to the hub was folded
  into the hub itself

`skill_graph_validate` reported `isValid: true` throughout, because the builder drops a dangling edge
at build time. The graph was clean; the sources were not. **A validator that reads the built artefact
cannot see a defect the build silently repairs**, so phase 003's criterion "no dangling edges" was
true of the graph and false of the metadata that produces it.

Retargeting the two external edges to `sk-design` and removing the hub's two self-referential ones
took `rejectedEdges` to 0 and raised the indexed edge count from 50 to 52. It also moved two scores:

| Phrase | After phase 004 | After the edge repair |
|--------|-----------------|----------------------|
| `extract design tokens from stripe.com` | `sk-design=0.896` | `sk-design=0.9026` |
| `redraw this drawio diagram` | `sk-design=0.82` | `sk-design=0.8252` |

So the rejected edges were not inert. They were costing score on exactly the phrases the merge was
supposed to help, and nothing in the packet would have caught it: the routing replay passed, the
graph validator passed, and only the rebuild's own warning stream named the problem.

## A dead bundle rule was costing score too, and it blocked the push

The pre-push route gate refused both branches: `sk-doc  inputs-do-not-compile`. The hub's compiled
routing could not be rebuilt at all, so the gate could not re-mint it.

The cause was a hardcoded supplemental bundle rule in sk-doc's own registry compiler pairing
`sk-create-quality-control` with `sk-create-diagram`. That pairing stopped existing when the diagram
mode moved to the design hub, and the compiler fails closed rather than emit a route that can never
fire: `bundleRules[1] references missing mode sk-create-diagram`.

Nothing in the packet had surfaced it. The advisor answered normally, every hub gate passed, and the
compiled-routing guard is not part of the gate sweep — it runs on push. A hub can serve legacy routing
for as long as nobody pushes.

Removing the rule, refreshing the manifest and resyncing the authored copy took the guard to
`sk-doc  fresh`. Rebuilding at generation 642 moved three more scores, all upward and none owner-changing:

| Phrase | Before the fix | After |
|--------|---------------|-------|
| `make a chart of orders by month` | `sk-design=0.8277` | `sk-design=0.8282` |
| `extract design tokens from stripe.com` | `sk-design=0.9026` | `sk-design=0.9068` |
| `create a repo rule file` | `sk-doc=0.9405` | `sk-doc=0.9424` |

The last one is a `sk-doc` control that had matched its baseline exactly through every earlier replay.
It is now above it. A dead cross-hub rule was costing score on a phrase in the hub that still owned it.

This is the same fact as the four blocked FLOWCHART fixtures: sk-doc used to own both modes, and the
places that encoded the pairing did not all move with the mode. The compiler is fixed because it
blocked delivery; the fixtures still need the decision recorded in this phase's decision record.
