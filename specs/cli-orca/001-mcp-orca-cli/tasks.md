---
title: "Tasks: Port Orca CLI into mcp-tooling"
description: "Completed specification-preparation tasks and the authorized implementation continuation for the Orca workflow packet, with operator-gated follow-up clearly separated."
trigger_phrases:
  - "Orca implementation tasks"
  - "mcp-orca verification checklist"
  - "Orca routing task breakdown"
  - "Orca handoff"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Port Orca CLI into mcp-tooling

<!-- SPECKIT_LEVEL: 3 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

The checkboxes below track specification preparation and the authorized implementation continuation. Operator-gated state-changing checks remain explicitly deferred rather than reported as completed.
<!-- /ANCHOR:notation -->

## Phase 1: Specification Setup

- [x] T001 Confirm the new flat Level 3 packet boundary and target hub location (`spec.md`, `decision-record.md`).
- [x] T002 Record the official Orca source, installation path, discovery-stub behavior, executable resolution, and live-guide dependency (`research/research.md`).
- [x] T003 [P] Survey the mcp-tooling hub, nested-packet contract, advisor identity, and cli-pi dispatch contract (`research/research.md`).

## Phase 2: Specification Design

- [x] T004 Define the problem, purpose, scope, requirements, unknowns, safety boundaries, and success criteria (`spec.md`).
- [x] T005 Define the implementation leaf, hub registration, two-stage routing, graph identity, generated-manifest, playbook, benchmark, and changelog surfaces (`plan.md`).
- [x] T006 Record the flat Level 3 and evidence-gated conservative decisions with alternatives and rollback (`decision-record.md`).
- [x] T007 Add the bounded implementation sequence, dependency graph, critical path, and test strategy (`plan.md`).

## Phase 3: Specification Verification

- [x] T008 Replace scaffold placeholders across the packet and remove unsupported assumptions (`spec.md`, `plan.md`, `tasks.md`, `decision-record.md`, `implementation-summary.md`, `research/research.md`).
- [x] T009 [P] Reconcile generated packet metadata with the final source documents (`description.json`, `graph-metadata.json`).
- [x] T010 [P] Record the read-only cli-pi review as supplemental evidence and distinguish it from local confirmation (`research/research.md`).
- [x] T011 Run strict packet validation and record the explicit result (`acceptance-criteria.md`, `implementation-summary.md`).
- [x] T012 Inspect the final scoped diff, whitespace, comments, and scratch directory (`implementation-summary.md`).

## Implementation Continuation and Remaining Operator Gates

The authorized continuation completed the following implementation tasks:

- [x] I001 Run the Orca executable, schema, version-matched guide, conditional-reference, and runtime-status preflight; record the CLI-only/no-native-MCP result (`research/research.md`, benchmark report).
- [x] I002 Create and package-check `.pi/skills/mcp-tooling/mcp-orca-cli` with verified command and safety details.
- [x] I003 Update the registry, hub-router, root router, graph identity, human docs, playbooks, benchmark evidence, and changelogs as one coordinated change.
- [x] I004 Regenerate the hub leaf manifest and pass parent-skill, source-routing, advisor, package, and strict-spec checks.
- [x] I005 Reconcile the packet documents with the delivered implementation and record the compiled-routing fallback boundary.

## Phase 4: sk-doc Conformance Remediation

The operator-directed conformance pass completed the following leaf-alignment tasks:

- [x] C001 Re-shell the four leaf references to the skill-reference template (full frontmatter, short intro, required OVERVIEW, numbered ALL-CAPS H2s, `---` dividers, HVR-clean prose) and pass the reference validator on every file.
- [x] C002 Restructure the leaf README to the skill README template (dividers, four-row AT A GLANCE, problem-first OVERVIEW, narrative hook, HVR-clean prose) and pass the readme validator with zero issues.
- [x] C003 Restructure the manual-testing playbook into the split-package shape (root directory plus six category folders and ten per-feature scenario files with the persistence contract) and pass the playbook and playbook-feature validators.
- [x] C004 Apply the 0.1.0.0 first-version identity: rename the changelog entry to `v0.1.0.0.md` and set every leaf frontmatter version to 0.1.0.0, matching the mcp-notion first-version convention.
- [x] C005 Record the remediation in this packet, rerun the leaf, hub, and strict-spec gates, and dispatch the read-only cli-devin review of the restructured docs.

Remaining operator-gated checks are not failures and are not claimed as performed: controlled repository mutation, disposable terminal/browser driving, authentication, publishing, skill sharing, and compiled-route sync/finalize.

## Phase 5: Residual Alignment (0.1.1.0)

The residual-closure pass recorded the following:

- [x] C006 Restructure `INSTALL-GUIDE.md` to the install-guide contract: full frontmatter block, required OVERVIEW, PREREQUISITES, and INSTALLATION sections, `---` dividers, and HVR-clean prose (install-guide validator count 7 to 0).
- [x] C007 Bring `SKILL.md` to the skill contract: ten `---` section dividers, closed numbering gap, removal of the stray "Workflow lanes" heading, and a voice pass over the serial-comma clauses and em dashes (skill validator count 11 to 0).
- [x] C008 Voice-pass the root playbook, the ten scenario contract bullets, and the released 0.1.0.0 note, cut the 0.1.1.0 release identity with its changelog entry, and rerun the leaf, hub, and strict-spec gates.

## Completion Criteria for This Specification Packet

- [x] All specification-preparation tasks are marked `[x]` after the final checks run.
- [x] No `[B]` blocked tasks remain.
- [x] `acceptance-criteria.md` has every row `Met`, `Waived`, or `Superseded` with evidence.
- [x] The conformance-remediation criteria AC-009 through AC-013 are `Met` with validator and gate evidence.
- [x] `validate.sh --strict` prints an explicit `RESULT: PASSED`.
- [x] The implementation summary states what was delivered, what remains operator-gated, and why compiled serving is deferred.

## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decision Records**: See `decision-record.md`
- **Acceptance Gate**: See `acceptance-criteria.md`
- **Research Evidence**: See `research/research.md`

<!-- ANCHOR:verification -->
## Verification Checklist

### Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot close the specification packet until complete |
| **[P1]** | Required | Must complete or receive an explicit deferral decision |
| **[P2]** | Optional | May defer with a documented reason |

### Pre-Implementation

- [x] CHK-001 [P0] Requirements, non-goals, and evidence gates are documented in `spec.md`.
- [x] CHK-002 [P0] Technical approach, affected surfaces, rollback, and tests are defined in `plan.md`.
- [x] CHK-003 [P1] Official source, local conventions, and cli-pi review evidence are identified in `research/research.md`.

### Specification Quality

- [x] CHK-010 [P0] The planning packet itself contains no implementation code; the production leaf and hub integration are tracked in the authorized continuation evidence.
- [x] CHK-011 [P0] No unsupported Orca command, backend, credential, or mutation claim is presented as confirmed.
- [x] CHK-012 [P1] Comment-hygiene and untrusted-content rules are stated for the implementation.
- [x] CHK-013 [P1] Existing browser and mcp-code-mode boundaries are preserved in scope.

### Evidence and Acceptance

- [x] CHK-020 [P0] Every acceptance row names an observable document, local convention, or command result.
- [x] CHK-021 [P0] The official source inventory separates confirmed facts, inference, and unresolved facts.
- [x] CHK-022 [P1] Positive, negative, browser, mutation, generated-state, and missing-binary verification cases are specified.
- [x] CHK-023 [P1] The bounded cli-pi return is treated as a hypothesis and checked against local source of truth.

### Packet Organization

- [x] CHK-030 [P1] Scratch contains no generated research output beyond its keep file.
- [x] CHK-031 [P1] Packet documents use the selected flat Level 3 structure and contain no scaffold placeholders.

### Level 3 Architecture

- [x] CHK-100 [P0] Architecture decisions are documented in `decision-record.md`.
- [x] CHK-101 [P1] Each decision has a status, date, context, alternatives, consequences, and rollback.
- [x] CHK-102 [P1] The rejected phase-parent shape and unsafe assumption-based approach have rationale.
- [x] CHK-103 [P2] The follow-on migration/rollback path is documented in `plan.md`.

### Level 3 Documentation

- [x] CHK-140 [P1] `spec.md`, `plan.md`, `tasks.md`, `decision-record.md`, `acceptance-criteria.md`, `implementation-summary.md`, and research evidence are synchronized.
- [x] CHK-141 [P1] Delivered and remaining leaf, hub, routing, advisor, manifest, playbook, benchmark, and changelog surfaces are named.
- [x] CHK-142 [P2] User-facing install and safety documentation requirements are included in the future packet plan.

## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | 7 |
| P1 Items | 11 | 11 |
| P2 Items | 2 | 2 |

**Verification Date**: 2026-09-19
<!-- /ANCHOR:verification -->
