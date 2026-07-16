---
title: "Tasks: cli-external-orchestration subtree rollup gate (032 phase 005.008)"
description: "Tasks for the final cli-external-orchestration gate: aggregate sibling evidence, reconcile path classifications, run the final scope-aware census, and publish a pass/block result without new migration work."
trigger_phrases:
  - "cli-external subtree rollup gate tasks"
  - "cli-external final naming census"
  - "cli-external phase 008 tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/005-cli-external-orchestration/008-skill-gate"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/005-cli-external-orchestration/008-skill-gate"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored cli-external gate tasks"
    next_safe_action: "Collect sibling verdicts and final census"
    blockers: []
    key_files:
      - ".opencode/specs/sk-doc/032-hyphen-naming-convention/008-component-migration/005-cli-external-orchestration/"
      - ".opencode/skills/cli-external-orchestration/"
      - ".opencode/skills/cli-external-orchestration/cli-opencode/"
      - ".opencode/skills/cli-external-orchestration/cli-claude-code/"
      - ".opencode/skills/cli-external-orchestration/cli-codex/"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The gate performs no new rename, reference, metadata, changelog, or content work."
---
# Tasks: cli-external-orchestration subtree rollup gate

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

- [ ] T001 Pin final candidate and BASE SHAs and collect phases 001–007 checklist verdicts (`001-*` through `007-*`)
- [ ] T002 [P] Collect sibling path maps, hashes, benchmark dispositions, release matrix, and handoffs (`001-*` through `007-*`)
- [ ] T003 [P] Enumerate the complete hub/component/playbook/benchmark surface, excluding assigned spec docs (`.opencode/skills/cli-external-orchestration/`)
- [ ] T004 Build the final path-classification and sibling-verdict matrices (`phase evidence`)
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Reconcile every retained non-kebab name with 032 exemptions or an owning sibling disposition (`phase evidence`)
- [ ] T006 [P] Resolve active references against the final child source-target maps (`cli-external-orchestration/`)
- [ ] T007 [P] Check phase 007 release evidence against all six path/census phase results (`007-changelog-verify/`)
- [ ] T008 Record unknown, stale, conflicting, or incomplete results as blocking findings routed to their owners (`phase evidence`)
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Re-run the final scope-aware census and reconcile every path with the classification matrix (`cli-external-orchestration/`)
- [ ] T010 Confirm every sibling P0 check passes and no release/ownership contradiction remains (`001-*` through `007-*`)
- [ ] T011 Record commands, exit codes, SHAs, census/map hashes, release verdict, and findings (`phase evidence`)
- [ ] T012 Publish pass/block result for central validation without modifying the skill surface (`008-skill-gate/`)
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remain
- [ ] Every sibling contract and final filesystem path has a recorded verdict/classification
- [ ] No new migration work was performed by the rollup gate
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verifier contract**: See `checklist.md`
- **Parent phase map**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->

