---
title: "Acceptance Criteria: Phase 5: budget-and-chat-slice-handoff"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "budget handoff acceptance"
  - "packet budget criterion"
  - "criterion count unchanged"
  - "runtime handoff matrix"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/060-create-goal-mode/005-budget-and-chat-slice-handoff"
    last_updated_at: "2026-09-25T19:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Planned budget and slice handoff criteria"
    next_safe_action: "Implement the budget-and-handoff reference"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plan-005-budget-and-chat-slice-handoff"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 5: budget-and-chat-slice-handoff

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is Met, Waived or Superseded. A Waived or Superseded
> row MUST name an ADR that exists in decision-record.md.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/060-create-goal-mode/005-budget-and-chat-slice-handoff
**Level:** 2
**Status:** Complete
**Date:** 2026-09-25
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. AC-ID is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a packet goal in the phase-parent scope, When node .skilled/hooks/goal/bin/goal.cjs packet <packet> --workspace <repo root> runs, Then its output includes packet_durable_chars and packet_budget. | Capture the command output and require both fields, .skilled/hooks/goal/bin/goal.cjs:203-216, tasks.md:T007.. Observed 2026-09-26: the reference names the packet command and both fields (`.skilled/skills/sk-doc/sk-create-goal/references/budget-and-handoff.md:21`); both fields present in the fixture output | Met | - |
| AC-002 | REQ-002, REQ-003 | Given an over-budget fixture with its initial criterion count recorded, When the ordered cuts are applied, Then the packet command reports packet_budget=ok and the count remains unchanged. | Final packet output plus before/after completion-anchor count, .skilled/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md:61-71, specs/sk-doc/060-create-goal-mode/spec.md:146, tasks.md:T006-T007.. Observed: before 5,897 `over`, after 3,256 `ok`, 5 criteria before and after (`specs/sk-doc/060-create-goal-mode/005-budget-and-chat-slice-handoff/scratch/budget-fixture-evidence.md:1`) | Met | - |
| AC-003 | REQ-002 | Given an over-budget goal, When the author follows the set-string sequence, Then cuts follow frontmatter, log, restated child detail, decision prose and criterion wording, with no criterion removed and a split if still over. | Inspect the reference's ordered list, .skilled/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md:61-71, tasks.md:T003.. Observed: ordered cuts, criterion count kept, split rule (`.skilled/skills/sk-doc/sk-create-goal/references/budget-and-handoff.md:37`) | Met | - |
| AC-004 | REQ-004 | Given the packet command output, When the reference prepares a runtime handoff, Then it identifies chat_slice as the operator payload and distinguishes it from the bind-time objective_slice. | Reference text plus packet output fields, .skilled/hooks/goal/lib/goal-slice.cjs:66-79,96-118, .skilled/hooks/goal/bin/goal.cjs:208-216, tasks.md:T004,T007.. Observed: distinct projections and the print-and-stop rule, no bind or set call (`.skilled/skills/sk-doc/sk-create-goal/references/budget-and-handoff.md:51`) | Met | - |
| AC-005 | REQ-004, REQ-005 | Given any row in the runtime matrix, When the mode completes its handoff, Then it prints the chat slice and stops without calling bind or set, while the matrix names Claude Code, Codex, OpenCode, Pi, Cursor and Devin. | Reference matrix and stop rule, .skilled/hooks/goal/goal-plugin.md:151-170, specs/sk-doc/060-create-goal-mode/goal.md:51-54, tasks.md:T004,T008.. Observed: six-runtime matrix with evidence limits (`.skilled/skills/sk-doc/sk-create-goal/references/budget-and-handoff.md:61`) | Met | - |
| AC-006 | REQ-006 | Given the parent log's 4,820 initial and 3,735 final durable counts with no criterion dropped, When the fixed-template cost is assessed, Then the reference records no system-spec-kit amendment for that cost on current evidence and preserves D4 for a contract gap. | Reference decision and specs/sk-doc/060-create-goal-mode/goal.md:52-54,136, tasks.md:T005.. Observed: fixed-text cost kept out of system-spec-kit; D4 named as the escalation path (`.skilled/skills/sk-doc/sk-create-goal/references/budget-and-handoff.md:76`) | Met | - |
| AC-007 | REQ-001, REQ-003 | Given the phase reference and planning packet, When strict validation runs on this folder, Then the validator reports no phase-document rule failure beyond generated metadata findings reserved for orchestration. | bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-doc/060-create-goal-mode/005-budget-and-chat-slice-handoff --strict, tasks.md:T009.. Observed: `RESULT: PASSED`, 0 errors and 0 warnings (`specs/sk-doc/060-create-goal-mode/005-budget-and-chat-slice-handoff/implementation-summary.md:1`) | Met | - |
| AC-008 | REQ-007 | Given the mode after this phase, When `SKILL.md` and `references/README.md` are read, Then both link `budget-and-handoff.md` and the link resolves | T010; `grep -n budget-and-handoff` on both files. Observed: `.skilled/skills/sk-doc/sk-create-goal/SKILL.md:109` and `.skilled/skills/sk-doc/sk-create-goal/references/README.md:25` link the reference; the link resolves | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| Met | Verified. The Verification cell names evidence that was actually observed. |
| Unmet | Not yet satisfied. Blocks closure. |
| Waived | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| Superseded | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write - when the row is Met or Unmet. Write ADR-NNN when the row is
Waived or Superseded, naming a decision record that exists in
decision-record.md. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes

All eight criteria are Met with observed evidence: the reference exists and is wired, and the over-budget fixture was cut into budget with its criterion count unchanged.
<!-- /ANCHOR:closure -->
