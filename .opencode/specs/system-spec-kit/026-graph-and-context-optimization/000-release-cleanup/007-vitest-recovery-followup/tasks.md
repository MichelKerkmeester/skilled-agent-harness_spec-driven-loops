---
title: "Tasks: Vitest baseline recovery followup [template:level_1/tasks.md]"
description: "Task list for the 196-failure followup packet."
trigger_phrases:
  - "vitest recovery followup tasks"
  - "026/000/007 tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/007-vitest-recovery-followup"
    last_updated_at: "2026-05-09T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Tasks authored alongside placeholder plan"
    next_safe_action: "Execute T001 to enumerate"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "vitest-recovery-followup-placeholder-2026-05-09"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Vitest baseline recovery followup

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Enumerate followup-tagged tests: `grep -rn 'followup: 026/000/007-vitest-recovery-followup' .opencode/skills/system-spec-kit/mcp_server/`. Capture to `scratch/inventory.json`.
- [ ] T002 Cluster by parent directory; produce a count-per-cluster summary.
- [ ] T003 Decide in-packet fix vs per-surface child packet for each cluster.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 [P] Tackle skill_advisor/tests/scorer/ cluster (largest, single-root-cause expected).
- [ ] T005 [P] Tackle tests/hooks/ cluster (cross-runtime payload schemas).
- [ ] T006 [P] Tackle tests/scaffold/ cluster (manifest-driven template drift).
- [ ] T007 [P] Tackle tests/alignment/ cluster (workflow-invariance allowlist).
- [ ] T008 [P] Tackle tests/code-graph/ cluster (post-parser_skip_list drift).
- [ ] T009 Tackle the residual "other" cluster.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Confirm `grep -rn 'followup: 026/000/007-vitest-recovery-followup'` returns 0 hits.
- [ ] T011 `pnpm vitest run` reports 0 NEW failures vs the 11,612/196 post-Unit-F baseline.
- [ ] T012 Update v3.4.1.0 changelog row "Core test suites" with the post-recovery numbers.
- [ ] T013 `validate.sh --strict` on this packet and every child packet.
- [ ] T014 Author implementation-summary.md.
- [ ] T015 Update description.json + graph-metadata.json to status: complete.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] Zero `// followup: 026/000/007-vitest-recovery-followup` annotations remain across the test tree.
- [ ] `pnpm vitest run` reports zero NEW failures vs the post-Unit-F baseline (11,612 passing / 196 failing / 35 skipped).
- [ ] v3.4.1.0 changelog row "Core test suites" updated to reflect the post-recovery numbers.
- [ ] `validate.sh --strict` exits 0 on this packet and any per-surface child packets created during Phase 2.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Predecessor**: `../006-vitest-baseline-recovery/` (the packet that escalated 196 failures here).
- **Inventory source**: `../006-vitest-baseline-recovery/scratch/triage-inventory.json`.
- **Drift attribution pattern**: `// drift: <packet>` comments per `../006-vitest-baseline-recovery/changelog.md`.
- **v3.4.1.0 changelog row**: `.opencode/skills/system-spec-kit/changelog/v3.4.1.0.md` "Core test suites (vitest)" verification row.
<!-- /ANCHOR:cross-refs -->
