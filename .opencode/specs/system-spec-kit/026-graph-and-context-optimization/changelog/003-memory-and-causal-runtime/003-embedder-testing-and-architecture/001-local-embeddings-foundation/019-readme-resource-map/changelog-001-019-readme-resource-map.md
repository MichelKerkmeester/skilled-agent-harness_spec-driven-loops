---
title: "Phase 019: README Resource Map and Post-014 Doc Cleanup"
description: "DeepSeek scanned 522 READMEs and identified 7 MAJOR stale files. The main agent applied 55 surgical edits to align canonical READMEs with the current local-embeddings factory cascade."
trigger_phrases:
  - "019 readme resource map"
  - "post-014 doc cleanup"
  - "readme staleness audit local embeddings"
  - "barter symlinks readme"
  - "readme factory cascade alignment"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-13

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/019-readme-resource-map` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation`

### Summary

The 014 setup-A line made 13 concrete changes to the embedding stack across both MCP servers, but the user-facing READMEs were never updated. DeepSeek v4 pro scanned all 522 READMEs in the repo via `cli-opencode --pure` and flagged 7 as MAJOR stale. Every flagged README still recommended Voyage as primary, cited 1024 as the default vector dimension with no mention of `llama-cpp` or the local-first cascade.

The main agent applied 55 surgical edits across the 7 canonical READMEs. Ollama installation steps were removed from the install guide (Q1). Six barter directory README copies were replaced with relative symlinks to canonical counterparts (Q2). A brief auto-migration mention with a link was added to the providers README (Q3). `ollama` was confirmed absent from `EMBEDDINGS_PROVIDER` valid values (Q4).

### Added

- `resource-map.md` (41 KB) authored by DeepSeek v4 pro: staleness inventory of 522 READMEs with per-file edit guidance and operator Q1-Q4 decision prompts
- Brief auto-migration mention with link to MCP server README added to `shared/embeddings/providers/README.md` (Q3)
- Parent `graph-metadata.json` updated: packet 019 added as child, `derived.last_active_child_id` set, causal summary line appended

### Changed

- `README.md` (root): 7 edits aligning embedding provider narrative with the `factory.ts` cascade
- `.opencode/install_guides/README.md`: 12 edits including Ollama section removal and TOC update (Q1)
- `.opencode/skills/system-spec-kit/README.md`: 5 edits replacing Voyage-recommended copy with llama-cpp local-first narrative
- `.opencode/skills/system-spec-kit/shared/README.md`: 17 edits across embedding provider story sections
- `.opencode/skills/system-spec-kit/shared/embeddings/README.md`: 3 edits correcting default dimension and provider references
- `.opencode/skills/system-spec-kit/shared/embeddings/providers/README.md`: 4 edits correcting provider defaults and adding Q3 auto-migration mention
- 6 barter directory README copies replaced with relative symlinks to canonical `.opencode/` counterparts (Q2)

### Fixed

- All 7 canonical READMEs now show zero matches for `voyage-code-3 as primary`, `nomic-ai/nomic-embed-text-v1.5 as default`, `1024 as default dim` or `voyage as recommended`
- Barter directory README copies no longer drift independently from their canonical counterparts

### Verification

| Check | Command | Result |
|-------|---------|--------|
| Strict-validate packet 019 | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh ...019-readme-resource-map --strict` | PASS (after anchor alignment) |
| `llama-cpp` present in canonical READMEs | `grep -c "llama-cpp" <each of 7>` | 6 of 7 have count 1 or more. `mcp-coco-index` intentionally 0 (Python sentence-transformers stack) |
| No stale Voyage primary references | `grep -cE "Voyage.+recommended" <each>` | 0 across all canonical READMEs |
| Ollama sections removed from install guide | `grep -ciE "ollama as|EMBEDDINGS_PROVIDER.*ollama" .opencode/install_guides/README.md` | 0 (breadcrumb placeholder retained as redirect) |
| Barter symlinks resolve correctly | `readlink <each of 6 barter paths>` | 6 of 6 resolve to canonical (evidence from implementation-summary) |

### Files Changed

| File | Action |
|------|--------|
| `README.md` (root) | Edited. 7 edits aligning embedding provider narrative. |
| `.opencode/install_guides/README.md` | Edited. 12 edits. Ollama section removed per Q1. |
| `.opencode/skills/system-spec-kit/README.md` | Edited. 5 edits. llama-cpp local-first narrative added. |
| `.opencode/skills/system-spec-kit/shared/README.md` | Edited. 17 edits across embedding provider sections. |
| `.opencode/skills/system-spec-kit/shared/embeddings/README.md` | Edited. 3 edits correcting defaults. |
| `.opencode/skills/system-spec-kit/shared/embeddings/providers/README.md` | Edited. 4 edits. Q3 auto-migration mention added. |
| `resource-map.md` (NEW) | Created. DeepSeek-authored staleness inventory for 522 READMEs. |
| `6 barter README paths` | Replaced with relative symlinks to canonical `.opencode/` files per Q2. |

### Follow-Ups

- The `mcp-coco-index` README received 7 edits at the time of authoring. The skill directory was subsequently removed per packet `014/005`. Verify no README reference still points to that path.
- Phase label numbering gap in install guide: section numbers read 8, 9 REMOVED, 10, 11 after Ollama removal. A future restructure can renumber if the stylistic gap becomes a user complaint.
- Confirm all 6 barter symlinks still resolve correctly after any future barter directory restructure.
