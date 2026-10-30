---
title: "Implementation Summary"
description: "Tracked files outside specs no longer name the operator's personal account name, apart from real repository addresses and one upgrade sentence. The orphan-sweep launch agent is now com.skilled.orphan-sweep."
trigger_phrases:
  - "personal name scrub implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-git/036-personal-name-scrub"
    last_updated_at: "2026-10-29T23:40:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Scrubbed the account name outside specs and renamed the launch agent"
    next_safe_action: "Operator reviews the diff and commits it"
    blockers: []
    key_files:
      - ".skilled/scripts/launchagents/com.skilled.orphan-sweep.plist"
      - ".skilled/scripts/launchagents/README.md"
      - ".skilled/skills/system-spec-kit/runtime/cli/continuity/migrate-trigger-phrase-residual.ts"
      - ".skilled/changelog/skilled/v4.0.1.0.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-036-personal-name-scrub"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Should the donation link in README.md stay?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 036-personal-name-scrub |
| **Completed** | 2026-10-29 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

A clone of the repository no longer reads the operator's personal account name anywhere outside `specs/`, except in the real repository addresses and one upgrade sentence. The orphan-sweep launch agent now installs as `com.skilled.orphan-sweep` and fills in its own paths as it is copied.

### Remove the operator's personal account name from tracked files outside specs and rename the orphan-sweep launch agent

The affected files dropped from 512 to 10. Skill docs, playbooks and recorded benchmark evidence name repository-relative paths, or `~/` paths for files outside the repository, and no recorded number or result changed. The launch agent template holds two placeholders, `/absolute/path/to/repo` and `/absolute/path/to/home`, because launchd needs absolute paths. Its README's install command replaces them with `sed` while copying, so the copy-then-remove-`--dry-run` story still works.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/scripts/launchagents/com.skilled.orphan-sweep.plist` | Renamed and modified | New file name, label and path placeholders |
| `.skilled/scripts/launchagents/README.md` | Modified | New label, placeholder install step and the upgrade sentence |
| `.skilled/skills/system-spec-kit/runtime/cli/continuity/migrate-trigger-phrase-residual.ts` | Modified | Derives the Claude Code project folder name from the repository root |
| `.skilled/skills/cli-classifier/cli-jev/benchmark/reports/2026-09-20-post-migration-reverification/raw/leak-check.py` | Modified | Expands its home path with `os.path.expanduser` |
| `.skilled/skills/system-deep-loop/runtime/database/council-graph.sqlite` | Modified | Two `spec_folder` values made repository-relative, then vacuumed |
| `.skilled/changelog/skilled/v4.0.1.0.md` | Extended | Framework changelog entry for the rename, folded into the v4.0.1.0 release |
| 498 other docs, playbooks, benchmark reports and fixtures outside `specs/` | Modified | Repository-relative and `~/` paths |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

The routing replay and every gate ran first to set a baseline. The plist moved with `git mv`, then one Python rewrite changed 499 files and refused any JSON or JSONL file that stopped parsing. Hand edits covered the code, the launch agent, four playbook lines and the database. The same gates ran again from the final tree. Nothing is committed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Option over environment variable: one run can pick a different count without editing config. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| Placeholders plus a `sed` install step for the plist | A plain copy of placeholder paths would install an agent launchd cannot run, and the `sed` copy keeps the install to one command |
| The upgrade note also deletes the old plist | `launchctl bootout` only unloads an agent, and a plist left in `~/Library/LaunchAgents` loads again at the next login |
| `user` for the `ls -la` owner column and a bare account token | Those are recorded outputs with no path to make relative, and a neutral word keeps the columns readable |
| The donation link and repository slugs stay | They are real addresses, and changing them breaks the links |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `ls logs/archive | wc -l` after `--keep 3`: 3. After a plain run: 10. Suite: PASSED. WEAK: All tests pass. -->

| Check | Result |
|-------|--------|
| `git grep -il "$(id -un)" -- ":!specs/" \| wc -l` | PASS: 10, against 512 at HEAD, each one a kept address or the upgrade sentence |
| `git ls-files \| grep -v '^specs/' \| grep -ic "$(id -un)"` | PASS: 0 |
| `leaf-route-replay.cjs \| grep ^total` | PASS: `total gold=65 scored=57 tied=3 mean_f1=0.9176 exact=50`, before and after |
| `compiled-route-guard.cjs \| tail -1` | PASS: `All hubs fresh or excused`, before and after |
| `sync-skills-hermes.cjs --check` | PASS: `PASS: 65 Hermes skill copies in sync`, before and after |
| `check-markdown-links.cjs` | PASS: 7632 files, 14362 links, 0 broken, before and after |
| `package_skill.py --check --strict` on 23 skill roots | PASS: `Result: PASS` on all 23, before and after |
| Phase 6 migration vitest and `tsc --noEmit` | PASS: 1 of 1 tests, tsc exit 0 |
| Council graph script vitest | PASS: 10 of 10 tests |
| `validate_document.py` on 243 changed docs | PASS: 4 report issues, each the same at HEAD |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **Git history still holds the name.** Earlier commits and the dated records under `specs/` keep it, because this packet changes the working tree only. Rewriting history is a separate decision for the operator.
2. **Doc versions are not raised here.** The pre-commit doc-version gate raises each changed doc's version when the change is committed.
<!-- /ANCHOR:limitations -->

---


