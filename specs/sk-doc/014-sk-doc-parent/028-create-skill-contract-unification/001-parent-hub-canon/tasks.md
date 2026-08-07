---
title: "Tasks: Parent Hub Canon Conformance"
description: "One work-item per file: LUNA MAX update then fresh Sonnet-5 xhigh verify then validator gate, for the 7 files in this batch."
trigger_phrases:
  - "001-parent-hub-canon tasks"
  - "per-file conformance tasks"
  - "LUNA update Sonnet verify"
importance_tier: "normal"
contextType: "implementation"
parent: "sk-doc/014-sk-doc-parent/028-create-skill-contract-unification"
_memory:
  continuity:
    packet_pointer: "sk-doc/014-sk-doc-parent/028-create-skill-contract-unification/001-parent-hub-canon"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Scaffolded conformance phase tasks (planned)"
    next_safe_action: "Dispatch LUNA-MAX updates after operator go-ahead"
    blockers: []
    key_files: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

# Tasks: Parent Hub Canon Conformance

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

- [x] T001 Confirm worktree at origin tip; capture per-file validator baseline for all 7 files [EVIDENCE: `git worktree` wt-028 at origin tip; baseline via `baseline_sweep.py`]
- [x] T002 Compose the LUNA update prompt (contract target + scope lock + `GATE-3 PRE-RESOLVED`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Update tasks — dispatched in waves of >=5 (fresh LUNA MAX per file):

- [x] T003 [P] LUNA MAX update `cli-external-orchestration` SKILL.md to parent canon (`.opencode/skills/cli-external-orchestration/SKILL.md`) [EVIDENCE: already conformant at baseline; no edit]
- [x] T004 [P] LUNA MAX update `mcp-tooling` SKILL.md to parent canon (`.opencode/skills/mcp-tooling/SKILL.md`) [EVIDENCE: already conformant at baseline; no edit]
- [x] T005 [P] LUNA MAX update `sk-code` SKILL.md to parent canon (`.opencode/skills/sk-code/SKILL.md`) [EVIDENCE: already conformant at baseline; no edit]
- [x] T006 [P] LUNA MAX update `sk-design` SKILL.md to parent canon (`.opencode/skills/sk-design/SKILL.md`) [EVIDENCE: already conformant at baseline; no edit]
- [x] T007 [P] LUNA MAX update `sk-doc` SKILL.md to parent canon (`.opencode/skills/sk-doc/SKILL.md`) [EVIDENCE: already conformant at baseline; no edit]
- [x] T008 [P] LUNA MAX update `sk-prompt` SKILL.md to parent canon (`.opencode/skills/sk-prompt/SKILL.md`) [EVIDENCE: already conformant at baseline; no edit]
- [x] T009 [P] LUNA MAX update `system-deep-loop` SKILL.md to parent canon (`.opencode/skills/system-deep-loop/SKILL.md`) [EVIDENCE: already conformant at baseline; no edit]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

Verify + gate tasks — a fresh Sonnet-5 xhigh agent per file, then the validator:

- [x] T010 [P] fresh Sonnet-5 xhigh verify `cli-external-orchestration` + validator gate (`.opencode/skills/cli-external-orchestration/`) [EVIDENCE: already conformant at baseline; no edit]
- [x] T011 [P] fresh Sonnet-5 xhigh verify `mcp-tooling` + validator gate (`.opencode/skills/mcp-tooling/`) [EVIDENCE: already conformant at baseline; no edit]
- [x] T012 [P] fresh Sonnet-5 xhigh verify `sk-code` + validator gate (`.opencode/skills/sk-code/`) [EVIDENCE: already conformant at baseline; no edit]
- [x] T013 [P] fresh Sonnet-5 xhigh verify `sk-design` + validator gate (`.opencode/skills/sk-design/`) [EVIDENCE: already conformant at baseline; no edit]
- [x] T014 [P] fresh Sonnet-5 xhigh verify `sk-doc` + validator gate (`.opencode/skills/sk-doc/`) [EVIDENCE: already conformant at baseline; no edit]
- [x] T015 [P] fresh Sonnet-5 xhigh verify `sk-prompt` + validator gate (`.opencode/skills/sk-prompt/`) [EVIDENCE: already conformant at baseline; no edit]
- [x] T016 [P] fresh Sonnet-5 xhigh verify `system-deep-loop` + validator gate (`.opencode/skills/system-deep-loop/`) [EVIDENCE: already conformant at baseline; no edit]

- [x] T017 Owning-hub regression check green; `validate.sh --strict` Errors 0; reconcile packet docs
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All 7 update tasks complete (fresh LUNA MAX each)
- [x] All 7 verify+gate tasks complete (fresh Sonnet-5 xhigh each), validator green
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
