---
title: "Tasks: cli-codex component naming (020 phase 005.004)"
description: "Tasks for the cli-codex component rename: map five references and two assets, update local links, preserve Codex safety contracts, and verify delegated ownership."
trigger_phrases:
  - "cli-codex naming tasks"
  - "Codex path map tasks"
  - "cli-external phase 004 tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/005-cli-external-orchestration/004-cli-codex"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/005-cli-external-orchestration/004-cli-codex"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored cli-codex tasks"
    next_safe_action: "Enumerate local reference and asset paths"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external-orchestration/cli-codex/"
      - ".opencode/skills/cli-external-orchestration/cli-codex/SKILL.md"
      - ".opencode/skills/cli-external-orchestration/cli-codex/README.md"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The candidate set excludes the nested manual-testing-playbook tree."
---
# Tasks: cli-codex component naming

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

- [ ] T001 Pin BASE and candidate SHAs and capture the non-playbook component inventory (`cli-codex/`)
- [ ] T002 [P] Enumerate five reference and two asset candidates (`references/`, `assets/`)
- [ ] T003 [P] Capture local consumers and Codex safety/dispatch baselines (`SKILL.md`, `README.md`, active docs)
- [ ] T004 Build the path/protected/delegated disposition ledger and map hash (`phase evidence/disposition-map.tsv`)
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Map `cli_reference.md`, `hook_contract.md`, `agent_delegation.md`, `integration_patterns.md`, and `codex_tools.md` to kebab-case targets (`references/`)
- [ ] T006 [P] Map `prompt_quality_card.md` and `prompt_templates.md` to kebab-case targets (`assets/`)
- [ ] T007 [P] Update local Markdown links and active path-valued citations (`SKILL.md`, `README.md`, component docs)
- [ ] T008 Preserve model/reasoning flags, sandbox values, review/search/image guidance, self-invocation rules, and the delegated playbook (`cli-codex/`)
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Re-enumerate the component and reconcile every candidate with one ledger disposition (`phase evidence/disposition-map.tsv`)
- [ ] T010 Search for stale source basenames and resolve all local links (`cli-codex/`)
- [ ] T011 Compare Codex availability, safety, model/reasoning, sandbox, review/search/image, and handback guidance with BASE (`SKILL.md`, references)
- [ ] T012 Review the diff for playbook, external-path, key/identifier, changelog, and sibling-phase leakage (`phase evidence`)
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remain
- [ ] The seven-entry map and map hash are recorded
- [ ] Local references resolve and Codex contract parity is proven
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verifier contract**: See `checklist.md`
- **Parent phase map**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->

