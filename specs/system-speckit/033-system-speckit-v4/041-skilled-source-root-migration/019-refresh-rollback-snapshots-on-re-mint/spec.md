---
title: "Feature Specification: Phase 19: refresh-rollback-snapshots-on-re-mint"
description: "Keep each hub's saved pre-flip manifest naming the policy the hub serves now, so a rollback restores that policy under legacy authority instead of a generation the engine no longer builds."
trigger_phrases:
  - "rollback snapshot refresh"
  - "serving prior snapshot"
  - "stale rollback manifest"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 19: refresh-rollback-snapshots-on-re-mint

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Planned |
| **Created** | 2026-09-19 |
| **Branch** | `worktrees/055-skilled-source-root-migration` |
| **Parent Spec** | ../spec.md |
| **Phase** | 19 of 19 |
| **Predecessor** | 018-restore-advisor-suite-and-renew-scorer-freeze |
| **Successor** | None |
| **Handoff Criteria** | A rollback of any hub restores its current policy under legacy authority, and the harness's rollback and reflip checks pass |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 19** of the skilled source-root migration specification.

**Scope Boundary**: The authored activation tree's rollback snapshots and the tools that write them. No change to which router serves a hub.

**Dependencies**:
- Phase 18 found this, and the operator chose to plan it on 2026-09-19.

**Deliverables**:
- See section 3.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Every compiled-serving hub keeps a `manifest.serving-prior.json` in the authored activation tree, and `flip-serving.cjs --rollback` restores it byte for byte. The flip writes that snapshot only when none exists, and re-minting a manifest never touches it, so all five hubs' snapshots still name the policy they had at cutover. A live rollback today restores a policy the engine no longer builds; the resolver's identity check then fails safe to legacy, so the rollback works only by accident. The runtime-engine harness fails its rollback-and-reflip checks on exactly this.

### Purpose
A rollback restores the hub's current policy with legacy authority.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Refresh the snapshot whenever a compiled-serving hub's manifest is re-minted: the same `selectedPolicy`, with `servingAuthority` legacy and `shadowOnly` true.
- Where re-minting happens: `compiled-route-manifest.cjs refresh` and the pre-commit re-mint gate.
- A one-time refresh of the five existing snapshots.
- A test that re-mints and rolls back a sandboxed hub.

### Out of Scope
- Changing the byte-exact rollback contract - the snapshot stays the thing rollback restores.
- The two harness checks unrelated to rollback.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/bin/lib/compiled-route-manifest.cjs` | Modify | Refresh the snapshot on re-mint |
| `.skilled/scripts/git-hooks/pre-commit` (route re-mint gate) | Modify | Same, and stage the snapshot |
| `specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/*/manifest.serving-prior.json` | Regenerate | One-time refresh |
| `.skilled/bin/tests/compiled-route-manifest.test.cjs` | Modify | Re-mint then roll back |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | After any re-mint of a compiled-serving hub, its snapshot names the new policy with legacy authority. |
| REQ-002 | No hub's serving changes. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | The harness's rollback and reflip checks pass. |
| REQ-004 | The five existing snapshots are refreshed in one reviewed commit. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A sandboxed re-mint then rollback restores the current policy under legacy authority.
- **SC-002**: The runtime-engine harness passes its rollback checks.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A refreshed snapshot hides the policy a hub really had before cutover | Low | That history stays in git and in each hub's flip record |
| Risk | The pre-commit gate stages a file the author did not expect | Med | The gate names every file it stages |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No measurable cost; a re-mint writes one more small file.

### Security
- **NFR-S01**: No private home-derived path in any tracked file.

### Reliability
- **NFR-R01**: A rollback never restores a policy the engine cannot build.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A hub serving legacy has no snapshot to refresh; nothing is written.

### Error Scenarios
- A snapshot that cannot be written fails the re-mint loudly.

### State Transitions
- A re-mint during an interrupted flip: the flip journal is resolved first.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Two writers, five snapshots, one test |
| Risk | 12/25 | Rollback is a safety path |
| Research | 4/20 | Phase 18 found the cause |
| **Total** | **24/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Should the snapshot also record the generation it was refreshed from, for audit?
<!-- /ANCHOR:questions -->

---
