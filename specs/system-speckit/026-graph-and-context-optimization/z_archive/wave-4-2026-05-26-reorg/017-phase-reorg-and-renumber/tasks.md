---
title: "Tasks: 026 Wave-4 Phase Reorg & Renumber"
description: "Task list for the wave-4 reorganization, derived from the packet scope. Completion status was not recorded at the time."
trigger_phrases:
  - "026 wave-4 reorg tasks"
  - "026 renumber task list"
  - "026 close reorganization checklist"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

# Tasks: 026 Wave-4 Phase Reorg & Renumber

<!-- ANCHOR:phase-1 -->
## Phase 1: Preflight

- [ ] T001 Capture preflight baselines (ref counts, JSON parse, strict validate) into `scratch/baselines/`
- [ ] T002 Author the move contract `scratch/rename-plan.json` (46 disjoint, naming-clean moves)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Execution

- [ ] T003 Execute the dependency-ordered moves: renames, 005-children regroup, top-level nests, 004 split and archive
- [ ] T004 Regenerate every `graph-metadata.json` / `description.json` under 026 and fix the `status:"planned"` drift
- [ ] T005 Rewrite the root `026/spec.md` to the compliant Phase Documentation Map
- [ ] T006 Create `026/context-index.md` with the old-to-new migration bridge for all waves
- [ ] T007 Mark unfinished phases (004-children, 012, 015) `deferred`/`abandoned` in place
- [ ] T008 Archive leftover `scratch/` working files and the dissolved 004 shell
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Run `validate.sh 026 --strict --recursive` and compare against the captured baseline
- [ ] T010 Reindex and re-embed memory across the 4 vector DBs; verify `memory_search` resolves the new paths
<!-- /ANCHOR:phase-3 -->
