---
title: "Feature Specification: Remediate LUNA review findings for the sk-prefix rename"
description: "Resolve two required and one advisory finding from the GPT-5.6-LUNA review by aligning the live sk-doc catalog, consolidating verification truth, and failing closed on unreadable freshness subtrees."
trigger_phrases:
  - "LUNA review remediation"
  - "sk prefix rename findings"
  - "route gold current state"
  - "leaf manifest unreadable subtree"
importance_tier: "critical"
contextType: "planning"
parent: "sk-doc/019-skill-routing-refactor/030-mode-sk-prefix-rename"
---
# Feature Specification: Remediate LUNA Review Findings For The Sk-Prefix Rename

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | `sk-doc/019-skill-routing-refactor/030-mode-sk-prefix-rename/010-luna-review-remediation` |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-07-29 |
| **Branch** | `sk-doc/0114-sk-doc-mode-sk-prefix-rename` |
| **Parent Spec** | [../spec.md](../spec.md) |
| **Source Review** | [../review/review-report.md](../review/review-report.md) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is phase 10 of the sk-prefix rename program. It follows the original closeout and the first post-review remediation pass, and is limited to the three active findings in the LUNA review.

**Scope boundary:** remediate `R1-P1-001`, `R3-P1-001`, and `R4-P2-001`; do not reopen the frozen rename map or add new mode renames.

**Dependencies:** the canonical `sk-doc/mode-registry.json`, frozen rename map, route-gold verification surfaces, generated metadata gates, and the review report's Planning Packet.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The live sk-doc feature catalog still publishes pre-rename workflow keys, while closeout documents disagree about the current route-gold and generated-metadata acceptance state. Separately, the fleet freshness gate suppresses recursive read failures and can report clean after omitting a subtree. [SOURCE: ../review/review-report.md:65-95]

### Purpose

Restore one canonical public mode inventory, one authoritative post-remediation verification record, and complete freshness traversal evidence so the rename program can be re-reviewed without contradictory or silently incomplete proof.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Replace all twelve stale `workflowMode` values in the root sk-doc feature catalog with canonical `sk-create-*` values while preserving `sk-create-skill-parent` as the shared-packet exception.
- Publish one current-state verification record that explicitly supersedes the phase 008 snapshot and links fresh route-gold and generated-metadata outputs.
- Change leaf-manifest discovery so any unexpected subtree read failure is surfaced and causes a nonzero gate result.
- Add a deterministic unreadable-subtree regression test and rerun catalog, route-gold, metadata, and packet validation gates.

### Out of Scope

- Renaming additional packets, commands, aliases, or historical review artifacts.
- Changing route-gold expectations beyond independently verified rename-related corrections.
- Hardening other recursive walkers unless evidence shows they participate in this gate's changed contract.

### Files Expected To Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/feature-catalog/feature-catalog.md` | Modify | Align the live mode inventory with `mode-registry.json`. |
| `.opencode/skills/sk-doc/feature-catalog/packet-authored-registry-routing/packet-authored-registry-routing.md` | Modify | Align the detailed live discriminator inventory. |
| `.opencode/skills/sk-doc/sk-create-skill/scripts/ci-leaf-manifest-freshness.cjs` | Modify | Fail closed or report traversal read failures. |
| `.opencode/skills/sk-doc/sk-create-skill/scripts/tests/ci-leaf-manifest-freshness.test.cjs` | Create | Cover an unreadable nested subtree deterministically. |
| `current-state-verification.md` | Create | Hold the authoritative rerun outputs and supersession statement. |
| `../spec.md` | Modify | Keep the phase map and current-state pointer coherent. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The live catalog uses only canonical sk-doc workflow keys. | Catalog inventory equals the twelve `workflowMode` values in `mode-registry.json`, including `sk-create-skill-parent`. |
| REQ-002 | Current verification truth has one authority. | A dated record explicitly supersedes the phase 008 snapshot and links exact route-gold and generated-metadata rerun outputs. |
| REQ-003 | Freshness traversal cannot silently omit an unexpected subtree. | Any recursive `readdirSync` failure outside intentional exclusions is included in output and makes `run()` return nonzero. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The catalog and registry remain drift-free. | The catalog package validator and a direct registry/catalog inventory comparison pass. |
| REQ-005 | Unreadable traversal has regression coverage. | A test injects a nested read failure, verifies the path is reported, and verifies a failing exit status. |
| REQ-006 | Packet evidence is internally consistent. | Parent, phase 008, phase 009, and this phase all point readers to the new record as the current state without rewriting historical observations. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **Given** the root feature catalog and registry, **When** their workflow keys are compared, **Then** all twelve values match exactly.
- **Given** a nested skills subtree that cannot be read, **When** the freshness gate walks the fleet, **Then** it reports the skipped path and exits nonzero.
- **Given** normal readable fixtures, **When** the freshness test suite and fleet gate run, **Then** current fresh/stale behavior remains unchanged.
- **Given** the phase 008 and phase 009 records, **When** a reviewer looks for current acceptance evidence, **Then** one dated record explicitly supersedes the old snapshot and identifies the rerun artifacts.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Route-gold and generated-metadata gate entrypoints | Current-state record cannot be authoritative without fresh outputs | Identify and run the same maintained entrypoints used by the prior remediation, then record command, timestamp, and result. |
| Risk | Platform permissions behave differently under elevated CI users | A chmod-only test may not produce `EACCES` | Inject or mock the read failure at the filesystem boundary rather than relying only on mode bits. |
| Risk | Failing on expected exclusions creates noise | Gate could reject `node_modules` or `.git` traversal | Preserve explicit exclusions before directory reads and fail only on attempted, unexpected reads. |
| Risk | Updating historical prose erases audit context | Review lineage becomes harder to reconstruct | Keep phase 008/009 observations intact and add explicit supersession pointers instead of rewriting old results. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability

- **NFR-R01**: Every attempted manifest-bearing subtree is either examined or represented in a failure result.
- **NFR-R02**: Text and JSON output identify traversal failures deterministically using repo-relative paths where possible.

### Maintainability

- **NFR-M01**: The test uses isolated temporary fixtures and restores mocked filesystem behavior after each case.
- **NFR-M02**: The current-state record names maintained verification entrypoints rather than copying transient console prose alone.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Top-level skills directory missing or not a directory: retain exit code 2.
- Nested subtree read throws: report the path and return exit code 1.
- Multiple nested reads fail: report every encountered path in stable order.
- Readable tree contains no manifests: preserve the existing zero-manifest result unless another contract rejects it.
- JSON output requested: include traversal errors in structured output without mixing diagnostics into invalid JSON.
- The shared `sk-create-skill-parent` mode remains a distinct key mapped to the `sk-create-skill` packet.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | Three implementation/documentation workstreams across code, tests, and packet evidence. |
| Risk | 14/25 | CI false-green behavior and release evidence integrity. |
| Research | 10/20 | Existing findings are precise, but maintained verification entrypoints require confirmation. |
| **Total** | **39/70** | **Level 2 is appropriate; no new phase decomposition required.** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

None. The LUNA Planning Packet and repository evidence bound all three workstreams sufficiently for autonomous planning.
<!-- /ANCHOR:questions -->
