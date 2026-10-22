---
title: "Tasks: Phase 57: v4-0-0-13-reliability-fixes"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "v4 0 0 13 reliability fixes tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 57: v4-0-0-13-reliability-fixes

<!-- SPECKIT_LEVEL: 1 -->

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

- [x] T001 Read the changelog as 054 left it and the `sk-create-changelog` contract it must follow, so the section grammar and the 12-bullet glance ceiling are known before editing (`.skilled/changelog/skilled/v4.0.0.13.md`, `.skilled/skills/sk-doc/sk-create-changelog/`)
- [x] T002 Group the 25 commits since tag v4.0.0.12 into the five items the section will carry: six on advisor lookups, five on the hand-off count lock, four on goal records, five on worktree provisioning and six on smaller fixes. The leftover commit, `ecd8873efa`, names handoff notes by the full session id, a fault the live-proof paragraph already covers among its four, so it is dropped rather than repeated (`../054-v4-0-0-13-changelog-opencode/implementation-summary.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Brief 1: add a `## Reliability Fixes` section between the last existing release section and Upgrade Notes, with five H4 items - advisor lookups that queue and give up on time, hand-off counts that stop racing, a corrupt goal record that reads as no goal, fresh worktrees that build what they need, and the smaller fixes across the stack (`.skilled/changelog/skilled/v4.0.0.13.md`)
- [x] T004 Brief 2: widen the existing glance bullet to "State, locks and CI are sturdier." so it names advisor lookups, the hand-off count lock, the goal record, worktree provisioning, the git pre-commit installer and the OpenCode session-cleanup guards, without adding a bullet, so the glance list stays at 12 (`.skilled/changelog/skilled/v4.0.0.13.md`)
- [x] T005 Brief 3: add "Pass a workspace to goal session actions." to Upgrade Notes, naming `--workspace` and the repo root it takes, for scripts that call the goal session actions (`.skilled/changelog/skilled/v4.0.0.13.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Round 1 read-only DeepSeek fact check, then fix its findings: the lock takeover rule omitted the case of an unreadable owner record past the stale window (P1), the 2.2 ms figure described one source file's signature check but read as a whole-lookup cost (P2), and the heading claimed counts never lose a write, which the lock cannot promise (P2) (`.skilled/changelog/skilled/v4.0.0.13.md`)
- [x] T007 Round 2 read-only DeepSeek fact check, then fix its findings: provisioning undercounted the missing package trees and omitted the two that stay out on purpose (P1), and the archive paragraph named malformed JSON where a valid file holding the wrong shape is the trigger (P2) (`.skilled/changelog/skilled/v4.0.0.13.md`)
- [x] T008 Round 3 read-only DeepSeek fact check: PASS, no findings (`.skilled/changelog/skilled/v4.0.0.13.md`)
- [x] T009 Run both content validators over the finished file: `validate_document.py` reports VALID with 0 issues and `hvr_scan.py` reports 0 hard blockers (`.skilled/changelog/skilled/v4.0.0.13.md`)
- [ ] T010 Push to main (`.skilled/changelog/skilled/v4.0.0.13.md`)
- [ ] T011 Record CI on the pushed commit (`.skilled/changelog/skilled/v4.0.0.13.md`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] Every task marked `[x]`: T010 and T011 stay open until the commit is on main and CI has run on it
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: the section, the glance bullet at 12 and the upgrade note all read as recorded, and both validators passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **The changelog as 054 left it**: See `../054-v4-0-0-13-changelog-opencode/implementation-summary.md`
<!-- /ANCHOR:cross-refs -->

---
