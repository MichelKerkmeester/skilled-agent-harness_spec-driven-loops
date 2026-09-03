---
title: "What the append-site checker's green actually means"
trigger_phrases: []
---
# What the append-site checker's green actually means

## The recorded state was stale, and stale in the direction that flatters

Two items recorded that `check-protocol-append-sites.cjs` "currently exits 2 on two real violations,
so the tree is not yet clean". Re-run:

    {"ok":true,"scanned":16,"violations":[],"info":[]}   exit 0

The tree is clean *by that checker*. But reading the green as compliance with the requirement would
be wrong, and the difference is the whole point of these two items.

## What the checker enforces

It enforces **declaration**, not **retirement**. An append site passes when it is declared under the
asset's `state_write_protocol` block and the declared count matches the sites found. A site that is
honestly declared and still writes directly to the state file passes.

That is a useful property — it makes an undeclared or uncounted append fail — and it is not the
property the requirement names. The requirement is that no reachable direct-append code path exists.

## Measured census

Every deep workflow asset, counted directly rather than inferred from the checker's verdict:

| asset | declared append directives |
| ----- | -------------------------: |
| `deep-research-confirm.yaml` | 22 |
| `deep-research-auto.yaml` | 19 |
| `deep-review-confirm.yaml` | 15 |
| `deep-review-auto.yaml` | 8 |
| `deep-alignment-confirm.yaml` | 3 |
| `deep-alignment-auto.yaml` | 2 |
| `deep-agent-improvement-auto.yaml` | 1 |
| `deep-agent-improvement-confirm.yaml` | 1 |
| `deep-ai-council-auto.yaml` | 1 |
| `deep-ai-council-confirm.yaml` | 1 |
| `deep-model-benchmark-auto.yaml` | 1 |
| `deep-model-benchmark-confirm.yaml` | 1 |
| **total** | **75** |

Beyond the directives, four assets embed executable JavaScript that calls `appendFileSync` on the
state log directly — eight call sites, excluding the import statements that bring the symbol in:

| asset | call sites |
| ----- | ---------: |
| `deep-research-auto.yaml` | 3 |
| `deep-alignment-auto.yaml` | 2 |
| `deep-review-auto.yaml` | 2 |
| `deep-research-confirm.yaml` | 1 |

These are the reachable direct-append code paths the requirement forbids. They are declared. None is
retired.

## Why retirement is not merely wiring

Redirecting these sites through the gateway needs each row shape to be one the gateway accepts. The
seam that translates legacy-shaped rows covers one of the fifteen shapes the research workflow emits;
the rest refuse by name, and the refusals are deliberate rather than accidental — a pinned set keeps
events on the old path because no canonical stem exists for them.

So the honest statement is not "two violations remain". It is that seventy-five directives and eight
executable call sites remain, that the checker's green certifies they are declared rather than gone,
and that retiring them needs event stems that do not exist yet.
