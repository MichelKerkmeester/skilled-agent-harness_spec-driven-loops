---
title: "Feature Specification: Phase 3: orchestrate-mirror-alignment"
description: "The orchestrate agent's OpenCode source grants the delegation tool in its permission block and every runtime mirror declares that tool in its own vocabulary, with the mirror-sync checker green."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 3: orchestrate-mirror-alignment

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-09-15 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 18 of 19 |
| **Predecessor** | 017-protocol-and-catalog-alignment |
| **Successor** | 019-forced-depth-empty-records |
| **Handoff Criteria** | [To be defined during planning] |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 18** of the Remediate the alignment review findings specification.

**Scope Boundary**: [To be defined during planning]

**Dependencies**:
- [To be defined during planning]

**Deliverables**:
- [To be defined during planning]

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The orchestrate agent said it orchestrates through the delegation tool, but its OpenCode permission block did not grant it and its Pi mirror did not declare it, while the Claude mirror did. An agent whose own permissions omit the tool it says it uses is misdocumented at best and blocked at worst.

### Purpose
One delegation declaration, carried by every mirror in that runtime's own vocabulary.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `task: allow` in the OpenCode source's permission block
- A body sentence, byte-identical across the four mirrors, naming the delegation tool per runtime: task in OpenCode, Agent in Claude Code, spawn_agent in Codex, subagent in Pi
- Regenerated Pi and Codex mirrors through their generators, with every mirror gate green

### Out of Scope
- Adding the tool to Pi's generated tools list - no installed Pi package registers a subagent tool today and the generator gate rejects a hand edit; recorded as reviewed
- Codex's role schema - it carries no tool key, delegation is gated globally by its multi-agent feature

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/agents/orchestrate.md` | Modify | `task: allow` and the delegation-tool sentence |
| `.claude/agents/orchestrate.md` | Modify | Sentence mirrored; Agent already declared |
| `.pi/agents/orchestrate.md` | Regenerate | Sentence and the unmapped-permission note |
| `.codex/agents/orchestrate.toml` | Regenerate | Sentence in the developer instructions |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The OpenCode source's permission block grants the delegation tool |
| REQ-002 | Every mirror carries the same delegation sentence naming the tool for its runtime, and the mirror-sync checker exits zero |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | The Pi and Codex mirrors are generator output, not hand edits, and their own check modes exit zero |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The mirror-sync checker reports all mirrors in sync
- **SC-002**: The deep-loop suite exits zero
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Pi's tools list still lacks the delegation tool | Low | No installed package registers it; the body names the vocabulary a returning consumer would use, and the generator map is one line away when one exists |
| Dependency | Mirror generators and their gates | Green | All four checks exit zero |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Not applicable

### Security
- **NFR-S01**: The OpenCode grant is the one that binds; mirrors document it

### Reliability
- **NFR-R01**: Every mirror gate passes
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Runtime with no delegation tool: the sentence says so and the agent treats itself as unable to dispatch

### Error Scenarios
- Hand-edited generated mirror: its gate fails; regenerate instead

### State Transitions
- Not applicable
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 4/25 | Four agent files |
| Risk | 6/25 | Agent permission and mirror gates |
| Research | 4/20 | Runtime tool vocabularies had to be confirmed per runtime |
| **Total** | **14/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None open.
<!-- /ANCHOR:questions -->

---


