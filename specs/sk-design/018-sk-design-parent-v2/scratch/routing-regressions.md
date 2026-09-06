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
