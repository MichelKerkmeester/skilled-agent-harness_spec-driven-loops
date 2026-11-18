---
title: "Phase Parent: pi-context-decisions Research for Skill Advisor Refinement"
description: "Phased packet that mines the pi-context-decisions Pi extension, a decision-model skill picker with additive per-branch advertising and optional tool filtering, for ideas that could improve system-skill-advisor and its hooks. Phase 1 ran a 5-iteration deep research. Phases 2 to 4 implement the three recommendations the operator adopted: pasted-context stripping, a follow-up routing benchmark with a floor counter and a crash-path fallback with a threshold doc line. Phases 6 to 13 close every item the 2 to 4 build left open, including stored route receipts."
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
    last_updated_at: "2026-11-18T16:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Added phases 006 to 013 to close the open items from the 002, 004 and 003 build"
    next_safe_action: "Build phase 006 by writing its failing strip-rule tests"
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
      - "Build location, by the operator 2026-11-18: git worktree 474, branch worktrees/474-advisor-pasted-context-and-crash-fallback. Commits on that branch are approved."
      - "Open-item closure, by the operator 2026-11-18: 'Fix all open work leave nothing open or untested'. Every open item becomes a new phase child 006 or later under this packet."
      - "Stored route receipts, by the operator 2026-11-18: research first, then build. N4 leaves the cut list and becomes phases 010 and 011."
      - "Finish, by the operator 2026-11-18: merge the worktree branch into main through sk-git, rebuild the advisor runtime on main, restart its daemon, rerun the goal criteria on main, then push origin/main."
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
| **Status** | In Progress. Phases 001 to 005 are complete and committed in worktree 474; phase 003 closed with the guard not built (over-suppresses). Phases 006 to 013 close the open items that build left |
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
- Closure phases 006 to 013 for every item the 002 to 004 build left open, by operator directive.

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
| N4 stored route receipts | Adopted 2026-11-18 | Phase 003 closed on the over-suppresses branch, and the operator chose research then build: phases 010 and 011 |
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
| 2 | 002-pasted-context-stripping/ | N3: strip a leading pasted reply before scoring, in the recommend handler and at the entry of `scoreAdvisorPrompt`, so every runtime and every corpus runner gets it. One new corpus row | Complete |
| 3 | 003-follow-up-routing-benchmark/ | R3 and R5: count floored top-1 passes and score follow-up pairs in the calibration bench. The guard and the `confidenceFloored` pass-through ship only if a rule fixed in advance says so | Complete |
| 4 | 004-crash-path-fallback/ | R2 shrunk and N1: return the outage fallback from the shared hook's unhandled catch, plus one doc line on when the confidence threshold is read | Complete |
| 5 | 005-plan-validation-research/ | 3-iteration deep research on Opus 5.5 high through the second Claude account, checking phases 002 to 004 before they are built: all three stay, with plan changes C1 to C15 and the order 002, 004, 003 | Complete |
| 6 | 006-strip-rule-boundary-edges/ | Strip-rule boundary edges: a `>`-quoted requirement stays, a task marker inside the pasted reply no longer cuts early, and `Assistant response:` style headers count as cues. Red-first tests, 0 changes on the routing corpus | Planned |
| 7 | 007-python-scorer-strip-parity/ | The Python local scorer strips the same pasted reply, read from one shared case fixture, and the `rr-paste-208` local-native divergence resolves | Planned |
| 8 | 008-handler-scored-prompt-consumers/ | Compiled routes and typed commands read the stripped prompt on the cache-hit and cache-miss paths, so a command in a pasted reply never attaches to the task | Planned |
| 9 | 009-crash-fallback-edge-cases/ | Crash-fallback edges in the shared hook: setup wording, skipped prompts, directive dedup, policy observation context and the clock call inside the guard; plus the false `confidenceOnly` clause in `ENV-REFERENCE.md` | Planned |
| 10 | 010-route-receipts-research/ | Stored route receipts research: rerun the follow-up bench on the final strip rule, then design the receipt store, expiry and runtime reach for Claude, Pi, DSH and Vibe | Planned |
| 11 | 011-route-receipts-build/ | Stored route receipts build, to the design phase 010 fixes, measured on the nine follow-up pairs in the calibration bench | Planned |
| 12 | 012-plan-text-and-goal-closeout/ | Packet closeout: plan-text fixes in 002, 003 and 004, the delegation-strategy socket caveat, child goal ticks, the operator answers in a decision record and the parent goal criteria | Planned |
| 13 | 013-drift-guard-probe-script-errors/ | Drift-guard errors: give the ten old probe scripts under the routing-and-scoring 008 review folders the shebang, strict mode or module header the alignment-drift guard requires | Planned |

**Build order.** Folder numbers stay as they are. The build order is 001, then 005, then 002, then 004, then 003. Phase 004 builds before 003 because both edit `hooks/claude/user-prompt-submit.ts` and its hook test, and 003's guard would shift every line 004 pins.

The closure phases build after 003 in the order 006, 007, 008, 009, 010, 011, 013, 012. Phase 006 comes first because every later phase consumes the strip rule. Phase 011 builds after 009 because both edit the shared hook. Phase 012 is the last phase because it ticks the goals of every other phase.

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
| 003-follow-up-routing-benchmark | 006-strip-rule-boundary-edges | The 003 decision rule is recorded and phases 002 to 005 validate strict | `003-follow-up-routing-benchmark/implementation-summary.md` names the decision rule outcome |
| 006-strip-rule-boundary-edges | 007-python-scorer-strip-parity | The new strip-rule tests pass and the routing corpus shows 0 changes | `006-strip-rule-boundary-edges/tasks.md` has no open task, and its strict validation prints `RESULT: PASSED` |
| 007-python-scorer-strip-parity | 008-handler-scored-prompt-consumers | The TypeScript and Python strip tests read one fixture and both pass, and the `rr-paste-208` divergence is gone | `007-python-scorer-strip-parity/tasks.md` has no open task, and its strict validation prints `RESULT: PASSED` |
| 008-handler-scored-prompt-consumers | 009-crash-fallback-edge-cases | A pasted command never attaches to the task on either cache path | `008-handler-scored-prompt-consumers/tasks.md` has no open task, and its strict validation prints `RESULT: PASSED` |
| 009-crash-fallback-edge-cases | 010-route-receipts-research | Each crash edge has a test that failed before its fix, and the hook suite is green | `009-crash-fallback-edge-cases/tasks.md` has no open task, and its strict validation prints `RESULT: PASSED` |
| 010-route-receipts-research | 011-route-receipts-build | `research/research.md` fixes the receipt design, and the follow-up bench rerun on the final strip rule still takes the over-suppresses branch, or the operator has decided after being told it does not | `010-route-receipts-research/research/research.md` and its strict validation |
| 011-route-receipts-build | 013-drift-guard-probe-script-errors | The receipt build passes its bench and hook tests | `011-route-receipts-build/tasks.md` has no open task, and its strict validation prints `RESULT: PASSED` |
| 013-drift-guard-probe-script-errors | 012-plan-text-and-goal-closeout | `run-all-drift-guards.sh` exits 0 | `013-drift-guard-probe-script-errors/tasks.md` has no open task, and its strict validation prints `RESULT: PASSED` |
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
