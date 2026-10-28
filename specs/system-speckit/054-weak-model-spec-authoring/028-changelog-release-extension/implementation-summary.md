---
title: "Implementation Summary"
description: "A skilled changelog run now extends an untagged latest release instead of opening a second one beside it, and sk-create-quality-control no longer describes the retired /doc:quality command as runnable."
trigger_phrases:
  - "changelog release extension implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/054-weak-model-spec-authoring/028-changelog-release-extension"
    last_updated_at: "2026-10-28T06:10:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Fixed every review finding and closed the phase"
    next_safe_action: "None. The phase is complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "054-028-changelog-release-extension"
      parent_session_id: null
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

| Field | Value |
|-------|-------|
| **Spec Folder** | 028-changelog-release-extension |
| **Completed** | 2026-10-28 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A `/create:changelog` run for the `skilled` release line now checks origin for a tag on the latest entry's version. With no tag, it folds the new work into that entry instead of opening a second untagged release, which is what this session had to do by hand for v4.0.0.16.

### Phase 28: changelog-release-extension

When you write release notes before tagging, later work now joins the same entry. The run keeps the open release's version, edits the entry wherever it sits and leaves other sessions' content alone except for sentences the new work makes untrue. It never edits a release that already shipped. A failed tag check numbers a new entry, and an open entry that exists only upstream stops the run until you merge or rebase. Skill components still number every entry.

The quality-control skill also stops telling you to run `/doc:quality`, a command with no file in any runtime. The name stays as routing vocabulary, so old wording still reaches the packet.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-doc/sk-create-changelog/SKILL.md` | Modified | The open-release rule in section 7, validation exceptions, rules, version 1.3.7.0 |
| `.skilled/commands/create/assets/create-changelog-auto.yaml` | Modified | Tag check, extend branch with backup, mode-aware checks, report line |
| `.skilled/commands/create/assets/create-changelog-confirm.yaml` | Modified | The same, plus checkpoint, Override and Undo wording |
| `.skilled/commands/create/assets/create-changelog-presentation.txt` | Modified | Entry line in the report, Q1 note |
| `.skilled/skills/sk-doc/sk-create-changelog/README.md` | Modified | How It Works, troubleshooting row, verification row |
| `.skilled/skills/sk-doc/sk-create-changelog/references/version-bump-rules.md` | Modified | The release-line exception |
| `.skilled/skills/sk-doc/sk-create-changelog/manual-testing-playbook/` | Modified, Created | Index, CHG-008 objective, new CHG-013 |
| `.skilled/skills/sk-doc/sk-create-changelog/changelog/v1.3.7.0.md` | Created | Release entry |
| `.skilled/skills/sk-doc/sk-create-quality-control/SKILL.md` | Modified | Four prose lines, version 1.0.4.0 |
| `.skilled/skills/sk-doc/sk-create-quality-control/references/workflows.md` | Modified | Mode table row |
| `.skilled/skills/sk-doc/sk-create-quality-control/changelog/v1.0.4.0.md` | Created | Release entry |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The tag check's exit codes were measured on the live origin first: 2 for the open v4.0.0.16 and 0 for the tagged v4.0.0.15. The contract changes followed, then the validators and suites. A fresh Opus high review read the diff and found six P1 and nine P2 issues, and each was fixed before commit:

- Strict-mode, quality-standard, always and never lines in both YAMLs and the skill still demanded a new sequential version. Each now names the extension as its exception.
- A chosen bump was silently dropped. The report now names it and says tagging the open release starts a new one.
- An open entry only on upstream had no handling. The run now stops with a merge or rebase request.
- The offline fallback to local tags could edit shipped notes. Any failed check now numbers a new entry and says so.
- `:confirm` Undo would delete the open entry. The run now copies the entry first and Undo restores it, and Override switches back to a new entry.
- The quality-control fix edited the pushed v1.0.3.0 entry, which the skill forbids. That entry is restored, and the fix is a new v1.0.4.0.
- Smaller points: the tag check skips an empty folder, the path comes from `find -L` so a generation folder works, a compact entry converts to expanded when it outgrows the threshold, the release footer uses the real path, and the completion reports carry the entry line. The v1.3.7.0 wording now matches what the run does.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Extend wins over a chosen bump, and the report says so | `version_bump` is a required input, so treating any bump as a request for a new release would make the rule unreachable |
| A failed tag check numbers a new entry | A stale local tag list can say a shipped release is open, and editing shipped notes is worse than a second entry the operator can fold |
| Skill components keep numbering | Skill versions carry no release tags, so there is nothing to tell an open skill entry from a closed one |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `git ls-remote --exit-code --tags origin refs/tags/v4.0.0.16` and `v4.0.0.15` | Exit 2 and exit 0 |
| `yaml.safe_load` on both YAMLs | Both parse |
| `diff` of the two step 3 open-release blocks | Identical |
| `python3 -m pytest -q .skilled/commands/create/assets/tests` | 13 passed |
| `run-script-tests.sh` (sk-doc) | all sk-doc script tests passed |
| `validate-playbook-package.cjs --package .../sk-create-changelog/manual-testing-playbook` | PASS, 13 scenarios, 0 violations |
| `validate_document.py` on SKILL.md, README, references, both entries and CHG-013 | Total issues: 0 for each |
| `hvr_scan.py` on both entries | 0 hard blockers |
| `grep -n "doc:quality"` over the quality-control SKILL.md and workflows reference | SKILL.md lines 12, 30 and 65 only |
| `sync-skills-hermes.cjs --check` | PASS: 67 Hermes skill copies in sync |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The rule lives in workflow text, not code.** No test runs a changelog workflow end to end, so CHG-013 is the check. Run it after the next untagged release to confirm a live run extends the entry.
<!-- /ANCHOR:limitations -->

---
