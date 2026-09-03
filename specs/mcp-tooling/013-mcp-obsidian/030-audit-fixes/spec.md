# Spec — mcp-obsidian + hub post-audit fixes

## Status

- **Level:** 1
- **State:** complete
- **Type:** Documentation conformance + hub metadata + scaffold removal (no runtime code)

## Purpose

Fix the three defects from the two fresh-Opus bug audits of the `mcp-obsidian` mode skill and its `mcp-tooling` parent integration.

## Scope

- **Fix 1 (mcp-obsidian):** 8 of 11 plugin tie-in playbook files were missing their required `## SOURCE FILES` + `## SOURCE METADATA` closers and failed `validate_document.py` (type `playbook_feature`). Append both sections to each, mirroring `brat-headless-install.md`.
- **Fix 2 (hub metadata):** `mcp-tooling/SKILL.md` version `1.3.2.0` disagreed with `description.json` `1.4.2.0` — the only fleet hub with the mismatch. Bump `SKILL.md` to the canonical `1.4.2.0` (matches the newest changelog `v1.4.2.0.md`).
- **Fix 3 (hub gate, operator-directed):** `mcp-magnific/` was an unregistered scaffold mode dir failing `parent-skill-check` rule 6a (exit 1). Per operator decision, remove the scaffold skill dir **and** its related spec packet `014-mcp-magnific`, and repair the track parent's `graph-metadata.json`.
- **Out of scope:** the two minor audit observations (SKILL.md §8 human index lists 4/11 plugins; 27123-vs-27124 port mentions) — both confirmed non-bugs.

## Acceptance criteria

- AC1: all 8 tie-in files pass `validate_document.py`, additive-only (0 content lines removed), 0 dangling links in the new sections.
- AC2: `mcp-tooling/SKILL.md` and `description.json` both read `1.4.2.0`.
- AC3: `mcp-magnific/` + `014-mcp-magnific/` removed; `parent-skill-check` on the hub exits 0; no dangling `mcp-magnific` reference remains except the intentional historical mention in `013-mcp-obsidian/handover.md`.

## Outcome

All met. Shipped to v4. The 8 playbook files were fixed by 8 parallel `gpt-5.6-luna` (max/fast) agents; the version bump and removal were done directly. Details in `implementation-summary.md`.
