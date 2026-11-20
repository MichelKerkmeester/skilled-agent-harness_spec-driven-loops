---
title: "Implementation Summary"
description: "Every Skilled hook, plugin and extension is now reachable from .skilled/hooks, and 29 conversation scenarios dropped a suffix no rule asked for."
trigger_phrases:
  - "hub index gap links implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/hook-platform/007-hub-index-gap-links"
    last_updated_at: "2026-11-15T15:00:06Z"
    last_updated_by: "generate-context"
    recent_action: "Linked missing hooks and renamed scenarios"
    next_safe_action: "Commit and push after operator approval"
    packet_purpose: "Purpose: Every Skilled hook, plugin and extension is reachable from `.skilled/hooks`, and conversation scenarios without a single-prompt twin carry plain kebab-case names."
    blockers: []
    key_files:
      - ".skilled/hooks/README.md"
    session_dedup:
      fingerprint: "sha256:ab863d3c31e398002f7ea4c7c4687ccd7821df5fba7082a625e08bb2fdbb2656"
      session_id: "scaffold-007-hub-index-gap-links"
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
| **Spec Folder** | 007-hub-index-gap-links |
| **Completed** | 2026-11-15 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

You can now browse any concern folder in `.skilled/hooks` and find every runtime that runs it, Vibe included. Twelve Vibe guard scripts and two OpenCode plugins were the only Skilled hooks the hub never linked.

### Hook hub index gap links and conversation scenario renames

Each Vibe guard script in `.vibe/plugins/repo-guards/` now has a relative symlink under its concern's `vibe/` folder, the same mirror direction OpenCode uses, because Vibe runs the scripts from its own folder. `ask-surface-guard.js` and `decision-capture.js` got the `opencode/` mirror the other OpenCode plugins already had. The 29 conversation scenarios in the cli-external-orchestration playbooks that have no single-prompt twin dropped the `-conversation` suffix, and every live link moved with them.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/<concern>/vibe/*.mjs` (12) | Created | Links to the Vibe guard scripts |
| `.skilled/hooks/ask-surface-guard/opencode/ask-surface-guard.js`, `.skilled/hooks/decision-capture/opencode/decision-capture.js` | Created | Links to the two unmirrored OpenCode plugins |
| `.skilled/hooks/README.md` | Modified | Tree, index paragraphs, Key Files row and wiring row name the links |
| Eight concern `README.md` files | Modified | Each tree lists its `vibe/` link |
| 27 Vibe and 2 hub scenario files | Renamed | Dropped the `-conversation` suffix |
| Vibe and hub playbook indexes, `session-handover-vibe.md` | Modified | Links and runner commands use the new names |
| Trigger index and retrieval fixtures | Regenerated | Paths follow the renames |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Four DeepSeek V4.1 Flash workers sorted each unlinked file into imports a core, documented exception, third-party, support file or gap, and checked every registration in the runtime configs. The two gaps they reported were confirmed by reading the files and folders. The links were added in worktree 412, the renames were made with `git mv`, and a script rewrote only the references that resolve to a renamed path, which left the same-named `mcp-code-mode` scenario alone. The coverage scan, the link checker, the playbook validator and the hook suites ran from the final tree.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Spec folder: new `hook-platform/007-hub-index-gap-links` | Operator answer to the documentation question, as a sibling of the packet that built the hub index |
| Workspace: a new git worktree | Operator answer. It kept the primary checkout and other sessions' files untouched |
| Link `decision-capture.js` too | Operator answer. The README called it a deliberate exception, but it was the one OpenCode plugin left without a mirror |
| Rename across all CLI playbooks, skipping colliding twins | Operator answer. The 11 files whose plain name matches a single-prompt twin keep the suffix, because it is the only thing that tells the two apart |
| Mirror links point from the hub to the runtime folder | Vibe and OpenCode load from fixed folders, so the real file stays there and the hub link is for browsing only, as the existing OpenCode mirrors do |
| Leave spec-folder history on the old paths | Those docs record past runs and the link checker does not scan them |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Coverage scan | PASS: linked 94 before, 108 after, 0 dangling |
| `check-markdown-links.cjs` | PASS: 7604 files, 14910 links, 0 broken |
| `validate-playbook-package.cjs` | PASS: Vibe 52 scenarios and hub 27, 0 violations. system-spec-kit exit 0 with two warnings in untouched files |
| `sync-runtime-mirrors.cjs --check` | PASS: 257 mirrors in sync |
| Hook vitest suites | PASS: 501/501 |
| OpenCode plugin tests | PASS: 591/591 |
| node:test hook collection | 1836/1837 before the rebase. The failure at `hook-stdin-deadline.test.mjs:172` also failed with this change stashed and on main. After rebasing onto `acfa9f0ffa1` that file passes 22/22 |
| `package_skill.py --check --strict` | PASS for cli-external-orchestration, cli-mistral-vibe and system-spec-kit |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Eleven conversation scenarios keep the suffix.** Each one sits next to a single-prompt file with the same stem, so renaming would collide. Rename the pair together if the single-prompt file ever goes away.
2. **The hub README warns that `RELATED` is not its last H2.** That warning predates this change and was left alone.
<!-- /ANCHOR:limitations -->

---
