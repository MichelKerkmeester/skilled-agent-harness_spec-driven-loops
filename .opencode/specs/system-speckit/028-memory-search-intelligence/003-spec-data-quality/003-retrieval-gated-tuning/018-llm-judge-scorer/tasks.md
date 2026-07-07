---
title: "Tasks: C5 LLM-as-judge quality scorer [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "llm judge quality scorer"
  - "c5 quality score multiplier"
  - "semantic quality score fusion"
  - "qualityscore better input"
  - "llm as judge memory quality"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/003-spec-data-quality/003-retrieval-gated-tuning/018-llm-judge-scorer"
    last_updated_at: "2026-07-04T17:11:51.250Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored phase task breakdown for C5 llm-judge scorer scaffold"
    next_safe_action: "Hold for implementation, no task has started yet"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: C5 LLM-as-judge quality scorer

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

- [ ] T001 Resolve the live write or index module that populates `quality_score` so the judge hooks the existing column at `vector-index-schema.ts:643` with no new column (`.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts`)
- [ ] T002 Choose the consumer flag name and wire it default-off next to the existing fusion config (`.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts`)
- [ ] T003 [P] Pick the judge model, prompt and the rubric-to-`[0,1]` mapping so the score is comparable to the form-only metric in the same band
- [ ] T004 Resolve whether the comparison harness reuses the existing eval corpus sample or stands a smaller scoring-only sample (`.opencode/skills/system-spec-kit/mcp_server/scripts/evals/`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Add the judge scorer on the write path computing a normalized `[0,1]` score, clamping it before persistence and writing the existing `quality_score` column (`.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts`)
- [ ] T006 Make the scorer read and score only, never mutating the authored body, with a `content_hash` cache that skips an unchanged document and a form-only fallback when the judge call fails or times out
- [ ] T007 Add the flag-gated input swap in `applyValidationSignalScoring` so `qualityScore` reads the judge value when on, leaving the `0.9 + (quality * 0.2)` band and the `0.5` form-only default unchanged when off (`.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts`)
- [ ] T008 Surface the judge score as a first-class quality signal in the sweep and doctor reports, independent of the consumer flag
- [ ] T009 Add the form-only-versus-judge comparison harness that scores a corpus sample both ways and reports agreement and divergence (`.opencode/skills/system-spec-kit/mcp_server/scripts/evals/`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Confirm that with the consumer flag off, prod-mode retrieval is byte-identical to baseline including the `0.5` form-only fallback and the `[0.9, 1.1]` band
- [ ] T011 Confirm a scorer unit test shows the judge value clamped to `[0,1]`, the authored body unchanged and an unchanged `content_hash` not re-scored
- [ ] T012 Confirm the comparison harness emits per-document form-only and judge scores plus an agreement and divergence readout, the evidence a reviewer reads before any promotion
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
