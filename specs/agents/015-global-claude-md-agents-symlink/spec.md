---
title: "Feature Specification: Global CLAUDE.md as a symlink to AGENTS.md"
description: "The global Claude Code instruction file told the AI to stop after every context compaction and wait for the operator. Replace that file with a symlink to the repo AGENTS.md so sessions carry on after compaction and every runtime reads one framework."
trigger_phrases:
  - "stop after compaction"
  - "compaction auto continue"
  - "global claude md symlink"
  - "claude md agents md symlink"
  - "context compaction behavior rule"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Global CLAUDE.md as a symlink to AGENTS.md

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-25 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The global Claude Code instruction file, `~/.claude/CLAUDE.md`, held a "Context Compaction Behavior" block. It told the AI to stop after every compaction, re-read the file, summarize the state and wait for the operator to confirm before doing anything. Long autonomous runs stalled at every compaction. The repo's `AGENTS.md` carries no such rule, so the pause came only from the global file.

### Purpose
After compaction, Claude Code carries on from the summary without waiting. The global instruction file is the same `AGENTS.md` the repo already maintains.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Back up the current `~/.claude/CLAUDE.md` next to itself.
- Replace `~/.claude/CLAUDE.md` with an absolute symlink to the repo root `AGENTS.md`. `~/.codex/AGENTS.md` already uses this pattern.
- Confirm the linked file resolves and no longer contains the compaction-stop block.

### Out of Scope
- Editing the repo `AGENTS.md`. It has no compaction-stop rule to remove.
- The compaction hooks. The repo `PreCompact` hook and the Orca `PostCompact` hook only add recovery context and never pause a session.
- Other runtimes' global instruction files. Only the Claude Code file was named.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `~/.claude/CLAUDE.md` | Replace | Regular file becomes a symlink to the repo root `AGENTS.md` |
| `~/.claude/CLAUDE.md.bak-2026-09-25` | Create | Byte-identical backup of the replaced file |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The global instruction file no longer tells the AI to stop after compaction | `grep -c "Context Compaction Behavior" ~/.claude/CLAUDE.md` returns 0 |
| REQ-002 | `~/.claude/CLAUDE.md` is a symlink to the repo root `AGENTS.md` | `readlink ~/.claude/CLAUDE.md` prints the absolute `AGENTS.md` path and `cmp` against it reports no difference |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The original file can be restored | The backup exists and `cmp` confirmed it byte-identical before the replace |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A Claude Code session that compacts carries on with the task instead of stopping to ask for confirmation.
- **SC-002**: Any edit to the repo `AGENTS.md` reaches the global Claude Code instructions with no copy step.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The repo path under the MEGA sync folder | If `AGENTS.md` moves or the folder is missing, the link dangles and Claude Code loads no global instructions | Restore from the backup, or re-point the link |
| Risk | In this repo `AGENTS.md` may now load twice, as global and as project instructions | Med: roughly 26 KB of repeated context per session | Check the loaded instructions in a fresh session. Accept or revisit |
| Risk | Other repos now receive this framework's gates, including the spec-folder question | Med: sessions in unrelated repos ask Gate 3 and point at `.skilled/` paths that do not exist there | `AGENTS.md` is written as a universal template and says a repo without `REPO RULES.md` has nothing to load |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does Claude Code skip the global file when it resolves to the same path as the project `AGENTS.md`? Only a fresh session in this repo can show that.
<!-- /ANCHOR:questions -->

---
