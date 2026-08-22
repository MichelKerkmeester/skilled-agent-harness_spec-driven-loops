---
title: "Tasks: Phase 007 — Excalidraw deprecation (footprint removal)"
description: "Task Format: T### [P?] Description (file path) [effort]"
trigger_phrases:
  - "015 excalidraw deprecation tasks"
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
    key_files: ["spec.md", "plan.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "015-007-excalidraw-deprecation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->
# Tasks: Phase 007: Excalidraw deprecation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Grep the whole skill for `excalidraw` to inventory every artifact and wiring point (`.opencode/skills/mcp-tooling/mcp-obsidian/`) [15m]
  - **Evidence**: inventory = reference tree (4), catalog card, assets (2), manual tie-in; wiring in `SKILL.md` (loading map, INTENT_SIGNALS, RESOURCE_MAP, PLUGINS aggregate, tuple, headline list, keyword comment, count comment), README (4 spots), FEATURE-CATALOG (card + counts), plugin-operation-logic (list + artifact row), playbook (OBS-018 + summary row + count).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Delete the four Excalidraw artifact groups (`references/plugins/excalidraw/`, `feature-catalog/plugins/excalidraw.md`, `assets/plugins/excalidraw/`, `manual-testing-playbook/plugin-tie-ins/excalidraw-drawing-note.md`) [10m]
  - **Evidence**: all verified gone on disk after `rm`.
- [x] T003 Strip `PLUGIN_EXCALIDRAW` from every `SKILL.md` surface and fix the intent-count comment (`.opencode/skills/mcp-tooling/mcp-obsidian/SKILL.md`) [20m]
  - **Gate**: no `excalidraw` token in `SKILL.md`; INTENT_SIGNALS/RESOURCE_MAP key counts match the comment (`twenty-one` after the offsetting Meta Bind addition in 008).
- [x] T004 [P] Remove Excalidraw from README (4 spots) and FEATURE-CATALOG (card + counts) [15m]
  - **Gate**: `validate_document.py` clean on both.
- [x] T005 [P] Remove the Excalidraw list entry + artifact row from plugin-operation-logic, and scenario `OBS-018` + summary row + count from the playbook [15m]
  - **Gate**: `validate_document.py` clean on both.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Residual grep — no `excalidraw` outside historical changelogs (`.opencode/skills/mcp-tooling/mcp-obsidian/`) [5m]
  - **Evidence**: `grep -ri excalidraw` returns only `changelog/v0.10/v0.14/v0.20`.
- [x] T007 Confirm every `SKILL.md` RESOURCE_MAP path resolves and the INTENT_SIGNALS count matches the comment [5m]
  - **Evidence**: scripted path-existence check found 0 missing; 21 INTENT_SIGNALS keys = comment `twenty-one`.
- [x] T008 `validate_document.py` on all changed docs — 0 issues [10m]
  - **Evidence**: SKILL, README, FEATURE-CATALOG, plugin-operation-logic, playbook all `Total issues: 0`.
- [x] T009 `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict` — Errors:0 [5m]
  - **Gate**: closeout run.
- [x] T010 Confirm `git status` shows no file changed outside the skill and this spec folder [5m]
  - **Evidence**: only `mcp-obsidian/` and this folder changed.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All Phase 1-3 tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] `validate_document.py` = 0 issues on every changed doc
  - **Evidence**: see T008.
- [x] `validate.sh <this-folder> --strict` = Errors:0
  - **Evidence**: see T009.
- [x] `checklist.md` fully verified for this phase
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Predecessor**: `../006-plugin-docs-deep-research/`
- **Successor**: `../009-apply-plugin-doc-recs/`
<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 2 TASKS — subtractive footprint removal
-->
