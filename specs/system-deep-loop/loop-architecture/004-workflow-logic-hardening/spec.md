---
title: "Feature Specification: Deep-research and deep-review workflow logic hardening"
description: "Phase parent for fixing every workflow logic, drift and documentation finding from the 2026-11-14 analysis of the deep-research and deep-review commands and skill."
trigger_phrases:
  - "workflow logic hardening phase parent spec"
  - "deep loop workflow logic hardening"
  - "deep research review drift fix"
  - "deterministic stop decision program"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/004-workflow-logic-hardening"
    last_updated_at: "2026-11-14T12:00:00Z"
    last_updated_by: "claude-fable-5-2"
    recent_action: "Authored the phase parent spec and six child phase packets, spec docs only"
    next_safe_action: "Review the child specs, then plan or implement 001-deterministic-stop-decision"
    blockers: []
    key_files:
      - ".skilled/commands/deep/research.md"
      - ".skilled/commands/deep/review.md"
      - ".skilled/commands/deep/assets/deep-research-auto.yaml"
      - ".skilled/commands/deep/assets/deep-review-auto.yaml"
      - ".skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-11-14-workflow-logic-hardening-authoring"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
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

# Feature Specification: Deep-research and deep-review workflow logic hardening

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-14 |
| **Branch** | `main` |
| **Parent Spec** | None. This is a top-level packet in the `loop-architecture` sub-track. |
| **Parent Packet** | system-deep-loop/loop-architecture/004-workflow-logic-hardening |
| **Predecessor** | 003-deprecate-improvement-modes |
| **Successor** | None |
| **Handoff Criteria** | Every child phase is closeable by its own `acceptance-criteria.md` and `validate.sh --recursive --strict` prints `RESULT: PASSED` for this folder. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
An operator who runs `/deep:research` or `/deep:review` cannot trust why a run stopped or whether two runs of the same state would stop at the same point. The stop decision is arithmetic the orchestrating model performs from prose. The counters that decision reads live only in the model's memory, and a failed iteration counts as evidence that the work converged. Several documented paths do not work as written: research restart is unreachable, the packet lock can expire in the middle of a long iteration and the configured duration cap is never read. Each command also keeps two hand-maintained workflow files that have drifted apart, and the command and skill docs state facts the code contradicts.

### Purpose
Make every deep-research and deep-review run stop for a reason a script computed from files, behave the same in auto and confirm mode, and be described by docs that match the code.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

Every finding from the 2026-11-14 analysis is in scope. Each has an id that the child requirements cite, and each belongs to exactly one phase.

| ID | Finding | Phase |
|----|---------|-------|
| F01 | The convergence vote is computed by the orchestrating model from prose | 001 |
| F02 | The research quality guard is a function name with no body | 001 |
| F05 | The review vote ignores the configured convergence threshold | 001 |
| F08 | Review cannot stop when the graph decision is missing | 001 |
| F11 | Three different stop-reason vocabularies | 001 |
| F22 | Unverified: a failed claim adjudication may skip the review max-iteration cap | 001 |
| F03 | Loop counters live only in orchestrator memory and are unbound on resume | 002 |
| F04 | Failed iterations count as evidence of convergence | 002 |
| F07 | Three rules disagree on what repeated failures do | 002 |
| F12 | The dashboard has two writers, the reducer and the model | 002 |
| F06 | Research restart is unreachable and loses its lineage values | 003 |
| F09 | The lock can expire mid-iteration and is not released on every halt | 003 |
| F10 | `maxDurationMinutes` is written to config and never enforced | 003 |
| F14 | Auto and confirm workflows are hand-maintained twins that have drifted | 004 |
| F15 | Dry run is half wired across the two commands and modes | 004 |
| F16 | Each workflow file is 148 to 182 KB and loaded whole | 004 |
| F13 | The tool-call budget differs between workflow and skill | 005 |
| F17 | The autonomous directive in both command docs contradicts its own file | 005 |
| F18 | The mode skills state stale facts: executor count, reducer path, workflow file names | 005 |
| F19 | Research skill rules conflict with each other | 005 |
| F20 | Flag lists disagree inside each command doc | 005 |
| F21 | The two command docs have diverged in structure | 005 |

Drift is fixed twice over: the drifted content is reconciled, and a guard test fails when it returns. Phase 004 owns the workflow guard and phase 005 owns the doc guard.

### Out of Scope

- Fixing the `deep-ai-council` workflow logic. The analysis did not cover it. Phase 006 retires the mode instead, on the operator's decision of 2026-11-14, and does not change how a council deliberates.
- The 650-line per-executor dispatch branches beyond making them exist once per command in phase 004. Their behavior was not analyzed.
- New loop features. Wave orchestration and checkpoint commits stay reference-only.
- Changes to `runtime/` beyond the scripts each child names. The runtime stays free of MCP tools.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs` | Modify | 001, 002 | Owns the whole stop decision and the counters it reads |
| `.skilled/commands/deep/assets/deep-research-{auto,confirm}.yaml` | Modify | 001, 002, 003 | Decision, tracking, failure, lifecycle and lock steps |
| `.skilled/commands/deep/assets/deep-review-{auto,confirm}.yaml` | Modify | 001, 002, 003 | Decision, tracking, failure and lock steps |
| `.skilled/skills/system-deep-loop/runtime/scripts/loop-lock.cjs` | Modify | 003 | Lock validity for the whole dispatch |
| `.skilled/commands/deep/assets/` workflow files | Replace | 004 | One authored workflow file per command |
| `.skilled/skills/system-deep-loop/runtime/tests/` | Create | 001 to 005 | Tests for each fix and both drift guards |
| `.skilled/commands/deep/research.md`, `review.md` and both presentation files | Modify | 003, 004, 005 | Flags, directive and structure |
| `.skilled/skills/system-deep-loop/deep-research/`, `deep-review/` docs | Modify | 005 | Skill, references, catalogs and playbooks |

Per-phase detail lives in each child's `plan.md`. Where a child's own file list differs from this table, the child is right.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-deterministic-stop-decision/ | A runtime script computes the whole stop decision, with one stop-reason list, the configured review threshold and one rule for a missing graph decision | Complete |
| 2 | 002-persisted-loop-state-and-failure-policy/ | Counters come from the state log, failed iterations stay out of the vote, one failure rule holds and the reducer alone writes the dashboard | Complete |
| 3 | 003-lifecycle-lock-and-limits/ | Research restart works like review restart, the lock outlives the longest dispatch and is released on every halt, and the duration cap is enforced | Complete |
| 4 | 004-workflow-single-source-and-drift-guard/ | One workflow file per command serves both modes, dry run works everywhere, the files shrink and a guard test stops the drift from returning | Complete |
| 5 | 005-command-and-skill-doc-alignment/ | Command docs, skills and references match the code and each other, and a doc guard keeps them that way | Complete |
| 6 | 006-ai-council-mode-deprecation/ | `ai-council` stops being a deep-loop mode and lives on as a standalone agent in every runtime, so the hub routes two modes | Complete |
| 7 | 007-open-findings-follow-up/ | The six findings phase 006 left open are fixed: two advisor routes, a stale coverage sentence, the cli-opencode skill on OpenCode 2.3.0, a stdin crash in four runtime scripts and a build that left the spec-kit dist stale | Complete |

The phases run in this order. Phases 001 to 003 move logic out of the workflow files and into scripts, so each of them edits four workflow files. That cost is accepted, because phase 004 then merges files that are already smaller and already correct. Running phase 004 first would mean merging the defective logic and fixing it afterwards in a file nobody has run yet.

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-deterministic-stop-decision | 002-persisted-loop-state-and-failure-policy | The stop decision is one script call in all four workflow files and its JSON output names the decision, the reason and the inputs it read | Every row of `001-deterministic-stop-decision/acceptance-criteria.md` is `Met` |
| 002-persisted-loop-state-and-failure-policy | 003-lifecycle-lock-and-limits | No counter the decision reads is held in orchestrator memory, and the failure rule is stated once | Every row of `002-persisted-loop-state-and-failure-policy/acceptance-criteria.md` is `Met` |
| 003-lifecycle-lock-and-limits | 004-workflow-single-source-and-drift-guard | Restart, lock and duration behavior is the same in all four workflow files | Every row of `003-lifecycle-lock-and-limits/acceptance-criteria.md` is `Met` |
| 004-workflow-single-source-and-drift-guard | 005-command-and-skill-doc-alignment | Each command has one workflow file and the workflow drift guard passes | Every row of `004-workflow-single-source-and-drift-guard/acceptance-criteria.md` is `Met` |
| 005-command-and-skill-doc-alignment | 006-ai-council-mode-deprecation | The research and review docs match the code and the doc drift guard passes, so the council removal edits settled files | Every row of `005-command-and-skill-doc-alignment/acceptance-criteria.md` is `Met` |
| 006-ai-council-mode-deprecation | 007-open-findings-follow-up | The council lives on as a command and agent, so the advisor has a council command row to rank | `007-open-findings-follow-up/tasks.md` T001 to T013 are `[x]` with evidence |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- F04, F06, F08 and F09 were found by reading the workflow steps, not by running a loop. Each owning phase reproduces its finding in a test before it changes anything. A finding that does not reproduce is recorded in that phase with the evidence and closed without a code change.
- F22 was noticed during the analysis and never checked. Phase 001 verifies it first.
- The confirm workflows and the per-executor dispatch branches were not read at step level. Phase 004 may surface further drift when it merges them, and it records what it finds in its own `goal.md`.
- Authoring the children narrowed seven findings. F03, F04, F06, F09, F14, F18 and F22 each hold in a narrower or wider form than the table above states, and the owning child's `spec.md` gives the corrected statement. Where a child and this table disagree, the child is right.

### Answered by the operator on 2026-11-14

- **Duration stop reason.** Phase 001 adds a new member, `maxDurationReached`, when it fixes the single stop-reason list. Phase 003 uses it.
- **Docs outside the two mode packets.** Phase 005 owns `convergence.md` sections 2 and 3, the agent definitions, the `sk-doc` and `sk-code` checklists and the speckit README. A file that a phase 004 test reads is the exception, and phase 004 updates it.
- **Council mode.** The operator's words: "let's deprecate deep-ai-council completely as a deep mode and instead make it a isolated .agents file maybe with a command workflow and presentation asset for all runtimes". Phase 006 specifies it.
- **Confirm gate after three failures.** Confirm mode asks Retry, Skip or Cancel before synthesis. Auto mode halts to synthesis with no question. Phase 002 specifies it.
- **Tool-call budget.** The prompt values that run today stay: 24 for research, and target 9, soft max 12 and hard max 13 for review. Phase 005 corrects the skills to point at them.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md and acceptance-criteria.md
- **Analysed surfaces**: `.skilled/commands/deep/research.md`, `.skilled/commands/deep/review.md`, `.skilled/commands/deep/assets/` and `.skilled/skills/system-deep-loop/`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
