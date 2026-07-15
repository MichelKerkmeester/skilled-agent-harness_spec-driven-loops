---
title: "Tasks: cli-external-orchestration benchmark naming (017 phase 005.006)"
description: "Tasks for the cli-external-orchestration benchmark boundary: capture the .gitkeep-only baseline, classify any authored/generated additions, update active paths, and verify benchmark semantics."
trigger_phrases:
  - "cli-external benchmark tasks"
  - "benchmark fixture profile storage tasks"
  - "cli-external phase 006 tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration/005-cli-external-orchestration/006-benchmark"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/005-cli-external-orchestration/006-benchmark"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored benchmark tasks"
    next_safe_action: "Enumerate benchmark descendants"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external-orchestration/benchmark/"
      - ".opencode/skills/cli-external-orchestration/SKILL.md"
      - ".opencode/skills/cli-external-orchestration/README.md"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The current benchmark tree contains only .gitkeep."
---
# Tasks: cli-external-orchestration benchmark naming

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

- [ ] T001 Pin BASE and candidate SHAs and capture the benchmark inventory (`benchmark/`)
- [ ] T002 [P] Record `.gitkeep` as the current sole entry and check for execution-time fixture/profile/storage-guide/report/run additions (`benchmark/`)
- [ ] T003 [P] Snapshot any benchmark IDs, payload keys, fixture/profile data, and scores (`benchmark artifacts`)
- [ ] T004 Build the authored/generated/frozen/exempt/tool-mandated disposition ledger and hash (`phase evidence/disposition-map.tsv`)
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Add explicit source-target rows for any authored fixture, profile, storage-guide, report, or path directory; retain a zero-row map when the census remains empty (`benchmark/`)
- [ ] T006 [P] Update active benchmark path references only for mapped authored paths (`SKILL.md`, `README.md`, indexes, reports)
- [ ] T007 Preserve `.gitkeep`, generated runs/raw/retries, payload/data keys, IDs, fixtures/profiles, and scores (`benchmark/`)
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Re-enumerate benchmark descendants and reconcile every path with exactly one disposition (`phase evidence/disposition-map.tsv`)
- [ ] T009 Search active consumers for stale authored source paths and resolve mapped targets (`benchmark consumers`)
- [ ] T010 Compare benchmark content contracts with BASE and hand the map/disposition hash to phase 007 (`benchmark evidence`)
- [ ] T011 Review the diff for generated-output rewrites, invented artifacts, data-key changes, and out-of-scope edits (`phase evidence`)
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remain
- [ ] The empty baseline or authored map, generated dispositions, and map hash are recorded
- [ ] Active paths and benchmark content contracts are verified
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verifier contract**: See `checklist.md`
- **Boundary decisions**: See `decision-record.md`
- **Parent phase map**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->

