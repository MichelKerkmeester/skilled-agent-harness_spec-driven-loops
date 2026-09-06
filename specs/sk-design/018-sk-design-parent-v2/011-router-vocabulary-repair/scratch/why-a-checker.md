# Why this needed a checker rather than a careful read

The manual probe in this phase sampled fifteen of the router's declarations and
found eleven broken. It missed four more.

`ci-router-vocabulary-reach.cjs` probes every multi-word phrase a router declares
and asks whether it reaches the hub declaring it. Run against `sk-design` it found
`data viz`, `heat matrix`, `heat map` and `decision branch` reaching other hubs,
none of which the fifteen-phrase sample contained.

Three of those four were still cutover residue. `sk-doc` carried six chart form
names in its `intent_signals`: `treemap`, `histogram`, `data viz`, `heat matrix`,
`heat map` and `parallel coordinates`. The earlier pass through this phase removed
only `data visualization` and `data visualisation`, because it filtered the signal
list by keyword rather than reading it. A filter for `chart`, `diagram` and
`heatmap` does not match `heat matrix`, and nothing in `treemap` or `histogram`
says chart at all.

That is the case for a probe over a read. A keyword filter encodes what you already
suspect; the probe asks the system.

## What the check does and does not fail on

Two failures wear the same symptom and need different treatment.

**wrong-hub** means something else owns a phrase this hub advertises. That is a
routing defect and it fails the check.

**no-reach** means the phrase reaches nobody, and for these it is almost always
length: `font size`, `corner radius`, `critique this`, `decision tree`. Two and
three-word fragments do not clear the bar however they are declared, and no amount
of vocabulary changes that. Reported for a human to judge, never failed on, because
a check that fails on ten unfixable rows stops being run.

## What is left

`decision branch` returns `sk-git=0.9452`. "Branch" is a git word and the collision
is real rather than a gap. Winning it means changing a hub this packet does not own,
which is the same call made for the deck-review case.
