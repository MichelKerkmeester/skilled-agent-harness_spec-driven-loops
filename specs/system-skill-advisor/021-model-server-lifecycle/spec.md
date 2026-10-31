---
title: "Feature Specification: Model server lifecycle: default spawn and daemon memory"
description: "Sets the model server's default spawn behavior and reduces persistent advisor daemon memory."
trigger_phrases:
  - "model server default spawn"
  - "hf model server idle timeout"
  - "advisor daemon memory footprint"
  - "orphaned model server reap"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/021-model-server-lifecycle"
    last_updated_at: "2026-10-31T13:30:53Z"
    last_updated_by: "template-author"
    recent_action: "Initialize phase-parent continuity block"
    next_safe_action: "Plan or resume a child phase folder"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-021-model-server-lifecycle"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->
# Feature Specification: Model server lifecycle: default spawn and daemon memory

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-04 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | 021-model-server-lifecycle |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Each child validates on its own; the parent tracks them |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
After the memory decommission, the default advisor setup no longer started the shared HF model server, leaving the local Hugging Face fallback without its server. Separate resident processes also kept memory in use, and a model server could outlive a dead launcher.

### Purpose
These children set the model server's default spawn and idle behavior, measure the advisor launcher's footprint and handle orphaned model servers. They also record the decision to keep the launcher separate from the advisor server.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `001-model-server-default-spawn/` arms shared model-server spawning by default and aligns its socket and supervision paths.
- `002-advisor-daemon-memory/` tracks idle model-server shutdown, measures launcher memory, records the no-go on combining its process with the advisor server and handles orphaned servers.

### Out of Scope
- Changing the advisor's existing idle self-exit or the memory costs of Code Mode MCP and git-live-follow.
- Changing host Ollama settings or installing the model-server dependency in the main checkout.

### Files to Change
The rows below identify each child packet and the change it covers.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `001-model-server-default-spawn/` | Phase | 001-model-server-default-spawn | Set the model-server spawn default and shared socket directory |
| `002-advisor-daemon-memory/` | Phase | 002-advisor-daemon-memory | Reduce resident memory and handle orphaned model servers |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-model-server-default-spawn/` | Default model-server spawn and shared socket directory | Complete |
| 2 | `002-advisor-daemon-memory/` | Cut resident memory with idle timeout and orphan cleanup | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume` with a child folder path to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-model-server-default-spawn | 002-advisor-daemon-memory | 001-model-server-default-spawn validates on its own | validate.sh --strict on 001-model-server-default-spawn |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See the child folders for per-phase spec.md, plan.md and tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- The phase parent tracks child phase folders for model server lifecycle: default spawn and daemon memory.
<!-- /ANCHOR:requirements -->
