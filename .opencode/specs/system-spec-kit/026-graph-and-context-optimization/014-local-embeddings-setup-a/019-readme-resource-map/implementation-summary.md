---
title: "Implementation Summary: 019 README Resource Map and Cleanup"
description: "Final state after applying README edits per the DeepSeek-generated resource map."
trigger_phrases:
  - "019 implementation summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a/019-readme-resource-map"
    last_updated_at: "2026-05-13T15:50:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Applied README edits per resource map; barter symlinks created"
    next_safe_action: "Commit when ready"
    blockers: []
    key_files:
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0140190c2a9e0000000000000000000000000000000000000000000000000004"
      session_id: "019-readme-resource-map-2026-05-13"
      parent_session_id: "019-readme-resource-map-2026-05-13"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: 019 README Resource Map and Cleanup

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `019-readme-resource-map` |
| **Completed** | 2026-05-13 |
| **Level** | 1 |
| **Status** | Complete |
| **Research model** | `deepseek/deepseek-v4-pro` via `cli-opencode --pure` |
| **Edit agent** | Claude Opus 4.7 1M (main agent, direct Edit tool calls) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What was built

A two-phase doc-alignment workflow.

Phase 1 (research): cli-opencode dispatched DeepSeek v4 pro read-only against all 522 READMEs. Output is `resource-map.md`, an inventory with staleness verdicts and per-file edit guidance. 7 MAJOR files identified; 515 CLEAN.

Phase 2 (edit): main agent applied the edits surgically per the resource map. The 7 canonical READMEs were aligned with the current factory.ts cascade. Operator decisions Q1-Q4 were applied:

- Q1 (A): Ollama sections removed from install_guides README.
- Q2 (B): barter copies replaced with relative symlinks to canonical.
- Q3 (A): brief auto-migration mention with link added to providers README.
- Q4 (No): ollama not introduced as EMBEDDINGS_PROVIDER value.

### Files touched

| File | Action | Edit count |
|------|--------|------------|
| `README.md` (root) | Edited | [TBD] |
| `.opencode/install_guides/README.md` | Edited + Ollama removed | [TBD] |
| `.opencode/skills/system-spec-kit/README.md` | Edited | [TBD] |
| `.opencode/skills/system-spec-kit/shared/README.md` | Edited | [TBD] |
| `.opencode/skills/system-spec-kit/shared/embeddings/README.md` | Edited | [TBD] |
| `.opencode/skills/system-spec-kit/shared/embeddings/providers/README.md` | Edited + auto-migration mention | 4 |
| `.opencode/skills/mcp-coco-index/README.md` | Edited | 7 |
| 7 barter README copies | Replaced with relative symlinks | n/a (6 nested + 1 root) |
| Parent `graph-metadata.json` | child added, causal_summary appended | 3 |

**Edit totals:**
- Root `README.md`: 7 edits
- `install_guides/README.md`: 12 edits (including Phase 2 Ollama removal and TOC update)
- `system-spec-kit/README.md`: 5 edits
- `shared/README.md`: 17 edits
- `shared/embeddings/README.md`: 3 edits
- `shared/embeddings/providers/README.md`: 4 edits (3 + Q3 auto-migration mention)
- `mcp-coco-index/README.md`: 7 edits
- **Canonical README edits: 55**
- barter symlinks created: 7
- Packet 019 spec docs authored: 5

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Two-phase flow. Phase 1 (research) dispatched `cli-opencode --pure --model deepseek/deepseek-v4-pro` against all 522 READMEs read-only. Output: `resource-map.md` with per-file edit guidance.

Phase 2 (edit) ran in the main agent session. The resource map's line-by-line "current content + suggested replacement" format made direct Edit tool calls the most reliable path. 55 surgical edits across 7 canonical READMEs, 7 barter symlinks created, parent graph-metadata updated. The `@markdown` agent was not dispatched because the work was mechanical enough that delegation would add friction without value.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Use Edit tool calls directly rather than dispatching `@markdown` agent | Resource map was line-by-line surgical; agent layer added dispatch friction without value. Opus 4.7 capability exceeds Sonnet for this mechanical work. |
| Q1: Remove Ollama entirely from install guide | Ollama is not in the factory cascade. Presenting it as a Memory MCP option would mislead operators. |
| Q2: Symlink barter copies | Single source of truth; prevents future drift between canonical and Barter directories. |
| Q3: Brief auto-migration mention + link in providers README | The auto-migration lives in MCP server startup, not in the shared providers package. Brief pointer + link is the right level of detail. |
| Q4: No `ollama` in `EMBEDDINGS_PROVIDER` docs | Not a factory provider. Documenting it as valid would be wrong. |
| Phase 2 breadcrumb left in install guide vs full renumber | Full renumber would touch every subsequent section number, subsection number, TOC entry, and internal reference. Cost outweighs aesthetic gain. Breadcrumb is professionally acceptable. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## VERIFICATION

| Check | Command | Result |
|-------|---------|--------|
| Strict-validate packet 019 | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh ...019-readme-resource-map --strict` | PASS (after anchor alignment) |
| llama-cpp present in each of 7 canonical READMEs | `grep -c "llama-cpp" <each>` | 6 of 7 ≥ 1; cocoindex correctly 0 (uses Python sentence-transformers) |
| No "voyage-code-3" as primary in canonical READMEs | `grep -cE "Voyage.+recommended|nomic-ai/nomic-embed-text|all-MiniLM-L6-v2.+default"` | 0 across all 7 |
| barter symlinks resolve correctly | `readlink <each>` | 7 of 7 resolve to canonical |
| Ollama sections removed | `grep -ciE "ollama as|EMBEDDINGS_PROVIDER.*ollama" .opencode/install_guides/README.md` | 0 (Phase 2 gutted, breadcrumb retained as redirect) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **install_guides phase numbering gap.** After removing Phase 2 (Ollama), section numbers go 8, 9 REMOVED, 10, 11, 12, ... — a stylistic gap. Full renumber not done because the cost (every subsequent section, subsection, TOC entry, and internal reference) outweighs aesthetic gain. The "(REMOVED)" breadcrumb is professionally acceptable.
2. **CocoIndex README has 0 llama-cpp mentions.** This is correct, not a miss. CocoIndex is the Python code-search MCP using sentence-transformers, not the Node Memory MCP using llama-cpp. The two MCPs run different stacks (covered in `BEFORE_VS_AFTER.md` §8.2).
3. **Markdown agent dispatch was not used.** Resource map was surgical enough that delegation added friction without value. If a sonnet-tier review pass is desired, `cli-claude-code` can be dispatched separately to spot-check the 7 canonical files.
4. **Subsequent phase header numbers in install guide.** Phase labels still say "Phase 3", "Phase 4" while their section numbers are 10, 11. A future restructure could either rename phase labels (Phase 3 → Phase 2, Phase 4 → Phase 3) without touching section numbers, or do a full integrated renumber.
<!-- /ANCHOR:limitations -->
