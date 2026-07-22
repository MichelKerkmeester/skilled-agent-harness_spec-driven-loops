---
title: "Tasks: Expand styles/database/README.md to Spec-Kit Canon"
description: "Task breakdown for expanding the styles/database/README.md stub to the spec-kit database-folder README shape. Planning — all tasks pending."
trigger_phrases:
  - "styles database readme tasks"
  - "database folder readme task breakdown"
  - "expand database readme stub tasks"
importance_tier: "standard"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/015-styles-database-evolution/009-manual-testing-playbook-and-db-readme/002-database-readme-speckit-alignment"
    last_updated_at: "2026-07-22T11:30:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Authored L2 tasks for database README"
    next_safe_action: "Start Phase 1 setup"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/styles/database/README.md"
      - ".opencode/skills/system-spec-kit/mcp-server/database/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-015-009-002-db-readme-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Expand styles/database/README.md to Spec-Kit Canon

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]`


<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Re-verify the live `styles/database/` tree and read `.gitignore` (`styles/database/`) [5m]
- [ ] T002 Confirm final section set (all 8 exemplar sections vs trimmed subset) [5m]
- [ ] T003 Re-confirm producer/consumer modules exist under `styles/lib/database/` and `styles/lib/engine/` [5m]


<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Draft §Overview: purpose of `styles/database/` (git-ignored mutable SQLite publication state; data dir, not source) (`styles/database/README.md`) [15m]
- [ ] T005 Draft §Architecture/flow: styles library -> `lib/paths.mjs` seam -> `database/`; adapter default `legacy` (`styles/database/README.md`) [10m]
- [ ] T006 Draft §Topology + §Directory Tree: tracked (`README.md`, `.gitignore`) vs generated/ignored generations (`styles/database/README.md`) [15m]
- [ ] T007 Draft §Key Files table + §Boundaries/Flow: producers `indexer.mjs`/`operator.mjs`/`vectors.mjs`, consumer `retrieval.mjs`, schema `schema.mjs` (`styles/database/README.md`) [15m]
- [ ] T008 Draft §Validation + §Related: `validate_document.py`; links to `../lib/database/README.md`, `../lib/README.md`, `../tests/README.md` (`styles/database/README.md`) [10m]
- [ ] T009 State the tracked-vs-ignored contract exactly as `.gitignore` defines it (`styles/database/README.md`) [5m]


<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Run `validate_document.py` on `styles/database/README.md` [5m]
- [ ] T011 Confirm markdown link guard clean (related links resolve) [5m]
- [ ] T012 Cross-check every named path/module exists on disk (no fabrication) [5m]
- [ ] T013 Confirm the diff is a single-file documentation change [2m]

### Documentation
- [ ] T014 Update `spec.md` status and complete `implementation-summary.md` with evidence [5m]
- [ ] T015 Mark all `checklist.md` items with evidence [5m]


<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] README passes `validate_document.py`
- [ ] Every named path/module verified to exist
- [ ] Single-file documentation diff; markdown link guard clean
- [ ] `checklist.md` fully verified


<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`

<!-- /ANCHOR:cross-refs -->
