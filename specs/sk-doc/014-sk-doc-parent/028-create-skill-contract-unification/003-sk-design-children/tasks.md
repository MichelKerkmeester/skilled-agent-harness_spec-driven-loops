---
title: "Tasks: sk-design Children Contract Conformance"
description: "One work-item per file: LUNA MAX update then fresh Sonnet-5 xhigh verify then validator gate, for the 6 files in this batch."
trigger_phrases:
  - "003-sk-design-children tasks"
  - "per-file conformance tasks"
  - "LUNA update Sonnet verify"
importance_tier: "normal"
contextType: "implementation"
parent: "sk-doc/014-sk-doc-parent/028-create-skill-contract-unification"
_memory:
  continuity:
    packet_pointer: "sk-doc/014-sk-doc-parent/028-create-skill-contract-unification/003-sk-design-children"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Scaffolded conformance phase tasks (planned)"
    next_safe_action: "Dispatch LUNA-MAX updates after operator go-ahead"
    blockers: []
    key_files: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

# Tasks: sk-design Children Contract Conformance

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

- [x] T001 Confirm worktree at origin tip; capture per-file validator baseline for all 6 files [EVIDENCE: `git worktree` wt-028 at origin tip; baseline via `baseline_sweep.py`]
- [x] T002 Compose the LUNA update prompt (contract target + scope lock + `GATE-3 PRE-RESOLVED`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Update tasks — dispatched in waves of >=5 (fresh LUNA MAX per file):

- [x] T003 [P] LUNA MAX update `sk-design/design-audit` SKILL.md to contract (`.opencode/skills/sk-design/design-audit/SKILL.md`) [EVIDENCE: `b01e4e29ca`; gate PASS + Sonnet-5 verify PASS]
- [x] T004 [P] LUNA MAX update `sk-design/design-foundations` SKILL.md to contract (`.opencode/skills/sk-design/design-foundations/SKILL.md`) [EVIDENCE: already conformant at baseline; no edit]
- [x] T005 [P] LUNA MAX update `sk-design/design-interface` SKILL.md to contract (`.opencode/skills/sk-design/design-interface/SKILL.md`) [EVIDENCE: `b01e4e29ca`; gate PASS + Sonnet-5 verify PASS]
- [x] T006 [P] LUNA MAX update `sk-design/design-mcp-open-design` SKILL.md to contract (`.opencode/skills/sk-design/design-mcp-open-design/SKILL.md`) [EVIDENCE: `b01e4e29ca`; gate PASS + Sonnet-5 verify PASS]
- [x] T007 [P] LUNA MAX update `sk-design/design-md-generator` SKILL.md to contract (`.opencode/skills/sk-design/design-md-generator/SKILL.md`) [EVIDENCE: `b01e4e29ca`; gate PASS + Sonnet-5 verify PASS]
- [x] T008 [P] LUNA MAX update `sk-design/design-motion` SKILL.md to contract (`.opencode/skills/sk-design/design-motion/SKILL.md`) [EVIDENCE: `b01e4e29ca`; gate PASS + Sonnet-5 verify PASS]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

Verify + gate tasks — a fresh Sonnet-5 xhigh agent per file, then the validator:

- [x] T009 [P] fresh Sonnet-5 xhigh verify `sk-design/design-audit` + validator gate (`.opencode/skills/sk-design/design-audit/`) [EVIDENCE: `b01e4e29ca`; gate PASS + Sonnet-5 verify PASS]
- [x] T010 [P] fresh Sonnet-5 xhigh verify `sk-design/design-foundations` + validator gate (`.opencode/skills/sk-design/design-foundations/`) [EVIDENCE: already conformant at baseline; no edit]
- [x] T011 [P] fresh Sonnet-5 xhigh verify `sk-design/design-interface` + validator gate (`.opencode/skills/sk-design/design-interface/`) [EVIDENCE: `b01e4e29ca`; gate PASS + Sonnet-5 verify PASS]
- [x] T012 [P] fresh Sonnet-5 xhigh verify `sk-design/design-mcp-open-design` + validator gate (`.opencode/skills/sk-design/design-mcp-open-design/`) [EVIDENCE: `b01e4e29ca`; gate PASS + Sonnet-5 verify PASS]
- [x] T013 [P] fresh Sonnet-5 xhigh verify `sk-design/design-md-generator` + validator gate (`.opencode/skills/sk-design/design-md-generator/`) [EVIDENCE: `b01e4e29ca`; gate PASS + Sonnet-5 verify PASS]
- [x] T014 [P] fresh Sonnet-5 xhigh verify `sk-design/design-motion` + validator gate (`.opencode/skills/sk-design/design-motion/`) [EVIDENCE: `b01e4e29ca`; gate PASS + Sonnet-5 verify PASS]

- [x] T015 Owning-hub regression check green; `validate.sh --strict` Errors 0; reconcile packet docs
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All 6 update tasks complete (fresh LUNA MAX each)
- [x] All 6 verify+gate tasks complete (fresh Sonnet-5 xhigh each), validator green
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
