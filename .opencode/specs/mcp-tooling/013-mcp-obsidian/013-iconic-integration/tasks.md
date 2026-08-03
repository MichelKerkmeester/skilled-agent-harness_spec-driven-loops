---
title: "Tasks — Phase 13 — Iconic plugin integration"
description: "Task list for integrating the Iconic plugin into the mcp-obsidian mode."
trigger_phrases:
  - "phase 13 tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/013-mcp-obsidian/013-iconic-integration"
    last_updated_at: "2026-08-03T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author Phase 13 tasks"
    next_safe_action: "Execute tasks"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/013-iconic-integration"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Tasks — Phase 13 — Iconic plugin integration

<!-- ANCHOR:notation -->
## Task Notation

- `[x]` = done; every completed item carries its evidence inline.
- Task IDs: T001–T009; P-tagged items are blockers.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Capture the Iconic `data.json` schema from the live vaults + the Iconic-Setup bundle [Evidence: `python3 json.load` on all 3 vault data.json files + bundle; rule shape recorded]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Author `references/plugins/iconic/` (index, data-model, workflows, troubleshooting) [Evidence: 4 files present; the index/data-model/workflows were refreshed to v1.3.1.0 with canonical full-asset guidance]
- [x] T003 Extend `references/plugins/plugin-operation-logic.md` data map to 5 plugins [Evidence: 5-row data map with iconic row]
- [x] T004 Update `SKILL.md` (triggers, resource list, exact Iconic resource route, version 1.3.1.0) [Evidence: PLUGIN_ICONIC maps to plugin-operation logic + all 4 Iconic references]
- [x] T005 Add `feature-catalog/plugins/iconic.md` + `manual-testing-playbook/plugin-tie-ins/iconic-rules.md` + index updates [Evidence: 1 card, OBS-015 authored, indexes updated]
- [x] T006 Add `assets/plugins/iconic/` schema example + `changelog/v1.3.0.0.md` [Evidence: excerpt JSON parses + changelog]
- [x] T008 Publish `iconic-rules.full.json` and direct parent-hub Iconic routing [Evidence: 21 fileRules + 11 folderRules equal all three live-vault normalized rule arrays; hub vocabulary + aliases select mcp-obsidian]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Validate initial mode docs and write the implementation summary [Evidence: initial validate.sh run completed; summary written]
- [ ] T009 Re-run full-asset, in-mode-router, hub-router, manifest, and phase validation gates
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

All REQ-001..REQ-005 acceptance criteria met: reference set authored from live vault state, router updated, catalog + playbook entries exist, example + changelog shipped, no regression.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md` (REQ-001..REQ-005, SC-001..SC-002)
- Predecessor: `../012-skill-support-extension/`
- Package: `.opencode/skills/mcp-tooling/mcp-obsidian/`
- Source bundle: `/Users/michelkerkmeester/Downloads/Iconic-Setup/` (install.sh + merge_rules.py patterns)
<!-- /ANCHOR:cross-refs -->
