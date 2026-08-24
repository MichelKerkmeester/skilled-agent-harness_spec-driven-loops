---
title: "Implementation Plan: Phase 007 — Excalidraw deprecation (footprint removal from mcp-obsidian)"
description: "Plan the removal of the Excalidraw footprint from the mcp-obsidian skill: delete the reference tree, catalog card, assets and manual tie-in, then strip PLUGIN_EXCALIDRAW from the router and every narrative doc, leaving all counts and cross-references consistent."
trigger_phrases:
  - "015 excalidraw deprecation plan"
  - "remove excalidraw wiring plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-notion-to-obisidian-migration/007-excalidraw-deprecation"
    last_updated_at: "2026-08-22T13:00:00Z"
    last_updated_by: "claude"
    recent_action: "removed the Excalidraw skill footprint (files + router wiring + narrative docs)"
    next_safe_action: "None — phase complete; the broader consolidation is 008"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "015-007-excalidraw-deprecation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->
# Implementation Plan: Phase 007: Excalidraw deprecation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown deletions + edits across the `mcp-obsidian` skill (reference tree, catalog card, assets, manual tie-in, `SKILL.md` router, README, FEATURE-CATALOG, plugin-operation-logic, playbook) |
| **Framework** | The skill's existing plugin-reference + router structure — a subtractive change, no new pattern |
| **Storage** | In-repo skill docs under `.opencode/skills/mcp-tooling/mcp-obsidian/` |
| **Testing** | `validate_document.py` (skill/reference), residual-grep, `validate.sh --strict` |

### Overview
Excalidraw was uninstalled from the operator's vault. This phase removes its footprint from the skill so the docs and router match reality. The work is subtractive: delete four artifact groups (reference tree, catalog card, assets, manual tie-in) and strip `PLUGIN_EXCALIDRAW` from every wiring point, then verify no residual reference and no dangling router link remain. The single subtlety is counts — FEATURE-CATALOG's plugin-card total nets to zero because 008 adds Meta Bind, so only list membership changes.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Operator confirmed "remove entirely" + "uninstall from vault" + "new phase"
- [x] The full Excalidraw footprint mapped (grep across the skill)

### Definition of Done
- [x] All Excalidraw files deleted (reference tree, catalog card, 2 assets, manual tie-in)
- [x] `PLUGIN_EXCALIDRAW` stripped from every `SKILL.md` surface; counts consistent
- [x] Excalidraw removed from README, FEATURE-CATALOG, plugin-operation-logic, and the playbook
- [x] No residual `excalidraw` outside historical changelogs; changed docs validate clean; `validate.sh --strict` Errors:0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Pure subtraction from the existing skill structure. Nothing new is designed; the risk is entirely in leaving a dangling reference or an inconsistent count.

### Key Components
- **Deletions**: `references/plugins/excalidraw/` (4), `feature-catalog/plugins/excalidraw.md`, `assets/plugins/excalidraw/` (2), `manual-testing-playbook/plugin-tie-ins/excalidraw-drawing-note.md`.
- **Router de-wiring**: remove `PLUGIN_EXCALIDRAW` from `SKILL.md` §2 loading map, `INTENT_SIGNALS`, `RESOURCE_MAP`, `specific_plugin_intents`, the `PLUGINS` aggregate, the headline list, the keyword comment, and the intent-count comment.
- **Narrative de-wiring**: README lists + plugin-knowledge table; FEATURE-CATALOG card; plugin-operation-logic artifact row + list; playbook scenario `OBS-018` + summary row + count.

### Data Flow
Operator request → delete artifacts → strip router wiring → strip narrative references → verify (residual grep + `validate_document.py` + link-resolution check + `validate.sh --strict`).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

**This phase touches only `.opencode/skills/mcp-tooling/mcp-obsidian/`** (deletions + edits) and this spec folder. No file outside the skill is changed. The vault-side Excalidraw uninstall was executed in an earlier plugin-management session and is not re-run here.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Map
- [x] Grep the whole skill for `excalidraw` to inventory every artifact and wiring point

### Phase 2: Remove
- [x] Delete the four artifact groups
- [x] Strip `PLUGIN_EXCALIDRAW` from every `SKILL.md` surface + fix the count comment
- [x] Remove Excalidraw from README, FEATURE-CATALOG, plugin-operation-logic, and the playbook

### Phase 3: Verify
- [x] Residual grep returns only historical changelogs
- [x] Every `SKILL.md` RESOURCE_MAP path resolves; INTENT_SIGNALS count matches the comment
- [x] `validate_document.py` clean on all changed docs
- [x] `validate.sh <this-folder> --strict` = Errors:0
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Residual | No `excalidraw` outside changelogs | `grep -ri excalidraw` |
| Link integrity | Every RESOURCE_MAP path resolves; no dangling reference | scripted path-existence check |
| Structure | Changed docs valid | `validate_document.py` |
| Scope | Only the skill + this folder changed | `git status` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Operator "remove entirely / new phase" decision | External | Green | No scope |
| Footprint map (grep) | Internal | Green | Missed residual |
| Git tracking of deleted files | Internal | Green | Rollback path |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a deletion or wiring edit is found wrong on review.
- **Procedure**: `git restore` the deleted Excalidraw paths and `git checkout` the edited skill files; contained to `mcp-obsidian`, no vault change involved.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Map) ──> Phase 2 (Remove) ──> Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Map | None | Remove |
| Remove | Map | Verify |
| Verify | Remove | Completion |
<!-- /ANCHOR:l2-phase-deps -->

---

<!-- ANCHOR:l2-effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Map | Low | 15 minutes |
| Remove | Medium | 45 minutes |
| Verify | Low | 15 minutes |
| **Total** | | **~1.25 hours** |
<!-- /ANCHOR:l2-effort -->

---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] All deleted files are git-tracked (recoverable via `git restore`)
- [x] Edits are contained to the `mcp-obsidian` skill

### Rollback Procedure
1. `git restore -- <deleted excalidraw paths>` to recover the reference tree, catalog card, assets, and manual tie-in
2. `git checkout -- <edited skill files>` to revert the wiring/narrative edits
3. Re-run the residual grep to confirm the restored state

### Data Reversal
- **Has data migrations?** No. Pure in-repo doc deletion/editing, fully reversible via git.
<!-- /ANCHOR:l2-rollback -->

---

<!--
LEVEL 2 PLAN
- Subtractive change; risk is dangling references and inconsistent counts
-->
