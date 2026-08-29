---
title: "Feature Specification: Repo convention audit"
description: "Measure the plugin tree's real naming, comment, folder-doc and stylesheet conventions, and the gate baselines every later phase is judged against."
trigger_phrases:
  - "repo convention audit"
  - "obsidian plugin baseline"
  - "measured convention state"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/007-sk-code-obsidian-surface/002-repo-convention-audit"
    last_updated_at: "2026-08-28T21:40:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Recorded measured audit"
    next_safe_action: "Consume audit in later phases"
    blockers: []
    key_files:
      - "audit.json"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Repo convention audit

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-28 |
| **Branch** | `worktrees/001-sk-code-obsidian-surface` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `sk-code/007-sk-code-obsidian-surface` |
| **Predecessor** | `001-surface-design-plan` |
| **Successor** | `003-hub-wiring` |
| **Handoff Criteria** | Every convention the surface documents has a measured number behind it |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

A surface packet that describes conventions the tree does not have is worse than none: it reads as
authoritative while documenting an intention. The template this packet mirrors documents a repository
whose conventions are already enforced by scanners. This plugin's are not, and nobody had measured
the distance.

### Purpose

Measure it. Produce a machine-readable record of the plugin's actual naming, comment, folder-doc and
stylesheet state, plus the exact gate baselines, so every later phase cites a number rather than an
impression, and so the scanners built in phase 008 can be proven to fail before they are made to
pass.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Filename inventory and case distribution across `src/` and `tools/`.
- Comment inventory: banner coverage, section rules, comment density, commented-out code.
- Folder-doc inventory against the three-or-more-direct-sources threshold.
- Stylesheet size, banner style, comment language, and distinct class count.
- Rename blast radius: relative imports, distinct modules, hard-coded scenario source paths.
- Gate baselines with exit statuses read, not assumed.

### Out of Scope (frozen)

- Changing anything. This phase is read-only; it measures and records.
- Judging whether a convention is right. That is the design plan's job.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `audit.json` | Create | 002 | The measured record every later phase cites |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001 [P0]** Every figure is produced by a command whose output and exit status were read.
- **REQ-002 [P0]** The record is machine-readable so later phases cite it rather than re-measuring.
- **REQ-003 [P0]** Gate baselines include the known-failing lint result, so no later phase mistakes
  a pre-existing failure for a regression it caused.
- **REQ-004 [P1]** The rename blast radius is quantified before any rename is planned.
- **REQ-005 [P1]** Known open debt from the preceding packets is carried as evidence, not repaired.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- Every convention the surface documents has a measured figure behind it, produced by a command
  whose output and exit status were read.
- The gate baselines are recorded including the failing lint result, so no later phase mistakes a
  pre-existing failure for one it introduced.
- The rename blast radius is quantified before any rename is designed, including the consumers
  outside `src/` that a naive search would miss.
- An independently written scanner reproduces the same counts. Agreement between two separate
  derivations is the audit's real proof; disagreement invalidates both.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Consequence | Mitigation |
|------|-------------|------------|
| Measuring from a bare worktree | Every gate reports a false failure because gitignored dependencies are absent | Link `node_modules` before capturing any baseline |
| Reading an exit status through a pipe | zsh does not populate `PIPESTATUS`, so a failing gate reads as passing | Capture status directly, never after a pipe |
| Treating the lint baseline as clean | A later phase claims a regression it did not cause, or hides one it did | Record 115 problems as the known failing baseline |
| Counting only `src/` for the rename radius | Hard-coded paths in the capture scenarios and manifest break silently | Search consumers outside `src/` explicitly |
| Confusing measurement with judgement | The audit starts prescribing rather than recording | Scope frozen to read-only; design decisions belong to phase 001 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None. The measurements are complete and reproducible from the commands recorded in `plan.md`.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- [`audit.json`](audit.json) — the measured record.
- [`../001-surface-design-plan/mode-design-plan.md`](../001-surface-design-plan/mode-design-plan.md)
- [`../spec.md`](../spec.md) — packet scope.
