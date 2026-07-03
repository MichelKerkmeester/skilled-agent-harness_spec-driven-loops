---
title: "Feature Specification: Phase 2 — architecture decision"
description: "Capture the operator-approved sk-code parent architecture (5 phase-modes over one shared surface router, sk-code-review folded as code-review) as the binding decision record that governs the build."
trigger_phrases:
  - "sk-code architecture decision phase"
  - "sk-code 5-mode decision"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/124-sk-code-parent/002-architecture-decision"
    last_updated_at: "2026-07-03T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Captured the approved architecture in decision-record.md"
    next_safe_action: "Resolve build isolation, then run 003 scaffold-hub"
    blockers: []
    key_files:
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 2 — architecture decision

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-03 |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 9 |
| **Predecessor** | ../001-research-and-context/ |
| **Successor** | ../003-scaffold-hub/ (planned) |
| **Handoff Criteria** | `decision-record.md` accepted by the operator; build sequence 003–009 defined |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** — the architecture gate. Its sole deliverable is `decision-record.md`, which binds the taxonomy, structure, fold-in, advisor plan, and the regression-first build sequence, on the evidence produced in phase 001. The operator accepted the recommended design ("Go with recommended", 2026-07-03), so this phase records rather than deliberates.

**Scope Boundary:** capture the decision only. No skill, advisor, command, or agent files are touched in this phase.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 001 produced a decision-ready recommendation but nothing binds it; the build phases need a single authoritative contract for the taxonomy, structure, fold-in, and cutover.

### Purpose
Record the operator-approved architecture (5 phase-modes over a shared surface router; `sk-code-review` → `code-review`; one hub identity; regression-first migration) as the governing decision for phases 003–009.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Author `decision-record.md` binding the taxonomy, structure, fold-in, advisor plan, and build sequence.

### Out of Scope
- Any build, scaffold, move, or advisor edit (phases 003+).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `decision-record.md` | Create | The binding architecture decision |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- **Build isolation** — the main checkout is shared with an active concurrent session (028, which touches the advisor). Resolve worktree-vs-in-place before phase 003 shared-file edits. (Operational, not architectural.)
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Decision:** `decision-record.md`
- **Evidence:** `../001-research-and-context/research/research.md`, `../001-research-and-context/context/context-map.md`
- **Pattern:** `.opencode/skills/sk-doc/references/skill_creation/parent_skills_nested_packets.md`
