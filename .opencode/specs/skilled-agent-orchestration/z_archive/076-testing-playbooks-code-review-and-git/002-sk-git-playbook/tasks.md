---
title: "Tasks: 002 - sk-git manual testing playbook"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "sk-git playbook tasks"
  - "093/002 tasks"
importance_tier: "high"
contextType: "skill-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/076-testing-playbooks-code-review-and-git/002-sk-git-playbook"
    last_updated_at: "2026-05-07T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored tasks.md"
    next_safe_action: "Dispatch cli-codex"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-4-7-2026-05-07"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: 002 - sk-git manual testing playbook

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

- [ ] T001 cli-codex reads `.opencode/skills/sk-git/SKILL.md` end-to-end
- [ ] T002 [P] cli-codex reads all 6 reference files in `.opencode/skills/sk-git/references/`
- [ ] T003 [P] cli-codex reads 3 assets in `.opencode/skills/sk-git/assets/`
- [ ] T004 [P] cli-codex reads sk-doc templates: `manual_testing_playbook_template.md`, `manual_testing_playbook_snippet_template.md`, `manual_testing_playbook_creation.md`
- [ ] T005 [P] cli-codex reads reference playbooks: sk-prompt root + cli-claude-code 001-base
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T010 cli-codex runs `/create:testing-playbook sk-git create :auto` to scaffold root + 6 category folders
- [ ] T011 cli-codex authors 3 per-feature files in `01--worktree-setup/` (fresh-feature isolated, current-branch no-worktree, stay-on-main)
- [ ] T012 cli-codex authors 4 per-feature files in `02--commit-formation/` (conventional-commit-from-diff, scope-inference-skill-folder, mixed-concerns-split-or-warn, co-authored-by-footer)
- [ ] T013 cli-codex authors 4 per-feature files in `03--safety-refusals/` (no-verify-bypass-refused, secrets-in-diff-refused, force-push-to-main-refused, amend-published-commit-refused)
- [ ] T014 cli-codex authors 4 per-feature files in `04--integration-and-pr/` (finish-merge-to-main, finish-create-pr, failing-tests-block-merge, branch-cleanup)
- [ ] T015 cli-codex authors 4 per-feature files in `05--recovery-and-edge-cases/` (merge-conflict, accidental-wrong-branch, empty-commit-or-no-changes, rebase-vs-merge)
- [ ] T016 cli-codex authors 2-3 per-feature files in `06--cross-cli-orchestration/` (native, cli-codex, cli-gemini-or-cli-copilot handback)
- [ ] T017 cli-codex authors root `manual_testing_playbook.md` with category summaries + integrated review/release-readiness + sub-agent orchestration + AUTOMATED TEST CROSS-REFERENCE + FEATURE CATALOG INDEX
- [ ] T018 cli-codex self-runs `python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/sk-git/manual_testing_playbook/manual_testing_playbook.md` and reports
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T020 Orchestrator: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet> --strict` returns exit 0
- [ ] T021 Orchestrator: `validate_document.py` clean on root playbook
- [ ] T022 Orchestrator: per-feature structural sweep on every category file
- [ ] T023 Orchestrator: forbidden-sidecar sweep returns empty
- [ ] T024 Orchestrator: exact-prompt-sync audit
- [ ] T025 Orchestrator: dispatch @review with sk-code-review DQI prompt against the playbook directory
- [ ] T026 Resolve any P0/P1 findings via cli-codex follow-up dispatch
- [ ] T027 Verify all 4 safety-refusal scenarios use real triggers and document the refusal message
- [ ] T028 Author `implementation-summary.md` with evidence anchors
- [ ] T029 Run `generate-context.js` for canonical save and refresh `graph-metadata.json`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] checklist.md fully resolved
- [ ] @review DQI no P0/P1
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
