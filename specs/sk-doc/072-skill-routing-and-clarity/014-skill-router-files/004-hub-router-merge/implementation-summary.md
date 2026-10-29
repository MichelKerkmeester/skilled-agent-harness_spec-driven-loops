---
title: "Implementation Summary"
description: "Planned, not built. This phase moves the seven hubs' MACHINE ROUTER prose from SKILL.md into a named section of each root ROUTER.md, leaves one pointer line behind and proves the move with an identical replay capture."
trigger_phrases:
  - "hub router merge implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/072-skill-routing-and-clarity/014-skill-router-files/004-hub-router-merge"
    last_updated_at: "2026-10-29T09:04:16Z"
    last_updated_by: "pi"
    recent_action: "Planned the phase and recorded the baseline projections it must hold"
    next_safe_action: "Start once 002 and 003 land: capture the before projections, then move the seven hubs"
    blockers: []
    key_files:
      - ".skilled/skills/sk-doc/SKILL.md"
      - ".skilled/skills/sk-doc/ROUTER.md"
      - ".skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "0269-skill-router-files"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-hub-router-merge |
| **Completed** | Not started |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing yet. This phase is planned and its status is Draft, so no hub file has been edited.

### Phase 4: hub-router-merge

The phase will replace the SMART ROUTING sentence that points at the MACHINE ROUTER section with one pointer line, delete that section, and append the moved prose to the hub root `ROUTER.md` as a named final section. The stage-two machine block stays in place and remains the only replay source, so every hub routes exactly as it does today. The gain is one prose home per hub instead of two, with the copy in SKILL.md no longer loading on every hub load.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-doc/SKILL.md` and the six other hub SKILL.md files | Planned | Pointer line and next edition |
| `.skilled/skills/sk-doc/ROUTER.md` and the six other hub ROUTER.md files | Planned | Moved prose in a named final section |
| `description.json`, `hub-router.json` and `mode-registry.json` in the seven hub roots | Planned | Version parity with the new edition |
| `changelog/` under the seven hub roots | Planned | One release note per hub |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/` and its authored copy under `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/` | Planned | Refreshed provenance hashes |
| `.hermes/skills/` under the seven hub folder names | Planned | Regenerated SKILL.md and ROUTER.md copies |
| `scratch/replay-before.txt`, `replay-after.txt`, `routes-before.txt`, `routes-after.txt` | Planned | Before and after evidence |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not started. The run order is capture the replay lines, the machine-section hashes and one compiled route per hub, move the seven hubs, then rerun every capture before the derived files are regenerated.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Append the moved prose as a final numbered section instead of placing it beside the machine block | Appending keeps every existing section number, and `sk-code`'s own prose cites `ROUTER.md` section 9 |
| Replace the SMART ROUTING sentence that points at the removed section with one pointer line | Every hub already carries that sentence, and it is the line a reader reads before routing, so no new heading is needed |
| Leave the machine block untouched | The declaration is the only replay source, and a second `INTENT_SIGNALS = {` line would make the parser read the wrong block |
| Capture the baseline after phases 002 and 003 land | Phase 002 changes which file the replay reads, so a baseline taken on the current tree would compare two different readers |
| Compare route decisions but not policy hashes | The compiler hashes the SKILL.md bytes, so the hash has to change when SKILL.md changes |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Replay capture diff | Not run (phase not started) |
| Compiled route diff for seven hubs | Not run (phase not started) |
| Machine-section hash diff | Not run (phase not started) |
| `compiled-route-guard.cjs` | Not run (phase not started) |
| Seven per-hub checks | Not run (phase not started) |
| Routing suites | Not run (phase not started) |
| Spec validation | Not run (phase not started) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The phase cannot start until phases 002 and 003 land.** Starting earlier would compare a replay that reads SKILL.md with a router whose SKILL.md no longer declares a block, and the check that should pass the pointer still requires the old section.
<!-- /ANCHOR:limitations -->

---
