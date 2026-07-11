---
title: "Tasks: Phase 6: adapter-sk-git-and-sk-design"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "phase 006"
  - "adapter sk-git"
  - "adapter sk-design"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/059-deep-alignment-mode/006-adapter-sk-git-and-sk-design"
    last_updated_at: "2026-07-11T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Draft phase 006 task list"
    next_safe_action: "Start T004 sk-git discover implementation"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-059-006"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Phase 6: adapter-sk-git-and-sk-design

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

- [ ] T001 Confirm phase 005 adapter contract signature is available or fall back to the design-brief-locked contract (`.opencode/specs/system-deep-loop/059-deep-alignment-mode/005-adapter-sk-doc/`)
- [ ] T002 Re-read `.opencode/skills/sk-git/SKILL.md` §"Commit Message Logic" (lines 309-457) and branch-naming rule (line 298) for currency
- [ ] T003 [P] Re-read `.opencode/skills/sk-design/design-audit/references/audit_contract.md` and `.opencode/skills/sk-design/design-md-generator/references/design_md_format.md` for currency
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 [P] Implement sk-git adapter `discover(scope)` over commit range / branch diff (adapters/sk-git-adapter)
- [ ] T005 [P] Implement sk-git adapter `standardSource(authority)` reading the commit grammar + branch rule (adapters/sk-git-adapter)
- [ ] T006 Implement sk-git adapter `check(artifact, rules)` with the Git-generated-subject exemption list honored (adapters/sk-git-adapter)
- [ ] T007 [P] Implement sk-design adapter `discover(scope)` over DESIGN.md/tokens.json paths, v1 static-only (adapters/sk-design-adapter)
- [ ] T008 [P] Implement sk-design adapter `standardSource(authority)` reading the token vocabulary + audit rubric (adapters/sk-design-adapter)
- [ ] T009 Implement sk-design adapter `check(artifact, rules)` citing the specific violated dimension per finding (adapters/sk-design-adapter)
- [ ] T010 Author each adapter's known-deviation/accepted-convention list per the location decided in the 002 decision-record
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Dry-run sk-git adapter against a real commit range; confirm exempt Git-generated subjects are not flagged
- [ ] T012 Dry-run sk-design adapter against a real repo `DESIGN.md`; confirm findings cite a real rubric dimension
- [ ] T013 Confirm both adapters return the documented empty-scope result on zero artifacts
- [ ] T014 Update `checklist.md` with evidence for each verified item
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
