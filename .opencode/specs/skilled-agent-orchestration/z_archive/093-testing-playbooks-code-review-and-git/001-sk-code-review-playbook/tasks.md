---
title: "Tasks: 001 - sk-code-review manual testing playbook"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "sk-code-review playbook tasks"
  - "093/001 tasks"
importance_tier: "high"
contextType: "skill-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/093-testing-playbooks-code-review-and-git/001-sk-code-review-playbook"
    last_updated_at: "2026-05-07T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored tasks.md"
    next_safe_action: "Author checklist.md and metadata"
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
# Tasks: 001 - sk-code-review manual testing playbook

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

- [ ] T001 cli-codex reads `.opencode/skills/sk-code-review/SKILL.md` end-to-end
- [ ] T002 [P] cli-codex reads all 9 reference files in `.opencode/skills/sk-code-review/references/`
- [ ] T003 [P] cli-codex reads `.opencode/agents/review.md` and `.opencode/agents/deep-review.md`
- [ ] T004 [P] cli-codex reads sk-doc templates: `manual_testing_playbook_template.md`, `manual_testing_playbook_snippet_template.md`, `manual_testing_playbook_creation.md`
- [ ] T005 [P] cli-codex reads reference playbook root: `.opencode/skills/sk-prompt/manual_testing_playbook/manual_testing_playbook.md` + 1-2 per-feature files
- [ ] T006 [P] cli-codex reads `.opencode/skills/cli-claude-code/manual_testing_playbook/01--cli-invocation/001-base-non-interactive-invocation.md` for cross-CLI prompt voice
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T010 cli-codex runs `/create:testing-playbook sk-code-review create :auto` to scaffold root + 6 category folders (`.opencode/skills/sk-code-review/manual_testing_playbook/`)
- [ ] T011 cli-codex authors 3 per-feature files in `01--baseline-review-flow/` (small PR, large refactor, multi-commit branch)
- [ ] T012 cli-codex authors 3 per-feature files in `02--security-and-correctness-minimums/` (auth/security-sensitive, input-validation/injection, secrets/hardcoded-creds)
- [ ] T013 cli-codex authors 3 per-feature files in `03--severity-and-evidence-discipline/` (P0 with file:line, class-of-bug vs instance-only, cross-consumer affected-surface)
- [ ] T014 cli-codex authors 3 per-feature files in `04--scope-and-precedence/` (explicit scope security-only, baseline-vs-surface precedence, test code review)
- [ ] T015 cli-codex authors 3 per-feature files in `05--re-review-and-stale-context/` (re-review after fixes, stale architecture fresh pass, AI-generated suspect quality)
- [ ] T016 cli-codex authors 2-3 per-feature files in `06--cross-cli-orchestration/` (native Claude Code, cli-codex delegation, cli-opencode/cli-gemini handback)
- [ ] T017 cli-codex authors root `manual_testing_playbook.md`: category summaries + integrated review/release-readiness logic + sub-agent orchestration + AUTOMATED TEST CROSS-REFERENCE + FEATURE CATALOG INDEX
- [ ] T018 cli-codex self-runs `python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/sk-code-review/manual_testing_playbook/manual_testing_playbook.md` and reports
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T020 Orchestrator: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet> --strict` returns exit 0
- [ ] T021 Orchestrator: `validate_document.py` clean on root playbook
- [ ] T022 Orchestrator: per-feature structural sweep (frontmatter + 5 numbered H2 + 9-col table) on every category file
- [ ] T023 Orchestrator: forbidden-sidecar sweep (`review_protocol.md`, `subagent_utilization_ledger.md`, `snippets/`) returns empty
- [ ] T024 Orchestrator: exact-prompt-sync audit between SCENARIO CONTRACT line and 9-col table cell
- [ ] T025 Orchestrator: dispatch @review with sk-code-review DQI prompt against the playbook directory
- [ ] T026 Resolve any P0/P1 findings via cli-codex follow-up dispatch (P2 advisory only)
- [ ] T027 Author `implementation-summary.md` with evidence anchors and findings disposition
- [ ] T028 Run `generate-context.js` for canonical save and refresh `graph-metadata.json`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] checklist.md fully resolved with evidence anchors
- [ ] @review DQI returns no P0/P1
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
