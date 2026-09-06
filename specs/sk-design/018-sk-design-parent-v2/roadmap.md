---
title: "Roadmap: reinstating sk-design as a parent hub"
description: "What ships in what order, what each step breaks while it is mid-flight, and what proves it fixed. Execution order is not the folder numbering, and the difference is deliberate."
importance_tier: important
contextType: reference
version: 1.0.0.0
---

# Roadmap

## The shape of the work

`sk-design` was a hub until 19 August 2026 and was dismantled on purpose. This packet reinstates it
with four modes instead of two, and the whole job is a routing change wearing a file move. Every
step therefore ends the same way: a request is replayed and either arrives or does not.

## Order

Folder numbers read in a sensible order. Work runs in another, because each step must land on a
tree the previous one left green.

| # | Phase | Status | What it breaks mid-flight | What proves it fixed |
|---|-------|--------|---------------------------|----------------------|
| 1 | `002-hub-and-fundamentals` | **Done** `112d5471f4` | The root has no SKILL.md between move and author, so it lands as one commit | Fleet gate class H pass; two design phrases at baseline |
| 2 | `003-md-generator-as-mode` | Open | The generator's own identity files must go, or the root reports a nested identity; `/design:extract` and the design agent hold dead paths until rewritten | Both hub gates; `skill_graph_validate` clean; the generator's own tests from the new path; **the regression 002 introduced must close** |
| 3 | `004-chart-and-diagram-cutover` | Open | A router signal whose packet is not on disk fails whichever hub is wrong, so both hubs are edited in one commit | Both parent-skill checks; chart phrases naming sk-design and sk-doc no longer claiming them; the chart corpus checker from its new location |
| 4 | `001-sk-create-chart` | Open | 219 files carry the old pointer until repaired; the trigger index is stale until regenerated | `validate.sh --strict` on the moved packet; pointer sweep clean |
| 5 | `005-closure-and-routing-proof` | Open | Nothing | The sixteen-phrase baseline replayed from the final state, and a daemon generation that moved |

## Two things carried forward, not resolved

**A regression this packet owns.** `validate this design.md` scored 0.8451 to the md generator at
baseline and returns nothing since the hub conversion, because two identities carrying design
vocabulary split a weak phrase. It is expected to close in step 2 when they merge, and that is an
acceptance criterion there rather than a hope.

**A weakness this packet inherits and does not own.** `sk-doc` answers `create a chart` at 0.918 and
answers `make a chart of orders by month`, `flowchart` and `ascii flowchart of the approval loop`
with nothing, while carrying 27 chart and diagram vocabulary strings. Recorded so no later reader
mistakes it for damage done here. Fixing it is its own packet.

## The depth cost of step 4

The chart packet is 299 directories and already nests three levels deep. Moving it under this
parent makes five. No rule forbids it and the operator has ruled to proceed; it is recorded here
because legibility is the cost, and `001` is a relocated subtree rather than authored work.
