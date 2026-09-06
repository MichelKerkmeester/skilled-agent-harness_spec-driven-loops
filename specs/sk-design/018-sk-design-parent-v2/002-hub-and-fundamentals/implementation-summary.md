---
title: "Implementation Summary: reinstate the sk-design parent hub"
description: "sk-design becomes a parent hub again, with its former root content moved down into sk-design-fundamentals as the first mode, and the routing effect measured rather than assumed."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/018-sk-design-parent-v2/002-hub-and-fundamentals"
    last_updated_at: "2026-09-06T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Converted the sk-design root to class H and moved its content into sk-design-fundamentals"
    next_safe_action: "Run phase 003: merge the md generator in and close the regression this phase introduced"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/ROUTER.md"
      - ".opencode/skills/sk-design/mode-registry.json"
      - ".opencode/skills/sk-design/sk-design-fundamentals/SKILL.md"
      - "specs/sk-design/018-sk-design-parent-v2/scratch/routing-baseline.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-06-018-sk-design-parent-v2"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "A hub is a class change, not an addition: leaf-manifest.config.json is deleted and three hub files are added"
      - "The regression this phase introduces is left for phase 003 rather than papered over with keyword tuning here"
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
| **Spec Folder** | 002-hub-and-fundamentals |
| **Completed** | 2026-09-06 |
| **Commit** | `112d5471f4` |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`sk-design` is a parent hub again. It was one until 19 August 2026, when `4edf582436` dismantled it
on purpose — it routed exactly two modes, they were unevenly coupled to the shared `styles` corpus,
and that packet was explicit that deleting it was a routing decision rather than housekeeping. That
reasoning was sound for the shape it described. This reinstates the hub for a different shape: four
modes with one subject, rather than two that barely shared one.

### The class conversion

A hub is a different class from a standalone skill, not a standalone with extra files. So this is a
class change. `description.json`, `mode-registry.json` and `hub-router.json` were added at
`.opencode/skills/sk-design/` because a hub requires them; `leaf-manifest.config.json` and
`leaf-aliases.json` were deleted because a hub forbids the first and generates the second. A new
`ROUTER.md` carries the `router_state`, `version` and `skill_pointer` frontmatter, the `## OVERVIEW`
and `## INTENT MODEL` sections, and `INTENT_SIGNALS` and `RESOURCE_MAP` as dictionaries.

### Fundamentals as the first mode

The 501-line root `SKILL.md` was doing both the routing and the work. Its content moved down into
`sk-design-fundamentals/` as 28 exact renames, so the history survives, and the root `SKILL.md`
shrank to 69 lines of routing only.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-design/ROUTER.md` | Created | The hub's intent model and resource map |
| `.opencode/skills/sk-design/description.json` | Created | Hub-class identity, required on a hub |
| `.opencode/skills/sk-design/mode-registry.json` | Created | Declares the modes the hub routes |
| `.opencode/skills/sk-design/hub-router.json` | Created | Stage-one routing to a mode |
| `.opencode/skills/sk-design/leaf-manifest.config.json` | Deleted | Forbidden on a hub |
| `.opencode/skills/sk-design/leaf-aliases.json` | Deleted | Authored-optional on a hub; regenerated |
| `.opencode/skills/sk-design/SKILL.md` | Modified | 501 lines down to routing only |
| `.opencode/skills/sk-design/sk-design-fundamentals/**` | Renamed (28) | Former root content, history intact |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

One commit, `112d5471f4`, because a hub root without its `SKILL.md` is a broken tree and other
sessions write to this branch. The 28 moves were verified as `R100` renames with
`git diff --cached --name-status -M` before committing, not after.

Routing was measured, not assumed. A sixteen-phrase baseline was captured before anything moved and
committed to `specs/sk-design/018-sk-design-parent-v2/scratch/routing-baseline.txt`; a replay taken
after the conversion sits beside it. That baseline cannot be recaptured once the tree has moved,
which is why it was taken first.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Treat the conversion as a class change, not an addition | The metadata contract makes three files required on a hub and forbidden on a standalone, with `leaf-manifest.config.json` as the mirror. Adding hub files without removing standalone ones fails the fleet gate. |
| Move the root content down as renames | 28 files with real history; a delete-plus-add would lose it for nothing. |
| Leave the one regression for phase 003 | Trimming keywords here to recover `validate this design.md` would be undone the moment the generator merges in. Fixing it in the wrong phase costs the work twice. |
| Keep what `016` retired retired | The interface mode, the `commands/interface/` surface and the design-taste layer stay gone. This packet reverses the hub decision, not the scope decision. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Fleet metadata audit, class H for `sk-design` | PASS |
| Sixteen-phrase replay against the baseline | 15 of 16 unchanged; 1 regressed, named below |
| Two design phrases at baseline | PASS |
| Rename detection on the 28 moved files | PASS, all `R100` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **One phrase regressed, by design of the sequencing.** `validate this design.md` scored 0.8451 to
   `sk-design-md-generator` at baseline and returned nothing after this conversion, because a second
   identity carrying design vocabulary splits a weak phrase until neither clears the bar. It is an
   acceptance criterion of phase 003, not a hope, and it closed there.
2. **A weakness inherited, not owned.** `sk-doc` answered `create a chart` at 0.918 while answering
   `make a chart of orders by month`, `flowchart` and `ascii flowchart of the approval loop` with
   nothing, despite carrying 27 chart and diagram vocabulary strings. Recorded here so no later
   reader mistakes it for damage done by this phase. Phase 004 found the cause.
<!-- /ANCHOR:limitations -->

---
