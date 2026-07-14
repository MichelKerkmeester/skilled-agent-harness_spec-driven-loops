---
title: "Implementation Plan: create-diff naming audit"
description: "Verification plan for the create-diff component's zero-row non-exempt naming census and path-reference check."
trigger_phrases:
  - "create-diff naming audit plan"
  - "create-diff zero-row verification"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/010-create-diff"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/010-create-diff"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored create-diff audit plan"
    next_safe_action: "Run the create-diff path census"
    blockers: []
    key_files: [".opencode/skills/sk-doc/create-diff/"]
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: create-diff naming audit

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | `.opencode/skills/sk-doc/create-diff/` |
| **Change class** | Read-only census and reference verification |
| **Execution** | Pinned baseline, no rename mutation expected |

### Overview

Enumerate the component, classify every path using the 001 rule, verify its references, and preserve the zero-row result if the baseline matches the observed surface. Any newly discovered candidate becomes an escalation, not an invented rename.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] The current component file inventory is recorded.
- [ ] The filesystem-only classification rule is applied.
- [ ] Path reference search terms are defined.

### Definition of Done

- [ ] The report proves the non-exempt candidate count is zero.
- [ ] No create-diff path reference is stale or unresolved.
- [ ] No implementation file changed.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Census**: list files/directories from the pinned baseline.
- **Classifier**: separate filesystem names from content tokens and tool names.
- **Reference check**: search packet-local links and path values.
- **Rollup handoff**: emit a zero-row evidence record for phase 007.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [ ] Pin BASE and capture the complete create-diff listing.
- [ ] Freeze the zero-row candidate result and reference search terms.

### Phase 2: Implementation

- [ ] No migration rename is planned; preserve the component exactly.

### Phase 3: Verification

- [ ] Re-run the candidate classifier and record count parity.
- [ ] Resolve all packet-local paths and report no tracked mutation.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Complete path listing and classification table |
| REQ-002 | Pinned zero-row census command and count |
| REQ-003 | Packet-local old/path reference search |
| REQ-004 | Content/path boundary diff audit |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 001 convention policy | Naming authority | Required | Zero-row classification cannot be trusted |
| Pinned create-diff baseline | Local surface | Available | Audit result is not reproducible |
| Nested create-packets parent | Rollup consumer | Planned | Evidence cannot be aggregated |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The baseline census finds a new non-exempt candidate or an unresolved path.
- **Procedure**: Stop the audit, classify the new candidate against the 001 boundary, and amend the phase map before any rename.
<!-- /ANCHOR:rollback -->
