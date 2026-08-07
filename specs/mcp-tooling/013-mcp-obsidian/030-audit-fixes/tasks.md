# Tasks — mcp-obsidian + hub post-audit fixes

- [x] T1: Dispatch 8 parallel `cli-codex gpt-5.6-luna` max/fast agents (one per file) to append `## SOURCE FILES` + `## SOURCE METADATA` to the 8 non-conformant tie-in files.
- [x] T2: Verify all 8 — `validate_document.py` VALID, additive-only (0 removed), 0 dangling links. **8/8 pass.**
- [x] T3: Bump `mcp-tooling/SKILL.md` version `1.3.2.0 → 1.4.2.0`; confirm parity with `description.json`.
- [x] T4: Remove `skills/mcp-tooling/mcp-magnific/` + `specs/mcp-tooling/014-mcp-magnific/` (operator-directed).
- [x] T5: Repair track parent `graph-metadata.json` — drop `014` from `children_ids`, repoint `last_active_child_id` to `013-mcp-obsidian`; confirm valid JSON.
- [x] T6: Confirm `parent-skill-check.cjs` on the hub exits 0 (rule 6a cleared) + no dangling magnific refs except the historical `handover.md` mention.
- [x] T7: Scope + leaf-manifest sweep (0 outside scope, manifest unchanged); commit + push to v4.
