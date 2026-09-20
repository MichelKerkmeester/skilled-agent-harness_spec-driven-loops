---
title: "Tasks: sk-prompt Persona-Injection Alignment"
description: "Task breakdown for installing and verifying the canonical Persona Injection section in the CLI Prompt Quality Card."
trigger_phrases:
  - "sk-prompt alignment tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/050-persona-injection-enforcement/004-sk-prompt-alignment"
    last_updated_at: "2026-08-19T11:31:00Z"
    last_updated_by: "claude"
    recent_action: "All build + verify + audit tasks complete"
    next_safe_action: "Author P5 verification sweep"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt/sk-prompt-models/assets/cli-prompt-quality-card.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-050-004-skprompt"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: sk-prompt Persona-Injection Alignment

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

- [x] T001 Read `cli-prompt-quality-card.md` (8 sections) and pin the insertion point before `## 6. COMMON CLI PROMPT FAILURE PATTERNS`
- [x] T002 Pre-write the canonical Persona Injection section from contract `§1`–`§6` (`scratch/p4-persona-section`)
- [x] T003 Define the three anchored edits (insert `## 6. PERSONA INJECTION`; renumber `## 6`→`7`, `## 7`→`8`, `## 8`→`9`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Assemble the build dispatch: `markdown` persona inlined + the three edit instructions (dogfood)
- [x] T005 Dispatch `cli-devin` (`gemini-3-7-flash-high`, `--permission-mode accept-edits`) — returned `STATUS=OK` `DQI=95`
- [x] T006 Confirm the diff is insertion + renumber only (`64 insertions(+)`, `3 deletions(-)` = the three renumbered headers)
- [x] T007 Verify final section order via `rg "^## [0-9]"` (1-5, `6 PERSONA INJECTION`, 7, 8, 9)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Dispatch `cline`/DeepSeek tool-free (`review` persona) to verify §6 vs the contract (C1–C7)
- [x] T009 Reconcile the P2 finding — add the Devin `<name>/AGENT.md` note to the §6.3 inline block
- [x] T010 Audit `sk-prompt-improve` for a persona-owning dispatch-packaging ref (`rg` sweep) — none found; no edit made
- [x] T011 Run `validate.sh` on the phase folder with `--strict` (Errors:0)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` (`T001`–`T011`)
- [x] No `[B]` blocked tasks remaining (`git status` scoped)
- [x] Canonical section present; every P3 mode-rule reference now resolves
- [x] Independent verify returned APPROVE (96/100, no P0/P1)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
