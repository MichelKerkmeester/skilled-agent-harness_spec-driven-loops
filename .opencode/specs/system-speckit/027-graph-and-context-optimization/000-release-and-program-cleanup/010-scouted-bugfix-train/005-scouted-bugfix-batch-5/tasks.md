---
title: "Task Breakdown: Scouted Bugfix Batch 5"
description: "Task list for the verify-first round-3 tail: 4 targets re-confirmed by a gpt-5.5-fast confirm pass; 1 deduped (already shipped via 130/014); 3 confirmed fixes implemented with regression tests."
trigger_phrases:
  - "scouted bugfix batch 5 tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/000-release-and-program-cleanup/010-scouted-bugfix-train/005-scouted-bugfix-batch-5"
    last_updated_at: "2026-06-03T11:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "All confirm + implement tasks complete; 3 fixes verified; 1 deduped"
    next_safe_action: "Metadata + validate + reconcile"
    blockers: []
    key_files:
      - ".opencode/skills/deep-improvement/scripts/model-benchmark/scorer/grader/prompts/system-grader-task-outcome.md"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/resume/resume-ladder.ts"
      - ".opencode/skills/system-spec-kit/scripts/memory/generate-context.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scouted-bugfix-batch-5-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Task Breakdown: Scouted Bugfix Batch 5

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

**Task Format**: `T### Description — evidence`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T-01 Carry over the 4 round-3-tail candidates originally classified unconfirmed
- [x] T-02 [P] Run a gpt-5.5-fast confirm pass over all 4 against the real code
- [x] T-03 Classify: 4 CONFIRMED; 1 deduped (cli-devin phantom-permission-rows already shipped via `130/014`)
- [x] T-04 Document the dedup rationale for the cli-devin target — already landed via parallel `130/014`; not re-edited
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-05 [P] Run 3 disjoint-file implement agents on the confirmed defects
- [x] T-06 Fix (d4-r-grader-dim-id, P1): change the D4-R system prompt in `system-grader-task-outcome.md` from `"dim_id": "D4R"` to `"dim_id": "D4-R"` so it matches the harness strict-equality against `'D4-R'`; this removes the silent 0.3 confidence cap + mismatch annotation on every real D4-R grade (the mock path injects the caller-supplied dimId, so the bug was invisible in tests); regression test passes
- [x] T-07 Fix (handover-freshness-timestamp, P1): in `resume-ladder.ts` `parseHandoverSignal()`, extract frontmatter once and add an `updated` top-level alias plus a `last_updated_at`-under-`_memory.continuity` fallback so live handovers no longer drop to the unreliable mtime fallback; regression tests pass in `resume-ladder.vitest.ts` (9 pre-existing + 2 new = 11/11)
- [x] T-08 Fix (phase-parent-pointer-zod, P1): in `generate-context.ts`, make `updatePhaseParentPointer` parse the on-disk graph-metadata file with `graphMetadataSchema` (Zod) before mutating and construct a typed `GraphMetadata` value, so malformed timestamps / empty `last_active_child_id` are rejected instead of silently persisted; regression test passes in `phase-parent-pointer.vitest.ts` (via `tsx`; vitest segfaults on Node v25 in this env)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-09 Each of the 3 fixes has an added or updated regression test that passes
- [x] T-10 Verify P1 fixes: D4-R grade returns `"dim_id": "D4-R"` (no cap/annotation); handover freshness reads `updated` / `last_updated_at` (top-level + continuity); phase-parent pointer mutation is Zod-validated
- [x] T-11 Comment-hygiene clean: no spec-path / packet-id tracking artifacts introduced into any edited source file
- [x] T-12 Typecheck/build: system-spec-kit resume-ladder + generate-context typecheck clean
- [x] T-13 Orchestrator reviewed every diff; confirmed typecheck + tests; 3 agents touched disjoint file sets; cli-devin target deduped (not re-edited)
- [x] T-14 description.json + graph-metadata.json
- [x] T-15 validate.sh --strict → 0
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All confirm + implement tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] 3 fixes applied; each stack-verified; 1 target deduped
- [x] Ship tasks (metadata, validate) complete
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
