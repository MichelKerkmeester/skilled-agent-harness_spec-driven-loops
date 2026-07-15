---
title: "Feature Specification: fixture corpus and dry-run harness (017 phase 005.003)"
description: "The rename engine and reference checker need representative, repeatable evidence before a real migration run. This phase builds disposable fixtures and a dry-run harness for semantic names, exemptions, collisions, references, idempotency, rollback, and empty scans."
trigger_phrases:
  - "fixture corpus dry-run harness"
  - "rename tooling fixtures"
  - "pre-migration dry run"
  - "rename checker harness"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/005-rename-and-reference-tooling"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/005-rename-and-reference-tooling/003-fixture-corpus-and-dry-run-harness"
    last_updated_at: "2026-07-14T17:28:50Z"
    last_updated_by: "codex"
    recent_action: "Extended harness coverage to the reference-rewrite executor drift and CAS cases"
    next_safe_action: "Implement disposable fixtures for the engine, checker, and executor contracts"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The harness creates disposable repositories and does not execute the real repo-wide migration."
      - "Fixtures cover the naming exemption boundary as well as positive, negative, collision, reference, and recovery cases."
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Fixture Corpus and Dry-Run Harness

> Phase adjacency under the 005 parent (grouping order, not a runtime dependency): predecessor `002-reference-checker-and-disposition-ledger`; successor `004-reference-rewrite-executor`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/019-hyphen-naming-convention/005-rename-and-reference-tooling/003-fixture-corpus-and-dry-run-harness |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-doc |
| **Origin** | Child phase 003 of the 017 rename-and-reference-tooling program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The rename engine, reference checker, and reference-rewrite executor operate at a high blast radius, but a real repository run is
not an acceptable first test. Without fixtures, the toolchain can miss leading or double underscores, case-fold/NFC collisions,
symlink and executable semantics, policy exemptions, dynamic references, a stale rewrite over a drifted blob, or rollback
behavior while still appearing to pass a happy-path dry-run.

This phase builds a representative fixture corpus and a disposable harness that runs the engine, checker, and executor in a fresh
Git repository, asserts dry-run non-mutation, exercises explicit apply and rollback, verifies idempotency, ledger completeness,
and compare-and-swap drift regeneration, and fails on empty scans before phase 006 freezes the repository map.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Fixtures for explicit semantic source-to-target maps, leading/double underscore names, similar names, exact/case-fold/NFC collisions,
  dependency-closure batches, symlinks, executable files, and idempotent/rollback state.
- Exemption fixtures for Python `.py` files, Python import-package directories, vendored/third-party trees, generated or lockfile output,
  tool-mandated names, test-runner magic, and frozen surfaces.
- Reference fixtures for JS/TS modules, Markdown links, JSON/YAML/TOML path values, shell sourcing, registries, symlink targets, and
  dynamic `require`, `source`, and glob expressions.
- Executor fixtures for compare-and-swap rewriting: a preimage-matched static site, a mutated-blob drift case that must regenerate
  rather than force-apply, cross-batch isolation, and a routed/flagged dynamic site.
- A dry-run harness that creates disposable Git repositories, invokes the engine, checker, and executor, records exit codes and
  manifests, and asserts no real migration path was touched.

### Out of Scope
- Running the harness against the real repo with an apply action or performing any repo-wide rename.
- Replacing the engine, checker, naming policy, or final frozen map; this phase consumes those contracts.
- Testing code identifier or JSON/YAML/TOML key rewrites, because those are outside the naming program's filesystem scope.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The corpus covers semantic rename and policy-boundary cases. | Fixtures exercise explicit targets, leading/double underscores, exact/case-fold/NFC collisions, dependency closure, Python and tool-mandated exemptions, generated/frozen paths, symlinks, and executable files. |
| REQ-002 | The harness proves dry-run non-mutation. | A complete dry-run leaves fixture content, Git index, path names, symlink modes, and executable bits unchanged. |
| REQ-003 | The harness proves apply, idempotency, and rollback behavior. | An explicit apply changes only mapped fixture paths, a rerun reports no pending operations, and rollback restores the baseline manifest. |
| REQ-004 | The corpus exercises the checker reference matrix. | JS/TS, Markdown, JSON/YAML/TOML path values, shell, registries, symlinks, and dynamic sites are observed and dispositioned. |
| REQ-005 | The harness proves fail-closed behavior. | Collision, missing target, ambiguous reference, undispositioned dynamic site, and zero-scan cases exit non-zero with evidence. |
| REQ-006 | The harness is deterministic and disposable. | Repeated runs from the same fixture seed produce the same plan, ledger statuses, counts, and exit results without touching the real repository. |
| REQ-007 | The corpus exercises the executor's compare-and-swap and drift behavior. | A preimage-matched site rewrites, a mutated-blob site regenerates rather than force-applies, cross-batch isolation holds, and a dynamic site is routed or flagged. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Engine and checker behavior is proven against representative fixtures before any real migration execution.
- **SC-002**: Dry-run, apply, rerun, rollback, exemption, collision, reference, and failure semantics are repeatable and evidence-bearing.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

This phase inherits the program risks of over-broad renames, exemption leakage, broken references, and false confidence from an
incomplete test corpus. A fixture that passes while omitting a supported reference class is itself a failed safety control.

Mitigations are a coverage matrix tied to the engine and checker contracts, explicit negative fixtures, fresh disposable Git
repositories, baseline content/mode hashes, deterministic seeds, non-zero assertions for every failure path, and a hard rule
that the harness never applies a map to the real migration worktree.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. Fixture serialization and seed format may follow the implementation language, provided that the same seed yields
the same map, plan, ledger, counts, and exit results across repeated runs.
<!-- /ANCHOR:questions -->
