---
title: "Feature Specification: Node engine resolution contract"
description: "The code_mode server declares the interpreter range it needs, but nothing in the repository reads that declaration; this phase builds a resolver that answers the question from the manifest."
trigger_phrases:
  - "node engine resolver"
  - "engines.node resolution"
  - "abi compatible node lookup"
  - "interpreter candidate search"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Node engine resolution contract

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-08-28 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 4 |
| **Predecessor** | None |
| **Successor** | 002-launcher-shim |
| **Handoff Criteria** | The resolver returns the interpreter the host configs hardcode today, and returns nothing rather than a wrong one when the range cannot be satisfied |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the portable Node resolution specification.

**Scope Boundary**: A library and its tests. Nothing launches through it in this phase, and no host configuration changes.

**Dependencies**:
- `engines.node` in the code_mode server manifest, which already declares `>=24.0.0 <25.0.0`

**Deliverables**:
- A resolver module that maps a declared range plus a host to a satisfying interpreter path or nothing
- Unit tests covering satisfaction, rejection, and the no-candidate case

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The requirement is published in two places already: the server manifest declares `engines.node` as `>=24.0.0 <25.0.0`, and a postinstall check warns when the installing module ABI is not 137. Neither is consulted at launch. The launch path instead names one interpreter by absolute filesystem location, so the machine-independent fact is enforced by a machine-specific string.

### Purpose

Make the declared range answerable at runtime: given a manifest and a host, produce an interpreter that satisfies it, or produce nothing.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Parsing the subset of range syntax the manifest actually uses: a lower bound, an upper bound, and a major-version shorthand
- Enumerating candidate interpreters from the version managers and locations present on a developer machine
- Selecting the highest satisfying candidate deterministically, and reporting nothing when none satisfies

### Out of Scope

- A general semver implementation - the resolver reads one declared range from one manifest, and a dependency would outweigh the parsing it replaces
- Installing or building an interpreter - the resolver reports absence; acting on it belongs to the launcher and the diagnostic route
- Reading the compiled addon's ABI directly - the manifest range is the declared contract, and the ABI is downstream of it

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/bin/lib/node-engine-resolver.cjs` | Create | Range parsing, candidate enumeration, selection |
| `.opencode/bin/lib/node-engine-resolver.test.cjs` | Create | Unit tests for the three outcomes |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The range comes from the server manifest, never from a constant in the resolver | Changing `engines.node` in a fixture manifest changes which candidate the resolver selects, with no resolver edit |
| REQ-002 | An unsatisfiable range yields nothing rather than a nearest match | Given only out-of-range candidates, the resolver returns null and names the range it could not satisfy |
| REQ-003 | Selection is deterministic across runs on an unchanged host | Repeated calls on the same candidate set return the same path |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Candidate enumeration covers the version managers a contributor is likely to use | Candidates are drawn from the running interpreter, the search path, and the nvm, fnm and volta version directories |
| REQ-005 | A missing or unreadable candidate directory is not fatal | With every version-manager directory absent, the resolver still evaluates the running interpreter and the search path |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: On the machine that produced this packet, the resolver returns the same interpreter the six host configs name today.
- **SC-002**: Given a fixture host whose only interpreters are out of range, the resolver returns nothing and the test asserts the absence rather than a substitute.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A hand-written range parser accepts a range it should reject | High | The failure mode downstream is an uncatchable segfault, so the parser rejects any syntax it does not explicitly implement rather than guessing |
| Risk | Candidate enumeration shells out and inherits a slow or hostile environment | Medium | Enumeration reads directories and does not execute candidates during the search |
| Dependency | `engines.node` stays present in the server manifest | Low | Absent or unparseable declaration is treated as unsatisfiable, which fails closed |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Whether an operator override by environment variable belongs in the resolver or only in the launcher that consumes it.
- Whether selecting the highest satisfying candidate is right, or whether the lowest is safer for a range whose upper bound exists because newer versions crash.
<!-- /ANCHOR:questions -->

---
