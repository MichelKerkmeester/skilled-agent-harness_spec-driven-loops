---
title: "Tasks: 056 deep-research realignment"
description: "Task tracker for 5-phase 056 work."
trigger_phrases:
  - "056 tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/054-root-readme-deep-research"
    last_updated_at: "2026-05-15T13:35:00Z"
    last_updated_by: "main_agent"
    recent_action: "Created task list"
    next_safe_action: "T003 compose iter template"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:42554f3ebb8507d2a5a5e5011653a093fab04d0476644e1dd407eab9edd30616"
      session_id: "056-tasks"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: 056 deep-research realignment

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

- [x] T001 Create packet skeleton (7 files + assets + research + scratch)
- [ ] T002 Compose `assets/iter-template.md` via sk-prompt (STAR/RCAF/BUILD + CLEAR 5-check + pre-planning)
- [ ] T003 Compose `research/track-seeds.md` (7 thematic tracks, initial RQs)
- [ ] T004 Strict-validate packet PASS
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

### 20 cli-devin SWE 1.6 iterations across 7 tracks (sequential, commit each)

- [ ] T005 Track 1 iter 1: counts and inventories (tools surface)
- [ ] T006 Track 1 iter 2: agents/skills/commands counts
- [ ] T007 Track 1 iter 3: MCP server inventory
- [ ] T008 Track 2 iter 1: MCP server names + versions
- [ ] T009 Track 2 iter 2: file paths + env vars
- [ ] T010 Track 2 iter 3: install steps
- [ ] T011 Track 3 iter 1: banned HVR words scan
- [ ] T012 Track 3 iter 2: em dashes + semicolons + oxford commas
- [ ] T013 Track 3 iter 3: hard-blocker phrases scan
- [ ] T014 Track 4 iter 1: native MCP topology diagram
- [ ] T015 Track 4 iter 2: agent network diagram
- [ ] T016 Track 4 iter 3: runtime arrows + extraction boundaries
- [ ] T017 Track 5 iter 1: NOTICE files + fork links
- [ ] T018 Track 5 iter 2: doc version + framework metric
- [ ] T019 Track 5 iter 3: Apache 2.0 references
- [ ] T020 Track 6 iter 1: FAQ Q&A accuracy
- [ ] T021 Track 6 iter 2: Quick Start install-step usability
- [ ] T022 Track 6 iter 3: bin paths + .env example
- [ ] T023 Track 7 iter 1: Copilot support + hook coverage claims
- [ ] T024 Track 7 iter 2: 5-runtime mirroring + residual catch-all

### Synthesis

- [ ] T025 Compose synthesis prompt at `/tmp/devin-056-synth.md`
- [ ] T026 Dispatch synthesis pass; write `research/research.md` + `research/delta-verified.md`
- [ ] T027 Verify delta shape (each EDIT has FROM/TO/REASON + iter citation)

### Rewrite

- [ ] T028 Compose Task-tool sonnet @markdown prompt
- [ ] T029 Dispatch sonnet @markdown rewrite of ./README.md
- [ ] T030 Verify `./README.md` edited + `research/edit-evidence.md` written

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [ ] T031 `validate_document.py ./README.md --type readme --json` returns hvr_score >= 85
- [ ] T032 Strict-validate packet PASS
- [ ] T033 Sonnet @markdown + @review parallel double-check Task dispatches
- [ ] T034 Patch any P0 findings
- [ ] T035 Backfill implementation-summary.md with actuals
- [ ] T036 Final commit on main

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks `[x]` or `[B]` with rationale
- [ ] 20 iter + synthesis + rewrite + verify shipped
- [ ] Single final commit on main
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Resource Map**: See `resource-map.md`
<!-- /ANCHOR:cross-refs -->
