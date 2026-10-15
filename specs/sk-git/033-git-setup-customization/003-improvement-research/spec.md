---
title: "Feature Specification: Phase 3: improvement-research"
description: "[What is broken, missing, or inefficient? 2-3 sentences describing the specific pain point.]"
trigger_phrases:
  - "improvement research"
  - "phase 3 improvement research"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 3: improvement-research

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | [P0/P1/P2] |
| **Status** | Draft |
| **Created** | 2026-10-15 |
| **Branch** | `scaffold/003-improvement-research` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 4 |
| **Predecessor** | 002-doctor-git-setup |
| **Successor** | 004-final-deep-review |
| **Handoff Criteria** | [To be defined during planning] |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the Research further improvements to /doctor:git setup and deep-review the shipped work specification.

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
[What is broken, missing, or inefficient? 2-3 sentences describing the specific pain point.]

### Purpose
[One-sentence outcome statement. What does success look like?]
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- [Deliverable 1]
- [Deliverable 2]
- [Deliverable 3]

### Out of Scope
- [Excluded item 1] - [why]
- [Excluded item 2] - [why]

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| [path/to/file.js] | [Modify/Create/Delete] | [Brief description] |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | [Requirement description] | [How to verify it's done] |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | [Requirement description] | [How to verify it's done] |
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
| Dependency | [System/API] | [What if blocked] | [Fallback plan] |
| Risk | [Risk description] | [High/Med/Low] | [Mitigation strategy] |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- [Question 1 requiring clarification]
- [Question 2 requiring clarification]
- How can the read-only /doctor:git setup check and the /doctor:git command family be improved further: missing checks, false-healthy readings, wrong repairs, open untrusted-repository vectors, doc drift, test gaps and the deferred items (per-repository hard-rules.json overlay, Gate Inputs hook test and sk-doc Script Test CI failures)?

**Research Context**: a `/deep:research` run is active for this topic. `research/research.md` is the canonical output; this note only points at it.

<!-- BEGIN GENERATED: deep-research/spec-findings -->
**Research findings (abridged from `research/research.md`, 5 iterations, stop reason maxIterationsReached):**
- The battery can report STATUS=OK while uncertain: UNKNOWN rows never affect status or exit code, and the gates, worktree and AI-tool checks can pass on unverified input.
- Four of the nine named repairs miss their failure or cross the trust boundary. The worst sends operators to the inspected repository's own hook installer.
- On main, Gate Inputs fails because its workflow never installs `@spec-kit/shared`. sk-doc Script Tests fails on one stale README manifest, and the sk-git catalog leaf title drifted from its root H3.
- Proposed phases: CI green, truthful battery, safe repairs, path containment, the trust-gated `hard-rules.json` overlay, then doc and playbook sync.
<!-- END GENERATED: deep-research/spec-findings -->
<!-- /ANCHOR:questions -->

---


