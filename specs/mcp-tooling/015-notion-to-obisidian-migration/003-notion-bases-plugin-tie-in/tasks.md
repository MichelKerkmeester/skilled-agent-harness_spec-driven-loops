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
    last_updated_at: "2026-08-22T08:00:00Z"
    last_updated_by: "claude"
    recent_action: "Reopened: de-hedged notion-bases refs, added local-rest-api folder + router intent"
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

<!-- ANCHOR:phase-4 -->
## Phase 4: Post-Install Verification + Local REST API (Reopened 2026-08-22)

- [x] T018 Re-read `notion-bases/{notion-bases,data-model,workflows,troubleshooting}.md` and de-hedge every `VERIFY`/"assume"/"likely" claim confirmed by the plugin's own README (database definition, 18 column types, 7 view types, 7 rollup functions, `nb-database` embed syntax) [45m]
- [x] T019 Correct rollup function `average` → `avg` (exact plugin keyword) across `data-model.md` and `workflows.md` [10m]
- [x] T020 Add the `nb-database` embed syntax to `notion-bases.md` §2, `data-model.md` §6, and a workflow step + checkpoint in `workflows.md` §6, plus matching failure modes in `troubleshooting.md` [30m]
- [x] T021 Consolidate the repeated per-example `VERIFY exact keys` headers into a single up-front note per file, keeping the per-column frontmatter key spelling as the one remaining `VERIFY` item [15m]
- [x] T022 Author `references/plugins/obsidian-local-rest-api/{obsidian-local-rest-api,data-model,workflows,troubleshooting}.md`, mirroring the Dataview 4-file shape, grounded in `SKILL.md`/`references/mcp-tools.md`/`references/troubleshooting.md` [1h]
- [x] T023 Edit `mcp-obsidian/SKILL.md`: add `PLUGIN_LOCAL_REST_API` intent (§2, `INTENT_SIGNALS`, `RESOURCE_MAP`, `PLUGINS` aggregate, `specific_plugin_intents`, §8 References), additive-only; bump `version` 0.18.0.0 → 0.19.0.0 [20m]
- [x] T024 Author `changelog/v0.19.0.0.md` [15m]
- [x] T025 Regenerate `leaf-manifest.json` (`generate-leaf-manifest.cjs --write .opencode/skills/mcp-tooling`) [5m]
- [x] T026 Run `validate_document.py --type feature_catalog` on all 4 `notion-bases/*.md` + all 4 `obsidian-local-rest-api/*.md` (8/8, 0 issues each), `--type skill` on `SKILL.md`, `--type changelog` on `v0.19.0.0.md` [15m]
- [x] T027 Run `ci-leaf-manifest-freshness.cjs` — confirm `OK mcp-tooling` [5m]
- [x] T028 Regenerate `description.json` (`generate-description.js`) and `graph-metadata.json` (`backfill-graph-metadata.js`) to clear the source-fingerprint drift from the reopened edits, then run `validate.sh <this-folder> --strict` — Errors:0 [10m]
- [x] T029 Reconcile `spec.md`/`tasks.md`/`checklist.md`/`implementation-summary.md`/`_memory.continuity` to the reopened-then-closed state [15m]
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] `validate_document.py` = 0 issues on all created/edited files (per-type breakdown in T014, T026)
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
