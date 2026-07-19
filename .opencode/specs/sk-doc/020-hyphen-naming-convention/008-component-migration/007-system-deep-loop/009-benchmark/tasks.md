---
title: "Tasks: system-deep-loop benchmark storage names (020 phase 007/009)"
description: "Execution tasks for renaming root benchmark storage labels, repairing report/index path values, and verifying report and fixture/profile ownership."
trigger_phrases:
  - "system-deep-loop benchmark tasks"
  - "benchmark storage naming tasks"
  - "deep loop benchmark report path tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/007-system-deep-loop/009-benchmark"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/007-system-deep-loop/009-benchmark"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored benchmark tasks"
    next_safe_action: "Execute the root benchmark rename closure"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: System-deep-loop benchmark storage names

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
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Load the root benchmark map, BASE report manifest, README/runner references, and output ownership list.
- [ ] T002 [P] Inventory `after_d3_proxy`, `live_mode_b`, `router_mode_a`, `baseline`, and every report file.
- [ ] T003 Record report parent labels, trace modes, scenario counts, verdicts, scores, and deep-improvement ownership boundaries.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Classify storage directories, report files, generated output, fixture/profile paths, and tool names.
- [ ] T005 Rename the three root storage directories to `after-d3-proxy`, `live-mode-b`, and `router-mode-a`.
- [ ] T006 Update README, benchmark commands, baseline comparisons, and storage path values.
- [ ] T007 Preserve `baseline/`, report filenames/payloads, JSON keys, scenario IDs, scores, and deep-improvement-owned assets.
- [ ] T008 Record storage-map, report-integrity, and ownership evidence.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Compare report presence, contents, scenario IDs, trace modes, verdicts, and scores with BASE.
- [ ] T010 Resolve README, runner, baseline, and storage-guide paths and search for old active labels.
- [ ] T011 Run root benchmark router/live discovery and D5 connectivity with non-zero corpus.
- [ ] T012 Confirm generated-output, fixture/profile, report-key, and frozen-history dispositions are scope-clean.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] Every requirement in spec.md has evidence in the candidate report
- [ ] The phase checklist is green
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Governing policy**: See `../../../001-convention-policy-and-scope/spec.md`
<!-- /ANCHOR:cross-refs -->
