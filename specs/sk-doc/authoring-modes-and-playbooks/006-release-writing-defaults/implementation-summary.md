---
title: "Implementation Summary"
description: "Changelogs written through sk-create-changelog now carry feature detail, every fix, testing evidence and short sentences by default, and a published release follows its entry."
trigger_phrases:
  - "release writing defaults implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/authoring-modes-and-playbooks/006-release-writing-defaults"
    last_updated_at: "2026-11-10T12:22:28Z"
    last_updated_by: "generate-context"
    recent_action: "Added changelog detail and sentence gates and the in-step release procedure"
    next_safe_action: "Commit worktree 339 after the operator approves"
    blockers: []
    key_files:
      - ".skilled/skills/sk-doc/sk-create-changelog/scripts/check_changelog_shape.py"
      - ".skilled/skills/sk-doc/sk-create-changelog/SKILL.md"
      - ".skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md"
      - ".skilled/commands/create/assets/create-changelog-auto.yaml"
      - ".skilled/skills/sk-doc/shared/scripts/validate_document.py"
    session_dedup:
      fingerprint: "sha256:5739ef5145a8410318a00142aa449dbfbfcf787131be7fbc415c1d46aa2e566f"
      session_id: "scaffold-006-release-writing-defaults"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "57bcd03f-32c4-439a-a610-ec91a7c3d3ba"
      workspace: "/Users/michelkerkmeester/worktrees/public/339-release-writing-defaults"
      savedAt: "2026-11-10T12:22:28Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-release-writing-defaults |
| **Completed** | 2026-11-10 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A changelog no longer needs a request to be detailed and readable. The shape check fails an expanded entry with no `## How It Was Checked` section, a sentence past 22 words or an average above 10. A published release now takes its entry's new text in the same run, and the report always carries the release URL.

### Release writing defaults

You asked four times while the v4.0.2.1 notes were written: for more detail, for shorter sentences and twice for the release to match the entry. Each request is now a rule the skill states and a gate the workflow runs. The template names v4.0.2.1 as the model for sentence length and depth. Test results, which the validator used to flag everywhere, pass inside How It Was Checked and are still flagged elsewhere.

Moving a published tag is the one thing that still waits. The skill recommends it, names the old tag object and asks once. It runs at once only when the request already asked for it.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `sk-create-changelog/scripts/check_changelog_shape.py` | Modified | Three new rules |
| `sk-doc/shared/scripts/validate_document.py` | Modified | Test results allowed in one section |
| `sk-doc/scripts/tests/test_check_changelog_shape.py`, `test_changelog_validator.py` | Modified | Coverage for the new rules |
| `sk-create-changelog/SKILL.md`, `assets/changelog-template.md` | Modified | The defaults and the in-step release procedure |
| `sk-create-changelog/README.md`, `scripts/README.md`, `references/README.md`, `manual-testing-playbook/` | Modified | Rule lists, model entries and CHG-015 |
| `commands/create/assets/create-changelog-auto.yaml`, `create-changelog-confirm.yaml` | Modified | Draft rules and release step 7 |
| `sk-create-changelog/changelog/v1.5.0.0.md`, `sk-doc/changelog/v2.9.8.0.md` | Created | Component entries |
| `sk-doc/SKILL.md`, `description.json`, `hub-router.json`, `mode-registry.json` | Modified | Hub version 2.9.8.0 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The ceilings were set from measurement first: the accepted v4.0.2.1 text against the two drafts you rejected. The rules and tests came next, then the template, the skill and the workflows. The work sits in worktree `339-release-writing-defaults`, uncommitted. Nothing is pushed.

A read-only DeepSeek v4.1 flash max review, run through the Devin CLI, returned eight findings. Each was checked against the code before any fix, and seven were fixed. A sentence wrapped across lines had counted as two. A colon had ended a sentence, and a closing quote had stopped one from ending. A list number had counted as a sentence. In the validator, a heading inside a fenced example had switched the testing exemption on, and a heading with closing hashes had not. In `SKILL.md`, the republish was called a default, any publish request counted as the yes and the local tag was never deleted before `git tag -a`. One finding was left, along with one part of another: an em dash counting as a word, and `e.g.` ending a sentence. The voice rules already ban both forms.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Ceilings of 22 words and a 10-word average | The accepted entry has a longest sentence of 18 and a mean of 7.8. Both rejected drafts reach 27 or more and average 11.1 or more, so the gate separates them |
| Test results allowed in one section only | The earlier rule kept test tables out of the story. Evidence in one fixed place keeps that and still shows the proof |
| The body edit runs unasked, the tag move does not | Editing a release body is reversible. Deleting a public tag is not, and `AGENTS.md` makes that wait mandatory |
| Old entries are left as they are | Nothing reruns the shape check on them, and rewriting published history was not asked for |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `pytest -q test_check_changelog_shape.py test_changelog_validator.py test_build_release_notes.py` | 42 passed |
| `run-script-tests.sh` | 56 PASS, 1 failing: `test_readme_verdict_parity.py`, identical output before this change |
| `parent-skill-check.cjs .skilled/skills/sk-doc` | All hard invariants passed, 0 warnings |
| Shape check on v4.0.2.1, v1.5.0.0 and v2.9.8.0 | PASS |
| `validate_document.py` on the seven changed skill docs and both entries | VALID. One warning on the playbook root |
| HVR scan on the changed docs | 0 hard blockers, except one in `SKILL.md` line 53 that HEAD already has |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Older entries fail the new rules.** The v4.0.1.0 and v4.0.0.0 entries stay as models for length and voice only. The template says so.
2. **The sentence rules count words, not difficulty.** A short sentence of hard words still passes. The everyday-word rule in the template covers that by reading.
3. **`test_readme_verdict_parity.py` still fails.** Its baseline names README paths that a regrouping moved. It is outside this packet.
<!-- /ANCHOR:limitations -->

---


