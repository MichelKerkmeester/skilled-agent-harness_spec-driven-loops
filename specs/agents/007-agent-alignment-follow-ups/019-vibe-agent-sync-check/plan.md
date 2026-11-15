---
title: "Implementation Plan: Phase 19: vibe-agent-sync-check"
description: "Regenerate the two stale Vibe agent profiles with their generator and add a CI job that runs the three Vibe drift checks, beside the job that checks the DSH copies."
trigger_phrases:
  - "vibe agent sync check plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 19: vibe-agent-sync-check

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | GitHub Actions YAML, generated TOML |
| **Framework** | The spec-kit runtime mirror generators |
| **Storage** | None |
| **Testing** | The generators' `--check` mode and `actionlint` |

### Overview
Run the Vibe agent generator to bring the profiles back in line, then copy the DSH mirror job into a Vibe mirror job in the same workflow. The conductor makes these edits directly, because one is a generator run and the other is a copy of an existing job.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] The three Vibe checks exit 0 and `actionlint` passes
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Each generated runtime mirror has a `--check` mode, and CI runs it whenever the mirror or its source changes.

### Key Components
- **`sync-agents-vibe.cjs`**: renders each `.skilled/agents/*.md` into a `.vibe/agents/*.toml` profile.
- **`command-tree-parity.yml`**: holds the DSH mirror job and now the Vibe one.

### Data Flow
A push that touches an agent, a command, a `SKILL.md` or `.vibe/` starts the workflow, and the `vibe-mirror` job fails on any drift.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`: baseline, regenerate and wire CI, then verify.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Drift | Agent, skill and prompt mirrors | The three `--check` commands, plus a drift mutation |
| Lint | The workflow file | `actionlint` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Vibe generators | Internal | Green | No regeneration or check |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the new CI job fails on a clean tree.
- **Procedure**: `git revert <sha>` on the 019 commit, or remove the `vibe-mirror` job.
<!-- /ANCHOR:rollback -->

---
