---
title: "Feature Specification: Shared package post-remediation cleanup"
description: "Close what child 009 left behind in the shared package: a main field pointing at a deleted module, a database cluster and a type with no consumer, a scoring module only tests read, stale fixture rows and comments, a reader table that omitted readers, and two utilities with no tests."
trigger_phrases:
  - "shared package post remediation cleanup"
  - "dangling main field"
  - "profile database cluster removed"
  - "folder scoring removed"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Shared package post-remediation cleanup

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-07 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 15 of 15 |
| **Predecessor** | 003-shared-package-utilization |
| **Successor** | None |
| **Handoff Criteria** | Every row of lane 003's round-two section in `research/confirmed-findings.md` is fixed, kept with a reason or recorded, and the shared, CLI and runtime gates agree |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 15** of the spec-kit simplification research program: the remediation child for the shared-package lane's second round.

**Scope Boundary**: the shared package and its README, the two runtime tests and one CLI re-export that read its removed or moved symbols, and the sk-doc README-verdict baseline rows for READMEs this program removed.

**Dependencies**:
- Lane 003's round-two synthesis and its census section
- Child 009, whose removal this round verified

**Deliverables**:
- The dangling `main` field gone, the ownerless database cluster and type gone, the test-only scoring module gone with its tests and comment
- The reader table computed from the code, the socket file name held by a test, tests for the two untested utilities, the stale comments and fixture rows corrected
- Recorded decisions for the live-half duplication the lane found
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Child 009 removed the shared package's dead half and left its edges uneven. The package still declared `main: dist/index.js` after the module behind it was deleted, so a bare resolve would fail on a clean build. A five-function database cluster survived in the profile module because its only caller had been the deleted paths module; an extended profile type had no consumer; a folder-scoring module survived with two tests as its only readers after the CLI that used it left. The README's reader table omitted three files that read the variables it listed, a test comment named a removed test, a CLI module re-exported a shared helper for one test, the socket file name lived in three places with no assertion, two utilities had no tests, and the sk-doc README baseline still expected verdicts for two READMEs this program removed.

### Purpose
The shared package's manifest, exports, modules, README and tests describe and exercise the package that exists after the decommission, and the duplication that remains in its live half is a recorded decision with a stated reason.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The manifest, module, type and test removals and the README computation
- The socket-name assertion and the two new utility tests
- The baseline rows and the CLI re-export

### Out of Scope
- Merging the two live Ollama implementations or the eight root resolvers: recorded decisions with reasons in the census
- The 36 remaining sk-doc parity mismatches under sk-design and fixture READMEs, which belong to that skill's validator drift
- The factory's database candidate scan, which is live and reads the advisor's active embedder

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `shared/package.json` | Modify | `main` removed; test globs match existing directories |
| `shared/embeddings/profile.ts`, `shared/types.ts` | Modify | Database cluster and extended type removed |
| `shared/scoring/{folder-scoring.ts,README.md}`, `runtime/tests/{folder-scoring-overflow,unit-folder-scoring-types}.vitest.ts` | Delete | Test-only module and its tests |
| `runtime/lib/utils/index-scope.ts`, `runtime/tests/index-scope.vitest.ts` | Modify | Comments no longer cite the removed module |
| `shared/ipc/socket-server.ts`, `shared/ipc/socket-server.test.ts` | Modify | Exported socket file name held across the two bin scripts |
| `shared/utils/jsonc-strip.test.ts`, `shared/context-types.test.ts` | Create | Script-style tests |
| `shared/predicates/boolean-expr.test.ts` | Modify | Comment |
| `runtime/cli/core/tree-thinning.ts`, `runtime/cli/tests/tree-thinning.vitest.ts` | Modify | Re-export removed; the test imports the shared module |
| `shared/README.md` | Modify | Reader table computed from the code; config row; structure block |
| `.opencode/skills/sk-doc/scripts/tests/code-folder/baseline-readme-verdicts.json` | Modify | Two rows for removed READMEs dropped |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The shared package builds from clean and its test lane passes with the two new tests included |
| REQ-002 | The CLI rebuilds and the runtime builds with the removed symbols gone, and dist freshness reports every output fresh |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | Every reader column in the README names exactly the files that read the group's variables |
| REQ-004 | No file in the skill outside changelogs names the removed module, cluster or type |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Shared build and test, CLI rebuild and check, runtime build, dist freshness, the tree-thinning and index-scope suites all pass
- **SC-002**: The sk-doc validator exits zero on the README
- **SC-003**: The parity test no longer names either removed README
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Removing `main` changes how a bare import resolves | A bare `@spec-kit/shared` import that worked by accident fails | It could not have worked: the file it named does not exist; no importer uses the bare specifier |
| Risk | The profile cluster had a consumer the search missed | A build breaks | Shared, CLI, runtime and the advisor's re-export paths were built or searched; none names it |
| Dependency | The runtime dist must be rebuilt | Stale dist warning | Rebuilt after the test removals |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Two script-style tests add milliseconds to the shared lane
- **NFR-P02**: No runtime path changed

### Security
- **NFR-S01**: No credential or path handling changed
- **NFR-S02**: The socket test reads two repository files, never the socket

### Reliability
- **NFR-R01**: A renamed socket file in either bin script now fails the shared lane
- **NFR-R02**: Every gate result was read from its output
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: the JSONC stripper returns an empty string for an empty document
- Maximum length: not applicable
- Invalid format: an unknown context type resolves to null rather than a default

### Error Scenarios
- External service failure: not applicable
- Network timeout: not applicable
- Concurrent access: the other session's working-tree edits stayed out of the private index

### State Transitions
- Partial completion: manifest, modules, tests and documents ship in one commit
- Session expiry: not applicable
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Four deletions, two new tests, eleven edits |
| Risk | 8/25 | Removals confirmed by builds across three packages |
| Research | 6/20 | Every row re-checked; two overturned the lane's framing |
| **Total** | **26/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The Ollama and root-resolver decisions live in the lane's confirmed-findings document.
<!-- /ANCHOR:questions -->
