---
title: "Goal: prove the restructure from its final state"
description: "Replay the baseline, rebuild the daemon, reconcile every document that still describes the old shape, and close the packet."
importance_tier: important
contextType: reference
version: 1.0.0.0
_memory:
  continuity:
    packet_pointer: "sk-design/018-sk-design-parent-v2/005-closure-and-routing-proof"
    last_updated_at: "2026-09-06T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the closure directive; the replay has not been run from the final state"
    next_safe_action: "Rebuild the advisor daemon, replay the sixteen phrases, compare against the baseline"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/ROUTER.md"
      - ".opencode/skills/sk-design/graph-metadata.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-06-018-sk-design-parent-v2"
      parent_session_id: null
---

# Goal: closure and routing proof

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->

**Inherits the parent `goal.md`. Where this file and that one disagree, that one wins.**

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

Every claim this packet makes matches what the fleet does, measured from the final state.

### Decisions

**Reconcile what now lies.** Two canon tables name the old fleet shape: the root-metadata contract's
fleet list, and the nested-packets note. `016`'s spec is superseded in part and should say so from
its own side. Any document still describing `sk-design` as standalone or `sk-doc` as the home of
chart and diagram is wrong and is this phase's to fix.

### Operator copy

Prove the routing from the final state, then make every document agree with it.
<!-- /ANCHOR:directive -->

<!-- ANCHOR:binding -->
## 2. BINDING

### Proof, in this order

1. Rebuild the advisor daemon and observe its generation number move. A green replay against a stale
   daemon proves nothing, and the rebuild is never chained automatically.
2. Replay all sixteen baseline phrases from the final state. No phrase below its baseline. Chart and
   diagram naming `sk-design`. The two `sk-doc` controls unchanged. The two traps still not captured.
3. Both hub gates, the fleet metadata gate, `skill_graph_validate`, the compiled-routing guard, and
   the chart corpus checker.
4. `validate.sh --strict` across this packet and the relocated chart packet.

Structural validation does not read for content. Nothing may claim completion on a document that
still carries template prose, so check that by reading.
<!-- /ANCHOR:binding -->

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

| # | Criterion | How it is proven |
|---|-----------|------------------|
| 1 | The daemon actually rebuilt | Its generation number observed to move |
| 2 | No phrase below baseline | Sixteen-phrase replay against `scratch/routing-baseline.txt` |
| 3 | Every gate green from the final state | Each gate's own `RESULT: PASSED` line, read not inferred |
| 4 | Packet validates | `validate.sh --strict` across this packet and the relocated chart packet |
| 5 | No document still describes the old shape | The two canon tables and `016`'s spec reconciled |
| 6 | Every criterion resolved | `Met`, `Waived` or `Superseded` with observed evidence |
<!-- /ANCHOR:completion -->

<!-- ANCHOR:log -->
## 4. LOG

### Progress

Open. Steps 1 to 4 of the packet are done; this phase has not run.

### Deviations and findings

None yet.
<!-- /ANCHOR:log -->
