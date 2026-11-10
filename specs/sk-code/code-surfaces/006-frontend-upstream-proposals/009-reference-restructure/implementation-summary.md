---
title: "Implementation Summary"
description: "The nine sk-code-frontend references now render as written: every rule field sits on its own line, each file opens with a real overview, the bdg capture recipes sit beside the Figma check that uses them, and no Angular-specific rule is left in the web layer."
trigger_phrases:
  - "reference restructure implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/code-surfaces/006-frontend-upstream-proposals/009-reference-restructure"
    last_updated_at: "2026-11-03T22:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Rebuilt the nine frontend references and ran every gate"
    next_safe_action: "None; the phase is closed"
    blockers: []
    key_files:
      - ".skilled/skills/sk-code/sk-code-frontend/references/web-markup-and-css.md"
      - ".skilled/skills/sk-code/sk-code-frontend/references/figma-to-code.md"
      - "scratch/final-gates.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "ae286a84-7880-4ce7-a5fe-7d1335e09c78"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Angular-specific rules in the web layer: remove them (operator, 2026-11-03)."
      - "Workspace: a new git worktree (operator, 2026-11-03)."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-reference-restructure |
| **Completed** | 2026-11-03 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A reader of any frontend rule now sees Rule, Why, When not to, Pitfall, Support and See also as six separate lines, where before Markdown ran them into one paragraph. Each reference opens with a one-line intro and an overview that says what the file is for, when to load it and what it leaves to other files.

### Phase 9: reference-restructure

Every rule block is a bulleted field list, and a rule that named several features keeps them in one `Support` field. The six `**Deeper:**` lines in `web-markup-and-css.md` no longer render as headings. The `bdg` capture recipes moved into `figma-to-code.md` under the check. The Figma route loads that file and never loaded `web-markup-and-css.md`, so the recipes are now on the route that uses them. `P10` moved to the interaction section. The Angular framework block, `I8` and the Angular locale section are gone, `CS3`, `A15`, `A16`, `A17` and `A18` read framework-neutral, and `ng-content` left the Figma translation table.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `sk-code-frontend/references/web-*.md` (7 files) | Modified | Field lists, real overview, renumbered sections, Angular removal |
| `sk-code-frontend/references/frontend-practice.md` | Modified | Real overview |
| `sk-code-frontend/references/figma-to-code.md` | Modified | Real overview with the core principle; receives the capture recipes |
| `sk-code-frontend/changelog/v1.0.2.0.md`, `SKILL.md` | Created, modified | Release entry and version |
| `.hermes/skills/sk-code-frontend/` | Regenerated | Mirror of the packet |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

`scratch/fieldlist.py` made the layout change mechanically, so no rule word moved in that step. Three DeepSeek V4.1 Flash max builds through `opencode run` then each rebuilt three files from `scratch/brief-*.md`. This session compared every rule field against HEAD, tightened three intros by hand, and ran the gates.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Remove the Angular-specific rules | The operator chose it; the web layer is framework-neutral and a project fork carries its framework |
| Keep generic rules whose title named Angular | `CS3`, `A15` and `A16` state web behavior; only the framework name was specific |
| Keep section numbers in the core, web layer and Figma check | `SKILL.md`, `ROUTER.md`, the hub docs and the mcp-figma playbook link them by number |
| Leave the `I8` gap | Renumbering `I9` would hide that a rule was removed |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Rule fields against HEAD | Only the authorized changes: `I8` removed, A17's Angular call rephrased, two sibling anchors moved; 0 Support lines lost |
| Rule ids | 66 before, 65 after; the diff is `I8` |
| Layout | 0 bold-label lines, 0 text lines above a `---`, 0 bare See also URLs, 0 Angular mentions |
| Links into the references | 94 before on main, 103 after (the overviews add links); 0 broken |
| `validate_document.py` | VALID, 0 issues, on all nine files and the changelog |
| Playbooks | sk-code 27, sk-code-frontend 2, mcp-figma 20, all PASS |
| Compiled-route suites, leaf manifest | 101 tests, 101 pass; manifest OK |
| Router reach, every hub | See `scratch/reach-final.txt` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Merged Support fields can be hard to read.** A rule covering three features lists three Baseline statements in one field, and a feature with no web-features entry reads "Baseline: no web-features entry" without naming the feature. The original lines had the same gap.
2. **The mcp-figma playbook warns about a hand-typed census.** The warning shows on main too, so this phase did not cause it.
<!-- /ANCHOR:limitations -->

---
