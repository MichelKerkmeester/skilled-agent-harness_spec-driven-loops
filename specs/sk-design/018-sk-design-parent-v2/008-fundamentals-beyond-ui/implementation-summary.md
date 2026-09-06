---
title: "Implementation Summary: fundamentals beyond UI"
description: "Three surfaces that reached nobody now route, the canvas modes kept every phrase, and one ordering contest is recorded rather than won."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/018-sk-design-parent-v2/008-fundamentals-beyond-ui"
    last_updated_at: "2026-09-06T16:22:21Z"
    last_updated_by: "claude-code"
    recent_action: "Broadened fundamentals to five named surfaces"
    next_safe_action: "None open for this phase"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/sk-design-fundamentals/SKILL.md"
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
| **Spec Folder** | 008-fundamentals-beyond-ui |
| **Completed** | 2026-09-06 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`sk-design-fundamentals` now serves five named surfaces instead of reading as a screen-only skill.

### How UI-bound it was

46 UI-specific mentions against 1 non-UI. The H1 read `Visual UI Design`, the description said it
"designs, builds and reviews UI", and the keyword block was entirely screen vocabulary. A question
about a slide deck either missed the skill or arrived to find advice written for a component.

### What is actually shared

Reading the contract rather than assuming from names: only two of its six references are genuinely
screen-only. `interaction-craft.md` covers focus rings, hover and touch targets. `motion-principles.md`
covers animation a printed page cannot have. The spacing scale, type scale, colour ramp, hierarchy
pyramid, build procedure and review checklist all decide a slide, a printed page and a report layout
as much as they decide a component.

The contract now carries a five-row table naming each surface, which systems apply, what changes, and
what does not apply at all. A deck question gets the systems and is told to skip the focus rings.

### Where the vocabulary went

`intent_signals` in the hub's `graph-metadata.json`, 120 entries to 137. That is the only vocabulary
surface the advisor reads, measured twice earlier in this packet. The router's own VALUES and REVIEW
keyword lists were extended in the same change so the two cannot drift.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-design/sk-design-fundamentals/SKILL.md` | Modified | H1, description, opening, surfaces table, hierarchy framing, keyword block |
| `.opencode/skills/sk-design/graph-metadata.json` | Modified | 17 `intent_signals` for slide, print and document layouts |
| `.opencode/skills/sk-design/ROUTER.md` | Modified | VALUES and REVIEW keyword lists kept in step |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Baseline first, because vocabulary changes cannot be undone for measurement purposes. Then the
contract, then the vocabulary, then a rebuild at generation 666 and a replay of both the twelve
surface phrases and the packet's sixteen.

The controls were replayed in the same run as the new phrases rather than afterwards. Adding
vocabulary is easy; the risk is stealing a phrase that already routed correctly.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Broaden one mode rather than fork a second | The systems are shared; a fork would duplicate four of them to differentiate two references |
| Say what differs per surface, not only what is shared | "Design applies everywhere" is true and useless for laying out a slide |
| Vocabulary into `intent_signals` | Keywords in `description.json` move no advisor score, measured twice in this packet |
| Leave the deck-review ordering alone | Winning it means changing a hub this phase does not own |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Phrase | Baseline | After |
|--------|----------|-------|
| `how should this slide be laid out` | nothing | `sk-design=0.9059` |
| `margins for a print layout` | nothing | `sk-design=0.8962` |
| `document layout hierarchy` | nothing | `sk-design=0.9112` |
| `type scale for a printed report` | `sk-design=0.858` | `sk-design=0.95` |
| `presentation deck spacing` | `sk-design=0.82` | `sk-design=0.9059` |
| `create a chart` (control) | `sk-design=0.8461` | unchanged |
| `make a diagram` (control) | `sk-design=0.82` | unchanged |
| `flowchart` (control) | `sk-design=0.82` | unchanged |
| `what padding should this have` (control) | `sk-design=0.82` | unchanged |
| `contrast ratio failure on this button` (control) | `sk-design=0.95` | unchanged |

| Gate | Result |
|------|--------|
| Sixteen-phrase packet set | Three cells moved, no owner changed, nothing below baseline |
| Fleet metadata audit | 13/13, both hubs class H |
| Leaf-manifest / derived freshness | 13 fresh / 13 fresh, 0 stale |
| `skill_graph_validate` | 0 errors |
| Root-router contract | 0 issues |
| Playbook topology, sk-design | `valid=4 blocked=0` |
| Compiled-routing guard | All hubs fresh |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A design review of a slide deck routes to `sk-code` first.** 0.9379 against this hub's 0.9107.
   The phrase reaches this hub above the bar, so the requirement holds, but the ordering does not go
   this way. It persists across rephrasings and inverts when the review verb is dropped, so `sk-code`
   carries strong review vocabulary and the phrase is genuinely ambiguous between reviewing an
   artifact and reviewing the code that renders it.
2. **The surfaces table is a maintenance surface.** A new reference has to be classified as shared or
   screen-only, and nothing enforces that.
3. **Only the named surfaces are covered.** Email, dashboards and data-dense reports were left
   unnamed rather than guessed at; whether they are separate surfaces or variants of the three is an
   open question in the spec.
<!-- /ANCHOR:limitations -->

---
