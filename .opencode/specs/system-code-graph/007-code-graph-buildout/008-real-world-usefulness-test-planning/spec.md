---
title: "Feature Specification: Real-World Usefulness Test"
description: "Phase parent for the code-graph real-world usefulness campaign: the test methodology, the trial executions and reruns, and the bug-surface research and remediation it drove."
trigger_phrases:
  - "real world usefulness test phase parent"
  - "code graph usefulness campaign"
  - "usefulness test methodology trials"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/007-code-graph-buildout/008-real-world-usefulness-test-planning"
    last_updated_at: "2026-06-08T13:25:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Restructured to phase parent; methodology docs moved to phase 001"
    next_safe_action: "Resume any trial, research, or remediation phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000008"
      session_id: "026-004-008-real-world-usefulness-test-planning-parent"
      parent_session_id: null
    completion_pct: 70
    open_questions: []
    answered_questions:
      - "Execution order: methodology (001) then trials, reruns, research, and remediation phases"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: Real-World Usefulness Test

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-05-30 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | system-spec-kit/026-graph-and-context-optimization/004-code-graph |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | The methodology defines the trials; the trials and reruns run; the bug-surface research and remediation close the issues they find |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Earlier code-graph phases shipped capability and resilience for the tooling, hooks, and runtime integration surfaces. That proves the systems can exist, but not that they help an engineer move faster or decide better during normal coding work. The missing evidence is a real-world usefulness campaign with controls, repeated trials, and runtime-specific observations.

### Purpose
Define the scenario battery, CLI matrix, measurement framework, and execution plan for a campaign that answers whether these systems reduce engineering friction or add overhead, then run the trials and close the bugs they surface. The methodology and each execution live in the child phases.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All methodology, trials, research, and remediation live in the child phase folders.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Root purpose and the child-phase manifest for the usefulness campaign.
- Per-phase methodology, trial execution, research, and remediation (in the child folders).

### Out of Scope
- The broader code-graph program work tracked by the parent packet.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-usefulness-test-methodology/ | The scenario battery, CLI matrix, measurement framework, and execution plan | Complete |
| 2 | 002-sandbox-usefulness-trials/ | Execute the usefulness trials in a sandbox | Complete |
| 3 | 003-native-deferred-trial-rerun/ | Native rerun of the deferred trial cells | Complete |
| 4 | 004-code-graph-bug-surface-research/ | Deep research on the issues the trials surfaced | Complete |
| 5 | 005-fix-zero-node-and-parser-issues/ | Remediate the zero-node and parser bugs | Complete |
| 6 | 006-scope-change-scan-guard/ | Add the scope-change scan guard | Complete |
| 7 | 007-readiness-hooks-advisor-polish/ | Polish the code-graph, advisor, and hooks readiness surfaces | Complete |
| 8 | 008-tree-sitter-parser-crash-resilience/ | Harden tree-sitter parser crash resilience | In Progress |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins.
- Parent spec tracks aggregate progress via this map.
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-usefulness-test-methodology | 002-sandbox-usefulness-trials | Scenario battery and measurement framework defined | methodology docs complete |
| 004-code-graph-bug-surface-research | 005-fix-zero-node-and-parser-issues | Surfaced bugs root-caused | research findings recorded |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Should the parser-resilience hardening (008) gate the campaign's done state, or ship as a follow-on once the trials conclude?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md.
- **Parent Spec**: See `../spec.md` (004-code-graph).
- **Graph Metadata**: See `graph-metadata.json` for the `derived.last_active_child_id` pointer.
