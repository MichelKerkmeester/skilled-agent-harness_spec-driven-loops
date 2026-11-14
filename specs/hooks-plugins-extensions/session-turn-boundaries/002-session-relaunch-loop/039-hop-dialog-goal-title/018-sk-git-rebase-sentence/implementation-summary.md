---
title: "Implementation Summary"
description: "The sk-git rebase sentence now says the commit hook re-mints a Commit-Id only when the repository asks for ids and git sets CHERRY_PICK_HEAD, and the skill ships as 1.11.12.0 with its changelog entry."
trigger_phrases:
  - "sk-git rebase sentence implementation summary"
  - "rebase commit id probe"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/018-sk-git-rebase-sentence"
    last_updated_at: "2026-11-14T13:30:00Z"
    last_updated_by: "documentation-agent"
    recent_action: "Recorded fix commit 21ceaa9772 and its changelog outside the child"
    next_safe_action: "The operator decides the merge"
    blockers: []
    key_files: [".skilled/skills/sk-git/SKILL.md", ".skilled/skills/sk-git/changelog/v1.11.12.0.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-018-sk-git-rebase-sentence"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Which backend the 2026-11-13 20:41 rebase used is not recorded. The apply backend reproduces the kept ids."
    answered_questions:
      - "Did the 16 kept ids come from commits git did not replay? No. The minute holds 16 reflog lines, not 16 commits. 13 replayed picks kept their ids and 2549786f28 was not replayed."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 018-sk-git-rebase-sentence |
| **Completed** | 2026-11-14 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The sk-git skill now says what the commit hook does to a `Commit-Id` during a rebase. A rebase re-mints a fresh id on a pick only when the repository asks for ids and git marks the pick with `CHERRY_PICK_HEAD`. A reworded commit, a commit the rebase leaves in place and `git rebase --apply` keep the id the message carried. The skill ships as `1.11.12.0` with a changelog entry.

### Phase 18: sk-git-rebase-sentence

The old sentence said a rebase keeps an id whenever the replayed message still carries one. The hook is narrower. It drops the copied id and mints a fresh one only while `CHERRY_PICK_HEAD` exists, and only in a repository that asks for ids. The four-case probe records the id before and after, the `CHERRY_PICK_HEAD` state and the git version, all in a throwaway repository with the real hook. The phase 9 row keeps its `Met` status and gains a dated note.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-git/SKILL.md` | Modified | The rebase sentence states the hook's two conditions, and the version is `1.11.12.0` |
| `.skilled/skills/sk-git/changelog/v1.11.12.0.md` | Created | The compact changelog entry for the corrected rule |
| `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/009-document-corrections/acceptance-criteria.md` | Modified | A dated note in the Verification cell of AC-004, with the status still `Met` |
| `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/018-sk-git-rebase-sentence/scratch/` | Created | The probe script and output, the rebase-line inventory, the reflog extract, the check script and its red and green runs |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Test first. The check script asserts the old sentence is gone, the new sentence names both conditions, the version and changelog exist, the probe holds four cases, and sk-doc's checks pass. Before the edit it reported `checks: 10, failed: 5` with exit 1 (`scratch/red.txt`). After the edit it reported `checks: 10, failed: 0` with exit 0 (`scratch/green.txt`). The probe ran with `env -u AI_SESSION_CHILD -u OPENCODE_DB` on git 2.50.1 and exited 0. The version check printed `[verify] 78 files | ok=78` with exit 0. The package check printed `PASS` with exit 0. The document check printed `VALID` with 0 issues and exit 0. `git diff --quiet HEAD -- .skilled/scripts/git-hooks` exited 0. The strict validation printed `RESULT: PASSED` with 0 errors and 0 warnings. The build changed `SKILL.md` and the phase 9 criteria, added the changelog and the scratch evidence, and updated the child records. The fix commit is `21ceaa9772` (Commit-Id 0014041). It lands `SKILL.md`, the changelog, the phase 9 criteria and its repaired graph metadata, and this child's records. The orchestrator split the new `SKILL.md` sentence at its semicolon into two sentences before the commit. T013 read the commit: the changelog is the one new file outside this child.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| State the hook's two conditions, not a rebase rule | The probe shows `CHERRY_PICK_HEAD` decides the id, and a reword or an apply-backend rebase never sets it |
| Keep the hook and its test unchanged | The phase fixes a document, and the cherry-pick test already pins the branch a rebase pick takes |
| Probe in a throwaway repository only | The phase must not write to this checkout's git state, and the saved block is the evidence |
| Use the skill's own changelog folder | The plan names the path, and sk-git keeps one changelog file per version |
| Leave the phase 9 row `Met` | The criterion as written was met, and the dated note records that the sentence it checked was wrong |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `env -u AI_SESSION_CHILD -u OPENCODE_DB bash scratch/rebase-probe.sh > scratch/rebase-probe.txt 2>&1` | PASS: exit 0, git 2.50.1, four `CASE:` blocks, each with an id before and after. `scratch/rebase-probe.txt:3`, `:12`, `:21`, `:30` |
| `bash -n scratch/rebase-probe.sh` and `bash -n scratch/rebase-sentence-check.sh` | PASS: both exited 0 |
| The check script before the edit | FAIL: `checks: 10, failed: 5`, exit 1. `scratch/red.txt:2` to `:6`, `:13` |
| The same check after the edit | PASS: `checks: 10, failed: 0`, exit 0. `scratch/green.txt:2` to `:11`, `:13` |
| `env -u AI_SESSION_CHILD -u OPENCODE_DB node .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs verify --skill sk-git` | PASS: `ok=78` for 78 files, exit 0. `scratch/verification.txt:2`, `:3` |
| `env -u AI_SESSION_CHILD -u OPENCODE_DB python3 .skilled/skills/sk-doc/sk-create-skill/scripts/validate_skill_package.py .skilled/skills/sk-git` | PASS: `package_skill.py --check: PASS`, exit 0. `scratch/verification.txt:8`, `:9` |
| `env -u AI_SESSION_CHILD -u OPENCODE_DB python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/sk-git/SKILL.md` | PASS: `VALID`, 0 issues, exit 0. `scratch/verification.txt:13` to `:16` |
| `git diff --quiet HEAD -- .skilled/scripts/git-hooks` | PASS: exit 0. `scratch/verification.txt:19` |
| `rg -c 'A rebase keeps an id only when the replayed message still carries one' .skilled/skills/sk-git/SKILL.md` | PASS: exit 1 with no output |
| `rg -n '^version:' .skilled/skills/sk-git/SKILL.md` | PASS: `6:version: 1.11.12.0`, exit 0. `scratch/verification.txt:22` |
| `python3 .skilled/skills/sk-doc/sk-create-changelog/scripts/check_changelog_shape.py .skilled/skills/sk-git/changelog/v1.11.12.0.md` | PASS: `SUMMARY files=1 pass=1 fail=0`, exit 0 |
| `python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py .skilled/skills/sk-git/changelog/v1.11.12.0.md` | PASS: 0 hard blockers, exit 0 |
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/018-sk-git-rebase-sentence --strict` | PASS: Errors 0, Warnings 0, `RESULT: PASSED`, exit 0. `scratch/validate.txt` holds the run |
| `git show --stat 21ceaa9772` and the new-file filter of the fix commit | PASS: 18 files, and `git show --diff-filter=A --name-only 21ceaa9772 \| rg -v '018-sk-git-rebase-sentence/'` printed only `.skilled/skills/sk-git/changelog/v1.11.12.0.md`, the one new file outside this child. Commit-Id 0014041 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No code suite runs here.** This child changes no code, so the four-case probe and the check script are the evidence. The hook test is unchanged and was not extended.
2. **The fix commit carries one new file outside the child.** Commit `21ceaa9772` (Commit-Id 0014041) lands the changelog as that file, and T013 read both the file list and the new-file filter.
3. **The 16 kept ids stay partly open.** `scratch/reflog-2041.txt` shows 16 reflog lines, not 16 commits. The 13 replayed picks kept their ids, one commit was not replayed, and the backend is not recorded. The `--apply` probe case reproduces the kept ids, and that is an inference rather than a recorded cause.
4. **One git version was probed.** The probe ran on git 2.50.1. A different version or backend can behave differently, and the sentence names the backend behavior the probe saw.
5. **The child `spec.md` status moved after the commit.** The fix commit carries the records, and the status was set to Complete with this record pass.
6. **The phase 9 derived metadata moved with the note.** The dated note changed `009-document-corrections/acceptance-criteria.md`, and its `graph-metadata.json` was repaired in the same fix commit. No other edit was made there.
<!-- /ANCHOR:limitations -->

---
