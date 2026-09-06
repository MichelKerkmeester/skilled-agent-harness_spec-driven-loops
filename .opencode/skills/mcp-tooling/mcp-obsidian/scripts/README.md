---
title: "scripts: Obsidian MCP Setup and Diagnostics"
description: "Install and read-only diagnostic scripts for the mcp-obsidian transport, the Obsidian mode of the mcp-tooling hub."
---

# scripts: Obsidian MCP Setup and Diagnostics

---

## 1. OVERVIEW

`scripts/` holds the setup, diagnostic, and verification scripts for `mcp-obsidian`, the Obsidian transport mode of the `mcp-tooling` hub. `install.sh` installs the headless `notesmd-cli`, prints the steps to enable the official `obsidian` CLI, and prints the Obsidian MCP configuration snippet plus its env keys. `doctor.sh` reports the local environment without changing it. `verify-notion-migration-parity.sh` runs an 11-check read-only parity pass against a vault after a Notion-to-Obsidian migration. None of the three scripts writes to `opencode.json`, `.utcp_config.json`, or `.env`; `verify-notion-migration-parity.sh` and `doctor.sh` never write to a vault either, all three only read and print.

---

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `install.sh` | Checks prerequisites (Homebrew, Node for the MCP server), installs `notesmd-cli` via Homebrew (falling back to printed Scoop/AUR/source instructions), prints the in-app steps to enable the official `obsidian` CLI, and prints the `obsidian` MCP manual snippet plus the `obsidian_OBSIDIAN_*` env keys for `.utcp_config.json` / `.env`. Supports `--check-only` and `--mcp-only`. |
| `doctor.sh` | Read-only diagnostics. Reports the platform, Node/npm/npx versions, whether `notesmd-cli` and the official `obsidian` CLI resolve on `PATH`, whether an `obsidian` manual pointing at `obsidian-mcp-server` is registered in `.utcp_config.json`, whether the Local REST API is reachable at `OBSIDIAN_BASE_URL`, and whether `OBSIDIAN_API_KEY` is set (never printing its value). Changes nothing and installs nothing. |
| `verify-notion-migration-parity.sh` | Read-only 11-check migration-parity verifier. Takes `--vault <path>` and an optional `--ledger <path>`; runs standalone against a fresh install with no ledger, or against a full parity report once a migration ledger exists. |

---

## 3. VALIDATION

Run from the repository root.

```bash
bash .opencode/skills/mcp-tooling/mcp-obsidian/scripts/doctor.sh
bash .opencode/skills/mcp-tooling/mcp-obsidian/scripts/install.sh --check-only
bash .opencode/skills/mcp-tooling/mcp-obsidian/scripts/verify-notion-migration-parity.sh --vault /path/to/vault
```

Expected result: `doctor.sh` prints a checklist with no red `✗` lines (warnings for absent optional pieces are expected). `install.sh --check-only` reports the `notesmd-cli` install status without installing anything. `verify-notion-migration-parity.sh` prints one `PASS`/`FAIL`/`SKIP` line per check and a summary count; it exits non-zero only when at least one check reports a real `FAIL`.

---

## 4. VERIFY-NOTION-MIGRATION-PARITY.SH

### Usage

```bash
verify-notion-migration-parity.sh --vault <path> [--ledger <path>]
```

| Flag | Required | Purpose |
|------|----------|---------|
| `--vault <path>` | Yes | The Obsidian vault to verify. |
| `--ledger <path>` | No | A migration ledger JSON file recording the Notion-source values needed for the source-comparison checks below. See the script's own header comment for the exact expected shape (`pages`, `attachments_count`, `databases`, `formulas`, `comments`, `hierarchy`: every key is optional). |
| `-h`, `--help` | No | Print usage and exit. |

### The 11 Checks

| # | Check | Needs a ledger? |
|---|-------|------------------|
| 1 | Page existence: expected pages vs the vault's file list | Yes |
| 2 | Link validation: orphaned `[[wikilinks]]` anywhere in the vault | No, structural |
| 3 | Attachment integrity: non-markdown file count vs the Notion source count | Yes |
| 4 | Database row count: per-folder note count vs the ledger's `row_count` | Yes |
| 5 | Property schema parity. Notion schema vs the frontmatter key union per database | Yes |
| 6 | Formula output accuracy: sampled frontmatter field values vs the Notion source | Yes |
| 7 | Comment count parity: reconstructed `## Comments` sub-headings vs the ledger count | Yes |
| 8 | View count parity: `_database.md` `views:` entries vs the ledger's `views` count | Yes |
| 9 | Hierarchy parity: folder nesting vs the Notion parent tree recorded in the ledger | Yes |
| 10 | Property-type mismatch: frontmatter scanned for broken-conversion tokens (`NaN`, `undefined`, `[object Object]`, unresolved template tags) | No, structural |
| 11 | Relation resolution: every relation value is a resolvable `[[wikilink]]`, never a leftover raw Notion UUID | No, structural |

### SKIP-Without-Ledger Semantics

Checks that compare vault content against a Notion-source value (an expected page list, a source attachment count, a Notion schema, a formula sample, a comment count, a view count, or a parent tree) print `SKIP: no ledger provided` when `--ledger` is omitted, rather than failing. This keeps the script runnable standalone immediately after a fresh plugin install, before any migration has produced a ledger, while the three purely structural checks (link validation, property-type mismatch, relation resolution) always run against the vault regardless of `--ledger`. The script exits non-zero only when a check reports a real `FAIL`; an all-`SKIP`/`PASS` run exits `0`.

---

## 5. RELATED

- [`../README.md`](../README.md)
- [`../SKILL.md`](../SKILL.md)
- [`../INSTALL-GUIDE.md`](../INSTALL-GUIDE.md)
