---
title: "Tasks: sk-code engineering rituals: mutation-check, verification ladder with named blind spots, and decision-economy plus fail-closed-by-construction doctrine [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "name"
  - "template"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "scaffold/007-sk-code-rituals"
    last_updated_at: "2026-06-15T14:06:39Z"
    last_updated_by: "template-author"
    recent_action: "Initialized Level 2 template"
    next_safe_action: "Replace continuity placeholders"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/007-sk-code-rituals"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: sk-code engineering rituals: mutation-check, verification ladder with named blind spots, and decision-economy plus fail-closed-by-construction doctrine

<!-- SPECKIT_LEVEL: 2 -->

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

- [ ] T001 Read `.opencode/skills/sk-code/SKILL.md` in full; record baseline `wc -l` and the exact bounds of the verification section (Phase 3 / Iron Law / Verification Commands, around lines 41 and 208-214). Verify: baseline line count and section bounds noted in working notes.
- [ ] T002 Run the producer grep `rg -n 'mutation|true-RED|compile-RED|blind spot|fail-closed|named seam' .opencode/skills/sk-code/SKILL.md` to confirm no pre-existing ritual to reconcile. Verify: grep returns only command-table rows, no duplicate ritual text.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add the mutation-check / claim-falsifier ritual to the verification section (`.opencode/skills/sk-code/SKILL.md`): after green, break the production code to confirm the test fails; true-RED vs compile-RED; hunt vacuous green. Verify: grep finds the break-it instruction + the true-RED vs compile-RED distinction (REQ-001).
- [ ] T005 Add the unit -> in-memory -> on-server -> live ladder with each rung's blind spot named, plus the one-line WEBFLOW-vs-OPENCODE rung mapping (`.opencode/skills/sk-code/SKILL.md`). Verify: grep finds all four rungs and a named blind spot per rung (REQ-002).
- [ ] T006 Add the decision-economy + fail-closed-by-construction doctrine (`.opencode/skills/sk-code/SKILL.md`): named seam with a closing condition not a bare `TODO`, never a dead control, structural invariants over disciplinary reminders. Verify: grep finds the named-seam / no-dead-control language + the fail-closed statement (REQ-004).
- [ ] T007 [P] (Optional, OQ-1) If the owner promotes the doctrine, create `decision-economy.md` and/or `fail-closed-by-construction.md` under `.opencode/skills/system-spec-kit/constitutional/` and add its `README.md` index entry, matching the sibling rule format. Verify: new file format matches a sibling; README lists it (REQ-005).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Run `bash .opencode/skills/sk-code/scripts/check-comment-hygiene.sh` on any added code snippet. Verify: zero violations (REQ-003 hygiene; SC-004).
- [ ] T009 Confirm routing is unchanged: `git diff` shows edits confined to the verification section, §2 smart-router text untouched, and `sk-code` still loads. Verify: diff confinement + identical routing behavior (REQ-003).
- [ ] T010 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict` and mark `checklist.md` items with grep/diff evidence. Verify: validator PASSES; P0/P1 checklist items complete.
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

