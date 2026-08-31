---
title: "Feature Specification: Orchestrator Inline Authority"
description: "The orchestrator could not write, so a one-line fix cost a fresh agent reloading context it already held; and a leaf agent refused the operator who invoked it, inverting the repository precedence."
trigger_phrases:
  - "feature"
  - "specification"
  - "name"
  - "template"
  - "spec core"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Orchestrator Inline Authority

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | [P0/P1/P2] |
| **Status** | Complete |
| **Created** | 2026-08-31 |
| **Branch** | `scaffold/008-orchestrator-inline-authority` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The orchestrator held no write capability in any of its four runtime dialects, and its prose forbade direct execution outright. Every change therefore required a dispatch, including a typo. A fresh agent must reload the context the orchestrator already holds, so the cheapest possible fix carried the most expensive possible delivery — which the delegation rule already names as a restraint failure, in the same document that governs the orchestrator.

Separately, the code agent refused any dispatch lacking an orchestrator marker, including one from the operator. The repository's precedence puts an explicit operator instruction above a rule file, and an agent convention sits below both, so a convention was outranking the person it serves.

Two smaller defects rode along: the dispatch protocol named a subagent type this runtime does not register, and the nesting examples referenced an agent absent from the roster.

### Purpose

Let the orchestrator do work whose delegation would cost more than the work, without letting it become the implementer; and let a direct operator invocation satisfy a gate built to catch a different failure.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Grant the orchestrator write capability in all four authored dialects, bounded in prose to small fixes judged by cost
- Let a direct operator invocation satisfy the code agent's caller gate
- Correct the obsolete subagent type and the phantom agent name in the nesting examples

### Out of Scope
- Nothing further; the phantom agent name in the prompt-improver definition was brought into scope by the operator and fixed
- Any change to what the orchestrator delegates for genuine implementation work
- The roster mirror checker's presence-only semantics, which is a separate finding

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.claude/agents/orchestrate.md` | Modify | Tool grant, prose bound, subagent type, agent name |
| `.opencode/agents/orchestrate.md` | Modify | Permission block, same prose and name fixes |
| `.codex/agents/orchestrate.toml` | Modify | Sandbox mode, same prose and name fixes |
| `.pi/agents/orchestrate.md` | Modify | Tool list, same prose and name fixes |
| `.claude/.opencode/.codex/.pi` code agent copies | Modify | Caller gate accepts a direct operator invocation |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | [Requirement description] |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-002 | [Requirement description] |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: [Primary measurable outcome]
- **SC-002**: [Secondary measurable outcome]
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The orchestrator becomes author and reviewer of its own work | High | The grant is bounded in prose to small fixes judged by cost; work with design content, breadth, or its own verification burden stays delegated |
| Risk | An edit reaches one runtime and not the others | High | Four independently-authored copies were edited together and verified by symmetry, because the roster checker validates presence only and would stay green on drift |
| Risk | Loosening the caller gate hides a missing brief | Med | A direct invocation must state the packet and frozen scope in its return, so the absent brief is visible rather than assumed |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: [Response time target - e.g., <200ms p95]
- **NFR-P02**: [Throughput target - e.g., 100 req/sec]

### Security
- **NFR-S01**: [Auth requirement - e.g., JWT tokens required]
- **NFR-S02**: [Data protection - e.g., TLS + encrypted at rest]

### Reliability
- **NFR-R01**: [Uptime target - e.g., 99.9%]
- **NFR-R02**: [Error rate - e.g., <1%]
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: [How system handles]
- Maximum length: [Limit and behavior]
- Invalid format: [Validation response]

### Error Scenarios
- External service failure: [Fallback behavior]
- Network timeout: [Retry strategy]
- Concurrent access: [Conflict resolution]

### State Transitions
- Partial completion: [Recovery behavior]
- Session expiry: [User experience]
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | [/25] | [Files, LOC, systems] |
| Risk | [/25] | [Auth, API, breaking changes] |
| Research | [/20] | [Investigation needs] |
| **Total** | **[/70]** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- [Question 1 requiring clarification]
- [Question 2 requiring clarification]
<!-- /ANCHOR:questions -->

---



<!-- SCAFFOLD_VALIDATION_COUNTS:
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
