---
title: "Goal: prove the restructure from its final state"
description: "Replay the baseline, rebuild the daemon, reconcile every document that still describes the old shape, and close the packet."
importance_tier: important
contextType: reference
version: 1.0.0.0
---

# Goal

Every claim this packet makes matches what the fleet does, measured from the final state.

**Inherits the parent `goal.md`. Where this file and that one disagree, that one wins.**

## Proof, in this order

1. Rebuild the advisor daemon and observe its generation number move. A green replay against a stale
   daemon proves nothing, and the rebuild is never chained automatically.
2. Replay all sixteen baseline phrases from the final state. No phrase below its baseline. Chart and
   diagram naming `sk-design`. The two `sk-doc` controls unchanged. The two traps still not captured.
3. Both hub gates, the fleet metadata gate, `skill_graph_validate`, the compiled-routing guard, and
   the chart corpus checker.
4. `validate.sh --strict` across this packet and the relocated chart packet.

## Reconcile what now lies

Two canon tables name the old fleet shape: the root-metadata contract's fleet list, and the
nested-packets note. `016`'s spec is superseded in part and should say so from its own side. Any
document still describing `sk-design` as standalone or `sk-doc` as the home of chart and diagram is
wrong and is this phase's to fix.

## Done

All criteria `Met`, `Waived` or `Superseded` with observed evidence. Metadata regenerated. Nothing
claiming completion on a document that still carries template prose: structural validation does not
read for content, so check by reading.
