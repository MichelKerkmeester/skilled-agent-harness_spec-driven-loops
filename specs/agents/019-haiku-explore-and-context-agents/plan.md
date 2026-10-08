---
title: "Implementation Plan: Haiku-default Explore override and haiku-pinned context agent across Claude and sibling runtime surfaces"
description: "Add a Haiku Explore override to the Claude tree, mirror it to the other runtime surfaces through the existing generators and symlink sync, pin the context agent to Haiku, and correct the docs that deny any agent declares a model."
trigger_phrases:
  - "haiku explore and context agents plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Haiku-default Explore override and haiku-pinned context agent across Claude and sibling runtime surfaces

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown agent definitions with YAML frontmatter, Node sync scripts |
| **Framework** | Claude Code subagents, plus the OpenCode, Codex, Pi, Cursor and Devin agent dialects |
| **Storage** | None |
| **Testing** | The roster check, the runtime-mirror, Pi and Codex `--check` runs, and the agent-mirror-sync check |

### Overview
Claude Code replaces its built-in Explore with a user or project subagent that has the same `name`, and a `model` field in the frontmatter sets that agent's default model. The file goes in `.claude/agents/` and is marked Claude-only, because no other runtime has a built-in Explore and the Codex generator rejects a capitalised filename. The roster check and the symlink sync each skip it through a one-line exemption. `context.md` gets one frontmatter line.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Canonical file plus mirrors, with one Claude-only exception. `.claude/agents/` is canonical for Claude, Cursor and Devin. `.skilled/agents/` is canonical for Codex and Pi. Explore lives in the Claude tree alone.

### Key Components
- **`.claude/agents/Explore.md`**: the Claude-dialect override with the Haiku default and the `tools:` allow-list.
- **`CLAUDE_ONLY_AGENTS`**: a one-name set in `agent-roster-mirror-check.cjs` and in `sync-runtime-mirrors.cjs` that keeps Explore out of the roster and out of the Cursor and Devin links.
- **Generators**: `sync-agents-pi.cjs` and `codex/sync-agents.cjs` read `.skilled`, which has no Explore, so they are untouched.

### Data Flow
Claude Code resolves a subagent's model in this order: a per-call `model` argument, then the definition's `model` field, then `CLAUDE_CODE_SUBAGENT_MODEL` (never for built-in Explore or Plan), then the main model. The file sets the second step, so a model named on request still wins.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.claude/agents/` | Canonical Claude tree | Add `Explore.md`, add `model: haiku` to `context.md` | roster check, agent-mirror-sync |
| `.cursor/agents/`, `.devin/agents/` | Symlinks into the Claude tree | Unchanged, Explore is skipped by the sync | runtime-mirror `--check`, 187 mirrors |
| `.skilled/agents/`, `.codex/agents/`, `.pi/agents/` | OpenCode source and its generated trees | Unchanged | Pi and Codex `--check`, 12 agents each |
| Roster check, symlink sync and the roster test | Build the agent list from `.claude/agents` | Add the Claude-only exemption and one test | node test run, roster output |
| Claude agents README and the mirror crosswalk | State that no agent declares a model | Correct the statement and record Explore as Claude-only | grep for the old sentence |
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Not applicable, no executable code changes | None |
| Integration | Roster, mirror and generator parity across six runtime trees | The five check commands listed in `tasks.md` |
| Manual | A fresh session spawns Explore and `context` and reports the model | Claude Code, run by the operator |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Pi and Codex sync scripts | Internal | Green | Generated files would need hand-writing, which the crosswalk forbids |
| Claude Code 2.1.294 agent loader | External | Yellow | The override takes effect only in a new session |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Haiku misses files and the redo costs more than it saves, or a sibling runtime rejects `model: haiku`.
- **Procedure**: `git checkout -- .claude/agents/context.md` and delete the Explore files listed in the spec, then rerun the two generators and the symlink sync.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Core) ──► Phase 3 (Verify)
Phase 1.5 (Config) ───┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core, Config |
| Config | Setup | Core |
| Core | Setup, Config | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 15 minutes |
| Core Implementation | Low | 30 minutes |
| Verification | Low | 15 minutes |
| **Total** | | **About 1 hour** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (every changed file is tracked in git, new files are untracked and removable)
- [x] Feature flag configured (not applicable, the force flag stays unset on purpose)
- [x] Monitoring alerts set (not applicable)

### Rollback Procedure
1. Delete `~/.claude/agents/Explore.md` to restore the built-in Explore for every project.
2. Run `git checkout --` on `.claude/agents/context.md`, the two doctor and mirror scripts, the roster test, the README and the crosswalk, and delete `.claude/agents/Explore.md`.
3. Run the roster check and `sync-runtime-mirrors.cjs --check`, and read `STATUS=OK` and `PASS`.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
