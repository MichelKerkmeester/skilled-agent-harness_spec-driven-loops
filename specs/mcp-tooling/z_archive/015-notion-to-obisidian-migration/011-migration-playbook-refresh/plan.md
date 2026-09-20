---
title: "Implementation Plan: Phase 011 — Refresh the Notion→Obsidian migration playbook"
description: "Author the view-recovery and interactive-element recovery sections in the write-side migration method and the recovery-routing map in the read-side inventory, grounding every capability in the corrected 006 plugin reference docs, then validate both docs and this packet."
trigger_phrases:
  - "015 migration playbook refresh plan"
  - "notion migration playbook refresh plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-notion-to-obisidian-migration/011-migration-playbook-refresh"
    last_updated_at: "2026-08-23T06:00:00Z"
    last_updated_by: "claude"
    recent_action: "Refreshed migration playbook with 006 plugin research"
    next_safe_action: "None — parent phase-map refresh is the orchestrator's step"
    blockers: []
    key_files:
      - "spec.md"
      - "../010-plugin-doc-recs-followup/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "015-011-migration-playbook-refresh"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->
# Implementation Plan: Phase 011 — Refresh the Notion→Obsidian migration playbook

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown reference docs under `mcp-obsidian` and `mcp-notion`; spec-folder metadata under `specs/` |
| **Framework** | The corrected 006 plugin reference docs (notion-bases, meta-bind, dataview), verified against the installed plugin builds |
| **Storage** | Edits to two shipped migration playbook docs; read-only plugin reference docs and vault |
| **Testing** | `validate_document.py --type reference` per changed doc; `validate.sh --strict` on this folder |

### Overview
Read the corrected plugin refs as source of truth, then author each refresh: the write-side view-recovery and interactive-element recovery sections and the sibling-reference additions in `notion-migration.md`, and the read-side recovery-routing map in `migration-inventory.md`. Ground every capability in the plugin refs, keep the parity-honesty discipline, validate each changed doc, then author and validate this phase package `--strict`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The corrected plugin reference docs (notion-bases, meta-bind, dataview) read in full as source of truth
- [x] The two migration playbook docs read in full before editing
- [x] Scope lock understood — only `notion-migration.md`, `migration-inventory.md`, and this folder are writable

### Definition of Done
- [x] `notion-migration.md` §4 carries view recovery and interactive-element recovery, grounded in the plugin refs
- [x] `notion-migration.md` §7/§8 list the notion-bases and meta-bind trees, Dataview kept
- [x] `migration-inventory.md` carries a recovery-routing map that routes rather than duplicates
- [x] Both edited docs pass `validate_document.py` (0 issues)
- [x] `validate.sh <this-folder> --strict` = Errors:0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Source-grounded documentation refresh: read a confirmed plugin-ref fact → author the migration-playbook wording that uses it → validate. No plugin behavior is invented; the 006 research confirmed each key/action against the installed build, and this phase authors from those refs.

### Key Components
- **View recovery** — each dropped Notion view maps to a confirmed Notion Bases view-config key set (`calendarDateField`/`calendarViewMode`, `timelineStartField`/`timelineEndField`/`timelineGroupByField`, `groupByColumnId`/`boardColumnOrder`/`boardColumnLimits`, `galleryCoverField`/`galleryCardSize`, `chartType`/`chartXAxis`/`chartYAxis`), with the calendar recipe single-sourced in the plugin refs and an honest Core-Bases/Dataview fallback.
- **Interactive-element recovery** — Notion buttons/date widgets/live timers map to Meta Bind (`meta-bind-button`, the `js` action, `INPUT[datePicker]`) plus JS Engine frontmatter writes, framed as reconstruction with the parity honesty preserved.
- **Recovery routing (read side)** — the inventory doc gets a feature→plugin map that flags what each dropped/at-risk feature needs and points to the write-side recipes rather than duplicating them.

### Data Flow
plugin refs (source of truth) → author write-side view/interactive recovery + sibling refs → author read-side recovery-routing map → `validate_document.py` per doc → author phase package → `generate-description.js` + `backfill-graph-metadata.js` → `validate.sh --strict`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase touches two shipped docs — `.opencode/skills/mcp-tooling/mcp-obsidian/references/notion-migration.md` (write side) and `.opencode/skills/mcp-tooling/mcp-notion/references/migration-inventory.md` (read side) — plus this phase folder. The plugin reference docs (notion-bases, meta-bind, dataview) are read-only source of truth and are not edited. Phase 010, the parent packet, the deep-loop runtime, `system-deep-loop`, `compiled-routing`, and any concurrent-session lane are never written. The vault is read-only; no plugin file, `.canvas`, or token is read.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read the corrected plugin refs (notion-bases `data-model.md`/`workflows.md`/`notion-bases.md`, meta-bind `meta-bind.md`/`workflows.md`/`data-model.md`, dataview `data-model.md`) as source of truth
- [x] Read both migration playbook docs in full and locate §4, §7, §8 (write side) and §2 (read side)
- [x] Confirm the baseline: both docs already pass `validate_document.py` with 0 issues

### Phase 2: Implementation
- [x] `notion-migration.md` §4: rename the heading and add the view-recovery subsection (view-config keys + calendar recipe pointer + Core-Bases/Dataview fallback + 7-of-10 parity note)
- [x] `notion-migration.md` §4: add the interactive-element recovery subsection (Meta Bind `js` buttons + `INPUT[datePicker]` + JS Engine live timers), parity honesty preserved
- [x] `notion-migration.md` §7/§8: add the notion-bases and meta-bind trees, keep Dataview
- [x] `migration-inventory.md` §2: add the recovery-routing map (feature → recovery plugin), routing to `notion-migration.md` §4 and the plugin refs

### Phase 3: Verification
- [x] `validate_document.py` on both edited docs — 0 issues each
- [x] Author this phase package; run `generate-description.js` + `backfill-graph-metadata.js`
- [x] `validate.sh <this-folder> --strict` = Errors:0
- [x] Confirm scope containment via `git status --short`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structure | Both edited reference docs | `validate_document.py --type reference` |
| Packet | This phase folder | `validate.sh <folder> --strict` |
| Grounding | Every cited key/action traces to a plugin ref | Manual cross-check against the plugin reference docs |
| Scope containment | No write outside the two docs + this folder | `git status --short` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Corrected 006 plugin reference docs | Internal | Green | No confirmed keys/actions to author from |
| Both migration playbook docs | Internal | Green | No target to refresh |
| `validate_document.py` / `validate.sh` | Internal | Green | No completion gate |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a migration-playbook edit is found wrong or ungrounded on review.
- **Procedure**: `git checkout -- <changed doc>` for the affected file; re-run `validate_document.py` on the reverted file.
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
| Setup + read plugin refs and playbook docs | Low-Med | 30 minutes |
| Write-side + read-side refresh | Medium | 1 hour |
| Verification + phase package | Low-Med | 30 minutes |
| **Total** | | **~2 hours** |
<!-- /ANCHOR:l2-effort -->

---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Every cited capability traces to a plugin reference doc
- [x] No authored code fence embeds spec paths / phase numbers / rec-ids (comment hygiene)

### Rollback Procedure
1. `git checkout -- <changed doc>` for any file found wrong or ungrounded
2. Re-run `validate_document.py` on the reverted file
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
