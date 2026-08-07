---
title: "Tasks: sk-doc playbook markdown-agent coverage"
description: "Task list for authoring SD-018/019/020 scenarios and executing them across 3 CLIs."
trigger_phrases:
  - "sk-doc playbook markdown agent"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/z_archive/011-sk-doc-skill-readme-and-structure/004-sk-doc-playbook-markdown-agent-coverage"
    last_updated_at: "2026-05-11T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored task list"
    next_safe_action: "Author scenario files"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "102-004-sk-doc-playbook-markdown-agent-coverage"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: sk-doc playbook markdown-agent coverage

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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

- [ ] T001 Verify `@markdown` agent in 4 runtime mirrors (`ls .opencode/agents/markdown.md .claude/agents/markdown.md .gemini/agents/markdown.md .codex/agents/markdown.toml`).
- [ ] T002 Verify `/create:changelog` command is reachable (`ls .opencode/commands/create/changelog.md`).
- [ ] T003 Snapshot existing playbook index for diff comparison.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Author `06--agent-dispatch/001-markdown-agent-cli-claude-code.md` (SD-018).
- [ ] T005 Author `06--agent-dispatch/002-markdown-agent-cli-codex.md` (SD-019).
- [ ] T006 Author `06--agent-dispatch/003-markdown-agent-cli-opencode.md` (SD-020).
- [ ] T007 Fix preamble line in `manual_testing_playbook.md`: `(cli-codex, cli-opencode)` → `(cli-codex, cli-opencode, cli-claude-code)`.
- [ ] T008 Add row `#6 | Agent Dispatch | 06--agent-dispatch/ | SD-018..SD-020 | ...` to Categories table.
- [ ] T009 Add `### 06 — Agent Dispatch` block to Scenario Index listing SD-018..SD-020.
- [ ] T010 Add Global Preconditions note clarifying that section 6 scenarios execute real work.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

> Phases 3 (Execution) and 4 (Final verification) are merged here per Level 2 manifest. See Phase 4 section below for execution → grading → strict-validate progression.

## Phase 3a: Execution

- [ ] T011 Run SD-018 via cli-claude-code; capture transcript to `evidence/SD-018-cli-claude-code.txt`.
- [ ] T012 Run SD-019 via cli-codex; capture transcript to `evidence/SD-019-cli-codex.txt`.
- [ ] T013 Run SD-020 via cli-opencode (DeepSeek v4 Pro direct API); capture transcript to `evidence/SD-020-cli-opencode.txt`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Verification

- [ ] T014 Score each transcript using playbook §Pass/Fail Grading; record verdict in evidence file footer.
- [ ] T015 Populate `implementation-summary.md` with 3-row results table.
- [ ] T016 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh --strict` against this folder; exit 0.
- [ ] T017 Update `_memory.continuity` block in this `tasks.md` + `spec.md` + `plan.md` + `implementation-summary.md` to `completion_pct: 100`.
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] All 3 evidence files exist with verdict footers
- [ ] `validate.sh --strict` exits 0
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Playbook index**: `.opencode/skills/sk-doc/manual_testing_playbook/manual_testing_playbook.md`
- **Scenario template**: `.opencode/skills/sk-doc/manual_testing_playbook/04--cross-cli-dispatch/001-short-prompt-baseline.md`
<!-- /ANCHOR:cross-refs -->
