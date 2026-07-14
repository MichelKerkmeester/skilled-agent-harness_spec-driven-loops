---
title: "Feature Specification: semantic rename engine (017 phase 005.001)"
description: "The migration needs a deterministic git-mv engine driven by an explicit semantic source-to-target map. It must batch by dependency closure, skip every policy exemption, abort safely on collisions, remain idempotent, and support dry-run and rollback without performing the migration during authoring."
trigger_phrases:
  - "semantic rename engine"
  - "dependency-closure rename batching"
  - "dry-run git-mv engine"
  - "rename engine rollback"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/005-rename-and-reference-tooling"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/005-rename-and-reference-tooling/001-rename-engine"
    last_updated_at: "2026-07-14T17:28:50Z"
    last_updated_by: "codex"
    recent_action: "Authored the semantic rename engine phase contract"
    next_safe_action: "Implement the engine against the frozen map input contract"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The engine consumes an explicit semantic source-to-target map; it never derives names by replacing every underscore."
      - "A batch is a dependency closure and may contain mixed file extensions."
      - "Dry-run is the default; apply and rollback are explicit, journaled operations."
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Semantic Rename Engine

> Phase adjacency under the 017 parent (grouping order, not a runtime dependency): predecessor `004-no-new-snake-guard`; successor `006-inventory-and-frozen-map`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/017-hyphen-naming-convention/005-rename-and-reference-tooling/001-rename-engine |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-doc |
| **Origin** | Child phase 001 of the 017 rename-and-reference-tooling program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The migration has names that cannot be safely produced by a global `_` to `-` replacement: leading underscores, double
underscores, collisions, and exempt Python or tool-mandated paths all require semantic handling. A rename that runs per
extension can also leave a referenced file in the wrong batch, so the operation must follow dependency closure.

This phase defines a deterministic `git mv` engine that consumes the frozen source-to-target map, preflights every operation,
defaults to dry-run, preserves symlink and executable semantics, applies dependency-closed batches, reports idempotent state,
and can reverse its own applied operations.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A semantic source-to-target map loader and validator; target names are explicit rather than mechanically derived.
- Dependency-closure batch planning that may mix `.js`, `.ts`, `.sh`, `.json`, `.yaml`, `.yml`, `.toml`, and `.md` paths.
- Preflight collision checks for exact, case-folded, and NFC-normalized names before any write.
- Exemption-aware classification and skip reporting for Python files, Python package directories, vendored/third-party trees,
  generated or lockfile output, tool-mandated names, test-runner magic, and frozen surfaces.
- Dry-run by default, explicit apply, idempotent reruns, operation journaling, and rollback of operations owned by the engine.
- `git mv` execution with symlink mode `120000` and executable-bit preservation checks.

### Out of Scope
- The whole-repository reference checker and disposition ledger; phase 002 consumes the engine's map and operation report.
- The fixture corpus and end-to-end dry-run harness; phase 003 supplies the shared fixture contract.
- The actual repo-wide rename, the final frozen inventory, and changes to code or production files during this authoring pass.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The engine is dry-run by default and writes only on an explicit apply action. | A disposable Git repository produces a complete operation plan in dry-run mode and its tracked tree, index, and file modes are unchanged. |
| REQ-002 | The engine accepts semantic source-to-target entries and rejects unsafe or duplicate targets before execution. | Leading-underscore, double-underscore, exact, case-folded, and NFC collision fixtures are handled by explicit map validation; no character-substitution fallback exists. |
| REQ-003 | The engine batches by dependency closure rather than file extension. | A closure containing mixed extensions is planned and applied as one batch; no per-extension partition can split a mapped reference closure. |
| REQ-004 | The engine detects and skips all policy exemptions with an auditable reason. | Python `.py` files, Python import-package directories, vendored/third-party trees, generated or lockfile output, tool-mandated names, test-runner magic, and frozen surfaces are never ordinary rename targets. |
| REQ-005 | The engine is idempotent and preserves filesystem semantics. | A second run after an apply reports no pending operations; symlink mode `120000` and executable bits match the pre-rename manifest. |
| REQ-006 | The engine provides a rollback contract for its own applied operations. | An inverse journal can restore a completed batch, and a failed apply cannot leave an unreported partial operation. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The engine produces a deterministic, reviewable plan from a semantic map and never performs a character-wide substitution.
- **SC-002**: Collision and exemption preflights fail or skip before writes, with reasons recorded for every map entry.
- **SC-003**: Apply, rerun, and rollback behavior is proven in a disposable Git repository without touching the real migration tree.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The phase inherits the 017 program risks: over-broad renames, exemption leakage, broken references, concurrent worktrees,
and non-reproducible execution. Its specific risks are an incomplete dependency graph, a collision discovered after writes,
loss of executable or symlink mode, and a rollback that cannot distinguish its own operations from pre-existing changes.

Mitigations are a map-only input, closure preflight before execution, exact/casefold/NFC checks, mode manifests, an operation
journal keyed to the applied batch, and execution only in the isolated worktree defined by phase 000. The policy boundary and
exemption definitions are inherited from `001-convention-policy-and-scope/decision-record.md`; the final map contract is owned
by phase 006.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. The implementation must preserve the documented `--dry-run` default, explicit apply action, inverse journal,
and closure-batch semantics even if the concrete command names differ.
<!-- /ANCHOR:questions -->
