# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/workflows-documentation/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 140-fix-constitutional-tier |
| **Completed** | 2026-02-21 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The Spec Kit Memory parser now correctly ignores HTML comment blocks when extracting importance tiers from memory files. Before the fix, 595 SESSION SUMMARY memories were indexed as `constitutional` because the tier regex matched an example value inside an HTML comment in `context_template.md`. All 595 rows were re-tiered to `normal` via a bulk SQL UPDATE.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts` | Modified | Strip HTML comments before tier regex in `extractImportanceTier()` |
| `.opencode/skill/system-spec-kit/mcp_server/dist/lib/parsing/memory-parser.js` | Modified | Compiled equivalent of the TypeScript fix |
| `.opencode/skill/system-spec-kit/mcp_server/dist/database/context-index.sqlite` | Modified | 595 rows updated: `constitutional` → `normal` for SESSION SUMMARY entries |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Strip comments with regex before existing logic | One-line change with no structural impact; avoids rewriting the parser |
| Update dist `.js` manually alongside `.ts` | Compiled output is checked in; skipping this would leave the running server with the bug |
| Bulk SQL UPDATE rather than re-indexing | Re-indexing 2315 memories would be slow and risk wider disruption; direct UPDATE is safe and precise |
| Legitimately constitutional memories kept (IDs 567, 568) | Verified manually before executing UPDATE; WHERE clause excluded them |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Unit tests (6 cases) | PASS — comment stripping, YAML extraction, real template pattern, marker detection all correct |
| Constitutional count post-fix | PASS — dropped from 597 to 4 (2 legitimate + 2 implementation summaries) |
| Normal count post-fix | PASS — increased from 1720 to 2315 |
| Embeddings in success state | PASS — all 3071 embeddings unaffected |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- The dist `.js` file was patched manually rather than compiled from source; if the TypeScript is recompiled without including this change it will regress. The source `.ts` is the authoritative fix.
- Two implementation summary memories (not SESSION SUMMARY) also landed in `constitutional` tier post-fix; these are borderline and have been left as-is since they do not represent the original bug.
<!-- /ANCHOR:limitations -->

---

<!--
Level 1: Compact post-implementation summary. No "How It Was Delivered" section.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skill/workflows-documentation/references/hvr_rules.md
-->
