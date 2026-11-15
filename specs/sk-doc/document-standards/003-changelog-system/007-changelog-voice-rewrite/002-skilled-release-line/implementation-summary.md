---
title: "Implementation Summary"
description: "The 60 queued Skilled release entries now read in short sentences with every fact kept, and the 52 published GitHub release bodies show the new text."
trigger_phrases:
  - "skilled release line implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/document-standards/003-changelog-system/007-changelog-voice-rewrite/002-skilled-release-line"
    last_updated_at: "2026-11-15T11:29:28Z"
    last_updated_by: "generate-context"
    recent_action: "Rewrote the Skilled release line and synced 52 release bodies"
    next_safe_action: "Run phase 003 with the rewrite driver"
    packet_purpose: "Purpose: Every entry on the list reads in short plain sentences with every fact kept, and each published release body shows the same text."
    blockers: []
    key_files:
      - "specs/sk-doc/document-standards/003-changelog-system/007-changelog-voice-rewrite/scratch/state.jsonl"
    session_dedup:
      fingerprint: "sha256:701dc6f2dde8b15abdc9e5d8c586c5eab6b04f69416ba52e42353bdf8f87ddaa"
      session_id: "scaffold-002-skilled-release-line"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "079f7de2-cb32-4e35-b608-1c6f6425d281"
      workspace: "/Users/michelkerkmeester/worktrees/public/401-changelog-voice-rewrite"
      savedAt: "2026-11-15T11:29:28Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-skilled-release-line |
| **Completed** | 2026-11-15 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The Skilled release history now reads in short plain sentences. Across the 60 entries this phase queued, the mean sentence fell from 13.7 to 9.0 words. The count of sentences over 22 words fell from 626 to 0. Each published GitHub release now shows the same text as its entry.

### Phase 2: skilled-release-line

You can read any Skilled release note, from v1.0.0.0 to v4.0.2.1, without long run-on sentences. Each fact of the original is still there, because a second model checked every kept file against its original. The one hard blocker under the voice rules, a semicolon in v4.0.0.13, is gone.

The GitHub release pages match the entries again. 42 of the 52 bodies had been published before later edits to their entries, so the sync also brought those edits in.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| 51 entries under `.skilled/changelog/skilled/` | Modified | Rewritten and kept after every gate passed |
| `../scratch/state.jsonl` | Modified | One record per dispatch with tokens and verdict |
| `../scratch/wave-002.log`, `../scratch/wave-002-retry.log` | Created | Driver logs for the two waves |
| `scratch/release-bodies-before/`, `scratch/release-bodies-after/` | Created | The 52 saved bodies and the 52 bodies sent |
| `scratch/evidence.txt` | Created | Measure, wave-verify and sync results |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The driver ran the list with two slots. It skipped the 2 pilot files and recorded 9 files as already passing. The first wave kept 46 and restored 5. All 5 had failed the fact check three times for meaning drift. One retry wave kept all 5. `wave-verify.cjs` then checked every record against HEAD, and `measure-voice.py` measured the result. Last, with the operator's approval, each old release body was saved and each new body was sent with `gh release edit` and read back. No tag moved.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Retry the 5 restored files once | The phase allows a restore, but the failures were small meaning slips that a fresh attempt could avoid. The retry kept all 5 |
| Sync the release bodies now | The operator chose this through AskUserQuestion on 2026-11-15 |
| Keep each body's own footer convention | v4 bodies carried a "Full changelog" footer and older bodies did not. Keeping each as it was changes only the prose |
| Sync from the entry as it stands now | The 42 bodies that were behind their entries now match them, which is what the sync is for |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Wave 002 | PASS: `pass=46 restored=5 unchanged=9`, driver exit 0 |
| Wave 002-retry | PASS: `pass=5 restored=0`, driver exit 0 |
| `wave-verify.cjs` | PASS for this phase: keep 51, 9 unchanged, 0 missing. The 2 problems are the pilot files, which match HEAD |
| `measure-voice.py`, 60 files | PASS: avg 13.7 to 9.0 words, over 22 from 626 to 0, hard blockers from 1 to 0 |
| Release body sync | PASS: 52 saved, 52 sent, 52 read back equal |
| Tokens | 4,468,065 for both waves, about 74,000 per queued file |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`wave-verify.cjs` flags the two pilot files.** Their latest record is the pilot pass, and its saved original predates the pilot, so it is not HEAD. Both files match HEAD. A later wave that lists a pilot file will show the same two lines.
2. **A synced body can only be put back by hand.** Run `gh release edit <tag> --notes-file scratch/release-bodies-before/<tag>.md`.
<!-- /ANCHOR:limitations -->

---


