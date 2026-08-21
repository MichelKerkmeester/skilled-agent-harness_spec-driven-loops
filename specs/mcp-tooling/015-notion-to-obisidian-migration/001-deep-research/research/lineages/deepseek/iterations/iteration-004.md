# Iteration 4: File Uploads, Attachments, Comments, and Multi-View Databases

## Focus
How file uploads/attachments, comments, and multi-view databases survive the API import, what falls through the cracks, and how mcp-notion + mcp-obsidian handles the gaps.

## Findings

### F4.1 — File and Attachment Handling

| Aspect | API importer behavior | What survives | What needs reconstruction | AI agent's role |
|---|---|---|---|---|
| Inline images | Preserved | File copied to vault | Nothing — importer handles it | Verify links resolve: `notesmd-cli search-content` for broken image paths |
| Embedded files (PDF, audio, video) | Preserved | File copied to vault | Nothing — importer handles it | Verify local file exists per page |
| Files in `files` property | Partially preserved | Property may survive but Notion file URL → local file mapping may break | Rewrite file property values to local vault paths | mcp-notion: read file upload metadata (Gap 1); mcp-obsidian: write local file refs into frontmatter |
| Drag-and-drop embeds (file block type) | Preserved as link | Notion's CDN-hosted URL, not a local file | Download each file via direct API (`GET /v1/files/{id}`) and write to vault | mcp-notion direct API for file metadata; mcp-obsidian `notesmd-cli create` for vault placement |
| Large files (>20 MiB) | May fail rate-limited import | Lost unless manually re-attached | Human re-uploads to vault; agent notes the gap | Document the gap in the acceptance ledger; verify file count |
| File cover/icon | Preserved | Copied to vault | Nothing | Verify frontmatter `icon:` and `cover:` references |

[SOURCE: mcp-notion/references/api-gap-tools.md §3 — file upload endpoint family]
[SOURCE: mcp-obsidian SKILL.md §7 — notesmd-cli file operations]
[SOURCE: prior-findings.md §1 — API importer preserves attachments/hierarchy]

### F4.2 — Uploading to Notion via AI (Gap 1)

If the AI needs to attach a file to a Notion page DURING inventory or testing, the flow is:

```
1. mcp-notion direct API: POST /v1/file_uploads → receive file_upload_id
2. mcp-notion direct API (Bash or Code Mode): POST file_upload_id/send (multipart/form-data)
3. mcp-notion MCP: append-block-children or update-page-properties referencing the file_upload_id
```

All three steps can be automated via Code Mode `call_tool_chain` + Bash, using `$notion_NOTION_TOKEN` for auth. No human interaction required for uploads once the token is set.
[SOURCE: mcp-notion/references/api-gap-tools.md §3 — full upload flow]

### F4.3 — Comments Handling

| Aspect | API importer behavior | AI agent's role |
|---|---|---|
| Page-level comments | **Not imported** | Extract via mcp-notion `list-comments` during inventory; store as metadata in migration log |
| Discussion threads | Not imported | Same; thread structure preserved in comment parent ids |
| Resolved vs unresolved | Not imported | Both could be captured; resolved comments less relevant after migration |
| Comment author attribution | Not imported — author ID → name mapping possible | mcp-notion `list-all-users` maps user IDs to names during inventory |

**Verdict**: Comments cannot be imported into Obsidian (no native comment system). The reconstruction path is:
1. Inventory: `list-comments` + `list-all-users` via mcp-notion during pre-flight
2. Append to notes: Convert comments to Obsidian callout blocks appended to the page body (mcp-obsidian `write_note` or CLI `frontmatter` + body append)
3. Alternative: Write comments to a dedicated "Migration Notes" section with `> [!comment]` callouts referencing the original page

[SOURCE: mcp-notion/references/mcp-tools.md §6 — list-comments, list-all-users]
[SOURCE: mcp-obsidian SKILL.md §7 — notesmd-cli create/write patterns]

### F4.4 — Multi-View Databases

| Aspect | API importer behavior | What survives | What needs reconstruction |
|---|---|---|---|
| Primary view (table) | Preserved → Bases view | Column order, visibility, width | Nothing |
| Secondary views (board, calendar, gallery, timeline, list) | **Not imported** — only the primary view | None | Must be manually or agent-recreated as additional `.base` files or `_database.md` views |
| View-level filters | NOT imported — only primary view filter | None | Re-create per view via plugin schema |
| View-level sorts | NOT imported | None | Re-create per view |
| Linked data sources (cross-database rollups) | NOT imported | None | Re-create relation + lookup columns in Notion Bases plugin |

Reconstruction workflow per database:
1. mcp-notion `retrieve-a-database` → get database metadata
2. mcp-notion direct API `GET /v1/databases/{id}/views` → list all configured views
3. mcp-notion direct API `GET /v1/views/{id}` → get each view's filter/sort/config
4. Translate each view config into Notion Bases plugin schema in `_database.md`
5. mcp-obsidian `notesmd-cli frontmatter` or `create` to write the schema

[SOURCE: mcp-notion/references/api-gap-tools.md §4 — views endpoint family]
[SOURCE: mcp-notion/references/mcp-tools.md §5 — retrieve-a-database tool]
[SOURCE: bgarciamoura/obsidian-notion-bases-plugin README — multi-view via _database.md]

### F4.5 — Verification File for Attachments

A programmatic check the AI can run post-import:
```
1. mcp-obsidian notesmd-cli list → get all note paths
2. grep for ![[...]] or [](<path>) patterns
3. Verify each referenced file exists in the vault filesystem
4. Count files in vault attachment folder vs expected count from Notion inventory
5. Report mismatch ratio
```

[SOURCE: prior-findings.md §5 — programmatic verification checklist pattern]

## Sources Consulted
- mcp-notion/references/api-gap-tools.md §3-4
- mcp-notion/references/mcp-tools.md §5-6
- mcp-obsidian SKILL.md §7
- prior-findings.md §1, §5
- https://developers.notion.com/reference/file-upload
- bgarciamoura/obsidian-notion-bases-plugin README

## Assessment
- newInfoRatio: 0.95
- noveltyJustification: "File upload flow (create→send→attach), comment gap + reconstruction path, and multi-view reconstruction workflow are all new — prior-findings only mentioned 'attachments preserved' with no details"
- Confidence: High — API gap tools + plugin README + Notion API ref confirmed

## Reflection
- What worked: Breaking the problem into four sub-items (files, comments, views, verification) produced actionable steps for each
- What failed: Cannot confirm exact view config schema compatibility between Notion API views and Notion Bases plugin schema without a live workspace
- Ruled out: In-app comment import is impossible; must convert to vault notes

## Recommended Next Focus
KQ-7: Notion API 2.0 data-source model — how it affects inventory strategies and what changes from the legacy database model