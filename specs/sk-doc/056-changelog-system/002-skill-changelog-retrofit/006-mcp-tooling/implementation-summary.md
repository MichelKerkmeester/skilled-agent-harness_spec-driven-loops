---
title: "Implementation Summary: Phase 6: mcp-tooling changelogs"
description: "All 55 mcp-tooling changelogs now read in the sk-create-changelog format and keep every fact their originals recorded. Each passed the fact check in force when it was kept and has a clean Opus review of its current text. Commit 7ba6e1ea9d holds them on main."
trigger_phrases:
  - "mcp-tooling changelog rewrite status"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/059-skill-changelog-retrofit/006-mcp-tooling"
    last_updated_at: "2026-09-26T08:26:15Z"
    last_updated_by: "generate-context"
    recent_action: "Committed and pushed the mcp-tooling rewrites in 7ba6e1ea9d"
    next_safe_action: "Close the parent packet"
    blockers: []
    key_files:
      - "specs/sk-doc/059-skill-changelog-retrofit/scratch/lists/mcp-tooling.txt"
    session_dedup:
      fingerprint: "sha256:636c2e0800353a0c713b3be5d4a0b4c50574090c54408a56b949c4dbc59ae46e"
      session_id: "fb879d4c-5543-4760-8339-b0f3499f278d"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Phase 6: mcp-tooling changelogs

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-mcp-tooling |
| **Completed** | 2026-09-26 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

All 55 changelogs in `../scratch/lists/mcp-tooling.txt` now read in the sk-create-changelog format, 36 compact and 19 expanded. Each passed the shape checker against its original, the HVR scan and the second-model fact check in force when it was kept, and each has a clean Opus review of its current text. Commit `7ba6e1ea9d` holds them on `origin/main`.

### Phase 6: mcp-tooling changelogs

The wave covers the hub's 11 entries and nine modes: mcp-aside-devtools (2), mcp-chrome-devtools (7), mcp-click-up (3), mcp-figma (3), mcp-magicpath (2), mcp-mobbin (2), mcp-notion (1), mcp-obsidian (22) and mcp-refero (2).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| 55 changelogs under `.skilled/skills/mcp-tooling/` | Rewritten | Current format, facts kept |
| `../scratch/state.jsonl` | Appended | One record per attempt and orchestrator send-back |
| `../scratch/opus-review.jsonl` | Appended | One clean review record per file |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Of the 55 kept texts, 30 came through the GPT plan on cli-pi, cli-codex and cli-opencode, 7 through cli-devin and 18 through the LLM Gateway while the GPT plan was at its usage limit, as D3 allows. 17 files were kept in their first run with no send-back, and 20 failed a driver run before a retry kept them.

The Opus review read every kept file beside its original and sent 37 files back 117 times in all. 108 of those overturned a fact-check pass, and 9 reviewed a failed draft to settle findings that pulled against each other. The files that took the most rounds were mcp-obsidian v0.23.0.0 with 8, then the hub's v1.6.1.0, mcp-aside-devtools v1.0.0.0, mcp-obsidian v0.21.0.0 and mcp-refero v1.0.0.0 with 7 each.

Two driver changes came out of this wave's last files. On 2026-09-25 the GPT plan began refusing its OpenAI key on all three GPT CLIs, and its dispatches ended without a write or without a verdict, which spent all three attempts of the hub v1.6.1.0 retry among others. The driver now puts such a file back in the queue with its original restored and stops that lane, and it never routes a refused key to the gateway, because D3 allows the gateway only during a usage limit. A retry after an orchestrator send-back also saw every finding from earlier rounds, and old findings that later rounds had settled led rewriters to undo sentences the review had accepted. A retry now sees only the findings since the last orchestrator review. Once the key worked again, v1.6.1.0 was kept at its third attempt, and a diff against its returned draft showed only the listed fixes and a Why sentence taken from the original's `get_theme` reasoning.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Overturn a fact-check pass when a review finds a drop or an invented claim | D1 outranks a single model's verdict, and the retry fixes the file from its draft |
| Clear a returned file by reading its diff against the draft the review judged | The rest of the text already had a clean review, so only the changed sentences needed a reading against the original |
| Keep the texts cli-devin and the LLM Gateway produced | They passed the same gates and the same Opus review as GPT texts, and D3 names both routes |
| Stop a GPT lane when its key is refused instead of falling back to the gateway | D3 allows the gateway only during a usage limit, and a refused key failed each file in seconds |
| Show a retry only the findings since the last orchestrator review | That review read the whole draft, so older findings were settled and showing them again undid accepted sentences |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Target list | PASS: `wc -l < ../scratch/lists/mcp-tooling.txt` counts 55 files |
| Clean start | PASS: each saved original in `../scratch/orig/` matches its file at `HEAD` byte for byte |
| Final state | PASS: the latest `state.jsonl` record of every file is `pass` under the fact check in force when it was kept |
| Gates | PASS: `wave-verify.cjs` reran the shape checker with `--old`, the HVR scan and the frontmatter check and reports 55 kept, 0 failed, 0 problems |
| Opus review | PASS: all 55 files have a clean review of their current text |
| Commit | PASS: `7ba6e1ea9d` holds the 55 rewrites and is on `origin/main` |
| Routing and mirrors | PASS: `compiled-route-guard.cjs` and all nine `sync-*.cjs --check` runs exit 0 after the last skill commit |
| Phase validation | PASS: `validate.sh --strict` reports `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The fact check and the review are two models' readings.** Neither found a loss in the current text, but a third reader could still weigh a paraphrase differently.
2. **18 kept texts came through the LLM Gateway.** Its text-only route has no tools, so those drafts had no self-check before the driver's gates. They passed the same gates and review as the rest.
<!-- /ANCHOR:limitations -->
