---
title: "Goal: fundamentals covers every surface, not only UI"
description: "The durable directive this phase executes against, and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/018-sk-design-parent-v2/008-fundamentals-beyond-ui"
    last_updated_at: "2026-09-06T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Broadened fundamentals to five named surfaces"
    next_safe_action: "None open; the deck-review ordering is recorded for another owner"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/ROUTER.md"
      - ".opencode/skills/sk-design/graph-metadata.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-06-018-sk-design-parent-v2"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Goal: fundamentals covers every surface, not only UI

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->

**Inherits the parent `goal.md`. Where this file and that one disagree, that one wins.**

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

A design question about any surface reaches fundamentals and finds guidance written for that surface.

### Decisions

**Broaden, do not fork.** The judgment fundamentals carries — hierarchy, spacing, type scale, colour,
restraint — is not UI-specific. A separate slide-deck or print mode would duplicate it. Name the
surfaces the one mode serves and say what differs between them.

**Vocabulary goes in `intent_signals`.** Keywords in `description.json` move no advisor score. That
was measured twice in this packet, not assumed.

**Say what differs, not only what is shared.** Surface-agnostic framing that stops being specific
stops being useful. Each named surface needs its own answer to what changes.

### Operator copy

Fundamentals serves slide decks, print and document layouts as well as it serves screen UI.
<!-- /ANCHOR:directive -->

<!-- ANCHOR:binding -->
## 2. BINDING

1. **Capture a baseline for the new surface phrases before editing any vocabulary.** It cannot be
   recaptured.
2. **Replay chart and diagram phrases as controls.** Broader fundamentals vocabulary can pull a
   canvas phrase off the mode that owns it, and that is the main risk here.
3. **Do not restore what `016` retired.** The design-taste layer stays gone.
4. **A phrase that still reaches nobody is an open gap,** reported as such rather than tuned until
   the number moves.
<!-- /ANCHOR:binding -->

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

| # | Criterion | How it is proven |
|---|-----------|------------------|
| 1 | The surfaces are named | The fundamentals contract lists them and says what differs per surface |
| 2 | Non-UI surfaces route | A slide-deck, a print and a document-layout phrase each reach `sk-design` above the bar |
| 3 | Nothing regressed | All sixteen baseline phrases hold at or above their recorded scores |
| 4 | Canvas boundaries hold | A chart phrase still reaches chart, a diagram phrase still reaches diagram |
<!-- /ANCHOR:completion -->

<!-- ANCHOR:log -->
## 4. LOG

### Progress

Done. Five surfaces named with what differs between them, 17 `intent_signals` added, and three
previously-dead surface phrases now route. Every control held.

### Deviations and findings

- **Only two of six references are genuinely screen-only.** `interaction-craft.md` and
  `motion-principles.md`. The spacing scale, type scale, colour ramp, hierarchy pyramid, build
  procedure and review checklist all carry to a slide, a printed page and a document layout. The
  contract had never said so.
- **Widening the vocabulary cost nothing on the canvases.** Chart, diagram and flowchart phrases were
  replayed in the same run as the new ones and came back identical, which was the main risk.
- **A design review of a slide deck still routes to `sk-code` first.** 0.9379 against this hub's
  0.9107. It holds across rephrasings and inverts when the review verb is dropped, so `sk-code`
  carries strong review vocabulary and the phrase is genuinely ambiguous between reviewing an artifact
  and reviewing the code that renders it. Recorded rather than fixed, because fixing it means changing
  a hub this phase does not own.
- **Two phrases that already worked got better.** `type scale for a printed report` went 0.858 to
  0.95 and `presentation deck spacing` 0.82 to 0.9059. Naming a surface helps phrases that were
  already scraping past the bar, not only the ones that were failing.
<!-- /ANCHOR:log -->
