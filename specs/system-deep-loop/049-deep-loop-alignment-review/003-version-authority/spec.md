---
title: "Feature Specification: Phase 2: version-authority"
description: "Each hub declares its SKILL.md as the release authority and its five routing artifacts carry that one version, with the schema doc defining the field as one thing."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 2: version-authority

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
| **Phase** | 3 of 9 |
| **Predecessor** | 002-roster-completeness |
| **Successor** | 004-leaf-manifest-and-doctrine-reachability |
| **Handoff Criteria** | [To be defined during planning] |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the Remediate the alignment review findings specification.

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
The three hubs carried six disagreeing version values across their routing artifacts: system-deep-loop spanned 1.0.1.0 to 3.0.0.0 across five files, sk-code's registry and router lagged its release by a minor version, and cli-external-orchestration split the registry/router pair that sk-code kept paired. The hub-router schema doc defined version as either the router schema version or the artifact version in one sentence, and nothing validated it.

### Purpose
One version per hub, declared in one artifact, carried by the rest.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- SKILL.md named as the release authority in each hub, with the tie to its changelog stated
- The five routing artifacts per hub carrying that version
- The schema doc defining version as one thing
- The compiled activation manifests re-minted, since three of the edited files are raw-byte inputs to the compiled policy

### Out of Scope
- mcp-tooling and sk-doc - the same split exists there and is recorded for a later pass
- A gate that validates version parity - none exists and building one is more than this finding earns

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/{system-deep-loop,sk-code,cli-external-orchestration}/ five routing artifacts each` | Modify | One version per hub; the authority sentence in each SKILL.md |
| `.opencode/skills/sk-doc/sk-create-skill/references/parent-skill/parent-hub-router-schema.md` | Modify | Version defined as one thing |
| `.opencode/bin/lib/compiled-routing activation manifests and their authored copies` | Regenerate | Re-minted; the edited files are SHA inputs to the compiled policy |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Each hub's five routing artifacts carry the version its declared authority states |
| REQ-002 | The registry and router version pair matches within every hub |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | The schema doc gives the version field one meaning, and the compiled route guard reports every hub fresh |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All fifteen artifacts agree, three values across three hubs
- **SC-002**: The compiled route guard and the deep-loop suite exit zero
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A version edit stales the compiled policy | Closed | Measured: a version-only edit flipped a hub to legacy serving; the manifests are re-minted in the same change and the guard reports fresh |
| Risk | The next release bump stales them again | Known | No gate validates version parity; recorded, and the re-mint is the repository's own pre-commit gate |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Not applicable

### Security
- **NFR-S01**: Not applicable

### Reliability
- **NFR-R01**: The runtime and authored manifest copies stay byte-identical
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A hub whose SKILL.md and description.json already agreed: unchanged authority, registry and router raised to it
- Generation field in the manifests: normalized by the shadow compilers, only the policy hash moves

### Error Scenarios
- Manifest left stale: the hub serves legacy routing silently; the guard catches it

### State Transitions
- Not applicable
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | Fifteen artifacts, one schema doc, six manifests |
| Risk | 12/25 | Version fields feed the compiled routing policy |
| Research | 6/20 | The staling relationship had to be measured, not assumed |
| **Total** | **28/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None open.
<!-- /ANCHOR:questions -->

---


