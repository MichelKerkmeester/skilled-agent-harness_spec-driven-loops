---
title: "Tasks: Novel Freshness Decay Auto-Refresh Queue [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "freshness decay queue"
  - "fsrs retrievability"
  - "auto-refresh queue"
  - "staleness maintenance queue"
  - "report-only freshness"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/003-spec-data-quality/004-novel-research/006-novel-freshness-decay-queue"
    last_updated_at: "2026-06-27T17:15:39.015Z"
    last_updated_by: "markdown-agent"
    recent_action: "Mirrored benchmark and flag-off proof as T013 and T014"
    next_safe_action: "Hold for implementation, no task has started yet"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Novel Freshness Decay Auto-Refresh Queue

<!-- SPECKIT_LEVEL: 2 -->
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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 [B] Confirm 026-shared-safe-fix-engine has landed the registry and the frozen safe allow-list
- [ ] T002 [B] Confirm 011-scheduled-dq-sweep has landed the report-mode fan-out the queue rows surface through
- [ ] T003 Confirm computeMemoryState is callable read-only as the retrievability input (.opencode/skills/system-spec-kit/mcp_server/lib/scoring/tier-classifier.ts)
- [ ] T004 [P] Stand up a fixture corpus with a pinned memory, a fresh memory and a memory decayed below the COLD edge
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Read the shipped retrievability per memory and own no decay math (.opencode/skills/system-spec-kit/scripts/detectors/freshness-decay.ts)
- [ ] T006 Compare against the COLD to DORMANT threshold and emit one report-only refresh_queue row per sub-threshold memory (.opencode/skills/system-spec-kit/scripts/detectors/freshness-decay.ts)
- [ ] T007 Build the refresh_queue table and accessor mirrored on the learned_feedback_audit age and TTL governance (.opencode/skills/system-spec-kit/mcp_server/lib/storage/refresh-queue.ts)
- [ ] T008 Register the detector with fixClass none so no apply path exists (.opencode/skills/system-spec-kit/scripts/detectors/detector-registry.ts)
- [ ] T009 Fold the detector into the B1 report behind a default-off flag (.opencode/skills/system-spec-kit/scripts/sweep/dq-sweep.ts)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 The detector output equals the value computeMemoryState returns byte for byte and an apply run leaves the git working tree clean
- [ ] T011 A sub-threshold fixture emits one refresh_queue row and zero body writes, plus edge cases (pinned memory at 1.0 never queued, no last_reviewed clamps to fresh, already-queued doc deduped by TTL, accessor unavailable emits zero rows, missing queue table aborts before emit)
- [ ] T012 Update documentation (spec/plan/tasks/checklist)
- [ ] T013 Benchmark: assert planted-decay catch-rate equals 1.0 and swap-precision equals 1.0 on the fixture corpus, the first flag-on live run surfaces at least one genuinely decayed doc and an apply run yields a clean git diff. Detector-class metric, not recall, since the queue emits findings not vector rows (.opencode/skills/system-spec-kit/mcp_server/tests/freshness-decay.vitest.ts)
- [ ] T014 Default-off proof: with SPECKIT_FRESHNESS_DECAY_QUEUE unset the detector emits zero rows and the sweep output is byte-identical to the pre-detector baseline, mirroring the ALL_SPECKIT_FLAGS and FLAG_CHECKERS pattern, reversible via SPECKIT_FRESHNESS_DECAY_QUEUE=false (.opencode/skills/system-spec-kit/mcp_server/tests/freshness-decay.vitest.ts)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
