---
title: "Tasks: Search-Quality Fixes [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "search quality fixes tasks"
  - "evidence gap cap task"
  - "deterministic ranking task"
  - "029 findings remediation tasks"
  - "memory search fix tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/002-spec-data-quality/006-generated-metadata-build/041-search-quality-fixes"
    last_updated_at: "2026-07-04T17:11:55.938Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored the fix task list from the 029 plan"
    next_safe_action: "Mark tasks done as each fix lands"
    blockers: []
    key_files:
      - "mcp_server/handlers/memory-search.ts"
      - "mcp_server/lib/search/search-flags.ts"
      - "029-vague-query-model-benchmark/scripts/extract-metrics.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-23-041-search-quality-fixes"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Search-Quality Fixes

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

- [x] T001 Bridge `stage4.evidenceGapDetected` into `extraData.evidenceGap` to activate the graduated cap, Fix 1 keystone (`mcp_server/handlers/memory-search.ts`)
- [x] T002 Verify the recovery-classification blast radius, `classifyStatus` returns `partial` only on a true gap (`mcp_server/lib/recovery/recovery-payload.ts`)
- [x] T003 Add a separate `retrievalProfileWeightsEnabled` status, stop overloading `intent.weightsApplied`, Fix 3 (`mcp_server/handlers/memory-search.ts`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Surface the resolved `score` on graph and degree rows via `resolveCompositeScore`, additive to similarity, Fix 4 (`mcp_server/formatters/search-results.ts`)
- [x] T005 Add the default-off `SPECKIT_DETERMINISTIC_RANKING` flag, gate the wall-clock inputs, add the trigger id tie-break, Fix 5 (`mcp_server/lib/search/search-flags.ts`, `hybrid-search.ts`, `pipeline/stage2-fusion.ts`)
- [x] T006 Make `citeCorrect` three-tier-aware with valid-set membership, Fix 2 (`029-vague-query-model-benchmark/scripts/extract-metrics.mjs`)
- [x] T007 Tighten the presentation contract so the count equals rows shown and a long path renders the leaf title, Fix 6 (`.opencode/commands/memory/assets/search_presentation.txt`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Run the focused vitests, rebuild dist with `npm run build`, recycle the daemon so the re-run exercises the live fixes
- [x] T009 Fast-subset benchmark re-run over three open-source models, confirm 6 of 6 off-corpus cells cap to weak or gap and 0 `good`-beside-banner contradictions, down from 19 of 144 (`029-vague-query-model-benchmark/scripts/`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Keystone proven live by the fast-subset re-run
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
