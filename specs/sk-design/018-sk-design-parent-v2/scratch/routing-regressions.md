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
