---
title: "Phase 6: Overlay Replaced-Subtree Re-pin"
description: "A re-pin blocked on an upstream file its own copy wrote inside a folder an overlay replaces whole. The overlay engine now tells that file from a person's edit by comparing it with upstream's bytes."
trigger_phrases:
  - "overlay replaced subtree repin"
  - "phase 6 overlay replaced subtree repin"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Overlay Replaced-Subtree Re-pin

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-10 |
| **Branch** | `worktrees/340-local-test-scope` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 6 |
| **Predecessor** | 005-ci-runner-timing |
| **Successor** | None |
| **Handoff Criteria** | The overlay tests pass and the new cases fail without the fix |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the series, added to its scope at the operator's request.

**Scope Boundary**: the overlay engine's classification of files inside a skill-root entry's replaced folders, and its tests.

**Dependencies**:
- Barter's handover, `barter/ai-speckit/specs/skilled-barter-overlays/002-spec-tracks-restructure/009-repin-b6e570ffb2/handover.md`.

**Deliverables**:
- The engine fix and three tests that fail without it.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A skill-root overlay can replace a whole folder. When upstream changes a file inside that folder that the overlay's copy lacks, the re-pin copy writes upstream's file there. The engine then sees a live file with no applied-state record that the overlay would delete, and calls it `live-edited`. The stage blocks and suggests `apply --capture`, which would capture upstream's file into the overlay.

### Purpose
A file the re-pin copy wrote is the overlay's to delete. A file a person added stays a capture.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

### Measured Behavior

Barter's re-pin to `b6e570ffb2` printed:

```text
blocked sk-git-root: live-edited .skilled/skills/sk-git/manual-testing-playbook/commit-formation/find-commits-by-packet-and-id.md
```

Barter worked around it with a `repin.exclude` line.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Mark delete outputs inside a replaced folder in the skill-root planner.
- In `classifyDestination`, call such a file `overlay-edited` when its bytes equal upstream's at the pin being compared, and `live-edited` otherwise.
- Give the engine a reader for upstream bytes: the new commit's tree during a re-pin stage, the old commit before the copy, and the manifest's recorded pin when it names a checkout.

### Out of Scope
- Skipping replaced folders at copy time, the handover's option B, because it ties the copy step to overlay entries.
- Releasing `system-skilled-doctor`, which waits for the operator.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `O/overlay-engine.cjs` | Modify | The provenance check and the upstream-bytes readers |
| `O/tests/overlay-engine-fixes.test.cjs` | Modify | Recorded-pin case |
| `O/tests/overlay-engine-repin.test.cjs` | Modify | Two stage cases |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A copy-written file does not block | A stage re-pin with an upstream addition or change inside a replaced folder reports no `live-edited` |
| REQ-002 | A person's file still blocks | A hand-added file in the same folder reports `live-edited` |
| REQ-003 | Nothing else changes | Every overlay test file passes |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The three new tests fail on the old engine and pass on the new one.
- **SC-002**: All 73 overlay tests pass.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A person's file happens to equal upstream's bytes | It is deleted instead of captured | It is upstream's own content, so nothing a person wrote is lost |
| Dependency | `pin.checkout` in the manifest | Without it, outside a re-pin, the old behavior stays | The reader returns nothing and the file stays `live-edited` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---


