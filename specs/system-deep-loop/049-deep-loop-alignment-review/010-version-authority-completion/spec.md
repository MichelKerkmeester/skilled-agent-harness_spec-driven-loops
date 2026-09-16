---
title: "Feature Specification: Phase 10: version-authority-completion"
description: "The two hubs that phase 003 recorded out of scope now carry one version across their routing artifacts, sk-doc's missing release entry is authored, and the sk-code packet versions are recorded as independent rather than aligned."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 10: version-authority-completion

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-16 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 10 of 12 |
| **Predecessor** | 009-containment-promise-and-severity-scale |
| **Successor** | 011-routing-doctrine-and-discovery |
| **Handoff Criteria** | Every routing artifact of `sk-doc` and `mcp-tooling` agrees with its hub's release, both manifest copies are re-minted, and the guard reports every hub fresh |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 10** of the close the unbound alignment findings specification.

**Scope Boundary**: The two hubs phase 003 deferred, and the two `sk-code` packet versions it never examined. No other hub and no other artifact.

**Dependencies**:
- Phase 003 established the authority rule and the re-mint procedure this phase repeats.

**Deliverables**:
- One version across each hub's five routing artifacts, with the authority stated in both `SKILL.md` files.
- The missing `sk-doc` release entry that makes that hub's authority true again.
- A recorded reason for the two `sk-code` packet versions, and the absence of a parity gate.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 003 gave three hubs one version authority and wrote the remaining two into its own out-of-scope list, so `sk-doc` and `mcp-tooling` still carry four and three disagreeing values across their five routing artifacts. `sk-doc` also raises a question the other hubs did not: its `SKILL.md` claims `2.1.0.0` while its newest changelog entry is `v2.0.1.0`, which breaks the very rule that made `SKILL.md` the authority. Separately, two `sk-code` packet surfaces sit at `0.1.*` against a `1.0.0.x` sibling.

### Purpose
One version per hub, declared in one artifact, carried by the rest, with every exception resolved from evidence rather than assumed.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `sk-doc` and `mcp-tooling`: five routing artifacts each, plus the authority sentence in each `SKILL.md`
- The `sk-doc` authority question, resolved from repository evidence
- A decision and a recorded reason for the two `sk-code` `0.1.*` surfaces
- The compiled activation manifests re-minted for every hub whose raw-byte inputs changed

### Out of Scope
- A gate that validates version parity - none exists and building one is more than this finding earns
- Raising packet versions to their hub's version - packet anchors are independent by design

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/{sk-doc,mcp-tooling}/` five routing artifacts each | Modify | One version per hub; the authority sentence in each SKILL.md |
| `.opencode/skills/sk-doc/changelog/v2.1.0.0.md` | Create | The missing release entry for the version `SKILL.md` already carries |
| `.opencode/skills/sk-code/SKILL.md` | Modify | Records packet version independence and the two 0.x surfaces without changing them |
| `.opencode/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md` | Modify | Records what nothing enforces: cross-artifact and hub-versus-packet parity |
| `.opencode/bin/lib/compiled-routing activation manifests and their authored copies` | Regenerate | Re-minted; the edited files are SHA inputs to the compiled policy |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The `sk-doc` authority question is resolved from evidence, and the hub's newest changelog entry names the version its artifacts carry |
| REQ-002 | Each hub's five routing artifacts carry the version its declared authority states |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | The two `sk-code` `0.1.*` surfaces are either aligned or given a recorded reason for independent versioning |
| REQ-004 | The absence of a version parity gate is recorded where the version standard states its enforcement |
| REQ-005 | Every hub whose raw-byte inputs changed is re-minted, and the compiled route guard reports every hub fresh |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Both hubs carry one value across five artifacts, and that value equals their newest changelog entry
- **SC-002**: The compiled route guard and the deep-loop suite exit zero
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A version edit stales the compiled policy | Closed | The manifests are re-minted in the same change and the guard confirms freshness |
| Risk | Aligning `sk-doc` to a release that never shipped | Closed | The version was shown to be a real release before anything was aligned to it |
| Risk | The next release bump stales the manifests again | Known | No gate validates version parity; recorded, and the re-mint is the pre-commit gate |
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
- A hub whose newest changelog entry trails its `SKILL.md`: the release is real and the entry is missing, so the entry is authored rather than the version rolled back
- Packet `SKILL.md` files: independent anchors, never compared against their hub

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
| Scope | 9/25 | Ten artifacts, two reference docs, one new changelog entry, three manifests |
| Risk | 12/25 | Version fields feed the compiled routing policy |
| Research | 14/20 | The `sk-doc` question needed git archaeology, not a reading |
| **Total** | **35/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None open.
<!-- /ANCHOR:questions -->

---
