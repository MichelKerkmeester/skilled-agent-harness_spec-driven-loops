---
title: "Implementation Summary"
description: "The 296 queued sk-doc changelogs now read in short sentences with every fact kept. A double-backtick span bug in the driver and the measure tool was fixed on the way."
trigger_phrases:
  - "sk doc changelogs implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/document-standards/003-changelog-system/007-changelog-voice-rewrite/003-sk-doc-changelogs"
    last_updated_at: "2026-11-15T12:39:05Z"
    last_updated_by: "generate-context"
    recent_action: "Rewrote the sk-doc changelogs and fixed the span matcher"
    next_safe_action: "Run phase 004 with the rewrite driver"
    packet_purpose: "Purpose: Every changelog on the list reads in short plain sentences with every fact kept."
    blockers: []
    key_files:
      - "specs/sk-doc/document-standards/003-changelog-system/007-changelog-voice-rewrite/scratch/lists/003.txt"
      - "specs/sk-doc/document-standards/003-changelog-system/007-changelog-voice-rewrite/scratch/rewrite-driver.cjs"
    session_dedup:
      fingerprint: "sha256:8e63a6df790746f1236b9b0ca9a4ba3d7ef5d1c2cce3e7dab8dbe9099859cd08"
      session_id: "scaffold-003-sk-doc-changelogs"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "079f7de2-cb32-4e35-b608-1c6f6425d281"
      workspace: "/Users/michelkerkmeester/worktrees/public/401-changelog-voice-rewrite"
      savedAt: "2026-11-15T12:39:05Z"
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
| **Spec Folder** | 003-sk-doc-changelogs |
| **Completed** | 2026-11-15 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The sk-doc changelogs now read in short plain sentences. Across the 296 changelogs this phase queued, the mean sentence fell from 12.5 to 8.4 words. The count of sentences over 22 words fell from 552 to 0, and the 12 files with a hard blocker now have none.

### Phase 3: sk-doc-changelogs

You can read the release history of every sk-doc mode without long run-on sentences. Each fact of the original is still there, because a second model checked every kept file against its original.

The structure lock now reads double-backtick code spans the way Markdown does. Later phases get that fix too, so a changelog that quotes a backtick no longer fails for a tool reason.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| 248 changelogs under `.skilled/skills/sk-doc/` | Modified | Rewritten and kept after every gate passed |
| `../scratch/rewrite-driver.cjs` | Modified | The span matcher pairs a backtick run with a closing run of the same length |
| `../scratch/measure-voice.py` | Modified | The same span fix |
| `../scratch/state.jsonl` | Modified | One record per dispatch with tokens and verdict |
| `scratch/evidence.txt` | Created | Measure, wave and wave-verify results |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The driver ran the list with two slots. It skipped the 2 pilot files and recorded 48 files as already passing. The first wave kept 247 and restored 1. That file, `sk-create-readme/changelog/v1.3.3.0.md`, failed for a tool reason, and a first retry failed the same way. The span matcher was fixed and checked against the old pattern, and a second retry kept the file on its first attempt. `wave-verify.cjs` then checked every record against HEAD, and `measure-voice.py` measured the result.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fix the span matcher in the driver mid-phase | Line 25 of `sk-create-readme/changelog/v1.3.3.0.md` holds double-backtick spans such as `` `gone.py` ``. The old pattern took each backtick as a delimiter, so the structure lock misread the spans and rejected every attempt. The new pattern follows CommonMark: a span closes with a backtick run as long as the one that opened it |
| Prove the fix changes nothing else first | On every scope-list file without a double backtick, the new pattern gives the same spans as the old one, 1,556 of 1,556. Wave 003 re-verified under the fix still keeps all 247 earlier passes |
| Fix `measure-voice.py` the same way | It had the same bug and counted that line as one sentence over 22 words. The numbers here come from the fixed tool. Phase 002's baseline is unchanged under it, 5,001 sentences and a 13.7-word mean |
| Retry the tool failure, never hand-edit it | Every kept file must come through the gates and the fact check |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Wave 003 | PASS: `pass=247 restored=1 unchanged=48`, driver exit 0 |
| Wave 003-retry, old matcher | `pass=0 restored=1`, driver exit 0. The same span misread |
| Wave 003-retry2, fixed matcher | PASS: `pass=1 restored=0`, driver exit 0 |
| Span matcher regression | PASS: same spans on 1,556 of 1,556 files without a double backtick |
| `wave-verify.cjs` | PASS for this phase: keep 248, 48 unchanged, 0 missing. The 2 problems are the pilot files, which match HEAD |
| `measure-voice.py`, 296 files | PASS: avg 12.5 to 8.4 words, over 22 from 552 to 0, hard blockers from 12 to 0 |
| Tokens | 10,717,333 for the three waves, about 36,000 per queued file |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`wave-verify.cjs` flags the two pilot files.** Their latest record is the pilot pass, and its saved original predates the pilot, so it is not HEAD. Both files match HEAD.
2. **The span fix was checked on files without a double backtick.** The 15 scope files that have one were not compared, because the old pattern misreads them by design. Later phases that touch those files run under the fixed matcher.
<!-- /ANCHOR:limitations -->

---
