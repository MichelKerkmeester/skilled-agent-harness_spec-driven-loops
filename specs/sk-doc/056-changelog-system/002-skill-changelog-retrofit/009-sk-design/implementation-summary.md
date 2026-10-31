---
title: "Implementation Summary: Phase 9: sk-design changelogs"
description: "All 30 sk-design changelogs now read in the sk-create-changelog format and keep every fact their originals recorded. Each passed the fact check in force when it was kept and has a clean Opus review of its current text. Commit 29c9b0e411 holds them on main."
trigger_phrases:
  - "sk-design changelog rewrite status"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/059-skill-changelog-retrofit/009-sk-design"
    last_updated_at: "2026-09-26T08:26:25Z"
    last_updated_by: "generate-context"
    recent_action: "Committed and pushed the sk-design rewrites in 29c9b0e411"
    next_safe_action: "Close the parent packet"
    blockers: []
    key_files:
      - "specs/sk-doc/059-skill-changelog-retrofit/scratch/lists/sk-design.txt"
    session_dedup:
      fingerprint: "sha256:43d7422e060b56e994c09a897e565a56a6229903929c7875c7db884ea6263ada"
      session_id: "fb879d4c-5543-4760-8339-b0f3499f278d"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Phase 9: sk-design changelogs

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-sk-design |
| **Completed** | 2026-09-26 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

All 30 changelogs in `../scratch/lists/sk-design.txt` now read in the sk-create-changelog format, 20 compact and 10 expanded. Each passed the shape checker against its original, the HVR scan and the second-model fact check in force when it was kept, and each has a clean Opus review of its current text. Commit `29c9b0e411` holds them on `origin/main`.

### Phase 9: sk-design changelogs

The wave covers the hub's one entry and its four modes: sk-design-chart (23), sk-design-diagram (3), sk-design-fundamentals (1) and sk-design-md-generator (2). The hub's v2.0.0.0, which the pilot kept and the phase 001 check run restored, went back through the driver and is kept.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| 30 changelogs under `.skilled/skills/sk-design/` | Rewritten | Current format, facts kept |
| `../scratch/state.jsonl` | Appended | One record per attempt and orchestrator send-back |
| `../scratch/opus-review.jsonl` | Appended | One clean review record per file |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Of the 30 kept texts, 27 came through the LLM Gateway while the GPT plan was at its usage limit, as D3 allows. The last three, sk-design-chart v0.1.0.0, v0.3.0.0 and v0.17.0.0, came through the GPT plan on cli-pi. 2 files were kept in their first run with no send-back, and 9 failed a driver run before a retry kept them.

The Opus review read every kept file beside its original and sent 28 files back 40 times in all. 39 of those overturned a fact-check pass, and 1 reviewed a failed draft to settle findings that conflicted between rounds. The files that took the most rounds were sk-design-chart v0.1.0.0 with 6, then sk-design-diagram v1.1.0.0 and v1.2.0.0 with 3 each.

sk-design-chart v0.1.0.0 is the file that showed a retry should see only the findings since the last orchestrator review. Its retries kept undoing sentences a review had accepted, because each retry still saw findings that later rounds had settled. Its last retry ran after that driver change, and a diff against the reviewed draft showed only the prescribed restore. sk-design-chart v0.3.0.0 and v0.17.0.0 each had a retry on 2026-09-25 spend all three attempts while the GPT plan refused its OpenAI key.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Overturn a fact-check pass when a review finds a drop or an invented claim | D1 outranks a single model's verdict, and the retry fixes the file from its draft |
| Clear a returned file by reading its diff against the draft the review judged | The rest of the text already had a clean review, so only the changed sentences needed a reading against the original |
| Keep the texts the LLM Gateway produced | They passed the same gates and the same Opus review as GPT texts, and D3 allows the gateway while the GPT plan is at its usage limit |
| Show a retry only the findings since the last orchestrator review | That review read the whole draft, so older findings were settled and showing them again undid accepted sentences |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Target list | PASS: `wc -l < ../scratch/lists/sk-design.txt` counts 30 files |
| Clean start | PASS: each saved original in `../scratch/orig/` matches its file at `HEAD` byte for byte |
| Final state | PASS: the latest `state.jsonl` record of every file is `pass` under the fact check in force when it was kept |
| Gates | PASS: `wave-verify.cjs` reran the shape checker with `--old`, the HVR scan and the frontmatter check and reports 30 kept, 0 failed, 0 problems |
| Opus review | PASS: all 30 files have a clean review of their current text |
| Commit | PASS: `29c9b0e411` holds the 30 rewrites and is on `origin/main` |
| Routing and mirrors | PASS: `compiled-route-guard.cjs` and all nine `sync-*.cjs --check` runs exit 0 after the last skill commit |
| Phase validation | PASS: `validate.sh --strict` reports `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The fact check and the review are two models' readings.** Neither found a loss in the current text, but a third reader could still weigh a paraphrase differently.
2. **27 of the 30 kept texts came through the LLM Gateway.** Its text-only route has no tools, so those drafts had no self-check before the driver's gates. They passed the same gates and review as the rest.
<!-- /ANCHOR:limitations -->
