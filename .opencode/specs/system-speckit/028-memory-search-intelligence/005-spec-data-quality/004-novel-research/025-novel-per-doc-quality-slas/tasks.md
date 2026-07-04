---
title: "Tasks: Per-Doc Quality SLAs [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path). PLANNED scaffold, no task started."
trigger_phrases:
  - "per doc quality sla tasks"
  - "sla task breakdown"
  - "report only ticket"
  - "sla evaluator"
  - "host queue dependency"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "028-memory-search-intelligence/005-spec-data-quality/004-novel-research/025-novel-per-doc-quality-slas"
    last_updated_at: "2026-06-27T17:15:39.283Z"
    last_updated_by: "benchmark-test-scaffold"
    recent_action: "Added benchmark and default-off proof tasks to verification"
    next_safe_action: "Build SLA evaluator once a host queue ships"
    blockers:
      - "Host queue (freshness decay queue or B3 refinement_queue) must exist before build"
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/quality/quality-loop.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/description/description-schema.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/pe-gating.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Per-Doc Quality SLAs

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

- [ ] T001 [B] Confirm a host queue (freshness decay queue or B3 `refinement_queue`) exists before build
- [ ] T002 Add the default-off flag that gates the evaluator (`.opencode/skills/system-spec-kit/mcp_server/lib/quality/quality-sla.ts`)
- [ ] T003 [P] Declare the additive SLA threshold field on the governance block (`.opencode/skills/system-spec-kit/mcp_server/lib/description/description-schema.ts`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Read the already-computed quality score and compare it to the declared threshold (`.opencode/skills/system-spec-kit/mcp_server/lib/quality/quality-sla.ts`)
- [ ] T005 File one report-only ticket for a below-threshold doc and dedup on doc identity (`.opencode/skills/system-spec-kit/mcp_server/lib/quality/sla-ticket.ts`)
- [ ] T006 Degrade to a no-op when no host queue is present and never create a queue (`.opencode/skills/system-spec-kit/mcp_server/lib/quality/sla-ticket.ts`)
- [ ] T007 Guard every entry behind the default-off flag and add no cost when unset (`.opencode/skills/system-spec-kit/mcp_server/lib/quality/quality-sla.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Test the threshold boundary, report-only output and default-off dormancy (`.opencode/skills/system-spec-kit/mcp_server/tests/quality-sla.vitest.ts`)
- [ ] T009 Test the no-host-queue no-op, the missing-score skip and the no-SLA doc skip (`.opencode/skills/system-spec-kit/mcp_server/tests/quality-sla.vitest.ts`)
- [ ] T011 Benchmark the detector at planted catch-rate 1.0 and swap-precision zero-false-positive over the fixture roster with exactly one report-only ticket per flagged doc, reproduced via `npx vitest run quality-sla.vitest.ts` (`.opencode/skills/system-spec-kit/mcp_server/tests/quality-sla.vitest.ts`)
- [ ] T012 Add `SPECKIT_QUALITY_SLA` to the `ALL_SPECKIT_FLAGS` roster and a `FLAG_CHECKERS` pair, asserting the checker returns false by default and the ceiling test stays green with the flag unset (`.opencode/skills/system-spec-kit/mcp_server/tests/flag-ceiling.vitest.ts`)
- [ ] T013 Prove runtime reversibility through `SPECKIT_QUALITY_SLA=false`, keeping the save and search responses byte-for-byte unchanged and the path dormant at zero cost (`.opencode/skills/system-spec-kit/mcp_server/tests/quality-sla.vitest.ts`)
- [ ] T010 Update spec, plan, tasks and checklist to the shipped state
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining (host queue confirmed present)
- [ ] Vitest suite and manual flag-off check passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
