---
title: "Implementation Summary: chart and diagram as sk-design modes"
description: "sk-create-chart and sk-create-diagram move from the documentation hub to the design hub, and four phrases that reached nobody at baseline are fixed by putting vocabulary where the scorer actually looks."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/018-sk-design-parent-v2/004-chart-and-diagram-cutover"
    last_updated_at: "2026-09-06T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Moved chart and diagram into the design hub and fixed four phrases that reached nobody"
    next_safe_action: "Run phase 005: replay the sixteen phrases from the final state and reconcile the canon tables"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/graph-metadata.json"
      - ".opencode/skills/sk-doc/graph-metadata.json"
      - ".opencode/skills/sk-design/sk-create-chart/scripts/check-corpus.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-06-018-sk-design-parent-v2"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Keywords in description.json move no advisor score; the advisor reads a hub's graph-metadata.json intent_signals"
      - "The sk-create- prefix is retained under sk-design rather than renamed"
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
| **Spec Folder** | 004-chart-and-diagram-cutover |
| **Completed** | 2026-09-06 |
| **Commit** | `e34e225517` |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Chart and diagram sat in a documentation hub whose other thirteen modes produce prose, while they
produce visual artefacts judged by design criteria. They now belong to the design hub, which reaches
four modes and the shared subject the two-mode hub deleted in August did not have.

### The cutover

249 files moved as renames. Both hubs changed in one commit, because a router signal naming a packet
that is not on disk fails whichever hub is wrong, and other sessions write to this branch. Registry
rows, router signals with their vocabulary classes, tie-break order, `ROUTER.md` intents and resource
maps, graph vocabulary, description keywords and prose, `SKILL.md` mode tables and their counts, and
command metadata all moved together. 56 live path references followed.

### The finding that outgrew the phase

Four chart and diagram phrases reached nobody at baseline: `flowchart`, `make a chart of orders by
month`, `redraw this drawio diagram` and `ascii flowchart of the approval loop`. This packet had
recorded them as an inherited weakness and put them out of scope, reasoning that `sk-doc` already
carried the vocabulary and it still did not work.

**The vocabulary existed in the wrong file.** Adding phrases to `description.json` moves no score at
all — tried twice, confirmed twice. The advisor reads a hub's `graph-metadata.json` `intent_signals`.
Eleven signals there moved all four phrases above the bar, and fixed a real regression the move had
introduced where `chart template` briefly reached nobody.

So the long-phrase weakness is likely not a scorer threshold problem anywhere in the fleet. It is
vocabulary sitting where the scorer does not look, which is worth checking before anyone writes a
packet to tune thresholds.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-design/sk-create-chart/**`, `sk-create-diagram/**` | Renamed (249) | The move itself, history intact |
| `.opencode/skills/sk-design/graph-metadata.json` | Modified | Eleven intent signals that fixed four dead phrases |
| `.opencode/skills/sk-doc/graph-metadata.json` | Modified | Chart and diagram vocabulary removed |
| `.opencode/skills/sk-design/mode-registry.json`, `hub-router.json`, `ROUTER.md`, `SKILL.md` | Modified | Two new modes and their intents |
| `.opencode/skills/sk-doc/mode-registry.json`, `hub-router.json`, `ROUTER.md`, `SKILL.md` | Modified | Two modes removed, counts corrected in prose |
| `.opencode/commands/create/chart.md` and the chart/diagram assets | Modified | Command surface follows the modes |
| `.opencode/hooks/post-edit-quality/lib/post-edit-router.cjs` | Modified | A genuine runtime path |
| `.claude`, `.codex`, `.opencode` markdown agent mirrors | Modified | Live path references |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

One commit, `e34e225517`, covering both hubs. Renames verified before committing.

Two silent windows were closed by name rather than assumed: the advisor daemon keeps serving its
previous generation until rebuilt, and `sk-doc` keeps serving legacy compiled routing until its
manifest is re-minted. Neither reports itself. Verification was taken at daemon generation 628 after
an explicit rebuild.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Edit both hubs in one commit | A router signal naming a packet not on disk fails check five on whichever hub is wrong, and this is a shared branch. |
| Keep the `sk-create-` prefix | A rename doubles the path rewrite across four mirrors, the scorer shim, the command bridges and the canaries, and buys nothing. The prefix mismatch is recorded as a known deviation. |
| Put vocabulary in `graph-metadata.json`, not `description.json` | Measured: description keywords move no score. This is the phase's most transferable finding. |
| Take the phrase measurements after an explicit daemon rebuild | The daemon serves its previous generation until rebuilt; a green replay against a stale daemon proves nothing. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Class H gate on both hubs | PASS |
| Every chart and diagram phrase names `sk-design`, at generation 628 | PASS |
| All three `sk-doc` control phrases unchanged | PASS |
| Four previously dead phrases now above the bar | PASS |
| `check-corpus.cjs --render` from the new location, 26 forms | `RESULT: PASSED` |
| Rename detection on the 249 moved files | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The `sk-create-` prefix no longer matches its hub.** `sk-create-chart` and `sk-create-diagram`
   keep their names under `sk-design`. Renaming them was rejected as cost without benefit; the
   mismatch is a legibility cost carried deliberately.
2. **The fleet-wide implication is untested.** Vocabulary in the wrong file is likely the cause of
   long-phrase misses elsewhere in the fleet, but that was measured only for these two hubs.
<!-- /ANCHOR:limitations -->

---
