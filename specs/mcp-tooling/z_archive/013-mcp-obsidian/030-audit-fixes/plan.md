---
title: "Plan — mcp-obsidian + hub post-audit fixes"
description: "Approach for the eight playbook closers, the hub version bump, and the operator-directed mcp-magnific removal, with per-fix verification."
trigger_phrases:
  - "post-audit fixes plan"
  - "playbook closer dispatch"
  - "magnific removal plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/z_archive/013-mcp-obsidian/030-audit-fixes"
    last_updated_at: "2026-10-07T00:00:00Z"
    last_updated_by: "packet-reconstruction"
    recent_action: "No continuity update was recorded"
    next_safe_action: "None, the packet is archived"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "packet-reconstruction"
      parent_session_id: null
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan — mcp-obsidian + hub post-audit fixes

<!-- ANCHOR:summary -->
## Approach

Done in an isolated worktree from `origin/skilled/v4.0.0.0`; the substantive doc-authoring fanned out to fresh CLI agents, the trivial/decision items done directly.

1. **Fix 1 — 8 playbook files (fresh agents).** Dispatch 8 parallel `cli-codex gpt-5.6-luna` max/fast agents, one per file, each appending `## SOURCE FILES` (Playbook Sources + Implementation And Test Anchors) + `## SOURCE METADATA` mirroring `brat-headless-install.md`, populating each with the plugin's real sibling docs/assets verified on disk. Gate-3 pre-resolved in the prompt.
2. **Fix 2 — version bump (direct).** One-line `SKILL.md` frontmatter edit `1.3.2.0 → 1.4.2.0` (an agent for one line is waste). Direction confirmed by the newest changelog `v1.4.2.0.md`.
3. **Fix 3 — mcp-magnific removal (direct, operator-directed).** `git rm -r` the skill dir + packet `014-mcp-magnific`; repair the track parent `graph-metadata.json` (drop `014` from `children_ids`, repoint `last_active_child_id` to `013-mcp-obsidian`).
4. **Verify + ship** — per-file validator, additive-only + link checks, version parity, `parent-skill-check` exit 0, dangling-magnific sweep; commit + push to v4.

<!-- /ANCHOR:summary -->

<!-- ANCHOR:affected-surfaces -->
## Critical files

- Fixed: `manual-testing-playbook/plugin-tie-ins/{charts-render-block,dataview-metadata-query,excalidraw-drawing-note,git-status-roundtrip,health-md-data,iconic-rules,minimal-theme-activation,outliner-settings-defaults}.md`.
- `mcp-tooling/SKILL.md` (version); `specs/mcp-tooling/graph-metadata.json` (parent children).
- Removed: `skills/mcp-tooling/mcp-magnific/` (5), `specs/mcp-tooling/014-mcp-magnific/` (66).

<!-- /ANCHOR:affected-surfaces -->

<!-- ANCHOR:testing -->
## Verification

- `validate_document.py` VALID on all 8 (absolute path → correct `playbook_feature` detection); 0 content lines removed; 0 dangling links.
- `SKILL.md` == `description.json` == `1.4.2.0`.
- `parent-skill-check.cjs` on the hub exits 0 (rule 6a cleared); parent `graph-metadata.json` valid JSON, 0 magnific refs.
- Staged diff: 0 files outside `skills/mcp-tooling/` + `specs/mcp-tooling/`.

<!-- /ANCHOR:testing -->

<!-- ANCHOR:rollback -->
## Risk note

Low-to-moderate blast, fully reversible. The 8-file fix and version bump are additive/trivial. The removal is the one real deletion — packet 014 is **66 files** (larger than a stub); it was explicitly operator-directed and is recoverable in full via `git revert` of the single commit (also preserved in origin history).
<!-- /ANCHOR:rollback -->