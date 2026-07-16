---
title: "Tasks: Retrieval Floor Experiment [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "retrieval floor experiment"
  - "raise the retrieval floor"
  - "default min results"
  - "truncation law measurement"
  - "tail signal or noise"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/002-spec-data-quality/005-shared-engine-and-research/027-retrieval-floor-experiment"
    last_updated_at: "2026-07-04T17:12:04.022Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored phase task breakdown for retrieval floor experiment scaffold"
    next_safe_action: "Hold for 015-c2 recall gate before this phase runs"
    blockers:
      - "Depends on 015-prodmode-recall-gate which must ship the prod-mode completeRecall@3 instrument first"
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-floor-experiment.mjs"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-truncation.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-eval-v2.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Retrieval Floor Experiment

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

- [ ] T001 Confirm the C2 prod lens and the measurability classes are reachable through the C2 export without touching the lens bodies (`.opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-eval-v2.mjs`)
- [ ] T002 Confirm the stored C2 baseline records the prod-column completeRecall@3 to compare against (`.opencode/skills/system-spec-kit/mcp_server/scripts/evals/spec-recall-baseline.json`)
- [ ] T003 [P] Fix the floor settings to sweep above 3 and the matching token budget per setting
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add the default-off `SPECKIT_FLOOR_OVERRIDE` env read for `DEFAULT_MIN_RESULTS` and the token budget so the on-disk default stays 3 (`.opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-truncation.ts`)
- [ ] T005 Build the sweep driver to set the override per setting, run the C2 prod lens and read only the prod completeRecall@3 column against the C2 baseline (`.opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-floor-experiment.mjs`)
- [ ] T006 Refuse an eval-lens input and fail closed when the env override is set but the floor did not move (`.opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-floor-experiment.mjs`)
- [ ] T007 Write the report with the pre-stated threshold, the per-setting prod-column deltas and the one signal-or-noise verdict (`.opencode/specs/system-speckit/029-memory-search-intelligence/002-spec-data-quality/005-shared-engine-and-research/027-retrieval-floor-experiment/floor-experiment-report.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Confirm a no-flag run uses the 3-floor and a diff shows the literal 3 at `confidence-truncation.ts:35` unchanged
- [ ] T009 Confirm the driver refuses an eval-lens input, fails closed on an unmoved floor and the report names the Tier-C items to re-evaluate on signal or records the 3-floor confirmation on noise
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

---
