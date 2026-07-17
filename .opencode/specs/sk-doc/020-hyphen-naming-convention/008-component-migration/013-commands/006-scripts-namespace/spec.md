---
title: "Feature Specification: scripts command namespace naming (032 phase 008/013/006)"
description: "The shared command-reference checker namespace is already kebab-clean. This phase records the audit, preserves the intentionally broken negative fixture, and accepts only evidence that no in-scope filesystem rename is required."
trigger_phrases:
  - "scripts command namespace naming"
  - "command reference checker naming audit"
  - "scripts surface kebab audit"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/013-commands"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/013-commands/006-scripts-namespace"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored scripts namespace docs"
    next_safe_action: "Audit the scripts surface against the frozen map"
    blockers: []
    key_files:
      - ".opencode/commands/scripts/README.md"
      - ".opencode/commands/scripts/validate-command-references.cjs"
      - ".opencode/commands/scripts/fixtures/broken-command-refs.yaml"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The scripts and fixtures directory names are already kebab-case."
      - "The broken fixture is a negative-test contract, not a live reference set to repair."
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: scripts command namespace naming

> Phase adjacency under the commands component parent: predecessor `005-memory-namespace`; successor `007-speckit-namespace`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/020-hyphen-naming-convention/008-component-migration/013-commands/006-scripts-namespace |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-doc |
| **Origin** | Phase 006 of the commands-surface migration under the 032 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The scripts namespace is part of the commands filesystem surface, so it must be checked against the program's canonical kebab-case rule. The live directory and its four tracked files already use compliant names, but the negative fixture contains deliberately dead underscore-bearing path text. Treating that fixture as a live migration target would destroy the self-test contract.

### Purpose

Audit the scripts namespace, classify every filesystem name and underscore-bearing fixture value, preserve the negative-test contract, and produce evidence that no in-scope physical rename is required.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- `.opencode/commands/scripts/README.md`
- `.opencode/commands/scripts/fixtures/README.md`
- `.opencode/commands/scripts/fixtures/broken-command-refs.yaml`
- `.opencode/commands/scripts/validate-command-references.cjs`
- The `scripts/` and `scripts/fixtures/` directory basenames.
- The frozen-map classification of every filesystem name and path-bearing fixture value.

### Out of Scope

- Rewriting the fixture's intentionally broken values or altering checker behavior.
- Command-family assets owned by phases 001–005 and 007–009.
- Checker redesign, fixture redesign, or code/script modification made only to manufacture a rename.
- Python scripts and Python package directories, tool-mandated names, generated output, and frozen surfaces covered by the program exemptions.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Inventory every tracked file and directory in the scripts namespace | The inventory covers the four files, the `scripts/` and `scripts/fixtures/` basenames, and records one policy disposition for each. |
| REQ-002 | Prove the scripts subtree has no in-scope snake_case filesystem name | The name scan reports zero non-exempt snake_case basenames under `.opencode/commands/scripts/`. |
| REQ-003 | Preserve the negative fixture contract | `broken-command-refs.yaml` retains its exact deliberately broken agent, skill-asset, and runtime-directory values. |
| REQ-004 | Verify checker behavior without redesign | The documented self-test reports the expected three broken fixture classes and the default live-tree scan exits cleanly. |
| REQ-005 | Classify every underscore-bearing fixture occurrence | Each occurrence is recorded as negative-test data or a live filesystem reference; unexpected live references identify an owner and remain a rollup blocker rather than expanding this phase. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The frozen map has one row for every tracked file and directory in the namespace.
- **SC-002**: The map records zero physical renames and explains why the fixture's underscore text is not a filesystem name.
- **SC-003**: The checker self-test passes with its expected negative fixture behavior and the live scan remains clean.
- **SC-004**: No file outside this phase's evidence and scoped closure is changed.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk or Dependency | Impact | Mitigation |
|--------------------|--------|------------|
| A reviewer mistakes fixture content for a live path | The negative-test contract could be destroyed. | Pin the fixture's purpose and preserve its exact values. |
| A no-op phase is accepted without evidence | The commands rollup could miss a residual rename. | Require the full inventory, name scan, self-test output, and path-scoped diff. |
| Checker behavior is changed while proving naming compliance | The self-test could hide real naming failures. | Keep implementation changes out of scope and compare behavior to BASE. |
| Program policy and exemptions | Misclassification could rename Python, tool-mandated, generated, or frozen names. | Use `001-convention-policy-and-scope/decision-record.md` as the authority. |
| Commands rollup gate | Missing or unresolved evidence blocks subtree acceptance. | Hand the no-rename disposition and receipts to `010-commands-gate`. |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

No design question is open. An unexpected snake_case basename or a reference that cannot be classified under the program exemptions is a blocker for the rollup gate, not permission to alter the checker in this phase.
<!-- /ANCHOR:questions -->
