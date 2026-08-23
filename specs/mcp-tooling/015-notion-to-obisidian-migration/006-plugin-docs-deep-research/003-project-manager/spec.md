---
title: "Phase 006/003-project-manager: Deep research to optimize the Project Manager mcp-obsidian reference docs"
description: "One deep-research run (4 iterations, GLM-5.2 via cli-devin, early convergence allowed) investigating what to add, update, or create in references/plugins/project-manager/* so an AI can operate the Project Manager plugin more reliably at the file layer, with emphasis on the pm-task frontmatter schema (customFields non-scalar encoding and recurrence fields currently VERIFY). Deliberately skipped once the plugin was deprecated and uninstalled mid-packet; the leg instead verifies no doc investment is warranted."
trigger_phrases:
  - "006 project-manager deep research"
  - "Project Manager reference optimization research"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-notion-to-obisidian-migration/006-plugin-docs-deep-research/003-project-manager"
    last_updated_at: "2026-08-22T09:30:00Z"
    last_updated_by: "claude"
    recent_action: "Verified via fresh-reviewer synthesis that no doc fix is warranted"
    next_safe_action: "Hand synthesis.md verdict to phase 009 apply pass"
    blockers: []
    key_files:
      - "spec.md"
      - "synthesis.md"
      - "research/research.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "015-006-003-project-manager"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Phase 006/003-project-manager: Project Manager reference-docs deep research

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-08-22 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 3 of 7 |
| **Predecessor** | `002-claudian` |
| **Successor** | `004-dataview` |
| **Handoff Criteria** | `synthesis.md` records the fresh-reviewer verdict (no doc investment warranted) with citations, ready for phase `009` to confirm there is nothing to apply. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
This leg was originally scoped to optimize `references/plugins/project-manager/*` — the pm-task frontmatter schema, `customFields` non-scalar encoding, and recurrence fields were flagged `VERIFY`. Before the research iterations ran, the Project Manager plugin (`StepanKropachev/obsidian-pm`) was deprecated and uninstalled from the vault, its role consolidated onto Notion Bases plus Meta Bind + JS Engine, and its dedicated reference docs and feature-catalog entry were already removed. Researching documentation slated for deletion would have wasted executor time.

### Purpose
Deliberately skip the 4-iteration research cycle (`research/research.md` records the skip decision and rationale) and instead independently verify — via a fresh-reviewer pass over the surviving shipped surface — that no pre-deprecation doc fix is warranted, so phase 009 can confirm there is nothing to apply for this plugin.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Confirm the Project Manager plugin is deprecated and uninstalled, with its role consolidated onto Notion Bases + Meta Bind + JS Engine.
- Confirm the dedicated reference docs (`references/plugins/project-manager/`) and feature-catalog entry are already removed.
- Independently verify the three surviving shipped mentions (roster, changelogs) are accurate and need no correction.
- Record the fresh-reviewer verdict in `synthesis.md`.

### Out of Scope
- Running the originally-planned 4-iteration research cycle against a plugin already scheduled for removal.
- Editing `references/plugins/installed-plugins.md` or changelog entries — they are already correct.
- Any removal work itself, which is tracked under phase `008-notion-bases-closeout`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `research/research.md` | Update (this phase) | Skip-note recording the deprecation and the skip rationale |
| `synthesis.md` | Update (this phase) | Fresh-reviewer verdict: no doc investment warranted |
| `spec.md` | Update (this phase) | Re-leveled to Level 1 with retrospective plan/tasks |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|----------------------|
| REQ-001 | Confirm the plugin's deprecation and uninstall status | `research.md` records the deprecation date and the consolidation target (Notion Bases + Meta Bind + JS Engine) |
| REQ-002 | Confirm no correctness debt exists in the surviving shipped mentions | `synthesis.md` independently verifies `installed-plugins.md` and the changelog mentions are accurate as written |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|----------------------|
| REQ-003 | Record the fresh-reviewer verdict | `synthesis.md` states explicitly that no P0/P1/P2 fix is needed before phase `008`'s removal work |
| REQ-004 | Preserve the research-only boundary | No shipped doc is modified by this leg; the removal itself stays scoped to phase `008` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `research.md` documents the skip decision with a dated rationale rather than silently omitting the leg.
- **SC-002**: `synthesis.md` states the "no doc investment warranted" verdict with evidence for each surviving mention it checked.
- **SC-003**: Phase 009 can read this leg's verdict and correctly apply zero changes for Project Manager.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase `008-notion-bases-closeout` owns the actual doc removal | A verdict without a clear handoff could leave stale docs undiscovered | `synthesis.md` explicitly names phase `008` as the removal owner |
| Risk | Skipping research entirely could hide a real correctness gap | An AI could still hit a stale doc before removal lands | Fresh-reviewer pass independently re-checks the surviving shipped mentions rather than trusting the skip alone |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None open. The skip decision and the fresh-reviewer verification are both recorded with evidence; there is no unresolved question for this leg.
<!-- /ANCHOR:questions -->
