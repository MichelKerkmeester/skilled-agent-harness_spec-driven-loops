---
title: "Feature Specification: Phase 4: docs-agents-governance-removal"
description: "cli-devin/devin appeared in agent rosters (deep-context/research/review/improvement across 3 runtimes), governance docs (AGENTS.md, CLAUDE.m"
trigger_phrases:
  - "cli-devin deprecation phase 4"
  - "docs-agents-governance-removal"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/022-cli-devin-deprecation/004-docs-agents-governance-removal"
    last_updated_at: "2026-06-08T17:34:13.174Z"
    last_updated_by: "deprecation-host"
    recent_action: "Phase 4 complete: docs-agents-governance-removal executed and verified"
    next_safe_action: "Proceed to phase 5"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "ctx-142-cli-devin-20260608151217"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 4: docs-agents-governance-removal

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-08 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 6 |
| **Predecessor** | 003-registry-graph-and-skill-advisor-removal |
| **Successor** | 005-historical-record-reference-sweep |
| **Handoff Criteria** | grep of active agent/governance/cross-skill docs = 0 cli-devin |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the cli-devin deprecation specification. The verified, line-resolved edit list lives in ../context/context-report.md §2.

**Scope Boundary**: Agent rosters (3 runtimes): deep-context/research/review/improvement

**Dependencies**:
- Predecessor phase 003-registry-graph-and-skill-advisor-removal complete

**Deliverables**:
- Agent rosters (3 runtimes): deep-context/research/review/improvement
- Governance: AGENTS.md, CLAUDE.md, README.md, skills/README.md
- cli-* sibling skills + sk-prompt + deep-context refs + scripts README
- Constitutional: cli-dispatch-skill-preload, post-implementation-deep-review (executor-agnostic), shared_smart_router, memory_handback

**Changelog**:
- Phase work recorded in implementation-summary.md.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
cli-devin/devin appeared in agent rosters (deep-context/research/review/improvement across 3 runtimes), governance docs (AGENTS.md, CLAUDE.md, README.md, skills index), cli-* sibling skill docs, deep-context skill refs, constitutional docs (cli-dispatch-skill-preload, post-implementation-deep-review), and shared cli references.

### Purpose
Remove cli-devin/devin from all agent, governance, cross-skill, and constitutional documentation, and make the post-implementation-deep-review rule executor-agnostic (D4).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Agent rosters (3 runtimes): deep-context/research/review/improvement
- Governance: AGENTS.md, CLAUDE.md, README.md, skills/README.md
- cli-* sibling skills + sk-prompt + deep-context refs + scripts README
- Constitutional: cli-dispatch-skill-preload, post-implementation-deep-review (executor-agnostic), shared_smart_router, memory_handback

### Out of Scope
- Historical spec/changelog/benchmark records (phase 005)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `{.opencode,.claude,.codex}/agents/deep-*` | Modify | Removed cli-devin sibling/SWE-1.6 sections + Lane B devin |
| `AGENTS.md + CLAUDE.md + README.md + skills/README.md` | Modify | Removed cli-devin from dispatch rules + skill index |
| `constitutional/post-implementation-deep-review.md` | Modify | Made executor-agnostic (D4) |
| `cli-*/SKILL.md + README + graph-metadata` | Modify | Removed cli-devin sibling refs |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No cli-devin/devin in active agent or governance docs | grep 0 |
| REQ-002 | post-implementation-deep-review is executor-agnostic | no cli-devin SWE-1.6 prescription |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Agent mirror parity preserved | 3-runtime bodies consistent |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: grep of active agent/governance/cross-skill docs = 0 cli-devin
- **SC-002**: deep-review constitutional rule names no specific executor
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Predecessor phase 003-registry-graph-and-skill-advisor-removal | Blocks start | Completed before this phase |
| Risk | Dangling reference after edits | Med | Global grep verification + deep review |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None — phase complete and verified.
<!-- /ANCHOR:questions -->
