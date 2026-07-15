---
title: "Tasks: sk-doc Children Contract Conformance"
description: "One work-item per file: LUNA MAX update then fresh Sonnet-5 xhigh verify then validator gate, for the 11 files in this batch."
trigger_phrases:
  - "002-sk-doc-children tasks"
  - "per-file conformance tasks"
  - "LUNA update Sonnet verify"
importance_tier: "normal"
contextType: "implementation"
parent: "sk-doc/015-sk-doc-parent/028-create-skill-contract-unification"
_memory:
  continuity:
    packet_pointer: "sk-doc/015-sk-doc-parent/028-create-skill-contract-unification/002-sk-doc-children"
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

- [x] T001 Confirm worktree at origin tip; capture per-file validator baseline for all 11 files [EVIDENCE: `git worktree` wt-028 at origin tip; baseline via `baseline_sweep.py`]
- [x] T002 Compose the LUNA update prompt (contract target + scope lock + `GATE-3 PRE-RESOLVED`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Update tasks — dispatched in waves of >=5 (fresh LUNA MAX per file):

- [x] T003 [P] LUNA MAX update `sk-doc/create-agent` SKILL.md to contract (`.opencode/skills/sk-doc/create-agent/SKILL.md`) [EVIDENCE: `85cc0d5efd`; gate PASS + Sonnet-5 verify PASS]
- [x] T004 [P] LUNA MAX update `sk-doc/create-benchmark` SKILL.md to contract (`.opencode/skills/sk-doc/create-benchmark/SKILL.md`) [EVIDENCE: `85cc0d5efd`; gate PASS + Sonnet-5 verify PASS]
- [x] T005 [P] LUNA MAX update `sk-doc/create-changelog` SKILL.md to contract (`.opencode/skills/sk-doc/create-changelog/SKILL.md`) [EVIDENCE: `85cc0d5efd`; gate PASS + Sonnet-5 verify PASS]
- [x] T006 [P] LUNA MAX update `sk-doc/create-command` SKILL.md to contract (`.opencode/skills/sk-doc/create-command/SKILL.md`) [EVIDENCE: `85cc0d5efd`; gate PASS + Sonnet-5 verify PASS]
- [x] T007 [P] LUNA MAX update `sk-doc/create-diff` SKILL.md to contract (`.opencode/skills/sk-doc/create-diff/SKILL.md`) [EVIDENCE: `85cc0d5efd`; gate PASS + Sonnet-5 verify PASS]
- [x] T008 [P] LUNA MAX update `sk-doc/create-feature-catalog` SKILL.md to contract (`.opencode/skills/sk-doc/create-feature-catalog/SKILL.md`) [EVIDENCE: `85cc0d5efd`; gate PASS + Sonnet-5 verify PASS]
- [x] T009 [P] LUNA MAX update `sk-doc/create-flowchart` SKILL.md to contract (`.opencode/skills/sk-doc/create-flowchart/SKILL.md`) [EVIDENCE: already conformant at baseline; no edit]
- [x] T010 [P] LUNA MAX update `sk-doc/create-manual-testing-playbook` SKILL.md to contract (`.opencode/skills/sk-doc/create-manual-testing-playbook/SKILL.md`) [EVIDENCE: `85cc0d5efd`; gate PASS + Sonnet-5 verify PASS]
- [x] T011 [P] LUNA MAX update `sk-doc/create-quality-control` SKILL.md to contract (`.opencode/skills/sk-doc/create-quality-control/SKILL.md`) [EVIDENCE: `85cc0d5efd`; gate PASS + Sonnet-5 verify PASS]
- [x] T012 [P] LUNA MAX update `sk-doc/create-readme` SKILL.md to contract (`.opencode/skills/sk-doc/create-readme/SKILL.md`) [EVIDENCE: `85cc0d5efd`; gate PASS + Sonnet-5 verify PASS]
- [x] T013 [P] LUNA MAX update `sk-doc/create-skill` SKILL.md to contract (`.opencode/skills/sk-doc/create-skill/SKILL.md`) [EVIDENCE: `85cc0d5efd`; gate PASS + Sonnet-5 verify PASS]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

Verify + gate tasks — a fresh Sonnet-5 xhigh agent per file, then the validator:

- [x] T014 [P] fresh Sonnet-5 xhigh verify `sk-doc/create-agent` + validator gate (`.opencode/skills/sk-doc/create-agent/`) [EVIDENCE: `85cc0d5efd`; gate PASS + Sonnet-5 verify PASS]
- [x] T015 [P] fresh Sonnet-5 xhigh verify `sk-doc/create-benchmark` + validator gate (`.opencode/skills/sk-doc/create-benchmark/`) [EVIDENCE: `85cc0d5efd`; gate PASS + Sonnet-5 verify PASS]
- [x] T016 [P] fresh Sonnet-5 xhigh verify `sk-doc/create-changelog` + validator gate (`.opencode/skills/sk-doc/create-changelog/`) [EVIDENCE: `85cc0d5efd`; gate PASS + Sonnet-5 verify PASS]
- [x] T017 [P] fresh Sonnet-5 xhigh verify `sk-doc/create-command` + validator gate (`.opencode/skills/sk-doc/create-command/`) [EVIDENCE: `85cc0d5efd`; gate PASS + Sonnet-5 verify PASS]
- [x] T018 [P] fresh Sonnet-5 xhigh verify `sk-doc/create-diff` + validator gate (`.opencode/skills/sk-doc/create-diff/`) [EVIDENCE: `85cc0d5efd`; gate PASS + Sonnet-5 verify PASS]
- [x] T019 [P] fresh Sonnet-5 xhigh verify `sk-doc/create-feature-catalog` + validator gate (`.opencode/skills/sk-doc/create-feature-catalog/`) [EVIDENCE: `85cc0d5efd`; gate PASS + Sonnet-5 verify PASS]
- [x] T020 [P] fresh Sonnet-5 xhigh verify `sk-doc/create-flowchart` + validator gate (`.opencode/skills/sk-doc/create-flowchart/`) [EVIDENCE: already conformant at baseline; no edit]
- [x] T021 [P] fresh Sonnet-5 xhigh verify `sk-doc/create-manual-testing-playbook` + validator gate (`.opencode/skills/sk-doc/create-manual-testing-playbook/`) [EVIDENCE: `85cc0d5efd`; gate PASS + Sonnet-5 verify PASS]
- [x] T022 [P] fresh Sonnet-5 xhigh verify `sk-doc/create-quality-control` + validator gate (`.opencode/skills/sk-doc/create-quality-control/`) [EVIDENCE: `85cc0d5efd`; gate PASS + Sonnet-5 verify PASS]
- [x] T023 [P] fresh Sonnet-5 xhigh verify `sk-doc/create-readme` + validator gate (`.opencode/skills/sk-doc/create-readme/`) [EVIDENCE: `85cc0d5efd`; gate PASS + Sonnet-5 verify PASS]
- [x] T024 [P] fresh Sonnet-5 xhigh verify `sk-doc/create-skill` + validator gate (`.opencode/skills/sk-doc/create-skill/`) [EVIDENCE: `85cc0d5efd`; gate PASS + Sonnet-5 verify PASS]

- [x] T025 Owning-hub regression check green; `validate.sh --strict` Errors 0; reconcile packet docs
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All 11 update tasks complete (fresh LUNA MAX each)
- [x] All 11 verify+gate tasks complete (fresh Sonnet-5 xhigh each), validator green
- [x] No file outside this batch modified; hub regression green
- [x] `validate.sh --strict` Errors 0
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `./spec.md`
- **Plan**: `./plan.md`
- **Checklist**: `./checklist.md`
<!-- /ANCHOR:cross-refs -->
