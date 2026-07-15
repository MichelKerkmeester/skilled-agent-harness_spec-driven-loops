---
title: "Implementation Plan: Scripts tree (017 subtree 008 phase 004)"
description: "The system-spec-kit surface has a small set of non-Python script filenames that still contain underscores, while Python scripts and test fixture names follow separate contracts. This phase renames only permitted script filenames and updates sourcing, imports, and registry references without touching Python filenames or test-runner magic."
trigger_phrases:
  - "system-spec-kit scripts tree"
  - "_utils.sh rename"
  - "run_arm.sh rename"
  - "kebab-case script filenames"
  - "kebab-case phase 004"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration/008-system-spec-kit"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/008-system-spec-kit/004-scripts-tree"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Planned scripts-tree execution"
    next_safe_action: "Execute the non-Python script filename map after MCP consumers are stable"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Implementation Plan: Scripts tree

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | .opencode/skills/system-spec-kit (Scripts tree) |
| **Change class** | Script filename rename and caller closure |
| **Execution** | Isolated worktree pinned to BASE; planning only |

### Overview
Inventory script filenames by extension and path role, apply a two-entry semantic map for the observed non-Python candidates, and update all path-bearing callers. Leave Python filenames, test-magic names, generated fixture data, and script contents outside the rename closure.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 003 closed active MCP path consumers.
- [ ] The script inventory is captured separately from fixture data and Python files.
- [ ] Executable-bit and shell-discovery baselines are available.

### Definition of Done
- [ ] Every permitted script candidate has a semantic target and updated callers.
- [ ] Shell syntax and benchmark wrapper resolution pass in the central worktree.
- [ ] The exemption audit proves Python and fixture contracts were not renamed.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
- Classify by filename role before matching underscores: executable shell/JS/TS/MJS/CJS candidates, Python exemptions, test magic, and generated fixture data.
- Use _utils.sh -> utils.sh and run_arm.sh -> run-arm.sh as explicit map entries.
- Update sourcing and registry references as one closure per script; preserve executable mode and shebangs.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Enumerate all script filenames under the root scripts tree and MCP benchmark script folders.
- Read setup README/install.sh and benchmark README/run-ab.sh callers before mapping.

### Phase 2: Implementation
- Create the script map and record Python, test, and generated dispositions.
- Rename the two permitted shell files and update source, command, README, and registry references.
- Run syntax and executable-mode checks without changing script logic.

### Phase 3: Verification
- Scan for remaining permitted script filenames with underscores and resolve all matches.
- Run bash -n and central script/benchmark smoke checks; compare executable modes.
- Record any fixture or Python names as explicit exemptions.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Inventory filenames by extension and role; require a nonzero scan or an explicit zero-candidate report. |
| REQ-002 | Review the semantic map and assert utils.sh and run-arm.sh are the only permitted targets. |
| REQ-003 | Resolve source commands, benchmark wrappers, registry paths, and README links. |
| REQ-004 | Audit changed names against .py, Python package, test-magic, and generated fixture exemptions. |
| REQ-005 | Run bash -n, executable-mode comparison, and central benchmark/script smoke checks. |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 003 consumer closure | Internal | Required | Old MCP paths must be stable before script references are updated. |
| Shell and benchmark callers | Internal | Required | A filename-only move breaks source and wrapper commands. |
| Python/test/generated exemptions | Policy | Required | The scanner must not fold these names into the rename set. |
| Phase 005 templates | Internal | Downstream | Next phase owns template paths, not script filenames. |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Abort on any unknown script candidate, mode change, or caller that cannot resolve. Revert each script plus its caller rewrites together; do not rename Python files to make a shell wrapper appear consistent.
<!-- /ANCHOR:rollback -->

