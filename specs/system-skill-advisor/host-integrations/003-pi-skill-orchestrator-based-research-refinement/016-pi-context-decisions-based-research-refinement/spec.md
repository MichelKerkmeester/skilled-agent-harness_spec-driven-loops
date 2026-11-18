---
title: "Phase Parent: pi-context-decisions Research for Skill Advisor Refinement"
description: "Phased packet that mines the pi-context-decisions Pi extension, a decision-model skill picker with additive per-branch advertising and optional tool filtering, for ideas that could improve system-skill-advisor and its hooks. Phase 1 ran a 5-iteration deep research. Phases 2 to 4 implement the three recommendations the operator adopted: pasted-context stripping, a follow-up routing benchmark with a floor counter and a crash-path fallback with a threshold doc line."
trigger_phrases:
  - "pi-context-decisions"
  - "pi context decisions research"
  - "decision model skill picker"
  - "skill advisor refinement from pi-context-decisions"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement"
    last_updated_at: "2026-11-18T12:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Applied the accepted plan changes C1 to C15 and the build order 002, then 004, then 003"
    next_safe_action: "Start phase 002 by re-running its probe pair"
    blockers: []
    key_files:
      - "spec.md"
      - "001-deep-research/spec.md"
      - "002-pasted-context-stripping/spec.md"
      - "003-follow-up-routing-benchmark/spec.md"
      - "004-crash-path-fallback/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "db37536c-37e4-472c-8a05-521b8fec328d"
      parent_session_id: null
    completion_pct: 25
    open_questions: []
    answered_questions:
      - "Placement, decided by the operator 2026-11-18: a new phase child under 003-pi-skill-orchestrator-based-research-refinement."
      - "Executor, set by the operator 2026-11-18: 5 iterations on Opus 5.5 medium through claude2, the second Claude account."
      - "Refinement phases, decided by the operator 2026-11-18: 002 pasted-context stripping (N3), 003 follow-up routing benchmark with floor counter (R3 and R5), 004 crash-path fallback with threshold doc line (R2 shrunk and N1). Everything else is cut or research-only."
      - "Plan changes, decided by the operator 2026-11-18: all of C1 to C15 from 005-plan-validation-research are accepted. Build order is 002, then 004, then 003, with folder names unchanged."
      - "Phase 003 decisions, by the operator 2026-11-18: emit nothing means the policy's existing skipped result, and the ship rule is H >= ceil(N / 2) with N = 9, so H >= 5, and C = 0."
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.3 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Phase Parent: pi-context-decisions Research for Skill Advisor Refinement

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress. Phases 1 and 5 research are complete. The operator accepted plan changes C1 to C15, and they are applied to phases 002 to 004. Build order is 002, then 004, then 003 |
| **Created** | 2026-11-18 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement |
| **Predecessor** | 015-readme-alignment |
| **Successor** | None |
| **Handoff Criteria** | Each phase passes strict validation and meets its own acceptance criteria before the next one starts. Phase 003 closes the packet |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The skill advisor picks skills with a local five-lane scorer and pushes a brief into every prompt. The pi-context-decisions extension (v4.2.2, stored in `context/pi-context-decisions-main/`) picks skills with a hosted decision model. It adds the qualifying skills to Pi's native skills section and never retracts them on a branch. It also has allowlists, an inventory floor, a per-round cap, decision history and an optional tool filter. It ships a small live benchmark of its scoring method. The earlier sibling research covered pi-skill-orchestrator's pull-based design, not this one, so these ideas are unexamined against our code.

### Purpose
Produce evidence-backed ADOPT, ADAPT or REJECT verdicts for the extension's ideas, each citing both codebases at `file:line`, then turn only the adopted ones into advisor refinement phases.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read-only deep research over `context/pi-context-decisions-main/`, `.skilled/skills/system-skill-advisor/`, its hooks and plugin, and the related Jev classifier path in `cli-classifier`.
- A ranked synthesis that the operator can choose refinement phases from.
- Refinement phases authored after the synthesis, limited to what the operator adopts: phases 002 to 004.

### Out of Scope
- Editing the extension source. It stays as delivered, as reference material.
- Installing the extension into this repository's Pi setup.
- Revisiting the sibling pi-skill-orchestrator verdicts without new evidence.

### Cut or Research-Only Recommendations
The operator adopted three phases. The other recommendations get no phase. Each reason below is the one-line reason from `001-deep-research/research/review-overengineering-opus-high.md`.

| Item | Outcome | Reason |
|------|---------|--------|
| R1 emit-time history rule | Cut | It governs a history view that does not exist. Reopen it only if R4 is ever built |
| R4 debug "why" fields | Cut | Nothing would read them, and they need changes to the closed validator and the persistence path |
| R6 shadow tie-break, with N2 and N8 | Research only | It needs operator consent before any prompt leaves the machine. N2 turns it into one `choice` question, and N8's budget gates matter only if a paid run is approved |
| R7 per-session flip rate | Cut | It needs a new persisted session key, and no decision depends on the number |
| R8 `acceptable` label class | Cut | No case was shown where the ratchet scored a near miss wrongly and blocked a change |
| N4 stored route receipts | Deferred | New per-session state on three runtimes. Build it only if phase 003 shows the simple guard over-suppresses |
| N5 status-line segment | Cut | No missed outage was shown, and it would be a new surface on every runtime |
| N6 closed error code at the catch | Cut | A programming error in the hook would classify as `UNKNOWN` anyway, and the fixed detail string already makes the crash path countable |
| N7 real-host Pi test | Cut | It needs a Pi SDK dev dependency for drift no incident has shown |

### Files to Change
Phase 1 writes research artifacts only. Phases 002 to 004 list their exact files in their own `spec.md` and `plan.md`.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `001-deep-research/research/` | Create | 001-deep-research | Iteration state, deltas and the `research.md` synthesis |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-deep-research/ | 5-iteration deep research on Opus 5.5 medium through the second Claude account, ranked verdicts: 1 ADOPT, 7 ADAPT, 14 REJECT | Complete |
| 2 | 002-pasted-context-stripping/ | N3: strip a leading pasted reply before scoring, in the recommend handler and at the entry of `scoreAdvisorPrompt`, so every runtime and every corpus runner gets it. One new corpus row | Planned |
| 3 | 003-follow-up-routing-benchmark/ | R3 and R5: count floored top-1 passes and score follow-up pairs in the calibration bench. The guard and the `confidenceFloored` pass-through ship only if a rule fixed in advance says so | Planned |
| 4 | 004-crash-path-fallback/ | R2 shrunk and N1: return the outage fallback from the shared hook's unhandled catch, plus one doc line on when the confidence threshold is read | Planned |
| 5 | 005-plan-validation-research/ | 3-iteration deep research on Opus 5.5 high through the second Claude account, checking phases 002 to 004 before they are built: all three stay, with plan changes C1 to C15 and the order 002, 004, 003 | Complete |

**Build order.** Folder numbers stay as they are. The build order is 001, then 005, then 002, then 004, then 003. Phase 004 builds before 003 because both edit `hooks/claude/user-prompt-submit.ts` and its hook test, and 003's guard would shift every line 004 pins. Phase 003 is the last phase.

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-deep-research | 005-plan-validation-research | The operator adopted N3, R3 with R5 and R2 with N1 from the ranked list | Each adopted item names its phase in this map |
| 002-pasted-context-stripping | 004-crash-path-fallback | The pasted-reply probe pair routes `sk-code` first for both prompts, and the corpus gates are green | `002-pasted-context-stripping/tasks.md` has no open task, and its strict validation prints `RESULT: PASSED` |
| 004-crash-path-fallback | 003-follow-up-routing-benchmark | The new crash-path hook test passes, the existing hook tests stay green and the threshold doc sentence is in `ENV-REFERENCE.md` | `004-crash-path-fallback/tasks.md` has no open task, and its strict validation prints `RESULT: PASSED` |
| 005-plan-validation-research | 002-pasted-context-stripping | `research/research.md` gives each planned phase a verdict, and the operator has accepted or declined plan changes C1 to C15 | `005-plan-validation-research/research/research.md` section 7 |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None that block. The adoption question is answered in the continuity block. Phase-level questions live in each child `spec.md`.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Sibling research**: `../001-deep-research/research/research.md`, the pi-skill-orchestrator synthesis
- **Goal**: `goal.md`, which binds each phase goal
- **Delegation strategy**: `delegation-strategy.md`, the executor roster, brief rules and waves for phases 002, 004 and 003
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
