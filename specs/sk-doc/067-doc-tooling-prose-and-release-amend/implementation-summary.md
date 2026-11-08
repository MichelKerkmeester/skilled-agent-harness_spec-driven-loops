---
title: "Implementation Summary: Doc tooling fixes found while writing the install guide and v4.0.2.0 notes"
description: "Four doc tools now do the right thing on their own: README rules favour short paragraphs, a published release can be amended from its entry, a merge keeps doc versions and a product name no longer counts as a blocker word."
trigger_phrases:
  - "doc tooling prose and release amend implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/067-doc-tooling-prose-and-release-amend"
    last_updated_at: "2026-11-08T14:18:54Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Four doc tool fixes shipped with tests"
    next_safe_action: "None; packet complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "067-doc-tooling-prose-and-release-amend"
      parent_session_id: null
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
| **Spec Folder** | 067-doc-tooling-prose-and-release-amend |
| **Completed** | 2026-11-08 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Four doc tools that needed a manual workaround this session now work on their own. The next README reads as prose, a release amend is one command, a merge leaves versions alone and a product name scans clean.

### Four Tool Fixes

The README rules now ask for short paragraphs and keep bullets for things a reader scans. A long install moves to a root install document, and section spacing follows one rule. The changelog mode builds a release body with one script and can amend a published release. The version engine skips a doc a merge brings in unchanged. The voice scan exempts listed product names, while the bare word still counts.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-doc/sk-create-readme/` (SKILL, template, two references) | Modified | Prose, install-document and spacing rules |
| `.skilled/skills/sk-doc/sk-create-changelog/scripts/build_release_notes.py` | Created | Release body builder |
| `.skilled/skills/sk-doc/scripts/tests/test_build_release_notes.py` | Created | Builder tests |
| `.skilled/skills/sk-doc/sk-create-changelog/SKILL.md`, `scripts/README.md`, `create-changelog-*.yaml` | Modified | Amend path, ordering rule, builder wiring |
| `.skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs` | Modified | Merge-aware raise |
| `.skilled/scripts/git-hooks/tests/pre-commit.test.sh` | Modified | Two merge cases |
| `.skilled/skills/sk-doc/sk-create-with-human-voice/` (scanner, rules, test) | Modified | Proper-name exemption |
| `.skilled/skills/sk-doc/scripts/tests/code-folder/baseline-readme-verdicts.json` | Modified | The README.md entry drops its fixed bare-URL warning |
| `README.md` | Modified | Uniform `&nbsp;` spacing |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The orchestrator wrote the README, changelog and voice changes. A fresh Opus high worker fixed the version engine and added its hook tests. Each script change was proven against the old code: the new test failed there and passed after.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fix the merge case in the engine, not the hook | `bump` runs its own diff against HEAD and never reads the hook's staged list |
| Exempt exact listed names, not capitalised words | A list is explicit and keeps `harness the power` a blocker |
| Say "install document" in the README rules | A routing contract blocks the phrase "install guide", whose authoring mode was retired |
| Update one baseline entry, not the whole verdict baseline | A full rebuild pulled in 155 READMEs the baseline never covered |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `pre-commit.test.sh` | 159/0 before, 163/0 after. The merged-in case fails on the old engine |
| `test_build_release_notes.py` | 4 of 4 pass. The output equals the published v4.0.2.0 body |
| `test_hvr_scan.py` | ALL PASS. The proper-name check fails on the old scanner |
| `install-guide-contract.test.cjs` | 4 of 4 pass |
| `hvr_scan.py README.md` | 0 hard blockers, 94/100 (was 9 and 49) |
| README spacing diff | Only `&nbsp;` and blank lines change |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Two suite failures come from main.** `test_readme_manifest.py` lacks main's new benchmark folders, and the verdict baseline still names a README main's track rename moved. Their owners refresh them.
2. **The `v4.0.2.0` tag stays on `a7b158d712`.** Moving it is blocked, and the later commits change only docs.
<!-- /ANCHOR:limitations -->

---
