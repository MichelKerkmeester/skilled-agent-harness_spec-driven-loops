---
title: "Feature Specification: Router version parity"
description: "Doctor check 13a stops requiring a hub ROUTER.md to carry the SKILL.md version, by operator ruling that ROUTER.md keeps its own version; the JSON routing files keep matching SKILL.md, the changelog workflow stops copying the release version into ROUTER.md, and the versioning standard says so."
trigger_phrases:
  - "router version parity"
  - "phase 4 router version parity"
  - "check 13a router version"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Router version parity

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Planned |
| **Created** | 2026-10-13 |
| **Branch** | Its own worktree from origin/main once phase 002 is on it, created as `goal.md` says |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 5 |
| **Predecessor** | 003-example-tolerant-drift-guards |
| **Successor** | 005-external-user-guide |
| **Handoff Criteria** | Every criterion in `goal.md` passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the external surface priority build. It is the operator-approved item outside the research: check 13c, the README version check, was retired in `../../024-readme-freshness-fixes/` because every doc but `SKILL.md` carries its own version. Check 13a still holds `ROUTER.md` to the `SKILL.md` version. The operator ruled that `ROUTER.md` keeps its own version, as `.skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:28-30` already says.

**Scope Boundary**: The 13a follower list and its test, the global version-copy list in both create-changelog YAML twins, and the enforcement paragraph of `frontmatter-versioning.md`.

**Dependencies**:
- Phase 002 edits `parent-skill-check.cjs` and `parent-skill-check-invariants.test.cjs` too, so this phase starts from origin/main only after phase 002 is on it.

**Deliverables**:
- 13a compares only `description.json`, `hub-router.json` and `mode-registry.json` with `SKILL.md`.
- The changelog workflow no longer writes a release version into `ROUTER.md`.
- No skill release.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`checkVersionParity` in `.skilled/commands/doctor/scripts/parent-skill-check.cjs` (around line 1839) lists `ROUTER.md` among the routing artifacts that must carry the `SKILL.md` version, and soft-fails 13a when it differs. The pre-commit gate raises a changed doc's own version, so the first body edit to a hub's `ROUTER.md` after a release makes 13a fail for following the per-doc rule. The global branch of `/create:changelog` (`create-changelog-confirm.yaml:603`, `create-changelog-auto.yaml:668`) also sets `ROUTER.md`'s version to the release version, and `frontmatter-versioning.md:122` describes the doctor as comparing `ROUTER.md` with `SKILL.md`.

### Purpose
`ROUTER.md` carries its own edition like every other doc, while the JSON routing files keep the release version that 13a checks.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **VP-1.** Remove the `ROUTER.md` entry from the 13a `followers` list; `description.json`, `hub-router.json` and `mode-registry.json` stay. 13b and 13d are unchanged.
- **VP-2.** One test in `parent-skill-check-invariants.test.cjs`: a hub whose `ROUTER.md` version differs from `SKILL.md` prints no 13a failure and the run does not fail on it (T1). The existing case that a differing `description.json` fails 13a stays green.
- **VP-3.** Drop the `ROUTER.md frontmatter version:` line from the global version-copy list in both create-changelog YAML twins, and keep the twins aligned.
- **VP-4.** The "What nothing enforces" paragraph of `frontmatter-versioning.md` names only the three JSON files as what the doctor's version check compares with `SKILL.md`.
- The same-class inventory: every other claim that a hub `ROUTER.md` carries the `SKILL.md` version, found by grep, is corrected or listed with its reason.

### Out of Scope
- The presence and format rule for a `ROUTER.md` version in `root-router-contract.cjs:509`; it stays.
- Any change to the current `ROUTER.md` version values; they keep what they carry.
- 13b, 13d and the retired 13c.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/doctor/scripts/parent-skill-check.cjs` | Modify | 13a follower list |
| `.skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs` | Modify | T1 |
| `.skilled/commands/create/assets/create-changelog-confirm.yaml`, `create-changelog-auto.yaml` | Modify | Version-copy list |
| `.skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md` | Modify | Enforcement paragraph |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A `ROUTER.md` version that differs from `SKILL.md` produces no 13a failure |
| REQ-002 | A JSON routing file whose version differs from `SKILL.md` still fails 13a |
| REQ-003 | The global changelog workflow no longer writes `ROUTER.md`'s version |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | `frontmatter-versioning.md` describes the doctor's check as JSON-only |
| REQ-005 | The six hubs with a `ROUTER.md` (sk-code, sk-doc, sk-design, mcp-tooling, system-deep-loop, cli-external-orchestration) pass the doctor |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.

### Ledger

The builder records `| VP-<n> | Fixed or Closed | <backticked proof, or the reason> |` for VP-1 to VP-4 in `implementation-summary.md`, and the test as `| T1 | <test name> | before: exit <n> | after: exit 0 |`. Review findings go in a `| RV-<n> | P<0-2> | Fixed or Rejected | <proof or reason> |` table in the same file.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A body edit to a hub `ROUTER.md`, whose version the pre-commit gate then raises, leaves the doctor green.
- **SC-002**: A release still moves the JSON routing files' versions, and 13a still catches one left behind.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A doc still tells authors to sync `ROUTER.md` to the release | Low | The same-class inventory in task T002 |
| Dependency | Phase 002's edits to the same two files | Med | Start from origin/main after 002 is on it |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: Every other doctor line for the six hubs is unchanged.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A hub with no `ROUTER.md`: nothing changes, as 13a skipped absent followers already.
- A `ROUTER.md` with a malformed version: 13a no longer reports it; the root-router contract's format check still does.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 4/25 | Five files, about 30 lines |
| Risk | 5/25 | One doctor leg narrows |
| Research | 2/20 | Operator ruling and the 13c precedent |
| **Total** | **11/70** | **Level 2, chosen for the build as a whole; see the parent goal log** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
