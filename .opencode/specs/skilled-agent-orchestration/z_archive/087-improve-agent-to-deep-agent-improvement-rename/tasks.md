---
title: "Tasks: Rename @improve-agent → @deep-agent-improvement"
description: "Ordered T-001..T-024 task ledger covering 4 agent file renames, 4 YAML asset filename renames, ~54 active reference updates, new changelog entry, and verification suite. Mirrors 085/001 precedent."
trigger_phrases:
  - "087 tasks"
  - "agent rename tasks"
  - "T-001 087"
  - "deep-agent-improvement task list"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/087-improve-agent-to-deep-agent-improvement-rename"
    last_updated_at: "2026-05-06T15:40:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "tasks.md authored"
    next_safe_action: "validate"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000089"
      session_id: "087-tasks-author"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Rename `@improve-agent` → `@deep-agent-improvement`

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable within current phase wave |
| `[CRITICAL]` | Load-bearing — failure breaks the rename |

**Task Format**: `T### [P?][CRITICAL?] Description (file path) → Acceptance`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

> Physical file renames + frontmatter rotation. Atomic with YAML asset filename renames so the command stays resolvable throughout.

### Agent file renames (cli-direct via `git mv`)

- [x] T-001 [CRITICAL] `git mv .opencode/agents/improve-agent.md .opencode/agents/deep-agent-improvement.md`
- [x] T-002 [P][CRITICAL] `git mv .claude/agents/improve-agent.md .claude/agents/deep-agent-improvement.md`
- [x] T-003 [P][CRITICAL] `git mv .gemini/agents/improve-agent.md .gemini/agents/deep-agent-improvement.md`
- [x] T-004 [P][CRITICAL] `git mv .codex/agents/improve-agent.toml .codex/agents/deep-agent-improvement.toml`

### Frontmatter rotation in renamed files

- [x] T-005 [P][CRITICAL] `.opencode/agents/deep-agent-improvement.md` — frontmatter `name: improve-agent` → `name: deep-agent-improvement`; body self-refs
- [x] T-006 [P][CRITICAL] `.claude/agents/deep-agent-improvement.md` — same shape
- [x] T-007 [P][CRITICAL] `.gemini/agents/deep-agent-improvement.md` — same shape
- [x] T-008 [P][CRITICAL] `.codex/agents/deep-agent-improvement.toml` — `name = "improve-agent"` → `name = "deep-agent-improvement"`

### YAML asset filename renames (atomic with agent.md content update)

- [x] T-009 [CRITICAL] `git mv .opencode/commands/deep/assets/deep_start-agent-improvement-loop_auto.yaml .opencode/commands/deep/assets/deep_start-agent-improvement-loop_auto.yaml`
- [x] T-010 [CRITICAL] `git mv .opencode/commands/deep/assets/deep_start-agent-improvement-loop_confirm.yaml .opencode/commands/deep/assets/deep_start-agent-improvement-loop_confirm.yaml`
- [x] T-011 [P][CRITICAL] `git mv .claude/commands/deep/assets/deep_start-agent-improvement-loop_auto.yaml .claude/commands/deep/assets/deep_start-agent-improvement-loop_auto.yaml`
- [x] T-012 [P][CRITICAL] `git mv .claude/commands/deep/assets/deep_start-agent-improvement-loop_confirm.yaml .claude/commands/deep/assets/deep_start-agent-improvement-loop_confirm.yaml`
- [x] T-013 [CRITICAL] Update `agent.md` body refs to new YAML filenames in `.opencode/commands/deep/start-agent-improvement-loop.md` (lines ~269-270) and `.claude/commands/deep/start-agent-improvement-loop.md` (similar)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

> Reference rotation across active scope.

### Mass sed (skill docs + command bodies + YAML internal content)

- [x] T-014 [CRITICAL] Mass `sed -i ''` across active scope:
  - `find .opencode/skills/deep-agent-improvement -type f \( -name '*.md' -o -name '*.json' -o -name '*.jsonl' \) -not -path '*/node_modules/*'`
  - `.opencode/commands/deep/{agent.md,README.txt}` and `.opencode/commands/deep/assets/deep_start-agent-improvement-loop_*.yaml`
  - `.claude/commands/deep/{agent.md,README.txt}` and `.claude/commands/deep/assets/*.yaml`
  - `.gemini/commands/deep/{improve-agent.toml,README.txt}`
  - `.opencode/skills/sk-doc/assets/agent_template.md`
  - Substitution: `@improve-agent` → `@deep-agent-improvement` (literal string)
  - Verify: `rg -F '@improve-agent'` in those targets returns 0

### Root governance + runtime READMEs

- [x] T-015 Update `AGENTS.md` (line 324: `@improve-agent` → `@deep-agent-improvement`) + `README.md` (line 1097)
- [x] T-016 Update `.opencode/agents/README.txt` (line 18: agent registry entry)

### Changelog entry

- [x] T-017 Author `.opencode/skills/deep-agent-improvement/changelog/v1.5.0.0.md` documenting:
  - The agent rename (079 + 085/001 precedents)
  - YAML asset filename renames
  - Migration note: external scripts hardcoding `@improve-agent` need update
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-018 [CRITICAL] Active-scope residual grep — `rg -F '@improve-agent' .opencode .claude .gemini .codex AGENTS.md README.md | grep -v specs/ | grep -v z_archive/ | grep -v barter/` → 0 lines
- [x] T-019 [CRITICAL] Frontmatter grep — `rg -F 'name: improve-agent'` in active scope → 0 lines; `rg -F 'name = "improve-agent"'` → 0 lines
- [x] T-020 [CRITICAL] Advisor recommendation — `handleAdvisorRecommend({prompt: "improve agent loop"})` returns `deep-agent-improvement` top hit (no scoring regression)
- [x] T-021 [CRITICAL] Smoke dispatch — `node .opencode/skills/deep-agent-improvement/scripts/scan-integration.cjs --agent .opencode/agents/deep-agent-improvement.md` exits 0 (or against the sandbox CP test fixture)
- [x] T-022 [CRITICAL] `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/skilled-agent-orchestration/087-improve-agent-to-deep-agent-improvement-rename --strict` exits 0
- [x] T-023 Author `implementation-summary.md` Phase 3 section with verification evidence + commit SHAs
- [x] T-024 `/memory:save` to refresh continuity (completion_pct=100)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 acceptance criteria from `spec.md` REQ-001..REQ-007 met
- [x] All P1 from REQ-008..REQ-012 met
- [x] T-001..T-024 all `[x]`
- [x] Working tree on `main`; no auto-branch
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Resource Map**: `resource-map.md`
- **Predecessor**: `z_archive/079-sk-deep-agent-improvement/`
- **Direct precedent**: `085-sk-prompt-testing-playbook-and-agent-rename/001-prompt-improver-rename/`
<!-- /ANCHOR:cross-refs -->
