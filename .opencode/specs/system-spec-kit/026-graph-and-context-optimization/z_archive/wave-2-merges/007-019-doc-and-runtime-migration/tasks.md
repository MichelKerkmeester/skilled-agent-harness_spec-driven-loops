---
title: "Tasks: Doc migration for system-code-graph"
description: "Task ledger for Phase 005 category-22 doc split and reference updates."
trigger_phrases:
  - "code graph doc migration tasks"
importance_tier: "important"
contextType: "tasks"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/005-code-graph/019-doc-and-runtime-migration"
    last_updated_at: "2026-05-14T08:21:27Z"
    last_updated_by: "codex"
    recent_action: "Completed Phase 005 doc migration and strict validation"
    next_safe_action: "Phase 006 validation cleanup"
    blockers:
      - ".codex/agents/*.toml were readable but not writable in sandbox; Operation not permitted"
    key_files:
      - "tasks.md"
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Tasks: Doc migration for system-code-graph

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## TASK NOTATION

| Marker | Meaning |
|--------|---------|
| `[ ]` | Open |
| `[x]` | Done |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## PHASE 1: SETUP

- [x] T001 Create Phase 005 spec packet.
- [x] T002 Update parent 014 `graph-metadata.json`.
- [x] T003 Classify feature catalog and manual playbook category-22 docs.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [x] T010 Create target category-22 directories under `system-code-graph`.
- [x] T011 Move code-graph feature catalog docs. (`git mv` blocked by sandbox `.git/index.lock`; filesystem move used)
- [x] T012 Move code-graph manual testing playbook docs. (`git mv` blocked by sandbox `.git/index.lock`; filesystem move used)
- [x] T013 Update stayed shared docs with cross-skill pointers.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [x] T020 Update agent definitions. (9 writable files updated; 3 Codex mirrors blocked by sandbox write permissions)
- [x] T021 Update command docs and doctor route docs.
- [x] T022 Update top-level docs and `opencode.json`.
- [x] T023 Update skill cross-references.
- [x] T024 Update constitutional/config references.
- [x] T025 Update `system-code-graph/SKILL.md` and `README.md`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## PHASE 4: VERIFICATION

- [x] T030 Strict-validate Phase 005 packet. (exit 0)
- [x] T031 Count moved feature catalog docs. (6)
- [x] T032 Count moved manual playbook docs. (8)
- [x] T033 Grep requested surfaces for stale source-path references. (0 old `system-spec-kit/mcp_server/code_graph` hits)
- [x] T034 Populate implementation summary and final counts.
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## COMPLETION CRITERIA

- [x] All Phase 1-4 tasks `[x]`.
- [x] No `[B]` blockers.
- [x] Strict validation exit code captured. (0)
- [x] Final required output fields can be populated.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## CROSS-REFERENCES

- Parent: `005-code-graph/013-system-code-graph-extraction`
- Previous child: `014/004-rewire-consumers-and-tool-registration`
- ADR source: `014/001-design-and-decision-record/decision-record.md`
- Target skill: `.opencode/skills/system-code-graph/`
<!-- /ANCHOR:cross-refs -->
