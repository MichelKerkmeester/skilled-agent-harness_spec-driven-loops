---
title: "Tasks: Novel Cross-Doc Contradiction and Staleness Detection [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "contradiction detection"
  - "staleness detection"
  - "cross-doc consistency"
  - "llm entailment scoring"
  - "candidate-pair gating"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/002-spec-data-quality/004-novel-research/019-novel-contradiction-detection"
    last_updated_at: "2026-06-27T17:15:37.645Z"
    last_updated_by: "benchmark-test-author"
    recent_action: "Added benchmark and test tasks"
    next_safe_action: "Build the detector after deps land"
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
# Tasks: Novel Cross-Doc Contradiction and Staleness Detection

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

- [ ] T001 [B] Confirm 026-shared-safe-fix-engine has landed the registry and the report channel
- [ ] T002 [B] Confirm 011-scheduled-dq-sweep has landed the report-mode fan-out the detector mounts on
- [ ] T003 Confirm the entity_catalog table and the causal graph are callable read-only (.opencode/skills/system-spec-kit/mcp_server/src/lib/extraction/entity-extractor.ts)
- [ ] T004 [P] Stand up a fixture corpus with a planted same-time conflict and a planted stale claim
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Build the candidate-pair generator gated by shared entity and causal edge, never all-pairs (.opencode/skills/system-spec-kit/scripts/sweep/detectors/contradiction.ts)
- [ ] T006 Build the LLM entailment scorer classifying a pair agree, contradict or stale with a confidence (.opencode/skills/system-spec-kit/scripts/sweep/detectors/contradiction.ts)
- [ ] T007 Emit a finding tagged with the pair, the verdict class and the confidence, never a vector row (.opencode/skills/system-spec-kit/scripts/sweep/detectors/contradiction.ts)
- [ ] T008 Register the detector with fixClass none (.opencode/skills/system-spec-kit/scripts/sweep/detector-registry.ts)
- [ ] T009 Fold the detector into report mode behind a default-off flag (.opencode/skills/system-spec-kit/scripts/sweep/dq-sweep.ts)
- [ ] T013 Author the named detector test file with the pair-gate bound, the verdict-to-finding fold, the planted catch-rate and the scorer-timeout-continue assertions, and register SPECKIT_CONTRADICTION_DETECTOR default-off in ALL_SPECKIT_FLAGS and FLAG_CHECKERS (.opencode/skills/system-spec-kit/scripts/tests/contradiction-detector.vitest.ts)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 A planted contradiction emits a finding and leaves the git working tree clean, the pair count stays bounded by adjacency
- [ ] T011 The stale fixture is tagged stale and the same-time conflict is tagged contradict, plus edge cases (no-entity doc skipped, self-pair filtered, scorer timeout errored and continued, empty catalog degrades to edges-only, deleted target skipped)
- [ ] T014 Benchmark the planted-mismatch catch-rate to 1.0 and the clean-control false-positive floor to 0 with the SPECKIT_CONTRADICTION_DETECTOR=true vitest reproduce command (.opencode/skills/system-spec-kit/scripts/tests/contradiction-detector.vitest.ts)
- [ ] T015 Prove default-off no-regress, a default run byte-identical to an explicit SPECKIT_CONTRADICTION_DETECTOR=false run plus the flag-ceiling proof (.opencode/skills/system-spec-kit/mcp_server/tests/flag-ceiling.vitest.ts)
- [ ] T012 Update documentation (spec/plan/tasks/checklist)
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
