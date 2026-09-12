---
title: "Feature Specification: deprecate the visual explanation lane and its command from sk-communication"
description: "[What is broken, missing, or inefficient? 2-3 sentences describing the specific pain point.]"
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: deprecate the visual explanation lane and its command from sk-communication

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | [P0/P1/P2] |
| **Status** | Draft |
| **Created** | 2026-09-12 |
| **Branch** | `scaffold/005-deprecate-visual-explanation-lane` |
<!-- /ANCHOR:metadata -->

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
| Dependency | [System/API] | [What if blocked] | [Fallback plan] |
| Risk | [Risk description] | [High/Med/Low] | [Mitigation strategy] |
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

## Why this packet exists

`/rewrite:explain-visually` renders "the smallest visual that makes the point land". Until
`7ff14ca61c` it was display-only by default, so what it produced was a Mermaid block fenced in the
reply — which a terminal shows as its own source. The reader got the diagram's code and had to
imagine the diagram. That commit inverted the default to publishing.

The operator then chose to retire the lane rather than keep it. This packet supersedes both
`003-visual-explanation-lane`, which built it, and `004-visual-explanation-output-medium`, which
fixed its output medium the day before this decision.

## Inventory

Seventeen files name the command or the lane, across five areas. The blast radius leaves the skill.

| Area | Files | What they carry |
|---|---|---|
| `sk-communication` | 12 | `SKILL.md` lane table and command list, `README.md`, `references/visual-explanation.md`, two feature-catalog entries, two playbook scenarios, `leaf-manifest.json`, `leaf-aliases.json`, `graph-metadata.json` |
| `.opencode/commands` | 2 | the command file itself, and the commands index, whose table still documents the pre-`7ff14ca61c` flag |
| `system-spec-kit` | 3 | retrieval fixtures: `corpus-manifest.json`, `phrase-variants.json`, `generation-diagnostics.json` |
| `repo-rules` | 1 | `communication.md` names the command as the route for a diagram at a chosen depth |

The three retrieval fixtures are generated. They are regenerated by the trigger-index generator, not
hand-edited, and the regenerated index and manifest are committed together.

## The decision this packet turns on

The lane is in-context only, so it runs on all six runtimes this repository targets. The native
artifact and diagramming capabilities that would replace it exist on Claude Code alone. Full removal
therefore costs the capability on the other five, where nothing replaces it.

Two readings of "deprecate", with materially different work:

**Retire in place.** Mark the command deprecated, stop advertising it in the skill's routing
vocabulary and the commands index, point its documentation at the native replacement, and leave it
working. Reversible, keeps the five runtimes covered, and leaves a surface nobody maintains.

**Remove.** Delete the command, Lane B, the modality reference, both feature-catalog entries and both
playbook scenarios; collapse the skill to its projection lane; regenerate the retrieval index; correct
the repo rule. Smaller skill, one honest capability story, and a capability gap off Claude Code.

## Out of scope

Lane A, the projection lane, and its six runtime adapters. It carries a different risk profile and its
own default-off posture, and nothing here touches it.

## Rollback

Both paths are a single revert of this packet's commit. No data migrates, no contract outside this
repository changes, and no published surface is withdrawn.
