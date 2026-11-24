---
title: "Timeline: Narrow the advisor's shared lexical anchor so two generic words no longer lift a skill to the task-intent floor"
description: "Level-agnostic chronological record of events, outcomes and milestones."
trigger_phrases:
  - "lexical anchor narrowing timeline"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: timeline | v2.2 -->
# Timeline: Narrow the advisor's shared lexical anchor so two generic words no longer lift a skill to the task-intent floor

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> How the lexical anchor candidates were measured and why none landed.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the timeline id, the date and the owner. GOOD: TL-001, 2026-10-24, conductor. WEAK: TBD. -->

**Subject:** Advisor lexical anchor narrowing
**Status:** In Progress
**Started:** 2026-11-24
**Last updated:** 2026-11-24
**Owner:** Claude, for the operator
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:timeline -->
## 2. TIMELINE
<!-- FILL: Put each event in date order with its evidence. GOOD: 2026-10-24: `--keep` merged. `ls logs/archive | wc -l` printed 3. WEAK: Events happened. -->

List events in order. For each, give the date, what happened, then what it led to. Use prose, not a table.

**2026-11-24:** The packet opened with five probe prompts that lift unnamed skills to 0.82. Outcome: the operator asked to build it (Q011).

**2026-11-24:** Three candidate rules fixed the probes and held the ratchet, but each moved pinned command and doctor rows. Outcome: the operator chose record and stop (Q012).

**2026-11-24:** The operator asked for a fresh attempt (Q013). Candidate E kept the 0.45 score, added a distinctive-word test, and counted a typed command as naming its owner. Outcome: no pin moved, two of five lifts gone, released as advisor 2.0.4.0.
<!-- /ANCHOR:timeline -->

---

<!-- ANCHOR:milestones -->
## 3. MILESTONES
<!-- FILL: Name each milestone and whether it passed. GOOD: M1 passed. 3 archives left. WEAK: Milestones met. -->

**A rule that holds every pin:** target 2.0.4.0. Status: Done. Evidence: the full suite on the final code.

**All five probe lifts cleared:** target a later attempt. Status: Planned. Evidence: candidate C in `scratch/` clears them but moves pins.
<!-- /ANCHOR:milestones -->
