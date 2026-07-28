---
title: "Feature Specification: Git Action Advisory Hook Phase Parent"
description: "sk-git carries the rules that would have prevented four real incidents in one session, but nothing surfaces them at the moment a git command runs. This packet researches and builds an advisory hook that does."
trigger_phrases:
  - "git advisory hook"
  - "git action advisor"
  - "sk-git preflight advisory"
  - "git hard rules"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/016-git-action-advisory-hook"
    last_updated_at: "2026-07-28T09:30:00Z"
    last_updated_by: "claude-fable-5"
    recent_action: "Closed the packet: all eight phases complete, six runtimes covered, pushed to v4"
    next_safe_action: "Operator smoke-tests the Pi, OpenCode and Cursor adapters live"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-sk-git-016"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The PreToolUse Bash advisory mechanism already exists and is proven by cli-opencode."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Feature Specification: Git Action Advisory Hook Phase Parent

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-27 |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

sk-git already documents the rules that would have prevented four separate incidents in a single session. None of them fired, because sk-git is surfaced by prompt routing rather than by the git command being run. The rules were read only after the operator said to check the skill, by which point the damage had happened.

The mechanism to fix this already exists and is proven: `.claude/settings.json` runs a `PreToolUse` hook on every Bash command, `parseHardRules()` reads `hard_rules:` frontmatter out of a SKILL.md, and `evaluate()` matches them against the command. `cli-devin` declares that frontmatter; `cli-opencode` ships the evaluator. **sk-git declares no hard rules at all**, so git commands pass through unadvised.

### Purpose

Make the rule reach the operator at the moment the command is typed, not after the incident, without becoming noise that trains people to ignore it.

> **Phase-parent note:** This spec.md is the only authored document at this level. Detail lives in the child phases.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:evidence -->
## 3. OBSERVED INCIDENTS

Each of these happened in one session. Each has an existing sk-git rule that did not fire.

| Incident | Existing rule | Detectable before the command? |
|----------|---------------|-------------------------------|
| `git add <dir>` swept another session's staged deletions into the index, staging half a rename | ALWAYS #13, commit-workflows §3 Step 7 | Yes — dirty tree plus a directory pathspec |
| Pushed from a cherry-pick worktree; the primary checkout did not move | ALWAYS #15 | Yes — detached or linked-worktree HEAD |
| Push rejected 403; the active `gh` account was not the remote owner | ESCALATE #2 | Yes — compare active account to remote owner |
| Nearly ran an autostash-prone operation against a 93-file dirty tree | ALWAYS #14 | Yes — dirty count plus the operation |
| `git commit --only <paths>` silently dropped a named path; the fix was later destroyed | **none exists** | Partly — comparable after the fact |

The last row is the most damaging and the only one with no rule. A pathspec commit reported success while omitting a file that had been named explicitly. The omission was invisible because the report gave a file count rather than a file list.
<!-- /ANCHOR:evidence -->

---

<!-- ANCHOR:scope -->
## 4. SCOPE

### In Scope

- Research into which git operations warrant an advisory and which produce noise.
- `hard_rules:` frontmatter for sk-git, in the schema `cli-devin` already uses.
- A preflight advisory hook wired into the existing `PreToolUse` Bash array.
- A pathspec-commit integrity check, since no rule covers that failure today.

### Out of Scope

- Blocking behaviour. The existing pre-commit, commit-msg and pre-push hooks own enforcement; this packet advises.
- Changing any sk-git rule's content. Encoding an existing rule is not rewriting it.

### Files to Change

| File Path | Change Type | Phase |
|-----------|-------------|-------|
| `spec.md` | Maintain | parent |
| `001-advisory-research/` | Create | 001 |
| `002-rule-encoding/` | Create | 002 |
| `003-preflight-hook/` | Create | 003 |
| `004-pathspec-integrity/` | Create | 004 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-advisory-research/` | Ten-iteration research: which operations, what evidence, how to avoid noise | Complete |
| 002 | `002-rule-encoding/` | Encode sk-git rules as `hard_rules:` frontmatter | Complete |
| 003 | `003-preflight-hook/` | The advisory hook and its wiring | Complete |
| 004 | `004-pathspec-integrity/` | The commit-integrity check that has no rule today | Complete |
| 005 | `005-destructive-tier/` | The retained destructive rules, each narrowed to positive state | Complete |
| 006 | `006-runtime-parity/` | One runtime-agnostic hook serving Claude and Codex | Complete |
| 007 | `007-runtime-coverage/` | Adapters for OpenCode, Pi, Cursor and Devin, plus style alignment | Complete |
| 008 | `008-docs-and-playbooks/` | Code READMEs and playbook coverage across all seven skills | Complete |

### Phase Transition Rules

- Research completes before any rule is encoded; the incident list is a starting point, not the answer.
- The hook advises and never blocks. A false positive must cost a line of text, never a failed command.
- Every encoded rule must trace to existing sk-git prose or an observed incident. No invented rules.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001 | 002 | Research names the operations worth advising and the noise threshold | Research report |
| 002 | 003 | Rules parse under the existing `parseHardRules()` | Parser round-trip |
| 003 | 004 | The hook fires on real commands without blocking | Manual dispatch |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 5. OPEN QUESTIONS

- What advisory frequency stops being useful and starts being ignored?
- Should the identity check compare against the remote owner, or against an explicit allowlist?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Proven precedent**: `cli-opencode/scripts/lib/dispatch-rule-checks.mjs`
- **Schema model**: `cli-devin/SKILL.md` frontmatter
- **Rule source**: `sk-git/SKILL.md`
