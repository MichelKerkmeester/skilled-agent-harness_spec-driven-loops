---
title: "Feature Specification: Rename and Reference Tooling"
description: "The tooling phase defines a deterministic, exemption-aware rename engine, a read-only whole-repository reference checker with a disposition ledger, and a compare-and-swap static reference-rewrite executor, then proves them against disposable fixtures before any migration run."
trigger_phrases:
  - "rename and reference tooling"
  - "semantic rename engine"
  - "whole-repo reference checker"
  - "rename disposition ledger"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/005-rename-and-reference-tooling"
    last_updated_at: "2026-07-14T17:28:50Z"
    last_updated_by: "codex"
    recent_action: "Added the reference-rewrite executor child (004) to the tooling phase map"
    next_safe_action: "Execute child phase 001 against the frozen map contract"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The tooling describes and verifies future migration behavior; this authoring pass performs no rename."
      - "In-scope names use kebab-case; Python files, Python package directories, and tool-mandated names remain exempt."
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT — root purpose and child phase map only; detailed mechanics live in child documents. -->

# Feature Specification: Rename and Reference Tooling

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/020-hyphen-naming-convention/005-rename-and-reference-tooling |
| **Level** | phase parent |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-doc |
| **Parent packet** | sk-doc/020-hyphen-naming-convention |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The migration cannot rely on character substitution or a text-only reference sweep. It needs a semantic source-to-target
rename engine that understands dependency closure, collision safety, idempotency, rollback, and the program's exemption
boundary. It also needs a whole-repository checker that resolves references and records a disposition for every rename and
dynamic reference site before a real run is allowed. Because the checker is read-only and the engine only moves files, the
toolchain further needs a deterministic executor that APPLIES the dispositioned reference rewrites under compare-and-swap, so a
batch whose base drifted mid-migration re-derives its rewrite rather than being hand-fixed.

The four child phases define the engine, the read-only checker and ledger, the compare-and-swap reference-rewrite executor, and
a disposable fixture/dry-run harness. Together they make the toolchain able to prove a planned rename without executing the repo
migration during this documentation pass.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A deterministic `git mv`-based engine driven by an explicit semantic map and dependency-closure batches.
- A read-only whole-repository reference checker covering code, documentation, configuration, registries, and symlinks.
- A disposition ledger that records each rename decision, rationale, status, evidence, and dynamic-site disposition.
- A compare-and-swap static reference-rewrite executor that applies the ledger's dispositioned reference sites and regenerates,
  rather than force-applies, when a target blob drifts.
- Disposable fixtures and a dry-run harness that exercise the engine, checker, and executor before any real migration run.
- Exemption-aware handling: Python `.py` files, Python import-package directories, vendored/third-party trees, generated or
  lockfile output, tool-mandated names, test-runner magic, and frozen surfaces are never treated as ordinary rename targets.

### Out of Scope
- Executing the repo-wide rename or changing any production code, script, configuration, or filesystem name.
- Freezing the final repository rename map; that is phase 006.
- Changing the no-new-snake guard; that is phase 004.
- Redesigning the naming policy or its exemption set; the authoritative boundary is phase 001's decision record.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-rename-engine/` | Semantic, exemption-aware `git mv` engine with dependency-closure batching, dry-run default, idempotency, and rollback. | Planned |
| 2 | `002-reference-checker-and-disposition-ledger/` | Whole-repo reference resolution plus a complete ledger for rename decisions and dynamic sites. | Planned |
| 3 | `003-fixture-corpus-and-dry-run-harness/` | Representative fixture corpus and disposable harness for engine/checker/executor dry runs and pre-migration proof. | Planned |
| 4 | `004-reference-rewrite-executor/` | Deterministic, compare-and-swap static reference-rewrite executor that consumes the ledger and map and regenerates drifted batches. | Planned |

### Phase Handoff Criteria

> Phase numbers are grouping order, not a runtime chain. The executor (`004`) consumes the checker's ledger (`002`) and the frozen map (`006`); the harness (`003`) proves the engine, checker, and executor together even though it is numbered before `004`.

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-rename-engine | 002-reference-checker-and-disposition-ledger | The engine's semantic map, exemption dispositions, closure batches, and operation states are documented and consumable by the checker. | Map schema and dry-run report are available; no migration is run. |
| 002-reference-checker-and-disposition-ledger | 004-reference-rewrite-executor | The ledger's static reference sites, site IDs, and dynamic-site dispositions are consumable as compare-and-swap rewrite inputs. | Ledger schema and site IDs are available; no rewrite is applied. |
| 004-reference-rewrite-executor | 003-fixture-corpus-and-dry-run-harness | The executor's rewrite-plan schema, preimage rule, and rewrite-state contract are consumable by the harness. | Rewrite plan and journal formats are available; no migration is run. |
| 002-reference-checker-and-disposition-ledger | 003-fixture-corpus-and-dry-run-harness | The checker defines its supported reference classes, ledger fields, dynamic-site rule, and zero-scan failure. | Ledger schema and failure conditions are exercised by the harness plan. |
<!-- /ANCHOR:phase-map -->

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

None blocking. Child plans may choose concrete command names and report storage locations, but those choices must preserve
the dry-run default, the exemption boundary, dependency-closure batching, and the no-silent-reference rule.
<!-- /ANCHOR:questions -->
