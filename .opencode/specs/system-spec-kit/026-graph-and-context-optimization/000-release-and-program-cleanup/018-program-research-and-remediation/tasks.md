---
title: "Tasks: 026 Program Research and Remediation [system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/018-program-research-and-remediation/tasks]"
description: "Task breakdown for the 026 program research (50 angles, 3 models) and the four verified code fixes it drove."
trigger_phrases:
  - "026 program research tasks"
  - "research remediation tasks"
importance_tier: "normal"
contextType: "tasks"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/018-program-research-and-remediation"
    last_updated_at: "2026-06-06T10:30:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Recorded research + remediation task breakdown"
    next_safe_action: "Run the measurement experiments in research/measurement-backlog.md"
    blockers: []
    key_files:
      - "tasks.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Tasks: 026 Program Research and Remediation

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- `[x]` complete, `[ ]` pending.
- `[P*]` priority: P0 blocker, P1 required.
- Each task names its verification.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T1 [P0] Generate 50 falsifiable research angles across the 8 026 tracks + runtime/process themes.
- [x] T2 [P0] Confirm the three executors (MiMo / DeepSeek / MiniMax-M3) configured + smoke-tested.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T3 [P0] Run the three-model parallel-lane deep research (10 dispatches, all 50 angles).
- [x] T4 [P0] Synthesize cross-model findings into research/research.md + the measurement backlog.
- [x] T5 [P0] Land the 4 verified code fixes (causal cache, MiniMax variant, launcher fixture, depthTruncated).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T6 [P0] Per-fix build + targeted suites green (293 causal, 35 playbook, 35+15 code-graph, launcher un-skip).
- [x] T7 [P1] Activate dists at runtime (mk-spec-memory recycle, code-graph reconnect).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

Research synthesized, four fixes shipped + live, measurement experiments tracked in research/measurement-backlog.md and handover.md.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Research synthesis: `research/research.md`; angles: `research/research-angles.md`; per-model notes: `research/iterations/D1..D10.md`.
- Remaining work: `handover.md` + `research/measurement-backlog.md`.
<!-- /ANCHOR:cross-refs -->
