---
title: "Implementation Plan: mcp-code-mode scripts (032 component 011 phase 002)"
description: "Inventory the mcp-code-mode script filenames, preserve the Python exemption, and apply a semantic non-Python rename map only when the pinned tree contains an eligible candidate. Close shell, import, registry, and documentation references with the same map."
trigger_phrases:
  - "mcp-code-mode scripts implementation plan"
  - "mcp-code-mode phase 002 implementation plan"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/011-mcp-code-mode/002-scripts"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/011-mcp-code-mode/002-scripts"
    last_updated_at: "2026-07-14T16:30:00Z"
    last_updated_by: "codex"
    recent_action: "Authored scripts audit plan"
    next_safe_action: "Classify script filename candidates"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: mcp-code-mode scripts

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | mcp-code-mode/scripts and mcp-server/scripts |
| **Change class** | Script filename census and conditional reference closure |
| **Execution** | Isolated worktree pinned to BASE; phase 001 package path is a prerequisite |

### Overview
At the authoring baseline, doctor.sh, install.sh, update.sh, and check-node.cjs already use kebab-case. validate_config.py is the intentional Python exception. The plan therefore makes the census itself blocking: an empty eligible map is accepted only after proving every script and every consumer disposition.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The phase-001 package root is mcp-server and the script inventory is recorded
- [ ] Each filename is classified as rename or exemption
- [ ] Script consumer classes include source, import, registry, docs, and manual pointers

### Definition of Done
- [ ] Every eligible script filename is kebab-case, or the pinned evidence proves no eligible filename exists
- [ ] validate_config.py and its references remain unchanged in name and behavior
- [ ] Syntax and reference checks pass for the final script map
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- A language-aware filename classifier over mcp-code-mode/scripts and mcp-server/scripts.
- A semantic map for eligible non-Python filenames; the current expected map is empty because the observed non-Python names are already kebab-case.
- A consumer closure covering shell sourcing, imports, registries, markdown paths, and manual-testing pointers, with Python and identifier hits explicitly excluded.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Record BASE and enumerate every script filename after phase 001.
- Classify doctor.sh, install.sh, update.sh, validate_config.py, and check-node.cjs, then search for any newly discovered candidate.

### Phase 2: Implementation
- If the eligible map is non-empty, rename each non-Python script filename to its semantic kebab-case target.
- Update source, import, registry, documentation, and manual pointers using the same map.
- If the map is empty, record the zero-candidate proof and make no script rename.

### Phase 3: Verification
- Run bash -n for affected shell scripts and node --check for affected CommonJS scripts.
- Prove validate_config.py remains present and every active reference resolves.
- Record the final map, consumer dispositions, and path/reference scan results.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Script census lists both script directories and has no unknown disposition |
| REQ-002 | Exact path scan proves validate_config.py is preserved and resolvable |
| REQ-003 | Semantic map contains every eligible candidate or an evidenced empty set |
| REQ-004 | Reference checker finds no stale eligible script path in active files |
| REQ-005 | bash -n, node --check, and targeted script smoke checks pass |
| REQ-006 | Candidate report pins the map hash, consumer ledger, commands, and exit codes |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

This phase depends on the 032 naming policy, phase 001's mcp-server directory state, the semantic reference checker, and the pinned worktree. Python tooling is used only for the exempt validator path and is not a rename target.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

If the map is non-empty, reverse each script rename and its recorded consumer rewrites in one path-scoped revert. If the map is empty, discard only the phase evidence; no source or script file requires rollback.
<!-- /ANCHOR:rollback -->
