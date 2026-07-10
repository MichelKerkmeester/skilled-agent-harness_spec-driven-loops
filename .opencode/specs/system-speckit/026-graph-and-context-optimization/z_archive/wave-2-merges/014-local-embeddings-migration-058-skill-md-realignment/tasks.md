---
title: "Tasks: 058 SKILL.md + mcp_server READMEs + references realignment"
description: "Task tracker for 5-phase 058 work."
trigger_phrases:
  - "058 tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/z_archive/wave-2-merges/014-local-embeddings-migration-058-skill-md-realignment"
    last_updated_at: "2026-05-15T15:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Created task list"
    next_safe_action: "Compose iter template"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:61fb251a3aa778b5a56d34004424630dcd0d8578b60a082c8f39000c4e34f189"
      session_id: "058-tasks"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: 058 realignment

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[B]` | Blocked |

<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Scaffold packet
- [ ] T002 Compose assets/iter-template.md
- [ ] T003 Compose research/track-seeds.md (8 tracks)
- [ ] T004 Strict-validate PASS
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

### 20 iter across 8 tracks

- [ ] T005 Track 1 iter 1: system-spec-kit/SKILL.md drift survey
- [ ] T006 Track 1 iter 2: system-spec-kit/SKILL.md anchor coverage gap
- [ ] T007 Track 1 iter 3: system-spec-kit/SKILL.md content drift fix list
- [ ] T008 Track 2 iter 1: system-code-graph/SKILL.md drift survey
- [ ] T009 Track 2 iter 2: system-code-graph/SKILL.md anchor + content
- [ ] T010 Track 3 iter 1: system-skill-advisor/SKILL.md drift survey
- [ ] T011 Track 3 iter 2: system-skill-advisor/SKILL.md anchor + content + frontmatter
- [ ] T012 Track 4 iter 1: system-spec-kit/mcp_server/README.md sanity check
- [ ] T013 Track 5 iter 1: system-code-graph/mcp_server/README.md drift check
- [ ] T014 Track 6 iter 1: system-skill-advisor/mcp_server/README.md gap analysis
- [ ] T015 Track 6 iter 2: system-skill-advisor/mcp_server/README.md target scope
- [ ] T016 Track 6 iter 3: system-skill-advisor/mcp_server/README.md draft outline
- [ ] T017 Track 7 iter 1: skill-advisor/references/ existing audit
- [ ] T018 Track 7 iter 2: skill-advisor/references/ scorer + propagate spec
- [ ] T019 Track 7 iter 3: skill-advisor/references/ skill-graph-extraction-plan
- [ ] T020 Track 7 iter 4: skill-advisor/references/ tool-ids-reference
- [ ] T021 Track 8 iter 1: code-graph/references/ readiness-check spec
- [ ] T022 Track 8 iter 2: code-graph/references/ ownership-boundary spec
- [ ] T023 Track 8 iter 3: code-graph/references/ database-path-policy spec
- [ ] T024 Track 8 iter 4: code-graph/references/ residual gap finder

### Synthesis

- [ ] T025 Compose synthesis prompt
- [ ] T026 Dispatch synthesis cli-devin
- [ ] T027 Verify delta-verified.md shape

### Rewrite

- [ ] T028 Batch A: dispatch sonnet @markdown for 3 SKILL.md
- [ ] T029 Verify Batch A files; commit
- [ ] T030 Batch B: dispatch sonnet @markdown for 3 mcp_server READMEs
- [ ] T031 Verify Batch B files; commit
- [ ] T032 Batch C: dispatch sonnet @markdown for 7+ new references
- [ ] T033 Verify Batch C files; commit

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [ ] T034 sk-doc validate per modified/created file
- [ ] T035 audit_readmes.py over 3 system skills (0 blocking)
- [ ] T036 Strict-validate packet PASS
- [ ] T037 Sonnet @markdown + @review parallel final double-check
- [ ] T038 Patch any P0
- [ ] T039 Backfill implementation-summary.md
- [ ] T040 Final primary commit on main
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks `[x]` or `[B]`
- [ ] 20 iter + synthesis + 3 batches + verify shipped
- [ ] Single primary commit on main
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Resource Map**: See `resource-map.md`
<!-- /ANCHOR:cross-refs -->
