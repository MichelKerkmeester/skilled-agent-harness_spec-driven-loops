---
title: "Tasks: sk-doc Children Contract Conformance"
description: "One work-item per file: LUNA MAX update then fresh Sonnet-5 xhigh verify then validator gate, for the 11 files in this batch."
trigger_phrases:
  - "002-sk-doc-children tasks"
  - "per-file conformance tasks"
  - "LUNA update Sonnet verify"
importance_tier: "normal"
contextType: "implementation"
parent: "sk-doc/014-sk-doc-parent/028-create-skill-contract-unification"
_memory:
  continuity:
    packet_pointer: "sk-doc/014-sk-doc-parent/028-create-skill-contract-unification/002-sk-doc-children"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Scaffolded conformance phase tasks (planned)"
    next_safe_action: "Dispatch LUNA-MAX updates after operator go-ahead"
    blockers: []
    key_files: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

# Tasks: sk-doc Children Contract Conformance

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable (>=5 concurrent per wave) |

**Format**: `T### [P?] Description (path)`. Each file has one update task and one verify+gate task.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm worktree at origin tip; capture per-file validator baseline for all 11 files
- [ ] T002 Compose the LUNA update prompt (contract target + scope lock + `GATE-3 PRE-RESOLVED`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Update tasks — dispatched in waves of >=5 (fresh LUNA MAX per file):

- [ ] T003 [P] LUNA MAX update `sk-doc/create-agent` SKILL.md to contract (`.opencode/skills/sk-doc/create-agent/SKILL.md`)
- [ ] T004 [P] LUNA MAX update `sk-doc/create-benchmark` SKILL.md to contract (`.opencode/skills/sk-doc/create-benchmark/SKILL.md`)
- [ ] T005 [P] LUNA MAX update `sk-doc/create-changelog` SKILL.md to contract (`.opencode/skills/sk-doc/create-changelog/SKILL.md`)
- [ ] T006 [P] LUNA MAX update `sk-doc/create-command` SKILL.md to contract (`.opencode/skills/sk-doc/create-command/SKILL.md`)
- [ ] T007 [P] LUNA MAX update `sk-doc/create-diff` SKILL.md to contract (`.opencode/skills/sk-doc/create-diff/SKILL.md`)
- [ ] T008 [P] LUNA MAX update `sk-doc/create-feature-catalog` SKILL.md to contract (`.opencode/skills/sk-doc/create-feature-catalog/SKILL.md`)
- [ ] T009 [P] LUNA MAX update `sk-doc/create-flowchart` SKILL.md to contract (`.opencode/skills/sk-doc/create-flowchart/SKILL.md`)
- [ ] T010 [P] LUNA MAX update `sk-doc/create-manual-testing-playbook` SKILL.md to contract (`.opencode/skills/sk-doc/create-manual-testing-playbook/SKILL.md`)
- [ ] T011 [P] LUNA MAX update `sk-doc/create-quality-control` SKILL.md to contract (`.opencode/skills/sk-doc/create-quality-control/SKILL.md`)
- [ ] T012 [P] LUNA MAX update `sk-doc/create-readme` SKILL.md to contract (`.opencode/skills/sk-doc/create-readme/SKILL.md`)
- [ ] T013 [P] LUNA MAX update `sk-doc/create-skill` SKILL.md to contract (`.opencode/skills/sk-doc/create-skill/SKILL.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

Verify + gate tasks — a fresh Sonnet-5 xhigh agent per file, then the validator:

- [ ] T014 [P] fresh Sonnet-5 xhigh verify `sk-doc/create-agent` + validator gate (`.opencode/skills/sk-doc/create-agent/`)
- [ ] T015 [P] fresh Sonnet-5 xhigh verify `sk-doc/create-benchmark` + validator gate (`.opencode/skills/sk-doc/create-benchmark/`)
- [ ] T016 [P] fresh Sonnet-5 xhigh verify `sk-doc/create-changelog` + validator gate (`.opencode/skills/sk-doc/create-changelog/`)
- [ ] T017 [P] fresh Sonnet-5 xhigh verify `sk-doc/create-command` + validator gate (`.opencode/skills/sk-doc/create-command/`)
- [ ] T018 [P] fresh Sonnet-5 xhigh verify `sk-doc/create-diff` + validator gate (`.opencode/skills/sk-doc/create-diff/`)
- [ ] T019 [P] fresh Sonnet-5 xhigh verify `sk-doc/create-feature-catalog` + validator gate (`.opencode/skills/sk-doc/create-feature-catalog/`)
- [ ] T020 [P] fresh Sonnet-5 xhigh verify `sk-doc/create-flowchart` + validator gate (`.opencode/skills/sk-doc/create-flowchart/`)
- [ ] T021 [P] fresh Sonnet-5 xhigh verify `sk-doc/create-manual-testing-playbook` + validator gate (`.opencode/skills/sk-doc/create-manual-testing-playbook/`)
- [ ] T022 [P] fresh Sonnet-5 xhigh verify `sk-doc/create-quality-control` + validator gate (`.opencode/skills/sk-doc/create-quality-control/`)
- [ ] T023 [P] fresh Sonnet-5 xhigh verify `sk-doc/create-readme` + validator gate (`.opencode/skills/sk-doc/create-readme/`)
- [ ] T024 [P] fresh Sonnet-5 xhigh verify `sk-doc/create-skill` + validator gate (`.opencode/skills/sk-doc/create-skill/`)

- [ ] T025 Owning-hub regression check green; `validate.sh --strict` Errors 0; reconcile packet docs
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All 11 update tasks complete (fresh LUNA MAX each)
- [ ] All 11 verify+gate tasks complete (fresh Sonnet-5 xhigh each), validator green
- [ ] No file outside this batch modified; hub regression green
- [ ] `validate.sh --strict` Errors 0
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `./spec.md`
- **Plan**: `./plan.md`
- **Checklist**: `./checklist.md`
<!-- /ANCHOR:cross-refs -->
