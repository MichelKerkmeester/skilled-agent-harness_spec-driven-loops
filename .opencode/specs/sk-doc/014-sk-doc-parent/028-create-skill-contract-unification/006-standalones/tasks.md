---
title: "Tasks: Standalone Skills Contract Conformance"
description: "One work-item per file: LUNA MAX update then fresh Sonnet-5 xhigh verify then validator gate, for the 5 files in this batch."
trigger_phrases:
  - "006-standalones tasks"
  - "per-file conformance tasks"
  - "LUNA update Sonnet verify"
importance_tier: "normal"
contextType: "implementation"
parent: "sk-doc/014-sk-doc-parent/028-create-skill-contract-unification"
_memory:
  continuity:
    packet_pointer: "sk-doc/014-sk-doc-parent/028-create-skill-contract-unification/006-standalones"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Scaffolded conformance phase tasks (planned)"
    next_safe_action: "Dispatch LUNA-MAX updates after operator go-ahead"
    blockers: []
    key_files: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

# Tasks: Standalone Skills Contract Conformance

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

- [x] T001 Confirm worktree at origin tip; capture per-file validator baseline for all 5 files [EVIDENCE: `git worktree` wt-028 at origin tip; baseline via `baseline_sweep.py`]
- [x] T002 Compose the LUNA update prompt (contract target + scope lock + `GATE-3 PRE-RESOLVED`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Update tasks — dispatched in waves of >=5 (fresh LUNA MAX per file):

- [x] T003 [P] LUNA MAX update `mcp-code-mode` SKILL.md to contract (`.opencode/skills/mcp-code-mode/SKILL.md`) [EVIDENCE: already conformant at baseline; no edit]
- [x] T004 [P] LUNA MAX update `sk-git` SKILL.md to contract (`.opencode/skills/sk-git/SKILL.md`) [EVIDENCE: `f0a35dc9e2`; gate PASS + Sonnet-5 verify PASS]
- [x] T005 [P] LUNA MAX update `system-code-graph` SKILL.md to contract (`.opencode/skills/system-code-graph/SKILL.md`) [EVIDENCE: `f0a35dc9e2`; gate PASS + Sonnet-5 verify PASS]
- [x] T006 [P] LUNA MAX update `system-skill-advisor` SKILL.md to contract (`.opencode/skills/system-skill-advisor/SKILL.md`) [EVIDENCE: already conformant at baseline; no edit]
- [x] T007 [P] LUNA MAX update `system-spec-kit` SKILL.md to contract (`.opencode/skills/system-spec-kit/SKILL.md`) [EVIDENCE: already conformant at baseline; no edit]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

Verify + gate tasks — a fresh Sonnet-5 xhigh agent per file, then the validator:

- [x] T008 [P] fresh Sonnet-5 xhigh verify `mcp-code-mode` + validator gate (`.opencode/skills/mcp-code-mode/`) [EVIDENCE: already conformant at baseline; no edit]
- [x] T009 [P] fresh Sonnet-5 xhigh verify `sk-git` + validator gate (`.opencode/skills/sk-git/`) [EVIDENCE: `f0a35dc9e2`; gate PASS + Sonnet-5 verify PASS]
- [x] T010 [P] fresh Sonnet-5 xhigh verify `system-code-graph` + validator gate (`.opencode/skills/system-code-graph/`) [EVIDENCE: `f0a35dc9e2`; gate PASS + Sonnet-5 verify PASS]
- [x] T011 [P] fresh Sonnet-5 xhigh verify `system-skill-advisor` + validator gate (`.opencode/skills/system-skill-advisor/`) [EVIDENCE: already conformant at baseline; no edit]
- [x] T012 [P] fresh Sonnet-5 xhigh verify `system-spec-kit` + validator gate (`.opencode/skills/system-spec-kit/`) [EVIDENCE: already conformant at baseline; no edit]

- [x] T013 Owning-hub regression check green; `validate.sh --strict` Errors 0; reconcile packet docs
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All 5 update tasks complete (fresh LUNA MAX each)
- [x] All 5 verify+gate tasks complete (fresh Sonnet-5 xhigh each), validator green
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
