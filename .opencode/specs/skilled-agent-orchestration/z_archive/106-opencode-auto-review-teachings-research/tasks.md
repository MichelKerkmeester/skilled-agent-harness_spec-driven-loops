---
title: "Tasks: 106 Upstream auto-review research"
description: "Atomic task ledger for the 20-iteration upstream auto-review research campaign. Tracks scaffold setup, per-iteration dispatch, and post-loop synthesis."
trigger_phrases:
  - "106 tasks"
  - "upstream auto-review tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/106-opencode-auto-review-teachings-research"
    last_updated_at: "2026-05-16T06:00:00Z"
    last_updated_by: "claude-opus-4-7-106-scaffold"
    recent_action: "authored_task_ledger_for_106"
    next_safe_action: "dispatch_iteration_001"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-16-106-tasks"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: 106 Upstream auto-review research

<!-- SPECKIT_LEVEL: 1 -->

---

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

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Scaffold packet directory + Level 1 spec docs
- [x] T002 Author 20 iteration prompts in `research/prompts/`
- [x] T003 Initialize `research/deep-research-state.jsonl` with campaign_start event
- [ ] T004 Run generate-context.js to create `description.json` + `graph-metadata.json`
- [ ] T005 Strict validate (Level 1) exit 0
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T006 Dispatch iter 001 (pin upstream commit SHA + read README.md)
- [ ] T007 Dispatch iters 002-006 (file reads: example.json, auto-review.ts ×3, index.ts + package.json + tsconfig.json)
- [ ] T008 Dispatch iters 007-015 (mechanism extractions: event loop, model selection, markers, boundary, prompt, config, logging, child sessions, cost)
- [ ] T009 Dispatch iters 016-018 (gap analysis vs sk-code-review, deep-*, plugins)
- [ ] T010 Dispatch iter 019 (ranked teaching list + reject list)
- [ ] T011 Dispatch iter 020 (final adjudication + author research/review-report.md)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T012 Main-agent synthesis fallback if iter 020 produced abbreviated stdout (per 015 pattern)
- [ ] T013 Update `implementation-summary.md` with actual results
- [ ] T014 Run generate-context.js canonical save
- [ ] T015 Strict validate exit 0
- [ ] T016 Commit + push to main
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All 20 iter outputs present in `research/iterations/` (each ≥ 20 lines)
- [ ] `research/review-report.md` exists ≥ 200 lines with all 10 sections
- [ ] Executive verdict label assigned (TEACHINGS-AVAILABLE / NEEDS-FURTHER-INVESTIGATION / NO-NOVEL-PATTERNS)
- [ ] ≥ 3 HIGH-impact teachings ranked with file:line implementation paths
- [ ] ≥ 1 reject-list entry documented
- [ ] State JSONL has ≥ 21 entries (campaign_start + 20 iter events)
- [ ] Strict validate Level 1 exit 0
- [ ] Memory save via generate-context.js
- [ ] Commit + push to main
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- `spec.md` — requirements + iteration plan
- `plan.md` — dispatch architecture + phase plan
- `implementation-summary.md` — post-synthesis fill target
- `research/prompts/iteration-{001..020}.md` — dispatch-ready prompts
- `research/review-report.md` — final synthesis target
- Pattern reference: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/015-tanstack-security-audit/` (proven 25-iter workflow)
<!-- /ANCHOR:cross-refs -->
