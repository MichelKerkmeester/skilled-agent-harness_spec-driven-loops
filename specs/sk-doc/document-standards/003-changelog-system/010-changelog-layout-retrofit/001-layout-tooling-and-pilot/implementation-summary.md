---
title: "Implementation Summary"
description: "A free-model driver now moves an old changelog into the release-notes layout and keeps it only when every fact survives. Twenty pilot files passed."
trigger_phrases:
  - "layout tooling and pilot implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/document-standards/003-changelog-system/010-changelog-layout-retrofit/001-layout-tooling-and-pilot"
    last_updated_at: "2026-11-17T19:53:55Z"
    last_updated_by: "generate-context"
    recent_action: "Pilot passed: 19 pass, 1 unchanged, wave-verify 0 failures"
    next_safe_action: "Run phase 002 on the Skilled release list once the operator sets the slot count"
    packet_purpose: "Purpose: One driver rewrites an old changelog into the v4.1.0.0 layout with a free model and restores it unless every fact survives."
    blockers: []
    key_files:
      - "specs/sk-doc/document-standards/003-changelog-system/010-changelog-layout-retrofit/scratch/rewrite-driver.cjs"
      - "specs/sk-doc/document-standards/003-changelog-system/010-changelog-layout-retrofit/scratch/layout_lint.py"
      - "specs/sk-doc/document-standards/003-changelog-system/010-changelog-layout-retrofit/scratch/brief-rewrite.md"
    session_dedup:
      fingerprint: "sha256:5a3d89e31d573de25e4d0cf4147ad3f1380801fc2bf8bf230fd303fb59764007"
      session_id: "scaffold-001-layout-tooling-and-pilot"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "cbc62a39-7ca8-4b5a-989f-a86fdea260ea"
      workspace: "/Users/michelkerkmeester/worktrees/public/454-changelog-layout-retrofit"
      savedAt: "2026-11-17T19:53:55Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 100
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
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-layout-tooling-and-pilot |
| **Completed** | 2026-11-17 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

An old changelog can now be moved into the release-notes layout by a free model, and the result stays only when every fact of the original survives. Twenty pilot files from all 11 lists came through: 19 rewritten and 1 already in the layout.

### Phase 1: layout-tooling-and-pilot

The driver sends one file at a time to Hy4 Flash Free at high thinking, in an empty folder with no tools. It writes the reply, then runs six gates. The fact lock checks that the frontmatter, fenced blocks, spec-folder paths, URLs, code spans and numbers all survive. The tier lock keeps a compact entry compact. A new layout lint checks the layout itself, which the shape checker never did. The shape check and the voice scan follow. Last, Devin's free `glm-5-2` reads the original and the draft side by side and lists anything dropped, added or changed. A draft that fails is sent back with the reasons, three times at most, and then the original is put back.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `../scratch/rewrite-driver.cjs` | Created | Dispatches the writer, runs the six gates and restores a failed file |
| `../scratch/layout_lint.py` | Created | Checks the layout outright: bold, anchors, links, spacing, wrapped lines, bullet length, glance table |
| `../scratch/brief-rewrite.md`, `../scratch/brief-tier-compact.md`, `../scratch/brief-tier-expanded.md`, `../scratch/brief-verify.md` | Created | The writer brief, one rule set per tier and the fact-check brief |
| `../scratch/wave-verify.cjs` | Created | Rechecks a list on disk with the same gates before a commit |
| `../scratch/lists/` | Created | The 11 phase lists, the pilot list and the two release lists |
| `../scratch/baseline.txt` | Created | Layout and shape failures per list, measured on the originals |
| `../scratch/release-bodies-before/`, `../scratch/tags-before.txt` | Created | Every release body and tag as it stood, for the release phase |
| 860 changelogs | Modified | The level label left each spec-folder line, by script, in `3c9cc2a3b59` |
| The 19 rewritten pilot files in `../scratch/lists/pilot.txt` | Modified | Moved into the layout |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The writer and the fact checker were each probed with a one-line reply first. Then the pilot ran one file at a time. Five fixes came out of the run, each made between files: two fact-lock false catches, two brief rules and a fallback for a missing verdict. Three files written before a fix were put back and run again. `wave-verify.cjs` then rechecked all 20 files on disk.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| A layout lint gates every draft outright | The shape checker never looks at the layout, so a draft still in the old layout passed every other gate |
| The tier of the original is locked | A compact entry that gains an H4 becomes expanded and then fails for a missing How It Was Checked section, which only invented facts could fill |
| Level labels left by script before the run | The fact lock would read the dropped digit as a lost number, and a script can prove nothing else changed |
| Devin's `glm-5-2` checks the facts | A second model reads differently from the writer, and it is free |
| Hy4 rechecks a draft when GLM returns no verdict | GLM hit its output cap on the 536-line `v4.0.0.0` entry. Hy4 has more room, and the draft is not rewritten for a checker failure |
| Compact paragraphs stay paragraphs and changes keep sub-bullets | The first compact rewrites turned every sentence into a flat bullet and lost which fact belonged to which change |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `wave-verify.cjs ../scratch/lists/pilot.txt` | `{"listed":20,"pass":19,"unchanged":1,"restored":0,"missing":0,"problems":0,"factMisses":0,"failures":0}` |
| `layout_lint.py` on the 20 pilot files | `SUMMARY files=20 pass=20 fail=0` |
| `check_changelog_shape.py` on the 20 pilot files | 6 fail, all `[checked-section]`, and each original fails the same rule |
| `hvr_scan.py --json` on the 20 pilot files | 0 hard blockers |
| Attempts per passed file | 9 on the first, 4 on the second and 6 on the third |
| Seconds per file | Mean 189, longest 743 for the 536-line `v4.0.0.0` |
| Thinking tokens per writer dispatch | Between 5,617 and 66,787, so high thinking ran |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **One file at a time is slow.** At a mean of 189 seconds, the 1,556 files left take about 82 hours with one slot. More slots cut that, if the free route allows them. The operator decides how many before phase 002.
2. **The largest entries can fall back to one model.** When GLM returns no verdict, Hy4 checks a draft Hy4 wrote. Only 14 entries run to 250 lines or more.
<!-- /ANCHOR:limitations -->

---


