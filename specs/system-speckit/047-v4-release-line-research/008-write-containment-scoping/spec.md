---
title: "Feature Specification: Phase 8: write-containment-scoping"
description: "Write containment reads repo-wide git status, so deep loops running at the same time in sibling phase folders blame each other's writes, and an out-of-folder write during research escaped with no record. This phase scopes attribution to the live run that owns a path and pins what an out-of-folder write leaves behind."
trigger_phrases:
  - "write containment scoping"
  - "phase 8 write containment scoping"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 8: write-containment-scoping

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-08 |
| **Branch** | `worktrees/334-v4-release-remediation` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 17 |
| **Predecessor** | 007-deep-loop-state-and-stop-policy |
| **Successor** | 009-gate3-and-continuity-root |
| **Handoff Criteria** | A single-executor loop no longer attributes a live sibling run's writes to itself, and the containment and fan-out suites hold their baselines |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the v4 release line remediation specification.

**Scope Boundary**: Attribution of out-of-scope writes in the deep-loop write-containment library and its callers, and the record an out-of-folder write leaves. The `package_skill.py` default that wrote the zips belongs to phase 016 (sk-doc is orchestrator B's area, moved there by the lead).

**Dependencies**:
- Phase 007 committed (`b74e3913d7`)
- Verified findings V09 and V24 (containment half) in `../research/research.md`

**Deliverables**:
- Live-run discovery in the containment library, used by every caller
- Regression tests pinning what an out-of-folder write records
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`snapshotOutOfScopeDirtyPaths` and `detectNewOutOfScopeViolations` read repo-wide `git status`. Fan-out excludes live sibling runs it discovers from their locks, but the four single-executor deep YAMLs pass no exclusions, so three research children running at once in one packet each recorded the others' writes as their own. In the same runs, three zips written to the repository root were recorded but left in place, and an untracked `specs/001-test-feature/` produced no containment record at all.

### Purpose
A loop is blamed only for writes no live run owns, and an out-of-folder write it cannot attribute is recorded every time.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ grep -o '.\{60\}cli-classifier.zip.\{60\}' 001-spec-kit-core/scratch/orchestrator-log.json 005-doctor-git-ci-runtime/scratch/orchestrator-log.json
001-spec-kit-core: Lead correction: the cli-classifier.zip containment quarantine entry seen after this iteration came from a sibling orchestrator executor running package_skill.
005-doctor-git-ci-runtime: Lead correction: the cli-classifier.zip containment quarantine entry seen after this iteration came from a sibling orchestrator executor running package_skill.
$ rg -n "snapshotOutOfScopeDirtyPaths\(\{ repoRoot, artifactDir \}\)" .skilled/commands/deep/assets/deep-research-auto.yaml
1344, 1445, 1547: no unattributableDirs passed
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Move live-run discovery from `fanout-run.cjs` into the containment library and apply it inside snapshot and detection, so every caller excludes live sibling runs.
- Keep repository-root and other unowned writes attributed and recorded.
- Pin with tests that a new out-of-scope file, including one in a new nested folder, is recorded.

### Out of Scope
- `package_skill.py` writing zips by default - moved to phase 016 by the lead.
- Auto-moving untracked out-of-scope files - another writer in a shared worktree could lose live work; decided in ADR-001.
- Rewriting the 047 research artifacts.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts` | Modify | Live-run discovery and its use in snapshot and detection |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | Call the library discovery instead of a local copy |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/write-containment.vitest.ts` | Modify | Live, stale and repo-root cases; nested new folder case |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A write inside a sibling phase folder that holds a live deep-loop lock is not a violation for another run, for single-executor and fan-out callers alike. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-002 | A write inside a folder whose lock is stale, and a write at the repository root, stay violations. |
| REQ-003 | A new untracked out-of-scope file, including one inside a newly created nested folder, produces a containment record. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The new containment tests pass and every existing containment, fan-out and call-site test still passes.
- **SC-002**: The runtime suite passes with no fewer tests than its 2880 baseline.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A stray write inside a live sibling folder goes unblamed | Med | Same trade fan-out already makes; only live locks exempt |
| Risk | Discovery cost on every snapshot | Low | Same scan bounds as fan-out (depth 6, 2000 dirs) |
| Dependency | `isStaleLoopLock` semantics | Low | Reused, not reimplemented |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: Discovery stays inside the existing fan-out scan bounds of depth 6 and 2000 directories per call.

### Security
- **NFR-S01**: N/A: no credential or permission path changes.

### Reliability
- **NFR-R01**: A discovery error never fails containment; it falls back to no extra exclusions.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: no sibling folder holds a lock, so behavior is unchanged.
- Maximum input: a packet larger than the scan bound exempts only the live runs found inside the bound.
- Failure path: an unreadable lock or directory is skipped, and the write stays attributed.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | One library, one runner, one test file |
| Risk | 16/25 | The guard every deep-loop dispatch runs through |
| Research | 8/20 | V24 folder miss has no confirmed cause |
| **Total** | **34/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Why `specs/001-test-feature/` left no record is UNKNOWN; REQ-003 pins that the library records such a write, and ADR-001 records the rest.
<!-- /ANCHOR:questions -->

---
