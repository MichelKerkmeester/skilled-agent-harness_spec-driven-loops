---
title: "Goal: a phrase the router declares reaches the hub"
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
    packet_pointer: "sk-design/018-sk-design-parent-v2/011-router-vocabulary-repair"
    last_updated_at: "2026-09-06T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Repaired 9 of 11 dead router phrases and removed sk-doc's residual chart vocabulary"
    next_safe_action: "None open; two phrases remain, both recorded with their cause"
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

# Goal: a phrase the router declares reaches the hub

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->

**Inherits the parent `goal.md`. Where this file and that one disagree, that one wins.**

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

A phrase the router declares reaches the hub, or is not declared.

### Decisions

**The two vocabularies do different jobs.** A router's `INTENT_SIGNALS` resolves an intent inside a
hub already chosen; a hub's `graph-metadata.json` `intent_signals` decides which hub gets chosen. So
55 differences between them are not 55 defects, and a bare common word belongs in the first and not
the second. Probe each candidate; never diff the lists and call the delta a bug.

**Only distinctive multi-word phrases go in.** `padding`, `color` and `shadow` would over-trigger hub
selection.

### Operator copy

Nine dead phrases fixed, including the canonical design question, and sk-doc stops claiming chart vocabulary.
<!-- /ANCHOR:directive -->

<!-- ANCHOR:binding -->
## 2. BINDING

1. Capture a baseline before editing; it cannot be recaptured.
2. Replay the packet's sixteen phrases and the surface set as controls, in the same run.
3. Add nothing that is a bare common word.
4. A phrase that improves but still loses an ordering is reported as improved, never as fixed.
<!-- /ANCHOR:binding -->

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

| # | Criterion | How it is proven |
|---|-----------|------------------|
| 1 | Dead phrases route | At least 9 of 11 reach `sk-design` above the bar |
| 2 | Chart vocabulary returns home | `data visualization` names `sk-design` ahead of `sk-doc` |
| 3 | No regression | Sixteen-phrase set and surface set both unchanged |
| 4 | Residue named | Anything still broken carries its cause |
<!-- /ANCHOR:completion -->

<!-- ANCHOR:log -->
## 4. LOG

### Progress

Done. 17 phrases added to sk-design, 2 removed from sk-doc; 9 of 11 fixed at generation 667.

### Deviations and findings

- **The packet's own baseline never contained these phrases.** Every replay in this packet passed while
  eleven router-declared phrases were dead, because the sixteen chosen phrases did not include them. A
  baseline proves what it samples and nothing else.
- **`what should this look like` was dead.** It sat in `description.json` and in the router's VALUES
  list and reached nobody. It is the canonical question the mode exists to answer.
- **`sk-doc` still carried `data visualization`.** The cutover moved the modes and left two chart
  phrases behind, so a data-visualisation request reached the documentation hub for the whole packet.
- **Two remain from the manual probe.** `critique this` and `plot this` are two-word phrases that do
  not clear the bar even when present in the vocabulary; that is a length limit, not a membership gap.
  `review this screen` loses to `sk-code`, the same pattern as the deck-review case.
- **The manual probe missed four more, and a checker found them.** Sampling fifteen declarations was
  not enough. `ci-router-vocabulary-reach.cjs` probes every multi-word phrase a router declares and
  found `data viz`, `heat matrix`, `heat map` and `decision branch` reaching other hubs.
- **`sk-doc` held six chart form names, not two.** `treemap`, `histogram`, `data viz`, `heat matrix`,
  `heat map` and `parallel coordinates`. The first pass removed only two because it filtered the
  signal list by keyword instead of reading it, and a filter for `chart` and `heatmap` matches none of
  `treemap`, `histogram` or `heat matrix`. All six now reach the design hub.
- **The fleet scan found more, in hubs this packet does not own.** `system-deep-loop` has three
  wrong-hub phrases: `iterative review` and `review convergence` reach `sk-design`, `audit the diff`
  reaches `sk-code`. `mcp-tooling` has two: `create note` and `browser agent`. Recorded for their
  owners rather than fixed here.
- **`sk-design` is not in the compiled-routing closure.** Five hubs resolve through a compiled router
  contract first; this one returns a legacy sentinel. Written up in
  `scratch/compiled-routing-gap.md` with what joining would take.
- **The check fails on wrong-hub, reports no-reach.** A phrase reaching another hub is a defect. A
  phrase reaching nobody is almost always too short to clear the bar, and a gate that fails on ten
  unfixable rows stops being run.
<!-- /ANCHOR:log -->
