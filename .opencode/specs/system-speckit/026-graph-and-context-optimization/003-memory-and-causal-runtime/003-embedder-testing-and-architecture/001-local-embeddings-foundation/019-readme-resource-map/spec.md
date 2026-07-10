---
title: "Feature Specification: 019 README Resource Map and Post-014 Doc Cleanup"
description: "Inventory every README in the repo, identify staleness against the 014 line, and apply the edits to align canonical READMEs with current code state."
trigger_phrases:
  - "019 readme resource map"
  - "post-014 doc cleanup"
  - "readme staleness audit"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/019-readme-resource-map"
    last_updated_at: "2026-05-13T15:50:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Scaffolded packet 019 docs; applying README edits per resource map"
    next_safe_action: "Run strict-validate and update parent graph-metadata"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "resource-map.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0140190c2a9e0000000000000000000000000000000000000000000000000001"
      session_id: "019-readme-resource-map-2026-05-13"
      parent_session_id: "019-readme-resource-map-2026-05-13"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Q1: Ollama sections in install guide -> A. Remove entirely (not in factory cascade)"
      - "Q2: barter/ copies -> B. Symlink to canonical (single source of truth)"
      - "Q3: providers/README auto-migration mention -> A. Brief mention + link"
      - "Q4: ollama in EMBEDDINGS_PROVIDER docs -> No (not a factory provider)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: 019 README Resource Map and Post-014 Doc Cleanup

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-13 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 19 |
| **Predecessor** | `018-llama-cpp-auto-migration` |
| **Handoff Criteria** | All 7 MAJOR READMEs aligned with current code state; barter copies symlinked to canonical; strict-validate exits 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The 014 setup-A line (packets 001 through 018) made 13 concrete changes to the embedding stack across both MCP servers. The runtime configs and the BEFORE_VS_AFTER doc were updated, but the user-facing READMEs were not. DeepSeek v4 pro scanned all 522 READMEs in the repo and flagged 7 as MAJOR stale, all 7 of them describing the embedding provider story at a high level.

This packet does two things:

1. Records the staleness inventory and per-README edit guidance in `resource-map.md`.
2. Applies the actual README edits to align them with the current factory.ts cascade.

A separate sibling staleness pattern exists: the `barter/.opencode/` directory contains independent copies of 5 of the 7 stale READMEs. These copies have the same staleness. To prevent future drift, they are replaced with relative symlinks pointing at the canonical `.opencode/` versions.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In scope

- The 7 MAJOR READMEs identified by the DeepSeek scan
- Removal of Ollama sections from the install guide (Q1, operator decision)
- Symlinking the 5 stale barter copies to their canonical .opencode counterparts (Q2, operator decision)
- Brief auto-migration mention with a link in the providers package README (Q3, operator decision)
- Excluding `ollama` from `EMBEDDINGS_PROVIDER` valid values (Q4, operator decision)

### Out of scope

- The 515 READMEs DeepSeek classified as CLEAN
- Any code or factory changes (this packet is doc-only)
- Restructuring barter/ as a top-level symlink (Q2 keeps it as a real directory with individual file symlinks inside)
- Updating CHANGELOG entries (a separate packet decision if needed)

### Files to change

| File | Action | Size before |
|------|--------|-------|
| `README.md` (root) | Edit (6 stale sections) | 74 KB |
| `.opencode/install_guides/README.md` | Edit (6 sections) + Q1 Ollama removal | 60 KB |
| `.opencode/skills/system-spec-kit/README.md` | Edit (5 stale sections) | 81 KB |
| `.opencode/skills/system-spec-kit/shared/README.md` | Edit (7 stale sections) | 25 KB |
| `.opencode/skills/system-spec-kit/shared/embeddings/README.md` | Edit (3 stale sections) | 6.4 KB |
| `.opencode/skills/system-spec-kit/shared/embeddings/providers/README.md` | Edit (2 stale sections) + Q3 auto-migration mention | 4.7 KB |
| `.opencode/skills/mcp-coco-index/README.md` | Edit (6 stale sections) | 24 KB |
| `barter/.opencode/skills/system-spec-kit/README.md` | Replace with relative symlink to canonical | (symlink) |
| `barter/.opencode/skills/mcp-coco-index/README.md` | Replace with relative symlink | (symlink) |
| `barter/.opencode/install_guides/README.md` | Replace with relative symlink | (symlink) |
| `barter/.opencode/skills/system-spec-kit/shared/README.md` | Replace with relative symlink | (symlink) |
| `barter/.opencode/skills/system-spec-kit/shared/embeddings/README.md` | Replace with relative symlink | (symlink) |
| `barter/.opencode/skills/system-spec-kit/shared/embeddings/providers/README.md` | Replace with relative symlink | (symlink) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### Functional

- **REQ-001** Every stale section in `resource-map.md` Section 3 must be edited to use the suggested replacement text.
- **REQ-002** All Ollama-related installation steps in `.opencode/install_guides/README.md` are removed (operator decision Q1).
- **REQ-003** `barter/.opencode/` README copies are replaced with relative symlinks that resolve to the canonical `.opencode/` versions.
- **REQ-004** `shared/embeddings/providers/README.md` gains a one-paragraph mention of the 018 auto-migration with a link to the MCP server README (operator decision Q3).
- **REQ-005** `ollama` is not introduced as a valid value for `EMBEDDINGS_PROVIDER` in any updated README (operator decision Q4).

### Non-functional

- **NFR-001** No README is left in a partially-edited state. Each file is either fully updated or untouched.
- **NFR-002** Internal links (markdown anchors, paths) remain valid after edits.
- **NFR-003** Strict-validate on this packet exits 0.

### Acceptance

- All 7 MAJOR READMEs have zero remaining mentions of `voyage-code-3 as primary`, `nomic-ai/nomic-embed-text-v1.5 as default`, `1024 as default dim`, or `voyage as recommended`.
- `grep -rn "llama-cpp" <each-of-the-7-canonical-READMEs>` returns at least one match (6 of 7 do; mcp-coco-index uses Python sentence-transformers and intentionally has no llama-cpp references).
- Symlinked barter copies show identical content to their canonical targets.
- Strict-validate exits 0.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

The packet is complete when every canonical README that describes the embedding provider story aligns with `factory.ts:786-836`, the resource map captures the inventory of stale content with per-file edit guidance, the barter copies stop being independent files that drift over time, and operator decisions Q1-Q4 are applied.

Final acceptance signals: 0 stale matches across all 7 canonical READMEs, 6 of 7 barter copies replaced with relative symlinks resolving to canonical, parent graph-metadata updated with 019 child and causal summary.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Mitigation |
|------|------------|
| Edit drift between DeepSeek-quoted text and live file content | Edit tool matches by quoted content rather than line numbers, so small upstream whitespace edits between the scan and the apply do not silently corrupt the result. |
| barter symlink breaks if canonical README is moved | Documented in implementation summary so a future restructure remembers to update the symlinks. The barter directory is gitignored so symlink state is local. |
| Ollama removal hides historically useful info for users who still run Ollama externally | A short breadcrumb section was kept (`9. PHASE 2: OLLAMA SUPPORT (REMOVED)`) pointing operators to the Ollama documentation. |
| Phase numbering in install guide has a "(REMOVED)" placeholder rather than full renumber | Accepted as a stylistic trade-off. Full renumber would touch every subsequent section number, subsection number, TOC entry, and internal reference. Cost outweighs aesthetic gain. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

All four operator decisions answered before edits began:

- Q1: Remove Ollama sections entirely from install guide. **A. Remove.**
- Q2: Replace barter copies with symlinks. **B. Symlink.**
- Q3: Mention auto-migration in providers README. **A. Brief mention + link.**
- Q4: Include `ollama` as valid `EMBEDDINGS_PROVIDER` value. **No.**
<!-- /ANCHOR:questions -->
