---
title: "Tasks: Shared Safe-Fix Engine [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "shared safe-fix engine"
  - "detector registry"
  - "fixClass allow-list"
  - "dq-engine runDetectors"
  - "content_hash idempotency"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/003-spec-data-quality/005-shared-engine-and-research/001-shared-safe-fix-engine"
    last_updated_at: "2026-06-27T17:15:39.553Z"
    last_updated_by: "markdown-agent"
    recent_action: "Added the deep-review F001 import-boundary gate tasks and renumbered the task list"
    next_safe_action: "Build the engine per the resolved import route once implementation begins"
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
# Tasks: Shared Safe-Fix Engine

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

- [ ] T001 Add computeMemoryQualityScore to the mcp_server/api public barrel and import it in dq-engine.ts via @spec-kit/mcp-server/api, directory settled at scripts/dq/ (.opencode/skills/system-spec-kit/mcp_server/api/index.ts)
- [ ] T002 Confirm the shipped scorers are importable, computeMemoryQualityScore through the public barrel (mcp_server/handlers/quality-loop.ts:392,747) and reviewPostSaveQuality by a direct intra-scripts import (scripts/core/post-save-review.ts:573)
- [ ] T003 Verify the dq-engine.ts import of computeMemoryQualityScore passes check-no-mcp-lib-imports (.opencode/skills/system-spec-kit/scripts/evals/check-no-mcp-lib-imports.ts)
- [ ] T004 [P] Stand up a dirty scratch fixture with a mixed safe, risky and none defect set
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Build the single-source-of-truth registry with per-detector {id, surface, detect, fixClass, fix}, deny-by-default (.opencode/skills/system-spec-kit/scripts/dq/detector-registry.ts)
- [ ] T006 Seed the frozen safe-class allow-list (desc.shape, enum.tier_status_ctype, triggers.propagate, hvr.style, anchor.unclosed) (.opencode/skills/system-spec-kit/scripts/dq/detector-registry.ts)
- [ ] T007 Build the pure runDetectors returning {issues, applied, skipped}, report mode writes nothing (.opencode/skills/system-spec-kit/scripts/dq/dq-engine.ts)
- [ ] T008 Add the apply path running fix() only for opts.allowFixClass detectors behind content_hash idempotency and atomic writes (.opencode/skills/system-spec-kit/scripts/dq/dq-engine.ts)
- [ ] T009 Encode INV-1 and INV-2 as registry-declaration checks (fixClass against a declared touchesBody flag, not a runtime proof) and make the allow-list edit a guarded-class change that re-checks them under review (.opencode/skills/system-spec-kit/scripts/dq/detector-registry.ts)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Report run over a dirty fixture returns populated issues, an empty applied set and a clean working tree
- [ ] T011 Apply run with allowFixClass ['safe'] mutates only safe targets and records risky and none in skipped, plus edge cases (unrecognized surface, empty allowFixClass, detect throw, fix throw, scorer signature drift)
- [ ] T012 Run check-no-mcp-lib-imports against the new scripts/dq/ files and confirm zero violations (.opencode/skills/system-spec-kit/scripts/evals/check-no-mcp-lib-imports.ts)
- [ ] T013 Update documentation (spec/plan/tasks/checklist)
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
