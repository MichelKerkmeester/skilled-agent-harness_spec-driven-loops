---
title: Iconic Full Rulebook — Usage Guide
description: "Template-conformant Markdown companion for the canonical Iconic automatic-rule payload: rule-class coverage and the safe-merge contract, with iconic-rules.full.json as the exact source."
trigger_phrases:
  - "iconic full rulebook guide"
  - "iconic ruleset coverage"
  - "iconic merge contract"
  - "iconic file rule classes"
  - "iconic folder rule list"
  - "iconic rules companion markdown"
importance_tier: "normal"
contextType: "implementation"
version: 0.7.0.0
---

# Iconic Full Rulebook — Usage Guide

Template-conformant usage companion for the canonical Iconic automatic-rule payload: it maps the two rule classes and the safe-merge contract, while `iconic-rules.full.json` remains the only authoritative full rule content.

## 1. OVERVIEW

### Purpose

`iconic-rules.full.json` is the complete rulebook payload the `mcp-obsidian` skill merges into vault rulebooks, but a 23 KB JSON array is a poor routing and orientation signal. This asset gives an agent the payload's shape — what the two rule classes cover and how to apply them safely — without duplicating any rule object. Agents read this Markdown to navigate and operate the rulebook; the JSON stays the single source of truth for copy/merge operations.

### Usage

- Read this guide to identify rule classes, coverage, and the merge contract before operating Iconic.
- Use [iconic-rules.full.json](./iconic-rules.full.json) (sibling asset) as the exact source for every copy/merge; never transcribe rules from this Markdown.
- Follow Section 4's merge contract for every write into `<vault>/.obsidian/plugins/iconic/data.json`.

---

## 2. PAYLOAD — EXACT SOURCE AND CONTENTS

**Exact source:** [iconic-rules.full.json](./iconic-rules.full.json) — the byte-valid sibling payload holding **all 21 `fileRules` + 11 `folderRules`** as the complete automatic-rule set, normalized across the Obsidian, iCloud, and Barter vaults.

- The payload contains ONLY the two mergeable rule arrays — no `data.json` settings, no `dialogState`, no per-item override maps.
- Every rule object has the shape `{id, name, icon, color, match, conditions, enabled}`; `conditions` use `source: extension` (file rules) or `source: name` (folder rules), with `operator: is | contains`. All rules use `match: any`.
- This Markdown is a usage guide only: it never carries rule ids, icons, colors, or full condition arrays — do not use it as a merge source.

---

## 3. RULE-CLASS COVERAGE

Two rule classes, identified by condition source. The tables below show coverage per rule; exact ids, icons, colors, and condition arrays live in the JSON payload.

### 3.1 `fileRules` — 21 rules, extension-matched

| Rule name | Matched extensions |
| --- | --- |
| Markdown notes | `md` |
| Canvas boards | `canvas` |
| PDF documents | `pdf` |
| Plain text | `txt`, `log`, `text` |
| Images | `png`, `jpg`, `jpeg`, `gif`, `svg`, `webp`, `bmp`, `avif`, `heic` |
| Audio | `mp3`, `wav`, `ogg`, `m4a`, `flac`, `aac`, `opus`, `wma`, `aiff` |
| Video | `mp4`, `mov`, `avi`, `mkv`, `webm`, `m4v`, `wmv`, `flv` |
| Archives | `zip`, `rar`, `7z`, `tar`, `gz`, `bz2`, `xz`, `zst`, `iso` |
| Word documents | `doc`, `docx`, `odt`, `rtf` |
| Spreadsheets | `xls`, `xlsx`, `ods`, `csv`, `tsv` |
| Presentations | `ppt`, `pptx`, `odp` |
| Code | `js`, `jsx`, `ts`, `tsx`, `py`, `rb`, `php`, `go`, `rs`, `java`, `c`, `h`, `cpp`, `hpp`, `cs`, `sh`, `bash`, `zsh`, `ps1`, `swift`, `kt`, `lua`, `pl`, `r`, `scala`, `dart` |
| Web files | `html`, `htm`, `css`, `scss`, `sass`, `less`, `vue`, `svelte` |
| JSON data | `json`, `jsonc` |
| Config files | `yaml`, `yml`, `toml`, `ini`, `cfg`, `conf`, `env` |
| Databases | `db`, `sqlite`, `sqlite3`, `sql` |
| Installers | `exe`, `msi`, `dmg`, `pkg`, `deb`, `rpm`, `apk`, `ipa`, `appimage` |
| Fonts | `ttf`, `otf`, `woff`, `woff2` |
| Ebooks | `epub`, `mobi`, `azw3` |
| Jupyter notebooks | `ipynb` |
| Other files | empty `value` catch-all |

### 3.2 `folderRules` — 11 rules, name-matched

| Rule name | Matched folder names |
| --- | --- |
| Attachment folders | `attachments`, `attachment`, `assets`, `media` |
| Image folders | `images`, `image`, `img`, `pictures`, `photos` |
| Template folders | `templates`, `template`, `_templates` |
| Archive folders | `archives`, `archive`, `backups`, `backup` |
| Project folders | `projects`, `project` |
| Research folders | `research`, `sources`, `reading`, `literature` |
| Code folders | `code`, `dev`, `scripts`, `src`, `source` |
| Daily notes folders | `daily`, `dailies`, `daily-notes`, `journal`, `journals`, `journaling` |
| Inbox folder | `inbox` |
| Knowledge folders | `docs`, `documentation`, `notes`, `knowledge`, `wiki` |
| Zettelkasten folders | `zettelkasten`, `zk`, `slip-box` |

---

## 4. MERGE CONTRACT

Applying the payload to a vault is a merge, never a replace. Every operation follows the same contract:

1. **Fresh-read the vault state** — read `<vault>/.obsidian/plugins/iconic/data.json` immediately before merging; the user may have changed rules in-app since any earlier read.
2. **Back up** — copy `data.json` to `data.json.bak-<timestamp>` (or follow the `maxBackups` rotation) before the first write.
3. **Merge by stable rule `id`** — for each payload rule: update the vault rule when its `id` already exists; append the rule when its `id` is missing. Never reorder or rewrite unrelated rules.
4. **Parse and diff** — write valid JSON, re-parse to verify, and diff against the backup to confirm only the intended rules changed.
5. **Never replace non-rule state** — do not touch `data.json` settings, `dialogState` (UI state), or per-item override maps (`appIcons`, `fileIcons`, `bookmarkIcons`, …). The payload cannot express them, and a whole-file replacement would destroy them.

Rendering is in-app: after a verified merge, icons appear after an Obsidian reload; the file-layer claim is verified by JSON round-trip only.

---

## 5. RELATED RESOURCES

- [Iconic plugin index](../../../references/plugins/iconic/iconic.md) — plugin identity, file-layer surface, gotchas
- [Iconic data model](../../../references/plugins/iconic/data-model.md) — `data.json` top-level keys and rulebook schema
- [Iconic workflows](../../../references/plugins/iconic/workflows.md) — file-layer recipes, including apply-rulebook
- [iconic-rules.example.json](./iconic-rules.example.json) — compact schema sample (2 file + 1 folder rules)
