---
title: "Decision Record: Perfect skill routing across the fleet"
description: "The four decisions that shaped the routing repair: what stayed out of scope, why the generator merges, why the gate landed first, and why the confidence bar was never touched."
trigger_phrases:
  - "decision record"
  - "adr"
  - "routing decisions"
  - "scope boundary"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Perfect skill routing across the fleet

---

<!-- ANCHOR:adr-001 -->
## ADR-001: The scorer stays out of scope

**Status**: Accepted

**Context**: Two of the ranked recommendations from the research are scorer changes. The lexical lane computes its score over `intentSignals` and `keywords` but harvests evidence only from `{id, name, description, domains}`, so a candidate can reach confidence 0.82 with no evidence, take the no-evidence uncertainty default of 0.42, and be deleted by the 0.35 surfacing gate. Cross-hub arbitration would replace a hand-written bonus ladder with a general rule.

**Decision**: Neither is attempted in this packet.

**Rationale**: Both change how every candidate in the fleet scores, not just the phrases in question. A responsible landing needs a measured before-and-after over all 439 declared phrases plus the advisor's own regression corpus, and the vocabulary fix may make most of the lexical change unnecessary by moving those matches into the explicit lane, which already emits evidence. Measuring first is cheaper than reverting a fleet-wide scoring change.

**Consequence**: The 18 residual cross-hub disputes stay open. They are recorded and attributed rather than left as an unexplained gap.

---

<!-- /ANCHOR:adr-001 -->

<!-- ANCHOR:adr-002 -->
## ADR-002: The generator merges and never replaces

**Status**: Accepted

**Context**: A hub's stage-one `intent_signals` could plausibly be treated as derived from its router's declared vocabulary, which would make regeneration the natural design.

**Decision**: Router-declared phrases are appended to the authored list. Nothing is removed, reordered or rewritten.

**Rationale**: That list is authored and curated. `sk-design` alone carries 159 entries, and only 23 of them come from its router. A regenerating design would have discarded 136 hand-tuned signals on first run, and the loss would have shown up as routing regressions with no obvious cause. Appending also keeps the diff readable and the authored order, which carries intent a sort would flatten.

**Consequence**: The generator cannot remove a phrase a router has stopped declaring. That is a real limitation and the right trade: a stale extra signal is recoverable, a deleted curated one is not.

---

<!-- /ANCHOR:adr-002 -->

<!-- ANCHOR:adr-003 -->
## ADR-003: The gate is fixed before the defect

**Status**: Accepted

**Context**: The obvious order is to fix routing and then improve the measurement.

**Decision**: Rank-based checking landed before the vocabulary generator, not alongside it.

**Rationale**: A controlled test settled it. Adding `decision branch` to its declaring hub moved that hub from absent to rank two, behind an unchanged incumbent at 0.9451. Under the old presence-based predicate that phrase would have counted as a **pass** the moment the generator ran, because the hub was now above the bar while still losing. The fix would have improved the reported metric while routing stayed exactly as wrong, and the improvement would have been undetectable.

**Consequence**: The wrong-hub count rose from 19 to 37 before any repair landed. That was expected and is the honest baseline.

---

<!-- /ANCHOR:adr-003 -->

<!-- ANCHOR:adr-004 -->
## ADR-004: The confidence bar is not lowered

**Status**: Accepted

**Context**: Many failing phrases sit just under the 0.8 bar, and lowering it would move a large number of them at once.

**Decision**: The bar stays at 0.8. Neither the 0.35 uncertainty gate nor the 0.42 no-evidence default is moved either.

**Rationale**: Lowering a threshold does not make a candidate correct, it makes more candidates surface, so it trades a phrase that reaches nobody for a phrase that reaches the wrong hub. The second failure is worse because it is confidently wrong rather than silently absent. The same reasoning rules out fixing the lexical lane by moving 0.42 or 0.35 rather than by harvesting evidence correctly, which is why ADR-001 specifies a correctness fix.

**Consequence**: The residue cannot be closed by tuning. It needs arbitration, which is the point of ADR-001.


<!-- /ANCHOR:adr-004 -->