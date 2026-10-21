---
title: "Feature Specification: Advisor daemon memory footprint"
description: "Each active checkout keeps a skill-advisor launcher, an advisor server and, when embeddings run locally, a model server that never unloads. Two phases cut that footprint: a default idle timeout for the model server and one process instead of two for the advisor."
trigger_phrases:
  - "advisor daemon memory phase parent spec"
  - "advisor daemon memory"
  - "model server idle default"
  - "advisor launcher memory"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/037-advisor-daemon-memory"
    last_updated_at: "2026-10-21T10:30:00Z"
    last_updated_by: "template-author"
    recent_action: "Initialize phase-parent continuity block"
    next_safe_action: "Plan or resume a child phase folder"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.2 -->

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

# Feature Specification: Advisor daemon memory footprint

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-10-21 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | system-skill-advisor/037-advisor-daemon-memory |
| **Predecessor** | 036-routing-and-launcher-hardening |
| **Successor** | None |
| **Handoff Criteria** | Both children are Complete or closed by a recorded no-go, and recursive strict validation prints `RESULT: PASSED`. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
On 2026-10-21 three advisor daemons ran at once, one each for main and worktrees 182 and 185. Each was a launcher of about 53 MB and an advisor server of 62 to 100 MB, about 400 MB together. A bare Node process measures 47 MB, so most of the launcher's footprint is the runtime, not its logic. Ollama is now off on this machine, so `EMBEDDINGS_PROVIDER=auto` falls back to the local Hugging Face model server. That server stayed loaded for good, because `SPECKIT_HF_MODEL_SERVER_IDLE_TIMEOUT_MIN` defaulted to `0` until phase 1 set it to 10 minutes.

### Purpose
An idle checkout costs as little memory as the advisor can safely allow, without slowing the first answer after a quiet spell more than a cold start already does.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A non-zero default idle timeout for the resident model server, with `0` kept as the opt-out.
- Measuring the launcher, then either moving its job into the advisor server so one process remains, or recording a no-go.

### Out of Scope
- The advisor idle self-exit, which already defaults to 30 minutes.
- Code Mode MCP and git-live-follow, which each cost under 20 MB.
- Ollama, which the operator turned off outside the repository.

### Files to Change
The files each phase expects to touch. Each child's plan owns the detailed list.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.skilled/bin/lib/model-server-supervision.cjs` | Modify | 001-hf-model-server-idle-default | New default idle timeout |
| `.skilled/bin/system-skill-advisor-launcher.cjs` | Modify | 002-lighter-advisor-launcher | Lease and supervision handoff, if the measurement says go |
| `.skilled/skills/system-skill-advisor/runtime/` server entry | Modify | 002-lighter-advisor-launcher | Takes over the lease heartbeat, if go |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-hf-model-server-idle-default/ | Give the resident model server a default idle timeout so it unloads when nothing embeds | Complete |
| 2 | 002-lighter-advisor-launcher/ | Measure the launcher, then fold its job into the advisor server or record a no-go | Complete (no-go) |
| 3 | 003-reap-orphaned-model-server/ | Reap a model server whose launcher died when the next supervisor starts | Pending |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-hf-model-server-idle-default | 002-lighter-advisor-launcher | phase 001 is Complete with the new default shipped and its tests green | `validate.sh 001-hf-model-server-idle-default --strict` RESULT: PASSED |
| 002-lighter-advisor-launcher | 003-reap-orphaned-model-server | phase 002 recorded the orphan leak and named the startup reap | `validate.sh 002-lighter-advisor-launcher --strict` RESULT: PASSED |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Is 15 minutes the right default, or should it match the advisor's 30? Phase 001 measures the cold-start cost and decides.
- Can the advisor server own the lease heartbeat safely? Phase 002 answers this before any code changes.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
