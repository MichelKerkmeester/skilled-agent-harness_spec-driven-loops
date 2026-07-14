---
title: "Tasks: sk-prompt benchmark artifact names (017 phase 004.005)"
description: "Tasks for phase 005 of the sk-prompt kebab-case program: build the benchmark path ledger, rename authored artifacts, preserve generated output, and verify benchmark content contracts."
trigger_phrases:
  - "sk-prompt benchmark tasks"
  - "sk-prompt benchmark path ledger"
  - "sk-prompt phase 005 tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/004-sk-prompt/005-benchmark"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/004-sk-prompt/005-benchmark"
    last_updated_at: "2026-07-14T18:04:33Z"
    last_updated_by: "codex"
    recent_action: "Authored the benchmark authored/generated task map"
    next_safe_action: "Enumerate all benchmark descendants and create the disposition ledger"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt/benchmark/"
      - ".opencode/skills/sk-prompt/prompt-improve/benchmark/"
      - ".opencode/skills/sk-prompt/prompt-models/benchmarks/"
      - ".opencode/skills/sk-prompt/benchmark/BENCHMARK-SUMMARY.md"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The live authored candidates currently include live_final, router_final, and router_mode_a."
      - "Raw prompt-models run and archive names are generated output and require explicit disposition."
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

# Tasks: sk-prompt benchmark artifact names

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

- [ ] T001 Pin BASE and candidate SHAs and capture the three benchmark roots (`sk-prompt/benchmark/`, `prompt-improve/benchmark/`, `prompt-models/benchmarks/`)
- [ ] T002 [P] Enumerate every descendant path, including fixtures, profiles, reports, storage guides, `runs/`, and `runs-archive/` (`benchmark trees`)
- [ ] T003 [P] Snapshot benchmark scenario IDs, fixture/profile data, report payload keys, and scores (`benchmark artifacts`)
- [ ] T004 Build the authored/generated/frozen/exempt/tool-mandated disposition ledger with a map hash (`phase evidence/disposition-map.tsv`)
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Add explicit authored mappings for `live_final/` → `live-final/`, `router_final/` → `router-final/`, and `router_mode_a/` → `router-mode-a/` (`benchmark paths`)
- [ ] T006 [P] Rename any additional authored fixture, profile, storage-guide, report, or path directory identified by the ledger (`benchmark trees`)
- [ ] T007 [P] Update active summary, skill/README, report, harness, and storage-guide path references (`sk-prompt benchmark consumers`)
- [ ] T008 Preserve generated raw runs, archives, payload keys, IDs, fixtures, profiles, and scores (`prompt-models benchmark output`)
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Re-enumerate all benchmark descendants and reconcile every path with exactly one ledger disposition (`phase evidence/disposition-map.tsv`)
- [ ] T010 Search active consumers for stale authored source paths and resolve each mapped target (`benchmark summaries, reports, skill docs`)
- [ ] T011 Compare scenario IDs, fixture/profile data, report payload keys, and score values with BASE (`benchmark artifacts`)
- [ ] T012 Review the diff for generated-output rewrites, data-key changes, and out-of-scope packet edits (`phase evidence`)
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remain
- [ ] Authored path map, generated-output dispositions, and map hash are recorded
- [ ] Active paths resolve and benchmark content contracts match BASE
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verifier contract**: See `checklist.md`
- **Benchmark naming decisions**: See `decision-record.md`
- **Parent phase map**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->
