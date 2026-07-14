---
title: "Tasks: sk-prompt hub root and shared boundary (017 phase 004.001)"
description: "Tasks for phase 001 of the sk-prompt kebab-case program: census the root/shared boundary, protect the hub contract, and verify delegated ownership and reference closure."
trigger_phrases:
  - "sk-prompt hub root tasks"
  - "sk-prompt shared boundary tasks"
  - "sk-prompt phase 001 tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/004-sk-prompt/001-hub-root-and-shared"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/004-sk-prompt/001-hub-root-and-shared"
    last_updated_at: "2026-07-14T18:04:33Z"
    last_updated_by: "codex"
    recent_action: "Authored the root/shared task map"
    next_safe_action: "Run the root/shared census against the pinned BASE"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt/"
      - ".opencode/skills/sk-prompt/SKILL.md"
      - ".opencode/skills/sk-prompt/hub-router.json"
      - ".opencode/skills/sk-prompt/mode-registry.json"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The current root inventory has no shared/ directory."
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

# Tasks: sk-prompt hub root and shared boundary

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

- [ ] T001 Pin BASE and candidate SHAs and capture the direct root inventory (`.opencode/skills/sk-prompt/`)
- [ ] T002 [P] Check whether `shared/` exists; record an explicit zero-candidate result when absent (`.opencode/skills/sk-prompt/shared/`)
- [ ] T003 [P] Capture protected hub filenames, routing values, and delegated child roots (`SKILL.md`, `hub-router.json`, `mode-registry.json`)
- [ ] T004 Build the root/shared ownership and classification ledger (`phase evidence/disposition-map.tsv`)
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Create explicit source-to-target entries for each owned authored snake_case path (`phase evidence/disposition-map.tsv`)
- [ ] T006 Rename only owned root/shared paths to kebab-case (`.opencode/skills/sk-prompt/`)
- [ ] T007 [P] Update root/shared path-valued references without changing routing keys or semantics (`.opencode/skills/sk-prompt/`)
- [ ] T008 [P] Confirm delegated playbook, benchmark, prompt-improve, and prompt-models trees remain outside the diff (`.opencode/skills/sk-prompt/`)
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Re-enumerate the root/shared boundary and reconcile every path with one disposition (`phase evidence/disposition-map.tsv`)
- [ ] T010 Parse routing files and compare protected names, mode values, and resource targets with BASE (`hub-router.json`, `mode-registry.json`)
- [ ] T011 Search for stale owned source paths and resolve all root/shared-owned references (`.opencode/skills/sk-prompt/`)
- [ ] T012 Review the diff for scope leakage, key/identifier changes, or untracked scratch artifacts (`phase evidence`)
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remain
- [ ] Root/shared census and map hash are recorded
- [ ] Protected hub contracts and delegated ownership checks pass
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verifier contract**: See `checklist.md`
- **Boundary decisions**: See `decision-record.md`
- **Parent phase map**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->
