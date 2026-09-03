# Implementation Summary — mcp-obsidian + hub post-audit fixes

## Final state: complete — shipped to v4

All three defects from the two fresh-Opus audits (mcp-obsidian mode skill + mcp-tooling parent integration) are fixed and verified.

## What changed

- **Fix 1 — 8 playbook tie-in files** (`charts-render-block`, `dataview-metadata-query`, `excalidraw-drawing-note`, `git-status-roundtrip`, `health-md-data`, `iconic-rules`, `minimal-theme-activation`, `outliner-settings-defaults`): appended the missing `## SOURCE FILES` (Playbook Sources + Implementation And Test Anchors tables) and `## SOURCE METADATA` sections, mirroring `brat-headless-install.md`, each populated with the plugin's real sibling docs/assets. Authored by 8 parallel `gpt-5.6-luna` (max/fast) agents.
- **Fix 2 — hub version drift**: `mcp-tooling/SKILL.md` `1.3.2.0 → 1.4.2.0`, restoring parity with `description.json` (canonical per the newest changelog `v1.4.2.0.md`).
- **Fix 3 — mcp-magnific removal** (operator-directed): removed the unregistered scaffold skill dir `skills/mcp-tooling/mcp-magnific/` (5 files) and its related spec packet `specs/mcp-tooling/014-mcp-magnific/` (66 files); repaired the track parent `graph-metadata.json` (dropped `014` from `children_ids`, repointed `last_active_child_id` to `013-mcp-obsidian`).

## How

Isolated worktree from `origin/skilled/v4.0.0.0`. The substantive doc authoring (8 files) fanned out to fresh cli-codex luna agents with Gate-3 pre-resolved; the one-line version bump and the removal were done directly (an agent for either would be waste). The zsh non-word-splitting trap bit the first verification pass — re-run with a proper array gave the real result.

## Verification (all passed)

- **Fix 1:** `validate_document.py` **8/8 VALID** (absolute path → correct `playbook_feature` detection); every file additive-only (**0** content lines removed); **0** dangling links in the new SOURCE FILES sections.
- **Fix 2:** `SKILL.md` == `description.json` == `1.4.2.0`.
- **Fix 3:** `parent-skill-check.cjs` on the hub **exits 0** (rule 6a cleared, was exit 1); parent `graph-metadata.json` valid JSON with **0** magnific refs; repo-wide sweep shows the only remaining `mcp-magnific` mention is the intentional historical note in `013-mcp-obsidian/handover.md`.
- **Scope:** 81 staged files, **0** outside `skills/mcp-tooling/` + `specs/mcp-tooling/`; leaf-manifest unchanged.

## Scar tissue

- `validate_document.py` doc-type detection is **path-sensitive** — a bare relative path misdetects `playbook_feature` files as `readme` and passes; only absolute/`./`-prefixed paths detect correctly. This is why the 8 broken files slipped earlier casual validation. Always validate with an absolute path.
- Packet 014 was **66 files**, not a stub. Removal was explicitly operator-directed and is fully reversible via `git revert` of the single commit (also in origin history).
- The two audit "observations" (SKILL.md §8 lists 4/11 plugins; 27123 vs 27124 ports) were confirmed non-bugs and intentionally left.
