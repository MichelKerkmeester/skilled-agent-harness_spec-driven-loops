---
title: "Feature Specification: Naming Standard Hardening"
description: "Harden file and folder naming standards globally and per mode: reconcile the shared standard docs and the doc-validation tooling to the kebab-case canon, wire the existing kebab guards into a gate, and add per-mode naming conformance so the kebab canon is enforced, not merely documented."
trigger_phrases:
  - "naming standard hardening"
  - "kebab-case enforcement"
  - "filesystem naming conformance"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/022-naming-standard-hardening"
    last_updated_at: "2026-07-20T12:28:09Z"
    last_updated_by: "claude-code"
    recent_action: "Scaffolded phased packet; shared hardening is 001, per-mode is 002"
    next_safe_action: "Plan and implement child phase 001"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Naming Standard Hardening

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-07-20 |
| **Track** | sk-doc |
| **Predecessor** | None |
| **Successor** | None |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The kebab-case naming canon (`shared/references/filesystem-naming-convention.md`) is enforced by the code but not by the standard docs or the gates. The classifier rejects underscore content roots, the validators check hyphen-case names, and the skill packager checks kebab paths — yet `shared/references/core-standards.md` §2/§4/§5 still states snake_case as the filename rule and describes an auto-fix that no script performs, the two repo-wide kebab guards (`check_no_new_snake_case.py`, `check_no_hyphenated_catalog_content.py`) run in no gate, and only two of about ten sk-doc modes verify kebab in code. Naming is therefore enforced in some places and merely advised in others.

### Purpose
Make the kebab canon uniformly enforced: reconcile the shared standard docs and the doc-validation tooling to the canon, wire the existing kebab guards into a real gate, and give each mode a conformance check for the artifacts it generates. The canon is already correct; this packet closes the doc-and-enforcement debt that its own §7 flags as pending.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Phase 001 (shared): reconcile `core-standards.md` §2/§4/§5 to the kebab canon, wire the two kebab guards into a gate, and correct the inverted numbered-doc framing.
- Phase 002 (per-mode): add per-mode kebab conformance for the prose-only modes, re-anchor `create-quality-control` to the canon, and reconcile `create-benchmark` doc drift against the identifier-versus-filename boundary.

### Out of Scope
- Changing filenames on disk — the `sk-doc/020-hyphen-naming-convention` program already made the tree kebab-case and the code is kebab-correct.
- The legacy underscore content roots still on disk (e.g. `system-spec-kit/feature_catalog/`), which are a separate content workstream; this packet only sequences around them as a dependency.
- Python filenames, Python import-package directories, and tool-mandated names, which stay per the canon's exemption boundary.

### Files to Change
Per-phase detail lives in each child plan. The aggregate surface is `shared/references/core-standards.md`, the two guard scripts' gate wiring, and per-mode SKILL / reference / template files under `sk-doc/`.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `shared/references/core-standards.md` | Modify | 001 | Flip §2/§4/§5 to the kebab rule |
| pre-commit hook and/or CI | Modify | 001 | Wire the kebab guards into a gate |
| per-mode SKILL / reference / template files | Modify/Create | 002 | Per-mode conformance |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This packet is a phase parent. Each child phase is an independently executable child spec folder; all implementation detail lives inside the children. Run `validate.sh --recursive` on this parent to validate the set.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-fix-shared-standard-and-wire-guards/` | Reconcile `core-standards.md` §2/§4/§5 to the kebab canon and wire the kebab guards (`check_no_new_snake_case`, `check_no_hyphenated_catalog_content`) into a gate | Pending |
| 002 | `002-per-mode-naming-conformance/` | Add per-mode kebab conformance for prose-only modes, re-anchor `create-quality-control` to the canon, and reconcile `create-benchmark` doc drift | Pending |

### Phase Transition Rules

- Each child phase MUST pass `validate.sh --strict` independently.
- This parent spec tracks aggregate progress via the map above.
- Use `/speckit:resume` on a specific `NNN-phase/` child to resume it.
- Run `validate.sh --recursive` on this parent to validate all phases as an integrated unit.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001 | 002 | Shared standard reconciled to kebab and a gate runs a kebab guard | `core-standards.md` states no snake_case filename rule; the gate invokes a kebab guard |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Which gate should host the kebab guards — the existing pre-commit hook, CI, or both? (Resolved in 001.)
- One shared authored-name checker invoked by every mode, or a per-mode check each? (Resolved in 002.)
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Canon**: `.opencode/skills/sk-doc/shared/references/filesystem-naming-convention.md` — the kebab source of truth this packet enforces.
- **Predecessor program**: `sk-doc/020-hyphen-naming-convention` — the naming program this packet completes.
- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md.
- **Graph Metadata**: See `graph-metadata.json` for the `derived.last_active_child_id` pointer.
