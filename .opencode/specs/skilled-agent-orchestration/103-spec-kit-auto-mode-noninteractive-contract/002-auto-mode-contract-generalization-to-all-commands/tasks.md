---
title: "Tasks: auto-mode-contract generalization"
description: "11-command migration via 3 codex groups + 12 live verifications + synthesis."
trigger_phrases:
  - "auto mode contract generalization"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/skilled-agent-orchestration/103-spec-kit-auto-mode-noninteractive-contract/002-auto-mode-contract-generalization-to-all-commands"
    last_updated_at: "2026-05-11T12:35:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored task list"
    next_safe_action: "Dispatch codex group 1"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "103-002-auto-mode-contract-generalization"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: auto-mode-contract generalization

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

- [x] T001 Shared `auto_mode_contract.md` authored (Stage B).
- [x] T002 `/spec_kit:deep-review.md` §0 refactored to cite shared contract (Stage B).
- [ ] T003 Confirm 001's dry-run traces still conceptually pass after refactor (read-back).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T010 Codex group dispatch 1 (spec_kit/5): deep-research, complete, implement, plan, resume.
- [ ] T011 Codex group dispatch 2 (create/6): sk-skill, agent, changelog, feature-catalog, testing-playbook, folder_readme.
- [ ] T012 Codex group dispatch 3 (improve/1): agent.
- [ ] T013 Per-command read-back: confirm `:confirm` block untouched in all 11 migrated commands.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T020 Live `:auto` dispatch — `/spec_kit:deep-review` (re-verify post-refactor).
- [ ] T021 Live `:auto` dispatch — `/spec_kit:deep-research`.
- [ ] T022 Live `:auto` dispatch — `/spec_kit:resume`.
- [ ] T023 Live `:auto` dispatch — `/spec_kit:implement`.
- [ ] T024 Live `:auto` dispatch — `/spec_kit:complete`.
- [ ] T025 Live `:auto` dispatch — `/spec_kit:plan`.
- [ ] T026 Live `:auto` dispatch — `/create:changelog`.
- [ ] T027 Live `:auto` dispatch — `/create:sk-skill`.
- [ ] T028 Live `:auto` dispatch — `/create:agent`.
- [ ] T029 Live `:auto` dispatch — `/create:feature-catalog`.
- [ ] T030 Live `:auto` dispatch — `/create:testing-playbook`.
- [ ] T031 Live `:auto` dispatch — `/create:folder_readme`.
- [ ] T032 Live `:auto` dispatch — `/improve:agent`.
- [ ] T033 Populate `implementation-summary.md` with 12-row results matrix + per-PARTIAL/FAIL finding.
- [ ] T034 strict-validate 103 phase parent + 001 + 002 — all exit 0.
- [ ] T035 Update `_memory.continuity` blocks to `completion_pct: 100`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] 12 evidence files exist with verdict footers
- [ ] ≥10/12 PASS verdicts
- [ ] strict-validate 103/001/002 all exit 0
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Shared contract**: `.opencode/skills/system-spec-kit/references/workflows/auto_mode_contract.md`
- **Phase 1 prototype**: `../001-deep-review-three-tier-setup/`
- **Memory**: `feedback_codex_spawnagent_allowlist.md`, `feedback_gate3_no_tmp_exemption.md`, `feedback_auto_mode_ask_only_when_ambiguous.md`, `feedback_cli_dispatch_unreliability.md`
<!-- /ANCHOR:cross-refs -->
