---
title: "Implementation Summary: the router vocabulary repair"
description: "Eleven phrases the router advertised reached nobody, and the packet's own baseline never sampled one of them."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/018-sk-design-parent-v2/011-router-vocabulary-repair"
    last_updated_at: "2026-09-06T20:37:15Z"
    last_updated_by: "claude-code"
    recent_action: "Repaired 9 of 11 dead router phrases"
    next_safe_action: "None open for this phase"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/graph-metadata.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-06-018-sk-design-parent-v2"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 011-router-vocabulary-repair |
| **Completed** | 2026-09-06 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nine phrases the `sk-design` router advertises now reach it. They did not before.

### The finding that nearly became a mistake

55 keywords the router declares are absent from the hub's scoring vocabulary, and 168 across the
fleet. Syncing the two lists is the obvious repair and the wrong one: the router's `INTENT_SIGNALS`
resolves an intent inside a hub already chosen, while `graph-metadata.json` `intent_signals` decides
which hub gets chosen. They are not meant to match.

Probing 14 of the fleet-wide orphans confirmed it: 9 routed correctly without being in `intent_signals`
at all. So the diff is a candidate list, never a defect list, and treating it as one would have added
`padding`, `color` and `shadow` to hub selection.

### The eleven that were real

Probing the router's own declarations found 8 phrases reaching nobody, 2 reaching `sk-doc`, and 1
losing an ordering to `sk-code`. The worst of them was `what should this look like`, present in
`description.json` and in the router's VALUES list, reaching nothing at all. It is the canonical
question the mode exists to answer.

Two of the wrong-hub cases were cutover residue: `sk-doc` still carried `data visualization` and
`data visualisation` in its `intent_signals` after the modes moved.

### What the packet's own baseline did not prove

Every replay in this packet passed while all eleven were broken, because the sixteen-phrase baseline
never sampled any of them. The packet's central claim is narrower than it read: no phrase *in the
baseline* stopped arriving.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-design/graph-metadata.json` | Modified | 17 distinctive phrases, 137 signals to 154 |
| `.opencode/skills/sk-doc/graph-metadata.json` | Modified | Two chart phrases removed, 86 to 84 |
| `.opencode/skills/sk-doc/description.json` | Modified | The same phrase, removed from keywords |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Baseline, probe, repair, re-probe, with the packet's sixteen phrases and the preceding phase's twelve
replayed as controls in the same run. Measured at generation 667 after an explicit rebuild.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Probe each candidate rather than diff the vocabularies | 9 of 14 orphans routed anyway; the diff overstates by five times |
| Add only distinctive multi-word phrases | A bare common word over-triggers hub selection |
| Remove sk-doc's chart residue rather than out-score it | The cutover should have taken it; out-scoring leaves both hubs claiming it |
| Leave two phrases broken and named | A length limit and an ordering contest, neither fixable by adding vocabulary |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Phrase | Before | After |
|--------|--------|-------|
| `what should this look like` | nothing | `sk-design=0.82` |
| `does this look right` | nothing | `sk-design=0.856` |
| `why does this look wrong` | nothing | `sk-design=0.856` |
| `visual audit` | nothing | `sk-design=0.838` |
| `measure this surface` | nothing | `sk-design=0.85` |
| `css extraction` | nothing | `sk-design=0.826` |
| `process diagram` | nothing | `sk-design=0.823` |
| `flow diagram` | nothing | `sk-design=0.829` |
| `data visualization` | `sk-doc=0.878` | `sk-design=0.827`, ahead of `sk-doc` |
| `parallel coordinates` | `sk-doc=0.82` | `sk-design=0.82`, alongside |
| `chart the data` | `sk-design=0.82` | `sk-design=0.85` |

| Control set | Result |
|-------------|--------|
| Sixteen packet phrases | Unchanged |
| Twelve surface phrases | Unchanged |
| Fleet metadata / leaf / derived | 13/13, 13 fresh, 13 fresh |
| `skill_graph_validate` | 0 errors |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`critique this` and `plot this` still reach nobody.** Two-word phrases that do not clear the bar
   even when present in the vocabulary. A length limit, not a membership gap, and adding more
   vocabulary will not move them.
2. **`review this screen` still loses to `sk-code`.** The same pattern as the deck-review case
   recorded in the preceding phase: a design review of a non-code artifact routes to the code skill.
3. **Nothing cross-checks the two vocabularies.** Eleven declared phrases were dead and no gate
   reported it. A checker would have to understand the two-stage split to avoid flagging 44 false
   positives.
<!-- /ANCHOR:limitations -->

---
