---
title: "Implementation Summary: Phase 14: system-deep-loop changelogs"
description: "All 89 system-deep-loop changelogs now read in the sk-create-changelog format and keep every fact their originals recorded. Each passed the fact check in force when it was kept and has a clean Opus review of its current text. Commit 9a89ac328e holds them on main."
trigger_phrases:
  - "system-deep-loop changelog rewrite status"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/059-skill-changelog-retrofit/014-system-deep-loop"
    last_updated_at: "2026-09-26T08:26:55Z"
    last_updated_by: "generate-context"
    recent_action: "Committed and pushed the system-deep-loop rewrites in 9a89ac328e"
    next_safe_action: "Close the parent packet"
    blockers: []
    key_files:
      - "specs/sk-doc/059-skill-changelog-retrofit/scratch/lists/system-deep-loop.txt"
    session_dedup:
      fingerprint: "sha256:70658a272f29ab378299ae7b2a641fe327ad0f0765e1231dca8f47a3ac0e407b"
      session_id: "fb879d4c-5543-4760-8339-b0f3499f278d"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Phase 14: system-deep-loop changelogs

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 014-system-deep-loop |
| **Completed** | 2026-09-26 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

All 89 changelogs in `../scratch/lists/system-deep-loop.txt` now read in the sk-create-changelog format, 56 compact and 33 expanded. Each passed the shape checker against its original, the HVR scan and the second-model fact check in force when it was kept, and each has a clean Opus review of its current text. Commit `9a89ac328e` holds them on `origin/main`.

### Phase 14: system-deep-loop changelogs

The wave covers the hub's 10 entries and five sub-skills: deep-ai-council (11), deep-improvement (24), deep-research (20), deep-review (17) and runtime (7). deep-improvement v1.2.0.0, which failed both the pilot and the phase 001 check run, is among the kept files.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| 89 changelogs under `.skilled/skills/system-deep-loop/` | Rewritten | Current format, facts kept |
| `../scratch/state.jsonl` | Appended | One record per attempt and orchestrator send-back |
| `../scratch/opus-review.jsonl` | Appended | One clean review record per file |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Of the 89 kept texts, 67 came through the GPT plan on cli-pi, cli-codex and cli-opencode, and 22 through the LLM Gateway while the GPT plan was at its usage limit, as D3 allows. None came through cli-devin. 25 files were kept in their first run with no send-back, and 40 failed a driver run before a retry kept them.

The Opus review read every kept file beside its original and sent 56 files back 62 times in all. 45 of those overturned a fact-check pass, and 17 reviewed a failed draft to settle findings that shifted between attempts. Six files took two rounds: the hub's v2.2.3.0, deep-ai-council v2.0.0.0, deep-improvement v1.2.1.0, v1.9.0.0 and v1.15.0.0, and deep-research v1.1.0.0.

Three originals, deep-research v1.1.0.0, v1.2.1.0 and v1.2.2.0, record what shipped only in their Files Changed tables, beneath prose that is boilerplate. The fact check reads outside those tables and passed rewrites that said nothing concrete. The review overturned all three and sent them back with the tables' changes written as prose.

This wave also exposed a gap in how a returned file was cleared. The review clears a retried file by diffing its new text against the draft it judged, and that draft sat in `../scratch/failed/`, where a later failed run of the same file writes its own draft. Four re-passes had been cleared against a draft replaced that way: runtime v1.5.0.0, deep-review v1.8.0.0, and deep-research v1.6.1.0 and v1.8.0.0. Their judged texts were recovered from the session transcript, and all four re-diffed clean against them. The review now keeps its own copy of every text it judges, and the diff reads that copy.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Overturn a fact-check pass when a review finds a drop or an invented claim | D1 outranks a single model's verdict, and the retry fixes the file from its draft |
| Clear a returned file by reading its diff against the draft the review judged | The rest of the text already had a clean review, so only the changed sentences needed a reading against the original |
| Keep a copy of each judged text apart from `../scratch/failed/` | A later failed run writes its own draft there, and a diff against that draft could clear sentences no review had read |
| Settle a failed draft with one list of exact edits | Its findings shifted between attempts, so one review of the whole draft replaced another round of single findings |
| Keep the texts the LLM Gateway produced | They passed the same gates and the same Opus review as GPT texts, and D3 allows the gateway during a usage limit |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Target list | PASS: `wc -l < ../scratch/lists/system-deep-loop.txt` counts 89 files |
| Clean start | PASS: each saved original in `../scratch/orig/` matches its file at `HEAD` byte for byte |
| Final state | PASS: the latest `state.jsonl` record of every file is `pass` under the fact check in force when it was kept |
| Gates | PASS: `wave-verify.cjs` reran the shape checker with `--old`, the HVR scan and the frontmatter check and reports 89 kept, 0 failed, 0 problems |
| Opus review | PASS: all 89 files have a clean review of their current text |
| Commit | PASS: `9a89ac328e` holds the 89 rewrites and is on `origin/main` |
| Routing and mirrors | PASS: `compiled-route-guard.cjs` and all nine `sync-*.cjs --check` runs exit 0 after the last skill commit |
| Phase validation | PASS: `validate.sh --strict` reports `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The fact check and the review are two models' readings.** Neither found a loss in the current text, but a third reader could still weigh a paraphrase differently.
2. **22 kept texts came through the LLM Gateway.** Its text-only route has no tools, so those drafts had no self-check before the driver's gates. They passed the same gates and review as the rest.
3. **The fact check does not read the Files Changed table.** When an original's prose is boilerplate, only the Opus review catches a rewrite that drops the table's substance.
<!-- /ANCHOR:limitations -->
