---
title: "Tasks: Phase 002 — Notion→Obsidian migration playbook"
description: "Task Format: T### [P?] Description (file path) [effort]"
trigger_phrases:
  - "015 migration playbook tasks"
  - "notion-migration.md tasks"
  - "migration-inventory.md tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-notion-to-obisidian-migration/002-migration-playbook"
    last_updated_at: "2026-08-22T03:41:25Z"
    last_updated_by: "claude"
    recent_action: "All 12 tasks executed; reference docs and router edits verified"
    next_safe_action: "Phase 003: build the Notion Bases plugin reference tree"
    blockers: []
    key_files: ["../001-deep-research/research/research.md", "spec.md", "implementation-summary.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "015-002-migration-playbook"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->
# Tasks: Phase 002: Notion→Obsidian migration playbook

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

- [x] T001 Re-read `research.md` §3, §4, §5, §6, §9, §10 (`../001-deep-research/research/research.md`) [10m]
  - **Evidence**: Full research.md read prior to drafting both reference docs; §5/§9/§10 tables reproduced verbatim in `notion-migration.md`, §3 reproduced in `migration-inventory.md`
- [x] T002 [P] Re-read `references/plugins/dataview/dataview.md` as the mcp-obsidian reference shape (`.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/dataview/dataview.md`) [5m]
  - **Evidence**: Read in full; `notion-migration.md` mirrors its numbered ALL-CAPS H2 + `---` divider + "WHEN TO USE"/"RELATED RESOURCES" closing-section shape
- [x] T003 [P] Re-read `references/api-gap-tools.md` as the mcp-notion reference shape (`.opencode/skills/mcp-tooling/mcp-notion/references/api-gap-tools.md`) [5m]
  - **Evidence**: Read in full; `migration-inventory.md` mirrors its compact table-first shape
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### mcp-obsidian side
- [x] T004 Author `notion-migration.md` (`.opencode/skills/mcp-tooling/mcp-obsidian/references/notion-migration.md`): 8-step method, division-of-labor table, three-way recovery matrix, comment reconstruction, 11-check verification protocol [1h]
  - **Evidence**: File created, all five content blocks present (§2-6); `validate_document.py --type feature_catalog` = 0 issues
- [x] T005 Edit `mcp-obsidian/SKILL.md`: add the migration intent/route to §2, `INTENT_SIGNALS`, `RESOURCE_MAP`, and §8 References (`.opencode/skills/mcp-tooling/mcp-obsidian/SKILL.md`) [30m]
  - **Evidence**: `NOTION_MIGRATION` intent added additively; router pseudocode extraction test confirms it routes and all pre-existing intents are unaffected; `validate_document.py --type skill` = 0 issues

### mcp-notion side
- [x] T006 [P] Author `migration-inventory.md` (`.opencode/skills/mcp-tooling/mcp-notion/references/migration-inventory.md`): 7-step inventory procedure, 5 API-gap reads, read-limit constraints [45m]
  - **Evidence**: File created, all three content blocks present (§2-4); `validate_document.py --type feature_catalog` = 0 issues
- [x] T007 [P] Edit `mcp-notion/SKILL.md`: add the reference pointer to §2, extend/add the intent in `INTENT_SIGNALS`/`RESOURCE_MAP`, and §8 References (`.opencode/skills/mcp-tooling/mcp-notion/SKILL.md`) [30m]
  - **Evidence**: New `NOTION_MIGRATION` intent added additively (not an extension of `NOTION_API_GAP`); the pre-existing "When NOT to Use" note and "Migration (packet 015)" line reconciled to point at `references/migration-inventory.md`; `validate_document.py --type skill` = 0 issues

### Manifest
- [x] T008 Regenerate `leaf-manifest.json` (`node .opencode/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --write .opencode/skills/mcp-tooling`) [5m]
  - **Evidence**: `leaf-manifest.json written (0da5bcc07780b2d121a5c9a261e0f3d109174c52b0f89aa003978dadfcb7e541)`; both new leaves confirmed present under the `mcp-obsidian`/`mcp-notion` packets
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run `validate_document.py --type skill` on both new reference docs and both edited SKILL.md — 0 issues [10m]
  - **Evidence**: New reference docs validated `--type feature_catalog` per spec.md's verification command (0 issues each); both SKILL.md validated `--type skill` (0 issues each) — see implementation-summary.md Verification table
- [x] T010 Run `ci-leaf-manifest-freshness.cjs` — confirm `OK mcp-tooling` (`node .opencode/skills/sk-doc/sk-create-skill/scripts/ci-leaf-manifest-freshness.cjs`) [5m]
  - **Evidence**: `OK    mcp-tooling  0da5bcc07780b2d121a5c9a261e0f3d109174c52b0f89aa003978dadfcb7e541` — `checked=13 fresh=13 failed=0`
- [x] T011 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict` — Errors:0 [5m]
  - **Evidence**: `Summary: Errors: 0  Warnings: 0` / `RESULT: PASSED`
- [x] T012 Refresh `implementation-summary.md` + continuity with the actual result [10m]
  - **Evidence**: `implementation-summary.md` rewritten to the real final state; continuity frontmatter across spec.md/plan.md/tasks.md/checklist.md/implementation-summary.md set to `completion_pct: 100`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] `validate_document.py --type skill` = 0 issues on all four touched/created files (two reference docs via `--type feature_catalog` per spec.md's verification command, two SKILL.md via `--type skill`)
- [x] `ci-leaf-manifest-freshness.cjs` reports `OK mcp-tooling`
- [x] `checklist.md` fully verified
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Predecessor**: `../001-deep-research/`
- **Next phase**: `../003-notion-bases-plugin-tie-in/`
<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 2 TASKS (~100 lines)
- Core + Level 2 detail
- Effort estimates per task
- Explicit verification tasks
-->
