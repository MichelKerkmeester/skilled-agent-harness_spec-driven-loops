---
title: "Tasks: CLI Mode + Hub Persona-Injection Enforcement"
description: "Task breakdown for building, verifying, and reconciling the persona-injection enforcement rules across six modes and the hub."
trigger_phrases:
  - "cli mode enforcement tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/050-persona-injection-enforcement/003-cli-mode-enforcement"
    last_updated_at: "2026-08-19T11:12:00Z"
    last_updated_by: "claude"
    recent_action: "All build + verify + reconcile tasks complete"
    next_safe_action: "Author P4 sk-prompt alignment"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external-orchestration/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-050-003-enforcement"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: CLI Mode + Hub Persona-Injection Enforcement

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

**Task Format**: `T### [P?] Description (target)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read `cli-devin/SKILL.md` (CLI-dispatch preload rule) + confirm `devin auth status` = "Logged in"
- [x] T002 Pin each file's insertion anchor (`### ⛔ NEVER` boundary) + next rule number (devin 17, opencode 18, claude-code 14, codex 17, cursor 17, pi bullet 11)
- [x] T003 Pre-write the 7 rule blocks from contract `§3`/`§7` (`scratch/p3-rule-blocks`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Assemble the build dispatch: `markdown` persona inlined verbatim + per-file insertion instructions (dogfood the rule this phase adds)
- [x] T005 Dispatch `cli-devin` (`gemini-3-7-flash-high`, `--permission-mode accept-edits`, child-session env guards) to apply the 7 insertions
- [x] T006 Verify the scoped `git diff` is pure insertion (`13 insertions(+)`, 0 deletions; only the 7 target files)
- [x] T007 Confirm placement, numbering, and cross-references (card path depth `../../sk-prompt/...`; DESIGN_DISPATCH_MANIFEST `Rule 11` for claude-code, `Rule 14` elsewhere)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Read `cli-opencode/SKILL.md` (CLI-dispatch preload rule) for the cline-pass invocation
- [x] T009 Dispatch `cline`/DeepSeek tool-free (`review` persona) to verify each rule against contract `§3` (C1–C6)
- [x] T010 Reconcile findings — append the failure-consequence clause to `cli-pi` bullet 11 (P2 parity fix)
- [x] T011 Run `validate.sh` on the phase folder with `--strict` (Errors:0)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` (`T001`–`T011`)
- [x] No `[B]` blocked tasks remaining (`git status` scoped)
- [x] All 6 modes + hub carry the rule (`rg "persona"` confirms)
- [x] Independent verify returned APPROVE (98/100, no P0/P1)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
