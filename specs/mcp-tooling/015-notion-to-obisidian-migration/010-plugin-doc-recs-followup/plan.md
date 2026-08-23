---
title: "Implementation Plan: Phase 010 — Apply the deferred plugin-doc research recommendations"
description: "Author the deferred dataview, advanced-canvas, claudian and notion-bases doc items plus the 007 header fix from a primary-source-confirmed facts sheet, tightening caveats and citations as coherent sets, then validate every changed doc and both affected packets."
trigger_phrases:
  - "015 plugin doc recs followup plan"
  - "mcp-obsidian deferred docs plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-notion-to-obisidian-migration/010-plugin-doc-recs-followup"
    last_updated_at: "2026-08-22T20:12:00Z"
    last_updated_by: "claude"
    recent_action: "Resolved deferred plugin-doc items and the 007 header fix"
    next_safe_action: "None — parent phase-map refresh is the orchestrator's step"
    blockers: []
    key_files:
      - "spec.md"
      - "../009-apply-plugin-doc-recs/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "015-010-plugin-doc-recs-followup"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->
# Implementation Plan: Phase 010 — Apply the deferred plugin-doc research recommendations

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown reference + feature-catalog docs under `mcp-obsidian`; spec-folder metadata under `specs/` |
| **Framework** | A primary-source-confirmed facts sheet (official Dataview docs + installed plugin `main.js`) prepared by the orchestrator |
| **Storage** | Edits to shipped skill docs and `007`'s metadata; read-only plugin bundles in the vault |
| **Testing** | `validate_document.py --type reference/feature_catalog` per changed doc; `validate.sh --strict` on this folder and on `007` |

### Overview
Read the facts sheet, then author each deferred item's confirmed wording: the two dataview citations, the advanced-canvas caveat tightening (five files), the claudian positive-path resolution (three files), the notion-bases decision and version bump, and the `007` header fix with its metadata reconcile. Validate each changed shipped doc, refresh `007`'s metadata, reconcile its continuity timestamp, and validate both packets `--strict`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The primary-source-confirmed facts sheet read in full
- [x] The 009 spec/summary read to know exactly what was deferred and what must not be re-applied
- [x] Scope lock understood — only the named `mcp-obsidian/` docs, this folder, and `007`'s tasks/metadata/continuity are writable

### Definition of Done
- [x] Every deferred item resolved with confirmed evidence (dataview, advanced-canvas, claudian, notion-bases)
- [x] The 007 `TEMPLATE_HEADERS` error cleared; `validate.sh 007 --strict` = Errors:0 RESULT: PASSED
- [x] Every changed shipped doc passes `validate_document.py` (0 issues)
- [x] The notion-bases P2-7 split resolved as an explicit not-split decision
- [x] `validate.sh <this-folder> --strict` = Errors:0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Facts-sheet-driven documentation authoring: read confirmed fact → apply confirmed wording as a coherent set across every file that repeats the claim → validate. No fact is re-derived; the orchestrator confirmed each against official docs or the installed `main.js`.

### Key Components
- **Coherent-set tightening** — the advanced-canvas endpoint caveat repeats across four reference docs and the catalog card; the claudian positive-path resolution repeats across the reference and catalog. Each is reworded as a set so no stale "inferred"/dangling-`VERIFY` instance survives.
- **Evidence upgrade, not claim flip** — the dataview inline-field rule is already single-line; this phase adds the official-docs citation without re-flipping it. The `file.day` note drops the unreal folder trigger and cites the confirmed two triggers.
- **Metadata reconcile** — refreshing `007`'s generated metadata advances `derived.last_save_at`; the continuity `last_updated_at` in `007/implementation-summary.md` is reconciled so `CONTINUITY_FRESHNESS` passes.

### Data Flow
facts sheet → author confirmed wording → `validate_document.py` per doc → refresh 007 metadata → reconcile 007 continuity → `validate.sh --strict` on 007 and this folder.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase touches three surfaces: the shipped docs under `.opencode/skills/mcp-tooling/mcp-obsidian/` (dataview, advanced-canvas, claudian, notion-bases reference and catalog files), this phase folder, and the sibling `007` packet's `tasks.md` plus its regenerated metadata and reconciled continuity. The deep-loop runtime, `system-deep-loop`, `compiled-routing`, the 006 research trees, and any concurrent-session lane are never written. The vault is read-only; no `.canvas` file is created.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read the primary-source-confirmed facts sheet in full
- [x] Read 009's spec/summary and the sibling 009 file set to mirror structure and know what not to re-apply
- [x] Locate the exact shipped-doc wording for each deferred item

### Phase 2: Implementation
- [x] dataview `file.day` two-trigger correction + "Metadata on Pages" citation; inline-field "Adding Metadata" citation (`data-model.md`)
- [x] advanced-canvas caveat tightened across `advanced-canvas.md`, `data-model.md`, `workflows.md`, `troubleshooting.md`, and the feature-catalog card
- [x] claudian positive Claude-provider MCP path resolved to definitive negative + explicit UNKNOWN across `data-model.md`, `workflows.md`, and the feature-catalog card
- [x] notion-bases P2-7 not-split decision recorded; P2-8 version bump on the phase-008 `workflows.md`
- [x] 007 `tasks.md` headers renamed to canonical `Setup`/`Implementation`; 007 metadata refreshed; 007 continuity reconciled

### Phase 3: Verification
- [x] `validate_document.py` on every changed shipped doc — 0 issues
- [x] `validate.sh 007-excalidraw-deprecation --strict` = Errors:0 RESULT: PASSED
- [x] Author this phase package; run `generate-description.js` + `backfill-graph-metadata.js`
- [x] `validate.sh <this-folder> --strict` = Errors:0
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structure | Every changed reference/catalog doc | `validate_document.py --type reference/feature_catalog` |
| Packet | This phase folder and `007` | `validate.sh <folder> --strict` |
| Scope containment | No write outside the three allowed surfaces | `git status --short` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Primary-source-confirmed facts sheet | Internal | Green | No confirmed wording to author |
| 009 spec/summary (deferred-item list) | Internal | Green | Cannot tell resolved from re-applied |
| `validate_document.py` / `validate.sh` | Internal | Green | No completion gate |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a shipped-doc edit or the 007 header rename is found wrong on review.
- **Procedure**: `git checkout -- <changed file>` for the affected doc; re-run `generate-description.js`/`backfill-graph-metadata.js` on `007` if its metadata was touched.
- **Data reversal**: none — documentation-only, no migrations, no vault writes.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──> Phase 2 (Implementation) ──> Phase 3 (Verification)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Completion |
<!-- /ANCHOR:l2-phase-deps -->

---

<!-- ANCHOR:l2-effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup + fact/wording location | Low-Med | 30 minutes |
| Deferred-item application (4 plugins + 007) | Medium | 1.5 hours |
| Verification + phase package | Low-Med | 45 minutes |
| **Total** | | **~3 hours** |
<!-- /ANCHOR:l2-effort -->

---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Every applied claim traces to a facts-sheet-confirmed source
- [x] No authored code fence embeds spec paths / rec-ids (comment hygiene)

### Rollback Procedure
1. `git checkout -- <changed file>` for any doc found wrong
2. Re-run `validate_document.py` on the reverted file; re-refresh `007` metadata if reverted
3. No vault or runtime state to reverse — documentation-only

### Data Reversal
- **Has data migrations?** No. Documentation-only; the vault was read-only.
<!-- /ANCHOR:l2-rollback -->

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Level 2 addendum
- Phase dependencies and effort estimation
- Enhanced rollback procedure
-->
