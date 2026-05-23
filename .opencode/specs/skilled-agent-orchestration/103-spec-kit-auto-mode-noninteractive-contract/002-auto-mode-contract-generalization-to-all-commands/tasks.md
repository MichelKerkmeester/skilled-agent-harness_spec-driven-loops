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
    recent_action: "Group 3 improve command migrated"
    next_safe_action: "Run live verification dispatches (Stage D)"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "103-002-auto-mode-contract-generalization"
      parent_session_id: null
    completion_pct: 100
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
- [x] T002 `/deep:start-review-loop.md` §0 refactored to cite shared contract (Stage B).
- [x] T003 Confirm 001's dry-run traces still conceptually pass after refactor (read-back).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T010 Codex group dispatch 1 (spec_kit/5): deep-research, complete, implement, plan, resume. Evidence: Group 1 codex dispatch completed; 5 commands migrated; see evidence/codex-group1-dispatch.txt
- [x] T011 Codex group dispatch 2 (create/6): sk-skill, agent, changelog, feature-catalog, testing-playbook, folder_readme. Evidence: Group 2 codex dispatch completed; 5 commands migrated; see evidence/codex-group2-dispatch.txt
- [x] T012 Codex group dispatch 3 (improve/1): agent. Evidence: Group 3 codex dispatch completed; 1 command migrated; see evidence/codex-group3-dispatch.txt
- [x] T013 Per-command read-back: confirm `:confirm` block untouched in all 11 migrated commands.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T020 Live `:auto` dispatch — `/deep:start-review-loop` (re-verify post-refactor).
- [x] T021 Live `:auto` dispatch — `/deep:start-research-loop`.
- [x] T022 Live `:auto` dispatch — `/speckit:resume`.
- [x] T023 Live `:auto` dispatch — `/speckit:implement`.
- [x] T024 Live `:auto` dispatch — `/speckit:complete`.
- [x] T025 Live `:auto` dispatch — `/speckit:plan`.
- [x] T026 Live `:auto` dispatch — `/create:changelog`.
- [x] T027 Live `:auto` dispatch — `/create:sk-skill`.
- [x] T028 Live `:auto` dispatch — `/create:agent`.
- [x] T029 Live `:auto` dispatch — `/create:feature-catalog`.
- [x] T030 Live `:auto` dispatch — `/create:testing-playbook`.
- [x] T031 Live `:auto` dispatch — `/create:folder_readme`.
- [x] T032 Live `:auto` dispatch — `/improve:agent`.
- [x] T033 Populate `implementation-summary.md` with 12-row results matrix + per-PARTIAL/FAIL finding.
- [x] T034 strict-validate 103 phase parent + 001 + 002 — all exit 0.
- [x] T035 Update `_memory.continuity` blocks to `completion_pct: 100`.
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
