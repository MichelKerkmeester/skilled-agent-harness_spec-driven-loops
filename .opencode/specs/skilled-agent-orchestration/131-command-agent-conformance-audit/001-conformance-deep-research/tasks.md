---
title: "Tasks: Phase 1: Conformance Deep-Research"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "conformance deep research tasks"
  - "001-conformance-deep-research tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/131-command-agent-conformance-audit/001-conformance-deep-research"
    last_updated_at: "2026-07-11T08:49:19Z"
    last_updated_by: "fable-5"
    recent_action: "Marked all 10 runbook tasks complete after synthesis"
    next_safe_action: "Phase complete; findings consumed by phases 002-006"
    blockers: []
    key_files:
      - ".opencode/specs/skilled-agent-orchestration/131-command-agent-conformance-audit/001-conformance-deep-research/research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "conformance-audit-132"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1: Conformance Deep-Research

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

- [x] T001 Seed `research/deep-research-config.json` and `research/deep-research-strategy.md` for Batch 1
- [x] T002 Smoke-test GPT-5.6-Sol-Fast (high) dispatch, confirm `--variant` honored, before committing Batch 1
- [x] T003 Confirm `--spec-folder` and `topic` fields will stay byte-identical across all 3 batches
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Run Batch 1 (iters 1-5, GPT-5.6-Sol-Fast high): commands + doctor recon — evidence: `research/iterations/iteration-001.md` through `iteration-005.md`
- [x] T005 Edit config only for Batch 2 (Sonnet-5 xhigh, maxIterations/minIterations=10); smoke-test the provider first — evidence: `research/deep-research-state.jsonl` batch-2 `executor_rotation` event
- [x] T006 Run Batch 2 (iters 6-10, Sonnet-5 xhigh): agent surface + deeper cross-surface pass — evidence: `research/iterations/iteration-006.md` through `iteration-010.md`
- [x] T007 Edit config only for Batch 3 (GLM-5.2 max, maxIterations/minIterations=15); smoke-test the provider first — evidence: `research/deep-research-state.jsonl` batch-3 `executor_rotation` event
- [x] T008 Run Batch 3 (iters 11-15, GLM-5.2 max): direct `/doctor` execution re-verification + frontmatter deep-dive
- [x] T009 Confirm and expand all six seed findings across the three batches — evidence: `research/research.md` findings CMD-01 through XS-03
- [x] T010 Author `research.md`: 30 findings (5 P0 / 9 P1 / 16 P2), partitioned by surface, each with file:line + fix
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Confirm iteration coverage: 15 `iterations/*.md` + 15 `deltas/*.jsonl` files on disk for all 15 iterations
- [x] T012 Cross-check every `research.md` finding against its cited iteration narrative
- [x] T013 Confirm the false-positive guard: known-LIVE `codex` tokens in `deep-improvement.md`/`prompt-improver.md`/`orchestrate.md` are explicitly excluded
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] `research.md` cross-checked against all 15 iteration narratives
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Deliverable**: See `research/research.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
