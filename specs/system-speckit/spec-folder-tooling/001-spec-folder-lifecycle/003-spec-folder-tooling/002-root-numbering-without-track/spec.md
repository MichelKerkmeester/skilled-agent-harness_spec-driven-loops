---
title: "Feature Specification: Number create.sh packets at the specs root from the highest existing number"
description: "Without --track, create.sh numbered a packet by counting only the folders and branches that shared its short name, so differently named packets in one specs root all got 001, and every such scaffold fetched and pruned all remotes. It now numbers after the highest folder in the root and the highest packet branch git already knows, and fetches nothing."
trigger_phrases:
  - "create.sh root numbering"
  - "duplicate packet number 001"
  - "packet numbering without track"
  - "scaffold prunes remote-tracking refs"
  - "highest branch number"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Number create.sh packets at the specs root from the highest existing number

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Implemented |
| **Created** | 2026-09-24 |
| **Branch** | None. Work on `main`, packet folder only |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Inside a git repository and without `--track`, `create.sh` numbered a new packet with `check_existing_branches`. That function counted only the branches and `specs/` folders whose names matched the new packet's short name, so every differently named packet in the same root started at 001. In a throwaway repository, scaffolds named `First packet` and `Second packet` both came out as 001.

The same function ran `git fetch --all --prune` on every such scaffold. Each scaffold needed the network, and the prune deleted any remote-tracking ref the remote no longer had. In a throwaway repository with a local bare remote, one scaffold deleted `refs/remotes/origin/020-remote-work` and still numbered its packet 001.

With `--track`, the usual path in this repository, `create.sh` numbers from the track folder and is correct. No packet sits directly under `specs/` here, which is why the defect went unnoticed. Packet 035 found it while scaffolding with no build.

### Purpose
A packet made at the specs root takes the next number after every packet folder in that root and every packet branch git already knows, with no network access and no change to the repository's refs.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Number a root packet after the highest folder in the root, whatever its name
- Without a track, also count the highest `NNN-` branch among local branches and the remote-tracking refs already present
- Remove the fetch, the prune and the per-name count
- A test that fails on the duplicate 001, on an uncounted branch, on a date-shaped branch and on a pruned remote-tracking ref

### Out of Scope
- Track numbering. It already numbers from the track folder, and a track ignores branches
- Remote branches pushed since the last fetch. The operator chose to read only the refs git already has, so a scaffold needs no network
- Creating the branch itself, which is unchanged

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `runtime/cli/lib/git-branch.sh` | Modify | Replace `check_existing_branches` with `highest_branch_number`, which reads refs and fetches nothing |
| `runtime/cli/spec/create.sh` | Modify | Number from the highest root folder, and without a track from the highest packet branch as well |
| `runtime/cli/tests/create-root-numbering.vitest.ts` | Create | Five cases, each in a throwaway repository |

All paths are under `.skilled/skills/system-spec-kit/`.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Two differently named packets in one root get consecutive numbers | The test's first two cases fail before the fix and pass after |
| REQ-002 | A scaffold fetches nothing and prunes nothing | A remote-tracking ref the remote lacks survives a scaffold, and neither `create.sh` nor `git-branch.sh` runs `git fetch` or `git ls-remote` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | A packet branch raises the next root number, and a date-shaped branch does not | The branch cases fail before the fix and pass after |
| REQ-004 | Track numbering is unchanged | The track numbering test in `spec-root-writer-autosave.vitest.ts` passes |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: No two packets in one root share a number, and none reuses a number a known packet branch holds
- **SC-002**: A scaffold makes no network call and leaves every ref as it found it
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A branch pushed elsewhere since the last fetch is not counted | Low | Folders in the checkout still number correctly, and fetching before a scaffold counts it |
| Risk | A branch from unrelated work that happens to start with three digits raises the root's numbers | Low | Only `NNN-` names count, the shape `create.sh` gives its own branches, and a track ignores branches |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None
<!-- /ANCHOR:questions -->

---
