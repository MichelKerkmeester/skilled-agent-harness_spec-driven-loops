---
title: "Tasks: Align the sk-design README Set to the create-readme Standard"
description: "Task breakdown for the README alignment sweep, one task per README grouping plus a shared quality gate, all citing real target paths under sk-design/styles."
trigger_phrases:
  - "styles readme alignment tasks"
  - "create-readme sweep task list"
importance_tier: "standard"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/015-styles-database-evolution/008-styles-readme-create-readme-alignment"
    last_updated_at: "2026-07-22T11:30:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Collapsed tasks to three fixture phases"
    next_safe_action: "Execute T001 classification"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/README.md"
      - ".opencode/skills/sk-design/styles/scripts/README.md"
      - ".opencode/skills/sk-design/styles/tests/oracle/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-015-008-readme-alignment-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Align the sk-design README Set to the create-readme Standard

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort] {deps: T###}`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:milestones -->
## Milestone Reference

| Milestone | Tasks | Phase |
|-----------|-------|-------|
| M1 Classify | T001-T004 | Phase 1 |
| M2 Author | T005-T014 | Phase 2 |
| M3 Quality | T015-T017 | Phase 3 |

<!-- /ANCHOR:milestones -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

Classify each target and map it to a template before authoring.

- [ ] T001 Read all twelve target folders and current READMEs from the live tree [30m]
- [ ] T002 [P] Classify each README type (skill root, code folder, data folder) and map to a template [20m] {deps: T001}
- [ ] T003 [P] Record drift findings: `sk-design/README.md` `styles/_engine`/`styles/_db` references and `styles/scripts/README.md` `_harness/` tree and packet citation [15m] {deps: T001}
- [ ] T004 [P] Confirm the exact `styles/library/bundles/` folder count from a live listing [10m] {deps: T001}

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Author each README grouping to its template, then reconcile cross-README consistency.

### Group A: Skill Root
- [ ] T005 Author skill-root README to the skill shape and reconcile backend paths to `styles/lib/engine/` and `styles/lib/database/` (`.opencode/skills/sk-design/README.md`) [45m] {deps: T002, T003}

### Group B: lib Tree (code folders)
- [ ] T006 Author `styles/lib/README.md` to the code-folder shape: overview, key files (`paths.mjs`, `engine/`, `database/`), architecture fit (`.opencode/skills/sk-design/styles/lib/README.md`) [30m] {deps: T002}
- [ ] T007 Author `styles/lib/engine/README.md` to the code-folder shape: facade `style-library.mjs`, adapter `persistent-adapter.mjs`, flat-file lanes (`.opencode/skills/sk-design/styles/lib/engine/README.md`) [40m] {deps: T002}
- [ ] T008 Align `styles/lib/database/README.md` to the code-folder shape while preserving its accurate generation/indexer/retrieval detail (`.opencode/skills/sk-design/styles/lib/database/README.md`) [45m] {deps: T002}

### Group C: library Tree (data folders)
- [ ] T009 [P] Author `styles/library/README.md` and `styles/library/bundles/README.md` and `styles/library/manifests/README.md` to the trimmed data-README shape, one data-README for the ~1,290-bundle corpus [45m] {deps: T002, T004}

### Group D: scripts (code folder, drift fix)
- [ ] T010 Author `styles/scripts/README.md`: correct the directory tree to the real `scripts/` contents (`extract-refero.mjs`, `README.md`), verify the `../cursor/` link, and remove the spec-packet citation (`.opencode/skills/sk-design/styles/scripts/README.md`) [40m] {deps: T002, T003}

### Group E: tests (code folders)
- [ ] T011 [P] Author `styles/tests/database/README.md` and `styles/tests/engine/README.md` and `styles/tests/oracle/README.md` to the code-folder shape: aggregator (`index.mjs`), coverage, architecture fit [45m] {deps: T002}

### Group F: oracle golden (data folder)
- [ ] T012 [P] Author `styles/tests/oracle/golden/README.md` to the trimmed data-README shape: pinned canonical outputs, do-not-hand-edit, regenerate-only-via-oracle (`.opencode/skills/sk-design/styles/tests/oracle/golden/README.md`) [25m] {deps: T002}

### Cross-README consistency
- [ ] T013 Resolve every local link and named path across all twelve READMEs against the current tree [30m] {deps: T005, T006, T007, T008, T009, T010, T011, T012}
- [ ] T014 [P] Confirm cross-references between the skill-root README and the styles folder READMEs agree on backend paths [20m] {deps: T005, T007, T008}

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

Run the shared quality gate over all twelve READMEs.

- [ ] T015 Run create-quality-control structure and DQI checks on each of the twelve READMEs [30m] {deps: T013}
- [ ] T016 [P] Run HVR checks on all twelve READMEs (no em dashes, no semicolons, no banned words, no packet IDs) [20m] {deps: T013}
- [ ] T017 Confirm `git diff --name-only` lists only the twelve README paths, no code or bundle data [15m] {deps: T013}

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] All three milestones achieved
- [ ] All twelve READMEs conform to their create-readme template
- [ ] Every local link and named path resolves
- [ ] HVR clean on all twelve
- [ ] `git diff` scope limited to the twelve README files
- [ ] Checklist.md fully verified with evidence

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decisions**: See `decision-record.md`

<!-- /ANCHOR:cross-refs -->
