---
title: "Feature Specification: sk-create-diagram resource reorganization and code alignment"
description: "Split references/ and assets/ into domain subfolders for scannability, add a scripts/README.md, and close a deeper sk-code-opencode Python alignment pass on the 2 extraction scripts."
trigger_phrases:
  - "sk-create-diagram resource reorganization"
  - "diagram references subfolders"
  - "diagram scripts readme"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/028-sk-create-diagram/008-resource-reorganization-and-code-alignment"
    last_updated_at: "2026-08-12T18:40:07.000Z"
    last_updated_by: "claude"
    recent_action: "Authored phase spec; mapped every cross-reference before moving files"
    next_safe_action: "Run the reorg script, author scripts/README.md, fix the 11 missing type hints, verify"
    blockers: []
    key_files:
      - "spec.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-create-diagram-fork"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "references/ splits into types/, primitives/, import-export/, foundations/ — filenames unchanged, only location moves (decision-record.md)."
      - "assets/ splits into examples/ (34 files) and templates/ (4 files); icons.html stays at assets/ root as the one remaining singleton (decision-record.md)."
      - "The mechanical move-and-relink work is done directly (scripted git mv + token rewrite), not dispatched to Deepseek — precision on ~90 cross-references across 59 files outweighs throughput here (decision-record.md)."
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: sk-create-diagram resource reorganization and code alignment

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | In progress |
| **Created** | 2026-08-12 |
| **Branch** | `sk-doc/0145-sk-create-diagram` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 8 of 9 |
| **Predecessor** | `../007-adherence-audit-and-artifact-completion/spec.md` |
| **Successor** | `../009-manual-playbook-execution/spec.md` |
| **Handoff Criteria** | Every moved file resolves at its new path, every cross-reference is updated, both scripts pass a deeper sk-code-opencode alignment check, `scripts/README.md` exists, and `validate.sh --recursive --strict` stays clean |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## PHASE CONTEXT

**Scope Boundary**: File moves + cross-reference updates + code-standard fixes + one new README, within the already-shipped `sk-create-diagram` packet. No new diagram types, no scope reopening on phases 001-007 decisions.

**Dependencies**: Phase 007 closed the packet with a clean strict-validation baseline; this phase reorganizes the already-audited content, it does not re-audit template adherence.

**Deliverables**: `references/{types,primitives,import-export,foundations}/`, `assets/{examples,templates}/`, `scripts/README.md`, both Python scripts closing the remaining type-hint gap, every cross-reference updated, clean validation.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`references/` (37 files) and `assets/` (39 files) are flat, making the folder hard to scan at a glance in a file tree — the operator flagged this directly after reviewing the merged packet. Separately, phase 007's audit fixed missing docstrings but did not check return-type-hint coverage per function, and no `scripts/README.md` exists despite every sibling `sk-create-*` packet with Python scripts carrying one.

### Purpose

Split `references/` and `assets/` into domain subfolders (filenames unchanged), update every cross-reference this breaks, close the remaining Python type-hint gap against `sk-code-opencode`'s standards, and add `scripts/README.md` following the `sk-create-diff` precedent.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Move `references/type-*.md` (27) into `references/types/`.
- Move `references/primitive-*.md` (4) into `references/primitives/`.
- Move `references/{import-drawio,import-mermaid,export}.md` (3) into `references/import-export/`.
- Move `references/{style-guide,onboarding,output-spec}.md` (3) into `references/foundations/`.
- Move `assets/example-*.html` (34, including the 7 special-pattern variants) into `assets/examples/`.
- Move `assets/template*.html` (4) into `assets/templates/`.
- Leave `assets/icons.html` at the `assets/` root (the one remaining singleton).
- Rewrite every cross-reference this breaks: `SKILL.md`'s resource-domain table and routing map, `README.md`, `changelog/v1.0.0.0.md`, both `manual-testing-playbook/` and `feature-catalog/` SOURCE FILES tables, the 3 command asset files, and every bare-relative sibling link between reference files that now cross a subfolder boundary.
- Add both `references/types/README.md`, `references/primitives/README.md`, `references/import-export/README.md`, `references/foundations/README.md`, and `assets/examples/README.md`, `assets/templates/README.md` as short navigational indexes (matching the `sk-create-*` folder-organization convention for domain subfolders).
- Close the mermaid_extract.py return-type-hint gap (11 functions) found by a deeper sk-code-opencode Python audit.
- Add `.opencode/skills/sk-doc/sk-create-diagram/scripts/README.md` following the `sk-create-diff/scripts/README.md` precedent.

### Out of Scope

- Renaming the files themselves (dropping the `type-`/`primitive-`/`example-` prefixes) — location changes only, per decision-record.md.
- Any change to diagram-generation behavior, the 2 scripts' runtime logic, or the taxonomy decided in phase 007.
- Re-running the phase-007 template-adherence audit — this phase assumes that baseline and only reorganizes/aligns on top of it.

### Aggregate File Scope

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `references/{types,primitives,import-export,foundations}/` | Move + Create | 37 files relocated + 4 new subfolder README indexes |
| `assets/{examples,templates}/` | Move + Create | 38 files relocated + 2 new subfolder README indexes |
| `scripts/mermaid_extract.py` | Modify | 11 missing return type hints added |
| `scripts/README.md` | Create | Code-facing README for the 2 extraction scripts |
| `SKILL.md`, `README.md`, `changelog/v1.0.0.0.md` | Modify | Cross-reference path updates |
| `manual-testing-playbook/`, `feature-catalog/` | Modify | SOURCE FILES table path updates |
| `.opencode/commands/create/assets/*.yaml`, `*.txt` | Modify (if referenced) | Cross-reference path updates |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every moved reference/asset file resolves at its new path with no orphaned old-path citation anywhere in the packet or command files. | Scripted grep for old bare `references/type-`/`references/primitive-`/etc. paths returns zero hits. |
| REQ-002 | Every markdown link (bare-relative or token-prefixed) that crosses a new subfolder boundary resolves to a real file. | Path-resolution check on every `](...)` target in the touched files. |
| REQ-003 | `validate_skill_package.py --strict` and `validate.sh --recursive --strict` stay clean on the whole packet 028 tree. | Command output recorded. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Every function in both scripts has full type-hint coverage (params + return) and every public function has a docstring, verified by AST parsing rather than a line-based grep. | `ast`-based script reports 0 missing param hints, 0 missing return hints, 0 missing public-function docstrings in both files. |
| REQ-005 | `scripts/README.md` exists and follows the `sk-create-diff/scripts/README.md` structural precedent. | `validate_document.py` clean; manual structural comparison. |
| REQ-006 | `manual-testing-playbook/` and `feature-catalog/` SOURCE FILES tables cite the new paths, not the old flat ones. | Grep + validator re-run. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `references/` and `assets/` are organized into the documented domain subfolders with zero orphaned old-path references anywhere in the packet or its command files.
- **SC-002**: Both Python scripts pass a deeper `sk-code-opencode` alignment check (P0+P1 items from `python-checklist.md`), and `scripts/README.md` exists.
- **SC-003**: `validate.sh --recursive --strict` stays at the same clean state phase 007 left (7/8 strict, 8/8 non-strict — the parent's one pre-existing warning is unaffected by this phase's content).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A bare-relative sibling link between two reference files is missed, leaving a silently broken link (markdown renders fine, target 404s). | Medium | Enumerate every bare-relative link before moving anything (done in this turn's investigation), fix each by hand against the enumerated list, then scripted-verify every `](...)` target resolves post-move. |
| Risk | Scripted token substitution over-matches an unrelated string containing `references/type-` or `assets/example-` as a substring. | Low | Substitution list reviewed against a pre-move grep of all matches; only 59 files in the search scope, all inspected. |
| Dependency | Phase 007's clean validation baseline | High | This phase's `validate.sh` re-run compares against that exact baseline. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None — taxonomy, scope of the "add subfolders" request, and the dispatch-vs-orchestrator-direct decision are all resolved in `decision-record.md`.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- Plan: `plan.md`
- Tasks: `tasks.md`
- Checklist: `checklist.md`
- Decision record: `decision-record.md`
- Packet root: `../spec.md`
- Precedent: `.opencode/skills/sk-doc/sk-create-diff/scripts/README.md`
- Standards audited against: `.opencode/skills/sk-code/sk-code-opencode/references/python/{style-guide.md,quality-standards.md}`, `assets/checklists/python-checklist.md`
