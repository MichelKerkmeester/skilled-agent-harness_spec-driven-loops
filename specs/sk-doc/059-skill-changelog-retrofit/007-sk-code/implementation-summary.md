---
title: "Implementation Summary: Phase 7: sk-code changelogs"
description: "All 29 sk-code changelogs now read in the sk-create-changelog format and keep every fact their originals recorded. Each passed the fact check in force when it was kept and has a clean Opus review of its current text. Commit 24841a6882 holds them on main."
trigger_phrases:
  - "sk-code changelog rewrite status"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/059-skill-changelog-retrofit/007-sk-code"
    last_updated_at: "2026-09-26T08:26:18Z"
    last_updated_by: "generate-context"
    recent_action: "Committed and pushed the sk-code rewrites in 24841a6882"
    next_safe_action: "Close the parent packet"
    blockers: []
    key_files:
      - "specs/sk-doc/059-skill-changelog-retrofit/scratch/lists/sk-code.txt"
    session_dedup:
      fingerprint: "sha256:73c6b4a983c68842b4457bcdd503d5a339d170ee371db95e2aeaa081569c91ae"
      session_id: "fb879d4c-5543-4760-8339-b0f3499f278d"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Phase 7: sk-code changelogs

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-sk-code |
| **Completed** | 2026-09-26 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

All 29 changelogs in `../scratch/lists/sk-code.txt` now read in the sk-create-changelog format, 23 compact and 6 expanded. Each passed the shape checker against its original, the HVR scan and the second-model fact check in force when it was kept, and each has a clean Opus review of its current text. Commit `24841a6882` holds them on `origin/main`.

### Phase 7: sk-code changelogs

The wave covers the hub's 15 entries and its five packets: sk-code-obsidian (1), sk-code-opencode (2), sk-code-quality (2), sk-code-review (7) and sk-code-webflow (2).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| 29 changelogs under `.skilled/skills/sk-code/` | Rewritten | Current format, facts kept |
| `../scratch/state.jsonl` | Appended | One record per attempt and orchestrator send-back |
| `../scratch/opus-review.jsonl` | Appended | One clean review record per file |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Of the 29 kept texts, 28 came through the LLM Gateway while the GPT plan was at its usage limit, as D3 allows. The last one, sk-code-obsidian v0.1.0.0, came through the GPT plan on cli-codex. 6 files were kept in their first run with no send-back, and 10 failed a driver run before a retry kept them.

The Opus review read every kept file beside its original and sent 23 files back 40 times in all. 33 of those overturned a fact-check pass, and 7 reviewed a failed draft to settle findings that conflicted or shifted between rounds. The files that took the most rounds were sk-code-obsidian v0.1.0.0 with 5, sk-code-review v1.4.0.0 with 4 and the hub's v3.0.0.0 with 3.

sk-code-obsidian v0.1.0.0 was the last file kept. One of its retries on 2026-09-25 ran while the GPT plan refused its OpenAI key and spent all three attempts in ten seconds, before the driver learned to put such a file back in the queue. Its final retry saw only the findings since the last orchestrator review, and a diff against the reviewed draft showed only the prescribed deletion.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Overturn a fact-check pass when a review finds a drop or an invented claim | D1 outranks a single model's verdict, and the retry fixes the file from its draft |
| Review a failed draft whose findings conflict before spending another attempt | Fact checks that ask for opposite fixes fail the file again, so the review decides which finding holds |
| Clear a returned file by reading its diff against the draft the review judged | The rest of the text already had a clean review, so only the changed sentences needed a reading against the original |
| Keep the texts the LLM Gateway produced | They passed the same gates and the same Opus review as GPT texts, and D3 allows the gateway while the GPT plan is at its usage limit |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Target list | PASS: `wc -l < ../scratch/lists/sk-code.txt` counts 29 files |
| Clean start | PASS: each saved original in `../scratch/orig/` matches its file at `HEAD` byte for byte |
| Final state | PASS: the latest `state.jsonl` record of every file is `pass` under the fact check in force when it was kept |
| Gates | PASS: `wave-verify.cjs` reran the shape checker with `--old`, the HVR scan and the frontmatter check and reports 29 kept, 0 failed, 0 problems |
| Opus review | PASS: all 29 files have a clean review of their current text |
| Commit | PASS: `24841a6882` holds the 29 rewrites and is on `origin/main` |
| Routing and mirrors | PASS: `compiled-route-guard.cjs` and all nine `sync-*.cjs --check` runs exit 0 after the last skill commit |
| Phase validation | PASS: `validate.sh --strict` reports `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The fact check and the review are two models' readings.** Neither found a loss in the current text, but a third reader could still weigh a paraphrase differently.
2. **28 of the 29 kept texts came through the LLM Gateway.** Its text-only route has no tools, so those drafts had no self-check before the driver's gates. They passed the same gates and review as the rest.
<!-- /ANCHOR:limitations -->
