---
title: "Spec: 093 - testing playbooks for sk-code-review and sk-git"
description: "Phase parent for authoring two manual_testing_playbook packages: sk-code-review (review baseline) and sk-git (worktree/commit/finish orchestrator)."
trigger_phrases:
  - "093 testing playbooks"
  - "sk-code-review playbook"
  - "sk-git playbook"
  - "manual testing playbook for review"
  - "manual testing playbook for git"
importance_tier: "high"
contextType: "skill-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/093-testing-playbooks-code-review-and-git"
    last_updated_at: "2026-05-07T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Both children complete and validated"
    next_safe_action: "Update track parent metadata"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code-review/manual_testing_playbook/manual_testing_playbook.md"
      - ".opencode/skills/sk-git/manual_testing_playbook/manual_testing_playbook.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-4-7-2026-05-07"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase parent vs flat: phase parent."
      - "cli-codex tier: normal mode (omit fast tier)."
---

# Feature Specification: 093 - testing playbooks for sk-code-review and sk-git

<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent.spec | v2.2 -->
<!-- SPECKIT_LEVEL: phase-parent -->

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | Phase Parent |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-07 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `skilled-agent-orchestration` |
| **Predecessor** | `skilled-agent-orchestration/092-multi-ai-council-deferrals` |
| **Successor** | None |
| **Handoff Criteria** | Both child phases produce validated playbook packages — MET |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`sk-code-review` (findings-first review baseline used by `@review`, `@deep-review`, `/spec_kit:deep-review`) and `sk-git` (three-phase git lifecycle orchestrator: worktree → commit → finish/PR) are foundational utility skills with no `manual_testing_playbook/` package today. Sibling skills in the same tier (`sk-prompt`, `cli-claude-code`, `system-spec-kit`) all have one. Without realistic-scenario regression coverage, refactors silently break either skill's contract.

### Purpose
Produce two `manual_testing_playbook/` packages — one per skill — following the canonical sk-doc contract, with RCAF-pattern operator prompts that mirror real human-AI conversation, executable both natively and via external CLIs.

> **Phase-parent note:** This spec.md is the only authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `manual_testing_playbook/` package under `.opencode/skills/sk-code-review/` (root + 6 categories + ~17 per-feature files).
- `manual_testing_playbook/` package under `.opencode/skills/sk-git/` (root + 6 categories + ~21 per-feature files).
- RCAF-pattern operator prompts executable natively (Claude Code / OpenCode) and via external CLIs (cli-codex, cli-opencode, cli-gemini, cli-copilot).
- Strict validation on each root playbook plus manual structural sweep on per-feature files.
- `@review`-driven sk-code-review DQI quality pass on each playbook (dogfoods sk-code-review while validating its own playbook).

### Out of Scope
- Adding playbooks for other skills - sk-prompt/sk-doc/system-spec-kit/cli-claude-code already have one; sk-code excluded by user request.
- Recursive validator improvements - current validator only checks root; deferred to a separate packet.
- Cross-skill playbook-package linting tool - future packet if value emerges.
- Modifying `/create:testing-playbook` itself - out of scope.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/skills/sk-code-review/manual_testing_playbook/**` | Create | 001 | Root + 6 categories + ~17 per-feature files |
| `.opencode/skills/sk-git/manual_testing_playbook/**` | Create | 002 | Root + 6 categories + ~21 per-feature files |
| `.opencode/specs/skilled-agent-orchestration/graph-metadata.json` | Modify | finalize | Append child id; bump last_active_child_id |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-sk-code-review-playbook/` | sk-code-review playbook authoring + verification | Complete |
| 2 | `002-sk-git-playbook/` | sk-git playbook authoring + verification | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Children run sequentially (per memory rule: parallel cli-codex dispatch is unreliable)
- Use `/spec_kit:resume specs/skilled-agent-orchestration/093-.../00X-name/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| `001-sk-code-review-playbook` | `002-sk-git-playbook` | Playbook validates clean; checklist resolved; continuity saved | `validate.sh --strict` exit 0; `validate_document.py` pass; `@review` DQI no P0/P1 |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

(none - all clarifications resolved in the approved planning document)
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Track parent**: `../` (`skilled-agent-orchestration`)
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
- **Approved plan**: `/Users/michelkerkmeester/.claude/plans/create-new-spec-in-staged-glade.md`
