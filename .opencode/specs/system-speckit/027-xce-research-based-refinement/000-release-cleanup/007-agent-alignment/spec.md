---
title: "Feature Specification: Agent Alignment"
description: "Reconcile .opencode, .claude, and .codex agent mirror parity with the agent-io contract and verification-discipline doctrine."
trigger_phrases:
  - "agent alignment"
  - "027 release cleanup 007-agent-alignment"
  - "shipped 027 alignment"
importance_tier: "important"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-xce-research-based-refinement/000-release-cleanup/007-agent-alignment"
    last_updated_at: "2026-06-10T15:30:42Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Aligned agent runtime mirrors to shipped agent-io and verification doctrine"
    next_safe_action: "No further action for this phase; restart runtimes to load changed agent definitions"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-10-007-agent-alignment-planned"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Operator approved Planned release-cleanup scaffolds."
---
# Feature Specification: Agent Alignment

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-10 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Completion** | 100% |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Reconcile .opencode, .claude, and .codex agent mirror parity with the agent-io contract and verification-discipline doctrine.

### Purpose
Inventory the owned surface, align its current-state claims to shipped reality, and verify that the resulting surface is coherent with the agent I/O contract, peck verification discipline, runtime mirror parity, and hygiene constraints.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Inventory current claims on .opencode/agents/**, .claude/agents/**, .codex/agents/**.
- Align agent I/O contract doctrine where each agent owns it.
- Align peck verification discipline where each agent owns it.
- Preserve runtime wrappers, routing, permissions, and identities.
- Verify three-mirror parity and stale-doctrine cleanup.

### Out of Scope
- Source-code, command, skill, or YAML edits.
- Routing, permission, model, or identity changes in agent wrappers.
- New agent behaviors beyond shipped doctrine.
- Git commit creation.

### Files to Change
Implemented documentation scope.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/agents/*.md | Modified | Canonical doctrine cleanup and mirror source bodies |
| .claude/agents/*.md | Modified | Runtime mirror bodies synchronized from canonical doctrine |
| .codex/agents/*.toml | Modified | Runtime mirror bodies synchronized from canonical doctrine; TOML wrappers preserved |
| implementation-summary.md | Modified | Completion evidence and verification results |
| tasks.md | Modified | Task completion and evidence |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| R1 | Inventory before alignment | Existing outward claims are compared across .opencode, .claude, and .codex mirrors before edits |
| R2 | Preserve approved scope | Only agent mirror files and this phase's spec docs are modified |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| R3 | Align shipped doctrine | Agent I/O and peck verification doctrine are present only where each agent owns it |
| R4 | Verify current-state coherence | Parity checks, stale-doctrine grep, TOML parsing, and strict validation pass |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- The phase has a clear inventory -> align -> verify record.
- Completion is 100% with verification evidence in implementation-summary.md.
- The surface does not change routing, permissions, identities, commands, skills, or source code.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Shipped 027 source of truth | Inaccurate outward docs if the current reality is misread | Inventory before alignment and cite verified checks |
| Risk | Scope collision with 027/011 | Command structural work could be duplicated | Keep this phase content-only and defer structural split to 027/011 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None for scaffold. Implementation may discover surface-specific conflicts.
<!-- /ANCHOR:questions -->
