---
title: "Feature Specification: Resolution hardening"
description: "A review of the shipped packet found the search-path branch of the resolver dead on any real host, four completion claims unsupported by their own summary, and a stale version floor still enforced by the installer; this phase closes them."
trigger_phrases:
  - "resolver search path dead branch"
  - "node interpreter probe fallback"
  - "code mode launcher existence check"
  - "resolution hardening"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Resolution hardening

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-08-29 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 5 |
| **Predecessor** | 004-install-and-doctor |
| **Successor** | None |
| **Handoff Criteria** | The resolver finds an in-range interpreter that only the search path knows about, and no completion claim in the packet outruns its own evidence |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the portable Node resolution specification.

**Scope Boundary**: The resolver's candidate enumeration, the two surfaces that register or diagnose the launcher, the two process sweepers, and the packet's own completion records. The launcher's own decision logic is unchanged.

**Dependencies**:
- The resolver, launcher, cutover and diagnosis delivered by phases 001 through 004

**Deliverables**:
- Candidate enumeration that works against real directory entries rather than only against test fixtures
- A version answer for interpreters whose path does not carry one
- Existence checks for the file every host now launches
- Completion records reconciled with what was actually executed

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The packet shipped a resolver whose search-path branch cannot return a candidate on a real host. Enumeration requires each entry named `node` to pass a directory test, so `fs.readdirSync` with file types discards every actual binary. The two tests covering that branch supply directory entries as plain strings, a shape the default host access never produces, so the branch passes its tests and does nothing in production. A second condition stacks on top: a candidate's version is read from its own path, so an interpreter installed anywhere without a version in its path is unreadable even once the first condition is fixed.

The consequence is precise. A contributor whose default interpreter is out of range, and whose in-range interpreter sits outside the three version-manager layouts, is refused a launch that should have succeeded. That is the portability the packet exists to deliver, and the install guide promises it in as many words: a host-wide Node 24 is not required.

Three smaller defects share the same shape - a claim that outran what was checked. The installer still enforces a version floor of 18, the value the phase that touched it identified as wrong in both directions and corrected everywhere except the code that acts on it. Nothing verifies that the launcher file exists, though it is now the command every host runs and it lives outside the skill tree that installs it. A test pins the resolver's answer to one machine's absolute interpreter path, reintroducing inside the gate the coupling the packet removed from six configs.

Finally, four completion items in the previous phase assert that every installer was executed against a scratch configuration, while the implementation summary beside them records that it was not.

### Purpose

Make the resolver answer correctly on hosts it currently refuses, put an existence check behind the launch path, and bring the packet's completion records back in line with what was actually run.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Candidate enumeration: the directory-entry test, symlink resolution, and a version answer for interpreters whose path carries none
- The tests covering that branch, rebuilt on real filesystem entries so the failure cannot recur unseen
- The installer's prerequisite check and its verification step
- The diagnostic route's code_mode checks
- The two scripts that classify this server's processes
- The packet's own completion records where they conflict with their evidence

### Out of Scope

- The launcher's decision logic, signal handling and exit-status contract - the review found no defect there and this phase does not reopen it
- The two retained absolute interpreter paths in the Codex configuration - phase 003 proved one load-bearing and left the other on inconclusive evidence; neither conclusion changed
- The 15 failing tests in the compiled-route manifest suite - they are attributable to an unrelated commit that rewrote the sk-code hub registry, and are recorded here as a measured baseline rather than repaired

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/bin/lib/node-engine-resolver.cjs` | Modify | Accept real directory entries, resolve symlinks, probe an interpreter that carries no version in its path |
| `.opencode/bin/lib/node-engine-resolver.test.cjs` | Modify | Drive the search-path branch through real filesystem entries; drop the machine-specific assertion |
| `.opencode/skills/mcp-code-mode/scripts/install.sh` | Modify | Gate on the declared range instead of a stale floor, and verify the launcher exists |
| `.opencode/commands/doctor/scripts/mcp-doctor.sh` | Modify | Report a missing launcher before the host discovers it |
| `.opencode/scripts/session-cleanup.sh` | Modify | Classify the launcher alongside its two sibling launchers |
| `.opencode/scripts/orphan-mcp-sweeper.sh` | Modify | Classify the launcher alongside its two sibling launchers |
| `../002-launcher-shim/implementation-summary.md` | Modify | Correct a sweeper count the repository does not support |
| `../004-install-and-doctor/tasks.md` | Modify | Reconcile installer-execution claims with the evidence |
| `../004-install-and-doctor/implementation-summary.md` | Modify | Record that the installer run was completed here |
| `../001-resolution-contract/spec.md` | Modify | Record the answers the implementation settled |
| `../spec.md` | Modify | Record the answers the implementation settled and add this phase to the map |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The search path yields candidates on a real host | With a real directory containing a real interpreter on the search path, enumeration returns it using the default host access, not an injected fixture |
| REQ-002 | An interpreter whose path carries no version still gets one | A candidate is resolved through its symlink target, and asked directly for its version when neither path carries one |
| REQ-003 | The regression cannot recur unseen | The search-path tests exercise real filesystem entries, so reintroducing the directory test fails them |
| REQ-004 | Probing never widens what a launch would already trust | Only a candidate that could itself be selected and executed is probed, with a fixed argument list, no shell, and a bounded timeout |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The installer gates on the declared range, not a fixed floor | An installer run on a host that cannot satisfy the range fails prerequisites and names the range |
| REQ-006 | The file every host launches is checked to exist | Both the installer and the diagnostic route fail when the launcher is absent |
| REQ-007 | No test pins the resolver to one machine | The real-host test asserts that the answer satisfies the declared range, and passes on a host with a different interpreter layout |
| REQ-008 | Completion records match their evidence | Every installer-execution claim in the packet is either executed and evidenced, or corrected |

### P2 - Optional

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-009 | The launcher is classified like its siblings | Both sweepers name the launcher alongside the two sibling launchers they already classify |
| REQ-010 | Documented counts match the repository | The sweeper count in the packet's records equals what a scan finds |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: An interpreter reachable only through the search path, with no version anywhere in its path, is selected when it satisfies the declared range.
- **SC-002**: The exact experiment that exposed the dead branch - a real in-range interpreter planted on the search path - returns that interpreter after the fix and returned nothing before it.
- **SC-003**: No completion item in the packet asserts an execution that did not happen.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Executing a candidate to read its version runs a binary found on the search path | Medium | Only candidates that could themselves be selected and launched are probed, so probing executes nothing a launch would not already execute; the call takes a fixed argument list, no shell, ignored input, and a bounded timeout |
| Risk | Probing turns enumeration into a slow operation on a long search path | Medium | The version is read from the path first, then from the symlink target, and only then by asking the interpreter; probes are deduplicated by real path and capped |
| Risk | Adding the launcher to the sweepers widens what they may terminate | Medium | The launcher exits on its own when its child closes, so the pattern only makes an already-terminating process identifiable; both sweepers match by substring and neither gains a new termination rule |
| Dependency | The resolver stays the single reader of the declared range | Low | The installer and diagnosis both call it rather than restating a version |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None. The two questions this phase inherited were settled by what shipped and are recorded in the parent spec and in the phase 001 spec.
<!-- /ANCHOR:questions -->

---
