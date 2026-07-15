---
title: "Tasks: System Code Graph Reference Template Alignment"
description: "Completed implementation tasks for aligning system-code-graph references and smart-router navigation with sk-doc standards."
trigger_phrases:
  - "system-code-graph reference tasks"
  - "code graph router tasks"
  - "reference template alignment tasks"
importance_tier: "important"
contextType: "documentation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/031-code-graph-buildout/007-docs-and-readmes/006-reference-template-alignment"
    last_updated_at: "2026-05-24T08:04:41Z"
    last_updated_by: "codex"
    recent_action: "Completed all planned reference alignment tasks"
    next_safe_action: "Validate edits"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/SKILL.md"
      - ".opencode/skills/system-code-graph/references/"
    session_dedup:
      fingerprint: "sha256:586a34ad2a913933f87f99e3db85aba7013c377db6825e0026456e59ce253e56"
      session_id: "system-code-graph-reference-template-alignment"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: System Code Graph Reference Template Alignment

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Inspect `system-code-graph/SKILL.md` smart router and resource maps.
- [x] T002 Inspect sk-doc reference template requirements.
- [x] T003 [P] Inventory existing `system-code-graph/references/*.md` files.
- [x] T004 [P] Search active docs for old root reference links.
- [x] T005 Locate parent spec folder and create `022-reference-template-alignment`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Create canonical folders under `references/runtime`, `references/readiness`, `references/config`, and `references/integrations`.
- [x] T007 Move `tool-surface.md` to `runtime/tool_surface.md`.
- [x] T008 Move `naming-conventions.md` to `runtime/naming_conventions.md`.
- [x] T009 Move `ownership-boundary.md` to `runtime/ownership_boundary.md`.
- [x] T010 Move `launcher-lease.md` to `runtime/launcher_lease.md`.
- [x] T011 Move readiness references to `readiness/code_graph_readiness_check.md` and `readiness/readiness_and_scope_fingerprint.md`.
- [x] T012 Move `database-path-policy.md` to `config/database_path_policy.md`.
- [x] T013 Move `ccc-bridge-integration.md` to `integrations/ccc_bridge_integration.md`.
- [x] T014 Add old-path compatibility stubs with valid reference-template shape.
- [x] T015 Align canonical reference intros, overviews, numbered H2s, and related-resource links.
- [x] T016 Rewrite `system-code-graph/SKILL.md` smart router with dynamic markdown discovery.
- [x] T017 Add `_guard_in_skill()`, `load_if_available()`, `_task_text()`, weighted intent scoring, ambiguity handling, `UNKNOWN_FALLBACK_CHECKLIST`, and no-KB notice behavior.
- [x] T018 Refresh `RESOURCE_MAP` to canonical references only.
- [x] T019 Update `README.md` related-document links.
- [x] T020 Update `ARCHITECTURE.md` active reference links.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T021 Run `extract_structure.py` on changed skill/readme/architecture docs and all references.
- [x] T022 Run `validate_document.py --type reference --blocking-only` on every changed reference and stub.
- [x] T023 Run `validate_document.py --type skill --blocking-only` on `system-code-graph/SKILL.md`.
- [x] T024 Run `validate_document.py --type readme --blocking-only` on `system-code-graph/README.md`.
- [x] T025 Run `quick_validate.py .opencode/skills/system-code-graph --json`.
- [x] T026 Run stale-link, kebab-case canonical path, table-of-contents, H2 numbering, and local-link smoke checks.
- [x] T027 Update packet docs and run strict spec validation.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remain.
- [x] Manual verification passed through the command evidence in `implementation-summary.md`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
- **Verification evidence**: See `checklist.md` and `implementation-summary.md`.
<!-- /ANCHOR:cross-refs -->
