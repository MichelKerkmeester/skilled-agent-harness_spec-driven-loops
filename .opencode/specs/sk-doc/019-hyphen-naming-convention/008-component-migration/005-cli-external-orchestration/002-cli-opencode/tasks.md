---
title: "Tasks: cli-opencode component naming (017 phase 005.002)"
description: "Tasks for the cli-opencode component rename: map eight reference files and six assets, update path-valued consumers, preserve schema and dispatch semantics, and verify delegated ownership."
trigger_phrases:
  - "cli-opencode naming tasks"
  - "OpenCode path map tasks"
  - "cli-external phase 002 tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration/005-cli-external-orchestration/002-cli-opencode"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/005-cli-external-orchestration/002-cli-opencode"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored cli-opencode tasks"
    next_safe_action: "Enumerate local reference and asset paths"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external-orchestration/cli-opencode/"
      - ".opencode/skills/cli-external-orchestration/cli-opencode/SKILL.md"
      - ".opencode/skills/cli-external-orchestration/cli-opencode/assets/"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The candidate set excludes the nested manual-testing-playbook tree."
---
# Tasks: cli-opencode component naming

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Pin BASE and candidate SHAs and capture the non-playbook component inventory (`cli-opencode/`)
- [ ] T002 [P] Enumerate eight reference candidates and six asset candidates (`references/`, `assets/`)
- [ ] T003 [P] Capture every local consumer, including `SKILL.md`, README, schema `$id`/glob/path values, and active docs (`cli-opencode/`)
- [ ] T004 Build the path/key/protected/delegated disposition ledger and map hash (`phase evidence/disposition-map.tsv`)
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Map `cli_reference.md`, `opencode_tools.md`, `agent_delegation.md`, `permissions_matrix.md`, `self_invocation_guard.md`, `integration_patterns.md`, `context_budget.md`, and `destructive_scope_violations.md` to kebab-case targets (`references/`)
- [ ] T006 [P] Map the four `permissions_matrix.*.json` assets, `prompt_quality_card.md`, and `prompt_templates.md` to kebab-case targets (`assets/`)
- [ ] T007 [P] Update local Markdown links, tables, schema path values/globs, and active path references (`SKILL.md`, `README.md`, assets, active docs)
- [ ] T008 Preserve JSON keys, schema properties, dispatch rules, scripts, external paths, and delegated playbook paths (`cli-opencode/`)
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Re-enumerate local paths and reconcile every source with exactly one ledger row (`phase evidence/disposition-map.tsv`)
- [ ] T010 Search for stale local source basenames and resolve all local Markdown/path references (`cli-opencode/`)
- [ ] T011 Compare JSON keys/schema properties and path-normalized values with BASE (`assets/permissions-matrix*.json`)
- [ ] T012 Run the component's JavaScript syntax/tests and compare protected script names and behavior (`scripts/`)
- [ ] T013 Review the diff for nested-playbook, external-path, key/identifier, and changelog-history leakage (`phase evidence`)
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remain
- [ ] The 14-entry source-target map and map hash are recorded
- [ ] Local references resolve and content/protected-surface parity is proven
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verifier contract**: See `checklist.md`
- **Boundary decisions**: See `decision-record.md`
- **Parent phase map**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->

