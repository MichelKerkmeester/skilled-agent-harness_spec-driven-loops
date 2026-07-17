---
title: "Feature Specification: reference checker and disposition ledger (032 phase 005.002)"
description: "The migration needs a whole-repository checker that follows every mapped path through code, docs, configs, registries, and symlinks, while recording a disposition for every rename and dynamic require, source, or glob site."
trigger_phrases:
  - "whole-repo reference checker"
  - "rename disposition ledger"
  - "dynamic require source glob audit"
  - "reference checker completeness"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/005-rename-and-reference-tooling"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/005-rename-and-reference-tooling/002-reference-checker-and-disposition-ledger"
    last_updated_at: "2026-07-14T17:28:50Z"
    last_updated_by: "codex"
    recent_action: "Authored the whole-repo reference checker and ledger phase contract"
    next_safe_action: "Implement the checker against phase 001's semantic map output"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The checker scans tracked files and symlink entries across code, docs, configuration, registries, and path-valued metadata."
      - "JSON/YAML/TOML keys and code identifiers are not rewritten; path-valued fields are checked as references."
      - "Every dynamic require, source, and glob site receives an explicit ledger disposition."
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Reference Checker and Disposition Ledger

> Phase adjacency under the 032 parent (grouping order, not a runtime dependency): predecessor `001-rename-engine`; successor `003-fixture-corpus-and-dry-run-harness`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/020-hyphen-naming-convention/005-rename-and-reference-tooling/002-reference-checker-and-disposition-ledger |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-doc |
| **Origin** | Child phase 002 of the 032 rename-and-reference-tooling program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Renaming a path can break references that a simple text search cannot resolve: JavaScript and TypeScript module rules add
extensions and index files, shell commands source paths, configuration stores paths as values, registries encode entrypoints,
and symlinks carry references in their targets. Dynamic `require`, `source`, and glob expressions cannot always be resolved
statically, so they need an explicit disposition rather than an implicit pass.

This phase defines a whole-repository checker that evaluates every reference against the semantic rename map and writes a
disposition ledger. The checker must fail on an empty scan, unresolved or ambiguous references, and undispositioned dynamic
sites; it must preserve the naming boundary by checking path values without treating identifiers or data keys as filenames.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Tracked-file and symlink enumeration across the repository, with a hard failure when zero files are scanned.
- Reference extraction and resolution for JS/TS modules, Markdown links, JSON/YAML/TOML path values, shell sourcing and
  executable paths, registries, manifests, and symlink targets.
- Map-aware before/after checking that recognizes source and target paths without silently accepting an unresolved old path.
- A ledger row for every rename-map entry and every dynamic `require`, `source`, or glob site, including decision, rationale,
  status, reference kind, location, and evidence.
- Exemption-aware reporting for Python files and package directories, vendored/third-party trees, generated or lockfile output,
  tool-mandated names, test-runner magic, and frozen surfaces.

### Out of Scope
- Performing renames or rewriting references; the checker is read-only and phase 001 owns rename execution.
- Changing code identifiers, JSON/YAML/TOML keys, frontmatter fields, or database columns.
- Deciding the final inventory or dependency-closure map; phase 006 owns the frozen map.
- The shared fixture corpus and dry-run orchestration; phase 003 owns end-to-end harness coverage.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The checker scans the whole tracked repository, including symlink entries, and fails on zero scanned files. | A scan report lists the files and symlinks considered; an empty or misconfigured root exits non-zero instead of passing vacuously. |
| REQ-002 | The checker resolves mapped references across code, docs, configs, registries, shell paths, and symlink targets. | Planted references in JS/TS, Markdown, JSON/YAML/TOML values, shell, registry, and symlink fixtures resolve to the expected source or target state. |
| REQ-003 | The checker distinguishes path values from identifiers and data keys. | A snake_case code identifier, JSON/YAML/TOML key, or frontmatter field is not reported as a filesystem reference; a path-valued field is checked. |
| REQ-004 | The ledger records every rename-map entry with its decision, rationale, status, and evidence. | The ledger has one reconciled row for each map entry, including exempt, frozen, generated, tool-mandated, already-resolved, and updated decisions. |
| REQ-005 | Every dynamic `require`, `source`, and glob site is dispositioned. | Static resolution, manual disposition, or explicit out-of-scope rationale is recorded for every dynamic site; an undispositioned site fails the run. |
| REQ-006 | Unresolved and ambiguous references fail the gate. | The checker returns non-zero for a missing target, ambiguous module resolution, stale source-only reference, or invalid ledger status. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The checker finds and classifies every reference to a mapped path across the supported repository surfaces.
- **SC-002**: The ledger is complete, evidence-bearing, and contains no undispositioned dynamic site.
- **SC-003**: Empty scans, unresolved targets, ambiguous resolutions, and invalid dispositions fail deterministically.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The phase inherits the 032 risks of broken imports, exemption leakage, over-broad text replacement, and concurrent worktrees.
Its specific risks are false negatives in dynamic expressions, false positives on identifiers or data keys, unsafe symlink
traversal, and a ledger that reports rows without proving scan coverage.

Mitigations are resolver-specific adapters, a tracked-file manifest, explicit dynamic-site rows, path-valued-field rules,
symlink-target inspection without executing targets, a zero-scan hard failure, and status validation against the semantic map
from `001-rename-engine`. The canonical exemption boundary remains `001-convention-policy-and-scope/decision-record.md`.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. Resolver implementations may choose their parser libraries, but they must expose the reference kind, source
location, candidate targets, final resolution, and evidence fields required by the ledger contract.
<!-- /ANCHOR:questions -->
