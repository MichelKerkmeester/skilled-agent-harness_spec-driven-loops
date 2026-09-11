---
title: "Feature Specification: Phase 6: runtime-package-rename"
description: "Rename the advisor package directory from mcp-server to runtime and carry every path, import, dist location, freshness check and live reference with it"
trigger_phrases:
  - "advisor package rename"
  - "advisor runtime directory"
  - "mcp-server rename"
  - "advisor path migration"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 6: runtime-package-rename

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

Once the transport is gone, the directory named mcp-server describes something that no longer exists. This phase renames it to runtime, matching the sibling packages, and carries every path that referenced it. The move is mechanical and carries no behavior change.

**Key Decisions**: git mv so history follows; a behavior change found during the move is a separate finding

**Critical Dependencies**: Phase 005, so the move carries a tree with no transport in it

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-09-11 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 8 |
| **Predecessor** | 005-mcp-transport-removal |
| **Successor** | 007-docs-and-residue-sweep |
| **Handoff Criteria** | Nothing outside history resolves a path under the old directory name, and the CLI answers from the renamed tree |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the skill advisor MCP decommission specification.

**Scope Boundary**: Paths and names. No behavior, no contract, no output changes in this phase.

**Dependencies**:
- Phase 005 must be complete, so the rename moves a tree that no longer contains a transport.

**Deliverables**:
- The package directory at runtime/, moved with git mv.
- Every launcher path, dist path, tsconfig output, import and script updated at source.
- The dist freshness check recognizing the renamed package.
- A live CLI call proving the renamed tree answers.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The directory name is the last thing in the package still claiming an MCP server. A name that contradicts the code costs every future reader a correction, and the correction does not travel with the code. The rename is wide but shallow: launcher paths, dist paths, the freshness checker's package key, tsconfig outputs, imports, test fixtures and documents. Folding it into the removal phase would bury deletions inside a move diff and make both unreviewable.

### Purpose
Leave the package named for what it is, with every path following the move.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The directory move from mcp-server/ to runtime/, by git mv.
- Launcher paths, dist paths, the freshness checker package key, tsconfig outputs and scripts.
- Imports, test fixtures and any path string naming the old directory.
- Live documents naming the old directory.

### Out of Scope
- Any behavior change. A behavior difference found during the move is recorded as a separate finding and fixed elsewhere.
- Historical documents, which keep the old name as evidence.
- The CLI contract, frozen in phase 003 and unchanged here.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-skill-advisor/mcp-server/` | Move | Renamed to `runtime/` by git mv |
| `.opencode/bin/system-skill-advisor-launcher.cjs` | Modify | Package and dist paths |
| `.opencode/bin/skill-advisor.cjs` | Modify | Dist path and freshness package key |
| `.opencode/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs` | Modify | Package key for the renamed tree |
| `.opencode/skills/system-skill-advisor/**/tsconfig*.json` | Modify | Output paths |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The package directory is `runtime/` and the move was made with git mv |
| REQ-002 | Nothing outside history resolves a path under the old directory name |
| REQ-003 | The CLI answers a live call from the renamed tree |
| REQ-004 | The build, the typecheck and the test suite run from the renamed tree |
| REQ-005 | The dist freshness check recognizes the renamed package |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | No live document names the old directory |
| REQ-007 | Any behavior difference found during the move is recorded as a separate finding |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A path sweep for the old directory name returns only historical documents.
- **SC-002**: A live CLI recommendation succeeds from the renamed tree.
- **SC-003**: Build, typecheck and tests all pass from the renamed tree.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A path string missed in a rarely-run script | Medium | Sweep by string, not by import graph; scripts are not in the import graph |
| Risk | Freshness check keyed to the old package name fails open | High | Prove the check fires on a deliberately stale build after the rename |
| Risk | Behavior change smuggled into a rename diff | Medium | Any behavior difference is a separate finding and a separate change |
| Dependency | Phase 005 complete | Renaming a tree that still has a transport hides deletions | Do not start before the removal lands |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No advisor call path gets slower than the phase 002 budget allows.

### Reliability
- **NFR-R01**: A failure in the advisor path degrades the same way it degrades today: the caller keeps working without a recommendation, and never blocks on one.

---

## 8. EDGE CASES

### Failure boundaries
- Daemon absent or not yet warm: the caller gets the documented retryable outcome, not a hang.
- Stale build output: the front door refuses with a readable message rather than serving an old answer.
- Concurrent callers: several runtimes holding sessions at once keep working, as they do today.

---

## 9. COMPLEXITY ASSESSMENT

Build phase. The risk is not in writing the code but in the blast radius: the advisor sits on the prompt path of every runtime, so a regression is visible on the next message.

---

## 12. OPEN QUESTIONS

- None open at authoring time beyond those the parent spec records; anything found during planning is raised there.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase Goal**: See `goal.md` for the durable directive this phase executes against
- **Parent Goal**: See `../goal.md` for the packet directive that outranks it
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Acceptance Criteria**: See `acceptance-criteria.md`

---
