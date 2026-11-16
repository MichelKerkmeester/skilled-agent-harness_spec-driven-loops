---
title: "Implementation Summary"
description: "The hook library now has 104 READMEs instead of 183, each one about real code, and 103 of them read in one pass. One README, env-secret-guard, waits on the operator."
trigger_phrases:
  - "hook readme fold and rewrite implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/hook-platform/008-hook-library-cleanup-and-readme-rewrite/004-hook-readme-fold-and-rewrite"
    last_updated_at: "2026-11-16T13:04:06Z"
    last_updated_by: "generate-context"
    recent_action: "Recorded the operator's T021 decision"
    next_safe_action: "None; phase 4 is complete and on main"
    packet_purpose: "Purpose: Every README under `.skilled/hooks/` describes real code and reads in one pass, and no README is left for a folder that holds only symlinks."
    blockers: []
    key_files:
      - ".skilled/hooks/env-secret-guard/README.md"
    session_dedup:
      fingerprint: "sha256:dbee44cc30fd49fcdc455c69e2353cbdc3810cc3caa06738073e142d31f65e83"
      session_id: "scaffold-004-hook-readme-fold-and-rewrite"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "a4c37e98-2c3a-4c20-a7bf-acbc32e31f29"
      workspace: "/Users/michelkerkmeester/MEGA/Development/Skilled"
      savedAt: "2026-11-16T13:04:06Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-hook-readme-fold-and-rewrite |
| **Completed** | 2026-11-16. T021 closed after the operator's edit of `env-secret-guard/README.md` |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

`.skilled/hooks/` held 104 READMEs instead of 183 when this phase closed. Each one describes code that sits in its folder, and none is left for a folder that holds only symlinks. Every README is signed off: the guard refused the agent edit to the one wrong diagram line in `env-secret-guard/README.md`, so the operator made it and T021 closed. The later merge of origin/main brought in `session-handover/history/README.md` from another packet, so the tree now holds 105.

### Phase 4: hook-readme-fold-and-rewrite

You can open any hook folder and read its README in one pass. The feature README now names every runtime entry that used to sit in a link-only leaf README, so deleting 81 of those lost no entry. The session-handover README was 14,422 words. It is now 2,785 words, and five sibling documents hold the rest. The root hooks README has a concern-key table that puts each kill-switch key next to its folder.

The rewrites changed no code, no kill-switch name and no concern key. Seven lines elsewhere in the repository that pointed at moved session-handover content now point at the document that holds it.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| 96 other READMEs under `.skilled/hooks/` | Modified | Rewritten into short sentences with each folded runtime row, by workers and reviewed per file. `env-secret-guard/README.md` is among them, finished by the operator |
| 4 symlinked READMEs under `.skilled/hooks/` | Unchanged | `git-message-gate/`, `git-preflight/`, `skill-advisor/` and `spec-gate/` link to skill-owned files, rewritten at their targets |
| `.skilled/hooks/README.md` | Modified | Root rewrite with the concern-key table and the wrong-facts corrections from `plan.md` |
| `.skilled/hooks/session-handover/README.md` | Modified | Cut from 14,422 to 2,785 words, links the five siblings |
| `.skilled/hooks/session-handover/handoff-protocol.md`, `goal-carry-over.md`, `runtime-behavior.md`, `state-files.md`, `troubleshooting.md` | Created | Hold the content split out of the session-handover README |
| `.skilled/hooks/ask-surface-guard/README.md`, `.skilled/hooks/decision-capture/README.md` | Created | The two feature folders that had no README |
| 80 link-only leaf READMEs, listed with the next row's file in the 81 lines of `scratch/deleted-readmes.txt` | Deleted | Folders that hold only symlinks; their rows moved into the feature README |
| `.skilled/hooks/session-handover/opencode/README.md` | Deleted | The last link-only leaf README, removed after the split |
| `.skilled/skills/sk-git/scripts/hooks/README.md`, `.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/README.md` | Modified | Skill-owned hook READMEs with their folded rows |
| `.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md` | Modified | Eight folded rows, the leaf trigger phrases and its hard-blocker fixes |
| Root `README.md`, `.skilled/skills/system-spec-kit/README.md`, five playbooks under `system-spec-kit/manual-testing-playbook/plugins-and-hooks/` | Modified | Seven lines now name the session-handover document that holds the moved content |
| `.skilled/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json`, `baseline-readme-verdicts.json` | Modified | Rebased to the new README set |
| `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` and its three fixture files | Modified | Regenerated after the deletions and the new trigger phrases |

### Files written by hand

These rows of `scratch/review-log.tsv` read `by-hand`. No worker wrote them.

| File | What was done |
|------|---------------|
| `.skilled/hooks/decision-capture/README.md` | Two lines fixed after the leaf review. One claimed the fixture sweep writes queue state, and one misnamed `takeNudge`. |
| `.skilled/hooks/codex-global-hooks-check/README.md` | Added the seven trigger phrases of its deleted leaf READMEs. No brief merged them, because T023 edited the file by hand. |
| `.skilled/skills/sk-git/scripts/hooks/README.md` | Added the twelve trigger phrases of the deleted git-preflight leaf READMEs. Its brief ran through the git-message-gate link path only. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

Setup saved the before-state first: the baseline gates, one gate row per README, the rollback patch and a copy of all 183 READMEs. `scratch/readme-gates.py` checks gates G1 to G7, and `scratch/fold-map.tsv` maps 120 runtime rows into 81 feature folders.

DeepSeek V4.1 Flash workers wrote each README through the Vibe CLI, one brief per file. After each run the gates ran. Then one read-only Claude reviewer read each feature group against the code, and the orchestrator spot-checked the defects it named. A rejected file got a correction brief and a second run, diffed against the snapshot taken before the retry.

`scratch/review-log.tsv` holds 190 verdict rows: 111 pass, 76 reject, 2 reopen and 1 blocked. 107 files passed on the first run, 74 on the second and 6 on the third. Three were finished by hand.

Wave order was the pilot, the feature READMEs, the 80 deletions, the leaf rewrites, the session-handover split and the root README last. The manifest, verdict baseline and trigger index were rebased after the last write, and every gate then ran again from the final state.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Option over environment variable: one run can pick a different count without editing config. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| A Claude reviewer read each group, on top of the gates | The gates check shape and voice, not truth. Reviewers rejected 76 drafts on facts that passed all seven gates. |
| Shim mechanics and the matrix columns went to `runtime-behavior.md` | ADR-004 gave them no home. The deviation is recorded in ADR-004 in `plan.md`. |
| The root README got its own brief, `briefs/root.md` | The feature template's sections and runtime step do not fit the root page. |
| Kept the trigger phrase "hook relocation" | The plan lets only "git hooks" leave, and `TRIGGERS` gates on that. |
| Left `env-secret-guard/README.md` for the operator | The guard refuses an agent edit of any file in its folder, docs included. The operator ran the two-line fix from the prompt, which the guard allows. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `ls logs/archive | wc -l` after `--keep 3`: 3. After a plain run: 10. Suite: PASSED. WEAK: All tests pass. -->

| Check | Result |
|-------|--------|
| `CHECK` over the 104 READMEs and the five siblings | PASS 108, FAIL 1: `skill-advisor/README.md` on G6 only, as planned |
| `VD` and `HVR` over the 104 READMEs | 104 pass, 0 fail. `HVR` reports `hard blockers: 0` for each |
| `REFS` and `COUNTS` | `SUMMARY files=109 pass=109 fail=0` each |
| `METRICS $H` | `SUMMARY files=104 pass=103 fail=1` |
| `FOLD`, `TRIGGERS`, `LINKONLY` | `FOLD missing=0 links=122 folders=83`, `TRIGGERS lost=0 phrases=570`, `[]` |
| `specs/` link search and `LEAFREF` | Both print nothing |
| `test_readme_manifest.py` | `manifest=reproducible`, 845 directories, `gaps=21`, 0 new |
| `test_readme_verdict_parity.py` | `PARITY PASS`, 1062 files (1141 less 81 plus 2) |
| `generate-trigger-index.mjs --check` | `trigger index matches the corpus` over 27493 documents |
| Changed paths against `scratch/status-before.txt` (T083) | `diff` prints nothing, so no code file changed |
| `@review` post-execution gate | APPROVED, advisory score 93. No P0 or P1. Of three P2 items, two were fixed: the root hooks README now names Vibe for `ask-surface` and `decision-capture`, and the closure statement of `acceptance-criteria.md` names T021. After the fix the root README passes G1 to G7, `runtime-refusal.test.mjs` prints `pass 6`, `TRIGGERS lost=0` and the trigger index still matches |
| Baseline rerun (T084) | All 13 exit rows match the before run. Vitest 501/501, `node --test` 1838/1839 with the same known failure, plugin tests 591/591, Pi 120/120 and 81/81. README rows `pass=104 fail=0` for both scans. Sentinel 33/33 |
| Merge of origin/main (`1a8ee2e5087`), baseline in `scratch/baseline-merge/` | All 13 exit rows 0. Vitest 503/503, `node --test` 1888/1888 with the known failure fixed on main, plugin tests 593/593, Pi 120/120 and 81/81, README rows `pass=105 fail=0` for both scans, history engine 146/146. Main's new Vibe links got rows in their feature READMEs, and its session-handover facts went into the split documents |
| `check-gate-inputs.sh` after the merge | `RESULT: PASSED`, 0 failures. Main had added `.skilled/hooks/**` to two `spec-kit-check.yml` filters with no `.opencode/hooks/**` twin, and a clean origin/main failed on those two lines. The twins were added at the operator's request |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **`skill-advisor/README.md` still fails G6.** Its sentence target is out of reach without cutting content the plan keeps. The plan records it as the one expected `FAIL`.
2. **Some pre-existing faults were seen, not fixed.** The playbooks still hold unresolved references they had before. That is outside this phase. The `ai-council` case of `hook-stdin-deadline.test.mjs` passes since the merge of origin/main, and root `README.md:1166` now names `ask-surface-guard`, fixed at the operator's request after the merge.
<!-- /ANCHOR:limitations -->

---
