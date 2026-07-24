# Amendment review — GPT-5.6-SOL (ultra / fast, via cli-codex)

Decision-first verdict on the ADR-001 selection-fix mechanism. Read-only advisory.

> **Verdict: Land A now with divergence telemetry; ranking A > B > C.**

1. **A establishes one runtime authority.** B preserves split-brain semantics and an arbitrary cap. C is brittle tuning and still cannot fix the empty-hub full-inventory case.
2. A does not undermine the hub; it clarifies roles: surface routing governs delivery, while hub intent remains independently scored telemetry. It only masks hub errors if divergence stops being reported. Enforce:
   `workflowModes == orderedUnique(pairs[*].workflowMode)`, capped at two.
   Hub intents must remain separately exposed and never advertised as loaded contract modes.
3. **Land now.** This is contract-wiring correctness, not evidence that the fitted surface router generalizes. Build a held-out corpus next, before claiming routing-quality improvement.
4. **End-state:** one authoritative intent→leaf decision producing both modes and resources from one taxonomy. Keep the hub temporarily as shadow telemetry; delete it unless it demonstrates independent value. Two independent classifiers must not jointly govern one contract.
5. **Biggest risk:** an overfitted surface router can now produce a wrong-but-internally-coherent contract without the hub blocking it.

**Correction SOL added in its verification pass:** raw `observedResources` stay non-empty; the canonical typed `resourceContract.pairs` are what drop to zero. The previously-ratified "intersect with hub modes" decision is already what the code does, so repeating it cannot repair the bug.
