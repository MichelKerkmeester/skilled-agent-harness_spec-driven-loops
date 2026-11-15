---
title: "Implementation Summary"
description: "A released changelog may now be reworded by an approved retrofit, and a tested driver did it for 20 files with every fact kept."
trigger_phrases:
  - "voice rule tooling and pilot implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/document-standards/003-changelog-system/007-changelog-voice-rewrite/001-voice-rule-tooling-and-pilot"
    last_updated_at: "2026-11-15T08:28:10Z"
    last_updated_by: "generate-context"
    recent_action: "Closed child 001 with the pilot approved in its final state"
    next_safe_action: "Run phase 002 with the voice rewrite driver"
    packet_purpose: "Purpose: The later phases can rewrite their files with a tool that is allowed to, and that is proven on 20 real files first."
    blockers: []
    key_files:
      - "specs/sk-doc/document-standards/003-changelog-system/007-changelog-voice-rewrite/spec.md"
      - "specs/sk-doc/document-standards/003-changelog-system/007-changelog-voice-rewrite/001-voice-rule-tooling-and-pilot/spec.md"
      - "specs/sk-doc/document-standards/003-changelog-system/007-changelog-voice-rewrite/scratch/measure-voice.py"
    session_dedup:
      fingerprint: "sha256:dce4a75af34f31f24f7b74937bc1b7cb34f783ba3e19b73599cd89b67b5540d7"
      session_id: "scaffold-001-voice-rule-tooling-and-pilot"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "079f7de2-cb32-4e35-b608-1c6f6425d281"
      workspace: "/Users/michelkerkmeester/worktrees/public/401-changelog-voice-rewrite"
      savedAt: "2026-11-15T08:28:10Z"
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
| **Spec Folder** | 001-voice-rule-tooling-and-pilot |
| **Completed** | 2026-11-15 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A released changelog may now be reworded, but only by a retrofit the operator approved and a spec packet records. A tested driver now does that rewrite. It shortened the sentences in 20 real changelogs and kept every fact.

### Phase 1: voice-rule-tooling-and-pilot

The voice rules said a released changelog entry is never edited. Both copies of that rule now carry one exception, and `sk-create-with-human-voice` moves to v1.2.7.0. The driver in `../scratch/` sends each file to DeepSeek Flash through Mistral Vibe at high effort. The worker has no tools and returns the whole file. The driver writes it and checks it, then asks `gpt-6-luna` at `xhigh` through `codex exec` whether any fact was dropped, added or changed. A file that fails three attempts goes back to its original.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-doc/sk-create-with-human-voice/references/scope-and-exemptions.md` | Modified | The retrofit exception in the section 3 released-changelog row |
| `.skilled/skills/sk-doc/sk-create-with-human-voice/SKILL.md` | Modified | The same exception in NEVER rule 2, version 1.2.6.0 to 1.2.7.0 |
| `.skilled/skills/sk-doc/sk-create-with-human-voice/changelog/v1.2.7.0.md` | Created | The release entry for the exception |
| `../scratch/lists/` | Created | One list per phase 002 to 012, plus the 20-file pilot list |
| `../scratch/hard-blockers.md` | Created | The 55 files with a hard blocker: 54 to fix, 1 self-reference |
| `../scratch/brief-rewrite.md`, `../scratch/brief-verify.md` | Created | The worker and fact-check briefs, written for a structure-locked sentence pass |
| `../scratch/rewrite-driver.cjs`, `../scratch/wave-verify.cjs` | Created | The driver with five gates and token logging, and the after-run check that reuses its gates |
| 20 pilot changelogs listed in `../scratch/lists/pilot.txt` | Modified | Shorter sentences, same facts |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The driver ran first on one file, then on the other 19 with two slots. Each kept file passed five gates in order. The structure lock keeps every heading, table, fence, quote line, bullet, inline code span and number. The house checker must report no sentence rule. No other house rule may fail more often than on the original. The voice scan must find no hard blocker. The fact check must find nothing. `wave-verify.cjs` then reran the first four gates from the final state against HEAD. The operator reviewed the pilot and answered "Approve (Recommended)".

A code review then asked for changes. It found two P1 defects: the lock compared token sets, so a dropped repeat could pass, and an error in one slot could leave the other slot's draft on disk. Both are fixed. The lock now counts each token, a malformed verdict counts as no verdict, an error restores its file and stops new work, and an interrupt restores every file in flight. The review also found three pilot files that split a reason or condition from what it explains. Both briefs now cover that. All 20 pilot texts were checked again under the stronger fact-check brief. 16 passed and 4 failed. The 4 were restored to HEAD, recorded in `state.jsonl` and rerun, and all 4 passed. The second review round approved the driver, and its three small suggestions are applied. The operator then approved the pilot in its final state, answering "Approve final pilot (Recommended)". That approval covers the 4 rewritten files and the review fixes.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| A new brief and driver instead of the earlier retrofit's | The earlier tooling changes a file's format and adds a `(Level N)` label the house checker now rejects. A voice pass must keep the structure. |
| The worker returns the file and has no tools | Vibe must run outside the checkout, so it cannot write the file by relative path. Returning the text also skips the self-check turns. |
| The house voice comes from `system-spec-kit/changelog/v2.13.2.0.md` | The template's older exemplar no longer exists at its path, and this file passes the sentence rules. |
| Effort `high` lives only in each run's throwaway Vibe home | The operator lowered effort for this job. The repository config keeps `max`. |
| A usage limit stops the run | Work never moves to another provider without the operator. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node ../scratch/rewrite-driver.cjs --dry-run ../scratch/lists/pilot.txt` | Exit 0, five gates printed, 20 queued |
| Structure lock on every original compared with itself | 0 failures of 1,571 |
| Pilot run | 20 pass, 0 restored, 26 attempts, median 35.5 s, longest 207 s. After the re-check, 4 reruns passed in 1 or 2 attempts |
| `measure-voice.py` on the pilot | `avg_words` 14.7 to 9.0, `sentences_over_22` 171 to 0 |
| `wave-verify.cjs` on the pilot | `keep` 20, `problems` 0, exit 0 |
| Worker effort | `thinking` `high` in all 20 records. `.vibe/config.toml` still has two `max` rows |
| Tokens | First pass 1,023,037: worker 367,869 in and 129,467 out, fact check 512,068 in and 13,633 out. The re-check of 20 texts cost 431,476 and the 4 reruns 179,357, so the pilot spent 1,633,870 in all |
| Code review | Round 1 REQUESTED_CHANGES (2 P1, 7 P2). Round 2 APPROVED (3 P2, applied) |
| Forced restore after the fixes | A stubbed worker returning a broken file ends `restored 3`, and `git diff --quiet HEAD` exits 0 |
| `check_changelog_shape.py` and `hvr_scan.py` on `v1.2.7.0.md` | PASS, 0 hard blockers |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The 80M projection leans on mid-size files.** The pilot took files of 25 to 160 lines, so the longest entries will cost more per file. Each later phase logs its own tokens.
2. **Two listed files were not release entries.** `system-spec-kit/templates/changelog/phase.md` and `root.md` sat in the 004 list. The driver stops a wave whose list holds a non-entry, so the operator dropped both. The scope is now 1,571 files, and phase 004 has 167.
3. **The fact check is not rerun after the run.** `wave-verify.cjs` reruns the four mechanical gates and compares each file with the sha256 its pass row records. The 16 pilot rows from before that field have no hash.
4. **Some facts are guarded only by the fact checker.** Spelled-out numbers, link targets and which heading a bullet sits under are not locked. The fact check reads them.
<!-- /ANCHOR:limitations -->

---


