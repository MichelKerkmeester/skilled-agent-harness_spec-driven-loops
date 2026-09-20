---
title: "Feature Specification: Playbook and end-to-end verification"
description: "Give the mode operator scenarios that can be run rather than read, and prove the whole chain answers from a request through the hub to MagicPath's own data."
trigger_phrases:
  - "magicpath playbook"
  - "magicpath end to end verification"
  - "operator scenarios"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Playbook and end-to-end verification

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-08-29 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 6 |
| **Predecessor** | 004-hub-integration |
| **Successor** | 006-design-authority |
| **Handoff Criteria** | A request naming MagicPath returns the account's own data through the hub and the registered manual, and the playbook's scenarios have been executed rather than only written |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the MagicPath tool bridge specification.

**Scope Boundary**: Operator scenarios and the proof that the assembled chain answers. No change to the manual, the packet or the hub metadata unless verification exposes a defect, in which case the fix lands here with its evidence.

**Dependencies**:
- Every earlier phase, since this one exercises their combined result
- A MagicPath credential for the scenarios that read account data

**Deliverables**:
- A manual-testing playbook in the shape sibling packets use
- Executed scenarios with recorded results
- An end-to-end verification covering the whole chain

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Four phases will each have proven their own piece. None of them proves the assembly.

The transport was proven with a probe, the surface with direct calls, the packet against a packaging gate, and the routing against a metadata audit. A request can still fail in the seams: the hub may resolve to the mode while the mode names a tool the manual does not expose, or the manual may answer while the packet documents a different command, or routing may work for the phrase the registry's aliases anticipated and for nothing an operator would actually type.

The second gap is durability. A bridge verified once, by the person who built it, degrades silently. The vendor ships a CLI that changes under it - the installed build is already two minor versions behind the published one, and the newer build carries a command family the older one lacks. When that gap widens, the failure will surface as a tool that stops answering, and the question will be which layer moved. Sibling packets answer this with executable operator scenarios rather than prose, and that is the shape this one should take.

### Purpose

Prove the chain end to end, and leave behind scenarios that let someone else prove it again after the vendor's next release.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A manual-testing playbook covering routing, the registered surface, the credential states and the mutation boundary
- Execution of those scenarios, with results recorded
- An end-to-end run from a naturally phrased request to returned MagicPath data
- Any defect the verification exposes, fixed here with its evidence

### Out of Scope

- Automated tests over the vendor's CLI. Its behavior is the vendor's, and asserting it here would test their release rather than this bridge.
- Broadening the registered surface. If verification shows a missing tool, that is recorded as a follow-up rather than added under a verification phase.
- Any credential value, in any scenario or recorded result.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-tooling/mcp-magicpath/manual-testing-playbook/` | Create | Operator scenarios by category |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The chain answers end to end | A request naming MagicPath, phrased as an operator would phrase it, returns the account's own data |
| REQ-002 | The scenarios are executed, not only authored | Each scenario carries a recorded result, and a failing one blocks the phase rather than being noted |
| REQ-003 | The playbook covers the refusal path | A scenario exercises the uncredentialed state and states the expected message |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The playbook takes the shape siblings use | Its structure matches the coverage breadth of a sibling packet's playbook rather than a flat scenario list |
| REQ-005 | Routing is exercised on phrasing the registry did not anticipate | At least one scenario uses wording absent from the mode's aliases |
| REQ-006 | The version gap is covered | A scenario records the installed CLI version, so a later failure can be attributed to a vendor release |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Someone who did not build this bridge can run the playbook and reach a verdict on whether it still works.
- **SC-002**: The end-to-end run is recorded with the request, the route taken, and the data returned.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Scenarios are written but never run, so the playbook records intentions | High | Execution is a requirement with recorded results, and an unrun scenario is a blocked phase |
| Risk | Verification only exercises phrasing the aliases already cover | Medium | At least one scenario deliberately uses wording the registry does not anticipate |
| Risk | A mutating scenario leaves real state behind | Medium | Mutating scenarios, if any, target a disposable project and clean up as part of the scenario |
| Risk | A credential leaks into a recorded result | High | Results are scanned before close, and scenarios reference the variable rather than any value |
| Dependency | An authenticated MagicPath account | Medium | The operator authenticates before the credentialed scenarios; the uncredentialed ones run either way |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Whether the playbook should pin the CLI version it was verified against, so a future run can tell a vendor change from a regression.
- Whether a scenario should cover the vendor's own instruction files being present in the same repository, since an operator who runs the vendor's setup command would then have two MagicPath surfaces.
<!-- /ANCHOR:questions -->

---
