---
title: "Implementation Plan: Phase 008 — Notion Bases consolidation and calendar recipe"
description: "Confirm the notion-bases calendar keys against the installed plugin main.js, author the §6b Notion-style calendar recipe (Calendar view + Meta Bind quick date entry + optional Dataview agenda) into the shipped workflows doc, validate it, and record the three already-completed consolidation items honestly."
trigger_phrases:
  - "015 notion bases consolidation plan"
  - "notion bases calendar recipe plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-notion-to-obisidian-migration/008-notion-bases-closeout"
    last_updated_at: "2026-08-22T21:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored notion-bases calendar recipe and recorded three prior-phase items"
    next_safe_action: "Complete and closed; no further build work in this phase"
    blockers: []
    key_files:
      - "spec.md"
      - "../../../../.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/notion-bases/workflows.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "015-008-notion-bases-closeout"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->
# Implementation Plan: Phase 008 — Notion Bases consolidation and calendar recipe

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown reference doc under `mcp-obsidian` |
| **Framework** | The 007 deferral's four-item consolidation scope; the installed `notion-bases` plugin bundle as the key-verification source |
| **Storage** | One shipped-doc edit (`notion-bases/workflows.md`); read-only plugin `main.js` in the operator's vault for verification |
| **Testing** | `validate_document.py --type reference` on the changed doc; `validate.sh --strict` on this phase folder |

### Overview
Confirm the calendar-view keys in the installed `notion-bases` `main.js`, then author a §6b calendar recipe that builds on §6a and adds the three layers Notion's calendar actually needs — quick date entry (Meta Bind `datePicker`), a month/week layout toggle (`calendarViewMode`), and an optional read-only agenda (Dataview). Validate the changed doc, then record all four 007-deferred consolidation items honestly: three already completed in prior phases, one newly built here.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The existing notion-bases tree read in full (`notion-bases`, `data-model`, `workflows`, `troubleshooting`) so the new recipe does not duplicate §6a coverage
- [x] The installed `notion-bases` bundle located and readable (`main.js` v1.12.0)
- [x] Scope lock understood — only `notion-bases/workflows.md` + this phase folder are writable; dataview/advanced-canvas/claudian/meta-bind docs are read-only cross-references

### Definition of Done
- [x] §6b calendar recipe authored, building on §6a without duplicating it
- [x] Every documented calendar key confirmed against `main.js`; the absent event-span field marked UNCONFIRMED
- [x] `validate_document.py --type reference` = 0 issues on `workflows.md`
- [x] All four consolidation items recorded honestly (three prior-phase completions, one newly built)
- [x] `validate.sh <this-folder> --strict` = Errors:0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Verify-then-author: grep the installed bundle for each calendar key → author the recipe as a new subsection layered on the existing base view → validate → record the consolidation ledger to the actual result.

### Key Components
- **main.js verification** — grep the installed `notion-bases` bundle for `calendarDateField`, `calendarViewMode` (and its accepted values), the `calendar` view type, and the `notion-bases: true` marker before documenting them; confirm no other `calendar*` key exists so no event-span field is invented.
- **Layered recipe** — §6b names §6a as its prerequisite and contributes exactly three new layers (Notion Bases `calendarViewMode`, Meta Bind `datePicker`, Dataview agenda), each grounded in its owning reference set, so no §6a content is repeated.
- **Cross-reference discipline** — the Meta Bind and Dataview steps point to `../meta-bind/` and `../dataview/` read-only; those trees are never edited, matching the same no-edit rule §7 already uses for Dataview.
- **Honest ledger** — the three completed items are recorded with the prior phase/commit that shipped them; only the calendar recipe is a new action.

### Data Flow
`main.js` confirm → Edit `workflows.md` §6b + §8 checkpoint → `validate_document.py` → author this phase package to the result.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase touches exactly two surfaces: one shipped doc (`.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/notion-bases/workflows.md`) and this phase folder. The dataview/advanced-canvas/claudian/meta-bind shipped docs, the parent packet files, the deep-loop runtime, and any concurrent-session lane are never written. The operator's iCloud-synced vault is read-only — only the plugin `main.js`/`manifest.json` were read for verification.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup & verification
- [x] Read the full notion-bases reference tree to locate existing calendar coverage (§6a, data-model §6/§7)
- [x] Locate and confirm the installed `notion-bases` manifest/version (v1.12.0)
- [x] Grep `main.js` for `calendarDateField`, `calendarViewMode` (+ accepted values), the `calendar` view type, and the `notion-bases: true` marker

### Phase 2: Author the calendar recipe
- [x] Author `workflows.md` §6b (Calendar view + `calendarViewMode` month/week + Meta Bind `datePicker` quick entry + optional Dataview agenda), building on §6a
- [x] Mark the absent multi-day event-span field as UNCONFIRMED rather than inventing a key
- [x] Add the matching `calendar_recipe_wired` checkpoint to the §8 verifying table

### Phase 3: Verification
- [x] `validate_document.py --type reference` on `workflows.md` — 0 issues
- [x] Record the three already-completed consolidation items honestly in this package
- [x] `validate.sh <this-folder> --strict` = Errors:0
- [x] `git status` scoped to `notion-bases/workflows.md` + this phase folder only
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structure | The changed reference doc | `validate_document.py --type reference` |
| Correctness | Each documented calendar key vs. the installed bundle | grep the plugin `main.js` before writing |
| Packet | This phase folder | `validate.sh <folder> --strict` |
| Scope containment | No write outside the two allowed surfaces | `git status --short` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Installed `notion-bases` bundle (`main.js` v1.12.0) | External (vault) | Green (read-only) | Calendar keys can't be verified |
| Phase 009 corrected keys + `data-model.md` §7 | Internal | Green | Wrong key spellings could reappear |
| `validate_document.py` / `validate.sh` | Internal | Green | No completion gate |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the §6b recipe is found wrong on review.
- **Procedure**: `git checkout -- .opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/notion-bases/workflows.md`; the edit is contained to one file and reversible with no runtime impact.
- **Data reversal**: none — documentation-only, no migrations, no vault writes.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup+verify) ──> Phase 2 (Author §6b) ──> Phase 3 (Verify+record)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup+verify | None | Author §6b |
| Author §6b | Setup+verify | Verify+record |
| Verify+record | Author §6b | Completion |
<!-- /ANCHOR:l2-phase-deps -->

---

<!-- ANCHOR:l2-effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup + main.js verification | Low-Med | 30 minutes |
| Author §6b recipe | Medium | 1 hour |
| Verification + phase package + ledger | Low-Med | 45 minutes |
| **Total** | | **~2-2.5 hours** |
<!-- /ANCHOR:l2-effort -->

---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Every documented calendar key has a confirming `main.js` observation
- [x] No authored code fence embeds spec paths / phase numbers / rec-ids (comment hygiene)

### Rollback Procedure
1. `git checkout -- <the workflows.md doc>` if the recipe is found wrong
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
</content>
