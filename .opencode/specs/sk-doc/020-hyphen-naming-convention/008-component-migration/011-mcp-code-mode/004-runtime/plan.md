---
title: "Implementation Plan: mcp-code-mode runtime (032 component 011 phase 004)"
description: "Audit the executable runtime tree, prove its current kebab-case names, and conditionally apply a semantic rename/reference closure if the pinned tree contains an eligible runtime name."
trigger_phrases:
  - "mcp-code-mode runtime implementation plan"
  - "mcp-code-mode phase 004 implementation plan"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/011-mcp-code-mode/004-runtime"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/011-mcp-code-mode/004-runtime"
    last_updated_at: "2026-07-14T16:30:00Z"
    last_updated_by: "codex"
    recent_action: "Authored runtime audit plan"
    next_safe_action: "Enumerate runtime paths and consumers"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: mcp-code-mode runtime

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | mcp-code-mode/runtime and active runtime path consumers |
| **Change class** | Runtime filename census and conditional path closure |
| **Execution** | Isolated worktree pinned to BASE; expected current rename map is empty |

### Overview
The observed runtime paths are runtime/hooks/claude/mcp-route-guard.cjs, runtime/hooks/codex/mcp-route-guard.cjs,
runtime/lib/mcp-route-guard.cjs, and runtime/lib/mcp-route-guard.test.cjs. The plan treats the empty eligible set as a
blocking evidence result and prevents a silent skip if the pinned tree exposes another name.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The runtime inventory and active consumers are recorded from BASE
- [ ] The current compliant filenames are separated from any eligible candidate
- [ ] Manual-playbook references to runtime files are inventoried without taking ownership of playbook filename renames

### Definition of Done
- [ ] No eligible runtime snake_case name remains, or every discovered candidate has a final target and closure
- [ ] Node syntax and route-guard checks pass
- [ ] The evidence proves the runtime path graph has no stale active edge
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- A path-segment census over runtime/hooks/claude, runtime/hooks/codex, and runtime/lib.
- A no-op-safe semantic rename map, expected to be empty for the four observed mcp-route-guard files.
- A consumer scan for manual scenario links, direct Node invocations, requires, and test paths, with phase-005 playbook filename changes kept separate.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Record BASE and enumerate every runtime directory and file.
- Classify the four observed kebab-case files and search for any eligible underscore-bearing name.

### Phase 2: Implementation
- If a candidate exists, apply its semantic kebab-case rename and update all active runtime path consumers.
- If no candidate exists, preserve runtime files and record the empty-map proof.

### Phase 3: Verification
- Run node --check on each runtime CommonJS file and the route-guard test path.
- Resolve manual-scenario and direct-loader references to the final runtime paths.
- Record map, dispositions, and exit codes.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Runtime census lists hooks/claude, hooks/codex, lib, and all four observed files |
| REQ-002 | Map and exemption ledger prove an empty compliant result or list every candidate |
| REQ-003 | Active runtime path scan has no stale eligible source path |
| REQ-004 | node --check and route-guard tests pass with unchanged decisions and environment names |
| REQ-005 | Candidate report pins inventory, map hash, reference dispositions, commands, and exit codes |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

This phase depends on the 032 policy, the prior package/scripts/reference closures, Node tooling, and the reference
checker. It hands a stable runtime path inventory to phase 005, which owns the manual-playbook filename closure.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

For a non-empty map, restore runtime source names and reverse the recorded path consumers together. For the expected
empty map, discard phase evidence only; the runtime tree has no planned content rollback.
<!-- /ANCHOR:rollback -->
