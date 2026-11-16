---
title: "Implementation Summary"
description: "The 210 queued cli-external-orchestration changelogs now read in short sentences with every fact kept. A spent API budget restored 180 files mid-wave, so the driver now stops on it and the worker runs on the Vibe login key."
trigger_phrases:
  - "cli external orchestration changelogs implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/document-standards/003-changelog-system/007-changelog-voice-rewrite/006-cli-external-orchestration-changelogs"
    last_updated_at: "2026-11-15T15:54:02Z"
    last_updated_by: "generate-context"
    recent_action: "Rewrote the CLI orchestration changelogs"
    next_safe_action: "Run phase 007 with the rewrite driver"
    packet_purpose: "Purpose: Every changelog on the list reads in short plain sentences with every fact kept."
    blockers: []
    key_files:
      - "specs/sk-doc/document-standards/003-changelog-system/007-changelog-voice-rewrite/scratch/lists/006.txt"
      - "specs/sk-doc/document-standards/003-changelog-system/007-changelog-voice-rewrite/scratch/rewrite-driver.cjs"
    session_dedup:
      fingerprint: "sha256:5b6b45265b5ecee6f924e12edd4855870e89b651e579aabfa2dd1b471538c310"
      session_id: "scaffold-006-cli-external-orchestration-changelogs"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "079f7de2-cb32-4e35-b608-1c6f6425d281"
      workspace: "/Users/michelkerkmeester/worktrees/public/401-changelog-voice-rewrite"
      savedAt: "2026-11-15T15:54:02Z"
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
| **Spec Folder** | 006-cli-external-orchestration-changelogs |
| **Completed** | 2026-11-15 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The cli-external-orchestration changelogs now read in short plain sentences. Across the 210 changelogs this phase queued, the mean sentence fell from 12.2 to 8.3 words. The count of sentences over 22 words fell from 296 to 0, and the 13 files with a hard blocker now have none.

### Phase 6: cli-external-orchestration-changelogs

You can read the release history of the CLI skills without long run-on sentences. Each fact of the original is still there, because a second model checked every kept file against its original.

A spent API budget no longer burns through a list. The driver now stops on it, as it does on a usage limit. The worker also runs on the Vibe login key, so it no longer draws on the separate API budget.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| 184 changelogs under `.skilled/skills/cli-external-orchestration/` | Modified | Rewritten and kept after every gate passed |
| `../scratch/rewrite-driver.cjs` | Modified | Stops on a spent API budget, and unsets `MISTRAL_API_KEY` for the worker |
| `../scratch/measure-voice.py` | Modified | Ends a sentence inside closing quotes or brackets |
| `../scratch/state.jsonl` | Modified | One record per dispatch with tokens and verdict |
| `scratch/evidence.txt` | Created | Measure, wave and wave-verify results |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The driver ran the list with two slots. It skipped the 2 pilot files and recorded 26 files as already passing. Four files passed before the API budget behind `MISTRAL_API_KEY` ran out at 14:20. From then on every worker call returned HTTP 402, and the driver restored 180 files after three attempts each. No file was damaged: `wave-verify.cjs` found every restored file equal to HEAD.

The operator signed in to Vibe with the browser and chose to continue on the Vibe plan. An isolated call without the environment key read the login key from the macOS Keychain and finished at cost 0. The driver was changed to stop on a spent budget and to drop the environment key for the worker. A retry wave then kept all 180 files. `wave-verify.cjs` checked every record against HEAD, and `measure-voice.py` measured the result.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Retry the 180 restored files in one wave | The budget outage, not the files, made them fail. Every failed attempt ended as `infrastructure_failure` with no tokens, so no draft had been judged |
| Treat a spent API budget as a limit | The limit pattern did not match HTTP 402, so the driver retried and restored every file instead of stopping. It now matches `status 402`, `budget exhausted` and `billing_api`. A bare 402 would have matched token counts such as `"output_tokens":402`. Over every run log the new pattern caught the 543 budget logs and nothing else |
| Run the worker on the Vibe login key | The operator chose the Vibe plan after signing in with the browser. With `MISTRAL_API_KEY` unset, Vibe reads the login key from the macOS Keychain. A new `unsetEnv` option on `runProcess` drops the variable for the worker only. The Codex fact check is unaffected |
| End a sentence inside closing quotes in the measure | The old splitter merged two sentences in `cli-external-orchestration/changelog/v1.4.1.0.md` at `"six." Every` and reported 2 sentences over 22 words. The house checker had already split them correctly. Under the fix, phases 002 to 005 still show 0 sentences over 22 words. Their committed before counts move by at most 3 sentences, so their records stand |
| Retry an account failure, never hand-edit it | Every kept file must come through the gates and the fact check |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Wave 006 | `pass=4 restored=180 unchanged=26`, driver exit 0. The 180 failed on the 402 budget error |
| Keychain test call | PASS: exit 0, `finished`, cost 0 |
| Wave 006-retry | PASS: `pass=180 restored=0`, driver exit 0. 144 passed on the first attempt, 34 on the second and 2 on the third |
| New limit pattern over run logs | PASS: 543 budget logs matched, no other log |
| `wave-verify.cjs` | PASS for this phase: keep 184, 26 unchanged, 0 missing. The 2 problems are the pilot files, which match HEAD |
| `measure-voice.py`, 210 files | PASS: avg 12.2 to 8.3 words, over 22 from 296 to 0, hard blockers from 13 to 0 |
| Measure splitter on phases 002 to 005 | PASS: each still shows 0 sentences over 22 words |
| Tokens | 7,953,730 for the two waves, about 37,900 per queued file |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`wave-verify.cjs` flags the two pilot files.** Their latest record is the pilot pass, and its saved original predates the pilot, so it is not HEAD. Both files match HEAD.
2. **The older limit patterns still match some changelog prose.** Phrases such as "rate limit" and "usage limit" appear in a few logs. They only matter after a worker has already failed, so they cannot stop a healthy run.
3. **The worker now depends on the Vibe login.** A run on a machine without that Keychain entry has no worker key, and its error text was not tested against the limit pattern. Run one isolated call before a wave on such a machine.
<!-- /ANCHOR:limitations -->

---
