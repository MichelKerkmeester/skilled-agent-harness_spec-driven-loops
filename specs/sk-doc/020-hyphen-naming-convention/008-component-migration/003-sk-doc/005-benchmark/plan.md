---
title: "Implementation Plan: sk-doc root benchmark artifact boundary"
description: "Verification-first plan for the root benchmark census and any baseline-specific non-exempt artifact rename."
trigger_phrases:
  - "sk-doc root benchmark audit plan"
  - "benchmark artifact naming plan"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/003-sk-doc/005-benchmark"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/003-sk-doc/005-benchmark"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored root benchmark audit plan"
    next_safe_action: "Run the root benchmark census"
    blockers: []
    key_files: [".opencode/skills/sk-doc/benchmark/"]
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: sk-doc root benchmark artifact boundary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | `.opencode/skills/sk-doc/benchmark/` |
| **Change class** | Census, with conditional root-artifact rename only if present at BASE |
| **Execution** | Pinned baseline; no artifact creation |

### Overview

Enumerate the root benchmark directory including hidden files, resolve any root-owned references, and classify the observed result. The current inventory is `.gitkeep` only, so the expected map is empty; the report must prove that result before the rollup can accept the phase.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] Root benchmark path listing and reference search are defined.
- [ ] Root-vs-`create-benchmark` ownership is explicit.
- [ ] Fixture/profile/storage-guide candidate classes are ready if the baseline is non-empty.

### Definition of Done

- [ ] `.gitkeep`-only zero-row status is proven or every actual root artifact is mapped.
- [ ] Root references resolve and no external packet resource was changed.
- [ ] Benchmark payload semantics remain unchanged.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Root census**: include hidden and generated-looking files.
- **Ownership filter**: keep `create-benchmark/` outside this phase.
- **Conditional map**: apply semantic rename rows only for actual root paths at BASE.
- **Rollup evidence**: report count and classification to phase 007.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [ ] Pin BASE and capture the complete root benchmark listing.
- [ ] Search root and repository consumers for benchmark paths.

### Phase 2: Implementation

- [ ] Preserve `.gitkeep`-only baseline without mutation, or rename only actual root non-exempt artifacts found at BASE.
- [ ] Update root-owned path references if an artifact map exists.

### Phase 3: Verification

- [ ] Re-run the census and prove count/path parity.
- [ ] Verify root ownership, content fields, and create-benchmark separation.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Hidden-inclusive root listing and consumer search |
| REQ-002 | Pinned count and zero-row/artifact map evidence |
| REQ-003 | Root path resolution and stale-token search |
| REQ-004 | Exact-path ownership audit |
| REQ-005 | Benchmark content/key diff review |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 003-create-packets/007-create-benchmark | Adjacent component | Planned | Packet/root boundary may be confused |
| Root benchmark baseline | Local surface | Available | Census cannot be reproduced |
| 001 convention policy | Naming authority | Required | Candidate classification is undefined |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Root census differs from the pinned baseline or ownership is ambiguous.
- **Procedure**: Stop, preserve the current tree, and amend the root artifact manifest before any rename.
<!-- /ANCHOR:rollback -->
