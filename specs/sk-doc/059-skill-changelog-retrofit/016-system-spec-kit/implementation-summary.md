---
title: "Implementation Summary: Phase 16: system-spec-kit changelogs"
description: "All 108 system-spec-kit changelogs now read in the sk-create-changelog format and keep every fact their originals recorded. Each passed the fact check in force when it was kept and has a clean Opus review of its current text. Commit 7f7e8f1242 holds them on main."
trigger_phrases:
  - "system-spec-kit changelog rewrite status"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/059-skill-changelog-retrofit/016-system-spec-kit"
    last_updated_at: "2026-09-26T08:27:03Z"
    last_updated_by: "generate-context"
    recent_action: "Committed and pushed the system-spec-kit rewrites in 7f7e8f1242"
    next_safe_action: "Close the parent packet"
    blockers: []
    key_files:
      - "specs/sk-doc/059-skill-changelog-retrofit/scratch/lists/system-spec-kit.txt"
    session_dedup:
      fingerprint: "sha256:c7ebcf54e531c760a62596171599594b6296ccc1f059b8e491eb5a01d12f8b53"
      session_id: "fb879d4c-5543-4760-8339-b0f3499f278d"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Phase 16: system-spec-kit changelogs

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 016-system-spec-kit |
| **Completed** | 2026-09-26 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

All 108 changelogs in `../scratch/lists/system-spec-kit.txt` now read in the sk-create-changelog format, 64 compact and 44 expanded. Each passed the shape checker against its original, the HVR scan and the second-model fact check in force when it was kept, and each has a clean Opus review of its current text. Commit `7f7e8f1242` holds them on `origin/main`.

### Phase 16: system-spec-kit changelogs

The listed files run from v1.0.0.0 to v3.9.0.0 across the `v1+/`, `v2+/` and `v3+/` subfolders. v3+/v3.7.0.0, which failed both the pilot and the phase 001 check run, is among them and is now kept.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| 108 changelogs under `.skilled/skills/system-spec-kit/changelog/` | Rewritten | Current format, facts kept |
| `../scratch/state.jsonl` | Appended | One record per attempt, orchestrator send-back and fresh-start reset |
| `../scratch/opus-review.jsonl` | Appended | One clean review record per file |
| `../scratch/wave-verify.cjs` | Modified | Names saved originals the way the driver does |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Of the 108 kept texts, 6 came through the GPT plan, 66 through the LLM Gateway and 36 through Opus 5.5 subagents. 52 files were kept in their first run with no send-back, and 43 failed a driver run before a later attempt kept them.

On 2026-09-26 the operator moved the remaining files to Opus 5.5 subagents that the orchestrator dispatches, at most four at a time, each with the full rewrite brief. The operator asked for low effort. The agents ran at default effort, because an effort-pinned agent definition loads only at session start. The fact check stayed on MiMo. 21 files whose gateway drafts had failed were reset and restarted fresh on the agent lane. The agent run finished with 42 passes, retries included, and 0 fails.

The Opus review read every kept file beside its original and made 34 send-backs across 30 files. 25 overturned a pass from the earlier lanes, 6 overturned an agent pass and 3 settled a failed draft whose findings had shifted between attempts. The agent overturns taught four rules that every later dispatch prompt carries:

- v2.2.24.0 had restated the old generator's stock lines as facts about the release.
- v3.4.2.0 had linked two statements in its Why with a cause the original does not give.
- v3.5.0.4 had attached a "because" to a different claim than the original does.
- v3.1.2.0 had lost its phase count when the checker made the spec folder line shorter.

Nine originals contradict themselves, and their rewrites keep each claim as the original states it. v1.2.0.0 lists features among the release's changes while marking them never implemented. v3.4.2.0 gives two different counts for the same comment sweep. v3.5.0.4 calls daemon re-election a default-off foundation and also on by default. v2.2.24.0 keeps adaptive fusion default-off beside a completed staged rollout. v3.1.2.0 describes the V-rule bridge both warning on a bypass and failing closed. v3.1.1.0 lists fixes that its own text says were already in place. v3.3.0.0 calls a skill entirely new while telling readers to update references from its old name. v3.5.0.5 spells the environment reference file two ways, and v2.3.0.14 names the database sync target both canonical and main.

`wave-verify.cjs` first reported all 108 files as problems. It named a saved original by replacing only each slash, while the driver replaces every run of other characters. A plus sign in the three subfolder names made the two disagree. The fix reads the driver's names, and the rerun keeps all 108.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Overturn a fact-check pass when a review finds a drop or an invented claim | D1 outranks a single model's verdict, and the retry fixes the file from its draft |
| Restart the files whose gateway drafts failed from their originals on the agent lane | The operator moved the remaining files to a new lane, and a failed draft gives that lane nothing it has to keep |
| Name the old generator's stock lines in every agent prompt and bar restating them | An agent draft turned them into claims about the release |
| Keep an original's contradiction as stated and report it | D1 keeps every fact, and choosing between two claims would drop one |
| Name saved originals in `wave-verify.cjs` the way the driver does | The verifier reads the originals the driver saved, so the two names must match |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Target list | PASS: `wc -l < ../scratch/lists/system-spec-kit.txt` counts 108 files |
| Clean start | PASS: each saved original in `../scratch/orig/` matches its file at `HEAD` byte for byte |
| Final state | PASS: the latest `state.jsonl` record of every file is `pass` under the fact check in force when it was kept |
| Gates | PASS: `wave-verify.cjs` reran the shape checker with `--old`, the HVR scan and the frontmatter check and reports 108 kept, 0 failed, 0 problems |
| Opus review | PASS: all 108 files have a clean review of their current text |
| Commit | PASS: `7f7e8f1242` holds the 108 rewrites and is on `origin/main` |
| Routing and mirrors | PASS: `compiled-route-guard.cjs` and all nine `sync-*.cjs --check` runs exit 0 after the last skill commit |
| Phase validation | PASS: `validate.sh --strict` reports `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The fact check and the review are two models' readings.** Neither found a loss in the current text, but a third reader could still weigh a paraphrase differently.
2. **The Opus agents ran at default effort, not the low effort the operator named.** Their briefs were made thorough to match the request, and every agent text passed the same gates and the same review as the others.
3. **Nine originals contradict themselves.** The rewrites keep both sides of each contradiction, so a reader still meets it.
<!-- /ANCHOR:limitations -->
