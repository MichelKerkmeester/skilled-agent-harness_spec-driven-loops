---
title: "Implementation Summary: Phase 1: relocate"
description: "Promoted 4 sk-doc asset items to assets/ root and deleted the empty agents/ subfolder. Single atomic commit; references still point to OLD paths (Phase 2 closes that gap)."
trigger_phrases:
  - "068/001 summary"
  - "relocate summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "068-sk-doc-organization/001-relocate"
    last_updated_at: "2026-05-05T08:20:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "Phase 1 complete: 4 git mv + rmdir + commit ccd73ef55"
    next_safe_action: "Begin Phase 2 (002-update-and-mirror): substring sweep across canonical .opencode/"
    blockers: []
    key_files:
      - .opencode/skills/sk-doc/assets/agent_template.md
      - .opencode/skills/sk-doc/assets/command_template.md
      - .opencode/skills/sk-doc/assets/feature_catalog/
      - .opencode/skills/sk-doc/assets/testing_playbook/
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase1-complete"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 068-sk-doc-organization/001-relocate |
| **Completed** | 2026-05-05 |
| **Level** | 1 |
| **Commit** | ccd73ef55 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

You can now access sk-doc's heavy-traffic templates one folder shallower. The `agent_template.md` and `command_template.md` files moved up out of `assets/agents/`, the `feature_catalog/` and `testing_playbook/` package folders moved up out of `assets/documentation/`, and the empty `assets/agents/` subfolder is physically gone. References across sk-doc internal docs, /create:* commands, and the @create agent still point to the old paths — Phase 2 (002-update-and-mirror) closes that gap with a 4-pattern fixed-string substring sweep.

### Asset Promotion to assets/ root

The four moved items are the sk-doc skill's most frequently loaded templates. Promoting them to `assets/` root removes a redundant level of nesting (the `agents/` subfolder held only these two files; the `documentation/` subfolder held many other templates plus these two package folders). Loading paths are now shorter and more uniform across the asset surface.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-doc/assets/feature_catalog/` | Moved (was `assets/documentation/feature_catalog/`) | 2 inner files (`feature_catalog_template.md`, `feature_catalog_snippet_template.md`) preserved |
| `.opencode/skills/sk-doc/assets/testing_playbook/` | Moved (was `assets/documentation/testing_playbook/`) | 2 inner files (`manual_testing_playbook_template.md`, `manual_testing_playbook_snippet_template.md`) preserved |
| `.opencode/skills/sk-doc/assets/agent_template.md` | Moved (was `assets/agents/agent_template.md`) | 30,668 bytes preserved (byte-identical) |
| `.opencode/skills/sk-doc/assets/command_template.md` | Moved (was `assets/agents/command_template.md`) | 35,277 bytes preserved (byte-identical) |
| `.opencode/skills/sk-doc/assets/agents/` | Deleted | Empty after moves; physical `rmdir`, no archive |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Single atomic Bash chain: 4 `git mv` operations + 1 `rmdir`, with `&&` short-circuit semantics so any failure halts the rest. After the chain succeeded, `git status --porcelain` showed exactly 6 R-lines (the 4 mv operations expanded to 6 renames because `feature_catalog/` and `testing_playbook/` each had 2 inner files). One commit on main: `ccd73ef55 feat(sk-doc): relocate feature_catalog/testing_playbook/templates to assets/ root (068/001)`.

No feature branch was created (memory rule: stay on main; `--skip-branch` flag honored at scaffold time).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Use `git mv` instead of `mv` + `git add` | Preserves git rename detection so `git log --follow` works after the move |
| Single atomic Bash chain instead of cli-codex dispatch | Phase 1 is 5 simple commands; codex's parallelism doesn't help here, and direct execution avoids the codex sandbox-mode roundtrip |
| Rmdir requires empty folder (not `rm -rf`) | Asserts the empty-state precondition; if anything other than the 2 templates was inside, halts loudly |
| Granular per-phase commit | Enables surgical `git reset --hard ccd73ef55` rollback if Phase 2 or Phase 3 surfaces an issue |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `ls -la .opencode/skills/sk-doc/assets/` shows new layout | PASS — 4 promoted items + documentation/ + flowcharts/ + skill/ + template_rules.json |
| `test ! -e .opencode/skills/sk-doc/assets/agents` | PASS — `OK: agents/ deleted` |
| `git status --porcelain` shows 6 R-lines | PASS — 6 staged renames pre-commit |
| `git log -1 --format=%H %s` matches commit message | PASS — `ccd73ef55 feat(sk-doc): relocate feature_catalog/testing_playbook/templates to assets/ root (068/001)` |
| `git branch --show-current` | PASS — `main` |
| Inner content preservation | PASS — `feature_catalog/` has 2 files, `testing_playbook/` has 2 files |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **References still point to OLD paths.** sk-doc internal docs, /create:* commands × 4 runtimes, the @create agent × 4 runtimes, and the OpenCode install guide all still reference `assets/documentation/feature_catalog/`, `assets/documentation/testing_playbook/`, `assets/agents/agent_template.md`, and `assets/agents/command_template.md`. This is expected — Phase 2 (002-update-and-mirror) closes the gap with a 4-pattern fixed-string substring sweep across the canonical `.opencode/` and replication to the other 3 runtime mirrors. Phase 1 alone is NOT shippable; the whole packet must complete before sk-doc functions correctly again.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
