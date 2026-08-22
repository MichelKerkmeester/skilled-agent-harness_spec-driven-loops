---
title: "Tasks: Phase 003 — Notion Bases plugin knowledge tie-in"
description: "Task Format: T### [P?] Description (file path) [effort]"
trigger_phrases:
  - "015 notion bases plugin tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-notion-to-obisidian-migration/003-notion-bases-plugin-tie-in"
    last_updated_at: "2026-08-22T04:06:26Z"
    last_updated_by: "claude"
    recent_action: "Built notion-bases 4-file tree, catalog entry, OBS-022 scenario, router intent, manifest regen"
    next_safe_action: "Phase 004: real-vault install + verification script"
    blockers: []
    key_files: ["../001-deep-research/research/research.md", "spec.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "015-003-notion-bases-plugin-tie-in"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->
# Tasks: Phase 003: Notion Bases plugin knowledge tie-in

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

- [x] T001 Re-read `research.md` §5, §7, §8 (`../001-deep-research/research/research.md`) [15m]
- [x] T002 [P] Re-read `references/plugins/dataview/*.md` and `feature-catalog/plugins/dataview.md` [15m]
- [x] T003 [P] Re-read `manual-testing-playbook/plugin-tie-ins/brat-headless-install.md` (OBS-013) [10m]
- [x] T004 Re-confirm the next free `OBS-###` id in `manual-testing-playbook.md` [5m]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Reference tree
- [x] T005 Author `notion-bases.md` (`.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/notion-bases/notion-bases.md`) [30m]
- [x] T006 Author `data-model.md`: relations, rollups, lookups, subtasks, views (`.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/notion-bases/data-model.md`) [1h]
- [x] T007 Author `workflows.md`: file-layer recipes + Dataview supplement section (`.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/notion-bases/workflows.md`) [1h]
- [x] T008 Author `troubleshooting.md` (`.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/notion-bases/troubleshooting.md`) [30m]

### Catalog and scenario
- [x] T009 [P] Author `feature-catalog/plugins/notion-bases.md` (`.opencode/skills/mcp-tooling/mcp-obsidian/feature-catalog/plugins/notion-bases.md`) [20m]
- [x] T010 [P] Author the `OBS-022` manual scenario (`.opencode/skills/mcp-tooling/mcp-obsidian/manual-testing-playbook/plugin-tie-ins/notion-bases-relation-rollup.md`) [30m]
- [x] T011 Register `OBS-022` in `manual-testing-playbook.md` index tables [10m]

### Router and manifest
- [x] T012 Edit `mcp-obsidian/SKILL.md`: `PLUGIN_NOTION_BASES` intent + §8 References [20m]
- [x] T013 Regenerate `leaf-manifest.json` (`node .opencode/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --write .opencode/skills/mcp-tooling`) [5m]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Run `validate_document.py` on all created/edited files — 0 issues each (`--type feature_catalog` for the 4 reference-tree files + catalog entry, `--type reference` for OBS-022, `--type skill` for `SKILL.md`) [15m]
- [x] T015 Run `ci-leaf-manifest-freshness.cjs` — confirm `OK mcp-tooling` [5m]
- [x] T016 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict` — Errors:0 [5m]
- [x] T017 Refresh `implementation-summary.md` + continuity with the actual result [10m]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] `validate_document.py` = 0 issues on all created/edited files (per-type breakdown in T014)
- [x] `ci-leaf-manifest-freshness.cjs` reports `OK mcp-tooling`
- [x] `checklist.md` fully verified
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Predecessor**: `../002-migration-playbook/`
- **Next phase**: `../004-plugin-install-and-verification/`
<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 2 TASKS (~100 lines)
- Core + Level 2 detail
- Effort estimates per task
- Explicit verification tasks
-->
