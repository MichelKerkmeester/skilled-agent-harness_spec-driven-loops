---
title: "Iteration 6: Files, Attachments & Comments Carry-Over"
trigger_phrases: []
---
# Iteration 6: Files, Attachments & Comments Carry-Over

## Focus

Verify the carry-over path for three Notion artifacts the prior findings did not exhaustively resolve: (a) file uploads / attachments, (b) page/discussion comments, and (c) cover images. For each, determine what the importer carries automatically, what is a gap, and the mcp-notion-reads / mcp-obsidian-writes path to close the gap.

## Findings

### F6.1 — Attachments: the importer carries them (with options)

The importer downloads attachments into the vault's attachment folder (Settings → File & links location) with correct `![]()` embeds. `ATTACHMENT_CONFIGS` defines per-type behavior: [SOURCE: github.com/obsidianmd/obsidian-importer/blob/d4e05b71/src/formats/notion-api/block-converter.ts]

| Type | Embed? | Fallback text | Notion block |
|---|---|---|---|
| IMAGE | yes (`![](...)`) | "Image" | `image` |
| VIDEO | yes | "Video" | `video` |
| PDF | yes | "PDF" | `pdf` |
| FILE | no (link) | "File" | `file` |

Options that shape attachment carry-over: [SOURCE: github.com/.../notion-api.ts]
- `downloadExternalAttachments` (default **false**) — when true, downloads external-URL attachments as local files; when false, leaves external links as-is.
- `incrementalImport` (default false) — skips downloading attachments that already exist with the same file size (dedupe by filename + size).
- Attachments are placed relative to the importing file's folder (`currentFileFolderPath`).

**Gap:** gallery-view cover images are reported as not imported (PR #444 test feedback). [SOURCE: github.com/obsidianmd/obsidian-importer/pull/444]

### F6.2 — File-property attachments (the `files` property type)

Notion `files` properties (file attachments as page metadata, not block content) are handled by `extractFrontMatter` with file-download parameters (`vault`, `app`, `currentFilePath`, `downloadExternalAttachments`, `onAttachmentDownloaded`). [SOURCE: github.com/.../api-helpers.ts] (`ExtractFrontMatterParams`)

So `files`-property attachments ARE downloaded and referenced — but verify the frontmatter shape (likely a path list or `![]()` string) post-import.

### F6.3 — Cover images → frontmatter property

Page covers are stored as a frontmatter property named by `coverPropertyName` (default `cover`). The cover image itself is downloaded as an attachment. [SOURCE: github.com/.../notion-api.ts] This is a **non-standard** Obsidian pattern (Obsidian covers are app-managed, not frontmatter), so the cover becomes a frontmatter field that a Bases/Dataview view can surface, not a rendered Obsidian cover. Reconstruction option: set the note's cover via the file-layer is not possible (cover is app-managed); accept the frontmatter field as the parity record.

### F6.4 — Comments: confirmed gap — the importer does not carry discussion comments

The importer's enumerated conversion surface (block converter, 20+ block types, rich text, attachments, synced blocks, databases) has **no comment handling**. The Notion API exposes comment endpoints (`GET /v1/comments`, `POST /v1/comments`) and the MCP exposes comment tools (list/create), but the importer does not read comments and write them into the markdown. [SOURCE: deepwiki.com/.../3.2-notion-api] (no comment conversion in enumerated surface), [SOURCE: mcp-notion/SKILL.md §3] (MCP comment tools exist)

**This is the highest-confidence gap from iteration 1, now confirmed.** Comments are Notion discussion threads attached to a page or a block; Obsidian has no native comment/discussion concept.

### F6.5 — Comments recovery path (mcp-notion-reads / mcp-obsidian-writes)

Since the importer drops comments, the agent must carry them as a reconstruction step:

1. **Read (mcp-notion):** MCP comment-list tools → all comments on a page (and block-level comments via the parent block id). The API distinguishes `page`-parented comments (page discussion) from `block`-parented comments (inline discussion on a block). [SOURCE: mcp-notion/SKILL.md §3]
2. **Write (mcp-obsidian):** There is no "comment" write target in Obsidian. Two viable carry-over shapes:
   - **Appended "## Comments" section** at the end of the imported note, preserving author + timestamp + text. This is the simplest, greppable, diff-able option — written via `notesmd-cli create`/Edit or MCP `obsidian_write_note`.
   - **Frontmatter `comments` list** (structured: `[{author, ts, text}]`) — queryable by Dataview/Bases, but loses threading readability.
3. **Recommended:** appended `## Comments` section with a structured sub-list per thread, plus a frontmatter `comment_count` field for verification. This preserves human readability and gives a parity-checkable count.

### F6.6 — File-upload inventory (the API gap)

For a complete attachment inventory (pre-import), the `GET /v1/file_uploads` and `GET /v1/file_uploads/{id}` endpoints enumerate uploaded files and their status. This is an mcp-notion API-gap read (not MCP), used in the inventory phase to ensure no attachment is missed. [SOURCE: mcp-notion/references/api-gap-tools.md §3]

### F6.7 — Carry-over matrix (files / attachments / comments / covers)

| Notion artifact | Importer carries? | Gap recovery (mcp-notion read → mcp-obsidian write) |
|---|---|---|
| Block attachments (image/video/PDF/file) | Yes (downloaded + `![]()` embed) | Verify embeds resolve; re-download via file_uploads gap if missing |
| `files` property attachments | Yes (downloaded, frontmatter ref) | Verify frontmatter shape; reconstruct if malformed |
| External-URL attachments | Only if `downloadExternalAttachments=true` | Enable option, or accept external links |
| Gallery cover images | No (gap) | Read cover via API; write as frontmatter `cover` + download image |
| Page cover | Yes (frontmatter `cover` property) | Accept frontmatter field as parity record (Obsidian cover is app-managed) |
| Discussion comments | **No (gap)** | MCP comment-list → appended `## Comments` section + `comment_count` frontmatter |
| File-upload inventory | n/a (inventory) | `GET /v1/file_uploads` gap → attachment ledger |

## Sources Consulted

- [SOURCE: https://github.com/obsidianmd/obsidian-importer/blob/d4e05b71/src/formats/notion-api/block-converter.ts] — `ATTACHMENT_CONFIGS`, synced blocks
- [SOURCE: https://github.com/obsidianmd/obsidian-importer/blob/d4e05b71/src/formats/notion-api.ts] — `downloadExternalAttachments`, `incrementalImport`, `coverPropertyName`
- [SOURCE: https://github.com/obsidianmd/obsidian-importer/blob/d4e05b71/src/formats/notion-api/api-helpers.ts] — `ExtractFrontMatterParams` (files property download)
- [SOURCE: https://deepwiki.com/obsidianmd/obsidian-importer/3.2-notion-api] — no comment conversion in enumerated surface
- [SOURCE: https://github.com/obsidianmd/obsidian-importer/pull/444] — gallery cover images not imported (test feedback)
- [SOURCE: .opencode/skills/mcp-tooling/mcp-notion/SKILL.md §3] — MCP comment tools (list/create)
- [SOURCE: .opencode/skills/mcp-tooling/mcp-notion/references/api-gap-tools.md §3] — file_uploads endpoints
- [SOURCE: .opencode/skills/mcp-tooling/mcp-obsidian/SKILL.md §2] — notesmd-cli create/frontmatter, MCP write_note

## Assessment

- **newInfoRatio: 0.71** — The prior findings did not resolve files/comments/covers. This iteration confirms attachments are carried (with options), confirms comments are a gap with a concrete recovery path, and documents the cover-as-frontmatter pattern and gallery-cover gap.
- **Novelty justification:** First confirmed comments gap with a defined mcp-notion→mcp-obsidian recovery path (appended `## Comments` + `comment_count`), and first documentation of the `downloadExternalAttachments`/`incrementalImport` attachment options.
- **Confidence:** High on attachments (source). High on comments gap (absence in enumerated conversion + no Obsidian comment concept). Medium on `files`-property frontmatter shape (source confirms download, not the exact frontmatter serialization — VERIFY post-import).

## Reflection

- **What worked:** The importer source (`ATTACHMENT_CONFIGS`, settings) + MCP comment-tool existence triangulated the carry-over picture.
- **What failed:** Could not confirm the exact `files`-property frontmatter serialization from the truncated source.
- **Ruled out:** Assuming comments are imported (they are not); assuming external attachments download by default (they do not — opt-in).

## Recommended Next Focus

**Iteration 7:** Q7 — Multi-view databases & nested hierarchy. What happens to Notion's 10 view types, multi-view databases, and nested page/sub-page hierarchy on import? What survives (default table view, nested notes), what needs reconstruction (board/calendar/timeline/gallery/form/chart/map/dashboard views), and via which tools (Notion Bases plugin 7 views, Bases views, Calendar/Kanban plugins).
