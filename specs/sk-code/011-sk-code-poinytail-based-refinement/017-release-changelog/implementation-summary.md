---
title: "Implementation Summary"
description: "The v4.0.0.4 release entry now carries the user-facing changes of the sk-code refinement epic and the feature catalog anchor track, in two extended sections, five new ones and five upgrade notes."
trigger_phrases:
  - "release changelog implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/017-release-changelog"
    last_updated_at: "2026-10-11T19:00:00Z"
    last_updated_by: "release-changelog-orchestrator"
    recent_action: "Closed the phase with every goal criterion passing"
    next_safe_action: "Operator reviews the worktree branch before it merges"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "summary-017-release-changelog"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 017-release-changelog |
| **Completed** | 2026-10-11 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A reader of the v4.0.0.4 release entry now learns what the refinement epic and the catalog anchor track changed for them. A third opening paragraph names the story. Commit and Pull Request Checks gained the skill authoring gate and the Codex and Hermes mirror checks, and Deep Loop Modes gained the case line and reducer fixes. Five new sections cover the code skill, the agents and repo rules, the hooks and dispatch guards, skill routing and skill authoring. Upgrade Notes gained the Node floor, the script renames, the retired catalog comment, the changelog version key and the commit check bypass.

Internal work stayed out: the research and review rounds, goal refreshes, version bumps, Hermes copies, canary and test pins and trigger index rebuilds.

A second pass on 2026-10-11 aligned the whole entry with the current tree for external readers. The glance list now gives each theme one payoff line, with the code skill, hooks, routing and skill authoring themes taking the slots of the internal packet move and the closed follow-ups. Why This Release names the code-side gap. The create.sh unknown-option refusal and the router-sync git-ignore skip were added, and the README template change was noted. Entries that only this repository's maintainers would notice were cut: the 21-packet regroup and its upgrade note, test hygiene, README path fixes, workflow linting, the hostile-name tests and the template cache. The two Gate 3 child-worker items, which said the same thing, became one.

A third pass on 2026-10-14 folded in everything that landed after the entry was last edited. The operator chose one release over two, so the separate v4.0.0.5 note, which covered the external surface build, was merged in and deleted. A new Adapting the Code Skill section covers OpenCode as the native surface, the fresh-clone guide, new surfaces ranked ahead of OpenCode, check 5l, examples that can be removed, failures that name their fix and `/doctor:sk-code setup`. Commit and Pull Request Checks gained the Commit-Id hooks, Tooling Changes gained Pi Fast Mode on by default and Upgrade Notes gained four actions. The glance list went from 14 bullets back to the template's 12, and the topic phrases back to two.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/changelog/skilled/v4.0.0.4.md` | Modify | Release entries |
| `.skilled/changelog/skilled/v4.0.0.5.md` | Delete | Folded into v4.0.0.4 |
| This phase's docs and the parent `spec.md` and `goal.md` | Create/Modify | Phase record |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The inventory came from the bodies of the 92 non-spec commits whose Spec trailer names either track, with each cited path, flag and script name checked against the tree. The earlier release entries predate both tracks, and v4.0.0.4's own leaf manifest item covers dot-named folders, a different fix from the git-ignored one added here.

### Dispatches

| Brief | Route | Result |
|-------|-------|--------|
| None | Not applicable | Written by the orchestrator |
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Glance list left at 12 bullets | The template caps it at 12, so the third opening paragraph carries the story |
| Glance list rebalanced in the second pass | The template gives each theme one payoff line, so related bullets were merged and internal ones dropped to fit the four code-side themes |
| Skill versions not named | No Skilled release entry names them |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| hvr_scan.py before the edit | 0 hard blockers, 97/100 |
| hvr_scan.py after the edit | 0 hard blockers, 97/100 |
| hvr_scan.py after the second pass | 0 hard blockers, 98/100 |
| validate_document.py | VALID, 0 issues |
| extract_structure.py | exit 0 |
| hvr_scan.py after the third pass | 0 hard blockers, 95/100, the same as before it |
| validate_document.py after the third pass | VALID, 0 issues |
| generate-trigger-index.mjs --check after the rebuild | exit 0 |
| validate.sh parent --recursive --strict | RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. The frontmatter description and trigger phrases still name only the spec repair story, because the template caps the description at 250 characters and the topic phrases at two.
<!-- /ANCHOR:limitations -->

---
